var error = require('../util/error');
var ObjectID = require('mongodb').ObjectID;
var ihEngine = require('./inheritanceEngine');
var _ = require("lodash");
var tree = require("../util/tree");
var instance = require("../util/instance");

module.exports = {

    getBomStructure: function (req, res, next) {
        req.db.collection("forms").findOne({"_id": new ObjectID(req.body.id)}, function (err, data) {
            if (err) return next(error(500, err));
            res.status(200).json(data);
        });
    },

    //查询主料
    listZlBoms: function (req, res, next) {
        var zlName = req.body.zlName;
        var draw = Number(req.body.draw);
        var start = Number(req.body.start);
        var size = Number(req.body.length);
        //var search = req.body.search.value;
        //var reg = new RegExp(".*" + search + ".*");
        //TODO
        //var filter = {'$or': [{last_name: reg}, {first_name: reg}, {username: reg}]};

        var order = req.body.order;
        var orderFilter = [];
        var columns = req.body.columns;
        if (order && order instanceof Array) {
            for (var index in order) {
                var colIndex = order[index].column
                var orderName = columns[colIndex].data;
                if (!orderName) continue;
                var orderVal = order[index].dir == "asc" ? 1 : -1;
                orderFilter.push(JSON.parse("{\"" + orderName + "\":" + orderVal + "}"));
            }
        }
        req.db.collection("forms").findOne({"_id": new ObjectID(req.body.id)}, function (err, tmpl) {
            req.db.collection("form_insts").find({"tmpl_id": new ObjectID(tmpl.body[0]._id)}).toArray(function (err, insts) {
                if (err) return next(error(500, err));
                var data = instance.get(insts,tmpl.body[0]);
                var array=[];
                for(var i in data){
                    var zlNameData =
                        "{\"bgrq\" : \""+tree.get(data[i],"bgrq").value+"\""+
                        ",\"sfdz\" :\""+ tree.get(data[i],"sfdz").value+"\""+
                        ",\"dzcpbh\" :\"" + tree.get(data[i],"dzcpbh").value+"\""+
                        ",\"id\" :\"" + data[i]._id+"\"";
                    var zl = tree.get(data[i]  ,"zl").children;
                    for(var j in zl){
                        if(zl[j].name == zlName){
                            for(var x in zl[j].children){
                                var col = ",\""+zl[j].children[x].name+"\":\""+ zl[j].children[x].value+"\"";
                                zlNameData += col;
                            }
                        }
                    }
                    zlNameData+="}";
                    array.push(JSON.parse(zlNameData));
                }
                var total = 0 ;
                if(array && array.length>0){
                    //排序
                    for(var i in orderFilter){
                        array.sort(function (o, n) {
                            for(var obj in orderFilter[i]){
                                if(orderFilter[i][obj] == 1){
                                    return o[obj] > n[obj];
                                }else{
                                    return o[obj] < n[obj];
                                }
                            }
                        })
                    }
                    //分页
                    total = array.length;
                    array = array.slice(start,start+size);
                }
                res.status(200).json(
                    {
                        data: array,
                        recordsTotal: total,
                        recordsFiltered: total,
                        draw: draw
                    }
                );
            });

        });
    },

    //辅料查询
    listFlBoms: function (req, res, next) {
        var flName = req.body.flName;
        var draw = Number(req.body.draw);
        var start = Number(req.body.start);
        var size = Number(req.body.length);
        //var search = req.body.search.value;
        //var reg = new RegExp(".*" + search + ".*");
        //TODO
        //var filter = {'$or': [{last_name: reg}, {first_name: reg}, {username: reg}]};

        var order = req.body.order;
        var orderFilter = [];
        var columns = req.body.columns;
        if (order && order instanceof Array) {
            for (var index in order) {
                var colIndex = order[index].column
                var orderName = columns[colIndex].data;
                if (!orderName) continue;
                var orderVal = order[index].dir == "asc" ? 1 : -1;
                orderFilter.push(JSON.parse("{\"" + orderName + "\":" + orderVal + "}"));
            }
        }

        req.db.collection("forms").findOne({"_id": new ObjectID(req.body.id)}, function (err, tmpl) {
            req.db.collection("form_insts").find({"tmpl_id": new ObjectID(tmpl.body[0]._id)}).toArray(function (err, insts) {
                if (err) return next(error(500, err));
                var data = instance.get(insts,tmpl.body[0]);
                if (err) return next(error(500, err));
                var array=[];
                for(var i in data){
                    var flNameData =
                        "{\"bgrq\" : \""+tree.get(data[i],"bgrq").value+"\""+
                        ",\"id\" :\"" + data[i]._id+"\"";
                    var fl = tree.get(data[i],flName).children;
                    for(var x in fl){
                        var col = ",\""+fl[x].name+"\":\""+ fl[x].value+"\"";
                        flNameData += col;
                    }
                flNameData+="}";
                    array.push(JSON.parse(flNameData));
                }
                var total = 0 ;
                if(array && array.length>0){
                    //排序
                    for(var i in orderFilter){
                        array.sort(function (o, n) {
                            for(var obj in orderFilter[i]){
                                if(orderFilter[i][obj] == 1){
                                    return o[obj] > n[obj];
                                }else{
                                    return o[obj] < n[obj];
                                }
                            }
                        })
                    }
                    //分页
                    total = array.length;
                    array = array.slice(start,start+size);
                }
                res.status(200).json(
                    {
                        data: array,
                        recordsTotal: total,
                        recordsFiltered: total,
                        draw: draw
                    }
                );
            });
        });
    }
};