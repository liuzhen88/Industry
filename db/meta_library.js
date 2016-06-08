var ObjectID = require('mongodb').ObjectID;

module.exports = {
    "forms": [
        {
            "_id": new ObjectID("5692fd34e314cac35658bbc5"),
            "name": "生产订单",
            "alias": "order",
            "type": {
                "name": "order",
                "value": "订单"
            },
            "default": true,
            "selected": true,
            "display": true,
            "category": {
                "name": "form",
                "value": "表单"
            },
            "order": 10,
            "root": true,
            "perms": [
                "display",
                "operate",
                "approve"
            ],
            "header": [
                {
                    "name": "form_no",
                    "text": "表单编号"
                },
                {
                    "name": "author",
                    "text": "制表"
                },
                {
                    "name": "created",
                    "text": "制表日期"
                },
                {
                    "name": "sale_order_no",
                    "text": "销售订单编号"
                },
                {
                    "name": "auditor",
                    "text": "审核"
                },
                {
                    "name": "audit_date",
                    "text": "审核日期"
                }
            ],
            "body": [
                {
                    "text": "订单号",
                    "name": "ddh"
                },
                {
                    "text": "订单类型",
                    "name": "ddlx"
                },
                {
                    "text": "订货单位",
                    "name": "dhdw"
                },
                {
                    "text": "客户代码",
                    "name": "khdm"
                },
                {
                    "text": "下/接单日期",
                    "name": "xjdrq"
                },
                {
                    "text": "备注",
                    "name": "bz"
                },
                {
                    "text": "订货内容",
                    "type": "folder",
                    "name": "dhnr",
                    "children": [
                        {
                            "text": "序号(n)",
                            "type": "folder",
                            "repeat": "n",
                            "name": "xhn",
                            "children": [
                                {
                                    "text": "类别",
                                    "name": "lb"
                                },
                                {
                                    "text": "用途",
                                    "name": "yt"
                                },
                                {
                                    "text": "规格",
                                    "name": "gg"
                                },
                                {
                                    "text": "直径",
                                    "unit": "mm",
                                    "name": "zj"
                                },
                                {
                                    "text": "单件米长",
                                    "unit": "m",
                                    "name": "djmc"
                                },
                                {
                                    "text": "件数",
                                    "name": "js"
                                },
                                {
                                    "text": "强度",
                                    "unit": "MPa",
                                    "name": "qd"
                                },
                                {
                                    "text": "参考重量",
                                    "unit": "kg",
                                    "name": "ckzl"
                                },
                                {
                                    "text": "捻向",
                                    "name": "nx"
                                },
                                {
                                    "text": "涂油方式",
                                    "name": "tyfs"
                                },
                                {
                                    "text": "特殊要求",
                                    "name": "tsyq"
                                },
                                {
                                    "text": "紧急程度",
                                    "name": "jjcd"
                                },
                                {
                                    "text": "是否定制",
                                    "name": "sfdz"
                                },
                                {
                                    "text": "交货日期",
                                    "name": "jhrq"
                                },
                                {
                                    "text": "质量要求与技术标准",
                                    "name": "zlyqyjsbz"
                                },
                                {
                                    "text": "包装方式",
                                    "name": "bzfs"
                                },
                                {
                                    "text": "备注",
                                    "name": "bz"
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "name": "订单产品分解表",
            "alias": "order_item",
            "type": {
                "name": "order_plan",
                "value": "订单计划"
            },
            "default": false,
            "display": false,
            "selected": false,
            "category": {
                "name": "form",
                "value": "表单"
            },
            "order": 20,
            "maxId": 39,
            "perms": [
                "display",
                "operate",
                "approve"
            ],
            "header": [
                {
                    "name": "form_no",
                    "text": "表单编号"
                },
                {
                    "name": "author",
                    "text": "制表"
                },
                {
                    "name": "created",
                    "text": "制表日期"
                },
                {
                    "name": "version",
                    "text": "版本号"
                },
                {
                    "name": "auditor",
                    "text": "审核"
                },
                {
                    "name": "audit_date",
                    "text": "审核日期"
                }
            ],
            "body": [
                {
                    "text": "钢丝绳",
                    "type": "folder",
                    "name": "gss",
                    "id": "0",
                    "children": [
                        {
                            "text": "第N层股",
                            "type": "folder",
                            "name": "gdc1",
                            "repeat": "n",
                            "id": "1",
                            "children": [
                                {
                                    "text": "股N",
                                    "type": "folder",
                                    "name": "g1",
                                    "repeat": "n",
                                    "id": "2",
                                    "children": [
                                        {
                                            "text": "第N层丝",
                                            "type": "folder",
                                            "name": "sdc1",
                                            "repeat": "n",
                                            "id": "3",
                                            "children": [
                                                {
                                                    "text": "丝N",
                                                    "type": "folder",
                                                    "name": "s1",
                                                    "repeat": "n",
                                                    "id": "4",
                                                    "children": [
                                                        {
                                                            "text": "坯料",
                                                            "type": "folder",
                                                            "name": "pl",
                                                            "id": "5",
                                                            "children": [
                                                                {
                                                                    "text": "盘条",
                                                                    "type": "folder",
                                                                    "name": "pt",
                                                                    "id": "6"
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            "text": "中心丝",
                                            "type": "folder",
                                            "name": "zxs",
                                            "id": "7",
                                            "children": [
                                                {
                                                    "text": "坯料",
                                                    "type": "folder",
                                                    "name": "pl",
                                                    "id": "8",
                                                    "children": [
                                                        {
                                                            "text": "盘条",
                                                            "type": "folder",
                                                            "name": "pt",
                                                            "id": "9"
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            "text": "纤维芯",
                                            "type": "folder",
                                            "name": "xwx",
                                            "id": "10"
                                        },
                                        {
                                            "text": "油脂",
                                            "type": "folder",
                                            "name": "yz",
                                            "id": "11"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "金属芯",
                            "type": "folder",
                            "name": "jsx",
                            "id": "12",
                            "children": [
                                {
                                    "text": "中心股",
                                    "type": "folder",
                                    "name": "zxg",
                                    "id": "13",
                                    "children": [
                                        {
                                            "text": "第N层丝",
                                            "type": "folder",
                                            "name": "sdc1",
                                            "repeat": "n",
                                            "id": "14",
                                            "children": [
                                                {
                                                    "text": "丝N",
                                                    "type": "folder",
                                                    "name": "s1",
                                                    "repeat": "n",
                                                    "id": "15",
                                                    "children": [
                                                        {
                                                            "text": "坯料",
                                                            "type": "folder",
                                                            "name": "pl",
                                                            "id": "16",
                                                            "children": [
                                                                {
                                                                    "text": "盘条",
                                                                    "type": "folder",
                                                                    "name": "pt",
                                                                    "id": "17"
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            "text": "中心丝",
                                            "type": "folder",
                                            "name": "zxs",
                                            "id": "18",
                                            "children": [
                                                {
                                                    "text": "坯料",
                                                    "type": "folder",
                                                    "name": "pl",
                                                    "id": "19",
                                                    "children": [
                                                        {
                                                            "text": "盘条",
                                                            "type": "folder",
                                                            "name": "pt",
                                                            "id": "20"
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            "text": "油脂",
                                            "type": "folder",
                                            "name": "yz",
                                            "id": "21"
                                        }
                                    ]
                                },
                                {
                                    "text": "外股",
                                    "type": "folder",
                                    "name": "wg",
                                    "id": "22",
                                    "children": [
                                        {
                                            "text": "第N层丝",
                                            "type": "folder",
                                            "name": "sdc1",
                                            "repeat": "n",
                                            "id": "23",
                                            "children": [
                                                {
                                                    "text": "丝N",
                                                    "type": "folder",
                                                    "name": "s1",
                                                    "repeat": "n",
                                                    "id": "24",
                                                    "children": [
                                                        {
                                                            "text": "坯料",
                                                            "type": "folder",
                                                            "name": "pl",
                                                            "id": "25",
                                                            "children": [
                                                                {
                                                                    "text": "盘条",
                                                                    "type": "folder",
                                                                    "name": "pt",
                                                                    "id": "26"
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            "text": "中心丝",
                                            "type": "folder",
                                            "name": "zxs",
                                            "id": "27",
                                            "children": [
                                                {
                                                    "text": "坯料",
                                                    "type": "folder",
                                                    "name": "pl",
                                                    "id": "28",
                                                    "children": [
                                                        {
                                                            "text": "盘条",
                                                            "type": "folder",
                                                            "name": "pt",
                                                            "id": "29"
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            "text": "油脂",
                                            "type": "folder",
                                            "name": "yz",
                                            "id": "30"
                                        }
                                    ]
                                },
                                {
                                    "text": "油脂",
                                    "type": "folder",
                                    "name": "yz",
                                    "id": "31"
                                }
                            ]
                        },
                        {
                            "text": "半金属芯",
                            "type": "folder",
                            "name": "bjsx",
                            "id": "32",
                            "children": [
                                {
                                    "text": "外钢丝",
                                    "type": "folder",
                                    "name": "wgs",
                                    "id": "33",
                                    "children": [
                                        {
                                            "text": "坯料",
                                            "type": "folder",
                                            "name": "pl",
                                            "id": "34",
                                            "children": [
                                                {
                                                    "text": "盘条",
                                                    "type": "folder",
                                                    "name": "pt",
                                                    "id": "35"
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    "text": "纤维芯",
                                    "type": "folder",
                                    "name": "xwx",
                                    "id": "36"
                                }
                            ]
                        },
                        {
                            "text": "纤维芯",
                            "type": "folder",
                            "name": "xwx",
                            "id": "37"
                        },
                        {
                            "text": "油脂",
                            "type": "folder",
                            "name": "yz",
                            "id": "38"
                        }
                    ]
                }
            ]
        },
        {
            "name": "订单计划表",
            "alias": "order_plan",
            "type": {
                "name": "order_plan",
                "value": "订单计划"
            },
            "default": false,
            "display": false,
            "selected": false,
            "category": {
                "name": "form",
                "value": "表单"
            },
            "order": 30,
            "perms": [
                "display",
                "operate",
                "approve"
            ],
            "header": [
                {
                    "name": "form_no",
                    "text": "表单编号"
                },
                {
                    "name": "author",
                    "text": "制表"
                },
                {
                    "name": "created",
                    "text": "制表日期"
                },
                {
                    "name": "version",
                    "text": "版本号"
                },
                {
                    "name": "auditor",
                    "text": "审核"
                },
                {
                    "name": "audit_date",
                    "text": "审核日期"
                }
            ],
            "body": [
                {
                    "text": "订单号",
                    "name": "ddh"
                },
                {
                    "text": "产品编号",
                    "name": "cpbh"
                },
                {
                    "text": "类别",
                    "name": "lb"
                },
                {
                    "text": "规格",
                    "name": "gg"
                },
                {
                    "text": "直径",
                    "name": "zj"
                },
                {
                    "text": "单件米长",
                    "unit": "m",
                    "name": "djmc"
                },
                {
                    "text": "件数",
                    "name": "js"
                },
                {
                    "text": "强度",
                    "unit": "MPa",
                    "name": "qd"
                },
                {
                    "text": "捻向",
                    "name": "nx"
                },
                {
                    "text": "捻距",
                    "unit": "mm",
                    "name": "nj"
                },
                {
                    "text": "涂油方式",
                    "name": "tyfs"
                },
                {
                    "text": "特殊要求",
                    "name": "tsyq"
                },
                {
                    "text": "用途",
                    "name": "yt"
                },
                {
                    "text": "下/接单日期",
                    "name": "xjdrq"
                },
                {
                    "text": "交货日期",
                    "name": "jhrq"
                },
                {
                    "text": "紧急程度",
                    "name": "jjcd"
                },
                {
                    "text": "坯料工段产品",
                    "type": "folder",
                    "name": "plgdcp",
                    "children": [
                        {
                            "text": "是否定制",
                            "name": "sfdz"
                        },
                        {
                            "text": "坯料n",
                            "type": "folder",
                            "name": "pln",
                            "children": [
                                {
                                    "text": "规格",
                                    "type": "folder",
                                    "name": "gg",
                                    "children": [
                                        {
                                            "text": "类别",
                                            "name": "lb"
                                        },
                                        {
                                            "text": "钢号",
                                            "name": "gh"
                                        },
                                        {
                                            "text": "直径",
                                            "unit": "mm",
                                            "name": "zj"
                                        },
                                        {
                                            "text": "强度",
                                            "unit": "MPa",
                                            "name": "qd"
                                        }
                                    ]
                                },
                                {
                                    "text": "是否热处理",
                                    "name": "sfrcl"
                                },
                                {
                                    "text": "是否镀锌",
                                    "name": "sfdx"
                                },
                                {
                                    "text": "计划",
                                    "type": "folder",
                                    "name": "jh",
                                    "children": [
                                        {
                                            "text": "计划产量",
                                            "unit": "kg",
                                            "name": "jhcl"
                                        },
                                        {
                                            "text": "开始日期",
                                            "name": "ksrq"
                                        },
                                        {
                                            "text": "完成日期",
                                            "name": "wcrq"
                                        }
                                    ]
                                },
                                {
                                    "text": "实际",
                                    "type": "folder",
                                    "name": "sj",
                                    "children": [
                                        {
                                            "text": "开始日期",
                                            "name": "ksrq"
                                        },
                                        {
                                            "text": "完成日期",
                                            "name": "wcrq"
                                        },
                                        {
                                            "text": "实际产量",
                                            "unit": "kg",
                                            "name": "sjcl"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "text": "成品丝工段产品",
                    "type": "folder",
                    "name": "cpsgdcp",
                    "children": [
                        {
                            "text": "是否定制",
                            "name": "sfdz"
                        },
                        {
                            "text": "丝n",
                            "type": "folder",
                            "name": "sn",
                            "children": [
                                {
                                    "text": "规格",
                                    "type": "folder",
                                    "name": "gg",
                                    "children": [
                                        {
                                            "text": "类别",
                                            "name": "lb"
                                        },
                                        {
                                            "text": "钢号",
                                            "name": "gh"
                                        },
                                        {
                                            "text": "直径",
                                            "unit": "mm",
                                            "name": "zj"
                                        },
                                        {
                                            "text": "强度",
                                            "unit": "MPa",
                                            "name": "qd"
                                        }
                                    ]
                                },
                                {
                                    "text": "是否镀锌",
                                    "name": "sfdx"
                                },
                                {
                                    "text": "计划",
                                    "type": "folder",
                                    "name": "jh",
                                    "children": [
                                        {
                                            "text": "计划产量",
                                            "unit": "m",
                                            "name": "jhcl"
                                        },
                                        {
                                            "text": "开始日期",
                                            "name": "ksrq"
                                        },
                                        {
                                            "text": "完成日期",
                                            "name": "wcrq"
                                        }
                                    ]
                                },
                                {
                                    "text": "实际",
                                    "type": "folder",
                                    "name": "sj",
                                    "children": [
                                        {
                                            "text": "开始日期",
                                            "name": "ksrq"
                                        },
                                        {
                                            "text": "完成日期",
                                            "name": "wcrq"
                                        },
                                        {
                                            "text": "实际产量",
                                            "unit": "m",
                                            "name": "sjcl"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "text": "捻股工段产品",
                    "type": "folder",
                    "name": "nggdcp",
                    "children": [
                        {
                            "text": "是否定制",
                            "name": "sfdz"
                        },
                        {
                            "text": "股n",
                            "type": "folder",
                            "name": "gn",
                            "children": [
                                {
                                    "text": "规格",
                                    "type": "folder",
                                    "name": "gg",
                                    "children": [
                                        {
                                            "text": "结构",
                                            "name": "jg"
                                        },
                                        {
                                            "text": "直径",
                                            "unit": "mm",
                                            "name": "zj"
                                        },
                                        {
                                            "text": "捻向",
                                            "name": "nx"
                                        },
                                        {
                                            "text": "强度",
                                            "unit": "MPa",
                                            "name": "qd"
                                        },
                                        {
                                            "text": "涂油方式",
                                            "name": "tyfs"
                                        },
                                        {
                                            "text": "捻距",
                                            "unit": "mm",
                                            "name": "nj"
                                        }
                                    ]
                                },
                                {
                                    "text": "计划",
                                    "type": "folder",
                                    "name": "jh",
                                    "children": [
                                        {
                                            "text": "计划产量",
                                            "unit": "m",
                                            "name": "jhcl"
                                        },
                                        {
                                            "text": "开始日期",
                                            "name": "ksrq"
                                        },
                                        {
                                            "text": "完成日期",
                                            "name": "wcrq"
                                        }
                                    ]
                                },
                                {
                                    "text": "实际",
                                    "type": "folder",
                                    "name": "sj",
                                    "children": [
                                        {
                                            "text": "开始日期",
                                            "name": "ksrq"
                                        },
                                        {
                                            "text": "完成日期",
                                            "name": "wcrq"
                                        },
                                        {
                                            "text": "实际产量",
                                            "unit": "m",
                                            "name": "sjcl"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "中心股",
                            "type": "folder",
                            "name": "zxg",
                            "children": [
                                {
                                    "text": "规格",
                                    "type": "folder",
                                    "name": "gg",
                                    "children": [
                                        {
                                            "text": "结构",
                                            "name": "jg"
                                        },
                                        {
                                            "text": "直径",
                                            "unit": "mm",
                                            "name": "zj"
                                        },
                                        {
                                            "text": "捻向",
                                            "name": "nx"
                                        },
                                        {
                                            "text": "强度",
                                            "unit": "MPa",
                                            "name": "qd"
                                        },
                                        {
                                            "text": "涂油方式",
                                            "name": "tyfs"
                                        },
                                        {
                                            "text": "捻距",
                                            "unit": "mm",
                                            "name": "nj"
                                        }
                                    ]
                                },
                                {
                                    "text": "计划",
                                    "type": "folder",
                                    "name": "jh",
                                    "children": [
                                        {
                                            "text": "计划产量",
                                            "unit": "m",
                                            "name": "jhcl"
                                        },
                                        {
                                            "text": "开始日期",
                                            "name": "ksrq"
                                        },
                                        {
                                            "text": "完成日期",
                                            "name": "wcrq"
                                        }
                                    ]
                                },
                                {
                                    "text": "实际",
                                    "type": "folder",
                                    "name": "sj",
                                    "children": [
                                        {
                                            "text": "开始日期",
                                            "name": "ksrq"
                                        },
                                        {
                                            "text": "完成日期",
                                            "name": "wcrq"
                                        },
                                        {
                                            "text": "实际产量",
                                            "unit": "m",
                                            "name": "sjcl"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "外股",
                            "type": "folder",
                            "name": "wg",
                            "children": [
                                {
                                    "text": "规格",
                                    "type": "folder",
                                    "name": "gg",
                                    "children": [
                                        {
                                            "text": "结构",
                                            "name": "jg"
                                        },
                                        {
                                            "text": "直径",
                                            "unit": "mm",
                                            "name": "zj"
                                        },
                                        {
                                            "text": "捻向",
                                            "name": "nx"
                                        },
                                        {
                                            "text": "强度",
                                            "unit": "MPa",
                                            "name": "qd"
                                        },
                                        {
                                            "text": "涂油方式",
                                            "name": "tyfs"
                                        },
                                        {
                                            "text": "捻距",
                                            "unit": "mm",
                                            "name": "nj"
                                        }
                                    ]
                                },
                                {
                                    "text": "计划",
                                    "type": "folder",
                                    "name": "jh",
                                    "children": [
                                        {
                                            "text": "计划产量",
                                            "unit": "m",
                                            "name": "jhcl"
                                        },
                                        {
                                            "text": "开始日期",
                                            "name": "ksrq"
                                        },
                                        {
                                            "text": "完成日期",
                                            "name": "wcrq"
                                        }
                                    ]
                                },
                                {
                                    "text": "实际",
                                    "type": "folder",
                                    "name": "sj",
                                    "children": [
                                        {
                                            "text": "开始日期",
                                            "name": "ksrq"
                                        },
                                        {
                                            "text": "完成日期",
                                            "name": "wcrq"
                                        },
                                        {
                                            "text": "实际产量",
                                            "unit": "m",
                                            "name": "sjcl"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "半金属芯",
                            "type": "folder",
                            "name": "bjsx",
                            "children": [
                                {
                                    "text": "规格",
                                    "type": "folder",
                                    "name": "gg",
                                    "children": [
                                        {
                                            "text": "结构",
                                            "name": "jg"
                                        },
                                        {
                                            "text": "直径",
                                            "unit": "mm",
                                            "name": "zj"
                                        },
                                        {
                                            "text": "捻向",
                                            "name": "nx"
                                        },
                                        {
                                            "text": "强度",
                                            "unit": "MPa",
                                            "name": "qd"
                                        },
                                        {
                                            "text": "涂油方式",
                                            "name": "tyfs"
                                        },
                                        {
                                            "text": "捻距",
                                            "unit": "mm",
                                            "name": "nj"
                                        }
                                    ]
                                },
                                {
                                    "text": "计划",
                                    "type": "folder",
                                    "name": "jh",
                                    "children": [
                                        {
                                            "text": "计划产量",
                                            "unit": "m",
                                            "name": "jhcl"
                                        },
                                        {
                                            "text": "开始日期",
                                            "name": "ksrq"
                                        },
                                        {
                                            "text": "完成日期",
                                            "name": "wcrq"
                                        }
                                    ]
                                },
                                {
                                    "text": "实际",
                                    "type": "folder",
                                    "name": "sj",
                                    "children": [
                                        {
                                            "text": "开始日期",
                                            "name": "ksrq"
                                        },
                                        {
                                            "text": "完成日期",
                                            "name": "wcrq"
                                        },
                                        {
                                            "text": "实际产量",
                                            "unit": "m",
                                            "name": "sjcl"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "金属股芯",
                            "type": "folder",
                            "name": "jsgx",
                            "children": [
                                {
                                    "text": "规格",
                                    "type": "folder",
                                    "name": "gg",
                                    "children": [
                                        {
                                            "text": "结构",
                                            "name": "jg"
                                        },
                                        {
                                            "text": "直径",
                                            "unit": "mm",
                                            "name": "zj"
                                        },
                                        {
                                            "text": "捻向",
                                            "name": "nx"
                                        },
                                        {
                                            "text": "强度",
                                            "unit": "MPa",
                                            "name": "qd"
                                        },
                                        {
                                            "text": "涂油方式",
                                            "name": "tyfs"
                                        },
                                        {
                                            "text": "捻距",
                                            "unit": "mm",
                                            "name": "nj"
                                        }
                                    ]
                                },
                                {
                                    "text": "计划",
                                    "type": "folder",
                                    "name": "jh",
                                    "children": [
                                        {
                                            "text": "计划产量",
                                            "unit": "m",
                                            "name": "jhcl"
                                        },
                                        {
                                            "text": "开始日期",
                                            "name": "ksrq"
                                        },
                                        {
                                            "text": "完成日期",
                                            "name": "wcrq"
                                        }
                                    ]
                                },
                                {
                                    "text": "实际",
                                    "type": "folder",
                                    "name": "sj",
                                    "children": [
                                        {
                                            "text": "开始日期",
                                            "name": "ksrq"
                                        },
                                        {
                                            "text": "完成日期",
                                            "name": "wcrq"
                                        },
                                        {
                                            "text": "实际产量",
                                            "unit": "m",
                                            "name": "sjcl"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "text": "合绳工段产品",
                    "type": "folder",
                    "name": "hsgdcp",
                    "children": [
                        {
                            "text": "钢丝绳",
                            "type": "folder",
                            "name": "gss",
                            "children": [
                                {
                                    "text": "金属绳芯",
                                    "type": "folder",
                                    "name": "jssx",
                                    "children": [
                                        {
                                            "text": "规格",
                                            "type": "folder",
                                            "name": "gg",
                                            "children": [
                                                {
                                                    "text": "结构",
                                                    "name": "jg"
                                                },
                                                {
                                                    "text": "直径",
                                                    "unit": "mm",
                                                    "name": "zj"
                                                },
                                                {
                                                    "text": "捻向",
                                                    "name": "nx"
                                                },
                                                {
                                                    "text": "强度",
                                                    "unit": "MPa",
                                                    "name": "qd"
                                                },
                                                {
                                                    "text": "涂油方式",
                                                    "name": "tyfs"
                                                },
                                                {
                                                    "text": "捻距",
                                                    "unit": "mm",
                                                    "name": "nj"
                                                }
                                            ]
                                        },
                                        {
                                            "text": "是否定制",
                                            "name": "sfdz"
                                        },
                                        {
                                            "text": "计划",
                                            "type": "folder",
                                            "name": "jh",
                                            "children": [
                                                {
                                                    "text": "计划产量",
                                                    "unit": "m",
                                                    "name": "jhcl"
                                                },
                                                {
                                                    "text": "开始日期",
                                                    "name": "ksrq"
                                                },
                                                {
                                                    "text": "完成日期",
                                                    "name": "wcrq"
                                                }
                                            ]
                                        },
                                        {
                                            "text": "实际",
                                            "type": "folder",
                                            "name": "sj",
                                            "children": [
                                                {
                                                    "text": "开始日期",
                                                    "name": "ksrq"
                                                },
                                                {
                                                    "text": "完成日期",
                                                    "name": "wcrq"
                                                },
                                                {
                                                    "text": "实际产量",
                                                    "unit": "m",
                                                    "name": "sjcl"
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    "text": "计划",
                                    "type": "folder",
                                    "name": "jh",
                                    "children": [
                                        {
                                            "text": "计划产量",
                                            "unit": "m",
                                            "name": "jhcl"
                                        },
                                        {
                                            "text": "开始日期",
                                            "name": "ksrq"
                                        },
                                        {
                                            "text": "完成日期",
                                            "name": "wcrq"
                                        }
                                    ]
                                },
                                {
                                    "text": "实际",
                                    "type": "folder",
                                    "name": "sj",
                                    "children": [
                                        {
                                            "text": "开始日期",
                                            "name": "ksrq"
                                        },
                                        {
                                            "text": "完成日期",
                                            "name": "wcrq"
                                        },
                                        {
                                            "text": "实际产量",
                                            "unit": "m",
                                            "name": "sjcl"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "name": "坯料工段BOM表",
            "alias": "pl_bom",
            "type": {
                "name": "bom",
                "value": "BOM表"
            },
            "default": false,
            "display": false,
            "selected": false,
            "category": {
                "name": "form",
                "value": "表单"
            },
            "order": 41,
            "perms": [
                "display",
                "operate",
                "approve"
            ],
            "header": [
                {
                    "name": "form_no",
                    "text": "表单编号"
                },
                {
                    "name": "author",
                    "text": "制表"
                },
                {
                    "name": "created",
                    "text": "制表日期"
                },
                {
                    "name": "version",
                    "text": "版本号"
                },
                {
                    "name": "auditor",
                    "text": "审核"
                },
                {
                    "name": "audit_date",
                    "text": "审核日期"
                }
            ],
            "body": [
                {
                    "text": "变更日期",
                    "name": "bgrq"
                },
                {
                    "text": "是否定制",
                    "name": "sfdz"
                },
                {
                    "text": "定制产品编号",
                    "name": "dzcpbh"
                },
                {
                    "text": "主料",
                    "type": "folder",
                    "name": "zl",
                    "children": [
                        {
                            "text": "初始盘条",
                            "type": "folder",
                            "name": "cspt",
                            "children": [
                                {
                                    "text": "钢号",
                                    "name": "gh"
                                },
                                {
                                    "text": "直径",
                                    "unit": "mm",
                                    "name": "zj"
                                },
                                {
                                    "text": "需求总量",
                                    "unit": "kg",
                                    "name": "xqzl"
                                },
                                {
                                    "text": "处理方式",
                                    "name": "clfs"
                                }
                            ]
                        },
                        {
                            "text": "酸后盘条",
                            "type": "folder",
                            "name": "shpt",
                            "children": [
                                {
                                    "text": "钢号",
                                    "name": "gh"
                                },
                                {
                                    "text": "直径",
                                    "unit": "mm",
                                    "name": "zj"
                                },
                                {
                                    "text": "吨耗",
                                    "unit": "%",
                                    "name": "dh"
                                },
                                {
                                    "text": "需求总量",
                                    "name": "xqzl",
                                    "unit": "kg"
                                }
                            ]
                        }
                    ]
                },
                {
                    "text": "辅料",
                    "type": "folder",
                    "name": "fl",
                    "children": [
                        {
                            "text": "去壳辅料",
                            "name": "qkfl",
                            "type": "folder",
                            "children": [
                                {
                                    "text": "硼砂",
                                    "type": "folder",
                                    "name": "ps",
                                    "children": [
                                        {
                                            "text": "型号",
                                            "name": "xh"
                                        },
                                        {
                                            "text": "吨耗",
                                            "unit": "%",
                                            "name": "dh"
                                        },
                                        {
                                            "text": "需求总量",
                                            "name": "xqzl",
                                            "unit": "kg"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "酸洗辅料",
                            "name": "sxfl",
                            "type": "folder",
                            "children": [
                                {
                                    "text": "盐酸",
                                    "type": "folder",
                                    "name": "ys",
                                    "children": [
                                        {
                                            "text": "型号",
                                            "name": "xh"
                                        },
                                        {
                                            "text": "吨耗",
                                            "unit": "%",
                                            "name": "dh"
                                        },
                                        {
                                            "text": "需求总量",
                                            "name": "xqzl",
                                            "unit": "kg"
                                        }
                                    ]
                                },
                                {
                                    "text": "磷化液",
                                    "type": "folder",
                                    "name": "lhy",
                                    "children": [
                                        {
                                            "text": "型号",
                                            "name": "xh"
                                        },
                                        {
                                            "text": "吨耗",
                                            "unit": "%",
                                            "name": "dh"
                                        },
                                        {
                                            "text": "需求总量",
                                            "name": "xqzl",
                                            "unit": "kg"
                                        }
                                    ]
                                },
                                {
                                    "text": "皂化液",
                                    "type": "folder",
                                    "name": "zhy",
                                    "children": [
                                        {
                                            "text": "型号",
                                            "name": "xh"
                                        },
                                        {
                                            "text": "吨耗",
                                            "unit": "%",
                                            "name": "dh"
                                        },
                                        {
                                            "text": "需求总量",
                                            "name": "xqzl",
                                            "unit": "kg"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "粗拉辅料",
                            "name": "clfl",
                            "type": "folder",
                            "children": [
                                {
                                    "text": "润滑液",
                                    "type": "folder",
                                    "name": "rhj",
                                    "children": [
                                        {
                                            "text": "型号",
                                            "name": "xh"
                                        },
                                        {
                                            "text": "吨耗",
                                            "unit": "%",
                                            "name": "dh"
                                        },
                                        {
                                            "text": "需求总量",
                                            "name": "xqzl",
                                            "unit": "kg"
                                        }
                                    ]
                                },
                                {
                                    "text": "拉丝粉",
                                    "type": "folder",
                                    "name": "lsf",
                                    "children": [
                                        {
                                            "text": "型号",
                                            "name": "xh"
                                        },
                                        {
                                            "text": "吨耗",
                                            "unit": "%",
                                            "name": "dh"
                                        },
                                        {
                                            "text": "需求总量",
                                            "name": "xqzl",
                                            "unit": "kg"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ],
            "valid": true
        },
        {
            "name": "热处理&镀锌工段BOM表",
            "alias": "rcl_bom",
            "type": {
                "name": "bom",
                "value": "BOM表"
            },
            "default": false,
            "display": false,
            "selected": false,
            "category": {
                "name": "form",
                "value": "表单"
            },
            "order": 42,
            "perms": [
                "display",
                "operate",
                "approve"
            ],
            "header": [
                {
                    "name": "form_no",
                    "text": "表单编号"
                },
                {
                    "name": "author",
                    "text": "制表"
                },
                {
                    "name": "created",
                    "text": "制表日期"
                },
                {
                    "name": "version",
                    "text": "版本号"
                },
                {
                    "name": "auditor",
                    "text": "审核"
                },
                {
                    "name": "audit_date",
                    "text": "审核日期"
                }
            ],
            "body": [
                {
                    "text": "变更日期",
                    "name": "bgrq"
                },
                {
                    "text": "是否定制",
                    "name": "sfdz"
                },
                {
                    "text": "定制产品编号",
                    "name": "dzcpbh"
                },
                {
                    "text": "主料",
                    "type": "folder",
                    "name": "zl",
                    "children": [
                        {
                            "text": "待处理料",
                            "type": "folder",
                            "name": "dcll",
                            "children": [
                                {
                                    "text": "钢号",
                                    "name": "gh"
                                },
                                {
                                    "text": "直径",
                                    "unit": "mm",
                                    "name": "zj"
                                },
                                {
                                    "text": "强度",
                                    "unit": "MPa",
                                    "name": "qd"
                                },
                                {
                                    "text": "是否热处理",
                                    "name": "sfrcl"
                                },
                                {
                                    "text": "热处理方式",
                                    "name": "rclfs"
                                },
                                {
                                    "text": "是否镀锌",
                                    "name": "sfdx"
                                },
                                {
                                    "text": "吨耗",
                                    "unit": "%",
                                    "name": "dh"
                                },
                                {
                                    "text": "需求总量",
                                    "unit": "kg",
                                    "name": "xqzl"
                                }
                            ]
                        }
                    ]
                },
                {
                    "text": "辅料",
                    "type": "folder",
                    "name": "fl",
                    "children": [
                        {
                            "text": "水浴辅料",
                            "name": "syfl",
                            "type": "folder",
                            "children": [
                                {
                                    "text": "盐酸",
                                    "type": "folder",
                                    "name": "ys",
                                    "children": [
                                        {
                                            "text": "型号",
                                            "name": "xh"
                                        },
                                        {
                                            "text": "吨耗",
                                            "unit": "%",
                                            "name": "dh"
                                        },
                                        {
                                            "text": "需求总量",
                                            "name": "xqzl",
                                            "unit": "kg"
                                        }
                                    ]
                                },
                                {
                                    "text": "脱脂溶剂",
                                    "type": "folder",
                                    "name": "tzrj",
                                    "children": [
                                        {
                                            "text": "型号",
                                            "name": "xh"
                                        },
                                        {
                                            "text": "吨耗",
                                            "unit": "%",
                                            "name": "dh"
                                        },
                                        {
                                            "text": "需求总量",
                                            "name": "xqzl",
                                            "unit": "kg"
                                        }
                                    ]
                                },
                                {
                                    "text": "水浴添加剂",
                                    "type": "folder",
                                    "name": "sytjj",
                                    "children": [
                                        {
                                            "text": "型号",
                                            "name": "xh"
                                        },
                                        {
                                            "text": "吨耗",
                                            "unit": "%",
                                            "name": "dh"
                                        },
                                        {
                                            "text": "需求总量",
                                            "name": "xqzl",
                                            "unit": "kg"
                                        }
                                    ]
                                },
                                {
                                    "text": "磷化液",
                                    "type": "folder",
                                    "name": "lhy",
                                    "children": [
                                        {
                                            "text": "型号",
                                            "name": "xh"
                                        },
                                        {
                                            "text": "吨耗",
                                            "unit": "%",
                                            "name": "dh"
                                        },
                                        {
                                            "text": "需求总量",
                                            "name": "xqzl",
                                            "unit": "kg"
                                        }
                                    ]
                                },
                                {
                                    "text": "皂化液",
                                    "type": "folder",
                                    "name": "zhy",
                                    "children": [
                                        {
                                            "text": "型号",
                                            "name": "xh"
                                        },
                                        {
                                            "text": "吨耗",
                                            "unit": "%",
                                            "name": "dh"
                                        },
                                        {
                                            "text": "需求总量",
                                            "name": "xqzl",
                                            "unit": "kg"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "铅浴辅料",
                            "name": "qyfl",
                            "type": "folder",
                            "children": [
                                {
                                    "text": "盐酸",
                                    "type": "folder",
                                    "name": "ys",
                                    "children": [
                                        {
                                            "text": "型号",
                                            "name": "xh"
                                        },
                                        {
                                            "text": "吨耗",
                                            "unit": "%",
                                            "name": "dh"
                                        },
                                        {
                                            "text": "需求总量",
                                            "name": "xqzl",
                                            "unit": "kg"
                                        }
                                    ]
                                },
                                {
                                    "text": "磷化液",
                                    "type": "folder",
                                    "name": "lhy",
                                    "children": [
                                        {
                                            "text": "型号",
                                            "name": "xh"
                                        },
                                        {
                                            "text": "吨耗",
                                            "unit": "%",
                                            "name": "dh"
                                        },
                                        {
                                            "text": "需求总量",
                                            "name": "xqzl",
                                            "unit": "kg"
                                        }
                                    ]
                                },
                                {
                                    "text": "皂化液",
                                    "type": "folder",
                                    "name": "zhy",
                                    "children": [
                                        {
                                            "text": "型号",
                                            "name": "xh"
                                        },
                                        {
                                            "text": "吨耗",
                                            "unit": "%",
                                            "name": "dh"
                                        },
                                        {
                                            "text": "需求总量",
                                            "name": "xqzl",
                                            "unit": "kg"
                                        }
                                    ]
                                },
                                {
                                    "text": "覆盖剂",
                                    "type": "folder",
                                    "name": "fgj",
                                    "children": [
                                        {
                                            "text": "型号",
                                            "name": "xh"
                                        },
                                        {
                                            "text": "吨耗",
                                            "unit": "%",
                                            "name": "dh"
                                        },
                                        {
                                            "text": "需求总量",
                                            "name": "xqzl",
                                            "unit": "kg"
                                        }
                                    ]
                                },
                                {
                                    "text": "铅块",
                                    "type": "folder",
                                    "name": "qk",
                                    "children": [
                                        {
                                            "text": "型号",
                                            "name": "xh"
                                        },
                                        {
                                            "text": "吨耗",
                                            "unit": "%",
                                            "name": "dh"
                                        },
                                        {
                                            "text": "需求总量",
                                            "name": "xqzl",
                                            "unit": "kg"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "镀锌辅料",
                            "name": "dxfl",
                            "type": "folder",
                            "children": [
                                {
                                    "text": "助溶剂",
                                    "type": "folder",
                                    "name": "zrj",
                                    "children": [
                                        {
                                            "text": "型号",
                                            "name": "xh"
                                        },
                                        {
                                            "text": "吨耗",
                                            "unit": "%",
                                            "name": "dh"
                                        },
                                        {
                                            "text": "需求总量",
                                            "name": "xqzl",
                                            "unit": "kg"
                                        }
                                    ]
                                },
                                {
                                    "text": "锌粉",
                                    "type": "folder",
                                    "name": "xf",
                                    "children": [
                                        {
                                            "text": "型号",
                                            "name": "xh"
                                        },
                                        {
                                            "text": "吨耗",
                                            "unit": "%",
                                            "name": "dh"
                                        },
                                        {
                                            "text": "需求总量",
                                            "name": "xqzl",
                                            "unit": "kg"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "name": "成品丝工段BOM表",
            "alias": "cps_bom",
            "type": {
                "name": "bom",
                "value": "BOM表"
            },
            "default": false,
            "display": false,
            "selected": false,
            "category": {
                "name": "form",
                "value": "表单"
            },
            "order": 43,
            "perms": [
                "display",
                "operate",
                "approve"
            ],
            "header": [
                {
                    "name": "form_no",
                    "text": "表单编号"
                },
                {
                    "name": "author",
                    "text": "制表"
                },
                {
                    "name": "created",
                    "text": "制表日期"
                },
                {
                    "name": "version",
                    "text": "版本号"
                },
                {
                    "name": "auditor",
                    "text": "审核"
                },
                {
                    "name": "audit_date",
                    "text": "审核日期"
                }
            ],
            "body": [
                {
                    "text": "变更日期",
                    "name": "bgrq"
                },
                {
                    "text": "是否定制",
                    "name": "sfdz"
                },
                {
                    "text": "定制产品编号",
                    "name": "dzcpbh"
                },
                {
                    "text": "主料",
                    "type": "folder",
                    "name": "zl",
                    "children": [
                        {
                            "text": "坯料",
                            "type": "folder",
                            "name": "pl",
                            "children": [
                                {
                                    "text": "类别",
                                    "name": "lb"
                                },
                                {
                                    "text": "钢号",
                                    "name": "gh"
                                },
                                {
                                    "text": "直径",
                                    "unit": "mm",
                                    "name": "zj"
                                },
                                {
                                    "text": "强度",
                                    "name": "qd",
                                    "unit": "MPa"
                                },
                                {
                                    "text": "需求总量",
                                    "unit": "kg",
                                    "name": "xqzl"
                                },
                                {
                                    "text": "库存量",
                                    "name": "kcl",
                                    "unit": "kg"
                                }
                            ]
                        }
                    ]
                },
                {
                    "text": "辅料",
                    "type": "folder",
                    "name": "fl",
                    "children": [
                        {
                            "text": "润滑液辅料",
                            "name": "rhyfl",
                            "type": "folder",
                            "children": [
                                {
                                    "text": "润滑液",
                                    "type": "folder",
                                    "name": "rhj",
                                    "children": [
                                        {
                                            "text": "型号",
                                            "name": "xh"
                                        },
                                        {
                                            "text": "吨耗",
                                            "unit": "%",
                                            "name": "dh"
                                        },
                                        {
                                            "text": "需求总量",
                                            "name": "xqzl",
                                            "unit": "kg"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "拉丝粉辅料",
                            "name": "lsffl",
                            "type": "folder",
                            "children": [
                                {
                                    "text": "拉丝粉",
                                    "type": "folder",
                                    "name": "lsf",
                                    "children": [
                                        {
                                            "text": "型号",
                                            "name": "xh"
                                        },
                                        {
                                            "text": "吨耗",
                                            "unit": "%",
                                            "name": "dh"
                                        },
                                        {
                                            "text": "需求总量",
                                            "name": "xqzl",
                                            "unit": "kg"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "name": "捻股工段BOM表",
            "alias": "ng_bom",
            "type": {
                "name": "bom",
                "value": "BOM表"
            },
            "default": false,
            "display": false,
            "selected": false,
            "category": {
                "name": "form",
                "value": "表单"
            },
            "order": 44,
            "perms": [
                "display",
                "operate",
                "approve"
            ],
            "header": [
                {
                    "name": "form_no",
                    "text": "表单编号"
                },
                {
                    "name": "author",
                    "text": "制表"
                },
                {
                    "name": "created",
                    "text": "制表日期"
                },
                {
                    "name": "version",
                    "text": "版本号"
                },
                {
                    "name": "auditor",
                    "text": "审核"
                },
                {
                    "name": "audit_date",
                    "text": "审核日期"
                }
            ],
            "body": [
                {
                    "text": "变更日期",
                    "name": "bgrq"
                },
                {
                    "text": "是否定制",
                    "name": "sfdz"
                },
                {
                    "text": "定制产品编号",
                    "name": "dzcpbh"
                },
                {
                    "text": "主料",
                    "type": "folder",
                    "name": "zl",
                    "children": [
                        {
                            "text": "成品丝",
                            "type": "folder",
                            "name": "cps",
                            "children": [
                                {
                                    "text": "类别",
                                    "name": "lb"
                                },
                                {
                                    "text": "钢号",
                                    "name": "gh"
                                },
                                {
                                    "text": "直径",
                                    "unit": "mm",
                                    "name": "zj"
                                },
                                {
                                    "text": "强度",
                                    "unit": "MPa",
                                    "name": "qd"
                                },
                                {
                                    "text": "需求总量",
                                    "name": "xqzl",
                                    "unit": "kg"
                                },
                                {
                                    "text": "需求段长",
                                    "name": "xqdc",
                                    "unit": "m"
                                },
                                {
                                    "text": "需求单件段数",
                                    "name": "xqdjds"
                                },
                                {
                                    "text": "需求单件米长",
                                    "unit": "m",
                                    "name": "xqdjmc"
                                },
                                {
                                    "text": "需求件数",
                                    "name": "xqjs"
                                },
                                {
                                    "text": "需求总米长",
                                    "unit": "m",
                                    "name": "xqzmc"
                                },
                                {
                                    "text": "匹配库存量",
                                    "unit": "件",
                                    "name": "ppkcl"
                                }
                            ]
                        }
                    ]
                },
                {
                    "text": "辅料",
                    "type": "folder",
                    "name": "fl",
                    "children": [
                        {
                            "text": "纤维芯辅料",
                            "name": "xwxfl",
                            "type": "folder",
                            "children": [
                                {
                                    "text": "纤维芯",
                                    "type": "folder",
                                    "name": "xwx",
                                    "children": [
                                        {
                                            "text": "类别",
                                            "name": "lb"
                                        },
                                        {
                                            "text": "直径",
                                            "unit": "mm",
                                            "name": "zj"
                                        },
                                        {
                                            "text": "捻向",
                                            "name": "nx"
                                        },
                                        {
                                            "text": "含油率",
                                            "unit": "%",
                                            "name": "hyl"
                                        },
                                        {
                                            "text": "总米长",
                                            "unit": "m",
                                            "name": "zmc"
                                        },
                                        {
                                            "text": "吨耗",
                                            "unit": "%",
                                            "name": "dh"
                                        },
                                        {
                                            "text": "需求总量",
                                            "name": "xqzl",
                                            "unit": "kg"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "油脂辅料",
                            "name": "yzfl",
                            "type": "folder",
                            "children": [
                                {
                                    "text": "油脂",
                                    "type": "folder",
                                    "name": "yz",
                                    "children": [
                                        {
                                            "text": "型号",
                                            "name": "xh"
                                        },
                                        {
                                            "text": "涂油方式",
                                            "name": "tyfs"
                                        },
                                        {
                                            "text": "吨耗",
                                            "unit": "%",
                                            "name": "dh"
                                        },
                                        {
                                            "text": "需求总量",
                                            "name": "xqzl",
                                            "unit": "kg"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "name": "合绳工段BOM表",
            "alias": "hs_bom",
            "type": {
                "name": "bom",
                "value": "BOM表"
            },
            "default": false,
            "display": false,
            "selected": false,
            "category": {
                "name": "form",
                "value": "表单"
            },
            "order": 45,
            "perms": [
                "display",
                "operate",
                "approve"
            ],
            "header": [
                {
                    "name": "form_no",
                    "text": "表单编号"
                },
                {
                    "name": "author",
                    "text": "制表"
                },
                {
                    "name": "created",
                    "text": "制表日期"
                },
                {
                    "name": "version",
                    "text": "版本号"
                },
                {
                    "name": "auditor",
                    "text": "审核"
                },
                {
                    "name": "audit_date",
                    "text": "审核日期"
                }
            ],
            "body": [
                {
                    "text": "变更日期",
                    "name": "bgrq"
                },
                {
                    "text": "是否定制",
                    "name": "sfdz"
                },
                {
                    "text": "定制产品编号",
                    "name": "dzcpbh"
                },
                {
                    "text": "主料",
                    "type": "folder",
                    "name": "zl",
                    "children": [
                        {
                            "text": "股用料",
                            "type": "folder",
                            "name": "gyl",
                            "children": [
                                {
                                    "text": "类别",
                                    "name": "lb"
                                },
                                {
                                    "text": "股结构",
                                    "name": "gjg"
                                },
                                {
                                    "text": "直径",
                                    "unit": "mm",
                                    "name": "zj"
                                },
                                {
                                    "text": "强度",
                                    "unit": "Mpa",
                                    "name": "qd"
                                },
                                {
                                    "text": "捻向",
                                    "name": "nx"
                                },
                                {
                                    "text": "涂油方式",
                                    "name": "tyfs"
                                },
                                {
                                    "text": "捻距",
                                    "unit": "mm",
                                    "name": "nj"
                                },
                                {
                                    "text": "段长",
                                    "unit": "m",
                                    "name": "dc"
                                },
                                {
                                    "text": "单件段数",
                                    "name": "djds"
                                },
                                {
                                    "text": "单件米长",
                                    "unit": "m",
                                    "name": "djmc"
                                },
                                {
                                    "text": "需求件数",
                                    "name": "xqjs"
                                },
                                {
                                    "text": "需求总米长",
                                    "unit": "m",
                                    "name": "xqzmc"
                                },
                                {
                                    "text": "匹配库存量",
                                    "unit": "件",
                                    "name": "ppkcl"
                                }
                            ]
                        },
                        {
                            "text": "金属芯料",
                            "type": "folder",
                            "name": "jsxl",
                            "children": [
                                {
                                    "text": "规格",
                                    "name": "gg"
                                },
                                {
                                    "text": "直径",
                                    "unit": "mm",
                                    "name": "zj"
                                },
                                {
                                    "text": "强度",
                                    "unit": "Mpa",
                                    "name": "qd"
                                },
                                {
                                    "text": "捻向",
                                    "name": "nx"
                                },
                                {
                                    "text": "涂油方式",
                                    "name": "tyfs"
                                },
                                {
                                    "text": "段长",
                                    "unit": "m",
                                    "name": "dc"
                                },
                                {
                                    "text": "单件段数",
                                    "name": "djds"
                                },
                                {
                                    "text": "单件米长",
                                    "unit": "m",
                                    "name": "djmc"
                                },
                                {
                                    "text": "需求件数",
                                    "name": "xqjs"
                                },
                                {
                                    "text": "需求总米长",
                                    "unit": "m",
                                    "name": "xqzmc"
                                },
                                {
                                    "text": "匹配库存量",
                                    "unit": "件",
                                    "name": "ppkcl"
                                }
                            ]
                        },
                        {
                            "text": "半金属芯料",
                            "type": "folder",
                            "name": "bjsxl",
                            "children": [
                                {
                                    "text": "直径",
                                    "unit": "mm",
                                    "name": "zj"
                                },
                                {
                                    "text": "段长",
                                    "unit": "m",
                                    "name": "dc"
                                },
                                {
                                    "text": "单件段数",
                                    "name": "djds"
                                },
                                {
                                    "text": "单件米长",
                                    "unit": "m",
                                    "name": "djmc"
                                },
                                {
                                    "text": "需求件数",
                                    "name": "xqjs"
                                },
                                {
                                    "text": "需求总米长",
                                    "unit": "m",
                                    "name": "xqzmc"
                                },
                                {
                                    "text": "匹配库存量",
                                    "unit": "件",
                                    "name": "ppkcl"
                                }
                            ]
                        }
                    ]
                },
                {
                    "text": "辅料",
                    "type": "folder",
                    "name": "fl",
                    "children": [
                        {
                            "text": "纤维芯辅料",
                            "name": "xwxfl",
                            "type": "folder",
                            "children": [
                                {
                                    "text": "纤维芯",
                                    "type": "folder",
                                    "name": "xwx",
                                    "children": [
                                        {
                                            "text": "类别",
                                            "name": "lb"
                                        },
                                        {
                                            "text": "直径",
                                            "unit": "mm",
                                            "name": "zj"
                                        },
                                        {
                                            "text": "捻向",
                                            "name": "nx"
                                        },
                                        {
                                            "text": "含油率",
                                            "unit": "%",
                                            "name": "hyl"
                                        },
                                        {
                                            "text": "总米长",
                                            "unit": "m",
                                            "name": "zmc"
                                        },
                                        {
                                            "text": "吨耗",
                                            "unit": "%",
                                            "name": "dh"
                                        },
                                        {
                                            "text": "需求总量",
                                            "name": "xqzl",
                                            "unit": "kg"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "油脂辅料",
                            "name": "yzfl",
                            "type": "folder",
                            "children": [
                                {
                                    "text": "油脂",
                                    "type": "folder",
                                    "name": "yz",
                                    "children": [
                                        {
                                            "text": "型号",
                                            "name": "xh"
                                        },
                                        {
                                            "text": "涂油方式",
                                            "name": "tyfs"
                                        },
                                        {
                                            "text": "吨耗",
                                            "unit": "%",
                                            "name": "dh"
                                        },
                                        {
                                            "text": "需求总量",
                                            "name": "xqzl",
                                            "unit": "kg"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "收线轮盘",
                            "name": "sxlp",
                            "type": "folder",
                            "children": [
                                {
                                    "text": "收线轮盘",
                                    "type": "folder",
                                    "name": "sxlp",
                                    "children": [
                                        {
                                            "text": "类别",
                                            "name": "lb"
                                        },
                                        {
                                            "text": "规格",
                                            "name": "gg"
                                        },
                                        {
                                            "text": "需求个数",
                                            "name": "xqgs"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "name": "坯料工段生产计划",
            "alias": "pl_plan",
            "type": {
                "name": "production_plan",
                "value": "生产计划"
            },
            "default": false,
            "display": false,
            "selected": false,
            "category": {
                "name": "form",
                "value": "表单"
            },
            "order": 51,
            "perms": [
                "display",
                "operate",
                "approve"
            ],
            "header": [
                {
                    "name": "form_no",
                    "text": "表单编号"
                },
                {
                    "name": "author",
                    "text": "制表"
                },
                {
                    "name": "created",
                    "text": "制表日期"
                },
                {
                    "name": "version",
                    "text": "版本号"
                },
                {
                    "name": "auditor",
                    "text": "审核"
                },
                {
                    "name": "audit_date",
                    "text": "审核日期"
                }
            ],
            "body": [
                {
                    "text": "工段制造号",
                    "name": "gdzzh"
                },
                {
                    "text": "是否定制",
                    "name": "sfdz"
                },
                {
                    "text": "定制产品编号",
                    "name": "dzcpbh"
                },
                {
                    "text": "盘条是否热处理",
                    "name": "ptsfrcl"
                },
                {
                    "text": "热处理方式",
                    "name": "rclfs"
                },
                {
                    "text": "工段产品",
                    "type": "folder",
                    "name": "gdcp",
                    "children": [
                        {
                            "text": "类别",
                            "name": "lb"
                        },
                        {
                            "text": "钢号",
                            "name": "gh"
                        },
                        {
                            "text": "直径",
                            "unit": "mm",
                            "name": "zj"
                        },
                        {
                            "text": "强度",
                            "unit": "MPa",
                            "name": "qd"
                        },
                        {
                            "text": "收线工字轮型号",
                            "name": "sxgzlxh"
                        },
                        {
                            "text": "是否热处理",
                            "name": "sfrcl"
                        },
                        {
                            "text": "热处理方式",
                            "name": "rclfs"
                        },
                        {
                            "text": "是否需要二次拉拔",
                            "name": "sfxyeclb"
                        },
                        {
                            "text": "是否镀锌",
                            "name": "sfdx"
                        }
                    ]
                },
                {
                    "text": "进度计划",
                    "type": "folder",
                    "name": "jdjh",
                    "children": [
                        {
                            "text": "计划生产开始日期",
                            "name": "jhscksrq"
                        },
                        {
                            "text": "计划生产完成日期",
                            "name": "jhscwcrq"
                        },
                        {
                            "text": "计划生产天数",
                            "name": "jhscts"
                        }
                    ]
                },
                {
                    "text": "产量计划",
                    "type": "folder",
                    "name": "cljh",
                    "children": [
                        {
                            "text": "计划产量",
                            "unit": "kg",
                            "name": "jhcl"
                        },
                        {
                            "text": "日计划产量",
                            "unit": "kg",
                            "name": "rjhcl"
                        },
                        {
                            "text": "日收线件数",
                            "name": "rsxjs"
                        },
                        {
                            "text": "实际日产量",
                            "unit": "kg",
                            "name": "sjrcl",
                            "children": [
                                {
                                    "text": "第(n)天产量",
                                    "unit": "kg",
                                    "repeat": "n",
                                    "name": "dtcln"
                                }
                            ]
                        },
                        {
                            "text": "累计完成产量",
                            "unit": "kg",
                            "name": "ljwccl"
                        },
                        {
                            "text": "未完成产量",
                            "unit": "kg",
                            "name": "wwccl"
                        }
                    ]
                }
            ]
        },
        {
            "name": "热处理&镀锌工段生产计划",
            "alias": "rcl_plan",
            "type": {
                "name": "production_plan",
                "value": "生产计划"
            },
            "default": false,
            "display": false,
            "selected": false,
            "category": {
                "name": "form",
                "value": "表单"
            },
            "order": 52,
            "perms": [
                "display",
                "operate",
                "approve"
            ],
            "header": [
                {
                    "name": "form_no",
                    "text": "表单编号"
                },
                {
                    "name": "author",
                    "text": "制表"
                },
                {
                    "name": "created",
                    "text": "制表日期"
                },
                {
                    "name": "version",
                    "text": "版本号"
                },
                {
                    "name": "auditor",
                    "text": "审核"
                },
                {
                    "name": "audit_date",
                    "text": "审核日期"
                }
            ],
            "body": [
                {
                    "text": "工段制造号",
                    "name": "gdzzh"
                },
                {
                    "text": "是否定制",
                    "name": "sfdz"
                },
                {
                    "text": "定制产品编号",
                    "name": "dzcpbh"
                },
                {
                    "text": "是否热处理",
                    "name": "sfrcl"
                },
                {
                    "text": "热处理方式",
                    "name": "rclfs"
                },
                {
                    "text": "是否镀锌",
                    "name": "sfdx"
                },
                {
                    "text": "工段产品",
                    "type": "folder",
                    "name": "gdcp",
                    "children": [
                        {
                            "text": "钢号",
                            "name": "gh"
                        },
                        {
                            "text": "直径",
                            "unit": "mm",
                            "name": "zj"
                        },
                        {
                            "text": "强度",
                            "unit": "MPa",
                            "name": "qd"
                        },
                        {
                            "text": "收线工字轮型号",
                            "name": "sxgzlxh"
                        },
                        {
                            "text": "收线花篮架型号",
                            "name": "sxhljxh"
                        }
                    ]
                },
                {
                    "text": "进度计划",
                    "type": "folder",
                    "name": "jdjh",
                    "children": [
                        {
                            "text": "计划生产开始日期",
                            "name": "jhscksrq"
                        },
                        {
                            "text": "计划生产完成日期",
                            "name": "jhscwcrq"
                        },
                        {
                            "text": "计划生产天数",
                            "name": "jhscts"
                        }
                    ]
                },
                {
                    "text": "产量计划",
                    "type": "folder",
                    "name": "cljh",
                    "children": [
                        {
                            "text": "计划产量",
                            "unit": "kg",
                            "name": "jhcl"
                        },
                        {
                            "text": "日计划产量",
                            "unit": "kg",
                            "name": "rjhcl"
                        },
                        {
                            "text": "日收线工字轮件数",
                            "name": "rsxgzljs"
                        },
                        {
                            "text": "日收线花篮架件数",
                            "name": "rsxhljjs"
                        },
                        {
                            "text": "累计完成产量",
                            "unit": "kg",
                            "name": "ljwccl"
                        },
                        {
                            "text": "未完成产量",
                            "unit": "kg",
                            "name": "wwccl"
                        }
                    ]
                }
            ]
        },
        {
            "name": "成品丝工段生产计划",
            "alias": "cps_plan",
            "type": {
                "name": "production_plan",
                "value": "生产计划"
            },
            "default": false,
            "display": false,
            "selected": false,
            "category": {
                "name": "form",
                "value": "表单"
            },
            "order": 53,
            "perms": [
                "display",
                "operate",
                "approve"
            ],
            "header": [
                {
                    "name": "form_no",
                    "text": "表单编号"
                },
                {
                    "name": "author",
                    "text": "制表"
                },
                {
                    "name": "created",
                    "text": "制表日期"
                },
                {
                    "name": "version",
                    "text": "版本号"
                },
                {
                    "name": "auditor",
                    "text": "审核"
                },
                {
                    "name": "audit_date",
                    "text": "审核日期"
                }
            ],
            "body": [
                {
                    "text": "工段制造号",
                    "name": "gdzzh"
                },
                {
                    "text": "是否定制",
                    "name": "sfdz"
                },
                {
                    "text": "定制产品编号",
                    "name": "dzcpbh"
                },
                {
                    "text": "是否镀锌",
                    "name": "sfdx"
                },
                {
                    "text": "工段产品",
                    "type": "folder",
                    "name": "gdcp",
                    "children": [
                        {
                            "text": "类别",
                            "name": "lb"
                        },
                        {
                            "text": "钢号",
                            "name": "gh"
                        },
                        {
                            "text": "直径",
                            "unit": "mm",
                            "name": "zj"
                        },
                        {
                            "text": "强度",
                            "unit": "MPa",
                            "name": "qd"
                        }
                    ]
                },
                {
                    "text": "进度计划",
                    "type": "folder",
                    "name": "jdjh",
                    "children": [
                        {
                            "text": "计划生产开始日期",
                            "name": "jhscksrq"
                        },
                        {
                            "text": "计划生产完成日期",
                            "name": "jhscwcrq"
                        },
                        {
                            "text": "计划生产天数",
                            "name": "jhscts"
                        }
                    ]
                },
                {
                    "text": "产量计划",
                    "type": "folder",
                    "name": "cljh",
                    "children": [
                        {
                            "text": "计划产量",
                            "unit": "m",
                            "name": "jhcl"
                        },
                        {
                            "text": "日计划产量",
                            "unit": "m",
                            "name": "rjhcl"
                        },
                        {
                            "text": "日计划重量",
                            "unit": "kg",
                            "name": "rjhzl"
                        },
                        {
                            "text": "日收线件数",
                            "name": "rsxjs"
                        },
                        {
                            "text": "实际日产量",
                            "type": "folder",
                            "unit": "m",
                            "name": "sjrcl",
                            "children": [
                                {
                                    "text": "第(n)天",
                                    "repeat": "n",
                                    "name": "dtn"
                                }
                            ]
                        },
                        {
                            "text": "累计完成产量",
                            "unit": "m",
                            "name": "ljwccl"
                        },
                        {
                            "text": "未完成产量",
                            "unit": "m",
                            "name": "wwccl"
                        }
                    ]
                },
                {
                    "text": "收线计划",
                    "type": "folder",
                    "name": "sxjh",
                    "children": [
                        {
                            "text": "工艺米长系数",
                            "name": "gymcxs"
                        },
                        {
                            "text": "丝收线米长",
                            "unit": "m",
                            "name": "ssxmc"
                        },
                        {
                            "text": "丝收线段数",
                            "name": "ssxds"
                        },
                        {
                            "text": "丝收线件数",
                            "name": "ssxjs"
                        },
                        {
                            "text": "收线工字轮型号",
                            "name": "sxgzlxh"
                        },
                        {
                            "text": "丝总米长",
                            "unit": "m",
                            "name": "szmc"
                        },
                        {
                            "text": "总重量",
                            "unit": "kg",
                            "name": "zzl"
                        }
                    ]
                }
            ]
        },
        {
            "name": "捻股工段生产计划",
            "alias": "ng_production_plan",
            "type": {
                "name": "production_plan",
                "value": "生产计划"
            },
            "default": false,
            "display": false,
            "selected": false,
            "category": {
                "name": "form",
                "value": "表单"
            },
            "order": 54,
            "perms": [
                "display",
                "operate",
                "approve"
            ],
            "header": [
                {
                    "name": "form_no",
                    "text": "表单编号"
                },
                {
                    "name": "author",
                    "text": "制表"
                },
                {
                    "name": "created",
                    "text": "制表日期"
                },
                {
                    "name": "version",
                    "text": "版本号"
                },
                {
                    "name": "auditor",
                    "text": "审核"
                },
                {
                    "name": "audit_date",
                    "text": "审核日期"
                }
            ],
            "body": [
                {
                    "text": "下达日期",
                    "name": "xdrq"
                },
                {
                    "text": "工段制造号",
                    "name": "gdzzh"
                },
                {
                    "text": "是否定制",
                    "name": "sfdz"
                },
                {
                    "text": "产品编号",
                    "name": "cpbh"
                },
                {
                    "text": "车间",
                    "name": "cj"
                },
                {
                    "text": "捻股前用料",
                    "name": "ngqyl",
                    "type": "folder",
                    "children": [
                        {
                            "text": "中间品",
                            "name": "zjp",
                            "type": "folder",
                            "children": [
                                {
                                    "text": "规格",
                                    "name": "gg",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "结构",
                                            "name": "jg"
                                        },
                                        {
                                            "text": "直径",
                                            "name": "zj",
                                            "unit": "mm"
                                        },
                                        {
                                            "text": "捻向",
                                            "name": "nx"
                                        },
                                        {
                                            "text": "强度",
                                            "name": "qd",
                                            "unit": "Mpa"
                                        },
                                        {
                                            "text": "涂油方式",
                                            "name": "tyfs"
                                        },
                                        {
                                            "text": "捻距",
                                            "name": "nj",
                                            "unit": "mm"
                                        },
                                        {
                                            "text": "表面状态",
                                            "name": "bmzt"
                                        }
                                    ]
                                },
                                {
                                    "text": "用量",
                                    "name": "yl",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "用量n",
                                            "name": "yln",
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "段长",
                                                    "name": "dc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "段数",
                                                    "name": "ds"
                                                },
                                                {
                                                    "text": "单件米长",
                                                    "name": "djmc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "件数",
                                                    "name": "js"
                                                },
                                                {
                                                    "text": "总米长",
                                                    "name": "zmc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "工字轮型号",
                                                    "name": "gzlxh"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "第n层丝",
                            "name": "sdcn",
                            "type": "folder",
                            "children": [
                                {
                                    "text": "丝n",
                                    "name": "sn",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "规格",
                                            "name": "gg",
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "类别",
                                                    "name": "lb"
                                                },
                                                {
                                                    "text": "直径",
                                                    "name": "zj",
                                                    "unit": "mm"
                                                },
                                                {
                                                    "text": "强度",
                                                    "name": "qd",
                                                    "unit": "Mpa"
                                                }
                                            ]
                                        },
                                        {
                                            "text": "用量",
                                            "name": "yl",
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "根数",
                                                    "name": "gs"
                                                },
                                                {
                                                    "text": "用量n",
                                                    "name": "yln",
                                                    "type": "folder",
                                                    "children": [
                                                        {
                                                            "text": "段长",
                                                            "name": "dc",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "段数",
                                                            "name": "ds"
                                                        },
                                                        {
                                                            "text": "单件米长",
                                                            "name": "djmc",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "件数",
                                                            "name": "js"
                                                        },
                                                        {
                                                            "text": "总米长",
                                                            "name": "zmc",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "工字轮型号",
                                                            "name": "gzlxh"
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "丝n",
                            "name": "sn",
                            "type": "folder",
                            "children": [
                                {
                                    "text": "规格",
                                    "name": "gg",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "类别",
                                            "name": "lb"
                                        },
                                        {
                                            "text": "直径",
                                            "name": "zj",
                                            "unit": "mm"
                                        },
                                        {
                                            "text": "强度",
                                            "name": "qd",
                                            "unit": "Mpa"
                                        }
                                    ]
                                },
                                {
                                    "text": "用量",
                                    "name": "yl",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "根数",
                                            "name": "gs"
                                        },
                                        {
                                            "text": "用量n",
                                            "name": "yln",
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "段长",
                                                    "name": "dc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "段数",
                                                    "name": "ds"
                                                },
                                                {
                                                    "text": "单件米长",
                                                    "name": "djmc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "件数",
                                                    "name": "js"
                                                },
                                                {
                                                    "text": "总米长",
                                                    "name": "zmc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "工字轮型号",
                                                    "name": "gzlxh"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "中心丝",
                            "name": "zxs",
                            "type": "folder",
                            "children": [
                                {
                                    "text": "规格",
                                    "name": "gg",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "类别",
                                            "name": "lb"
                                        },
                                        {
                                            "text": "直径",
                                            "name": "zj",
                                            "unit": "mm"
                                        },
                                        {
                                            "text": "强度",
                                            "name": "qd",
                                            "unit": "Mpa"
                                        }
                                    ]
                                },
                                {
                                    "text": "用量",
                                    "name": "yl",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "用量n",
                                            "name": "yln",
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "段长",
                                                    "name": "dc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "段数",
                                                    "name": "ds"
                                                },
                                                {
                                                    "text": "单件米长",
                                                    "name": "djmc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "件数",
                                                    "name": "js"
                                                },
                                                {
                                                    "text": "总米长",
                                                    "name": "zmc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "工字轮型号",
                                                    "name": "gzlxh"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "外钢丝",
                            "name": "wgs",
                            "type": "folder",
                            "children": [
                                {
                                    "text": "丝n",
                                    "name": "sn",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "规格",
                                            "name": "gg",
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "类别",
                                                    "name": "lb"
                                                },
                                                {
                                                    "text": "直径",
                                                    "name": "zj",
                                                    "unit": "mm"
                                                },
                                                {
                                                    "text": "强度",
                                                    "name": "qd",
                                                    "unit": "Mpa"
                                                }
                                            ]
                                        },
                                        {
                                            "text": "用量",
                                            "name": "yl",
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "根数",
                                                    "name": "gs"
                                                },
                                                {
                                                    "text": "用量n",
                                                    "name": "yln",
                                                    "type": "folder",
                                                    "children": [
                                                        {
                                                            "text": "段长",
                                                            "name": "dc",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "段数",
                                                            "name": "ds"
                                                        },
                                                        {
                                                            "text": "单件米长",
                                                            "name": "djmc",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "件数",
                                                            "name": "js"
                                                        },
                                                        {
                                                            "text": "总米长",
                                                            "name": "zmc",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "工字轮型号",
                                                            "name": "gzlxh"
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "纤维芯",
                            "name": "xwx",
                            "type": "folder",
                            "children": [
                                {
                                    "text": "规格",
                                    "name": "gg",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "类别",
                                            "name": "lb"
                                        },
                                        {
                                            "text": "直径",
                                            "name": "zj",
                                            "unit": "mm"
                                        },
                                        {
                                            "text": "捻向",
                                            "name": "nx"
                                        },
                                        {
                                            "text": "含油率",
                                            "name": "hyl",
                                            "unit": "%"
                                        }
                                    ]
                                },
                                {
                                    "text": "用量",
                                    "name": "yl",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "工艺米长系数",
                                            "name": "gymcxs"
                                        },
                                        {
                                            "text": "总米长",
                                            "name": "zmc",
                                            "unit": "m"
                                        },
                                        {
                                            "text": "吨耗",
                                            "name": "dh",
                                            "unit": "%"
                                        },
                                        {
                                            "text": "重量",
                                            "name": "zl",
                                            "unit": "kg"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "油脂",
                            "name": "yz",
                            "type": "folder",
                            "children": [
                                {
                                    "text": "规格",
                                    "name": "gg",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "型号",
                                            "name": "xh"
                                        }
                                    ]
                                },
                                {
                                    "text": "用量",
                                    "name": "yl",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "涂油方式",
                                            "name": "tyfs"
                                        },
                                        {
                                            "text": "吨耗",
                                            "name": "dh",
                                            "unit": "%"
                                        },
                                        {
                                            "text": "重量",
                                            "name": "zl",
                                            "unit": "kg"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "text": "捻股后",
                    "name": "ngh",
                    "type": "folder",
                    "children": [
                        {
                            "text": "工段产品",
                            "name": "gdcp",
                            "type": "folder",
                            "children": [
                                {
                                    "text": "类别",
                                    "name": "lb"
                                },
                                {
                                    "text": "结构",
                                    "name": "jg"
                                },
                                {
                                    "text": "直径",
                                    "name": "zj",
                                    "unit": "mm"
                                },
                                {
                                    "text": "捻向",
                                    "name": "nx"
                                },
                                {
                                    "text": "强度",
                                    "name": "qd",
                                    "unit": "Mpa"
                                },
                                {
                                    "text": "涂油方式",
                                    "name": "tyfs"
                                },
                                {
                                    "text": "捻距",
                                    "name": "nj",
                                    "unit": "mm"
                                },
                                {
                                    "text": "表面状态",
                                    "name": "bmzt"
                                },
                                {
                                    "text": "特殊要求",
                                    "name": "tsyq"
                                },
                                {
                                    "text": "用途",
                                    "name": "yt"
                                }
                            ]
                        },
                        {
                            "text": "收线方式",
                            "type": "folder",
                            "name": "sxfs",
                            "children": [
                                {
                                    "text": "收线方式n",
                                    "name": "sxfsn",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "段长",
                                            "name": "dc",
                                            "unit": "m"
                                        },
                                        {
                                            "text": "段数",
                                            "name": "ds"
                                        },
                                        {
                                            "text": "单件米长",
                                            "name": "djmc",
                                            "unit": "m"
                                        },
                                        {
                                            "text": "件数",
                                            "name": "js"
                                        },
                                        {
                                            "text": "总米长",
                                            "name": "zmc",
                                            "unit": "m"
                                        },
                                        {
                                            "text": "工字轮型号",
                                            "name": "gzlxh"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "text": "进度计划",
                    "name": "jdjh",
                    "type": "folder",
                    "children": [
                        {
                            "text": "计划生产开始日期",
                            "name": "jhscksrq"
                        },
                        {
                            "text": "计划生产结束日期",
                            "name": "jhscjsrq"
                        },
                        {
                            "text": "计划生产天数",
                            "name": "jhscts"
                        }
                    ]
                },
                {
                    "text": "产量计划",
                    "name": "cljh",
                    "type": "folder",
                    "children": [
                        {
                            "text": "计划产量",
                            "name": "jhcl",
                            "unit": "m"
                        },
                        {
                            "text": "日计划产量",
                            "name": "rjhcl",
                            "unit": "m"
                        }
                    ]
                },
                {
                    "text": "实际产量",
                    "name": "sjcl",
                    "unit": "m",
                    "type": "folder",
                    "children": [
                        {
                            "text": "累计完成产量",
                            "name": "ljwccl",
                            "unit": "m",
                            "type": "folder",
                            "children": [
                                {
                                    "text": "总件数",
                                    "name": "zjs"
                                },
                                {
                                    "text": "总米长",
                                    "name": "zmc",
                                    "unit": "m"
                                }
                            ]
                        },
                        {
                            "text": "未完成产量",
                            "name": "wwccl",
                            "unit": "m",
                            "type": "folder",
                            "children": [
                                {
                                    "text": "总件数",
                                    "name": "zjs"
                                },
                                {
                                    "text": "总米长",
                                    "name": "zmc",
                                    "unit": "m"
                                }
                            ]
                        },
                        {
                            "text": "不合格品",
                            "name": "bhgp",
                            "type": "folder",
                            "children": [
                                {
                                    "text": "总件数",
                                    "name": "zjs"
                                },
                                {
                                    "text": "总米长",
                                    "name": "zmc",
                                    "unit": "m"
                                }
                            ]
                        },
                        {
                            "text": "日产量",
                            "name": "rcl",
                            "type": "folder",
                            "children": [
                                {
                                    "text": "某日产量",
                                    "name": "mrcl",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "总件数",
                                            "name": "zjs"
                                        },
                                        {
                                            "text": "总米长",
                                            "name": "zmc",
                                            "unit": "m"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "name": "合绳工段生产计划",
            "alias": "hs_production_plan",
            "type": {
                "name": "production_plan",
                "value": "生产计划"
            },
            "default": false,
            "display": false,
            "selected": false,
            "category": {
                "name": "form",
                "value": "表单"
            },
            "order": 55,
            "perms": [
                "display",
                "operate",
                "approve"
            ],
            "header": [
                {
                    "name": "form_no",
                    "text": "表单编号"
                },
                {
                    "name": "author",
                    "text": "制表"
                },
                {
                    "name": "created",
                    "text": "制表日期"
                },
                {
                    "name": "version",
                    "text": "版本号"
                },
                {
                    "name": "auditor",
                    "text": "审核"
                },
                {
                    "name": "audit_date",
                    "text": "审核日期"
                }
            ],
            "body": [
                {
                    "text": "下达日期",
                    "name": "xdrq"
                },
                {
                    "text": "工段制造号",
                    "name": "gdzzh"
                },
                {
                    "text": "是否定制",
                    "name": "sfdz"
                },
                {
                    "text": "产品编号",
                    "name": "cpbh"
                },
                {
                    "text": "车间",
                    "name": "cj"
                },
                {
                    "text": "合绳前用料",
                    "name": "hsqyl",
                    "type": "folder",
                    "children": [
                        {
                            "text": "中间品",
                            "name": "zjp",
                            "type": "folder",
                            "children": [
                                {
                                    "text": "规格",
                                    "name": "gg",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "结构",
                                            "name": "jg"
                                        },
                                        {
                                            "text": "直径",
                                            "name": "zj",
                                            "unit": "mm"
                                        },
                                        {
                                            "text": "捻向",
                                            "name": "nx"
                                        },
                                        {
                                            "text": "强度",
                                            "name": "qd",
                                            "unit": "Mpa"
                                        },
                                        {
                                            "text": "涂油方式",
                                            "name": "tyfs"
                                        },
                                        {
                                            "text": "捻距",
                                            "name": "nj",
                                            "unit": "mm"
                                        },
                                        {
                                            "text": "表面状态",
                                            "name": "bmzt"
                                        }
                                    ]
                                },
                                {
                                    "text": "用量",
                                    "name": "yl",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "用量n",
                                            "name": "yln",
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "段长",
                                                    "name": "dc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "段数",
                                                    "name": "ds"
                                                },
                                                {
                                                    "text": "单件米长",
                                                    "name": "djmc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "件数",
                                                    "name": "js"
                                                },
                                                {
                                                    "text": "总米长",
                                                    "name": "zmc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "工字轮型号",
                                                    "name": "gzlxh"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "金属绳芯",
                            "name": "jssx",
                            "type": "folder",
                            "children": [
                                {
                                    "text": "规格",
                                    "name": "gg",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "结构",
                                            "name": "jg"
                                        },
                                        {
                                            "text": "直径",
                                            "name": "zj",
                                            "unit": "mm"
                                        },
                                        {
                                            "text": "捻向",
                                            "name": "nx"
                                        },
                                        {
                                            "text": "强度",
                                            "name": "qd",
                                            "unit": "Mpa"
                                        },
                                        {
                                            "text": "涂油方式",
                                            "name": "tyfs"
                                        },
                                        {
                                            "text": "捻距",
                                            "name": "nj",
                                            "unit": "mm"
                                        },
                                        {
                                            "text": "表面状态",
                                            "name": "bmzt"
                                        }
                                    ]
                                },
                                {
                                    "text": "用量",
                                    "name": "yl",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "用量n",
                                            "name": "yln",
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "段长",
                                                    "name": "dc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "段数",
                                                    "name": "ds"
                                                },
                                                {
                                                    "text": "单件米长",
                                                    "name": "djmc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "件数",
                                                    "name": "js"
                                                },
                                                {
                                                    "text": "总米长",
                                                    "name": "zmc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "工字轮型号",
                                                    "name": "gzlxh"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "金属股芯",
                            "name": "jsgx",
                            "type": "folder",
                            "children": [
                                {
                                    "text": "规格",
                                    "name": "gg",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "结构",
                                            "name": "jg"
                                        },
                                        {
                                            "text": "直径",
                                            "name": "zj",
                                            "unit": "mm"
                                        },
                                        {
                                            "text": "捻向",
                                            "name": "nx"
                                        },
                                        {
                                            "text": "强度",
                                            "name": "qd",
                                            "unit": "Mpa"
                                        },
                                        {
                                            "text": "涂油方式",
                                            "name": "tyfs"
                                        },
                                        {
                                            "text": "捻距",
                                            "name": "nj",
                                            "unit": "mm"
                                        },
                                        {
                                            "text": "表面状态",
                                            "name": "bmzt"
                                        }
                                    ]
                                },
                                {
                                    "text": "用量",
                                    "name": "yl",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "用量n",
                                            "name": "yln",
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "段长",
                                                    "name": "dc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "段数",
                                                    "name": "ds"
                                                },
                                                {
                                                    "text": "单件米长",
                                                    "name": "djmc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "件数",
                                                    "name": "js"
                                                },
                                                {
                                                    "text": "总米长",
                                                    "name": "zmc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "工字轮型号",
                                                    "name": "gzlxh"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "半金属芯",
                            "name": "bjsx",
                            "type": "folder",
                            "children": [
                                {
                                    "text": "规格",
                                    "name": "gg",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "结构",
                                            "name": "jg"
                                        },
                                        {
                                            "text": "直径",
                                            "name": "zj",
                                            "unit": "mm"
                                        },
                                        {
                                            "text": "捻向",
                                            "name": "nx"
                                        },
                                        {
                                            "text": "强度",
                                            "name": "qd",
                                            "unit": "Mpa"
                                        },
                                        {
                                            "text": "涂油方式",
                                            "name": "tyfs"
                                        },
                                        {
                                            "text": "捻距",
                                            "name": "nj",
                                            "unit": "mm"
                                        },
                                        {
                                            "text": "表面状态",
                                            "name": "bmzt"
                                        }
                                    ]
                                },
                                {
                                    "text": "用量",
                                    "name": "yl",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "用量n",
                                            "name": "yln",
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "段长",
                                                    "name": "dc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "段数",
                                                    "name": "ds"
                                                },
                                                {
                                                    "text": "单件米长",
                                                    "name": "djmc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "件数",
                                                    "name": "js"
                                                },
                                                {
                                                    "text": "总米长",
                                                    "name": "zmc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "工字轮型号",
                                                    "name": "gzlxh"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "中心股",
                            "name": "zxg",
                            "type": "folder",
                            "children": [
                                {
                                    "text": "规格",
                                    "name": "gg",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "结构",
                                            "name": "jg"
                                        },
                                        {
                                            "text": "直径",
                                            "name": "zj",
                                            "unit": "mm"
                                        },
                                        {
                                            "text": "捻向",
                                            "name": "nx"
                                        },
                                        {
                                            "text": "强度",
                                            "name": "qd",
                                            "unit": "Mpa"
                                        },
                                        {
                                            "text": "涂油方式",
                                            "name": "tyfs"
                                        },
                                        {
                                            "text": "捻距",
                                            "name": "nj",
                                            "unit": "mm"
                                        },
                                        {
                                            "text": "表面状态",
                                            "name": "bmzt"
                                        }
                                    ]
                                },
                                {
                                    "text": "用量",
                                    "name": "yl",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "用量n",
                                            "name": "yln",
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "段长",
                                                    "name": "dc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "段数",
                                                    "name": "ds"
                                                },
                                                {
                                                    "text": "单件米长",
                                                    "name": "djmc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "件数",
                                                    "name": "js"
                                                },
                                                {
                                                    "text": "总米长",
                                                    "name": "zmc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "工字轮型号",
                                                    "name": "gzlxh"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "外股",
                            "name": "wg",
                            "type": "folder",
                            "children": [
                                {
                                    "text": "规格",
                                    "name": "gg",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "结构",
                                            "name": "jg"
                                        },
                                        {
                                            "text": "直径",
                                            "name": "zj",
                                            "unit": "mm"
                                        },
                                        {
                                            "text": "捻向",
                                            "name": "nx"
                                        },
                                        {
                                            "text": "强度",
                                            "name": "qd",
                                            "unit": "Mpa"
                                        },
                                        {
                                            "text": "涂油方式",
                                            "name": "tyfs"
                                        },
                                        {
                                            "text": "捻距",
                                            "name": "nj",
                                            "unit": "mm"
                                        },
                                        {
                                            "text": "表面状态",
                                            "name": "bmzt"
                                        }
                                    ]
                                },
                                {
                                    "text": "用量",
                                    "name": "yl",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "个数",
                                            "name": "gs"
                                        },
                                        {
                                            "text": "用量n",
                                            "name": "yln",
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "段长",
                                                    "name": "dc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "段数",
                                                    "name": "ds"
                                                },
                                                {
                                                    "text": "单件米长",
                                                    "name": "djmc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "件数",
                                                    "name": "js"
                                                },
                                                {
                                                    "text": "总米长",
                                                    "name": "zmc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "工字轮型号",
                                                    "name": "gzlxh"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "纤维芯",
                            "name": "xwx",
                            "type": "folder",
                            "children": [
                                {
                                    "text": "规格",
                                    "name": "gg",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "类别",
                                            "name": "lb"
                                        },
                                        {
                                            "text": "直径",
                                            "name": "zj",
                                            "unit": "mm"
                                        },
                                        {
                                            "text": "捻向",
                                            "name": "nx"
                                        },
                                        {
                                            "text": "含油率",
                                            "name": "hyl",
                                            "unit": "%"
                                        }
                                    ]
                                },
                                {
                                    "text": "用量",
                                    "name": "yl",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "工艺米长系数",
                                            "name": "gymcxs"
                                        },
                                        {
                                            "text": "总米长",
                                            "name": "zmc",
                                            "unit": "m"
                                        },
                                        {
                                            "text": "吨耗",
                                            "name": "dh",
                                            "unit": "%"
                                        },
                                        {
                                            "text": "重量",
                                            "name": "zl",
                                            "unit": "kg"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "油脂",
                            "name": "yz",
                            "type": "folder",
                            "children": [
                                {
                                    "text": "规格",
                                    "name": "gg",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "型号",
                                            "name": "xh"
                                        }
                                    ]
                                },
                                {
                                    "text": "用量",
                                    "name": "yl",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "涂油方式",
                                            "name": "tyfs"
                                        },
                                        {
                                            "text": "吨耗",
                                            "name": "dh",
                                            "unit": "%"
                                        },
                                        {
                                            "text": "重量",
                                            "name": "zl",
                                            "unit": "kg"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "第n层股",
                            "name": "gdcn",
                            "type": "folder",
                            "children": [
                                {
                                    "text": "股n",
                                    "name": "gn",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "规格",
                                            "name": "gg",
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "结构",
                                                    "name": "jg"
                                                },
                                                {
                                                    "text": "直径",
                                                    "name": "zj",
                                                    "unit": "mm"
                                                },
                                                {
                                                    "text": "捻向",
                                                    "name": "nx"
                                                },
                                                {
                                                    "text": "强度",
                                                    "name": "qd",
                                                    "unit": "Mpa"
                                                },
                                                {
                                                    "text": "涂油方式",
                                                    "name": "tyfs"
                                                },
                                                {
                                                    "text": "捻距",
                                                    "name": "nj",
                                                    "unit": "mm"
                                                },
                                                {
                                                    "text": "表面状态",
                                                    "name": "bmzt"
                                                }
                                            ]
                                        },
                                        {
                                            "text": "用量",
                                            "name": "yl",
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "个数",
                                                    "name": "gs"
                                                },
                                                {
                                                    "text": "用量n",
                                                    "name": "yln",
                                                    "type": "folder",
                                                    "children": [
                                                        {
                                                            "text": "段长",
                                                            "name": "dc",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "段数",
                                                            "name": "ds"
                                                        },
                                                        {
                                                            "text": "单件米长",
                                                            "name": "djmc",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "件数",
                                                            "name": "js"
                                                        },
                                                        {
                                                            "text": "总米长",
                                                            "name": "zmc",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "工字轮型号",
                                                            "name": "gzlxh"
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "text": "合绳后",
                    "name": "hsh",
                    "type": "folder",
                    "children": [
                        {
                            "text": "工段产品",
                            "name": "gdcp",
                            "type": "folder",
                            "children": [
                                {
                                    "text": "类别",
                                    "name": "lb"
                                },
                                {
                                    "text": "结构",
                                    "name": "jg"
                                },
                                {
                                    "text": "规格",
                                    "name": "gg"
                                },
                                {
                                    "text": "直径",
                                    "name": "zj",
                                    "unit": "mm"
                                },
                                {
                                    "text": "捻向",
                                    "name": "nx"
                                },
                                {
                                    "text": "强度",
                                    "name": "qd",
                                    "unit": "Mpa"
                                },
                                {
                                    "text": "涂油方式",
                                    "name": "tyfs"
                                },
                                {
                                    "text": "捻距",
                                    "name": "nj",
                                    "unit": "mm"
                                },
                                {
                                    "text": "表面状态",
                                    "name": "bmzt"
                                },
                                {
                                    "text": "特殊要求",
                                    "name": "tsyq"
                                },
                                {
                                    "text": "用途",
                                    "name": "yt"
                                }
                            ]
                        },
                        {
                            "text": "收线方式",
                            "type": "folder",
                            "name": "sxfs",
                            "children": [
                                {
                                    "text": "收线方式n",
                                    "name": "sxfsn",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "段长",
                                            "name": "dc",
                                            "unit": "m"
                                        },
                                        {
                                            "text": "段数",
                                            "name": "ds"
                                        },
                                        {
                                            "text": "单件米长",
                                            "name": "djmc",
                                            "unit": "m"
                                        },
                                        {
                                            "text": "件数",
                                            "name": "js"
                                        },
                                        {
                                            "text": "总米长",
                                            "name": "zmc",
                                            "unit": "m"
                                        },
                                        {
                                            "text": "工字轮型号",
                                            "name": "gzlxh"
                                        },
                                        {
                                            "text": "包装方式",
                                            "name": "bzfs"
                                        },
                                        {
                                            "text": "轮盘型号",
                                            "name": "lpxh"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "text": "进度计划",
                    "name": "jdjh",
                    "type": "folder",
                    "children": [
                        {
                            "text": "计划生产开始日期",
                            "name": "jhscksrq"
                        },
                        {
                            "text": "计划生产结束日期",
                            "name": "jhscjsrq"
                        },
                        {
                            "text": "计划生产天数",
                            "name": "jhscts"
                        }
                    ]
                },
                {
                    "text": "产量计划",
                    "name": "cljh",
                    "type": "folder",
                    "children": [
                        {
                            "text": "计划产量",
                            "name": "jhcl",
                            "unit": "m"
                        },
                        {
                            "text": "日计划产量",
                            "name": "rjhcl",
                            "unit": "m"
                        }
                    ]
                },
                {
                    "text": "实际产量",
                    "name": "sjcl",
                    "unit": "m",
                    "type": "folder",
                    "children": [
                        {
                            "text": "累计完成产量",
                            "name": "ljwccl",
                            "unit": "m",
                            "type": "folder",
                            "children": [
                                {
                                    "text": "总件数",
                                    "name": "zjs"
                                },
                                {
                                    "text": "总米长",
                                    "name": "zmc",
                                    "unit": "m"
                                }
                            ]
                        },
                        {
                            "text": "未完成产量",
                            "name": "wwccl",
                            "unit": "m",
                            "type": "folder",
                            "children": [
                                {
                                    "text": "总件数",
                                    "name": "zjs"
                                },
                                {
                                    "text": "总米长",
                                    "name": "zmc",
                                    "unit": "m"
                                }
                            ]
                        },
                        {
                            "text": "不合格品",
                            "name": "bhgp",
                            "type": "folder",
                            "children": [
                                {
                                    "text": "总件数",
                                    "name": "zjs"
                                },
                                {
                                    "text": "总米长",
                                    "name": "zmc",
                                    "unit": "m"
                                }
                            ]
                        },
                        {
                            "text": "日产量",
                            "name": "rcl",
                            "type": "folder",
                            "children": [
                                {
                                    "text": "某日产量",
                                    "name": "mrcl",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "总件数",
                                            "name": "zjs"
                                        },
                                        {
                                            "text": "总米长",
                                            "name": "zmc",
                                            "unit": "m"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        },

        {
            "name": "坯料工段酸洗工序生产任务单",
            "alias": "plsx_task",
            "type": {
                "name": "production_plan",
                "value": "生产计划"
            },
            "default": false,
            "display": false,
            "selected": false,
            "category": {
                "name": "form",
                "value": "表单"
            },
            "order": 61,
            "perms": [
                "display",
                "operate",
                "approve"
            ],
            "header": [
                {
                    "name": "form_no",
                    "text": "表单编号"
                },
                {
                    "name": "author",
                    "text": "制表"
                },
                {
                    "name": "created",
                    "text": "制表日期"
                },
                {
                    "name": "version",
                    "text": "版本号"
                },
                {
                    "name": "auditor",
                    "text": "审核"
                },
                {
                    "name": "audit_date",
                    "text": "审核日期"
                }
            ],
            "body": [
                {
                    "text": "工段制造号",
                    "name": "gdzzh"
                },
                {
                    "text": "是否定制",
                    "name": "sfdz"
                },
                {
                    "text": "定制产品编号",
                    "name": "dzcpbh"
                },
                {
                    "text": "处理前",
                    "type": "folder",
                    "name": "clq",
                    "children": [
                        {
                            "text": "用料",
                            "type": "folder",
                            "name": "yl",
                            "children": [
                                {
                                    "text": "钢号",
                                    "name": "gh"
                                },
                                {
                                    "text": "直径",
                                    "unit": "mm",
                                    "name": "zj"
                                },
                                {
                                    "text": "吨耗",
                                    "unit": "%",
                                    "name": "dh"
                                },
                                {
                                    "text": "需求总量",
                                    "unit": "kg",
                                    "name": "xqzl"
                                }
                            ]
                        }
                    ]
                },
                {
                    "text": "处理后",
                    "type": "folder",
                    "name": "clh",
                    "children": [
                        {
                            "text": "工段产品",
                            "type": "folder",
                            "name": "gdcp",
                            "children": [
                                {
                                    "text": "钢号",
                                    "name": "gh"
                                },
                                {
                                    "text": "直径",
                                    "unit": "mm",
                                    "name": "zj"
                                }
                            ]
                        }
                    ]
                },
                {
                    "text": "进度计划",
                    "type": "folder",
                    "name": "jdjh",
                    "children": [
                        {
                            "text": "计划生产开始日期",
                            "name": "jhscksrq"
                        },
                        {
                            "text": "计划生产完成日期",
                            "name": "jhscwcrq"
                        },
                        {
                            "text": "计划生产天数",
                            "name": "jhscts"
                        }
                    ]
                },
                {
                    "text": "产量计划",
                    "type": "folder",
                    "name": "cljh",
                    "children": [
                        {
                            "text": "计划产量",
                            "unit": "kg",
                            "name": "jhcl"
                        },
                        {
                            "text": "日计划产量",
                            "unit": "kg",
                            "name": "rjhcl"
                        },
                        {
                            "text": "日收线件数",
                            "name": "rsxjs"
                        },
                        {
                            "text": "累计完成产量",
                            "unit": "kg",
                            "name": "ljwccl"
                        },
                        {
                            "text": "未完成产量",
                            "unit": "kg",
                            "name": "wwccl"
                        },
                        {
                            "text": "第(n)天",
                            "type": "folder",
                            "name": "dtn",
                            "repeat": "n",
                            "children": [
                                {
                                    "text": "实际产量",
                                    "unit": "kg",
                                    "name": "sjcl"
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "name": "坯料工段粗拉工序生产任务单",
            "alias": "plcl_task",
            "type": {
                "name": "production_plan",
                "value": "生产计划"
            },
            "default": false,
            "display": false,
            "selected": false,
            "category": {
                "name": "form",
                "value": "表单"
            },
            "order": 62,
            "perms": [
                "display",
                "operate",
                "approve"
            ],
            "header": [
                {
                    "name": "form_no",
                    "text": "表单编号"
                },
                {
                    "name": "author",
                    "text": "制表"
                },
                {
                    "name": "created",
                    "text": "制表日期"
                },
                {
                    "name": "version",
                    "text": "版本号"
                },
                {
                    "name": "auditor",
                    "text": "审核"
                },
                {
                    "name": "audit_date",
                    "text": "审核日期"
                }
            ],
            "body": [
                {
                    "text": "工段制造号",
                    "name": "gdzzh"
                },
                {
                    "text": "是否定制",
                    "name": "sfdz"
                },
                {
                    "text": "定制产品编号",
                    "name": "dzcpbh"
                },
                {
                    "text": "进线",
                    "type": "folder",
                    "name": "jx",
                    "children": [
                        {
                            "text": "用料",
                            "type": "folder",
                            "name": "yl",
                            "children": [
                                {
                                    "text": "钢号",
                                    "name": "gh"
                                },
                                {
                                    "text": "直径",
                                    "unit": "mm",
                                    "name": "zj"
                                },
                                {
                                    "text": "吨耗",
                                    "unit": "%",
                                    "name": "dh"
                                },
                                {
                                    "text": "需求总量",
                                    "unit": "kg",
                                    "name": "xqzl"
                                }
                            ]
                        }
                    ]
                },
                {
                    "text": "出线",
                    "type": "folder",
                    "name": "cx",
                    "children": [
                        {
                            "text": "工段产品",
                            "type": "folder",
                            "name": "gdcp",
                            "children": [
                                {
                                    "text": "钢号",
                                    "name": "gh"
                                },
                                {
                                    "text": "直径",
                                    "unit": "mm",
                                    "name": "zj"
                                },
                                {
                                    "text": "强度",
                                    "unit": "MPa",
                                    "name": "qd"
                                },
                                {
                                    "text": "工艺米长系数",
                                    "name": "gymcxs"
                                },
                                {
                                    "text": "收线米长",
                                    "unit": "m",
                                    "name": "sxmc"
                                },
                                {
                                    "text": "收线件数",
                                    "name": "sxjs"
                                },
                                {
                                    "text": "收线总米长",
                                    "unit": "m",
                                    "name": "sxzmc"
                                },
                                {
                                    "text": "收线工字轮型号",
                                    "name": "sxgzlxh"
                                },
                                {
                                    "text": "是否热处理",
                                    "name": "sfrcl"
                                },
                                {
                                    "text": "热处理方式",
                                    "name": "rclfs"
                                },
                                {
                                    "text": "是否需要二次拉拔",
                                    "name": "sfxyeclb"
                                },
                                {
                                    "text": "是否镀锌",
                                    "name": "sfdx"
                                }
                            ]
                        }
                    ]
                },
                {
                    "text": "进度计划",
                    "type": "folder",
                    "name": "jdjh",
                    "children": [
                        {
                            "text": "计划生产开始日期",
                            "name": "jhscksrq"
                        },
                        {
                            "text": "计划生产完成日期",
                            "name": "jhscwcrq"
                        },
                        {
                            "text": "计划生产天数",
                            "name": "jhscts"
                        }
                    ]
                },
                {
                    "text": "产量计划",
                    "type": "folder",
                    "name": "cljh",
                    "children": [
                        {
                            "text": "计划产量",
                            "unit": "kg",
                            "name": "jhcl"
                        },
                        {
                            "text": "日计划产量",
                            "unit": "kg",
                            "name": "rjhcl"
                        },
                        {
                            "text": "累计完成产量",
                            "unit": "kg",
                            "name": "ljwccl"
                        },
                        {
                            "text": "未完成产量",
                            "unit": "kg",
                            "name": "wwccl"
                        },
                        {
                            "text": "第(n)天",
                            "type": "folder",
                            "name": "dtn",
                            "repeat": "n",
                            "children": [
                                {
                                    "text": "实际产量",
                                    "unit": "kg",
                                    "name": "sjcl"
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "name": "热处理&镀锌工段生产任务单",
            "alias": "rcldx_task",
            "type": {
                "name": "production_plan",
                "value": "生产计划"
            },
            "default": false,
            "display": false,
            "selected": false,
            "category": {
                "name": "form",
                "value": "表单"
            },
            "order": 63,
            "perms": [
                "display",
                "operate",
                "approve"
            ],
            "header": [
                {
                    "name": "form_no",
                    "text": "表单编号"
                },
                {
                    "name": "author",
                    "text": "制表"
                },
                {
                    "name": "created",
                    "text": "制表日期"
                },
                {
                    "name": "version",
                    "text": "版本号"
                },
                {
                    "name": "auditor",
                    "text": "审核"
                },
                {
                    "name": "audit_date",
                    "text": "审核日期"
                }
            ],
            "body": [
                {
                    "text": "工段制造号",
                    "name": "gdzzh"
                },
                {
                    "text": "是否定制",
                    "name": "sfdz"
                },
                {
                    "text": "定制产品编号",
                    "name": "dzcpbh"
                },
                {
                    "text": "是否热处理",
                    "name": "sfrcl"
                },
                {
                    "text": "热处理方式",
                    "name": "rclfs"
                },
                {
                    "text": "是否镀锌",
                    "name": "sfdx"
                },
                {
                    "text": "处理前",
                    "type": "folder",
                    "name": "clq",
                    "children": [
                        {
                            "text": "用料",
                            "type": "folder",
                            "name": "yl",
                            "children": [
                                {
                                    "text": "钢号",
                                    "name": "gh"
                                },
                                {
                                    "text": "直径",
                                    "unit": "mm",
                                    "name": "zj"
                                },
                                {
                                    "text": "强度",
                                    "unit": "MPa",
                                    "name": "qd"
                                },
                                {
                                    "text": "收线工字轮型号",
                                    "name": "sxgzlxh"
                                },
                                {
                                    "text": "吨耗",
                                    "unit": "%",
                                    "name": "dh"
                                },
                                {
                                    "text": "需求总量",
                                    "unit": "kg",
                                    "name": "xqzl"
                                }
                            ]
                        }
                    ]
                },
                {
                    "text": "处理后",
                    "type": "folder",
                    "name": "clh",
                    "children": [
                        {
                            "text": "工段产品",
                            "type": "folder",
                            "name": "gdcp",
                            "children": [
                                {
                                    "text": "钢号",
                                    "name": "gh"
                                },
                                {
                                    "text": "直径",
                                    "unit": "mm",
                                    "name": "zj"
                                },
                                {
                                    "text": "强度",
                                    "unit": "MPa",
                                    "name": "qd"
                                },
                                {
                                    "text": "收线工字轮型号",
                                    "name": "sxgzlxh"
                                },
                                {
                                    "text": "收线花篮架型号",
                                    "name": "sxhljxh"
                                }
                            ]
                        }
                    ]
                },
                {
                    "text": "进度计划",
                    "type": "folder",
                    "name": "jdjh",
                    "children": [
                        {
                            "text": "计划生产开始日期",
                            "name": "jhscksrq"
                        },
                        {
                            "text": "计划生产完成日期",
                            "name": "jhscwcrq"
                        },
                        {
                            "text": "计划生产天数",
                            "name": "jhscts"
                        }
                    ]
                },
                {
                    "text": "产量计划",
                    "type": "folder",
                    "name": "cljh",
                    "children": [
                        {
                            "text": "计划产量",
                            "unit": "kg",
                            "name": "jhcl"
                        },
                        {
                            "text": "日计划产量",
                            "unit": "kg",
                            "name": "rjhcl"
                        },
                        {
                            "text": "累计完成产量",
                            "unit": "kg",
                            "name": "ljwccl"
                        },
                        {
                            "text": "未完成产量",
                            "unit": "kg",
                            "name": "wwccl"
                        },
                        {
                            "text": "第(n)天",
                            "type": "folder",
                            "name": "dtn",
                            "repeat": "n",
                            "children": [
                                {
                                    "text": "实际产量",
                                    "unit": "kg",
                                    "name": "sjcl"
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "name": "成品丝工段生产任务单",
            "alias": "cps_task",
            "type": {
                "name": "production_plan",
                "value": "生产计划"
            },
            "default": false,
            "display": false,
            "selected": false,
            "category": {
                "name": "form",
                "value": "表单"
            },
            "order": 64,
            "perms": [
                "display",
                "operate",
                "approve"
            ],
            "header": [
                {
                    "name": "form_no",
                    "text": "表单编号"
                },
                {
                    "name": "author",
                    "text": "制表"
                },
                {
                    "name": "created",
                    "text": "制表日期"
                },
                {
                    "name": "version",
                    "text": "版本号"
                },
                {
                    "name": "auditor",
                    "text": "审核"
                },
                {
                    "name": "audit_date",
                    "text": "审核日期"
                }
            ],
            "body": [
                {
                    "text": "工段制造号",
                    "name": "gdzzh"
                },
                {
                    "text": "是否定制",
                    "name": "sfdz"
                },
                {
                    "text": "定制产品编号",
                    "name": "dzcpbh"
                },
                {
                    "text": "进线",
                    "type": "folder",
                    "name": "jx",
                    "children": [
                        {
                            "text": "用料",
                            "type": "folder",
                            "name": "yl",
                            "children": [
                                {
                                    "text": "类别",
                                    "name": "lb"
                                },
                                {
                                    "text": "钢号",
                                    "name": "gh"
                                },
                                {
                                    "text": "直径",
                                    "unit": "mm",
                                    "name": "zj"
                                },
                                {
                                    "text": "强度",
                                    "unit": "MPa",
                                    "name": "qd"
                                },
                                {
                                    "text": "收线工字轮型号",
                                    "name": "sxgzlxh"
                                },
                                {
                                    "text": "收线花篮架型号",
                                    "name": "sxhljxh"
                                },
                                {
                                    "text": "吨耗",
                                    "unit": "%",
                                    "name": "dh"
                                },
                                {
                                    "text": "需求总量",
                                    "unit": "kg",
                                    "name": "xqzl"
                                }
                            ]
                        }
                    ]
                },
                {
                    "text": "出线",
                    "type": "folder",
                    "name": "cx",
                    "children": [
                        {
                            "text": "工段产品",
                            "type": "folder",
                            "name": "gdcp",
                            "children": [
                                {
                                    "text": "类别",
                                    "name": "lb"
                                },
                                {
                                    "text": "钢号",
                                    "name": "gh"
                                },
                                {
                                    "text": "直径",
                                    "unit": "mm",
                                    "name": "zj"
                                },
                                {
                                    "text": "强度",
                                    "unit": "MPa",
                                    "name": "qd"
                                },
                                {
                                    "text": "是否镀锌",
                                    "name": "sfdx"
                                }
                            ]
                        },
                        {
                            "text": "收线计划",
                            "type": "folder",
                            "name": "sxjh",
                            "children": [
                                {
                                    "text": "钢丝根数",
                                    "name": "gsgs"
                                },
                                {
                                    "text": "工艺米长系数",
                                    "name": "gymcxs"
                                },
                                {
                                    "text": "丝收线段长",
                                    "unit": "m",
                                    "name": "ssxdc"
                                },
                                {
                                    "text": "丝收线段数",
                                    "name": "ssxds"
                                },
                                {
                                    "text": "丝单件收线米长",
                                    "unit": "m",
                                    "name": "sdjsxmc"
                                },
                                {
                                    "text": "丝收线件数",
                                    "name": "ssxjs"
                                },
                                {
                                    "text": "收线工字轮型号",
                                    "name": "sxgzlxh"
                                },
                                {
                                    "text": "收线总米长",
                                    "unit": "m",
                                    "name": "sxzmc"
                                },
                                {
                                    "text": "丝收线单件重量",
                                    "unit": "kg",
                                    "name": "ssxdjzl"
                                },
                                {
                                    "text": "收线总重量",
                                    "unit": "kg",
                                    "name": "sxzzl"
                                }
                            ]
                        }
                    ]
                },
                {
                    "text": "进度计划",
                    "type": "folder",
                    "name": "jdjh",
                    "children": [
                        {
                            "text": "计划生产开始日期",
                            "name": "jhscksrq"
                        },
                        {
                            "text": "计划生产完成日期",
                            "name": "jhscwcrq"
                        },
                        {
                            "text": "计划生产天数",
                            "name": "jhscts"
                        }
                    ]
                },
                {
                    "text": "产量计划",
                    "type": "folder",
                    "name": "cljh",
                    "children": [
                        {
                            "text": "米长",
                            "type": "folder",
                            "name": "mc",
                            "children": [
                                {
                                    "text": "计划产量",
                                    "unit": "m",
                                    "name": "jhcl"
                                },
                                {
                                    "text": "日计划产量",
                                    "unit": "m",
                                    "name": "rjhcl"
                                },
                                {
                                    "text": "累计完成产量",
                                    "unit": "m",
                                    "name": "ljwccl"
                                },
                                {
                                    "text": "未完成产量",
                                    "unit": "m",
                                    "name": "wwccl"
                                },
                                {
                                    "text": "第(n)天",
                                    "type": "folder",
                                    "name": "dtn",
                                    "repeat": "n",
                                    "children": [
                                        {
                                            "text": "实际产量",
                                            "unit": "m",
                                            "name": "sjcl"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "重量",
                            "type": "folder",
                            "name": "zl",
                            "children": [
                                {
                                    "text": "计划产量",
                                    "unit": "kg",
                                    "name": "jhcl"
                                },
                                {
                                    "text": "日计划产量",
                                    "unit": "kg",
                                    "name": "rjhcl"
                                },
                                {
                                    "text": "累计完成产量",
                                    "unit": "kg",
                                    "name": "ljwccl"
                                },
                                {
                                    "text": "未完成产量",
                                    "unit": "kg",
                                    "name": "wwccl"
                                },
                                {
                                    "text": "第(n)天",
                                    "type": "folder",
                                    "name": "dtn",
                                    "repeat": "n",
                                    "children": [
                                        {
                                            "text": "实际产量",
                                            "unit": "kg",
                                            "name": "sjcl"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "name": "捻股生产任务单",
            "alias": "ng_task",
            "type": {
                "name": "production_plan",
                "value": "生产计划"
            },
            "default": false,
            "display": false,
            "selected": false,
            "category": {
                "name": "form",
                "value": "表单"
            },
            "order": 65,
            "perms": [
                "display",
                "operate",
                "approve"
            ],
            "header": [
                {
                    "name": "form_no",
                    "text": "表单编号"
                },
                {
                    "name": "author",
                    "text": "制表"
                },
                {
                    "name": "created",
                    "text": "制表日期"
                },
                {
                    "name": "version",
                    "text": "版本号"
                },
                {
                    "name": "auditor",
                    "text": "审核"
                },
                {
                    "name": "audit_date",
                    "text": "审核日期"
                }
            ],
            "body": [
                {
                    "text": "工段制造号",
                    "name": "gdzzh"
                },
                {
                    "text": "是否定制",
                    "name": "sfdz"
                },
                {
                    "text": "定制产品编号",
                    "name": "dzcpbh"
                },
                {
                    "text": "埝制前用料",
                    "type": "folder",
                    "name": "nzqyl",
                    "children": [
                        {
                            "text": "丝",
                            "type": "folder",
                            "name": "si",
                            "children": [
                                {
                                    "text": "类别",
                                    "name": "lb"
                                },
                                {
                                    "text": "钢号",
                                    "name": "gh"
                                },
                                {
                                    "text": "直径",
                                    "unit": "mm",
                                    "name": "zj"
                                },
                                {
                                    "text": "强度",
                                    "unit": "MPa",
                                    "name": "qd"
                                },
                                {
                                    "text": "是否镀锌",
                                    "name": "sfdx"
                                },
                                {
                                    "text": "钢丝根数",
                                    "name": "gsgs"
                                },
                                {
                                    "text": "需求段长",
                                    "unit": "m",
                                    "name": "xqdc"
                                },
                                {
                                    "text": "需求段数",
                                    "name": "xqds"
                                },
                                {
                                    "text": "需求单件米长",
                                    "unit": "m",
                                    "name": "xqdjmc"
                                },
                                {
                                    "text": "需求件数",
                                    "name": "xqjs"
                                },
                                {
                                    "text": "收线工字轮型号",
                                    "name": "sxgzlxh"
                                },
                                {
                                    "text": "需求总米长",
                                    "unit": "m",
                                    "name": "xqzmc"
                                },
                                {
                                    "text": "需求总重量",
                                    "unit": "kg",
                                    "name": "xqzzl"
                                }
                            ]
                        }
                    ]
                },
                {
                    "text": "捻制后",
                    "type": "folder",
                    "name": "nzh",
                    "children": [
                        {
                            "text": "工段产品",
                            "type": "folder",
                            "name": "gdcp",
                            "children": [
                                {
                                    "text": "类别",
                                    "name": "lb"
                                },
                                {
                                    "text": "结构",
                                    "name": "jg"
                                },
                                {
                                    "text": "直径",
                                    "unit": "mm",
                                    "name": "zj"
                                },
                                {
                                    "text": "捻向",
                                    "name": "nx"
                                },
                                {
                                    "text": "强度",
                                    "unit": "MPa",
                                    "name": "qd"
                                },
                                {
                                    "text": "涂油方式",
                                    "name": "tyfs"
                                },
                                {
                                    "text": "捻距",
                                    "unit": "mm",
                                    "name": "nj"
                                },
                                {
                                    "text": "第几层",
                                    "unit": "n",
                                    "name": "djc"
                                },
                                {
                                    "text": "特殊要求",
                                    "name": "tsyq"
                                }
                            ]
                        },
                        {
                            "text": "收线计划",
                            "type": "folder",
                            "name": "sxjh",
                            "children": [
                                {
                                    "text": "股个数",
                                    "name": "ggs"
                                },
                                {
                                    "text": "工艺米长系数",
                                    "name": "gymcxs"
                                },
                                {
                                    "text": "股收线段长",
                                    "unit": "m",
                                    "name": "gsxdc"
                                },
                                {
                                    "text": "股收线段数",
                                    "name": "gsxds"
                                },
                                {
                                    "text": "单件收线米长",
                                    "unit": "m",
                                    "name": "djsxmc"
                                },
                                {
                                    "text": "股收线件数",
                                    "name": "gsxjs"
                                },
                                {
                                    "text": "收线工字轮型号",
                                    "name": "sxgzlxh"
                                },
                                {
                                    "text": "收线总米长",
                                    "unit": "m",
                                    "name": "sxzmc"
                                }
                            ]
                        }
                    ]
                },
                {
                    "text": "进度计划",
                    "type": "folder",
                    "name": "jdjh",
                    "children": [
                        {
                            "text": "计划生产开始日期",
                            "name": "jhscksrq"
                        },
                        {
                            "text": "计划生产完成日期",
                            "name": "jhscwcrq"
                        },
                        {
                            "text": "计划生产天数",
                            "name": "jhscts"
                        }
                    ]
                },
                {
                    "text": "产量计划",
                    "type": "folder",
                    "name": "cljh",
                    "children": [
                        {
                            "text": "计划产量",
                            "unit": "m",
                            "name": "jhcl"
                        },
                        {
                            "text": "日计划产量",
                            "unit": "m",
                            "name": "rjhcl"
                        },
                        {
                            "text": "累计完成产量",
                            "unit": "m",
                            "name": "ljwccl"
                        },
                        {
                            "text": "未完成产量",
                            "unit": "m",
                            "name": "wwccl"
                        },
                        {
                            "text": "第(n)天",
                            "type": "folder",
                            "name": "dtn",
                            "repeat": "n",
                            "children": [
                                {
                                    "text": "实际产量",
                                    "unit": "m",
                                    "name": "sjcl"
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "name": "合绳生产任务单",
            "alias": "hs_task",
            "type": {
                "name": "production_plan",
                "value": "生产计划"
            },
            "default": false,
            "display": false,
            "selected": false,
            "category": {
                "name": "form",
                "value": "表单"
            },
            "order": 66,
            "perms": [
                "display",
                "operate",
                "approve"
            ],
            "header": [
                {
                    "name": "form_no",
                    "text": "表单编号"
                },
                {
                    "name": "author",
                    "text": "制表"
                },
                {
                    "name": "created",
                    "text": "制表日期"
                },
                {
                    "name": "version",
                    "text": "版本号"
                },
                {
                    "name": "auditor",
                    "text": "审核"
                },
                {
                    "name": "audit_date",
                    "text": "审核日期"
                }
            ],
            "body": [
                {
                    "text": "工段制造号",
                    "name": "gdzzh"
                },
                {
                    "text": "产品编号",
                    "name": "cpbh"
                },
                {
                    "text": "合绳前",
                    "type": "folder",
                    "name": "hsq",
                    "children": [
                        {
                            "text": "用料",
                            "type": "folder",
                            "name": "yl",
                            "children": [
                                {
                                    "text": "股",
                                    "type": "folder",
                                    "name": "g",
                                    "children": [
                                        {
                                            "text": "类别",
                                            "name": "lb"
                                        },
                                        {
                                            "text": "结构",
                                            "name": "jg"
                                        },
                                        {
                                            "text": "直径",
                                            "unit": "mm",
                                            "name": "zj"
                                        },
                                        {
                                            "text": "捻向",
                                            "name": "nx"
                                        },
                                        {
                                            "text": "强度",
                                            "unit": "MPa",
                                            "name": "qd"
                                        },
                                        {
                                            "text": "涂油方式",
                                            "name": "tyfs"
                                        },
                                        {
                                            "text": "捻距",
                                            "unit": "mm",
                                            "name": "nj"
                                        },
                                        {
                                            "text": "第几层",
                                            "unit": "n",
                                            "name": "djc"
                                        },
                                        {
                                            "text": "股个数",
                                            "name": "ggs"
                                        },
                                        {
                                            "text": "需求段长",
                                            "unit": "m",
                                            "name": "xqdc"
                                        },
                                        {
                                            "text": "需求段数",
                                            "name": "xqds"
                                        },
                                        {
                                            "text": "需求单件米长",
                                            "unit": "m",
                                            "name": "xqdjmc"
                                        },
                                        {
                                            "text": "需求件数",
                                            "name": "xqjs"
                                        },
                                        {
                                            "text": "收线工字轮型号",
                                            "name": "sxgzlxh"
                                        },
                                        {
                                            "text": "需求总米长",
                                            "unit": "m",
                                            "name": "xqzmc"
                                        }
                                    ]
                                },
                                {
                                    "text": "金属芯",
                                    "type": "folder",
                                    "name": "jsx",
                                    "children": [
                                        {
                                            "text": "规格",
                                            "name": "gg"
                                        },
                                        {
                                            "text": "直径",
                                            "unit": "mm",
                                            "name": "zj"
                                        },
                                        {
                                            "text": "单件米长",
                                            "unit": "m",
                                            "name": "djmc"
                                        },
                                        {
                                            "text": "件数",
                                            "name": "js"
                                        },
                                        {
                                            "text": "强度",
                                            "unit": "MPa",
                                            "name": "qd"
                                        },
                                        {
                                            "text": "捻向",
                                            "name": "nx"
                                        },
                                        {
                                            "text": "涂油方式",
                                            "name": "tyfs"
                                        },
                                        {
                                            "text": "需求段长",
                                            "unit": "m",
                                            "name": "xqdc"
                                        },
                                        {
                                            "text": "需求段数",
                                            "name": "xqds"
                                        },
                                        {
                                            "text": "需求单件米长",
                                            "unit": "m",
                                            "name": "xqdjmc"
                                        },
                                        {
                                            "text": "需求件数",
                                            "name": "xqjs"
                                        },
                                        {
                                            "text": "收线工字轮型号",
                                            "name": "sxgzlxh"
                                        },
                                        {
                                            "text": "需求总米长",
                                            "unit": "m",
                                            "name": "xqzmc"
                                        }
                                    ]
                                },
                                {
                                    "text": "半金属绳芯",
                                    "type": "folder",
                                    "name": "bjssx",
                                    "children": [
                                        {
                                            "text": "规格",
                                            "name": "gg"
                                        },
                                        {
                                            "text": "直径",
                                            "unit": "mm",
                                            "name": "zj"
                                        },
                                        {
                                            "text": "需求段长",
                                            "unit": "m",
                                            "name": "xqdc"
                                        },
                                        {
                                            "text": "需求段数",
                                            "name": "xqds"
                                        },
                                        {
                                            "text": "需求单件米长",
                                            "unit": "m",
                                            "name": "xqdjmc"
                                        },
                                        {
                                            "text": "需求件数",
                                            "name": "xqjs"
                                        },
                                        {
                                            "text": "收线工字轮型号",
                                            "name": "sxgzlxh"
                                        },
                                        {
                                            "text": "需求总米长",
                                            "unit": "m",
                                            "name": "xqzmc"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "text": "合绳后",
                    "type": "folder",
                    "name": "hsh",
                    "children": [
                        {
                            "text": "工段产品",
                            "type": "folder",
                            "name": "gdcp",
                            "children": [
                                {
                                    "text": "类别",
                                    "name": "lb"
                                },
                                {
                                    "text": "规格",
                                    "name": "gg"
                                },
                                {
                                    "text": "直径",
                                    "unit": "mm",
                                    "name": "zj"
                                },
                                {
                                    "text": "单件米长",
                                    "unit": "m",
                                    "name": "djmc"
                                },
                                {
                                    "text": "件数",
                                    "name": "js"
                                },
                                {
                                    "text": "强度",
                                    "unit": "MPa",
                                    "name": "qd"
                                },
                                {
                                    "text": "捻向",
                                    "name": "nx"
                                },
                                {
                                    "text": "涂油方式",
                                    "name": "tyfs"
                                },
                                {
                                    "text": "第几层",
                                    "unit": "n",
                                    "name": "djc"
                                },
                                {
                                    "text": "特殊要求",
                                    "name": "tsyq"
                                }
                            ]
                        },
                        {
                            "text": "收线计划",
                            "type": "folder",
                            "name": "sxjh",
                            "children": [
                                {
                                    "text": "工艺米长系数",
                                    "name": "gymcxs"
                                },
                                {
                                    "text": "收线段长",
                                    "unit": "m",
                                    "name": "ssdc"
                                },
                                {
                                    "text": "收线段数",
                                    "name": "sxds"
                                },
                                {
                                    "text": "单件收线米长",
                                    "unit": "m",
                                    "name": "djsxmc"
                                },
                                {
                                    "text": "收线件数",
                                    "name": "sxjs"
                                },
                                {
                                    "text": "收线总米长",
                                    "unit": "m",
                                    "name": "sxzmc"
                                },
                                {
                                    "text": "收线工字轮型号",
                                    "name": "sxgzlxh"
                                },
                                {
                                    "text": "收线轮盘类别",
                                    "name": "sxlplb"
                                },
                                {
                                    "text": "收线轮盘规格",
                                    "name": "sxlpgg"
                                }
                            ]
                        }
                    ]
                },
                {
                    "text": "进度计划",
                    "type": "folder",
                    "name": "jdjh",
                    "children": [
                        {
                            "text": "计划生产开始日期",
                            "name": "jhscksrq"
                        },
                        {
                            "text": "计划生产完成日期",
                            "name": "jhscwcrq"
                        },
                        {
                            "text": "计划生产天数",
                            "name": "jhscts"
                        }
                    ]
                },
                {
                    "text": "产量计划",
                    "type": "folder",
                    "name": "cljh",
                    "children": [
                        {
                            "text": "计划产量",
                            "unit": "m",
                            "name": "jhcl"
                        },
                        {
                            "text": "日计划产量",
                            "unit": "m",
                            "name": "rjhcl"
                        },
                        {
                            "text": "累计完成产量",
                            "unit": "m",
                            "name": "ljwccl"
                        },
                        {
                            "text": "未完成产量",
                            "unit": "m",
                            "name": "wwccl"
                        },
                        {
                            "text": "第(n)天",
                            "type": "folder",
                            "name": "dtn",
                            "repeat": "n",
                            "children": [
                                {
                                    "text": "实际产量",
                                    "unit": "m",
                                    "name": "sjcl"
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "name": "坯料工段粗拉工序日作业计划",
            "alias": "plcl_dayplan",
            "type": {
                "name": "work_plan",
                "value": "作业计划"
            },
            "default": false,
            "display": false,
            "selected": false,
            "category": {
                "name": "form",
                "value": "表单"
            },
            "order": 71,
            "perms": [
                "display",
                "operate",
                "approve"
            ],
            "header": [
                {
                    "name": "form_no",
                    "text": "表单编号"
                },
                {
                    "name": "author",
                    "text": "制表"
                },
                {
                    "name": "created",
                    "text": "制表日期"
                },
                {
                    "name": "version",
                    "text": "版本号"
                },
                {
                    "name": "auditor",
                    "text": "审核"
                },
                {
                    "name": "audit_date",
                    "text": "审核日期"
                }
            ],
            "body": [
                {
                    "text": "工段制造号",
                    "name": "gdzzh"
                },
                {
                    "text": "是否定制",
                    "name": "sfdz"
                },
                {
                    "text": "定制产品编号",
                    "name": "dzcpbh"
                },
                {
                    "text": "机台号",
                    "name": "jth"
                },
                {
                    "text": "机台米长系数",
                    "name": "jtmcxs"
                },
                {
                    "text": "班次",
                    "name": "bc"
                },
                {
                    "text": "班长",
                    "name": "bz"
                },
                {
                    "text": "操作工",
                    "name": "czg"
                },
                {
                    "text": "生产要求",
                    "type": "folder",
                    "name": "scyq",
                    "children": [
                        {
                            "text": "生产时间",
                            "type": "folder",
                            "name": "scsj",
                            "children": [
                                {
                                    "text": "预计调产时间",
                                    "type": "folder",
                                    "name": "yjtcsj",
                                    "children": [
                                        {
                                            "text": "开始时间",
                                            "name": "kssj"
                                        },
                                        {
                                            "text": "完成时间",
                                            "name": "wcsj"
                                        }
                                    ]
                                },
                                {
                                    "text": "预计生产时间",
                                    "type": "folder",
                                    "name": "yjscsj",
                                    "children": [
                                        {
                                            "text": "开始日期",
                                            "name": "ksrq"
                                        },
                                        {
                                            "text": "开始时间",
                                            "name": "kssj"
                                        },
                                        {
                                            "text": "完成日期",
                                            "name": "wcrq"
                                        },
                                        {
                                            "text": "完成时间",
                                            "name": "wcsj"
                                        }
                                    ]
                                },
                                {
                                    "text": "预计中间停机时间",
                                    "name": "yjzjtjsj"
                                }
                            ]
                        },
                        {
                            "text": "进线",
                            "type": "folder",
                            "name": "jx",
                            "children": [
                                {
                                    "text": "钢号",
                                    "name": "gh"
                                },
                                {
                                    "text": "直径",
                                    "unit": "mm",
                                    "name": "zj"
                                },
                                {
                                    "text": "需求量",
                                    "unit": "kg",
                                    "name": "xql"
                                }
                            ]
                        },
                        {
                            "text": "出线",
                            "type": "folder",
                            "name": "cx",
                            "children": [
                                {
                                    "text": "钢号",
                                    "name": "gh"
                                },
                                {
                                    "text": "直径",
                                    "unit": "mm",
                                    "name": "zj"
                                },
                                {
                                    "text": "强度",
                                    "unit": "MPa",
                                    "name": "qd"
                                },
                                {
                                    "text": "收线件数",
                                    "name": "sxjs"
                                },
                                {
                                    "text": "吨耗",
                                    "unit": "%",
                                    "name": "dh"
                                },
                                {
                                    "text": "收线重量",
                                    "unit": "kg",
                                    "name": "sxzl"
                                },
                                {
                                    "text": "收线总米长",
                                    "unit": "m",
                                    "name": "sxzmc"
                                },
                                {
                                    "text": "收线工字轮型号",
                                    "name": "sxgzlxh"
                                },
                                {
                                    "text": "是否热处理",
                                    "name": "sfrcl"
                                },
                                {
                                    "text": "热处理方式",
                                    "name": "rclfs"
                                },
                                {
                                    "text": "是否需要再次拉拔",
                                    "name": "sfxyzclb"
                                },
                                {
                                    "text": "是否镀锌",
                                    "name": "sfdx"
                                }
                            ]
                        }
                    ]
                },
                {
                    "text": "工单计划产量",
                    "type": "folder",
                    "name": "gdjhcl",
                    "children": [
                        {
                            "text": "产量",
                            "unit": "kg",
                            "name": "cl"
                        },
                        {
                            "text": "收线件数",
                            "name": "sxjs"
                        }
                    ]
                },
                {
                    "text": "工单实际产量",
                    "type": "folder",
                    "name": "gdsjcl",
                    "children": [
                        {
                            "text": "产量",
                            "unit": "kg",
                            "name": "cl"
                        },
                        {
                            "text": "收线件数",
                            "name": "sxjs"
                        }
                    ]
                },
                {
                    "text": "下线盘条放置区编号",
                    "name": "xxptfzqbh"
                },
                {
                    "text": "下线坯料放置区编号",
                    "name": "xxplfzqbh"
                }
            ]
        },
        {
            "name": "热处理&镀锌工段日作业计划",
            "alias": "rcldx_dayplan",
            "type": {
                "name": "work_plan",
                "value": "作业计划"
            },
            "default": false,
            "display": false,
            "selected": false,
            "category": {
                "name": "form",
                "value": "表单"
            },
            "order": 72,
            "perms": [
                "display",
                "operate",
                "approve"
            ],
            "header": [
                {
                    "name": "form_no",
                    "text": "表单编号"
                },
                {
                    "name": "author",
                    "text": "制表"
                },
                {
                    "name": "created",
                    "text": "制表日期"
                },
                {
                    "name": "version",
                    "text": "版本号"
                },
                {
                    "name": "auditor",
                    "text": "审核"
                },
                {
                    "name": "audit_date",
                    "text": "审核日期"
                }
            ],
            "body": [
                {
                    "text": "工段制造号",
                    "name": "gdzzh"
                },
                {
                    "text": "生产类别",
                    "name": "sclb"
                },
                {
                    "text": "是否定制",
                    "name": "sfdz"
                },
                {
                    "text": "定制产品编号",
                    "name": "dzcpbh"
                },
                {
                    "text": "生产线号",
                    "name": "scxh"
                },
                {
                    "text": "班次",
                    "name": "bc"
                },
                {
                    "text": "班长",
                    "name": "bz"
                },
                {
                    "text": "司炉工",
                    "name": "slg"
                },
                {
                    "text": "生产要求",
                    "type": "folder",
                    "name": "scyq",
                    "children": [
                        {
                            "text": "预计生产时间",
                            "type": "folder",
                            "name": "yjscsj",
                            "children": [
                                {
                                    "text": "开始日期",
                                    "name": "ksrq"
                                },
                                {
                                    "text": "开始时间",
                                    "name": "kssj"
                                },
                                {
                                    "text": "完成日期",
                                    "name": "wcrq"
                                },
                                {
                                    "text": "完成时间",
                                    "name": "wcsj"
                                }
                            ]
                        },
                        {
                            "text": "放线",
                            "type": "folder",
                            "name": "fx",
                            "children": [
                                {
                                    "text": "放线架号",
                                    "name": "fxjh"
                                },
                                {
                                    "text": "钢号",
                                    "name": "gh"
                                },
                                {
                                    "text": "直径",
                                    "unit": "mm",
                                    "name": "zj"
                                },
                                {
                                    "text": "强度",
                                    "unit": "MPa",
                                    "name": "qd"
                                },
                                {
                                    "text": "工字轮型号",
                                    "name": "gzlxh"
                                }
                            ]
                        },
                        {
                            "text": "收线",
                            "type": "folder",
                            "name": "sx",
                            "children": [
                                {
                                    "text": "收线架号",
                                    "name": "sxjh"
                                },
                                {
                                    "text": "钢号",
                                    "name": "gh"
                                },
                                {
                                    "text": "直径",
                                    "unit": "mm",
                                    "name": "zj"
                                },
                                {
                                    "text": "强度",
                                    "unit": "MPa",
                                    "name": "qd"
                                },
                                {
                                    "text": "花篮架型号",
                                    "name": "hljxh"
                                },
                                {
                                    "text": "工字轮型号",
                                    "name": "gzlxh"
                                }
                            ]
                        }
                    ]
                },
                {
                    "text": "坯料放置区编号",
                    "name": "plfzqbh"
                },
                {
                    "text": "退火料放置区编号",
                    "name": "thfzqbh"
                },
                {
                    "text": "镀锌坯料放置区编号",
                    "name": "dxplfzqbh"
                },
                {
                    "text": "镀锌成品丝放置区编号",
                    "name": "dxcpsfzqbh"
                }
            ]
        },
        {
            "name": "成品丝工段日作业计划",
            "alias": "cps_dayplan",
            "type": {
                "name": "work_plan",
                "value": "作业计划"
            },
            "default": false,
            "display": false,
            "selected": false,
            "category": {
                "name": "form",
                "value": "表单"
            },
            "order": 73,
            "perms": [
                "display",
                "operate",
                "approve"
            ],
            "header": [
                {
                    "name": "form_no",
                    "text": "表单编号"
                },
                {
                    "name": "author",
                    "text": "制表"
                },
                {
                    "name": "created",
                    "text": "制表日期"
                },
                {
                    "name": "version",
                    "text": "版本号"
                },
                {
                    "name": "auditor",
                    "text": "审核"
                },
                {
                    "name": "audit_date",
                    "text": "审核日期"
                }
            ],
            "body": [
                {
                    "text": "工段制造号",
                    "name": "gdzzh"
                },
                {
                    "text": "是否定制",
                    "name": "sfdz"
                },
                {
                    "text": "定制产品编号",
                    "name": "dzcpbh"
                },
                {
                    "text": "机台号",
                    "name": "jth"
                },
                {
                    "text": "机台米长系数",
                    "name": "jtmcxs"
                },
                {
                    "text": "班次",
                    "name": "bc"
                },
                {
                    "text": "班长",
                    "name": "bz"
                },
                {
                    "text": "操作工",
                    "name": "czg"
                },
                {
                    "text": "生产要求",
                    "type": "folder",
                    "name": "scyq",
                    "children": [
                        {
                            "text": "生产时间",
                            "type": "folder",
                            "name": "scsj",
                            "children": [
                                {
                                    "text": "预计调产时间",
                                    "type": "folder",
                                    "name": "yjtcsj",
                                    "children": [
                                        {
                                            "text": "开始时间",
                                            "name": "kssj"
                                        },
                                        {
                                            "text": "完成时间",
                                            "name": "wcsj"
                                        }
                                    ]
                                },
                                {
                                    "text": "预计生产时间",
                                    "type": "folder",
                                    "name": "yjscsj",
                                    "children": [
                                        {
                                            "text": "开始日期",
                                            "name": "ksrq"
                                        },
                                        {
                                            "text": "开始时间",
                                            "name": "kssj"
                                        },
                                        {
                                            "text": "完成日期",
                                            "name": "wcrq"
                                        },
                                        {
                                            "text": "完成时间",
                                            "name": "wcsj"
                                        }
                                    ]
                                },
                                {
                                    "text": "预计中间停机时间",
                                    "name": "yjzjtjsj"
                                }
                            ]
                        },
                        {
                            "text": "用料",
                            "type": "folder",
                            "name": "yl",
                            "children": [
                                {
                                    "text": "进线坯料",
                                    "type": "folder",
                                    "name": "jxpl",
                                    "children": [
                                        {
                                            "text": "类别",
                                            "name": "lb"
                                        },
                                        {
                                            "text": "钢号",
                                            "name": "gh"
                                        },
                                        {
                                            "text": "直径",
                                            "unit": "mm",
                                            "name": "zj"
                                        },
                                        {
                                            "text": "强度",
                                            "unit": "MPa",
                                            "name": "qd"
                                        },
                                        {
                                            "text": "料卷标签编号",
                                            "name": "ljbqbh"
                                        },
                                        {
                                            "text": "需求量",
                                            "unit": "kg",
                                            "name": "xql"
                                        },
                                        {
                                            "text": "吨耗",
                                            "unit": "%",
                                            "name": "dh"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "产品要求",
                            "type": "folder",
                            "name": "cpyq",
                            "children": [
                                {
                                    "text": "工段产品(钢丝)",
                                    "type": "folder",
                                    "name": "gdcpgs",
                                    "children": [
                                        {
                                            "text": "类别",
                                            "name": "lb"
                                        },
                                        {
                                            "text": "钢号",
                                            "name": "gh"
                                        },
                                        {
                                            "text": "直径",
                                            "unit": "mm",
                                            "name": "zj"
                                        },
                                        {
                                            "text": "强度",
                                            "unit": "MPa",
                                            "name": "qd"
                                        },
                                        {
                                            "text": "是否镀锌",
                                            "name": "sfdx"
                                        }
                                    ]
                                },
                                {
                                    "text": "收线计划",
                                    "type": "folder",
                                    "name": "sxjh",
                                    "children": [
                                        {
                                            "text": "段长(n)",
                                            "type": "folder",
                                            "repeat": "n",
                                            "name": "dcn",
                                            "children": [
                                                {
                                                    "text": "段长",
                                                    "unit": "m",
                                                    "name": "dc"
                                                },
                                                {
                                                    "text": "收线段数",
                                                    "name": "sxds"
                                                },
                                                {
                                                    "text": "单件收线米长",
                                                    "unit": "m",
                                                    "name": "djsxmc"
                                                },
                                                {
                                                    "text": "收线件数",
                                                    "name": "sxjs"
                                                },
                                                {
                                                    "text": "收线工字轮型号",
                                                    "name": "sxgzlxh"
                                                }
                                            ]
                                        },
                                        {
                                            "text": "收线总米长",
                                            "unit": "m",
                                            "name": "sxzmc"
                                        },
                                        {
                                            "text": "收线总重量",
                                            "unit": "kg",
                                            "name": "sxzzl"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "text": "工单实际产量",
                    "type": "folder",
                    "name": "gdsjcl",
                    "children": [
                        {
                            "text": "收线总件数",
                            "name": "sxzjs"
                        },
                        {
                            "text": "收线总米长",
                            "unit": "m",
                            "name": "sxzmc"
                        },
                        {
                            "text": "总重量",
                            "unit": "kg",
                            "name": "zzl"
                        }
                    ]
                },
                {
                    "text": "坯料放置区编号",
                    "name": "plfzqbh"
                },
                {
                    "text": "成品丝库区编号",
                    "name": "cpskqbh"
                }
            ]
        },
        {
            "name": "捻股工段作业计划",
            "alias": "ng_work_plan",
            "type": {
                "name": "work_plan",
                "value": "作业计划"
            },
            "default": false,
            "display": false,
            "selected": false,
            "category": {
                "name": "form",
                "value": "表单"
            },
            "order": 74,
            "perms": [
                "display",
                "operate",
                "approve"
            ],
            "header": [
                {
                    "name": "form_no",
                    "text": "表单编号"
                },
                {
                    "name": "author",
                    "text": "制表"
                },
                {
                    "name": "created",
                    "text": "制表日期"
                },
                {
                    "name": "version",
                    "text": "版本号"
                },
                {
                    "name": "auditor",
                    "text": "审核"
                },
                {
                    "name": "audit_date",
                    "text": "审核日期"
                }
            ],
            "body": [
                {
                    "text": "下达日期",
                    "name": "xdrq"
                },
                {
                    "text": "工段制造号",
                    "name": "gdzzh"
                },
                {
                    "text": "是否定制",
                    "name": "sfdz"
                },
                {
                    "text": "车间",
                    "name": "cj"
                },
                {
                    "text": "机台号",
                    "name": "jth"
                },
                {
                    "text": "机台米长系数",
                    "name": "jtmcxs"
                },
                {
                    "text": "班组",
                    "name": "bz"
                },
                {
                    "text": "班长",
                    "name": "bzz"
                },
                {
                    "text": "操作工",
                    "name": "czg"
                },
                {
                    "text": "生产要求",
                    "type": "folder",
                    "name": "scyq",
                    "children": [
                        {
                            "text": "生产时间",
                            "type": "folder",
                            "name": "scsj",
                            "children": [
                                {
                                    "text": "预计调产时间",
                                    "type": "folder",
                                    "name": "yjtcsj",
                                    "children": [
                                        {
                                            "text": "开始时间",
                                            "name": "kssj"
                                        },
                                        {
                                            "text": "完成时间",
                                            "name": "wcsj"
                                        }
                                    ]
                                },
                                {
                                    "text": "预计生产时间",
                                    "type": "folder",
                                    "name": "yjscsj",
                                    "children": [
                                        {
                                            "text": "开始时间",
                                            "name": "kssj"
                                        },
                                        {
                                            "text": "完成时间",
                                            "name": "wcsj"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "进线用料",
                            "type": "folder",
                            "name": "jxyl",
                            "children": [
                                {
                                    "text": "中间品",
                                    "name": "zjp",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "规格",
                                            "name": "gg",
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "结构",
                                                    "name": "jg"
                                                },
                                                {
                                                    "text": "直径",
                                                    "name": "zj",
                                                    "unit": "mm"
                                                },
                                                {
                                                    "text": "捻向",
                                                    "name": "nx"
                                                },
                                                {
                                                    "text": "强度",
                                                    "name": "qd",
                                                    "unit": "Mpa"
                                                },
                                                {
                                                    "text": "涂油方式",
                                                    "name": "tyfs"
                                                },
                                                {
                                                    "text": "捻距",
                                                    "name": "nj",
                                                    "unit": "mm"
                                                },
                                                {
                                                    "text": "表面状态",
                                                    "name": "bmzt"
                                                }
                                            ]
                                        },
                                        {
                                            "text": "用量",
                                            "name": "yl",
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "用量n",
                                                    "name": "yln",
                                                    "type": "folder",
                                                    "children": [
                                                        {
                                                            "text": "段长",
                                                            "name": "dc",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "段数",
                                                            "name": "ds"
                                                        },
                                                        {
                                                            "text": "单件米长",
                                                            "name": "djmc",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "单件损耗",
                                                            "name": "djsh",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "单件需求米长",
                                                            "name": "djxqmc",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "件数",
                                                            "name": "js"
                                                        },
                                                        {
                                                            "text": "总米长",
                                                            "name": "zmc",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "总损耗",
                                                            "name": "zsh",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "总需求米长",
                                                            "name": "zxqmc",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "工字轮型号",
                                                            "name": "gzlxh"
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    "text": "第n层丝",
                                    "name": "sdcn",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "丝n",
                                            "name": "sn",
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "规格",
                                                    "name": "gg",
                                                    "type": "folder",
                                                    "children": [
                                                        {
                                                            "text": "类别",
                                                            "name": "lb"
                                                        },
                                                        {
                                                            "text": "直径",
                                                            "name": "zj",
                                                            "unit": "mm"
                                                        },
                                                        {
                                                            "text": "强度",
                                                            "name": "qd",
                                                            "unit": "Mpa"
                                                        }
                                                    ]
                                                },
                                                {
                                                    "text": "用量",
                                                    "name": "yl",
                                                    "type": "folder",
                                                    "children": [
                                                        {
                                                            "text": "根数",
                                                            "name": "gs"
                                                        },
                                                        {
                                                            "text": "用量n",
                                                            "name": "yln",
                                                            "type": "folder",
                                                            "children": [
                                                                {
                                                                    "text": "段长",
                                                                    "name": "dc",
                                                                    "unit": "m"
                                                                },
                                                                {
                                                                    "text": "段数",
                                                                    "name": "ds"
                                                                },
                                                                {
                                                                    "text": "单件米长",
                                                                    "name": "djmc",
                                                                    "unit": "m"
                                                                },
                                                                {
                                                                    "text": "安全系数",
                                                                    "name": "aqxs",
                                                                    "unit": "m"
                                                                },
                                                                {
                                                                    "text": "单件需求米长",
                                                                    "name": "djxqmc",
                                                                    "unit": "m"
                                                                },
                                                                {
                                                                    "text": "件数",
                                                                    "name": "js"
                                                                },
                                                                {
                                                                    "text": "总米长",
                                                                    "name": "zmc",
                                                                    "unit": "m"
                                                                },
                                                                {
                                                                    "text": "总需求米长",
                                                                    "name": "zxqmc",
                                                                    "unit": "m"
                                                                },
                                                                {
                                                                    "text": "工字轮型号",
                                                                    "name": "gzlxh"
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    "text": "丝n",
                                    "name": "sn",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "规格",
                                            "name": "gg",
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "类别",
                                                    "name": "lb"
                                                },
                                                {
                                                    "text": "直径",
                                                    "name": "zj",
                                                    "unit": "mm"
                                                },
                                                {
                                                    "text": "强度",
                                                    "name": "qd",
                                                    "unit": "Mpa"
                                                }
                                            ]
                                        },
                                        {
                                            "text": "用量",
                                            "name": "yl",
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "根数",
                                                    "name": "gs"
                                                },
                                                {
                                                    "text": "用量n",
                                                    "name": "yln",
                                                    "type": "folder",
                                                    "children": [
                                                        {
                                                            "text": "段长",
                                                            "name": "dc",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "段数",
                                                            "name": "ds"
                                                        },
                                                        {
                                                            "text": "单件米长",
                                                            "name": "djmc",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "安全系数",
                                                            "name": "aqxs",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "单件需求米长",
                                                            "name": "djxqmc",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "件数",
                                                            "name": "js"
                                                        },
                                                        {
                                                            "text": "总米长",
                                                            "name": "zmc",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "总需求米长",
                                                            "name": "zxqmc",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "工字轮型号",
                                                            "name": "gzlxh"
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    "text": "中心丝",
                                    "name": "zxs",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "规格",
                                            "name": "gg",
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "类别",
                                                    "name": "lb"
                                                },
                                                {
                                                    "text": "直径",
                                                    "name": "zj",
                                                    "unit": "mm"
                                                },
                                                {
                                                    "text": "强度",
                                                    "name": "qd",
                                                    "unit": "Mpa"
                                                }
                                            ]
                                        },
                                        {
                                            "text": "用量",
                                            "name": "yl",
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "用量n",
                                                    "name": "yln",
                                                    "type": "folder",
                                                    "children": [
                                                        {
                                                            "text": "段长",
                                                            "name": "dc",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "段数",
                                                            "name": "ds"
                                                        },
                                                        {
                                                            "text": "单件米长",
                                                            "name": "djmc",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "安全系数",
                                                            "name": "aqxs",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "单件需求米长",
                                                            "name": "djxqmc",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "件数",
                                                            "name": "js"
                                                        },
                                                        {
                                                            "text": "总米长",
                                                            "name": "zmc",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "总需求米长",
                                                            "name": "zxqmc",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "工字轮型号",
                                                            "name": "gzlxh"
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    "text": "外钢丝",
                                    "name": "wgs",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "丝n",
                                            "name": "sn",
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "规格",
                                                    "name": "gg",
                                                    "type": "folder",
                                                    "children": [
                                                        {
                                                            "text": "类别",
                                                            "name": "lb"
                                                        },
                                                        {
                                                            "text": "直径",
                                                            "name": "zj",
                                                            "unit": "mm"
                                                        },
                                                        {
                                                            "text": "强度",
                                                            "name": "qd",
                                                            "unit": "Mpa"
                                                        }
                                                    ]
                                                },
                                                {
                                                    "text": "用量",
                                                    "name": "yl",
                                                    "type": "folder",
                                                    "children": [
                                                        {
                                                            "text": "根数",
                                                            "name": "gs"
                                                        },
                                                        {
                                                            "text": "用量n",
                                                            "name": "yln",
                                                            "type": "folder",
                                                            "children": [
                                                                {
                                                                    "text": "段长",
                                                                    "name": "dc",
                                                                    "unit": "m"
                                                                },
                                                                {
                                                                    "text": "段数",
                                                                    "name": "ds"
                                                                },
                                                                {
                                                                    "text": "单件米长",
                                                                    "name": "djmc",
                                                                    "unit": "m"
                                                                },
                                                                {
                                                                    "text": "安全系数",
                                                                    "name": "aqxs",
                                                                    "unit": "m"
                                                                },
                                                                {
                                                                    "text": "单件需求米长",
                                                                    "name": "djxqmc",
                                                                    "unit": "m"
                                                                },
                                                                {
                                                                    "text": "件数",
                                                                    "name": "js"
                                                                },
                                                                {
                                                                    "text": "总米长",
                                                                    "name": "zmc",
                                                                    "unit": "m"
                                                                },
                                                                {
                                                                    "text": "总需求米长",
                                                                    "name": "zxqmc",
                                                                    "unit": "m"
                                                                },
                                                                {
                                                                    "text": "工字轮型号",
                                                                    "name": "gzlxh"
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    "text": "纤维芯",
                                    "name": "xwx",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "规格",
                                            "name": "gg",
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "类别",
                                                    "name": "lb"
                                                },
                                                {
                                                    "text": "直径",
                                                    "name": "zj",
                                                    "unit": "mm"
                                                },
                                                {
                                                    "text": "捻向",
                                                    "name": "nx"
                                                },
                                                {
                                                    "text": "含油率",
                                                    "name": "hyl",
                                                    "unit": "%"
                                                }
                                            ]
                                        },
                                        {
                                            "text": "用量",
                                            "name": "yl",
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "工艺米长系数",
                                                    "name": "gymcxs"
                                                },
                                                {
                                                    "text": "总米长",
                                                    "name": "zmc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "吨耗",
                                                    "name": "dh",
                                                    "unit": "%"
                                                },
                                                {
                                                    "text": "重量",
                                                    "name": "zl",
                                                    "unit": "kg"
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    "text": "油脂",
                                    "name": "yz",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "规格",
                                            "name": "gg",
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "型号",
                                                    "name": "xh"
                                                }
                                            ]
                                        },
                                        {
                                            "text": "用量",
                                            "name": "yl",
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "涂油方式",
                                                    "name": "tyfs"
                                                },
                                                {
                                                    "text": "吨耗",
                                                    "name": "dh",
                                                    "unit": "%"
                                                },
                                                {
                                                    "text": "重量",
                                                    "name": "zl",
                                                    "unit": "kg"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "产品要求",
                            "type": "folder",
                            "name": "cpyq",
                            "children": [
                                {
                                    "text": "工段产品",
                                    "type": "folder",
                                    "name": "gdcp",
                                    "children": [
                                        {
                                            "text": "类别",
                                            "name": "lb"
                                        },
                                        {
                                            "text": "结构",
                                            "name": "jg"
                                        },
                                        {
                                            "text": "直径",
                                            "unit": "mm",
                                            "name": "zj"
                                        },
                                        {
                                            "text": "捻向",
                                            "name": "nx"
                                        },
                                        {
                                            "text": "强度",
                                            "unit": "MPa",
                                            "name": "qd"
                                        },
                                        {
                                            "text": "涂油方式",
                                            "name": "tyfs"
                                        },
                                        {
                                            "text": "捻距",
                                            "unit": "mm",
                                            "name": "nj"
                                        },
                                        {
                                            "text": "表面状态",
                                            "name": "bmzt"
                                        },
                                        {
                                            "text": "特殊要求",
                                            "name": "tsyq"
                                        },
                                        {
                                            "text": "用途",
                                            "name": "yt"
                                        }
                                    ]
                                },
                                {
                                    "text": "收线方式",
                                    "type": "folder",
                                    "name": "sxfs",
                                    "children": [
                                        {
                                            "text": "收线方式n",
                                            "name": "sxfsn",
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "段长",
                                                    "name": "dc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "段数",
                                                    "name": "ds"
                                                },
                                                {
                                                    "text": "单件米长",
                                                    "name": "djmc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "单件损耗",
                                                    "name": "djsh",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "单件生产米长",
                                                    "name": "djscmc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "件数",
                                                    "name": "js"
                                                },
                                                {
                                                    "text": "总米长",
                                                    "name": "zmc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "总损耗",
                                                    "name": "zsh",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "总生产米长",
                                                    "name": "zscmc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "工字轮型号",
                                                    "name": "gzlxh"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "text": "产量计划",
                    "type": "folder",
                    "name": "cljh",
                    "children": [
                        {
                            "text": "计划产量",
                            "name": "jhcl",
                            "unit": "m"
                        }
                    ]
                },
                {
                    "text": "实际产量",
                    "type": "folder",
                    "name": "sjcl",
                    "children": [
                        {
                            "text": "累计完成产量",
                            "name": "ljwccl",
                            "type": "folder",
                            "children": [
                                {
                                    "text": "总件数",
                                    "name": "zjs"
                                },
                                {
                                    "text": "总米长",
                                    "name": "zmc",
                                    "unit": "m"
                                },
                                {
                                    "text": "收线方式n",
                                    "name": "sxfsn",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "总件数",
                                            "name": "zjs"
                                        },
                                        {
                                            "text": "总米长",
                                            "name": "zmc",
                                            "unit": "m"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "未完成产量",
                            "name": "wwccl",
                            "type": "folder",
                            "children": [
                                {
                                    "text": "总件数",
                                    "name": "zjs"
                                },
                                {
                                    "text": "总米长",
                                    "name": "zmc",
                                    "unit": "m"
                                },
                                {
                                    "text": "收线方式n",
                                    "name": "sxfsn",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "总件数",
                                            "name": "zjs"
                                        },
                                        {
                                            "text": "总米长",
                                            "name": "zmc",
                                            "unit": "m"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "不合格品",
                            "name": "bhgp",
                            "type": "folder",
                            "children": [
                                {
                                    "text": "总件数",
                                    "name": "zjs"
                                },
                                {
                                    "text": "总米长",
                                    "name": "zmc",
                                    "unit": "m"
                                },
                                {
                                    "text": "收线方式n",
                                    "name": "sxfsn",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "总件数",
                                            "name": "zjs"
                                        },
                                        {
                                            "text": "总米长",
                                            "name": "zmc",
                                            "unit": "m"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "日产量",
                            "name": "rcl",
                            "type": "folder",
                            "children": [
                                {
                                    "text": "某日产量",
                                    "name": "mrcl",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "总件数",
                                            "name": "zjs"
                                        },
                                        {
                                            "text": "总米长",
                                            "name": "zmc",
                                            "unit": "m"
                                        },
                                        {
                                            "text": "收线方式n",
                                            "name": "sxfsn",
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "总件数",
                                                    "name": "zjs"
                                                },
                                                {
                                                    "text": "总米长",
                                                    "name": "zmc",
                                                    "unit": "m"
                                                }
                                            ]
                                        }]
                                }
                            ]
                        }
                    ]
                },
                {
                    "text": "丝放置区编号",
                    "name": "sfzqbh"
                },
                {
                    "text": "股放置区编号",
                    "name": "gfzqbh"
                }
            ]
        },
        {
            "name": "合绳工段作业计划",
            "alias": "hs_work_plan",
            "type": {
                "name": "work_plan",
                "value": "作业计划"
            },
            "default": false,
            "display": false,
            "selected": false,
            "category": {
                "name": "form",
                "value": "表单"
            },
            "order": 75,
            "perms": [
                "display",
                "operate",
                "approve"
            ],
            "header": [
                {
                    "name": "form_no",
                    "text": "表单编号"
                },
                {
                    "name": "author",
                    "text": "制表"
                },
                {
                    "name": "created",
                    "text": "制表日期"
                },
                {
                    "name": "version",
                    "text": "版本号"
                },
                {
                    "name": "auditor",
                    "text": "审核"
                },
                {
                    "name": "audit_date",
                    "text": "审核日期"
                }
            ],
            "body": [
                {
                    "text": "下达日期",
                    "name": "xdrq"
                },
                {
                    "text": "工段制造号",
                    "name": "gdzzh"
                },
                {
                    "text": "是否定制",
                    "name": "sfdz"
                },
                {
                    "text": "车间",
                    "name": "cj"
                },
                {
                    "text": "机台号",
                    "name": "jth"
                },
                {
                    "text": "机台米长系数",
                    "name": "jtmcxs"
                },
                {
                    "text": "班组",
                    "name": "bz"
                },
                {
                    "text": "班长",
                    "name": "bzz"
                },
                {
                    "text": "操作工",
                    "name": "czg"
                },
                {
                    "text": "生产要求",
                    "type": "folder",
                    "name": "scyq",
                    "children": [
                        {
                            "text": "生产时间",
                            "type": "folder",
                            "name": "scsj",
                            "children": [
                                {
                                    "text": "预计调产时间",
                                    "type": "folder",
                                    "name": "yjtcsj",
                                    "children": [
                                        {
                                            "text": "开始时间",
                                            "name": "kssj"
                                        },
                                        {
                                            "text": "完成时间",
                                            "name": "wcsj"
                                        }
                                    ]
                                },
                                {
                                    "text": "预计生产时间",
                                    "type": "folder",
                                    "name": "yjscsj",
                                    "children": [
                                        {
                                            "text": "开始时间",
                                            "name": "kssj"
                                        },
                                        {
                                            "text": "完成时间",
                                            "name": "wcsj"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "进线用料",
                            "type": "folder",
                            "name": "jxyl",
                            "children": [
                                {
                                    "text": "中间品",
                                    "name": "zjp",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "规格",
                                            "name": "gg",
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "结构",
                                                    "name": "jg"
                                                },
                                                {
                                                    "text": "直径",
                                                    "name": "zj",
                                                    "unit": "mm"
                                                },
                                                {
                                                    "text": "捻向",
                                                    "name": "nx"
                                                },
                                                {
                                                    "text": "强度",
                                                    "name": "qd",
                                                    "unit": "Mpa"
                                                },
                                                {
                                                    "text": "涂油方式",
                                                    "name": "tyfs"
                                                },
                                                {
                                                    "text": "捻距",
                                                    "name": "nj",
                                                    "unit": "mm"
                                                },
                                                {
                                                    "text": "表面状态",
                                                    "name": "bmzt"
                                                }
                                            ]
                                        },
                                        {
                                            "text": "用量",
                                            "name": "yl",
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "用量n",
                                                    "name": "yln",
                                                    "type": "folder",
                                                    "children": [
                                                        {
                                                            "text": "段长",
                                                            "name": "dc",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "段数",
                                                            "name": "ds"
                                                        },
                                                        {
                                                            "text": "单件米长",
                                                            "name": "djmc",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "单件损耗",
                                                            "name": "djsh",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "单件需求米长",
                                                            "name": "djxqmc",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "件数",
                                                            "name": "js"
                                                        },
                                                        {
                                                            "text": "总米长",
                                                            "name": "zmc",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "总损耗",
                                                            "name": "zsh",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "总需求米长",
                                                            "name": "zxqmc",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "工字轮型号",
                                                            "name": "gzlxh"
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    "text": "金属绳芯",
                                    "name": "jssx",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "规格",
                                            "name": "gg",
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "结构",
                                                    "name": "jg"
                                                },
                                                {
                                                    "text": "直径",
                                                    "name": "zj",
                                                    "unit": "mm"
                                                },
                                                {
                                                    "text": "捻向",
                                                    "name": "nx"
                                                },
                                                {
                                                    "text": "强度",
                                                    "name": "qd",
                                                    "unit": "Mpa"
                                                },
                                                {
                                                    "text": "涂油方式",
                                                    "name": "tyfs"
                                                },
                                                {
                                                    "text": "捻距",
                                                    "name": "nj",
                                                    "unit": "mm"
                                                },
                                                {
                                                    "text": "表面状态",
                                                    "name": "bmzt"
                                                }
                                            ]
                                        },
                                        {
                                            "text": "用量",
                                            "name": "yl",
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "用量n",
                                                    "name": "yln",
                                                    "type": "folder",
                                                    "children": [
                                                        {
                                                            "text": "段长",
                                                            "name": "dc",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "段数",
                                                            "name": "ds"
                                                        },
                                                        {
                                                            "text": "单件米长",
                                                            "name": "djmc",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "单件损耗",
                                                            "name": "djsh",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "单件需求米长",
                                                            "name": "djxqmc",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "件数",
                                                            "name": "js"
                                                        },
                                                        {
                                                            "text": "总米长",
                                                            "name": "zmc",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "总损耗",
                                                            "name": "zsh",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "总需求米长",
                                                            "name": "zxqmc",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "工字轮型号",
                                                            "name": "gzlxh"
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    "text": "金属股芯",
                                    "name": "jsgx",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "规格",
                                            "name": "gg",
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "结构",
                                                    "name": "jg"
                                                },
                                                {
                                                    "text": "直径",
                                                    "name": "zj",
                                                    "unit": "mm"
                                                },
                                                {
                                                    "text": "捻向",
                                                    "name": "nx"
                                                },
                                                {
                                                    "text": "强度",
                                                    "name": "qd",
                                                    "unit": "Mpa"
                                                },
                                                {
                                                    "text": "涂油方式",
                                                    "name": "tyfs"
                                                },
                                                {
                                                    "text": "捻距",
                                                    "name": "nj",
                                                    "unit": "mm"
                                                },
                                                {
                                                    "text": "表面状态",
                                                    "name": "bmzt"
                                                }
                                            ]
                                        },
                                        {
                                            "text": "用量",
                                            "name": "yl",
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "用量n",
                                                    "name": "yln",
                                                    "type": "folder",
                                                    "children": [
                                                        {
                                                            "text": "段长",
                                                            "name": "dc",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "段数",
                                                            "name": "ds"
                                                        },
                                                        {
                                                            "text": "单件米长",
                                                            "name": "djmc",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "单件损耗",
                                                            "name": "djsh",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "单件需求米长",
                                                            "name": "djxqmc",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "件数",
                                                            "name": "js"
                                                        },
                                                        {
                                                            "text": "总米长",
                                                            "name": "zmc",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "总损耗",
                                                            "name": "zsh",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "总需求米长",
                                                            "name": "zxqmc",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "工字轮型号",
                                                            "name": "gzlxh"
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    "text": "半金属芯",
                                    "name": "bjsx",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "规格",
                                            "name": "gg",
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "结构",
                                                    "name": "jg"
                                                },
                                                {
                                                    "text": "直径",
                                                    "name": "zj",
                                                    "unit": "mm"
                                                },
                                                {
                                                    "text": "捻向",
                                                    "name": "nx"
                                                },
                                                {
                                                    "text": "强度",
                                                    "name": "qd",
                                                    "unit": "Mpa"
                                                },
                                                {
                                                    "text": "涂油方式",
                                                    "name": "tyfs"
                                                },
                                                {
                                                    "text": "捻距",
                                                    "name": "nj",
                                                    "unit": "mm"
                                                },
                                                {
                                                    "text": "表面状态",
                                                    "name": "bmzt"
                                                }
                                            ]
                                        },
                                        {
                                            "text": "用量",
                                            "name": "yl",
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "用量n",
                                                    "name": "yln",
                                                    "type": "folder",
                                                    "children": [
                                                        {
                                                            "text": "段长",
                                                            "name": "dc",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "段数",
                                                            "name": "ds"
                                                        },
                                                        {
                                                            "text": "单件米长",
                                                            "name": "djmc",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "单件损耗",
                                                            "name": "djsh",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "单件需求米长",
                                                            "name": "djxqmc",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "件数",
                                                            "name": "js"
                                                        },
                                                        {
                                                            "text": "总米长",
                                                            "name": "zmc",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "总损耗",
                                                            "name": "zsh",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "总需求米长",
                                                            "name": "zxqmc",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "工字轮型号",
                                                            "name": "gzlxh"
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    "text": "中心股",
                                    "name": "zxg",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "规格",
                                            "name": "gg",
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "结构",
                                                    "name": "jg"
                                                },
                                                {
                                                    "text": "直径",
                                                    "name": "zj",
                                                    "unit": "mm"
                                                },
                                                {
                                                    "text": "捻向",
                                                    "name": "nx"
                                                },
                                                {
                                                    "text": "强度",
                                                    "name": "qd",
                                                    "unit": "Mpa"
                                                },
                                                {
                                                    "text": "涂油方式",
                                                    "name": "tyfs"
                                                },
                                                {
                                                    "text": "捻距",
                                                    "name": "nj",
                                                    "unit": "mm"
                                                },
                                                {
                                                    "text": "表面状态",
                                                    "name": "bmzt"
                                                }
                                            ]
                                        },
                                        {
                                            "text": "用量",
                                            "name": "yl",
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "用量n",
                                                    "name": "yln",
                                                    "type": "folder",
                                                    "children": [
                                                        {
                                                            "text": "段长",
                                                            "name": "dc",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "段数",
                                                            "name": "ds"
                                                        },
                                                        {
                                                            "text": "单件米长",
                                                            "name": "djmc",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "单件损耗",
                                                            "name": "djsh",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "单件需求米长",
                                                            "name": "djxqmc",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "件数",
                                                            "name": "js"
                                                        },
                                                        {
                                                            "text": "总米长",
                                                            "name": "zmc",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "总损耗",
                                                            "name": "zsh",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "总需求米长",
                                                            "name": "zxqmc",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "工字轮型号",
                                                            "name": "gzlxh"
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    "text": "外股",
                                    "name": "wg",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "规格",
                                            "name": "gg",
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "结构",
                                                    "name": "jg"
                                                },
                                                {
                                                    "text": "直径",
                                                    "name": "zj",
                                                    "unit": "mm"
                                                },
                                                {
                                                    "text": "捻向",
                                                    "name": "nx"
                                                },
                                                {
                                                    "text": "强度",
                                                    "name": "qd",
                                                    "unit": "Mpa"
                                                },
                                                {
                                                    "text": "涂油方式",
                                                    "name": "tyfs"
                                                },
                                                {
                                                    "text": "捻距",
                                                    "name": "nj",
                                                    "unit": "mm"
                                                },
                                                {
                                                    "text": "表面状态",
                                                    "name": "bmzt"
                                                }
                                            ]
                                        },
                                        {
                                            "text": "用量",
                                            "name": "yl",
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "个数",
                                                    "name": "gs"
                                                },
                                                {
                                                    "text": "用量n",
                                                    "name": "yln",
                                                    "type": "folder",
                                                    "children": [
                                                        {
                                                            "text": "段长",
                                                            "name": "dc",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "段数",
                                                            "name": "ds"
                                                        },
                                                        {
                                                            "text": "单件米长",
                                                            "name": "djmc",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "单件损耗",
                                                            "name": "djsh",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "单件需求米长",
                                                            "name": "djxqmc",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "件数",
                                                            "name": "js"
                                                        },
                                                        {
                                                            "text": "总米长",
                                                            "name": "zmc",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "总损耗",
                                                            "name": "zsh",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "总需求米长",
                                                            "name": "zxqmc",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "工字轮型号",
                                                            "name": "gzlxh"
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    "text": "纤维芯",
                                    "name": "xwx",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "规格",
                                            "name": "gg",
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "类别",
                                                    "name": "lb"
                                                },
                                                {
                                                    "text": "直径",
                                                    "name": "zj",
                                                    "unit": "mm"
                                                },
                                                {
                                                    "text": "捻向",
                                                    "name": "nx"
                                                },
                                                {
                                                    "text": "含油率",
                                                    "name": "hyl",
                                                    "unit": "%"
                                                }
                                            ]
                                        },
                                        {
                                            "text": "用量",
                                            "name": "yl",
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "工艺米长系数",
                                                    "name": "gymcxs"
                                                },
                                                {
                                                    "text": "总米长",
                                                    "name": "zmc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "吨耗",
                                                    "name": "dh",
                                                    "unit": "%"
                                                },
                                                {
                                                    "text": "重量",
                                                    "name": "zl",
                                                    "unit": "kg"
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    "text": "油脂",
                                    "name": "yz",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "规格",
                                            "name": "gg",
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "型号",
                                                    "name": "xh"
                                                }
                                            ]
                                        },
                                        {
                                            "text": "用量",
                                            "name": "yl",
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "涂油方式",
                                                    "name": "tyfs"
                                                },
                                                {
                                                    "text": "吨耗",
                                                    "name": "dh",
                                                    "unit": "%"
                                                },
                                                {
                                                    "text": "重量",
                                                    "name": "zl",
                                                    "unit": "kg"
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    "text": "第n层股",
                                    "name": "gdcn",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "股n",
                                            "name": "gn",
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "规格",
                                                    "name": "gg",
                                                    "type": "folder",
                                                    "children": [
                                                        {
                                                            "text": "结构",
                                                            "name": "jg"
                                                        },
                                                        {
                                                            "text": "直径",
                                                            "name": "zj",
                                                            "unit": "mm"
                                                        },
                                                        {
                                                            "text": "捻向",
                                                            "name": "nx"
                                                        },
                                                        {
                                                            "text": "强度",
                                                            "name": "qd",
                                                            "unit": "Mpa"
                                                        },
                                                        {
                                                            "text": "涂油方式",
                                                            "name": "tyfs"
                                                        },
                                                        {
                                                            "text": "捻距",
                                                            "name": "nj",
                                                            "unit": "mm"
                                                        },
                                                        {
                                                            "text": "表面状态",
                                                            "name": "bmzt"
                                                        }
                                                    ]
                                                },
                                                {
                                                    "text": "用量",
                                                    "name": "yl",
                                                    "type": "folder",
                                                    "children": [
                                                        {
                                                            "text": "个数",
                                                            "name": "gs"
                                                        },
                                                        {
                                                            "text": "用量n",
                                                            "name": "yln",
                                                            "type": "folder",
                                                            "children": [
                                                                {
                                                                    "text": "段长",
                                                                    "name": "dc",
                                                                    "unit": "m"
                                                                },
                                                                {
                                                                    "text": "段数",
                                                                    "name": "ds"
                                                                },
                                                                {
                                                                    "text": "单件米长",
                                                                    "name": "djmc",
                                                                    "unit": "m"
                                                                },
                                                                {
                                                                    "text": "单件损耗",
                                                                    "name": "djsh",
                                                                    "unit": "m"
                                                                },
                                                                {
                                                                    "text": "单件需求米长",
                                                                    "name": "djxqmc",
                                                                    "unit": "m"
                                                                },
                                                                {
                                                                    "text": "件数",
                                                                    "name": "js"
                                                                },
                                                                {
                                                                    "text": "总米长",
                                                                    "name": "zmc",
                                                                    "unit": "m"
                                                                },
                                                                {
                                                                    "text": "总损耗",
                                                                    "name": "zsh",
                                                                    "unit": "m"
                                                                },
                                                                {
                                                                    "text": "总需求米长",
                                                                    "name": "zxqmc",
                                                                    "unit": "m"
                                                                },
                                                                {
                                                                    "text": "工字轮型号",
                                                                    "name": "gzlxh"
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "产品要求",
                            "type": "folder",
                            "name": "cpyq",
                            "children": [
                                {
                                    "text": "工段产品",
                                    "type": "folder",
                                    "name": "gdcp",
                                    "children": [
                                        {
                                            "text": "类别",
                                            "name": "lb"
                                        },
                                        {
                                            "text": "结构",
                                            "name": "jg"
                                        },
                                        {
                                            "text": "规格",
                                            "name": "gg"
                                        },
                                        {
                                            "text": "直径",
                                            "unit": "mm",
                                            "name": "zj"
                                        },
                                        {
                                            "text": "强度",
                                            "unit": "MPa",
                                            "name": "qd"
                                        },
                                        {
                                            "text": "捻向",
                                            "name": "nx"
                                        },
                                        {
                                            "text": "涂油方式",
                                            "name": "tyfs"
                                        },
                                        {
                                            "text": "捻距",
                                            "unit": "mm",
                                            "name": "nj"
                                        },
                                        {
                                            "text": "表面状态",
                                            "name": "bmzt"
                                        },
                                        {
                                            "text": "特殊要求",
                                            "name": "tsyq"
                                        },
                                        {
                                            "text": "用途",
                                            "name": "yt"
                                        }
                                    ]
                                },
                                {
                                    "text": "收线方式",
                                    "type": "folder",
                                    "name": "sxfs",
                                    "children": [
                                        {
                                            "text": "收线方式n",
                                            "name": "sxfsn",
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "段长",
                                                    "name": "dc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "段数",
                                                    "name": "ds"
                                                },
                                                {
                                                    "text": "单件米长",
                                                    "name": "djmc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "单件损耗",
                                                    "name": "djsh",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "单件生产米长",
                                                    "name": "djscmc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "件数",
                                                    "name": "js"
                                                },
                                                {
                                                    "text": "总米长",
                                                    "name": "zmc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "总损耗",
                                                    "name": "zsh",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "总生产米长",
                                                    "name": "zscmc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "工字轮型号",
                                                    "name": "gzlxh"
                                                },
                                                {
                                                    "text": "包装方式",
                                                    "name": "bzfs"
                                                },
                                                {
                                                    "text": "轮盘型号",
                                                    "name": "lpxh"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "text": "产量计划",
                    "type": "folder",
                    "name": "cljh",
                    "children": [
                        {
                            "text": "计划产量",
                            "name": "jhcl",
                            "unit": "m"
                        }
                    ]
                },
                {
                    "text": "实际产量",
                    "type": "folder",
                    "name": "sjcl",
                    "children": [
                        {
                            "text": "累计完成产量",
                            "name": "ljwccl",
                            "type": "folder",
                            "children": [
                                {
                                    "text": "总件数",
                                    "name": "zjs"
                                },
                                {
                                    "text": "总米长",
                                    "name": "zmc",
                                    "unit": "m"
                                },
                                {
                                    "text": "收线方式n",
                                    "name": "sxfsn",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "总件数",
                                            "name": "zjs"
                                        },
                                        {
                                            "text": "总米长",
                                            "name": "zmc",
                                            "unit": "m"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "未完成产量",
                            "name": "wwccl",
                            "type": "folder",
                            "children": [
                                {
                                    "text": "总件数",
                                    "name": "zjs"
                                },
                                {
                                    "text": "总米长",
                                    "name": "zmc",
                                    "unit": "m"
                                },
                                {
                                    "text": "收线方式n",
                                    "name": "sxfsn",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "总件数",
                                            "name": "zjs"
                                        },
                                        {
                                            "text": "总米长",
                                            "name": "zmc",
                                            "unit": "m"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "不合格品",
                            "name": "bhgp",
                            "type": "folder",
                            "children": [
                                {
                                    "text": "总件数",
                                    "name": "zjs"
                                },
                                {
                                    "text": "总米长",
                                    "name": "zmc",
                                    "unit": "m"
                                },
                                {
                                    "text": "收线方式n",
                                    "name": "sxfsn",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "总件数",
                                            "name": "zjs"
                                        },
                                        {
                                            "text": "总米长",
                                            "name": "zmc",
                                            "unit": "m"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "日产量",
                            "name": "rcl",
                            "type": "folder",
                            "children": [
                                {
                                    "text": "某日产量",
                                    "name": "mrcl",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "总件数",
                                            "name": "zjs"
                                        },
                                        {
                                            "text": "总米长",
                                            "name": "zmc",
                                            "unit": "m"
                                        },
                                        {
                                            "text": "收线方式n",
                                            "name": "sxfsn",
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "总件数",
                                                    "name": "zjs"
                                                },
                                                {
                                                    "text": "总米长",
                                                    "name": "zmc",
                                                    "unit": "m"
                                                }
                                            ]
                                        }]
                                }
                            ]
                        }
                    ]
                },
                {
                    "text": "股放置区编号",
                    "name": "gfzqbh"
                },
                {
                    "text": "金属绳芯放置区编号",
                    "name": "jssxfzqbh"
                },
                {
                    "text": "钢丝绳放置区编号",
                    "name": "gssfzqbh"
                }
            ]
        },
        {
            "name": "酸洗工单",
            "alias": "sx_workorder",
            "type": {
                "name": "work_order",
                "value": "工单"
            },
            "default": false,
            "display": false,
            "selected": false,
            "category": {
                "name": "form",
                "value": "表单"
            },
            "order": 91,
            "perms": [
                "display",
                "operate",
                "approve",
                "assign",
                "confirm"
            ],
            "header": [
                {
                    "name": "form_no",
                    "text": "表单编号"
                },
                {
                    "name": "author",
                    "text": "编制"
                },
                {
                    "name": "created",
                    "text": "编制日期"
                },
                {
                    "name": "version",
                    "text": "版本号"
                },
                {
                    "name": "auditor",
                    "text": "审核"
                },
                {
                    "name": "audit_date",
                    "text": "审核日期"
                }
            ],
            "body": [
                {
                    "text": "生产要求",
                    "type": "folder",
                    "name": "scyq",
                    "children": [
                        {
                            "text": "产品编号",
                            "name": "cpbh"
                        },
                        {
                            "text": "制造号",
                            "name": "zzh"
                        },
                        {
                            "text": "制造序列号",
                            "name": "zzxlh"
                        },
                        {
                            "text": "线号",
                            "name": "xh"
                        },
                        {
                            "text": "班别",
                            "name": "bb"
                        },
                        {
                            "text": "班长",
                            "name": "bz"
                        },
                        {
                            "text": "操作工",
                            "name": "czg"
                        },
                        {
                            "text": "调产时间",
                            "type": "folder",
                            "name": "tcsj",
                            "children": [
                                {
                                    "text": "开始时间",
                                    "name": "kssj"
                                },
                                {
                                    "text": "结束时间",
                                    "name": "jssj"
                                },
                                {
                                    "text": "用时",
                                    "unit": "H",
                                    "name": "ys"
                                }
                            ]
                        },
                        {
                            "text": "钢号",
                            "name": "gh"
                        },
                        {
                            "text": "炉号",
                            "name": "lh"
                        },
                        {
                            "text": "直径",
                            "unit": "mm",
                            "name": "zj"
                        },
                        {
                            "text": "标准产量",
                            "unit": "t/H",
                            "name": "bzcl"
                        },
                        {
                            "text": "日计划产量",
                            "type": "folder",
                            "name": "rjhcl",
                            "children": [
                                {
                                    "text": "件数",
                                    "name": "js"
                                },
                                {
                                    "text": "重量",
                                    "unit": "t",
                                    "name": "zl"
                                },
                                {
                                    "text": "盘条编号",
                                    "name": "ptbh"
                                }
                            ]
                        },
                        {
                            "text": "日实际产量",
                            "type": "folder",
                            "name": "rsjcl",
                            "children": [
                                {
                                    "text": "件数",
                                    "name": "js"
                                },
                                {
                                    "text": "重量",
                                    "unit": "t",
                                    "name": "zl"
                                },
                                {
                                    "text": "产出盘条编号",
                                    "name": "ccptbh"
                                }
                            ]
                        },
                        {
                            "text": "中间停机时间",
                            "type": "folder",
                            "many": true,
                            "name": "zjtjsj",
                            "children": [
                                {
                                    "text": "停机时间",
                                    "name": "tjsj"
                                },
                                {
                                    "text": "重启时间",
                                    "name": "cqyy"
                                },
                                {
                                    "text": "停机原因",
                                    "name": "tjyy"
                                }
                            ]
                        },
                        {
                            "text": "盘条库区域编号",
                            "name": "ptkqbh"
                        },
                        {
                            "text": "酸洗下线盘条放置区编号",
                            "name": "sxxxptfzqbh"
                        }
                    ]
                },
                {
                    "text": "工艺要求",
                    "type": "folder",
                    "name": "gyyq",
                    "children": [
                        {
                            "text": "酸浸",
                            "type": "folder",
                            "name": "sj",
                            "children": [
                                {
                                    "text": "1号槽",
                                    "type": "folder",
                                    "name": "hc1",
                                    "children": [
                                        {
                                            "text": "盐酸浓度",
                                            "unit": "%",
                                            "name": "ysnd"
                                        },
                                        {
                                            "text": "温度",
                                            "unit": "C",
                                            "name": "wd"
                                        },
                                        {
                                            "text": "酸浸时间",
                                            "unit": "min",
                                            "name": "sjsj"
                                        },
                                        {
                                            "text": "氯化亚铁含量",
                                            "unit": "g/mL",
                                            "name": "lhythl"
                                        }
                                    ]
                                },
                                {
                                    "text": "2号槽",
                                    "type": "folder",
                                    "name": "hc2",
                                    "children": [
                                        {
                                            "text": "盐酸浓度",
                                            "unit": "%",
                                            "name": "ysnd"
                                        },
                                        {
                                            "text": "温度",
                                            "unit": "C",
                                            "name": "wd"
                                        },
                                        {
                                            "text": "酸浸时间",
                                            "unit": "min",
                                            "name": "sjsj"
                                        },
                                        {
                                            "text": "氯化亚铁含量",
                                            "unit": "g/mL",
                                            "name": "lhythl"
                                        }
                                    ]
                                },
                                {
                                    "text": "3号槽",
                                    "type": "folder",
                                    "name": "hc3",
                                    "children": [
                                        {
                                            "text": "盐酸浓度",
                                            "unit": "%",
                                            "name": "ysnd"
                                        },
                                        {
                                            "text": "温度",
                                            "unit": "C",
                                            "name": "wd"
                                        },
                                        {
                                            "text": "酸浸时间",
                                            "unit": "min",
                                            "name": "sjsj"
                                        },
                                        {
                                            "text": "氯化亚铁含量",
                                            "unit": "g/mL",
                                            "name": "lhythl"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "水洗",
                            "type": "folder",
                            "name": "sx",
                            "children": [
                                {
                                    "text": "冲洗",
                                    "type": "folder",
                                    "name": "cx",
                                    "children": [
                                        {
                                            "text": "时间",
                                            "unit": "S",
                                            "name": "sj"
                                        },
                                        {
                                            "text": "水PH值",
                                            "name": "sphz"
                                        }
                                    ]
                                },
                                {
                                    "text": "浸洗",
                                    "type": "folder",
                                    "name": "jx",
                                    "children": [
                                        {
                                            "text": "时间",
                                            "unit": "S",
                                            "name": "sj"
                                        },
                                        {
                                            "text": "水PH值",
                                            "name": "sphz"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "磷化",
                            "type": "folder",
                            "name": "lh",
                            "children": [
                                {
                                    "text": "总酸度",
                                    "unit": "点",
                                    "type": "folder",
                                    "name": "zsd",
                                    "children": [
                                        {
                                            "text": "最小",
                                            "name": "zx"
                                        },
                                        {
                                            "text": "标准",
                                            "name": "bz"
                                        },
                                        {
                                            "text": "最大",
                                            "name": "zd"
                                        }
                                    ]
                                },
                                {
                                    "text": "游离酸",
                                    "unit": "点",
                                    "type": "folder",
                                    "name": "yls",
                                    "children": [
                                        {
                                            "text": "最小",
                                            "name": "zx"
                                        },
                                        {
                                            "text": "标准",
                                            "name": "bz"
                                        },
                                        {
                                            "text": "最大",
                                            "name": "zd"
                                        }
                                    ]
                                },
                                {
                                    "text": "温度",
                                    "unit": "C",
                                    "type": "folder",
                                    "name": "wd",
                                    "children": [
                                        {
                                            "text": "最小",
                                            "name": "zx"
                                        },
                                        {
                                            "text": "标准",
                                            "name": "bz"
                                        },
                                        {
                                            "text": "最大",
                                            "name": "zd"
                                        }
                                    ]
                                },
                                {
                                    "text": "磷化时间",
                                    "unit": "min",
                                    "type": "folder",
                                    "name": "lhsj",
                                    "children": [
                                        {
                                            "text": "非合金钢",
                                            "name": "fhjg"
                                        },
                                        {
                                            "text": "低含量合金钢",
                                            "name": "dhlhjg"
                                        },
                                        {
                                            "text": "合金钢",
                                            "name": "hjg"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "水洗",
                            "type": "folder",
                            "name": "sx",
                            "children": [
                                {
                                    "text": "冲洗",
                                    "type": "folder",
                                    "name": "cx",
                                    "children": [
                                        {
                                            "text": "时间",
                                            "unit": "S",
                                            "name": "sj"
                                        },
                                        {
                                            "text": "水PH值",
                                            "name": "sphz"
                                        }
                                    ]
                                },
                                {
                                    "text": "浸洗",
                                    "type": "folder",
                                    "name": "jx",
                                    "children": [
                                        {
                                            "text": "温度",
                                            "unit": "C",
                                            "name": "wd"
                                        },
                                        {
                                            "text": "水PH值",
                                            "name": "sphz"
                                        },
                                        {
                                            "text": "时间",
                                            "unit": "S",
                                            "name": "sj"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "皂化",
                            "type": "folder",
                            "name": "zh",
                            "children": [
                                {
                                    "text": "皂化液浓度",
                                    "unit": "%",
                                    "name": "zhynd"
                                },
                                {
                                    "text": "温度",
                                    "unit": "C",
                                    "name": "wd"
                                },
                                {
                                    "text": "时间",
                                    "unit": "S",
                                    "name": "sj"
                                }
                            ]
                        },
                        {
                            "text": "沥干时间",
                            "unit": "S",
                            "name": "lgsj"
                        }
                    ]
                },
                {
                    "text": "原辅材料及工装要求",
                    "type": "folder",
                    "name": "yfcljgzyq",
                    "children": [
                        {
                            "text": "盐酸型号",
                            "name": "ysxh"
                        },
                        {
                            "text": "磷化液型号",
                            "name": "lhyxh"
                        },
                        {
                            "text": "皂化液型号",
                            "name": "zhyxh"
                        }
                    ]
                }
            ]
        },
        {
            "name": "坯料拉拔工单",
            "alias": "pl_workorder",
            "type": {
                "name": "work_order",
                "value": "工单"
            },
            "default": false,
            "display": false,
            "selected": false,
            "category": {
                "name": "form",
                "value": "表单"
            },
            "order": 92,
            "perms": [
                "display",
                "operate",
                "approve",
                "assign",
                "confirm"
            ],
            "header": [
                {
                    "name": "form_no",
                    "text": "表单编号"
                },
                {
                    "name": "author",
                    "text": "编制"
                },
                {
                    "name": "created",
                    "text": "编制日期"
                },
                {
                    "name": "version",
                    "text": "版本号"
                },
                {
                    "name": "auditor",
                    "text": "审核"
                },
                {
                    "name": "audit_date",
                    "text": "审核日期"
                }
            ],
            "body": [
                {
                    "text": "生产要求",
                    "type": "folder",
                    "name": "scyq",
                    "children": [
                        {
                            "text": "产品编号",
                            "name": "cpbh"
                        },
                        {
                            "text": "是否定制",
                            "name": "sfdz"
                        },
                        {
                            "text": "制造号",
                            "name": "zzh"
                        },
                        {
                            "text": "制造序列号",
                            "name": "zzxlh"
                        },
                        {
                            "text": "机台号",
                            "name": "jth"
                        },
                        {
                            "text": "班别",
                            "name": "bb"
                        },
                        {
                            "text": "班长",
                            "name": "bz"
                        },
                        {
                            "text": "操作工",
                            "name": "czg"
                        },
                        {
                            "text": "调产时间",
                            "type": "folder",
                            "name": "tcsj",
                            "children": [
                                {
                                    "text": "开始时间",
                                    "name": "kssj"
                                },
                                {
                                    "text": "结束时间",
                                    "name": "jssj"
                                },
                                {
                                    "text": "用时",
                                    "unit": "H",
                                    "name": "ys"
                                }
                            ]
                        },
                        {
                            "text": "完成生产时间",
                            "name": "wcscsj"
                        },
                        {
                            "text": "进线",
                            "type": "folder",
                            "name": "jx",
                            "children": [
                                {
                                    "text": "钢号",
                                    "name": "gh"
                                },
                                {
                                    "text": "炉号",
                                    "name": "lh"
                                },
                                {
                                    "text": "直径",
                                    "unit": "mm",
                                    "name": "zj"
                                },
                                {
                                    "text": "指定材料编号",
                                    "name": "zdclbh"
                                }
                            ]
                        },
                        {
                            "text": "出线",
                            "type": "folder",
                            "name": "cx",
                            "children": [
                                {
                                    "text": "钢号",
                                    "name": "gh"
                                },
                                {
                                    "text": "炉号",
                                    "name": "lh"
                                },
                                {
                                    "text": "直径",
                                    "unit": "mm",
                                    "name": "zj"
                                },
                                {
                                    "text": "公差",
                                    "unit": "mm",
                                    "name": "gc"
                                },
                                {
                                    "text": "强度",
                                    "unit": "MPa",
                                    "name": "qd"
                                }
                            ]
                        },
                        {
                            "text": "标准产量",
                            "unit": "m/H",
                            "name": "bzcl"
                        },
                        {
                            "text": "日计划产量",
                            "type": "folder",
                            "name": "rjhcl",
                            "children": [
                                {
                                    "text": "件数",
                                    "name": "js"
                                },
                                {
                                    "text": "米长",
                                    "unit": "m",
                                    "name": "mc"
                                }
                            ]
                        },
                        {
                            "text": "日实际产量",
                            "type": "folder",
                            "name": "rsjcl",
                            "children": [
                                {
                                    "text": "件数",
                                    "name": "js"
                                },
                                {
                                    "text": "米长",
                                    "unit": "m",
                                    "name": "mc"
                                }
                            ]
                        },
                        {
                            "text": "收线工字轮",
                            "type": "folder",
                            "name": "sxgzl",
                            "children": [
                                {
                                    "text": "型号",
                                    "name": "xh"
                                },
                                {
                                    "text": "编号",
                                    "name": "bh"
                                }
                            ]
                        },
                        {
                            "text": "中间停机时间",
                            "type": "folder",
                            "many": true,
                            "name": "zjtjsj",
                            "children": [
                                {
                                    "text": "停机时间",
                                    "name": "tjsj"
                                },
                                {
                                    "text": "重启时间",
                                    "name": "cqyy"
                                },
                                {
                                    "text": "停机原因",
                                    "name": "tjyy"
                                }
                            ]
                        },
                        {
                            "text": "酸洗下线盘条放置区编号",
                            "name": "sxxxptfzqbh"
                        },
                        {
                            "text": "下线粗拉料放置区编号",
                            "name": "xxcllfzqbh"
                        }
                    ]
                },
                {
                    "text": "工艺要求",
                    "type": "folder",
                    "name": "gyyq",
                    "children": [
                        {
                            "text": "进线直径",
                            "unit": "mm",
                            "name": "jxzj"
                        },
                        {
                            "text": "出线直径",
                            "unit": "mm",
                            "name": "cxzj"
                        },
                        {
                            "text": "拉拔道次(模链)",
                            "unit": "mm",
                            "name": "lbdcml"
                        }
                    ]
                },
                {
                    "text": "原辅材料及工装要求",
                    "type": "folder",
                    "name": "yfcljgzyq",
                    "children": [
                        {
                            "text": "拉丝粉型号",
                            "name": "lsfxh"
                        },
                        {
                            "text": "润滑剂型号",
                            "name": "rhjxh"
                        },
                        {
                            "text": "后变形器型号",
                            "name": "hbxqxh"
                        }
                    ]
                }
            ]
        },
        {
            "name": "热处理工单",
            "alias": "rcl_workorder",
            "type": {
                "name": "work_order",
                "value": "工单"
            },
            "default": false,
            "display": false,
            "selected": false,
            "category": {
                "name": "form",
                "value": "表单"
            },
            "order": 93,
            "perms": [
                "display",
                "operate",
                "approve",
                "assign",
                "confirm"
            ],
            "header": [
                {
                    "name": "form_no",
                    "text": "表单编号"
                },
                {
                    "name": "author",
                    "text": "编制"
                },
                {
                    "name": "created",
                    "text": "编制日期"
                },
                {
                    "name": "version",
                    "text": "版本号"
                },
                {
                    "name": "auditor",
                    "text": "审核"
                },
                {
                    "name": "audit_date",
                    "text": "审核日期"
                }
            ],
            "body": [
                {
                    "text": "生产要求",
                    "type": "folder",
                    "name": "scyq",
                    "children": [
                        {
                            "text": "产品编号",
                            "name": "cpbh"
                        },
                        {
                            "text": "制造号",
                            "name": "zzh"
                        },
                        {
                            "text": "制造序列号",
                            "name": "zzxlh"
                        },
                        {
                            "text": "线号",
                            "name": "xh"
                        },
                        {
                            "text": "班别",
                            "name": "bb"
                        },
                        {
                            "text": "班长",
                            "name": "bz"
                        },
                        {
                            "text": "操作工",
                            "name": "czg"
                        },
                        {
                            "text": "放线架号",
                            "name": "fxjh"
                        },
                        {
                            "text": "收线架号",
                            "name": "sxjh"
                        },
                        {
                            "text": "调产时间",
                            "type": "folder",
                            "name": "tcsj",
                            "children": [
                                {
                                    "text": "开始时间",
                                    "name": "kssj"
                                },
                                {
                                    "text": "结束时间",
                                    "name": "jssj"
                                },
                                {
                                    "text": "用时",
                                    "unit": "H",
                                    "name": "ys"
                                }
                            ]
                        },
                        {
                            "text": "完成生产时间",
                            "name": "wcscsj"
                        },
                        {
                            "text": "放线",
                            "type": "folder",
                            "name": "fx",
                            "children": [
                                {
                                    "text": "钢号",
                                    "name": "gh"
                                },
                                {
                                    "text": "炉号",
                                    "name": "lh"
                                },
                                {
                                    "text": "坯料直径",
                                    "unit": "mm",
                                    "name": "plzj"
                                },
                                {
                                    "text": "强度",
                                    "unit": "MPa",
                                    "name": "qd"
                                }
                            ]
                        },
                        {
                            "text": "收线",
                            "type": "folder",
                            "name": "sx",
                            "children": [
                                {
                                    "text": "钢号",
                                    "name": "gh"
                                },
                                {
                                    "text": "炉号",
                                    "name": "lh"
                                },
                                {
                                    "text": "坯料直径",
                                    "unit": "mm",
                                    "name": "plzj"
                                },
                                {
                                    "text": "强度",
                                    "unit": "MPa",
                                    "name": "qd"
                                }
                            ]
                        },
                        {
                            "text": "标准产量",
                            "unit": "m/H",
                            "name": "bzcl"
                        },
                        {
                            "text": "放线工字轮",
                            "type": "folder",
                            "name": "fxgzl",
                            "children": [
                                {
                                    "text": "型号",
                                    "name": "xh"
                                },
                                {
                                    "text": "编号",
                                    "name": "bh"
                                }
                            ]
                        },
                        {
                            "text": "日计划产量",
                            "type": "folder",
                            "name": "rjhcl",
                            "children": [
                                {
                                    "text": "件数",
                                    "name": "js"
                                },
                                {
                                    "text": "重量",
                                    "unit": "t",
                                    "name": "zl"
                                }
                            ]
                        },
                        {
                            "text": "日实际产量",
                            "type": "folder",
                            "name": "rsjcl",
                            "children": [
                                {
                                    "text": "件数",
                                    "name": "js"
                                },
                                {
                                    "text": "重量",
                                    "unit": "t",
                                    "name": "zl"
                                }
                            ]
                        },
                        {
                            "text": "收线花篮架",
                            "type": "folder",
                            "name": "sxhlq",
                            "children": [
                                {
                                    "text": "型号",
                                    "name": "xh"
                                },
                                {
                                    "text": "编号",
                                    "name": "bh"
                                }
                            ]
                        },
                        {
                            "text": "中间停机时间",
                            "type": "folder",
                            "many": true,
                            "name": "zjtjsj",
                            "children": [
                                {
                                    "text": "停机时间",
                                    "name": "tjsj"
                                },
                                {
                                    "text": "重启时间",
                                    "name": "cqyy"
                                },
                                {
                                    "text": "停机原因",
                                    "name": "tjyy"
                                }
                            ]
                        },
                        {
                            "text": "下线粗拉料放置区编号",
                            "name": "xxcllfzqbh"
                        },
                        {
                            "text": "下线热处理料放置区编号",
                            "name": "xxrcllfzqbh"
                        }
                    ]
                },
                {
                    "text": "工艺要求",
                    "type": "folder",
                    "name": "gyyq",
                    "children": [
                        {
                            "text": "炉温",
                            "unit": "C",
                            "type": "folder",
                            "name": "lw",
                            "children": [
                                {
                                    "text": "一区",
                                    "name": "q1"
                                },
                                {
                                    "text": "二区",
                                    "name": "q2"
                                },
                                {
                                    "text": "三区",
                                    "name": "q3"
                                },
                                {
                                    "text": "四区",
                                    "name": "q4"
                                },
                                {
                                    "text": "五区",
                                    "name": "q5"
                                }
                            ]
                        },
                        {
                            "text": "铅温",
                            "unit": "C",
                            "type": "folder",
                            "name": "qw",
                            "children": [
                                {
                                    "text": "一区",
                                    "name": "q1"
                                },
                                {
                                    "text": "二区",
                                    "name": "q2"
                                }
                            ]
                        },
                        {
                            "text": "水浴",
                            "type": "folder",
                            "name": "sy",
                            "children": [
                                {
                                    "text": "1号槽",
                                    "type": "folder",
                                    "name": "hc1",
                                    "children": [
                                        {
                                            "text": "浴液温度",
                                            "unit": "C",
                                            "name": "yywd"
                                        },
                                        {
                                            "text": "出炉线温",
                                            "unit": "C",
                                            "name": "clxw"
                                        },
                                        {
                                            "text": "出水线温",
                                            "unit": "C",
                                            "name": "csxw"
                                        },
                                        {
                                            "text": "溶液浓度",
                                            "unit": "%",
                                            "name": "rynd"
                                        }
                                    ]
                                },
                                {
                                    "text": "2号槽",
                                    "type": "folder",
                                    "name": "hc2",
                                    "children": [
                                        {
                                            "text": "浴液温度",
                                            "unit": "C",
                                            "name": "yywd"
                                        },
                                        {
                                            "text": "出炉线温",
                                            "unit": "C",
                                            "name": "clxw"
                                        },
                                        {
                                            "text": "出水线温",
                                            "unit": "C",
                                            "name": "csxw"
                                        },
                                        {
                                            "text": "溶液浓度",
                                            "unit": "%",
                                            "name": "rynd"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "酸洗",
                            "type": "folder",
                            "name": "sx",
                            "children": [
                                {
                                    "text": "1号槽",
                                    "type": "folder",
                                    "name": "hc1",
                                    "children": [
                                        {
                                            "text": "盐酸浓度",
                                            "unit": "%",
                                            "name": "ysnd"
                                        },
                                        {
                                            "text": "氯化亚铁含量",
                                            "unit": "g/mL",
                                            "name": "lhythl"
                                        },
                                        {
                                            "text": "温度",
                                            "unit": "C",
                                            "name": "wd"
                                        }
                                    ]
                                },
                                {
                                    "text": "2号槽",
                                    "type": "folder",
                                    "name": "hc2",
                                    "children": [
                                        {
                                            "text": "盐酸浓度",
                                            "unit": "%",
                                            "name": "ysnd"
                                        },
                                        {
                                            "text": "氯化亚铁含量",
                                            "unit": "g/mL",
                                            "name": "lhythl"
                                        },
                                        {
                                            "text": "温度",
                                            "unit": "C",
                                            "name": "wd"
                                        }
                                    ]
                                },
                                {
                                    "text": "3号槽",
                                    "type": "folder",
                                    "name": "hc3",
                                    "children": [
                                        {
                                            "text": "盐酸浓度",
                                            "unit": "%",
                                            "name": "ysnd"
                                        },
                                        {
                                            "text": "氯化亚铁含量",
                                            "unit": "g/mL",
                                            "name": "lhythl"
                                        },
                                        {
                                            "text": "温度",
                                            "unit": "C",
                                            "name": "wd"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "水洗",
                            "type": "folder",
                            "name": "sx",
                            "children": [
                                {
                                    "text": "PH值",
                                    "name": "phz"
                                },
                                {
                                    "text": "温度",
                                    "unit": "C",
                                    "name": "wd"
                                }
                            ]
                        },
                        {
                            "text": "磷化",
                            "type": "folder",
                            "name": "lh",
                            "children": [
                                {
                                    "text": "总酸度",
                                    "unit": "点",
                                    "type": "folder",
                                    "name": "zsd",
                                    "children": [
                                        {
                                            "text": "最小",
                                            "name": "zx"
                                        },
                                        {
                                            "text": "标准",
                                            "name": "bz"
                                        },
                                        {
                                            "text": "最大",
                                            "name": "zd"
                                        }
                                    ]
                                },
                                {
                                    "text": "游离酸",
                                    "unit": "点",
                                    "type": "folder",
                                    "name": "yls",
                                    "children": [
                                        {
                                            "text": "最小",
                                            "name": "zx"
                                        },
                                        {
                                            "text": "标准",
                                            "name": "bz"
                                        },
                                        {
                                            "text": "最大",
                                            "name": "zd"
                                        }
                                    ]
                                },
                                {
                                    "text": "温度",
                                    "unit": "C",
                                    "type": "folder",
                                    "name": "wd",
                                    "children": [
                                        {
                                            "text": "最小",
                                            "name": "zx"
                                        },
                                        {
                                            "text": "标准",
                                            "name": "bz"
                                        },
                                        {
                                            "text": "最大",
                                            "name": "zd"
                                        }
                                    ]
                                },
                                {
                                    "text": "磷化膜质量",
                                    "unit": "g/m2",
                                    "type": "folder",
                                    "name": "lhmzl",
                                    "children": [
                                        {
                                            "text": "最小",
                                            "name": "zx"
                                        },
                                        {
                                            "text": "标准",
                                            "name": "bz"
                                        },
                                        {
                                            "text": "最大",
                                            "name": "zd"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "水洗",
                            "type": "folder",
                            "name": "sx",
                            "children": [
                                {
                                    "text": "PH值",
                                    "name": "phz"
                                },
                                {
                                    "text": "温度",
                                    "unit": "C",
                                    "name": "wd"
                                }
                            ]
                        },
                        {
                            "text": "皂化",
                            "type": "folder",
                            "name": "zh",
                            "children": [
                                {
                                    "text": "皂化液浓度",
                                    "unit": "%",
                                    "name": "zhynd"
                                },
                                {
                                    "text": "温度",
                                    "unit": "C",
                                    "name": "wd"
                                }
                            ]
                        },
                        {
                            "text": "烘干温度",
                            "unit": "C",
                            "name": "hgwd"
                        },
                        {
                            "text": "收线",
                            "type": "folder",
                            "name": "sx",
                            "children": [
                                {
                                    "text": "花篮架型号",
                                    "name": "hljxh"
                                },
                                {
                                    "text": "按线速度调整",
                                    "unit": "米/S",
                                    "name": "axsdtz"
                                },
                                {
                                    "text": "按转速调整",
                                    "unit": "米/S",
                                    "name": "azstz"
                                }
                            ]
                        }
                    ]
                },
                {
                    "text": "原辅材料及工装要求",
                    "type": "folder",
                    "name": "yfcljgzyq",
                    "children": [
                        {
                            "text": "铅块型号",
                            "name": "qkxh"
                        },
                        {
                            "text": "覆盖剂型号",
                            "name": "fgjxh"
                        },
                        {
                            "text": "水添加剂型号",
                            "name": "stjjxh"
                        },
                        {
                            "text": "盐酸型号",
                            "name": "ysxh"
                        },
                        {
                            "text": "磷化液型号",
                            "name": "lhyxh"
                        },
                        {
                            "text": "皂化液型号",
                            "name": "zhyxh"
                        },
                        {
                            "text": "碱液型号",
                            "name": "jyxh"
                        }
                    ]
                }
            ]
        },
        {
            "name": "镀锌坯料工单",
            "alias": "dxpl_workorder",
            "type": {
                "name": "work_order",
                "value": "工单"
            },
            "default": false,
            "display": false,
            "selected": false,
            "category": {
                "name": "form",
                "value": "表单"
            },
            "order": 94,
            "perms": [
                "display",
                "operate",
                "approve",
                "assign",
                "confirm"
            ],
            "header": [
                {
                    "name": "form_no",
                    "text": "表单编号"
                },
                {
                    "name": "author",
                    "text": "编制"
                },
                {
                    "name": "created",
                    "text": "编制日期"
                },
                {
                    "name": "version",
                    "text": "版本号"
                },
                {
                    "name": "auditor",
                    "text": "审核"
                },
                {
                    "name": "audit_date",
                    "text": "审核日期"
                }
            ],
            "body": [
                {
                    "text": "生产要求",
                    "type": "folder",
                    "name": "scyq",
                    "children": [
                        {
                            "text": "产品编号",
                            "name": "cpbh"
                        },
                        {
                            "text": "制造号",
                            "name": "zzh"
                        },
                        {
                            "text": "制造序列号",
                            "name": "zzxlh"
                        },
                        {
                            "text": "线号",
                            "name": "xh"
                        },
                        {
                            "text": "班别",
                            "name": "bb"
                        },
                        {
                            "text": "班长",
                            "name": "bz"
                        },
                        {
                            "text": "操作工",
                            "name": "czg"
                        },
                        {
                            "text": "放线架号",
                            "name": "fxjh"
                        },
                        {
                            "text": "收线架号",
                            "name": "sxjh"
                        },
                        {
                            "text": "调产时间",
                            "type": "folder",
                            "name": "tcsj",
                            "children": [
                                {
                                    "text": "开始时间",
                                    "name": "kssj"
                                },
                                {
                                    "text": "结束时间",
                                    "name": "jssj"
                                },
                                {
                                    "text": "用时",
                                    "unit": "H",
                                    "name": "ys"
                                }
                            ]
                        },
                        {
                            "text": "完成生产时间",
                            "name": "wcscsj"
                        },
                        {
                            "text": "镀前",
                            "type": "folder",
                            "name": "dq",
                            "children": [
                                {
                                    "text": "钢号",
                                    "name": "gh"
                                },
                                {
                                    "text": "炉号",
                                    "name": "lh"
                                },
                                {
                                    "text": "直径",
                                    "unit": "mm",
                                    "name": "zj"
                                },
                                {
                                    "text": "强度",
                                    "unit": "MPa",
                                    "name": "qd"
                                }
                            ]
                        },
                        {
                            "text": "镀后",
                            "type": "folder",
                            "name": "dh",
                            "children": [
                                {
                                    "text": "钢号",
                                    "name": "gh"
                                },
                                {
                                    "text": "炉号",
                                    "name": "lh"
                                },
                                {
                                    "text": "直径",
                                    "unit": "mm",
                                    "name": "zj"
                                },
                                {
                                    "text": "公差",
                                    "unit": "mm",
                                    "name": "gc"
                                },
                                {
                                    "text": "强度",
                                    "unit": "MPa",
                                    "name": "qd"
                                }
                            ]
                        },
                        {
                            "text": "放线工字轮",
                            "type": "folder",
                            "name": "fxgzl",
                            "children": [
                                {
                                    "text": "型号",
                                    "name": "xh"
                                },
                                {
                                    "text": "编号",
                                    "name": "bh"
                                }
                            ]
                        },
                        {
                            "text": "标准产量",
                            "unit": "m/H",
                            "name": "bzcl"
                        },
                        {
                            "text": "日计划产量",
                            "type": "folder",
                            "name": "rjhcl",
                            "children": [
                                {
                                    "text": "产量",
                                    "unit": "t",
                                    "name": "cl"
                                },
                                {
                                    "text": "件数",
                                    "name": "js"
                                }
                            ]
                        },
                        {
                            "text": "日实际产量",
                            "type": "folder",
                            "name": "rsjcl",
                            "children": [
                                {
                                    "text": "产量",
                                    "unit": "t",
                                    "name": "cl"
                                },
                                {
                                    "text": "件数",
                                    "name": "js"
                                }
                            ]
                        },
                        {
                            "text": "收线花篮架",
                            "type": "folder",
                            "name": "sxhlq",
                            "children": [
                                {
                                    "text": "型号",
                                    "name": "xh"
                                },
                                {
                                    "text": "编号",
                                    "name": "bh"
                                }
                            ]
                        },
                        {
                            "text": "中间停机时间",
                            "type": "folder",
                            "many": true,
                            "name": "zjtjsj",
                            "children": [
                                {
                                    "text": "停机时间",
                                    "name": "tjsj"
                                },
                                {
                                    "text": "重启时间",
                                    "name": "cqyy"
                                },
                                {
                                    "text": "停机原因",
                                    "name": "tjyy"
                                }
                            ]
                        },
                        {
                            "text": "下线粗拉料放置区编号",
                            "name": "xxcllfzqbh"
                        },
                        {
                            "text": "下线热处理料放置区编号",
                            "name": "xxrcllfzqbh"
                        }
                    ]
                },
                {
                    "text": "工艺要求",
                    "type": "folder",
                    "name": "gyyq",
                    "children": [
                        {
                            "text": "炉温",
                            "unit": "C",
                            "type": "folder",
                            "name": "lw",
                            "children": [
                                {
                                    "text": "一区",
                                    "name": "q1"
                                },
                                {
                                    "text": "二区",
                                    "name": "q2"
                                },
                                {
                                    "text": "三区",
                                    "name": "q3"
                                },
                                {
                                    "text": "四区",
                                    "name": "q4"
                                },
                                {
                                    "text": "五区",
                                    "name": "q5"
                                }
                            ]
                        },
                        {
                            "text": "水浴",
                            "type": "folder",
                            "name": "sy",
                            "children": [
                                {
                                    "text": "1号槽",
                                    "type": "folder",
                                    "name": "hc1",
                                    "children": [
                                        {
                                            "text": "浴液温度",
                                            "unit": "C",
                                            "name": "yywd"
                                        },
                                        {
                                            "text": "出炉线温",
                                            "unit": "C",
                                            "name": "clxw"
                                        },
                                        {
                                            "text": "出水线温",
                                            "unit": "C",
                                            "name": "csxw"
                                        },
                                        {
                                            "text": "溶液浓度",
                                            "unit": "%",
                                            "name": "rynd"
                                        }
                                    ]
                                },
                                {
                                    "text": "2号槽",
                                    "type": "folder",
                                    "name": "hc2",
                                    "children": [
                                        {
                                            "text": "浴液温度",
                                            "unit": "C",
                                            "name": "yywd"
                                        },
                                        {
                                            "text": "出炉线温",
                                            "unit": "C",
                                            "name": "clxw"
                                        },
                                        {
                                            "text": "出水线温",
                                            "unit": "C",
                                            "name": "csxw"
                                        },
                                        {
                                            "text": "溶液浓度",
                                            "unit": "%",
                                            "name": "rynd"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "碱洗",
                            "type": "folder",
                            "name": "jx",
                            "children": [
                                {
                                    "text": "1号槽",
                                    "type": "folder",
                                    "name": "hc1",
                                    "children": [
                                        {
                                            "text": "碱液浓度",
                                            "unit": "%",
                                            "name": "jynd"
                                        },
                                        {
                                            "text": "温度",
                                            "unit": "C",
                                            "name": "wd"
                                        }
                                    ]
                                },
                                {
                                    "text": "2号槽",
                                    "type": "folder",
                                    "name": "hc2",
                                    "children": [
                                        {
                                            "text": "碱液浓度",
                                            "unit": "%",
                                            "name": "jynd"
                                        },
                                        {
                                            "text": "温度",
                                            "unit": "C",
                                            "name": "wd"
                                        }
                                    ]
                                },
                                {
                                    "text": "3号槽",
                                    "type": "folder",
                                    "name": "hc3",
                                    "children": [
                                        {
                                            "text": "碱液浓度",
                                            "unit": "%",
                                            "name": "jynd"
                                        },
                                        {
                                            "text": "温度",
                                            "unit": "C",
                                            "name": "wd"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "水槽",
                            "type": "folder",
                            "name": "sc",
                            "children": [
                                {
                                    "text": "PH值",
                                    "name": "phz"
                                },
                                {
                                    "text": "温度",
                                    "unit": "C",
                                    "name": "wd"
                                }
                            ]
                        },
                        {
                            "text": "酸洗",
                            "type": "folder",
                            "name": "sx",
                            "children": [
                                {
                                    "text": "1号槽",
                                    "type": "folder",
                                    "name": "hc1",
                                    "children": [
                                        {
                                            "text": "盐酸浓度",
                                            "unit": "%",
                                            "name": "ysnd"
                                        },
                                        {
                                            "text": "氯化亚铁含量",
                                            "unit": "g/mL",
                                            "name": "lhythl"
                                        },
                                        {
                                            "text": "温度",
                                            "unit": "C",
                                            "name": "wd"
                                        }
                                    ]
                                },
                                {
                                    "text": "2号槽",
                                    "type": "folder",
                                    "name": "hc2",
                                    "children": [
                                        {
                                            "text": "盐酸浓度",
                                            "unit": "%",
                                            "name": "ysnd"
                                        },
                                        {
                                            "text": "氯化亚铁含量",
                                            "unit": "g/mL",
                                            "name": "lhythl"
                                        },
                                        {
                                            "text": "温度",
                                            "unit": "C",
                                            "name": "wd"
                                        }
                                    ]
                                },
                                {
                                    "text": "3号槽",
                                    "type": "folder",
                                    "name": "hc3",
                                    "children": [
                                        {
                                            "text": "盐酸浓度",
                                            "unit": "%",
                                            "name": "ysnd"
                                        },
                                        {
                                            "text": "氯化亚铁含量",
                                            "unit": "g/mL",
                                            "name": "lhythl"
                                        },
                                        {
                                            "text": "温度",
                                            "unit": "C",
                                            "name": "wd"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "水槽",
                            "type": "folder",
                            "name": "sc",
                            "children": [
                                {
                                    "text": "PH值",
                                    "name": "phz"
                                },
                                {
                                    "text": "温度",
                                    "unit": "C",
                                    "name": "wd"
                                }
                            ]
                        },
                        {
                            "text": "涂助熔剂",
                            "type": "folder",
                            "name": "rzrj",
                            "children": [
                                {
                                    "text": "浓度",
                                    "unit": "%",
                                    "name": "nd"
                                },
                                {
                                    "text": "温度",
                                    "unit": "C",
                                    "name": "wd"
                                }
                            ]
                        },
                        {
                            "text": "烘干温度",
                            "unit": "C",
                            "name": "hgwd"
                        },
                        {
                            "text": "锌锅温度",
                            "unit": "C",
                            "type": "folder",
                            "name": "xgwd",
                            "children": [
                                {
                                    "text": "一区",
                                    "name": "q1"
                                },
                                {
                                    "text": "二区",
                                    "name": "q2"
                                }
                            ]
                        },
                        {
                            "text": "收线",
                            "type": "folder",
                            "name": "sx",
                            "children": [
                                {
                                    "text": "花篮架型号",
                                    "name": "hljxh"
                                },
                                {
                                    "text": "按线速度调整",
                                    "unit": "米/S",
                                    "name": "axsdtz"
                                },
                                {
                                    "text": "按转速调整",
                                    "unit": "米/S",
                                    "name": "azstz"
                                }
                            ]
                        }
                    ]
                },
                {
                    "text": "原辅材料及工装要求",
                    "type": "folder",
                    "name": "yfcljgzyq",
                    "children": [
                        {
                            "text": "锌粉型号",
                            "name": "xfxh"
                        },
                        {
                            "text": "碱液型号",
                            "name": "jyxh"
                        },
                        {
                            "text": "盐酸型号",
                            "name": "ysxh"
                        },
                        {
                            "text": "水添加剂型号",
                            "name": "stjjxh"
                        },
                        {
                            "text": "助熔剂型号",
                            "name": "zrjxh"
                        }
                    ]
                }
            ]
        },
        {
            "name": "镀锌钢丝工单",
            "alias": "dxgs_workorder",
            "type": {
                "name": "work_order",
                "value": "工单"
            },
            "default": false,
            "display": false,
            "selected": false,
            "category": {
                "name": "form",
                "value": "表单"
            },
            "order": 95,
            "perms": [
                "display",
                "operate",
                "approve",
                "assign",
                "confirm"
            ],
            "header": [
                {
                    "name": "form_no",
                    "text": "表单编号"
                },
                {
                    "name": "author",
                    "text": "编制"
                },
                {
                    "name": "created",
                    "text": "编制日期"
                },
                {
                    "name": "version",
                    "text": "版本号"
                },
                {
                    "name": "auditor",
                    "text": "审核"
                },
                {
                    "name": "audit_date",
                    "text": "审核日期"
                }
            ],
            "body": [
                {
                    "text": "生产要求",
                    "type": "folder",
                    "name": "scyq",
                    "children": [
                        {
                            "text": "产品编号",
                            "name": "cpbh"
                        },
                        {
                            "text": "制造号",
                            "name": "zzh"
                        },
                        {
                            "text": "制造序列号",
                            "name": "zzxlh"
                        },
                        {
                            "text": "线号",
                            "name": "xh"
                        },
                        {
                            "text": "班别",
                            "name": "bb"
                        },
                        {
                            "text": "班长",
                            "name": "bz"
                        },
                        {
                            "text": "操作工",
                            "name": "czg"
                        },
                        {
                            "text": "收线架号",
                            "name": "sxjh"
                        },
                        {
                            "text": "调产时间",
                            "type": "folder",
                            "name": "tcsj",
                            "children": [
                                {
                                    "text": "开始时间",
                                    "name": "kssj"
                                },
                                {
                                    "text": "结束时间",
                                    "name": "jssj"
                                },
                                {
                                    "text": "用时",
                                    "unit": "H",
                                    "name": "ys"
                                }
                            ]
                        },
                        {
                            "text": "完成生产时间",
                            "name": "wcscsj"
                        },
                        {
                            "text": "镀前",
                            "type": "folder",
                            "name": "dq",
                            "children": [
                                {
                                    "text": "钢号",
                                    "name": "gh"
                                },
                                {
                                    "text": "炉号",
                                    "name": "lh"
                                },
                                {
                                    "text": "直径",
                                    "unit": "mm",
                                    "name": "zj"
                                },
                                {
                                    "text": "强度",
                                    "unit": "MPa",
                                    "name": "qd"
                                }
                            ]
                        },
                        {
                            "text": "镀后",
                            "type": "folder",
                            "name": "dh",
                            "children": [
                                {
                                    "text": "钢号",
                                    "name": "gh"
                                },
                                {
                                    "text": "炉号",
                                    "name": "lh"
                                },
                                {
                                    "text": "直径",
                                    "unit": "mm",
                                    "name": "zj"
                                },
                                {
                                    "text": "公差",
                                    "unit": "mm",
                                    "name": "gc"
                                },
                                {
                                    "text": "强度",
                                    "unit": "MPa",
                                    "name": "qd"
                                }
                            ]
                        },
                        {
                            "text": "放线工字轮",
                            "type": "folder",
                            "name": "fxgzl",
                            "children": [
                                {
                                    "text": "型号",
                                    "name": "xh"
                                },
                                {
                                    "text": "编号",
                                    "name": "bh"
                                }
                            ]
                        },
                        {
                            "text": "标准产量",
                            "unit": "m/H",
                            "name": "bzcl"
                        },
                        {
                            "text": "日计划产量",
                            "type": "folder",
                            "name": "rjhcl",
                            "children": [
                                {
                                    "text": "产量",
                                    "unit": "m",
                                    "name": "cl"
                                },
                                {
                                    "text": "件数",
                                    "name": "js"
                                }
                            ]
                        },
                        {
                            "text": "日实际产量",
                            "type": "folder",
                            "name": "rsjcl",
                            "children": [
                                {
                                    "text": "产量",
                                    "unit": "m",
                                    "name": "cl"
                                },
                                {
                                    "text": "件数",
                                    "name": "js"
                                }
                            ]
                        },
                        {
                            "text": "收线工字轮",
                            "type": "folder",
                            "name": "sxgzl",
                            "children": [
                                {
                                    "text": "型号",
                                    "name": "xh"
                                },
                                {
                                    "text": "编号",
                                    "name": "bh"
                                }
                            ]
                        },
                        {
                            "text": "中间停机时间",
                            "type": "folder",
                            "many": true,
                            "name": "zjtjsj",
                            "children": [
                                {
                                    "text": "停机时间",
                                    "name": "tjsj"
                                },
                                {
                                    "text": "重启时间",
                                    "name": "cqyy"
                                },
                                {
                                    "text": "停机原因",
                                    "name": "tjyy"
                                }
                            ]
                        },
                        {
                            "text": "下线细拉钢丝放置区编号",
                            "name": "xxxlgsfzqbh"
                        }
                    ]
                },
                {
                    "text": "工艺要求",
                    "type": "folder",
                    "name": "gyyq",
                    "children": [
                        {
                            "text": "脱脂",
                            "type": "folder",
                            "name": "tz",
                            "children": [
                                {
                                    "text": "1号槽",
                                    "type": "folder",
                                    "name": "hc1",
                                    "children": [
                                        {
                                            "text": "碱液浓度",
                                            "unit": "%",
                                            "name": "jynd"
                                        },
                                        {
                                            "text": "温度",
                                            "unit": "C",
                                            "name": "wd"
                                        }
                                    ]
                                },
                                {
                                    "text": "2号槽",
                                    "type": "folder",
                                    "name": "hc2",
                                    "children": [
                                        {
                                            "text": "碱液浓度",
                                            "unit": "%",
                                            "name": "jynd"
                                        },
                                        {
                                            "text": "温度",
                                            "unit": "C",
                                            "name": "wd"
                                        }
                                    ]
                                },
                                {
                                    "text": "3号槽",
                                    "type": "folder",
                                    "name": "hc3",
                                    "children": [
                                        {
                                            "text": "碱液浓度",
                                            "unit": "%",
                                            "name": "jynd"
                                        },
                                        {
                                            "text": "温度",
                                            "unit": "C",
                                            "name": "wd"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "水槽",
                            "type": "folder",
                            "name": "sc",
                            "children": [
                                {
                                    "text": "PH值",
                                    "name": "phz"
                                },
                                {
                                    "text": "温度",
                                    "unit": "C",
                                    "name": "wd"
                                }
                            ]
                        },
                        {
                            "text": "酸洗",
                            "type": "folder",
                            "name": "sx",
                            "children": [
                                {
                                    "text": "1号槽",
                                    "type": "folder",
                                    "name": "hc1",
                                    "children": [
                                        {
                                            "text": "盐酸浓度",
                                            "unit": "%",
                                            "name": "ysnd"
                                        },
                                        {
                                            "text": "氯化亚铁含量",
                                            "unit": "g/mL",
                                            "name": "lhythl"
                                        },
                                        {
                                            "text": "温度",
                                            "unit": "C",
                                            "name": "wd"
                                        }
                                    ]
                                },
                                {
                                    "text": "2号槽",
                                    "type": "folder",
                                    "name": "hc2",
                                    "children": [
                                        {
                                            "text": "盐酸浓度",
                                            "unit": "%",
                                            "name": "ysnd"
                                        },
                                        {
                                            "text": "氯化亚铁含量",
                                            "unit": "g/mL",
                                            "name": "lhythl"
                                        },
                                        {
                                            "text": "温度",
                                            "unit": "C",
                                            "name": "wd"
                                        }
                                    ]
                                },
                                {
                                    "text": "3号槽",
                                    "type": "folder",
                                    "name": "hc3",
                                    "children": [
                                        {
                                            "text": "盐酸浓度",
                                            "unit": "%",
                                            "name": "ysnd"
                                        },
                                        {
                                            "text": "氯化亚铁含量",
                                            "unit": "g/mL",
                                            "name": "lhythl"
                                        },
                                        {
                                            "text": "温度",
                                            "unit": "C",
                                            "name": "wd"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "水槽",
                            "type": "folder",
                            "name": "sc",
                            "children": [
                                {
                                    "text": "PH值",
                                    "name": "phz"
                                },
                                {
                                    "text": "温度",
                                    "unit": "C",
                                    "name": "wd"
                                }
                            ]
                        },
                        {
                            "text": "涂助熔剂",
                            "type": "folder",
                            "name": "rzrj",
                            "children": [
                                {
                                    "text": "浓度",
                                    "unit": "%",
                                    "name": "nd"
                                },
                                {
                                    "text": "温度",
                                    "unit": "C",
                                    "name": "wd"
                                }
                            ]
                        },
                        {
                            "text": "烘干温度",
                            "unit": "C",
                            "name": "hgwd"
                        },
                        {
                            "text": "锌锅温度",
                            "unit": "C",
                            "type": "folder",
                            "name": "xgwd",
                            "children": [
                                {
                                    "text": "一区",
                                    "name": "q1"
                                },
                                {
                                    "text": "二区",
                                    "name": "q2"
                                }
                            ]
                        },
                        {
                            "text": "收线",
                            "type": "folder",
                            "name": "sx",
                            "children": [
                                {
                                    "text": "花篮架型号",
                                    "name": "hljxh"
                                },
                                {
                                    "text": "按线速度调整",
                                    "unit": "米/S",
                                    "name": "axsdtz"
                                },
                                {
                                    "text": "按转速调整",
                                    "unit": "米/S",
                                    "name": "azstz"
                                }
                            ]
                        }
                    ]
                },
                {
                    "text": "原辅材料及工装要求",
                    "type": "folder",
                    "name": "yfcljgzyq",
                    "children": [
                        {
                            "text": "锌粉型号",
                            "name": "xfxh"
                        },
                        {
                            "text": "碱液型号",
                            "name": "jyxh"
                        },
                        {
                            "text": "盐酸型号",
                            "name": "ysxh"
                        },
                        {
                            "text": "水浴添加剂型号",
                            "name": "srtjjxh"
                        },
                        {
                            "text": "助熔剂型号",
                            "name": "zrjxh"
                        }
                    ]
                }
            ]
        },
        {
            "name": "成品丝拉拔工单",
            "alias": "cps_workorder",
            "type": {
                "name": "work_order",
                "value": "工单"
            },
            "default": false,
            "display": false,
            "selected": false,
            "category": {
                "name": "form",
                "value": "表单"
            },
            "order": 96,
            "perms": [
                "display",
                "operate",
                "approve",
                "assign",
                "confirm"
            ],
            "header": [
                {
                    "name": "form_no",
                    "text": "表单编号"
                },
                {
                    "name": "author",
                    "text": "编制"
                },
                {
                    "name": "created",
                    "text": "编制日期"
                },
                {
                    "name": "version",
                    "text": "版本号"
                },
                {
                    "name": "auditor",
                    "text": "审核"
                },
                {
                    "name": "audit_date",
                    "text": "审核日期"
                }
            ],
            "body": [
                {
                    "text": "生产要求",
                    "type": "folder",
                    "name": "scyq",
                    "children": [
                        {
                            "text": "产品编号",
                            "name": "cpbh"
                        },
                        {
                            "text": "制造号",
                            "name": "zzh"
                        },
                        {
                            "text": "制造序列号",
                            "name": "zzxlh"
                        },
                        {
                            "text": "机台号",
                            "name": "jth"
                        },
                        {
                            "text": "班别",
                            "name": "bb"
                        },
                        {
                            "text": "班长",
                            "name": "bz"
                        },
                        {
                            "text": "操作工",
                            "name": "czg"
                        },
                        {
                            "text": "调产时间",
                            "type": "folder",
                            "name": "tcsj",
                            "children": [
                                {
                                    "text": "开始时间",
                                    "name": "kssj"
                                },
                                {
                                    "text": "结束时间",
                                    "name": "jssj"
                                },
                                {
                                    "text": "用时",
                                    "unit": "H",
                                    "name": "ys"
                                }
                            ]
                        },
                        {
                            "text": "生产完成时间",
                            "name": "scwcsj"
                        },
                        {
                            "text": "进线",
                            "type": "folder",
                            "name": "jx",
                            "children": [
                                {
                                    "text": "钢号",
                                    "name": "gh"
                                },
                                {
                                    "text": "炉号",
                                    "name": "lh"
                                },
                                {
                                    "text": "直径",
                                    "unit": "mm",
                                    "name": "zj"
                                },
                                {
                                    "text": "强度",
                                    "unit": "MPa",
                                    "name": "qd"
                                }
                            ]
                        },
                        {
                            "text": "出线",
                            "type": "folder",
                            "name": "cx",
                            "children": [
                                {
                                    "text": "钢号",
                                    "name": "gh"
                                },
                                {
                                    "text": "炉号",
                                    "name": "lh"
                                },
                                {
                                    "text": "直径",
                                    "unit": "mm",
                                    "name": "zj"
                                },
                                {
                                    "text": "公差",
                                    "unit": "mm",
                                    "name": "gc"
                                },
                                {
                                    "text": "强度",
                                    "unit": "MPa",
                                    "name": "qd"
                                }
                            ]
                        },
                        {
                            "text": "放线花篮架",
                            "type": "folder",
                            "name": "fxhlj",
                            "children": [
                                {
                                    "text": "型号",
                                    "name": "xh"
                                },
                                {
                                    "text": "编号",
                                    "name": "bh"
                                }
                            ]
                        },
                        {
                            "text": "标准产量",
                            "unit": "m/H",
                            "name": "bzcl"
                        },
                        {
                            "text": "日计划产量",
                            "type": "folder",
                            "name": "rjhcl",
                            "children": [
                                {
                                    "text": "件数",
                                    "name": "js"
                                },
                                {
                                    "text": "米长",
                                    "unit": "m",
                                    "name": "mc"
                                }
                            ]
                        },
                        {
                            "text": "日实际产量",
                            "type": "folder",
                            "name": "rsjcl",
                            "children": [
                                {
                                    "text": "件数",
                                    "name": "js"
                                },
                                {
                                    "text": "米长",
                                    "unit": "m",
                                    "name": "mc"
                                }
                            ]
                        },
                        {
                            "text": "收线工字轮",
                            "type": "folder",
                            "name": "sxgzl",
                            "children": [
                                {
                                    "text": "型号",
                                    "name": "xh"
                                },
                                {
                                    "text": "编号",
                                    "name": "bh"
                                }
                            ]
                        },
                        {
                            "text": "中间停机时间",
                            "type": "folder",
                            "many": true,
                            "name": "zjtjsj",
                            "children": [
                                {
                                    "text": "停机时间",
                                    "name": "tjsj"
                                },
                                {
                                    "text": "重启时间",
                                    "name": "cqyy"
                                },
                                {
                                    "text": "停机原因",
                                    "name": "tjyy"
                                }
                            ]
                        },
                        {
                            "text": "下线热处理料放置区编号",
                            "name": "xxrcllfzqbh"
                        },
                        {
                            "text": "下线细拉钢丝放置区编号",
                            "name": "xxxlgsfzqbh"
                        }
                    ]
                },
                {
                    "text": "工艺要求",
                    "type": "folder",
                    "name": "gyyq",
                    "children": [
                        {
                            "text": "进线直径",
                            "unit": "mm",
                            "name": "jxzj"
                        },
                        {
                            "text": "出线直径",
                            "unit": "mm",
                            "name": "cxzj"
                        },
                        {
                            "text": "拉拔道次(模链)",
                            "unit": "mm",
                            "name": "lbdcml"
                        }
                    ]
                },
                {
                    "text": "原辅材料及工装要求",
                    "type": "folder",
                    "name": "yfcljgzyq",
                    "children": [
                        {
                            "text": "拉丝粉型号",
                            "name": "lsfxh"
                        },
                        {
                            "text": "润滑剂型号",
                            "name": "rhjxh"
                        },
                        {
                            "text": "后变形器型号",
                            "name": "hbxqxh"
                        }
                    ]
                }
            ]
        },
        {
            "name": "捻股工单",
            "alias": "ng_work_order",
            "type": {
                "name": "work_order",
                "value": "工单"
            },
            "default": false,
            "display": false,
            "selected": false,
            "category": {
                "name": "form",
                "value": "表单"
            },
            "order": 97,
            "perms": [
                "display",
                "operate",
                "approve",
                "assign",
                "confirm"
            ],
            "header": [
                {
                    "name": "form_no",
                    "text": "表单编号"
                },
                {
                    "name": "author",
                    "text": "编制"
                },
                {
                    "name": "created",
                    "text": "编制日期"
                },
                {
                    "name": "version",
                    "text": "版本号"
                },
                {
                    "name": "auditor",
                    "text": "审核"
                },
                {
                    "name": "audit_date",
                    "text": "审核日期"
                }
            ],
            "body": [
                {
                    "text": "生产日期",
                    "name": "scrq"
                },
                {
                    "text": "工段制造号",
                    "name": "gdzzh"
                },
                {
                    "text": "是否定制",
                    "name": "sfdz"
                },
                {
                    "text": "车间",
                    "name": "cj"
                },
                {
                    "text": "机台号",
                    "name": "jth"
                },
                {
                    "text": "机台米长系数",
                    "name": "jtmcxs"
                },
                {
                    "text": "班组",
                    "name": "bz"
                },
                {
                    "text": "班长",
                    "name": "bzz"
                },
                {
                    "text": "操作工",
                    "name": "czg"
                },
                {
                    "text": "调产时间",
                    "name": "tcsj",
                    "type": "folder",
                    "children": [
                        {
                            "text": "开始时间",
                            "name": "kssj"
                        },
                        {
                            "text": "完成时间",
                            "name": "wcsj"
                        },
                        {
                            "text": "调产用时",
                            "name": "tcys"
                        }
                    ]
                },
                {
                    "text": "生产时间",
                    "name": "scsj",
                    "type": "folder",
                    "children": [
                        {
                            "text": "开始时间",
                            "name": "kssj"
                        },
                        {
                            "text": "完成时间",
                            "name": "wcsj"
                        },
                        {
                            "text": "生产用时",
                            "name": "scys"
                        }
                    ]
                },
                {
                    "text": "捻股前用料",
                    "name": "ngqyl",
                    "type": "folder",
                    "children": [
                        {
                            "text": "中间品",
                            "name": "zjp",
                            "type": "folder",
                            "children": [
                                {
                                    "text": "规格",
                                    "name": "gg",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "结构",
                                            "name": "jg"
                                        },
                                        {
                                            "text": "直径",
                                            "name": "zj",
                                            "unit": "mm"
                                        },
                                        {
                                            "text": "捻向",
                                            "name": "nx"
                                        },
                                        {
                                            "text": "强度",
                                            "name": "qd",
                                            "unit": "Mpa"
                                        },
                                        {
                                            "text": "涂油方式",
                                            "name": "tyfs"
                                        },
                                        {
                                            "text": "捻距",
                                            "name": "nj",
                                            "unit": "mm"
                                        },
                                        {
                                            "text": "表面状态",
                                            "name": "bmzt"
                                        }
                                    ]
                                },
                                {
                                    "text": "用量",
                                    "name": "yl",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "用量n",
                                            "name": "yln",
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "段长",
                                                    "name": "dc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "段数",
                                                    "name": "ds"
                                                },
                                                {
                                                    "text": "单件米长",
                                                    "name": "djmc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "单件损耗",
                                                    "name": "djsh",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "单件需求米长",
                                                    "name": "djxqmc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "件数",
                                                    "name": "js"
                                                },
                                                {
                                                    "text": "总米长",
                                                    "name": "zmc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "总损耗",
                                                    "name": "zsh",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "总需求米长",
                                                    "name": "zxqmc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "工字轮型号",
                                                    "name": "gzlxh"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "第n层丝",
                            "name": "sdcn",
                            "type": "folder",
                            "children": [
                                {
                                    "text": "丝n",
                                    "name": "sn",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "规格",
                                            "name": "gg",
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "类别",
                                                    "name": "lb"
                                                },
                                                {
                                                    "text": "直径",
                                                    "name": "zj",
                                                    "unit": "mm"
                                                },
                                                {
                                                    "text": "强度",
                                                    "name": "qd",
                                                    "unit": "Mpa"
                                                }
                                            ]
                                        },
                                        {
                                            "text": "用量",
                                            "name": "yl",
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "根数",
                                                    "name": "gs"
                                                },
                                                {
                                                    "text": "用量n",
                                                    "name": "yln",
                                                    "type": "folder",
                                                    "children": [
                                                        {
                                                            "text": "段长",
                                                            "name": "dc",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "段数",
                                                            "name": "ds"
                                                        },
                                                        {
                                                            "text": "单件米长",
                                                            "name": "djmc",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "安全系数",
                                                            "name": "aqxs",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "单件需求米长",
                                                            "name": "djxqmc",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "件数",
                                                            "name": "js"
                                                        },
                                                        {
                                                            "text": "总米长",
                                                            "name": "zmc",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "总需求米长",
                                                            "name": "zxqmc",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "工字轮型号",
                                                            "name": "gzlxh"
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "丝n",
                            "name": "sn",
                            "type": "folder",
                            "children": [
                                {
                                    "text": "规格",
                                    "name": "gg",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "类别",
                                            "name": "lb"
                                        },
                                        {
                                            "text": "直径",
                                            "name": "zj",
                                            "unit": "mm"
                                        },
                                        {
                                            "text": "强度",
                                            "name": "qd",
                                            "unit": "Mpa"
                                        }
                                    ]
                                },
                                {
                                    "text": "用量",
                                    "name": "yl",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "根数",
                                            "name": "gs"
                                        },
                                        {
                                            "text": "用量n",
                                            "name": "yln",
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "段长",
                                                    "name": "dc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "段数",
                                                    "name": "ds"
                                                },
                                                {
                                                    "text": "单件米长",
                                                    "name": "djmc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "安全系数",
                                                    "name": "aqxs",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "单件需求米长",
                                                    "name": "djxqmc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "件数",
                                                    "name": "js"
                                                },
                                                {
                                                    "text": "总米长",
                                                    "name": "zmc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "总需求米长",
                                                    "name": "zxqmc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "工字轮型号",
                                                    "name": "gzlxh"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "中心丝",
                            "name": "zxs",
                            "type": "folder",
                            "children": [
                                {
                                    "text": "规格",
                                    "name": "gg",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "类别",
                                            "name": "lb"
                                        },
                                        {
                                            "text": "直径",
                                            "name": "zj",
                                            "unit": "mm"
                                        },
                                        {
                                            "text": "强度",
                                            "name": "qd",
                                            "unit": "Mpa"
                                        }
                                    ]
                                },
                                {
                                    "text": "用量",
                                    "name": "yl",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "用量n",
                                            "name": "yln",
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "段长",
                                                    "name": "dc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "段数",
                                                    "name": "ds"
                                                },
                                                {
                                                    "text": "单件米长",
                                                    "name": "djmc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "安全系数",
                                                    "name": "aqxs",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "单件需求米长",
                                                    "name": "djxqmc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "件数",
                                                    "name": "js"
                                                },
                                                {
                                                    "text": "总米长",
                                                    "name": "zmc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "总需求米长",
                                                    "name": "zxqmc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "工字轮型号",
                                                    "name": "gzlxh"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "外钢丝",
                            "name": "wgs",
                            "type": "folder",
                            "children": [
                                {
                                    "text": "丝n",
                                    "name": "sn",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "规格",
                                            "name": "gg",
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "类别",
                                                    "name": "lb"
                                                },
                                                {
                                                    "text": "直径",
                                                    "name": "zj",
                                                    "unit": "mm"
                                                },
                                                {
                                                    "text": "强度",
                                                    "name": "qd",
                                                    "unit": "Mpa"
                                                }
                                            ]
                                        },
                                        {
                                            "text": "用量",
                                            "name": "yl",
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "根数",
                                                    "name": "gs"
                                                },
                                                {
                                                    "text": "用量n",
                                                    "name": "yln",
                                                    "type": "folder",
                                                    "children": [
                                                        {
                                                            "text": "段长",
                                                            "name": "dc",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "段数",
                                                            "name": "ds"
                                                        },
                                                        {
                                                            "text": "单件米长",
                                                            "name": "djmc",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "安全系数",
                                                            "name": "aqxs",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "单件需求米长",
                                                            "name": "djxqmc",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "件数",
                                                            "name": "js"
                                                        },
                                                        {
                                                            "text": "总米长",
                                                            "name": "zmc",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "总需求米长",
                                                            "name": "zxqmc",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "工字轮型号",
                                                            "name": "gzlxh"
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "纤维芯",
                            "name": "xwx",
                            "type": "folder",
                            "children": [
                                {
                                    "text": "规格",
                                    "name": "gg",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "类别",
                                            "name": "lb"
                                        },
                                        {
                                            "text": "直径",
                                            "name": "zj",
                                            "unit": "mm"
                                        },
                                        {
                                            "text": "捻向",
                                            "name": "nx"
                                        },
                                        {
                                            "text": "含油率",
                                            "name": "hyl",
                                            "unit": "%"
                                        }
                                    ]
                                },
                                {
                                    "text": "用量",
                                    "name": "yl",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "工艺米长系数",
                                            "name": "gymcxs"
                                        },
                                        {
                                            "text": "总米长",
                                            "name": "zmc",
                                            "unit": "m"
                                        },
                                        {
                                            "text": "吨耗",
                                            "name": "dh",
                                            "unit": "%"
                                        },
                                        {
                                            "text": "重量",
                                            "name": "zl",
                                            "unit": "kg"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "油脂",
                            "name": "yz",
                            "type": "folder",
                            "children": [
                                {
                                    "text": "规格",
                                    "name": "gg",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "型号",
                                            "name": "xh"
                                        }
                                    ]
                                },
                                {
                                    "text": "用量",
                                    "name": "yl",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "涂油方式",
                                            "name": "tyfs"
                                        },
                                        {
                                            "text": "吨耗",
                                            "name": "dh",
                                            "unit": "%"
                                        },
                                        {
                                            "text": "重量",
                                            "name": "zl",
                                            "unit": "kg"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "text": "捻股后",
                    "type": "folder",
                    "name": "ngh",
                    "children": [
                        {
                            "text": "工段产品",
                            "type": "folder",
                            "name": "gdcp",
                            "children": [
                                {
                                    "text": "类别",
                                    "name": "lb"
                                },
                                {
                                    "text": "结构",
                                    "name": "jg"
                                },
                                {
                                    "text": "直径",
                                    "unit": "mm",
                                    "name": "zj"
                                },
                                {
                                    "text": "捻向",
                                    "name": "nx"
                                },
                                {
                                    "text": "强度",
                                    "unit": "MPa",
                                    "name": "qd"
                                },
                                {
                                    "text": "涂油方式",
                                    "name": "tyfs"
                                },
                                {
                                    "text": "捻距",
                                    "unit": "mm",
                                    "name": "nj"
                                },
                                {
                                    "text": "表面状态",
                                    "name": "bmzt"
                                },
                                {
                                    "text": "特殊要求",
                                    "name": "tsyq"
                                },
                                {
                                    "text": "用途",
                                    "name": "yt"
                                }
                            ]
                        },
                        {
                            "text": "收线方式",
                            "type": "folder",
                            "name": "sxfs",
                            "children": [
                                {
                                    "text": "收线方式n",
                                    "name": "sxfsn",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "段长",
                                            "name": "dc",
                                            "unit": "m"
                                        },
                                        {
                                            "text": "段数",
                                            "name": "ds"
                                        },
                                        {
                                            "text": "单件米长",
                                            "name": "djmc",
                                            "unit": "m"
                                        },
                                        {
                                            "text": "单件损耗",
                                            "name": "djsh",
                                            "unit": "m"
                                        },
                                        {
                                            "text": "单件生产米长",
                                            "name": "djscmc",
                                            "unit": "m"
                                        },
                                        {
                                            "text": "件数",
                                            "name": "js"
                                        },
                                        {
                                            "text": "总米长",
                                            "name": "zmc",
                                            "unit": "m"
                                        },
                                        {
                                            "text": "总损耗",
                                            "name": "zsh",
                                            "unit": "m"
                                        },
                                        {
                                            "text": "总生产米长",
                                            "name": "zscmc",
                                            "unit": "m"
                                        },
                                        {
                                            "text": "工字轮型号",
                                            "name": "gzlxh"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "text": "实际产量",
                    "name": "sjcl",
                    "type": "folder",
                    "children": [
                        {
                            "text": "已收线米长",
                            "unit": "m",
                            "name": "ysxmc"
                        }
                    ]
                },
                {
                    "text": "计划总产量",
                    "type": "folder",
                    "name": "jhzcl",
                    "children": [
                        {
                            "text": "总米长",
                            "name": "zmc",
                            "unit": "m"
                        }
                    ]
                },
                {
                    "text": "实际总产量",
                    "name": "sjzcl",
                    "type": "folder",
                    "children": [
                        {
                            "text": "总米长",
                            "unit": "m",
                            "name": "zmc"
                        },
                        {
                            "text": "收线方式n",
                            "name": "sxfsn",
                            "type": "folder",
                            "children": [
                                {
                                    "text": "总件数",
                                    "name": "zjs"
                                },
                                {
                                    "text": "总米长",
                                    "unit": "m",
                                    "name": "zmc"
                                }
                            ]
                        }
                    ]
                },
                {
                    "text": "中间停机",
                    "name": "zjtj",
                    "type": "folder",
                    "children": [
                        {
                            "text": "第n次",
                            "name": "dcn",
                            "type": "folder",
                            "children": [
                                {
                                    "text": "停机时间",
                                    "name": "tjsj"
                                },
                                {
                                    "text": "重启时间",
                                    "name": "cqsj"
                                },
                                {
                                    "text": "停机耗时",
                                    "name": "tjhs"
                                },
                                {
                                    "text": "停机原因",
                                    "name": "tjyy"
                                }
                            ]
                        }
                    ]
                },
                {
                    "text": "工单历史",
                    "name": "gdls",
                    "type": "folder",
                    "children": [
                        {
                            "text": "工单历史n",
                            "name": "gdlsn",
                            "type": "folder",
                            "children": [
                                {
                                    "text": "班组",
                                    "name": "bz"
                                },
                                {
                                    "text": "班长",
                                    "name": "bzz"
                                },
                                {
                                    "text": "操作工",
                                    "name": "czg"
                                },
                                {
                                    "text": "生产时间",
                                    "name": "scsj",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "开始时间",
                                            "name": "kssj"
                                        },
                                        {
                                            "text": "完成时间",
                                            "name": "wcsj"
                                        },
                                        {
                                            "text": "生产用时",
                                            "name": "scys"
                                        }
                                    ]
                                },
                                {
                                    "text": "中间停机",
                                    "name": "zjtj",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "第n次",
                                            "name": "dcn",
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "停机时间",
                                                    "name": "tjsj"
                                                },
                                                {
                                                    "text": "重启时间",
                                                    "name": "cqsj"
                                                },
                                                {
                                                    "text": "停机耗时",
                                                    "name": "tjhs"
                                                },
                                                {
                                                    "text": "停机原因",
                                                    "name": "tjyy"
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    "text": "实际产量",
                                    "name": "sjcl",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "已收线米长",
                                            "unit": "m",
                                            "name": "ysxmc"
                                        },
                                        {
                                            "text": "未收线米长",
                                            "unit": "m",
                                            "name": "wsxmc"
                                        },
                                        {
                                            "text": "总生产米长",
                                            "unit": "m",
                                            "name": "zscmc"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "text": "标准产量",
                    "name": "bzcl",
                    "unit": "m/H"
                },
                {
                    "text": "股放置区域编号",
                    "name": "gfzqybh"
                }
            ]
        },
        {
            "name": "合绳工单",
            "alias": "hs_work_order",
            "type": {
                "name": "work_order",
                "value": "工单"
            },
            "default": false,
            "display": false,
            "selected": false,
            "category": {
                "name": "form",
                "value": "表单"
            },
            "order": 98,
            "perms": [
                "display",
                "operate",
                "approve",
                "assign",
                "confirm"
            ],
            "header": [
                {
                    "name": "form_no",
                    "text": "表单编号"
                },
                {
                    "name": "author",
                    "text": "编制"
                },
                {
                    "name": "created",
                    "text": "编制日期"
                },
                {
                    "name": "version",
                    "text": "版本号"
                },
                {
                    "name": "auditor",
                    "text": "审核"
                },
                {
                    "name": "audit_date",
                    "text": "审核日期"
                }
            ],
            "body": [
                {
                    "text": "生产日期",
                    "name": "scrq"
                },
                {
                    "text": "工段制造号",
                    "name": "gdzzh"
                },
                {
                    "text": "是否定制",
                    "name": "sfdz"
                },
                {
                    "text": "车间",
                    "name": "cj"
                },
                {
                    "text": "机台号",
                    "name": "jth"
                },
                {
                    "text": "机台米长系数",
                    "name": "jtmcxs"
                },
                {
                    "text": "班组",
                    "name": "bz"
                },
                {
                    "text": "班长",
                    "name": "bzz"
                },
                {
                    "text": "操作工",
                    "name": "czg"
                },
                {
                    "text": "调产时间",
                    "name": "tcsj",
                    "type": "folder",
                    "children": [
                        {
                            "text": "开始时间",
                            "name": "kssj"
                        },
                        {
                            "text": "完成时间",
                            "name": "wcsj"
                        },
                        {
                            "text": "调产用时",
                            "name": "tcys"
                        }
                    ]
                },
                {
                    "text": "生产时间",
                    "name": "scsj",
                    "type": "folder",
                    "children": [
                        {
                            "text": "开始时间",
                            "name": "kssj"
                        },
                        {
                            "text": "完成时间",
                            "name": "wcsj"
                        },
                        {
                            "text": "生产用时",
                            "name": "scys"
                        }
                    ]
                },
                {
                    "text": "合绳前用料",
                    "name": "hsqyl",
                    "type": "folder",
                    "children": [
                        {
                            "text": "中间品",
                            "name": "zjp",
                            "type": "folder",
                            "children": [
                                {
                                    "text": "规格",
                                    "name": "gg",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "结构",
                                            "name": "jg"
                                        },
                                        {
                                            "text": "直径",
                                            "name": "zj",
                                            "unit": "mm"
                                        },
                                        {
                                            "text": "捻向",
                                            "name": "nx"
                                        },
                                        {
                                            "text": "强度",
                                            "name": "qd",
                                            "unit": "Mpa"
                                        },
                                        {
                                            "text": "涂油方式",
                                            "name": "tyfs"
                                        },
                                        {
                                            "text": "捻距",
                                            "name": "nj",
                                            "unit": "mm"
                                        },
                                        {
                                            "text": "表面状态",
                                            "name": "bmzt"
                                        }
                                    ]
                                },
                                {
                                    "text": "用量",
                                    "name": "yl",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "用量n",
                                            "name": "yln",
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "段长",
                                                    "name": "dc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "段数",
                                                    "name": "ds"
                                                },
                                                {
                                                    "text": "单件米长",
                                                    "name": "djmc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "单件损耗",
                                                    "name": "djsh",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "单件需求米长",
                                                    "name": "djxqmc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "件数",
                                                    "name": "js"
                                                },
                                                {
                                                    "text": "总米长",
                                                    "name": "zmc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "总损耗",
                                                    "name": "zsh",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "总需求米长",
                                                    "name": "zxqmc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "工字轮型号",
                                                    "name": "gzlxh"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "金属绳芯",
                            "name": "jssx",
                            "type": "folder",
                            "children": [
                                {
                                    "text": "规格",
                                    "name": "gg",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "结构",
                                            "name": "jg"
                                        },
                                        {
                                            "text": "直径",
                                            "name": "zj",
                                            "unit": "mm"
                                        },
                                        {
                                            "text": "捻向",
                                            "name": "nx"
                                        },
                                        {
                                            "text": "强度",
                                            "name": "qd",
                                            "unit": "Mpa"
                                        },
                                        {
                                            "text": "涂油方式",
                                            "name": "tyfs"
                                        },
                                        {
                                            "text": "捻距",
                                            "name": "nj",
                                            "unit": "mm"
                                        },
                                        {
                                            "text": "表面状态",
                                            "name": "bmzt"
                                        }
                                    ]
                                },
                                {
                                    "text": "用量",
                                    "name": "yl",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "用量n",
                                            "name": "yln",
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "段长",
                                                    "name": "dc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "段数",
                                                    "name": "ds"
                                                },
                                                {
                                                    "text": "单件米长",
                                                    "name": "djmc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "单件损耗",
                                                    "name": "djsh",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "单件需求米长",
                                                    "name": "djxqmc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "件数",
                                                    "name": "js"
                                                },
                                                {
                                                    "text": "总米长",
                                                    "name": "zmc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "总损耗",
                                                    "name": "zsh",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "总需求米长",
                                                    "name": "zxqmc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "工字轮型号",
                                                    "name": "gzlxh"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "金属股芯",
                            "name": "jsgx",
                            "type": "folder",
                            "children": [
                                {
                                    "text": "规格",
                                    "name": "gg",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "结构",
                                            "name": "jg"
                                        },
                                        {
                                            "text": "直径",
                                            "name": "zj",
                                            "unit": "mm"
                                        },
                                        {
                                            "text": "捻向",
                                            "name": "nx"
                                        },
                                        {
                                            "text": "强度",
                                            "name": "qd",
                                            "unit": "Mpa"
                                        },
                                        {
                                            "text": "涂油方式",
                                            "name": "tyfs"
                                        },
                                        {
                                            "text": "捻距",
                                            "name": "nj",
                                            "unit": "mm"
                                        },
                                        {
                                            "text": "表面状态",
                                            "name": "bmzt"
                                        }
                                    ]
                                },
                                {
                                    "text": "用量",
                                    "name": "yl",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "用量n",
                                            "name": "yln",
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "段长",
                                                    "name": "dc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "段数",
                                                    "name": "ds"
                                                },
                                                {
                                                    "text": "单件米长",
                                                    "name": "djmc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "单件损耗",
                                                    "name": "djsh",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "单件需求米长",
                                                    "name": "djxqmc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "件数",
                                                    "name": "js"
                                                },
                                                {
                                                    "text": "总米长",
                                                    "name": "zmc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "总损耗",
                                                    "name": "zsh",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "总需求米长",
                                                    "name": "zxqmc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "工字轮型号",
                                                    "name": "gzlxh"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "半金属芯",
                            "name": "bjsx",
                            "type": "folder",
                            "children": [
                                {
                                    "text": "规格",
                                    "name": "gg",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "结构",
                                            "name": "jg"
                                        },
                                        {
                                            "text": "直径",
                                            "name": "zj",
                                            "unit": "mm"
                                        },
                                        {
                                            "text": "捻向",
                                            "name": "nx"
                                        },
                                        {
                                            "text": "强度",
                                            "name": "qd",
                                            "unit": "Mpa"
                                        },
                                        {
                                            "text": "涂油方式",
                                            "name": "tyfs"
                                        },
                                        {
                                            "text": "捻距",
                                            "name": "nj",
                                            "unit": "mm"
                                        },
                                        {
                                            "text": "表面状态",
                                            "name": "bmzt"
                                        }
                                    ]
                                },
                                {
                                    "text": "用量",
                                    "name": "yl",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "用量n",
                                            "name": "yln",
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "段长",
                                                    "name": "dc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "段数",
                                                    "name": "ds"
                                                },
                                                {
                                                    "text": "单件米长",
                                                    "name": "djmc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "单件损耗",
                                                    "name": "djsh",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "单件需求米长",
                                                    "name": "djxqmc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "件数",
                                                    "name": "js"
                                                },
                                                {
                                                    "text": "总米长",
                                                    "name": "zmc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "总损耗",
                                                    "name": "zsh",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "总需求米长",
                                                    "name": "zxqmc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "工字轮型号",
                                                    "name": "gzlxh"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "中心股",
                            "name": "zxg",
                            "type": "folder",
                            "children": [
                                {
                                    "text": "规格",
                                    "name": "gg",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "结构",
                                            "name": "jg"
                                        },
                                        {
                                            "text": "直径",
                                            "name": "zj",
                                            "unit": "mm"
                                        },
                                        {
                                            "text": "捻向",
                                            "name": "nx"
                                        },
                                        {
                                            "text": "强度",
                                            "name": "qd",
                                            "unit": "Mpa"
                                        },
                                        {
                                            "text": "涂油方式",
                                            "name": "tyfs"
                                        },
                                        {
                                            "text": "捻距",
                                            "name": "nj",
                                            "unit": "mm"
                                        },
                                        {
                                            "text": "表面状态",
                                            "name": "bmzt"
                                        }
                                    ]
                                },
                                {
                                    "text": "用量",
                                    "name": "yl",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "用量n",
                                            "name": "yln",
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "段长",
                                                    "name": "dc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "段数",
                                                    "name": "ds"
                                                },
                                                {
                                                    "text": "单件米长",
                                                    "name": "djmc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "单件损耗",
                                                    "name": "djsh",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "单件需求米长",
                                                    "name": "djxqmc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "件数",
                                                    "name": "js"
                                                },
                                                {
                                                    "text": "总米长",
                                                    "name": "zmc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "总损耗",
                                                    "name": "zsh",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "总需求米长",
                                                    "name": "zxqmc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "工字轮型号",
                                                    "name": "gzlxh"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "外股",
                            "name": "wg",
                            "type": "folder",
                            "children": [
                                {
                                    "text": "规格",
                                    "name": "gg",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "结构",
                                            "name": "jg"
                                        },
                                        {
                                            "text": "直径",
                                            "name": "zj",
                                            "unit": "mm"
                                        },
                                        {
                                            "text": "捻向",
                                            "name": "nx"
                                        },
                                        {
                                            "text": "强度",
                                            "name": "qd",
                                            "unit": "Mpa"
                                        },
                                        {
                                            "text": "涂油方式",
                                            "name": "tyfs"
                                        },
                                        {
                                            "text": "捻距",
                                            "name": "nj",
                                            "unit": "mm"
                                        },
                                        {
                                            "text": "表面状态",
                                            "name": "bmzt"
                                        }
                                    ]
                                },
                                {
                                    "text": "用量",
                                    "name": "yl",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "个数",
                                            "name": "gs"
                                        },
                                        {
                                            "text": "用量n",
                                            "name": "yln",
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "段长",
                                                    "name": "dc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "段数",
                                                    "name": "ds"
                                                },
                                                {
                                                    "text": "单件米长",
                                                    "name": "djmc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "单件损耗",
                                                    "name": "djsh",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "单件需求米长",
                                                    "name": "djxqmc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "件数",
                                                    "name": "js"
                                                },
                                                {
                                                    "text": "总米长",
                                                    "name": "zmc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "总损耗",
                                                    "name": "zsh",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "总需求米长",
                                                    "name": "zxqmc",
                                                    "unit": "m"
                                                },
                                                {
                                                    "text": "工字轮型号",
                                                    "name": "gzlxh"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "纤维芯",
                            "name": "xwx",
                            "type": "folder",
                            "children": [
                                {
                                    "text": "规格",
                                    "name": "gg",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "类别",
                                            "name": "lb"
                                        },
                                        {
                                            "text": "直径",
                                            "name": "zj",
                                            "unit": "mm"
                                        },
                                        {
                                            "text": "捻向",
                                            "name": "nx"
                                        },
                                        {
                                            "text": "含油率",
                                            "name": "hyl",
                                            "unit": "%"
                                        }
                                    ]
                                },
                                {
                                    "text": "用量",
                                    "name": "yl",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "工艺米长系数",
                                            "name": "gymcxs"
                                        },
                                        {
                                            "text": "总米长",
                                            "name": "zmc",
                                            "unit": "m"
                                        },
                                        {
                                            "text": "吨耗",
                                            "name": "dh",
                                            "unit": "%"
                                        },
                                        {
                                            "text": "重量",
                                            "name": "zl",
                                            "unit": "kg"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "油脂",
                            "name": "yz",
                            "type": "folder",
                            "children": [
                                {
                                    "text": "规格",
                                    "name": "gg",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "型号",
                                            "name": "xh"
                                        }
                                    ]
                                },
                                {
                                    "text": "用量",
                                    "name": "yl",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "涂油方式",
                                            "name": "tyfs"
                                        },
                                        {
                                            "text": "吨耗",
                                            "name": "dh",
                                            "unit": "%"
                                        },
                                        {
                                            "text": "重量",
                                            "name": "zl",
                                            "unit": "kg"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "第n层股",
                            "name": "gdcn",
                            "type": "folder",
                            "children": [
                                {
                                    "text": "股n",
                                    "name": "gn",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "规格",
                                            "name": "gg",
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "结构",
                                                    "name": "jg"
                                                },
                                                {
                                                    "text": "直径",
                                                    "name": "zj",
                                                    "unit": "mm"
                                                },
                                                {
                                                    "text": "捻向",
                                                    "name": "nx"
                                                },
                                                {
                                                    "text": "强度",
                                                    "name": "qd",
                                                    "unit": "Mpa"
                                                },
                                                {
                                                    "text": "涂油方式",
                                                    "name": "tyfs"
                                                },
                                                {
                                                    "text": "捻距",
                                                    "name": "nj",
                                                    "unit": "mm"
                                                },
                                                {
                                                    "text": "表面状态",
                                                    "name": "bmzt"
                                                }
                                            ]
                                        },
                                        {
                                            "text": "用量",
                                            "name": "yl",
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "个数",
                                                    "name": "gs"
                                                },
                                                {
                                                    "text": "用量n",
                                                    "name": "yln",
                                                    "type": "folder",
                                                    "children": [
                                                        {
                                                            "text": "段长",
                                                            "name": "dc",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "段数",
                                                            "name": "ds"
                                                        },
                                                        {
                                                            "text": "单件米长",
                                                            "name": "djmc",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "单件损耗",
                                                            "name": "djsh",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "单件需求米长",
                                                            "name": "djxqmc",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "件数",
                                                            "name": "js"
                                                        },
                                                        {
                                                            "text": "总米长",
                                                            "name": "zmc",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "总损耗",
                                                            "name": "zsh",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "总需求米长",
                                                            "name": "zxqmc",
                                                            "unit": "m"
                                                        },
                                                        {
                                                            "text": "工字轮型号",
                                                            "name": "gzlxh"
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "text": "合绳后",
                    "name": "hsh",
                    "type": "folder",
                    "children": [
                        {
                            "text": "工段产品",
                            "name": "gdcp",
                            "type": "folder",
                            "children": [
                                {
                                    "text": "类别",
                                    "name": "lb"
                                },
                                {
                                    "text": "结构",
                                    "name": "jg"
                                },
                                {
                                    "text": "规格",
                                    "name": "gg"
                                },
                                {
                                    "text": "直径",
                                    "unit": "mm",
                                    "name": "zj"
                                },
                                {
                                    "text": "强度",
                                    "unit": "MPa",
                                    "name": "qd"
                                },
                                {
                                    "text": "捻向",
                                    "name": "nx"
                                },
                                {
                                    "text": "涂油方式",
                                    "name": "tyfs"
                                },
                                {
                                    "text": "捻距",
                                    "unit": "mm",
                                    "name": "nj"
                                },
                                {
                                    "text": "表面状态",
                                    "name": "bmzt"
                                },
                                {
                                    "text": "特殊要求",
                                    "name": "tsyq"
                                },
                                {
                                    "text": "用途",
                                    "name": "yt"
                                }
                            ]
                        },
                        {
                            "text": "收线方式",
                            "type": "folder",
                            "name": "sxfs",
                            "children": [
                                {
                                    "text": "收线方式n",
                                    "name": "sxfsn",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "段长",
                                            "name": "dc",
                                            "unit": "m"
                                        },
                                        {
                                            "text": "段数",
                                            "name": "ds"
                                        },
                                        {
                                            "text": "单件米长",
                                            "name": "djmc",
                                            "unit": "m"
                                        },
                                        {
                                            "text": "单件损耗",
                                            "name": "djsh",
                                            "unit": "m"
                                        },
                                        {
                                            "text": "单件生产米长",
                                            "name": "djscmc",
                                            "unit": "m"
                                        },
                                        {
                                            "text": "件数",
                                            "name": "js"
                                        },
                                        {
                                            "text": "总米长",
                                            "name": "zmc",
                                            "unit": "m"
                                        },
                                        {
                                            "text": "总损耗",
                                            "name": "zsh",
                                            "unit": "m"
                                        },
                                        {
                                            "text": "总生产米长",
                                            "name": "zscmc",
                                            "unit": "m"
                                        },
                                        {
                                            "text": "工字轮型号",
                                            "name": "gzlxh"
                                        },
                                        {
                                            "text": "包装方式",
                                            "name": "bzfs"
                                        },
                                        {
                                            "text": "轮盘型号",
                                            "name": "lpxh"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "text": "实际产量",
                    "name": "sjcl",
                    "type": "folder",
                    "children": [
                        {
                            "text": "已收线米长",
                            "unit": "m",
                            "name": "ysxmc"
                        }
                    ]
                },
                {
                    "text": "计划总产量",
                    "type": "folder",
                    "name": "jhzcl",
                    "children": [
                        {
                            "text": "总米长",
                            "name": "zmc",
                            "unit": "m"
                        }
                    ]
                },
                {
                    "text": "实际总产量",
                    "name": "sjzcl",
                    "type": "folder",
                    "children": [
                        {
                            "text": "总米长",
                            "unit": "m",
                            "name": "zmc"
                        },
                        {
                            "text": "收线方式n",
                            "name": "sxfsn",
                            "type": "folder",
                            "children": [
                                {
                                    "text": "总件数",
                                    "name": "zjs"
                                },
                                {
                                    "text": "总米长",
                                    "unit": "m",
                                    "name": "zmc"
                                }
                            ]
                        }
                    ]
                },
                {
                    "text": "中间停机",
                    "name": "zjtj",
                    "type": "folder",
                    "children": [
                        {
                            "text": "第n次",
                            "name": "dcn",
                            "type": "folder",
                            "children": [
                                {
                                    "text": "停机时间",
                                    "name": "tjsj"
                                },
                                {
                                    "text": "重启时间",
                                    "name": "cqsj"
                                },
                                {
                                    "text": "停机耗时",
                                    "name": "tjhs"
                                },
                                {
                                    "text": "停机原因",
                                    "name": "tjyy"
                                }
                            ]
                        }
                    ]
                },
                {
                    "text": "工单历史",
                    "name": "gdls",
                    "type": "folder",
                    "children": [
                        {
                            "text": "工单历史n",
                            "name": "gdlsn",
                            "type": "folder",
                            "children": [
                                {
                                    "text": "班组",
                                    "name": "bz"
                                },
                                {
                                    "text": "班长",
                                    "name": "bzz"
                                },
                                {
                                    "text": "操作工",
                                    "name": "czg"
                                },
                                {
                                    "text": "生产时间",
                                    "name": "scsj",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "开始时间",
                                            "name": "kssj"
                                        },
                                        {
                                            "text": "完成时间",
                                            "name": "wcsj"
                                        },
                                        {
                                            "text": "生产用时",
                                            "name": "scys"
                                        }
                                    ]
                                },
                                {
                                    "text": "中间停机",
                                    "name": "zjtj",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "第n次",
                                            "name": "dcn",
                                            "type": "folder",
                                            "children": [
                                                {
                                                    "text": "停机时间",
                                                    "name": "tjsj"
                                                },
                                                {
                                                    "text": "重启时间",
                                                    "name": "cqsj"
                                                },
                                                {
                                                    "text": "停机耗时",
                                                    "name": "tjhs"
                                                },
                                                {
                                                    "text": "停机原因",
                                                    "name": "tjyy"
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    "text": "实际产量",
                                    "name": "sjcl",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "已收线米长",
                                            "unit": "m",
                                            "name": "ysxmc"
                                        },
                                        {
                                            "text": "未收线米长",
                                            "unit": "m",
                                            "name": "wsxmc"
                                        },
                                        {
                                            "text": "总生产米长",
                                            "unit": "m",
                                            "name": "zscmc"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]

                },
                {
                    "text": "标准产量",
                    "name": "bzcl",
                    "unit": "m/H"
                },
                {
                    "text": "股放置区域编号",
                    "name": "gfzqybh"
                },
                {
                    "text": "金属绳芯放置区域编号",
                    "name": "jssxfzqybh"
                },
                {
                    "text": "钢丝绳库区域编号",
                    "name": "gsskqybh"
                }
            ]
        },
        {
            "name": "股库",
            "alias": "g_virtual_library",
            "type": {
                "name": "virtual_library",
                "value": "虚拟库存"
            },
            "default": true,
            "display": true,
            "selected": true,
            "category": {
                "name": "form",
                "value": "表单"
            },
            "order": 101,
            "perms": [
                "display",
                "operate"
            ],
            "body": [
                {
                    "name": "gzlbh",
                    "text": "工字轮编号"
                },
                {
                    "name": "gzlxh",
                    "text": "工字轮型号"
                },
                {
                    "name": "gdzzh",
                    "text": "工段制造号"
                },
                {
                    "name": "sfdz",
                    "text": "是否定制"
                },
                {
                    "name": "cj",
                    "text": "车间"
                },
                {
                    "text": "机台号",
                    "name": "jth"
                },
                {
                    "name": "bz",
                    "text": "班长"
                },
                {
                    "name": "bc",
                    "text": "班次"
                },
                {
                    "name": "czg",
                    "text": "操作工"
                },
                {
                    "name": "lb",
                    "text": "类别"
                },
                {
                    "name": "isZjp",
                    "text": "是否是中间品"
                },
                {
                    "name": "jg",
                    "text": "结构"
                },
                {
                    "name": "zj",
                    "text": "直径"
                },
                {
                    "name": "nx",
                    "text": "捻向"
                },
                {
                    "name": "qd",
                    "text": "强度"
                },
                {
                    "name": "tyfs",
                    "text": "涂油方式"
                },
                {
                    "name": "nj",
                    "text": "捻距"
                },
                {
                    "name": "bmzt",
                    "text": "表面状态"
                },
                {
                    "name": "tsyq",
                    "text": "特殊要求"
                },
                {
                    "name": "dc",
                    "text": "段长"
                },
                {
                    "name": "ds",
                    "text": "段数"
                },
                {
                    "name": "djmc",
                    "text": "单件米长"
                },
                {
                    "name": "zl",
                    "text": "重量"
                },
                {
                    "name": "quality",
                    "text": "质量"
                },
                {
                    "name": "rksj",
                    "text": "入库时间"
                },
                {
                    "name": "cksj",
                    "text": "出库时间"
                },
                {
                    "name": "comment",
                    "text": "备注"
                }
            ]
        },
        {
            "name": "绳库",
            "alias": "s_virtual_library",
            "type": {
                "name": "virtual_library",
                "value": "虚拟库存"
            },
            "default": true,
            "display": true,
            "selected": true,
            "category": {
                "name": "form",
                "value": "表单"
            },
            "order": 102,
            "perms": [
                "display",
                "operate"
            ],
            "body": [
                {
                    "name": "gzlbh",
                    "text": "工字轮编号"
                },
                {
                    "name": "gzlxh",
                    "text": "工字轮型号"
                },
                {
                    "name": "gdzzh",
                    "text": "工段制造号"
                },
                {
                    "name": "sfdz",
                    "text": "是否定制"
                },
                {
                    "name": "cj",
                    "text": "车间"
                },
                {
                    "text": "机台号",
                    "name": "jth"
                },
                {
                    "name": "bz",
                    "text": "班长"
                },
                {
                    "name": "bc",
                    "text": "班次"
                },
                {
                    "name": "czg",
                    "text": "操作工"
                },
                {
                    "name": "lb",
                    "text": "类别"
                },
                {
                    "name": "isZjp",
                    "text": "是否是中间品"
                },
                {
                    "name": "jg",
                    "text": "结构"
                },
                {
                    "name": "zj",
                    "text": "直径"
                },
                {
                    "name": "nx",
                    "text": "捻向"
                },
                {
                    "name": "qd",
                    "text": "强度"
                },
                {
                    "name": "tyfs",
                    "text": "涂油方式"
                },
                {
                    "name": "nj",
                    "text": "捻距"
                },
                {
                    "name": "bmzt",
                    "text": "表面状态"
                },
                {
                    "name": "tsyq",
                    "text": "特殊要求"
                },
                {
                    "name": "dc",
                    "text": "段长"
                },
                {
                    "name": "ds",
                    "text": "段数"
                },
                {
                    "name": "djmc",
                    "text": "单件米长"
                },
                {
                    "name": "zl",
                    "text": "重量"
                },
                {
                    "name": "quality",
                    "text": "质量"
                },
                {
                    "name": "rksj",
                    "text": "入库时间"
                },
                {
                    "name": "cksj",
                    "text": "出库时间"
                },
                {
                    "name": "comment",
                    "text": "备注"
                }
            ]
        },
        {
            "name": "甘特图",
            "alias": "gantt-chart",
            "category": {
                "name": "module",
                "value": "功能模块"
            },
            "order": 120,
            "icon": "icon-calendar",
            "perms": [
                "display"
            ]
        },
        {
            "name": "生产量报表",
            "alias": "workload-chart",
            "category": {
                "name": "module",
                "value": "功能模块"
            },
            "order": 130,
            "icon": "icon-bar-chart",
            "perms": [
                "display"
            ]
        },
        {
            "name": "捻股工段领料计划单",
            "alias": "g_material_receive",
            "type": {
                "name": "material_receive",
                "value": "物料领用"
            },
            "default": true,
            "display": true,
            "selected": true,
            "category": {
                "name": "form",
                "value": "表单"
            },
            "order": 111,
            "perms": [
                "display",
                "operate"
            ],
            "body": [
                {
                    "name": "zl",
                    "text": "主料",
                    "type": "folder",
                    'children': [
                        {
                            "name": "llrq",
                            "text": "领料日期"
                        },
                        {
                            "text": "车间",
                            "name": "cj"
                        },
                        {
                            "name": "bc",
                            "text": "班次"
                        },
                        {
                            "text": "机台号",
                            "name": "jth"
                        },
                        {
                            "name": "gssjg",
                            "text": "钢丝绳结构"
                        },
                        {
                            "name": "lb",
                            "text": "类别"
                        },
                        {
                            "text": "物料规格",
                            "type": "folder",
                            "name": "wlgg",
                            "children": [
                                {
                                    "children": [
                                        {
                                            "text": "类别",
                                            "name": "lb"
                                        },
                                        {
                                            "name": "bmzt",
                                            "text": "表面状态"
                                        },
                                        {
                                            "name": "sfdz",
                                            "text": "是否定制"
                                        },
                                        {
                                            "text": "直径",
                                            "unit": "mm",
                                            "name": "zj"
                                        },
                                        {
                                            "text": "强度",
                                            "unit": "MPa",
                                            "name": "qd"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "用量",
                            "type": "folder",
                            "name": "yl",
                            "children": [
                                {
                                    "children": [
                                        {
                                            "text": "单件米长",
                                            "unit": "m",
                                            "name": "djmc"
                                        },
                                        {
                                            "name": "gzlxh",
                                            "text": "工字轮型号"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "计划领用",
                            "type": "folder",
                            "name": "jhly",
                            "children": [
                                {
                                    "children": [
                                        {
                                            "text": "件数",
                                            "name": "js"
                                        },
                                        {
                                            "name": "comment",
                                            "text": "备注"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "实际领用",
                            "type": "folder",
                            "name": "sjly",
                            "children": [
                                {
                                    "children": [
                                        {
                                            "text": "件数",
                                            "name": "js"
                                        },
                                        {
                                            "name": "comment",
                                            "text": "备注"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "name": "fl",
                            "text": "辅料",
                            "type": "folder",
                            'children': []
                        }
                    ]
                }
            ]
        },
        {
            "name": "合绳工段领料计划单",
            "alias": "s_material_receive",
            "type": {
                "name": "material_receive",
                "value": "物料领用"
            },
            "default": true,
            "display": true,
            "selected": true,
            "category": {
                "name": "form",
                "value": "表单"
            },
            "order": 111,
            "perms": [
                "display",
                "operate"
            ],
            "body": [
                {
                    "name": "zl",
                    "text": "主料",
                    "type": "folder",
                    'children': [
                        {
                            "name": "llrq",
                            "text": "领料日期"
                        },
                        {
                            "name": "cj",
                            "text": "车间"
                        },
                        {
                            "name": "bc",
                            "text": "班次"
                        },
                        {
                            "text": "机台号",
                            "name": "jth"
                        },
                        {
                            "name": "gssjg",
                            "text": "钢丝绳结构"
                        },
                        {
                            "name": "lb",
                            "text": "类别"
                        },
                        {
                            "text": "物料规格",
                            "type": "folder",
                            "name": "wlgg",
                            "children": [
                                {
                                    "children": [
                                        {
                                            "text": "类别",
                                            "name": "lb"
                                        },
                                        {
                                            "name": "bmzt",
                                            "text": "表面状态"
                                        },
                                        {
                                            "name": "sfdz",
                                            "text": "是否定制"
                                        },
                                        {
                                            "text": "直径",
                                            "unit": "mm",
                                            "name": "zj"
                                        },
                                        {
                                            "text": "强度",
                                            "unit": "MPa",
                                            "name": "qd"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "用量",
                            "type": "folder",
                            "name": "yl",
                            "children": [
                                {
                                    "children": [
                                        {
                                            "text": "单件米长",
                                            "unit": "m",
                                            "name": "djmc"
                                        },
                                        {
                                            "name": "gzlxh",
                                            "text": "工字轮型号"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "计划领用",
                            "type": "folder",
                            "name": "jhly",
                            "children": [
                                {
                                    "children": [
                                        {
                                            "text": "件数",
                                            "name": "js"
                                        },
                                        {
                                            "name": "comment",
                                            "text": "备注"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "实际领用",
                            "type": "folder",
                            "name": "sjly",
                            "children": [
                                {
                                    "children": [
                                        {
                                            "text": "件数",
                                            "name": "js"
                                        },
                                        {
                                            "name": "comment",
                                            "text": "备注"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "name": "fl",
                            "text": "辅料",
                            "type": "folder",
                            'children': []
                        }
                    ]
                }
            ]
        },
        {
            "name": "机台工单列表",
            "alias": "machine_workorder",
            "type": {
                "name": "machine_management",
                "value": "机台管理"
            },
            "default": true,
            "display": true,
            "selected": true,
            "category": {
                "name": "form",
                "value": "表单"
            },
            "order": 111,
            "perms": [
                "display"
            ],
            "body": [
                {
                    "text": "机台号n",
                    "name": "jthn",
                    "type": "folder",
                    'children': [
                        {
                            "text":"未下发",
                            "name":"wxf",
                            "type":"folder",
                            "children":[
                                {
                                    "text": "工单n",
                                    "name": "gdn",
                                    "type": "folder",
                                    "children": [
                                        {
                                            "text": "结构",
                                            "name": "jg"
                                        },
                                        {
                                            "text": "直径",
                                            "name": "zj",
                                            "unit": "mm"
                                        },
                                        {

                                            "text": "计划产量",
                                            "name": "jhcl",
                                            "unit": "m"
                                        },
                                        {
                                            "text": "实际产量",
                                            "name": "sjcl",
                                            "unit": "m"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text":"已下发",
                            "name":"yxf",
                            "type":"folder",
                            "children":[
                                {
                                    "text": "结构",
                                    "name": "jg"
                                },
                                {
                                    "text": "直径",
                                    "name": "zj",
                                    "unit": "mm"
                                },
                                {

                                    "text": "计划产量",
                                    "name": "jhcl",
                                    "unit": "m"
                                },
                                {
                                    "text": "实际产量",
                                    "name": "sjcl",
                                    "unit": "m"
                                }
                            ]
                        },
                        {
                            "text":"已终止",
                            "name":"yzz",
                            "type":"folder",
                            "children":[
                                {
                                    "text": "结构",
                                    "name": "jg"
                                },
                                {
                                    "text": "直径",
                                    "name": "zj",
                                    "unit": "mm"
                                },
                                {

                                    "text": "计划产量",
                                    "name": "jhcl",
                                    "unit": "m"
                                },
                                {
                                    "text": "实际产量",
                                    "name": "sjcl",
                                    "unit": "m"
                                }
                            ]
                        },
                        {
                            "text":"已完工",
                            "name":"ywg",
                            "type":"folder",
                            "children":[
                                {
                                    "text": "结构",
                                    "name": "jg"
                                },
                                {
                                    "text": "直径",
                                    "name": "zj",
                                    "unit": "mm"
                                },
                                {

                                    "text": "计划产量",
                                    "name": "jhcl",
                                    "unit": "m"
                                },
                                {
                                    "text": "实际产量",
                                    "name": "sjcl",
                                    "unit": "m"
                                }
                            ]
                        }
                    ]
                }
            ]
        }

    ]
}