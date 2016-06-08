var moment = require('moment');
var _ = require("lodash");
var tree = require('../../util/tree');
var enums = require('../../util/enums');
var tools = require('../../util/tools');
var fs = require("fs");

var onlyHsNg = true;    // TODO: 目前我们只处理合绳捻股, 01/26/2016
var GG_REGEX = /^(\w+\*\w+)\+?([0-9]?FC|IWR|IWS)?$/i;     // 如6*19S+FC, 如果没有+XX, 默认为+IWS
var FC_REGEX = /[0-9]?FC/;


// node是对象, 不是数组
function assignId(node, nextId) {
    setId(node);
    return nextId;

    function setId(node) {
        node.id = "" + nextId++;
        if (node.children) {
            for (var i = 0; i < node.children.length; i++) {
                setId(node.children[i]);
            }
        }
    }
}

var cloneObj = function(obj){
    var str, newobj = Array.isArray(obj) ? [] : {};
    if(typeof obj !== 'object'){
        return;
    } else if(JSON){
        str = JSON.stringify(obj), //系列化对象
        newobj = JSON.parse(str); //还原
    } else {
        for(var i in obj){
            newobj[i] = typeof obj[i] === 'object' ? 
            cloneObj(obj[i]) : obj[i]; 
        }
    }
    return newobj;
};

// 合绳,捻股中间品
function getZjpValues(oi) {
    var values = [];
    var prefix = 'gg.';     // 规格
    values.push({name: prefix + 'qd', value: oi.strength});
    var props = ['jg', 'zj', 'nx', 'tyfs', 'nj'];
    props.forEach(function (p) {
        values.push({name: prefix + p, value: ''});
    });
    prefix = 'yl.sxfs1.';     // 收线方式
    props = ['gymcxs', 'dc', 'ds', 'djmc', 'js', 'zmc', 'gzlxh'];
    props.forEach(function (p) {
        values.push({name: prefix + p, value: ''});
    });
    return values;
}


/**
 * 创建订单分解表实例，每个订单序号生成一个实例
 *
 * @param orderInsts 订单实例
 * @param formsMap 所有表单模版
 * @param internalForms 内部表单
 * @param newFormInsts 用来保存所有新建的表单实例
 * @param user 用户
 */
function createOrderItemsForm(orderInsts, formsMap, internalForms, newFormInsts, user) {
    // 从第一层节点克隆一个模版
    function getTmpl(formInst, path, repeat) {
        var node = tree.get(formInst, path);
        node.text = node.text.replace('N', 1);
        node.repeat = repeat;
        return _.cloneDeep(node);
    }

    function cloneNg(ngTmpl, layer, nzcs, formInst) {
        var ngNode = _.cloneDeep(ngTmpl);
        ngNode.text = layer + '次捻股';
        ngNode.repeat = nzcs;
        ngNode.name = 'ng' + layer;
        ngNode.sxfss = 1;
        var yzNode = {
            "text": "油脂",
            "type": "folder",
            "name": "yz",
            "id": ""
        };
        ngNode.children.push(yzNode);
        formInst.maxId = assignId(ngNode, formInst.maxId + 1);     // 设置新节点所有的id
        return ngNode;
    }

    // 检验规格的格式
    function validateSpec(spec) {
        if (!spec) {
            console.error("没有规格");
            throw new Error("没有规格");
        }
        spec = spec.toUpperCase();

        var ggMatch = spec.match(GG_REGEX);
        if (ggMatch === null) {
            console.log("规格不合理:" + spec);
            throw new Error("规格不完整:[" + spec + "]. 完整的规格格式如: 6*19S+FC, 6*19+IWR");
        }
        return ggMatch;
    }

    // 从规格表查找主股和金属芯的规格
    function lookupSpec(spec, xgg, jsxSpec) {
        var zgParams = [], jsxParams = [];      // 主股参数表, 金属芯参数表
        internalForms.forEach(function (d) {
            if (d.name === 'gssjgb') {
                zgParams.push(d);
            } else if (d.name === 'jsxjgb') {
                jsxParams.push(d);
            }
        });

        //  匹配主股
        var zgParam = null, jsxParam = null;
        for (var i = 0, len = zgParams.length; i < len; i++) {
            if (zgParams[i].wire_rope_structure === spec) {
                zgParam = zgParams[i];
                break;
            }
        }
        //6*K31 db中没有，导致主股找不到报错
        if (zgParam === null) {
            console.log("找不到匹配的主股规格: " + spec);
            throw new Error("找不到匹配的主股规格: " + spec + ', 请重新核查规格.');
        }
        
        if (xgg === 'IWR' || xgg === 'IWS' || !xgg) {
            for (i = 0, len = jsxParams.length; i < len; i++) {
                if (jsxParams[i].metal_core_structure === jsxSpec) {
                    jsxParam = jsxParams[i];
                    break;
                }
            }
            if (jsxParam === null) {
                console.log("找不到匹配的金属芯规格: " + jsxSpec);
                throw new Error("找不到匹配的金属芯规格: " + jsxSpec + ', 请重新核查规格.');
            }
        }

        // TODO: 查找工艺表麻芯, 如果FC
        var hasCenter = true;
        if (!xgg && !jsxParam) hasCenter = false;   // 没有芯规格也没有找到金属芯规格匹配
        return {zg: zgParam, jsx: jsxParam, hasCenter: hasCenter};
    }

    // 最终产品传承数据
    function zzcpValues(oi, orderInst, formInst) {
        var id = tree.get(formInst, 'gss').id;    // 产品信息
        var values = [];
        values.push({name: 'ddh', value: tree.get(orderInst, 'ddh').value});    // 订单号
        values.push({name: 'cpbh', value: oi.cpbh});                 // 产品编号
        values.push({name: 'lb', value: oi.product_category});       // 产品类别
        values.push({name: 'yt', value: oi.purpose});                // 用途
        values.push({name: 'gg', value: oi.spec});                   // 规格
        values.push({name: 'zj', value: +oi.diameter});              // 直径
        values.push({name: 'djmc', value: +oi.length});              // 单件米长
        values.push({name: 'js', value: +oi.count});                 // 件数
        values.push({name: 'ckzzl', value: +oi.est_weight});         // (参考)总重量
        values.push({name: 'qd', value: oi.strength});              // 强度
        values.push({name: 'nx', value: oi.direction});              // 捻向
        values.push({name: 'tyfs', value: oi.oil_method});           // 涂油方式
        values.push({name: 'bzfs', value: oi.package_method});       // 包装方式
        values.push({name: 'tsyq', value: oi.special_need});         // 特殊要求
        values.push({name: 'nj', value: ''});                        // 捻距
        values.push({name: 'jjcd', value: oi.urgency});              // 紧急程度
        values.push({name: 'zmc', value: ''});                       // 总米长
        values.push({name: 'lpxh', value: ''});                      // 轮盘型号
        formInst.data[id] = values;
        formInst["ddh"] = tree.get(orderInst, 'ddh').value + "";
        formInst["lb"] = oi.product_category + "";
        formInst["yt"] = oi.purpose + "";
        formInst["gg"] = oi.spec + "";
        formInst["zj"] = oi.diameter + "";
        formInst["djmc"] = oi.length + "";
        formInst["js"] = oi.count + "";
        formInst["khdm"] = tree.get(orderInst, 'khdm').value + "";
    }

    function getGGGValues(ggs, oi, structure) {
        var values = [];
        var prefix = 'gg.';
        values.push({name: prefix + 'jg', value: structure});
        values.push({name: prefix + 'qd', value: oi.strength});
        values.push({name: prefix + 'tyfs', value: oi.oil_method});
        var props = ['zj', 'nx', 'nj'];
        props.forEach(function (p) {
            values.push({name: prefix + p, value: ''});
        });
        prefix = 'yl.';
        values.push({name: prefix + 'gs', value: ggs});     // 股个数
        values.push({name: prefix + 'gymcxs', value: ''}); // 工艺米长系数
        prefix += 'sxfs1.';
        props = ['dc', 'ds', 'djmc', 'js', 'zmc', 'gzlxh'];
        props.forEach(function (p) {
            values.push({name: prefix + p, value: ''});
        });
        return values;
    }

    // 创建,传承股数据. 股的明细记录: 用股规格和用股量
    function gggValues(id, data, ggs, oi, structure) {
        data[id] = getGGGValues(ggs, oi, structure);
    }

    // 创建,传承丝数据. 丝的明细记录: 用丝规格和用丝量
    function sggValues(id, data, sggs, oi) {
        var values = [];
        var prefix = 'gg.';
        values.push({name: prefix + 'lb', value: oi.product_category});     // 类别
        values.push({name: prefix + 'qd', value: oi.strength});            // 强度
        values.push({name: prefix + 'zj', value: ''});                      // 直径
        prefix = 'yl.';
        values.push({name: prefix + 'gs', value: sggs});       // 刚丝根数
        values.push({name: prefix + 'gymcxs', value: ''});     // 工艺米长
        prefix += 'sxfs1.';
        var props = ['dc', 'ds', 'djmc', 'js', 'zmc', 'zzl', 'gzlxh'];
        props.forEach(function (p) {
            values.push({name: prefix + p, value: ''});
        });
        data[id] = values;
    }

    // 创建纤维丝数据: 类别,捻向不能从订单明细传承
    function xwxValues(id, data) {
        var values = [];
        var prefix = 'gg.';
        var props = ['lb', 'nx', 'zj', 'hyl'];
        props.forEach(function (p) {
            values.push({name: prefix + p, value: ''});
        });
        prefix = 'yl.';
        props = ['gymcxs', 'zmc', 'dh', 'zl'];
        props.forEach(function (p) {
            values.push({name: prefix + p, value: ''});
        });
        data[id] = values;
    }

    // 创建盘条数据
    function ptValues(id, data) {
        var values = [];
        values.push({name: 'gg.gh', value: ''});    // 钢号
        values.push({name: 'gg.zj', value: ''});    // 直径
        values.push({name: 'yl.dh', value: ''});    // 吨耗
        values.push({name: 'yl.zl', value: ''});    // 重量
        data[id] = values;
    }

    // 创建油脂数据
    function yzValues(id, data, oi) {
        var values = [];
        values.push({name: 'gg.xh', value: ''});
        values.push({name: 'yl.tyfs', value: oi.oil_method});
        values.push({name: 'yl.dh', value: ''});
        values.push({name: 'yl.zl', value: ''});
        data[id] = values;
    }

    function filterCenters(node, delCenters) {
        for (var i = 0; i < node.length; i++) {
            if (delCenters.indexOf(node[i].name) !== -1) {
                node.splice(i, 1);
                i--;
            }
        }
    }

    function removeXWX(formInst, parentPath) {
        var gssChildren = tree.get(formInst, parentPath).children;
        gssChildren.forEach(function (child, idx) {
            if (child.name === 'xwx') {
                gssChildren.splice(idx, 1);
            }
        });
    }

    function jsxGuProcess(params, formInst, oi, isIWS) {
        var guPath = 'gss.jsx.' + params.path;
        var guNode = tree.get(formInst, guPath);
        if (isIWS) {    // 单股绳
            var jsxNode = tree.get(formInst, 'gss.jsx');
            jsxNode.children = guNode.children;
            tree.expire(formInst);
            guNode = jsxNode;
            guPath = 'gss.jsx';
        }
        guNode.sxfss = 1;
        guNode.nzcs = params.nzcs;
        gggValues(guNode.id, formInst.data, params.ggs, oi, params.structure);

        // 如果一次捻制, 显示丝第n层; 否则, 显示n次捻制
        if (params.nzcs === 1) {
            // ====== 丝第n层 =======
            var layers = params.structure.split('+').length - 1;     // 多少层
            var guSdcPath = guPath + '.sdc1';
            var guSdcTmpl = getTmpl(formInst, guSdcPath, layers);
            for (var j = 1; j <= layers; j++) {
                if (j > 1) {
                    var zxgSdc = newLayer(guSdcTmpl, j, formInst);
                    tree.get(formInst, guPath).children.push(zxgSdc);
                    tree.expire(formInst);
                    guSdcPath = guPath + '.sdc' + j;
                }

                sggBranch(params.pliesGs[j], params.pliesGgs[j], guSdcPath, formInst, oi);
            }

            // ====== 中心丝 =======
            addZxs(formInst, guPath, params.zxsGs, oi);
        } else {
            // n次捻股
            var ngTmpl = tree.get(formInst, guPath + '.sdc1');
            // 删除已有的丝第n层, 添加丝规格
            for (var m = 0; m < guNode.children.length; m++) {
                if (guNode.children[m].name === 'sdc1') {
                    guNode.children[m] = guNode.children[m].children[0];
                }
            }
            tree.expire(formInst);
            sggBranch(params.pliesGs[params.nzcs], params.pliesGgs[params.nzcs], guPath, formInst, oi);

            var prevNg, ngChainPath = '';
            for (var l = params.nzcs - 1; l > 0; l--) {
                var ngNode = cloneNg(ngTmpl, l, params.nzcs, formInst);
                ngChainPath += '.ng' + l;
                formInst.data[ngNode.id] = getZjpValues(oi);

                if (l > 1) {
                    prevNg = ngNode;
                    guNode.children.unshift(ngNode);
                } else {    // 第1次捻股包含中心丝
                    if (!prevNg) prevNg = guNode;
                    prevNg.children.unshift(ngNode);

                    var zxs = addZxs(formInst, guPath, params.zxsGs, oi);
                    // 中心丝移到1次捻股里面
                    ngNode.children.unshift(zxs);
                    // 删除原来的中心丝
                    removeNode(guNode, 'zxs');
                }
                tree.expire(formInst);

                // ====== 丝规格n =======
                sggBranch(params.pliesGs[l], params.pliesGgs[l], guPath + ngChainPath, formInst, oi);

                yzValues(tree.get(formInst, guPath + ngChainPath + '.yz').id, formInst.data, oi);
            }
        }

        // ====== 油脂 ======
        yzValues(tree.get(formInst, guPath + '.yz').id, formInst.data, oi);
    }

    // 添加中心丝
    function addZxs(formInst, gggPath, zxsgs, oi, xgg) {
        var zxsPath = gggPath + '.zxs';
        var zxs = tree.get(formInst, zxsPath);
        if (/[1-9]FC/.test(xgg)) {
            zxs = tree.get(formInst, gggPath + '.xwx');
            xwxValues(zxs.id, formInst.data);
        } else {
            zxs.sxfss = 1;
            sggValues(zxs.id, formInst.data, zxsgs, oi);

            if (!onlyHsNg) {
                // ====== 中心丝内坯料 =======
                tree.get(formInst, zxsPath + '.pl').lbcs = -1;         // 坯料类型: 0 - 盘条, 1 - 一次拉拔, 2 - 二次拉拔

                // ====== 中心丝内盘条 =======
                var pt = tree.get(formInst, zxsPath + '.pl.pt');
                pt.ggs = 1;         // 盘条规格数
                ptValues(pt.id, formInst.data);
            }
        }

        return zxs;
    }

    /**
     * 创建丝规格分支
     * @param sgs 钢丝根数
     * @param sggs 钢丝规格数
     * @param parentPath
     * @param formInst
     * @param oi order item
     */
    function sggBranch(sgs, sggs, parentPath, formInst, oi) {
        var sggPath = parentPath + '.s1';
        tree.get(formInst, sggPath).sxfss = 1;
        var sggTmpl = getTmpl(formInst, sggPath, sggs);
        var sgsArray = [];
        if (sggs > 1 && sgs.indexOf('/') !== -1) {
            sgsArray = sgs.split('/').map(function (d) {
                return +d;
            });
        } else {
            sgsArray.push(sgs);
        }
        for (var i = 1; i <= sggs; i++) {
            if (i > 1) {
                sggTmpl.sxfss = 1;
                var sgg = newLayer(sggTmpl, i, formInst);
                tree.get(formInst, parentPath).children.push(sgg);
                tree.expire(formInst);
                sggPath = parentPath + '.s' + i;
                sggValues(sgg.id, formInst.data, sgsArray[i - 1], oi);
            } else {
                sggValues(sggTmpl.id, formInst.data, sgsArray[i - 1], oi);
            }

            if (!onlyHsNg) {
                // ====== 坯料 =======
                tree.get(formInst, sggPath + '.pl').lbcs = -1;    // 坯料类型: 0 - 盘条, 1 - 一次拉拔, 2 - 二次拉拔

                // ====== 盘条 =======
                var pt = tree.get(formInst, sggPath + '.pl.pt');
                pt.ggs = 1;         // 盘条规格数
                ptValues(pt.id, formInst.data);
            }
        }
    }

    function removeNode(parent, name) {
        for (var i = 0; i < parent.children.length; i++) {
            if (parent.children[i].name === name) {
                parent.children.splice(i, 1);
                break;
            }
        }
    }

    // 根据名字删除树上分支
    function filterBranch(node, filter) {
        if (node instanceof Array) {
            for (var i = 0, len = node.length; i < len; i++) {
                filterBranch(node[i], filter);
            }
        } else if (node.children) {
            for (i = 0, len = node.children.length; i < len; i++) {
                if (node.children[i].name === filter) {
                    node.children.splice(i, 1);
                    break;
                } else {
                    filterBranch(node.children[i], filter);
                }
            }
            if (node.children.length === 0) {
                delete node.children;
            }
        }
    }

    function specialStruct(){
        var data = {
            jsxSpe1: {
                "text": "外股2",
                "type": "folder",
                "name": "jsgx",
                "id": "80",
                "children": [
                    {
                        "text":"第1层丝",
                        "type":"folder",
                        "name":"sdc1",
                        "repeat":"2",
                        "id":"84",
                        "children":[
                            {
                                "text": "丝1",
                                "type": "folder",
                                "name": "s1",
                                "repeat": "1",
                                "id": "81",
                                "sxfss": 1
                            }
                        ]
                    },
                    {
                        "text": "中心丝",
                        "type": "folder",
                        "name": "zxs",
                        "id": "82"
                    },
                    {
                        "text": "油脂",
                        "type": "folder",
                        "name": "yz",
                        "id": "83"
                    },
                    {
                        "text":"第二层丝",
                        "type":"folder",
                        "name":"sdc2",
                        "repeat":"2",
                        "id":"85",
                        "children":[
                             {
                                "text": "丝1",
                                "type": "folder",
                                "name": "s1",
                                "repeat": "1",
                                "id": "86",
                                "sxfss": 1
                            }
                        ]
                    }
                ],
                "sxfss": 1,
                "nzcs": "1"
            },
            jsxSpe2: {
                "text": "外股2",
                "type": "folder",
                "name": "jsgx",
                "id": "80",
                "children": [
                    {
                        "text":"第1层丝",
                        "type":"folder",
                        "name":"sdc1",
                        "repeat":"2",
                        "id":"84",
                        "children":[
                            {
                                "text": "丝1",
                                "type": "folder",
                                "name": "s1",
                                "repeat": "1",
                                "id": "81",
                                "sxfss": 1
                            }
                        ]
                    },
                    {
                        "text": "中心丝",
                        "type": "folder",
                        "name": "zxs",
                        "id": "82"
                    },
                    {
                        "text": "油脂",
                        "type": "folder",
                        "name": "yz",
                        "id": "83"
                    },
                    {
                        "text":"第二层丝",
                        "type":"folder",
                        "name":"sdc2",
                        "repeat":"2",
                        "id":"85",
                        "children":[
                             {
                                "text": "丝1",
                                "type": "folder",
                                "name": "s1",
                                "repeat": "1",
                                "id": "86",
                                "sxfss": 1
                            }
                        ]
                    },
                    {
                        "text":"第三层丝",
                        "type":"folder",
                        "name":"sdc3",
                        "repeat":"2",
                        "id":"87",
                        "children":[
                             {
                                "text": "丝1",
                                "type": "folder",
                                "name": "s1",
                                "repeat": "1",
                                "id": "88",
                                "sxfss": 1
                            }
                        ]
                    }
                ],
                "sxfss": 1,
                "nzcs": "1"
            }
        }
        return data;
    }

    // 克隆一个新层, layerNo > 1, 会删除repeat
    function newLayer(tmplNode, layerNo, formInst, ids) {
        var layer = _.cloneDeep(tmplNode);
        layer.name = layer.name.replace('1', layerNo);
        layer.text = layer.text.replace('1', layerNo);

        var nextId = formInst.maxId + 1;
        if (ids) ids.push(nextId);

        formInst.maxId = assignId(layer, nextId);     // 设置新节点所有的id
        return layer;
    }

    function process() {
        console.log("create order item");
        for (var y = 0; y < orderInsts.length; y++) {
            var orderInst = orderInsts[y];

            var orderItems = orderInst.children;
            for (var z = 0; z < orderItems.length; z++) {
                var formInst = tools.cloneInst(formsMap.order_item, enums.StatusEnum.NOT_PROCESSED);
                //the one special of jsx gg 
                if(orderItems[z].jsx_spec == "6*7F/6*19S+1*19S"){
                    formInst.isSpecial = "true";
                    formInst.plies = 2;
                }else if(orderItems[z].jsx_spec == "6*7F/6*26SW+1*25Fi" || orderItems[z].jsx_spec == "6*7F/6*26SW+1*25FI"){
                    formInst.isSpecial = "true";
                    formInst.plies = 3;
                }
                
                formInst.data = {};

                if (onlyHsNg) {     // 如果只支持合绳捻股, 删除坯料; 盘条在坯料下, 也会被删除
                    filterBranch(formInst.body, 'pl');
                }

                formInst.header.forEach(function (h) {
                    if (h.name === 'author') {
                        h.value = user.name;
                    } else if (h.name === 'created') {
                        h.value = moment().format('YYYY-MM-DD');
                    }
                });

                var oi = orderItems[z];
                var ggMatch = validateSpec(oi.spec);
                //console.log("ggMatch = " + ggMatch);
                var internalSpec = ggMatch[1], xgg = ggMatch[2];
                console.log("ggMatch[0] = " + ggMatch[0]);
                console.log("internalSpec = " + internalSpec);
                console.log("xgg = " + xgg);
                // 如果没有+XX, 默认为IWS
                if (ggMatch[2] === undefined) {     // no FC/IWS/IWR
                    //oi.spec += '+IWS';
                    xgg = 'IWS';
                     //没有没有+XX，但是是特殊钢丝绳的话默认为IWR
                    if(ggMatch[0].split("*")[0]=="6V"||ggMatch[0].split("*")[0]=="4V"||ggMatch[0].split("*")[0]=="15W"||ggMatch[0].split("*")[0]=="16W"){
                        oi.spec += '+IWR';
                        xgg = 'IWR';
                    }else{
                        oi.spec += '+IWS';
                    }
                }

                if (internalSpec.substr(-2) === 'SW') {  // SW is same as WS
                    internalSpec = internalSpec.substring(0, internalSpec.length - 2) + 'WS';
                }
                if (oi.jsx_spec) {
                    oi.jsx_spec = oi.jsx_spec.toUpperCase();
                }
                var specs = lookupSpec(internalSpec, xgg, oi.jsx_spec);  // 查询得到主股和金属芯参数

                var gssChildren = tree.get(formInst, 'gss').children;

                if (FC_REGEX.test(xgg)) {             // 纤维芯; 删除金属芯和半金属芯
                    filterCenters(gssChildren, ['jsx', 'bjsx']);
                } else if (xgg === 'IWR' || xgg === 'IWS' || specs.jsx) {     // 金属芯
                    filterCenters(gssChildren, ['xwx', 'bjsx']);
                } else if (!specs.hasCenter) {  // 没有芯
                    filterCenters(gssChildren, ['jsx', 'bjsx', 'xwx']);
                }

                // 规格表查出的属性
                var gProps = {};
                gProps.sfdz = oi.is_customized;     // 是否定制
                gProps.hscs = specs.zg.hscs;        // 合绳次数
                formInst.data.props = gProps;
                formInst.cpbh = oi.cpbh;

                // ====== 钢丝绳 =======
                // 最终产品传承数据
                zzcpValues(oi, orderInst, formInst);
                var gssPath = 'gss';
                var gssNode = tree.get(formInst, gssPath);
                gssNode.hscs = gProps.hscs;
                gssNode.gcs = [];

                var zxsgs = specs.zg['gs_center_wire'];             // 中心丝根数

                // ============ 主股 ============
                // ====== 主股第n层 =======
                // 从规格表获取主股的层数
                var zgPath = gssPath + '.gdc1';
                var zgTmpl = getTmpl(formInst, zgPath, specs.zg.gc_plies);
                for (i = 1; i <= specs.zg.gc_plies; i++) {
                    gssNode.gcs.push(i);
                    if (i > 1) {
                        var zg = newLayer(zgTmpl, i, formInst);
                        tree.get(formInst, gssPath).children.push(zg);
                        tree.expire(formInst);
                        zgPath = gssPath + '.gdc' + i;
                    }

                    var ggs = specs.zg['gc_plies_' + i];    // 每层的股个数, gc_plies_1, 2...
                    var gggs = specs.zg['ggg_plies_' + i];  // 每层的股规格数, ggg_plies_1, 2...

                    // ====== 股规格n =======
                    var gggPath = zgPath + '.g1';
                    var gggNode = tree.get(formInst, gggPath);
                    gggNode.sxfss = 1;      // 默认, 收线方式数1
                    gggNode.nzcs = specs.zg.nzcs;
                    var ggsArray = [];
                    if (gggs > 1 && ggs.indexOf('/') !== -1) {
                        ggsArray = ggs.split('/').map(function (d) {
                            return +d;
                        });
                    } else {
                        ggsArray.push(ggs);
                    }
                    var gggTmpl = getTmpl(formInst, gggPath, gggs);
                    for (var j = 1; j <= gggs; j++) {
                        if (j > 1) {
                            gggTmpl.sxfss = 1;
                            var ggg = newLayer(gggTmpl, j, formInst);
                            tree.get(formInst, zgPath).children.push(ggg);
                            tree.expire(formInst);
                            gggPath = zgPath + '.g' + j;
                            gggValues(ggg.id, formInst.data, ggsArray[j - 1], oi, specs.zg.gs_structure);
                        } else {
                            // 传承股规格和用量
                            gggValues(gggTmpl.id, formInst.data, ggsArray[j - 1], oi, specs.zg.gs_structure);
                        }

                        // 如果一次捻制, 显示丝第n层; 否则, 显示n次捻制
                        if (gggNode.nzcs === 1) {
                            // ====== 丝第n层 =======
                            var sdcPath = gggPath + '.sdc1';
                            var sdcTmpl = getTmpl(formInst, sdcPath, specs.zg.gs_plies);
                            for (var l = 1; l <= specs.zg.gs_plies; l++) {
                                if (l > 1) {
                                    var sdc = newLayer(sdcTmpl, l, formInst);
                                    tree.get(formInst, gggPath).children.unshift(sdc);
                                    tree.expire(formInst);
                                    sdcPath = gggPath + '.sdc' + l;
                                }

                                // ====== 丝规格n =======
                                sggBranch(specs.zg['gs_plies_' + l], specs.zg['gsi_plies_' + l], sdcPath, formInst, oi);
                            }

                            // ====== 中心丝 =======
                            addZxs(formInst, gggPath, zxsgs, oi, xgg);
                            if (/[1-9]FC/.test(xgg)) {
                                removeNode(gggNode, 'zxs');
                            } else {
                                removeXWX(formInst, gggPath);
                            }
                        } else {
                            // n次捻股
                            var ngTmpl = tree.get(formInst, gggPath + '.sdc1');
                            // 删除已有的丝第n层, 添加丝规格
                            for (var m = 0; m < gggNode.children.length; m++) {
                                if (gggNode.children[m].name === 'sdc1') {
                                    gggNode.children[m] = gggNode.children[m].children[0];
                                }
                            }
                            tree.expire(formInst);
                            sggBranch(specs.zg['gs_plies_' + gggNode.nzcs], specs.zg['gsi_plies_' + gggNode.nzcs], gggPath, formInst, oi);

                            var prevNg = null, ngChainPath = '';
                            for (l = gggNode.nzcs - 1; l > 0; l--) {
                                var ngNode = cloneNg(ngTmpl, l, gggNode.nzcs, formInst);
                                ngChainPath += '.ng' + l;
                                formInst.data[ngNode.id] = getZjpValues(oi);

                                if (!prevNg) prevNg = gggNode;
                                prevNg.children.unshift(ngNode);
                                if (l > 1) {
                                    prevNg = ngNode;
                                } else {    // 第1次捻股包含中心丝
                                    var zxs = addZxs(formInst, gggPath, zxsgs, oi, xgg);
                                    // 中心丝移到1次捻股里面
                                    ngNode.children.unshift(zxs);
                                    // 删除原来的中心丝
                                    removeNode(gggNode, 'zxs');
                                }
                                tree.expire(formInst);

                                // ====== 丝规格n =======
                                sggBranch(specs.zg['gs_plies_' + l], specs.zg['gsi_plies_' + l], gggPath + ngChainPath, formInst, oi);

                                yzValues(tree.get(formInst, gggPath + ngChainPath + '.yz').id, formInst.data, oi);
                            }
                            removeXWX(formInst, gggPath);
                        }


                        // ====== 油脂 =======
                        yzValues(tree.get(formInst, gggPath + '.yz').id, formInst.data, oi);
                    }
                }

                // ============ 芯(纤维芯, 金属芯或半金属芯) ============
                if (FC_REGEX.test(xgg)) {
                    xwxValues(tree.get(formInst, gssPath + '.xwx').id, formInst.data);
                } else if (xgg === 'IWR' || xgg === 'IWS') {
                    // 创建金属芯结构, 根据金属芯规格表
                    // 中心股
                    var params, found, p;
                    if (specs.jsx.gc_center) {
                        params = {
                            path: 'zxg',                            // 中心股路径
                            nzcs: specs.jsx.zxg_nzcs,               // 捻制次数
                            ggs: specs.jsx.gc_center,               // 股个数
                            structure: specs.jsx.xg_structure,      // 股结构
                            zxsGs: specs.jsx.xg_center_wire,        // 中心丝钢丝根数
                            pliesGs: {},                            // 每层钢丝根数
                            pliesGgs: {}                            // 每层钢丝规格数
                        };
                        found = null;
                        for (p in specs.jsx) {
                            if (specs.jsx.hasOwnProperty(p)) {
                                if (found = p.match(/xg_plies_(\d)/)) {
                                    params.pliesGs[found[1]] = specs.jsx[p];
                                } else if (found = p.match(/xg_gg_plies_(\d)/)) {
                                    params.pliesGgs[found[1]] = specs.jsx[p];
                                }
                            }
                        }
                        jsxGuProcess(params, formInst, oi);
                    } else {
                        var jsxChildren = tree.get(formInst, 'gss.jsx').children;
                        for (var i = 0; i < jsxChildren.length; i++) {
                            if (jsxChildren[i].name = 'zxg') {
                                jsxChildren.splice(i, 1);       // 删除中心股
                                break;
                            }
                        }
                    }
                    //特殊金属芯规格，会有2个外股
                    // 外股
                    params = 
                        {
                            path: 'wg',                             // 外股路径
                            nzcs: specs.jsx.wg_nzcs,                // 捻制次数
                            ggs: specs.jsx.gc_wg_plies_1,           // 股个数
                            structure: specs.jsx.wg_structure,      // 股结构
                            zxsGs: specs.jsx.wg_center_wire,        // 中心丝钢丝根数
                            pliesGs: {},                            // 每层钢丝根数
                            pliesGgs: {}                            // 每层钢丝规格数
                            
                        };
        
                    
                    found = null;
                      
                        var paramsList = params;
                        for (p in specs.jsx) {
                            if (specs.jsx.hasOwnProperty(p)) {
                                if (found = p.match(/wg_plies_(\d)/)) {
                                    paramsList.pliesGs[found[1]] = specs.jsx[p];
                                } else if (found = p.match(/wg_gg_plies_(\d)/)) {
                                    paramsList.pliesGgs[found[1]] = specs.jsx[p];
                                }
                            }
                        }
                        jsxGuProcess(paramsList, formInst, oi, xgg === 'IWS');


                    
                    // 金属芯油脂
                    yzValues(tree.get(formInst, 'gss.jsx.yz').id, formInst.data, oi);

                    // 金属芯节点
                    var jsxNode = tree.get(formInst, 'gss.jsx');
                    if (xgg === 'IWS') {
                        jsxNode.name = 'jsgx';
                        jsxNode.text = '金属股芯';
                    } else {
                        jsxNode.name = 'jssx';
                        jsxNode.text = '金属绳芯';
                    }
                    jsxNode.sxfss = 1;
                    formInst.data[jsxNode.id] = getGGGValues(null, oi, oi.jsx_spec);
                } else {
                    // 删除纤维芯
                    removeXWX(formInst, 'gss');
                }

                // ============ 油脂 ============
                yzValues(tree.get(formInst, gssPath + '.yz').id, formInst.data, oi);

                //特殊没有规律的钢丝绳的金属芯
                if(formInst.isSpecial=="true"){
                    if(formInst.plies == 2){
                        var specialData = specialStruct();
                        var dataChildren = tree.get(formInst,'gss.jsx');
                        dataChildren.children.push(specialData.jsxSpe1);
                        var jsx_data = cloneObj(formInst.data[12]);
                        var s_data = cloneObj(formInst.data[24]);//丝1模板
                        var zxs_data = cloneObj(formInst.data[27]);//中心丝模板
                        var yz_data = cloneObj(formInst.data[30]);//油脂
                        s_data[3].value = 9;
                        formInst.data[80] = jsx_data;
                        formInst.data[81] = s_data;
                        formInst.data[86] = s_data;
                        formInst.data[82] = zxs_data;
                        formInst.data[83] = yz_data;
                        formInst.maxId = 87; 
                    }else if(formInst.plies == 3){
                        var specialData = specialStruct();
                        var dataChildren = tree.get(formInst,'gss.jsx');
                        console.log(JSON.stringify(dataChildren));
                        dataChildren.children.push(specialData.jsxSpe2);
                        var jsx_data = cloneObj(formInst.data[12]);
                        var s_data = cloneObj(formInst.data[24]);//丝1模板
                        var s2_data = cloneObj(formInst.data[24]);
                        var s3_data = cloneObj(formInst.data[24]);
                        var zxs_data = cloneObj(formInst.data[27]);//中心丝模板
                        var yz_data = cloneObj(formInst.data[30]);//油脂
                        s_data[3].value = 6;s2_data[3].value = "6F";s3_data[3].value = 12;
                        formInst.data[80] = jsx_data;
                        formInst.data[81] = s_data;
                        formInst.data[82] = zxs_data;
                        formInst.data[83] = yz_data;
                        formInst.data[86] = s2_data;
                        formInst.data[88] = s3_data;
                        formInst.maxId = 89; 
                    }
                    
                }
                tree.expire(formInst);  // 清除缓存
                newFormInsts.push(formInst);
                
            }
        }
    }

    process();
}

// 更新合绳次数
function updateHSCS(orderItem, hscs, csHsMap) {
    // 改变合绳次数
    orderItem.data.props.hscs = hscs;
    tree.get(orderItem, 'gss').hscs = hscs;

    // 如果合绳次数 > 1, 加入n次合绳节点(n < 合绳次数)
    if (hscs > 1) {
        // 加入n次合绳中间品数据属性, 只有强度是可以传承的
        var strength;
        for (var i = 0; i < orderItem.data[0].length; i++) {
            if (orderItem.data[0][i].name === 'qd') {
                strength = orderItem.data[0][i].value;
                break;
            }
        }

        var parent = tree.get(orderItem, 'gss');
        var tmpl = getZjpValues({strength: strength});

        var tmpChildren = [], hsNode = null, yzNode;
        var csMap = {};
        if (csHsMap) {
            var cs = 1;
            csHsMap.forEach(function (d, idx) {
                csMap[idx] = [];
                for (var j = 0; j < +d; j++) {
                    csMap[idx].push('gdc' + cs++);
                }
            });
        } else {
            for (i = 0; i < hscs; i++) {
                csMap[i] = ['gdc' + (i + 1)];
            }
        }
        parent.gcs = csMap[hscs - 1].map(function (d) {
            return +d.substr(3);
        });
        for (i = hscs - 1; i > 0; i--) {
            for (var j = parent.children.length - 1; j >= 0; j--) {
                if (csMap[i].indexOf(parent.children[j].name) === -1 && parent.children[j].name !== 'yz') {
                    tmpChildren.push(parent.children.splice(j, 1)[0]);
                } else if (parent.children[j].name === 'yz') {
                    yzNode = parent.children[j];
                }
            }
            hsNode = {
                id: ++orderItem.maxId + "",
                name: 'hs' + i,
                text: i + '次合绳',
                sxfss: 1,
                type: 'folder',
                gcs: csMap[i - 1].map(function (d) {
                    return +d.substr(3);
                })
            };
            orderItem.data[hsNode.id] = _.cloneDeep(tmpl);
            parent.children.unshift(hsNode);
            hsNode.children = tmpChildren;

            // 加上油脂
            var yz = _.cloneDeep(yzNode);
            yz.id = ++orderItem.maxId + "";
            hsNode.children.push(yz);
            orderItem.data[yz.id] = orderItem.data[yzNode.id].slice(0);

            tmpChildren = [];
            parent = hsNode;
        }
    }
}

// 更新收线方式数
function updateSXFSS(orderItem, node, sxfss) {
    var oldSxfss = node.sxfss;
    node.sxfss = sxfss;
    var data = orderItem.data[node.id];
    if (node.sxfss > oldSxfss) {
        // 添加数据
        var tmpl = data.filter(function (d) {
            return d.name.substr(0, 'yl.sxfs1'.length) === 'yl.sxfs1';
        });
        for (var i = Number(oldSxfss) + 1; i <= node.sxfss; i++) {
            for (var j = 0; j < tmpl.length; j++) {
                //此处代码还是有问题:
                //当有10种以上的收线方式时，那么replace这样做就是错误的.
                data.push({name: tmpl[j].name.replace('sxfs1', 'sxfs' + i), value: ''});
            }
        }
        //console.log("============递增的=====================");
        //console.log(data);
    } else {
        // 删除多余的数据
        for (i = oldSxfss; i > node.sxfss; i--) {
            data = data.filter(function (d) {
                return d.name.substr(0, 'yl.sxfs1'.length) !== 'yl.sxfs' + i;
            });
        }
        
    }
}

// 更新拉拔次数数据
function updateLBCS(orderItem, node, lbcs) {
    var prodArray = orderItem.data["0"], prod = {};
    prodArray.map(function (p) {
        prod[p.name] = p.value;
    });
    plValues(node.id, orderItem.data, prod, lbcs);

    function plValues(id, data, prod, lbcs) {
        var values = [];
        for (var i = 1; i <= lbcs; i++) {
            var prefix = 'lbcs' + i;
            values.push({name: prefix + '.gg.lx', value: ''});        // 类型
            values.push({name: prefix + '.gg.lb', value: prod.lb});   // 类别
            values.push({name: prefix + '.gg.gh', value: ''});        // 钢号
            values.push({name: prefix + '.gg.zj', value: ''});        // 直径
            values.push({name: prefix + '.gg.qd', value: prod.qd});   // 强度
            values.push({name: prefix + '.yl.dh', value: ''});        // 吨耗
            values.push({name: prefix + '.yl.zl', value: ''});        // 重量
            values.push({name: prefix + '.chsfrcl', value: ''});      // 产后是否热处理
            values.push({name: prefix + '.rclfs', value: ''});        // 热处理方式
            values.push({name: prefix + '.chsfdx', value: ''});       // 产后是否镀锌
        }
        data[id] = values;
    }
}

module.exports = {
    createOrderItemsForm: createOrderItemsForm,
    updateHSCS: updateHSCS,
    updateSXFSS: updateSXFSS,
    updateLBCS: updateLBCS
};