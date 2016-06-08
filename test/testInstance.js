var instance = require('../util/instance');
var ObjectID = require('mongodb').ObjectID;

// 注意:1.只抽取了部分数据进行测试
//      2.get,set方法不会对传入的数据进行更改，也就是不会更改源数据

//=============================================以下代码测试get=============================================

// get中的第一个参数original是form_insts中的一条记录，也就是表单实例，是完整的一条记录
// get中的第二个参数module是forms中用户新建的表的那条记录中的body

// 实例original1，对应的模板是module1
// 实例original2，对应的模板是module1
// 实例original3，对应的模板是module2
// 实例original4，对应的模板是module2

var original1 = {
    _id: new ObjectID('56350b0b0ac8dcbc1d3320d1'),
    name: '生产订单1',
    body: [
        {
            "text": "订单号",
            "name": "ddh",
            "value": "订单号1"
        },
        {
            "text": "订单类型",
            "name": "ddlx",
            "value": "订单类型1"
        },
        {
            "text": "订货单位",
            "name": "dhdw",
            "value": "订货单位1"
        },
        {
            "text": "订货内容",
            "type": "folder",
            "name": "dhnr",
            "children": [
                {
                    "text": "类别",
                    "name": "lb",
                    "value": "类别1"
                },
                {
                    "text": "用途",
                    "name": "yt",
                    "value": "用途1"
                },
                {
                    "text": "规格",
                    "name": "gg",
                    "value": "规格1"
                }
            ]
        }
    ],
    tmpl_id: new ObjectID('56350b0b0ac8dcbc1d3320e1')
};

var original2 = {
    _id: new ObjectID('56350b0b0ac8dcbc1d3320d2'),
    name: '生产订单2',
    body: [
        {
            "text": "订单号",
            "name": "ddh",
            "value": "订单号2"
        },
        {
            "text": "订单类型",
            "name": "ddlx",
            "value": "订单类型2"
        },
        {
            "text": "订货单位",
            "name": "dhdw",
            "value": "订货单位2"
        },
        {
            "text": "订货内容",
            "type": "folder",
            "name": "dhnr",
            "children": [
                {
                    "text": "类别",
                    "name": "lb",
                    "value": "类别2"
                },
                {
                    "text": "用途",
                    "name": "yt",
                    "value": "用途2"
                },
                {
                    "text": "规格",
                    "name": "gg",
                    "value": "规格2"
                }
            ]
        }
    ],
    tmpl_id: new ObjectID('56350b0b0ac8dcbc1d3320e1')
};

var original3 = {
    _id: new ObjectID('56350b0b0ac8dcbc1d3320d3'),
    name: '订单产品分解表1',
    body: [
        {
            "text": "订单号",
            "name": "ddh",
            "value": "订单号1"
        },
        {
            "text": "产品编号",
            "name": "cpbh",
            "value": "产品编号1"
        },
        {
            "text": "最终产品",
            "type": "folder",
            "name": "zzcp",
            "children": [
                {
                    "text": "类别",
                    "name": "lb",
                    "value": "类别1"
                },
                {
                    "text": "用途",
                    "name": "yt",
                    "value": "用途1"
                },
                {
                    "text": "规格",
                    "name": "gg",
                    "value": "规格1"
                },
                {
                    "text": "直径",
                    "unit": "mm",
                    "name": "zj",
                    "value": "直径1"
                },
                {
                    "text": "单件米长",
                    "unit": "m",
                    "name": "djmc",
                    "value": "单件米长1",
                }
            ]
        }
    ],
    tmpl_id: new ObjectID('56350b0b0ac8dcbc1d3320e2')
};

var original4 = {
    _id: new ObjectID('56350b0b0ac8dcbc1d3320d4'),
    name: '订单产品分解表2',
    body: [
        {
            "text": "订单号",
            "name": "ddh",
            "value": "订单号2"
        },
        {
            "text": "产品编号",
            "name": "cpbh",
            "value": "产品编号2"
        },
        {
            "text": "最终产品",
            "type": "folder",
            "name": "zzcp",
            "children": [
                {
                    "text": "类别",
                    "name": "lb",
                    "value": "类别2"
                },
                {
                    "text": "用途",
                    "name": "yt",
                    "value": "用途2"
                },
                {
                    "text": "规格",
                    "name": "gg",
                    "value": "规格2"
                },
                {
                    "text": "直径",
                    "unit": "mm",
                    "name": "zj",
                    "value": "直径2"
                },
                {
                    "text": "单件米长",
                    "unit": "m",
                    "name": "djmc",
                    "value": "单件米长2",
                }
            ]
        }
    ],
    tmpl_id: new ObjectID('56350b0b0ac8dcbc1d3320e2')
};

//下面注释的是用户没有选择的
var module1 = {
    _id: new ObjectID('56350b0b0ac8dcbc1d3320e1'),
    text: '生产订单',
    body: [
        {
            "text": "订单号",
            "name": "ddh"
        },
        {
            "text": "订单类型",
            "name": "ddlx"
        },
        //{
        //    "text": "订货单位",
        //    "name": "dhdw"
        //},
        {
            "text": "订货内容",
            "type": "folder",
            "name": "dhnr",
            "children": [
                {
                    "text": "类别",
                    "name": "lb"
                },
                //{
                //    "text": "用途",
                //    "name": "yt"
                //},
                {
                    "text": "规格",
                    "name": "gg"
                }
            ]
        }
    ]
};

//下面注释的是用户没有选择的
var module2 = {
    _id: new ObjectID('56350b0b0ac8dcbc1d3320e2'),
    text: '订单产品分解表',
    body: [
        {
            "text": "订单号",
            "name": "ddh"
        },
        //{
        //    "text": "产品编号",
        //    "name": "cpbh"
        //},
        {
            "text": "最终产品",
            "type": "folder",
            "name": "zzcp",
            "children": [
                {
                    "text": "类别",
                    "name": "lb"
                },
                {
                    "text": "用途",
                    "name": "yt"
                },
                //{
                //    "text": "规格",
                //    "name": "gg"
                //},
                //{
                //    "text": "直径",
                //    "unit": "mm",
                //    "name": "zj"
                //},
                {
                    "text": "单件米长",
                    "unit": "m",
                    "name": "djmc"
                }
            ]
        }
    ]
};

//返回处理后的original1
//console.log(JSON.stringify(instance.get(original1, module1)));

//返回空（original1与module2没对应）
//console.log(JSON.stringify(instance.get(original1, module2)));

//返回处理后的original1，因original2没有与之对应的模板，所以会被过滤掉
//console.log(JSON.stringify(instance.get([original1, original2], module1)));

//返回处理后的original1，original2，original3，original4
//console.log(JSON.stringify(instance.get([original1, original2, original3, original4], [module1, module2])));


//=============================================以下代码测试set=============================================

// set中的第一个参数original是form_insts中的一条记录，也就是表单实例，是完整的一条记录
// set中的第二个参数modify，可以是通过get方法得到的数据（也就是用户选择的数据，可以对中间的value进行修改），也可以是form_insts中
// 的一条记录（可以对这条记录中的value进行修改），为什么要这样定义呢？因为有些用户选择的数据修改后可以直接保存，不会牵连到其
// 他的数据，这个时候只要往modify中传入get后的数据（当然这个get后的数据，中间的某些value可能已经被用户修改了），而有时候用户对选择的
// 数据进行修改，会牵连到其他的数据修改，这个时候可能有些数据不在用户选择的数据中，但是可能保存在完整的实例中，通过对完整的实例进行修
// 改，再传入到modify中，可以达到这个目的

// 实例original1，修改后的实例为modify1
// 实例original2，修改后的实例为modify2
// 实例original3，修改后的实例为modify3
// 实例original4，修改后的实例为modify4

var original1 = {
    _id: new ObjectID('56350b0b0ac8dcbc1d3320d1'),
    name: '生产订单1',
    body: [
        {
            "text": "订单号",
            "name": "ddh",
            "value": "订单号1"
        },
        {
            "text": "订单类型",
            "name": "ddlx",
            "value": "订单类型1"
        },
        {
            "text": "订货单位",
            "name": "dhdw",
            "value": "订货单位1"
        },
        {
            "text": "订货内容",
            "type": "folder",
            "name": "dhnr",
            "children": [
                {
                    "text": "类别",
                    "name": "lb",
                    "value": "类别1"
                },
                {
                    "text": "用途",
                    "name": "yt",
                    "value": "用途1"
                },
                {
                    "text": "规格",
                    "name": "gg",
                    "value": "规格1"
                }
            ]
        }
    ],
    tmpl_id: new ObjectID('56350b0b0ac8dcbc1d3320e1')
};

var original2 = {
    _id: new ObjectID('56350b0b0ac8dcbc1d3320d2'),
    name: '生产订单2',
    body: [
        {
            "text": "订单号",
            "name": "ddh",
            "value": "订单号2"
        },
        {
            "text": "订单类型",
            "name": "ddlx",
            "value": "订单类型2"
        },
        {
            "text": "订货单位",
            "name": "dhdw",
            "value": "订货单位2"
        },
        {
            "text": "订货内容",
            "type": "folder",
            "name": "dhnr",
            "children": [
                {
                    "text": "类别",
                    "name": "lb",
                    "value": "类别2"
                },
                {
                    "text": "用途",
                    "name": "yt",
                    "value": "用途2"
                },
                {
                    "text": "规格",
                    "name": "gg",
                    "value": "规格2"
                }
            ]
        }
    ],
    tmpl_id: new ObjectID('56350b0b0ac8dcbc1d3320e1')
};

var original3 = {
    _id: new ObjectID('56350b0b0ac8dcbc1d3320d3'),
    name: '订单产品分解表1',
    body: [
        {
            "text": "订单号",
            "name": "ddh",
            "value": "订单号1"
        },
        {
            "text": "产品编号",
            "name": "cpbh",
            "value": "产品编号1"
        },
        {
            "text": "最终产品",
            "type": "folder",
            "name": "zzcp",
            "children": [
                {
                    "text": "类别",
                    "name": "lb",
                    "value": "类别1"
                },
                {
                    "text": "用途",
                    "name": "yt",
                    "value": "用途1"
                },
                {
                    "text": "规格",
                    "name": "gg",
                    "value": "规格1"
                },
                {
                    "text": "直径",
                    "unit": "mm",
                    "name": "zj",
                    "value": "直径1"
                },
                {
                    "text": "单件米长",
                    "unit": "m",
                    "name": "djmc",
                    "value": "单件米长1",
                }
            ]
        }
    ],
    tmpl_id: new ObjectID('56350b0b0ac8dcbc1d3320e2')
};

var original4 = {
    _id: new ObjectID('56350b0b0ac8dcbc1d3320d4'),
    name: '订单产品分解表2',
    body: [
        {
            "text": "订单号",
            "name": "ddh",
            "value": "订单号2"
        },
        {
            "text": "产品编号",
            "name": "cpbh",
            "value": "产品编号2"
        },
        {
            "text": "最终产品",
            "type": "folder",
            "name": "zzcp",
            "children": [
                {
                    "text": "类别",
                    "name": "lb",
                    "value": "类别2"
                },
                {
                    "text": "用途",
                    "name": "yt",
                    "value": "用途2"
                },
                {
                    "text": "规格",
                    "name": "gg",
                    "value": "规格2"
                },
                {
                    "text": "直径",
                    "unit": "mm",
                    "name": "zj",
                    "value": "直径2"
                },
                {
                    "text": "单件米长",
                    "unit": "m",
                    "name": "djmc",
                    "value": "单件米长2",
                }
            ]
        }
    ],
    tmpl_id: new ObjectID('56350b0b0ac8dcbc1d3320e2')
};

var modify1 = {
    _id: new ObjectID('56350b0b0ac8dcbc1d3320d1'),
    name: '生产订单1',
    body: [
        {
            "text": "订单号",
            "name": "ddh",
            "value": "订单号1"
        },
        {
            "text": "订单类型",
            "name": "ddlx"
            // 删除value
            //"value": "订单类型1"
        },
        {
            "text": "订货单位",
            "name": "dhdw",
            // 修改value
            // 原 "value": "订货单位1"
            "value": "订货单位111"
        },
        {
            "text": "订货内容",
            "type": "folder",
            "name": "dhnr",
            "children": [
                {
                    "text": "类别",
                    "name": "lb"
                    // 删除value
                    // "value": "类别1"
                },
                {
                    "text": "用途",
                    "name": "yt",
                    // 修改value
                    // 原 "value": "用途1"
                    "value": "用途111"
                }
                //, 用户未选择数据
                //{
                //    "text": "规格",
                //    "name": "gg",
                //    "value": "规格1"
                //}
            ]
        }
    ],
    tmpl_id: new ObjectID('56350b0b0ac8dcbc1d3320e1')
};

var modify2 = {
    _id: new ObjectID('56350b0b0ac8dcbc1d3320d2'),
    name: '生产订单2',
    body: [
        {
            "text": "订单号",
            "name": "ddh",
            "value": "订单号2"
        },
        {
            "text": "订单类型",
            "name": "ddlx",
            "value": "订单类型2"
        },
        {
            "text": "订货单位",
            "name": "dhdw",
            "value": "订货单位2"
        },
        {
            "text": "订货内容",
            "type": "folder",
            "name": "dhnr",
            "children": [
                {
                    "text": "类别",
                    "name": "lb",
                    "value": "类别2"
                },
                {
                    "text": "用途",
                    "name": "yt",
                    "value": "用途2"
                },
                {
                    "text": "规格",
                    "name": "gg",
                    "value": "规格2"
                }
            ]
        }
    ],
    tmpl_id: new ObjectID('56350b0b0ac8dcbc1d3320e1')
};


var modify3 = {
    _id: new ObjectID('56350b0b0ac8dcbc1d3320d3'),
    name: '订单产品分解表1',
    body: [
        {
            "text": "订单号",
            "name": "ddh",
            "value": "订单号1"
        },
        {
            "text": "产品编号",
            "name": "cpbh"
            // 删除value
            // "value": "产品编号1"
        },
        {
            "text": "最终产品",
            "type": "folder",
            "name": "zzcp",
            "children": [
                {
                    "text": "类别",
                    "name": "lb",
                    // 修改value
                    // 原 "value": "类别1"
                    "value": "类别111"
                },
                {
                    "text": "用途",
                    "name": "yt",
                    "value": "用途1"
                },
                // 用户未选择字段
                //{
                //    "text": "规格",
                //    "name": "gg",
                //    "value": "规格1"
                //},
                //{
                //    "text": "直径",
                //    "unit": "mm",
                //    "name": "zj",
                //    "value": "直径1"
                //},
                {
                    "text": "单件米长",
                    "unit": "m",
                    "name": "djmc",
                    "value": "单件米长1",
                }
            ]
        }
    ],
    tmpl_id: new ObjectID('56350b0b0ac8dcbc1d3320e2')
};

var modify4 = {
    _id: new ObjectID('56350b0b0ac8dcbc1d3320d4'),
    name: '订单产品分解表2',
    body: [
        {
            "text": "订单号",
            "name": "ddh",
            "value": "订单号2"
        },
        {
            "text": "产品编号",
            "name": "cpbh",
            "value": "产品编号2"
        },
        {
            "text": "最终产品",
            "type": "folder",
            "name": "zzcp",
            "children": [
                {
                    "text": "类别",
                    "name": "lb",
                    "value": "类别2"
                },
                {
                    "text": "用途",
                    "name": "yt",
                    "value": "用途2"
                },
                {
                    "text": "规格",
                    "name": "gg",
                    "value": "规格2"
                },
                {
                    "text": "直径",
                    "unit": "mm",
                    "name": "zj",
                    "value": "直径2"
                },
                {
                    "text": "单件米长",
                    "unit": "m",
                    "name": "djmc",
                    "value": "单件米长2",
                }
            ]
        }
    ],
    tmpl_id: new ObjectID('56350b0b0ac8dcbc1d3320e2')
};

// 对更改的value进行设置后返回修改后的完整的实例
//console.log(JSON.stringify(instance.set(original1, modify1)));

// original2和modify2对比后发现没有值改变，所以返回空
//console.log(JSON.stringify(instance.set(original2, modify2)));

// 对更改的value进行设置后返回修改后的完整的实例
//console.log(JSON.stringify(instance.set(original3, modify3)));

// original4和modify4对比后发现没有值改变，所以返回空
//console.log(JSON.stringify(instance.set(original4, modify4)));

//只返回需要做更新操作的实例,返回一条记录
//console.log(JSON.stringify(instance.set([original1,original2], modify1)));

//只返回需要做更新操作的实例，对没有value改变的实例进行过滤，过滤掉original2，original4，只返回2条记录
//console.log(JSON.stringify(instance.set([original1, original2, original3, original4], [modify1, modify2, modify3, modify4])));
