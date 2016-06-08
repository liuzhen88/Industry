var debug = require('debug')('connect:mysql');

module.exports = function (session) {
    var Store = session.Store;

    function MySQLStore() {
    }

    MySQLStore.prototype.__proto__ = Store.prototype;

    MySQLStore.prototype.get = function (sid, cb) {
        this.db.query("SELECT session FROM sessions WHERE sid = ?", [sid], function (err, rows) {
            if (err) return cb(err);

            if (rows.length > 0) {
                cb(null, JSON.parse(rows[0].session));
            } else {
                cb(null, null);
            }
        });
    };

    MySQLStore.prototype.set = function (sid, sess, cb) {
        try {
            var jsess = JSON.stringify(sess);
        } catch (e) {
            return cb(e);
        }
        this.db.query("INSERT INTO sessions (sid, session) VALUES(?, ?) ON DUPLICATE KEY UPDATE session = ?", [sid, jsess, jsess],
            function (err, result) {
                cb(err);
            }
        );
    };

    MySQLStore.prototype.destroy = function (sid, cb) {
        this.db.query("DELETE FROM sessions WHERE sid = ?", [sid], function (err) {
            cb(err);
        });
    };

    //MySQLStore.prototype.touch = function (sid, sess, cb) {
    //    sess.cookie.expires = new Date(new Date().getTime() + sess.cookie.originalMaxAge);
    //    try {
    //        var jsess = JSON.stringify(sess);
    //    } catch (e) {
    //        return cb(e);
    //    }
    //
    //    this.db.query("UPDATE sessions SET session = ? WHERE sid = ?", [jsess, sid], function (err) {
    //        cb(err);
    //    });
    //};

    MySQLStore.prototype.clear = function (cb) {
        this.db.query("TRUNCATE TABLE sessions", function (err) {
            cb(err);
        });
    };

    return MySQLStore;
};
