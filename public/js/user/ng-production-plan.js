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
    var gxqSxfsDtTable, $gxqSxfsTable = $(".refresh #gxq_sxfs table.gxq_sxfs");
    var gxhGdcpDtTable, $gxhGdcpTable = $(".refresh #gxh_gdcp table.gxh_gdcp");
    var gxhSxfsDtTable, $gxhSxfsTable = $(".refresh #gxh_sxfs table.gxh_sxfs");
    var gxhNgqylXwxGgDtTable, $gxhNgqylXwxGgTable = $(".refresh #gxh_ngqyl_xwx_gg table.gxh_ngqyl_xwx_gg");
    var gxhNgqylXwxYlDtTable, $gxhNgqylXwxYlTable = $(".refresh #gxh_ngqyl_xwx_yl  table.gxh_ngqyl_xwx_yl");
    var gxhNgqylYzGgDtTable, $gxhNgqylYzGgTable = $(".refresh #gxh_ngqyl_yz_gg  table.gxh_ngqyl_yz_gg");
    var gxhNgqylYzYlDtTable, $gxhNgqylYzYlTable = $(".refresh #gxh_ngqyl_yz_yl  table.gxh_ngqyl_yz_yl");
    var gxhNgqylZxsGgDtTable, $gxhNgqylZxsGgTable = $(".refresh #gxh_ngqyl_zxs_gg  table.gxh_ngqyl_zxs_gg");
    var gxhNgqylZxsYlDtTable, $gxhNgqylZxsYlTable = $(".refresh #gxh_ngqyl_zxs_yl  table.gxh_ngqyl_zxs_yl");
    var gxhNgqylZjpGgDtTable, $gxhNgqylZjpGgTable = $(".refresh #gxh_ngqyl_zjp_gg  table.gxh_ngqyl_zjp_gg");
    var gxhNgqylZjpYlDtTable, $gxhNgqylZjpYlTable = $(".refresh #gxh_ngqyl_zjp_yl  table.gxh_ngqyl_zjp_yl");

    var xwxExist, yzExist, zxsExist, wgsExist, sExist, sdcExist, zjpExist, zjpText, module;

    // 段长，段数,单件米长,件数，总米长,根数，单件损耗，直径，工艺米长系数，吨耗，重量，含油率，参考总重量
    var numberParams = ["dc", "ds", "djmc", "js", "zmc", "gs", "zj", "gymcxs", "dh", "zl", "hyl", "ckzzl", "jhscts", "jhcl", "rjhcl"];

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
            $(".refresh .gxh_ngqyl_xwx").hide();
            $(".refresh .gxh_ngqyl_yz").hide();
            $(".refresh .gxh_ngqyl_zxs").hide();
            $(".refresh .gxh_ngqyl_zjp").hide();
            $(".refresh .gxh_ngqyl_wgs").hide();
            $(".refresh .gxh_ngqyl_sdc").remove();
            $(".refresh .gxh_ngqyl_s").remove();
            $(".refresh .gxh_ngqyl_wgs_s").remove();
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
            gxqSxfsDtTable.fnClearTable();
            gxhGdcpDtTable.fnClearTable();
            gxhSxfsDtTable.fnClearTable();
            gxhNgqylXwxGgDtTable.fnClearTable();
            gxhNgqylXwxYlDtTable.fnClearTable();
            gxhNgqylYzGgDtTable.fnClearTable();
            gxhNgqylYzYlDtTable.fnClearTable();
            gxhNgqylZxsGgDtTable.fnClearTable();
            gxhNgqylZxsYlDtTable.fnClearTable();
            gxhNgqylZjpGgDtTable.fnClearTable();
            gxhNgqylZjpYlDtTable.fnClearTable();
            $(".refresh #gxh_jdjh  table.gxh_jdjh input").val("");
            $(".refresh #gxh_cljh  table.gxh_cljh input").val("")
            var ids = [];
            trs.each(function (i, tr) {
                ids.push($(tr).attr("id"));
            });
            $.getJSON("../user/formInstsByIds?ids=" + JSON.stringify(ids), function (data) {
                cache = {};
                xwxExist = checkNodeExist(data[0], "ngqyl.xwx");
                yzExist = checkNodeExist(data[0], "ngqyl.yz");
                zxsExist = checkNodeExist(data[0], "ngqyl.zxs");
                wgsExist = checkNodeExist(data[0], "ngqyl.wgs");
                sdcExist = getFromNode("scs", data[0], "ngqyl") ? true : false;
                sExist = getFromNode("ss", data[0], "ngqyl") ? true : false;
                zjpExist = checkNodeExist(data[0], "ngqyl.zjp");
                if (zjpExist) zjpText = getFromNode("text", data[0], "ngqyl.zjp");
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
                            {"name": "jg", "text": "结构"},
                            {"name": "zj", "text": "直径"},
                            {"name": "nx", "text": "捻向"},
                            {"name": "qd", "text": "强度"},
                            {"name": "tyfs", "text": "涂油方式"},
                            {"name": "nj", "text": "捻距"},
                            {"name": "bmzt", "text": "表面状态"},
                            {"name": "yt", "text": "用途"}
                        ];
                        for (var j = 0; j < array.length; j++) {
                            // 当两个值不相等时无法合并
                            if (getFromNode("value", data[i - 1], "ngh.gdcp." + array[j].name) != getFromNode("value", data[i], "ngh.gdcp." + array[j].name)) {
                                $(".refresh .modal-body .error").html("<p>对不起,不满足合并生产条件。<br/>原因:捻股后-工段产品-" +
                                    array[j].text + "不同</p>");
                                $(".refresh .modal-body").show();
                                $(".refresh .modal-body .error").show();
                                return;
                            }
                        }
                    }
                    for (var i = 1; i < data.length; i++) {
                        if (checkNodeExist(data[i], "ngqyl.xwx") != xwxExist) {
                            $(".refresh .modal-body .error").html("<p>对不起,不满足合并生产条件。<br/>原因:捻股前用料,有的存在纤维芯，有的不存在纤维芯</p>");
                            $(".refresh .modal-body").show();
                            $(".refresh .modal-body .error").show();
                            return;
                        }
                    }
                    for (var i = 1; i < data.length; i++) {
                        if (checkNodeExist(data[i], "ngqyl.yz") != yzExist) {
                            $(".refresh .modal-body .error").html("<p>对不起,不满足合并生产条件。<br/>原因:捻股前用料,有的存在油脂，有的不存在油脂</p>");
                            $(".refresh .modal-body").show();
                            $(".refresh .modal-body .error").show();
                            return;
                        }
                    }
                    for (var i = 1; i < data.length; i++) {
                        if (checkNodeExist(data[i], "ngqyl.zxs") != zxsExist) {
                            $(".refresh .modal-body .error").html("<p>对不起,不满足合并生产条件。<br/>原因:捻股前用料,有的存在中心丝，有的不存在中心丝</p>");
                            $(".refresh .modal-body").show();
                            $(".refresh .modal-body .error").show();
                            return;
                        }
                    }
                    for (var i = 1; i < data.length; i++) {
                        if (checkNodeExist(data[i], "ngqyl.zjp") != zjpExist) {
                            $(".refresh .modal-body .error").html("<p>对不起,不满足合并生产条件。<br/>原因:捻股前用料,有的存在" +
                                zjpText + "，有的不存在" + zjpText + "</p>");
                            $(".refresh .modal-body").show();
                            $(".refresh .modal-body .error").show();
                            return;
                        }
                    }
                    if (wgsExist) {
                        var ss = getFromNode("ss", data[0], "ngqyl.wgs");
                        for (var i = 1; i < data.length; i++) {
                            if (getFromNode("ss", data[i], "ngqyl.wgs").total != ss.total) {
                                $(".refresh .modal-body .error").html("<p>对不起,不满足合并生产条件。<br/>原因:捻股前用料-外钢丝的丝数不同</p>");
                                $(".refresh .modal-body").show();
                                $(".refresh .modal-body .error").show();
                                return;
                            }
                        }
                    }
                    if (sdcExist) {
                        var scs = getFromNode("scs", data[0], "ngqyl");
                        for (var i = 1; i < data.length; i++) {
                            if (getFromNode("scs", data[i], "ngqyl").total != scs.total ||
                                getFromNode("scs", data[i], "ngqyl").begin != scs.begin) {
                                $(".refresh .modal-body .error").html("<p>对不起,不满足合并生产条件。<br/>原因:捻股前用料,丝层不同</p>");
                                $(".refresh .modal-body").show();
                                $(".refresh .modal-body .error").show();
                                return;
                            }
                        }
                        for (var i = scs.begin; i < scs.begin + scs.total; i++) {
                            var ss = getFromNode("ss", data[0], "ngqyl.sdc" + i);
                            for (var j = 1; j < data.length; j++) {
                                if (getFromNode("ss", data[j], "ngqyl.sdc" + i).total != ss.total) {
                                    $(".refresh .modal-body .error").html("<p>对不起,不满足合并生产条件。<br/>原因:捻股前用料-第" +
                                        i + "层丝的丝数不同</p>");
                                    $(".refresh .modal-body").show();
                                    $(".refresh .modal-body .error").show();
                                    return;
                                }
                            }
                        }
                    }
                    if (sExist) {
                        var ss = getFromNode("ss", data[0], "ngqyl");
                        for (var j = 1; j < data.length; j++) {
                            if (getFromNode("ss", data[j], "ngqyl").total != ss.total) {
                                $(".refresh .modal-body .error").html("<p>对不起,不满足合并生产条件。<br/>原因:捻股前丝数不同</p>");
                                $(".refresh .modal-body").show();
                                $(".refresh .modal-body .error").show();
                                return;
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
                                if (getFromNode("value", data[i - 1], "ngqyl.xwx." + array[j].name) != getFromNode("value", data[i], "ngqyl.xwx." + array[j].name)) {
                                    $(".refresh .modal-body .error").html("<p>对不起,不满足合并生产条件。<br/>原因:捻股前用料-纤维芯-" + array[j].text + "不同</p>");
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
                                if (getFromNode("value", data[i - 1], "ngqyl.yz." + array[j].name) != getFromNode("value", data[i], "ngqyl.yz." + array[j].name)) {
                                    $(".refresh .modal-body .error").html("<p>对不起,不满足合并生产条件。<br/>原因:捻股前用料-油脂-" + array[j].text + "不同</p>");
                                    $(".refresh .modal-body").show();
                                    $(".refresh .modal-body .error").show();
                                    return;
                                }
                            }
                        }
                    }
                    if (zxsExist) {
                        for (var i = 1; i < data.length; i++) {
                            var array = [
                                {"name": "gg.lb", "text": "规格-类别"},
                                {"name": "gg.zj", "text": "规格-直径"},
                                {"name": "gg.qd", "text": "规格-强度"}
                            ];
                            for (var j = 0; j < array.length; j++) {
                                if (getFromNode("value", data[i - 1], "ngqyl.zxs." + array[j].name) != getFromNode("value", data[i], "ngqyl.zxs." + array[j].name)) {
                                    $(".refresh .modal-body .error").html("<p>对不起,不满足合并生产条件。<br/>原因:捻股前用料-中心丝-" + array[j].text + "不同</p>");
                                    $(".refresh .modal-body").show();
                                    $(".refresh .modal-body .error").show();
                                    return;
                                }
                            }
                        }
                    }
                    if (wgsExist) {
                        var array = [
                            {"name": "gg.lb", "text": "规格-类别"},
                            {"name": "gg.zj", "text": "规格-直径"},
                            {"name": "gg.qd", "text": "规格-强度"},
                            {"name": "yl.gs", "text": "用量-根数"}
                        ];
                        var ss = getFromNode("ss", data[0], "ngqyl.wgs");
                        for (var i = 1; i < data.length; i++) {
                            for (var j = ss.begin; j < ss.begin + j.total; j++) {
                                for (var k = 0; k < array.length; k++) {
                                    if (getFromNode("value", data[i - 1], "ngqyl.wgs.s" + j + "." + array[k].name) != getFromNode("value", data[i], "ngqyl.wgs.s" + j + "." + array[k].name)) {
                                        $(".refresh .modal-body .error").html("<p>对不起,不满足合并生产条件。<br/>原因:捻股前用料-外钢丝-丝" + j + "-" + array[k].text + "不同</p>");
                                        $(".refresh .modal-body").show();
                                        $(".refresh .modal-body .error").show();
                                        return;
                                    }
                                }
                            }
                        }
                    }
                    if (sdcExist) {
                        var scs = getFromNode("scs", data[0], "ngqyl");
                        var array = [
                            {"name": "gg.lb", "text": "规格-类别"},
                            {"name": "gg.zj", "text": "规格-直径"},
                            {"name": "gg.qd", "text": "规格-强度"},
                            {"name": "yl.gs", "text": "用量-根数"}
                        ];
                        for (var i = 1; i < data.length; i++) {
                            for (var j = scs.begin; j < scs.begin + scs.total; j++) {
                                var ss = getFromNode("ss", data[0], "ngqyl.sdc" + j);
                                for (var k = ss.begin; k < ss.begin + ss.total; k++) {
                                    for (var l = 0; l < array.length; l++) {
                                        if (getFromNode("value", data[i - 1], "ngqyl.sdc" + j + ".s" + k + "." + array[l].name) != getFromNode("value", data[i], "ngqyl.sdc" + j + ".s" + k + "." + array[l].name)) {
                                            $(".refresh .modal-body .error").html("<p>对不起,不满足合并生产条件。<br/>原因:捻股前用料-第" + j + "层丝-丝" + k + "-" + array[l].text + "不同</p>");
                                            $(".refresh .modal-body").show();
                                            $(".refresh .modal-body .error").show();
                                            return;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (sExist) {
                        var ss = getFromNode("ss", data[0], "ngqyl");
                        var array = [
                            {"name": "gg.lb", "text": "规格-类别"},
                            {"name": "gg.zj", "text": "规格-直径"},
                            {"name": "gg.qd", "text": "规格-强度"},
                            {"name": "yl.gs", "text": "用量-根数"}
                        ];
                        for (var i = 1; i < data.length; i++) {
                            for (var j = ss.begin; j < ss.begin + ss.total; j++) {
                                for (var k = 0; k < array.length; k++) {
                                    if (getFromNode("value", data[i - 1], "ngqyl.s" + j + "." + array[k].name) != getFromNode("value", data[i], "ngqyl.s" + j + "." + array[k].name)) {
                                        $(".refresh .modal-body .error").html("<p>对不起,不满足合并生产条件。<br/>原因:捻股前用料-丝" + j + "-" + array[k].text + "不同</p>");
                                        $(".refresh .modal-body").show();
                                        $(".refresh .modal-body .error").show();
                                        return;
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
                                {"name": "gg.bmzt", "text": "规格-表面状态"},
                            ];
                            for (var j = 0; j < array.length; j++) {
                                if (getFromNode("value", data[i - 1], "ngqyl.zjp." + array[j].name) !=
                                    getFromNode("value", data[i], "ngqyl.zjp." + array[j].name)) {
                                    $(".refresh .modal-body .error").html("<p>对不起,不满足合并生产条件。<br/>原因:捻股前用料-" +
                                        zjpText + "-" + array[j].text + "不同</p>");
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
                var gxqRowValues = [];
                var gxhRowValues = [];
                var array = ["lb", "jg", "zj", "nx", "qd", "tyfs", "nj", "bmzt", "tsyq", "yt"];
                for (var i = 0; i < array.length; i++) {
                    gxqRowValues.push(getFromNode("value", data[0], "ngh.gdcp." + array[i]) || "");
                    if (array[i] == "tsyq") {
                        gxhRowValues.push("<input type='text' class='form-control input-sm' name='" + array[i] + "' value='" +
                            (data.length == 1 ? (getFromNode("value", data[0], "ngh.gdcp." + array[i]) || "") : "") + "' />");
                    }
                    else {
                        gxhRowValues.push(getFromNode("value", data[0], "ngh.gdcp." + array[i]) || "");
                    }
                }
                gxqGdcpDtTable.fnAddData(gxqRowValues);
                gxhGdcpDtTable.fnAddData(gxhRowValues);
                var names = ["dc", "ds", "djmc", "js", "zmc", "gzlxh"];
                for (var i = 0; i < data.length; i++) {
                    var sxfss = getFromNode("sxfss", data[i], "ngh.sxfs");
                    for (var j = sxfss.begin; j < sxfss.begin + sxfss.total; j++) {
                        var rowValues = [];
                        for (var k = 0; k < names.length; k++) {
                            rowValues.push(getFromNode("value", data[i], "ngh.sxfs.sxfs" + j + "." + names[k]));
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
                if (zxsExist) {
                    var rowValues = [];
                    var names = ["lb", "zj", "qd"];
                    for (var i = 0; i < names.length; i++) {
                        rowValues.push(getFromNode("value", data[0], "ngqyl.zxs.gg." + names[i]) || "");
                    }
                    gxhNgqylZxsGgDtTable.fnAddData(rowValues);
                    for (var i = 0; i < data.length; i++) {
                        var yls = getFromNode("yls", data[i], "ngqyl.zxs.yl");
                        for (var j = yls.begin; j < yls.begin + yls.total; j++) {
                            var rowValues = [];
                            var names = ["dc", "ds", "djmc", "js", "zmc", "gzlxh"];
                            for (var k = 0; k < names.length; k++) {
                                rowValues.push("<input type='text' class='form-control input-sm' name='" + names[k] + "' value='" +
                                    (getFromNode("value", data[i], "ngqyl.zxs.yl.yl" + j + "." + names[k]) || "") + "' />");
                            }
                            rowValues.push("<button class='btn btn-sm red'>删除</button>");
                            gxhNgqylZxsYlDtTable.fnAddData(rowValues);
                        }
                    }
                    $(".refresh .gxh_ngqyl_zxs").show();
                }
                if (xwxExist) {
                    var rowValues = [];
                    var names = ["lb", "zj", "nx", "hyl"]
                    for (var i = 0; i < names.length; i++) {
                        rowValues.push(getFromNode("value", data[0], "ngqyl.xwx.gg." + names[i]) || "");
                    }
                    gxhNgqylXwxGgDtTable.fnAddData(rowValues);
                    var zmc = 0;
                    var zl = 0;
                    var rowValues = [];
                    for (var i = 0; i < data.length; i++) {
                        zmc = accAdd(zmc, getFromNode("value", data[i], "ngqyl.xwx.yl.zmc") || "");
                        zl = accAdd(zl, getFromNode("value", data[i], "ngqyl.xwx.yl.zl") || "");
                    }
                    rowValues.push(getFromNode("value", data[0], "ngqyl.xwx.yl.gymcxs") || "");
                    rowValues.push(zmc);
                    rowValues.push(getFromNode("value", data[0], "ngqyl.xwx.yl.dh") || "");
                    rowValues.push(zl);
                    var names = ["gymcxs", "zmc", "dh", "zl"];
                    for (var i = 0; i < rowValues.length; i++) {
                        rowValues[i] = "<input type='text' class='form-control input-sm' name='" + names[i] + "' value='" + rowValues[i] + "' />";
                    }
                    gxhNgqylXwxYlDtTable.fnAddData(rowValues);
                    $(".refresh .gxh_ngqyl_xwx").show();
                }
                if (yzExist) {
                    var rowValues = [];
                    rowValues.push(getFromNode("value", data[0], "ngqyl.yz.gg.xh") || "");
                    gxhNgqylYzGgDtTable.fnAddData(rowValues);
                    var zl = 0;
                    var rowValues = [];
                    for (var i = 0; i < data.length; i++) {
                        zl = accAdd(zl, getFromNode("value", data[i], "ngqyl.yz.yl.zl") || "");
                    }
                    rowValues.push(getFromNode("value", data[0], "ngqyl.yz.yl.tyfs") || "");
                    rowValues.push(getFromNode("value", data[0], "ngqyl.yz.yl.dh") || "");
                    rowValues.push(zl);
                    var names = ["tyfs", "dh", "zl"];
                    for (var i = 0; i < rowValues.length; i++) {
                        rowValues[i] = "<input type='text' class='form-control input-sm' name='" + names[i] + "' value='" + rowValues[i] + "' />";
                    }
                    gxhNgqylYzYlDtTable.fnAddData(rowValues);
                    $(".refresh .gxh_ngqyl_yz").show();
                }
                if (zjpExist) {
                    var rowValues = [];
                    var names = ["jg", "zj", "nx", "qd", "tyfs", "nj", "bmzt"];
                    for (var i = 0; i < names.length; i++) {
                        rowValues.push(getFromNode("value", data[0], "ngqyl.zjp.gg." + names[i]) || "");
                    }
                    gxhNgqylZjpGgDtTable.fnAddData(rowValues);
                    for (var i = 0; i < data.length; i++) {
                        var yls = getFromNode("yls", data[i], "ngqyl.zjp.yl");
                        for (var j = yls.begin; j < yls.begin + yls.total; j++) {
                            var rowValues = [];
                            var names = ["dc", "ds", "djmc", "js", "zmc", "gzlxh"];
                            for (var k = 0; k < names.length; k++) {
                                rowValues.push("<input type='text' class='form-control input-sm' name='" + names[k] + "' value='" +
                                    (getFromNode("value", data[i], "ngqyl.zjp.yl.yl" + j + "." + names[k]) || "") + "' />");
                            }
                            rowValues.push("<button class='btn btn-sm red'>删除</button>");
                            gxhNgqylZjpYlDtTable.fnAddData(rowValues);
                        }
                    }
                    $(".refresh .gxh_ngqyl_zjp a[href='#gxh_ngqyl_zjp']").text(zjpText);
                    $(".refresh .gxh_ngqyl_zjp").show();
                }
                if (wgsExist) {
                    var ss = getFromNode("ss", data[0], "ngqyl.wgs");
                    for (var i = ss.begin; i < ss.begin + ss.total; i++) {
                        var html = "";
                        html += "<div class='panel panel-default gxh_ngqyl_wgs_s gxh_ngqyl_wgs_s";
                        html += i;
                        html += "'>";
                        html += "<div class='panel-heading'>";
                        html += "<div class='panel-title' style='font-size:14px'>";
                        html += "<a class='accordion-toggle accordion-toggle-styled collapsed' data-toggle='collapse' ";
                        html += "href='#gxh_ngqyl_wgs_s";
                        html += i;
                        html += "' style='font-size:14px;font-weight:bold'>";
                        html += getFromNode("text", data[0], "ngqyl.wgs.s" + i);
                        html += "</a>";
                        html += "</div>";
                        html += "</div>";
                        html += "<div class='panel-collapse collapse' id='gxh_ngqyl_wgs_s";
                        html += i;
                        html += "'>";
                        html += "<div class='panel-body'>";
                        html += "<div class='panel-group accordion'>";
                        html += "<div class='panel panel-default'>";
                        html += "<div class='panel-heading'>";
                        html += "<div class='panel-title' style='font-size:14px'>";
                        html += "<a class='accordion-toggle accordion-toggle-styled collapsed' data-toggle='collapse' ";
                        html += "href='#gxh_ngqyl_wgs_s";
                        html += i;
                        html += "_gg";
                        html += "' style='font-size:14px;font-weight:bold'>";
                        html += "规格</a>";
                        html += "</div>";
                        html += "</div>";
                        html += "<div class='panel-collapse collapse' id='gxh_ngqyl_wgs_s";
                        html += i;
                        html += "_gg'>";
                        html += "<div class='panel-body'>";
                        html += "<div class='dataTables_wrapper no-footer'>";
                        html += "<table class='table table-striped table-hover table-bordered dataTable no-footer ";
                        html += "gxh_ngqyl_wgs_s";
                        html += i;
                        html += "_gg'>";
                        html += "<thead>";
                        html += "<tr role='row'>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 类别</th>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 直径(mm)</th>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 强度(MPa)</th>";
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
                        html += "href='#gxh_ngqyl_wgs_s";
                        html += i;
                        html += "_yl";
                        html += "' style='font-size:14px;font-weight:bold'>";
                        html += "用量</a>";
                        html += "</div>";
                        html += "</div>";
                        html += "<div class='panel-collapse collapse' id='gxh_ngqyl_wgs_s";
                        html += i;
                        html += "_yl'>";
                        html += "<div class='panel-body'>";
                        html += "<div class='dataTables_wrapper no-footer'>";
                        html += "<table class='table table-striped table-hover table-bordered dataTable no-footer ";
                        html += "gxh_ngqyl_wgs_s";
                        html += i;
                        html += "_yl' s='";
                        html += i;
                        html += "'";
                        html += "'>";
                        html += "<thead>";
                        html += "<tr role='row'>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 根数</th>";
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
                        $(".refresh #gxh_ngqyl_wgs_accordion").append(html);
                    }
                    for (var i = ss.begin; i < ss.begin + ss.total; i++) {
                        var ggTable = $(".refresh " + ".gxh_ngqyl_wgs_s" + i + "_gg");
                        var ggDtTable = ggTable.dataTable(datatableOption);
                        var ylTable = $(".refresh " + ".gxh_ngqyl_wgs_s" + i + "_yl");
                        var ylDtTable = ylTable.dataTable(datatableOption);
                        var rowValues = [];
                        var names = ["lb", "zj", "qd"];
                        for (var k = 0; k < names.length; k++) {
                            rowValues.push(getFromNode("value", data[0], "ngqyl.wgs.s" + i + ".gg." + names[k]) || "");
                        }
                        ggDtTable.fnAddData(rowValues);
                        for (var j = 0; j < data.length; j++) {
                            // 用量数
                            var yls = getFromNode("yls", data[j], "ngqyl.wgs.s" + i + ".yl");
                            for (var k = yls.begin; k < yls.begin + yls.total; k++) {
                                var rowValues = [];
                                rowValues.push("<input type='text' class='form-control input-sm' name='gs' value='" +
                                    (getFromNode("value", data[j], "ngqyl.wgs.s" + i + ".yl.gs") || "") + "' disabled/>");
                                var names = ["dc", "ds", "djmc", "js", "zmc", "gzlxh"];
                                for (var l = 0; l < names.length; l++) {
                                    rowValues.push("<input type='text' class='form-control input-sm' name='" + names[l] + "' value='" +
                                        (getFromNode("value", data[j], "ngqyl.wgs.s" + i + ".yl.yl" + k + "." + names[l]) || "") + "'/>")
                                }
                                rowValues.push("<button class='btn btn-sm red'>删除</button>");
                                ylDtTable.fnAddData(rowValues);
                            }
                        }
                    }
                    $(".refresh .gxh_ngqyl_wgs").show();
                }
                if (sdcExist) {
                    var scs = getFromNode("scs", data[0], "ngqyl");
                    for (var i = scs.begin; i < scs.begin + scs.total; i++) {
                        var html = "";
                        html += "<div class='panel panel-default gxh_ngqyl_sdc gxh_ngqyl_sdc";
                        html += i;
                        html += "'>";
                        html += "<div class='panel-heading'>";
                        html += "<div class='panel-title' style='font-size:14px'>";
                        html += "<a class='accordion-toggle accordion-toggle-styled collapsed' data-toggle='collapse' ";
                        html += "href='#gxh_ngqyl_sdc";
                        html += i;
                        html += "' style='font-size:14px;font-weight:bold'>";
                        html += getFromNode("text", data[0], "ngqyl.sdc" + i);
                        html += "</a>";
                        html += "</div>";
                        html += "</div>";
                        html += "<div class='panel-collapse collapse' id='gxh_ngqyl_sdc";
                        html += i;
                        html += "'>";
                        html += "<div class='panel-body'>";
                        html += "<div class='panel-group accordion'>";
                        var ss = getFromNode("ss", data[0], "ngqyl.sdc" + i);
                        for (var j = ss.begin; j < ss.begin + ss.total; j++) {
                            html += "<div class='panel panel-default'>";
                            html += "<div class='panel-heading'>";
                            html += "<div class='panel-title' style='font-size:14px'>";
                            html += "<a class='accordion-toggle accordion-toggle-styled collapsed' data-toggle='collapse' ";
                            html += "href='#gxh_ngqyl_sdc";
                            html += i;
                            html += "_s";
                            html += j;
                            html += "' style='font-size:14px;font-weight:bold'>";
                            html += getFromNode("text", data[0], "ngqyl.sdc" + i + ".s" + j);
                            html += "</a>";
                            html += "</div>";
                            html += "</div>";
                            html += "<div class='panel-collapse collapse' id='gxh_ngqyl_sdc";
                            html += i;
                            html += "_s";
                            html += j;
                            html += "'>";
                            html += "<div class='panel-body'>";
                            html += "<div class='panel-group accordion'>";
                            html += "<div class='panel panel-default'>";
                            html += "<div class='panel-heading'>";
                            html += "<div class='panel-title' style='font-size:14px'>";
                            html += "<a class='accordion-toggle accordion-toggle-styled collapsed' data-toggle='collapse' ";
                            html += "href='#gxh_ngqyl_sdc";
                            html += i;
                            html += "_s";
                            html += j;
                            html += "_gg";
                            html += "' style='font-size:14px;font-weight:bold'>";
                            html += "规格</a>";
                            html += "</div>";
                            html += "</div>";
                            html += "<div class='panel-collapse collapse' id='gxh_ngqyl_sdc";
                            html += i;
                            html += "_s";
                            html += j;
                            html += "_gg'>";
                            html += "<div class='panel-body'>";
                            html += "<div class='dataTables_wrapper no-footer'>";
                            html += "<table class='table table-striped table-hover table-bordered dataTable no-footer ";
                            html += "gxh_ngqyl_sdc";
                            html += i;
                            html += "_s";
                            html += j;
                            html += "_gg'>";
                            html += "<thead>";
                            html += "<tr role='row'>";
                            html += "<th tabindex='0',rowspan='1', colspan='1'> 类别</th>";
                            html += "<th tabindex='0',rowspan='1', colspan='1'> 直径(mm)</th>";
                            html += "<th tabindex='0',rowspan='1', colspan='1'> 强度(MPa)</th>";
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
                            html += "href='#gxh_ngqyl_sdc";
                            html += i;
                            html += "_s";
                            html += j;
                            html += "_yl";
                            html += "' style='font-size:14px;font-weight:bold'>";
                            html += "用量</a>";
                            html += "</div>";
                            html += "</div>";
                            html += "<div class='panel-collapse collapse' id='gxh_ngqyl_sdc";
                            html += i;
                            html += "_s";
                            html += j;
                            html += "_yl'>";
                            html += "<div class='panel-body'>";
                            html += "<div class='dataTables_wrapper no-footer'>";
                            html += "<table class='table table-striped table-hover table-bordered dataTable no-footer ";
                            html += "gxh_ngqyl_sdc";
                            html += i;
                            html += "_s";
                            html += j;
                            html += "_yl' sdc='";
                            html += i;
                            html += "' s='";
                            html += j;
                            html += "'>";
                            html += "<thead>";
                            html += "<tr role='row'>";
                            html += "<th tabindex='0',rowspan='1', colspan='1'> 根数</th>";
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
                        $(".refresh #gxh_ngqyl_accordion").append(html);
                    }
                    for (var i = scs.begin; i < scs.begin + scs.total; i++) {
                        var ss = getFromNode("ss", data[0], "ngqyl.sdc" + i);
                        for (var j = ss.begin; j < ss.begin + ss.total; j++) {
                            var ggTable = $(".refresh " + ".gxh_ngqyl_sdc" + i + "_s" + j + "_gg");
                            var ggDtTable = ggTable.dataTable(datatableOption);
                            var ylTable = $(".refresh " + ".gxh_ngqyl_sdc" + i + "_s" + j + "_yl");
                            var ylDtTable = ylTable.dataTable(datatableOption);
                            var rowValues = [];
                            var names = ["lb", "zj", "qd"];
                            for (var k = 0; k < names.length; k++) {
                                rowValues.push(getFromNode("value", data[0], "ngqyl.sdc" + i + ".s" + j + ".gg." + names[k]) || "");
                            }
                            ggDtTable.fnAddData(rowValues);
                            for (var k = 0; k < data.length; k++) {
                                var yls = getFromNode("yls", data[k], "ngqyl.sdc" + i + ".s" + j + ".yl");
                                for (var l = yls.begin; l < yls.begin + yls.total; l++) {
                                    var rowValues = [];
                                    rowValues.push("<input type='text' class='form-control input-sm' name='gs' value='" +
                                        (getFromNode("value", data[k], "ngqyl.sdc" + i + ".s" + j + ".yl.gs") || "") + "' disabled/>");
                                    var names = ["dc", "ds", "djmc", "js", "zmc", "gzlxh"];
                                    for (var m = 0; m < names.length; m++) {
                                        rowValues.push("<input type='text' class='form-control input-sm' name='" + names[m] + "' value='" +
                                            (getFromNode("value", data[k], "ngqyl.sdc" + i + ".s" + j + ".yl.yl" + l + "." + names[m]) || "") + "'/>")
                                    }
                                    rowValues.push("<button class='btn btn-sm red'>删除</button>");
                                    ylDtTable.fnAddData(rowValues);
                                }
                            }
                        }
                    }
                }
                if (sExist) {
                    var ss = getFromNode("ss", data[0], "ngqyl");
                    for (var i = ss.begin; i < ss.begin + ss.total; i++) {
                        var html = "";
                        html += "<div class='panel panel-default gxh_ngqyl_s'>";
                        html += "<div class='panel-heading'>";
                        html += "<div class='panel-title' style='font-size:14px'>";
                        html += "<a class='accordion-toggle accordion-toggle-styled collapsed' data-toggle='collapse' ";
                        html += "href='#gxh_ngqyl_s";
                        html += i;
                        html += "' style='font-size:14px;font-weight:bold'>";
                        html += getFromNode("text", data[0], "ngqyl.s" + i);
                        html += "</a>";
                        html += "</div>";
                        html += "</div>";
                        html += "<div class='panel-collapse collapse' id='gxh_ngqyl_s";
                        html += i;
                        html += "'>";
                        html += "<div class='panel-body'>";
                        html += "<div class='panel-group accordion'>";
                        html += "<div class='panel panel-default'>";
                        html += "<div class='panel-heading'>";
                        html += "<div class='panel-title' style='font-size:14px'>";
                        html += "<a class='accordion-toggle accordion-toggle-styled collapsed' data-toggle='collapse' ";
                        html += "href='#gxh_ngqyl_s";
                        html += i;
                        html += "_gg";
                        html += "' style='font-size:14px;font-weight:bold'>";
                        html += "规格</a>";
                        html += "</div>";
                        html += "</div>";
                        html += "<div class='panel-collapse collapse' id='gxh_ngqyl_s";
                        html += i;
                        html += "_gg'>";
                        html += "<div class='panel-body'>";
                        html += "<div class='dataTables_wrapper no-footer'>";
                        html += "<table class='table table-striped table-hover table-bordered dataTable no-footer ";
                        html += "gxh_ngqyl_s";
                        html += i;
                        html += "_gg'>";
                        html += "<thead>";
                        html += "<tr role='row'>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 类别</th>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 直径(mm)</th>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 强度(MPa)</th>";
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
                        html += "href='#gxh_ngqyl_s";
                        html += i;
                        html += "_yl";
                        html += "' style='font-size:14px;font-weight:bold'>";
                        html += "用量</a>";
                        html += "</div>";
                        html += "</div>";
                        html += "<div class='panel-collapse collapse' id='gxh_ngqyl_s";
                        html += i;
                        html += "_yl'>";
                        html += "<div class='panel-body'>";
                        html += "<div class='dataTables_wrapper no-footer'>";
                        html += "<table class='table table-striped table-hover table-bordered dataTable no-footer ";
                        html += "gxh_ngqyl_s";
                        html += i;
                        html += "_yl' s='";
                        html += i;
                        html += "'>";
                        html += "<thead>";
                        html += "<tr role='row'>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 根数</th>";
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
                        $(".refresh #gxh_ngqyl_accordion").append(html);
                    }
                    for (var i = ss.begin; i < ss.begin + ss.total; i++) {
                        var ggTable = $(".refresh " + ".gxh_ngqyl_s" + i + "_gg");
                        var ggDtTable = ggTable.dataTable(datatableOption);
                        var ylTable = $(".refresh " + ".gxh_ngqyl_s" + i + "_yl");
                        var ylDtTable = ylTable.dataTable(datatableOption);
                        var rowValues = [];
                        var names = ["lb", "zj", "qd"];
                        for (var j = 0; j < names.length; j++) {
                            rowValues.push(getFromNode("value", data[0], "ngqyl.s" + i + ".gg." + names[j]) || "");
                        }
                        ggDtTable.fnAddData(rowValues);
                        for (var j = 0; j < data.length; j++) {
                            var yls = getFromNode("yls", data[j], "ngqyl.s" + i + ".yl");
                            for (var k = yls.begin; k < yls.begin + yls.total; k++) {
                                var rowValues = [];
                                rowValues.push("<input type='text' class='form-control input-sm' name='gs' value='" +
                                    (getFromNode("value", data[j], "ngqyl.s" + i + ".yl.gs") || "") + "' disabled/>");
                                var names = ["dc", "ds", "djmc", "js", "zmc", "gzlxh"];
                                for (var l = 0; l < names.length; l++) {
                                    rowValues.push("<input type='text' class='form-control input-sm' name='" + names[l] + "' value='" +
                                        (getFromNode("value", data[j], "ngqyl.s" + i + ".yl.yl" + k + "." + names[l]) || "") + "'/>")
                                }
                                rowValues.push("<button class='btn btn-sm red'>删除</button>");
                                ylDtTable.fnAddData(rowValues);
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
                    var input = $(".refresh .gxh_ngqyl_xwx_yl tbody").find("input[name=" + array[i].name + "]");
                    var result = checkValue(array[i].name, $(input).val());
                    if (!result.valid) {
                        bootboxError("生产计划更新后-捻股前用料-纤维芯-用量-" + array[i].text + result.text);
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
                    var input = $(".refresh .gxh_ngqyl_yz_yl tbody").find("input[name=" + array[i].name + "]");
                    var result = checkValue(array[i].name, $(input).val());
                    if (!result.valid) {
                        bootboxError("生产计划更新后-捻股前用料-油脂-用量-" + array[i].text + result.text);
                        $('.refresh #submit').removeProp("disabled");
                        $('.refresh #cancel').removeProp("disabled");
                        return;
                    }
                }
            }
            if (zxsExist) {
                var array = [
                    {"name": "dc", "text": "段长"},
                    {"name": "ds", "text": "段数"},
                    {"name": "djmc", "text": "单件米长"},
                    {"name": "js", "text": "件数"},
                    {"name": "zmc", "text": "总米长"},
                    {"name": "gzlxh", "text": "工字轮型号"}
                ];
                for (var i = 0; i < array.length; i++) {
                    var inputs = $(".refresh .gxh_ngqyl_zxs_yl tbody").find("input[name=" + array[i].name + "]");
                    for (var j = 0; j < inputs.length; j++) {
                        var result = checkValue(array[i].name, $(inputs[j]).val());
                        if (!result.valid) {
                            bootboxError("生产计划更新后-捻股前用料-中心丝-用量-" + array[i].text + result.text);
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
                    var inputs = $(".refresh .gxh_ngqyl_zjp_yl tbody").find("input[name=" + array[i].name + "]");
                    for (var j = 0; j < inputs.length; j++) {
                        var result = checkValue(array[i].name, $(inputs[j]).val());
                        if (!result.valid) {
                            bootboxError("生产计划更新后-捻股前用料-" + zjpText + "-用量-" + array[i].text + result.text);
                            $('.refresh #submit').removeProp("disabled");
                            $('.refresh #cancel').removeProp("disabled");
                            return;
                        }
                    }
                }
            }
            if (sdcExist) {
                var array = [
                    {"name": "gs", "text": "根数"},
                    {"name": "dc", "text": "段长"},
                    {"name": "ds", "text": "段数"},
                    {"name": "djmc", "text": "单件米长"},
                    {"name": "js", "text": "件数"},
                    {"name": "zmc", "text": "总米长"},
                    {"name": "gzlxh", "text": "工字轮型号"}
                ];
                var sPanel = $(".refresh").find(".gxh_ngqyl_sdc");
                for (var i = 0; i < array.length; i++) {
                    var inputs = $(sPanel).find("input[name=" + array[i].name + "]");
                    for (var j = 0; j < inputs.length; j++) {
                        var input = inputs[j];
                        var table = $(input).parents("table")[0];
                        var result = checkValue(array[i].name, $(input).val());
                        if (!result.valid) {
                            bootboxError("生产计划更新后-捻股前用料-第" + $(table).attr("sdc") + "层丝-丝" + $(table).attr("s") + "-用量-" + array[i].text + result.text);
                            $('.refresh #submit').removeProp("disabled");
                            $('.refresh #cancel').removeProp("disabled");
                            return;
                        }
                    }
                }
            }
            if (sExist) {
                var array = [
                    {"name": "gs", "text": "根数"},
                    {"name": "dc", "text": "段长"},
                    {"name": "ds", "text": "段数"},
                    {"name": "djmc", "text": "单件米长"},
                    {"name": "js", "text": "件数"},
                    {"name": "zmc", "text": "总米长"},
                    {"name": "gzlxh", "text": "工字轮型号"}
                ];
                var sPanel = $(".refresh").find(".gxh_ngqyl_s");
                for (var i = 0; i < array.length; i++) {
                    var inputs = $(sPanel).find("input[name=" + array[i].name + "]");
                    for (var j = 0; j < inputs.length; j++) {
                        var input = inputs[j];
                        var table = $(input).parents("table")[0];
                        var result = checkValue(array[i].name, $(input).val());
                        if (!result.valid) {
                            bootboxError("生产计划更新后-捻股前用料-丝" + $(table).attr("s") + "-用量-" + array[i].text + result.text);
                            $('.refresh #submit').removeProp("disabled");
                            $('.refresh #cancel').removeProp("disabled");
                            return;
                        }
                    }
                }
            }
            if (wgsExist) {
                var array = [
                    {"name": "gs", "text": "根数"},
                    {"name": "dc", "text": "段长"},
                    {"name": "ds", "text": "段数"},
                    {"name": "djmc", "text": "单件米长"},
                    {"name": "js", "text": "件数"},
                    {"name": "zmc", "text": "总米长"},
                    {"name": "gzlxh", "text": "工字轮型号"}
                ];
                var sPanel = $(".refresh").find(".gxh_ngqyl_wgs_s");
                for (var i = 0; i < array.length; i++) {
                    var inputs = $(sPanel).find("input[name=" + array[i].name + "]");
                    for (var j = 0; j < inputs.length; j++) {
                        var input = inputs[j];
                        var table = $(input).parents("table")[0];
                        var result = checkValue(array[i].name, $(input).val());
                        if (!result.valid) {
                            bootboxError("生产计划更新后-捻股前用料-外钢丝-丝" + $(table).attr("s") + "-用量-" + array[i].text + result.text);
                            $('.refresh #submit').removeProp("disabled");
                            $('.refresh #cancel').removeProp("disabled");
                            return;
                        }
                    }
                }
            }
            var array = [
                {"name": "dc", "text": "段长"},
                {"name": "ds", "text": "段数"},
                {"name": "djmc", "text": "单件米长"},
                {"name": "js", "text": "件数"},
                {"name": "zmc", "text": "总米长"},
                {"name": "gzlxh", "text": "工字轮型号"}
            ];
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
            setToNode("value", data, "ngh.gdcp.tsyq", $($gxhGdcpTable.find("input[name=tsyq]")).val());
            setToNode("children", data, "ngh.sxfs", $.extend(true, [], getFromNode("children", module, "ngh.sxfs")));
            tree.expire(data);
            var trs = $(".refresh #gxh_sxfs tbody").find("tr:has(td:not(.dataTables_empty))");
            drawNode(trs.length, getFromNode("json", data, "ngh.sxfs"), getFromNode("json", data, "ngh.sxfs.sxfsn"), "sxfss", 1);
            tree.expire(data);
            for (var i = 0; i < trs.length; i++) {
                var inputs = $(trs[i]).find("input");
                for (var j = 0; j < $(inputs).length; j++) {
                    setToNode("value", data, "ngh.sxfs.sxfs" + (i + 1) + "." + $(inputs[j]).attr("name"), $(inputs[j]).val());
                }
            }
            if (xwxExist) {
                var tr = $gxhNgqylXwxYlTable.find("tbody tr:has(td:not(.dataTables_empty))");
                var inputs = $(tr).find("input");
                for (var i = 0; i < $(inputs).length; i++) {
                    setToNode("value", data, "ngqyl.xwx.yl." + $(inputs[i]).attr("name"), $(inputs[i]).val());
                }
            }
            if (yzExist) {
                var tr = $gxhNgqylYzYlTable.find("tbody tr:has(td:not(.dataTables_empty))");
                var inputs = $(tr).find("input");
                for (var i = 0; i < $(inputs).length; i++) {
                    setToNode("value", data, "ngqyl.yz.yl." + $(inputs[i]).attr("name"), $(inputs[i]).val());
                }
            }
            if (zxsExist) {
                setToNode("children", data, "ngqyl.zxs.yl", $.extend(true, [], getFromNode("children", module, "ngqyl.zxs.yl")));
                tree.expire(data);
                var trs = $gxhNgqylZxsYlTable.find("tbody tr:has(td:not(.dataTables_empty))");
                drawNode(trs.length, getFromNode("json", data, "ngqyl.zxs.yl"), getFromNode("json", data, "ngqyl.zxs.yl.yln"), "yls", 1);
                tree.expire(data);
                for (var i = 0; i < trs.length; i++) {
                    var inputs = $(trs[i]).find("input");
                    for (var j = 0; j < $(inputs).length; j++) {
                        setToNode("value", data, "ngqyl.zxs.yl.yl" + (i + 1) + "." + $(inputs[j]).attr("name"), $(inputs[j]).val());
                    }
                }
            }
            if (zjpExist) {
                setToNode("children", data, "ngqyl.zjp.yl", $.extend(true, [], getFromNode("children", module, "ngqyl.zjp.yl")));
                tree.expire(data);
                var trs = $gxhNgqylZjpYlTable.find("tbody tr:has(td:not(.dataTables_empty))");
                drawNode(trs.length, getFromNode("json", data, "ngqyl.zjp.yl"), getFromNode("json", data, "ngqyl.zjp.yl.yln"), "yls", 1);
                tree.expire(data);
                for (var i = 0; i < trs.length; i++) {
                    var inputs = $(trs[i]).find("input");
                    for (var j = 0; j < $(inputs).length; j++) {
                        setToNode("value", data, "ngqyl.zjp.yl.yl" + (i + 1) + "." + $(inputs[j]).attr("name"), $(inputs[j]).val());
                    }
                }
            }
            if (sdcExist) {
                var scs = getFromNode("scs", data, "ngqyl");
                for (var i = scs.begin; i < scs.begin + scs.total; i++) {
                    var ss = getFromNode("ss", data, "ngqyl.sdc" + i);
                    for (var j = ss.begin; j < ss.begin + ss.total; j++) {
                        setToNode("children", data, "ngqyl.sdc" + i + ".s" + j + ".yl", $.extend(true, [], getFromNode("children", module, "ngqyl.sdcn.sn.yl")));
                        tree.expire(data);
                        var $table = $(".refresh .gxh_ngqyl_sdc" + i + "_s" + j + "_yl");
                        var trs = $table.find("tbody tr:has(td:not(.dataTables_empty))");
                        drawNode(trs.length, getFromNode("json", data, "ngqyl.sdc" + i + ".s" + j + ".yl"), getFromNode("json", data, "ngqyl.sdc" + i + ".s" +
                            j + ".yl.yln"), "yls", 1);
                        tree.expire(data);
                        setToNode("value", data, "ngqyl.sdc" + i + ".s" + j + ".yl.gs", $($(trs[0]).find("input[name=gs]")).val());
                        for (var k = 0; k < trs.length; k++) {
                            var inputs = $(trs[k]).find("input[name!=gs]");
                            for (var m = 0; m < $(inputs).length; m++) {
                                setToNode("value", data, "ngqyl.sdc" + i + ".s" + j + ".yl.yl" + (k + 1) + "." + $(inputs[m]).attr("name"), $(inputs[m]).val());
                            }
                        }
                    }
                }
            }
            if (sExist) {
                var ss = getFromNode("ss", data, "ngqyl");
                for (var i = ss.begin; i < ss.begin + ss.total; i++) {
                    setToNode("children", data, "ngqyl.s" + i + ".yl", $.extend(true, [], getFromNode("children", module, "ngqyl.sn.yl")));
                    tree.expire(data);
                    var $table = $(".refresh .gxh_ngqyl_s" + i + "_yl");
                    var trs = $table.find("tbody tr:has(td:not(.dataTables_empty))");
                    drawNode(trs.length, getFromNode("json", data, "ngqyl.s" + i + ".yl"), getFromNode("json", data, "ngqyl.s" + i + ".yl.yln"), "yls", 1);
                    tree.expire(data);
                    setToNode("value", data, "ngqyl.s" + i + ".yl.gs", $($(trs[0]).find("input[name=gs]")).val());
                    for (var k = 0; k < trs.length; k++) {
                        var inputs = $(trs[k]).find("input[name!=gs]");
                        for (var m = 0; m < $(inputs).length; m++) {
                            setToNode("value", data, "ngqyl.s" + i + ".yl.yl" + (k + 1) + "." + $(inputs[m]).attr("name"), $(inputs[m]).val());
                        }
                    }
                }
            }
            if (wgsExist) {
                var ss = getFromNode("ss", data, "ngqyl.wgs");
                for (var i = ss.begin; i < ss.begin + ss.total; i++) {
                    setToNode("children", data, "ngqyl.wgs.s" + i + ".yl", $.extend(true, [], getFromNode("children", module, "ngqyl.wgs.sn.yl")));
                    tree.expire(data);
                    var $table = $(".refresh .gxh_ngqyl_wgs_s" + i + "_yl");
                    var trs = $table.find("tbody tr:has(td:not(.dataTables_empty))");
                    drawNode(trs.length, getFromNode("json", data, "ngqyl.wgs.s" + i + ".yl"), getFromNode("json", data, "ngqyl.wgs.s" + i + ".yl.yln"), "yls", 1);
                    tree.expire(data);
                    setToNode("value", data, "ngqyl.wgs.s" + i + ".yl.gs", $($(trs[0]).find("input[name=gs]")).val());
                    for (var k = 0; k < trs.length; k++) {
                        var inputs = $(trs[k]).find("input[name!=gs]");
                        for (var m = 0; m < $(inputs).length; m++) {
                            setToNode("value", data, "ngqyl.wgs.s" + i + ".yl.yl" + (k + 1) + "." + $(inputs[m]).attr("name"), $(inputs[m]).val());
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
            var array = [];
            var names = ["dc", "ds", "djmc", "js", "zmc", "gzlxh"];
            if (className.indexOf("sdc") > 0 ||
                className.indexOf("wgs") > 0 ||
                className.indexOf("ngqyl_s") > 0) {
                array.push("<input type='text' class='form-control input-sm' name='gs' value='" +
                    $($(table).find("tbody tr:first input[name=gs]")).val() + "' disabled />");
            }
            for (var i = 0; i < names.length; i++) {
                array.push("<input type='text' class='form-control input-sm' name='" + names[i] + "' value='' />");
            }
            array.push("<button class='btn btn-sm red'>删除</button>");
            dtTable.fnAddData(array);
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
        $.getJSON("../user/getNgProductionPlanModule", function (tmpl) {
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
                url: "../user/getNgProductionPlans",
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
                {"data": "sggSzj"},
                {"data": "sfdz"},
                {"data": "lb"},
                {"data": "jg"},
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
        gxqSxfsDtTable = $gxqSxfsTable.dataTable(datatableOption);
        gxhGdcpDtTable = $gxhGdcpTable.dataTable(datatableOption);
        gxhSxfsDtTable = $gxhSxfsTable.dataTable(datatableOption);
        gxhNgqylXwxGgDtTable = $gxhNgqylXwxGgTable.dataTable(datatableOption);
        gxhNgqylXwxYlDtTable = $gxhNgqylXwxYlTable.dataTable(datatableOption);
        gxhNgqylYzGgDtTable = $gxhNgqylYzGgTable.dataTable(datatableOption);
        gxhNgqylYzYlDtTable = $gxhNgqylYzYlTable.dataTable(datatableOption);
        gxhNgqylZxsGgDtTable = $gxhNgqylZxsGgTable.dataTable(datatableOption);
        gxhNgqylZxsYlDtTable = $gxhNgqylZxsYlTable.dataTable(datatableOption);
        gxhNgqylZjpGgDtTable = $gxhNgqylZjpGgTable.dataTable(datatableOption);
        gxhNgqylZjpYlDtTable = $gxhNgqylZjpYlTable.dataTable(datatableOption);
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

    function addRecordToList(data) {
        mesUtil.formInsts[data._id] = data;
        var rowValues = [data.submit ? "" : "<input type='checkbox'/>"];
        // 产品编号
        rowValues.push(getFromNode("value", data, "cpbh") || "");
        // 绳规格
        rowValues.push(data["sgg"] || "");
        // 绳直径
        rowValues.push(data["szj"] || "");
        // 是否定制
        rowValues.push(getFromNode("value", data, "sfdz") || "");
        // 工段产品，类别,结构，直径，捻向，强度，涂油方式，捻距,表面状态,特殊要求,用途
        var array = ["lb", "jg", "zj", "nx", "qd", "tyfs", "nj", "bmzt", "tsyq", "yt"];
        for (var i = 0; i < array.length; i++) {
            rowValues.push(getFromNode("value", data, "ngh.gdcp." + array[i]) || "");
        }
        rowValues.push(data["jhrq"] || "");
        rowValues.push(data.merge);
        rowValues.push(data.submit);
        var t = dtTable.fnAddData(rowValues);
        $(dtTable.fnSettings().aoData[t].nTr).attr("id", data._id);
        $(dtTable.fnSettings().aoData[t].nTr).attr("merge", data.merge);
    }

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