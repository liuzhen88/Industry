var error = require('../util/error');
var ObjectID = require('mongodb').ObjectID;
var enums = require('../util/enums');
var ihEngine = require('./inheritanceEngine');
var moment = require('moment');
var _ = require("lodash");
var tree = require("../util/tree");
var underScore = require("underscore");
var fs = require("fs");
var commonStrand = require('./commonStrand');

// 计算参考重量
//1、计算麻芯绳绳重（即规格为+FC的）=绳直径的平方 * 0.38 * 绳长/100 * 件数
//2、计算金属芯绳绳重（即规格为+IWR的）=绳直径的平方 * 0.418 * 绳长/100 * 件数
//
//公式中，绳直径的单位是毫米，绳长的单位是米，绳重的单位是千克
function calcEstWeight(body) {
    var match = body.spec.match(/\+(FC|IWR|IWS)/i);
    if (match !== null) {
        if (match[1] === 'FC') {
            body.est_weight = Math.round(+body.diameter * +body.diameter * 0.38 * +body.length * +body.count) / 100;
        } else {
            body.est_weight = Math.round(+body.diameter * +body.diameter * 0.418 * +body.length * +body.count) / 100;
        }
    }
}
function clone(obj){  
    var o;  
    switch(typeof obj){  
    case 'undefined': break;  
    case 'string'   : o = obj + '';break;  
    case 'number'   : o = obj - 0;break;  
    case 'boolean'  : o = obj;break;  
    case 'object'   :  
        if(obj === null){  
            o = null;  
        }else{  
            if(obj instanceof Array){  
                o = [];  
                for(var i = 0, len = obj.length; i < len; i++){  
                    o.push(clone(obj[i]));  
                }  
            }else{  
                o = {};  
                for(var k in obj){  
                    o[k] = clone(obj[k]);  
                }  
            }  
        }  
        break;  
    default:          
        o = obj;break;  
    }  
    return o;     
}  
module.exports = {
    listPrdOrd: function (req, res, next) {
        var draw = Number(req.query.draw);
        var start = Number(req.query.start);
        var size = Number(req.query.length);
        var search = req.query.search.value;
        if (search.indexOf("+") >= 0) {
            search = search.replace("+", "\\+");
        }
        var regFilter = [
            {"ddh": {$regex: search}},
            {"dhdw": {$regex: search}},
            {"ddlx": {$regex: search}},
            {"khdm": {$regex: search}},
            {"xjdrq": {$regex: search}},
            {"status": {$regex: search}},
            {"bz": {$regex: search}}
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
        req.db.collection("form_insts").find({name: "生产订单"}).toArray(function (err, docs) {
            if (err) return next(error(500, err));
            var total = docs.length;
            req.db.collection("form_insts").find({
                name: "生产订单",
                $or: regFilter
            }).skip(start).limit(size).sort(orderFilter).toArray(function (err, docs) {
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
    createPrdOrd: function (req, res, next) {
        var form = req.body;
        req.db.collection("forms").findOne({name: "生产订单"}, function (err, tmpl) {
            if (err) return next(error(500, err));
            var data = _.cloneDeep(tmpl);
            data._id = new ObjectID();
            data.tmpl_id = tmpl._id;
            data.status = enums.StatusEnum.NOT_PROCESSED;
            for (var i in data.header) {
                if (data.header[i].name == "form_no") {
                    data.header[i].value = form.form_no;
                }
                if (data.header[i].name == "author") {
                    data.header[i].value = form.author;
                }
                if (data.header[i].name == "created") {
                    data.header[i].value = form.created;
                }
            }
            tree.set(data, 'ddh', form.ddh);
            data["ddh"] = form.ddh + "";
            tree.set(data, 'ddlx', form.ddlx);
            data["ddlx"] = form.ddlx + "";
            tree.set(data, 'dhdw', form.dhdw);
            data["dhdw"] = form.dhdw + "";
            tree.set(data, 'khdm', form.khdm);
            data["khdm"] = form.khdm + "";
            tree.set(data, 'xjdrq', form.xjdrq);
            data["xjdrq"] = form.xjdrq + "";
            tree.set(data, 'bz', form.bz);
            data["bz"] = form.bz + "";
            req.db.collection("form_insts").insertOne(data, function (err, data) {
                if (err) return next(error(500, err));
                res.status(200).json({"result": "success"});
            })
        })
    }
    ,
    updatePrdOrd: function (req, res, next) {
        var form = req.body;
        req.db.collection("form_insts").findOne({"_id": new ObjectID(form.id)}, function (err, tmpl) {
            if (err) return next(error(500, err));
            var data = _.cloneDeep(tmpl);
            data._id = new ObjectID();
            for (var i in data.header) {
                if (data.header[i].name == "form_no") {
                    data.header[i].value = form.form_no;
                }
                if (data.header[i].name == "author") {
                    data.header[i].value = form.author;
                }
                if (data.header[i].name == "created") {
                    data.header[i].value = form.created;
                }
            }
            tree.set(data, 'ddh', form.ddh);
            data["ddh"] = form.ddh + "";
            tree.set(data, 'ddlx', form.ddlx);
            data["ddlx"] = form.ddlx + "";
            tree.set(data, 'dhdw', form.dhdw);
            data["dhdw"] = form.dhdw + "";
            tree.set(data, 'khdm', form.khdm);
            data["khdm"] = form.khdm + "";
            tree.set(data, 'xjdrq', form.xjdrq);
            data["xjdrq"] = form.xjdrq + "";
            tree.set(data, 'bz', form.bz);
            data["bz"] = form.bz + "";
            req.db.collection("form_insts").updateOne({"_id": new ObjectID(form.id)}, {$set: {header: data.header}}, function (err, result) {
                if (err) return next(error(500, err));
                req.db.collection("form_insts").updateOne({"_id": new ObjectID(form.id)}, {$set: {body: data.body}}, function (err, result) {
                    if (err) return next(error(500, err));
                    res.status(200).end();
                });
            });
        })

    },
    deletePrdOrd: function (req, res, next) {
        var formId = req.body.id;
        req.db.collection("form_insts").deleteOne({"_id": new ObjectID(formId)}, function (err, result) {
            if (err) {
                return next(error(500, err));
            }
            res.status(200).end();
        });
    },
    getPrdOrd: function (req, res, next) {
        req.db.collection("form_insts").findOne({"_id": new ObjectID(req.body.id)}, function (err, data) {
            if (err) return next(error(500, err));
            var _data = {
                id: data._id,
                ddh: tree.get(data, 'ddh').value,
                ddlx: tree.get(data, 'ddlx').value,
                dhdw: tree.get(data, 'dhdw').value,
                khdm: tree.get(data, 'khdm').value,
                xjdrq: tree.get(data, 'xjdrq').value,
                bz: tree.get(data, 'bz').value
            };
            for (var i in data.header) {
                var value = data.header[i].value;
                if (data.header[i].name == "form_no") {
                    _data.form_no = value;
                }
                if (data.header[i].name == "author") {
                    _data.author = value;
                }
                if (data.header[i].name == "created") {
                    _data.created = value;
                }
                if (data.header[i].name == "auditor") {
                    _data.auditor = value;
                }
                if (data.header[i].name == "audit_date") {
                    _data.audit_date = value;
                }
            }
            _data.status = data.status;
            res.status(200).json(_data);
        });
    },

    listPrdOrdDetail: function (req, res, next) {
        var id = req.query.id;
        var draw = Number(req.query.draw);
        var start = Number(req.query.start);
        var size = Number(req.query.length);
        var search = req.query.search.value;
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
        req.db.collection("form_insts").findOne({
            "_id": new ObjectID(id)
        }, function (err, form) {
            if (err) return next(error(500, err));
            var data = [];
            var total = 0;
            if (form.children && form.children.length > 0) {
                var details = form.children;
                // 排序
                for (var i in orderFilter) {
                    details.sort(function (o, n) {
                        for (var obj in orderFilter[i]) {
                            if (orderFilter[i][obj] == 1) {
                                return o[obj] > n[obj];
                            } else {
                                return o[obj] < n[obj];
                            }
                        }
                    })
                }
                // 高级查询
                if (search != "") {
                    for (var i = 0; i < details.length; i++) {
                        var det = details[i];
                        var exist = false;
                        for (var o in det) {
                            if ((det[o] + "").indexOf(search) >= 0) {
                                exist = true;
                                break;
                            }
                            else {
                                continue
                            }
                        }
                        if (!exist) {
                            details.splice(i, 1);
                        }

                    }
                }
                // 分页
                total = details.length;
                details = details.slice(start, start + size);
                data = details;
            }
            res.status(200).json(
                {
                    data: data,
                    recordsTotal: total,
                    recordsFiltered: total,
                    draw: draw
                }
            );
        });
    },
    createPrdOrdDetail: function (req, res, next) {
        var form = req.body;
        //一共只有5种ws互换情况
        switch (form.spec)
        {
            case "1*26SW":
                form.spec = "1*26WS";
                break;
            case "1*31SW":
                form.spec = "1*31WS";
                break;
            case "1*36SW":
                form.spec = "1*36WS";
                break;
            case "1*41SW":
                form.spec = "1*41WS";
                break;
            case "1*37SW":
                form.spec = "1*37WS";
                break;
        };
        var ddh = req.body.ddh;
        calcEstWeight(req.body);
        req.db.collection("form_insts").findOne({"_id": new ObjectID(req.query.id)}, function (err, dd) {
            if (err) return next(error(500, err));
            var maxIndex = 0;
            if (dd.children) {
                var lastCpbh = dd.children[dd.children.length - 1].cpbh;
                maxIndex = +(lastCpbh.substring(lastCpbh.lastIndexOf('-') + 1));
            }
            console.log('Generate CPBH [' + ddh + '],[' + maxIndex + ']');
            form.cpbh = ddh + "-" + (maxIndex + 1);

            req.db.collection("form_insts").findOneAndUpdate({"_id": new ObjectID(req.query.id)}, {$push: {children: form}}, function (err, data) {
                if (err) return next(error(500, err));
                res.status(200).json({"result": "success"});
            })
        })

    }
    ,
    updatePrdOrdDetail: function (req, res, next) {
        var formId = req.query.id;
        var index = req.body.index;
        calcEstWeight(req.body);
        var data = JSON.parse("{\"children." + index + "\":" + JSON.stringify(req.body) + "}");
        req.db.collection("form_insts").findOneAndUpdate({"_id": new ObjectID(formId)}, {$set: data}, function (err, result) {
            if (err) return next(error(500, err));
            res.status(200).json({"result": "success"});
        });
    },
    deletePrdOrdDetail: function (req, res, next) {
        var formId = req.body.id;
        var index = req.body.index;
        var unset = JSON.parse("{\"children." + index + "\":1}");

        req.db.collection("form_insts").updateOne({"_id": new ObjectID(formId)}, {$unset: unset}, function (err, result) {
            if (err) {
                return next(error(500, err));
            }
            req.db.collection("form_insts").updateOne({"_id": new ObjectID(formId)}, {$pull: {"children": null}}, function (err, result) {
                if (err) {
                    return next(error(500, err));
                }
                res.status(200).end();
            });
        });

    },
    submitPrdOrd: function (req, res, next) {
        req.db.collection("form_insts").find({
            "alias": "order",
            status: enums.StatusEnum.NOT_PROCESSED
        }).toArray(function (err, data) {
            //没有未处理的订单就不需要在调下面的接口了
            if(data.length>0){
                var single_strand_struct = [];//股
               
                var cps = [];//成品丝
                
                var arra;
                var gArr;
                for(var m=0;m<data.length;m++){
                    var guo = [];
                    var cpsNewArray = [];
                    arra = clone(data[m]);
                    gArr = clone(data[m]);
                    for(var j=0;j<data[m].children.length;j++){      
                        var struct = data[m].children[j].spec;
                       
                        if(struct==""||struct=='undefined'){
                           
                            var cpschildren = data[m].children[j];//childeren数组中的成品丝
                            cpsNewArray.push(cpschildren);//获取所有成品丝children
                            data[m].children[j]="";
                        }else{
                            struct = struct.split("*")[0];
                            if(Number(struct)==1){
                                var guoChildren = data[m].children[j];//children下的每个股
                                guo.push(guoChildren);//获取股所有的children值
                                data[m].children[j]=""; 
                            }                           
                        }
                    }
                    
                    arra.children = cpsNewArray;//成品丝的children
                    cps.push(arra);//成品丝的数据

                    gArr.children = guo;//股的children
                    single_strand_struct.push(gArr);//股的数据
                   
                    
                    data[m].children = underScore.compact(data[m].children);
                }
                
                data = underScore.compact(data);
                var arra_data = JSON.stringify(data);
                // fs.writeFile("test.json",arra_data,function(err){
                //     if(err){
                //         console.log(err);
                //         return;
                //     }
                //     console.log("writeFile success");
                // });
                var ggsChildrens = [],guoChildrens = [],cpschildrens = [];
                data.map(function(d){
                    if(d.children.length>0){
                       ggsChildrens.push(d.children); 
                    }
                    
                });
                single_strand_struct.map(function(d){
                    if(d.children.length>0){
                        guoChildrens.push(d.children);
                    }
                });
                cps.map(function(d){
                    if(d.children.length>0){
                        cpschildrens.push(d.children);
                    }
                });
                // console.log("钢丝绳是:"+ggsChildrens);
                // console.log("股是:"+guoChildrens);
                // console.log("成品丝是:"+cpschildrens);
                 if (err) return next(error(500, err));
                 if(ggsChildrens.length>0){

                    ihEngine.createOrderItems(data, req.db, req.session.user, function (err) {
                        if (err) return next(error(500, err));
                        var ids = data.map(function (d) {
                            return d._id;
                        });

                        // 更新审核和状态
                        req.db.collection("form_insts").updateMany(
                            {"_id": {$in: ids}, "header.name": 'auditor'},
                            {
                                $set: {
                                    status: enums.StatusEnum.PROCESSED,
                                    "header.$.value": req.session.user.name
                                }
                            }, function (err, result) {
                                if (err) return next(error(500, err));

                                req.db.collection("form_insts").updateMany(
                                    {"_id": {$in: ids}, "header.name": 'audit_date'},
                                    {$set: {"header.$.value": moment().format('YYYY-MM-DD')}}, function (err, result) {
                                        if (err) return next(error(500, err));

                                        res.status(200).end();
                                    });
                            });
                    }); 
                 }
                //股的操作
                if(guoChildrens.length>0){
                    // ihEngine.createStrandOrder(single_strand_struct,req.db,req.session.user).then(function(data){
                    //     res.send(data);
                        
                    // }).fail(function(err){
                    //     res.send(err);
                    // }); 
                    commonStrand.matchStruct(single_strand_struct,req.db,req.session.user).then(function(data){
                        res.send(data);
                    }).fail(function(err){
                        res.send(err);
                    });
                } 
                //成品丝
                if(cpschildrens.length>0){
                    ihEngine.createCpsOrder(cps,req.db,req.session.user).then(function(data){
                        res.send(data);
                    }).fail(function(err){
                        res.send(err);
                    });
                }
            }else{
                console.log("暂无未处理订单");
                var result = {
                    code:"80001",
                    message:"暂无未处理订单"
                }
                res.send(result);
            }
        });
    },

    getPrdOrdDetail: function (req, res, next) {
        req.db.collection("form_insts").findOne({"_id": new ObjectID(req.body.id)}, function (err, data) {
            if (err) return next(error(500, err));
            res.status(200).json({detail: data.children[req.body.index], status: data.status});
        });
    },
    revokePrdOrdDetail: function (req, res, next) {
        req.db.collection("form_insts").find({
            "type.name": "production_plan",
            $or: [
                {"cpbh": req.body.cpbh},
                {"mergeCpbhs": req.body.cpbh}
            ],
            "submit": "已下发"
        }).toArray(function (err, docs) {
            if (err) return next(error(500, err));
            if (docs.length > 0) {
                res.status(200).json({"result": "fail", "message": "该订单明细已经下发到作业计划，无法撤销"});
            }
            else {
                req.db.collection("form_insts").find({
                    "type.name": "production_plan",
                    "mergeCpbhs": req.body.cpbh
                }).toArray(function (err, docs) {
                    if (err) return next(error(500, err));
                    var ids = [];
                    var mergeIds = [];
                    if (docs.length > 0) {
                        for (var i = 0; i < docs.length; i++) {
                            ids.push(docs[i]._id);
                            for (var j = 0; j < docs[i].mergeIds.length; j++) {
                                mergeIds.push(new ObjectID(docs[i].mergeIds[j]));
                            }
                        }
                        req.db.collection("form_insts").deleteMany({
                            "_id": {$in: ids}
                        }, function (err, result) {
                            if (err) return next(error(500, err));
                            req.db.collection('form_insts').updateMany({'_id': {$in: mergeIds}}, {
                                $set: {
                                    isMerged: false
                                }
                            }, function (err, result) {
                                if (err) return next(error(500, err));
                                req.db.collection("form_insts").deleteMany({
                                    "cpbh": req.body.cpbh
                                }, function (err, result) {
                                    if (err) return next(error(500, err));
                                    req.db.collection("form_insts").findOne({
                                        "type.name": "order",
                                        "children": {
                                            $elemMatch: {
                                                "cpbh": req.body.cpbh
                                            }
                                        }
                                    }, function (err, doc) {
                                        if (err) return next(error(500, err));
                                        if (doc.children.length == 1) {
                                            req.db.collection("form_insts").deleteOne({"_id": doc._id}, function (err, result) {
                                                if (err) return next(error(500, err));
                                                res.status(200).json({
                                                    "result": "success",
                                                    "message": "撤销成功",
                                                    "type": "order"
                                                });
                                            });
                                        }
                                        else {
                                            for (var i = 0; i < doc.children.length; i++) {
                                                if (doc.children[i].cpbh == req.body.cpbh) {
                                                    doc.children.splice(i, 1);
                                                    break;
                                                }
                                            }
                                            req.db.collection("form_insts").save(doc, function (err, result) {
                                                if (err) return next(error(500, err));
                                                res.status(200).json({
                                                    "result": "success",
                                                    "message": "撤销成功",
                                                    "type": "detail"
                                                });
                                            })

                                        }
                                    })
                                })
                            });
                        })

                    }
                    else {
                        req.db.collection("form_insts").deleteMany({
                            "cpbh": req.body.cpbh
                        }, function (err, result) {
                            if (err) return next(error(500, err));
                            req.db.collection("form_insts").findOne({
                                "type.name": "order",
                                "children": {
                                    $elemMatch: {
                                        "cpbh": req.body.cpbh
                                    }
                                }
                            }, function (err, doc) {
                                if (err) return next(error(500, err));
                                if (doc.children.length == 1) {
                                    req.db.collection("form_insts").deleteOne({"_id": doc._id}, function (err, result) {
                                        if (err) return next(error(500, err));
                                        res.status(200).json({
                                            "result": "success",
                                            "message": "撤销成功",
                                            "type": "order"
                                        });
                                    });
                                }
                                else {
                                    for (var i = 0; i < doc.children.length; i++) {
                                        if (doc.children[i].cpbh == req.body.cpbh) {
                                            doc.children.splice(i, 1);
                                            break;
                                        }
                                    }
                                    req.db.collection("form_insts").save(doc, function (err, result) {
                                        if (err) return next(error(500, err));
                                        res.status(200).json({
                                            "result": "success",
                                            "message": "撤销成功",
                                            "type": "detail"
                                        });
                                    })

                                }
                            })
                        })
                    }
                })
            }
        });
    }
};