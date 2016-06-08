var ObjectID = require('mongodb').ObjectID;
var tree = require('../util/tree');
var assert = require('assert');

var test1 = {
    _id: new ObjectID('562990ea7515ec24af501fb3'),
    name: 'a',
    body: [
        {name: 'b', value: 'b value'},
        {
            name: 'c',
            value: 'c value',
            children: [
                {name: 'd', value: 'd value'},
                {name: 'e', value: 'e value'},
                {
                    name: 'g',
                    value: 'g value',
                    children: [
                        {name: 'h', value: 'h value'},
                        {name: 'i', value: 'i value'},
                        {name: 'j', value: 'j value'}
                    ]
                },
                {name: "x", value: "x value"}
            ]
        },
        {name: 'f', value: 'f value'}
    ]
};

assert.equal(tree.get(test1, "b").value, "b value");
assert.equal(tree.get(test1, "c").value, "c value");
assert.equal(tree.get(test1, "f").value, "f value");
assert.equal(tree.get(test1, "c.e").value, "e value");
assert.equal(tree.get(test1, "c.g.j").value, "j value");
assert.equal(tree.get(test1, "c.x").value, "x value");

tree.set(test1, "c.g.j", "new j value");
assert.equal(tree.get(test1, "c.g.j").value, "new j value");
tree.set(test1, "c.x", "new x value");
assert.equal(tree.get(test1, "c.x").value, "new x value");
