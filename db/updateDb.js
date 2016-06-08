var config = require(process.env['HOME'] + '/conf/inkanban-config.js');
var MongoClient = require('mongodb').MongoClient;
var updateData = require('./updateData');
var async = require("async");

MongoClient.connect(config.dbUrl, function (err, conn) {
    if (err) throw new Error("Cannot connect to database: " + config.dbUrl + ", " + err.message);
    console.log("Connected to database: " + config.dbUrl);

    var adminDb = conn.admin();
    adminDb.listDatabases(function (err, dbs) {
        if (err) return next(error(500, new Error("数据库访问错误"), "Cannot list databases"));

        dbs = dbs.databases.filter(function (db) {
            return db.name !== 'local' && db.name !== 'admin' && db.name !== 'meta_library';
        }).map(function (db) {
            return db.name;
        });
        processData(conn, dbs, function (err) {
            if (err) {
                console.log("ERROR", err);
            }
            conn.close();
        })
    });
});

/**
 * 根据updateData.js文件, 更新租户的数据库, 可以更新, 删除, 添加
 */
function processData(db, tenants, done) {

    runUpdates();

    function runUpdates() {
        console.log("start run update");
        async.eachSeries(updateData.updates, function (data, cb) {
            async.eachSeries(tenants, function (tenant, cb1) {
                var tenantDb = db.db(tenant, {noListener: true});

                tenantDb.collection(data.collection).updateMany(data.key, {$set: data.value}, function (err, result) {
                    if (err) return cb1(err);
                    console.log(tenant, "UPDATE", data.collection, data.key, result.modifiedCount);
                    cb1();
                });
            }, function (err) {
                if (err) return cb(err);

                if (data.collection === 'forms') {
                    var metaDb = db.db('meta_library', {noListener: true});
                    metaDb.collection(data.collection).updateMany(data.key, {$set: data.value}, function (err, result) {
                        if (err) return cb1(err);
                        console.log("meta_library UPDATE", data.collection, data.key, result.modifiedCount);
                        cb();
                    });
                } else {
                    cb();
                }
            });
        }, function (err) {
            if (err) return done(err);
            runInserts();
        });
    }

    function runInserts() {
        console.log("start run insert");
        async.eachSeries(updateData.inserts, function (data, cb) {
            async.eachSeries(tenants, function (tenant, cb1) {
                var tenantDb = db.db(tenant, {noListener: true});

                tenantDb.collection(data.collection).insertOne(data.value, function (err, result) {
                    if (err) return cb1(err);
                    console.log(tenant, "INSERT", data.collection, result.insertedCount);
                    cb1();
                });
            }, function (err) {
                if (err) return cb(err);

                if (data.collection === 'forms') {
                    var metaDb = db.db('meta_library', {noListener: true});
                    metaDb.collection(data.collection).insertOne(data.value, function (err, result) {
                        if (err) return cb1(err);
                        console.log("meta_library INSERT", data.collection, result.insertedCount);
                        cb();
                    });
                } else {
                    cb();
                }
            });
        }, function (err) {
            if (err) return done(err);
            runDeletes();
        });
    }

    function runDeletes() {
        console.log("start run delete");
        async.eachSeries(updateData.deletes, function (data, cb) {
            async.eachSeries(tenants, function (tenant, cb1) {
                var tenantDb = db.db(tenant, {noListener: true});

                tenantDb.collection(data.collection).deleteOne(data.key, function (err, result) {
                    if (err) return cb1(err);
                    console.log(tenant, "DELETE", data.collection, data.key, result.deletedCount);
                    cb1();
                });
            }, function (err) {
                if (err) return cb(err);

                if (data.collection === 'forms') {
                    var metaDb = db.db('meta_library', {noListener: true});
                    metaDb.collection(data.collection).deleteOne(data.key, function (err, result) {
                        if (err) return cb1(err);
                        console.log("meta_library DELETE", data.collection, data.key, result.deletedCount);
                        cb();
                    });
                } else {
                    cb();
                }
            });
        }, function (err) {
            done(err);
        });
    }
}