var error = require('./error');

// TODO: introduce a cache to avoid listDatabases each time
module.exports.forRequest = function (req, res, next) {
    console.log("tenant select for ", req.path);
    if (req.path === "/") {
        return res.status(200).render("index", {message: "欢迎使用inKanban!"});
    }
    var parts = req.path.split("/");
    if (parts.length < 2 || parts[1].trim().length === 0) {
        return next(error(404, new Error("找不到有效路径"), "invalid path, cannot find tenant label: " + req.path));
    }

    var tenant = parts[1];
    var adminDb = req.db.admin();
    // List all the available databases
    adminDb.listDatabases(function (err, dbs) {
        if (err) return next(error(500, new Error("数据库访问错误"), "Cannot list databases"));

        var found = false;
        for (var i = 0; i < dbs.databases.length; i++) {
            if (dbs.databases[i].name === tenant) {
                found = true;
                break;
            }
        }
        if (!found) {
            return next(error(500, new Error("数据库访问错误"), "non-existing tenant database: " + tenant));
        }

        req.db = req.db.db(tenant, {noListener: true});
        console.log("connected to tenant database: " + tenant);

        // rewrite URL to remove tenant
        req.url = req.url.substr(tenant.length + 1);
        if (req.url.lastIndexOf("/", 0) !== 0) {
            req.url += "/";
        }
        res.tenantPath = "/" + tenant;

        next();
    });
};

module.exports.forSocket = function (socket, next) {
    var tenant = socket.handshake.query.tenant;
    var adminDb = socket.db.admin();
    adminDb.listDatabases(function (err, dbs) {
        if (err) return next(error(500, new Error("数据库访问错误"), "Cannot list databases"));

        var found = false;
        for (var i = 0; i < dbs.databases.length; i++) {
            if (dbs.databases[i].name === tenant) {
                found = true;
                break;
            }
        }
        if (!found) {
            return next(error(500, new Error("数据库访问错误"), "non-existing tenant database(socket): " + tenant));
        }

        socket.db = socket.db.db(tenant, {noListener: true});
        console.log("connected to tenant database (socket): " + tenant);

        next();
    });
};