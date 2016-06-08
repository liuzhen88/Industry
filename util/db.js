var MongoClient = require('mongodb').MongoClient;

module.exports.connect = function (dbUrl, cb) {
    MongoClient.connect(dbUrl, function (err, conn) {
        if (err) cb(new Error("Cannot connect to database." + err));
        console.log("Connected to database successfully: " + conn.serverConfig.host + ", poolSize: " + conn.serverConfig.poolSize);
        cb(null, conn);
    });
};