var error = require('../util/error');
var signature = require('cookie-signature');

module.exports = {
    login: function (req, res, next) {
        var isAdmin = (req.body.username === 'admin'), password = null;

        if (isAdmin) {
            password = req.body.password;
        }

        req.db.collection("users").findOne({
            username: new RegExp(req.body.username, "i"),
            password: password
        }, function (err, doc) {
            if (err) return next(error(500, err));

            if (!doc) {
                if (isAdmin) {
                    return res.status(401).json({message: "密码错误"});
                } else {
                    return res.status(401).json({message: "用户名不存在"});
                }
            }

            req.session.regenerate(function (err) {
                if (err) return next(error(500, err));
                req.session.user = {
                    id: doc._id,
                    username: doc.username,
                    name: doc.last_name + doc.first_name,
                    roles: doc.roles,
                    perms: doc.perms,
                    "org1":doc.org1
                };
                var signed = encodeURIComponent('s:' + signature.sign(req.session.id, req.sessionOptions.secret));
                var cookieValue = (req.sessionOptions.name || 'connect.sid') + '=' + signed;
                res.status(200).json({sessionId: cookieValue, perms: doc.perms || [], roles: doc.roles});
            });
        });
    }
};
