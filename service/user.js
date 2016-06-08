var error = require('../util/error');
var enums = require("../util/enums");
var async = require("async");
var ObjectID = require('mongodb').ObjectID;
var moment = require('moment');
var ihEngine = require('./inheritanceEngine');
var _ = require("lodash");
var tree = require("../util/tree");

Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

// 重构嵌套结构
function nestChildren(docs, perms, dispFormId) {
    var structures = docs.filter(function (d) {
        return d.children;
    });

    var forms = [];
    var results = {forms: forms, displayForm: null};
    docs.forEach(function (d) {
        if (!d.children) {
            for (var i = 0; i < perms.length; i++) {
                if (d._id.toHexString() === perms[i].form_id) {
                    d.perms = perms[i];
                    break;
                }
            }
            var isChild = false;
            for (var i = 0; i < structures.length; i++) {
                var children = structures[i].children;
                for (var j = 0; j < children.length; j++) {
                    if (children[j]._id.equals(d._id)) {
                        var existParent = null;
                        isChild = true;
                        for (var k = 0; k < forms.length; k++) {
                            if (forms[k]._id.equals(structures[i]._id)) {
                                existParent = forms[k];
                                break;
                            }
                        }
                        if (existParent) {
                            existParent.children.push(d);
                        } else {
                            existParent = {"_id": structures[i]._id, name: structures[i].name, children: [d]};
                            forms.push(existParent);
                        }
                        if (d._id.toHexString() === dispFormId) {
                            results.displayForm = d;
                            d.active = true;        // active is the css class for sidebar menu
                            existParent.active = true;
                        }

                        break;
                    }
                }
            }
            if (!isChild) {
                if (d._id.toHexString() === dispFormId) {
                    results.displayForm = d;
                    d.active = true;
                }
                forms.push(d);
            }
        }
    });
    return results;
}

function renderForm(req, formIds, perms, res) {
    req.db.collection("forms").find({$or: [{"_id": {$in: formIds}}, {"children": {$exists: true}}]}).sort({order: 1}).toArray(function (err, docs) {
        if (err) return next(error(500, err));

        var results = {};
        if (docs && docs.length > 0) {
            var displayFormId = req.query.id;
            if (!displayFormId) {
                displayFormId = formIds[0].toHexString();
            }
            results = nestChildren(docs, perms, displayFormId);
        }
        var type = req.query.type;
        if (!type || type === "form") {
            var model = {user: req.session.user, forms: results.forms, displayForm: results.displayForm};
            if (results.displayForm.type.name === 'order') {
                // 生产订单
                res.render("user/order", model);
            } else if (results.displayForm.type.name === 'bom') {
                res.render("user/bom", model);
            } else {
                switch (results.displayForm.type.name) {
                    case "order_plan":
                        if (results.displayForm.ref_form.alias === 'order_item') {
                            res.render("user/order-item", model);
                        } else {
                            res.render("user/order-plan", model);
                        }
                        break;
                    case "production_plan":
                        if (results.displayForm.ref_form.alias === 'hs_production_plan') {
                            res.render('user/hs-production-plan', model);
                        }
                        else if (results.displayForm.ref_form.alias === 'ng_production_plan') {
                            res.render('user/ng-production-plan', model);
                        }
                        break;
                    case "work_order":
                        res.render('user/work-order', model);
                        break;
                    case "work_plan":
                        if (results.displayForm.ref_form.alias === 'hs_work_plan') {
                            res.render("user/hs-work-plan", model);
                        }
                        else if (results.displayForm.ref_form.alias === 'ng_work_plan') {
                            res.render("user/ng-work-plan", model);
                        }
                        break;
                    case "virtual_library":
                        if (results.displayForm.alias === 'g_virtual_library') {
                            res.render("user/g_virtual_library", model);
                        }
                        else if (results.displayForm.alias === 's_virtual_library') {
                            res.render("user/s_virtual_library", model);
                        }
                        break;
                    case "material_receive":
                        if (results.displayForm.alias === 'g_material_receive') {
                            res.render("user/g_material_receive", model);
                        }
                        else if (results.displayForm.alias === 's_material_receive') {
                            res.render("user/s_material_receive", model);
                        }
                        break;
                    case "machine_management":
                        if (results.displayForm.alias === 'machine_workorder') {
                            res.render("user/machine_workorder", model);
                        }
                        break;
                    default:
                        res.render("user/form", model);
                }
            }
        } else {
            // for other types, such as gantt-chart, etc
            res.render("user/" + req.query.type, {user: req.session.user, forms: results.forms});
        }
    });
}

function getAssignedForms(req, next) {
    // 操作工可以没有授权表单
    req.db.collection('form_insts').find({
        "type.name": "work_order",
        body: {$elemMatch: {"_id": req.session.user.id}}
    }).toArray(function (err, forms) {
        if (err) return next(error(500, err));
        next(null, forms);
    });
}

function updateAuthor(header, user) {
    header.forEach(function (h) {
        if (h.name === 'author') {
            h.value = user.name;
        } else if (h.name === 'created') {
            h.value = moment().format('YYYY-MM-DD');
        }
    });
    return header;
}

function checkNodeExist(instance, name) {
    var json = tree.get(instance, name);
    if (json) {
        return true;
    } else {
        return false;
    }
}

function setToNode(type, instance, name, value) {
    var json = getFromNode("json", instance, name);
    json[type] = value;
}

function getFromNode(type, instance, name) {
    var json = tree.get(instance, name);
    switch (type) {
        case "json":
            return json;
        default:
            return json[type]
    }
}

function deleteFromNode(instance, parentName, childName) {
    if (parentName == ".") {
        var children = instance.body;
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            if (child.name == childName) {
                children.splice(i, 1);
                break;
            }
        }
    }
    else {
        var parentJson = getFromNode("json", instance, parentName);
        var children = parentJson.children;
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            if (child.name == childName) {
                children.splice(i, 1);
                break;
            }
        }
    }
}

function checkNumber(value) {
    var pattern = /^\d*(\.\d*)?$/;
    if (pattern.test(value)) {
        return true;
    }
    else {
        return false;
    }
}

Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

function accAdd(arg1, arg2) {
    var r1, r2, m;
    try {
        r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    return (arg1 * m + arg2 * m) / m;
}

function accSub(arg1, arg2) {
    var r1, r2, m, n;
    try {
        r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    n = (r1 >= r2) ? r1 : r2;
    return ((arg1 * m - arg2 * m) / m).toFixed(n);
}

function accMul(arg1, arg2, arg3, arg4) {
    var m = 0, s1 = arg1.toString(), s2 = arg2.toString(), s3 = arg3.toString(), s4 = arg4.toString();
    try {
        m += s1.split(".")[1].length
    } catch (e) {
    }
    try {
        m += s2.split(".")[1].length
    } catch (e) {
    }
    try {
        m += s3.split(".")[1].length
    } catch (e) {
    }
    try {
        m += s4.split(".")[1].length
    } catch (e) {
    }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) * Number(s3.replace(".", "")) * Number(s4.replace(".", "")) / Math.pow(10, m)
}

function calculateComplete(sj, jh) {
    if ((jh) == "0") {
        return 0;
    }
    if (sj > jh) {
        return 1;
    }
    var t1 = 0, t2 = 0, r1, r2;
    try {
        t1 = sj.toString().split(".")[1].length
    } catch (e) {
    }
    try {
        t2 = jh.toString().split(".")[1].length
    } catch (e) {
    }
    with (Math) {
        r1 = Number(sj.toString().replace(".", ""))
        r2 = Number(jh.toString().replace(".", ""))
        return (r1 / r2) * pow(10, t2 - t1);
    }
}

function unique(arr, arg) {
    var result = [], hash = {};
    for (var i = 0, elem; (elem = arr[i]) != null; i++) {
        if (!hash[arg ? elem[arg] : elem]) {
            result.push(elem);
            hash[arg ? elem[arg] : elem] = true;
        }
    }
    return result;
}

module.exports = {
    form: function (req, res, next) {
        var perms = req.session.user.perms;
        var formIds;
        if (perms && perms.length > 0) {
            formIds = perms.map(function (p) {
                return new ObjectID(p.form_id);
            });
            renderForm(req, formIds, perms, res);
        } else {
            // 操作工可以没有授权表单
            getAssignedForms(req, function (err, forms) {
                if (err) return next(error(500, err));

                if (forms.length === 0) {
                    return res.render('user/work-order', {user: req.session.user});
                }
                var displayForm = forms[0];
                displayForm.perms = null;
                res.render('user/work-order', {user: req.session.user, forms: forms, displayForm: displayForm});
            });
        }
    },
    getWorkOrders: function (req, res, next) {
        var filter = {
            "type.name": "work_order"
        };
        if (req.session.user.roles.length == 0) {
            filter["body"] = {
                $elemMatch: {
                    "_id": req.session.user.id,
                    "name": "czg"
                }
            };
        }
        else {
            filter["$and"] = [{
                "body": {
                    $elemMatch: {
                        "_id": req.session.user.id,
                        "name": "bzz"
                    }
                }
            }];
            if (req.body.isAssigned) {
                filter["$and"].push(
                    {
                        "body": {
                            $elemMatch: {
                                "_id": req.body.isAssigned == "true" ? {$ne: ""} : "",
                                "name": "czg"
                            }
                        }
                    }
                );
            }
            if (req.body.czgId) {
                filter["$and"].push(
                    {
                        "body": {
                            $elemMatch: {
                                "_id": req.body.czgId,
                                "name": "czg"
                            }
                        }
                    }
                );
            }
            if (req.body.jthId) {
                filter["$and"].push(
                    {
                        "body": {
                            $elemMatch: {
                                "_id": req.body.jthId,
                                "name": "jth"
                            }
                        }
                    }
                );
            }
            if (req.body.startProduceDate) {
                filter["startProduceDate"] = {$gte: req.body.startProduceDate}
            }
            if (req.body.completeProduceDate) {
                filter["completeProduceDate"] = {$lte: req.body.completeProduceDate}
            }
        }
        if (req.body.alias) {
            filter["alias"] = {$in: req.body.alias};
        }
        if (req.body.status) {
            filter["status"] = req.body.status;
        }
        if (req.body.inStatus) {
            filter["status"] = {$in: req.body.inStatus};
        }
        if (req.body.notInStatus) {
            filter["status"] = {$nin: req.body.notInStatus};
        }
        req.db.collection('form_insts').find(filter).toArray(function (err, wos) {
            if (err) return next(error(500, err));
            res.status(200).json(wos);
        });
    },
    getWorkOrder: function (req, res, next) {
        req.db.collection("form_insts").findOne({"_id": new ObjectID(req.body.id)}, function (err, wo) {
            if (err) return next(error(500, err));
            res.status(200).json(wo);
        });
    },
    startAdjust: function (req, res, next) {
        req.db.collection("form_insts").findOne({"_id": new ObjectID(req.body.id)}, function (err, wo) {
            if (err) return next(error(500, err));
            if (wo) {
                wo["status"] = "adjusting";
                if (!getFromNode("value", wo, "tcsj.kssj")) {
                    setToNode("value", wo, "tcsj.kssj", new Date().Format("yyyy-MM-dd hh:mm"));
                }
                req.db.collection("form_insts").save(wo, function (err) {
                    if (err) return next(error(500, err));
                    res.status(200).json(wo);
                })
            }
            else {
                res.status(400).json({message: "工单不存在"});
            }
        });
    },
    pauseAdjust: function (req, res, next) {
        req.db.collection("form_insts").findOne({"_id": new ObjectID(req.body.id)}, function (err, wo) {
            if (err) return next(error(500, err));
            if (wo) {
                wo["status"] = "pauseAdjust";
                req.db.collection("form_insts").save(wo, function (err) {
                    if (err) return next(error(500, err));
                    res.status(200).json(wo);
                })
            }
            else {
                res.status(400).json({message: "工单不存在"});
            }
        });
    },
    continueAdjust: function (req, res, next) {
        req.db.collection("form_insts").findOne({"_id": new ObjectID(req.body.id)}, function (err, wo) {
            if (err) return next(error(500, err));
            if (wo) {
                wo["status"] = "adjusting";
                req.db.collection("form_insts").save(wo, function (err) {
                    if (err) return next(error(500, err));
                    res.status(200).json(wo);
                })
            }
            else {
                res.status(400).json({message: "工单不存在"});
            }
        });
    },
    completeAdjust: function (req, res, next) {
        req.db.collection("form_insts").findOne({"_id": new ObjectID(req.body.id)}, function (err, wo) {
            if (err) return next(error(500, err));
            if (wo) {
                wo["status"] = "adjusted";
                var endDate = new Date();
                setToNode("value", wo, "tcsj.wcsj", endDate.Format("yyyy-MM-dd hh:mm"));
                var interval = endDate.getTime() - Date.parse(getFromNode("value", wo, "tcsj.kssj"));
                setToNode("value", wo, "tcsj.tcys", Math.floor(interval / 3600000) + "小时" +
                    ((interval % 3600000) / 60000).toFixed(2) + "分钟");
                req.db.collection("form_insts").save(wo, function (err) {
                    if (err) return next(error(500, err));
                    res.status(200).json(wo);
                })
            }
            else {
                res.status(400).json({message: "工单不存在"});
            }
        });
    },
    stratProduce: function (req, res, next) {
        req.db.collection("form_insts").findOne({"_id": new ObjectID(req.body.id)}, function (err, wo) {
            if (err) return next(error(500, err));
            if (wo) {
                wo["status"] = "producing";
                var startProduceDate = new Date();
                if (!wo["startProduceDate"]) {
                    wo["startProduceDate"] = startProduceDate.Format("yyyy-MM-dd");
                }
                if (!getFromNode("value", wo, "scsj.kssj")) {
                    setToNode("value", wo, "scsj.kssj", startProduceDate.Format("yyyy-MM-dd hh:mm"));
                }
                req.db.collection("form_insts").save(wo, function (err) {
                    if (err) return next(error(500, err));
                    res.status(200).json(wo);
                });
            }
            else {
                res.status(400).json({message: "工单不存在"});
            }
        });
    },
    pauseProduce: function (req, res, next) {
        req.db.collection("form_insts").findOne({"_id": new ObjectID(req.body.id)}, function (err, wo) {
                if (err) return next(error(500, err));
                if (wo) {
                    var zjtj = checkNodeExist(wo, "zjtj") ?
                        getFromNode("json", wo, "zjtj") : {
                        "text": "中间停机",
                        "name": "zjtj",
                        "type": "folder",
                        "children": []
                    };
                    var zjtjs = zjtj.children.length + 1;
                    zjtj.children.push({
                        "text": "第" + zjtjs + "次",
                        "name": "dc" + zjtjs,
                        "type": "folder",
                        "children": [
                            {
                                "text": "停机时间",
                                "name": "tjsj",
                                "value": new Date().Format("yyyy-MM-dd hh:mm")
                            },
                            {
                                "text": "停机原因",
                                "name": "tjyy",
                                "value": req.body.reason
                            }
                        ]
                    });
                    if (req.body.changeOperator == "true") {
                        var scwcsj = new Date();
                        setToNode("value", wo, "scsj.wcsj", scwcsj.Format("yyyy-MM-dd hh:mm"));
                        var interval = scwcsj.getTime() - Date.parse(getFromNode("value", wo, "scsj.kssj"));
                        setToNode("value", wo, "scsj.scys", Math.floor(interval / 86400000) + "天" +
                            Math.floor(interval / 3600000) + "小时" + ((interval % 3600000) / 60000).toFixed(2) + "分钟");
                        var gdls = checkNodeExist(wo, "gdls") ?
                            getFromNode("json", wo, "gdls") : {
                            "name": "gdls",
                            "text": "工单历史",
                            "type": "folder",
                            "children": []
                        }
                        var gdlss = gdls.children.length + 1;
                        gdls.children.push({
                            "text": gdls.text + gdlss,
                            "name": gdls.name + gdlss,
                            "type": gdls.type,
                            "children": [
                                getFromNode("json", wo, "bz"),
                                getFromNode("json", wo, "bzz"),
                                getFromNode("json", wo, "czg"),
                                getFromNode("json", wo, "scsj"),
                                zjtj,
                                {
                                    "text": "实际产量",
                                    "name": "sjcl",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "已收线米长",
                                            "unit": "m",
                                            "name": "ysxmc",
                                            "value": getFromNode("value", wo, "sjcl.ysxmc")
                                        },
                                        {
                                            "text": "未收线米长",
                                            "unit": "m",
                                            "name": "wsxmc",
                                            "value": req.body.wsxmc
                                        },
                                        {
                                            "text": "总生产米长",
                                            "unit": "m",
                                            "name": "zscmc",
                                            "value": accAdd(getFromNode("value", wo, "sjcl.ysxmc"), req.body.wsxmc)
                                        }
                                    ]
                                }
                            ]
                        });
                        if (req.body.wsxmc != 0) {
                            gdls.children[gdls.children.length - 1].wsx = true;
                        }
                        tree.expire(wo);
                        zjtjs > 1 ? deleteFromNode(wo, ".", "zjtj") : "";
                        gdlss == 1 ? wo.body.push(gdls) : "";
                        setToNode("value", wo, "sjcl.ysxmc", 0);
                        setToNode("_id", wo, "czg", "");
                        setToNode("value", wo, "czg", "");
                        setToNode("value", wo, "scsj.kssj", "");
                        setToNode("value", wo, "scsj.wcsj", "");
                        setToNode("value", wo, "scsj.scys", "");
                    }
                    else {
                        if (zjtjs == 1) wo.body.push(zjtj);
                    }
                    wo["status"] = "parseProduce";
                    req.db.collection("form_insts").save(wo, function (err) {
                        if (err) return next(error(500, err));
                        res.status(200).json(wo);
                    });
                }
                else {
                    res.status(400).json({message: "工单不存在"});
                }
            }
        )
    },
    continueProduce: function (req, res, next) {
        req.db.collection("form_insts").findOne({"_id": new ObjectID(req.body.id)}, function (err, wo) {
            if (err) return next(error(500, err));
            if (wo) {
                var zjtjs = getFromNode("json", wo, "zjtj").children.length;
                var cqsj = new Date();
                var interval = cqsj.getTime() - Date.parse(getFromNode("value", wo, "zjtj.dc" + zjtjs + ".tjsj"));
                getFromNode("children", wo, "zjtj.dc" + zjtjs).push({
                    "text": "重启时间",
                    "name": "cqsj",
                    "value": cqsj.Format("yyyy-MM-dd hh:mm")
                })
                getFromNode("children", wo, "zjtj.dc" + zjtjs).push({
                    "text": "停机耗时",
                    "name": "tjhs",
                    "value": Math.floor(interval / 3600000) + "小时" + ((interval % 3600000) / 60000).toFixed(2) + "分钟"
                });
                wo["status"] = "producing";
                req.db.collection("form_insts").save(wo, function (err) {
                    if (err) return next(error(500, err));
                    res.status(200).json(wo);
                });
            }
            else {
                res.status(400).json({message: "工单不存在"});
            }
        });
    }
    ,
    completeProduce: function (req, res, next) {
        req.db.collection("form_insts").findOne({"_id": new ObjectID(req.body.id)}, function (err, wo) {
            if (err) return next(error(500, err));
            if (wo) {
                wo["status"] = "unconfirmed";
                var completeProduceDate = new Date();
                wo["completeProduceDate"] = completeProduceDate.Format("yyyy-MM-dd");
                setToNode("value", wo, "scsj.wcsj", completeProduceDate.Format("yyyy-MM-dd hh:mm"));
                var interval = completeProduceDate.getTime() - Date.parse(getFromNode("value", wo, "scsj.kssj"));
                setToNode("value", wo, "scsj.scys", Math.floor(interval / 86400000) + "天" +
                    Math.floor(interval / 3600000) + "小时" + ((interval % 3600000) / 60000).toFixed(2) + "分钟");
                req.db.collection("form_insts").save(wo, function (err) {
                    if (err) return next(error(500, err));
                    res.status(200).json(wo);
                });
            }
            else {
                res.status(400).json({message: "工单不存在"});
            }
        });
    }
    ,
    confirmComplete: function (req, res, next) {
        req.db.collection("form_insts").findOne({"_id": new ObjectID(req.body.id)}, function (err, wo) {
            if (err) return next(error(500, err));
            if (wo) {
                if (req.body.confirm == "true") {
                    wo["status"] = "completed";
                }
                else {
                    wo["status"] = "producing";
                    setToNode("value", wo, "scsj.wcsj", "");
                    setToNode("value", wo, "scsj.scys", "");
                    delete wo["completeProduceDate"];
                }
                req.db.collection("form_insts").save(wo, function (err) {
                    if (err) return next(error(500, err));
                    if (req.body.confirm == "true") {
                        req.db.collection('form_insts').updateOne({'_id': new ObjectId(wo.work_plan_id)}, {
                            $set: {status: "已完工"}
                        }, function (err) {
                            if (err) return next(error(500, err));
                            req.db.collection("form_insts").find({
                                "type.name": "work_plan",
                                "production_plan_id": wo.production_plan_id
                            }).toArray(function (err, wps) {
                                if (err) return next(error(500, err));
                                var com = true;
                                for (var i = 0; i < wps.length; i++) {
                                    if (wps[i].status == "已终止") {
                                        if (wps[i].reArrange) {
                                            continue;
                                        }
                                        else {
                                            com = false;
                                            break;
                                        }
                                    }
                                    else {
                                        if (wps[i].status != "已完工") {
                                            com = false;
                                            break;
                                        }
                                    }
                                }
                                if (com) {
                                    req.db.collection('form_insts').updateOne({'_id': new ObjectId(wo.production_plan_id)}, {
                                        $set: {status: "已完工"}
                                    }, function (err) {
                                        if (err) return next(error(500, err));
                                        res.status(200).json(wo);
                                    })
                                }
                                else {
                                    res.status(200).json(wo);
                                }
                            })
                        })
                    }
                    else {
                        res.status(200).json(wo);
                    }
                });
            }
            else {
                res.status(400).json({message: "工单不存在"});
            }
        });
    }
    ,
    assignWorkOrder: function (req, res, next) {
        req.db.collection("form_insts").findOne({"_id": new ObjectID(req.body.id)}, function (err, wo) {
            if (err) return next(error(500, err));
            if (wo) {
                setToNode("_id", wo, "czg", req.body.userid);
                setToNode("value", wo, "czg", req.body.username);
                req.db.collection("form_insts").save(wo, function (err) {
                    if (err) return next(error(500, err));
                    res.status(200).end();
                });
            }
            else {
                res.status(400).json({message: "工单不存在"});
            }
        });
    }
    ,
    suspendWorkOrder: function (req, res, next) {
        req.db.collection("form_insts").findOne({"_id": new ObjectID(req.body.id)}, function (err, wo) {
            if (err) return next(error(500, err));
            if (wo) {
                wo["status"] = "suspended";
                req.db.collection("form_insts").save(wo, function (err) {
                    if (err) return next(error(500, err));
                    res.status(200).end();
                });
            }
            else {
                res.status(400).json({message: "工单不存在"});
            }
        });
    }
    ,
    changeTeamLeader: function (req, res, next) {
        req.db.collection("form_insts").find({
            "type.name": "work_order",
            "body": {
                $elemMatch: {
                    "_id": req.session.user.id,
                    "name": "bzz"
                }
            },
            "status": {$ne: "completed"}
        }).toArray(function (err, wos) {
            if (err) return next(error(500, err));
            if (wos) {
                for (var i = 0; i < wos.length; i++) {
                    setToNode("value", wos[i], "bzz", req.body.username);
                    setToNode("_id", wos[i], "bzz", req.body.userid);
                    req.db.collection("form_insts").save(wos[i], function (err) {
                        if (err) return next(error(500, err));
                    });
                }
            }
            res.status(200).end();

        })
    },
    scannSpool: function (req, res, next) {
        req.db.collection("form_insts").findOne({
            "type.name": "virtual_library",
            "gzlbh": req.body.gzlbh,
            "cksj": ""
        }, function (err, vl) {
            if (err) return next(error(500, err));
            if (vl) {
                res.status(200).json(vl);
            }
            else {
                res.status(400).json({message: "工字轮信息不存在."});
            }
        });
    }
    ,
    onlineSpool: function (req, res, next) {
        req.db.collection("form_insts").findOne({
            "type.name": "virtual_library",
            "gzlbh": req.body.gzlbh,
            "cksj": ""
        }, function (err, vl) {
            if (err) return next(error(500, err));
            if (vl) {
                req.db.collection("form_insts").updateOne({"_id": vl._id}, {
                    $set: {
                        cksj: new Date().Format("yyyy-MM-dd hh:mm:ss")
                    }
                }, function (err) {
                    if (err) return next(error(500, err));
                    req.db.collection("form_insts").updateOne({"_id": new ObjectID(req.body.id)}, {
                        $addToSet: {
                            "spools.online.present": {"gzlbh": req.body.gzlbh, "id": vl._id},
                            "spools.online.history": {"gzlbh": req.body.gzlbh, "id": vl._id}
                        }
                    }, function (err) {
                        if (err) return next(error(500, err));
                        res.status(200).end();
                    })
                });
            }
            else {
                res.status(400).json({message: "工字轮信息不存在."});
            }
        });
    }
    ,
    getSpool: function (req, res, next) {
        req.db.collection("form_insts").findOne({
            "_id": new ObjectID(req.body.id)
        }, function (err, vl) {
            if (err) return next(error(500, err));
            if (vl) {
                res.status(200).json(vl);
            } else {
                res.status(400).json({message: "工字轮信息不存在."});
            }
        })
    }
    ,
    getPresentOnlineSpools: function (req, res, next) {
        req.db.collection("form_insts").findOne({
            "_id": new ObjectID(req.body.id)
        }, function (err, wo) {
            if (err) return next(error(500, err));
            if (wo) {
                var ids = [];
                var present = wo.spools.online.present;
                for (var i = 0; i < present.length; i++) {
                    ids.push(new ObjectID(present[i].id));
                }
                req.db.collection("form_insts").find({
                    "_id": {$in: ids}
                }).toArray(function (err, vls) {
                    if (err) return next(error(500, err));
                    res.status(200).json(vls);
                })
            }
            else {
                res.status(400).json({message: "工单不存在"});
            }
        })
    }
    ,
    getHistoryOnlineSpools: function (req, res, next) {
        req.db.collection("form_insts").findOne({
            "_id": new ObjectID(req.body.id)
        }, function (err, wo) {
            if (err) return next(error(500, err));
            if (wo) {
                var ids = [];
                var history = wo.spools.online.history;
                for (var i = 0; i < history.length; i++) {
                    ids.push(new ObjectID(history[i].id));
                }
                req.db.collection("form_insts").find({
                    "_id": {$in: ids}
                }).toArray(function (err, vls) {
                    if (err) return next(error(500, err));
                    res.status(200).json(vls);
                })
            }
            else {
                res.status(400).json({message: "工单不存在"});
            }
        })
    }
    ,
    deletePresentOnlineSpool: function (req, res, next) {
        req.db.collection("form_insts").updateOne({"_id": new ObjectID(req.body.id)}, {
            $pull: {"spools.online.present": {"gzlbh": req.body.gzlbh}}
        }, function (err) {
            if (err) return next(error(500, err));
            res.status(200).end();
        })
    }
    ,
    getHistoryOfflineSpools: function (req, res, next) {
        req.db.collection("form_insts").findOne({
            "_id": new ObjectID(req.body.id)
        }, function (err, wo) {
            if (err) return next(error(500, err));
            if (wo) {
                var ids = [];
                var history = wo.spools.offline.history;
                for (var i = 0; i < history.length; i++) {
                    ids.push(new ObjectID(history[i].id));
                }
                req.db.collection("form_insts").find({
                    "_id": {$in: ids}
                }).toArray(function (err, vls) {
                    if (err) return next(error(500, err));
                    res.status(200).json(vls);
                })
            }
            else {
                res.status(400).json({message: "工单不存在"});
            }
        })
    }
    ,
    offlineSpool: function (req, res, next) {
        req.db.collection("form_insts").findOne({
            "_id": new ObjectID(req.body.id)
        }, function (err, wo) {
            if (err) return next(error(500, err));
            if (wo) {
                var vl = {
                        "type": {
                            "name": "virtual_library",
                            "value": "虚拟库存"
                        },
                        "gzlbh": req.body.gzlbh,
                        "gdzzh": getFromNode("value", wo, "gdzzh") || "",
                        "cj": getFromNode("value", wo, "cj") || "",
                        "jth": {
                            "name": getFromNode("value", wo, "jth") || "",
                            "id": getFromNode("_id", wo, "jth") || ""
                        },
                        "bz": [getFromNode("value", wo, "bz")],
                        "bzz": [{
                            "id": getFromNode("_id", wo, "bzz"),
                            "value": getFromNode("value", wo, "bzz")
                        }],
                        "czg": [{
                            "id": getFromNode("_id", wo, "czg"),
                            "value": getFromNode("value", wo, "czg")
                        }],
                        "djmc": req.body.djmc,
                        "comment": req.body.comment || "",
                        "rksj": new Date().Format("yyyy-MM-dd hh:mm:ss"),
                        "cksj": "",
                        "sfdz": getFromNode("value", wo, "sfdz") || "",
                        "zjy": {
                            "id": "",
                            "value": ""
                        },
                        "sfhg": "",
                        "zjsj": "",
                        "bhgyy": "",
                        "sxfs": req.body.sxfs,
                        "production_plan_id": wo.production_plan_id,
                        "work_plan_id": wo.work_plan_id
                    },
                    gdcpNames = ["lb", "zj", "nx", "tyfs", "nj", "tsyq", "qd", "bmzt"],
                    sxfsNames = ["dc", "ds", "gzlxh"],
                    wsx = [],
                    isGss = false,
                    pf = "",
                    date = new Date().Format("yyyy-MM-dd"),
                    zlxs = "";
                switch (wo.alias) {
                    case "ng_work_order":
                        pf = "ngh";
                        vl.alias = "g_virtual_library";
                        gdcpNames.push("jg");
                        getFromNode("value", wo, pf + ".gdcp.lb").indexOf("-") > 0 ? vl.isZjp = "否" : vl.isZjp = "是";
                        zlxs = 0.617;
                        break;
                    case "hs_work_order":
                        pf = "hsh";
                        vl.alias = "s_virtual_library";
                        if (getFromNode("value", wo, pf + ".gdcp.lb") == "钢丝绳") isGss = true;
                        isGss ? gdcpNames.push("gg") : gdcpNames.push("jg");
                        isGss ? vl.isZjp = "否" : vl.isZjp = "是";
                        zlxs = 0.38;
                        break;
                }
                vl.zl = accMul(getFromNode("value", wo, pf + ".gdcp.zj"), getFromNode("value", wo, pf + ".gdcp.zj"),
                        vl.djmc, zlxs) / 100;
                for (var i = 0; i < gdcpNames.length; i++) {
                    vl[gdcpNames[i]] = getFromNode("value", wo, pf + ".gdcp." + gdcpNames[i]);
                }
                for (var i = 0; i < sxfsNames.length; i++) {
                    vl[sxfsNames[i]] = getFromNode("value", wo, pf + ".sxfs.sxfs" + vl.sxfs + "." + sxfsNames[i]);
                }
                if (checkNodeExist(wo, "gdls")) {
                    var gdls = getFromNode("json", wo, "gdls");
                    for (var i = 0; i < gdls.children.length; i++) {
                        if (gdls.children[i].wsx == true) {
                            wsx.push(gdls.children[i]);
                        }
                    }
                }
                if (wsx.length > 0) {
                    var mul = [], zwcmc = 0, lbzz, lczg;
                    for (var i = 0; i < wsx.length; i++) {
                        var bz, bzz, czg, wcmc;
                        for (var j = 0; j < wsx.children.length; j++) {
                            if (wsx.children[j].name == "bz")bz = wsx.children[j].value;
                            if (wsx.children[j].name == "bzz")bzz = {
                                "id": wsx.children[j]._id,
                                "value": wsx.children[j].value
                            }
                            if (wsx.children[j].name == "czg")czg = {
                                "id": wsx.children[j]._id,
                                "value": wsx.children[j].value
                            }
                            if (wsx.children[j].name == "sjcl") {
                                for (var k = 0; k < wsx.children[j].children.length; k++) {
                                    if (wsx.children[j].children[k].name == "wsxmc") {
                                        wcmc = wsx.children[j].children[k].value;
                                        break;
                                    }
                                }
                            }
                        }
                        vl.bz.push(_.cloneDeep(bz));
                        vl.bzz.push(_.cloneDeep(bzz));
                        vl.czg.push(_.cloneDeep(czg));
                        czg.wcmc = wcmc;
                        zwcmc = accAdd(zwcmc, wcmc);
                        if (mul.length > 0 && mul[mul.length - 1].id == bzz.id) {
                            mul[mul.length - 1].children.push(czg);
                        }
                        else {
                            bzz.bz = bz;
                            bzz.children = [czg];
                            mul.push(bzz)
                        }
                    }
                    lczg = _.cloneDeep(vl.czg[0]);
                    lczg.wcmc = accSub(vl.djmc, zwcmc);
                    setToNode("value", wo, "sjcl.ysxmc", accAdd(getFromNode("value", wo, "sjcl.ysxmc"), lczg.wcmc));
                    if (mul.length > 0 && mul[mul.length - 1].id == vl.bzz[0].id) {
                        mul[mul.length - 1].children.push(lczg);
                    }
                    else {
                        lbzz = _.cloneDeep(vl.bzz[0]);
                        lbzz.bz = vl.bz[0];
                        lbzz.children = [lczg];
                        mul.push(lbzz)
                    }
                    vl.mul = mul;
                    unique(vl.bz);
                    unique(vl.bzz, "id");
                    unique(vl.czg, "id");
                    for (var i = 0; i < wsx.length; i++) {
                        delete wsx[i].wsx;
                    }
                }
                else {
                    vl.mul = [{
                        "id": vl.bzz[0].id,
                        "value": vl.bzz[0].value,
                        "bz": vl.bz[0],
                        "children": [
                            {
                                "id": vl.czg[0].id,
                                "value": vl.czg[0].value
                            }
                        ]
                    }]
                    setToNode("value", wo, "sjcl.ysxmc", accAdd(getFromNode("value", wo, "sjcl.ysxmc"), vl.djmc));
                }
                for (var i = 0; i < vl.bzz.length; i++) {
                    vl.bzz[i] = vl.bzz[i].value;
                }
                for (var i = 0; i < vl.czg.length; i++) {
                    vl.czg[i] = vl.czg[i].value;
                }
                vl.bz = vl.bz.join(",");
                vl.bzz = vl.bzz.join(",");
                vl.czg = vl.czg.join(",");
                setToNode("value", wo, "sjzcl.zmc", accAdd(getFromNode("value", wo, "sjzcl.zmc"), vl.djmc));
                setToNode("value", wo, "sjzcl.sxfs" + vl.sxfs + ".zjs", accAdd(getFromNode("value", wo, "sjzcl.sxfs" +
                    vl.sxfs + ".zjs"), 1));
                setToNode("value", wo, "sjzcl.sxfs" + vl.sxfs + ".zmc", accAdd(getFromNode("value", wo, "sjzcl.sxfs" +
                    vl.sxfs + ".zmc"), vl.djmc));
                req.db.collection("form_insts").insertOne(vl, function (err, result) {
                    if (err) return next(error(500, err));
                    wo.spools.offline.history.push({"gzlbh": req.body.gzlbh, "id": result.insertedId});
                    req.db.collection("form_insts").save(wo, function (err) {
                        if (err) return next(error(500, err));
                        req.db.collection("form_insts").findOne({"_id": new ObjectID(wo.work_plan_id)}, function
                            (err, wp) {
                            if (err) return next(error(500, err));
                            if (checkNodeExist(wp, "sjcl")) {
                                setToNode("value", wp, "sjcl.ljwccl.zjs", accAdd(
                                    getFromNode("value", wp, "sjcl.ljwccl.zjs"), 1));
                                setToNode("value", wp, "sjcl.ljwccl.zmc", accAdd(
                                    getFromNode("value", wp, "sjcl.ljwccl.zmc"), vl.djmc));
                                setToNode("value", wp, "sjcl.ljwccl.sxfs" + vl.sxfs + ".zjs", accAdd(
                                    getFromNode("value", wp, "sjcl.ljwccl.sxfs" + vl.sxfs + ".zjs"), 1));
                                setToNode("value", wp, "sjcl.ljwccl.sxfs" + vl.sxfs + ".zmc", accAdd(
                                    getFromNode("value", wp, "sjcl.ljwccl.sxfs" + vl.sxfs + ".zmc"), vl.djmc));
                                setToNode("value", wp, "sjcl.wwccl.zjs", accSub(
                                    getFromNode("value", wp, "sjcl.wwccl.zjs"), 1));
                                setToNode("value", wp, "sjcl.wwccl.zmc", accSub(
                                    getFromNode("value", wp, "sjcl.wwccl.zmc"), vl.djmc));
                                setToNode("value", wp, "sjcl.wwccl.sxfs" + vl.sxfs + ".zjs", accSub(
                                    getFromNode("value", wp, "sjcl.wwccl.sxfs" + vl.sxfs + ".zjs"), 1));
                                setToNode("value", wp, "sjcl.wwccl.sxfs" + vl.sxfs + ".zmc", accSub(
                                    getFromNode("value", wp, "sjcl.wwccl.sxfs" + vl.sxfs + ".zmc"), vl.djmc));
                                if (checkNodeExist(wp, "sjcl.rcl." + date)) {
                                    setToNode("value", wp, "sjcl.rcl." + date + ".zjs",
                                        accAdd(getFromNode("value", wp, "sjcl.rcl." + date + ".zjs"), 1));
                                    setToNode("value", wp, "sjcl.rcl." + date + ".zmc",
                                        accAdd(getFromNode("value", wp, "sjcl.rcl." + date + ".zmc"), vl.djmc));
                                    if (checkNodeExist(wp, "sjcl.rcl." + date + ".sxfs" + vl.sxfs)) {
                                        setToNode("value", wp, "sjcl.rcl." + date + ".sxfs" + vl.sxfs + ".zjs",
                                            accAdd(getFromNode("value", wp, "sjcl.rcl." + date + ".sxfs" + vl.sxfs +
                                                ".zjs"), 1));
                                        setToNode("value", wp, "sjcl.rcl." + date + ".sxfs" + vl.sxfs + ".zmc",
                                            accAdd(getFromNode("value", wp, "sjcl.rcl." + date + ".sxfs" + vl.sxfs +
                                                ".zmc"), vl.djmc));
                                    }
                                    else {
                                        getFromNode("json", wp, "sjcl.rcl." + date).children.push({
                                            "text": "收线方式" + vl.sxfs,
                                            "name": "sxfs" + vl.sxfs,
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "总件数",
                                                    "name": "zjs",
                                                    "value": 1
                                                },
                                                {
                                                    "text": "总米长",
                                                    "name": "zmc",
                                                    "unit": "m",
                                                    "value": vl.djmc
                                                }
                                            ]
                                        })
                                    }
                                }
                                else {
                                    getFromNode("json", wp, "sjcl.rcl").children.push({
                                        "text": date,
                                        "name": date,
                                        "type": "folder",
                                        "children": [
                                            {
                                                "text": "总件数",
                                                "name": "zjs",
                                                "value": 1
                                            },
                                            {
                                                "text": "总米长",
                                                "name": "zmc",
                                                "unit": "m",
                                                "value": vl.djmc
                                            },
                                            {
                                                "text": "收线方式" + vl.sxfs,
                                                "name": "sxfs" + vl.sxfs,
                                                "type": "folder",
                                                "children": [
                                                    {
                                                        "text": "总件数",
                                                        "name": "zjs",
                                                        "value": 1
                                                    },
                                                    {
                                                        "text": "总米长",
                                                        "name": "zmc",
                                                        "unit": "m",
                                                        "value": vl.djmc
                                                    }
                                                ]
                                            }]
                                    })
                                }
                            }
                            else {
                                wp.body.push({
                                    "text": "实际产量",
                                    "type": "folder",
                                    "name": "sjcl",
                                    "children": [
                                        {
                                            "text": "累计完成产量",
                                            "name": "ljwccl",
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "总件数",
                                                    "name": "zjs",
                                                    "value": 1
                                                },
                                                {
                                                    "text": "总米长",
                                                    "name": "zmc",
                                                    "unit": "m",
                                                    "value": vl.djmc
                                                }
                                            ]
                                        },
                                        {
                                            "text": "未完成产量",
                                            "name": "wwccl",
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "总件数",
                                                    "name": "zjs"
                                                },
                                                {
                                                    "text": "总米长",
                                                    "name": "zmc",
                                                    "unit": "m",
                                                    "value": accSub(getFromNode("value", wp, "cljh.jhcl"), vl.djmc)
                                                }
                                            ]
                                        },
                                        {
                                            "text": "日产量",
                                            "name": "rcl",
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": date,
                                                    "name": date,
                                                    "type": "folder",
                                                    "children": [
                                                        {
                                                            "text": "总件数",
                                                            "name": "zjs",
                                                            "value": 1
                                                        },
                                                        {
                                                            "text": "总米长",
                                                            "name": "zmc",
                                                            "unit": "m",
                                                            "value": vl.djmc
                                                        },
                                                        {
                                                            "text": "收线方式" + vl.sxfs,
                                                            "name": "sxfs" + vl.sxfs,
                                                            "type": "folder",
                                                            "children": [
                                                                {
                                                                    "text": "总件数",
                                                                    "name": "zjs",
                                                                    "value": 1
                                                                },
                                                                {
                                                                    "text": "总米长",
                                                                    "name": "zmc",
                                                                    "unit": "m",
                                                                    "value": vl.djmc
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }]
                                        }
                                    ]
                                });
                                tree.expire(wp);
                                var wpSxfss = getFromNode("sxfss", wp, "scyq.cpyq.sxfs");
                                var wpZjs = 0;
                                for (var i = wpSxfss.begin; i < wpSxfss.begin + wpSxfss.total; i++) {
                                    wpZjs = accAdd(wpZjs, getFromNode("value", wp, "scyq.cpyq.sxfs.sxfs" + i + ".js"));
                                    var s = {
                                        "text": "收线方式" + i,
                                        "name": "sxfs" + i,
                                        "type": "folder",
                                        "children": [
                                            {
                                                "text": "总件数",
                                                "name": "zjs",
                                                "value": 0
                                            },
                                            {
                                                "text": "总米长",
                                                "name": "zmc",
                                                "unit": "m",
                                                "value": 0
                                            }
                                        ]
                                    }
                                    getFromNode("json", wp, "sjcl.ljwccl").children.push(_.cloneDeep(s));
                                    getFromNode("json", wp, "sjcl.wwccl").children.push(_.cloneDeep(s));
                                }
                                tree.expire(wp);
                                setToNode("value", wp, "sjcl.wwccl.zjs", accSub(wpZjs, 1));
                                setToNode("value", wp, "sjcl.ljwccl.sxfs" + vl.sxfs + ".zjs", 1);
                                setToNode("value", wp, "sjcl.ljwccl.sxfs" + vl.sxfs + ".zmc", vl.djmc);
                                setToNode("value", wp, "sjcl.wwccl.sxfs" + vl.sxfs + ".zjs", accSub(
                                    getFromNode("value", wp, "scyq.cpyq.sxfs.sxfs" + vl.sxfs + ".js"), 1));
                                setToNode("value", wp, "sjcl.wwccl.sxfs" + vl.sxfs + ".zmc", accSub(
                                    isGss ? getFromNode("value", wp, "scyq.cpyq.sxfs.sxfs" + vl.sxfs + ".zmc") :
                                        getFromNode("value", wp, "scyq.cpyq.sxfs.sxfs" + vl.sxfs + ".zscmc"), vl.djmc));
                            }
                            req.db.collection("form_insts").save(wp, function (err) {
                                if (err) return next(error(500, err));
                                req.db.collection("form_insts").findOne({"_id": new ObjectID(wo.production_plan_id)}, function
                                    (err, pp) {
                                    if (err) return next(error(500, err));
                                    if (checkNodeExist(pp, "sjcl")) {
                                        setToNode("value", pp, "sjcl.ljwccl.zjs", accAdd(
                                            getFromNode("value", pp, "sjcl.ljwccl.zjs"), 1));
                                        setToNode("value", pp, "sjcl.ljwccl.zmc", accAdd(
                                            getFromNode("value", pp, "sjcl.ljwccl.zmc"), vl.djmc));
                                        setToNode("value", pp, "sjcl.wwccl.zjs", accSub(
                                            getFromNode("value", pp, "sjcl.wwccl.zjs"), 1));
                                        setToNode("value", pp, "sjcl.wwccl.zmc", accSub(
                                            getFromNode("value", pp, "sjcl.wwccl.zmc"), vl.djmc));
                                        if (checkNodeExist(pp, "sjcl.rcl." + date)) {
                                            setToNode("value", pp, "sjcl.rcl." + date + ".zjs", accAdd(
                                                getFromNode("value", pp, "sjcl.rcl." + date + ".zjs"), 1));
                                            setToNode("value", pp, "sjcl.rcl." + date + ".zmc", accAdd(
                                                getFromNode("value", pp, "sjcl.rcl." + date + ".zmc"), vl.djmc));
                                        }
                                        else {
                                            getFromNode("json", pp, "sjcl.rcl").children.push({
                                                "text": date,
                                                "name": date,
                                                "type": "folder",
                                                "children": [
                                                    {
                                                        "text": "总件数",
                                                        "name": "zjs",
                                                        "value": 1
                                                    },
                                                    {
                                                        "text": "总米长",
                                                        "name": "zmc",
                                                        "unit": "m",
                                                        "value": vl.djmc
                                                    }
                                                ]
                                            })
                                        }
                                    }
                                    else {
                                        var ppSxfss = getFromNode("sxfss", pp, pf + ".sxfs");
                                        var ppZjs = 0;
                                        for (var i = ppSxfss.begin; i < ppSxfss.begin + ppSxfss.total; i++) {
                                            ppZjs = accAdd(ppZjs, getFromNode("value", pp, pf + ".sxfs.sxfs" + i + ".js"));
                                        }
                                        pp.body.push({
                                            "text": "实际产量",
                                            "name": "sjcl",
                                            "unit": "m",
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "累计完成产量",
                                                    "name": "ljwccl",
                                                    "unit": "m",
                                                    "type": "folder",
                                                    "children": [
                                                        {
                                                            "text": "总件数",
                                                            "name": "zjs",
                                                            "value": 1
                                                        },
                                                        {
                                                            "text": "总米长",
                                                            "name": "zmc",
                                                            "unit": "m",
                                                            "value": vl.djmc
                                                        }
                                                    ]
                                                },
                                                {
                                                    "text": "未完成产量",
                                                    "name": "wwccl",
                                                    "unit": "m",
                                                    "type": "folder",
                                                    "children": [
                                                        {
                                                            "text": "总件数",
                                                            "name": "zjs",
                                                            "value": accSub(ppZjs, 1)
                                                        },
                                                        {
                                                            "text": "总米长",
                                                            "name": "zmc",
                                                            "unit": "m",
                                                            "value": accSub(getFromNode("value", pp, "cljh.jhcl"), vl.djmc)
                                                        }
                                                    ]
                                                },
                                                {
                                                    "text": "日产量",
                                                    "name": "rcl",
                                                    "type": "folder",
                                                    "children": [
                                                        {
                                                            "text": date,
                                                            "name": date,
                                                            "type": "folder",
                                                            "children": [
                                                                {
                                                                    "text": "总件数",
                                                                    "name": "zjs",
                                                                    "value": 1
                                                                },
                                                                {
                                                                    "text": "总米长",
                                                                    "name": "zmc",
                                                                    "unit": "m",
                                                                    "value": vl.djmc
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        })
                                    }
                                    req.db.collection("form_insts").save(pp, function (err) {
                                        if (err) return next(error(500, err));
                                        res.status(200).end();
                                    })
                                })
                            })
                        });
                    });
                });
            }
            else {
                res.status(400).json({message: "工单不存在."});
            }
        });
    }
    ,
    checkProduct: function (req, res, next) {
        req.db.collection("form_insts").findOne({
            "type.name": "virtual_library",
            "gzlbh": req.body.gzlbh,
            "cksj": ""
        }, function (err, vl) {
            if (err) return next(error(500, err));
            if (vl) {
                vl.zjy = {
                    "id": req.session.user.id,
                    "name": req.session.user.name
                }
                req.db.collection("form_insts").save(vl, function (err) {
                    if (err) return next(error(500, err));
                    res.status(200).end();
                })
            }
            else {
                res.status(400).json({message: "工字轮信息不存在."});
            }
        })
    }
    ,
    getProduct: function (req, res, next) {
        req.db.collection("form_insts").findOne({
            "_id": new ObjectID(req.body.id)
        }, function (err, vl) {
            if (err) return next(error(500, err));
            if (vl) {
                res.status(200).json(vl);
            }
            else {
                res.status(400).json({message: "产品信息不存在."});
            }
        })
    },
    qualifyProduct: function (req, res, next) {
        req.db.collection("form_insts").findOne({
            "_id": new ObjectID(req.body.id)
        }, function (err, vl) {
            if (err) return next(error(500, err));
            if (vl) {
                var sfhg = vl.sfhg;
                if (sfhg == "合格") {
                    res.status(200).end();
                }
                else {
                    vl.sfhg = "合格";
                    vl.zjsj = new Date().Format("yyyy-MM-dd hh:mm");
                    vl.bhgyy = "";
                    req.db.collection("form_insts").save(vl, function (err) {
                        if (err) return next(error(500, err));
                        if (vl.sxfs && sfhg == "不合格") {
                            req.db.collection("form_insts").findOne({
                                "_id": new ObjectID(vl.work_plan_id)
                            }, function (err, wp) {
                                if (err) return next(error(500, err));
                                if (getFromNode("value", wp, "sjcl.bhgp.zjs") == 1) {
                                    deleteFromNode(wp, "sjcl", "bhgp");
                                }
                                else {
                                    setToNode("value", wp, "sjcl.bhgp.zjs", accSub(getFromNode("value", wp, "sjcl.bhgp.zjs"), 1));
                                    setToNode("value", wp, "sjcl.bhgp.zmc", accSub(getFromNode("value", wp, "sjcl.bhgp.zmc"), vl.djmc));
                                    if (getFromNode("value", wp, "sjcl.bhgp.sxfs" + vl.sxfs + ".zjs") == 1) {
                                        deleteFromNode(wp, "sjcl.bhgp", "sxfs" + vl.sxfs);
                                    }
                                    else {
                                        setToNode("value", wp, "sjcl.bhgp.sxfs" + vl.sxfs + ".zjs", accSub(
                                            getFromNode("value", wp, "sjcl.bhgp.sxfs" + vl.sxfs + ".zjs"), 1));
                                        setToNode("value", wp, "sjcl.bhgp.sxfs" + vl.sxfs + ".zmc", accSub(
                                            getFromNode("value", wp, "sjcl.bhgp.sxfs" + vl.sxfs + ".zmc"), vl.djmc));
                                    }
                                }
                                req.db.collection("form_insts").save(wp, function (err) {
                                    if (err) return next(error(500, err));
                                    req.db.collection("form_insts").findOne({
                                        "_id": new ObjectID(vl.production_plan_id)
                                    }, function (err, pp) {
                                        if (getFromNode("value", pp, "sjcl.bhgp.zjs") == 1) {
                                            deleteFromNode(pp, "sjcl", "bhgp");
                                        }
                                        else {
                                            setToNode("value", pp, "sjcl.bhgp.zjs", accSub(
                                                getFromNode("value", pp, "sjcl.bhgp.zjs"), 1));
                                            setToNode("value", pp, "sjcl.bhgp.zmc", accSub(
                                                getFromNode("value", pp, "sjcl.bhgp.zmc"), vl.djmc));
                                        }
                                        req.db.collection("form_insts").save(pp, function (err) {
                                            if (err) return next(error(500, err));
                                            res.status(200).end();
                                        })
                                    })
                                })

                            });
                        }
                        else {
                            res.status(200).end();
                        }
                    })
                }

            }
            else {
                res.status(400).json({message: "产品信息不存在."});
            }
        })
    },
    unqualifyProduct: function (req, res, next) {
        req.db.collection("form_insts").findOne({
            "_id": new ObjectID(req.body.id)
        }, function (err, vl) {
            if (err) return next(error(500, err));
            if (vl) {
                if (vl.sfhg == "不合格") {
                    if (req.body.reason == vl.bhgyy) {
                        res.status(200).end();
                    }
                    else {
                        vl.bhgyy = req.body.reason;
                        vl.zjsj = new Date().Format("yyyy-MM-dd hh:mm");
                        req.db.collection("form_insts").save(vl, function (err) {
                            if (err) return next(error(500, err));
                            res.status(200).end();
                        })
                    }
                }
                else {
                    vl.sfhg = "不合格";
                    vl.bhgyy = req.body.reason;
                    vl.zjsj = new Date().Format("yyyy-MM-dd hh:mm");
                    req.db.collection("form_insts").save(vl, function (err) {
                        if (err) return next(error(500, err));
                        if (vl.sxfs) {
                            req.db.collection("form_insts").findOne({
                                "_id": new ObjectID(vl.work_plan_id)
                            }, function (err, wp) {
                                if (err) return next(error(500, err));
                                if (checkNodeExist(wp, "sjcl.bhgp")) {
                                    setToNode("value", wp, "sjcl.bhgp.zjs",
                                        accAdd(getFromNode("value", wp, "sjcl.bhgp.zjs"), 1));
                                    setToNode("value", wp, "sjcl.bhgp.zmc",
                                        accAdd(getFromNode("value", wp, "sjcl.bhgp.zmc"), vl.djmc))
                                    if (checkNodeExist(wp, "sjcl.bhgp.sxfs" + vl.sxfs)) {
                                        setToNode("value", wp, "sjcl.bhgp.sxfs" + vl.sxfs + ".zjs",
                                            accAdd(getFromNode("value", wp, "sjcl.bhgp.sxfs" + vl.sxfs + ".zjs"), 1));
                                        setToNode("value", wp, "sjcl.bhgp.sxfs" + vl.sxfs + ".zmc",
                                            accAdd(getFromNode("value", wp, "sjcl.bhgp.sxfs" + vl.sxfs + ".zmc"), vl.djmc))
                                    }
                                    else {
                                        getFromNode("json", wp, "sjcl.bhgp").children.push({
                                            "text": "收线方式" + vl.sxfs,
                                            "name": "sxfs" + vl.sxfs,
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "总件数",
                                                    "name": "zjs",
                                                    "value": 1
                                                },
                                                {
                                                    "text": "总米长",
                                                    "name": "zmc",
                                                    "unit": "m",
                                                    "value": vl.djmc
                                                }
                                            ]
                                        })
                                    }
                                }
                                else {
                                    getFromNode("json", wp, "sjcl").children.push({
                                        "text": "不合格品",
                                        "name": "bhgp",
                                        "type": "folder",
                                        "children": [
                                            {
                                                "text": "总件数",
                                                "name": "zjs",
                                                "value": 1
                                            },
                                            {
                                                "text": "总米长",
                                                "name": "zmc",
                                                "unit": "m",
                                                "value": vl.djmc
                                            },
                                            {
                                                "text": "收线方式" + vl.sxfs,
                                                "name": "sxfs" + vl.sxfs,
                                                "type": "folder",
                                                "children": [
                                                    {
                                                        "text": "总件数",
                                                        "name": "zjs",
                                                        "value": 1
                                                    },
                                                    {
                                                        "text": "总米长",
                                                        "name": "zmc",
                                                        "unit": "m",
                                                        "value": vl.djmc
                                                    }
                                                ]
                                            }
                                        ]
                                    })
                                }
                                req.db.collection("form_insts").save(wp, function (err) {
                                    if (err) return next(error(500, err));
                                    req.db.collection("form_insts").findOne({
                                        "_id": new ObjectID(vl.production_plan_id)
                                    }, function (err, pp) {
                                        if (err) return next(error(500, err));
                                        if (checkNodeExist(pp, "sjcl.bhgp")) {
                                            setToNode("value", pp, "sjcl.bhgp.zjs", accAdd(getFromNode("value", pp,
                                                "sjcl.bhgp.zjs"), 1));
                                            setToNode("value", pp, "sjcl.bhgp.zmc", accAdd(getFromNode("value", pp,
                                                "sjcl.bhgp.zmc"), vl.djmc));
                                        }
                                        else {
                                            getFromNode("json", pp, "sjcl").children.push({
                                                    "text": "不合格品",
                                                    "name": "bhgp",
                                                    "type": "folder",
                                                    "children": [
                                                        {
                                                            "text": "总件数",
                                                            "name": "zjs",
                                                            "value": 1
                                                        },
                                                        {
                                                            "text": "总米长",
                                                            "name": "zmc",
                                                            "unit": "m",
                                                            "value": vl.djmc
                                                        }
                                                    ]
                                                }
                                            )
                                        }
                                        req.db.collection("form_insts").save(pp, function (err) {
                                            if (err) return next(error(500, err));
                                            res.status(200).end();
                                        })
                                    })
                                })
                            })
                        }
                        else {
                            res.status(200).end();
                        }

                    })
                }
            }
            else {
                res.status(400).json({message: "产品信息不存在."});
            }
        })
    },
    getUncheckedProducts: function (req, res, next) {
        req.db.collection("form_insts").find({
            "type.name": "virtual_library",
            "zjy.id": req.session.user.id,
            "sfhg": {$eq: ""}
        }).toArray(function (err, vls) {
            if (err) return next(error(500, err));
            res.status(200).json(vls);
        })
    },
    getCheckedProducts: function (req, res, next) {
        req.db.collection("form_insts").find({
            "type.name": "virtual_library",
            "zjy.id": req.session.user.id,
            "sfhg": {$ne: ""}
        }).toArray(function (err, vls) {
            if (err) return next(error(500, err));
            res.status(200).json(vls);
        })
    }
    ,
    getFormById: function (req, res, next) {
        req.db.collection("forms").findOne({"_id": new ObjectID(req.query.id)}, function (err, doc) {
            if (err) return next(error(500, err));

            res.status(200).json(doc);
        });
    }
    ,
    // create form instance
    createFormInst: function (req, res, next) {
        var formInst = req.body.form;
        formInst.tmpl_id = new ObjectID(formInst.tmpl_id);
        req.db.collection("form_insts").insertOne(formInst, function (err, result) {
            if (err) return next(error(500, err));
            console.log("created form instance", result.insertedCount);

            formInst._id = result.insertedId;

            ihEngine.createOrderItems([formInst], req.db, req.session.user, function (err) {
                if (err) return next(err);

                req.db.collection("users").updateOne({"_id": new ObjectID(req.session.user.id)}, {$addToSet: {forms: formInst._id}},
                    function (err, result) {
                        if (err) return next(error(500, err));

                        res.status(200).json({id: formInst._id});
                    });
            });
        });
    }
    ,
    createForm: function (req, res, next) {
        var formInst = req.body.form;
        formInst.tmpl_id = new ObjectID(formInst.tmpl_id);
        req.db.collection("form_insts").insertOne(formInst, function (err, result) {
            if (err) return next(error(500, err));
            res.status(200).end();
        });
    }
    ,
    createForms: function (req, res, next) {
        var forms = JSON.parse(req.body.forms);
        for (var i = 0; i < forms.length; i++) {
            forms[i].tmpl_id = new ObjectID(forms[i].tmpl_id);
        }
        req.db.collection("form_insts").insertMany(forms, function (err, result) {
            if (err) return next(error(500, err));
            res.status(200).end();
        });
    }
    ,
    listFormInsts: function (req, res, next) {
        // verify if user has the permission for this form
        var perms = req.session.user.perms, formPerm = {}, criteria = {"_id": new ObjectID(req.query.form_id)};
        if (perms && perms.length > 0) {
            var found = false;
            for (var i = 0; i < perms.length; i++) {
                if (perms[i].form_id === req.query.form_id) {
                    found = true;
                    formPerm = perms[i];
                    break;
                }
            }
            if (!found) return res.status(401).json({message: "没有合适的权限"});

            // get all form instances matching the incoming template form id
            req.db.collection("forms").findOne(criteria, function (err, form) {
                if (err) return next(error(500, err));
                var insts = [];
                var filter = {'tmpl_id': form.ref_form._id};
                if (req.query.isMerged == "false") {
                    filter["isMerged"] = false;
                }
                req.db.collection("form_insts").find(filter).toArray(function (err, docs) {
                    if (err) return next(error(500, err));
                    // 从内部表（有实际数据）拷贝到用户定义表单结构中
                    //for (var i = 0; i < docs.length; i++) {
                    //    var inst = _.cloneDeep(form, function (val) {
                    //        if (val instanceof ObjectID) {
                    //            return val.toString();
                    //        }
                    //    });
                    //    assignBodyValue(docs[i], inst.body, [], null);
                    //    inst._id = docs[i]._id;
                    //    inst.status = docs[i].status;
                    //    inst.header = docs[i].header;
                    //    inst.data = docs[i].data;
                    //
                    //    insts.push(inst);
                    //}
                    res.status(200).json({formInsts: docs, formPerm: formPerm});    // also pass permission for this form
                });
            });
        } else {
            // 工人没有权限,但是可以是被指派的操作工
            req.db.collection('form_insts').find({
                $and: [{assigned_worker: new ObjectID(req.session.user.id)}, {tmpl_id: new ObjectID(req.query.form_id)}]
            }).toArray(function (err, docs) {
                if (err) return next(error(500, err));

                res.status(200).json({formInsts: docs, formPerm: {}});    // also pass permission for this form
            });
        }
        /**
         * 从src到dest树赋值. dest是用户自己生成的表单,包含自己选择的字段. src是系统基本表的实例.
         * 要根据用户表单的结构定义, 找到基本表实例中相应的数据, 拷贝到用户表中
         *
         * @param src 整个tree. 系统基本表的实例
         * @param dest 是tree的body数组,而不是整个tree. 用户自己生成的表单
         * @param path
         * @param parent
         */
        function assignBodyValue(src, dest, path, parent) {
            if (dest instanceof Array) {
                for (var i = 0; i < dest.length; i++) {
                    assignBodyValue(src, dest[i], path, parent);
                }
            } else {
                if (dest.repeat === 'n') {
                    var pathStr = path.join('.') + '.' + dest.name;
                    var srcNode = tree.get(src, pathStr);
                    // 复制层数；因为层数是由实例决定的，而不是模版决定
                    if (srcNode && +srcNode.repeat >= 1) {   // 找到其他的层数, 加入到dest中
                        var repeat = +srcNode.repeat;
                        for (var i = 2; i <= repeat; i++) {
                            parent.push(tree.get(src, path.join('.') + '.' + dest.name.replace('1', i)));
                        }
                    }
                    dest.text = dest.text.replace('N', '1');
                }
                path.push(dest.name);
                if (dest.children) {
                    for (var i = 0; i < dest.children.length; i++) {
                        var tmpPath = path.join('.') + '.' + dest.children[i].name;
                        // 如果节点只在模版中有,而不在实例中,说明被删除掉了,比如金属芯, 纤维芯; 也要在模版中删除
                        if (tree.get(src, tmpPath) === undefined) {
                            dest.children.splice(i, 1);
                            i--;
                        } else {
                            assignBodyValue(src, dest.children[i], path, dest.children);
                        }
                    }
                }
                var tmp = tree.get(src, path.join("."));
                if (tmp.value) dest.value = tmp.value;
                if (tmp.repeat) dest.repeat = tmp.repeat;
                if (tmp.sxfss) dest.sxfss = tmp.sxfss;
                path.pop();
            }
        }
    }
    ,

    listFormInstsByIds: function (req, res, next) {
        var ids = JSON.parse(req.query.ids);
        for (var i = 0; i < ids.length; i++) {
            ids[i] = new ObjectID(ids[i]);
        }
        req.db.collection("form_insts").find({"_id": {$in: ids}}).toArray(function (err, docs) {
            if (err) return next(error(500, err));
            res.status(200).json(docs);
        });
    }
    ,
    getFormInstById: function (req, res, next) {
        req.db.collection("form_insts").findOne({"_id": new ObjectID(req.query.id)}, function (err, doc) {
            if (err) return next(error(500, err));
            res.status(200).json(doc);
        });
    }
    ,

    getUsersByRole: function (req, res, next) {
        var roles = [req.query.role];
        if (req.query.role === "operator") {
            roles = "";
        }
        req.db.collection("users").find({"roles": {$size: 0}}).toArray(function (err, docs) {
            if (err) return next(error(500, err));

            res.status(200).json({workers: docs});
        });
    }
    ,

    deleteFormInst: function (req, res, next) {
        req.db.collection("form_insts").deleteOne({"_id": new ObjectID(req.body.id)}, function (err, result) {
            if (err) return next(error(500, err));
            console.log("deleted", result.deletedCount);
            res.status(200).json({deleted: result.deletedCount});
        });
    }
    ,

    updateOrderPlanInst: function (req, res, next) {
        var updatesObj = req.body.updates, id, fields;
        var updates = [];
        for (var o in updatesObj) {
            updates.push({id: o, fields: updatesObj[o]});
        }
        async.eachSeries(updates, function (update, cb) {
            // 读取会原始表单实例
            req.db.collection('form_insts').findOne({'_id': new ObjectID(update.id)}, function (err, doc) {
                if (err) return next(error(500, err));

                // 把修改的字段更新到实例上
                update.fields.forEach(function (u) {
                    tree.set(doc, u.name, u.value);
                });
                req.db.collection('form_insts').updateOne({'_id': doc._id}, {$set: {body: doc.body}}, function (err, result) {
                    console.log("updated", result.modifiedCount);
                    cb();
                });
            });
        }, function (err) {
            if (err) return next(error(500, err));
            res.status(200).json({message: "OK"});
        });
    }
    ,

    // 每个field都包含修改字段的路径,和新的数值
    updateFormInst: function (req, res, next) {
        if (req.body.updates.length === 0) {
            res.status(200).json({message: "No update"});
        }
        // 读取原始表单实例
        req.db.collection('form_insts').findOne({'_id': new ObjectID(req.body.id)}, function (err, doc) {
            if (err) return next(error(500, err));

            // 把修改的字段更新到实例上
            req.body.updates.forEach(function (u) {
                tree.set(doc, u.name, u.value);
            });

            req.db.collection('form_insts').updateOne({'_id': doc._id}, {$set: {body: doc.body}}, function (err, result) {
                if (err) return next(error(500, err));
                console.log("updated", result.modifiedCount);

                res.status(200).json({message: "OK"});
            });
        });
    }
    ,

    // 更新订单分解表data里面的数值
    updateOrderItem: function (req, res, next) {
        var id = new ObjectID(req.body.id);
        req.db.collection('form_insts').findOne({'_id': id}, {data: 1, header: 1}, function (err, doc) {
            if (err) return next(error(500, err));

            var data = doc.data[req.body.node_id], changed = [];
            var body = req.body;
            for (var p in body) {
                for (var i = 0; i < data.length; i++) {
                    if (p === data[i].name) {
                        if (body[p] !== data[i].value) {
                            data[i].value = body[p];
                            changed.push(data[i]);
                        }
                        break;
                    }
                }
            }

            var setValue = {};
            setValue["data." + req.body.node_id] = data;
            setValue.header = updateAuthor(doc.header, req.session.user);
            req.db.collection('form_insts').updateOne({'_id': id}, {$set: setValue}, function (err, result) {
                if (err) return next(error(500, err));
                console.log("modified", result.modifiedCount);
                res.status(200).json({modified: result.modifiedCount, changed: changed});
            });
        });
    }
    ,

    updateHSCS: function (req, res, next) {
        var id = new ObjectID(req.body.id);
        req.db.collection('form_insts').findOne({'_id': id}, function (err, doc) {
            if (err) return next(error(500, err));

            ihEngine.updateHSCS(doc, +req.body.hscs, req.body['csHsList[]']);

            req.db.collection('form_insts').updateOne({'_id': id}, {
                $set: {
                    body: doc.body,
                    data: doc.data,
                    maxId: doc.maxId,
                    header: updateAuthor(doc.header, req.session.user)
                }
            }, function (err, result) {
                if (err) return next(error(500, err));
                console.log("update hscs for orderitem", result.modifiedCount);
                res.status(200).json({modified: result.modifiedCount, orderItem: doc});
            });
        });
    }
    ,

    updateSXFSS: function (req, res, next) {
        var id = new ObjectID(req.body.id);
        req.db.collection('form_insts').findOne({'_id': id}, function (err, doc) {
            if (err) return next(error(500, err));

            var node = tree.get(doc, req.body.path);
            if (!node) return next(error(400, new Error('无效节点路径')));

            ihEngine.updateSXFSS(doc, node, +req.body.sxfss);
            req.db.collection('form_insts').updateOne({'_id': id}, {
                $set: {
                    body: doc.body,
                    data: doc.data,
                    header: updateAuthor(doc.header, req.session.user)
                }
            }, function (err, result) {
                if (err) return next(error(500, err));
                console.log("update sxfss for orderitem", result.modifiedCount);
                res.status(200).json({modified: result.modifiedCount, orderItem: doc});
            });
        });
    }
    ,

    // 更新拉拔次数, 坯料数据
    updateLBCS: function (req, res, next) {
        var id = new ObjectID(req.body.id);
        req.db.collection('form_insts').findOne({'_id': id}, function (err, doc) {
            if (err) return next(error(500, err));

            var plNode = tree.get(doc, req.body.path);
            plNode.lbcs = +req.body.lbcs;

            if (plNode.lbcs === 0) {    // 不经过拉拔
                doc.data[plNode.id] = [{name: 'comment', value: '不经过拉拔'}];
            } else {                    // 一次拉拔, 二次拉拔
                ihEngine.updateLBCS(doc, plNode, plNode.lbcs);
            }
            req.db.collection('form_insts').updateOne({'_id': id}, {
                $set: {
                    body: doc.body,
                    data: doc.data,
                    header: updateAuthor(doc.header, req.session.user)
                }
            }, function (err, result) {
                if (err) return next(error(500, err));

                console.log("update lbcs for orderitem", result.modifiedCount);
                res.status(200).json({modified: result.modifiedCount, orderItem: doc});
            });
        })
    }
    ,

    // 提交订单分解／订单计划表；开始同类合并生成BOM表
    submitOrderItem: function (req, res, next) {
        // 找到所有订单分解和订单计划模版id
        req.db.collection('forms').find({"alias": "order_item"}, {'_id': 1}).toArray(function (err, docs) {
            if (err) return next(error(500, err));
            var tmplIds = docs.map(function (d) {
                return d._id;
            });

            // 找到所有未提交（编辑中)的实例
            req.db.collection('form_insts').find({$and: [{'tmpl_id': {$in: tmplIds}}, {'status': enums.StatusEnum.NOT_PROCESSED}]})
                .toArray(function (err, docs) {
                    if (err) return next(error(500, err));

                    var instIds = docs.map(function (d) {
                        return d._id;
                    });

                    var cpbhs = docs.map(function (d) {
                        return d.cpbh;
                    });

                    // 找到订单分解相应的订单实例, 因为有的数据需要从订单里取得,比如下单时间
                    req.db.collection('form_insts').find({$and: [{alias: 'order'}, {"children.cpbh": {$in: cpbhs}}]}).toArray(function (err, orders) {
                        if (err) return next(error(500, err));

                        // 调用传承模块，生成下游表单实例，比如BOM表等
                        ihEngine.updateOrderItem(docs, orders, req.db, req.session.user, function (err) {
                            if (err) return next(error(500, err));

                            req.db.collection('form_insts').updateMany({'_id': {$in: instIds}},
                                {
                                    $set: {
                                        'status': enums.StatusEnum.PROCESSED,
                                        'header.4.value': req.session.user.name,
                                        'header.5.value': moment().format('YYYY-MM-DD')
                                    }
                                },
                                function (err, result) {
                                    if (err) return next(error(500, err));
                                    console.log("updated", result.modifiedCount);
                                    res.status(200).json({modified: result.modifiedCount});
                                });
                        });
                    });
                }
            );
        });
    }
    ,
    updateFormStatus: function (req, res, next) {
        var update = {status: req.body.status};
        if (req.body.auditor) {
            update["header.4.value"] = req.body.auditor;    // mongodb不支持用$, 位置操作符, 更新多个数组中元素: http://jira.mongodb.org/browse/SERVER-1243
            update["header.5.value"] = req.body.auditDate;
        }
        req.db.collection("form_insts").updateOne({"_id": new ObjectID(req.body.id)}, {$set: update},
            function (err, result) {
                if (err) return next(error(500, err));
                console.log("updated", result.modifiedCount);
                res.status(200).json({modified: result.modifiedCount});
            });
    }
    ,
    getOrderItems: function (req, res, next) {
        var draw = Number(req.query.draw);
        var start = Number(req.query.start);
        var size = Number(req.query.length);
        var search = req.query.search.value;
        if (search.indexOf("+") >= 0) {
            search = search.replace(/\+/g, "\\+");
        }
        var regFilter = [
            {"ddh": {$regex: search}},
            {"cpbh": {$regex: search}},
            {"lb": {$regex: search}},
            {"yt": {$regex: search}},
            {"gg": {$regex: search}},
            {"zj": {$regex: search}},
            {"djmc": {$regex: search}},
            {"js": {$regex: search}},
            {"status": {$regex: search}}
        ];
        var order = req.query.order;
        var orderFilter = {};
        var columns = req.query.columns;
        if (order && order instanceof Array) {
            for (var index in order) {
                var colIndex = order[index].column
                var orderName = columns[colIndex].data;
                if (!orderName) continue;
                var orderVal = order[index].dir == "asc" ? 1 : -1;
                orderFilter[orderName] = orderVal;
            }
        }
        req.db.collection("form_insts").find({
            "alias": "order_item",
            "$or": regFilter
        }).toArray(function (err, docs) {
            if (err) return next(error(500, err));
            var total = docs.length;
            req.db.collection("form_insts").find({
                "alias": "order_item",
                "$or": regFilter
            }).skip(start).limit(size).sort(orderFilter).toArray(function (err, docs) {
                if (err) return next(error(500, err));
                for (var i = 0; i < docs.length; i++) {
                    docs[i]["DT_RowId"] = docs[i]._id;
                }
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
    }
    ,
    getOrderPlans: function (req, res, next) {
        var draw = Number(req.query.draw);
        var start = Number(req.query.start);
        var size = Number(req.query.length);
        var search = req.query.search.value;
        if (search.indexOf("+") >= 0) {
            search = search.replace(/\+/g, "\\+");
        }
        var regFilter = [
            {"ddh": {$regex: search}},
            {"cpbh": {$regex: search}},
            {"lb": {$regex: search}},
            {"gg": {$regex: search}},
            {"zj": {$regex: search}}
        ];
        var order = req.query.order;
        var orderFilter = {};
        var columns = req.query.columns;
        if (order && order instanceof Array) {
            for (var index in order) {
                var colIndex = order[index].column
                var orderName = columns[colIndex].data;
                if (!orderName) continue;
                var orderVal = order[index].dir == "asc" ? 1 : -1;
                orderFilter[orderName] = orderVal;
            }
        }
        req.db.collection("form_insts").find({
            "alias": "order_plan",
            "$or": regFilter
        }).toArray(function (err, docs) {
            if (err) return next(error(500, err));
            var total = docs.length;
            req.db.collection("form_insts").find({
                "alias": "order_plan",
                "$or": regFilter
            }).skip(start).limit(size).sort(orderFilter).toArray(function (err, docs) {
                if (err) return next(error(500, err));
                for (var i = 0; i < docs.length; i++) {
                    docs[i]["DT_RowId"] = docs[i]._id;
                }
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
    }
    ,
    saveOrderPlan: function (req, res, next) {
        var formInst = JSON.parse(req.body.form);
        formInst._id = new ObjectID(formInst._id);
        formInst.tmpl_id = new ObjectID(formInst.tmpl_id);
        req.db.collection("form_insts").save(formInst, function (err, result) {
            if (err) return next(error(500, err));
            res.status(200).end();
        })
    }
    ,
    getHsProductionPlanModule: function (req, res, next) {
        req.db.collection("forms").findOne({"alias": "hs_production_plan", "display": false}, function (err, doc) {
            if (err) return next(error(500, err));
            res.status(200).json(doc);
        });
    }
    ,
    getNgProductionPlanModule: function (req, res, next) {
        req.db.collection("forms").findOne({"alias": "ng_production_plan", "display": false}, function (err, doc) {
            if (err) return next(error(500, err));
            res.status(200).json(doc);
        });
    }
    ,
    getHsProductionPlans: function (req, res, next) {
        var draw = Number(req.query.draw);
        var start = Number(req.query.start);
        var size = Number(req.query.length);
        var search = req.query.search.value;
        if (search.indexOf("+") >= 0) {
            search = search.replace(/\+/g, "\\+");
        }
        var regFilter = [
            {"cpbh": {$regex: search}},
            {"sfdz": {$regex: search}},
            {"lb": {$regex: search}},
            {"jg/gg": {$regex: search}},
            {"zj": {$regex: search}},
            {"nx": {$regex: search}},
            {"qd": {$regex: search}},
            {"tyfs": {$regex: search}},
            {"nj": {$regex: search}},
            {"bmzt": {$regex: search}},
            {"tsyq": {$regex: search}},
            {"yt": {$regex: search}},
            {"jhrq": {$regex: search}},
            {"cj": {$regex: search}},
            {"merge": {$regex: search}},
            {"status": {$regex: search}}
        ];
        var order = req.query.order;
        var orderFilter = {};
        var columns = req.query.columns;
        if (order && order instanceof Array) {
            for (var index in order) {
                var colIndex = order[index].column
                var orderName = columns[colIndex].data;
                if (!orderName) continue;
                var orderVal = order[index].dir == "asc" ? 1 : -1;
                orderFilter[orderName] = orderVal;
            }
        }
        req.db.collection("form_insts").find({
            "alias": "hs_production_plan",
            "$or": regFilter,
            "isMerged": false
        }).toArray(function (err, docs) {
            if (err) return next(error(500, err));
            var total = docs.length;
            req.db.collection("form_insts").find({
                "alias": "hs_production_plan",
                "$or": regFilter,
                "isMerged": false
            }).skip(start).limit(size).sort(orderFilter).toArray(function (err, docs) {
                if (err) return next(error(500, err));
                for (var i = 0; i < docs.length; i++) {
                    docs[i]["DT_RowId"] = docs[i]._id;
                }
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
    }
    ,
    getNgProductionPlans: function (req, res, next) {
        var draw = Number(req.query.draw);
        var start = Number(req.query.start);
        var size = Number(req.query.length);
        var search = req.query.search.value;
        if (search.indexOf("+") >= 0) {
            search = search.replace(/\+/g, "\\+");
        }
        var regFilter = [
            {"cpbh": {$regex: search}},
            {"sggSzj": {$regex: search}},
            {"sfdz": {$regex: search}},
            {"lb": {$regex: search}},
            {"jg": {$regex: search}},
            {"zj": {$regex: search}},
            {"nx": {$regex: search}},
            {"qd": {$regex: search}},
            {"tyfs": {$regex: search}},
            {"nj": {$regex: search}},
            {"bmzt": {$regex: search}},
            {"tsyq": {$regex: search}},
            {"yt": {$regex: search}},
            {"jhrq": {$regex: search}},
            {"cj": {$regex: search}},
            {"merge": {$regex: search}},
            {"status": {$regex: search}}
        ];
        var order = req.query.order;
        var orderFilter = {};
        var columns = req.query.columns;
        if (order && order instanceof Array) {
            for (var index in order) {
                var colIndex = order[index].column
                var orderName = columns[colIndex].data;
                if (!orderName) continue;
                var orderVal = order[index].dir == "asc" ? 1 : -1;
                orderFilter[orderName] = orderVal;
            }
        }
        req.db.collection("form_insts").find({
            "alias": "ng_production_plan",
            "$or": regFilter,
            "isMerged": false
        }).toArray(function (err, docs) {
            if (err) return next(error(500, err));
            var total = docs.length;
            req.db.collection("form_insts").find({
                "alias": "ng_production_plan",
                "$or": regFilter,
                "isMerged": false
            }).skip(start).limit(size).sort(orderFilter).toArray(function (err, docs) {
                if (err) return next(error(500, err));
                for (var i = 0; i < docs.length; i++) {
                    docs[i]["DT_RowId"] = docs[i]._id;
                }
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
    }
    ,
    createProductionPlan: function (req, res, next) {
        var formInst = JSON.parse(req.body.form);
        formInst.tmpl_id = new ObjectID(formInst.tmpl_id);
        for (var i = 0; i < formInst.mergeIds.length; i++) {
            if (!formInst.mergeIds[i] instanceof ObjectID) {
                formInst.mergeIds[i] = new ObjectID(formInst.mergeIds[i]);
            }
        }
        req.db.collection("form_insts").insertOne(formInst, function (err, result) {
            if (err) return next(error(500, err));
            res.status(200).end();
        });
    }
    ,
    getProductionPlan: function (req, res, next) {
        var ids = JSON.parse(req.query.ids);
        for (var i = 0; i < ids.length; i++) {
            ids[i] = new ObjectID(ids[i]);
        }
        req.db.collection("form_insts").find({"_id": {$in: ids}}).toArray(function (err, docs) {
            if (err) return next(error(500, err));
            res.status(200).json(docs);
        });
    }
    ,
    submitProductionPlan: function (req, res, next) {
        var ids = JSON.parse(req.body.ids);
        for (var i = 0; i < ids.length; i++) {
            ids[i] = new ObjectID(ids[i]);
        }
        req.db.collection('form_insts').find({"_id": {$in: ids}}).toArray(function (err, productionPlanInsts) {
            if (err) return next(error(500, err));
            ihEngine.updateProductionPlan(productionPlanInsts, req.db, req.session.user, function (err) {
                if (err) return next(error(500, err));
                res.status(200).end();
            });
        });
    }
    ,
    backProductionPlan: function (req, res, next) {
        var ids = JSON.parse(req.body.ids);
        for (var i = 0; i < ids.length; i++) {
            ids[i] = new ObjectID(ids[i]);
        }
        req.db.collection('form_insts').find({"_id": {$in: ids}}).toArray(function (err, productionPlanInsts) {
            if (err) return next(error(500, err));
            var mergeIds = [];
            for (var i = 0; i < productionPlanInsts.length; i++) {
                var productionPlanInst = productionPlanInsts[i];
                var mIds = productionPlanInst.mergeIds;
                for (var j = 0; j < mIds.length; j++) {
                    mergeIds.push(mIds[j]);
                }
            }
            for (var i = 0; i < mergeIds.length; i++) {
                mergeIds[i] = new ObjectID(mergeIds[i]);
            }
            req.db.collection('form_insts').updateMany(
                {"_id": {$in: mergeIds}},
                {$set: {"isMerged": false}},
                function (err, result) {
                    if (err) return next(error(500, err));
                    req.db.collection('form_insts').deleteMany({"_id": {$in: ids}}, function (err, result) {
                        if (err) return next(error(500, err));
                        res.status(200).end();
                    })
                })
        });
    }
    ,
    saveProductionPlan: function (req, res, next) {
        var formInst = JSON.parse(req.body.form);
        formInst._id = new ObjectID(formInst._id);
        formInst.tmpl_id = new ObjectID(formInst.tmpl_id);
        req.db.collection("form_insts").save(formInst, function (err, result) {
            if (err) return next(error(500, err));
            res.status(200).end();
        })
    }
    ,
    updateMergedProductionPlan: function (req, res, next) {
        var ids = JSON.parse(req.body.ids);
        for (var i = 0; i < ids.length; i++) {
            ids[i] = new ObjectID(ids[i]);
        }
        req.db.collection("form_insts").updateMany({"_id": {$in: ids}}, {$set: {"isMerged": true}}, function (err, result) {
            if (err) return next(error(500, err));
            res.status(200).end();
        });
    }
    ,
    getHsWorkPlanModule: function (req, res, next) {
        req.db.collection("forms").findOne({"alias": "hs_work_plan", "display": false}, function (err, doc) {
            if (err) return next(error(500, err));
            res.status(200).json(doc);
        });
    }
    ,
    getNgWorkPlanModule: function (req, res, next) {
        req.db.collection("forms").findOne({"alias": "ng_work_plan", "display": false}, function (err, doc) {
            if (err) return next(error(500, err));
            res.status(200).json(doc);
        });
    }
    ,
    getHsWorkPlans: function (req, res, next) {
        var draw = Number(req.query.draw);
        var start = Number(req.query.start);
        var size = Number(req.query.length);
        var search = req.query.search.value;
        if (search.indexOf("+") >= 0) {
            search = search.replace(/\+/g, "\\+");
        }
        var regFilter = [
            {"sggSzj": {$regex: search}},
            {"lb": {$regex: search}},
            {"jhscksrq": {$regex: search}},
            {"jhscjsrq": {$regex: search}},
            {"cj": {$regex: search}},
            {"jth": {$regex: search}},
            {"bz": {$regex: search}},
            {"bzz": {$regex: search}},
            {"czg": {$regex: search}},
            {"arrange": {$regex: search}},
            {"status": {$regex: search}}
        ];
        var order = req.query.order;
        var orderFilter = {};
        var columns = req.query.columns;
        if (order && order instanceof Array) {
            for (var index in order) {
                var colIndex = order[index].column
                var orderName = columns[colIndex].data;
                if (!orderName) continue;
                var orderVal = order[index].dir == "asc" ? 1 : -1;
                orderFilter[orderName] = orderVal;
            }
        }
        req.db.collection("form_insts").find({
            "alias": "hs_work_plan",
            "$or": regFilter,
            "cj": {$in: req.session.user.org1}
        }).toArray(function (err, docs) {
            if (err) return next(error(500, err));
            var total = docs.length;
            req.db.collection("form_insts").find({
                "alias": "hs_work_plan",
                "$or": regFilter,
                "cj": {$in: req.session.user.org1}
            }).skip(start).limit(size).sort(orderFilter).toArray(function (err, docs) {
                if (err) return next(error(500, err));
                for (var i = 0; i < docs.length; i++) {
                    docs[i]["DT_RowId"] = docs[i]._id;
                }
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
    }
    ,
    getNgWorkPlans: function (req, res, next) {
        var draw = Number(req.query.draw);
        var start = Number(req.query.start);
        var size = Number(req.query.length);
        var search = req.query.search.value;
        if (search.indexOf("+") >= 0) {
            search = search.replace(/\+/g, "\\+");
        }
        var regFilter = [
            {"sggSzj": {$regex: search}},
            {"lb": {$regex: search}},
            {"jhscksrq": {$regex: search}},
            {"jhscjsrq": {$regex: search}},
            {"cj": {$regex: search}},
            {"jth": {$regex: search}},
            {"bz": {$regex: search}},
            {"bzz": {$regex: search}},
            {"czg": {$regex: search}},
            {"arrange": {$regex: search}},
            {"status": {$regex: search}}
        ];
        var order = req.query.order;
        var orderFilter = {};
        var columns = req.query.columns;
        if (order && order instanceof Array) {
            for (var index in order) {
                var colIndex = order[index].column
                var orderName = columns[colIndex].data;
                if (!orderName) continue;
                var orderVal = order[index].dir == "asc" ? 1 : -1;
                orderFilter[orderName] = orderVal;
            }
        }
        req.db.collection("form_insts").find({
            "alias": "ng_work_plan",
            "$or": regFilter,
            "cj": {$in: req.session.user.org1}
        }).toArray(function (err, docs) {
            if (err) return next(error(500, err));
            var total = docs.length;
            req.db.collection("form_insts").find({
                "alias": "ng_work_plan",
                "$or": regFilter,
                "cj": {$in: req.session.user.org1}
            }).skip(start).limit(size).sort(orderFilter).toArray(function (err, docs) {
                if (err) return next(error(500, err));
                for (var i = 0; i < docs.length; i++) {
                    docs[i]["DT_RowId"] = docs[i]._id;
                }
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
    }
    ,
    suspendHsWorkPlans: function (req, res, next) {
        var ids = JSON.parse(req.body.ids);
        for (var i = 0; i < ids.length; i++) {
            ids[i] = new ObjectID(ids[i]);
        }
        req.db.collection('form_insts').update({'_id': {$in: ids}}, {$set: {status: "已终止"}}, function (err, result) {
            if (err) return next(error(500, err));
            res.status(200).end();
        });
    }
    ,
    suspendNgWorkPlans: function (req, res, next) {
        var ids = JSON.parse(req.body.ids);
        for (var i = 0; i < ids.length; i++) {
            ids[i] = new ObjectID(ids[i]);
        }
        req.db.collection('form_insts').update({'_id': {$in: ids}}, {$set: {status: "已终止"}}, function (err, result) {
            if (err) return next(error(500, err));
            res.status(200).end();
        });
    }
    ,
    deleteHsWorkPlan: function (req, res, next) {
        req.db.collection("form_insts").deleteOne({"_id": new ObjectID(req.body.id)}, function (err, result) {
            if (err) return next(error(500, err));
            res.status(200).end();
        });
    },
    reArrangeSuspendedHsWorkPlan: function (req, res, next) {
        req.db.collection('form_insts').updateOne({'_id': new ObjectId(req.body.id)}, {
            $set: {"reArrange": true}
        }, function (err) {
            if (err) return next(error(500, err));
            res.status(200).end();
        })
    }
    ,
    reArrangeSuspendedNgWorkPlan: function (req, res, next) {
        req.db.collection('form_insts').updateOne({'_id': new ObjectId(req.body.id)}, {
            $set: {"reArrange": true}
        }, function (err) {
            if (err) return next(error(500, err));
            res.status(200).end();
        })
    }
    ,
    deleteNgWorkPlan: function (req, res, next) {
        req.db.collection("form_insts").deleteOne({"_id": new ObjectID(req.body.id)}, function (err, result) {
            if (err) return next(error(500, err));
            res.status(200).end();
        });
    }
    ,
    saveWorkPlan: function (req, res, next) {
        var formInst = JSON.parse(req.body.form);
        formInst._id = new ObjectID(formInst._id);
        formInst.tmpl_id = new ObjectID(formInst.tmpl_id);
        req.db.collection("form_insts").save(formInst, function (err, result) {
            if (err) return next(error(500, err));
            res.status(200).end();
        })
    }
    ,
    createWorkPlan: function (req, res, next) {
        var forms = JSON.parse(req.body.forms);
        for (var i = 0; i < forms.length; i++) {
            forms[i].tmpl_id = new ObjectID(forms[i].tmpl_id);
        }
        req.db.collection("form_insts").insertMany(forms, function (err, result) {
            if (err) return next(error(500, err));
            res.status(200).end();
        });
    }
    ,
    submitWorkPlan: function (req, res, next) {
        var ids = JSON.parse(req.body.ids);
        for (var i = 0; i < ids.length; i++) {
            ids[i] = new ObjectID(ids[i]);
        }
        req.db.collection('form_insts').find({"_id": {$in: ids}}).toArray(function (err, workPlanInsts) {
            if (err) return next(error(500, err));
            ihEngine.updateWorkPlan(workPlanInsts, req.db, req.session.user, function (err) {
                if (err) return next(error(500, err));
                res.status(200).end();
            });
        });
    }
    ,
    getGVirtualLibrarys: function (req, res, next) {
        var draw = Number(req.query.draw);
        var start = Number(req.query.start);
        var size = Number(req.query.length);
        var search = req.query.search.value;
        if (search.indexOf("+") >= 0) {
            search = search.replace(/\+/g, "\\+");
        }
        var regFilter = [
            {"gzlbh": {$regex: search}},
            {"gzlxh": {$regex: search}},
            {"gdzzh": {$regex: search}},
            {"sfdz": {$regex: search}},
            {"cj": {$regex: search}},
            {"jth.name": {$regex: search}},
            {"bz": {$regex: search}},
            {"bzz": {$regex: search}},
            {"czg": {$regex: search}},
            {"lb": {$regex: search}},
            {"isZjp": {$regex: search}},
            {"jg": {$regex: search}},
            {"zj": {$regex: search}},
            {"nx": {$regex: search}},
            {"qd": {$regex: search}},
            {"tyfs": {$regex: search}},
            {"nj": {$regex: search}},
            {"bmzt": {$regex: search}},
            {"tsyq": {$regex: search}},
            {"dc": {$regex: search}},
            {"ds": {$regex: search}},
            {"djmc": {$regex: search}},
            {"zl": {$regex: search}},
            {"rksj": {$regex: search}},
            {"cksj": {$regex: search}},
            {"comment": {$regex: search}},
            {"zjy.name": {$regex: search}},
            {"zjsj": {$regex: search}},
            {"sfhg": {$regex: search}},
            {"bhgyy": {$regex: search}}
        ];
        var order = req.query.order;
        var orderFilter = {};
        var columns = req.query.columns;
        if (order && order instanceof Array) {
            for (var index in order) {
                var colIndex = order[index].column
                var orderName = columns[colIndex].data;
                if (!orderName) continue;
                var orderVal = order[index].dir == "asc" ? 1 : -1;
                orderFilter[orderName] = orderVal;
            }
        }
        req.db.collection("form_insts").find({
            "alias": "g_virtual_library",
            "$or": regFilter
        }).toArray(function (err, vls) {
            if (err) return next(error(500, err));
            var total = vls.length;
            req.db.collection("form_insts").find({
                "alias": "g_virtual_library",
                "$or": regFilter
            }).skip(start).limit(size).sort(orderFilter).toArray(function (err, vls) {
                if (err) return next(error(500, err));
                for (var i = 0; i < vls.length; i++) {
                    vls[i]["DT_RowId"] = vls[i]._id;
                }
                res.status(200).json(
                    {
                        data: vls,
                        recordsTotal: total,
                        recordsFiltered: total,
                        draw: draw
                    }
                );
            });
        })
    }
    ,
    getGVirtualLibrary: function (req, res, next) {
        req.db.collection("form_insts").findOne({"_id": new ObjectID(req.body.id)}, function (err, vl) {
            if (err) return next(error(500, err));
            vl["jth"] = vl["jth"].id;
            vl["zjy"] = vl["zjy"].id;
            res.status(200).json(vl);
        });
    }
    ,
    createGVirtualLibrary: function (req, res, next) {
        req.body["alias"] = "g_virtual_library";
        req.body["type"] = {
            "name": "virtual_library",
            "value": "虚拟库存"
        };
        req.body["jth"] = {
            "id": req.body.jth || "",
            "name": req.body.jthName || ""
        }
        delete req.body.jthName;
        req.body["zjy"] = {
            "id": req.body.zjy || "",
            "name": req.body.zjyName || "",
        }
        delete req.body.zjyName;
        var bzs = [];
        var bzzs = [];
        var czgs = [];
        var mul = JSON.parse(req.body.mul);
        for (var i = 0; i < mul.length; i++) {
            var bzz = mul[i].index;
            var bzExist = false;
            var bzzExist = false;
            for (var j = 0; j < bzs.length; j++) {
                if (mul[i].bz == bzs[j]) {
                    bzExist = true;
                    break;
                }
            }
            if (!bzExist) {
                if (mul[i].bz)bzs.push(mul[i].bz)
            }
            for (var j = 0; j < bzzs.length; j++) {
                if (mul[i].id == bzzs[j].id) {
                    bzzExist = true;
                    break;
                }
            }
            if (!bzzExist) {
                if (mul[i].id)bzzs.push({
                    "id": mul[i].id,
                    "value": mul[i].value
                });
            }
            for (var j = 0; j < mul[i].children.length; j++) {
                var czgExist = false;
                for (var k = 0; k < czgs.length; k++) {
                    if (czgs[k].id == mul[i].children[j].id) {
                        czgExist = true;
                        break;
                    }
                }
                if (!czgExist) {
                    if (mul[i].children[j].id)czgs.push({
                        "id": mul[i].children[j].id,
                        "value": mul[i].children[j].value
                    })
                }
                var czg = mul[i].children[j].index;
                mul[i].children[j].wcmc = req.body["bzz" + bzz + "_czg" + czg + "_wcmc"] || "";
                delete mul[i].children[j].index;
                delete req.body["bzz" + bzz + "_czg" + czg];
                delete req.body["bzz" + bzz + "_czg" + czg + "_wcmc"];
            }
            delete mul[i].index;
            delete req.body["bzz" + bzz];
        }
        req.body.mul = mul;
        for (var i = 0; i < bzzs.length; i++) {
            bzzs[i] = bzzs[i].value;
        }
        for (var i = 0; i < czgs.length; i++) {
            czgs[i] = czgs[i].value;
        }
        req.body.bz = bzs.join(",");
        req.body.bzz = bzzs.join(",");
        req.body.czg = czgs.join(",");
        req.db.collection("form_insts").insertOne(req.body, function (err, data) {
            if (err) return next(error(500, err));
            res.status(200).end();
        })
    }
    ,
    deleteGVirtualLibrary: function (req, res, next) {
        req.db.collection("form_insts").deleteOne({"_id": new ObjectID(req.body.id)}, function (err) {
            if (err) return next(error(500, err));
            res.status(200).end();
        });
    }
    ,
    updateGVirtualLibrary: function (req, res, next) {
        req.body["jth"] = {
            "id": req.body.jth || "",
            "name": req.body.jthName || ""
        }
        delete req.body.jthName;
        req.body["zjy"] = {
            "id": req.body.zjy || "",
            "name": req.body.zjyName || "",
        }
        delete req.body.zjyName;
        var bzs = [];
        var bzzs = [];
        var czgs = [];
        var mul = JSON.parse(req.body.mul);
        for (var i = 0; i < mul.length; i++) {
            var bzz = mul[i].index;
            var bzExist = false;
            var bzzExist = false;
            for (var j = 0; j < bzs.length; j++) {
                if (mul[i].bz == bzs[j]) {
                    bzExist = true;
                    break;
                }
            }
            if (!bzExist) {
                if (mul[i].bz)bzs.push(mul[i].bz)
            }
            for (var j = 0; j < bzzs.length; j++) {
                if (mul[i].id == bzzs[j].id) {
                    bzzExist = true;
                    break;
                }
            }
            if (!bzzExist) {
                if (mul[i].id)bzzs.push({
                    "id": mul[i].id,
                    "value": mul[i].value
                });
            }
            for (var j = 0; j < mul[i].children.length; j++) {
                var czgExist = false;
                for (var k = 0; k < czgs.length; k++) {
                    if (czgs[k].id == mul[i].children[j].id) {
                        czgExist = true;
                        break;
                    }
                }
                if (!czgExist) {
                    if (mul[i].children[j].id)czgs.push({
                        "id": mul[i].children[j].id,
                        "value": mul[i].children[j].value
                    })
                }
                var czg = mul[i].children[j].index;
                mul[i].children[j].wcmc = req.body["bzz" + bzz + "_czg" + czg + "_wcmc"] || "";
                delete mul[i].children[j].index;
                delete req.body["bzz" + bzz + "_czg" + czg];
                delete req.body["bzz" + bzz + "_czg" + czg + "_wcmc"];
            }
            delete mul[i].index;
            delete req.body["bzz" + bzz];
        }
        req.body.mul = mul;
        for (var i = 0; i < bzzs.length; i++) {
            bzzs[i] = bzzs[i].value;
        }
        for (var i = 0; i < czgs.length; i++) {
            czgs[i] = czgs[i].value;
        }
        req.body.bz = bzs.join(",");
        req.body.bzz = bzzs.join(",");
        req.body.czg = czgs.join(",");
        req.db.collection("form_insts").findOneAndUpdate({"_id": new ObjectID(req.body.id)}, {$set: req.body}, function (err, result) {
            if (err) return next(error(500, err));
            res.status(200).end();
        });
    }
    ,
    getSVirtualLibrarys: function (req, res, next) {
        var draw = Number(req.query.draw);
        var start = Number(req.query.start);
        var size = Number(req.query.length);
        var search = req.query.search.value;
        if (search.indexOf("+") >= 0) {
            search = search.replace(/\+/g, "\\+");
        }
        var regFilter = [
            {"gzlbh": {$regex: search}},
            {"gzlxh": {$regex: search}},
            {"gdzzh": {$regex: search}},
            {"sfdz": {$regex: search}},
            {"cj": {$regex: search}},
            {"jth.name": {$regex: search}},
            {"bz": {$regex: search}},
            {"bzz": {$regex: search}},
            {"czg": {$regex: search}},
            {"lb": {$regex: search}},
            {"isZjp": {$regex: search}},
            {"jg": {$regex: search}},
            {"zj": {$regex: search}},
            {"nx": {$regex: search}},
            {"qd": {$regex: search}},
            {"tyfs": {$regex: search}},
            {"nj": {$regex: search}},
            {"bmzt": {$regex: search}},
            {"tsyq": {$regex: search}},
            {"dc": {$regex: search}},
            {"ds": {$regex: search}},
            {"djmc": {$regex: search}},
            {"zl": {$regex: search}},
            {"rksj": {$regex: search}},
            {"cksj": {$regex: search}},
            {"comment": {$regex: search}},
            {"zjy.name": {$regex: search}},
            {"zjsj": {$regex: search}},
            {"sfhg": {$regex: search}},
            {"bhgyy": {$regex: search}}
        ];
        var order = req.query.order;
        var orderFilter = {};
        var columns = req.query.columns;
        if (order && order instanceof Array) {
            for (var index in order) {
                var colIndex = order[index].column
                var orderName = columns[colIndex].data;
                if (!orderName) continue;
                var orderVal = order[index].dir == "asc" ? 1 : -1;
                orderFilter[orderName] = orderVal;
            }
        }
        req.db.collection("form_insts").find({
            "alias": "s_virtual_library",
            "$or": regFilter
        }).toArray(function (err, vls) {
            if (err) return next(error(500, err));
            var total = vls.length;
            req.db.collection("form_insts").find({
                "alias": "s_virtual_library",
                "$or": regFilter
            }).skip(start).limit(size).sort(orderFilter).toArray(function (err, vls) {
                if (err) return next(error(500, err));
                for (var i = 0; i < vls.length; i++) {
                    vls[i]["DT_RowId"] = vls[i]._id;
                }
                res.status(200).json(
                    {
                        data: vls,
                        recordsTotal: total,
                        recordsFiltered: total,
                        draw: draw
                    }
                );
            });
        })
    }
    ,
    getSVirtualLibrary: function (req, res, next) {
        req.db.collection("form_insts").findOne({"_id": new ObjectID(req.body.id)}, function (err, vl) {
            if (err) return next(error(500, err));
            vl["jth"] = vl["jth"].id;
            vl["zjy"] = vl["zjy"].id;
            res.status(200).json(vl);
        });
    }
    ,
    createSVirtualLibrary: function (req, res, next) {
        req.body["alias"] = "s_virtual_library";
        req.body["type"] = {
            "name": "virtual_library",
            "value": "虚拟库存"
        };
        req.body["jth"] = {
            "id": req.body.jth || "",
            "name": req.body.jthName || ""
        }
        delete req.body.jthName;
        req.body["zjy"] = {
            "id": req.body.zjy || "",
            "name": req.body.zjyName || "",
        }
        delete req.body.zjyName;
        var bzs = [];
        var bzzs = [];
        var czgs = [];
        var mul = JSON.parse(req.body.mul);
        for (var i = 0; i < mul.length; i++) {
            var bzz = mul[i].index;
            var bzExist = false;
            var bzzExist = false;
            for (var j = 0; j < bzs.length; j++) {
                if (mul[i].bz == bzs[j]) {
                    bzExist = true;
                    break;
                }
            }
            if (!bzExist) {
                if (mul[i].bz)bzs.push(mul[i].bz)
            }
            for (var j = 0; j < bzzs.length; j++) {
                if (mul[i].id == bzzs[j].id) {
                    bzzExist = true;
                    break;
                }
            }
            if (!bzzExist) {
                if (mul[i].id)bzzs.push({
                    "id": mul[i].id,
                    "value": mul[i].value
                });
            }
            for (var j = 0; j < mul[i].children.length; j++) {
                var czgExist = false;
                for (var k = 0; k < czgs.length; k++) {
                    if (czgs[k].id == mul[i].children[j].id) {
                        czgExist = true;
                        break;
                    }
                }
                if (!czgExist) {
                    if (mul[i].children[j].id)czgs.push({
                        "id": mul[i].children[j].id,
                        "value": mul[i].children[j].value
                    })
                }
                var czg = mul[i].children[j].index;
                mul[i].children[j].wcmc = req.body["bzz" + bzz + "_czg" + czg + "_wcmc"] || "";
                delete mul[i].children[j].index;
                delete req.body["bzz" + bzz + "_czg" + czg];
                delete req.body["bzz" + bzz + "_czg" + czg + "_wcmc"];
            }
            delete mul[i].index;
            delete req.body["bzz" + bzz];
        }
        req.body.mul = mul;
        for (var i = 0; i < bzzs.length; i++) {
            bzzs[i] = bzzs[i].value;
        }
        for (var i = 0; i < czgs.length; i++) {
            czgs[i] = czgs[i].value;
        }
        req.body.bz = bzs.join(",");
        req.body.bzz = bzzs.join(",");
        req.body.czg = czgs.join(",");
        req.db.collection("form_insts").insertOne(req.body, function (err, data) {
            if (err) return next(error(500, err));
            res.status(200).end();
        })
    }
    ,
    deleteSVirtualLibrary: function (req, res, next) {
        req.db.collection("form_insts").deleteOne({"_id": new ObjectID(req.body.id)}, function (err) {
            if (err) return next(error(500, err));
            res.status(200).end();
        });
    }
    ,
    updateSVirtualLibrary: function (req, res, next) {
        req.db.collection("form_insts").findOne({"_id": new ObjectID(req.body.id)}, function (err, vl) {
            if (err) return next(error(500, err));
            if (vl) {

            }
            else {

            }

        });
        req.body["jth"] = {
            "id": req.body.jth || "",
            "name": req.body.jthName || ""
        }
        delete req.body.jthName;
        req.body["zjy"] = {
            "id": req.body.zjy || "",
            "name": req.body.zjyName || "",
        }
        delete req.body.zjyName;
        var bzs = [];
        var bzzs = [];
        var czgs = [];
        var mul = JSON.parse(req.body.mul);
        for (var i = 0; i < mul.length; i++) {
            var bzz = mul[i].index;
            var bzExist = false;
            var bzzExist = false;
            for (var j = 0; j < bzs.length; j++) {
                if (mul[i].bz == bzs[j]) {
                    bzExist = true;
                    break;
                }
            }
            if (!bzExist) {
                if (mul[i].bz)bzs.push(mul[i].bz)
            }
            for (var j = 0; j < bzzs.length; j++) {
                if (mul[i].id == bzzs[j].id) {
                    bzzExist = true;
                    break;
                }
            }
            if (!bzzExist) {
                if (mul[i].id)bzzs.push({
                    "id": mul[i].id,
                    "value": mul[i].value
                });
            }
            for (var j = 0; j < mul[i].children.length; j++) {
                var czgExist = false;
                for (var k = 0; k < czgs.length; k++) {
                    if (czgs[k].id == mul[i].children[j].id) {
                        czgExist = true;
                        break;
                    }
                }
                if (!czgExist) {
                    if (mul[i].children[j].id)czgs.push({
                        "id": mul[i].children[j].id,
                        "value": mul[i].children[j].value
                    })
                }
                var czg = mul[i].children[j].index;
                mul[i].children[j].wcmc = req.body["bzz" + bzz + "_czg" + czg + "_wcmc"] || "";
                delete mul[i].children[j].index;
                delete req.body["bzz" + bzz + "_czg" + czg];
                delete req.body["bzz" + bzz + "_czg" + czg + "_wcmc"];
            }
            delete mul[i].index;
            delete req.body["bzz" + bzz];
        }
        req.body.mul = mul;
        for (var i = 0; i < bzzs.length; i++) {
            bzzs[i] = bzzs[i].value;
        }
        for (var i = 0; i < czgs.length; i++) {
            czgs[i] = czgs[i].value;
        }
        req.body.bz = bzs.join(",");
        req.body.bzz = bzzs.join(",");
        req.body.czg = czgs.join(",");
        req.db.collection("form_insts").findOneAndUpdate({"_id": new ObjectID(req.body.id)}, {$set: req.body}, function (err, result) {
            if (err) return next(error(500, err));
            res.status(200).end();
        });
    }
    ,
    getOrders: function (req, res, next) {
        req.db.collection("form_insts").distinct(
            "ddh",
            {
                "alias": "order_plan"
            },
            function (err, docs) {
                if (err) return next(error(500, err));
                res.status(200).json(docs);
            })
    }
    ,
    getGantt: function (req, res, next) {
        var filter = {
            "alias": "order_plan"
        }
        if (req.query.order != "all") {
            filter.ddh = req.query.order;
        }
        req.db.collection("form_insts").distinct(
            "ddh",
            filter,
            function (err, ddhNames) {
                if (err) return next(error(500, err));
                req.db.collection("form_insts").find(filter).toArray(function (err, orderPlans) {
                    if (err) return next(error(500, err));
                    var gantt = {
                        "date": {
                            "min": new Date().Format("yyyy-MM-dd"),
                            "max": new Date().Format("yyyy-MM-dd")
                        },
                        "tasks": {
                            "data": [],
                            "links": []
                        },
                        "cache": {
                            "data": {
                                "id": 1
                            },
                            "links": {
                                "id": 1
                            }
                        },
                        "functions": {
                            "date": function (data) {
                                if ("start_date_planned" in data) {
                                    if (data.start_date_planned) {
                                        data.start_date_planned < gantt.date.min ?
                                            gantt.date.min = data.start_date_planned : "";
                                    }
                                    else {
                                        data.start_date_planned = "";
                                    }
                                }
                                if ("end_date_planned" in data) {
                                    if (data.end_date_planned) {
                                        data.end_date_planned > gantt.date.max ?
                                            gantt.date.max = data.end_date_planned : "";
                                    }
                                    else {
                                        data.end_date_planned = "";
                                    }
                                }
                                if ("start_date_planned" in data && "end_date_planned" in data) {
                                    if (data.start_date_planned && data.end_date_planned) {
                                        data.duration_planned = Math.floor((new Date(data.end_date_planned).getTime()
                                            - new Date(data.start_date_planned).getTime()) / 86400000 + 1)
                                    }
                                }
                                if ("start_date" in data) {
                                    if (data.start_date) {
                                        data.start_date < gantt.date.min ?
                                            gantt.date.min = data.start_date : "";
                                        if ("end_date" in data) {
                                            if (data.end_date) {
                                                var end_date = new Date(data.end_date);
                                                end_date.setDate(end_date.getDate() + 1);
                                                data.end_date = end_date.Format("yyyy-MM-dd");
                                                data.end_date > gantt.date.max ?
                                                    gantt.date.max = data.end_date : "";
                                            }
                                            else {
                                                var now = new Date();
                                                now.setDate(now.getDate() + 1);
                                                data.end_date = now.Format("yyyy-MM-dd");
                                                data.end_date > gantt.date.max ?
                                                    gantt.date.max = data.end_date : "";
                                                data.duration_actual = Math.floor((new Date(data.end_date).getTime()
                                                    - new Date(data.start_date).getTime()) / 86400000)
                                            }
                                        }
                                    }
                                }
                            },
                            "unscheduled": function (data) {
                                if ("unscheduleds" in data) {
                                    var unscheduled = true;
                                    for (var i = 0; i < data.unscheduleds.length; i++) {
                                        if (data.unscheduleds[i].unscheduled == false) {
                                            unscheduled = false;
                                            break;
                                        }
                                    }
                                    data.unscheduled = unscheduled;
                                    delete data.unscheduleds;
                                }
                                else {
                                    if (!data.start_date) {
                                        data.unscheduled = true;
                                    }
                                    else {
                                        if (data.end_date) {
                                            if (data.start_date < data.end_date) {
                                                data.unscheduled = false;
                                            }
                                            else {
                                                data.unscheduled = true;
                                            }
                                        }
                                    }
                                }
                            },
                            "progress_text": function (data) {
                                if ("progress_texts" in data) {
                                    var total = 0;
                                    for (var i = 0; i < data.progress_texts.length; i++) {
                                        total = parseFloat(accAdd(total, data.progress_texts[i]));
                                    }
                                    data.progress_text = total / data.progress_texts.length;
                                    delete data.progress_texts;
                                }
                                else {
                                    if (data.jhcl == 0) {
                                        data.progress_text = 0;
                                    }
                                    else if (parseFloat(data.sjcl) >= parseFloat(data.jhcl)) {
                                        data.progress_text = 1;
                                    }
                                    else {
                                        data.progress_text = parseFloat(data.sjcl / data.jhcl);
                                    }
                                }
                            },
                            "view": function (min, max) {
                                var day = {
                                    "min": new Date(min),
                                    "max": new Date(max)
                                }
                                day.min = new Date(day.min.setDate(day.min.getDate() - day.min.getDay() - 6));
                                day.max = new Date(day.max.setDate(day.max.getDate() + day.max.getDay() + 6));
                                gantt.date.day = {
                                    "min": day.min.Format("yyyy-MM-dd"),
                                    "max": day.max.Format("yyyy-MM-dd")
                                }
                                gantt.date.week = {
                                    "min": gantt.date.day.min,
                                    "max": gantt.date.day.max
                                }
                                var month = {
                                    "min": new Date(min),
                                    "max": new Date(max)
                                }
                                if ((month.max - month.min) / 1000 / 31 / 24 / 60 / 60 < 8) {
                                    month.max = new Date(month.max.setDate(month.max.getDate() + 31 * 2));
                                }
                                gantt.date.month = {
                                    "min": month.min.Format("yyyy-MM-dd"),
                                    "max": month.max.Format("yyyy-MM-dd")
                                }
                                var year = {
                                    "min": new Date(min),
                                    "max": new Date(max)
                                }
                                if ((year.max.getFullYear() - year.max.getFullYear()) < 8) {
                                    year.min = new Date(year.min.setDate(year.min.getDate() - 366 * 1));
                                    year.max = new Date(year.max.setDate(year.max.getDate() + 366 * 2));
                                }
                                gantt.date.year = {
                                    "min": year.min.Format("yyyy-MM-dd"),
                                    "max": year.max.Format("yyyy-MM-dd")
                                }
                                delete gantt.date.min;
                                delete gantt.date.max
                            },
                            "label": function (data, label) {
                                if (label instanceof Array) {
                                    for (var i = 0; i < label.length; i++) {
                                        data.labels.push(label[i]);
                                    }
                                }
                                else {
                                    data.labels.push(label);
                                }
                            },
                            "differ": function (data) {
                                if ("start_date_planned" in data && "end_date_planned" in data) {
                                    if (data.start_date_planned && data.end_date_planned) {
                                        if (data.end_date_planned >= data.start_date_planned) {
                                            var start_date_planned = new Date(data.start_date_planned);
                                            var end_date_planned = new Date(data.end_date_planned);
                                            data.date_planned_differ = {
                                                "day": {
                                                    "left": (start_date_planned - new Date(gantt.date.day.min)) / 1000 / 24 / 60 / 60,
                                                    "width": (end_date_planned - start_date_planned  ) / 1000 / 24 / 60 / 60 + 1
                                                }
                                            }
                                            data.date_planned_differ.week = {
                                                "left": data.date_planned_differ.day.left,
                                                "width": data.date_planned_differ.day.width
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    var ddhs = [];
                    for (var i = 0; i < ddhNames.length; i++) {
                        ddhs.push({
                            "ddh": ddhNames[i],
                            "children": []
                        })
                    }
                    for (var i = 0; i < ddhs.length; i++) {
                        for (var j = 0; j < orderPlans.length; j++) {
                            if (getFromNode("value", orderPlans[j], "ddh") == ddhs[i].ddh) {
                                ddhs[i].children.push(orderPlans[j]);
                            }
                        }
                    }
                    for (var i = 0; i < ddhs.length; i++) {
                        var ddh = {
                            "id": gantt.cache.data.id++,
                            "data": ddhs[i]
                        };
                        gantt.cache.data[ddh.id] = {
                            "id": ddh.id,
                            "labels": [],
                            "text": ddhs[i].ddh,
                            "open": false,
                            "level": 2,
                            "progress_texts": [],
                            "unscheduleds": []
                        };
                        gantt.functions.label(gantt.cache.data[ddh.id], {
                                "name": "订单号",
                                "text": gantt.cache.data[ddh.id].text
                            }
                        );
                        for (var j = 0; j < ddh.data.children.length; j++) {
                            var cpbh = {
                                "id": gantt.cache.data.id++,
                                "data": ddh.data.children[j],
                                "link": gantt.cache.links.id++
                            }
                            switch (getFromNode("value", ddh.data.children[j], "jjcd")) {
                                case "特急":
                                    cpbh.level = 0;
                                    break;
                                case  "急":
                                    cpbh.level = 1;
                                    break;
                                default :
                                    cpbh.level = 2;
                            }
                            if (cpbh.level < gantt.cache.data[ddh.id].level) {
                                gantt.cache.data[ddh.id].level = cpbh.level;
                            }
                            gantt.cache.data[cpbh.id] = {
                                "id": cpbh.id,
                                "labels": [],
                                "text": getFromNode("value", cpbh.data, "cpbh"),
                                "start_date_planned": getFromNode("value", cpbh.data, "xjdrq"),
                                "end_date_planned": getFromNode("value", cpbh.data, "jhrq"),
                                "level": cpbh.level,
                                "parent": ddh.id,
                                "progress_texts": [],
                                "unscheduleds": [],
                                "open": false
                            }
                            gantt.cache.links[cpbh.link] = {
                                "id": cpbh.link,
                                "source": ddh.id,
                                "target": cpbh.id,
                                "type": "1"
                            }
                            gantt.functions.label(gantt.cache.data[cpbh.id], gantt.cache.data[ddh.id].labels);
                            gantt.functions.label(gantt.cache.data[cpbh.id], {
                                "name": "产品编号",
                                "text": gantt.cache.data[cpbh.id].text
                            });
                            gantt.functions.date(gantt.cache.data[cpbh.id]);
                            if (checkNodeExist(cpbh.data, "nggdcp")) {
                                var nggdcp = {
                                    "id": gantt.cache.data.id++,
                                    "children": [],
                                    "link": gantt.cache.links.id++
                                }
                                gantt.cache.data[nggdcp.id] = {
                                    "id": nggdcp.id,
                                    "labels": [],
                                    "text": "捻股工段",
                                    "level": cpbh.level,
                                    "parent": cpbh.id,
                                    "open": false,
                                    "progress_texts": [],
                                    "unscheduleds": []
                                }
                                gantt.cache.links[nggdcp.link] = {
                                    "id": nggdcp.link,
                                    "source": cpbh.id,
                                    "target": nggdcp.id,
                                    "type": "1"
                                }
                                gantt.functions.label(gantt.cache.data[nggdcp.id], gantt.cache.data[cpbh.id].labels);
                                gantt.functions.label(gantt.cache.data[nggdcp.id], {
                                    "name": "所属工段",
                                    "text": "捻股工段"
                                });
                                if (checkNodeExist(cpbh.data, "nggdcp.g1")) {
                                    var gs = getFromNode("gs", cpbh.data, "nggdcp");
                                    for (var k = gs.begin; k < gs.begin + gs.total; k++) {
                                        nggdcp.children.push("nggdcp.g" + k);
                                    }
                                }
                                if (checkNodeExist(cpbh.data, "nggdcp.zxg")) {
                                    nggdcp.children.push("nggdcp.zxg");
                                }
                                if (checkNodeExist(cpbh.data, "nggdcp.wg")) {
                                    nggdcp.children.push("nggdcp.wg");
                                }
                                if (checkNodeExist(cpbh.data, "nggdcp.bjsx")) {
                                    nggdcp.children.push("nggdcp.bjsx");
                                }
                                if (checkNodeExist(cpbh.data, "nggdcp.jsgx")) {
                                    nggdcp.children.push("nggdcp.jsgx");
                                }
                                for (var k = 0; k < nggdcp.children.length; k++) {
                                    var name = nggdcp.children[k];
                                    var g = {
                                        "id": gantt.cache.data.id++,
                                        "link": gantt.cache.links.id++
                                    }
                                    gantt.cache.data[g.id] = {
                                        "id": g.id,
                                        "labels": [],
                                        "text": getFromNode("text", cpbh.data, name),
                                        "start_date_planned": getFromNode("value", cpbh.data, name + ".jh.ksrq"),
                                        "end_date_planned": getFromNode("value", cpbh.data, name + ".jh.wcrq"),
                                        "start_date": getFromNode("value", cpbh.data, name + ".sj.ksrq"),
                                        "end_date": getFromNode("value", cpbh.data, name + ".sj.wcrq"),
                                        "jhcl": getFromNode("value", cpbh.data, name + ".jh.jhcl") || 0,
                                        "sjcl": getFromNode("value", cpbh.data, name + ".sj.sjcl") || 0,
                                        "level": cpbh.level,
                                        "parent": nggdcp.id,
                                        "open": false
                                    }
                                    gantt.cache.links[g.link] = {
                                        "id": g.link,
                                        "source": nggdcp.id,
                                        "target": g.id,
                                        "type": "1"
                                    }
                                    gantt.functions.label(gantt.cache.data[g.id], gantt.cache.data[nggdcp.id].labels);
                                    gantt.functions.label(gantt.cache.data[g.id], {
                                        "name": "工段产品",
                                        "text": gantt.cache.data[g.id].text
                                    });
                                    gantt.functions.date(gantt.cache.data[g.id]);
                                    gantt.functions.progress_text(gantt.cache.data[g.id]);
                                    gantt.functions.unscheduled(gantt.cache.data[g.id]);
                                    gantt.cache.data[nggdcp.id].progress_texts.push(gantt.cache.data[g.id].progress_text);
                                    gantt.cache.data[nggdcp.id].unscheduleds.push({
                                        "unscheduled": gantt.cache.data[g.id].unscheduled
                                    });
                                }
                                gantt.functions.progress_text(gantt.cache.data[nggdcp.id]);
                                gantt.functions.unscheduled(gantt.cache.data[nggdcp.id]);
                                gantt.cache.data[cpbh.id].progress_texts.push(gantt.cache.data[nggdcp.id].progress_text);
                                gantt.cache.data[cpbh.id].unscheduleds.push({
                                    "unscheduled": gantt.cache.data[nggdcp.id].unscheduled
                                });
                            }
                            if (checkNodeExist(cpbh.data, "hsgdcp")) {
                                var hsgdcp = {
                                    "id": gantt.cache.data.id++,
                                    "link": gantt.cache.links.id++
                                }
                                gantt.cache.data[hsgdcp.id] = {
                                    "id": hsgdcp.id,
                                    "labels": [],
                                    "text": "合绳工段",
                                    "level": cpbh.level,
                                    "parent": cpbh.id,
                                    "progress_texts": [],
                                    "unscheduleds": [],
                                    "open": false
                                }
                                gantt.cache.links[hsgdcp.link] = {
                                    "id": hsgdcp.link,
                                    "source": cpbh.id,
                                    "target": hsgdcp.id,
                                    "type": "1"
                                }
                                gantt.functions.label(gantt.cache.data[hsgdcp.id], gantt.cache.data[cpbh.id].labels);
                                gantt.functions.label(gantt.cache.data[hsgdcp.id], {
                                    "name": "所属工段",
                                    "text": "合绳工段"
                                });
                                var gss = {
                                    "id": gantt.cache.data.id++,
                                    "link": gantt.cache.links.id++
                                }
                                gantt.cache.data[gss.id] = {
                                    "id": gss.id,
                                    "labels": [],
                                    "text": getFromNode("text", cpbh.data, "hsgdcp.gss") || "",
                                    "start_date_planned": getFromNode("value", cpbh.data, "hsgdcp.gss.jh.ksrq"),
                                    "end_date_planned": getFromNode("value", cpbh.data, "hsgdcp.gss.jh.wcrq"),
                                    "start_date": getFromNode("value", cpbh.data, "hsgdcp.gss.sj.ksrq"),
                                    "end_date": getFromNode("value", cpbh.data, "hsgdcp.gss.sj.wcrq"),
                                    "jhcl": getFromNode("value", cpbh.data, "hsgdcp.gss.jh.jhcl") || 0,
                                    "sjcl": getFromNode("value", cpbh.data, "hsgdcp.gss.sj.sjcl") || 0,
                                    "level": cpbh.level,
                                    "parent": hsgdcp.id,
                                    "open": false
                                }
                                gantt.cache.links[gss.link] = {
                                    "id": gss.link,
                                    "source": hsgdcp.id,
                                    "target": gss.id,
                                    "type": "1"
                                }
                                gantt.functions.label(gantt.cache.data[gss.id], gantt.cache.data[hsgdcp.id].labels);
                                gantt.functions.label(gantt.cache.data[gss.id], {
                                    "name": "工段产品",
                                    "text": gantt.cache.data[gss.id].text
                                });
                                gantt.functions.date(gantt.cache.data[gss.id]);
                                gantt.functions.progress_text(gantt.cache.data[gss.id]);
                                gantt.cache.data[hsgdcp.id].progress_texts.push(gantt.cache.data[gss.id].progress_text);
                                gantt.functions.unscheduled(gantt.cache.data[gss.id]);
                                gantt.cache.data[hsgdcp.id].unscheduleds.push({
                                    "unscheduled": gantt.cache.data[gss.id].unscheduled
                                });
                                if (checkNodeExist(cpbh.data, "hsgdcp.gss.jssx")) {
                                    var jssx = {
                                        "id": gantt.cache.data.id++,
                                        "link": gantt.cache.links.id++
                                    }
                                    gantt.cache.data[jssx.id] = {
                                        "id": jssx.id,
                                        "labels": [],
                                        "text": getFromNode("text", cpbh.data, "hsgdcp.gss.jssx") || "",
                                        "start_date_planned": getFromNode("value", cpbh.data, "hsgdcp.gss.jssx.jh.ksrq"),
                                        "end_date_planned": getFromNode("value", cpbh.data, "hsgdcp.gss.jssx.jh.wcrq"),
                                        "start_date": getFromNode("value", cpbh.data, "hsgdcp.gss.jssx.sj.ksrq"),
                                        "end_date": getFromNode("value", cpbh.data, "hsgdcp.gss.jssx.sj.wcrq"),
                                        "jhcl": getFromNode("value", cpbh.data, "hsgdcp.gss.jssx.jh.jhcl") || 0,
                                        "sjcl": getFromNode("value", cpbh.data, "hsgdcp.gss.jssx.sj.sjcl") || 0,
                                        "level": cpbh.level,
                                        "parent": gss.id,
                                        "open": false
                                    }
                                    gantt.cache.links[jssx.link] = {
                                        "id": jssx.link,
                                        "source": gss.id,
                                        "target": jssx.id,
                                        "type": "1"
                                    }
                                    gantt.functions.label(gantt.cache.data[jssx.id], gantt.cache.data[hsgdcp.id].labels);
                                    gantt.functions.label(gantt.cache.data[jssx.id], {
                                        "name": "工段产品",
                                        "text": gantt.cache.data[jssx.id].text
                                    });
                                    gantt.functions.date(gantt.cache.data[jssx.id]);
                                    gantt.functions.progress_text(gantt.cache.data[jssx.id]);
                                    gantt.cache.data[hsgdcp.id].progress_texts.push(gantt.cache.data[jssx.id].progress_text);
                                    gantt.functions.unscheduled(gantt.cache.data[jssx.id]);
                                    gantt.cache.data[hsgdcp.id].unscheduleds.push({
                                        "unscheduled": gantt.cache.data[jssx.id].unscheduled
                                    });
                                }
                                gantt.functions.progress_text(gantt.cache.data[hsgdcp.id]);
                                gantt.cache.data[cpbh.id].progress_texts.push(gantt.cache.data[hsgdcp.id].progress_text);
                                gantt.functions.unscheduled(gantt.cache.data[hsgdcp.id]);
                                gantt.cache.data[cpbh.id].unscheduleds.push({
                                    "unscheduled": gantt.cache.data[hsgdcp.id].unscheduled
                                });
                            }
                            gantt.functions.progress_text(gantt.cache.data[cpbh.id]);
                            gantt.cache.data[ddh.id].progress_texts.push(gantt.cache.data[cpbh.id].progress_text);
                            gantt.functions.unscheduled(gantt.cache.data[cpbh.id]);
                            gantt.cache.data[ddh.id].unscheduleds.push({
                                "unscheduled": gantt.cache.data[cpbh.id].unscheduled
                            });
                        }
                        gantt.functions.progress_text(gantt.cache.data[ddh.id]);
                        gantt.functions.unscheduled(gantt.cache.data[ddh.id]);
                    }
                    gantt.functions.view(gantt.date.min, gantt.date.max);
                    delete gantt.cache.data.id;
                    delete gantt.cache.links.id;
                    for (var i in gantt.cache.data) {
                        gantt.cache.data[i].progress_text = (gantt.cache.data[i].progress_text * 100).toFixed(2) + "%";
                        gantt.functions.differ(gantt.cache.data[i])
                        gantt.tasks.data.push(gantt.cache.data[i]);
                    }
                    for (var i in gantt.cache.links) {
                        gantt.tasks.links.push(gantt.cache.links[i]);
                    }
                    delete gantt.cache;
                    delete gantt.functions;
                    res.status(200).json(gantt);
                })
            }
        )
        ;
    }
    ,
    getWorkLoad: function (req, res, next) {
        var filter = {
            "type.name": "virtual_library",
            "isZjp": "否"
        };
        if (req.body.alias) {
            filter["alias"] = req.body.alias;
        }
        if (req.body.cj) {
            filter["cj"] = req.body.cj;
        }
        if (req.body.bz) {
            filter["bz"] = req.body.bz;
        }
        if (req.body.czg) {
            filter["czg.id"] = req.body.czg;
        }
        if (req.body.jth) {
            filter["jth.id"] = req.body.jth;
        }
        if (req.body.jg) {
            filter["jg"] = req.body.jg;
        }

        if (req.body.type) {
            var type = req.body.type;
            switch (type) {
                case "years":
                    var duration = JSON.parse(req.body.duration);
                    var value = new Array(duration.length);
                    for (var i = 0; i < value.length; i++) {
                        value[i] = 0;
                    }
                    var min = duration[0] + "";
                    var max = (parseInt(duration[duration.length - 1]) + 1) + "";
                    filter["rksj"] = {$gte: min, $lt: max};
                    req.db.collection("form_insts").find(filter).toArray(function (err, docs) {
                        if (err) return next(error(500, err));
                        for (var i = 0; i < docs.length; i++) {
                            for (var j = 0; j < duration.length; j++) {
                                if (docs[i].rksj.indexOf(duration[j] + "") >= 0) {
                                    value[j] = parseFloat(accAdd(value[j], docs[i].zl || 0)).toFixed(2);
                                    break;
                                }
                            }
                        }
                        res.status(200).json(value);
                    });
                    break;
                case "year":
                    var year = req.body.year + "";
                    var value = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                    filter["rksj"] = {$regex: year};
                    req.db.collection("form_insts").find(filter).toArray(function (err, docs) {
                        if (err) return next(error(500, err));
                        for (var i = 0; i < docs.length; i++) {
                            for (var j = 1; j < value.length + 1; j++) {
                                if (docs[i].rksj.indexOf(year + "-" + (j < 10 ? "0" + j : j)) >= 0) {
                                    value[j - 1] = parseFloat(accAdd(value[j - 1], (docs[i].zl) || 0)).toFixed(2);
                                    break;
                                }
                            }
                        }
                        res.status(200).json(value);
                    })
                    break;

                case "month":
                    var year = parseInt(req.body.year);
                    var month = parseInt(req.body.month);
                    var day;
                    switch (month) {
                        case 1:
                        case 3:
                        case 5:
                        case 7:
                        case 8:
                        case 10:
                        case 12:
                            day = 31;
                            break;
                        case 4:
                        case 6:
                        case 9:
                        case 11:
                            day = 30;
                            break;
                        case 2:
                            if (year % 4 == 0 && year % 100 != 0 || year % 400 == 0) {
                                day = 29;
                                break;
                            }
                            else {
                                day = 28;
                                break;
                            }
                    }
                    var value = new Array(day);
                    for (var i = 0; i < value.length; i++) {
                        value[i] = 0;
                    }
                    filter["rksj"] = {$regex: year + "-" + (month < 10 ? "0" + month : month)};
                    req.db.collection("form_insts").find(filter).toArray(function (err, docs) {
                        if (err) return next(error(500, err));
                        for (var i = 0; i < docs.length; i++) {
                            for (var j = 1; j < value.length + 1; j++) {
                                if (docs[i].rksj.indexOf(year + "-" + (month < 10 ? "0" + month : month) + "-" + (j < 10 ? "0" + j : j)) >= 0) {
                                    value[j - 1] = parseFloat(accAdd(value[j - 1], (docs[i].zl) || 0)).toFixed(2);
                                    break;
                                }
                            }
                        }
                        res.status(200).json(value);
                    });
                    break;
                case "week":
                    var year = req.body.year + "";
                    var duration = JSON.parse(req.body.duration);
                    var value = new Array(duration.length);
                    for (var i = 0; i < value.length; i++) {
                        value[i] = 0;
                    }
                    var min = new Date(new Date(year + "" + "-01-01 00:00:00").getTime() +
                        1000 * 60 * 60 * 24 * 7 * (parseInt(duration[0]) - 1)).Format("yyyy-MM-dd");
                    var max;
                    if (duration[duration.length - 1] == "53") {
                        max = accAdd(year, 1) + "-01-01";
                    } else {
                        max = new Date(new Date(year + "" + "-01-01 00:00:00").getTime() +
                            1000 * 60 * 60 * 24 * 7 * parseInt(duration[duration.length - 1])).Format("yyyy-MM-dd");
                    }
                    filter["rksj"] = {$gte: min, $lt: max};
                    req.db.collection("form_insts").find(filter).toArray(function (err, docs) {
                        if (err) return next(error(500, err));
                        for (var i = 0; i < docs.length; i++) {
                            for (var j = 0; j < duration.length; j++) {
                                if (docs[i].rksj >= new Date(new Date(year + "" + "-01-01 00:00:00").getTime() +
                                        1000 * 60 * 60 * 24 * 7 * (parseInt(duration[j])) - 1).Format("yyyy-MM-dd")
                                    && docs[i].rksj < new Date(new Date(year + "" + "-01-01 00:00:00").getTime() +
                                        1000 * 60 * 60 * 24 * 7 * parseInt(duration[j + 1])).Format("yyyy-MM-dd")) {
                                    value[j] = parseFloat(accAdd(value[j], (docs[i].zl) || 0)).toFixed(2);
                                    break;
                                }
                            }
                        }
                        res.status(200).json(value);
                    });
                    break;
                case "day":
                    var day = req.body.day + "";
                    var draw = Number(req.body.draw);
                    var start = Number(req.body.start);
                    var size = Number(req.body.length);
                    var search = req.body["search[value]"];
                    if (search.indexOf("+") >= 0) {
                        search = search.replace(/\+/g, "\\+");
                    }
                    filter.rksj = {$regex: day};
                    filter["$or"] = [
                        {"jth.name": {$regex: search}},
                        {"czg.name": {$regex: search}},
                        {"jg": {$regex: search}},
                        {"zj": {$regex: search}},
                        {"nx": {$regex: search}},
                        {"lb": {$regex: search}},
                        {"djmc": {$regex: search}},
                        {"comment": {$regex: search}}
                    ]
                    var order = req.body.order;
                    var orderFilter = {};
                    var columns = req.body.columns;
                    if (order && order instanceof Array) {
                        for (var index in order) {
                            var colIndex = order[index].column
                            var orderName = columns[colIndex].data;
                            if (!orderName) continue;
                            var orderVal = order[index].dir == "asc" ? 1 : -1;
                            orderFilter[orderName] = orderVal;
                        }
                    }
                    req.db.collection("form_insts").find(filter).toArray(function (err, docs) {
                        if (err) return next(error(500, err));
                        var total = docs.length;
                        req.db.collection("form_insts").find(filter
                        ).skip(start).limit(size).sort(orderFilter).toArray(function (err, ds) {
                                if (err) return next(error(500, err));
                                res.status(200).json(
                                    {
                                        data: ds,
                                        recordsTotal: total,
                                        recordsFiltered: total,
                                        draw: draw
                                    }
                                );
                            });
                    });
            }
        }
    },
    getMachineWorkorders: function (req, res, next) {
        var status = JSON.parse(req.query.status);
        if (!req.query.jth) {
            var draw = Number(req.query.draw);
            var start = Number(req.query.start);
            var size = Number(req.query.length);
            var search = req.query.search.value;
            if (search.indexOf("+") >= 0) {
                search = search.replace(/\+/g, "\\+");
            }
            var regFilter = [
                {"device_num": {$regex: search}},
                {"device_model": {$regex: search}},
                {"length_error_rate": {$regex: search}}
            ];
            var order = req.query.order;
            var orderFilter = {};
            var columns = req.query.columns;
            if (order && order instanceof Array) {
                for (var index in order) {
                    var colIndex = order[index].column
                    var orderName = columns[colIndex].data;
                    if (!orderName) continue;
                    var orderVal = order[index].dir == "asc" ? 1 : -1;
                    orderFilter[orderName] = orderVal;
                }
            }
            req.db.collection("internal_forms").find({
                    name: "jtb",
                    "$or": regFilter
                }
            ).toArray(function (err, jths) {
                    if (err) return next(error(500, err));
                    var total = jths.length;
                    req.db.collection("internal_forms").find({
                        name: "jtb",
                        "$or": regFilter
                    }).skip(start).limit(size).sort(orderFilter).toArray(function (err, jths) {
                        if (err) return next(error(500, err));
                        var ids = [];
                        for (var i = 0; i < jths.length; i++) {
                            jths[i]._id = jths[i]._id.toString();
                            ids.push(jths[i]._id);
                        }
                        req.db.collection('form_insts').find({
                            "type.name": "work_plan",
                            "body": {
                                $elemMatch: {
                                    "_id": {$in: ids},
                                    "name": "jth"
                                }
                            },
                            "status": {$in: status}
                        }).toArray(function (err, wps) {
                            if (err) return next(error(500, err));
                            for (var i = 0; i < jths.length; i++) {
                                jths[i] = {
                                    "DT_RowId": jths[i]._id,
                                    "device_num": jths[i].device_num,
                                    "device_model": jths[i].device_model,
                                    "length_error_rate": jths[i].length_error_rate,
                                    "cache": {},
                                    "body": []
                                }
                                for (var j = 0; j < status.length; j++) {
                                    jths[i].cache[status[j]] = []
                                }
                                for (var j = 0; j < wps.length; j++) {
                                    if (getFromNode("_id", wps[j], "jth") == jths[i].DT_RowId) {
                                        var isGss = getFromNode("value", wps[j], "scyq.cpyq.gdcp.lb") == "钢丝绳" ? true : false;
                                        jths[i].cache[wps[j].status].push({
                                            "text": "工单" + (jths[i].cache[wps[j].status].length + 1),
                                            "name": "gd" + (jths[i].cache[wps[j].status].length + 1),
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "结构",
                                                    "name": "jg",
                                                    "value": getFromNode("value", wps[j], "scyq.cpyq.gdcp." +
                                                        (isGss ? "gg" : "jg"))
                                                },
                                                {
                                                    "text": "直径",
                                                    "name": "zj",
                                                    "unit": "mm",
                                                    "value": getFromNode("value", wps[j], "scyq.cpyq.gdcp.zj")
                                                },
                                                {
                                                    "text": "计划产量",
                                                    "unit": "m",
                                                    "name": "jhcl",
                                                    "value": getFromNode("value", wps[j], "cljh.jhcl")
                                                },
                                                {
                                                    "text": "实际产量",
                                                    "unit": "m",
                                                    "name": "sjcl",
                                                    "value": checkNodeExist(wps[j], "sjcl") ? getFromNode("value", wps[j],
                                                        "sjcl.ljwccl.zmc") : 0
                                                }
                                            ]
                                        })
                                    }
                                }
                            }
                            for (var i = 0; i < jths.length; i++) {
                                for (var j in jths[i].cache) {
                                    if (jths[i].cache[j].length > 0) {
                                        jths[i].body.push({
                                            "text": j,
                                            "name": j,
                                            "type": "folder",
                                            "children": _.cloneDeep(jths[i].cache[j])

                                        })
                                    }
                                    else {
                                        jths[i].body.push({
                                            "text": j,
                                            "name": j,
                                            "type": "folder",
                                            "empty": true
                                        })

                                    }
                                }
                                delete jths[i].cache;
                            }
                            res.status(200).json(
                                {
                                    data: jths,
                                    recordsTotal: total,
                                    recordsFiltered: total,
                                    draw: draw
                                }
                            );
                        });
                    });
                });
        }
        else {
            req.db.collection('form_insts').find({
                "type.name": "work_plan",
                "body": {
                    $elemMatch: {
                        "value": req.query.jth,
                        "name": "jth"
                    }
                },
                "status": {$in: status}
            }).toArray(function (err, wps) {
                if (err) return next(error(500, err));
                var cache = {};
                for (var i = 0; i < status.length; i++) {
                    cache[status[i]] = [];
                }
                for (var i = 0; i < wps.length; i++) {
                    var isGss = getFromNode("value", wps[i], "scyq.cpyq.gdcp.lb") == "钢丝绳" ? true : false;
                    cache[wps[i].status].push({
                        "name": "工单" + (cache[wps[i].status].length + 1),
                        "jg": getFromNode("value", wps[i], "scyq.cpyq.gdcp." +
                            (isGss ? "gg" : "jg")),
                        "zj": getFromNode("value", wps[i], "scyq.cpyq.gdcp.zj"),
                        "jhcl": getFromNode("value", wps[i], "cljh.jhcl"),
                        "sjcl": checkNodeExist(wps[i], "sjcl") ? getFromNode("value", wps[i],
                            "sjcl.ljwccl.zmc") : 0
                    })
                }
                res.status(200).json(cache);
            });
        }
    }
}
;