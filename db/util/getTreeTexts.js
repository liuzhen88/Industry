var treeData = require('../meta_library');

var texts = [];

walkTree(treeData.forms);
console.log(texts.sort());

function walkTree(node) {
    if (node instanceof Array) {
        for (var i = 0; i < node.length; i++) {
            walkTree(node[i]);
        }
    } else if (node.body && node.body instanceof Array) {
        for (var i = 0; i < node.body.length; i++) {
            walkTree(node.body[i]);
        }
    } else if (node.children) {
        if (node.text && texts.indexOf(node.text) === -1) texts.push(node.text);
        for (var i = 0; i < node.children.length; i++) {
            walkTree(node.children[i]);
        }
    } else {
        if (node.text && texts.indexOf(node.text) === -1) texts.push(node.text);
    }
}
