var treeData = require('../meta_library');
var fs = require('fs');

// 目前(11/24/2015)只是用来生成订单分解表树结构每个节点id
var forms = treeData.forms.filter(function (f) {
    return f.alias === 'order_item';
});

if (forms.length !== 1) {
    throw new Error("Cannot find order_item form.");
}

orderItemForm = forms[0];
var count = 0;

assignId(orderItemForm.body);
function assignId(node) {
    if (node instanceof Array) {
        for (var i = 0; i < node.length; i++) {
            assignId(node[i]);
        }
    } else {
        node.id = "" + count++;     // jstree需要id为String
        if (node.children) {
            for (var i = 0; i < node.children.length; i++) {
                assignId(node.children[i]);
            }
        }
    }
}

orderItemForm.maxId = count;

console.log(JSON.stringify(orderItemForm, null, 2));


var metaLibFile =
    "var ObjectID = require('mongodb').ObjectID;\n\nmodule.exports =" + JSON.stringify(treeData, null, 4);

fs.writeFile("../meta_library.js", metaLibFile, function (err) {
    if (err) return console.log(err);

    console.log("wrote to meta_library!");
});
