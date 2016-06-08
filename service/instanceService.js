var error = require('../util/error');
var ObjectID = require('mongodb').ObjectID;

module.exports = {
    getByTemplateId: function (req, res, next) {
        var id = req.body.id;
        if (id) {
            req.db.collection("form_insts").find({"tmpl_id": new ObjectID(id)}).toArray(function (err, docs) {
                if (err) return next(error(500, err));
                res.status(200).json(docs);
            })
        }
    },
    getById: function (req, res, next) {
        var id = req.body.id;
        if (id) {
            req.db.collection("form_insts").findOne({"_id": new ObjectID(id)}, function (err, docs) {
                if (err) return next(error(500, err));
                res.status(200).json(docs);
            })
        }
    }
}
