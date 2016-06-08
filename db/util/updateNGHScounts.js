/**
 * 更新内部表捻股,合绳次数
 */
var internalForm = require('../tenant');
var fs = require('fs');

var nameMappings = {
    '1次合绳': '1',
    '存在2次合绳和1次合绳': '1,2',
    '存在2次合绳，和1次合绳': '1,2',
    '存在2次合绳和1次合绳，中间的中心股因不考核归为金属芯中心股': '1,2',
    '存在3次合绳，和2次合绳，和1次合绳': '1,2,3',
    '存在3次合绳，和2次合绳，和1次合绳  中间的中心股因不考核归金属芯。': '1,2,3',
    '1次捻制': 1,
    '2次捻制': 2,
    '3次捻制': 3,
    '4次捻制': 4
};

var data = internalForm.init_data[0].data;

// find unique texts
var gcs = [], wgs = [], gss = [];
data.forEach(function (d) {
    if (gcs.indexOf(d.gc_explain) === -1) {
        gcs.push(d.gc_explain);
    }
    if (d.name === 'jsxjgb') {
        if (wgs.indexOf(d.wg_explain) === -1) {
            wgs.push(d.wg_explain);
        }
    } else if (d.name === 'gssjgb') {
        if (gss.indexOf(d.gs_explain) === -1) {
            gss.push(d.gs_explain);
        }
    } else {
        console.log("NO MATCH!!!");
    }
});

console.log(gcs, wgs, gss);

data.forEach(function (d) {
    d.hscs = nameMappings[d.gc_explain] || '';      // 合绳次数
    if (d.name === 'jsxjgb') {
        d.nzcs = nameMappings[d.wg_explain];            // 捻股次数
    } else {
        d.nzcs = nameMappings[d.gs_explain];            // 捻股次数
    }
});

console.log(data);

var internalFormFile =
    "module.exports =" + JSON.stringify(internalForm, null, 2);

fs.writeFile("../tenant.js", internalFormFile, function (err) {
    if (err) return console.log(err);

    console.log("wrote to tenant.js!");
});
