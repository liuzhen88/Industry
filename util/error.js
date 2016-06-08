module.exports = function (status, error, debugMsg) {
    error.status = status;
    error.debugMsg = debugMsg;
    return error;
};

module.exports.rollback = function (db, err, next) {
    db.rollback(function (err) {
        if (err) console.err("Cannot rollback", err);
    });
    err.status = 500;
    return next(err);
};