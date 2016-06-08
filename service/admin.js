var error = require('../util/error');
var formidable = require('formidable');
var xlsx = require("node-xlsx");
var uuid = require("node-uuid");
var util = require('util');
var fs = require('fs');
var ObjectID = require('mongodb').ObjectID;

module.exports = {
    listUsers: function (req, res, next) {
        var draw = Number(req.query.draw);
        var start = Number(req.query.start);
        var size = Number(req.query.length);
        var search = req.query.search.value;
        var reg = new RegExp(".*" + search + ".*");
        var filter = {'$or': [{last_name: reg}, {first_name: reg}, {username: reg}]};

        var order = req.query.order;
        var orderFilter = [];
        var columns = req.query.columns;
        if (order && order instanceof Array) {
            for (var index in order) {
                var colIndex = order[index].column
                var orderName = columns[colIndex].data;
                if (!orderName) continue;
                var orderVal = order[index].dir == "asc" ? 1 : -1;
                orderFilter.push(JSON.parse("{\"" + orderName + "\":" + orderVal + "}"));
            }
        }
        console.log(orderFilter)
        req.db.collection("users").find(filter).toArray(function (err, docs) {
            if (err) return next(error(500, err));
            var total = docs.length;
            req.db.collection("users").find(filter).skip(start).limit(size).sort(orderFilter).toArray(function (err, docs) {
                if (err) return next(error(500, err));
                res.status(200).json(
                    {
                        data: docs,
                        recordsTotal: total,
                        recordsFiltered: total,
                        draw: draw
                    }
                );
            });
        })
    },

    forms: function (req, res, next) {
        var filter = {};
        if (req.body.valid) {
            var valid = req.body.valid;
            if (valid == "true") {
                filter.valid = true;
            }
            else {
                filter.valid = false;
            }
        }
        if (req.body.categoryName) {
            var categoryName = req.body.categoryName;
            if (categoryName instanceof Array) {
                var or = [];
                for (var i = 0; i < categoryName.length; i++) {
                    var and = {};
                    and["category.name"] = categoryName[i];
                    if (categoryName[i] == "form") {
                        if (req.body.formDisplay) {
                            var display = req.body.formDisplay;
                            if (display == "true") {
                                and["display"] = true;
                            }
                            else {
                                and["display"] = false;
                            }
                        }
                        if (req.body.formSelected) {
                            var selected = req.body.formSelected;
                            if (selected == "true") {
                                and["selected"] = true;
                            }
                            else {
                                and["selected"] = false;
                            }
                        }
                        if (req.body.formTypeName) {
                            and["type.name"] = req.body.formTypeName;
                        }
                        if (req.body.formIsParent) {
                            var formIsParent = req.body.formIsParent;
                            if (formIsParent == "true") {
                                and["children"] = {$exists: true};
                            }
                            else {
                                and["children"] = {$exists: false};
                            }
                        }
                    }
                    or.push(and);
                }
                filter["$or"] = or;
            }
            else {
                filter["category.name"] = categoryName;
                if (categoryName == "form") {
                    if (req.body.formDisplay) {
                        var display = req.body.formDisplay;
                        if (display == "true") {
                            filter["display"] = true;
                        }
                        else {
                            filter["display"] = false;
                        }
                    }
                    if (req.body.formSelected) {
                        var selected = req.body.formSelected;
                        if (selected == "true") {
                            filter["selected"] = true;
                        }
                        else {
                            filter["selected"] = false;
                        }
                    }
                    if (req.body.formTypeName) {
                        filter["type.name"] = req.body.formTypeName;
                    }
                    if (req.body.formIsParent) {
                        var formIsParent = req.body.formIsParent;
                        if (formIsParent == "true") {
                            filter["children"] = {$exists: true};
                        }
                        else {
                            filter["children"] = {$exists: false};
                        }
                    }
                }
            }
        }
        req.db.collection("forms").find(filter).sort({order: 1}).toArray(function (err, docs) {
            if (err) return next(error(500, err));
            res.status(200).json(docs);
        });
    }
    ,

    createForm: function (req, res, next) {
        var name = req.body.name;
        var typeName = req.body.typeName;
        var typeValue = req.body.typeValue;
        var perms = req.body.perms.split(",");
        var mixed = req.body.mixed;
        var step = req.body.step;
        var order = parseInt(req.body.order);
        if (mixed == "true") {
            mixed = true;
        }
        else {
            mixed = false
        }
        var form = {
            type: {
                name: typeName,
                value: typeValue
            },
            default: false,
            display: true,
            order: order,
            complete: false,
            mixed: mixed,
            perms: perms,
            category: {
                name: "form",
                value: "表单"
            },
            "header": [
                {
                    "name": "form_no",
                    "text": "表单编号"
                },
                {
                    "name": "author",
                    "text": "制表"
                },
                {
                    "name": "created",
                    "text": "制表日期"
                },
                {
                    "name": "version",
                    "text": "版本号"
                },
                {
                    "name": "auditor",
                    "text": "审核"
                },
                {
                    "name": "audit_date",
                    "text": "审核日期"
                }
            ]
        }
        if (step == "") {
            req.db.collection("forms").findOne({
                "name": name,
                "category.name": "form",
                "display": true,
                "$or": [{
                    "children": {
                        "$exists": false
                    },
                    "parent": {
                        "$exists": false
                    }
                }, {
                    "children": {
                        "$exists": true
                    }
                }]
            }, function (err, data) {
                if (data != null) {
                    res.status(200).json({"result": "exists"});
                }
                else {
                    form.name = name;
                    req.db.collection("forms").insertOne(form, function (err, data) {
                        if (err) return next(error(500, err));
                        res.status(200).json({"result": "success"});
                    });
                }
            })
        }
        else {
            req.db.collection("forms").findOne({
                "name": name,
                "category.name": "form",
                "display": true,
                "children": {
                    "$exists": false
                },
                "parent": {
                    "$exists": false
                }
            }, function (err, data) {
                if (data != null) {
                    res.status(200).json({"result": "exists"});
                }
                else {
                    req.db.collection("forms").findOne({
                        "name": name,
                        "category.name": "form",
                        "display": true,
                        "children": {
                            "$exists": true
                        }
                    }, function (err, data) {
                        if (data == null) {
                            form.name = step;
                            req.db.collection("forms").insertOne(form, function (err, data) {
                                if (err) return next(error(500, err));
                                var id = data.insertedId;
                                form.name = name;
                                delete form.complete;
                                delete form._id;
                                form.children = [{_id: new ObjectID(id)}];
                                req.db.collection("forms").insertOne(form, function (err, data) {
                                    if (err) return next(error(500, err));
                                    var pid = data.insertedId;
                                    req.db.collection("forms").updateOne({"_id": new ObjectID(id)},
                                        {"$set": {"parent": {"_id": new ObjectID(pid)}}},
                                        function (err, data) {
                                            if (err) return next(error(500, err));
                                            res.status(200).json({"result": "success"});
                                        })
                                })
                            })
                        }
                        else {
                            if (data.type.name == typeName) {
                                var pid = data._id;
                                form.parent = {"_id": new ObjectID(pid)};
                                form.name = step;
                                req.db.collection("forms").insertOne(form, function (err, data) {
                                    if (err) return next(error(500, err));
                                    var id = data.insertedId;
                                    req.db.collection("forms").updateOne({"_id": new ObjectID(pid)}, {
                                        $addToSet: {
                                            "children": {"_id": new ObjectID(id)}
                                        }
                                    }, function (err, doc) {
                                        if (err) return next(error(500, err));
                                        res.status(200).json({"result": "success"});
                                    });
                                })
                            }
                            else {
                                res.status(200).json({"result": "exists"});
                            }
                        }
                    })
                }
            })
        }
    },

    getForm: function (req, res, next) {
        req.db.collection("forms").findOne({"_id": new ObjectID(req.body.id)}, function (err, doc) {
            if (err) return next(error(500, err));
            res.status(200).json(doc);
        });
    }
    ,
    getModuleFormByAlias: function (req, res, next) {
        req.db.collection("forms").findOne({
            "alias": req.body.alias,
            "category.name": "form",
            "display": false,
            "valid": true
        }, function (err, doc) {
            if (err) return next(error(500, err));
            res.status(200).json(doc);
        });
    }
    ,
    updateForm: function (req, res, next) {
        var from = req.body.from;
        var body = JSON.parse(req.body.body);
        var id = req.body.id;
        req.db.collection("forms").findOne({_id: new ObjectID(from)}, function (err, data) {
            if (err) return next(error(500, err));
            var header = data.header;
            var name = data.name;
            var alias = data.alias;
            req.db.collection("forms").findOne({_id: new ObjectID(id)}, function (err, data) {
                if (err) return next(error(500, err));
                req.db.collection("forms").updateOne({"_id": new ObjectID(id)}, {
                    $set: {
                        "ref_form": {
                            "_id": new ObjectID(from),
                            "text": name,
                            "alias": alias
                        },
                        "body": body,
                        "complete": true
                    }
                }, function (err, doc) {
                    if (err) return next(error(500, err));
                    res.status(200).end();
                })
            })
        })
        req.db.collection("forms").updateOne({"_id": new ObjectID(from)}, {$set: {"selected": true}}, function (err, data) {
            if (err) return next(error(500, err));
            req.db.collection("forms").findOne({
                "children._id": new ObjectID(from)
            }, function (err, data) {
                if (err) return next(error(500, err));
                if (data != null) {
                    var children = data.children;
                    var len = children.length;
                    var ids = [];
                    var pid = data._id;
                    for (var i = 0; i < len; i++) {
                        ids.push(new ObjectID(children[i]._id));
                    }
                    req.db.collection("forms").find({
                        "_id": {$in: ids},
                        "selected": true
                    }).toArray(function (err, data) {
                        if (err) return next(error(500, err));
                        if (data.length == len) {
                            req.db.collection("forms").updateOne({"_id": new ObjectID(pid)}, {$set: {"selected": true}},
                                function (err, data) {
                                    if (err) return next(error(500, err));
                                })
                        }
                    })
                }
            })
        })
    }
    ,

    deleteForm: function (req, res, next) {
        var id = req.body.id;
        req.db.collection("forms").findOne({"_id": new ObjectID(id)}, function (err, data) {
            var ref_form = data.ref_form;
            var parent = data.parent;
            req.db.collection("forms").deleteOne({"_id": new ObjectID(id)}, function (err, data) {
                if (err) return next(error(500, err));
                if (parent) {
                    req.db.collection("forms").findOne({"_id": new ObjectID(parent._id)}, function (err, data) {
                        if (err) return next(error(500, err));
                        if (data.children.length == 1) {
                            req.db.collection("forms").deleteOne({"_id": new ObjectID(data._id)}, function (err, data) {
                                if (err) return next(error(500, err));
                                res.status(200).end();
                            })
                        }
                        else {
                            for (var i = 0; i < data.children.length; i++) {
                                if (data.children[i]._id == req.body.id) {
                                    data.children.splice(i, 1);
                                    break;
                                }
                            }
                            req.db.collection("forms").updateOne({_id: new ObjectID(data._id)}, {$set: {"children": data.children}},
                                function (err, result) {
                                    if (err) return next(error(500, err));
                                    res.status(200).end();
                                });
                        }
                    });
                }
                else {
                    res.status(200).end();
                }
            });
            if (ref_form) {
                var mid = ref_form._id;
                req.db.collection("forms").updateOne({"_id": new ObjectID(mid)}, {$set: {"selected": false}}, function (err, data) {
                    if (err) return next(error(500, err));
                    req.db.collection("forms").findOne({"children._id": new ObjectID(mid)}, function (err, data) {
                        if (err) return next(error(500, err));
                        if (data != null) {
                            if (data.selected) {
                                req.db.collection("forms").updateOne({_id: new ObjectID(data._id)}, {$set: {"selected": false}},
                                    function (err, result) {
                                        if (err) return next(error(500, err));
                                    });
                            }
                        }
                    })
                })
            }
        })
    }
    ,

    listPerms: function (req, res, next) {
        req.db.collection("users").find({perms: {$exists: true, $not: {$size: 0}}}).toArray(function (err, docs) {
            if (err) return next(error(500, err));
            res.status(200).json(docs);
        });
    }
    ,

    listEnums: function (req, res, next) {
        req.db.collection("enums").find({}).toArray(function (err, docs) {
            if (err) return next(error(500, err));

            res.status(200).json(docs);
        });
    }
    ,
    updateEnumsIfNotExists: function (req, res, next) {
        for (var index in req.body.org1) {
            req.db.collection("enums").findOne({
                name: "orgs",
                "values.org1": req.body.org1[index]
            }, function (err, doc) {
                if (!doc)
                    req.db.collection("enums").updateOne({name: "orgs"}, {$addToSet: {"values.org1": req.body.org1[index]}}, function (err, result) {
                        if (err) return next(error(500, err));
                    });
            })
        }
        for (var index in req.body.org2) {
            req.db.collection("enums").findOne({
                name: "orgs",
                "values.org2": req.body.org2[index]
            }, function (err, doc) {
                if (!doc)
                    req.db.collection("enums").updateOne({name: "orgs"}, {$addToSet: {"values.org2": req.body.org2[index]}}, function (err, result) {
                        if (err) return next(error(500, err));
                    });
            })
        }
        req.db.collection("enums").updateOne({name: "roles"}, {$addToSet: {"values": {$each: req.body.roles}}}, function (err, result) {
            if (err) return next(error(500, err));
        });
    }
    ,
    getUser: function (req, res, next) {
        req.db.collection("users").findOne({"_id": new ObjectID(req.body.id)}, function (err, doc) {
            if (err) return next(error(500, err));
            res.status(200).json(doc);
        });
    }
    ,

    selectForm: function (req, res, next) {
        // TODO: create template based on selection

        // update form to be selected and update all selected param names
        req.db.collection("forms").updateOne({"_id": new ObjectID(req.body.form)}, {$set: {selected: true}}, function (err, result) {
            if (err) return next(error(500, err));
            console.log("updated", result.modifiedCount);
            res.status(200).json({updated: result.modifiedCount});
        });
    }
    ,

    createUser: function (req, res, next) {
        console.log(req.body);
        if (!(req.body.org1 instanceof Array) && req.body.org1)req.body.org1 = req.body.org1.split(",");
        else req.body.org1=[];
        if (!(req.body.org2 instanceof Array) && req.body.org2)req.body.org2 = req.body.org2.split(",");
        else req.body.org2=[];
        if (!(req.body.roles instanceof Array) && req.body.roles)req.body.roles = req.body.roles.split(",");
        else req.body.roles=[];
        this.updateEnumsIfNotExists(req, res, next);

        req.db.collection("users").findOne({"username": req.body.username}, function (err, doc) {
            if (err) return next(error(500, err));
            if (doc) return next(error(403, {message: "已存在此用户名，请重新输入！"}));
            req.db.collection("users").insertOne(req.body, function (err, result) {
                if (err) return next(error(500, err));
                res.status(200).end();
            });
        });
    }
    ,

    createUserPerm: function (req, res, next) {
        var perms = JSON.parse(req.body.perms);
        for (var i = 0; i < perms.length; i++) {
            perms[i].form_id = new ObjectID(perms[i].form_id);
        }
        var userId = req.body.userId;
        req.db.collection("users").updateOne({"_id": new ObjectID(userId)}, {$set: {perms: perms}}, function (err, result) {
            if (err) return next(error(500, err));
            console.log("updated", result.modifiedCount);
            res.status(200).json({updated: result.modifiedCount});
        });
    }
    ,

    deleteUser: function (req, res, next) {
        var userId = req.body.id;
        req.db.collection('users').deleteOne({"_id": new ObjectID(userId)}, function (err, result) {
            if (err) {
                return next(error(500, err));
            }
            res.status(200).end();
        });
    }
    ,

    updateUser: function (req, res, next) {
        var userId = req.body.id;
        delete req.body["id"];
        if (!(req.body.org1 instanceof Array) && req.body.org1)req.body.org1 = req.body.org1.split(",");
        else req.body.org1=[]
        if (!(req.body.org2 instanceof Array) && req.body.org2)req.body.org2 = req.body.org2.split(",");
        else req.body.org2=[]
        if (!(req.body.roles instanceof Array) && req.body.roles)req.body.roles = req.body.roles.split(",");
        else req.body.roles = [];
        this.updateEnumsIfNotExists(req, res, next);
        req.db.collection("users").findOneAndUpdate({"_id": new ObjectID(userId)}, {$set: req.body}, function (err, result) {
            if (err) return next(error(500, err));
            res.status(200).end();
        });
    }
    ,

    findUsers: function (req, res, next) {
        var filter = {};
        if (req.body.roles) {
            if (!(req.body.roles instanceof Array)) req.body.roles = [req.body.roles];
            var rolesFilter = {};
            rolesFilter['$all'] = req.body.roles;
            filter['roles'] = rolesFilter;
        }
        else {
            filter['roles'] = [];
        }
        req.db.collection("users").find(filter).toArray(function (err, docs) {
            if (err) return next(error(500, err));
            res.status(200).json(docs);
        });
    }
    ,
    //内部表单增删改查
    listInternalForm: function (req, res, next) {
        var subForm = req.query.subForm;
        var draw = Number(req.query.draw);
        var start = 0;
        if (req.query.start) {
            start = Number(req.query.start);
        }
        var size = 0;
        if (req.query.length) {
            size = Number(req.query.length);
        }
        var search;
        if (req.query.search) {
            search = req.query.search.value;
        }
        var reg = new RegExp(".*" + search + ".*");
        //TODO
        //var filter = {'$or': [{last_name: reg}, {first_name: reg}, {username: reg}]};

        var order = req.query.order;
        var orderFilter = [];
        var columns = req.query.columns;
        if (order && order instanceof Array) {
            for (var index in order) {
                var colIndex = order[index].column
                var orderName = columns[colIndex].data;
                if (!orderName) continue;
                var orderVal = order[index].dir == "asc" ? 1 : -1;
                orderFilter.push(JSON.parse("{\"" + orderName + "\":" + orderVal + "}"));
            }
        }
        req.db.collection("internal_forms").find({name: subForm}).toArray(function (err, docs) {
            if (err) return next(error(500, err));
            var total = docs.length;
            req.db.collection("internal_forms").find({name: subForm}).skip(start).limit(size).sort(orderFilter).toArray(function (err, docs) {
                if (err) return next(error(500, err));
                res.status(200).json(
                    {
                        data: docs,
                        recordsTotal: total,
                        recordsFiltered: total,
                        draw: draw
                    }
                );
            });
        });
    }
    ,
    searchGdzzhysb: function (req, res, next) {
        var subForm = req.query.subForm;
        var pageSize = Number(req.query.pageSize);
        var pageNo = Number(req.query.pageNo);
        var search = req.query.search;
        var reg = new RegExp(".*" + search + ".*");
        var filter = {'$or': [{section_make_no: reg}]};
        filter.name = subForm;

        req.db.collection("internal_forms").find(filter).toArray(function (err, docs) {
            if (err) return next(error(500, err));
            var total = docs.length;
            req.db.collection("internal_forms").find(filter).skip(pageNo - 1).limit(pageSize).toArray(function (err, docs) {
                if (err) return next(error(500, err));
                docs.total = total;
                res.status(200).json(
                    {
                        data: docs,
                        total: total
                    }
                );
            });
        });
    }
    ,
    getInternalForm: function (req, res, next) {
        var subForm = req.query.subForm;
        var form = req.body;
        req.db.collection("internal_forms").findOne({"_id": new ObjectID(form.id)}, function (err, data) {
            if (err) return next(error(500, err));
            res.status(200).json(data);
        });
    }
    ,

    createInternalForm: function (req, res, next) {
        var subForm = req.query.subForm;
        var form = req.body;
        form.name = subForm;
        req.db.collection("internal_forms").insertOne(form, function (err, data) {
            if (err) return next(error(500, err));
            res.status(200).json({"result": "success"});
        })
    }
    ,
    updateInternalForm: function (req, res, next) {
        var subForm = req.query.subForm;
        var form = req.body;
        form.name = subForm;
        req.db.collection("internal_forms").findOneAndUpdate({"_id": new ObjectID(form.id)}, {$set: req.body}, function (err, result) {
            if (err) return next(error(500, err));
            res.status(200).end();
        });
    }
    ,
    delInternalForm: function (req, res, next) {
        var formId = req.body.id;
        var subForm = req.query.subForm;
        req.db.collection("internal_forms").deleteOne({"_id": new ObjectID(formId)}, function (err, result) {
            if (err) {
                return next(error(500, err));
            }
            res.status(200).end();
        });
    }
    ,
    //查询钢丝结构表里的股层最大层数,和股绳最大层数
    findMaxPlies: function (req, res, next) {
        var subForm = req.query.subForm;
        req.db.collection("internal_forms").find({name: subForm}).sort({"gc_plies": -1}).limit(1).toArray(function (err, docs1) {
            if (err) {
                return next(error(500, err));
            }
            req.db.collection("internal_forms").find({name: subForm}).sort({"gs_plies": -1}).limit(1).toArray(function (err, docs2) {
                if (err) {
                    return next(error(500, err));
                }
                res.status(200).json({
                    max_gc_plies: docs1[0] ? docs1[0].gc_plies : 3,
                    max_gs_plies: docs2[0] ? docs2[0].gs_plies : 3
                });
            });
        });
    }
    ,
    uploadGybzg: function (req, res, next) {
        var form = new formidable.IncomingForm();
        //这里formidable会对upload的对象进行解析和处理
        form.parse(req, function (err, fields, files) {
            res.writeHead(200, {'content-type': 'text/plain'});
            res.write('received upload:\n\n');
            var excel = xlsx.parse(files.file.path);
            if (excel.length == 1) {
                if (excel[0].name == "主股卡片") {
                    var zgs = [];
                    for (var row = 3; row < excel[0].data.length; row++) {
                        if (excel[0].data[row].length == 0) continue;
                        var zg = {},
                            col = 0;
                        zg.name = "gybzg";
                        zg.gssjg = excel[0].data[row][col++];
                        zg.gssgczj = excel[0].data[row][col++];
                        zg.csnj = excel[0].data[row][col++];
                        zg.zggs = excel[0].data[row][col++];
                        zg.zg_gszj_zxs = excel[0].data[row][col++];
                        zg.zg_gszj_dc1 = excel[0].data[row][col++];
                        zg.zg_gszj_dc2 = excel[0].data[row][col++];
                        zg.zg_gszj_dc3 = excel[0].data[row][col++];
                        zg.zg_gszj_dc4 = excel[0].data[row][col++];
                        zg.zg_gsgs_zxs = excel[0].data[row][col++];
                        zg.zg_gsgs_dc1 = excel[0].data[row][col++];
                        zg.zg_gsgs_dc2 = excel[0].data[row][col++];
                        zg.zg_gsgs_dc3 = excel[0].data[row][col++];
                        zg.zg_gsgs_dc4 = excel[0].data[row][col++];
                        zg.ysggj_yq = excel[0].data[row][col++];
                        zg.ysggj_yh = excel[0].data[row][col++];
                        zg.zg_gushzj_dc1 = excel[0].data[row][col++];
                        zg.zg_gushzj_dc2 = excel[0].data[row][col++];
                        zg.zg_gushzj_dc3 = excel[0].data[row][col++];
                        zg.zg_gushzj_dc4 = excel[0].data[row][col++];
                        zg.zg_gushnj_dc1 = excel[0].data[row][col++];
                        zg.zg_gushnj_dc2 = excel[0].data[row][col++];
                        zg.zg_gushnj_dc3 = excel[0].data[row][col++];
                        zg.zg_gushnj_dc4 = excel[0].data[row][col++];
                        zg.jssxjg = excel[0].data[row][col++];
                        zg.jssxzj = excel[0].data[row][col++];
                        zg.xwx = excel[0].data[row][col++];
                        zg.bjssx = excel[0].data[row][col++];
                        zgs.push(zg);
                    }
                    if (zgs.length > 0)
                        req.db.collection("internal_forms").deleteMany({name: "gybzg"}, function (err, result) {
                            req.db.collection("internal_forms").insertMany(zgs, function (err, result) {
                                if (err) {
                                    return next(error(500, err));
                                }
                                res.status(200).end();
                            });
                        });
                } else {

                }
            } else {

            }
            res.end(util.inspect({fields: fields, files: files, excel: excel}));

        });
        return;
    }
    ,
    downloadGybzg: function (req, res, next) {
        req.db.collection("internal_forms").find({name: "gybzg"}).toArray(function (err, docs) {
            if (err) {
                return next(error(500, err));
            }
            var data = [];
            data.push([
                "钢丝绳结构",
                "钢丝绳公称直径（mm）",
                "成绳捻距",
                "主股",
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                "金属绳芯",
                null,
                "纤维芯",
                "半金属绳芯"
            ]);
            data.push([
                null,
                null,
                null,
                "主股股数",
                "主股中钢丝直径",
                null,
                null,
                null,
                null,
                "主股中钢丝根数",
                null,
                null,
                null,
                null,
                "压实股股径（mm）",
                null,
                "主股股绳直径(mm)",
                null,
                null,
                null,
                "主股股绳捻距",
                null,
                null,
                null,
                "金属绳芯结构",
                "金属绳芯直径"
            ]);
            data.push([
                null,
                null,
                null,
                null,
                "中心丝",
                "第一层",
                "第二层",
                "第三层",
                "第四层",
                "中心丝",
                "第一层",
                "第二层",
                "第三层",
                "第四层",
                "压前",
                "压后",
                "第一层",
                "第二层",
                "第三层",
                "第四层",
                "第一层",
                "第二层",
                "第三层",
                "第四层"
            ]);
            for (var index in docs) {
                var sheet = docs[index];
                var row = [];
                var col = 0;
                row.push(sheet.gssjg);
                row.push(sheet.gssgczj);
                row.push(sheet.csnj);
                row.push(sheet.zggs);
                row.push(sheet.zg_gszj_zxs);
                row.push(sheet.zg_gszj_dc1);
                row.push(sheet.zg_gszj_dc2);
                row.push(sheet.zg_gszj_dc3);
                row.push(sheet.zg_gszj_dc4);
                row.push(sheet.zg_gsgs_zxs);
                row.push(sheet.zg_gsgs_dc1);
                row.push(sheet.zg_gsgs_dc2);
                row.push(sheet.zg_gsgs_dc3);
                row.push(sheet.zg_gsgs_dc4);
                row.push(sheet.ysggj_yq);
                row.push(sheet.ysggj_yh);
                row.push(sheet.zg_gushzj_dc1);
                row.push(sheet.zg_gushzj_dc2);
                row.push(sheet.zg_gushzj_dc3);
                row.push(sheet.zg_gushzj_dc4);
                row.push(sheet.zg_gushnj_dc1);
                row.push(sheet.zg_gushnj_dc2);
                row.push(sheet.zg_gushnj_dc3);
                row.push(sheet.zg_gushnj_dc4);
                row.push(sheet.jssxjg);
                row.push(sheet.jssxzj);
                row.push(sheet.xwx);
                row.push(sheet.bjssx);
                data.push(row);
            }
            //sheet name
            var ws_name = uuid.v1();
            //栏宽度
            var wscols = [
                {wch: 10},
                {wch: 16},
                {wch: 8},
                {wch: 8},
                {wch: 6},
                {wch: 6},
                {wch: 6},
                {wch: 6},
                {wch: 6},
                {wch: 6},
                {wch: 6},
                {wch: 6},
                {wch: 6},
                {wch: 6},
                {wch: 6},
                {wch: 6},
                {wch: 6},
                {wch: 6},
                {wch: 6},
                {wch: 6},
                {wch: 6},
                {wch: 6},
                {wch: 6},
                {wch: 6},
                {wch: 12},
                {wch: 12},
                {wch: 6},
                {wch: 10}
            ];
            //merge
            var wsmerges = [
                {s: {c: 0, r: 0}, e: {c: 0, r: 2}},
                {s: {c: 1, r: 0}, e: {c: 1, r: 2}},
                {s: {c: 2, r: 0}, e: {c: 2, r: 2}},
                {s: {c: 3, r: 0}, e: {c: 23, r: 0}},
                {s: {c: 3, r: 1}, e: {c: 3, r: 2}},
                {s: {c: 4, r: 1}, e: {c: 8, r: 1}},
                {s: {c: 9, r: 1}, e: {c: 13, r: 1}},
                {s: {c: 14, r: 1}, e: {c: 15, r: 1}},
                {s: {c: 16, r: 1}, e: {c: 19, r: 1}},
                {s: {c: 20, r: 1}, e: {c: 23, r: 1}},
                {s: {c: 24, r: 0}, e: {c: 25, r: 0}},
                {s: {c: 24, r: 1}, e: {c: 24, r: 2}},
                {s: {c: 25, r: 1}, e: {c: 25, r: 2}},
                {s: {c: 26, r: 0}, e: {c: 26, r: 2}},
                {s: {c: 27, r: 0}, e: {c: 27, r: 2}}
            ];

            console.log("Sheet Name: " + ws_name);
            console.log("Data: ");
            for (var i = 0; i != data.length; ++i) console.log(data[i]);
            console.log("Columns :");
            for (i = 0; i != wscols.length; ++i) console.log(wscols[i]);


            /* require XLSX */
            if (typeof XLSX === "undefined") {
                try {
                    XLSX = require('xlsx');
                } catch (e) {
                    XLSX = require('xlsx');
                }
            }

            /* dummy workbook constructor */
            function Workbook() {
                if (!(this instanceof Workbook)) return new Workbook();
                this.SheetNames = [];
                this.Sheets = {};
            }

            var wb = new Workbook();


            /* TODO: date1904 logic */
            function datenum(v, date1904) {
                if (date1904) v += 1462;
                var epoch = Date.parse(v);
                return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
            }

            /* convert an array of arrays in JS to a CSF spreadsheet */
            function sheet_from_array_of_arrays(data, opts) {
                var ws = {};
                var range = {s: {c: 10000000, r: 10000000}, e: {c: 0, r: 0}};
                for (var R = 0; R != data.length; ++R) {
                    for (var C = 0; C != data[R].length; ++C) {
                        if (range.s.r > R) range.s.r = R;
                        if (range.s.c > C) range.s.c = C;
                        if (range.e.r < R) range.e.r = R;
                        if (range.e.c < C) range.e.c = C;
                        var cell = {v: data[R][C]};
                        if (cell.v == null) continue;
                        var cell_ref = XLSX.utils.encode_cell({c: C, r: R});

                        /* TEST: proper cell types and value handling */
                        if (typeof cell.v === 'number') cell.t = 'n';
                        else if (typeof cell.v === 'boolean') cell.t = 'b';
                        else if (cell.v instanceof Date) {
                            cell.t = 'n';
                            cell.z = XLSX.SSF._table[14];
                            cell.v = datenum(cell.v);
                        }
                        else cell.t = 's';
                        cell.s = {alignment: {horizontal: 'center', vertical: 'center'}};
                        ws[cell_ref] = cell;
                    }
                }

                /* TEST: proper range */
                if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
                return ws;
            }

            var ws = sheet_from_array_of_arrays(data);

            /* TEST: add worksheet to workbook */
            wb.SheetNames.push(ws_name);
            wb.Sheets[ws_name] = ws;
            /* TEST: column widths */
            ws['!cols'] = wscols;
            ws['!merges'] = wsmerges;
            /* write file */
            XLSX.writeFile(wb, '/tmp/' + ws_name + '.xlsx', {
                cellStyles: true
            });
            res.download('/tmp/' + ws_name + '.xlsx');
        });

    },

    uploadGybjsx: function (req, res, next) {
        var form = new formidable.IncomingForm();
        //这里formidable会对upload的对象进行解析和处理
        form.parse(req, function (err, fields, files) {
            res.writeHead(200, {'content-type': 'text/plain'});
            res.write('received upload:\n\n');
            var excel = xlsx.parse(files.file.path);
            if (excel.length == 1) {
                if (excel[0].name == "金属芯卡片") {
                    var jsxs = [];
                    for (var row = 3; row < excel[0].data.length; row++) {
                        if (excel[0].data[row].length == 0) continue;
                        var jsx = {},
                            col = 0;
                        jsx.name = "gybjsx";
                        jsx.jssxjg = excel[0].data[row][col++];
                        jsx.jssxzj = excel[0].data[row][col++];
                        jsx.jssxnj = excel[0].data[row][col++];
                        jsx.wggs = excel[0].data[row][col++];
                        jsx.wggj = excel[0].data[row][col++];
                        jsx.wggnj = excel[0].data[row][col++];
                        jsx.wggszj_zxs = excel[0].data[row][col++];
                        jsx.wggszj_wcs = excel[0].data[row][col++];
                        jsx.wggsgs_zxs = excel[0].data[row][col++];
                        jsx.wggsgs_wcs = excel[0].data[row][col++];
                        jsx.zxggs = excel[0].data[row][col++];
                        jsx.zxggj = excel[0].data[row][col++];
                        jsx.zxggnj = excel[0].data[row][col++];
                        jsx.zxgszj_zxs = excel[0].data[row][col++];
                        jsx.zxgszj_wcs = excel[0].data[row][col++];
                        jsx.zxgsgs_zxs = excel[0].data[row][col++];
                        jsx.zxgsgs_wcs = excel[0].data[row][col++];
                        jsxs.push(jsx);
                    }
                    if (jsxs.length > 0)
                        req.db.collection("internal_forms").deleteMany({name: "gybjsx"}, function (err, result) {
                            req.db.collection("internal_forms").insertMany(jsxs, function (err, result) {
                                if (err) {
                                    return next(error(500, err));
                                }
                                res.status(200).end();
                            });
                        });
                } else {

                }
            } else {

            }
            res.end(util.inspect({fields: fields, files: files, excel: excel}));

        });
        return;
    }
    ,
    downloadGybjsx: function (req, res, next) {
        req.db.collection("internal_forms").find({name: "gybjsx"}).toArray(function (err, docs) {
            if (err) {
                return next(error(500, err));
            }
            var data = [];
            data.push([
                "金属绳芯结构",
                "金属绳芯",
                null,
                "金属芯外股",
                null,
                null,
                null,
                null,
                null,
                null,
                "中心股"
            ]);
            data.push([
                null,
                "金属绳芯直径",
                "金属绳芯捻距",
                "外股股数",
                "外股股径",
                "外股股捻距",
                "外股钢丝直径",
                null,
                "外股钢丝根数",
                null,
                "中心股股数",
                "中心股股径",
                "中心股钢丝直径",
                null,
                null,
                "中心股钢丝根数"
            ]);
            data.push([
                null,
                null,
                null,
                null,
                null,
                null,
                "中心丝",
                "外层丝",
                "中心丝",
                "外层丝",
                null,
                null,
                "中心股股捻距",
                "中心丝",
                "外层丝",
                "中心丝",
                "外层丝"
            ]);
            for (var index in docs) {
                var sheet = docs[index];
                var row = [];
                var col = 0;
                row.push(sheet.jssxjg);
                row.push(sheet.jssxzj);
                row.push(sheet.jssxnj);
                row.push(sheet.wggs);
                row.push(sheet.wggj);
                row.push(sheet.wggnj);
                row.push(sheet.wggszj_zxs);
                row.push(sheet.wggszj_wcs);
                row.push(sheet.wggsgs_zxs);
                row.push(sheet.wggsgs_wcs);
                row.push(sheet.zxggs);
                row.push(sheet.zxggj);
                row.push(sheet.zxggnj);
                row.push(sheet.zxgszj_zxs);
                row.push(sheet.zxgszj_wcs);
                row.push(sheet.zxgsgs_zxs);
                row.push(sheet.zxgsgs_wcs);
                data.push(row);
            }
            //sheet name
            var ws_name = uuid.v1();
            //栏宽度
            var wscols = [
                {wch: 18},
                {wch: 18},
                {wch: 18},
                {wch: 12},
                {wch: 12},
                {wch: 15},
                {wch: 9},
                {wch: 9},
                {wch: 9},
                {wch: 9},
                {wch: 15},
                {wch: 15},
                {wch: 18},
                {wch: 9},
                {wch: 9},
                {wch: 9},
                {wch: 9}
            ];
            //merge
            var wsmerges = [
                {s: {c: 0, r: 0}, e: {c: 0, r: 2}},
                {s: {c: 1, r: 0}, e: {c: 2, r: 0}},
                {s: {c: 1, r: 1}, e: {c: 1, r: 2}},
                {s: {c: 2, r: 1}, e: {c: 2, r: 2}},
                {s: {c: 3, r: 0}, e: {c: 9, r: 0}},
                {s: {c: 3, r: 1}, e: {c: 3, r: 2}},
                {s: {c: 4, r: 1}, e: {c: 4, r: 2}},
                {s: {c: 5, r: 1}, e: {c: 5, r: 2}},
                {s: {c: 6, r: 1}, e: {c: 7, r: 1}},
                {s: {c: 8, r: 1}, e: {c: 9, r: 1}},
                {s: {c: 10, r: 0}, e: {c: 16, r: 0}},
                {s: {c: 10, r: 1}, e: {c: 10, r: 2}},
                {s: {c: 11, r: 1}, e: {c: 11, r: 2}},
                {s: {c: 12, r: 1}, e: {c: 14, r: 1}},
                {s: {c: 15, r: 1}, e: {c: 16, r: 1}},
            ];

            console.log("Sheet Name: " + ws_name);
            console.log("Data: ");
            for (var i = 0; i != data.length; ++i) console.log(data[i]);
            console.log("Columns :");
            for (i = 0; i != wscols.length; ++i) console.log(wscols[i]);


            /* require XLSX */
            if (typeof XLSX === "undefined") {
                try {
                    XLSX = require('xlsx');
                } catch (e) {
                    XLSX = require('xlsx');
                }
            }

            /* dummy workbook constructor */
            function Workbook() {
                if (!(this instanceof Workbook)) return new Workbook();
                this.SheetNames = [];
                this.Sheets = {};
            }

            var wb = new Workbook();


            /* TODO: date1904 logic */
            function datenum(v, date1904) {
                if (date1904) v += 1462;
                var epoch = Date.parse(v);
                return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
            }

            /* convert an array of arrays in JS to a CSF spreadsheet */
            function sheet_from_array_of_arrays(data, opts) {
                var ws = {};
                var range = {s: {c: 10000000, r: 10000000}, e: {c: 0, r: 0}};
                for (var R = 0; R != data.length; ++R) {
                    for (var C = 0; C != data[R].length; ++C) {
                        if (range.s.r > R) range.s.r = R;
                        if (range.s.c > C) range.s.c = C;
                        if (range.e.r < R) range.e.r = R;
                        if (range.e.c < C) range.e.c = C;
                        var cell = {v: data[R][C]};
                        if (cell.v == null) continue;
                        var cell_ref = XLSX.utils.encode_cell({c: C, r: R});

                        /* TEST: proper cell types and value handling */
                        if (typeof cell.v === 'number') cell.t = 'n';
                        else if (typeof cell.v === 'boolean') cell.t = 'b';
                        else if (cell.v instanceof Date) {
                            cell.t = 'n';
                            cell.z = XLSX.SSF._table[14];
                            cell.v = datenum(cell.v);
                        }
                        else cell.t = 's';
                        cell.s = {alignment: {horizontal: 'center', vertical: 'center'}};
                        ws[cell_ref] = cell;
                    }
                }

                /* TEST: proper range */
                if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
                return ws;
            }

            var ws = sheet_from_array_of_arrays(data);

            /* TEST: add worksheet to workbook */
            wb.SheetNames.push(ws_name);
            wb.Sheets[ws_name] = ws;
            /* TEST: column widths */
            ws['!cols'] = wscols;
            ws['!merges'] = wsmerges;
            /* write file */
            XLSX.writeFile(wb, '/tmp/' + ws_name + '.xlsx', {
                cellStyles: true
            });
            res.download('/tmp/' + ws_name + '.xlsx');
        });

    }
}
;