var express = require('express');
var router = express.Router();
var service = require('../service/admin');


// render page
router.get("/home", function (req, res, next) {
    res.render("admin/user", {user: req.session.user, selected: "user"});
});

router.get("/form", function (req, res, next) {
    res.render("admin/form", {user: req.session.user, selected: "form"});
});

router.get("/perm", function (req, res, next) {
    res.render("admin/perm", {user: req.session.user, selected: "perm"});
});


// load list of objects
router.get("/listUsers", function (req, res, next) {
    service.listUsers(req, res, next);
});

// load find of objects
router.post("/findUsers", function (req, res, next) {
    service.findUsers(req, res, next);
});

router.post("/getUser", function (req, res, next) {
    service.getUser(req, res, next);
})

router.post("/forms", function (req, res, next) {
    service.forms(req, res, next);
});

router.post("/getForm", function (req, res, next) {
    if (!req.body.id) {
        return res.status(400).json({message: "缺少表单"});
    }
    service.getForm(req, res, next);
})

router.post("/getModuleFormByAlias", function (req, res, next) {
    if (!req.body.alias) {
        return res.status(400).json({message: "缺少表单"});
    }
    service.getModuleFormByAlias(req, res, next);
})

router.post("/createForm", function (req, res, next) {
    service.createForm(req, res, next);
})

router.post("/deleteForm", function (req, res, next) {
    service.deleteForm(req, res, next);
})

router.post("/updateForm", function (req, res, next) {
    service.updateForm(req, res, next);
})

router.get("/perms", function (req, res, next) {
    service.listPerms(req, res, next);
});

// load parameters
router.get("/enums", function (req, res, next) {
    service.listEnums(req, res, next);
});

// create
router.post("/user", function (req, res, next) {
    service.createUser(req, res, next);
});

router.post("/form", function (req, res, next) {
    if (!req.body.form) {
        return res.status(400).json({message: "缺少表单模版."});
    }
    service.selectForm(req, res, next);
});

router.post("/perm", function (req, res, next) {
    if (!req.body.userId) {
        return res.status(400).json({message: "缺少用户."});
    }
    if (!req.body.perms) {
        return res.status(400).json({message: "缺少授权的表单."});
    }
    service.createUserPerm(req, res, next);
});

router.post("/updateUser", function (req, res, next) {
    if (!req.body.id) {
        return res.status(400).json({message: "缺少用户."});
    }
    service.updateUser(req, res, next);
});

router.delete("/deleteUser", function (req, res, next) {
    if (!req.body.id) {
        return res.status(400).json({message: "缺少用户."});
    }
    service.deleteUser(req, res, next);
});

//内部表路由
router.get("/internalForm", function (req, res, next) {
    if (!req.query.subForm) {
        return res.status(400).json({message: "缺少子表单请求参数."});
    }
    res.render("admin/"+req.query.subForm,{user: req.session.user,selected:req.query.subForm})
});

router.get("/internalForm/list", function (req, res, next) {
    if (!req.query.subForm) {
        return res.status(400).json({message: "缺少子表单请求参数."});
    }
    if(req.query.subForm=="gdzzhysb"){
        service.searchGdzzhysb(req,res,next);
    }else{
        service.listInternalForm(req, res, next);
    }
});
router.post("/internalForm/get", function (req, res, next) {
    if (!req.query.subForm) {
        return res.status(400).json({message: "缺少子表单请求参数."});
    }
    service.getInternalForm(req, res, next);
});
router.post("/internalForm/create", function (req, res, next) {
    if (!req.query.subForm) {
        return res.status(400).json({message: "缺少子表单请求参数."});
    }
    service.createInternalForm(req, res, next);
});
router.post("/internalForm/update", function (req, res, next) {
    if (!req.query.subForm) {
        return res.status(400).json({message: "缺少子表单请求参数."});
    }
    service.updateInternalForm(req, res, next);
});
router.delete("/internalForm/del", function (req, res, next) {
    if (!req.query.subForm) {
        return res.status(400).json({message: "缺少子表单请求参数."});
    }
    service.delInternalForm(req, res, next);
});
router.get("/internalForm/findMaxPlies", function (req, res, next) {
    if (!req.query.subForm) {
        return res.status(400).json({message: "缺少子表单请求参数."});
    }
    service.findMaxPlies(req, res, next);
});

router.post('/internalForm/uploadGybzg', function (req, res, next) {
    service.uploadGybzg(req,res,next);
});
router.get('/internalForm/downloadGybzg', function (req, res, next) {
    service.downloadGybzg(req,res,next);
});

router.post('/internalForm/uploadGybjsx', function (req, res, next) {
    service.uploadGybjsx(req,res,next);
});
router.get('/internalForm/downloadGybjsx', function (req, res, next) {
    service.downloadGybjsx(req,res,next);
});
module.exports = router;