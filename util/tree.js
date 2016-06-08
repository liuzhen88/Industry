var cache = {};

// TODO: remove expired cache, maybe 30 mins
module.exports = {
    /**
     * 根据名字路径取得值
     *
     * @param tree required, and tree must have a mongo _id and body attribute
     * @param name required
     * @param cached true / false , true:get the cached data , false:get the new data
     * @returns {value}
     */
    get: function (tree, name) {
        if (!tree || !tree._id || !tree.body || !name) return null;
        return checkMap(tree)[name];
    },
     /**
     * 设置树中节点的值，根据名字路径
     *
     * @param tree required, and tree must have a mongo _id and body attribute
     * @param name required
     * @param value required
     * @returns {null}
     */
    set: function (tree, name, value) {
        if (!tree || !tree._id || !tree.body || !name) return null;
        var node = checkMap(tree)[name];
        console.log("set", node, value);
        node.value = value;
    },
    delete: function (tree, name) {
        if (!tree || !tree._id || !tree.body || !name) return null;
        var node = checkMap(tree)[name];
        if (node.value) {
            console.log("delete", node, node.value);
            delete node.value;
        }
    },
    format: function (tree) {
        if (!tree || !tree._id || !tree.body) return null;
        return checkMap(tree);
    },
    /**
     * 从缓冲中除掉数据项。如果表单树形结构的数据结构发生了变化，比如添加了层数或规格数，要调用此方法清除缓存，以重建map。
     * 否则，新添加的节点会返回undefined.
     *
     * @param tree required
     */
    expire: function (tree) {
        if (!tree || !tree._id) return null;
        delete cache[tree._id];
    }
};

function checkMap(tree) {
    var treeMap;
    if (cache[tree._id]) {
        if (cache[tree._id]._obj !== tree) {
            delete cache[tree._id];     // 如果id相同，但是实例并不是同一个，这时候也要重新build map
        } else {
            treeMap = cache[tree._id];
        }
    }
    if (!treeMap) {
        // rebuild map
        treeMap = {_obj: tree};
        buildMap(tree.body, [], treeMap);
        cache[tree._id] = treeMap;
    }
    return treeMap;
}

function buildMap(node, path, map) {
    if (node instanceof Array) {
        for (var i = 0; i < node.length; i++) {
            buildMap(node[i], path, map);
        }
    } else {
        path.push(node.name);
        map[path.join(".")] = node;
        if (node.children) {
            for (var i = 0; i < node.children.length; i++) {
                buildMap(node.children[i], path, map);
            }
        }
        path.pop();
    }
}