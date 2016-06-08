var _ = require("lodash");
var tree = require('../util/tree');
var test = function () {
    var a = {
        "text": "金属芯中心股",
        "type": "folder",
        "name": "jsxzxg",
        "children": [
            {
                "text": "第(n)层",
                "type": "folder",
                "repeat": "n",
                "name": "dcn",
                "children": [
                    {
                        "text": "用股规格(n)",
                        "type": "folder",
                        "repeat": "n",
                        "name": "ygggn",
                        "children": [
                            {
                                "text": "股结构",
                                "name": "gjg"
                            },
                            {
                                "text": "股直径",
                                "unit": "mm",
                                "name": "gzj"
                            },
                            {
                                "text": "股捻向",
                                "name": "gnx"
                            },
                            {
                                "text": "强度",
                                "unit": "MPa",
                                "name": "qd"
                            },
                            {
                                "text": "涂油方式",
                                "name": "tyfs"
                            },
                            {
                                "text": "捻距",
                                "unit": "mm",
                                "name": "nj"
                            }
                        ]
                    },
                    {
                        "text": "用股量(n)",
                        "type": "folder",
                        "repeat": "n",
                        "name": "ygln",
                        "children": [
                            {
                                "text": "股个数",
                                "name": "ggs"
                            },
                            {
                                "text": "工艺米长系数",
                                "name": "gymcxs"
                            },
                            {
                                "text": "股收线段长",
                                "unit": "m",
                                "name": "gsxdc"
                            },
                            {
                                "text": "股收线段数",
                                "name": "gsxds"
                            },
                            {
                                "text": "单件收线米长",
                                "unit": "m",
                                "name": "djsxmc"
                            },
                            {
                                "text": "股收线件数",
                                "name": "gsxjs"
                            },
                            {
                                "text": "工字轮型号",
                                "name": "gzlxh"
                            },
                            {
                                "text": "股总米长",
                                "unit": "m",
                                "name": "gzmc"
                            },
                            {
                                "text": "损耗",
                                "unit": "m",
                                "name": "sh"
                            }
                        ]
                    }
                ]
            }
        ]
    }
    layer(2, a, a.children);
    for (var i = 0; i < a.children.length; i++) {
        layer(2, a.children[i], a.children[i].children);
    }
    console.log(JSON.stringify(a));
}


function dumplicate(dump, layerNo) {
    var d = _.cloneDeep(dump);
    if (d instanceof Array) {
        var array = [];
        for (var i = 0; i < d.length; i++) {
            delete d[i].repeat;
            d[i].text = d[i].text.replace('n', layerNo);
            d[i].name = d[i].name.replace('n', layerNo);
            array.push(d[i]);
        }
        return array;
    }
    else {
        delete d.repeat;
        d.text = d.text.replace('n', layerNo);
        d.name = d.name.replace('n', layerNo);
        return d;
    }
}


function layer(layers, parent, dump) {
    if (layers >= 1) {
        var array = [];
        if (dump instanceof Array) {
            for (var i = 0; i < dump.length; i++) {
                dump[i].repeat = layers;
            }
        }
        else {
            dump.repeat = layers;
        }
        for (var i = 2; i < layers + 1; i++) {
            var add = dumplicate(dump, i);
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
                dump[i].text = dump[i].text.replace('n', 1);
                dump[i].name = dump[i].name.replace('n', 1);
            }
        }
        else {
            dump.text = dump.text.replace('n', 1);
            dump.name = dump.name.replace('n', 1);
        }
        for (var i = 0; i < array.length; i++) {
            parent.children.push(array[i]);
        }
    }
}

test();