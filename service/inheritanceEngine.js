var error = require('../util/error');
var tree = require('../util/tree');
var enums = require('../util/enums');
var ObjectID = require('mongodb').ObjectID;
var moment = require('moment');
var _ = require("lodash");
var underScore = require("underscore");
var q = require("q");
var strandModel = require("./strand");
var orderItemEngine = require('./engine/orderItem');
var fs = require("fs");

// 段长，段数,单件米长,件数，总米长,个数，单件损耗，直径，工艺米长系数，吨耗，重量，含油率，参考总重量
var numberParams = ["ds", "js", "gs", "dc", "djmc", "zmc", "djsh", "zj", "gymcxs", "dh", "zl", "hyl", "ckzzl"];

function loadSpecInternalForms(db, cb) {
    db.collection("internal_forms").find({name: {$in: ['gssjgb', 'jsxjgb']}}).toArray(function (err, docs) {
        cb(err, docs);
    });
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

function getDcName(type, cs, dc, isNode) {
    var name = isNode ? "" : ".";
    for (var i = cs - 1; i > dc - 1; i--) {
        if (i == cs - 1) {
            isNode ? name += "." : "";
        }
        name += type + i;
        if (i == dc) {
            isNode ? "" : name += ".";
        } else {
            name += ".";
        }
    }
    return name;
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

function accAdd(arg1, arg2) {
    var r1, r2, m;
    try {
        r1 = arg1.toString().split(".")[1].length
    } catch (e) {
        r1 = 0
    }
    try {
        r2 = arg2.toString().split(".")[1].length
    } catch (e) {
        r2 = 0
    }
    m = Math.pow(10, Math.max(r1, r2));
    return (arg1 * m + arg2 * m) / m;
}

function checkValue(name, value) {
    if (value == undefined || value == "") {
        return {"valid": false, "type": " can not be null", "text": "不能为空"}
    }
    else {
        if (name.indexOf(".") > 0) {
            var n = name.split(".");
            name = n[n.length - 1];
        }
        for (var i = 0; i < numberParams.length; i++) {
            if (name == numberParams[i]) {
                if (checkNumber(value)) {
                    return {"valid": true};
                }
                else {
                    return {"valid": false, "type": " is not number", "text": "不是数字"};
                }
            }
        }
        return {"valid": true}
    }
}

function dumplicateNode(dump, index, begin) {
    var d = _.cloneDeep(dump);
    if (d instanceof Array) {
        var array = [];
        for (var i = 0; i < d.length; i++) {
            d[i].text = d[i].text.replace('n', index + begin);
            d[i].name = d[i].name.replace('n', index + begin);
            array.push(d[i]);
        }
        return array;
    }
    else {
        d.text = d.text.replace('n', index + begin);
        d.name = d.name.replace('n', index + begin);
        return d;
    }
}

function drawNode(total, parent, dump, name, begin) {
    if (total >= 1) {
        var array = [];
        parent[name] = {
            "total": total,
            "begin": begin
        };
        for (var i = 2; i < total + 1; i++) {
            var add = dumplicateNode(dump, i - 1, begin);
            if (add instanceof Array) {
                for (var j = 0; j < add.length; j++) {
                    array.push(add[j]);
                }
            }
            else {
                array.push(add);
            }
        }
        if (dump instanceof Array) {
            for (var i = 0; i < dump.length; i++) {
                dump[i].text = dump[i].text.replace('n', begin);
                dump[i].name = dump[i].name.replace('n', begin);
            }
        }
        else {
            dump.text = dump.text.replace('n', begin);
            dump.name = dump.name.replace('n', begin);
        }
        for (var i = 0; i < array.length; i++) {
            parent.children.push(array[i]);
        }
    }
}

function cloneInst(tmpl, status) {
    var inst = _.cloneDeep(tmpl);   // TODO: ObjectID?
    inst.tmpl_id = inst._id;
    inst._id = new ObjectID();
    inst.status = status;
    return inst;
}

function getFromNode(type, instance, name) {
    console.log("get from node - type=" + type + ",name=" + name);
    var json = tree.get(instance, name);
    switch (type) {
        case "json":
            return json;
        case "hscs" || "ngcs" || "id" || "repeat" || "sxfss" :
            return parseInt(json[type]);
        case "data":
            return instance.data[getFromNode("id", instance, name)];
        case "fullText":
            var text = "";
            if (name.indexOf(".") > 0) {
                var array = name.split(".");
                for (var i = 0; i < array.length; i++) {
                    var n = "";
                    for (var j = 0; j < i; j++) {
                        n += array[j] + ".";
                    }
                    n += array[i];
                    text += getFromNode("text", instance, n)
                    if (i < array.length - 1) {
                        text += "-";
                    }
                }
            }
            else {
                text += getFromNode("text", instance, name);
            }
            return text;
        default :
            return json[type];
    }
}

function setToNode(type, instance, name, value) {
    var json = getFromNode("json", instance, name);
    if (type == "json") {
        json = value;
    }
    else {
        if (type == "value") {
            json[type] = value + "";
        }
        else {
            json[type] = value;
        }
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

function checkNodeExist(instance, name) {
    var json = getFromNode("json", instance, name);
    if (json) {
        return true;
    } else {
        return false;
    }
}

function getNumberValue(instance, name) {
    return tree.get(instance, name).value || 0;
}

function makeForm(instance, user) {
    // 设置制表时间和制表人
    for (var i = 0; i < instance.header.length; i++) {
        if (instance.header[i].name == "author") {
            instance.header[i].value = user.last_name + user.first_name;
        }
        if (instance.header[i].name == "created") {
            instance.header[i].value = new Date().Format("yyyy-MM-dd");
        }
    }
}

function auditForm(instance, user) {
    // 设置审核时间和审核人
    for (var i = 0; i < instance.header.length; i++) {
        if (instance.header[i].name == "auditor") {
            instance.header[i].value = user.last_name + user.first_name;
        }
        if (instance.header[i].name == "audit_date") {
            instance.header[i].value = new Date().Format("yyyy-MM-dd");
        }
    }
}

function createSlld(wp, nf) {
    var mr = {
        "alias": "s_material_receive",
        "type": {
            "name": "material_receive",
            "value": "物料领用"
        },
        "llrq": "",
        "cj": getFromNode("value", wp, "cj"),
        "jth": {
            "id": getFromNode("_id", wp, "jth"),
            "name": getFromNode("value", wp, "jth")
        },
        "sggsjg": wp.sggSzj,
        "gdcp": getFromNode("value", wp, "scyq.cpyq.gdcp.lb"),
        "jhly": {
            "bz": ""
        },
        "sjly": {
            "bz": ""
        }
    }
    var sxfss = getFromNode("sxfss", wp, "scyq.cpyq.sxfs");
    var isGss = getFromNode("value", wp, "scyq.cpyq.gdcp.lb") == "钢丝绳" ? true : false;
    for (var i = sxfss.begin; i < sxfss.begin + sxfss.total; i++) {
        var lp = _.cloneDeep(mr);
        lp.wllx = "fl";
        lp.fl = "lp";
        lp.xh = getFromNode("value", wp, "scyq.cpyq.sxfs.sxfs" + i + "." + (isGss ? "lpxh" : "gzlxh"));
        lp.jhly.gs = getFromNode("value", wp, "scyq.cpyq.sxfs.sxfs" + i + ".js");
        lp.sjly.gs = "";
        nf.push(lp);
    }
    var names = [];
    if (checkNodeExist(wp, "scyq.jxyl.zjp")) names.push("zjp");
    if (checkNodeExist(wp, "scyq.jxyl.jssx")) names.push("jssx");
    if (checkNodeExist(wp, "scyq.jxyl.jsgx")) names.push("jsgx");
    if (checkNodeExist(wp, "scyq.jxyl.bjsx")) names.push("bjsx");
    if (checkNodeExist(wp, "scyq.jxyl.zxg")) names.push("zxg");
    if (checkNodeExist(wp, "scyq.jxyl.wg")) names.push("wg");
    if (checkNodeExist(wp, "scyq.jxyl.xwx")) names.push("xwx");
    if (checkNodeExist(wp, "scyq.jxyl.yz")) names.push("yz");
    if (getFromNode("gcs", wp, "scyq.jxyl")) {
        var gcs = getFromNode("gcs", wp, "scyq.jxyl");
        for (var i = gcs.begin; i < gcs.begin + gcs.total; i++) {
            var gs = getFromNode("gs", wp, "scyq.jxyl.gdc" + i);
            for (var j = gs.begin; j < gs.begin + gs.total; j++) {
                names.push("gdc" + i + ".g" + j);
            }
        }
    }
    for (var i = 0; i < names.length; i++) {
        if (names[i] == "yz") {
            var yz = _.cloneDeep(mr);
            yz.wllx = "fl";
            yz.fl = "yz";
            yz.tyfs = getFromNode("value", wp, "scyq.jxyl." + names[i] + ".yl.tyfs");
            yz.yzxh = getFromNode("value", wp, "scyq.jxyl." + names[i] + ".gg.xh");
            yz.jhly.zl = getFromNode("value", wp, "scyq.jxyl." + names[i] + ".yl.zl");
            yz.sjly.js = "";
            yz.sjly.zl = "";
            nf.push(yz);
        }
        else if (names[i] == "xwx") {
            var xwx = _.cloneDeep(mr);
            xwx.wllx = "fl";
            xwx.fl = "xwx";
            xwx.gg = {
                "lb": getFromNode("value", wp, "scyq.jxyl." + names[i] + ".gg.lb"),
                "zj": getFromNode("value", wp, "scyq.jxyl." + names[i] + ".gg.zj"),
                "hyl": getFromNode("value", wp, "scyq.jxyl." + names[i] + ".gg.hyl"),
                "nx": getFromNode("value", wp, "scyq.jxyl." + names[i] + ".gg.nx")
            }
            xwx.jhly.zl = getFromNode("value", wp, "scyq.jxyl." + names[i] + ".yl.zl");
            xwx.sjly.zl = "";
            nf.push(xwx);
        }
        else {
            var lb = names[i].indexOf("gdc") >= 0 ? "股" : getFromNode("text", wp, "scyq.jxyl." + names[i]);
            var yls = getFromNode("yls", wp, "scyq.jxyl." + names[i] + ".yl");
            for (var j = yls.begin; j < yls.begin + yls.total; j++) {
                var g = _.cloneDeep(mr);
                g.wllx = "zl";
                g.gg = {
                    "sfdz": getFromNode("value", wp, "sfdz"),
                    "lb": lb,
                    "zj": getFromNode("value", wp, "scyq.jxyl." + names[i] + ".gg.zj"),
                    "qd": getFromNode("value", wp, "scyq.jxyl." + names[i] + ".gg.qd"),
                    "bmzt": getFromNode("value", wp, "scyq.jxyl." + names[i] + ".gg.bmzt")
                };
                g.yl = {
                    "djmc": getFromNode("value", wp, "scyq.jxyl." + names[i] + ".yl.yl" + j + ".djxqmc"),
                    "gzlxh": getFromNode("value", wp, "scyq.jxyl." + names[i] + ".yl.yl" + j + ".gzlxh")
                }
                g.jhly.js = getFromNode("value", wp, "scyq.jxyl." + names[i] + ".yl.yl" + j + ".js");
                g.sjly.js = "";
                nf.push(g);
            }
        }
    }
}

function createGlld(wp, nf) {
    var mr = {
        "alias": "g_material_receive",
        "type": {
            "name": "material_receive",
            "value": "物料领用"
        },
        "llrq": "",
        "cj": getFromNode("value", wp, "cj"),
        "jth": {
            "id": getFromNode("_id", wp, "jth"),
            "name": getFromNode("value", wp, "jth")
        },
        "sggsjg": wp.sggSzj,
        "gdcp": getFromNode("value", wp, "scyq.cpyq.gdcp.lb"),
        "jhly": {
            "bz": ""
        },
        "sjly": {
            "bz": ""
        }
    }
    var sxfss = getFromNode("sxfss", wp, "scyq.cpyq.sxfs");
    for (var i = sxfss.begin; i < sxfss.begin + sxfss.total; i++) {
        var lp = _.cloneDeep(mr);
        lp.wllx = "fl";
        lp.fl = "gzl";
        lp.xh = getFromNode("value", wp, "scyq.cpyq.sxfs.sxfs" + i + "." + "gzlxh");
        lp.jhly.gs = getFromNode("value", wp, "scyq.cpyq.sxfs.sxfs" + i + ".js");
        lp.sjly.gs = "";
        nf.push(lp);
    }
    var names = [];
    if (checkNodeExist(wp, "scyq.jxyl.zjp")) names.push("zjp");
    if (checkNodeExist(wp, "scyq.jxyl.wgs")) {
        var ss = getFromNode("ss", wp, "scyq.jxyl.wgs");
        for (var i = ss.begin; i < ss.begin + ss.total; i++) {
            names.push("wgs.s" + i);
        }
    }
    if (checkNodeExist(wp, "scyq.jxyl.zxs")) names.push("zxs");
    if (getFromNode("ss", wp, "scyq.jxyl")) {
        var ss = getFromNode("ss", wp, "scyq.jxyl");
        for (var i = ss.begin; i < ss.begin + ss.total; i++) {
            names.push("s" + i);
        }
    }
    if (getFromNode("scs", wp, "scyq.jxyl")) {
        var scs = getFromNode("scs", wp, "scyq.jxyl");
        for (var i = scs.begin; i < scs.begin + scs.total; i++) {
            var ss = getFromNode("ss", wp, "scyq.jxyl.sdc" + i);
            for (var j = ss.begin; j < ss.begin + ss.total; j++) {
                names.push("sdc" + i + ".s" + j);
            }
        }
    }
    if (checkNodeExist(wp, "scyq.jxyl.xwx")) names.push("xwx");
    if (checkNodeExist(wp, "scyq.jxyl.yz")) names.push("yz");
    if (getFromNode("gcs", wp, "scyq.jxyl")) {
        var gcs = getFromNode("gcs", wp, "scyq.jxyl");
        for (var i = gcs.begin; i < gcs.begin + gcs.total; i++) {
            var gs = getFromNode("gs", wp, "scyq.jxyl.gdc" + i);
            for (var j = gs.begin; j < gs.begin + gs.total; j++) {
                names.push("gdc" + i + ".g" + j);
            }
        }
    }
    for (var i = 0; i < names.length; i++) {
        if (names[i] == "yz") {
            var yz = _.cloneDeep(mr);
            yz.wllx = "fl";
            yz.fl = "yz";
            yz.tyfs = getFromNode("value", wp, "scyq.jxyl." + names[i] + ".yl.tyfs");
            yz.yzxh = getFromNode("value", wp, "scyq.jxyl." + names[i] + ".gg.xh");
            yz.jhly.zl = getFromNode("value", wp, "scyq.jxyl." + names[i] + ".yl.zl");
            yz.sjly.js = "";
            yz.sjly.zl = "";
            nf.push(yz);
        }
        else if (names[i] == "xwx") {
            var xwx = _.cloneDeep(mr);
            xwx.wllx = "fl";
            xwx.fl = "xwx";
            xwx.gg = {
                "lb": getFromNode("value", wp, "scyq.jxyl." + names[i] + ".gg.lb"),
                "zj": getFromNode("value", wp, "scyq.jxyl." + names[i] + ".gg.zj"),
                "hyl": getFromNode("value", wp, "scyq.jxyl." + names[i] + ".gg.hyl"),
                "nx": getFromNode("value", wp, "scyq.jxyl." + names[i] + ".gg.nx")
            }
            xwx.jhly.zl = getFromNode("value", wp, "scyq.jxyl." + names[i] + ".yl.zl");
            xwx.sjly.zl = "";
            nf.push(xwx);
        }
        else {
            var lb = "";
            if (names[i] == "zxs")lb = "中心丝"
            else if (names[i].indexOf("wgs") >= 0)lb = "外钢丝"
            else lb = "丝"
            var yls = getFromNode("yls", wp, "scyq.jxyl." + names[i] + ".yl");
            for (var j = yls.begin; j < yls.begin + yls.total; j++) {
                var g = _.cloneDeep(mr);
                g.wllx = "zl";
                if (names[i])
                    g.gg = {
                        "sfdz": getFromNode("value", wp, "sfdz"),
                        "lb": lb,
                        "zj": getFromNode("value", wp, "scyq.jxyl." + names[i] + ".gg.zj"),
                        "qd": getFromNode("value", wp, "scyq.jxyl." + names[i] + ".gg.qd")
                    };
                g.yl = {
                    "djmc": getFromNode("value", wp, "scyq.jxyl." + names[i] + ".yl.yl" + j + ".djxqmc"),
                    "gzlxh": getFromNode("value", wp, "scyq.jxyl." + names[i] + ".yl.yl" + j + ".gzlxh")
                }
                g.jhly.js = getFromNode("value", wp, "scyq.jxyl." + names[i] + ".yl.yl" + j + ".js");
                g.sjly.js = "";
                nf.push(g);
            }
        }
    }
}

var formProcesses = {

        // 创建订单分解表实例
        createOrderItemsForm: orderItemEngine.createOrderItemsForm,

        /**
         * 创建订单计划表实例。从订单分解表传承过来
         *
         * @param orderItemInst 单个订单分解表实例
         * @param formsMap 所有表单模版
         * @param newFormInsts 用来保存所有新建的表单实例
         */
        createOrderPlan: function (user, orderItemInst, orders, formsMap, newFormInsts) {
            var inst = cloneInst(formsMap.order_plan, enums.StatusEnum.NOT_PROCESSED);
            var cpbh = "";
            var sfdz = "";
            var data = getFromNode("data", orderItemInst, "gss");
            var attrArray = [
                {"name": "ddh", "text": "订单号"},
                {"name": "cpbh", "text": "产品编号"},
                {"name": "lb", "text": "类别"},
                {"name": "gg", "text": "规格"},
                {"name": "zj", "text": "直径"},
                {"name": "djmc", "text": "单件米长"},
                {"name": "js", "text": "件数"},
                {"name": "qd", "text": "强度"},
                {"name": "nx", "text": "捻向"},
                {"name": "nj", "text": "捻距"},
                {"name": "tyfs", "text": "涂油方式"},
                {"name": "tsyq", "text": "特殊要求"},
                {"name": "yt", "text": "用途"}
            ];
            for (var i = 0; i < data.length; i++) {
                for (var j = 0; j < attrArray.length; j++) {
                    if (data[i].name == attrArray[j].name) {
                        if (data[i].name != "tsyq") {
                            var result = checkValue(attrArray[j].name, data[i].value);
                            if (result.valid) {
                                setToNode("value", inst, attrArray[j].name, data[i].value);
                            }
                            else {
                                console.log("error:the value of gss." + attrArray[j].name + result.type);
                                throw new Error("<span>" + "[表单]:" + orderItemInst.name + "<br/>" +
                                    "[产品编号]:" + orderItemInst.cpbh + "<br/>" +
                                    "[节点]:" + getFromNode("fullText", orderItemInst, "gss") + "<br/>"
                                    + "[原因]:" + attrArray[j].text + result.text + "</span>");
                            }
                            if (data[i].name == "ddh" || data[i].name == "cpbh" || data[i].name == "lb" || data[i].name == "gg" || data[i].name == "zj") {
                                inst[data[i].name] = data[i].value + "";
                            }
                            if (data[i].name == "cpbh") {
                                cpbh = data[i].value + "";
                            }
                        }
                        else {
                            setToNode("value", inst, attrArray[j].name, data[i].value);
                        }
                        break;
                    }
                }
            }
            for (var i = 0; i < orders.length; i++) {
                var children = orders[i].children;
                var exist = false;
                for (var j = 0; j < children.length; j++) {
                    if (children[j].cpbh == cpbh) {
                        var xjdrq = getFromNode("value", orders[i], "xjdrq");
                        if (xjdrq) {
                            setToNode("value", inst, "xjdrq", xjdrq);
                        }
                        else {
                            console.log("error:the value of xjdrq can not be null");
                            throw new Error("<span>" + "[表单]:" + orders[i].name + "<br/>" +
                                "[订单号]:" + getFromNode("value", orders[i], "ddh") + "<br/>" +
                                "[原因]:下接单日期不能为空");
                        }
                        var jhrq = children[j].ship_date;
                        if (jhrq) {
                            setToNode("value", inst, "jhrq", jhrq);
                        }
                        else {
                            console.log("error:the value of jhrq can not be null");
                            throw new Error("<span>" + "[表单]:" + orders[i].name + "<br/>" +
                                "[订单号]:" + getFromNode("value", orders[i], "ddh") + "<br/>" +
                                "[产品编号]:" + children[j].cpbh + "<br/>" +
                                "[原因]:交货日期不能为空");
                        }
                        var jjcd = children[j].urgency;
                        if (jjcd) {
                            setToNode("value", inst, "jjcd", jjcd);
                        }
                        else {
                            console.log("error:the value of jjcd can not be null");
                            throw new Error("<span>" + "[表单]:" + orders[i].name + "<br/>" +
                                "[订单号]:" + getFromNode("value", orders[i], "ddh") + "<br/>" +
                                "[产品编号]:" + children[j].cpbh + "<br/>" +
                                "[原因]:紧急程度不能为空");
                        }
                        sfdz = children[j].is_customized + "";
                        if (!sfdz) {
                            console.log("error:the value of sfdz can not be null");
                            throw new Error("<span>" + "[表单]:" + orders[i].name + "<br/>" +
                                "[订单号]:" + getFromNode("value", orders[i], "ddh") + "<br/>" +
                                "[产品编号]:" + children[j].cpbh + "<br/>" +
                                "[原因]:是否定制不能为空");
                        }
                        exist = true;
                        break;
                    }
                }
                if (exist) {
                    break;
                }
            }
            var hscs = getFromNode("hscs", orderItemInst, "gss");
            var hsdc1NNodeName = getDcName("hs", hscs, 1, false);
            if (checkNodeExist(orderItemInst, "gss" + hsdc1NNodeName + "jssx")) {
                deleteFromNode(inst, "nggdcp", "jsgx");
                deleteFromNode(inst, "nggdcp", "bjsx");
            }
            else if (checkNodeExist(orderItemInst, "gss" + hsdc1NNodeName + "jsgx")) {
                deleteFromNode(inst, "nggdcp", "bjsx");
                deleteFromNode(inst, "nggdcp", "zxg");
                deleteFromNode(inst, "nggdcp", "wg");
                deleteFromNode(inst, "hsgdcp.gss", "jssx");
            }
            else if (checkNodeExist(orderItemInst, "gss" + hsdc1NNodeName + "bjsx")) {
                deleteFromNode(inst, "hsgdcp.gss", "jssx");
                deleteFromNode(inst, "nggdcp", "jsgx");
                deleteFromNode(inst, "nggdcp", "zxg");
                deleteFromNode(inst, "nggdcp", "wg");
            }
            else {
                deleteFromNode(inst, "hsgdcp.gss", "jssx");
                deleteFromNode(inst, "nggdcp", "jsgx");
                deleteFromNode(inst, "nggdcp", "bjsx");
                deleteFromNode(inst, "nggdcp", "zxg");
                deleteFromNode(inst, "nggdcp", "wg");
            }
            setToNode("value", inst, "hsgdcp.gss.jssx.sfdz", sfdz);
            var attrArray = [
                {"name": "gg.jg", "text": "规格-结构"},
                {"name": "gg.zj", "text": "规格-直径"},
                {"name": "gg.nx", "text": "规格-捻向"},
                {"name": "gg.qd", "text": "规格-强度"},
                {"name": "gg.nj", "text": "规格-捻距"},
                {"name": "gg.tyfs", "text": "规格-涂油方式"}
            ];
            if (checkNodeExist(orderItemInst, "gss" + hsdc1NNodeName + "jssx")) {
                var data = getFromNode("data", orderItemInst, "gss" + hsdc1NNodeName + "jssx");
                for (var i = 0; i < data.length; i++) {
                    for (var j = 0; j < attrArray.length; j++) {
                        if (data[i].name == attrArray[j].name) {
                            var result = checkValue(attrArray[j].name, data[i].value);
                            if (result.valid) {
                                setToNode("value", inst, "hsgdcp.gss.jssx." + attrArray[j].name, data[i].value);
                            }
                            else {
                                console.log("error:the value of gss" + hsdc1NNodeName + "jssx." + attrArray[j].name + result.type);
                                throw new Error("<span>" + "[表单]:" + orderItemInst.name + "<br/>" +
                                    "[产品编号]:" + orderItemInst.cpbh + "<br/>" +
                                    "[节点]:" + getFromNode("fullText", orderItemInst, "gss" + hsdc1NNodeName + "jssx") + "<br/>"
                                    + "[原因]:" + attrArray[j].text + result.text + "</span>");
                            }
                            break;
                        }
                    }
                }
            }
            setToNode("value", inst, "nggdcp.sfdz", sfdz)
            var allNgNameArray = [];
            var gNameArray = [];
            for (var i = 1; i < hscs + 1; i++) {
                var hsdcNodeName = getDcName("hs", hscs, i, true);
                var hsdcNNodeName = getDcName("hs", hscs, i, false);
                var gcs = getFromNode("gcs", orderItemInst, "gss" + hsdcNodeName);
                for (var j = parseInt(gcs[0]); j < parseInt(gcs[0]) + gcs.length; j++) {
                    var gs = getFromNode("repeat", orderItemInst, "gss" + hsdcNNodeName + "gdc" + j + ".g1");
                    for (var k = 1; k < gs + 1; k++) {
                        gNameArray.push("gss" + hsdcNNodeName + "gdc" + j + ".g" + k);
                        allNgNameArray.push("gss" + hsdcNNodeName + "gdc" + j + ".g" + k);
                    }
                }
            }
            drawNode(gNameArray.length, getFromNode("json", inst, "nggdcp"), getFromNode("json", inst, "nggdcp.gn"), "gs", 1);
            tree.expire(inst);
            for (var i = 0; i < gNameArray.length; i++) {
                var data = getFromNode("data", orderItemInst, gNameArray[i]);
                var name = gNameArray[i];
                for (var j = 0; j < data.length; j++) {
                    for (var k = 0; k < attrArray.length; k++) {
                        if (data[j].name == attrArray[k].name) {
                            var result = checkValue(attrArray[k].name, data[j].value);
                            if (result.valid) {
                                setToNode("value", inst, "nggdcp.g" + (i + 1) + "." + attrArray[k].name, data[j].value);
                            }
                            else {
                                console.log("error:the value of " + name + "." + attrArray[k].name + result.type);
                                throw new Error("<span>" + "[表单]:" + orderItemInst.name + "<br/>" +
                                    "[产品编号]:" + orderItemInst.cpbh + "<br/>" +
                                    "[节点]:" + getFromNode("fullText", orderItemInst, name) + "<br/>"
                                    + "[原因]:" + attrArray[k].text + result.text + "</span>");
                            }
                            break;
                        }
                    }
                }
            }
            if (checkNodeExist(orderItemInst, "gss" + hsdc1NNodeName + "jssx")) {
                var data = getFromNode("data", orderItemInst, "gss" + hsdc1NNodeName + "jssx.zxg");
                for (var i = 0; i < data.length; i++) {
                    for (var j = 0; j < attrArray.length; j++) {
                        if (data[i].name == attrArray[j].name) {
                            var result = checkValue(attrArray[j].name, data[i].value);
                            if (result.valid) {
                                setToNode("value", inst, "nggdcp.zxg." + attrArray[j].name, data[i].value);
                            }
                            else {
                                console.log("error:the value of gss" + hsdc1NNodeName + "jssx.zxg." + attrArray[j].name + result.type);
                                throw new Error("<span>" + "[表单]:" + orderItemInst.name + "<br/>" +
                                    "[产品编号]:" + orderItemInst.cpbh + "<br/>" +
                                    "[节点]:" + getFromNode("fullText", orderItemInst, "gss" + hsdc1NNodeName + "jssx.zxg") + "<br/>"
                                    + "[原因]:" + attrArray[j].text + result.text + "</span>");
                            }
                            break;
                        }
                    }
                }
                allNgNameArray.push("gss" + hsdc1NNodeName + "jssx.zxg");
                var data = getFromNode("data", orderItemInst, "gss" + hsdc1NNodeName + "jssx.wg");
                for (var i = 0; i < data.length; i++) {
                    for (var j = 0; j < attrArray.length; j++) {
                        if (data[i].name == attrArray[j].name) {
                            var result = checkValue(attrArray[j].name, data[i].value);
                            if (result.valid) {
                                setToNode("value", inst, "nggdcp.wg." + attrArray[j].name, data[i].value);
                            }
                            else {
                                console.log("error:the value of gss" + hsdc1NNodeName + "jssx.wg." + attrArray[j].name + result.type);
                                throw new Error("<span>" + "[表单]:" + orderItemInst.name + "<br/>" +
                                    "[产品编号]:" + orderItemInst.cpbh + "<br/>" +
                                    "[节点]:" + getFromNode("fullText", orderItemInst, "gss" + hsdc1NNodeName + "jssx.wg") + "<br/>"
                                    + "[原因]:" + attrArray[j].text + result.text + "</span>");
                            }
                            break;
                        }
                    }
                }
                allNgNameArray.push("gss" + hsdc1NNodeName + "jssx.wg");
            }
            if (checkNodeExist(orderItemInst, "gss" + hsdc1NNodeName + "jsgx")) {
                var data = getFromNode("data", orderItemInst, "gss" + hsdc1NNodeName + "jsgx");
                for (var i = 0; i < data.length; i++) {
                    for (var j = 0; j < attrArray.length; j++) {
                        if (data[i].name == attrArray[j].name) {
                            var result = checkValue(attrArray[j].name, data[i].value);
                            if (result.valid) {
                                setToNode("value", inst, "nggdcp.jsgx." + attrArray[j].name, data[i].value);
                            }
                            else {
                                console.log("error:the value of gss" + hsdc1NNodeName + "jsgx." + attrArray[j].name + result.type);
                                throw new Error("<span>" + "[表单]:" + orderItemInst.name + "<br/>" +
                                    "[产品编号]:" + orderItemInst.cpbh + "<br/>" +
                                    "[节点]:" + getFromNode("fullText", orderItemInst, "gss" + hsdc1NNodeName + "jsgx") + "<br/>"
                                    + "[原因]:" + attrArray[j].text + result.text + "</span>");
                            }
                            break;
                        }
                    }
                }
                allNgNameArray.push("gss" + hsdc1NNodeName + "jsgx");
            }
            if (checkNodeExist(orderItemInst, "gss" + hsdc1NNodeName + "bjsx")) {
                var data = getFromNode("data", orderItemInst, "gss" + hsdc1NNodeName + "bjsx");
                for (var i = 0; i < data.length; i++) {
                    for (var j = 0; j < attrArray.length; j++) {
                        if (data[i].name == attrArray[j].name) {
                            var result = checkValue(attrArray[j].name, data[i].value);
                            if (result.valid) {
                                setToNode("value", inst, "nggdcp.bjsx." + attrArray[j].name, data[i].value);
                            }
                            else {
                                console.log("error:the value of gss" + hsdc1NNodeName + "bjsx." + attrArray[j].name + result.type);
                                throw new Error("<span>" + "[表单]:" + orderItemInst.name + "<br/>" +
                                    "[产品编号]:" + orderItemInst.cpbh + "<br/>" +
                                    "[节点]:" + getFromNode("fullText", orderItemInst, "gss" + hsdc1NNodeName + "bjsx") + "<br/>"
                                    + "[原因]:" + attrArray[j].text + result.text + "</span>");
                            }
                            break;
                        }
                    }
                }
                allNgNameArray.push("gss" + hsdc1NNodeName + "bjsx");
            }
            deleteFromNode(inst, ".", "cpsgdcp");
            deleteFromNode(inst, ".", "plgdcp");
            makeForm(inst, user);
            inst["khdm"] = orderItemInst["khdm"];
            inst["complete"] = 0;
            newFormInsts.push(inst);
            return inst;
        }
        ,

        /**
         * 创建生产计划表实例。从订单分解表传承。
         *
         * @param orderItemInst 订单分解实例
         * @param orders 订单内容
         * @param formsMap
         * @param newFormInsts
         */
        createProductionPlan: function (user, orderItemInst, orders, formsMap, newFormInsts) {
            //=========================================主数据=========================================
            var cpbh = "";
            var sfdz = "";
            var bmzt = "";
            var tsyq = "";
            var sggSzj = "";
            var yt = "";
            var sgg = "";
            var szj = "";
            var jhrq = "";
            var data = getFromNode("data", orderItemInst, "gss");
            for (var i = 0; i < data.length; i++) {
                if (data[i].name == "cpbh") {
                    if (data[i].value) {
                        cpbh = data[i].value + "";
                    }
                    else {
                        console.log("error:the value of cpbh can not be null");
                        throw new Error("<span>" + "[表单]:" + orderItemInst.name + "<br/>" +
                            "[原因]:产品编号不能为空");
                    }
                }
                if (data[i].name == "lb") {
                    if (data[i].value) {
                        bmzt = data[i].value + "";
                    }
                    else {
                        console.log("error:the value of lb can not be null");
                        throw new Error("<span>" + "[表单]:" + orderItemInst.name + "<br/>" +
                            "[原因]:类别不能为空");
                    }
                }
                if (data[i].name == "tsyq") {
                    if (data[i].value) {
                        tsyq = data[i].value + "";
                    }
                }
                if (data[i].name == "yt") {
                    if (data[i].value) {
                        yt = data[i].value + "";
                    }
                }
                if (data[i].name == "gg") {
                    if (data[i].value) {
                        sgg = data[i].value + "";
                    }
                }
                if (data[i].name == "zj") {
                    if (data[i].value) {
                        szj = data[i].value + "";
                    }
                }
            }
            sggSzj = sgg + "-" + szj;
            for (var i = 0; i < orders.length; i++) {
                var children = orders[i].children;
                var exist = false;
                for (var j = 0; j < children.length; j++) {
                    if (children[j].cpbh == cpbh) {
                        if (children[j].is_customized) {
                            sfdz = children[j].is_customized + "";
                        }
                        else {
                            console.log("error:the value of sfdz can not be null");
                            throw new Error("<span>" + "[表单]:" + orders[i].name + "<br/>" +
                                "[订单号]:" + getFromNode("value", orders[i], "ddh") + "<br/>" +
                                "[产品编号]:" + children[j].cpbh + "<br/>" +
                                "[原因]:是否定制不能为空");
                        }
                        if (children[j].ship_date) {
                            jhrq = children[j].ship_date + "";
                        }
                        else {
                            console.log("error:the value of jhrq can not be null");
                            throw new Error("<span>" + "[表单]:" + orders[i].name + "<br/>" +
                                "[订单号]:" + getFromNode("value", orders[i], "ddh") + "<br/>" +
                                "[产品编号]:" + children[j].cpbh + "<br/>" +
                                "[原因]:交货日期不能为空");
                        }
                        exist = true;
                        break;
                    }
                }
                if (exist) {
                    break;
                }
            }
            var allNgNameArray = [];
            var hscs = getFromNode("hscs", orderItemInst, "gss");
            for (var i = 1; i < hscs + 1; i++) {
                var hs_inst = cloneInst(formsMap.hs_production_plan, enums.StatusEnum.NOT_PROCESSED);
                var hsdcNNodeName = getDcName("hs", hscs, i, false);
                var hsdcNodeName = getDcName("hs", hscs, i, true);
                if (i == 1) {
                    if (checkNodeExist(orderItemInst, "gss" + hsdcNNodeName + "jssx")) {
                        var hs_jssx_inst = cloneInst(formsMap.hs_production_plan, enums.StatusEnum.NOT_PROCESSED);
                        deleteFromNode(hs_jssx_inst, "hsqyl", "gdcn");
                        deleteFromNode(hs_jssx_inst, "hsqyl", "zjp");
                        deleteFromNode(hs_jssx_inst, "hsqyl", "xwx");
                        deleteFromNode(hs_jssx_inst, "hsqyl", "bjsx");
                        deleteFromNode(hs_jssx_inst, "hsqyl", "jssx");
                        deleteFromNode(hs_jssx_inst, "hsqyl", "jsgx");
                        var data = getFromNode("data", orderItemInst, "gss" + hsdcNNodeName + "jssx.zxg");
                        allNgNameArray.push("gss" + hsdcNNodeName + "jssx.zxg");
                        var sxfss = getFromNode("sxfss", orderItemInst, "gss" + hsdcNNodeName + "jssx.zxg");
                        drawNode(sxfss, getFromNode("json", hs_jssx_inst, "hsqyl.zxg.yl"), getFromNode("json", hs_jssx_inst, "hsqyl.zxg.yl.yln"), "yls", 1);
                        tree.expire(hs_jssx_inst);
                        var attrArray = [
                            {"name": "gg.jg", "text": "规格-结构"},
                            {"name": "gg.zj", "text": "规格-直径"},
                            {"name": "gg.nx", "text": "规格-捻向"},
                            {"name": "gg.qd", "text": "规格-强度"},
                            {"name": "gg.tyfs", "text": "规格-涂油方式"},
                            {"name": "gg.nj", "text": "规格-捻距"}
                        ];
                        for (var j = 1; j < sxfss + 1; j++) {
                            attrArray.push({"name": "yl.sxfs" + j + ".dc", "text": "用量-收线方式" + j + "-段长"});
                            attrArray.push({"name": "yl.sxfs" + j + ".ds", "text": "用量-收线方式" + j + "-段数"});
                            attrArray.push({"name": "yl.sxfs" + j + ".js", "text": "用量-收线方式" + j + "-件数"});
                            attrArray.push({"name": "yl.sxfs" + j + ".djmc", "text": "用量-收线方式" + j + "-单件米长"});
                            attrArray.push({"name": "yl.sxfs" + j + ".zmc", "text": "用量-收线方式" + j + "-总米长"});
                            attrArray.push({"name": "yl.sxfs" + j + ".gzlxh", "text": "用量-收线方式" + j + "-工字轮型号"});
                        }
                        for (var j = 0; j < data.length; j++) {
                            for (var k = 0; k < attrArray.length; k++) {
                                if (data[j].name == attrArray[k].name) {
                                    var result = checkValue(attrArray[k].name, data[j].value);
                                    if (result.valid) {
                                        if (data[j].name.indexOf("sxfs") >= 0) {
                                            attrArray[k].name = attrArray[k].name.replace("sxfs", "yl");
                                        }
                                        setToNode("value", hs_jssx_inst, "hsqyl.zxg." + attrArray[k].name, data[j].value);
                                    }
                                    else {
                                        console.log("error:the value of gss" + hsdcNNodeName + "jssx.zxg." + attrArray[k].name + result.type);
                                        throw new Error("<span>" + "[表单]:" + orderItemInst.name + "<br/>" +
                                            "[产品编号]:" + orderItemInst.cpbh + "<br/>" +
                                            "[节点]:" + getFromNode("fullText", orderItemInst, "gss" + hsdcNNodeName + "jssx.zxg") + "<br/>"
                                            + "[原因]:" + attrArray[k].text + result.text + "</span>");
                                    }
                                    break;
                                }
                            }
                        }
                        setToNode("value", hs_jssx_inst, "hsqyl.zxg.gg.bmzt", bmzt);
                        var data = getFromNode("data", orderItemInst, "gss" + hsdcNNodeName + "jssx.wg");
                        allNgNameArray.push("gss" + hsdcNNodeName + "jssx.wg");
                        var sxfss = getFromNode("sxfss", orderItemInst, "gss" + hsdcNNodeName + "jssx.wg");
                        drawNode(sxfss, getFromNode("json", hs_jssx_inst, "hsqyl.wg.yl"), getFromNode("json", hs_jssx_inst, "hsqyl.wg.yl.yln"), "yls", 1);
                        tree.expire(hs_jssx_inst);
                        var attrArray = [
                            {"name": "gg.jg", "text": "规格-结构"},
                            {"name": "gg.zj", "text": "规格-直径"},
                            {"name": "gg.nx", "text": "规格-捻向"},
                            {"name": "gg.qd", "text": "规格-强度"},
                            {"name": "gg.tyfs", "text": "规格-涂油方式"},
                            {"name": "gg.nj", "text": "规格-捻距"},
                            {"name": "yl.gs", "text": "用量-个数"}
                        ];
                        for (var j = 1; j < sxfss + 1; j++) {
                            attrArray.push({"name": "yl.sxfs" + j + ".dc", "text": "用量-收线方式" + j + "-段长"});
                            attrArray.push({"name": "yl.sxfs" + j + ".ds", "text": "用量-收线方式" + j + "-段数"});
                            attrArray.push({"name": "yl.sxfs" + j + ".js", "text": "用量-收线方式" + j + "-件数"});
                            attrArray.push({"name": "yl.sxfs" + j + ".djmc", "text": "用量-收线方式" + j + "-单件米长"});
                            attrArray.push({"name": "yl.sxfs" + j + ".zmc", "text": "用量-收线方式" + j + "-总米长"});
                            attrArray.push({"name": "yl.sxfs" + j + ".gzlxh", "text": "用量-收线方式" + j + "-工字轮型号"});
                        }
                        for (var j = 0; j < data.length; j++) {
                            for (var k = 0; k < attrArray.length; k++) {
                                if (data[j].name == attrArray[k].name) {
                                    var result = checkValue(attrArray[k].name, data[j].value);
                                    if (result.valid) {
                                        if (data[j].name.indexOf("sxfs") >= 0) {
                                            attrArray[k].name = attrArray[k].name.replace("sxfs", "yl");
                                        }
                                        setToNode("value", hs_jssx_inst, "hsqyl.wg." + attrArray[k].name, data[j].value);
                                    }
                                    else {
                                        console.log("error:the value of gss" + hsdcNNodeName + "jssx.wg." + attrArray[k].name + result.type);
                                        throw new Error("<span>" + "[表单]:" + orderItemInst.name + "<br/>" +
                                            "[产品编号]:" + orderItemInst.cpbh + "<br/>" +
                                            "[节点]:" + getFromNode("fullText", orderItemInst, "gss" + hsdcNNodeName + "jssx.wg") + "<br/>"
                                            + "[原因]:" + attrArray[k].text + result.text + "</span>");
                                    }
                                    break;
                                }
                            }
                        }
                        setToNode("value", hs_jssx_inst, "hsqyl.wg.gg.bmzt", bmzt);
                        var data = getFromNode("data", orderItemInst, "gss" + hsdcNNodeName + "jssx.yz");
                        var deleteYz = false;
                        for (var j = 0; j < data.length; j++) {
                            if (data[j].name == "gg.xh") {
                                if (data[j].value == undefined || data[j].value == "") {
                                    deleteYz = true;
                                    break;
                                }
                            }
                        }
                        if (deleteYz) {
                            deleteFromNode(hs_jssx_inst, "hsqyl", "yz");
                        }
                        else {
                            var attrArray = [
                                {"name": "gg.xh", "text": "规格-型号"},
                                {"name": "yl.tyfs", "text": "用量-涂油方式"},
                                {"name": "yl.dh", "text": "用量-吨耗"},
                                {"name": "yl.zl", "text": "用量-重量"}
                            ];
                            for (var j = 0; j < data.length; j++) {
                                for (var k = 0; k < attrArray.length; k++) {
                                    if (data[j].name == attrArray[k].name) {
                                        var result = checkValue(attrArray[k].name, data[j].value);
                                        if (result.valid) {
                                            setToNode("value", hs_jssx_inst, "hsqyl.yz." + attrArray[k].name, data[j].value);
                                        }
                                        else {
                                            console.log("error:the value of gss" + hsdcNNodeName + "jssx.yz." + attrArray[k].name + result.type);
                                            throw new Error("<span>" + "[表单]:" + orderItemInst.name + "<br/>" +
                                                "[产品编号]:" + orderItemInst.cpbh + "<br/>" +
                                                "[节点]:" + getFromNode("fullText", orderItemInst, "gss" + hsdcNNodeName + "jssx.yz") + "<br/>"
                                                + "[原因]:" + attrArray[k].text + result.text + "</span>");
                                        }
                                        break;
                                    }
                                }
                            }
                        }
                        setToNode("value", hs_jssx_inst, "hsh.gdcp.lb", "金属绳芯");
                        hs_jssx_inst["lb"] = "金属绳芯";
                        setToNode("value", hs_jssx_inst, "hsh.gdcp.bmzt", bmzt);
                        hs_jssx_inst["bmzt"] = bmzt;
                        setToNode("value", hs_jssx_inst, "hsh.gdcp.tsyq", tsyq);
                        hs_jssx_inst["tsyq"] = tsyq;
                        setToNode("value", hs_jssx_inst, "hsh.gdcp.yt", yt);
                        hs_jssx_inst["yt"] = yt;
                        hs_jssx_inst["jhrq"] = jhrq;
                        deleteFromNode(hs_jssx_inst, "hsh.gdcp", "gg");
                        var data = getFromNode("data", orderItemInst, "gss" + hsdcNNodeName + "jssx");
                        var attrArray = [
                            {"name": "gg.jg", "text": "规格-结构"},
                            {"name": "gg.zj", "text": "规格-直径"},
                            {"name": "gg.qd", "text": "规格-强度"},
                            {"name": "gg.nx", "text": "规格-捻向"},
                            {"name": "gg.tyfs", "text": "规格-涂油方式"},
                            {"name": "gg.nj", "text": "规格-捻距"}
                        ];
                        var sxfss = getFromNode("sxfss", orderItemInst, "gss" + hsdcNNodeName + "jssx");
                        drawNode(sxfss, getFromNode("json", hs_jssx_inst, "hsh.sxfs"), getFromNode("json", hs_jssx_inst, "hsh.sxfs.sxfsn"), "sxfss", 1);
                        tree.expire(hs_jssx_inst);
                        for (var j = 1; j < sxfss + 1; j++) {
                            attrArray.push({"name": "yl.sxfs" + j + ".dc", "text": "用量-收线方式" + j + "-段长"});
                            attrArray.push({"name": "yl.sxfs" + j + ".ds", "text": "用量-收线方式" + j + "-段数"});
                            attrArray.push({"name": "yl.sxfs" + j + ".js", "text": "用量-收线方式" + j + "-件数"});
                            attrArray.push({"name": "yl.sxfs" + j + ".djmc", "text": "用量-收线方式" + j + "-单件米长"});
                            attrArray.push({"name": "yl.sxfs" + j + ".zmc", "text": "用量-收线方式" + j + "-总米长"});
                            attrArray.push({"name": "yl.sxfs" + j + ".gzlxh", "text": "用量-收线方式" + j + "-工字轮型号"});
                        }
                        var jhcl = 0;
                        for (var j = 0; j < data.length; j++) {
                            for (var k = 0; k < attrArray.length; k++) {
                                if (data[j].name == attrArray[k].name) {
                                    var result = checkValue(attrArray[k].name, data[j].value);
                                    if (result.valid) {
                                        if (attrArray[k].name.indexOf("gg") >= 0) {
                                            if (attrArray[k].name.indexOf("jg") >= 0) {
                                                hs_jssx_inst["jg/gg"] = data[j].value + "";
                                            }
                                            else {
                                                hs_jssx_inst[attrArray[k].name.split(".")[1]] = data[j].value + "";
                                            }
                                            attrArray[k].name = attrArray[k].name.replace("gg", "gdcp");
                                        }
                                        else {
                                            attrArray[k].name = attrArray[k].name.replace("yl", "sxfs");
                                        }
                                        if (attrArray[k].name.indexOf("zmc") >= 0) {
                                            jhcl = accAdd(jhcl, data[j].value);
                                        }
                                        setToNode("value", hs_jssx_inst, "hsh." + attrArray[k].name, data[j].value);
                                    }
                                    else {
                                        console.log("error:the value of gss" + hsdcNNodeName + "jssx." + attrArray[k].name + result.type);
                                        throw new Error("<span>" + "[表单]:" + orderItemInst.name + "<br/>" +
                                            "[产品编号]:" + orderItemInst.cpbh + "<br/>" +
                                            "[节点]:" + getFromNode("fullText", orderItemInst, "gss" + hsdcNNodeName + "jssx") + "<br/>"
                                            + "[原因]:" + attrArray[k].text + result.text + "</span>");
                                    }
                                    break;
                                }
                            }
                        }
                        setToNode("value", hs_jssx_inst, "cljh.jhcl", jhcl);
                        deleteFromNode(hs_jssx_inst, ".", "sjcl");
                        setToNode("value", hs_jssx_inst, "cpbh", cpbh);
                        hs_jssx_inst["cpbh"] = cpbh;
                        setToNode("value", hs_jssx_inst, "sfdz", sfdz);
                        hs_jssx_inst["sfdz"] = sfdz == "是" ? "已定制" : "未定制";
                        setToNode("value", hs_jssx_inst, "cj", "");
                        hs_jssx_inst["cj"] = "";
                        hs_jssx_inst["merge"] = "未合并";
                        hs_jssx_inst["status"] = "未计划";
                        hs_jssx_inst["isMerged"] = false;
                        hs_jssx_inst["sggSzj"] = sggSzj;
                        makeForm(hs_jssx_inst, user);
                        newFormInsts.push(hs_jssx_inst);
                        deleteFromNode(hs_inst, "hsqyl", "zjp");
                        deleteFromNode(hs_inst, "hsqyl", "xwx");
                        deleteFromNode(hs_inst, "hsqyl", "bjsx");
                        deleteFromNode(hs_inst, "hsqyl", "zxg");
                        deleteFromNode(hs_inst, "hsqyl", "wg");
                        deleteFromNode(hs_inst, "hsqyl", "jsgx");
                        var data = getFromNode("data", orderItemInst, "gss" + hsdcNNodeName + "jssx");
                        var sxfss = getFromNode("sxfss", orderItemInst, "gss" + hsdcNNodeName + "jssx");
                        drawNode(sxfss, getFromNode("json", hs_inst, "hsqyl.jssx.yl"), getFromNode("json", hs_inst, "hsqyl.jssx.yl.yln"), "yls", 1);
                        tree.expire(hs_inst);
                        var attrArray = [
                            {"name": "gg.jg", "text": "规格-结构"},
                            {"name": "gg.zj", "text": "规格-直径"},
                            {"name": "gg.nx", "text": "规格-捻向"},
                            {"name": "gg.qd", "text": "规格-强度"},
                            {"name": "gg.tyfs", "text": "规格-涂油方式"},
                            {"name": "gg.nj", "text": "规格-捻距"}
                        ];
                        for (var j = 1; j < sxfss + 1; j++) {
                            attrArray.push({"name": "yl.sxfs" + j + ".dc", "text": "用量-收线方式" + j + "-段长"});
                            attrArray.push({"name": "yl.sxfs" + j + ".ds", "text": "用量-收线方式" + j + "-段数"});
                            attrArray.push({"name": "yl.sxfs" + j + ".js", "text": "用量-收线方式" + j + "-件数"});
                            attrArray.push({"name": "yl.sxfs" + j + ".djmc", "text": "用量-收线方式" + j + "-单件米长"});
                            attrArray.push({"name": "yl.sxfs" + j + ".zmc", "text": "用量-收线方式" + j + "-总米长"});
                            attrArray.push({"name": "yl.sxfs" + j + ".gzlxh", "text": "用量-收线方式" + j + "-工字轮型号"});
                        }
                        for (var j = 0; j < data.length; j++) {
                            for (var k = 0; k < attrArray.length; k++) {
                                if (data[j].name == attrArray[k].name) {
                                    var result = checkValue(attrArray[k].name, data[j].value);
                                    if (result.valid) {
                                        if (data[j].name.indexOf("sxfs") >= 0) {
                                            attrArray[k].name = attrArray[k].name.replace("sxfs", "yl");
                                        }
                                        setToNode("value", hs_inst, "hsqyl.jssx." + attrArray[k].name, data[j].value);
                                    }
                                    else {
                                        console.log("error:the value of gss" + hsdcNNodeName + "jssx." + attrArray[k].name + result.type);
                                        throw new Error("<span>" + "[表单]:" + orderItemInst.name + "<br/>" +
                                            "[产品编号]:" + orderItemInst.cpbh + "<br/>" +
                                            "[节点]:" + getFromNode("fullText", orderItemInst, "gss" + hsdcNNodeName + "jssx") + "<br/>"
                                            + "[原因]:" + attrArray[k].text + result.text + "</span>");
                                    }
                                    break;
                                }
                            }
                        }
                        setToNode("value", hs_inst, "hsqyl.jssx.gg.bmzt", bmzt);
                    }
                    else if (checkNodeExist(orderItemInst, "gss" + hsdcNNodeName + "jsgx")) {
                        deleteFromNode(hs_inst, "hsqyl", "zjp");
                        deleteFromNode(hs_inst, "hsqyl", "xwx");
                        deleteFromNode(hs_inst, "hsqyl", "bjsx");
                        deleteFromNode(hs_inst, "hsqyl", "jssx");
                        deleteFromNode(hs_inst, "hsqyl", "zxg");
                        deleteFromNode(hs_inst, "hsqyl", "wg");
                        var data = getFromNode("data", orderItemInst, "gss" + hsdcNNodeName + "jsgx");
                        allNgNameArray.push("gss" + hsdcNNodeName + "jsgx");
                        var sxfss = getFromNode("sxfss", orderItemInst, "gss" + hsdcNNodeName + "jsgx");
                        drawNode(sxfss, getFromNode("json", hs_inst, "hsqyl.jsgx.yl"), getFromNode("json", hs_inst, "hsqyl.jsgx.yl.yln"), "yls", 1);
                        tree.expire(hs_inst);
                        var attrArray = [
                            {"name": "gg.jg", "text": "规格-结构"},
                            {"name": "gg.zj", "text": "规格-直径"},
                            {"name": "gg.nx", "text": "规格-捻向"},
                            {"name": "gg.qd", "text": "规格-强度"},
                            {"name": "gg.tyfs", "text": "规格-涂油方式"},
                            {"name": "gg.nj", "text": "规格-捻距"}
                        ];
                        for (var j = 1; j < sxfss + 1; j++) {
                            attrArray.push({"name": "yl.sxfs" + j + ".dc", "text": "用量-收线方式" + j + "-段长"});
                            attrArray.push({"name": "yl.sxfs" + j + ".ds", "text": "用量-收线方式" + j + "-段数"});
                            attrArray.push({"name": "yl.sxfs" + j + ".js", "text": "用量-收线方式" + j + "-件数"});
                            attrArray.push({"name": "yl.sxfs" + j + ".djmc", "text": "用量-收线方式" + j + "-单件米长"});
                            attrArray.push({"name": "yl.sxfs" + j + ".zmc", "text": "用量-收线方式" + j + "-总米长"});
                            attrArray.push({"name": "yl.sxfs" + j + ".gzlxh", "text": "用量-收线方式" + j + "-工字轮型号"});
                        }
                        for (var j = 0; j < data.length; j++) {
                            for (var k = 0; k < attrArray.length; k++) {
                                if (data[j].name == attrArray[k].name) {
                                    var result = checkValue(attrArray[k].name, data[j].value);
                                    if (result.valid) {
                                        if (data[j].name.indexOf("sxfs") >= 0) {
                                            attrArray[k].name = attrArray[k].name.replace("sxfs", "yl");
                                        }
                                        setToNode("value", hs_inst, "hsqyl.jsgx." + attrArray[k].name, data[j].value);
                                    }
                                    else {
                                        console.log("error:the value of gss" + hsdcNNodeName + "jsgx." + attrArray[k].name + result.type);
                                        throw new Error("<span>" + "[表单]:" + orderItemInst.name + "<br/>" +
                                            "[产品编号]:" + orderItemInst.cpbh + "<br/>" +
                                            "[节点]:" + getFromNode("fullText", orderItemInst, "gss" + hsdcNNodeName + "jsgx") + "<br/>"
                                            + "[原因]:" + attrArray[k].text + result.text + "</span>");
                                    }
                                    break;
                                }
                            }
                        }
                        setToNode("value", hs_inst, "hsqyl.jsgx.gg.bmzt", bmzt);
                    }
                    else if (checkNodeExist(orderItemInst, "gss" + hsdcNNodeName + "bjsx")) {
                        deleteFromNode(hs_inst, "hsqyl", "zjp");
                        deleteFromNode(hs_inst, "hsqyl", "xwx");
                        deleteFromNode(hs_inst, "hsqyl", "jssx");
                        deleteFromNode(hs_inst, "hsqyl", "jsgx");
                        deleteFromNode(hs_inst, "hsqyl", "zxg");
                        deleteFromNode(hs_inst, "hsqyl", "wg");
                        var data = getFromNode("data", orderItemInst, "gss" + hsdcNNodeName + "bjsx");
                        allNgNameArray.push("gss" + hsdcNNodeName + "bjsx");
                        var sxfss = getFromNode("sxfss", orderItemInstzz, "gss" + hsdcNNodeName + "bjsx");
                        drawNode(sxfss, getFromNode("json", hs_inst, "hsqyl.bjsx.yl"), getFromNode("json", hs_inst, "hsqyl.bjsx.yl.yln"), "yls", 1);
                        tree.expire(hs_inst);
                        var attrArray = [
                            {"name": "gg.jg", "text": "规格-结构"},
                            {"name": "gg.zj", "text": "规格-直径"},
                            {"name": "gg.nx", "text": "规格-捻向"},
                            {"name": "gg.qd", "text": "规格-强度"},
                            {"name": "gg.tyfs", "text": "规格-涂油方式"},
                            {"name": "gg.nj", "text": "规格-捻距"}
                        ];
                        for (var j = 1; j < sxfss + 1; j++) {
                            attrArray.push({"name": "yl.sxfs" + j + ".dc", "text": "用量-收线方式" + j + "-段长"});
                            attrArray.push({"name": "yl.sxfs" + j + ".ds", "text": "用量-收线方式" + j + "-段数"});
                            attrArray.push({"name": "yl.sxfs" + j + ".js", "text": "用量-收线方式" + j + "-件数"});
                            attrArray.push({"name": "yl.sxfs" + j + ".djmc", "text": "用量-收线方式" + j + "-单件米长"});
                            attrArray.push({"name": "yl.sxfs" + j + ".zmc", "text": "用量-收线方式" + j + "-总米长"});
                            attrArray.push({"name": "yl.sxfs" + j + ".gzlxh", "text": "用量-收线方式" + j + "-工字轮型号"});
                        }
                        for (var j = 0; j < data.length; j++) {
                            for (var k = 0; k < attrArray.length; k++) {
                                if (data[j].name == attrArray[k].name) {
                                    var result = checkValue(attrArray[k].name, data[j].value);
                                    if (result.valid) {
                                        if (data[j].name.indexOf("sxfs") >= 0) {
                                            attrArray[k].name = attrArray[k].name.replace("sxfs", "yl");
                                        }
                                        setToNode("value", hs_inst, "hsqyl.bjsx." + attrArray[k].name, data[j].value);
                                    }
                                    else {
                                        console.log("error:the value of gss" + hsdcNNodeName + "bjsx." + attrArray[k].name + result.type);
                                        throw new Error("<span>" + "[表单]:" + orderItemInst.name + "<br/>" +
                                            "[产品编号]:" + orderItemInst.cpbh + "<br/>" +
                                            "[节点]:" + getFromNode("fullText", orderItemInst, "gss" + hsdcNNodeName + "bjsx") + "<br/>"
                                            + "[原因]:" + attrArray[k].text + result.text + "</span>");
                                    }
                                    break;
                                }
                            }
                        }
                        setToNode("value", hs_inst, "hsqyl.bjsx.gg.bmzt", bmzt);
                    }
                    else {
                        deleteFromNode(hs_inst, "hsqyl", "zjp");
                        deleteFromNode(hs_inst, "hsqyl", "jssx");
                        deleteFromNode(hs_inst, "hsqyl", "jsgx");
                        deleteFromNode(hs_inst, "hsqyl", "zxg");
                        deleteFromNode(hs_inst, "hsqyl", "wg");
                        deleteFromNode(hs_inst, "hsqyl", "bjsx");
                        var data = getFromNode("data", orderItemInst, "gss" + hsdcNNodeName + "xwx");
                        var attrArray = [
                            {"name": "gg.lb", "text": "规格-类别"},
                            {"name": "gg.zj", "text": "规格-直径"},
                            {"name": "gg.nx", "text": "规格-捻向"},
                            {"name": "gg.hyl", "text": "规格-含油率"},
                            {"name": "yl.gymcxs", "text": "用量-工艺米长系数"},
                            {"name": "yl.zmc", "text": "用量-总米长"},
                            {"name": "yl.dh", "text": "用量-吨耗"},
                            {"name": "yl.zl", "text": "用量-重量"}
                        ];
                        for (var j = 0; j < data.length; j++) {
                            for (var k = 0; k < attrArray.length; k++) {
                                if (data[j].name == attrArray[k].name) {
                                    var result = checkValue(attrArray[k].name, data[j].value);
                                    if (result.valid) {
                                        setToNode("value", hs_inst, "hsqyl.xwx." + attrArray[k].name, data[j].value);
                                    }
                                    else {
                                        console.log("error:the value of gss" + hsdcNNodeName + "xwx." + attrArray[k].name + result.type);
                                        throw new Error("<span>" + "[表单]:" + orderItemInst.name + "<br/>" +
                                            "[产品编号]:" + orderItemInst.cpbh + "<br/>" +
                                            "[节点]:" + getFromNode("fullText", orderItemInst, "gss" + hsdcNNodeName + "xwx") + "<br/>"
                                            + "[原因]:" + attrArray[k].text + result.text + "</span>");
                                    }
                                    break;
                                }
                            }
                        }
                    }
                }
                else {
                    deleteFromNode(hs_inst, "hsqyl", "jsgx");
                    deleteFromNode(hs_inst, "hsqyl", "jssx");
                    deleteFromNode(hs_inst, "hsqyl", "zxg");
                    deleteFromNode(hs_inst, "hsqyl", "wg");
                    deleteFromNode(hs_inst, "hsqyl", "bjsx");
                    deleteFromNode(hs_inst, "hsqyl", "xwx");
                    var zjpNodeName = getDcName("hs", hscs, i - 1, true);
                    setToNode("text", hs_inst, "hsqyl.zjp", "钢丝绳-" + (i - 1) + "合");
                    var data = getFromNode("data", orderItemInst, "gss" + zjpNodeName);
                    var sxfss = getFromNode("sxfss", orderItemInst, "gss" + zjpNodeName);
                    drawNode(sxfss, getFromNode("json", hs_inst, "hsqyl.zjp.yl"), getFromNode("json", hs_inst, "hsqyl.zjp.yl.yln"), "yls", 1);
                    tree.expire(hs_inst);
                    var attrArray = [
                        {"name": "gg.jg", "text": "规格-结构"},
                        {"name": "gg.zj", "text": "规格-直径"},
                        {"name": "gg.nx", "text": "规格-捻向"},
                        {"name": "gg.qd", "text": "规格-强度"},
                        {"name": "gg.tyfs", "text": "规格-涂油方式"},
                        {"name": "gg.nj", "text": "规格-捻距"},
                    ];
                    for (var j = 1; j < sxfss + 1; j++) {
                        attrArray.push({"name": "yl.sxfs" + j + ".dc", "text": "用量-收线方式" + j + "-段长"});
                        attrArray.push({"name": "yl.sxfs" + j + ".ds", "text": "用量-收线方式" + j + "-段数"});
                        attrArray.push({"name": "yl.sxfs" + j + ".js", "text": "用量-收线方式" + j + "-件数"});
                        attrArray.push({"name": "yl.sxfs" + j + ".djmc", "text": "用量-收线方式" + j + "-单件米长"});
                        attrArray.push({"name": "yl.sxfs" + j + ".zmc", "text": "用量-收线方式" + j + "-总米长"});
                        attrArray.push({"name": "yl.sxfs" + j + ".gzlxh", "text": "用量-收线方式" + j + "-工字轮型号"});
                    }
                    for (var j = 0; j < data.length; j++) {
                        for (var k = 0; k < attrArray.length; k++) {
                            if (data[j].name == attrArray[k].name) {
                                var result = checkValue(attrArray[k].name, data[j].value);
                                if (result.valid) {
                                    if (data[j].name.indexOf("sxfs") >= 0) {
                                        attrArray[k].name = attrArray[k].name.replace("sxfs", "yl");
                                    }
                                    setToNode("value", hs_inst, "hsqyl.zjp." + attrArray[k].name, data[j].value);
                                }
                                else {
                                    console.log("error:the value of gss" + zjpNodeName + "." + attrArray[k].name + result.type);
                                    throw new Error("<span>" + "[表单]:" + orderItemInst.name + "<br/>" +
                                        "[产品编号]:" + orderItemInst.cpbh + "<br/>" +
                                        "[节点]:" + getFromNode("fullText", orderItemInst, "gss" + zjpNodeName) + "<br/>"
                                        + "[原因]:" + attrArray[k].text + result.text + "</span>");
                                }
                                break;
                            }
                        }
                    }
                    setToNode("value", hs_inst, "hsqyl.zjp.gg.bmzt", bmzt);
                }
                var gcs = getFromNode("gcs", orderItemInst, "gss" + hsdcNodeName);
                drawNode(gcs.length, getFromNode("json", hs_inst, "hsqyl"), getFromNode("json", hs_inst, "hsqyl.gdcn"), "gcs", parseInt(gcs[0]));
                tree.expire(hs_inst);
                for (var j = parseInt(gcs[0]); j < parseInt(gcs[0]) + gcs.length; j++) {
                    var gs = getFromNode("repeat", orderItemInst, "gss" + hsdcNNodeName + "gdc" + j + ".g1");
                    drawNode(gs, getFromNode("json", hs_inst, "hsqyl.gdc" + j), getFromNode("json", hs_inst, "hsqyl.gdc" + j + ".gn"), "gs", 1);
                    tree.expire(hs_inst);
                    for (var k = 1; k < gs + 1; k++) {
                        var data = getFromNode("data", orderItemInst, "gss" + hsdcNNodeName + "gdc" + j + ".g" + k);
                        allNgNameArray.push("gss" + hsdcNNodeName + "gdc" + j + ".g" + k);
                        var sxfss = getFromNode("sxfss", orderItemInst, "gss" + hsdcNNodeName + "gdc" + j + ".g" + k);
                        drawNode(sxfss, getFromNode("json", hs_inst, "hsqyl.gdc" + j + ".g" + k + ".yl"), getFromNode("json", hs_inst, "hsqyl.gdc" + j + ".g" + k + ".yl.yln"), "yls", 1);
                        tree.expire(hs_inst);
                        var attrArray = [
                            {"name": "gg.jg", "text": "规格-结构"},
                            {"name": "gg.zj", "text": "规格-直径"},
                            {"name": "gg.nx", "text": "规格-捻向"},
                            {"name": "gg.qd", "text": "规格-强度"},
                            {"name": "gg.tyfs", "text": "规格-涂油方式"},
                            {"name": "gg.nj", "text": "规格-捻距"},
                            {"name": "yl.gs", "text": "用量-个数"}
                        ];
                        for (var l = 1; l < sxfss + 1; l++) {
                            attrArray.push({"name": "yl.sxfs" + l + ".dc", "text": "用量-收线方式" + l + "-段长"});
                            attrArray.push({"name": "yl.sxfs" + l + ".ds", "text": "用量-收线方式" + l + "-段数"});
                            attrArray.push({"name": "yl.sxfs" + l + ".js", "text": "用量-收线方式" + l + "-件数"});
                            attrArray.push({"name": "yl.sxfs" + l + ".djmc", "text": "用量-收线方式" + l + "-单件米长"});
                            attrArray.push({"name": "yl.sxfs" + l + ".zmc", "text": "用量-收线方式" + l + "-总米长"});
                            attrArray.push({"name": "yl.sxfs" + l + ".gzlxh", "text": "用量-收线方式" + l + "-工字轮型号"});
                        }
                        for (var l = 0; l < data.length; l++) {
                            for (var m = 0; m < attrArray.length; m++) {
                                if (data[l].name == attrArray[m].name) {
                                    var result = checkValue(attrArray[m].name, data[l].value);
                                    if (result.valid) {
                                        if (data[l].name.indexOf("sxfs") >= 0) {
                                            attrArray[m].name = attrArray[m].name.replace("sxfs", "yl");
                                        }
                                        setToNode("value", hs_inst, "hsqyl.gdc" + j + ".g" + k + "." + attrArray[m].name, data[l].value);
                                    }
                                    else {
                                        console.log("error:the value of gss" + hsdcNNodeName + "gdc" + j + ".g" + k + "." + attrArray[m].name + result.type);
                                        throw new Error("<span>" + "[表单]:" + orderItemInst.name + "<br/>" +
                                            "[产品编号]:" + orderItemInst.cpbh + "<br/>" +
                                            "[节点]:" + getFromNode("fullText", orderItemInst, "gss" + hsdcNNodeName + "gdc" + j + ".g" + k) + "<br/>"
                                            + "[原因]:" + attrArray[m].text + result.text + "</span>");
                                    }
                                    break;
                                }
                            }
                        }
                        setToNode("value", hs_inst, "hsqyl.gdc" + j + ".g" + k + ".gg.bmzt", bmzt);
                    }
                }
                var data = getFromNode("data", orderItemInst, "gss" + hsdcNNodeName + "yz");
                var deleteYz = false;
                for (var j = 0; j < data.length; j++) {
                    if (data[j].name == "gg.xh") {
                        if (data[j].value == undefined || data[j].value == "") {
                            deleteYz = true;
                            break;
                        }
                    }
                }
                if (deleteYz) {
                    deleteFromNode(hs_inst, "hsqyl", "yz");
                }
                else {
                    var attrArray = [
                        {"name": "gg.xh", "text": "规格-型号"},
                        {"name": "yl.tyfs", "text": "用量-涂油方式"},
                        {"name": "yl.dh", "text": "用量-吨耗"},
                        {"name": "yl.zl", "text": "用量-重量"}
                    ];
                    for (var j = 0; j < data.length; j++) {
                        for (var k = 0; k < attrArray.length; k++) {
                            if (data[j].name == attrArray[k].name) {
                                var result = checkValue(attrArray[k].name, data[j].value);
                                if (result.valid) {
                                    setToNode("value", hs_inst, "hsqyl.yz." + attrArray[k].name, data[j].value);
                                }
                                else {
                                    console.log("error:the value of gss" + hsdcNNodeName + "yz." + attrArray[k].name + result.type);
                                    throw new Error("<span>" + "[表单]:" + orderItemInst.name + "<br/>" +
                                        "[产品编号]:" + orderItemInst.cpbh + "<br/>" +
                                        "[节点]:" + getFromNode("fullText", orderItemInst, "gss" + hsdcNNodeName + "yz") + "<br/>"
                                        + "[原因]:" + attrArray[k].text + result.text + "</span>");
                                }
                                break;
                            }
                        }
                    }
                }
                if (hscs == 1 || i == hscs) {
                    hs_inst["lb"] = "钢丝绳";
                    setToNode("value", hs_inst, "hsh.gdcp.lb", "钢丝绳");
                }
                else {
                    hs_inst["lb"] = "钢丝绳-" + i + "合";
                    setToNode("value", hs_inst, "hsh.gdcp.lb", "钢丝绳-" + i + "合");
                }
                setToNode("value", hs_inst, "hsh.gdcp.bmzt", bmzt);
                hs_inst["bmzt"] = bmzt;
                setToNode("value", hs_inst, "hsh.gdcp.tsyq", tsyq);
                hs_inst["tsyq"] = tsyq;
                setToNode("value", hs_inst, "hsh.gdcp.yt", yt);
                hs_inst["yt"] = yt;
                hs_inst["jhrq"] = jhrq;
                var data = getFromNode("data", orderItemInst, "gss" + hsdcNodeName);
                var attrArray;
                var sxfss = 1;
                if (i == hscs) {
                    attrArray = [
                        {"name": "gg", "text": "规格"},
                        {"name": "zj", "text": "直径"},
                        {"name": "nx", "text": "捻向"},
                        {"name": "qd", "text": "强度"},
                        {"name": "tyfs", "text": "涂油方式"},
                        {"name": "nj", "text": "捻距"},
                        {"name": "djmc", "text": "单件米长"},
                        {"name": "js", "text": "件数"},
                        {"name": "zmc", "text": "总米长"},
                        {"name": "bzfs", "text": "包装方式"},
                        {"name": "lpxh", "text": "轮盘型号"}
                    ];
                    deleteFromNode(hs_inst, "hsh.gdcp", "jg");
                    deleteFromNode(hs_inst, "hsh.sxfs.sxfsn", "dc");
                    deleteFromNode(hs_inst, "hsh.sxfs.sxfsn", "ds");
                    deleteFromNode(hs_inst, "hsh.sxfs.sxfsn", "gzlxh");
                }
                else {
                    attrArray = [
                        {"name": "gg.jg", "text": "规格-结构"},
                        {"name": "gg.zj", "text": "规格-直径"},
                        {"name": "gg.nx", "text": "规格-捻向"},
                        {"name": "gg.qd", "text": "规格-强度"},
                        {"name": "gg.tyfs", "text": "规格-涂油方式"},
                        {"name": "gg.nj", "text": "规格-捻距"}
                    ];
                    deleteFromNode(hs_inst, "hsh.gdcp", "gg");
                    deleteFromNode(hs_inst, "hsh.sxfs.sxfsn", "lpxh");
                    deleteFromNode(hs_inst, "hsh.sxfs.sxfsn", "bzfs");
                    sxfss = getFromNode("sxfss", orderItemInst, "gss" + hsdcNodeName);
                    for (var j = 1; j < sxfss + 1; j++) {
                        attrArray.push({"name": "yl.sxfs" + j + ".dc", "text": "用量-收线方式" + j + "-段长"});
                        attrArray.push({"name": "yl.sxfs" + j + ".ds", "text": "用量-收线方式" + j + "-段数"});
                        attrArray.push({"name": "yl.sxfs" + j + ".js", "text": "用量-收线方式" + j + "-件数"});
                        attrArray.push({"name": "yl.sxfs" + j + ".djmc", "text": "用量-收线方式" + j + "-单件米长"});
                        attrArray.push({"name": "yl.sxfs" + j + ".zmc", "text": "用量-收线方式" + j + "-总米长"});
                        attrArray.push({"name": "yl.sxfs" + j + ".gzlxh", "text": "用量-收线方式" + j + "-工字轮型号"});
                    }
                }
                drawNode(sxfss, getFromNode("json", hs_inst, "hsh.sxfs"), getFromNode("json", hs_inst, "hsh.sxfs.sxfsn"),
                    "sxfss", 1);
                tree.expire(hs_inst);
                var jhcl = 0;
                for (var j = 0; j < data.length; j++) {
                    for (var k = 0; k < attrArray.length; k++) {
                        if (data[j].name == attrArray[k].name) {
                            var result = checkValue(attrArray[k].name, data[j].value);
                            if (result.valid) {
                                if (i == hscs) {
                                    if (attrArray[k].name == "gg" || attrArray[k].name == "zj" || attrArray[k].name == "nx" ||
                                        attrArray[k].name == "qd" || attrArray[k].name == "tyfs" || attrArray[k].name == "nj") {
                                        if (attrArray[k].name == "gg") {
                                            hs_inst["jg/gg"] = data[j].value + "";
                                        }
                                        else {
                                            hs_inst[attrArray[k].name] = data[j].value + "";
                                        }
                                        attrArray[k].name = "gdcp." + attrArray[k].name;
                                    }
                                    else {
                                        attrArray[k].name = "sxfs.sxfs1." + attrArray[k].name;
                                    }
                                }
                                else {
                                    if (attrArray[k].name == "gg.jg" || attrArray[k].name == "gg.zj" ||
                                        attrArray[k].name == "gg.nx" || attrArray[k].name == "gg.qd" ||
                                        attrArray[k].name == "gg.tyfs" || attrArray[k].name == "gg.nj") {
                                        if (attrArray[k].name == "gg.jg") {
                                            hs_inst["jg/gg"] = data[j].value + "";
                                        }
                                        else {
                                            hs_inst[attrArray[k].name.split(".")[1]] = data[j].value + "";
                                        }
                                        attrArray[k].name = attrArray[k].name.replace("gg", "gdcp");
                                    }
                                    else {
                                        attrArray[k].name = attrArray[k].name.replace("yl", "sxfs");
                                    }
                                }
                                if (attrArray[k].name.indexOf("zmc") >= 0) {
                                    jhcl = accAdd(jhcl, data[j].value);
                                }
                                setToNode("value", hs_inst, "hsh." + attrArray[k].name, data[j].value);
                            }
                            else {
                                console.log("error:the value of gss" + hsdcNodeName + "." + attrArray[k].name + result.type);
                                throw new Error("<span>" + "[表单]:" + orderItemInst.name + "<br/>" +
                                    "[产品编号]:" + orderItemInst.cpbh + "<br/>" +
                                    "[节点]:" + getFromNode("fullText", orderItemInst, "gss" + hsdcNodeName) + "<br/>"
                                    + "[原因]:" + attrArray[k].text + result.text + "</span>");
                            }
                            break;
                        }
                    }
                }
                setToNode("value", hs_inst, "cljh.jhcl", jhcl);
                deleteFromNode(hs_inst, ".", "sjcl");
                setToNode("value", hs_inst, "cpbh", cpbh);
                hs_inst["cpbh"] = cpbh;
                setToNode("value", hs_inst, "sfdz", sfdz);
                hs_inst["sfdz"] = sfdz == "是" ? "已定制" : "未定制";
                setToNode("value", hs_inst, "cj", "");
                hs_inst["cj"] = "";
                hs_inst["merge"] = "未合并";
                hs_inst["status"] = "未计划";
                hs_inst["isMerged"] = false;
                hs_inst["sggSzj"] = sggSzj;
                makeForm(hs_inst, user);
                newFormInsts.push(hs_inst);
            }
            for (var i = 0; i < allNgNameArray.length; i++) {
                var ngName = allNgNameArray[i];
                if ("bjsx".indexOf(ngName) >= 0) {
                    var ng_inst = cloneInst(formsMap.ng_production_plan, enums.StatusEnum.NOT_PROCESSED);
                    deleteFromNode(ng_inst, "ngqyl", "zjp");
                    deleteFromNode(ng_inst, "ngqyl", "zxs");
                    deleteFromNode(ng_inst, "ngqyl", "sn");
                    deleteFromNode(ng_inst, "ngqyl", "sdcn");
                    var data = getFromNode("data", orderItemInst, ngName + ".xwx");
                    var attrArray = [
                        {"name": "gg.lb", "text": "规格-类别"},
                        {"name": "gg.zj", "text": "规格-直径"},
                        {"name": "gg.nx", "text": "规格-捻向"},
                        {"name": "gg.hyl", "text": "规格-含油率"},
                        {"name": "yl.gymcxs", "text": "用量-工艺米长系数"},
                        {"name": "yl.zmc", "text": "用量-总米长"},
                        {"name": "yl.dh", "text": "用量-吨耗"},
                        {"name": "yl.zl", "text": "用量-重量"}
                    ];
                    for (var j = 0; j < data.length; j++) {
                        for (var k = 0; k < attrArray.length; k++) {
                            if (data[j].name == attrArray[k].name) {
                                var result = checkValue(attrArray[k].name, data[j].value);
                                if (result.valid) {
                                    setToNode("value", ng_inst, "ngqyl.xwx." + attrArray[k].name, data[j].value);
                                }
                                else {
                                    console.log("error:the value of " + ngName + ".xwx." + attrArray[k].name + result.type);
                                    throw new Error("<span>" + "[表单]:" + orderItemInst.name + "<br/>" +
                                        "[产品编号]:" + orderItemInst.cpbh + "<br/>" +
                                        "[节点]:" + getFromNode("fullText", orderItemInst, ngName + ".xwx") + "<br/>"
                                        + "[原因]:" + attrArray[k].text + result.text + "</span>");
                                }
                                break;
                            }
                        }
                    }
                    var ss = getFromNode("repeat", orderItemInst, ngName + ".wgs.s1");
                    drawNode(ss, getFromNode("json", ng_inst, "ngqyl.wgs"), getFromNode("json", ng_inst, "ngqyl.wgs.sn"), "ss", 1);
                    tree.expire(ng_inst);
                    for (var j = 1; i < ss + 1; j++) {
                        var data = getFromNode("data", orderItemInst, ngName + ".wgs.s" + j);
                        var sxfss = getFromNode("sxfss", orderItemInst, ngName + ".wgs.s" + j);
                        drawNode(sxfss, getFromNode("json", ng_inst, "ngqyl.wgs.s" + j + ".yl"), getFromNode("json", ng_inst, "ngqyl.wgs.s" + j + ".yl.yln"), "yls", 1);
                        tree.expire(ng_inst);
                        var attrArray = [
                            {"name": "gg.lb", "text": "规格-类别"},
                            {"name": "gg.zj", "text": "规格-直径"},
                            {"name": "gg.qd", "text": "规格-强度"},
                            {"name": "yl.gs", "text": "用量-个数"}
                        ];
                        for (var k = 1; k < sxfss + 1; k++) {
                            attrArray.push({"name": "yl.sxfs" + k + ".dc", "text": "用量-收线方式" + k + "-段长"});
                            attrArray.push({"name": "yl.sxfs" + k + ".ds", "text": "用量-收线方式" + k + "-段数"});
                            attrArray.push({"name": "yl.sxfs" + k + ".djmc", "text": "用量-收线方式" + k + "-单件米长"});
                            attrArray.push({"name": "yl.sxfs" + k + ".js", "text": "用量-收线方式" + k + "-件数"});
                            attrArray.push({"name": "yl.sxfs" + k + ".zmc", "text": "用量-收线方式" + k + "-总米长"});
                            attrArray.push({"name": "yl.sxfs" + k + ".gzlxh", "text": "用量-收线方式" + k + "-工字轮型号"});
                        }
                        for (var k = 0; k < data.length; k++) {
                            for (var l = 0; l < attrArray.length; l++) {
                                if (data[k].name == attrArray[l].name) {
                                    var result = checkValue(attrArray[l].name, data[k].value);
                                    if (result.valid) {
                                        if (data[k].name.indexOf("sxfs") >= 0) {
                                            attrArray[l].name = attrArray[l].name.replace("sxfs", "yl");
                                        }
                                        setToNode("value", ng_inst, "ngqyl.wgs.s" + j + "." + attrArray[l].name, data[k].value);
                                    }
                                    else {
                                        console.log("error:the value of " + ngName + ".wgs.s" + j + "." + attrArray[l].name + result.type);
                                        throw new Error("<span>" + "[表单]:" + orderItemInst.name + "<br/>" +
                                            "[产品编号]:" + orderItemInst.cpbh + "<br/>" +
                                            "[节点]:" + getFromNode("fullText", orderItemInst, ngName + ".wgs.s" + j) + "<br/>"
                                            + "[原因]:" + attrArray[l].text + result.text + "</span>");
                                    }
                                    break;
                                }
                            }
                        }
                    }
                    var data = getFromNode("data", orderItemInst, ngName + ".yz");
                    var deleteYz = false;
                    for (var j = 0; j < data.length; j++) {
                        if (data[j].name == "gg.xh") {
                            if (data[j].value == undefined || data[j].value == "") {
                                deleteYz = true;
                                break;
                            }
                        }
                    }
                    if (deleteYz) {
                        deleteFromNode(ng_inst, "ngqyl", "yz");
                    }
                    else {
                        var attrArray = [
                            {"name": "gg.xh", "text": "规格-型号"},
                            {"name": "yl.tyfs", "text": "用量-涂油方式"},
                            {"name": "yl.dh", "text": "用量-吨耗"},
                            {"name": "yl.zl", "text": "用量-重量"}
                        ];
                        for (var j = 0; j < data.length; j++) {
                            for (var k = 0; k < attrArray.length; k++) {
                                if (data[j].name == attrArray[k].name) {
                                    var result = checkValue(attrArray[k].name, data[j].value);
                                    if (result.valid) {
                                        setToNode("value", ng_inst, "ngqyl.yz." + attrArray[k].name, data[j].value);
                                    }
                                    else {
                                        console.log("error:the value of " + ngName + ".yz." + attrArray[k].name + result.type);
                                        throw new Error("<span>" + "[表单]:" + orderItemInst.name + "<br/>" +
                                            "[产品编号]:" + orderItemInst.cpbh + "<br/>" +
                                            "[节点]:" + getFromNode("fullText", orderItemInst, ngName + ".yz") + "<br/>"
                                            + "[原因]:" + attrArray[k].text + result.text + "</span>");
                                    }
                                    break;
                                }
                            }
                        }
                    }
                    setToNode("value", ng_inst, "ngh.gdcp.lb", "半金属芯");
                    ng_inst["lb"] = "半金属芯";
                    setToNode("value", ng_inst, "ngh.gdcp.bmzt", bmzt);
                    ng_inst["bmzt"] = bmzt;
                    setToNode("value", ng_inst, "ngh.gdcp.tsyq", tsyq);
                    ng_inst["tsyq"] = tsyq;
                    setToNode("value", ng_inst, "ngh.gdcp.yt", yt);
                    ng_inst["yt"] = yt;
                    ng_inst["sggSzj"] = sggSzj;
                    ng_inst["jhrq"] = jhrq;
                    var data = getFromNode("data", orderItemInst, ngName);
                    var sxfss = getFromNode("sxfss", orderItemInst, ngName);
                    drawNode(sxfss, getFromNode("json", ng_inst, "ngh.sxfs"), getFromNode("json", ng_inst, "ngh.sxfsn"), "sxfss", 1);
                    tree.expire(ng_inst);
                    var attrArray = [
                        {"name": "gg.jg", "text": "规格-结构"},
                        {"name": "gg.zj", "text": "规格-直径"},
                        {"name": "gg.qd", "text": "规格-强度"},
                        {"name": "gg.nx", "text": "规格-捻向"},
                        {"name": "gg.tyfs", "text": "规格-涂油方式"},
                        {"name": "gg.nj", "text": "规格-捻距"}
                    ];
                    for (var j = 1; j < sxfss + 1; j++) {
                        attrArray.push({"name": "yl.sxfs" + j + ".dc", "text": "用量-收线方式" + j + "-段长"});
                        attrArray.push({"name": "yl.sxfs" + j + ".ds", "text": "用量-收线方式" + j + "-段数"});
                        attrArray.push({"name": "yl.sxfs" + j + ".js", "text": "用量-收线方式" + j + "-件数"});
                        attrArray.push({"name": "yl.sxfs" + j + ".djmc", "text": "用量-收线方式" + j + "-单件米长"});
                        attrArray.push({"name": "yl.sxfs" + j + ".zmc", "text": "用量-收线方式" + j + "-总米长"});
                        attrArray.push({"name": "yl.sxfs" + j + ".gzlxh", "text": "用量-收线方式" + j + "-工字轮型号"});
                    }
                    var jhcl = 0;
                    for (var j = 0; j < data.length; j++) {
                        for (var k = 0; k < attrArray.length; k++) {
                            if (data[j].name == attrArray[k].name) {
                                var result = checkValue(attrArray[k].name, data[j].value);
                                if (result.valid) {
                                    if (attrArray[k].name.indexOf("gg") >= 0) {
                                        ng_inst[attrArray[k].name.split(".")[1]] = data[j].value + "";
                                        attrArray[k].name = attrArray[k].name.replace("gg", "gdcp");
                                    }
                                    else {
                                        attrArray[k].name = attrArray[k].name.replace("yl", "sxfs");
                                    }
                                    if (attrArray[k].name.indexOf("zmc") >= 0) {
                                        jhcl = accAdd(jhcl, data[j].value);
                                    }
                                    setToNode("value", ng_inst, "ngh." + attrArray[k].name, data[j].value);
                                }
                                else {
                                    console.log("error:the value of " + ngName + "." + attrArray[k].name + result.type);
                                    throw new Error("<span>" + "[表单]:" + orderItemInst.name + "<br/>" +
                                        "[产品编号]:" + orderItemInst.cpbh + "<br/>" +
                                        "[节点]:" + getFromNode("fullText", orderItemInst, ngName) + "<br/>"
                                        + "[原因]:" + attrArray[k].text + result.text + "</span>");
                                }
                                break;
                            }
                        }
                    }
                    setToNode("value", ng_inst, "cljh.jhcl", jhcl);
                    deleteFromNode(ng_inst, ".", "sjcl");
                    setToNode("value", ng_inst, "cpbh", cpbh);
                    ng_inst["cpbh"] = cpbh;
                    setToNode("value", ng_inst, "sfdz", sfdz);
                    ng_inst["sfdz"] = sfdz == "是" ? "已定制" : "未定制";
                    setToNode("value", ng_inst, "cj", "");
                    ng_inst["cj"] = "";
                    ng_inst["merge"] = "未合并";
                    ng_inst["status"] = "未计划";
                    ng_inst["isMerged"] = false;
                    makeForm(ng_inst, user);
                    newFormInsts.push(ng_inst);
                }
                else {
                    var ngcs = getFromNode("nzcs", orderItemInst, ngName);
                    for (var j = 1; j < ngcs + 1; j++) {
                        var ng_inst = cloneInst(formsMap.ng_production_plan, enums.StatusEnum.NOT_PROCESSED);
                        var ngdcNNodeName = getDcName("ng", ngcs, j, false);
                        var ngdcNodeName = getDcName("ng", ngcs, j, true);
                        if (j == 1) {
                            if (checkNodeExist(orderItemInst, ngName + ngdcNNodeName + "zxs")) {
                                deleteFromNode(ng_inst, "ngqyl", "xwx");
                                deleteFromNode(ng_inst, "ngqyl", "zjp");
                                deleteFromNode(ng_inst, "ngqyl", "wgs");
                                var data = getFromNode("data", orderItemInst, ngName + ngdcNNodeName + "zxs");
                                var sxfss = getFromNode("sxfss", orderItemInst, ngName + ngdcNNodeName + "zxs");
                                drawNode(sxfss, getFromNode("json", ng_inst, "ngqyl.zxs.yl"), getFromNode("json", ng_inst, "ngqyl.zxs.yl.yln"), "yls", 1);
                                tree.expire(ng_inst);
                                var attrArray = [
                                    {"name": "gg.lb", "text": "规格-类别"},
                                    {"name": "gg.zj", "text": "规格-直径"},
                                    {"name": "gg.qd", "text": "规格-强度"}
                                ];
                                for (var k = 1; k < sxfss + 1; k++) {
                                    attrArray.push({"name": "yl.sxfs" + k + ".dc", "text": "用量-收线方式" + k + "-段长"});
                                    attrArray.push({"name": "yl.sxfs" + k + ".ds", "text": "用量-收线方式" + k + "-段数"});
                                    attrArray.push({"name": "yl.sxfs" + k + ".js", "text": "用量-收线方式" + k + "-件数"});
                                    attrArray.push({"name": "yl.sxfs" + k + ".djmc", "text": "用量-收线方式" + k + "-单件米长"});
                                    attrArray.push({"name": "yl.sxfs" + k + ".zmc", "text": "用量-收线方式" + k + "-总米长"});
                                    attrArray.push({
                                        "name": "yl.sxfs" + k + ".gzlxh",
                                        "text": "用量-收线方式" + k + "-工字轮型号"
                                    });
                                }
                                for (var k = 0; k < data.length; k++) {
                                    for (var l = 0; l < attrArray.length; l++) {
                                        if (data[k].name == attrArray[l].name) {
                                            var result = checkValue(attrArray[l].name, data[k].value);
                                            if (result.valid) {
                                                if (data[k].name.indexOf("sxfs") >= 0) {
                                                    attrArray[l].name = attrArray[l].name.replace("sxfs", "yl");
                                                }
                                                setToNode("value", ng_inst, "ngqyl.zxs." + attrArray[l].name, data[k].value);
                                            }
                                            else {
                                                console.log("error:the value of " + ngName + ngdcNNodeName + "zxs." + attrArray[l].name + result.type);
                                                throw new Error("<span>" + "[表单]:" + orderItemInst.name + "<br/>" +
                                                    "[产品编号]:" + orderItemInst.cpbh + "<br/>" +
                                                    "[节点]:" + getFromNode("fullText", orderItemInst, ngName + ngdcNNodeName + "zxs") + "<br/>"
                                                    + "[原因]:" + attrArray[l].text + result.text + "</span>");
                                            }
                                            break;
                                        }
                                    }
                                }
                            }
                            else if (checkNodeExist(orderItemInst, ngName + ngdcNNodeName + "xwx")) {
                                deleteFromNode(ng_inst, "ngqyl", "zxs");
                                deleteFromNode(ng_inst, "ngqyl", "zjp");
                                deleteFromNode(ng_inst, "ngqyl", "wgs");
                                var data = getFromNode("data", orderItemInst, ngName + ngdcNNodeName + "xwx");
                                var attrArray = [
                                    {"name": "gg.lb", "text": "规格-类别"},
                                    {"name": "gg.zj", "text": "规格-直径"},
                                    {"name": "gg.nx", "text": "规格-捻向"},
                                    {"name": "gg.hyl", "text": "规格-含油率"},
                                    {"name": "yl.gymcxs", "text": "用量-工艺米长系数"},
                                    {"name": "yl.zmc", "text": "用量-总米长"},
                                    {"name": "yl.dh", "text": "用量-吨耗"},
                                    {"name": "yl.zl", "text": "用量-重量"}
                                ];
                                for (var k = 0; k < data.length; k++) {
                                    for (var l = 0; l < attrArray.length; l++) {
                                        if (data[k].name == attrArray[l].name) {
                                            var result = checkValue(attrArray[l].name, data[k].value);
                                            if (result.valid) {
                                                setToNode("value", ng_inst, "ngqyl.xwx." + attrArray[l].name, data[k].value);
                                            }
                                            else {
                                                console.log("error:the value of " + ngName + ngdcNNodeName + "xwx." + attrArray[l].name + result.type);
                                                throw new Error("<span>" + "[表单]:" + orderItemInst.name + "<br/>" +
                                                    "[产品编号]:" + orderItemInst.cpbh + "<br/>" +
                                                    "[节点]:" + getFromNode("fullText", orderItemInst, ngName + ngdcNNodeName + "xwx") + "<br/>"
                                                    + "[原因]:" + attrArray[l].text + result.text + "</span>");
                                            }
                                            break;
                                        }
                                    }
                                }
                            }
                            else {
                                deleteFromNode(ng_inst, "ngqyl", "zxs");
                                deleteFromNode(ng_inst, "ngqyl", "xwx");
                                deleteFromNode(ng_inst, "ngqyl", "zjp");
                                deleteFromNode(ng_inst, "ngqyl", "wgs");
                            }
                        }
                        else {
                            deleteFromNode(ng_inst, "ngqyl", "zxs");
                            deleteFromNode(ng_inst, "ngqyl", "xwx");
                            deleteFromNode(ng_inst, "ngqyl", "wgs");
                            var zjpNodeName = getDcName("ng", ngcs, j - 1, true);
                            if (ngName.indexOf("zxg") >= 0) {
                                setToNode("text", ng_inst, "ngqyl.zjp", "中心股-" + (j - 1) + "捻");
                            }
                            else if (ngName.indexOf("wg") >= 0) {
                                setToNode("text", ng_inst, "ngqyl.zjp", "外股-" + (j - 1) + "捻");
                            }
                            else if (ngName.indexOf("jsgx") >= 0) {
                                setToNode("text", ng_inst, "ngqyl.zjp", "金属股芯-" + (j - 1) + "捻");
                            }
                            else {
                                setToNode("text", ng_inst, "ngqyl.zjp", "股-" + (j - 1) + "捻");
                            }
                            var data = getFromNode("data", orderItemInst, ngName + zjpNodeName);
                            var sxfss = getFromNode("sxfss", orderItemInst, ngName + zjpNodeName);
                            drawNode(sxfss, getFromNode("json", ng_inst, "ngqyl.zjp.yl"), getFromNode("json", ng_inst, "ngqyl.zjp.yl.yln"), "yls", 1);
                            tree.expire(ng_inst);
                            var attrArray = [
                                {"name": "gg.jg", "text": "规格-结构"},
                                {"name": "gg.zj", "text": "规格-直径"},
                                {"name": "gg.nx", "text": "规格-捻向"},
                                {"name": "gg.qd", "text": "规格-强度"},
                                {"name": "gg.tyfs", "text": "规格-涂油方式"},
                                {"name": "gg.nj", "text": "规格-捻距"}
                            ];
                            for (var k = 1; k < sxfss + 1; k++) {
                                attrArray.push({"name": "yl.sxfs" + k + ".dc", "text": "用量-收线方式" + k + "-段长"});
                                attrArray.push({"name": "yl.sxfs" + k + ".ds", "text": "用量-收线方式" + k + "-段数"});
                                attrArray.push({"name": "yl.sxfs" + k + ".js", "text": "用量-收线方式" + k + "-件数"});
                                attrArray.push({"name": "yl.sxfs" + k + ".djmc", "text": "用量-收线方式" + k + "-单件米长"});
                                attrArray.push({"name": "yl.sxfs" + k + ".zmc", "text": "用量-收线方式" + k + "-总米长"});
                                attrArray.push({"name": "yl.sxfs" + k + ".gzlxh", "text": "用量-收线方式" + k + "-工字轮型号"});
                            }
                            for (var k = 0; k < data.length; k++) {
                                for (var l = 0; l < attrArray.length; l++) {
                                    if (data[k].name == attrArray[l].name) {
                                        var result = checkValue(attrArray[l].name, data[k].value);
                                        if (result.valid) {
                                            if (data[k].name.indexOf("sxfs") >= 0) {
                                                attrArray[l].name = attrArray[l].name.replace("sxfs", "yl");
                                            }
                                            setToNode("value", ng_inst, "ngqyl.zjp." + attrArray[l].name, data[k].value);
                                        }
                                        else {
                                            console.log("error:the value of " + ngName + zjpNodeName + "." + attrArray[l].name + result.type);
                                            throw new Error("<span>" + "[表单]:" + orderItemInst.name + "<br/>" +
                                                "[产品编号]:" + orderItemInst.cpbh + "<br/>" +
                                                "[节点]:" + getFromNode("fullText", orderItemInst, ngName + zjpNodeName) + "<br/>"
                                                + "[原因]:" + attrArray[l].text + result.text + "</span>");
                                        }
                                        break;
                                    }
                                }
                            }
                            setToNode("value", ng_inst, "ngqyl.zjp.gg.bmzt", bmzt);
                        }
                        if (ngcs == 1) {
                            if (checkNodeExist(orderItemInst, ngName + ".sdc1")) {
                                deleteFromNode(ng_inst, "ngqyl", "sn");
                                var scs = getFromNode("repeat", orderItemInst, ngName + ".sdc1");
                                drawNode(scs, getFromNode("json", ng_inst, "ngqyl"), getFromNode("json", ng_inst, "ngqyl.sdcn"), "scs", 1);
                                tree.expire(ng_inst);
                                for (var k = 1; k < scs + 1; k++) {
                                    var ss = getFromNode("repeat", orderItemInst, ngName + ".sdc" + k + ".s1");
                                    drawNode(ss, getFromNode("json", ng_inst, "ngqyl.sdc" + k), getFromNode("json", ng_inst, "ngqyl.sdc" + k + ".sn"), "ss", 1);
                                    tree.expire(ng_inst);
                                    for (var l = 1; l < ss + 1; l++) {
                                        var sxfss = getFromNode("sxfss", orderItemInst, ngName + ".sdc" + k + ".s" + l);
                                        drawNode(sxfss, getFromNode("json", ng_inst, "ngqyl.sdc" + k + ".s" + l + ".yl"), getFromNode("json", ng_inst, "ngqyl.sdc" + k + ".s" + l + ".yl.yln"), "yls", 1);
                                        tree.expire(ng_inst);
                                        var data = getFromNode("data", orderItemInst, ngName + ".sdc" + k + ".s" + l);
                                        var attrArray = [
                                            {"name": "gg.lb", "text": "规格-类别"},
                                            {"name": "gg.zj", "text": "规格-直径"},
                                            {"name": "gg.qd", "text": "规格-强度"},
                                            {"name": "yl.gs", "text": "用量-个数"}
                                        ];
                                        for (var m = 1; m < sxfss + 1; m++) {
                                            attrArray.push({
                                                "name": "yl.sxfs" + m + ".dc",
                                                "text": "用量-收线方式" + m + "-段长"
                                            });
                                            attrArray.push({
                                                "name": "yl.sxfs" + m + ".ds",
                                                "text": "用量-收线方式" + m + "-段数"
                                            });
                                            attrArray.push({
                                                "name": "yl.sxfs" + m + ".js",
                                                "text": "用量-收线方式" + m + "-件数"
                                            });
                                            attrArray.push({
                                                "name": "yl.sxfs" + m + ".djmc",
                                                "text": "用量-收线方式" + m + "-单件米长"
                                            });
                                            attrArray.push({
                                                "name": "yl.sxfs" + m + ".zmc",
                                                "text": "用量-收线方式" + m + "-总米长"
                                            });
                                            attrArray.push({
                                                "name": "yl.sxfs" + m + ".gzlxh",
                                                "text": "用量-收线方式" + m + "-工字轮型号"
                                            });
                                        }
                                        for (var m = 0; m < data.length; m++) {
                                            for (var n = 0; n < attrArray.length; n++) {
                                                if (data[m].name == attrArray[n].name) {
                                                    var result = checkValue(attrArray[n].name, data[m].value);
                                                    if (result.valid) {
                                                        if (data[m].name.indexOf("sxfs") >= 0) {
                                                            attrArray[n].name = attrArray[n].name.replace("sxfs", "yl");
                                                        }
                                                        setToNode("value", ng_inst, "ngqyl.sdc" + k + ".s" + l + "." + attrArray[n].name, data[m].value);
                                                    }
                                                    else {
                                                        console.log("error:the value of " + ngName + ".sdc" + k + ".s" + l + "." + attrArray[n].name + result.type);
                                                        throw new Error("<span>" + "[表单]:" + orderItemInst.name + "<br/>" +
                                                            "[产品编号]:" + orderItemInst.cpbh + "<br/>" +
                                                            "[节点]:" + getFromNode("fullText", orderItemInst, ngName + ".sdc" + k + ".s" + l) + "<br/>"
                                                            + "[原因]:" + attrArray[n].text + result.text + "</span>");
                                                    }
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            else {
                                deleteFromNode(ng_inst, "ngqyl", "sdcn");
                                var ss = getFromNode("repeat", orderItemInst, ngName + ".s1");
                                drawNode(ss, getFromNode("json", ng_inst, "ngqyl"), getFromNode("json", ng_inst, "ngqyl.sn"), "ss", 1);
                                tree.expire(ng_inst);
                                for (var k = 1; k < ss + 1; k++) {
                                    var sxfss = getFromNode("sxfss", orderItemInst, ngName + ".s" + k);
                                    drawNode(sxfss, getFromNode("json", ng_inst, "ngqyl.s" + k + ".yl"), getFromNode("json", ng_inst, "ngqyl.s" + k + ".yl.yln"), "yls", 1);
                                    tree.expire(ng_inst);
                                    var data = getFromNode("data", orderItemInst, ngName + ".s" + k);
                                    var attrArray = [
                                        {"name": "gg.lb", "text": "规格-类别"},
                                        {"name": "gg.zj", "text": "规格-直径"},
                                        {"name": "gg.qd", "text": "规格-强度"},
                                        {"name": "yl.gs", "text": "用量-个数"}
                                    ];
                                    for (var l = 1; l < sxfss + 1; l++) {
                                        attrArray.push({
                                            "name": "yl.sxfs" + l + ".dc",
                                            "text": "用量-收线方式" + l + "-段长"
                                        });
                                        attrArray.push({
                                            "name": "yl.sxfs" + l + ".ds",
                                            "text": "用量-收线方式" + l + "-段数"
                                        });
                                        attrArray.push({
                                            "name": "yl.sxfs" + l + ".js",
                                            "text": "用量-收线方式" + l + "-件数"
                                        });
                                        attrArray.push({
                                            "name": "yl.sxfs" + l + ".djmc",
                                            "text": "用量-收线方式" + l + "-单件米长"
                                        });
                                        attrArray.push({
                                            "name": "yl.sxfs" + l + ".zmc",
                                            "text": "用量-收线方式" + l + "-总米长"
                                        });
                                        attrArray.push({
                                            "name": "yl.sxfs" + l + ".gzlxh",
                                            "text": "用量-收线方式" + l + "-工字轮型号"
                                        });
                                    }
                                    for (var l = 0; l < data.length; l++) {
                                        for (var m = 0; m < attrArray.length; m++) {
                                            if (data[l].name == attrArray[m].name) {
                                                var result = checkValue(attrArray[m].name, data[l].value);
                                                if (result.valid) {
                                                    if (data[l].name.indexOf("sxfs") >= 0) {
                                                        attrArray[m].name = attrArray[m].name.replace("sxfs", "yl");
                                                    }
                                                    setToNode("value", ng_inst, "ngqyl.s" + k + "." + attrArray[m].name, data[l].value);
                                                }
                                                else {
                                                    console.log("error:the value of " + ngName + ".s" + k + "." + attrArray[m].name + result.type);
                                                    throw new Error("<span>" + "[表单]:" + orderItemInst.name + "<br/>" +
                                                        "[产品编号]:" + orderItemInst.cpbh + "<br/>" +
                                                        "[节点]:" + getFromNode("fullText", orderItemInst, ngName + ".s" + k) + "<br/>"
                                                        + "[原因]:" + attrArray[m].text + result.text + "</span>");
                                                }
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        else {
                            deleteFromNode(ng_inst, "ngqyl", "sdcn");
                            var ss = getFromNode("repeat", orderItemInst, ngName + ngdcNNodeName + "s1");
                            drawNode(ss, getFromNode("json", ng_inst, "ngqyl"), getFromNode("json", ng_inst, "ngqyl.sn"), "ss", 1);
                            tree.expire(ng_inst);
                            for (var k = 1; k < ss + 1; k++) {
                                var sxfss = getFromNode("sxfss", orderItemInst, ngName + ngdcNNodeName + "s" + k);
                                drawNode(sxfss, getFromNode("json", ng_inst, "ngqyl.s" + k + ".yl"), getFromNode("json", ng_inst, "ngqyl.s" + k + ".yl.yln"), "yls", 1);
                                tree.expire(ng_inst);
                                var data = getFromNode("data", orderItemInst, ngName + ngdcNNodeName + "s" + k);
                                var attrArray = [
                                    {"name": "gg.lb", "text": "规格-类别"},
                                    {"name": "gg.zj", "text": "规格-直径"},
                                    {"name": "gg.qd", "text": "规格-强度"},
                                    {"name": "yl.gs", "text": "用量-个数"}
                                ];
                                for (var l = 1; l < sxfss + 1; l++) {
                                    attrArray.push({
                                        "name": "yl.sxfs" + l + ".dc",
                                        "text": "用量-收线方式" + l + "-段长"
                                    });
                                    attrArray.push({
                                        "name": "yl.sxfs" + l + ".ds",
                                        "text": "用量-收线方式" + l + "-段数"
                                    });
                                    attrArray.push({
                                        "name": "yl.sxfs" + l + ".js",
                                        "text": "用量-收线方式" + l + "-件数"
                                    });
                                    attrArray.push({
                                        "name": "yl.sxfs" + l + ".djmc",
                                        "text": "用量-收线方式" + l + "-单件米长"
                                    });
                                    attrArray.push({
                                        "name": "yl.sxfs" + l + ".zmc",
                                        "text": "用量-收线方式" + l + "-总米长"
                                    });
                                    attrArray.push({
                                        "name": "yl.sxfs" + l + ".gzlxh",
                                        "text": "用量-收线方式" + l + "-工字轮型号"
                                    });
                                }
                                for (var l = 0; l < data.length; l++) {
                                    for (var m = 0; m < attrArray.length; m++) {
                                        if (data[l].name == attrArray[m].name) {
                                            var result = checkValue(attrArray[m].name, data[l].value);
                                            if (result.valid) {
                                                if (data[l].name.indexOf("sxfs") >= 0) {
                                                    attrArray[m].name = attrArray[m].name.replace("sxfs", "yl");
                                                }
                                                setToNode("value", ng_inst, "ngqyl.s" + k + "." + attrArray[m].name, data[l].value);
                                            }
                                            else {
                                                console.log("error:the value of " + ngName + ngdcNNodeName + "s" + k + "." + attrArray[m].name + result.type);
                                                throw new Error("<span>" + "[表单]:" + orderItemInst.name + "<br/>" +
                                                    "[产品编号]:" + orderItemInst.cpbh + "<br/>" +
                                                    "[节点]:" + getFromNode("fullText", orderItemInst, ngName + ngdcNNodeName + "s" + k) + "<br/>"
                                                    + "[原因]:" + attrArray[m].text + result.text + "</span>");
                                            }
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                        var data = getFromNode("data", orderItemInst, ngName + ngdcNNodeName + "yz");
                        var deleteYz = false;
                        for (var k = 0; k < data.length; k++) {
                            if (data[k].name == "gg.xh") {
                                if (data[k].value == undefined || data[k].value == "") {
                                    deleteYz = true;
                                    break;
                                }
                            }
                        }
                        if (deleteYz) {
                            deleteFromNode(ng_inst, "ngqyl", "yz");
                        }
                        else {
                            var attrArray = [
                                {"name": "gg.xh", "text": "规格-型号"},
                                {"name": "yl.tyfs", "text": "用量-涂油方式"},
                                {"name": "yl.dh", "text": "用量-吨耗"},
                                {"name": "yl.zl", "text": "用量-重量"}
                            ];
                            for (var k = 0; k < data.length; k++) {
                                for (var l = 0; l < attrArray.length; l++) {
                                    if (data[k].name == attrArray[l].name) {
                                        var result = checkValue(attrArray[l].name, data[k].value);
                                        if (result.valid) {
                                            setToNode("value", ng_inst, "ngqyl.yz." + attrArray[l].name, data[k].value);
                                        }
                                        else {
                                            console.log("error:the value of " + ngName + ngdcNNodeName + "yz." + attrArray[l].name + result.type);
                                            throw new Error("<span>" + "[表单]:" + orderItemInst.name + "<br/>" +
                                                "[产品编号]:" + orderItemInst.cpbh + "<br/>" +
                                                "[节点]:" + getFromNode("fullText", orderItemInst, ngName + ngdcNNodeName + "yz") + "<br/>"
                                                + "[原因]:" + attrArray[l].text + result.text + "</span>");
                                        }
                                        break;
                                    }
                                }
                            }
                        }
                        if (ngcs == j) {
                            if (ngName.indexOf("zxg") >= 0) {
                                setToNode("value", ng_inst, "ngh.gdcp.lb", "中心股");
                                ng_inst["lb"] = "中心股";
                            }
                            else if (ngName.indexOf("wg") >= 0) {
                                setToNode("value", ng_inst, "ngh.gdcp.lb", "外股");
                                ng_inst["lb"] = "外股";
                            }
                            else if (ngName.indexOf("jsgx") >= 0) {
                                setToNode("value", ng_inst, "ngh.gdcp.lb", "金属股芯");
                                ng_inst["lb"] = "金属股芯";
                            }
                            else {
                                setToNode("value", ng_inst, "ngh.gdcp.lb", "股");
                                ng_inst["lb"] = "股";
                            }
                        }
                        else {
                            if (ngName.indexOf("zxg") >= 0) {
                                setToNode("value", ng_inst, "ngh.gdcp.lb", "中心股-" + j + "捻");
                                ng_inst["lb"] = "中心股-" + j + "捻";
                            }
                            else if (ngName.indexOf("wg") >= 0) {
                                setToNode("value", ng_inst, "ngh.gdcp.lb", "外股-" + j + "捻");
                                ng_inst["lb"] = "外股-" + j + "捻";
                            }
                            else if (ngName.indexOf("jsgx") >= 0) {
                                setToNode("value", ng_inst, "ngh.gdcp.lb", "金属股芯-" + j + "捻");
                                ng_inst["lb"] = "金属股芯-" + j + "捻";
                            }
                            else {
                                setToNode("value", ng_inst, "ngh.gdcp.lb", "股-" + j + "捻");
                                ng_inst["lb"] = "股-" + j + "捻";
                            }
                        }
                        setToNode("value", ng_inst, "ngh.gdcp.bmzt", bmzt);
                        ng_inst["bmzt"] = bmzt;
                        setToNode("value", ng_inst, "ngh.gdcp.tsyq", tsyq);
                        ng_inst["tsyq"] = tsyq;
                        setToNode("value", ng_inst, "ngh.gdcp.yt", yt);
                        ng_inst["yt"] = yt;
                        ng_inst["sggSzj"] = sggSzj;
                        ng_inst["jhrq"] = jhrq;
                        var data = getFromNode("data", orderItemInst, ngName + ngdcNodeName);
                        var sxfss = getFromNode("sxfss", orderItemInst, ngName + ngdcNodeName);
                        drawNode(sxfss, getFromNode("json", ng_inst, "ngh.sxfs"), getFromNode("json", ng_inst, "ngh.sxfs.sxfsn"), "sxfss", 1);
                        tree.expire(ng_inst)
                        var attrArray = [
                            {"name": "gg.jg", "text": "规格-结构"},
                            {"name": "gg.zj", "text": "规格-直径"},
                            {"name": "gg.nx", "text": "规格-捻向"},
                            {"name": "gg.qd", "text": "规格-强度"},
                            {"name": "gg.tyfs", "text": "规格-涂油方式"},
                            {"name": "gg.nj", "text": "规格-捻距"}
                        ];
                        for (var k = 1; k < sxfss + 1; k++) {
                            attrArray.push({"name": "yl.sxfs" + k + ".dc", "text": "用量-收线方式" + k + "-段长"});
                            attrArray.push({"name": "yl.sxfs" + k + ".ds", "text": "用量-收线方式" + k + "-段数"});
                            attrArray.push({"name": "yl.sxfs" + k + ".js", "text": "用量-收线方式" + k + "-件数"});
                            attrArray.push({"name": "yl.sxfs" + k + ".djmc", "text": "用量-收线方式" + k + "-单件米长"});
                            attrArray.push({"name": "yl.sxfs" + k + ".zmc", "text": "用量-收线方式" + k + "-总米长"});
                            attrArray.push({"name": "yl.sxfs" + k + ".gzlxh", "text": "用量-收线方式" + k + "-工字轮型号"});
                        }
                        var jhcl = 0;
                        for (var k = 0; k < data.length; k++) {
                            for (var l = 0; l < attrArray.length; l++) {
                                if (data[k].name == attrArray[l].name) {
                                    var result = checkValue(attrArray[l].name, data[k].value);
                                    if (result.valid) {
                                        if (attrArray[l].name.indexOf("gg") >= 0) {
                                            ng_inst[attrArray[l].name.split(".")[1]] = data[k].value + "";
                                            attrArray[l].name = attrArray[l].name.replace("gg", "gdcp");
                                        }
                                        else {
                                            attrArray[l].name = attrArray[l].name.replace("yl", "sxfs");
                                        }
                                        if (attrArray[l].name.indexOf("zmc") >= 0) {
                                            jhcl = accAdd(jhcl, data[k].value);
                                        }
                                        setToNode("value", ng_inst, "ngh." + attrArray[l].name, data[k].value);
                                    }
                                    else {
                                        console.log("error:the value of " + ngName + ngdcNNodeName + attrArray[l].name + result.type);
                                        throw new Error("<span>" + "[表单]:" + orderItemInst.name + "<br/>" +
                                            "[产品编号]:" + orderItemInst.cpbh + "<br/>" +
                                            "[节点]:" + getFromNode("fullText", orderItemInst, ngName + ngdcNodeName) + "<br/>"
                                            + "[原因]:" + attrArray[l].text + result.text + "</span>");
                                    }
                                    break;
                                }
                            }
                        }
                        setToNode("value", ng_inst, "cljh.jhcl", jhcl);
                        deleteFromNode(ng_inst, ".", "sjcl");
                        setToNode("value", ng_inst, "cpbh", cpbh);
                        ng_inst["cpbh"] = cpbh;
                        setToNode("value", ng_inst, "sfdz", sfdz);
                        ng_inst["sfdz"] = sfdz == "是" ? "已定制" : "未定制";
                        setToNode("value", ng_inst, "cj", "");
                        ng_inst["cj"] = "";
                        ng_inst["merge"] = "未合并";
                        ng_inst["status"] = "未计划";
                        ng_inst["isMerged"] = false;
                        makeForm(ng_inst, user);
                        newFormInsts.push(ng_inst);
                    }
                }
            }
        }
        ,

        /**
         * 创建作业计划实例，从生产计划传承
         *
         * @param workPlanInst 作业计划表实例
         * @param formsMap
         * @param newFormInsts
         * @return {Array} 所有新生成的生产任务实例
         */
        createWorkPlan: function (user, productionPlanInst, formsMap, index, newFormInsts, saveFormInsts) {
            var date = new Date();
            var ymd = date.Format("yyyy-MM-dd");
            if (productionPlanInst.alias == "hs_production_plan") {
                var inst = cloneInst(formsMap.hs_work_plan, enums.StatusEnum.NOT_PROCESSED);
                var dumpInst = _.cloneDeep(inst);
                setToNode("value", inst, "xdrq", ymd);
                setToNode("value", productionPlanInst, "xdrq", ymd);
                setToNode("value", inst, "gdzzh", "hs" + ymd + "-" + index);
                setToNode("value", productionPlanInst, "gdzzh", "hs" + ymd + "-" + index);
                setToNode("value", inst, "sfdz", getFromNode("value", productionPlanInst, "sfdz"));
                setToNode("children", inst, "scyq.jxyl", _.cloneDeep(getFromNode("children", productionPlanInst, "hsqyl")));
                setToNode("value", inst, "cj", getFromNode("value", productionPlanInst, "cj"));
                tree.expire(inst);
                var names = ["dc", "ds", "djmc", "js", "zmc", "gzlxh"];
                if (checkNodeExist(inst, "scyq.jxyl.zjp")) {
                    var yls = getFromNode("yls", inst, "scyq.jxyl.zjp.yl");
                    for (var i = yls.begin; i < yls.begin + yls.total; i++) {
                        setToNode("children", inst, "scyq.jxyl.zjp.yl.yl" + i, _.cloneDeep(getFromNode("children", dumpInst, "scyq.jxyl.zjp.yl.yln")));
                        tree.expire(inst);
                        for (var j = 0; j < names.length; j++) {
                            setToNode("value", inst, "scyq.jxyl.zjp.yl.yl" + i + "." + names[j], getFromNode("value", productionPlanInst, "hsqyl.zjp.yl.yl" + i + "." + names[j]));
                        }
                    }
                }
                if (checkNodeExist(inst, "scyq.jxyl.jssx")) {
                    var yls = getFromNode("yls", inst, "scyq.jxyl.jssx.yl");
                    for (var i = yls.begin; i < yls.begin + yls.total; i++) {
                        setToNode("children", inst, "scyq.jxyl.jssx.yl.yl" + i, _.cloneDeep(getFromNode("children", dumpInst, "scyq.jxyl.jssx.yl.yln")));
                        tree.expire(inst);
                        for (var j = 0; j < names.length; j++) {
                            setToNode("value", inst, "scyq.jxyl.jssx.yl.yl" + i + "." + names[j], getFromNode("value", productionPlanInst, "hsqyl.jssx.yl.yl" + i + "." + names[j]));
                        }
                    }
                }
                if (checkNodeExist(inst, "scyq.jxyl.jsgx")) {
                    var yls = getFromNode("yls", inst, "scyq.jxyl.jsgx.yl");
                    for (var i = yls.begin; i < yls.begin + yls.total; i++) {
                        setToNode("children", inst, "scyq.jxyl.jsgx.yl.yl" + i, _.cloneDeep(getFromNode("children", dumpInst, "scyq.jxyl.jsgx.yl.yln")));
                        tree.expire(inst);
                        for (var j = 0; j < names.length; j++) {
                            setToNode("value", inst, "scyq.jxyl.jsgx.yl.yl" + i + "." + names[j], getFromNode("value", productionPlanInst, "hsqyl.jsgx.yl.yl" + i + "." + names[j]));
                        }
                    }
                }
                if (checkNodeExist(inst, "scyq.jxyl.zxg")) {
                    var yls = getFromNode("yls", inst, "scyq.jxyl.zxg.yl");
                    for (var i = yls.begin; i < yls.begin + yls.total; i++) {
                        setToNode("children", inst, "scyq.jxyl.zxg.yl.yl" + i, _.cloneDeep(getFromNode("children", dumpInst, "scyq.jxyl.zxg.yl.yln")));
                        tree.expire(inst);
                        for (var j = 0; j < names.length; j++) {
                            setToNode("value", inst, "scyq.jxyl.zxg.yl.yl" + i + "." + names[j], getFromNode("value", productionPlanInst, "hsqyl.zxg.yl.yl" + i + "." + names[j]));
                        }
                    }
                }
                if (checkNodeExist(inst, "scyq.jxyl.wg")) {
                    var yls = getFromNode("yls", inst, "scyq.jxyl.wg.yl");
                    for (var i = yls.begin; i < yls.begin + yls.total; i++) {
                        setToNode("children", inst, "scyq.jxyl.wg.yl.yl" + i, _.cloneDeep(getFromNode("children", dumpInst, "scyq.jxyl.wg.yl.yln")));
                        tree.expire(inst);
                        for (var j = 0; j < names.length; j++) {
                            setToNode("value", inst, "scyq.jxyl.wg.yl.yl" + i + "." + names[j], getFromNode("value", productionPlanInst, "hsqyl.wg.yl.yl" + i + "." + names[j]));
                        }
                    }
                }
                if (checkNodeExist(inst, "scyq.jxyl.bjsx")) {
                    var yls = getFromNode("yls", inst, "scyq.jxyl.bjsx.yl");
                    for (var i = yls.begin; i < yls.begin + yls.total; i++) {
                        setToNode("children", inst, "scyq.jxyl.bjsx.yl.yl" + i, _.cloneDeep(getFromNode("children", dumpInst, "scyq.jxyl.bjsx.yl.yln")));
                        tree.expire(inst);
                        for (var j = 0; j < names.length; j++) {
                            setToNode("value", inst, "scyq.jxyl.bjsx.yl.yl" + i + "." + names[j], getFromNode("value", productionPlanInst, "hsqyl.bjsx.yl.yl" + i + "." + names[j]));
                        }
                    }
                }
                var gcs = getFromNode("gcs", productionPlanInst, "hsqyl");
                if (gcs) {
                    setToNode("gcs", inst, "scyq.jxyl", gcs);
                    for (var i = gcs.begin; i < gcs.begin + gcs.total; i++) {
                        var gs = getFromNode("gs", inst, "scyq.jxyl.gdc" + i);
                        for (var j = gs.begin; j < gs.begin + gs.total; j++) {
                            var yls = getFromNode("yls", inst, "scyq.jxyl.gdc" + i + ".g" + j + ".yl");
                            for (var k = yls.begin; k < yls.begin + yls.total; k++) {
                                setToNode("children", inst, "scyq.jxyl.gdc" + i + ".g" + j + ".yl.yl" + k, _.cloneDeep(getFromNode("children", dumpInst, "scyq.jxyl.gdcn.gn.yl.yln")));
                                tree.expire(inst);
                                for (var l = 0; l < names.length; l++) {
                                    setToNode("value", inst, "scyq.jxyl.gdc" + i + ".g" + j + ".yl.yl" + k + "." + names[l], getFromNode("value", productionPlanInst, "hsqyl.gdc" + i + ".g" + j + ".yl.yl" + k + "." + names[l]));
                                }
                            }
                        }
                    }
                }
                setToNode("children", inst, "scyq.cpyq.gdcp", getFromNode("children", productionPlanInst, "hsh.gdcp"));
                var sxfss = getFromNode("sxfss", productionPlanInst, "hsh.sxfs");
                var names;
                var isGss = getFromNode("value", productionPlanInst, "hsh.gdcp.lb") == "钢丝绳" ? true : false;
                if (isGss) {
                    names = ["djmc", "js", "zmc", "bzfs", "lpxh"];
                    deleteFromNode(inst, "scyq.cpyq.sxfs.sxfsn", "dc");
                    deleteFromNode(inst, "scyq.cpyq.sxfs.sxfsn", "ds");
                    deleteFromNode(inst, "scyq.cpyq.sxfs.sxfsn", "djsh");
                    deleteFromNode(inst, "scyq.cpyq.sxfs.sxfsn", "djscmc");
                    deleteFromNode(inst, "scyq.cpyq.sxfs.sxfsn", "zsh");
                    deleteFromNode(inst, "scyq.cpyq.sxfs.sxfsn", "zscmc");
                    deleteFromNode(inst, "scyq.cpyq.sxfs.sxfsn", "gzlxh");
                }
                else {
                    names = ["dc", "ds", "djmc", "js", "zmc", "gzlxh"];
                    deleteFromNode(inst, "scyq.cpyq.sxfs.sxfsn", "bzfs");
                    deleteFromNode(inst, "scyq.cpyq.sxfs.sxfsn", "lpxh");
                }
                drawNode(sxfss.total, getFromNode("json", inst, "scyq.cpyq.sxfs"), getFromNode("json", inst, "scyq.cpyq.sxfs.sxfsn"),
                    "sxfss", sxfss.begin);
                tree.expire(inst);
                for (var i = sxfss.begin; i < sxfss.begin + sxfss.total; i++) {
                    for (j = 0; j < names.length; j++) {
                        setToNode("value", inst, "scyq.cpyq.sxfs.sxfs" + i + "." + names[j],
                            getFromNode("value", productionPlanInst, "hsh.sxfs.sxfs" + i + "." + names[j]));
                    }
                }
                deleteFromNode(inst, ".", "cljh");
                deleteFromNode(inst, ".", "sjcl");
                inst["status"] = "未安排";
                inst["production_plan_id"] = productionPlanInst._id.toString();
                inst["jhscksrq"] = getFromNode("value", productionPlanInst, "jdjh.jhscksrq");
                inst["jhscjsrq"] = getFromNode("value", productionPlanInst, "jdjh.jhscjsrq");
                inst["cj"] = getFromNode("value", productionPlanInst, "cj");
                inst["jth"] = "";
                inst["sggSzj"] = productionPlanInst["sggSzj"];
                inst["lb"] = productionPlanInst["lb"];
                inst["bzz"] = "";
                inst["bz"] = "";
                inst["czg"] = "";
                productionPlanInst["status"] = "已下发";
                auditForm(productionPlanInst, user);
                makeForm(inst, user);
                newFormInsts.push(inst);
                saveFormInsts.push(productionPlanInst);
            }
            else if (productionPlanInst.alias == "ng_production_plan") {
                var inst = cloneInst(formsMap.ng_work_plan, enums.StatusEnum.NOT_PROCESSED);
                var dumpInst = _.cloneDeep(inst);
                setToNode("value", inst, "xdrq", ymd);
                setToNode("value", productionPlanInst, "xdrq", ymd);
                setToNode("value", inst, "gdzzh", "ng" + ymd + "-" + index);
                setToNode("value", productionPlanInst, "gdzzh", "ng" + ymd + "-" + index);
                setToNode("value", inst, "sfdz", getFromNode("value", productionPlanInst, "sfdz"));
                setToNode("children", inst, "scyq.jxyl", _.cloneDeep(getFromNode("children", productionPlanInst, "ngqyl")));
                setToNode("value", inst, "cj", getFromNode("value", productionPlanInst, "cj"));
                tree.expire(inst);
                var names = ["dc", "ds", "djmc", "js", "zmc", "gzlxh"];
                if (checkNodeExist(inst, "scyq.jxyl.zjp")) {
                    var yls = getFromNode("yls", inst, "scyq.jxyl.zjp.yl");
                    for (var i = yls.begin; i < yls.begin + yls.total; i++) {
                        setToNode("children", inst, "scyq.jxyl.zjp.yl.yl" + i, _.cloneDeep(getFromNode("children", dumpInst, "scyq.jxyl.zjp.yl.yln")));
                        tree.expire(inst);
                        for (var j = 0; j < names.length; j++) {
                            setToNode("value", inst, "scyq.jxyl.zjp.yl.yl" + i + "." + names[j], getFromNode("value", productionPlanInst, "ngqyl.zjp.yl.yl" + i + "." + names[j]));
                        }
                    }
                }
                if (checkNodeExist(inst, "scyq.jxyl.zxs")) {
                    var yls = getFromNode("yls", inst, "scyq.jxyl.zxs.yl");
                    for (var i = yls.begin; i < yls.begin + yls.total; i++) {
                        setToNode("children", inst, "scyq.jxyl.zxs.yl.yl" + i, _.cloneDeep(getFromNode("children", dumpInst, "scyq.jxyl.zxs.yl.yln")));
                        tree.expire(inst);
                        for (var j = 0; j < names.length; j++) {
                            setToNode("value", inst, "scyq.jxyl.zxs.yl.yl" + i + "." + names[j], getFromNode("value", productionPlanInst, "ngqyl.zxs.yl.yl" + i + "." + names[j]));
                        }
                    }
                }
                if (checkNodeExist(inst, "scyq.jxyl.wgs")) {
                    var ss = getFromNode("ss", inst, "scyq.jxyl.wgs");
                    for (var i = ss.begin; i < ss.begin + ss.total; i++) {
                        var yls = getFromNode("yls", inst, "scyq.jxyl.wgs.s" + i + ".yl");
                        for (var j = yls.begin; j < yls.begin + yls.total; j++) {
                            setToNode("children", inst, "scyq.jxyl.wgs.s" + i + ".yl.yl" + j, _.cloneDeep(getFromNode("children", dumpInst, "scyq.jxyl.wgs.sn.yl.yln")));
                            tree.expire(inst);
                            for (var k = 0; k < names.length; k++) {
                                setToNode("value", inst, "scyq.jxyl.wgs.s" + i + ".yl.yl" + j + "." + names[k], getFromNode("value", productionPlanInst, "ngqyl.wgs.s" + i + ".yl.yl" + j + "." + names[k]));
                            }
                        }
                    }
                }
                var scs = getFromNode("scs", productionPlanInst, "ngqyl");
                if (scs) {
                    setToNode("scs", inst, "scyq.jxyl", scs);
                    for (var i = scs.begin; i < scs.begin + scs.total; i++) {
                        var ss = getFromNode("ss", inst, "scyq.jxyl.sdc" + i);
                        for (var j = ss.begin; j < ss.begin + ss.total; j++) {
                            var yls = getFromNode("yls", inst, "scyq.jxyl.sdc" + i + ".s" + j + ".yl");
                            for (var k = yls.begin; k < yls.begin + yls.total; k++) {
                                setToNode("children", inst, "scyq.jxyl.sdc" + i + ".s" + j + ".yl.yl" + k, _.cloneDeep(getFromNode("children", dumpInst, "scyq.jxyl.sdcn.sn.yl.yln")));
                                tree.expire(inst);
                                for (var l = 0; l < names.length; l++) {
                                    setToNode("value", inst, "scyq.jxyl.sdc" + i + ".s" + j + ".yl.yl" + k + "." + names[l], getFromNode("value", productionPlanInst, "ngqyl.sdc" + i + ".s" + j + ".yl.yl" + k + "." + names[l]));
                                }
                            }
                        }
                    }
                }
                var ss = getFromNode("ss", productionPlanInst, "ngqyl");
                if (ss) {
                    setToNode("ss", inst, "scyq.jxyl", ss);
                    for (var i = ss.begin; i < ss.begin + ss.total; i++) {
                        var yls = getFromNode("yls", inst, "scyq.jxyl.s" + i + ".yl");
                        for (var j = yls.begin; j < yls.begin + yls.total; j++) {
                            setToNode("children", inst, "scyq.jxyl.s" + i + ".yl.yl" + j, _.cloneDeep(getFromNode("children", dumpInst, "scyq.jxyl.sn.yl.yln")));
                            tree.expire(inst);
                            for (var k = 0; k < names.length; k++) {
                                setToNode("value", inst, "scyq.jxyl.s" + i + ".yl.yl" + j + "." + names[k], getFromNode("value", productionPlanInst, "ngqyl.s" + i + ".yl.yl" + j + "." + names[k]));
                            }
                        }
                    }
                }
                setToNode("children", inst, "scyq.cpyq.gdcp", getFromNode("children", productionPlanInst, "ngh.gdcp"));
                var sxfss = getFromNode("sxfss", productionPlanInst, "ngh.sxfs");
                drawNode(sxfss.total, getFromNode("json", inst, "scyq.cpyq.sxfs"), getFromNode("json", inst, "scyq.cpyq.sxfs.sxfsn"), "sxfss", sxfss.begin);
                tree.expire(inst);
                var names = ["dc", "ds", "djmc", "js", "zmc", "gzlxh"];
                for (var i = sxfss.begin; i < sxfss.begin + sxfss.total; i++) {
                    for (j = 0; j < names.length; j++) {
                        setToNode("value", inst, "scyq.cpyq.sxfs.sxfs" + i + "." + names[j],
                            getFromNode("value", productionPlanInst, "ngh.sxfs.sxfs" + i + "." + names[j]));
                    }
                }
                deleteFromNode(inst, ".", "cljh");
                deleteFromNode(inst, ".", "sjcl");
                inst["status"] = "未安排";
                inst["production_plan_id"] = productionPlanInst._id.toString();
                inst["jhscksrq"] = getFromNode("value", productionPlanInst, "jdjh.jhscksrq");
                inst["jhscjsrq"] = getFromNode("value", productionPlanInst, "jdjh.jhscjsrq");
                inst["cj"] = getFromNode("value", productionPlanInst, "cj");
                inst["jth"] = "";
                inst["sggSzj"] = productionPlanInst["sggSzj"];
                inst["lb"] = productionPlanInst["lb"];
                inst["bzz"] = "";
                inst["bz"] = "";
                inst["czg"] = "";
                productionPlanInst["status"] = "已下发";
                auditForm(productionPlanInst, user);
                makeForm(inst, user);
                newFormInsts.push(inst);
                saveFormInsts.push(productionPlanInst);
            }
        }
        ,

        /**
         * 创建日作业计划, 每个工段制造号是一个记录
         *
         * @param workTaskInsts 生产任务单实例
         * @param formsMap
         * @param newFormInsts
         * @return {Array} 所有新生成的日作业计划实例
         */
        createDayPlan: function (workTaskInsts, formsMap, newFormInsts) {
            var dayPlans = [];
            for (var index in workTaskInsts) {
                //捻股作业计划
                if (workTaskInsts[index].alias == "ng_task") {
                    var newDayPlan = cloneInst(formsMap.ng_dayplan, enums.StatusEnum.NOT_PROCESSED);
                    tree.set(newDayPlan, "gdzzh", tree.get(workTaskInsts[index], "gdzzh").value);
                    dayPlans.push(newDayPlan);
                    newFormInsts.push(newDayPlan);
                }
                //合绳作业计划
                if (workTaskInsts[index].alias == "hs_task") {
                    var newDayPlan = cloneInst(formsMap.hs_dayplan, enums.StatusEnum.NOT_PROCESSED);
                    tree.set(newDayPlan, "gdzzh", tree.get(workTaskInsts[index], "gdzzh").value);
                    dayPlans.push(newDayPlan);
                    newFormInsts.push(newDayPlan);
                }
            }
            return dayPlans;
        }
        ,

        /**
         * 创建工单, 每个工段制造号是一个记录
         *
         * @param dayPlanInsts 作业计划实例
         * @param formsMap
         * @param newFormInsts
         */
        createWorkOrder: function (user, workPlanInst, formsMap, newFormInsts, saveFormInsts) {
            if (workPlanInst.alias === 'hs_work_plan') {
                var inst = cloneInst(formsMap.hs_work_order, enums.StatusEnum.NOT_PROCESSED);
                var names = ["sfdz", "gdzzh", "cj", "jth", "jtmcxs", "bzz", "bz", "czg"];
                for (var i = 0; i < names.length; i++) {
                    setToNode("value", inst, names[i], getFromNode("value", workPlanInst, names[i]) || "");
                    if (names[i] == "jth" || names[i] == "bzz" || names[i] == "czg") {
                        setToNode("_id", inst, names[i], getFromNode("_id", workPlanInst, names[i]) || "");
                    }
                }
                setToNode("children", inst, "hsqyl", getFromNode("children", workPlanInst, "scyq.jxyl"));
                var gcs = getFromNode("gcs", workPlanInst, "scyq.jxyl");
                if (gcs) {
                    setToNode("gcs", inst, "hsqyl", gcs);
                }
                setToNode("children", inst, "hsh", getFromNode("children", workPlanInst, "scyq.cpyq"));
                setToNode("value", inst, "jhzcl.zmc", getFromNode("value", workPlanInst, "cljh.jhcl"));
                setToNode("value", inst, "sjcl.ysxmc", 0);
                setToNode("value", inst, "sjzcl.zmc", 0);
                setToNode("value", inst, "sjzcl.sxfsn.zjs", 0);
                setToNode("value", inst, "sjzcl.sxfsn.zmc", 0);
                var sxfss = getFromNode("sxfss", workPlanInst, "scyq.cpyq.sxfs");
                drawNode(sxfss.total, getFromNode("json", inst, "sjzcl"), getFromNode("json", inst, "sjzcl.sxfsn"),
                    "sxfss", sxfss.begin);
                deleteFromNode(inst, ".", "zjtj");
                deleteFromNode(inst, ".", "gdls");
                inst["sggSzj"] = workPlanInst["sggSzj"];
                inst["status"] = "original";
                inst["production_plan_id"] = workPlanInst.production_plan_id;
                inst["work_plan_id"] = workPlanInst._id.toString();
                inst["spools"] = {
                    "online": {
                        "present": [],
                        "history": []
                    },
                    "offline": {
                        "history": []
                    }
                };
                workPlanInst["status"] = "已下发";
                auditForm(workPlanInst, user);
                createSlld(workPlanInst, newFormInsts);
                newFormInsts.push(inst);
                saveFormInsts.push(workPlanInst);
            }
            if (workPlanInst.alias === 'ng_work_plan') {
                var inst = cloneInst(formsMap.ng_work_order, enums.StatusEnum.NOT_PROCESSED);
                var names = ["sfdz", "gdzzh", "cj", "jth", "jtmcxs", "bzz", "bz", "czg"];
                for (var i = 0; i < names.length; i++) {
                    setToNode("value", inst, names[i], getFromNode("value", workPlanInst, names[i]) || "");
                    if (names[i] == "jth" || names[i] == "bzz" || names[i] == "czg") {
                        setToNode("_id", inst, names[i], getFromNode("_id", workPlanInst, names[i]) || "");
                    }
                }
                setToNode("children", inst, "ngqyl", getFromNode("children", workPlanInst, "scyq.jxyl"));
                var scs = getFromNode("scs", workPlanInst, "scyq.jxyl");
                if (scs) {
                    setToNode("scs", inst, "ngqyl", scs);
                }
                var ss = getFromNode("ss", workPlanInst, "scyq.jxyl");
                if (ss) {
                    setToNode("ss", inst, "ngqyl", ss);
                }
                setToNode("children", inst, "ngh", getFromNode("children", workPlanInst, "scyq.cpyq"));
                setToNode("value", inst, "jhzcl.zmc", getFromNode("value", workPlanInst, "cljh.jhcl"));
                setToNode("value", inst, "sjcl.ysxmc", 0);
                setToNode("value", inst, "sjzcl.zmc", 0);
                setToNode("value", inst, "sjzcl.sxfsn.zjs", 0);
                setToNode("value", inst, "sjzcl.sxfsn.zmc", 0);
                var sxfss = getFromNode("sxfss", workPlanInst, "scyq.cpyq.sxfs");
                drawNode(sxfss.total, getFromNode("json", inst, "sjzcl"), getFromNode("json", inst, "sjzcl.sxfsn"),
                    "sxfss", sxfss.begin);
                deleteFromNode(inst, ".", "zjtj");
                deleteFromNode(inst, ".", "gdls");
                inst["sggSzj"] = workPlanInst["sggSzj"];
                inst["status"] = "original";
                inst["production_plan_id"] = workPlanInst.production_plan_id;
                inst["work_plan_id"] = workPlanInst._id.toString();
                ;
                inst["spools"] = {
                    "online": {
                        "present": [],
                        "history": []
                    },
                    "offline": {
                        "history": []
                    }
                };
                workPlanInst["status"] = "已下发";
                auditForm(workPlanInst, user);
                createGlld(workPlanInst,newFormInsts);
                newFormInsts.push(inst);
                saveFormInsts.push(workPlanInst);
            }
        }
    }
    ;

function getFormsMap(docs) {
    var formsMap = {}, i;
    for (i = 0; i < docs.length; i++) {
        if (docs[i].alias !== "") formsMap[docs[i].alias] = docs[i];
    }
    return formsMap;
}

function createNewInsts(db, insts, cb) {
    if (insts.length > 0) {
        db.collection("form_insts").insertMany(insts, function (err, result) {
            if (err) return cb(error(500, err));

            console.log("created inherited forms: " + result.insertedCount);
            cb();
        });
    } else {
        cb();
    }
}

function saveInsts(db, insts) {
    for (var i = 0; i < insts.length; i++) {
        db.collection("form_insts").save(insts[i], function (err, result) {
            if (err) return cb(error(500, err));
        });
    }
    console.log("save inherited forms: " + insts.length);
}

//判断未处理的股订单中的规格是否符合数据库中的规格
function allStrandStruct(db, StrandStruct) {
    var deferred = q.defer();
    //所有规格数组
    db.collection("internal_forms").find({
        "name": "dgjgb"
    }).toArray(function (err, docs) {
        if (err) {
            deferred.reject(err);
        }
        var allStructArray = docs.map(function (d) {
            return d.single_strand_struct;
        });
        StrandStruct = underScore.uniq(StrandStruct);
        var newArray = underScore.intersection(allStructArray, StrandStruct);
        //判断是否有不合法的股结构
        if (newArray.length < StrandStruct.length) {
            var content = {
                code: "80002",
                message: "规格不合理,请修改规格"
            }
            deferred.reject(content);
        }
        //var code = 200;
        deferred.resolve(docs);
    });
    return deferred.promise;
}

//股的分解订单insert
function createStrandOrder(strandData, db, user) {
    var deferred = q.defer();
    var specs = [];
    strandData.map(function (data) {
        data.children.map(function (d) {
            specs.push(d.spec);
        });
    });
    //console.log(specs);
    var ids = [];
    var headers = [];
    var orderSpecs = [];
    strandData.map(function (d) {
        d.children.map(function (dd) {
            ids.push(d._id);
            headers.push(d.header);
            orderSpecs.push(dd.spec);
        });
    });
    allStrandStruct(db, specs).then(function (docs) {
        //验证提交的股的规格成功之后......
        //进行审核的生产订单的信息更新


        updateProductOrderForOrderItem(ids, db, user, headers, orderSpecs).then(function (data) {
            //这里创建新的订单要在更新状态之后创建
            createDecomposeOrder(strandData, db, user, orderSpecs).then(function (data) {
                deferred.resolve(data);
            }).fail(function (err) {
                deferred.reject(err);
            });
        }).fail(function (err) {
            deferred.reject(err);
        });

    }).fail(function (err) {
        deferred.reject(err);
    });

    return deferred.promise;
}

//建立订单分解表
function createDecomposeOrder(strandData, db, user, orderSpecs) {
    var deferred = q.defer();

    for (var i = 0; i < strandData.length; i++) {
        for (var j = 0; j < strandData[i].children.length; j++) {

            var data = {
                name: "订单产品分解表",
                alias: "order_item",
                type: {
                    name: "order_plan",
                    value: "订单计划"
                },
                default: "false",
                display: "false",
                selected: "true",
                category: {
                    name: "form",
                    value: "表单"
                },
                order: Number(20),
                maxId: "",
                perms: [
                    "display",
                    "operate",
                    "approve"
                ],
                header: strandData[i].header,
                body: createStrandListStruct(orderSpecs[i]),
                valid: true,
                status: "未处理",
                data: getDataModel(strandData[i], orderSpecs[i], strandData[i].children[j]),
                cpbh: strandData[i].children[j].cpbh,
                ddh: strandData[i].children[j].ddh,
                lb: strandData[i].children[j].product_category,
                yt: strandData[i].children[j].purpose,
                gg: strandData[i].children[j].spec,
                zj: strandData[i].children[j].diameter,
                djmc: strandData[i].children[j].length,
                js: strandData[i].children[j].count,
                khdm: strandData[i].khdm,
                orderState: "股"
            }
            db.collection("form_insts").insert(data, function (err, result) {
                if (err) {
                    console.log(err);
                    deferred.reject(err);
                }
                deferred.resolve("create strand struct success");
            });
        }
    }
}

function updateProductOrderForOrderItem(ids, db, user, headers, orderSpecs) {
    var deferred = q.defer();

    for (var i = 0; i < ids.length; i++) {
        headers[i][4].value = user.name;
        headers[i][5].value = new Date().Format("yyyy-MM-dd");
        db.collection("form_insts").update({
            '_id': ids[i]
        }, {
            $set: {
                status: "已处理",
                header: headers[i]
            }
        }, function (err, result) {
            if (err) {
                deferred.reject(err);
            }
            deferred.resolve("db update success");
        });
    }


    return deferred.promise;
}

//成品丝的分解
function createCpsOrder(cps, db, user) {
    var deferred = q.defer();
    var ids = [];
    var headers = [];
    cps.map(function (obj) {
        ids.push(obj._id);
        headers.push(obj.header);
    });
    updateProductOrderForOrderItem(ids, db, user, headers).then(function (data) {
        createCpsOrderList(cps, db, user).then(function (data) {
            deferred.resolve(data);
        }).fail(function (err) {
            deferred.reject(err);
        });
    }).fail(function (err) {
        deferred.reject(err);
    });

    return deferred.promise;
}

//创建成品丝分解订单实例
function createCpsOrderList(cps, db, user) {
    var deferred = q.defer();
    for (var i = 0; i < cps.length; i++) {
        for (var j = 0; j < cps[i].children.length; j++) {
            var data = {
                name: "订单产品分解表",
                alias: "order_item",
                type: {
                    name: "order_plan",
                    value: "订单计划"
                },
                default: "false",
                display: "false",
                selected: "true",
                category: {
                    name: "form",
                    value: "表单"
                },
                order: Number(20),
                maxId: "",
                perms: [
                    "display",
                    "operate",
                    "approve"
                ],
                header: cps[i].header,
                body: strandModel.cpsStruct,
                valid: true,
                status: "未处理",
                data: strandModel.cpsDataFun(cps[i].children[j]),
                cpbh: cps[i].children[j].cpbh,
                ddh: cps[i].children[j].ddh,
                lb: cps[i].children[j].product_category,
                yt: cps[i].children[j].purpose,
                gg: cps[i].children[j].spec,
                zj: cps[i].children[j].diameter,
                djmc: cps[i].children[j].length,
                js: cps[i].children[j].count,
                khdm: cps[i].khdm,
                orderState: "成品丝"
            };
            db.collection("form_insts").insert(data, function (err, result) {
                if (err) {
                    console.log(err);
                    deferred.reject(err);
                }
                deferred.resolve("create cps struct success");
            });
        }
    }
    return deferred.promise;
}

//创建股订单的分解的结构
function createStrandListStruct(thisSpec){
    switch(thisSpec)
    {
        case "1*7":
            return strandModel.type1;
            break;
        case "1*19":
            return strandModel.type2;
            break;
        case "1*37":
            return strandModel.type3;
            break;
        case "1*9W":
            return strandModel.type4;
            break;
        case "1*19S":
            return strandModel.type5;
            break;
        case "1*25Fi":
            return strandModel.type6;
            break;
        case "1*26WS":
            return strandModel.type7;
            break;
        case "1*31WS":
            return strandModel.type8;
            break;
        case "1*29Fi":
            return strandModel.type9;
            break;
        case "1*36WS":
            return strandModel.type10;
            break;
        case "1*37S":
            return strandModel.type11;
            break;
        case "1*41WS":
            return strandModel.type12;
            break;
        case "1*49SWS":
            return strandModel.type13;
            break;
        case "1*55SWS":
            return strandModel.type14;
            break;
        case "1*61":
            return strandModel.type15;
            break;
        case "1*19W":
            return strandModel.type16;
            break;
        case "1*12":
            return strandModel.type17;
            break;
        case "1*24":
            return strandModel.type18;
            break;
        case "1*24S":
            return strandModel.type19;
            break;
        case "1*24W":
            return strandModel.type20;
            break;
        case "1*15":
            return strandModel.type21;
            break;
        case "1*37WS":
            return strandModel.type22;
            break;
    }
}

function getDataModel(thisData, thisSpec, children) {

    var resultData = strandModel.strandDataFun(thisData, thisSpec, children);
    // console.log("=====================");
    // console.log(resultData);
    // console.log("=====================");    
    return resultData;
}

// function searchThatSpecData(thisSpec, db, cb){
//     db.collection("internal_forms").find({
//         single_strand_struct:thisSpec
//     }).toArray(function(err,result){
//         if(err){
//             console.log(err);
//             return;
//         }
//         return result;
//     });
// }

module.exports = {

    /**
     * 根据提交的订单, 创建订单分解表实例
     *
     * @param orderInsts the form instance
     * @param db database connection
     * @param cb done callback, first parameter will be err if any
     */
    createOrderItems: function (orderInsts, db, user, cb) {
        loadSpecInternalForms(db, function (err, internalForms) {
            if (err) return cb(err);
            // find all inheriting forms
            db.collection("forms").find({"alias": "order_item"}).toArray(function (err, docs) {
                if (err) return cb(error(500, err));

                console.log("found " + docs.length + " forms.");
                var formsMap = getFormsMap(docs);
                // fs.writeFile("testtt.json",JSON.stringify(formsMap),function(err){
                //     if(err){
                //         console.log(err);
                //         return;
                //     }
                //     console.log("writeFile success");
                // });
                var newFormInsts = [];
                try {
                    formProcesses.createOrderItemsForm(orderInsts, formsMap, internalForms, newFormInsts, user);
                } catch (e) {
                    console.error(e, e.stack);
                    return cb(error(500, e));
                }

                createNewInsts(db, newFormInsts, cb);
            });
        });
    },

    // 更新订单分解/计划表后，传承到其他表单实例
    updateOrderItem: function (orderItemInsts, orders, db, user, cb) {
        // 找到表单模版
        db.collection("forms").find({
            "category.name": "form",
            "display": false,
            "valid": true
        }).toArray(function (err, docs) {
            if (err) return cb(err);

            var newFormInsts = [];
            var formsMap = getFormsMap(docs);
            try {
                // 订单计划表和生产计划表的逻辑分开写，会有重复代码，但是便于维护，今后再优化
                orderItemInsts.forEach(function (oi) {
                    // 创建订单计划（不合并）
                    formProcesses.createOrderPlan(user, oi, orders, formsMap, newFormInsts);
                    // 创建生产计划（不合并）
                    formProcesses.createProductionPlan(user, oi, orders, formsMap, newFormInsts);
                });
            } catch (e) {
                console.error(e);
                return cb(error(500, e));
            }
            createNewInsts(db, newFormInsts, cb);
        });
    },
    updateProductionPlan: function (productionPlanInsts, db, user, cb) {
        // 找到表单模版
        db.collection("forms").find({
            "category.name": "form",
            "display": false,
            "valid": true
        }).toArray(function (err, docs) {
            if (err) return cb(err);
            var newFormInsts = [];
            var saveFormInsts = [];
            var formsMap = getFormsMap(docs);
            db.collection("form_insts").find({
                "alias": productionPlanInsts[0].alias,
                "status": "已下发"
            }).toArray(function (err, docs) {
                var index = docs.length;
                try {
                    productionPlanInsts.forEach(function (oi) {
                        index++;
                        formProcesses.createWorkPlan(user, oi, formsMap, index, newFormInsts, saveFormInsts);
                    });
                } catch (e) {
                    console.log(e);
                    return cb(error(500, e));
                }
                saveInsts(db, saveFormInsts);
                createNewInsts(db, newFormInsts, cb);
            });
        });
    },
    updateWorkPlan: function (workPlanInsts, db, user, cb) {
        // 找到表单模版
        db.collection("forms").find({
            "category.name": "form",
            "display": false,
            "valid": true
        }).toArray(function (err, docs) {
            if (err) return cb(err);
            var newFormInsts = [];
            var saveFormInsts = [];
            var formsMap = getFormsMap(docs);
            try {
                workPlanInsts.forEach(function (oi) {
                    formProcesses.createWorkOrder(user, oi, formsMap, newFormInsts, saveFormInsts);
                });
            } catch (e) {
                return cb(error(500, e));
            }
            saveInsts(db, saveFormInsts);
            createNewInsts(db, newFormInsts, cb);
        });
    },

    // 更新合绳次数
    updateHSCS: orderItemEngine.updateHSCS,

    // 更新收线方式数
    updateSXFSS: orderItemEngine.updateSXFSS,

    // 更新拉拔次数数据
    updateLBCS: orderItemEngine.updateLBCS,

    createStrandOrder: createStrandOrder,

    createCpsOrder: createCpsOrder,
    /**
     * 更新那些需要计算的字段; 如股收线段长
     *
     * @param orderItem
     * @returns {boolean} 是否更新了
     */
    calcOrderItem: function (orderItem) {
        // 合绳工段
        // 主股
        var cs = +tree.get(orderItem, 'hsgdcpfj.cs').value;     // 合绳工段主股层数
        var djmc = +tree.get(orderItem, 'zzcp.djmc').value;     // 单件米长
        var csPrefix, ggsPrefix;
        for (var i = 1; i <= cs; i++) {
            csPrefix = 'hsgdcpfj.zg.dc' + i + '.';
            var ggs = +tree.get(orderItem, csPrefix + 'gggs').value;  // 每层规格数
            for (var j = 1; j <= ggs; j++) {
                ggsPrefix = csPrefix + 'ygl' + j + '.';
                // 股收线段长=绳单件米长×股工艺米长系数
                var gsxdc = getNumberValue(orderItem, ggsPrefix + 'gymcxs') * djmc;
                tree.set(orderItem, ggsPrefix + 'gsxdc', gsxdc);
                var gsxds = getNumberValue(orderItem, ggsPrefix + 'gsxds');
                // 单件收线米长=股每段收线米长×段数
                tree.set(orderItem, ggsPrefix + 'djsxmc', gsxds * gsxdc);
                // 股总米长: 股收线米长×股收线段数×股收线件数
                tree.set(orderItem, ggsPrefix + 'gzmc', getNumberValue(orderItem, ggsPrefix + 'gsxjs') * gsxdc * gsxds);
            }
        }
        // 纤维芯
        var xwxPrefix = 'hsgdcpfj.xwx.';
        var js = +tree.get(orderItem, 'zzcp.js').value;     // 件数
        var gymcxs = +tree.get(orderItem, xwxPrefix + 'gymcxs').value;     // 纤维芯工艺米长系数
        tree.set(orderItem, xwxPrefix + 'zmc', djmc * js * gymcxs);     // 总米长 = 单件米长 * 件数 * 纤维芯工艺米长系数
        var ckzzl = +tree.get(orderItem, 'zzcp.ckzzl').value;        // 参考总重量
        var dh = getNumberValue(orderItem, xwxPrefix + 'dh') / 100;       // 吨耗 %
        tree.set(orderItem, xwxPrefix + 'zl', (ckzzl * dh).toFixed(2));      // 重量 kg
        // 油脂
        var yzPrefix = 'hsgdcpfj.yz.';
        dh = getNumberValue(orderItem, yzPrefix + 'dh') / 100;
        tree.set(orderItem, yzPrefix + 'zl', (ckzzl * dh).toFixed(2));      // 重量 kg

        // 捻股工段
        cs = +tree.get(orderItem, 'nggdcpfj.zgyl.cs').value;      // 主股用料层数
        var csPrefix, ggsPrefix;
        for (var i = 1; i <= cs; i++) {
            csPrefix = 'nggdcpfj.zgyl.dc' + i + '.';
            var ggs = +tree.get(orderItem, csPrefix + 'sggs').value;  // 丝规格数
            // TODO: 暂时用第一层的股收线段长
            var ssxdc = getNumberValue(orderItem, ggsPrefix + 'gymcxs') * getNumberValue(orderItem, 'hsgdcpfj.zg.dc1.ygl1.gsxdc');
            for (var j = 1; j <= ggs; j++) {
                ggsPrefix = csPrefix + 'ysl' + j + '.';     // 用丝量
                // 丝收线段长=丝单件米长×丝工艺米长系数
                tree.set(orderItem, ggsPrefix + 'ssxdc', ssxdc);
                var ssxds = getNumberValue(orderItem, ggsPrefix + 'ssxds');
                // 单件收线米长=丝每段收线米长×段数
                tree.set(orderItem, ggsPrefix + 'djsxmc', ssxds * ssxdc);
                // 丝总米长: 丝收线米长×丝收线段数×丝收线件数
                var szmc = getNumberValue(orderItem, ggsPrefix + 'ssxjs') * ssxdc * ssxds;
                tree.set(orderItem, ggsPrefix + 'szmc', szmc);
                // 丝重量=丝直径×丝直径×0.617×丝总米长/100
                var zj = getNumberValue(orderItem, csPrefix + 'ysgg' + j + '.zj');
                tree.set(orderItem, ggsPrefix + 'zl', (zj * zj * 0.617 * szmc / 100).toFixed(2));
            }
        }

        return true;
    }
};