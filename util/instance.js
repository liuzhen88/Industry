var tree = require('./tree');
var _ = require("lodash");
var ObjectID = require('mongodb').ObjectID;

module.exports = {
    get: function (original, module) {
        if (original instanceof Array) {
            var array = [];
            var origArray = _.cloneDeep(original, function (val) {
                if (val instanceof ObjectID) {
                    return val.toString();
                }
            });
            if (module instanceof Array) {
                for (var i = 0; i < module.length; i++) {
                    for (var j = 0; j < origArray.length; j++) {
                        var mod = _.cloneDeep(module[i], function (val) {
                            if (val instanceof ObjectID) {
                                return val.toString();
                            }
                        });
                        var fm = tree.format(mod);
                        var orig = origArray[j];
                        var fo = tree.format(orig);
                        if (mod._id == orig.tmpl_id) {
                            for (var k in fm) {
                                for (var l in fo) {
                                    if (k == l) {
                                        var val = fo[l].value;
                                        if (val) {
                                            tree.set(mod, k, val);
                                        }
                                    }
                                }
                            }
                            orig.body = mod.body;
                            array.push(orig);
                        }
                    }
                }
            }
            else {
                for (var i = 0; i < origArray.length; i++) {
                    var mod = _.cloneDeep(module, function (val) {
                        if (val instanceof ObjectID) {
                            return val.toString();
                        }
                    });
                    var fm = tree.format(mod);
                    var orig = origArray[i];
                    var fo = tree.format(orig);
                    if (mod._id == orig.tmpl_id) {
                        for (var j in fm) {
                            for (var k in fo) {
                                if (j == k) {
                                    var val = fo[k].value;
                                    if (val) {
                                        tree.set(mod, j, val);
                                    }
                                }
                            }
                        }
                        orig.body = mod.body;
                        array.push(orig);
                    }
                }
            }
            if (array.length == 0) {
                return null
            }
            return array;
        }
        else {
            var orig = _.cloneDeep(original, function (val) {
                if (val instanceof ObjectID) {
                    return val.toString();
                }
            });
            var fo = tree.format(orig);
            var has = false;
            if (module instanceof Array) {
                var modArray = _.cloneDeep(module, function (val) {
                    if (val instanceof ObjectID) {
                        return val.toString();
                    }
                });
                for (var i = 0; i < modArray.length; i++) {
                    var mod = modArray[i];
                    var fm = tree.format(mod);
                    if (mod._id == orig.tmpl_id) {
                        has = true;
                        for (var j in fm) {
                            for (var k in fo) {
                                if (j == k) {
                                    var val = fo[k].value;
                                    if (val) {
                                        tree.set(mod, j, val);
                                    }
                                }
                            }
                        }
                        orig.body = mod.body;
                        return orig;
                    }
                }
                if (!has) {
                    return null;
                }
            }
            else {
                var mod = _.cloneDeep(module, function (val) {
                    if (val instanceof ObjectID) {
                        return val.toString();
                    }
                });
                var fm = tree.format(mod);
                if (mod._id == orig.tmpl_id) {
                    for (var i in fm) {
                        for (var j in fo) {
                            if (i == j) {
                                var val = fo[j].value;
                                if (val) {
                                    tree.set(mod, i, val);
                                }
                            }
                        }
                    }
                    orig.body = mod.body;
                    return orig;
                }
                else {
                    return null;
                }
            }
        }
    }
    ,
    set: function (original, modify) {
        if (original instanceof Array) {
            var origArray = _.cloneDeep(original, function (val) {
                if (val instanceof ObjectID) {
                    return val.toString();
                }
            });
            if (modify instanceof Array) {
                var array = [];
                var modArray = _.cloneDeep(modify, function (val) {
                    if (val instanceof ObjectID) {
                        return val.toString();
                    }
                });
                for (var i = 0; i < modArray.length; i++) {
                    var mod = modArray[i];
                    var fm = tree.format(mod);
                    for (var j = 0; j < origArray.length; j++) {
                        var orig = origArray[j];
                        var fo = tree.format(orig);
                        var equals = true;
                        if (mod._id == orig._id) {
                            for (var k in fm) {
                                for (var l in fo) {
                                    if (k == l) {
                                        var fmv = fm[k].value;
                                        var fov = fo[l].value;
                                        if (fmv != fov) {
                                            equals = false;
                                            if (fmv) {
                                                tree.set(orig, l, fmv);
                                            }
                                            else {
                                                tree.delete(orig, l);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if (!equals) {
                            array.push(orig);
                        }
                    }
                }
                if (array.length == 0) {
                    return null;
                }
                else {
                    return array;
                }
            }
            else {
                var mod = _.cloneDeep(modify, function (val) {
                    if (val instanceof ObjectID) {
                        return val.toString();
                    }
                });
                var fm = tree.format(mod);
                var equals = true;
                for (var i = 0; i < origArray.length; i++) {
                    var orig = origArray[i];
                    var fo = tree.format(orig);
                    if (mod._id == orig._id) {
                        for (var j in fm) {
                            for (var k in fo) {
                                if (j == k) {
                                    var fmv = fm[j].value;
                                    var fov = fo[k].value;
                                    if (fmv != fov) {
                                        equals = false;
                                        if (fmv) {
                                            tree.set(orig, k, fmv);
                                        }
                                        else {
                                            tree.delete(orig, k);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (!equals) {
                        return orig;
                    }
                }
                return null;
            }
        }
        else {
            var orig = _.cloneDeep(original, function (val) {
                if (val instanceof ObjectID) {
                    return val.toString();
                }
            });
            var fo = tree.format(orig);
            if (modify instanceof Array) {
                var modArray = _.cloneDeep(modify, function (val) {
                    if (val instanceof ObjectID) {
                        return val.toString();
                    }
                });
                var equals = true;
                for (var i = 0; i < modArray.length; i++) {
                    var mod = modArray[i];
                    var fm = tree.format(mod);
                    if (mod._id == orig._id) {
                        for (var j in fm) {
                            for (var k in fo) {
                                if (j == k) {
                                    var fmv = fm[j].value;
                                    var fov = fo[k].value;
                                    if (fmv != fov) {
                                        equals = false;
                                        if (fmv) {
                                            tree.set(orig, k, fmv);
                                        }
                                        else {
                                            tree.delete(orig, k);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (!equals) {
                        return orig;
                    }
                }
                return null;
            }
            else {
                var mod = _.cloneDeep(modify, function (val) {
                    if (val instanceof ObjectID) {
                        return val.toString();
                    }
                });
                var fm = tree.format(mod);
                var equals = true;
                if (mod._id == orig._id) {
                    for (var i in fm) {
                        for (var j in fo) {
                            if (i == j) {
                                var fmv = fm[i].value;
                                var fov = fo[j].value;
                                if (fmv != fov) {
                                    equals = false;
                                    if (fmv) {
                                        tree.set(orig, j, fmv);
                                    }
                                    else {
                                        tree.delete(orig, j);
                                    }
                                }
                            }
                        }
                    }
                }
                if (!equals) {
                    return orig;
                }
                return null;
            }
        }
    }
}





