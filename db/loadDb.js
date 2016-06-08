var config = require(process.env['HOME'] + '/conf/inkanban-config.js');
var MongoClient = require('mongodb').MongoClient;
var async = require("async");

var db;
var metaForms;

// Use connect method to connect to the Server
MongoClient.connect(config.dbUrl, function (err, conn) {
    if (err) throw new Error("Cannot connect to database: " + config.dbUrl + ", " + err.message);
    console.log("Connected to database: " + config.dbUrl);

    db = conn;

    loadMetaLibrary();
});


// refresh meta library data
function loadMetaLibrary() {

    // drop database first
    db = db.db("meta_library");
    db.dropDatabase();

    var metaLib = require("./meta_library");
    db.collection("forms").insert(metaLib.forms, function (err, result) {
        if (err) throw new Error("Cannot insert forms in meta library: " + err);

        console.log("Added individual forms: ", result.insertedCount);

        var bomForms = [], factoryPlanForms = [], taskForms = [], workPlanForms = [], workOrderForms = [], materialReceiveForms=[],virtualLibraryForms=[] ;
        result.ops.forEach(function (d) {
            if (d.name === "坯料工段BOM表" || d.name === "热处理&镀锌工段BOM表" || d.name === "成品丝工段BOM表" || d.name === "捻股工段BOM表"
                || d.name === "合绳工段BOM表") {
                bomForms.push({"_id": d._id, "name": d.name});
            } else if (d.name === "坯料工段生产计划" || d.name === "热处理&镀锌工段生产计划" || d.name === "成品丝工段生产计划"
                || d.name === "捻股工段生产计划" || d.name === "合绳工段生产计划") {
                factoryPlanForms.push({"_id": d._id, "name": d.name});
            } else if (d.name === "坯料工段酸洗工序生产任务单" || d.name === "坯料工段粗拉工序生产任务单" || d.name === "热处理&镀锌工段生产任务单"
                || d.name === "成品丝工段生产任务单" || d.name === "捻股生产任务单" || d.name === "合绳生产任务单") {
                taskForms.push({"_id": d._id, "name": d.name});
            } else if (d.name === "坯料工段粗拉工序日作业计划" || d.name === "热处理&镀锌工段日作业计划" || d.name === "成品丝工段日作业计划"
                || d.name === "捻股工段日作业计划" || d.name === "合绳日作业计划" ) {
                workPlanForms.push({"_id": d._id, "name": d.name});
            } else if (d.name === "酸洗工单" || d.name === "坯料拉拔工单" || d.name === "热处理工单" || d.name === "镀锌坯料工单"
                || d.name === "镀锌钢丝工单" || d.name === "成品丝拉拔工单" || d.name === "捻股工单" || d.name === "合绳工单") {
                workOrderForms.push({"_id": d._id, "name": d.name});
            }
            else if(d.name ==="坯料工段粗拉工序领料计划单" || d.name==="热处理工序领料计划单" || d.name==="坯料、成品丝镀锌工序领料计划单"
                || d.name==="成品丝工段领料计划单" || d.name==="捻股工段领料计划单" || d.name==="合绳工段领料计划单"){
                materialReceiveForms.push({"_id": d._id, "name": d.name});
            }
            else if(d.name ==="绳库" || d.name==="股库" ){
                virtualLibraryForms.push({"_id": d._id, "name": d.name});
            }
        });

        async.series([
            function (cb) {
                db.collection("forms").insert({
                    "name": "工段BOM表",
                    "alias": "",
                    "type": {
                        "name": "bom",
                        "value": "BOM表"
                    },
                    "default": false,
                    "display": false,
                    "selected": false,
                    "category": {
                        "name": "form",
                        "value": "表单"
                    }, "order": 40, "children": bomForms,
                    "perms": ["display", "operate", "approve"]
                }, function (err, result) {
                    if (err) cb(new Error("Cannot add taskForms:" + err));

                    cb(null, result.insertedCount);
                });
            },
            function (cb) {
                db.collection("forms").insert({
                    "name": "生产计划表",
                    "alias": "",
                    "type": {
                        "name": "production_plan",
                        "value": "生产计划"
                    },
                    "default": false,
                    "display": false,
                    "selected": false,
                    "category": {
                        "name": "form",
                        "value": "表单"
                    }, "order": 50, "children": factoryPlanForms,
                    "perms": ["display", "operate", "approve"]
                }, function (err, result) {
                    if (err) cb(new Error("Cannot add taskForms:" + err));

                    cb(null, result.insertedCount);
                });
            },
            function (cb) {
                db.collection("forms").insert({
                    "name": "生产任务单",
                    "alias": "",
                    "type": {
                        "name": "production_plan",
                        "value": "生产计划"
                    },
                    "default": false,
                    "display": false,
                    "selected": false,
                    "category": {
                        "name": "form",
                        "value": "表单"
                    }, "order": 60, "children": taskForms,
                    "perms": ["display", "operate", "approve"]
                }, function (err, result) {
                    if (err) cb(new Error("Cannot add taskForms:" + err));

                    cb(null, result.insertedCount);
                });
            },
            function (cb) {
                db.collection("forms").insert({
                    "name": "作业计划",
                    "alias":"",
                    "type": {
                        "name": "work_plan",
                        "value": "作业计划"
                    },
                    "default": false,
                    "display": false,
                    "selected": false,
                    "category": {
                        "name": "form",
                        "value": "表单"
                    }, "order": 70, "children": workPlanForms,
                    "perms": ["display", "operate", "approve"]
                }, function (err, result) {
                    if (err) cb(new Error("Cannot add workPlanForms:" + err));

                    cb(null, result.insertedCount);
                });
            },
            function (cb) {
                db.collection("forms").insert({
                    "name": "工单",
                    "alias":"",
                    "type": {
                        "name": "work_order",
                        "value": "工单"
                    },
                    "default": false,
                    "display": false,
                    "selected": false,
                    "category": {
                        "name": "form",
                        "value": "表单"
                    }, "order": 90, "children": workOrderForms,
                    "perms": ["display", "operate", "approve", "assign", "confirm"]
                }, function (err, result) {
                    if (err) cb(new Error("Cannot add workOrderForms:" + err));

                    cb(null, result.insertedCount);
                });
            },
            function (cb) {
                db.collection("forms").insert({
                    "name": "物料领用",
                    "alias":"",
                    "type": {
                        "name": "material_receive",
                        "value": "物料领用"
                    },
                    "default": false,
                    "display": false,
                    "selected": false,
                    "category": {
                        "name": "form",
                        "value": "表单"
                    }, "order": 110, "children": materialReceiveForms,
                    "perms": ["display", "operate", "approve"]
                }, function (err, result) {
                    if (err) cb(new Error("Cannot add workPlanForms:" + err));

                    cb(null, result.insertedCount);
                });
            },
            function (cb) {
                db.collection("forms").insert({
                    "name": "虚拟库存",
                    "alias":"",
                    "type": {
                        "name": "virtual_library",
                        "value": "虚拟库存"
                    },
                    "default": true,
                    "display": true,
                    "selected": true,
                    "category": {
                        "name": "form",
                        "value": "表单"
                    }, "order": 100, "children": virtualLibraryForms,
                    "perms": ["display", "operate"]
                }, function (err, result) {
                    if (err) cb(new Error("Cannot add virtualLibraryForms:" + err));
                    cb(null, result.insertedCount);
                });
            }
        ], function (err, results) {
            if (err) throw new Error("Add parent forms failed: " + err);

            db.collection("forms").find({}).toArray(function (err, docs) {
                if (err) throw new Error("find forms from meta library failed: " + err);

                metaForms = docs;

                console.log("Added parent forms: ", results);
                var tenants = ["sw"];

                async.eachSeries(tenants, function (tenant, cb) {
                    loadTenantDatabase(tenant, cb);
                }, function (err, result) {
                    if (err) throw new Error("Create tenant database failed: " + err);
                    cleanup();
                });
            });
        });
    });
}

// refresh each tenant's database
// for now, we only setup sw and fed tenant databases
function loadTenantDatabase(tenant, done) {

    db = db.db(tenant);
    db.collections(function (err, cols) {
        if (err) return cb(err);
        async.eachSeries(cols, function (col, cb) {
            if (col.s.name === 'form_insts' || col.s.name.match(/system/) !== null) {
                return cb();
            }
            col.drop(function (err, result) {
                cb(err);
            });
        }, function (err) {
            if (err) return done(err);

            // 删除除了order的form_inst
            db.collection('form_insts').remove({alias: {$ne: 'order'}}, function (err, result) {
                if (err) return done(err);
                console.log("deleted forms:", result.result);
                db.collection('form_insts').updateMany({alias: 'order'}, {$set: {status: "未处理"}}, function (err, result) {
                    if (err) return done(err);
                    load();
                });
            });
        });
    });

    function load() {
        var tenantData = require("./tenant.js");
        async.eachSeries(tenantData.init_data, function (td, cb) {
            db.collection(td.collection).insert(td.data, function (err, result) {
                if (err) return cb(err);
                console.log("created tenant data: ", result.insertedCount);
                cb();
            })
        }, function (err, result) {
            if (err) return done(err);

            // copy forms from meta library to tenant database
            db.collection("forms").insertMany(metaForms, function (err, result) {
                if (err) return done(err);

                db.collection("forms").updateMany({}, {$set: {valid: true}}, function (err, result) {
                    if (err) return done(err);
                    // load test data if any
                    loadTestData(tenant, done);
                });
            });
        });
    }
}

function loadTestData(tenant, done) {
    var testData = require("./test_data.js");
    db.collection('forms').find({alias: {$in: ['order_item', 'order_plan', 'hs_production_plan', 'hs_work_plan', 'gantt-chart']}}, {_id: 1, alias: 1}).toArray(function (err, docs) {
        if (err) return done(err);

        async.eachSeries(testData.data, function (d, cb) {
            if (d.collection === 'forms') {
                d.data.forEach(function (td) {
                    if (td.ref_form) {
                        docs.forEach(function (doc) {
                            if (doc.alias === td.ref_form.alias) {
                                td.ref_form._id = doc._id;
                            }
                        })
                    }
                });
            } else if (d.collection === 'users') {
                docs.forEach(function (doc) {
                    if (doc.alias === 'gantt-chart') {
                        d.data[0].perms.push(
                            {
                                "form_id" : doc._id,
                                "display" : true
                            }
                        );
                    }
                });
            }
            db.collection(d.collection).insertMany(d.data, function (err, r) {
                if (err) return cb(err);
                console.log("added test data", r.insertedCount);
                cb();
            });
        }, function (err, result) {
            if (err) return done(err);

            // 更新工单tmpl_id
            db.collection('forms').findOne({'alias': 'ng_work_order'}, function (err, doc) {
                if (err) return done(err);

                db.collection('form_insts').updateOne({'alias': 'ng_work_order'}, {$set: {'tmpl_id': doc._id}}, function (err, result) {
                    if (err) return done(err);

                    console.log("updated ng_workorder tmpl_id", result.modifiedCount);
                    addDynamicData(tenant, done);
                });
            });
        });
    });
}

function addDynamicData(tenant, done) {
    db.collection("enums").insert({
        name: "company_code",
        value: tenant.toUpperCase().substr(0, 2) + "GS"
    }, function (err, result) {
        if (err) return done(err);
        console.log("setup company code", result.insertedCount);
        done();
    });
}

function cleanup() {
    db.close(true, function (err) {
        if (err) throw new Error("Cannot close db.");
        console.log("closed database");
    });
}