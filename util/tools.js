var _ = require("lodash");
var ObjectID = require('mongodb').ObjectID;

module.exports = {
    cloneInst: function (tmpl, status) {
        var inst = _.cloneDeep(tmpl);   // TODO: ObjectID?
        inst.tmpl_id = inst._id;
        inst._id = new ObjectID();
        inst.status = status;
        return inst;
    }
};
