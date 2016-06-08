var treeData = require('../meta_library');
var textNameMap = require('./textNameMap');
var fs = require('fs');

// 注意：运行这个文件会覆盖meta_library.js!!!
assign(treeData.forms);
//console.log(JSON.stringify(treeData, null, 2));
var metaLibFile =
    "var ObjectID = require('mongodb').ObjectID;\n\nmodule.exports =" + JSON.stringify(treeData, null, 2);

fs.writeFile("../meta_library.js", metaLibFile, function (err) {
    if (err) return console.log(err);

    console.log("wrote to meta_library!");
});

function assign(node) {
    if (node instanceof Array) {
        for (var i = 0; i < node.length; i++) {
            assign(node[i]);
        }
    } else if (node.body && node.body instanceof Array) {
        for (var i = 0; i < node.body.length; i++) {
            assign(node.body[i]);
        }
    } else if (node.children) {
        var tmp = node.children;
        delete node.children;
        if (node.text) {
            if (!textNameMap[node.text]) {
                console.log("没有找到对应名字:", node.text);
            } else {
                if (!(node.name)) {
                    node.name = textNameMap[node.text];     // 如果meta_library里面对这个节点已经有name了,不去覆盖
                }
            }
        }
        node.children = tmp;    // to make name appears before children
        for (var i = 0; i < node.children.length; i++) {
            assign(node.children[i]);
        }
    } else {
        if (node.text) {
            if (!textNameMap[node.text]) {
                console.log("没有找到对应名字:", node.text);
            } else {
                if (!(node.name)) {
                    node.name = textNameMap[node.text];     // 如果meta_library里面对这个节点已经有name了,不去覆盖
                }
            }
        }
    }
}
