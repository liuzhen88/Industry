module.exports = {
    "_comments": "定义租户数据库的测试数据。只是为了方便测试。",
    "data": [
        {
            "collection": "form_insts",
            "data": [
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
                    "status": "未处理",
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
                                    "name": "cpbh",
                                    "value": "A123-1"
                                },
                                {
                                    "text": "制造号",
                                    "name": "zzh",
                                    "value": "ZZH1"
                                },
                                {
                                    "text": "制造序列号",
                                    "name": "zzxlh",
                                    "value": "1"
                                },
                                {
                                    "text": "机台号",
                                    "name": "jth",
                                    "value": "12"
                                },
                                {
                                    "text": "班别",
                                    "name": "bb",
                                    "value": "一班"
                                },
                                {
                                    "text": "班长",
                                    "name": "bz",
                                    "value": "李四"
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
                                    "text": "调产规格",
                                    "type": "folder",
                                    "name": "tcgg",
                                    "children": [
                                        {
                                            "text": "规格",
                                            "name": "gg",
                                            "value": "6*19S+FC"
                                        },
                                        {
                                            "text": "类别",
                                            "name": "lb",
                                            "value": "光面"
                                        },
                                        {
                                            "text": "用途",
                                            "name": "yt",
                                            "value": "电梯绳"
                                        },
                                        {
                                            "text": "捻向",
                                            "name": "nx",
                                            "value": "左"
                                        },
                                        {
                                            "text": "强度",
                                            "unit": "MPa",
                                            "name": "qd",
                                            "value": "1700"
                                        },
                                        {
                                            "text": "直径",
                                            "unit": "mm",
                                            "name": "zj",
                                            "value": 10
                                        },
                                        {
                                            "text": "公差",
                                            "unit": "mm",
                                            "name": "gc"
                                        },
                                        {
                                            "text": "米长",
                                            "unit": "m",
                                            "name": "mc",
                                            "value": 100
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
                                },
                                {
                                    "text": "下线绳股放置区编号",
                                    "name": "xxsgfzqbh"
                                }
                            ]
                        },
                        {
                            "text": "工艺要求",
                            "type": "folder",
                            "name": "gyyq",
                            "children": [
                                {
                                    "text": "股结构",
                                    "name": "gjg",
                                    "value": "1+9+9"
                                },
                                {
                                    "text": "强度",
                                    "unit": "MPa",
                                    "name": "qd",
                                    "value": "1700"
                                },
                                {
                                    "text": "股捻向",
                                    "type": "folder",
                                    "name": "gnx",
                                    "children": [
                                        {
                                            "text": "第(n)层",
                                            "repeat": "n",
                                            "name": "dcn"
                                        }
                                    ]
                                },
                                {
                                    "text": "股径公差",
                                    "unit": "mm",
                                    "type": "folder",
                                    "name": "gjgc",
                                    "children": [
                                        {
                                            "text": "第(n)层",
                                            "repeat": "n",
                                            "type": "folder",
                                            "name": "dcn",
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
                                    "text": "股捻距",
                                    "unit": "mm",
                                    "type": "folder",
                                    "name": "nnj",
                                    "children": [
                                        {
                                            "text": "第(n)层股捻距",
                                            "repeat": "n",
                                            "type": "folder",
                                            "name": "dcgnjn",
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
                                    "text": "股内钢丝直径（由内到外）",
                                    "unit": "mm",
                                    "type": "folder",
                                    "name": "gngszj",
                                    "children": [
                                        {
                                            "text": "中心",
                                            "type": "folder",
                                            "name": "zx",
                                            "children": [
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
                                                },
                                                {
                                                    "text": "工字轮编号",
                                                    "name": "gzlbh"
                                                },
                                                {
                                                    "text": "件数",
                                                    "name": "js"
                                                }
                                            ]
                                        },
                                        {
                                            "text": "第(n)层",
                                            "repeat": "n",
                                            "type": "folder",
                                            "name": "dcn",
                                            "children": [
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
                                                },
                                                {
                                                    "text": "工字轮编号",
                                                    "name": "gzlbh"
                                                },
                                                {
                                                    "text": "件数",
                                                    "name": "js"
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    "text": "涂油方式",
                                    "name": "tyfs"
                                }
                            ]
                        },
                        {
                            "text": "原辅材料及工装要求",
                            "type": "folder",
                            "name": "yfcljgzyq",
                            "children": [
                                {
                                    "text": "分线盘规格",
                                    "type": "folder",
                                    "name": "cxpgg",
                                    "children": [
                                        {
                                            "text": "第(n)层",
                                            "repeat": "n",
                                            "name": "dcn"
                                        }
                                    ]
                                },
                                {
                                    "text": "压瓦规格",
                                    "unit": "mm",
                                    "type": "folder",
                                    "name": "ywgg",
                                    "children": [
                                        {
                                            "text": "第(n)层",
                                            "repeat": "n",
                                            "name": "dcn"
                                        }
                                    ]
                                },
                                {
                                    "text": "预变形器型号",
                                    "type": "folder",
                                    "name": "ybxqxh",
                                    "children": [
                                        {
                                            "text": "第(n)层",
                                            "repeat": "n",
                                            "name": "dcn"
                                        }
                                    ]
                                },
                                {
                                    "text": "压机型号",
                                    "type": "folder",
                                    "name": "yjxh",
                                    "children": [
                                        {
                                            "text": "(n)次",
                                            "repeat": "n",
                                            "name": "cn"
                                        }
                                    ]
                                },
                                {
                                    "text": "压辊规格",
                                    "unit": "mm",
                                    "type": "folder",
                                    "name": "yggg",
                                    "children": [
                                        {
                                            "text": "对辊(n)",
                                            "repeat": "n",
                                            "name": "dgn"
                                        }
                                    ]
                                },
                                {
                                    "text": "后变形器型号",
                                    "type": "folder",
                                    "name": "hbxqxh",
                                    "children": [
                                        {
                                            "text": "第(n)层",
                                            "repeat": "n",
                                            "name": "dcn"
                                        }
                                    ]
                                },
                                {
                                    "text": "涂油",
                                    "type": "folder",
                                    "name": "ty",
                                    "children": [
                                        {
                                            "text": "种类",
                                            "name": "zl"
                                        },
                                        {
                                            "text": "型号",
                                            "name": "xh"
                                        }
                                    ]
                                },
                                {
                                    "text": "股芯",
                                    "type": "folder",
                                    "name": "gx",
                                    "children": [
                                        {
                                            "text": "规格",
                                            "unit": "mm",
                                            "name": "gg"
                                        },
                                        {
                                            "text": "捻向",
                                            "name": "nx"
                                        },
                                        {
                                            "text": "含油率",
                                            "unit": "%",
                                            "name": "hyl"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "text": "特殊要求",
                            "name": "tsyq"
                        }
                    ]
                }
            ]
        }
    ]
};
