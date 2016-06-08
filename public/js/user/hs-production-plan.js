$(function () {
    var idCounter = 0;  // assign an id for each node
    var formId = $(".main .form-card").attr("id");
    var dtTable, $table = $(".main table.dataTable");
    var treeData, formPerm;
    var $treeContainer = $('.main .tree-container'),
        $treeBody = $('.tree-body', $treeContainer),
        $treeHeader = $('.tree-header'),
        $treeActions = $('.tree-actions');
    var actions = {assign: "ASSIGN"};
    var $action = $(".main .action-right");
    var updates = {idForm: [], fields: []};     // 保存从input onChange来的所有更新，idForm用来检索每个改变字段属于哪个子表
    var cache = {};

    var gxqGdcpDtTable, $gxqGdcpTable = $(".refresh #gxq_gdcp table.gxq_gdcp");
    var gxhGdcpDtTable, $gxhGdcpTable = $(".refresh #gxh_gdcp table.gxh_gdcp");
    var gxhHsqylXwxGgDtTable, $gxhHsqylXwxGgTable = $(".refresh #gxh_hsqyl_xwx_gg table.gxh_hsqyl_xwx_gg");
    var gxhHsqylXwxYlDtTable, $gxhHsqylXwxYlTable = $(".refresh #gxh_hsqyl_xwx_yl  table.gxh_hsqyl_xwx_yl");
    var gxhHsqylYzGgDtTable, $gxhHsqylYzGgTable = $(".refresh #gxh_hsqyl_yz_gg  table.gxh_hsqyl_yz_gg");
    var gxhHsqylYzYlDtTable, $gxhHsqylYzYlTable = $(".refresh #gxh_hsqyl_yz_yl  table.gxh_hsqyl_yz_yl");
    var gxhHsqylJssxGgDtTable, $gxhHsqylJssxGgTable = $(".refresh #gxh_hsqyl_jssx_gg  table.gxh_hsqyl_jssx_gg");
    var gxhHsqylJssxYlDtTable, $gxhHsqylJssxYlTable = $(".refresh #gxh_hsqyl_jssx_yl  table.gxh_hsqyl_jssx_yl");
    var gxhHsqylJsgxGgDtTable, $gxhHsqylJsgxGgTable = $(".refresh #gxh_hsqyl_jsgx_gg  table.gxh_hsqyl_jsgx_gg");
    var gxhHsqylJsgxYlDtTable, $gxhHsqylJsgxYlTable = $(".refresh #gxh_hsqyl_jsgx_yl  table.gxh_hsqyl_jsgx_yl");
    var gxhHsqylBjsxGgDtTable, $gxhHsqylBjsxGgTable = $(".refresh #gxh_hsqyl_bjsx_gg  table.gxh_hsqyl_bjsx_gg");
    var gxhHsqylBjsxYlDtTable, $gxhHsqylBjsxYlTable = $(".refresh #gxh_hsqyl_bjsx_yl  table.gxh_hsqyl_bjsx_yl");
    var gxhHsqylZxgGgDtTable, $gxhHsqylZxgGgTable = $(".refresh #gxh_hsqyl_zxg_gg  table.gxh_hsqyl_zxg_gg");
    var gxhHsqylZxgYlDtTable, $gxhHsqylZxgYlTable = $(".refresh #gxh_hsqyl_zxg_yl  table.gxh_hsqyl_zxg_yl");
    var gxhHsqylWgGgDtTable, $gxhHsqylWgGgTable = $(".refresh #gxh_hsqyl_wg_gg  table.gxh_hsqyl_wg_gg");
    var gxhHsqylWgYlDtTable, $gxhHsqylWgYlTable = $(".refresh #gxh_hsqyl_wg_yl  table.gxh_hsqyl_wg_yl");
    var gxhHsqylZjpGgDtTable, $gxhHsqylZjpGgTable = $(".refresh #gxh_hsqyl_zjp_gg  table.gxh_hsqyl_zjp_gg");
    var gxhHsqylZjpYlDtTable, $gxhHsqylZjpYlTable = $(".refresh #gxh_hsqyl_zjp_yl  table.gxh_hsqyl_zjp_yl");
    var gxqSxfsDtTable, gxhSxfsDtTable;

    var xwxExist, yzExist, jssxExist, jsgxExist, zxgExist, wgExist, gExist, bjsxExist, zjpExist, zjpText, isGss, module;

    // 段长，段数,单件米长,件数，总米长,个数，单件损耗，直径，工艺米长系数，吨耗，重量，含油率，参考总重量
    var numberParams = ["ds", "js", "gs", "dc", "djmc", "zmc", "djsh", "zj", "gymcxs", "dh", "zl", "hyl", "ckzzl", "jhscts", "jhcl", "rjhcl"];

    var refreshData = [];

    var datatableOption = {
        "paging": false,
        "searching": false,
        "info": false,
        "autoWidth": false,
        "language": {
            "zeroRecords": "没有找到记录"
        }
    };

    var datetimepickerOption = {
        format: "yyyy-mm-dd",
        language: "zh-CN",
        maxView: '4',
        minView: '2',
        autoclose: true,
        todayBtn: true,
        startDate: new Date(),
        endDate: moment().add(1, 'y').toDate()
    }

    mesUtil.formInsts = {};
    mesUtil.initToastrAndBootbox();

    function initSel() {
        mesUtil.loadEnums(function () {
            var cjHtml = "<option disabled selected></option>";
            mesUtil.params.orgs.org1.forEach(function (u) {
                cjHtml += "<option value='" + u + "' >" + u + "</option>";
            })
            $("#gxh_cj select[name='sel-cj']").html(cjHtml).select2({
                language: "zn-CN",
                placeholder: "请选择车间",
                allowClear: false,
                minimumResultsForSearch: -1
            })
        })
    }

    initJSTree();
    initSel();
    initDatatable();
    loadModule();
    //loadFormInsts();
    setupEventHandlers();
    initDatetimepicker();


    function bootboxError(msg) {
        bootbox.dialog({
            "message": msg,
            buttons: {
                cancel: {
                    label: "关闭",
                    className: "btn-primary"
                }
            }
        });
    }

    function checkNumber(value) {
        var pattern = /^\d*(\.\d*)?$/;
        if (pattern.test(value)) {
            return true;
        }
        else {
            return false;
        }
    }

    function checkValue(name, value) {
        if (value == undefined || value == "") {
            return {"valid": false, "type": " can not be null", "text": "不能为空"}
        }
        else {
            if (name.indexOf(".") > 0) {
                var n = name.split(".");
                name = n[n.length - 1];
            }
            for (var i = 0; i < numberParams.length; i++) {
                if (name == numberParams[i]) {
                    if (checkNumber(value)) {
                        return {"valid": true};
                    }
                    else {
                        return {"valid": false, "type": " is not number", "text": "不是数字"};
                    }
                }
            }
            return {"valid": true}
        }
    }

    function initDatetimepicker() {
        $(".refresh #gxh_jdjh input[name='jhscksrq']").datetimepicker(datetimepickerOption);
        $(".refresh #gxh_jdjh input[name='jhscjsrq']").datetimepicker(datetimepickerOption);
    }

    function accAdd(arg1, arg2) {
        var r1, r2, m;
        try {
            r1 = arg1.toString().split(".")[1].length
        } catch (e) {
            r1 = 0
        }
        try {
            r2 = arg2.toString().split(".")[1].length
        } catch (e) {
            r2 = 0
        }
        m = Math.pow(10, Math.max(r1, r2));
        return (arg1 * m + arg2 * m) / m;
    }

    var tree = {
        get: function (tree, name) {
            if (!tree || !tree._id || !tree.body || !name) return null;
            return checkMap(tree)[name];
        },
        set: function (tree, name, value) {
            if (!tree || !tree._id || !tree.body || !name) return null;
            var node = checkMap(tree)[name];
            node.value = value;
        },
        expire: function (tree) {
            if (!tree || !tree._id) return null;
            delete cache[tree._id];
        }
    }

    function checkMap(tree) {
        var treeMap;
        if (cache[tree._id]) {
            if (cache[tree._id]._obj !== tree) {
                delete cache[tree._id];     // 如果id相同，但是实例并不是同一个，这时候也要重新build map
            } else {
                treeMap = cache[tree._id];
            }
        }
        if (!treeMap) {
            // rebuild map
            treeMap = {_obj: tree};
            buildMap(tree.body, [], treeMap);
            cache[tree._id] = treeMap;
        }
        return treeMap;
    }

    function buildMap(node, path, map) {
        if (node instanceof Array) {
            for (var i = 0; i < node.length; i++) {
                buildMap(node[i], path, map);
            }
        } else {
            path.push(node.name);
            map[path.join(".")] = node;
            if (node.children) {
                for (var i = 0; i < node.children.length; i++) {
                    buildMap(node.children[i], path, map);
                }
            }
            path.pop();
        }
    }

    function dumplicateNode(dump, index, begin) {
        var d = $.extend(true, dump instanceof Array ? [] : {}, dump);
        if (dump instanceof Array) {
            var array = [];
            for (var i = 0; i < d.length; i++) {
                d[i].text = d[i].text.replace('n', index + begin);
                d[i].name = d[i].name.replace('n', index + begin);
                array.push(d[i]);
            }
            return array;
        }
        else {
            d.text = d.text.replace('n', index + begin);
            d.name = d.name.replace('n', index + begin);
            return d;
        }
    }

    function drawNode(total, parent, dump, name, begin) {
        if (total >= 1) {
            var array = [];
            parent[name] = {
                "total": total,
                "begin": begin
            };
            for (var i = 2; i < total + 1; i++) {
                var add = dumplicateNode(dump, i - 1, begin);
                if (add instanceof Array) {
                    for (var j = 0; j < add.length; j++) {
                        array.push(add[j]);
                    }
                }
                else {
                    array.push(add);
                }
            }
            if (dump instanceof Array) {
                for (var i = 0; i < dump.length; i++) {
                    dump[i].text = dump[i].text.replace('n', begin);
                    dump[i].name = dump[i].name.replace('n', begin);
                }
            }
            else {
                dump.text = dump.text.replace('n', begin);
                dump.name = dump.name.replace('n', begin);
            }
            for (var i = 0; i < array.length; i++) {
                parent.children.push(array[i]);
            }
        }
    }

    function checkNodeExist(instance, name) {
        var json = tree.get(instance, name);
        if (json) {
            return true;
        } else {
            return false;
        }
    }

    function setToNode(type, instance, name, value) {
        var json = getFromNode("json", instance, name);
        json[type] = value;
    }

    function getFromNode(type, instance, name) {
        var json = tree.get(instance, name);
        switch (type) {
            case "json":
                return json;
            default:
                return json[type]
        }
    }

    function deleteFromNode(instance, parentName, childName) {
        if (parentName == ".") {
            var children = instance.body;
            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                if (child.name == childName) {
                    children.splice(i, 1);
                    break;
                }
            }
        }
        else {
            var parentJson = getFromNode("json", instance, parentName);
            var children = parentJson.children;
            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                if (child.name == childName) {
                    children.splice(i, 1);
                    break;
                }
            }
        }
    }

    function setupEventHandlers() {
        $('.expand').on('click', function () {
            $('#tree').jstree(true).open_all();
        });
        $('.compress').on('click', function () {
            var $tree = $('#tree').jstree(true);
            $tree.close_all();
            $tree.redraw(true);
        });
        $(".cancel", $treeHeader).on("click", function (e) {
            clearTreeContainer();
            $('tbody tr.selected').removeClass("selected");
        });
        $('.main .submitBtn').on('click', function (e) {
            var trs = $('tbody', $table).find("tr:has(input:checked)");
            if (trs.length == 0) {
                bootboxError("请选择至少1条数据");
                return;
            }
            for (var i = 0; i < trs.length; i++) {
                if ($(trs[i]).attr("status") != "未下发") {
                    bootboxError("不能选择状态为" + $(trs[i]).attr("status") + "的生产计划");
                    return;
                }
            }
            bootbox.confirm(
                {
                    message: "确认下发到作业计划吗?",
                    callback: function (result) {
                        if (result) {
                            var ids = [];
                            trs.each(function (i, tr) {
                                ids.push($(tr).attr("id"));
                            });
                            $.ajax({
                                url: "../user/submitProductionPlan",
                                method: "POST",
                                data: "ids=" + JSON.stringify(ids)
                            }).success(function (data) {
                                toastr.success("下发成功");
                                clearTreeContainer();
                                dtTable.ajax.reload();
                            }).fail(function () {
                                toastr.success("下发失败");
                            });
                        }
                    }
                }
            )
        });
        $('.main .backBtn').on('click', function (e) {
            var trs = $('tbody', $table).find("tr:has(input:checked)");
            if (trs.length == 0) {
                bootboxError("请选择至少1条数据");
                return;
            }
            for (var i = 0; i < trs.length; i++) {
                if ($(trs[i]).attr("status") != "未下发") {
                    bootboxError("不能选择状态为" + $(trs[i]).attr("status") + "的生产计划");
                    return;
                }
            }
            var ids = [];
            trs.each(function (i, tr) {
                if ($(tr).attr("merge") == "已合并") {
                    ids.push($(tr).attr("id"));
                }
            });
            if (ids.length == 0) {
                bootboxError("没有合并过的数据，无需撤销");
                return;
            }
            bootbox.confirm(
                {
                    message: "确认撤销合并吗?",
                    callback: function (result) {
                        if (result) {
                            $.ajax({
                                url: "../user/backProductionPlan",
                                method: "POST",
                                data: "ids=" + JSON.stringify(ids)
                            }).success(function (data) {
                                toastr.success("撤销成功");
                                dtTable.ajax.reload();
                            }).fail(function () {
                                toastr.success("撤销失败");
                            });
                        }
                    }
                }
            )
        });
        $('.main .refreshBtn').on('click', function (e) {
            var trs = $('tbody', $table).find("tr:has(input:checked)");
            if (trs.length == 0) {
                bootboxError("请选择至少1条数据");
                return;
            }
            for (var i = 0; i < trs.length; i++) {
                if ($(trs[i]).attr("status") != "未计划" && $(trs[i]).attr("status") != "未下发") {
                    bootboxError("不能选择状态为" + $(trs[i]).attr("status") + "的生产计划");
                    return;
                }
            }
            $(".refresh .modal-body").hide();
            $(".refresh .portlet.box.yellow").hide();
            $(".refresh .modal-body .error").hide();
            $(".refresh .gxh_hsqyl_xwx").hide();
            $(".refresh .gxh_hsqyl_yz").hide();
            $(".refresh .gxh_hsqyl_jssx").hide();
            $(".refresh .gxh_hsqyl_jsgx").hide();
            $(".refresh .gxh_hsqyl_bjsx").hide();
            $(".refresh .gxh_hsqyl_zxg").hide();
            $(".refresh .gxh_hsqyl_wg").hide();
            $(".refresh .gxh_hsqyl_zjp").hide();
            $(".refresh .gxh_hsqyl_g").remove();
            $(".refresh #gxq_sxfs .dataTables_wrapper").empty();
            $(".refresh #gxh_sxfs .dataTables_wrapper").empty();
            $(".refresh #submit").hide();
            $('.refresh #submit').removeProp("disabled");
            $('.refresh #cancel').removeProp("disabled");
            $("#gxh_cj select[name='sel-cj']").select2().select2('val', "").select2({
                "placeholder": '请选择车间'
            });
            $(".refresh").modal(
                {
                    backdrop: "static",
                    keyborad: false
                }
            );
            gxqGdcpDtTable.fnClearTable();
            gxhGdcpDtTable.fnClearTable();
            gxhHsqylXwxGgDtTable.fnClearTable();
            gxhHsqylXwxYlDtTable.fnClearTable();
            gxhHsqylYzGgDtTable.fnClearTable();
            gxhHsqylYzYlDtTable.fnClearTable();
            gxhHsqylJssxGgDtTable.fnClearTable();
            gxhHsqylJssxYlDtTable.fnClearTable();
            gxhHsqylJsgxGgDtTable.fnClearTable();
            gxhHsqylJsgxYlDtTable.fnClearTable();
            gxhHsqylBjsxGgDtTable.fnClearTable();
            gxhHsqylBjsxYlDtTable.fnClearTable();
            gxhHsqylZxgGgDtTable.fnClearTable();
            gxhHsqylZxgYlDtTable.fnClearTable();
            gxhHsqylWgGgDtTable.fnClearTable();
            gxhHsqylWgYlDtTable.fnClearTable();
            gxhHsqylZjpGgDtTable.fnClearTable();
            gxhHsqylZjpYlDtTable.fnClearTable();
            $(".refresh #gxh_jdjh  table.gxh_jdjh input").val("");
            $(".refresh #gxh_cljh  table.gxh_cljh input").val("");
            var ids = [];
            trs.each(function (i, tr) {
                ids.push($(tr).attr("id"));
            });
            $.getJSON("../user/formInstsByIds?ids=" + JSON.stringify(ids), function (data) {
                cache = {};
                xwxExist = checkNodeExist(data[0], "hsqyl.xwx");
                yzExist = checkNodeExist(data[0], "hsqyl.yz");
                jssxExist = checkNodeExist(data[0], "hsqyl.jssx");
                jsgxExist = checkNodeExist(data[0], "hsqyl.jsgx");
                zxgExist = checkNodeExist(data[0], "hsqyl.zxg");
                wgExist = checkNodeExist(data[0], "hsqyl.wg");
                gExist = getFromNode("gcs", data[0], "hsqyl") ? true : false;
                bjsxExist = checkNodeExist(data[0], "hsqyl.bjsx");
                zjpExist = checkNodeExist(data[0], "hsqyl.zjp");
                if (zjpExist) zjpText = getFromNode("text", data[0], "hsqyl.zjp");
                getFromNode("value", data[0], "hsh.gdcp.lb") == "钢丝绳" ? isGss = true : isGss = false;
                if (trs.length > 1) {
                    for (var i = 0; i < data.length; i++) {
                        if (getFromNode("value", data[i], "sfdz") == "是") {
                            $(".refresh .modal-body .error").html("<p>对不起,不满足合并生产条件。<br/>原因:产品编号" +
                                (getFromNode("value", data[i], "cpbh") || "") + "的生产计划已经定制</p>");
                            $(".refresh .modal-body").show();
                            $(".refresh .modal-body .error").show();
                            return;
                        }
                    }
                    for (var i = 1; i < data.length; i++) {
                        var array = [
                            {"name": "lb", "text": "类别"},
                            {"name": isGss ? "gg" : "jg", "text": isGss ? "规格" : "结构"},
                            {"name": "zj", "text": "直径"},
                            {"name": "nx", "text": "捻向"},
                            {"name": "qd", "text": "强度"},
                            {"name": "tyfs", "text": "涂油方式"},
                            {"name": "nj", "text": "捻距"},
                            {"name": "bmzt", "text": "表面状态"},
                            {"name": "yt", "text": "用途"}
                        ];
                        for (var j = 0; j < array.length; j++) {
                            if (getFromNode("value", data[i - 1], "hsh.gdcp." + array[j].name) != getFromNode("value", data[i], "hsh.gdcp." + array[j].name)) {
                                $(".refresh .modal-body .error").html("<p>对不起,不满足合并生产条件。<br/>原因:合绳后-工段产品-" +
                                    array[j].text + "不同</p>");
                                $(".refresh .modal-body").show();
                                $(".refresh .modal-body .error").show();
                                return;
                            }
                        }
                    }
                    for (var i = 1; i < data.length; i++) {
                        if (checkNodeExist(data[i], "hsqyl.xwx") != xwxExist) {
                            $(".refresh .modal-body .error").html("<p>对不起,不满足合并生产条件。<br/>原因:合绳前用料,有的存在纤维芯，有的不存在纤维芯</p>");
                            $(".refresh .modal-body").show();
                            $(".refresh .modal-body .error").show();
                            return;
                        }
                    }
                    for (var i = 1; i < data.length; i++) {
                        if (checkNodeExist(data[i], "hsqyl.yz") != yzExist) {
                            $(".refresh .modal-body .error").html("<p>对不起,不满足合并生产条件。<br/>原因:合绳前用料,有的存在油脂，有的不存在油脂</p>");
                            $(".refresh .modal-body").show();
                            $(".refresh .modal-body .error").show();
                            return;
                        }
                    }
                    for (var i = 1; i < data.length; i++) {
                        if (checkNodeExist(data[i], "hsqyl.jssx") != jssxExist) {
                            $(".refresh .modal-body .error").html("<p>对不起,不满足合并生产条件。<br/>原因:合绳前用料,有的存在金属绳芯，有的不存在金属绳芯</p>");
                            $(".refresh .modal-body").show();
                            $(".refresh .modal-body .error").show();
                            return;
                        }
                    }
                    for (var i = 1; i < data.length; i++) {
                        if (checkNodeExist(data[i], "hsqyl.jsgx") != jsgxExist) {
                            $(".refresh .modal-body .error").html("<p>对不起,不满足合并生产条件。<br/>原因:合绳前用料,有的存在金属股芯，有的不存在金属股芯</p>");
                            $(".refresh .modal-body").show();
                            $(".refresh .modal-body .error").show();
                            return;
                        }
                    }
                    for (var i = 1; i < data.length; i++) {
                        if (checkNodeExist(data[i], "hsqyl.zxg") != zxgExist) {
                            $(".refresh .modal-body .error").html("<p>对不起,不满足合并生产条件。<br/>原因:合绳前用料,有的存在中心股，有的不存在中心股</p>");
                            $(".refresh .modal-body").show();
                            $(".refresh .modal-body .error").show();
                            return;
                        }
                    }
                    for (var i = 1; i < data.length; i++) {
                        if (checkNodeExist(data[i], "hsqyl.wg") != wgExist) {
                            $(".refresh .modal-body .error").html("<p>对不起,不满足合并生产条件。<br/>原因:合绳前用料,有的存在外股，有的不存在外股</p>");
                            $(".refresh .modal-body").show();
                            $(".refresh .modal-body .error").show();
                            return;
                        }
                    }
                    for (var i = 1; i < data.length; i++) {
                        if (checkNodeExist(data[i], "hsqyl.bjsx") != bjsxExist) {
                            $(".refresh .modal-body .error").html("<p>对不起,不满足合并生产条件。<br/>原因:合绳前用料,有的存在半金属芯，有的不存在半金属芯</p>");
                            $(".refresh .modal-body").show();
                            $(".refresh .modal-body .error").show();
                            return;
                        }
                    }
                    for (var i = 1; i < data.length; i++) {
                        if (checkNodeExist(data[i], "hsqyl.zjp") != zjpExist) {
                            $(".refresh .modal-body .error").html("<p>对不起,不满足合并生产条件。<br/>原因:合绳前用料,有的存在" +
                                zjpText + "，有的不存在" + zjpText + "</p>");
                            $(".refresh .modal-body").show();
                            $(".refresh .modal-body .error").show();
                            return;
                        }
                    }
                    for (var i = 1; i < data.length; i++) {
                        if (checkNodeExist(data[i], "hsqyl.gdc1") != gExist) {
                            $(".refresh .modal-body .error").html("<p>对不起,不满足合并生产条件。<br/>原因:合绳前用料,有的存在股，有的不存在股</p>");
                            $(".refresh .modal-body").show();
                            $(".refresh .modal-body .error").show();
                            return;
                        }
                    }
                    if (gExist) {
                        var gcs = getFromNode("gcs", data[0], "hsqyl");
                        for (var i = 1; i < data.length; i++) {
                            if (getFromNode("gcs", data[i], "hsqyl").total != gcs.total ||
                                getFromNode("gcs", data[i], "hsqyl").begin != gcs.begin) {
                                $(".refresh .modal-body .error").html("<p>对不起,不满足合并生产条件。<br/>原因:合绳前用料,股层不同</p>");
                                $(".refresh .modal-body").show();
                                $(".refresh .modal-body .error").show();
                                return;
                            }
                        }
                        for (var i = gcs.begin; i < gcs.begin + gcs.total; i++) {
                            var gs = getFromNode("gs", data[0], "hsqyl.gdc" + i);
                            for (var j = 1; j < data.length; j++) {
                                if (getFromNode("gs", data[j], "hsqyl.gdc" + i).total != gs.total) {
                                    $(".refresh .modal-body .error").html("<p>对不起,不满足合并生产条件。<br/>原因:合绳前用料-第" +
                                        i + "层股的股数不同</p>");
                                    $(".refresh .modal-body").show();
                                    $(".refresh .modal-body .error").show();
                                    return;
                                }
                            }
                        }
                    }
                    if (xwxExist) {
                        for (var i = 1; i < data.length; i++) {
                            var array = [
                                {"name": "gg.lb", "text": "规格-类别"},
                                {"name": "gg.zj", "text": "规格-直径"},
                                {"name": "gg.nx", "text": "规格-捻向"},
                                {"name": "gg.hyl", "text": "规格-含油率"},
                                {"name": "yl.gymcxs", "text": "用量-工艺米长系数"},
                                {"name": "yl.dh", "text": "用量-吨耗"}
                            ];
                            for (var j = 0; j < array.length; j++) {
                                if (getFromNode("value", data[i - 1], "hsqyl.xwx." + array[j].name) != getFromNode("value", data[i], "hsqyl.xwx." + array[j].name)) {
                                    $(".refresh .modal-body .error").html("<p>对不起,不满足合并生产条件。<br/>原因:合绳前用料-纤维芯-" + array[j].text + "不同</p>");
                                    $(".refresh .modal-body").show();
                                    $(".refresh .modal-body .error").show();
                                    return;
                                }
                            }
                        }
                    }
                    if (yzExist) {
                        for (var i = 1; i < data.length; i++) {
                            var array = [
                                {"name": "gg.xh", "text": "规格-型号"},
                                {"name": "yl.tyfs", "text": "用量-涂油方式"},
                                {"name": "yl.dh", "text": "用量-吨耗"}
                            ];
                            for (var j = 0; j < array.length; j++) {
                                if (getFromNode("value", data[i - 1], "hsqyl.yz." + array[j].name) != getFromNode("value", data[i], "hsqyl.yz." + array[j].name)) {
                                    $(".refresh .modal-body .error").html("<p>对不起,不满足合并生产条件。<br/>原因:合绳前用料-油脂-" + array[j].text + "不同</p>");
                                    $(".refresh .modal-body").show();
                                    $(".refresh .modal-body .error").show();
                                    return;
                                }
                            }
                        }
                    }
                    if (jssxExist) {
                        for (var i = 1; i < data.length; i++) {
                            var array = [
                                {"name": "gg.jg", "text": "规格-结构"},
                                {"name": "gg.zj", "text": "规格-直径"},
                                {"name": "gg.nx", "text": "规格-捻向"},
                                {"name": "gg.qd", "text": "规格-强度"},
                                {"name": "gg.tyfs", "text": "规格-涂油方式"},
                                {"name": "gg.nj", "text": "规格-捻距"},
                                {"name": "gg.bmzt", "text": "规格-表面状态"}
                            ];
                            for (var j = 0; j < array.length; j++) {
                                if (getFromNode("value", data[i - 1], "hsqyl.jssx." + array[j].name) != getFromNode("value", data[i], "hsqyl.jssx." + array[j].name)) {
                                    $(".refresh .modal-body .error").html("<p>对不起,不满足合并生产条件。<br/>原因:合绳前用料-金属绳芯-" + array[j].text + "不同</p>");
                                    $(".refresh .modal-body").show();
                                    $(".refresh .modal-body .error").show();
                                    return;
                                }
                            }
                        }
                    }
                    if (jsgxExist) {
                        for (var i = 1; i < data.length; i++) {
                            var array = [
                                {"name": "gg.jg", "text": "规格-结构"},
                                {"name": "gg.zj", "text": "规格-直径"},
                                {"name": "gg.nx", "text": "规格-捻向"},
                                {"name": "gg.qd", "text": "规格-强度"},
                                {"name": "gg.tyfs", "text": "规格-涂油方式"},
                                {"name": "gg.nj", "text": "规格-捻距"},
                                {"name": "gg.bmzt", "text": "规格-表面状态"}
                            ];
                            for (var j = 0; j < array.length; j++) {
                                if (getFromNode("value", data[i - 1], "hsqyl.jsgx." + array[j].name) != getFromNode("value", data[i], "hsqyl.jsgx." + array[j].name)) {
                                    $(".refresh .modal-body .error").html("<p>对不起,不满足合并生产条件。<br/>原因:合绳前用料-金属股芯-" + array[j].text + "不同</p>");
                                    $(".refresh .modal-body").show();
                                    $(".refresh .modal-body .error").show();
                                    return;
                                }
                            }
                        }
                    }
                    if (zxgExist) {
                        for (var i = 1; i < data.length; i++) {
                            var array = [
                                {"name": "gg.jg", "text": "规格-结构"},
                                {"name": "gg.zj", "text": "规格-直径"},
                                {"name": "gg.nx", "text": "规格-捻向"},
                                {"name": "gg.qd", "text": "规格-强度"},
                                {"name": "gg.tyfs", "text": "规格-涂油方式"},
                                {"name": "gg.nj", "text": "规格-捻距"},
                                {"name": "gg.bmzt", "text": "规格-表面状态"}
                            ];
                            for (var j = 0; j < array.length; j++) {
                                if (getFromNode("value", data[i - 1], "hsqyl.zxg." + array[j].name) != getFromNode("value", data[i], "hsqyl.zxg." + array[j].name)) {
                                    $(".refresh .modal-body .error").html("<p>对不起,不满足合并生产条件。<br/>原因:合绳前用料-中心股-" + array[j].text + "不同</p>");
                                    $(".refresh .modal-body").show();
                                    $(".refresh .modal-body .error").show();
                                    return;
                                }
                            }
                        }
                    }
                    if (wgExist) {
                        for (var i = 1; i < data.length; i++) {
                            var array = [
                                {"name": "gg.jg", "text": "规格-结构"},
                                {"name": "gg.zj", "text": "规格-直径"},
                                {"name": "gg.nx", "text": "规格-捻向"},
                                {"name": "gg.qd", "text": "规格-强度"},
                                {"name": "gg.tyfs", "text": "规格-涂油方式"},
                                {"name": "gg.nj", "text": "规格-捻距"},
                                {"name": "yl.gs", "text": "用量-个数"},
                                {"name": "gg.bmzt", "text": "规格-表面状态"}
                            ];
                            for (var j = 0; j < array.length; j++) {
                                if (getFromNode("value", data[i - 1], "hsqyl.wg." + array[j].name) != getFromNode("value", data[i], "hsqyl.wg." + array[j].name)) {
                                    $(".refresh .modal-body .error").html("<p>对不起,不满足合并生产条件。<br/>原因:合绳前用料-外股-" + array[j].text + "不同</p>");
                                    $(".refresh .modal-body").show();
                                    $(".refresh .modal-body .error").show();
                                    return;
                                }
                            }
                        }
                    }
                    if (gExist) {
                        var gcs = getFromNode("gcs", data[0], "hsqyl");
                        var array = [
                            {"name": "gg.jg", "text": "规格-结构"},
                            {"name": "gg.zj", "text": "规格-直径"},
                            {"name": "gg.nx", "text": "规格-捻向"},
                            {"name": "gg.qd", "text": "规格-强度"},
                            {"name": "gg.tyfs", "text": "规格-涂油方式"},
                            {"name": "gg.nj", "text": "规格-捻距"},
                            {"name": "gg.bmzt", "text": "规格-表面状态"},
                            {"name": "yl.gs", "text": "用量-个数"}
                        ];
                        for (var i = 1; i < data.length; i++) {
                            for (var j = gcs.begin; j < gcs.begin + gcs.total; j++) {
                                var gs = getFromNode("gs", data[0], "hsqyl.gdc" + j);
                                for (var k = gs.begin; k < gs.begin + gs.total; k++) {
                                    for (var l = 0; l < array.length; l++) {
                                        if (getFromNode("value", data[i - 1], "hsqyl.gdc" + j + ".g" + k + "." + array[l].name) != getFromNode("value", data[i], "hsqyl.gdc" + j + ".g" + k + "." + array[l].name)) {
                                            $(".refresh .modal-body .error").html("<p>对不起,不满足合并生产条件。<br/>原因:合绳前用料-第" + j + "层股-股" + k + "-" + array[l].text + "不同</p>");
                                            $(".refresh .modal-body").show();
                                            $(".refresh .modal-body .error").show();
                                            return;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (zjpExist) {
                        for (var i = 1; i < data.length; i++) {
                            var array = [
                                {"name": "gg.jg", "text": "规格-结构"},
                                {"name": "gg.zj", "text": "规格-直径"},
                                {"name": "gg.nx", "text": "规格-捻向"},
                                {"name": "gg.qd", "text": "规格-强度"},
                                {"name": "gg.tyfs", "text": "规格-涂油方式"},
                                {"name": "gg.nj", "text": "规格-捻距"},
                                {"name": "gg.bmzt", "text": "规格-表面状态"}
                            ];
                            for (var j = 0; j < array.length; j++) {
                                if (getFromNode("value", data[i - 1], "hsqyl.zjp." + array[j].name) != getFromNode("value", data[i], "hsqyl.zjp." +
                                        array[j].name)) {
                                    $(".refresh .modal-body .error").html("<p>对不起,不满足合并生产条件。<br/>原因:合绳前用料-" + zjpText + "-" +
                                        array[j].text + "不同</p>");
                                    $(".refresh .modal-body").show();
                                    $(".refresh .modal-body .error").show();
                                    return;
                                }
                            }
                        }
                    }
                }
                refreshData = data;
                $(".refresh .collapse").collapse("hide");
                // 设置生产计划更新前后的工段产品
                $(".refresh .gxq_gdcp th[name='jg/gg']").text(isGss ? "规格" : "结构");
                $(".refresh .gxh_gdcp th[name='jg/gg']").text(isGss ? "规格" : "结构");
                var gxqRowValues = [];
                var gxhRowValues = [];
                var array = ["lb", isGss ? "gg" : "jg", "zj", "nx", "qd", "tyfs", "nj", "bmzt", "tsyq", "yt"];
                for (var i = 0; i < array.length; i++) {
                    gxqRowValues.push(getFromNode("value", data[0], "hsh.gdcp." + array[i]) || "");
                    if (array[i] == "tsyq") {
                        gxhRowValues.push("<input type='text' class='form-control input-sm' name='" + array[i] + "' value='" +
                            (data.length == 1 ? (getFromNode("value", data[0], "hsh.gdcp." + array[i]) || "") : "") + "' />");
                    }
                    else {
                        gxhRowValues.push(getFromNode("value", data[0], "hsh.gdcp." + array[i]) || "");
                    }
                }
                gxqGdcpDtTable.fnAddData(gxqRowValues);
                gxhGdcpDtTable.fnAddData(gxhRowValues);
                // 设置生产计划更新前后的收线方式
                var qHtml = "";
                var hHtml = "";
                qHtml += "<table class='table table-striped table-hover table-bordered dataTable no-footer ";
                hHtml += "<table class='table table-striped table-hover table-bordered dataTable no-footer ";
                qHtml += "gxq_sxfs_";
                hHtml += "gxh_sxfs_";
                qHtml += isGss ? "gss" : "not_gss";
                hHtml += isGss ? "gss" : "not_gss";
                qHtml += "'>";
                hHtml += "'>";
                qHtml += "<thead>";
                hHtml += "<thead>";
                qHtml += "<tr role='row'>";
                hHtml += "<tr role='row'>";
                if (isGss) {
                    qHtml += "<th tabindex='0',rowspan='1', colspan='1'>单件米长(m)</th>";
                    hHtml += "<th tabindex='0',rowspan='1', colspan='1'>单件米长(m)</th>";
                    qHtml += "<th tabindex='0',rowspan='1', colspan='1'>件数</th>";
                    hHtml += "<th tabindex='0',rowspan='1', colspan='1'>件数</th>";
                    qHtml += "<th tabindex='0',rowspan='1', colspan='1'>总米长(m)</th>";
                    hHtml += "<th tabindex='0',rowspan='1', colspan='1'>总米长(m)</th>";
                    qHtml += "<th tabindex='0',rowspan='1', colspan='1'>包装方式</th>";
                    hHtml += "<th tabindex='0',rowspan='1', colspan='1'>包装方式</th>";
                    qHtml += "<th tabindex='0',rowspan='1', colspan='1'>轮盘型号</th>";
                    hHtml += "<th tabindex='0',rowspan='1', colspan='1'>轮盘型号</th>";
                    hHtml += "<th tabindex='0',rowspan='1', colspan='1'>操作</th>";
                }
                else {
                    qHtml += "<th tabindex='0',rowspan='1', colspan='1'>段长(m)</th>";
                    hHtml += "<th tabindex='0',rowspan='1', colspan='1'>段长(m)</th>";
                    qHtml += "<th tabindex='0',rowspan='1', colspan='1'>段数(mm)</th>";
                    hHtml += "<th tabindex='0',rowspan='1', colspan='1'>段数(mm)</th>";
                    qHtml += "<th tabindex='0',rowspan='1', colspan='1'>单件米长(m)</th>";
                    hHtml += "<th tabindex='0',rowspan='1', colspan='1'>单件米长(m)</th>";
                    qHtml += "<th tabindex='0',rowspan='1', colspan='1'>件数(MPa)</th>";
                    hHtml += "<th tabindex='0',rowspan='1', colspan='1'>件数(MPa)</th>";
                    qHtml += "<th tabindex='0',rowspan='1', colspan='1'>总米长(m)</th>";
                    hHtml += "<th tabindex='0',rowspan='1', colspan='1'>总米长(m)</th>";
                    qHtml += "<th tabindex='0',rowspan='1', colspan='1'>工字轮型号</th>";
                    hHtml += "<th tabindex='0',rowspan='1', colspan='1'>工字轮型号</th>";
                    hHtml += "<th tabindex='0',rowspan='1', colspan='1'>操作</th>";
                }
                qHtml += "</tr>";
                hHtml += "</tr>";
                qHtml += "</thead>";
                hHtml += "</thead>";
                qHtml += "</table>";
                hHtml += "</table>";
                $(".refresh #gxq_sxfs .dataTables_wrapper").html(qHtml);
                $(".refresh #gxh_sxfs .dataTables_wrapper").html(hHtml);
                if (isGss) {
                    gxqSxfsDtTable = $(".refresh #gxq_sxfs .gxq_sxfs_gss").dataTable(datatableOption);
                    gxhSxfsDtTable = $(".refresh #gxh_sxfs .gxh_sxfs_gss").dataTable(datatableOption);
                }
                else {
                    gxqSxfsDtTable = $(".refresh #gxq_sxfs .gxq_sxfs_not_gss").dataTable(datatableOption);
                    gxhSxfsDtTable = $(".refresh #gxh_sxfs .gxh_sxfs_not_gss").dataTable(datatableOption);
                }
                var names = isGss ? ["djmc", "js", "zmc", "bzfs", "lpxh"] :
                    ["dc", "ds", "djmc", "js", "zmc", "gzlxh"];
                for (var i = 0; i < data.length; i++) {
                    var sxfss = getFromNode("sxfss", data[i], "hsh.sxfs");
                    for (var j = sxfss.begin; j < sxfss.begin + sxfss.total; j++) {
                        var rowValues = [];
                        for (var k = 0; k < names.length; k++) {
                            rowValues.push(getFromNode("value", data[i], "hsh.sxfs.sxfs" + j + "." + names[k]));
                        }
                        gxqSxfsDtTable.fnAddData(rowValues);
                        for (var k = 0; k < names.length; k++) {
                            rowValues[k] = "<input type='text' class='form-control input-sm' name='" + names[k] +
                                "' value='" + rowValues[k] + "' />";
                        }
                        rowValues.push("<button class='btn btn-sm red'>删除</button>");
                        gxhSxfsDtTable.fnAddData(rowValues);
                    }
                }
                if (jssxExist) {
                    var rowValues = [];
                    var names = ["jg", "zj", "nx", "qd", "tyfs", "nj", "bmzt"];
                    for (var i = 0; i < names.length; i++) {
                        rowValues.push(getFromNode("value", data[0], "hsqyl.jssx.gg." + names[i]) || "");
                    }
                    gxhHsqylJssxGgDtTable.fnAddData(rowValues);
                    for (var i = 0; i < data.length; i++) {
                        var yls = getFromNode("yls", data[i], "hsqyl.jssx.yl");
                        for (var j = yls.begin; j < yls.begin + yls.total; j++) {
                            var rowValues = [];
                            var names = ["dc", "ds", "djmc", "js", "zmc", "gzlxh"];
                            for (var k = 0; k < names.length; k++) {
                                rowValues.push("<input type='text' class='form-control input-sm' name='" + names[k] + "' value='" +
                                    (getFromNode("value", data[i], "hsqyl.jssx.yl.yl" + j + "." + names[k]) || "") + "' />");
                            }
                            rowValues.push("<button class='btn btn-sm red'>删除</button>");
                            gxhHsqylJssxYlDtTable.fnAddData(rowValues);
                        }
                    }
                    $(".refresh .gxh_hsqyl_jssx").show();
                }
                if (jsgxExist) {
                    var rowValues = [];
                    var names = ["jg", "zj", "nx", "qd", "tyfs", "nj", "bmzt"];
                    for (var i = 0; i < names.length; i++) {
                        rowValues.push(getFromNode("value", data[0], "hsqyl.jsgx.gg." + names[i]) || "");
                    }
                    gxhHsqylJsgxGgDtTable.fnAddData(rowValues);
                    for (var i = 0; i < data.length; i++) {
                        // 用量数
                        var yls = getFromNode("yls", data[i], "hsqyl.jsgx.yl");
                        for (var j = yls.begin; j < yls.begin + yls.total; j++) {
                            var rowValues = [];
                            var names = ["dc", "ds", "djmc", "js", "zmc", "gzlxh"];
                            for (var k = 0; k < names.length; k++) {
                                rowValues.push("<input type='text' class='form-control input-sm' name='" + names[k] + "' value='" +
                                    (getFromNode("value", data[i], "hsqyl.jsgx.yl.yl" + j + "." + names[k]) || "") + "' />");
                            }
                            rowValues.push("<button class='btn btn-sm red'>删除</button>");
                            gxhHsqylJsgxYlDtTable.fnAddData(rowValues);
                        }
                    }
                    $(".refresh .gxh_hsqyl_jsgx").show();
                }
                if (bjsxExist) {
                    var rowValues = [];
                    var names = ["jg", "zj", "nx", "qd", "tyfs", "nj", "bmzt"];
                    for (var i = 0; i < names.length; i++) {
                        rowValues.push(getFromNode("value", data[0], "hsqyl.bjsx.gg." + names[i]) || "");
                    }
                    gxhHsqylBjsxGgDtTable.fnAddData(rowValues);
                    for (var i = 0; i < data.length; i++) {
                        // 用量数
                        var yls = getFromNode("yls", data[i], "hsqyl.bjsx.yl");
                        for (var j = yls.begin; j < yls.begin + yls.total; j++) {
                            var rowValues = [];
                            var names = ["dc", "ds", "djmc", "js", "zmc", "gzlxh"];
                            for (var k = 0; k < names.length; k++) {
                                rowValues.push("<input type='text' class='form-control input-sm' name='" + names[k] + "' value='" +
                                    (getFromNode("value", data[i], "hsqyl.bjsx.yl.yl" + j + "." + names[k]) || "") + "' />");
                            }
                            rowValues.push("<button class='btn btn-sm red'>删除</button>");
                            gxhHsqylBjsxYlDtTable.fnAddData(rowValues);
                        }
                    }
                    $(".refresh .gxh_hsqyl_bjsx").show();
                }
                if (wgExist) {
                    var rowValues = [];
                    var names = ["jg", "zj", "nx", "qd", "tyfs", "nj", "bmzt"];
                    for (var i = 0; i < names.length; i++) {
                        rowValues.push(getFromNode("value", data[0], "hsqyl.wg.gg." + names[i]) || "");
                    }
                    gxhHsqylWgGgDtTable.fnAddData(rowValues);
                    for (var i = 0; i < data.length; i++) {
                        // 用量数
                        var yls = getFromNode("yls", data[i], "hsqyl.wg.yl");
                        for (var j = yls.begin; j < yls.begin + yls.total; j++) {
                            var rowValues = [];
                            rowValues.push("<input type='text' class='form-control input-sm' name='gs' value='" +
                                (getFromNode("value", data[i], "hsqyl.wg.yl.gs") || "") + "' disabled/>");
                            var names = ["dc", "ds", "djmc", "js", "zmc", "gzlxh"];
                            for (var k = 0; k < names.length; k++) {
                                rowValues.push("<input type='text' class='form-control input-sm' name='" + names[k] + "' value='" +
                                    (getFromNode("value", data[i], "hsqyl.wg.yl.yl" + j + "." + names[k]) || "") + "' />")
                            }
                            rowValues.push("<button class='btn btn-sm red'>删除</button>");
                            gxhHsqylWgYlDtTable.fnAddData(rowValues);
                        }
                    }
                    $(".refresh .gxh_hsqyl_wg").show();
                }
                if (zxgExist) {
                    var rowValues = [];
                    var names = ["jg", "zj", "nx", "qd", "tyfs", "nj", "bmzt"];
                    for (var i = 0; i < names.length; i++) {
                        rowValues.push(getFromNode("value", data[0], "hsqyl.zxg.gg." + names[i]) || "");
                    }
                    gxhHsqylZxgGgDtTable.fnAddData(rowValues);
                    for (var i = 0; i < data.length; i++) {
                        // 用量数
                        var yls = getFromNode("yls", data[i], "hsqyl.zxg.yl");
                        for (var j = yls.begin; j < yls.begin + yls.total; j++) {
                            var rowValues = [];
                            var names = ["dc", "ds", "djmc", "js", "zmc", "gzlxh"];
                            for (var k = 0; k < names.length; k++) {
                                rowValues.push("<input type='text' class='form-control input-sm' name='" + names[k] + "' value='" +
                                    (getFromNode("value", data[i], "hsqyl.zxg.yl.yl" + j + "." + names[k]) || "") + "' />");
                            }
                            rowValues.push("<button class='btn btn-sm red'>删除</button>");
                            gxhHsqylZxgYlDtTable.fnAddData(rowValues);
                        }
                    }
                    $(".refresh .gxh_hsqyl_zxg").show();
                }
                if (xwxExist) {
                    // 设置纤维芯规格
                    var rowValues = [];
                    var names = ["lb", "zj", "nx", "hyl"]
                    for (var i = 0; i < names.length; i++) {
                        rowValues.push(getFromNode("value", data[0], "hsqyl.xwx.gg." + names[i]) || "");
                    }
                    gxhHsqylXwxGgDtTable.fnAddData(rowValues);
                    var zmc = 0;
                    var zl = 0;
                    var rowValues = [];
                    for (var i = 0; i < data.length; i++) {
                        zmc = accAdd(zmc, getFromNode("value", data[i], "hsqyl.xwx.yl.zmc") || "");
                        zl = accAdd(zl, getFromNode("value", data[i], "hsqyl.xwx.yl.zl") || "");
                    }
                    rowValues.push(getFromNode("value", data[0], "hsqyl.xwx.yl.gymcxs") || "");
                    rowValues.push(zmc);
                    rowValues.push(getFromNode("value", data[0], "hsqyl.xwx.yl.dh") || "");
                    rowValues.push(zl);
                    var names = ["gymcxs", "zmc", "dh", "zl"];
                    for (var i = 0; i < rowValues.length; i++) {
                        rowValues[i] = "<input type='text' class='form-control input-sm' name='" + names[i] + "' value='" + rowValues[i] + "' />";
                    }
                    gxhHsqylXwxYlDtTable.fnAddData(rowValues);
                    $(".refresh .gxh_hsqyl_xwx").show();
                }
                if (yzExist) {
                    var rowValues = [];
                    rowValues.push(getFromNode("value", data[0], "hsqyl.yz.gg.xh") || "");
                    gxhHsqylYzGgDtTable.fnAddData(rowValues);
                    var zl = 0;
                    var rowValues = [];
                    for (var i = 0; i < data.length; i++) {
                        zl = accAdd(zl, getFromNode("value", data[i], "hsqyl.yz.yl.zl") || "");
                    }
                    rowValues.push(getFromNode("value", data[0], "hsqyl.yz.yl.tyfs") || "");
                    rowValues.push(getFromNode("value", data[0], "hsqyl.yz.yl.dh") || "");
                    rowValues.push(zl);
                    var names = ["tyfs", "dh", "zl"];
                    for (var i = 0; i < rowValues.length; i++) {
                        rowValues[i] = "<input type='text' class='form-control input-sm' name='" + names[i] + "' value='" + rowValues[i] + "' />";
                    }
                    gxhHsqylYzYlDtTable.fnAddData(rowValues);
                    $(".refresh .gxh_hsqyl_yz").show();
                }
                if (zjpExist) {
                    var rowValues = [];
                    var names = ["jg", "zj", "nx", "qd", "tyfs", "nj", "bmzt"];
                    for (var i = 0; i < names.length; i++) {
                        rowValues.push(getFromNode("value", data[0], "hsqyl.zjp.gg." + names[i]) || "");
                    }
                    gxhHsqylZjpGgDtTable.fnAddData(rowValues);
                    for (var i = 0; i < data.length; i++) {
                        var yls = getFromNode("yls", data[i], "hsqyl.zjp.yl");
                        for (var j = yls.begin; j < yls.begin + yls.total; j++) {
                            var rowValues = [];
                            var names = ["dc", "ds", "djmc", "js", "zmc", "gzlxh"];
                            for (var k = 0; k < names.length; k++) {
                                rowValues.push("<input type='text' class='form-control input-sm' name='" + names[k] + "' value='" +
                                    (getFromNode("value", data[i], "hsqyl.zjp.yl.yl" + j + "." + names[k]) || "") + "' />");
                            }
                            rowValues.push("<button class='btn btn-sm red'>删除</button>");
                            gxhHsqylZjpYlDtTable.fnAddData(rowValues);
                        }
                    }
                    $(".refresh .gxh_hsqyl_zjp a[href='#gxh_hsqyl_zjp']").text(zjpText);
                    $(".refresh .gxh_hsqyl_zjp").show();
                }
                if (gExist) {
                    var gcs = getFromNode("gcs", data[0], "hsqyl");
                    for (var i = gcs.begin; i < gcs.begin + gcs.total; i++) {
                        var html = "";
                        html += "<div class='panel panel-default gxh_hsqyl_g gxh_hsqyl_gdc";
                        html += i;
                        html += "'>";
                        html += "<div class='panel-heading'>";
                        html += "<div class='panel-title' style='font-size:14px'>";
                        html += "<a class='accordion-toggle accordion-toggle-styled collapsed' data-toggle='collapse' ";
                        html += "href='#gxh_hsqyl_gdc";
                        html += i;
                        html += "' style='font-size:14px;font-weight:bold'>";
                        html += getFromNode("text", data[0], "hsqyl.gdc" + i);
                        html += "</a>";
                        html += "</div>";
                        html += "</div>";
                        html += "<div class='panel-collapse collapse' id='gxh_hsqyl_gdc";
                        html += i;
                        html += "'>";
                        html += "<div class='panel-body'>";
                        html += "<div class='panel-group accordion'>";
                        // 获取股数
                        var gs = getFromNode("gs", data[0], "hsqyl.gdc" + i);
                        for (var j = gs.begin; j < gs.begin + gs.total; j++) {
                            html += "<div class='panel panel-default'>";
                            html += "<div class='panel-heading'>";
                            html += "<div class='panel-title' style='font-size:14px'>";
                            html += "<a class='accordion-toggle accordion-toggle-styled collapsed' data-toggle='collapse' ";
                            html += "href='#gxh_hsqyl_gdc";
                            html += i;
                            html += "_g";
                            html += j;
                            html += "' style='font-size:14px;font-weight:bold'>";
                            html += getFromNode("text", data[0], "hsqyl.gdc" + i + ".g" + j);
                            html += "</a>";
                            html += "</div>";
                            html += "</div>";
                            html += "<div class='panel-collapse collapse' id='gxh_hsqyl_gdc";
                            html += i;
                            html += "_g";
                            html += j;
                            html += "'>";
                            html += "<div class='panel-body'>";
                            html += "<div class='panel-group accordion'>";
                            html += "<div class='panel panel-default'>";
                            html += "<div class='panel-heading'>";
                            html += "<div class='panel-title' style='font-size:14px'>";
                            html += "<a class='accordion-toggle accordion-toggle-styled collapsed' data-toggle='collapse' ";
                            html += "href='#gxh_hsqyl_gdc";
                            html += i;
                            html += "_g";
                            html += j;
                            html += "_gg";
                            html += "' style='font-size:14px;font-weight:bold'>";
                            html += "规格</a>";
                            html += "</div>";
                            html += "</div>";
                            html += "<div class='panel-collapse collapse' id='gxh_hsqyl_gdc";
                            html += i;
                            html += "_g";
                            html += j;
                            html += "_gg'>";
                            html += "<div class='panel-body'>";
                            html += "<div class='dataTables_wrapper no-footer'>";
                            html += "<table class='table table-striped table-hover table-bordered dataTable no-footer ";
                            html += "gxh_hsqyl_gdc";
                            html += i;
                            html += "_g";
                            html += j;
                            html += "_gg'>";
                            html += "<thead>";
                            html += "<tr role='row'>";
                            html += "<th tabindex='0',rowspan='1', colspan='1'> 结构</th>";
                            html += "<th tabindex='0',rowspan='1', colspan='1'> 直径(mm)</th>";
                            html += "<th tabindex='0',rowspan='1', colspan='1'> 捻向</th>";
                            html += "<th tabindex='0',rowspan='1', colspan='1'> 强度(MPa)</th>";
                            html += "<th tabindex='0',rowspan='1', colspan='1'> 涂油方式</th>";
                            html += "<th tabindex='0',rowspan='1', colspan='1'> 捻距(mm)</th>";
                            html += "<th tabindex='0',rowspan='1', colspan='1'> 表面状态</th>";
                            html += "</tr>";
                            html += "</thead>";
                            html += "</table>";
                            html += "</div>";
                            html += "</div>";
                            html += "</div>";
                            html += "</div>";
                            html += "<div class='panel panel-default'>";
                            html += "<div class='panel-heading'>";
                            html += "<div class='panel-title' style='font-size:14px'>";
                            html += "<a class='accordion-toggle accordion-toggle-styled collapsed' data-toggle='collapse' ";
                            html += "href='#gxh_hsqyl_gdc";
                            html += i;
                            html += "_g";
                            html += j;
                            html += "_yl";
                            html += "' style='font-size:14px;font-weight:bold'>";
                            html += "用量</a>";
                            html += "</div>";
                            html += "</div>";
                            html += "<div class='panel-collapse collapse' id='gxh_hsqyl_gdc";
                            html += i;
                            html += "_g";
                            html += j;
                            html += "_yl'>";
                            html += "<div class='panel-body'>";
                            html += "<div class='dataTables_wrapper no-footer'>";
                            html += "<table class='table table-striped table-hover table-bordered dataTable no-footer ";
                            html += "gxh_hsqyl_gdc";
                            html += i;
                            html += "_g";
                            html += j;
                            html += "_yl' gdc='";
                            html += i;
                            html += "' g='";
                            html += j;
                            html += "'>";
                            html += "<thead>";
                            html += "<tr role='row'>";
                            html += "<th tabindex='0',rowspan='1', colspan='1'> 个数</th>";
                            html += "<th tabindex='0',rowspan='1', colspan='1'> 段长(m)</th>";
                            html += "<th tabindex='0',rowspan='1', colspan='1'> 段数</th>";
                            html += "<th tabindex='0',rowspan='1', colspan='1'> 单件米长(m)</th>";
                            html += "<th tabindex='0',rowspan='1', colspan='1'> 件数</th>";
                            html += "<th tabindex='0',rowspan='1', colspan='1'> 总米长(m)</th>";
                            html += "<th tabindex='0',rowspan='1', colspan='1'> 工字轮型号</th>";
                            html += "<th tabindex='0',rowspan='1', colspan='1'> 操作</th>";
                            html += "</tr>";
                            html += "</thead>";
                            html += "</table>";
                            html += "</div>";
                            html += "<div class='table-toolbar'>";
                            html += "<div class='row'>";
                            html += "<div class='col-md-1' style='float:right'>";
                            html += "<div class='btn-group'>";
                            html += "<button class='btn btn-sm green add' style='right:25px'>";
                            html += "<i class='fa fa-plus'>";
                            html += "<span>";
                            html += "添加";
                            html += "</span>";
                            html += "</i>";
                            html += "</button>";
                            html += "</div>";
                            html += "</div>";
                            html += "</div>";
                            html += "</div>";
                            html += "</div>";
                            html += "</div>";
                            html += "</div>";
                            html += "</div>";
                            html += "</div>";
                            html += "</div>";
                            html += "</div>";
                        }
                        html += "</div>";
                        html += "</div>";
                        html += "</div>";
                        html += "</div>";
                        $(".refresh #gxh_hsqyl_accordion").append(html);
                    }
                    for (var i = gcs.begin; i < gcs.begin + gcs.total; i++) {
                        var gs = getFromNode("gs", data[0], "hsqyl.gdc" + i);
                        for (var j = gs.begin; j < gs.begin + gs.total; j++) {
                            var ggTable = $(".refresh " + ".gxh_hsqyl_gdc" + i + "_g" + j + "_gg");
                            var ggDtTable = ggTable.dataTable(datatableOption);
                            var ylTable = $(".refresh " + ".gxh_hsqyl_gdc" + i + "_g" + j + "_yl");
                            var ylDtTable = ylTable.dataTable(datatableOption);
                            var rowValues = [];
                            var names = ["jg", "zj", "nx", "qd", "tyfs", "nj", "bmzt"];
                            for (var k = 0; k < names.length; k++) {
                                rowValues.push(getFromNode("value", data[0], "hsqyl.gdc" + i + ".g" + j + ".gg." + names[k]) || "");
                            }
                            ggDtTable.fnAddData(rowValues);
                            for (var k = 0; k < data.length; k++) {
                                // 用量数
                                var yls = getFromNode("yls", data[k], "hsqyl.gdc" + i + ".g" + j + ".yl");
                                for (var l = yls.begin; l < yls.begin + yls.total; l++) {
                                    var rowValues = [];
                                    rowValues.push("<input type='text' class='form-control input-sm' name='gs' value='" +
                                        (getFromNode("value", data[k], "hsqyl.gdc" + i + ".g" + j + ".yl.gs") || "") + "' disabled/>");
                                    var names = ["dc", "ds", "djmc", "js", "zmc", "gzlxh"];
                                    for (var m = 0; m < names.length; m++) {
                                        rowValues.push("<input type='text' class='form-control input-sm' name='" + names[m] + "' value='" +
                                            (getFromNode("value", data[k], "hsqyl.gdc" + i + ".g" + j + ".yl.yl" + l + "." + names[m]) || "") + "'/>")
                                    }
                                    rowValues.push("<button class='btn btn-sm red'>删除</button>");
                                    ylDtTable.fnAddData(rowValues);
                                }
                            }
                        }
                    }
                }
                if (trs.length == 1) {
                    var names = ["jhscksrq", "jhscjsrq"];
                    for (var i = 0; i < names.length; i++) {
                        $(".refresh #gxh_jdjh input[name=" + names[i] + "]").val(getFromNode("value", data[0], "jdjh." + names[i]) || "");
                    }
                    if (getFromNode("value", data[0], "cj")) {
                        $("#gxh_cj select[name='sel-cj']").select2().select2('val', getFromNode("value", data[0], "cj"));
                    }
                }
                var jhcl = 0;
                for (var i = 0; i < data.length; i++) {
                    jhcl = accAdd(jhcl, getFromNode("value", data[i], "cljh.jhcl"));
                }
                $(".refresh #gxh_cljh input[name='jhcl']").val(jhcl);
                $(".refresh th").css("font-size", "12px");
                $(".refresh .portlet.box.yellow").show();
                $(".refresh .modal-body").show();
                $(".refresh #submit").show();
            }).fail(mesUtil.error);
        });
        $('.refresh #submit').on('click', function (e) {
            e.preventDefault();
            $('.refresh #submit').prop("disabled", "disabled");
            $('.refresh #cancel').prop("disabled", "disabled");
            if (xwxExist) {
                var array = [
                    {"name": "gymcxs", "text": "工艺米长系数"},
                    {"name": "zmc", "text": "总米长"},
                    {"name": "dh", "text": "吨耗"},
                    {"name": "zl", "text": "重量"}
                ];
                for (var i = 0; i < array.length; i++) {
                    var input = $(".refresh .gxh_hsqyl_xwx_yl tbody").find("input[name=" + array[i].name + "]");
                    var result = checkValue(array[i].name, $(input).val());
                    if (!result.valid) {
                        bootboxError("生产计划更新后-合绳前用料-纤维芯-用量-" + array[i].text + result.text);
                        $('.refresh #submit').removeProp("disabled");
                        $('.refresh #cancel').removeProp("disabled");
                        return;
                    }
                }
            }
            if (yzExist) {
                var array = [
                    {"name": "tyfs", "text": "涂油方式"},
                    {"name": "dh", "text": "吨耗"},
                    {"name": "zl", "text": "重量"}
                ];
                for (var i = 0; i < array.length; i++) {
                    var input = $(".refresh .gxh_hsqyl_yz_yl tbody").find("input[name=" + array[i].name + "]");
                    var result = checkValue(array[i].name, $(input).val());
                    if (!result.valid) {
                        bootboxError("生产计划更新后-合绳前用料-油脂-用量-" + array[i].text + result.text);
                        $('.refresh #submit').removeProp("disabled");
                        $('.refresh #cancel').removeProp("disabled");
                        return;
                    }
                }
            }
            if (jssxExist) {
                var array = [
                    {"name": "dc", "text": "段长"},
                    {"name": "ds", "text": "段数"},
                    {"name": "djmc", "text": "单件米长"},
                    {"name": "js", "text": "件数"},
                    {"name": "zmc", "text": "总米长"},
                    {"name": "gzlxh", "text": "工字轮型号"}
                ];
                for (var i = 0; i < array.length; i++) {
                    var inputs = $(".refresh .gxh_hsqyl_jssx_yl tbody").find("input[name=" + array[i].name + "]");
                    for (var j = 0; j < inputs.length; j++) {
                        var result = checkValue(array[i].name, $(inputs[j]).val());
                        if (!result.valid) {
                            bootboxError("生产计划更新后-合绳前用料-金属绳芯-用量-" + array[i].text + result.text);
                            $('.refresh #submit').removeProp("disabled");
                            $('.refresh #cancel').removeProp("disabled");
                            return;
                        }
                    }
                }
            }
            if (jsgxExist) {
                var array = [
                    {"name": "dc", "text": "段长"},
                    {"name": "ds", "text": "段数"},
                    {"name": "djmc", "text": "单件米长"},
                    {"name": "js", "text": "件数"},
                    {"name": "zmc", "text": "总米长"},
                    {"name": "gzlxh", "text": "工字轮型号"}
                ];
                for (var i = 0; i < array.length; i++) {
                    var inputs = $(".refresh .gxh_hsqyl_jsgx_yl tbody").find("input[name=" + array[i].name + "]");
                    for (var j = 0; j < inputs.length; j++) {
                        var result = checkValue(array[i].name, $(inputs[j]).val());
                        if (!result.valid) {
                            bootboxError("生产计划更新后-合绳前用料-金属股芯-用量-" + array[i].text + result.text);
                            $('.refresh #submit').removeProp("disabled");
                            $('.refresh #cancel').removeProp("disabled");
                            return;
                        }
                    }
                }
            }
            if (zxgExist) {
                var array = [
                    {"name": "dc", "text": "段长"},
                    {"name": "ds", "text": "段数"},
                    {"name": "djmc", "text": "单件米长"},
                    {"name": "js", "text": "件数"},
                    {"name": "zmc", "text": "总米长"},
                    {"name": "gzlxh", "text": "工字轮型号"}
                ];
                for (var i = 0; i < array.length; i++) {
                    var inputs = $(".refresh .gxh_hsqyl_zxg_yl tbody").find("input[name=" + array[i].name + "]");
                    for (var j = 0; j < inputs.length; j++) {
                        var result = checkValue(array[i].name, $(inputs[j]).val());
                        if (!result.valid) {
                            bootboxError("生产计划更新后-合绳前用料-中心股-用量-" + array[i].text + result.text);
                            $('.refresh #submit').removeProp("disabled");
                            $('.refresh #cancel').removeProp("disabled");
                            return;
                        }
                    }
                }
            }
            if (bjsxExist) {
                var array = [
                    {"name": "dc", "text": "段长"},
                    {"name": "ds", "text": "段数"},
                    {"name": "djmc", "text": "单件米长"},
                    {"name": "js", "text": "件数"},
                    {"name": "zmc", "text": "总米长"},
                    {"name": "gzlxh", "text": "工字轮型号"}
                ];
                for (var i = 0; i < array.length; i++) {
                    var inputs = $(".refresh .gxh_hsqyl_bjsx_yl tbody").find("input[name=" + array[i].name + "]");
                    for (var j = 0; j < inputs.length; j++) {
                        var result = checkValue(array[i].name, $(inputs[j]).val());
                        if (!result.valid) {
                            bootboxError("生产计划更新后-合绳前用料-半金属芯-用量-" + array[i].text + result.text);
                            $('.refresh #submit').removeProp("disabled");
                            $('.refresh #cancel').removeProp("disabled");
                            return;
                        }
                    }
                }
            }
            if (wgExist) {
                var array = [
                    {"name": "gs", "text": "个数"},
                    {"name": "dc", "text": "段长"},
                    {"name": "ds", "text": "段数"},
                    {"name": "djmc", "text": "单件米长"},
                    {"name": "js", "text": "件数"},
                    {"name": "zmc", "text": "总米长"},
                    {"name": "gzlxh", "text": "工字轮型号"}
                ];
                for (var i = 0; i < array.length; i++) {
                    var inputs = $(".refresh .gxh_hsqyl_wg_yl tbody").find("input[name=" + array[i].name + "]");
                    for (var j = 0; j < inputs.length; j++) {
                        var result = checkValue(array[i].name, $(inputs[j]).val());
                        if (!result.valid) {
                            bootboxError("生产计划更新后-合绳前用料-外股-用量-" + array[i].text + result.text);
                            $('.refresh #submit').removeProp("disabled");
                            $('.refresh #cancel').removeProp("disabled");
                            return;
                        }
                    }
                }
            }
            if (zjpExist) {
                var array = [
                    {"name": "dc", "text": "段长"},
                    {"name": "ds", "text": "段数"},
                    {"name": "djmc", "text": "单件米长"},
                    {"name": "js", "text": "件数"},
                    {"name": "zmc", "text": "总米长"},
                    {"name": "gzlxh", "text": "工字轮型号"}
                ];
                for (var i = 0; i < array.length; i++) {
                    var inputs = $(".refresh .gxh_hsqyl_zjp_yl tbody").find("input[name=" + array[i].name + "]");
                    for (var j = 0; j < inputs.length; j++) {
                        var result = checkValue(array[i].name, $(inputs[j]).val());
                        if (!result.valid) {
                            bootboxError("生产计划更新后-合绳前用料-" + zjpText + "-用量-" + array[i].text + result.text);
                            $('.refresh #submit').removeProp("disabled");
                            $('.refresh #cancel').removeProp("disabled");
                            return;
                        }
                    }
                }
            }
            if (gExist) {
                var array = [
                    {"name": "gs", "text": "个数"},
                    {"name": "dc", "text": "段长"},
                    {"name": "ds", "text": "段数"},
                    {"name": "djmc", "text": "单件米长"},
                    {"name": "js", "text": "件数"},
                    {"name": "zmc", "text": "总米长"},
                    {"name": "gzlxh", "text": "工字轮型号"}
                ];
                var gPanel = $(".refresh").find(".gxh_hsqyl_g");
                for (var i = 0; i < array.length; i++) {
                    var inputs = $(gPanel).find("input[name=" + array[i].name + "]");
                    for (var j = 0; j < inputs.length; j++) {
                        var input = inputs[j];
                        var table = $(input).parents("table")[0];
                        var result = checkValue(array[i].name, $(input).val());
                        if (!result.valid) {
                            bootboxError("生产计划更新后-合绳前用料-第" + $(table).attr("gdc") + "层股-股" + $(table).attr("g") + "-用量-" + array[i].text + result.text);
                            $('.refresh #submit').removeProp("disabled");
                            $('.refresh #cancel').removeProp("disabled");
                            return;
                        }
                    }
                }
            }
            var array;
            if (isGss) {
                array = [
                    {"name": "djmc", "text": "单件米长"},
                    {"name": "js", "text": "件数"},
                    {"name": "zmc", "text": "总米长"},
                    {"name": "bzfs", "text": "包装方式"},
                    {"name": "lpxh", "text": "轮盘型号"}
                ];
            }
            else {
                array = [
                    {"name": "dc", "text": "段长"},
                    {"name": "ds", "text": "段数"},
                    {"name": "djmc", "text": "单件米长"},
                    {"name": "js", "text": "件数"},
                    {"name": "zmc", "text": "总米长"},
                    {"name": "gzlxh", "text": "工字轮型号"}
                ];
            }
            for (var i = 0; i < array.length; i++) {
                var inputs = $(".refresh #gxh_sxfs tbody").find("input[name=" + array[i].name + "]");
                for (var j = 0; j < inputs.length; j++) {
                    var result = checkValue(array[i].name, $(inputs[j]).val());
                    if (!result.valid) {
                        bootboxError("生产计划更新后-收线方式-" + array[i].text + result.text);
                        $('.refresh #submit').removeProp("disabled");
                        $('.refresh #cancel').removeProp("disabled");
                        return;
                    }
                }
            }
            var array = [
                {"name": "jhscksrq", "text": "计划生产开始日期"},
                {"name": "jhscjsrq", "text": "计划生产结束日期"}
            ];
            for (var i = 0; i < array.length; i++) {
                var input = $(".refresh .gxh_jdjh tbody").find("input[name=" + array[i].name + "]");
                var result = checkValue(array[i].name, $(input).val());
                if (!result.valid) {
                    bootboxError("生产计划更新后-进度计划-" + array[i].text + result.text);
                    $('.refresh #submit').removeProp("disabled");
                    $('.refresh #cancel').removeProp("disabled");
                    return;
                }
            }
            var array = [
                {"name": "jhcl", "text": "计划产量"}
            ];
            for (var i = 0; i < array.length; i++) {
                var input = $(".refresh .gxh_cljh tbody").find("input[name=" + array[i].name + "]");
                var result = checkValue(array[i].name, $(input).val());
                if (!result.valid) {
                    bootboxError("生产计划更新后-产量计划-" + array[i].text + result.text);
                    $('.refresh #submit').removeProp("disabled");
                    $('.refresh #cancel').removeProp("disabled");
                    return;
                }
            }
            if (!$("#gxh_cj select[name='sel-cj']").find("option:selected").val()) {
                bootboxError("生产计划更新后-车间不能为空");
                $('.refresh #submit').removeProp("disabled");
                $('.refresh #cancel').removeProp("disabled");
                return;
            }
            var data = refreshData[0];
            setToNode("value", data, "hsh.gdcp.tsyq", $($gxhGdcpTable.find("input[name=tsyq]")).val());
            setToNode("children", data, "hsh.sxfs", $.extend(true, [], getFromNode("children", module, "hsh.sxfs")));
            tree.expire(data);
            var dels = isGss ? ["dc", "ds", "gzlxh"] : ["bzfs", "lpxh"];
            for (var i = 0; i < dels.length; i++) {
                deleteFromNode(data, "hsh.sxfs.sxfsn", dels[i]);
            }
            var trs = $(".refresh #gxh_sxfs tbody").find("tr:has(td:not(.dataTables_empty))");
            drawNode(trs.length, getFromNode("json", data, "hsh.sxfs"), getFromNode("json", data, "hsh.sxfs.sxfsn"), "sxfss", 1);
            tree.expire(data);
            for (var i = 0; i < trs.length; i++) {
                var inputs = $(trs[i]).find("input");
                for (var j = 0; j < $(inputs).length; j++) {
                    setToNode("value", data, "hsh.sxfs.sxfs" + (i + 1) + "." + $(inputs[j]).attr("name"), $(inputs[j]).val());
                }
            }
            if (xwxExist) {
                var tr = $gxhHsqylXwxYlTable.find("tbody tr:has(td:not(.dataTables_empty))");
                var inputs = $(tr).find("input");
                for (var i = 0; i < $(inputs).length; i++) {
                    setToNode("value", data, "hsqyl.xwx.yl." + $(inputs[i]).attr("name"), $(inputs[i]).val());
                }
            }
            if (yzExist) {
                var tr = $gxhHsqylYzYlTable.find("tbody tr:has(td:not(.dataTables_empty))");
                var inputs = $(tr).find("input");
                for (var i = 0; i < $(inputs).length; i++) {
                    setToNode("value", data, "hsqyl.yz.yl." + $(inputs[i]).attr("name"), $(inputs[i]).val());
                }
            }
            if (jssxExist) {
                setToNode("children", data, "hsqyl.jssx.yl", $.extend(true, [], getFromNode("children", module, "hsqyl.jssx.yl")));
                tree.expire(data);
                var trs = $gxhHsqylJssxYlTable.find("tbody tr:has(td:not(.dataTables_empty))");
                drawNode(trs.length, getFromNode("json", data, "hsqyl.jssx.yl"), getFromNode("json", data, "hsqyl.jssx.yl.yln"), "yls", 1);
                tree.expire(data);
                for (var i = 0; i < trs.length; i++) {
                    var inputs = $(trs[i]).find("input");
                    for (var j = 0; j < $(inputs).length; j++) {
                        setToNode("value", data, "hsqyl.jssx.yl.yl" + (i + 1) + "." + $(inputs[j]).attr("name"), $(inputs[j]).val());
                    }
                }
            }
            if (jsgxExist) {
                setToNode("children", data, "hsqyl.jsgx.yl", $.extend(true, [], getFromNode("children", module, "hsqyl.jsgx.yl")));
                tree.expire(data);
                var trs = $gxhHsqylJsgxYlTable.find("tbody tr:has(td:not(.dataTables_empty))");
                drawNode(trs.length, getFromNode("json", data, "hsqyl.jsgx.yl"), getFromNode("json", data, "hsqyl.jsgx.yl.yln"), "yls", 1);
                tree.expire(data);
                for (var i = 0; i < trs.length; i++) {
                    var inputs = $(trs[i]).find("input");
                    for (var j = 0; j < $(inputs).length; j++) {
                        setToNode("value", data, "hsqyl.jsgx.yl.yl" + (i + 1) + "." + $(inputs[j]).attr("name"), $(inputs[j]).val());
                    }
                }
            }
            if (zxgExist) {
                setToNode("children", data, "hsqyl.zxg.yl", $.extend(true, [], getFromNode("children", module, "hsqyl.zxg.yl")));
                tree.expire(data);
                var trs = $gxhHsqylZxgYlTable.find("tbody tr:has(td:not(.dataTables_empty))");
                drawNode(trs.length, getFromNode("json", data, "hsqyl.zxg.yl"), getFromNode("json", data, "hsqyl.zxg.yl.yln"), "yls", 1);
                tree.expire(data);
                for (var i = 0; i < trs.length; i++) {
                    var inputs = $(trs[i]).find("input");
                    for (var j = 0; j < $(inputs).length; j++) {
                        setToNode("value", data, "hsqyl.zxg.yl.yl" + (i + 1) + "." + $(inputs[j]).attr("name"), $(inputs[j]).val());
                    }
                }
            }
            if (bjsxExist) {
                setToNode("children", data, "hsqyl.bjsx.yl", $.extend(true, [], getFromNode("children", module, "hsqyl.bjsx.yl")));
                tree.expire(data);
                var trs = $gxhHsqylBjsxYlTable.find("tbody tr:has(td:not(.dataTables_empty))");
                drawNode(trs.length, getFromNode("json", data, "hsqyl.bjsx.yl"), getFromNode("json", data, "hsqyl.bjsx.yl.yln"), "yls", 1);
                tree.expire(data);
                for (var i = 0; i < trs.length; i++) {
                    var inputs = $(trs[i]).find("input");
                    for (var j = 0; j < $(inputs).length; j++) {
                        setToNode("value", data, "hsqyl.bjsx.yl.yl" + (i + 1) + "." + $(inputs[j]).attr("name"), $(inputs[j]).val());
                    }
                }
            }
            if (zjpExist) {
                setToNode("children", data, "hsqyl.zjp.yl", $.extend(true, [], getFromNode("children", module, "hsqyl.zjp.yl")));
                tree.expire(data);
                var trs = $gxhHsqylZjpYlTable.find("tbody tr:has(td:not(.dataTables_empty))");
                drawNode(trs.length, getFromNode("json", data, "hsqyl.zjp.yl"), getFromNode("json", data, "hsqyl.zjp.yl.yln"), "yls", 1);
                tree.expire(data);
                for (var i = 0; i < trs.length; i++) {
                    var inputs = $(trs[i]).find("input");
                    for (var j = 0; j < $(inputs).length; j++) {
                        setToNode("value", data, "hsqyl.zjp.yl.yl" + (i + 1) + "." + $(inputs[j]).attr("name"), $(inputs[j]).val());
                    }
                }
            }
            if (wgExist) {
                setToNode("children", data, "hsqyl.wg.yl", $.extend(true, [], getFromNode("children", module, "hsqyl.wg.yl")));
                tree.expire(data);
                var trs = $gxhHsqylWgYlTable.find("tbody tr:has(td:not(.dataTables_empty))");
                drawNode(trs.length, getFromNode("json", data, "hsqyl.wg.yl"), getFromNode("json", data, "hsqyl.wg.yl.yln"), "yls", 1);
                tree.expire(data);
                setToNode("value", data, "hsqyl.wg.yl.gs", $($(trs[0]).find("input[name=gs]")).val());
                for (var i = 0; i < trs.length; i++) {
                    var inputs = $(trs[i]).find("input[name!=gs]");
                    for (var j = 0; j < $(inputs).length; j++) {
                        setToNode("value", data, "hsqyl.wg.yl.yl" + (i + 1) + "." + $(inputs[j]).attr("name"), $(inputs[j]).val());
                    }
                }
            }
            if (gExist) {
                var gcs = getFromNode("gcs", data, "hsqyl");
                for (var i = gcs.begin; i < gcs.begin + gcs.total; i++) {
                    var gs = getFromNode("gs", data, "hsqyl.gdc" + i);
                    for (var j = gs.begin; j < gs.begin + gs.total; j++) {
                        setToNode("children", data, "hsqyl.gdc" + i + ".g" + j + ".yl", $.extend(true, [], getFromNode("children", module, "hsqyl.gdcn.gn.yl")));
                        tree.expire(data);
                        var $table = $(".refresh .gxh_hsqyl_gdc" + i + "_g" + j + "_yl");
                        var trs = $table.find("tbody tr:has(td:not(.dataTables_empty))");
                        drawNode(trs.length, getFromNode("json", data, "hsqyl.gdc" + i + ".g" + j + ".yl"), getFromNode("json", data, "hsqyl.gdc" + i + ".g" +
                            j + ".yl.yln"), "yls", 1);
                        tree.expire(data);
                        setToNode("value", data, "hsqyl.gdc" + i + ".g" + j + ".yl.gs", $($(trs[0]).find("input[name=gs]")).val());
                        for (var k = 0; k < trs.length; k++) {
                            var inputs = $(trs[k]).find("input[name!=gs]");
                            for (var m = 0; m < $(inputs).length; m++) {
                                setToNode("value", data, "hsqyl.gdc" + i + ".g" + j + ".yl.yl" + (k + 1) + "." + $(inputs[m]).attr("name"), $(inputs[m]).val());
                            }
                        }
                    }
                }
            }
            var jhscksrq = $(".refresh .gxh_jdjh tbody").find("input[name='jhscksrq']").val();
            var jhscjsrq = $(".refresh .gxh_jdjh tbody").find("input[name='jhscjsrq']").val();
            setToNode("value", data, "jdjh.jhscksrq", jhscksrq);
            setToNode("value", data, "jdjh.jhscjsrq", jhscjsrq);
            var jhscts = parseInt(Math.abs(new Date(jhscjsrq) - new Date(jhscksrq)) / 1000 / 60 / 60 / 24) + 1;
            setToNode("value", data, "jdjh.jhscts", jhscts);
            var jhcl = $(".refresh .gxh_cljh tbody").find("input[name='jhcl']").val();
            setToNode("value", data, "cljh.jhcl", jhcl);
            setToNode("value", data, "cljh.rjhcl", (jhcl / jhscts).toFixed(2));
            setToNode("value", data, "cj", $("#gxh_cj select[name='sel-cj']").select2().select2('val'));
            data.cj = $("#gxh_cj select[name='sel-cj']").select2().select2('val');
            data["status"] = "未下发";
            if (refreshData.length == 1) {
                $.ajax({
                    url: "../user/saveProductionPlan",
                    method: "POST",
                    data: "form=" + encodeURIComponent(JSON.stringify(data))
                }).success(function (data) {
                    $(".refresh").modal("hide");
                    toastr.success("更新成功");
                    $('.refresh #submit').removeProp("disabled");
                    $('.refresh #cancel').removeProp("disabled");
                    clearTreeContainer();
                    dtTable.ajax.reload();
                }).fail(function () {
                    $('.refresh #submit').removeProp("disabled");
                    $('.refresh #cancel').removeProp("disabled");
                    mesUtil.error
                });
            }
            else {
                data["merge"] = "已合并";
                setToNode("value", data, "cpbh", "");
                var mergeIds = [];
                var mergeCpbhs = [];
                var mergeUpdateIds = [];
                for (var i = 0; i < refreshData.length; i++) {
                    if (refreshData[i].mergeIds) {
                        for (var j = 0; j < refreshData[i].mergeIds.length; j++) {
                            mergeIds.push(refreshData[i].mergeIds[j]);
                        }
                    }
                    else {
                        mergeIds.push(refreshData[i]._id);
                        mergeUpdateIds.push(refreshData[i]._id);
                    }
                    if (refreshData[i].mergeCpbhs) {
                        for (var j = 0; j < refreshData[i].mergeCpbhs.length; j++) {
                            mergeCpbhs.push(refreshData[i].mergeCpbhs[j]);
                        }
                    }
                    else {
                        mergeCpbhs.push(refreshData[i].cpbh);
                    }
                }
                data["cpbh"] = "";
                data["mergeIds"] = mergeIds;
                data["mergeCpbhs"] = mergeCpbhs;
                data["isMerged"] = false;
                delete data._id;
                $.ajax({
                    url: "../user/createProductionPlan",
                    method: "POST",
                    data: "form=" + encodeURIComponent(JSON.stringify(data))
                }).success(function (data) {
                    $.ajax({
                        url: "../user/updateMergedProductionPlan",
                        method: "POST",
                        data: "ids=" + JSON.stringify(mergeUpdateIds)
                    }).success(function (data) {
                        $(".refresh").modal("hide");
                        toastr.success("更新成功");
                        $('.refresh #submit').removeProp("disabled");
                        $('.refresh #cancel').removeProp("disabled");
                        clearTreeContainer();
                        dtTable.ajax.reload();
                    }).fail(function () {
                        $('.refresh #submit').removeProp("disabled");
                        $('.refresh #cancel').removeProp("disabled");
                        mesUtil.error
                    });
                }).fail(function () {
                    $('.refresh #submit').removeProp("disabled");
                    $('.refresh #cancel').removeProp("disabled");
                    mesUtil.error
                });
            }
        });
        $(".refresh").on('click', '.red', function (e) {
            e.preventDefault();
            var table = $(this).parents('table')[0];
            var trs = $(table).find("tbody tr:has(td:not(.dataTables_empty))");
            if (trs.length == 1) {
                bootboxError("至少保留1条数据");
                return;
            }
            var nRow = $(this).parents('tr')[0];
            var dt = $(table).dataTable();
            dt.fnDeleteRow(nRow);
        });
        $(".refresh").on('click', '.add', function (e) {
            e.preventDefault();
            var toolbar = $(this).parents('.table-toolbar')[0];
            var table = $(toolbar).prev().find("table");
            var dtTable = $(table).dataTable();
            var className = $(table).attr("class");
            if (className.indexOf("sxfs_not_gss") > 0 ||
                className.indexOf("jssx") > 0 ||
                className.indexOf("jsgx") > 0 ||
                className.indexOf("bjsx") > 0 ||
                className.indexOf("zxg") > 0 ||
                className.indexOf("zjp") > 0) {
                var names = ["dc", "ds", "djmc", "js", "zmc", "gzlxh"];
                var array = [];
                for (var i = 0; i < names.length; i++) {
                    array.push("<input type='text' class='form-control input-sm' name='" + names[i] + "' value='' />");
                }
                array.push("<button class='btn btn-sm red'>删除</button>");
                dtTable.fnAddData(array);
            }
            if (className.indexOf("gdc") > 0 ||
                className.indexOf("wg") > 0) {
                var array = [];
                array.push("<input type='text' class='form-control input-sm' name='gs' value='" +
                    $($(table).find("tbody tr:first input[name=gs]")).val() + "' disabled />");
                var names = ["dc", "ds", "djmc", "js", "zmc", "gzlxh"];
                for (var i = 0; i < names.length; i++) {
                    array.push("<input type='text' class='form-control input-sm' name='" + names[i] + "' value='' />");
                }
                array.push("<button class='btn btn-sm red'>删除</button>");
                dtTable.fnAddData(array);
            }
            if (className.indexOf("sxfs_gss") > 0) {
                var names = ["djmc", "js", "zmc", "bzfs", "lpxh"];
                var array = [];
                for (var i = 0; i < names.length; i++) {
                    array.push("<input type='text' class='form-control input-sm' name='" + names[i] + "' value='' />");
                }
                array.push("<button class='btn btn-sm red'>删除</button>");
                dtTable.fnAddData(array);
            }
        })
        if ($(".main .verify").length > 0) {
            $(".main .verify").on("click", function (e) {
                bootbox.confirm(
                    {
                        message: "确认编辑完成? 提交审核后就不能再修改了。",
                        callback: function (result) {
                            if (result) {
                                var instId = $('tbody tr.selected', $table).attr("id");
                                var status = "审核中";
                                $.ajax({
                                    url: "../user/formStatus",
                                    method: "POST",
                                    data: $.param({id: instId, status: status})
                                }).done(function (data) {
                                    // update local data and show status change
                                    treeData.status = status;
                                    updateDTRow();
                                    $(".main .verify").addClass("disabled");
                                    toastr.success("提交成功");
                                }).fail(mesUtil.error);
                            }
                        }
                    }
                )
            });
        }
        if ($(".main .scan").length > 0) {
            $(".main .scan").on("click", function (e) {
                var machNo = $(".main input.mach-no").val();
                if (machNo === "") {
                    bootbox.alert("请输入机台号");
                } else {
                    var a = $(".main tbody tr td:nth-child(4)");
                    for (var i = 0; i < a.length; i++) {
                        if (a[i].textContent === machNo) {
                            var $tr = $(a[i]).parent();
                            if (!$tr.hasClass("selected")) $tr.trigger("click");
                            break;
                        }
                    }
                    $(".main input.mach-no").val("");
                }
            });
        }
    }

    //function loadFormInsts() {
    //    dtTable.fnClearTable();
    //    if (formId) {
    //        $.getJSON("../user/formInsts?form_id=" + formId + "&isMerged=false", function (data) {
    //            data.formInsts.forEach(function (d) {
    //                addRecordToList(d);
    //            });
    //            if (data.formInsts.length > 0) {
    //                $.getJSON("../user/form?id=" + data.formInsts[0].tmpl_id, function (tmpl) {
    //                    module = tmpl;
    //                }).fail(mesUtil.error);
    //            }
    //            formPerm = data.formPerm;
    //        }).fail(mesUtil.error);
    //    }
    //}

    function loadModule() {
        $.getJSON("../user/getHsProductionPlanModule", function (tmpl) {
            module = tmpl;
        }).fail(mesUtil.error);
    }

    function initJSTree() {
        var inp = document.createElement('INPUT');
        inp.setAttribute('type', 'text');
        inp.className = "jstree-inp-sm";

        $.jstree.plugins.inp = function (options, parent) {
            this.bind = function () {
                parent.bind.call(this);
                this.element
                    .on("change.jstree", ".jstree-inp-sm", $.proxy(function (e) {
                        var $target = $(e.target);
                        updates.fields.push({id: +$target.parent().attr("id"), value: $target.val()});
                    }, this));
            };
            this.redraw_node = function (obj, deep, callback) {
                obj = parent.redraw_node.call(this, obj, deep, callback);
                if (obj && obj.className.indexOf("jstree-leaf") !== -1) {
                    // TODO: find node by id. this is not so efficient, but haven't found a way to get the value data except from core.data
                    var found = {};
                    findNodeById(treeData.body, obj.id, found);
                    var tmp = inp.cloneNode(true);
                    tmp.value = found.node.value || "";
                    tmp.setAttribute("disabled", "disabled");
                    obj.insertBefore(tmp, obj.childNodes[1].nextSibling);
                }
                return obj;
            };
        };
    }

    function initDatatable() {
        dtTable = $table.DataTable({
            ajax: {
                url: "../user/getHsProductionPlans",
                type: "GET"
            },
            serverSide: 'true',
            paging: true,
            "columns": [
                {
                    "data": function (data, type, full, meta) {
                        return "<input type='checkbox'/>";
                    }
                },
                {"data": "cpbh"},
                {"data": "sfdz"},
                {"data": "lb"},
                {"data": "jg/gg"},
                {"data": "zj"},
                {"data": "nx"},
                {"data": "qd"},
                {"data": "tyfs"},
                {"data": "nj"},
                {"data": "bmzt"},
                {"data": "tsyq"},
                {"data": "yt"},
                {"data": "jhrq"},
                {"data": "cj"},
                {"data": "merge"},
                {"data": "status"}
            ],
            columnDefs: [
                {
                    "targets": "_all",
                    "data": null, // Use the full data source object for the renderer's source
                    "render": function (data, type, full, meta) {
                        return data || "";
                    }
                }
            ],
            "createdRow": function (row, data, index) {
                mesUtil.formInsts[data._id] = data;
                $(row).attr("merge", data.merge);
                $(row).attr("status", data.status);
            },
            "language": {
                "processing": "努力加载数据中.",
                "lengthMenu": "_MENU_ 条记录每页",
                "search": "查询",
                "zeroRecords": "没有找到记录",
                "info": "第 _PAGE_ 页 ( 总共 _PAGES_ 页 )",
                "infoEmpty": "无记录",
                "infoFiltered": "(从 _MAX_ 条记录过滤)",
                "paginate": {
                    "previous": "上一页",
                    "next": "下一页"
                }
            }
        });
        gxqGdcpDtTable = $gxqGdcpTable.dataTable(datatableOption);
        gxhGdcpDtTable = $gxhGdcpTable.dataTable(datatableOption);
        gxhHsqylXwxGgDtTable = $gxhHsqylXwxGgTable.dataTable(datatableOption);
        gxhHsqylXwxYlDtTable = $gxhHsqylXwxYlTable.dataTable(datatableOption);
        gxhHsqylYzGgDtTable = $gxhHsqylYzGgTable.dataTable(datatableOption);
        gxhHsqylYzYlDtTable = $gxhHsqylYzYlTable.dataTable(datatableOption);
        gxhHsqylJssxGgDtTable = $gxhHsqylJssxGgTable.dataTable(datatableOption);
        gxhHsqylJssxYlDtTable = $gxhHsqylJssxYlTable.dataTable(datatableOption);
        gxhHsqylJsgxGgDtTable = $gxhHsqylJsgxGgTable.dataTable(datatableOption);
        gxhHsqylJsgxYlDtTable = $gxhHsqylJsgxYlTable.dataTable(datatableOption);
        gxhHsqylBjsxGgDtTable = $gxhHsqylBjsxGgTable.dataTable(datatableOption);
        gxhHsqylBjsxYlDtTable = $gxhHsqylBjsxYlTable.dataTable(datatableOption);
        gxhHsqylZxgGgDtTable = $gxhHsqylZxgGgTable.dataTable(datatableOption);
        gxhHsqylZxgYlDtTable = $gxhHsqylZxgYlTable.dataTable(datatableOption);
        gxhHsqylWgGgDtTable = $gxhHsqylWgGgTable.dataTable(datatableOption);
        gxhHsqylWgYlDtTable = $gxhHsqylWgYlTable.dataTable(datatableOption);
        gxhHsqylZjpGgDtTable = $gxhHsqylZjpGgTable.dataTable(datatableOption);
        gxhHsqylZjpYlDtTable = $gxhHsqylZjpYlTable.dataTable(datatableOption);
        $('tbody', $table).on('click', 'tr', function (e) {
            var $this = $(this);
            if (e.target.nodeName == "INPUT") return;
            if ($this.hasClass('selected')) {
                $this.removeClass('selected');
                clearTreeContainer();
            } else {
                $(".main tr.selected").removeClass("selected");
                $this.addClass('selected');
                treeData = mesUtil.formInsts[$this.attr("id")];
                //layout();
                showTree(treeData);
            }
        });
    }

    //function layout() {
    //    var header = {
    //        enabled: [],    // enabled inputs
    //        populate: []    // populated inputs
    //    };
    //    var options = {header: header};
    //    walkTree(treeData.body, treeData.body, 1);
    //    showTree(options);
    //}

    function findNodeById(node, id, foundNode) {
        if (node instanceof Array) {
            for (var i = 0; i < node.length; i++) {
                findNodeById(node[i], id, foundNode);
            }
        } else {
            if (node.id === id) {
                foundNode.node = node;
            } else {
                if (node.children && node.children.length > 0) {
                    findNodeById(node.children, id, foundNode);
                }
            }
        }
    }

    // walk through the tree and add layers
    function walkTree(node, parent, layers) {
        if (node instanceof Array) {
            for (var i = 0; i < node.length; i++) {
                walkTree(node[i], node, layers);
            }
        } else {
            if (node.repeat && node.repeat === "n") {
                node.repeat = layers;
                node.value = 1;
                for (var j = 2; j <= layers; j++) {
                    parent.push(addLayer(node, j));
                }
            }
            node.id = "" + idCounter++;
            if (node.sub_form) updates.idForm.push({startId: +node.id, instId: node._id});
            if (node.children && node.children.length > 0) {
                walkTree(node.children, node, layers);
            }
        }
    }

    function addLayer(obj, layer) {
        var target = {};
        for (var i in obj) {
            if (obj.hasOwnProperty(i) && i !== "repeat") {
                if (i === "text") {
                    target[i] = obj[i].replace("1", layer);
                } else if (obj[i] instanceof Array) {
                    target[i] = $.extend(true, [], obj[i]);
                } else {
                    target[i] = obj[i];
                }
            }
        }
        target.value = layer;
        return target;
    }

    function treeOnChangeHandler() {
        $("input", $treeHeader).on("change", function (e) {
            for (var i = 0; i < treeData.header.length; i++) {
                if (treeData.header[i].name === this.name) {
                    treeData.header[i].value = this.value;
                    break;
                }
            }
        });
    }

    var formHandlers = {
        createForm: function () {
            //$treeHeader.append("<div class='portlet-actions pull-right'><button class='cancel btn btn-default' type='button'>取消</button>" +
            //    "<button class='save btn btn-primary' type='button'>保存</button></div>");
            $treeHeader.append("<div class='portlet-actions pull-right'><button class='cancel btn btn-default' type='button'>取消</button>" + "</div>");
            treeOnChangeHandler();
            //$(".save", $treeBody).on("click", function (e) {
            //    treeData.status = "编辑中";
            //    treeData.tmpl_id = formId;
            //    delete treeData.readonly;
            //    $.ajax({
            //        url: "../user/formInst",
            //        method: "POST",
            //        contentType: "application/json; charset=utf-8",
            //        dataType: "json",
            //        data: JSON.stringify({form: treeData})
            //    }).done(function (data, status, jqXHR) {
            //        treeData._id = data.id;
            //        addRecordToList(treeData);
            //        clearTreeContainer();
            //        toastr.success("添加成功");
            //    }).fail(mesUtil.error);
            //});
        },
        modifyForm: function () {
            //$treeHeader.append(
            //    //"<div class='portlet-actions pull-left'><button class='delete btn btn-default btn-danger' type='button'>删除</button></div>" +
            //    "<div class='portlet-actions pull-right'><button class='cancel btn btn-default' type='button'>取消</button>" +
            //    "<button class='edit btn btn-primary' type='button'>保存</button></div>");
            $treeHeader.append("<div class='portlet-actions pull-right'><button class='cancel btn btn-default' type='button'>取消</button>" + "</div>")
            treeOnChangeHandler();
            $(".delete", $treeBody).on("click", function (e) {
                bootbox.confirm({
                    message: "确定要删除吗?",
                    callback: function (result) {
                        if (result) {
                            $.ajax({
                                url: "../user/formInst",
                                method: "DELETE",
                                data: $.param({id: treeData._id})
                            }).done(function (data, status, jqXHR) {
                                clearTreeContainer();
                                dtTable.row($('tbody tr.selected', $table)).remove().draw();
                                toastr.success("删除成功");
                            }).fail(mesUtil.error);
                        }
                    }
                });
            });

            function getInstId(nodeId) {
                for (var i = 0; i < updates.idForm.length; i++) {
                    if (i + 1 === updates.idForm.length ||
                        (updates.idForm[i].startId < nodeId && updates.idForm[i + 1].startId > nodeId)) {
                        return updates.idForm[i].instId;
                    }
                }
            }

            function setPathById(node, updates, path) {
                if (node instanceof Array) {
                    for (var i = 0; i < node.length; i++) {
                        setPathById(node[i], updates, path);
                    }
                } else if (node.children instanceof Array) {
                    path.push(node.name);
                    for (var i = 0; i < node.children.length; i++) {
                        setPathById(node.children[i], updates, path);
                    }
                    path.pop();
                } else {
                    for (var i = 0; i < updates.length; i++) {
                        if (updates[i].id === +node.id) {
                            updates[i].name = path.length === 0 ? node.name : path.join(".") + '.' + node.name;
                            break;
                        }
                    }
                }
            }
        },
        auditForm: function () {
            $treeHeader.append("<div class='portlet-actions pull-left'><button class='reject btn btn-default btn-danger' type='button'>未通过</button></div>" +
                "<div class='portlet-actions pull-right'><button class='cancel btn btn-default' type='button'>取消</button>" +
                "<button class='pass btn btn-primary' type='button'>通过</button></div>");

            $(".main .pass").on("click", function (e) {
                bootbox.confirm({
                    message: "确认审核通过? ",
                    callback: function (result) {
                        reviewHandler(result, "审核通过");
                    }
                })
            });

            $(".reject", $treeBody).on("click", function (e) {
                bootbox.confirm({
                    message: "确认审核未通过? ",
                    callback: function (result) {
                        reviewHandler(result, "审核未通过");
                    }
                });
            });

            function reviewHandler(result, status) {
                if (result) {
                    $.ajax({
                        url: "../user/formStatus",
                        method: "POST",
                        data: $.param({
                            id: treeData._id,
                            status: status,
                            auditor: $(".username").text(),
                            auditDate: moment().format("L")
                        })
                    }).done(function (data) {
                        // update local data and show status change
                        treeData.status = status;
                        updateDTRow();
                        toastr.success(status);
                    }).fail(mesUtil.error);
                }
            }
        },
        assignWorker: function () {
            $treeActions.empty();
            $treeActions.removeClass("hidden");
            $treeActions.append(
                "<div class='well'><label class='col-md-2'>操作工: </label><div class='col-md-6'>" +
                "<select id='worker-select' class='form-control'>< disabled></></select></div>" +
                "<button id='assign-btn' class='btn btn-primary'>分配</button><div class='clearfix'></div>");

            var $workers = $("#worker-select");
            mesUtil.workers.forEach(function (worker) {
                $workers.append("< id='" + worker._id + "' name='worker'>" + worker.last_name + worker.first_name + "</option>");
            });

            $("#assign-btn").on("click", function (e) {
                var $sel = $("#worker-select option:selected");
                var data = {
                    formInst_id: treeData._id,
                    worker_id: $sel.attr("id"),
                    worker_name: $sel.val()
                };
                $.ajax({
                    url: "../user/assign",
                    method: "POST",
                    data: $.param(data)
                }).done(function (data) {
                    toastr.success("分配成功");
                    $("#worker-select").val("");
                    clearTreeContainer();
                    dtTable.ajax.reload();
                }).fail(mesUtil.error);
            });
        }
    };

    function showTree(tree) {
        //var header = options.header;
        //$(".caption-subject").text(treeData.name);
        //var html = "", htmlRow;
        //if (treeData.header) {
        //    treeData.header.forEach(function (h, i) {
        //        htmlRow = "";
        //        if (i % 3 === 0) htmlRow += "<div class='row'>";
        //        // populate header values
        //        for (var j = 0; j < header.populate.length; j++) {
        //            if (header.populate[j].name === h.name) {
        //                h.value = header.populate[j].value;
        //                break;
        //            }
        //        }
        //        htmlRow +=
        //            "<div class='form-group col-md-4'><label>" + h.text + "</label><input type='text' class='form-control input-sm' disabled name='"
        //            + h.name + "' value='" + (h.value || "") + "'></div>";
        //        if (i % 3 === 2) htmlRow += "</div>";
        //        html += htmlRow;
        //    });
        //    $treeHeader.html(html);
        //    header.enabled.forEach(function (h) {
        //        $("input[name='" + h + "']", $treeHeader).prop("disabled", false);
        //    });
        //}
        //$treeBody.empty();
        //$treeBody.append("<div id='tree' class='col-md-12 param-tree'></div>");
        //var root = {text: treeData.name, type: "folder", state: {opened: true}, children: treeData.body};
        //mesUtil.tree.create("tree", $treeBody, root);
        //if (!treeData.noPermission) {
        //    formHandlers.modifyForm();
        //}
        //$(".cancel", $treeHeader).on("click", function (e) {
        //    clearTreeContainer();
        //    $('tbody tr.selected').removeClass("selected");
        //});
        walkTree(tree.body, tree.body, 1);
        $(".caption-subject").text(tree.name);
        $('.expand').removeClass('hidden');
        $('.compress').removeClass('hidden');
        $treeBody.empty();
        $treeBody.append("<div id='tree' class='col-md-12 param-tree'></div>");
        var root = {text: tree.name, type: "folder", state: {opened: true}, children: tree.body};
        mesUtil.tree.create("tree", $treeBody, root);
        $treeHeader.removeClass('hidden');
        $('input', $treeHeader).each(function (idx) {
            for (var i = 0, len = tree.header.length; i < len; i++) {
                if (tree.header[i].name === this.getAttribute('name')) {
                    this.value = tree.header[i].value || '';
                }
            }
        });
    }

    function clearTreeContainer() {
        //$(".main .caption-helper").html("");
        //$treeBody.empty();
        //$treeHeader.empty();
        //$treeActions.addClass("hidden");
        //if (!$(".main .verify").hasClass("disabled")) $(".main .verify").addClass("disabled");
        //if (!$action.hasClass("hidden")) $action.addClass("hidden");
        $('.expand').addClass('hidden');
        $('.compress').addClass('hidden');
        $(".caption-helper").html("");
        $treeBody.empty();
        $treeHeader.addClass('hidden');
    }

    function updateDTRow() {
        clearTreeContainer();
        var $row = $('tbody tr.selected', $table);
        var d = dtTable.row($row).data();
        for (var i = 1; i < d.length - 1; i++) {
            d[i] = treeData.body[0].children[i - 1].value || "";
        }
        d[i] = treeData.status;
        dtTable.row($row).data(d).draw();
        $row.removeClass("selected");
    }

    //function addRecordToList(data) {
    //    mesUtil.formInsts[data._id] = data;
    //    var rowValues = [data.submit ? "" : "<input type='checkbox'/>"];
    //    // 产品编号
    //    rowValues.push(getFromNode("value", data, "cpbh") || "");
    //    // 是否定制
    //    rowValues.push(getFromNode("value", data, "sfdz") || "");
    //    // 工段产品，类别,结构，直径，捻向，强度，涂油方式，捻距,表面状态,特殊要求，用途
    //    var array = ["lb", getFromNode("value", data, "hsh.gdcp.lb") == "钢丝绳" ? "gg" : "jg", "zj", "nx", "qd", "tyfs", "nj", "bmzt", "tsyq", "yt"];
    //    for (var i = 0; i < array.length; i++) {
    //        rowValues.push(getFromNode("value", data, "hsh.gdcp." + array[i]) || "");
    //    }
    //    rowValues.push(data["jhrq"] || "");
    //    rowValues.push(data.merge ? "是" : "否");
    //    rowValues.push(data.submit ? "是" : "否");
    //    var t = dtTable.fnAddData(rowValues);
    //    $(dtTable.fnSettings().aoData[t].nTr).attr("id", data._id);
    //    $(dtTable.fnSettings().aoData[t].nTr).attr("merge", data.merge);
    //}

    function showActionRight() {
        if (treeData.status === "审核通过") {
            initHandler();
        } else if (treeData.status === "调产中") {
            prepHandler();
        } else if (treeData.status === "执行中") {
            startHandler();
        } else if (treeData.status === "完工") {
            startHandler(true);
        }

        function initHandler() {
            setActions(
                "<div class='col-md-12'><button id='prep-btn' class='btn btn-primary center-block full-button'>开始调产</button></div><div class='clearfix' />",
                [{
                    buttonId: "#prep-btn",
                    handler: function (data) {
                        updateStatus("调产中", function (data) {
                            prepHandler();
                        });
                    }
                }]
            );
        }

        function prepHandler() {
            setActions(
                "<div class='col-md-12'><button id='start-btn' class='btn btn-primary center-block full-button'>调产结束，开始生产</button></div>" +
                "<div class='clearfix' />",
                [{
                    buttonId: "#start-btn",
                    handler: function (data) {
                        prompt("请扫描上线工字轮:", function (result) {
                            if (result) {
                                updateStatus("执行中", function (data) {
                                    startHandler();
                                })
                            }
                        })
                    }
                }]
            )
        }

        function startHandler(done) {
            setActions(
                "<div class='col-md-3'><button id='import-btn' class='btn btn-primary center-block'>上线</button></div>" +
                "<div class='col-md-3'><button id='export-btn' class='btn btn-primary center-block'>收线</button></div>" +
                "<div class='col-md-3'><button id='pause-btn' class='btn btn-primary' center-block>暂停</button></div>" +
                "<div class='col-md-3'><button id='finish-btn' class='btn btn-primary' center-block>完工</button></div><div class='clearfix' />",
                [
                    {buttonId: "#import-btn", handler: importHandler},
                    {buttonId: "#export-btn", handler: exportHandler},
                    {buttonId: "#pause-btn", handler: pauseHandler},
                    {buttonId: "#finish-btn", handler: finishHandler}
                ]
            );
            if (done) $(".action-right button").prop("disabled", true);
        }

        function importHandler(data) {
            prompt("请扫描上线工字轮:", function (result) {
                console.log("上线");    // TODO: save
            });
        }

        function exportHandler(data) {
            prompt("请扫描收线工字轮:", function (result) {
                console.log("收线");    // TODO: save
            });
        }

        function pauseHandler(data) {
            updateStatus("暂停中", function (data) {
                var startTime = new Date().getTime();
                bootbox.dialog({
                    title: "输入暂停原因:",
                    closeButton: false,
                    message: '<form class="bootbox-form"><input type="text" autocomplete="off" class="bootbox-input bootbox-input-text form-control"></form>',
                    buttons: {
                        confirm: {
                            label: "继续",
                            className: "btn-primary",
                            callback: function (result) {
                                var stopTime = new Date().getTime();
                                updateStatus("执行中", function (data) {
                                    console.log("pause resumed");
                                })
                            }
                        }
                    }
                });
            });
        }

        function finishHandler(data) {
            bootbox.dialog({
                title: "输入实际产量:",
                message: "<div class='row'><div class='col-md-12'><form class='form-horizontal'>" +
                "<div class='form-group'><label class='col-md-3 control-label'>件数</label>" +
                "<div class='col-md-7'><input name='import' class='form-control' type='text'></div></div>" +
                "<div class='form-group'><label class='col-md-3 control-label'>米长</label>" +
                "<div class='col-md-7'><input name='export' class='form-control' type='text'></div></div>" +
                "</form></div></div>",
                buttons: {
                    cancel: {
                        label: "取消",
                        className: "btn-default"
                    },
                    success: {
                        label: "确定",
                        className: "btn-primary",
                        callback: function (e) {
                            updateStatus("完工", function (data) {
                                $(".action-right button").prop("disabled", true);
                            });
                        }
                    }
                }
            })
        }

        function prompt(title, cb) {
            bootbox.prompt({
                title: title,
                buttons: {
                    cancel: {
                        label: "取消",
                        className: "btn-default"
                    },
                    confirm: {
                        label: "确认",
                        className: "btn-primary"
                    }
                },
                callback: cb
            });
        }
    }

    function setActions(buttonHtml, buttons) {
        if ($action.hasClass("hidden")) $action.removeClass("hidden");
        $action.empty();
        $action.append(buttonHtml);
        buttons.forEach(function (b) {
            $(b.buttonId).on("click", b.handler);
        })
    }

    function updateStatus(status, cb) {
        $.ajax({
            url: "../user/formStatus",
            method: "POST",
            data: $.param({id: treeData._id, status: status})
        }).done(function (data) {
            treeData.status = status;
            $(".main tbody tr.selected td:last-child").text(status);
            $(".main .caption-helper").text(status);
            cb(data);
        }).fail(mesUtil.error);
    }

});