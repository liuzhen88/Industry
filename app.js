var express = require('express');
var http = require('http');
var config = require(process.env['HOME'] + '/conf/inkanban-config.js');
var path = require('path');
var fs = require('fs');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var debug = require('debug')('inkanban');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var db = require('./util/db');
var tenant = require('./util/tenant-select');
var routes = require('./routes/index');
var admin = require('./routes/admin');
var users = require('./routes/user');

init(startServer);

function init(next) {
    db.connect(config.dbUrl, function (err, conn) {
        if (err) next(err);
        next(null, conn);
    });
}

function startServer(err, dbConn) {
    if (err) throw new Error("Initialization failed. " + err);

    var app = express();
    var server = http.Server(app);
    var io = require('socket.io')(server);

    // view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');

    // uncomment after placing your favicon in /public
    //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

    var accessLogStream = fs.createWriteStream(__dirname + '/access.log', {flags: 'a'});
    app.use(logger('combined', {stream: accessLogStream}));

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));

    // db connection
    app.use(function (req, res, next) {
        req.db = dbConn;
        next();
    });

    // after tenant select, the tenant name in the url is removed
    app.use(tenant.forRequest);

    // modify response redirect to add /tenant back
    var response = express.response;
    var _redirect = response.redirect;
    response.redirect = function (url) {
        _redirect.call(this, this.tenantPath + url);
    };

    app.use(function(req, res, next) {
        // TODO: 暂时允许跨域名调用, 方便平板软件在浏览器中调试, 以后改为app之后可以去掉
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, AppSession");
        // END of TODO

        if (req.method === 'OPTIONS') {     // 如果是app, 应该也没有CORS preflight
            res.status(200).end();
        } else {
            if (req.header('AppSession')) {
                req.headers.cookie = req.header('AppSession');
            }
            next();
        }
    });

    // session management
    app.use((function () {
        var option = {
            secret: config.session.secret,
            store: new MongoStore({db: dbConn}),    // this will be overridden by each tenant db as below
            cookie: {
                maxAge: 604800000 // 7 days
            },
            resave: false,
            saveUninitialized: false
        };
        var func = session(option);
        return function (req, res, next) {
            // to pass main db to session store
            if (req.db) {
                option.store.db = req.db;
                option.store.collection = req.db.collection("sessions");
            }

            req.sessionOptions = option;
            func(req, res, next);
        };
    })());

    app.use('/', routes);

    app.use(function (req, res, next) {
        if (!req.session.user) {
            if (req.accepts(["html", "json"]) === "html") {
                res.redirect("/");
            } else {
                res.status(401).json({message: "会话已经结束，请重新登录。"});
            }
        } else {
            next();
        }
    });
    app.use('/user', users);
    app.use('/admin', admin);

    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // error handlers
    app.use(function (err, req, res, next) {
        debug("ERROR", err.debugMsg, err.stack);
        res.status(err.status || 500);
        if (req.accepts('json', 'html') === 'json') {
            res.json({message: err.status + ": " + err.message});
        } else {
            res.render('error', {
                message: err.status + ": " + err.message,
                error: {}
            });
        }
    });

    var port = process.env.PORT || 3000;
    server.listen(port);
    server.on('listening', function () {
        debug('inkanban server listening on port ' + port);
    });

    io.use(function(socket, next) {
        socket.db = dbConn;
        next();
    });

    io.use(tenant.forSocket);

    io.use((function () {
        // TODO: refactoring dup code
        var option = {
            secret: config.session.secret,
            store: new MongoStore({db: dbConn}),    // this will be overridden by each tenant db as below
            cookie: {
                maxAge: 604800000 // 7 days
            },
            resave: false,
            saveUninitialized: false
        };
        var func = session(option);
        return function (socket, next) {
            // to pass main db to session store
            if (socket.db) {
                option.store.db = socket.db;
                option.store.collection = socket.db.collection("sessions");
            }

            func(socket.client.request, socket.client.request.res, next);
        };
    })());

    io.on('connection', require("./service/event").eventCallback);

    io.on('error', function () {
        console.error("error");
        // TODO: disconnect?
    })
}