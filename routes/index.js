var express = require('express');
var router = express.Router();
var service = require('../service/auth');
var enums = require('../util/enums');

router.get('/', function(req, res) {
    if (req.session.user) {
        var roles = req.session.user.roles;
        if (roles && roles.indexOf(enums.RoleEnum.ADMIN) !== -1) {
            res.redirect('/admin/home')
        } else {
            res.redirect('/user/home');
        }
    } else {
        res.redirect('/login');
    }
});

router.post('/login', function(req, res, next) {
    if (!req.body.username) {
        return res.status(401).json({message: "缺少用户名."});
    }
    if (req.body.username === 'admin' && !req.body.password) {
        return res.status(401).json({message: "缺少密码."});
    }

    service.login(req, res, next);
});

router.get('/login', function (req, res) {
    res.render("login");
});

router.post('/logout', function(req, res) {
    if (req.session.user) {
        req.session.destroy(function () {
            res.status(200).end();
        });
    } else {
        res.status(200).end();
    }
});

module.exports = router;