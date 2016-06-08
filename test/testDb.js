var assert = require('assert');
var db = require('../util/db');

describe('Db', function() {
    describe('#conn()', function () {
        it('should get connection without error', function (done) {
            db(function (err, conn) {
                if (err) assert.fail(err, null, 'Connection failed');
                done();
            });
        });
    });
});
