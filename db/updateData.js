var ObjectID = require('mongodb').ObjectID;

/**
 * 如何更新所有租户里的数据:
 * 1. 所有的改变会执行到所有的租户数据库! 如果更新的是forms, 还会更新meta_library
 * 2. 在updates, inserts, deletes数组里面指定要更新的数据, 如下要求:
 *
 * UPDATE:
 *      {
 *          collection: '集合名字',     // 比如 users, forms
 *          key: '唯一主键',            // 必须是可以唯一确定文档记录的主键, 比如 _id: ObjectID(), username: '用户名'
 *          value: {}                  // 要替换的文档的内容, 必须是完整的内容
 *      }
 * INSERT:
 *      {
 *          collection: '集合名字',     // 比如 users, forms
 *          value: {}                  // 要添加的文档的内容, 必须是完整的内容
 *      }
 * DELETE:
 *      {
 *          collection: '集合名字',     // 比如 users, forms
 *          key: '唯一主键',            // 必须是可以唯一确定文档记录的主键, 比如 _id: ObjectID(), username: '用户名'
 *      }
 *
 * 注意: 如果collection是'forms', 会自动更新meta_library和所有的租户数据库
 */
module.exports = {
    updates: [],
    inserts: [],
    deletes: []
};