$(function () {

        var idCounter = 0;  // assign an id for each node
        var dtTable, $table = $(".main table.dataTable");
        var treeData, formPerm;
        var $treeContainer = $('.main .tree-container'),
            $treeBody = $('.tree-body', $treeContainer),
            $treeHeader = $('.tree-header'),
            $treeActions = $('.tree-actions');
        var actions = {assign: "ASSIGN"};
        var $action = $(".main .action-right");
        var updates = {idForm: [], fields: []};     // 保存从input onChange来的所有更新，idForm用来检索每个改变字段属于哪个子表
        var text = "";
        var cache = {};
        var arrangeData;
        var index = 1;
        var arrangeHtml;
        var cjHtml;
        var bzzHtml;
        var czgHtml;
        var jthHtml;
        var module;
        var gxqFpjtDtTable, $gxqFpjtTable = $(".arrange table.gxq_fpjt");
        var gxqScyqCpyqGdcpDtTable, $gxqScyqCpyqGdcpTable = $(".arrange #gxq_scyq_cpyq_gdcp table.gxq_scyq_cpyq_gdcp");
        var gxqScyqJxylXwxGgDtTable, $gxqScyqJxylXwxGgTable = $(".arrange #gxq_scyq_jxyl_xwx_gg  table.gxq_scyq_jxyl_xwx_gg");
        var gxqScyqJxylXwxYlDtTable, $gxqScyqJxylXwxYlTable = $(".arrange #gxq_scyq_jxyl_xwx_yl  table.gxq_scyq_jxyl_xwx_yl");
        var gxqScyqJxylYzGgDtTable, $gxqScyqJxylYzGgTable = $(".arrange #gxq_scyq_jxyl_yz_gg  table.gxq_scyq_jxyl_yz_gg");
        var gxqScyqJxylYzYlDtTable, $gxqScyqJxylYzYlTable = $(".arrange #gxq_scyq_jxyl_yz_yl  table.gxq_scyq_jxyl_yz_yl");
        var gxqScyqJxylJssxGgDtTable, $gxqScyqJxylJssxGgTable = $(".arrange #gxq_scyq_jxyl_jssx_gg  table.gxq_scyq_jxyl_jssx_gg");
        var gxqScyqJxylJssxYlDtTable, $gxqScyqJxylJssxYlTable = $(".arrange #gxq_scyq_jxyl_jssx_yl  table.gxq_scyq_jxyl_jssx_yl");
        var gxqScyqJxylJsgxGgDtTable, $gxqScyqJxylJsgxGgTable = $(".arrange #gxq_scyq_jxyl_jsgx_gg  table.gxq_scyq_jxyl_jsgx_gg");
        var gxqScyqJxylJsgxYlDtTable, $gxqScyqJxylJsgxYlTable = $(".arrange #gxq_scyq_jxyl_jsgx_yl  table.gxq_scyq_jxyl_jsgx_yl");
        var gxqScyqJxylBjsxGgDtTable, $gxqScyqJxylBjsxGgTable = $(".arrange #gxq_scyq_jxyl_bjsx_gg  table.gxq_scyq_jxyl_bjsx_gg");
        var gxqScyqJxylBjsxYlDtTable, $gxqScyqJxylBjsxYlTable = $(".arrange #gxq_scyq_jxyl_bjsx_yl  table.gxq_scyq_jxyl_bjsx_yl");
        var gxqScyqJxylZxgGgDtTable, $gxqScyqJxylZxgGgTable = $(".arrange #gxq_scyq_jxyl_zxg_gg  table.gxq_scyq_jxyl_zxg_gg");
        var gxqScyqJxylZxgYlDtTable, $gxqScyqJxylZxgYlTable = $(".arrange #gxq_scyq_jxyl_zxg_yl  table.gxq_scyq_jxyl_zxg_yl");
        var gxqScyqJxylWgGgDtTable, $gxqScyqJxylWgGgTable = $(".arrange #gxq_scyq_jxyl_wg_gg  table.gxq_scyq_jxyl_wg_gg");
        var gxqScyqJxylWgYlDtTable, $gxqScyqJxylWgYlTable = $(".arrange #gxq_scyq_jxyl_wg_yl  table.gxq_scyq_jxyl_wg_yl");
        var gxqScyqJxylZjpGgDtTable, $gxqScyqJxylZjpGgTable = $(".arrange #gxq_scyq_jxyl_zjp_gg  table.gxq_scyq_jxyl_zjp_gg");
        var gxqScyqJxylZjpYlDtTable, $gxqScyqJxylZjpYlTable = $(".arrange #gxq_scyq_jxyl_zjp_yl  table.gxq_scyq_jxyl_zjp_yl");
        var gxqSjclLjwcclSxfsDtTable, $gxqSjclLjwcclSxfsTable = $(".arrange #gxq_sjcl_ljwccl  table.gxq_sjcl_ljwccl_sxfs");
        var gxqSjclWwcclSxfsDtTable, $gxqSjclWwcclSxfsTable = $(".arrange #gxq_sjcl_wwccl  table.gxq_sjcl_wwccl_sxfs");
        var gxqSjclRclSxfsDtTable, $gxqSjclRclSxfsTable = $(".arrange #gxq_sjcl_rcl  table.gxq_sjcl_rcl_sxfs");
        var gxqSjclBhgpSxfsDtTable, $gxqSjclBhgpSxfsTable = $(".arrange #gxq_sjcl_bhgp  table.gxq_sjcl_bhgp_sxfs");
        var gxhFpjtDtTable, $gxhFpjtTable = $(".arrange table.gxh_fpjt");
        var gxhScyqCpyqGdcpDtTable, $gxhScyqCpyqGdcpTable = $(".arrange #gxh_scyq_cpyq_gdcp_index table.gxh_scyq_cpyq_gdcp_index");
        var gxhScyqJxylXwxGgDtTable, $gxhScyqJxylXwxGgTable = $(".arrange #gxh_scyq_jxyl_xwx_gg_index  table.gxh_scyq_jxyl_xwx_gg_index");
        var gxhScyqJxylYzGgDtTable, $gxhScyqJxylYzGgTable = $(".arrange #gxh_scyq_jxyl_yz_gg_index  table.gxh_scyq_jxyl_yz_gg_index");
        var gxhScyqJxylJssxGgDtTable, $gxhScyqJxylJssxGgTable = $(".arrange #gxh_scyq_jxyl_jssx_gg_index  table.gxh_scyq_jxyl_jssx_gg_index");
        var gxhScyqJxylJsgxGgDtTable, $gxhScyqJxylJsgxGgTable = $(".arrange #gxh_scyq_jxyl_jsgx_gg_index  table.gxh_scyq_jxyl_jsgx_gg_index");
        var gxhScyqJxylBjsxGgDtTable, $gxhScyqJxylBjsxGgTable = $(".arrange #gxh_scyq_jxyl_bjsx_gg_index  table.gxh_scyq_jxyl_bjsx_gg_index");
        var gxhScyqJxylZxgGgDtTable, $gxhScyqJxylZxgGgTable = $(".arrange #gxh_scyq_jxyl_zxg_gg_index  table.gxh_scyq_jxyl_zxg_gg_index");
        var gxhScyqJxylWgGgDtTable, $gxhScyqJxylWgGgTable = $(".arrange #gxh_scyq_jxyl_wg_gg_index  table.gxh_scyq_jxyl_wg_gg_index");
        var gxhScyqJxylZjpGgDtTable, $gxhScyqJxylZjpGgTable = $(".arrange #gxh_scyq_jxyl_zjp_gg_index  table.gxh_scyq_jxyl_zjp_gg_index");
        var xwxExist, yzExist, jssxExist, jsgxExist, zxgExist, wgExist, gExist, bjsxExist, zjpExist, zjpText, isGss, sjclExist;
        var numberParams = ["ds", "js", "gs", "dc", "djmc", "zmc", "djsh", "djscmc", "djxqmc", "zsh", "zscmc", "zxqmc", "zj", "gymcxs", "dh", "zl", "hyl", "ckzzl", "jhscts", "jhcl", "rjhcl"];
        mesUtil.formInsts = {};
        mesUtil.initToastrAndBootbox();

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
            timeFormat: "yyyy-mm-dd hh:mm",
            language: "zh-CN",
            todayBtn: true,
            showHour: true,
            showMinute: true,
            autoclose: true,
            hourStep: 1,
            minuteStep: 5
            //startDate: new Date(),
            //endDate: moment().add(1, 'y').toDate()
        }

        var select2Option = {
            language: "zn-CN",
            placeholder: "请选择",
            allowClear: false
        }

        var accAdd = function (arg1, arg2) {
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

        function accMul(arg1, arg2) {
            var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
            try {
                m += s1.split(".")[1].length
            } catch (e) {
            }
            try {
                m += s2.split(".")[1].length
            } catch (e) {
            }
            return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
        }

        function getOffset(el) {
            var _x = 0, _y = 0;
            while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
                _x += el.offsetLeft - el.scrollLeft;
                _y += el.offsetTop - el.scrollTop;
                el = el.offsetParent;
            }
            return {top: _y, left: _x};
        }

        initJSTree();
        initDatatable();
        loadModule();
        //loadFormInsts();
        setupEventHandlers();
        initSelHtml();

        function initSelHtml() {
            mesUtil.loadEnums(function () {
                cjHtml = "<option disabled selected></option>";
                mesUtil.params.orgs.org1.forEach(function (u) {
                    cjHtml += "<option value='" + u + "' >" + u + "</option>";
                })
            });
            $.ajax({
                url: "../admin/internalForm/list?subForm=jtb",
                type: "GET"
            }).success(function (data) {
                jthHtml = "<option disabled selected></option>";
                data.data.forEach(function (u) {
                    jthHtml += "<option value='" + u._id + "' name='" + u.device_num + "' jtmcxs='" + (u.length_error_rate || "") + "'>" + u.device_num + "</option>";
                });
            }).fail(function () {
            });
            $.ajax({
                url: "../admin/findUsers",
                type: "POST",
                data: "roles=班组长"
            }).success(function (data) {
                bzzHtml = "<option disabled selected></option>";
                bzzHtml += "<optgroup label='用户名&nbsp;&nbsp;姓名&nbsp;&nbsp;班组'>";
                data.forEach(function (u) {
                    var bz = "";
                    if (u.org2 && u.org2 instanceof Array) {
                        for (var i = 0; i < u.org2.length; i++) {
                            bz += u.org2[i];
                            if (i != u.org2.length - 1) {
                                bz += ",";
                            }
                        }
                    }
                    bzzHtml += "<option value='" + u._id + "' name='" + u.last_name + u.first_name + "' bz='" +
                        bz + "'>" + u.username + "&nbsp;&nbsp;" + u.last_name + u.first_name + "&nbsp;&nbsp;";
                    bzzHtml += bz;
                    bzzHtml += "</option>";
                });
            }).fail(function () {
            });
            $.ajax({
                url: "../admin/findUsers",
                type: "POST"
            }).success(function (data) {
                czgHtml = "<option disabled selected></option>";
                czgHtml += "<optgroup label='用户名&nbsp;&nbsp;姓名'>";
                data.forEach(function (u) {
                    czgHtml += "<option value='" + u._id + "' name=" + u.last_name + u.first_name + ">" +
                        u.username + "&nbsp;&nbsp;" + u.last_name + u.first_name + "</option>";
                });
                czgHtml += "</optgroup>";
            }).fail(function () {
            });
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

        function setupEventHandlers() {
            $(".delete", $treeHeader).on("click", function (e) {
                e.preventDefault();
                var tr = $table.find("tr[class*=selected]");
                var message = $(tr).attr("submit") == "已下发" ? "作业计划已下发，确认要删除吗？" : "确认删除作业计划吗?";
                bootbox.confirm(
                    {
                        message: message,
                        callback: function (result) {
                            if (result) {
                                $.ajax({
                                    url: "../user/deleteHsWorkPlan",
                                    method: "POST",
                                    data: "id=" + $(tr).attr("id")
                                }).success(function (data) {
                                    toastr.success("删除成功");
                                    dtTable.ajax.reload();
                                    clearTreeContainer();
                                }).fail(function () {
                                    toastr.fail("删除失败");
                                });
                            }
                        }
                    }
                )
            });
            $('.main  .stopBtn').on('click', function (e) {
                e.preventDefault();
                var trs = $('tbody', $table).find("tr:has(input:checked)");
                if (trs.length == 0) {
                    bootboxError("请选择至少一条作业计划");
                    return;
                }
                for (var i = 0; i < trs.length; i++) {
                    if ($(trs[i]).attr("status") != "已下发") {
                        bootboxError("不能终止状态为" + $(trs[i]).attr("status") + "的生产计划");
                        return;
                    }
                }
                var ids = [];
                trs.each(function (i, tr) {
                    ids.push($(tr).attr("id"));
                });
                bootbox.confirm(
                    {
                        message: "确认终止作业计划吗?",
                        callback: function (result) {
                            if (result) {
                                $.ajax({
                                    url: "../user/suspendHsWorkPlans",
                                    method: "POST",
                                    data: "ids=" + JSON.stringify(ids)
                                }).success(function (data) {
                                    toastr.success("终止成功");
                                    dtTable.ajax.reload();
                                    clearTreeContainer();
                                }).fail(function () {
                                    toastr.fail("终止失败");
                                });
                            }
                        }
                    }
                )
            });
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
            $("body").on("select2-open", "select[name='jth']", function () {
                $("body").on("mouseover", ".select2-results li", function (e) {
                    if ($(this).text() != text) {
                        text = $(this).text();
                        if ($(".jth-hover").length == 0) {
                            var div = document.createElement("div");
                            div.className = "jth-hover";
                            div.style.position = "absolute";
                            div.style.backgroundColor = "#F9F9F9";
                            div.style.border = "1px solid #ddd";
                            div.style.maxWidth = "400px";
                            div.style.left = (getOffset(this).left + this.offsetWidth + 25) + "px";
                            div.style.top = e.clientY + "px";
                            div.style.zIndex = "100000000";
                            div.innerHTML = "&nbsp;&nbsp加载中...&nbsp;&nbsp;";
                            $("body").append(div);
                        }
                        else {
                            $(".jth-hover")[0].innerHTML = "&nbsp;&nbsp加载中...&nbsp;&nbsp;";
                            $(".jth-hover")[0].style.left = (getOffset(this).left + this.offsetWidth + 25) + "px";
                            $(".jth-hover")[0].style.top = e.clientY + "px";
                            $(".jth-hover").show();
                        }
                        $.ajax({
                            url: "../user/getMachineWorkorders",
                            method: "GET",
                            data: {
                                "jth": text,
                                "status": JSON.stringify(["未下发", "已下发"])
                            }
                        }).success(function (data) {
                            var html = "";
                            var isEmpty = true;
                            for (var i in data) {
                                if (data[i].length > 0) {
                                    isEmpty = false;
                                    html += "<div style='margin-top:5px'>&nbsp;&nbsp;<b>" + i + "</b><br/></div>";
                                    for (var j = 0; j < data[i].length; j++) {
                                        html += "&nbsp;&nbsp;" + (j + 1) + ".&nbsp;结构:" + data[i][j].jg + ",直径:" + data[i][j].zj + ",计划产量:" + data[i][j].jhcl + ",实际产量:" + data[i][j].sjcl + "&nbsp;&nbsp;<br/>";
                                    }
                                }
                            }
                            if (isEmpty) {
                                $(".jth-hover")[0].innerHTML = "&nbsp;&nbsp;暂无数据&nbsp;&nbsp;";
                            }
                            else {
                                $(".jth-hover")[0].innerHTML = html;
                            }
                        }).fail(function () {
                            $(".jth-hover")[0].innerHTML = "&nbsp;&nbsp;<span style='color:red'>加载失败</span>&nbsp;&nbsp;";
                        });
                    }
                });
                $("body").on("mouseleave", ".select2-results li", function (e) {
                    text = "";
                    $(".jth-hover").hide();
                });
            });
            $("body").on("select2-close", "select[name='jth']", function (e) {
                text = "";
                $(".jth-hover").hide();
                $("body").off("mouseover", ".select2-results li");
                $("body").off("mouseleave", ".select2-results li");
            });
            $('.arrange').on('change', 'select[name=jth]', function () {
                var tr = $(this).parents("tr")[0];
                $($(tr).find("input[name=jtmcxs]")).val($(this).find("option:selected").attr("jtmcxs") || "");
            });
            $('.arrange').on('input propertychange', 'input', function (e) {
                var name = $(this).attr('name');
                var tr = $(this).parents("tr")[0];
                var dc = $(tr).find("input[name='dc']");
                var ds = $(tr).find("input[name='ds']");
                var djmc = $(tr).find("input[name='djmc']");
                var djsh = $(tr).find("input[name='djsh']");
                var djxqmc = $(tr).find("input[name='djxqmc']");
                var djscmc = $(tr).find("input[name='djscmc']");
                var js = $(tr).find("input[name='js']");
                var zmc = $(tr).find("input[name='zmc']");
                var zsh = $(tr).find("input[name='zsh']");
                var zxqmc = $(tr).find("input[name='zxqmc']");
                var zscmc = $(tr).find("input[name='zscmc']");
                var lpxh = $(tr).find("input[name='lpxh']");
                if (lpxh.length > 0) {
                    if (name == "djmc" || name == "js") {
                        $(zmc).val(accMul($(djmc).val(), $(js).val()));
                    }
                }
                else {
                    if (djmc.length > 0) {
                        if (name == "dc" || name == "ds" || name == "djsh" || name == "js") {
                            $(djmc).val(accMul($(dc).val(), $(ds).val()));
                            $(djscmc).val(accAdd($(djmc).val(), $(djsh).val()));
                            $(djxqmc).val(accAdd($(djmc).val(), $(djsh).val()));
                            $(zmc).val(accMul($(djmc).val(), $(js).val()));
                            $(zsh).val(accMul($(djsh).val(), $(js).val()));
                            $(zscmc).val(accAdd($(zmc).val(), $(zsh).val()));
                            $(zxqmc).val(accAdd($(zmc).val(), $(zsh).val()));
                        }
                    }
                }
            });
            $('.main .submitBtn').on('click', function (e) {
                e.preventDefault();
                var trs = $('tbody', $table).find("tr:has(input:checked)");
                if (trs.length == 0) {
                    bootboxError("请选择至少一条作业计划");
                    return;
                }
                for (var i = 0; i < trs.length; i++) {
                    if ($(trs[i]).attr("status") != "未下发") {
                        bootboxError("不能下发状态为" + $(trs[i]).attr("status") + "的生产计划");
                        return;
                    }
                }
                var ids = [];
                trs.each(function (i, tr) {
                    ids.push($(tr).attr("id"));
                });
                bootbox.confirm(
                    {
                        message: "确认下发到工单吗?",
                        callback: function (result) {
                            if (result) {
                                $.ajax({
                                    url: "../user/submitWorkPlan",
                                    method: "POST",
                                    data: "ids=" + JSON.stringify(ids)
                                }).success(function (data) {
                                    toastr.success("下发成功");
                                    dtTable.ajax.reload();
                                    clearTreeContainer();
                                }).fail(function () {
                                    toastr.fail("下发失败");
                                });
                            }
                        }
                    }
                )
            })
            $('.main .arrangeBtn').on('click', function (e) {
                e.preventDefault();
                var trs = $('tbody', $table).find("tr:has(input:checked)");
                if (trs.length == 0) {
                    bootboxError("请选择一条作业计划");
                    return;
                }
                if (trs.length > 1) {
                    bootboxError("只能选择一条作业计划");
                    return;
                }
                if ($(trs[0]).attr("status") == "已下发" || $(trs[0]).attr("status") == "已完工") {
                    bootboxError("不能安排状态为" + $(trs[0]).attr("status") + "的生产计划");
                    return;
                }
                index = 1;
                $(".arrange .modal-body").hide();
                $(".arrange .gxq_scyq_jxyl_jssx").hide();
                $(".arrange .gxq_scyq_jxyl_jsgx").hide();
                $(".arrange .gxq_scyq_jxyl_bjsx").hide();
                $(".arrange .gxq_scyq_jxyl_yz").hide();
                $(".arrange .gxq_scyq_jxyl_zxg").hide();
                $(".arrange .gxq_scyq_jxyl_wg").hide();
                $(".arrange .gxq_scyq_jxyl_zjp").hide();
                $(".arrange .gxq_scyq_jxyl_xwx").hide();
                $(".arrange .gxq_sjcl").hide();
                $(".arrange .gxq_sjcl_bhgp").hide();
                $(".arrange .gxh_scyq_jxyl_jssx_index").hide();
                $(".arrange .gxh_scyq_jxyl_jsgx_index").hide();
                $(".arrange .gxh_scyq_jxyl_bjsx_index").hide();
                $(".arrange .gxh_scyq_jxyl_yz_index").hide();
                $(".arrange .gxh_scyq_jxyl_zxg_index").hide();
                $(".arrange .gxh_scyq_jxyl_wg_index").hide();
                $(".arrange .gxh_scyq_jxyl_zjp_index").hide();
                $(".arrange .gxh_scyq_jxyl_xwx_index").hide();
                $(".arrange .gxq_scyq_jxyl_g").remove();
                $(".arrange .gxh_scyq_jxyl_g_index").remove();
                $(".arrange .gxh_accordion[id!=gxh_accordion_index]").remove();
                $(".arrange #gxh_accordion_index").show();
                $(".arrange #submit").hide();
                $(".arrange #submit").removeProp("disabled");
                $(".arrange #cancel").removeProp("disabled");
                $(".arrange .collapse").collapse("hide");
                $(".arrange .gxh_caption").text("安排机台后");
                $(".arrange").modal(
                    {
                        backdrop: "static",
                        keyborad: false
                    }
                );
                gxqFpjtDtTable.fnClearTable();
                gxqScyqCpyqGdcpDtTable.fnClearTable();
                $(".arrange #gxq_scyq_cpyq_sxfs .dataTables_wrapper").empty();
                gxqScyqJxylXwxGgDtTable.fnClearTable();
                gxqScyqJxylXwxYlDtTable.fnClearTable();
                gxqScyqJxylYzGgDtTable.fnClearTable();
                gxqScyqJxylYzYlDtTable.fnClearTable();
                gxqScyqJxylJssxGgDtTable.fnClearTable();
                gxqScyqJxylJsgxYlDtTable.fnClearTable();
                gxqScyqJxylBjsxGgDtTable.fnClearTable();
                gxqScyqJxylBjsxYlDtTable.fnClearTable();
                gxqScyqJxylZxgGgDtTable.fnClearTable();
                gxqScyqJxylZxgYlDtTable.fnClearTable();
                gxqScyqJxylWgGgDtTable.fnClearTable();
                gxqScyqJxylWgYlDtTable.fnClearTable();
                gxqScyqJxylZjpGgDtTable.fnClearTable();
                gxqScyqJxylZjpYlDtTable.fnClearTable();
                gxqSjclLjwcclSxfsDtTable.fnClearTable();
                gxqSjclWwcclSxfsDtTable.fnClearTable();
                gxqSjclRclSxfsDtTable.fnClearTable();
                gxqSjclBhgpSxfsDtTable.fnClearTable();
                gxhFpjtDtTable.fnClearTable();
                $(".arrange #gxh_scyq_cpyq_sxfs .dataTables_wrapper").empty();
                gxhScyqCpyqGdcpDtTable.fnClearTable();
                gxhScyqJxylXwxGgDtTable.fnClearTable();
                gxhScyqJxylYzGgDtTable.fnClearTable();
                gxhScyqJxylJssxGgDtTable.fnClearTable();
                gxhScyqJxylJsgxGgDtTable.fnClearTable();
                gxhScyqJxylBjsxGgDtTable.fnClearTable();
                gxhScyqJxylZxgGgDtTable.fnClearTable();
                gxhScyqJxylWgGgDtTable.fnClearTable();
                gxhScyqJxylZjpGgDtTable.fnClearTable();
                $.getJSON("../user/formInstById?id=" + $(trs[0]).attr("id"), function (data) {
                    cache = {};
                    arrangeData = data;
                    gExist = getFromNode("gcs", data, "scyq.jxyl") ? true : false;
                    jssxExist = checkNodeExist(data, "scyq.jxyl.jssx");
                    jsgxExist = checkNodeExist(data, "scyq.jxyl.jsgx");
                    bjsxExist = checkNodeExist(data, "scyq.jxyl.bjsx");
                    zxgExist = checkNodeExist(data, "scyq.jxyl.zxg");
                    wgExist = checkNodeExist(data, "scyq.jxyl.wg");
                    zjpExist = checkNodeExist(data, "scyq.jxyl.zjp");
                    if (zjpExist)zjpText = getFromNode("text", data, "scyq.jxyl.zjp");
                    xwxExist = checkNodeExist(data, "scyq.jxyl.xwx");
                    yzExist = checkNodeExist(data, "scyq.jxyl.yz");
                    getFromNode("value", data, "scyq.cpyq.gdcp.lb") == "钢丝绳" ? isGss = true : isGss = false;
                    sjclExist = checkNodeExist(data, "sjcl");
                    if (sjclExist) $(".arrange .gxh_caption").text("剩余待生产产量安排到机台");
                    if (sjclExist) {
                        var sxfss = getFromNode("sxfss", data, "scyq.cpyq.sxfs");
                        for (var i = sxfss.begin; i < sxfss.begin + sxfss.total; i++) {
                            if (checkNodeExist(data, "sjcl.ljwccl.sxfs" + i)) {
                                gxqSjclLjwcclSxfsDtTable.fnAddData([
                                    getFromNode("value", data, "scyq.cpyq.sxfs.sxfs" + i + ".djmc"),
                                    getFromNode("value", data, "sjcl.ljwccl.sxfs" + i + ".zjs"),
                                    getFromNode("value", data, "sjcl.ljwccl.sxfs" + i + ".zmc"),
                                ]);
                            }
                            if (checkNodeExist(data, "sjcl.wwccl.sxfs" + i)) {
                                gxqSjclWwcclSxfsDtTable.fnAddData([
                                    getFromNode("value", data, "scyq.cpyq.sxfs.sxfs" + i + ".djmc"),
                                    getFromNode("value", data, "sjcl.wwccl.sxfs" + i + ".zjs"),
                                    getFromNode("value", data, "sjcl.wwccl.sxfs" + i + ".zmc"),
                                ]);
                            }
                        }
                        if (checkNodeExist(data, "sjcl.bhgp")) {
                            for (var i = sxfss.begin; i < sxfss.begin + sxfss.total; i++) {
                                if (checkNodeExist(data, "sjcl.bhgp.sxfs" + i)) {
                                    gxqSjclBhgpSxfsDtTable.fnAddData([
                                        getFromNode("value", data, "scyq.cpyq.sxfs.sxfs" + i + ".djmc"),
                                        getFromNode("value", data, "sjcl.bhgp.sxfs" + i + ".zjs"),
                                        getFromNode("value", data, "sjcl.bhgp.sxfs" + i + ".zmc"),
                                    ]);
                                }
                            }
                            $(".arrange .gxq_sjcl_bhgp").show();
                        }
                        for (var i = 0; i < getFromNode("json", data, "sjcl.rcl").children.length; i++) {
                            for (var j = sxfss.begin; j < sxfss.begin + sxfss.total; j++) {
                                if (checkNodeExist(data, "sjcl.rcl." + getFromNode("json", data, "sjcl.rcl").children[i].text +
                                        ".sxfs" + j)) {
                                    gxqSjclRclSxfsDtTable.fnAddData([
                                        getFromNode("json", data, "sjcl.rcl").children[i].text,
                                        getFromNode("value", data, "scyq.cpyq.sxfs.sxfs" + j + ".djmc"),
                                        getFromNode("value", data, "sjcl.rcl." +
                                            getFromNode("json", data, "sjcl.rcl").children[i].text + ".sxfs" + j + ".zjs"),
                                        getFromNode("value", data, "sjcl.rcl." +
                                            getFromNode("json", data, "sjcl.rcl").children[i].text + ".sxfs" + j + ".zmc")
                                    ]);
                                }
                            }
                        }
                        $(".arrange .gxq_sjcl").show();
                    }
                    if (gExist) {
                        var gcs = getFromNode("gcs", data, "scyq.jxyl");
                        for (var i = gcs.begin; i < gcs.begin + gcs.total; i++) {
                            var qHtml = "";
                            var hHtml = "";
                            qHtml += "<div class='panel panel-default gxq_scyq_jxyl_g gxq_scyq_jxyl_gdc";
                            hHtml += "<div class='panel panel-default gxh_scyq_jxyl_g_index gxh_scyq_jxyl_gdc";
                            qHtml += i;
                            hHtml += i;
                            qHtml += "'>";
                            hHtml += "_index'>";
                            qHtml += "<div class='panel-heading'>";
                            hHtml += "<div class='panel-heading'>";
                            qHtml += "<div class='panel-title' style='font-size:14px'>";
                            hHtml += "<div class='panel-title' style='font-size:14px'>";
                            qHtml += "<a class='accordion-toggle accordion-toggle-styled collapsed' data-toggle='collapse' ";
                            hHtml += "<a class='accordion-toggle accordion-toggle-styled collapsed' data-toggle='collapse' ";
                            qHtml += "href='#gxq_scyq_jxyl_gdc";
                            hHtml += "href='#gxh_scyq_jxyl_gdc";
                            qHtml += i;
                            hHtml += i;
                            qHtml += "' style='font-size:14px;font-weight:bold'>";
                            hHtml += "_index' style='font-size:14px;font-weight:bold'>";
                            qHtml += getFromNode("text", data, "scyq.jxyl.gdc" + i);
                            hHtml += getFromNode("text", data, "scyq.jxyl.gdc" + i);
                            qHtml += "</a>";
                            hHtml += "</a>";
                            qHtml += "</div>";
                            hHtml += "</div>";
                            qHtml += "</div>";
                            hHtml += "</div>";
                            qHtml += "<div class='panel-collapse collapse' id='gxq_scyq_jxyl_gdc";
                            hHtml += "<div class='panel-collapse collapse' id='gxh_scyq_jxyl_gdc";
                            qHtml += i;
                            hHtml += i;
                            qHtml += "'>";
                            hHtml += "_index'>";
                            qHtml += "<div class='panel-body'>";
                            hHtml += "<div class='panel-body'>";
                            qHtml += "<div class='panel-group accordion'>";
                            hHtml += "<div class='panel-group accordion'>";
                            var gs = getFromNode("gs", data, "scyq.jxyl.gdc" + i);
                            for (var j = gs.begin; j < gs.begin + gs.total; j++) {
                                qHtml += "<div class='panel panel-default'>";
                                hHtml += "<div class='panel panel-default'>";
                                qHtml += "<div class='panel-heading'>";
                                hHtml += "<div class='panel-heading'>";
                                qHtml += "<div class='panel-title' style='font-size:14px'>";
                                hHtml += "<div class='panel-title' style='font-size:14px'>";
                                qHtml += "<a class='accordion-toggle accordion-toggle-styled collapsed' data-toggle='collapse' ";
                                hHtml += "<a class='accordion-toggle accordion-toggle-styled collapsed' data-toggle='collapse' ";
                                qHtml += "href='#gxq_scyq_jxyl_gdc";
                                hHtml += "href='#gxh_scyq_jxyl_gdc";
                                qHtml += i;
                                hHtml += i;
                                qHtml += "_g";
                                hHtml += "_g";
                                qHtml += j;
                                hHtml += j;
                                qHtml += "' style='font-size:14px;font-weight:bold'>";
                                hHtml += "_index' style='font-size:14px;font-weight:bold'>";
                                qHtml += getFromNode("text", data, "scyq.jxyl.gdc" + i + ".g" + j);
                                hHtml += getFromNode("text", data, "scyq.jxyl.gdc" + i + ".g" + j);
                                qHtml += "</a>";
                                hHtml += "</a>";
                                qHtml += "</div>";
                                hHtml += "</div>";
                                qHtml += "</div>";
                                hHtml += "</div>";
                                qHtml += "<div class='panel-collapse collapse' id='gxq_scyq_jxyl_gdc";
                                hHtml += "<div class='panel-collapse collapse' id='gxh_scyq_jxyl_gdc";
                                qHtml += i;
                                hHtml += i;
                                qHtml += "_g";
                                hHtml += "_g";
                                qHtml += j;
                                hHtml += j;
                                qHtml += "'>";
                                hHtml += "_index'>";
                                qHtml += "<div class='panel-body'>";
                                hHtml += "<div class='panel-body'>";
                                qHtml += "<div class='panel-group accordion'>";
                                hHtml += "<div class='panel-group accordion'>";
                                qHtml += "<div class='panel panel-default'>";
                                hHtml += "<div class='panel panel-default'>";
                                qHtml += "<div class='panel-heading'>";
                                hHtml += "<div class='panel-heading'>";
                                qHtml += "<div class='panel-title' style='font-size:14px'>";
                                hHtml += "<div class='panel-title' style='font-size:14px'>";
                                qHtml += "<a class='accordion-toggle accordion-toggle-styled collapsed' data-toggle='collapse' ";
                                hHtml += "<a class='accordion-toggle accordion-toggle-styled collapsed' data-toggle='collapse' ";
                                qHtml += "href='#gxq_scyq_jxyl_gdc";
                                hHtml += "href='#gxh_scyq_jxyl_gdc";
                                qHtml += i;
                                hHtml += i;
                                qHtml += "_g";
                                hHtml += "_g";
                                qHtml += j;
                                hHtml += j;
                                qHtml += "_gg";
                                hHtml += "_gg";
                                qHtml += "' style='font-size:14px;font-weight:bold'>";
                                hHtml += "_index' style='font-size:14px;font-weight:bold'>";
                                qHtml += "规格</a>";
                                hHtml += "规格</a>";
                                qHtml += "</div>";
                                hHtml += "</div>";
                                qHtml += "</div>";
                                hHtml += "</div>";
                                qHtml += "<div class='panel-collapse collapse' id='gxq_scyq_jxyl_gdc";
                                hHtml += "<div class='panel-collapse collapse' id='gxh_scyq_jxyl_gdc";
                                qHtml += i;
                                hHtml += i;
                                qHtml += "_g";
                                hHtml += "_g";
                                qHtml += j;
                                hHtml += j;
                                qHtml += "_gg'>";
                                hHtml += "_gg_index'>";
                                qHtml += "<div class='panel-body'>";
                                hHtml += "<div class='panel-body'>";
                                qHtml += "<div class='dataTables_wrapper no-footer'>";
                                hHtml += "<div class='dataTables_wrapper no-footer'>";
                                qHtml += "<table class='table table-striped table-hover table-bordered dataTable no-footer ";
                                hHtml += "<table class='table table-striped table-hover table-bordered dataTable no-footer ";
                                qHtml += "gxq_scyq_jxyl_gdc";
                                hHtml += "gxh_scyq_jxyl_gdc";
                                qHtml += i;
                                hHtml += i;
                                qHtml += "_g";
                                hHtml += "_g";
                                qHtml += j;
                                hHtml += j;
                                qHtml += "_gg'>";
                                hHtml += "_gg_index'>";
                                qHtml += "<thead>";
                                hHtml += "<thead>";
                                qHtml += "<tr role='row'>";
                                hHtml += "<tr role='row'>";
                                qHtml += "<th tabindex='0',rowspan='1', colspan='1'> 结构</th>";
                                hHtml += "<th tabindex='0',rowspan='1', colspan='1'> 结构</th>";
                                qHtml += "<th tabindex='0',rowspan='1', colspan='1'> 直径(mm)</th>";
                                hHtml += "<th tabindex='0',rowspan='1', colspan='1'> 直径(mm)</th>";
                                qHtml += "<th tabindex='0',rowspan='1', colspan='1'> 捻向</th>";
                                hHtml += "<th tabindex='0',rowspan='1', colspan='1'> 捻向</th>";
                                qHtml += "<th tabindex='0',rowspan='1', colspan='1'> 强度(MPa)</th>";
                                hHtml += "<th tabindex='0',rowspan='1', colspan='1'> 强度(MPa)</th>";
                                qHtml += "<th tabindex='0',rowspan='1', colspan='1'> 涂油方式</th>";
                                hHtml += "<th tabindex='0',rowspan='1', colspan='1'> 涂油方式</th>";
                                qHtml += "<th tabindex='0',rowspan='1', colspan='1'> 捻距(mm)</th>";
                                hHtml += "<th tabindex='0',rowspan='1', colspan='1'> 捻距(mm)</th>";
                                qHtml += "<th tabindex='0',rowspan='1', colspan='1'> 表面状态</th>";
                                hHtml += "<th tabindex='0',rowspan='1', colspan='1'> 表面状态</th>";
                                qHtml += "</tr>";
                                hHtml += "</tr>";
                                qHtml += "</thead>";
                                hHtml += "</thead>";
                                qHtml += "</table>";
                                hHtml += "</table>";
                                qHtml += "</div>";
                                hHtml += "</div>";
                                qHtml += "</div>";
                                hHtml += "</div>";
                                qHtml += "</div>";
                                hHtml += "</div>";
                                qHtml += "</div>";
                                hHtml += "</div>";
                                qHtml += "<div class='panel panel-default'>";
                                hHtml += "<div class='panel panel-default'>";
                                qHtml += "<div class='panel-heading'>";
                                hHtml += "<div class='panel-heading'>";
                                qHtml += "<div class='panel-title' style='font-size:14px'>";
                                hHtml += "<div class='panel-title' style='font-size:14px'>";
                                qHtml += "<a class='accordion-toggle accordion-toggle-styled collapsed' data-toggle='collapse' ";
                                hHtml += "<a class='accordion-toggle accordion-toggle-styled collapsed' data-toggle='collapse' ";
                                qHtml += "href='#gxq_scyq_jxyl_gdc";
                                hHtml += "href='#gxh_scyq_jxyl_gdc";
                                qHtml += i;
                                hHtml += i;
                                qHtml += "_g";
                                hHtml += "_g";
                                qHtml += j;
                                hHtml += j;
                                qHtml += "_yl";
                                hHtml += "_yl_index";
                                qHtml += "' style='font-size:14px;font-weight:bold'>";
                                hHtml += "' style='font-size:14px;font-weight:bold'>";
                                qHtml += "用量</a>";
                                hHtml += "用量</a>";
                                qHtml += "</div>";
                                hHtml += "</div>";
                                qHtml += "</div>";
                                hHtml += "</div>";
                                qHtml += "<div class='panel-collapse collapse' id='gxq_scyq_jxyl_gdc";
                                hHtml += "<div class='panel-collapse collapse' id='gxh_scyq_jxyl_gdc";
                                qHtml += i;
                                hHtml += i;
                                qHtml += "_g";
                                hHtml += "_g";
                                qHtml += j;
                                hHtml += j;
                                qHtml += "_yl'>";
                                hHtml += "_yl_index'>";
                                qHtml += "<div class='panel-body'>";
                                hHtml += "<div class='panel-body'>";
                                qHtml += "<div class='dataTables_wrapper no-footer'>";
                                hHtml += "<div class='dataTables_wrapper no-footer'>";
                                qHtml += "<table class='table table-striped table-hover table-bordered dataTable no-footer ";
                                hHtml += "<table class='table table-striped table-hover table-bordered dataTable no-footer ";
                                qHtml += "gxq_scyq_jxyl_gdc";
                                hHtml += "gxh_scyq_jxyl_gdc";
                                qHtml += i;
                                hHtml += i;
                                qHtml += "_g";
                                hHtml += "_g";
                                qHtml += j;
                                hHtml += j;
                                qHtml += "_yl'>";
                                hHtml += "_yl_index'>";
                                qHtml += "<thead>";
                                hHtml += "<thead>";
                                qHtml += "<tr role='row'>";
                                hHtml += "<tr role='row'>";
                                qHtml += "<th tabindex='0' rowspan='1'  colspan='1'> 个数</th>";
                                hHtml += "<th tabindex='0' rowspan='1'  colspan='1'> 个数</th>";
                                qHtml += "<th tabindex='0' rowspan='1'  colspan='1'> 段长(m)</th>";
                                hHtml += "<th tabindex='0' rowspan='1'  colspan='1'> 段长(m)</th>";
                                qHtml += "<th tabindex='0' rowspan='1'  colspan='1'> 段数</th>";
                                hHtml += "<th tabindex='0' rowspan='1'  colspan='1'> 段数</th>";
                                qHtml += "<th tabindex='0' rowspan='1'  colspan='1'> 单件米长(m)</th>";
                                hHtml += "<th tabindex='0' rowspan='1'  colspan='1'> 单件米长(m)</th>";
                                qHtml += "<th tabindex='0' rowspan='1'  colspan='1'> 单件损耗(m)</th>";
                                hHtml += "<th tabindex='0' rowspan='1'  colspan='1'> 单件损耗(m)</th>";
                                qHtml += "<th tabindex='0' rowspan='1'  colspan='1'> 单件需求米长(m)</th>";
                                hHtml += "<th tabindex='0' rowspan='1'  colspan='1'> 单件需求米长(m)</th>";
                                qHtml += "<th tabindex='0' rowspan='1'  colspan='1'> 件数</th>";
                                hHtml += "<th tabindex='0' rowspan='1'  colspan='1'> 件数</th>";
                                qHtml += "<th tabindex='0' rowspan='1'  colspan='1'> 总米长(m)</th>";
                                hHtml += "<th tabindex='0' rowspan='1'  colspan='1'> 总米长(m)</th>";
                                qHtml += "<th tabindex='0' rowspan='1'  colspan='1'> 总损耗(m)</th>";
                                hHtml += "<th tabindex='0' rowspan='1'  colspan='1'> 总损耗(m)</th>";
                                qHtml += "<th tabindex='0' rowspan='1'  colspan='1'> 总需求米长(m)</th>";
                                hHtml += "<th tabindex='0' rowspan='1'  colspan='1'> 总需求米长(m)</th>";
                                qHtml += "<th tabindex='0' rowspan='1'  colspan='1'> 工字轮型号</th>";
                                hHtml += "<th tabindex='0' rowspan='1'  colspan='1'> 工字轮型号</th>";
                                hHtml += "<th tabindex='0' rowspan='1'  colspan='1'> 操作</th>";
                                qHtml += "</tr>";
                                hHtml += "</tr>";
                                qHtml += "</thead>";
                                hHtml += "</thead>";
                                qHtml += "</table>";
                                hHtml += "</table>";
                                qHtml += "</div>";
                                hHtml += "</div>";
                                hHtml += "<div class='table-toolbar'>";
                                hHtml += "<div class='row'>";
                                hHtml += "<div class='col-md-1' style='float:right'>";
                                hHtml += "<div class='btn-group'>";
                                hHtml += "<button class='btn btn-sm green add' style='right:25px'>";
                                hHtml += "<i class='fa fa-plus'>";
                                hHtml += "<span>";
                                hHtml += "添加";
                                hHtml += "</span>";
                                hHtml += "</i>";
                                hHtml += "</button>";
                                hHtml += "</div>";
                                hHtml += "</div>";
                                hHtml += "</div>";
                                hHtml += "</div>";
                                qHtml += "</div>";
                                hHtml += "</div>";
                                qHtml += "</div>";
                                hHtml += "</div>";
                                qHtml += "</div>";
                                hHtml += "</div>";
                                qHtml += "</div>";
                                hHtml += "</div>";
                                qHtml += "</div>";
                                hHtml += "</div>";
                                qHtml += "</div>";
                                hHtml += "</div>";
                                qHtml += "</div>";
                                hHtml += "</div>";
                            }
                            qHtml += "</div>";
                            hHtml += "</div>";
                            qHtml += "</div>";
                            hHtml += "</div>";
                            qHtml += "</div>";
                            hHtml += "</div>";
                            qHtml += "</div>";
                            hHtml += "</div>";
                            $(".arrange #gxq_scyq_jxyl_accordion").append(qHtml);
                            $(".arrange #gxh_scyq_jxyl_accordion_index").append(hHtml);
                        }
                    }
                    if (jssxExist) {
                        $(".arrange #gxh_scyq_jxyl_jssx_yl_index .dataTables_wrapper.no-footer").empty();
                        var html = "";
                        html += "<table class='table table-striped table-hover table-bordered dataTable no-footer gxh_scyq_jxyl_jssx_yl_index'>";
                        html += "<thead>";
                        html += "<tr role='row'>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 段长(m)</th>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 段数</th>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 单件米长(m)</th>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 单件损耗(m)</th>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 单件需求米长(m)</th>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 件数</th>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 总米长(m)</th>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 总损耗(m)</th>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 总需求米长(m)</th>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 工字轮型号</th>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 操作</th>";
                        html += "</tr>";
                        html += "</thead>";
                        html += "</table>";
                        $(".arrange .gxq_scyq_jxyl_jssx").show();
                        $(".arrange .gxh_scyq_jxyl_jssx_index").show();
                        $(".arrange #gxh_scyq_jxyl_jssx_yl_index .dataTables_wrapper.no-footer").html(html);
                    }
                    if (jsgxExist) {
                        $(".arrange #gxh_scyq_jxyl_jsgx_yl_index .dataTables_wrapper.no-footer").empty();
                        var html = "";
                        html += "<table class='table table-striped table-hover table-bordered dataTable no-footer gxh_scyq_jxyl_jsgx_yl_index'>";
                        html += "<thead>";
                        html += "<tr role='row'>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 段长(m)</th>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 段数</th>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 单件米长(m)</th>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 单件损耗(m)</th>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 单件需求米长(m)</th>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 件数</th>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 总米长(m)</th>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 总损耗(m)</th>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 总需求米长(m)</th>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 工字轮型号</th>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 操作</th>";
                        html += "</tr>";
                        html += "</thead>";
                        html += "</table>";
                        $(".arrange .gxq_scyq_jxyl_jsgx").show();
                        $(".arrange .gxh_scyq_jxyl_jsgx_index").show();
                        $(".arrange #gxh_scyq_jxyl_jsgx_yl_index .dataTables_wrapper.no-footer").html(html);
                    }
                    if (bjsxExist) {
                        $(".arrange #gxh_scyq_jxyl_bjsx_yl_index .dataTables_wrapper.no-footer").empty();
                        var html = "";
                        html += "<table class='table table-striped table-hover table-bordered dataTable no-footer gxh_scyq_jxyl_bjsx_yl_index'>";
                        html += "<thead>";
                        html += "<tr role='row'>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 段长(m)</th>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 段数</th>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 单件米长(m)</th>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 单件损耗(m)</th>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 单件需求米长(m)</th>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 件数</th>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 总米长(m)</th>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 总损耗(m)</th>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 总需求米长(m)</th>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 工字轮型号</th>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 操作</th>";
                        html += "</tr>";
                        html += "</thead>";
                        html += "</table>";
                        $(".arrange .gxq_scyq_jxyl_bjsx").show();
                        $(".arrange .gxh_scyq_jxyl_bjsx_index").show();
                        $(".arrange #gxh_scyq_jxyl_bjsx_yl_index .dataTables_wrapper.no-footer").html(html);
                    }
                    if (zxgExist) {
                        $(".arrange #gxh_scyq_jxyl_zxg_yl_index .dataTables_wrapper.no-footer").empty();
                        var html = "";
                        html += "<table class='table table-striped table-hover table-bordered dataTable no-footer gxh_scyq_jxyl_zxg_yl_index'>";
                        html += "<thead>";
                        html += "<tr role='row'>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 段长(m)</th>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 段数</th>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 单件米长(m)</th>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 单件损耗(m)</th>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 单件需求米长(m)</th>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 件数</th>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 总米长(m)</th>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 总损耗(m)</th>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 总需求米长(m)</th>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 工字轮型号</th>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 操作</th>";
                        html += "</tr>";
                        html += "</thead>";
                        html += "</table>";
                        $(".arrange .gxq_scyq_jxyl_zxg").show();
                        $(".arrange .gxh_scyq_jxyl_zxg_index").show();
                        $(".arrange #gxh_scyq_jxyl_zxg_yl_index .dataTables_wrapper.no-footer").html(html);
                    }
                    if (wgExist) {
                        $(".arrange #gxh_scyq_jxyl_wg_yl_index .dataTables_wrapper.no-footer").empty();
                        var html = "";
                        html += "<table class='table table-striped table-hover table-bordered dataTable no-footer gxh_scyq_jxyl_wg_yl_index'>";
                        html += "<thead>";
                        html += "<tr role='row'>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 个数</th>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 段长(m)</th>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 段数</th>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 单件米长(m)</th>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 单件损耗(m)</th>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 单件需求米长(m)</th>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 件数</th>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 总米长(m)</th>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 总损耗(m)</th>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 总需求米长(m)</th>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 工字轮型号</th>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 操作</th>";
                        html += "</tr>";
                        html += "</thead>";
                        html += "</table>";
                        $(".arrange .gxq_scyq_jxyl_wg").show();
                        $(".arrange .gxh_scyq_jxyl_wg_index").show();
                        $(".arrange #gxh_scyq_jxyl_wg_yl_index .dataTables_wrapper.no-footer").html(html);
                    }
                    if (zjpExist) {
                        $(".arrange #gxh_scyq_jxyl_zjp_yl_index .dataTables_wrapper.no-footer").empty();
                        var html = "";
                        html += "<table class='table table-striped table-hover table-bordered dataTable no-footer gxh_scyq_jxyl_zjp_yl_index'>";
                        html += "<thead>";
                        html += "<tr role='row'>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 段长(m)</th>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 段数</th>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 单件米长(m)</th>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 单件损耗(m)</th>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 单件需求米长(m)</th>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 件数</th>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 总米长(m)</th>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 总损耗(m)</th>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 总需求米长(m)</th>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 工字轮型号</th>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 操作</th>";
                        html += "</tr>";
                        html += "</thead>";
                        html += "</table>";
                        $(".arrange .gxq_scyq_jxyl_zjp a[href='#gxq_scyq_jxyl_zjp']").text(zjpText);
                        $(".arrange .gxh_scyq_jxyl_zjp_index a[href='#gxh_scyq_jxyl_zjp_index']").text(zjpText);
                        $(".arrange .gxq_scyq_jxyl_zjp").show();
                        $(".arrange .gxh_scyq_jxyl_zjp_index").show();
                        $(".arrange #gxh_scyq_jxyl_zjp_yl_index .dataTables_wrapper.no-footer").html(html);
                    }
                    if (xwxExist) {
                        $(".arrange #gxh_scyq_jxyl_xwx_yl_index .dataTables_wrapper.no-footer").empty();
                        var html = "";
                        html += "<table class='table table-striped table-hover table-bordered dataTable no-footer gxh_scyq_jxyl_xwx_yl_index'>";
                        html += "<thead>";
                        html += "<tr role='row'>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 工艺米长系数</th>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 总米长(m)</th>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 吨耗(%)</th>";
                        html += "<th tabindex='0',rowspan='1', colspan='1'> 重量(kg)</th>";
                        html += "</tr>";
                        html += "</thead>";
                        html += "</table>";
                        $(".arrange .gxq_scyq_jxyl_xwx").show();
                        $(".arrange .gxh_scyq_jxyl_xwx_index").show();
                        $(".arrange #gxh_scyq_jxyl_xwx_yl_index .dataTables_wrapper.no-footer").html(html);
                    }
                    if (yzExist) {
                        $(".arrange #gxh_scyq_jxyl_yz_yl_index .dataTables_wrapper.no-footer").empty();
                        var html = "";
                        html += "<table class='table table-striped table-hover table-bordered dataTable no-footer gxh_scyq_jxyl_yz_yl_index'>";
                        html += "<thead>";
                        html += "<tr role='row'>";
                        html += "<th tabindex='0' rowspan='1' colspan='1'> 涂油方式</th>";
                        html += "<th tabindex='0' rowspan='1' colspan='1'> 吨耗(%)</th>";
                        html += "<th tabindex='0' rowspan='1' colspan='1'> 重量(kg)</th>";
                        html += "</tr>";
                        html += "</thead>";
                        html += "</table>";
                        $(".arrange .gxq_scyq_jxyl_yz").show();
                        $(".arrange .gxh_scyq_jxyl_yz_index").show();
                        $(".arrange #gxh_scyq_jxyl_yz_yl_index .dataTables_wrapper.no-footer").html(html);
                    }
                    var qHtml = "";
                    var hHtml = "";
                    qHtml += "<table class='table table-striped table-hover table-bordered dataTable no-footer gxq_scyq_cpyq_sxfs_";
                    hHtml += "<table class='table table-striped table-hover table-bordered dataTable no-footer gxh_scyq_cpyq_sxfs_";
                    qHtml += isGss ? "gss" : "not_gss";
                    hHtml += isGss ? "gss_index" : "not_gss_index";
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
                        qHtml += "<th tabindex='0' rowspan='1'  colspan='1'> 段长(m)</th>";
                        hHtml += "<th tabindex='0' rowspan='1'  colspan='1'> 段长(m)</th>";
                        qHtml += "<th tabindex='0' rowspan='1'  colspan='1'> 段数</th>";
                        hHtml += "<th tabindex='0' rowspan='1'  colspan='1'> 段数</th>";
                        qHtml += "<th tabindex='0' rowspan='1'  colspan='1'> 单件米长(m)</th>";
                        hHtml += "<th tabindex='0' rowspan='1'  colspan='1'> 单件米长(m)</th>";
                        qHtml += "<th tabindex='0' rowspan='1'  colspan='1'> 单件损耗(m)</th>";
                        hHtml += "<th tabindex='0' rowspan='1'  colspan='1'> 单件损耗(m)</th>";
                        qHtml += "<th tabindex='0' rowspan='1'  colspan='1'> 单件生产米长(m)</th>";
                        hHtml += "<th tabindex='0' rowspan='1'  colspan='1'> 单件生产米长(m)</th>";
                        qHtml += "<th tabindex='0' rowspan='1'  colspan='1'> 件数</th>";
                        hHtml += "<th tabindex='0' rowspan='1'  colspan='1'> 件数</th>";
                        qHtml += "<th tabindex='0' rowspan='1'  colspan='1'> 总米长(m)</th>";
                        hHtml += "<th tabindex='0' rowspan='1'  colspan='1'> 总米长(m)</th>";
                        qHtml += "<th tabindex='0' rowspan='1'  colspan='1'> 总损耗(m)</th>";
                        hHtml += "<th tabindex='0' rowspan='1'  colspan='1'> 总损耗(m)</th>";
                        qHtml += "<th tabindex='0' rowspan='1'  colspan='1'> 总生产米长(m)</th>";
                        hHtml += "<th tabindex='0' rowspan='1'  colspan='1'> 总生产米长(m)</th>";
                        qHtml += "<th tabindex='0' rowspan='1'  colspan='1'> 工字轮型号</th>";
                        hHtml += "<th tabindex='0' rowspan='1'  colspan='1'> 工字轮型号</th>";
                        hHtml += "<th tabindex='0' rowspan='1'  colspan='1'> 操作</th>";
                    }
                    qHtml += "</tr>";
                    hHtml += "</tr>";
                    qHtml += "</thead>";
                    hHtml += "</thead>";
                    qHtml += "</table>";
                    hHtml += "</table>";
                    $(".arrange #gxq_scyq_cpyq_sxfs .dataTables_wrapper.no-footer").html(qHtml);
                    $(".arrange #gxh_scyq_cpyq_sxfs_index .dataTables_wrapper.no-footer").html(hHtml);
                    $(".arrange #gxh_scyq_scsj_yjtcsj_index .dataTables_wrapper.no-footer").empty();
                    var html = "";
                    html += "<table class='table table-striped table-hover table-bordered dataTable no-footer gxh_scyq_scsj_yjtcsj_index'>";
                    html += "<thead>";
                    html += "<tr role='row'>";
                    html += "<th tabindex='0',rowspan='1', colspan='1'> 开始时间</th>";
                    html += "<th tabindex='0',rowspan='1', colspan='1'> 完成时间</th>";
                    html += "</tr>";
                    html += "</thead>";
                    html += "</table>";
                    $(".arrange #gxh_scyq_scsj_yjtcsj_index .dataTables_wrapper.no-footer").html(html);
                    $(".arrange #gxh_scyq_scsj_yjscsj_index .dataTables_wrapper.no-footer").empty();
                    var html = "";
                    html += "<table class='table table-striped table-hover table-bordered dataTable no-footer gxh_scyq_scsj_yjscsj_index'>";
                    html += "<thead>";
                    html += "<tr role='row'>";
                    html += "<th tabindex='0',rowspan='1', colspan='1'> 开始时间</th>";
                    html += "<th tabindex='0',rowspan='1', colspan='1'> 完成时间</th>";
                    html += "</tr>";
                    html += "</thead>";
                    html += "</table>";
                    $(".arrange #gxh_scyq_scsj_yjscsj_index .dataTables_wrapper.no-footer").html(html);
                    var rowValues = [];
                    var array = [
                        {"name": "xdrq"},
                        {"name": "gdzzh"},
                        {"name": "cj", "width": "100px"},
                        {"name": "jth", "width": "120px"},
                        {"name": "jtmcxs", "width": "80px"},
                        {"name": "bzz", "width": "200px"},
                        {"name": "czg", "width": "170px"}
                    ];
                    for (var i = 0; i < array.length; i++) {
                        rowValues.push(getFromNode("value", data, array[i].name) || "");
                    }
                    gxqFpjtDtTable.fnAddData(rowValues);
                    for (var i = 0; i < rowValues.length; i++) {
                        if (array[i].name != "xdrq" && array[i].name != "gdzzh") {
                            if (array[i].name == "jth" || array[i].name == "bzz" || array[i].name == "czg" ||
                                array[i].name == "cj") {
                                rowValues[i] = "<select class='form-control' style='width:" + array[i].width +
                                    "' name='" + array[i].name + "' />";
                            }
                            else {
                                rowValues[i] = "<input type='text' class='form-control' style='width:" + array[i].width +
                                    "' name='" + array[i].name + "' value='" + (sjclExist ? "" : rowValues[i]) + "' />";
                            }
                        }
                    }
                    rowValues.push("<button class='btn btn-sm blue detail'>明细</button>");
                    var t = gxhFpjtDtTable.fnAddData(rowValues);
                    $(gxhFpjtDtTable.fnSettings().aoData[t].nTr).addClass("selected");
                    $(gxhFpjtDtTable.fnSettings().aoData[t].nTr).attr("index", "index");
                    $($(gxhFpjtDtTable.fnSettings().aoData[t].nTr).find("select[name=jth]")).html(jthHtml).select2(select2Option).select2("val", (sjclExist ? "" : (getFromNode("_id", data, "jth") || "")));
                    $($(gxhFpjtDtTable.fnSettings().aoData[t].nTr).find("select[name=bzz]")).html(bzzHtml).select2(select2Option).select2("val", (sjclExist ? "" : (getFromNode("_id", data, "bzz") || "")));
                    $($(gxhFpjtDtTable.fnSettings().aoData[t].nTr).find("select[name=czg]")).html(czgHtml).select2(select2Option).select2("val", (sjclExist ? "" : (getFromNode("_id", data, "czg") || "")));
                    $($(gxhFpjtDtTable.fnSettings().aoData[t].nTr).find("select[name=cj]")).html(cjHtml).select2(select2Option).select2("val", (sjclExist ? "" : (getFromNode("value", data, "cj") || "")));
                    $gxqScyqCpyqGdcpTable.find("th[name='jg/gg']").text(isGss ? "规格" : "结构");
                    $gxhScyqCpyqGdcpTable.find("th[name='jg/gg']").text(isGss ? "规格" : "结构");
                    var rowValues = [];
                    var array = ["lb", isGss ? "gg" : "jg", "zj", "nx", "qd", "tyfs", "nj", "bmzt", "tsyq", "yt"];
                    for (var i = 0; i < array.length; i++) {
                        rowValues.push(getFromNode("value", data, "scyq.cpyq.gdcp." + array[i]) || "");
                    }
                    gxqScyqCpyqGdcpDtTable.fnAddData(rowValues);
                    gxhScyqCpyqGdcpDtTable.fnAddData(rowValues);
                    var sxfss = getFromNode("sxfss", data, "scyq.cpyq.sxfs");
                    var array;
                    if (isGss) {
                        array = ["djmc", "js", "zmc", "bzfs", "lpxh"];
                    } else {
                        array = ["dc", "ds", "djmc", "djsh", "djscmc", "js", "zmc", "zsh", "zscmc", "gzlxh"];
                    }
                    var gxhScyqCpyqSxfsData = [];
                    var gxqScyqCpyqSxfsDtTable = $(".arrange #gxq_scyq_cpyq_sxfs .dataTable").dataTable(datatableOption);
                    for (var i = sxfss.begin; i < sxfss.begin + sxfss.total; i++) {
                        var rowValues = [];
                        for (var j = 0; j < array.length; j++) {
                            rowValues.push(getFromNode("value", data, "scyq.cpyq.sxfs.sxfs" + i + "." + array[j]) || "");
                        }
                        gxqScyqCpyqSxfsDtTable.fnAddData(rowValues);
                        for (var j = 0; j < rowValues.length; j++) {
                            rowValues[j] = "<input type='text' class='form-control input-sm' name='" + array[j] +
                                "' value='" + rowValues[j] + "' ";
                            if (isGss) {
                                if (array[j] == "zmc") {
                                    rowValues[j] += "disabled";
                                }
                            }
                            else {
                                if (array[j] == "djmc" ||
                                    array[j] == "djscmc" ||
                                    array[j] == "zmc" ||
                                    array[j] == "zsh" ||
                                    array[j] == "zscmc") {
                                    rowValues[j] += "disabled";
                                }
                            }
                            rowValues[j] += " />";
                        }
                        rowValues.push("<button class='btn btn-sm red'>删除</button>");
                        gxhScyqCpyqSxfsData.push(rowValues);
                    }
                    var gxhScyqJxylJssxYlData = [];
                    if (jssxExist) {
                        var rowValues = [];
                        var array = ["jg", "zj", "nx", "qd", "tyfs", "nj", "bmzt"];
                        for (var i = 0; i < array.length; i++) {
                            rowValues.push(getFromNode("value", data, "scyq.jxyl.jssx.gg." + array[i]) || "");
                        }
                        gxqScyqJxylJssxGgDtTable.fnAddData(rowValues);
                        gxhScyqJxylJssxGgDtTable.fnAddData(rowValues);
                        var yls = getFromNode("yls", data, "scyq.jxyl.jssx.yl");
                        for (var i = yls.begin; i < yls.begin + yls.total; i++) {
                            var rowValues = [];
                            var array = ["dc", "ds", "djmc", "djsh", "djxqmc", "js", "zmc", "zsh", "zxqmc", "gzlxh"];
                            for (j = 0; j < array.length; j++) {
                                rowValues.push(getFromNode("value", data, "scyq.jxyl.jssx.yl.yl" + i + "." + array[j]) || "");
                            }
                            gxqScyqJxylJssxYlDtTable.fnAddData(rowValues);
                            for (var j = 0; j < rowValues.length; j++) {
                                rowValues[j] = "<input type='text' class='form-control input-sm' name='" + array[j] +
                                    "' value='" + rowValues[j] + "' ";
                                if (array[j] == "djmc" ||
                                    array[j] == "djxqmc" ||
                                    array[j] == "zmc" ||
                                    array[j] == "zsh" ||
                                    array[j] == "zxqmc") {
                                    rowValues[j] += "disabled";
                                }
                                rowValues[j] += " />";
                            }
                            rowValues.push("<button class='btn btn-sm red'>删除</button>");
                            gxhScyqJxylJssxYlData.push(rowValues);
                        }
                    }
                    var gxhScyqJxylJsgxYlData = [];
                    if (jsgxExist) {
                        var rowValues = [];
                        var array = ["jg", "zj", "nx", "qd", "tyfs", "nj", "bmzt"];
                        for (var i = 0; i < array.length; i++) {
                            rowValues.push(getFromNode("value", data, "scyq.jxyl.jsgx.gg." + array[i]) || "");
                        }
                        gxqScyqJxylJsgxGgDtTable.fnAddData(rowValues);
                        gxhScyqJxylJsgxGgDtTable.fnAddData(rowValues);
                        var yls = getFromNode("yls", data, "scyq.jxyl.jsgx.yl");
                        for (var i = yls.begin; i < yls.begin + yls.total; i++) {
                            var rowValues = [];
                            var array = ["dc", "ds", "djmc", "djsh", "djxqmc", "js", "zmc", "zsh", "zxqmc", "gzlxh"];
                            for (j = 0; j < array.length; j++) {
                                rowValues.push(getFromNode("value", data, "scyq.jxyl.jsgx.yl.yl" + i + "." + array[j]) || "");
                            }
                            gxqScyqJxylJsgxYlDtTable.fnAddData(rowValues);
                            for (var j = 0; j < rowValues.length; j++) {
                                rowValues[j] = "<input type='text' class='form-control input-sm' name='" + array[j] +
                                    "' value='" + rowValues[j] + "' ";
                                if (array[j] == "djmc" ||
                                    array[j] == "djxqmc" ||
                                    array[j] == "zmc" ||
                                    array[j] == "zsh" ||
                                    array[j] == "zxqmc") {
                                    rowValues[j] += "disabled";
                                }
                                rowValues[j] += " />";
                            }
                            rowValues.push("<button class='btn btn-sm red'>删除</button>");
                            gxhScyqJxylJsgxYlData.push(rowValues);
                        }
                    }
                    var gxhScyqJxylBjsxYlData = [];
                    if (bjsxExist) {
                        var rowValues = [];
                        var array = ["jg", "zj", "nx", "qd", "tyfs", "nj", "bmzt"];
                        for (var i = 0; i < array.length; i++) {
                            rowValues.push(getFromNode("value", data, "scyq.jxyl.bjsx.gg." + array[i]) || "");
                        }
                        gxqScyqJxylBjsxGgDtTable.fnAddData(rowValues);
                        gxhScyqJxylBjsxGgDtTable.fnAddData(rowValues);
                        var yls = getFromNode("yls", data, "scyq.jxyl.bjsx.yl");
                        for (var i = yls.begin; i < yls.begin + yls.total; i++) {
                            var rowValues = [];
                            var array = ["dc", "ds", "djmc", "djsh", "djxqmc", "js", "zmc", "zsh", "zxqmc", "gzlxh"];
                            for (j = 0; j < array.length; j++) {
                                rowValues.push(getFromNode("value", data, "scyq.jxyl.bjsx.yl.yl" + i + "." + array[j]) || "");
                            }
                            gxqScyqJxylBjsxYlDtTable.fnAddData(rowValues);
                            for (var j = 0; j < rowValues.length; j++) {
                                rowValues[j] = "<input type='text' class='form-control input-sm' name='" + array[j] +
                                    "' value='" + rowValues[j] + "' ";
                                if (array[j] == "djmc" ||
                                    array[j] == "djxqmc" ||
                                    array[j] == "zmc" ||
                                    array[j] == "zsh" ||
                                    array[j] == "zxqmc") {
                                    rowValues[j] += "disabled";
                                }
                                rowValues[j] += " />";
                            }
                            rowValues.push("<button class='btn btn-sm red'>删除</button>");
                            gxhScyqJxylBjsxYlData.push(rowValues);
                        }
                    }
                    var gxhScyqJxylWgYlData = [];
                    if (wgExist) {
                        var rowValues = [];
                        var array = ["jg", "zj", "nx", "qd", "tyfs", "nj", "bmzt"];
                        for (var i = 0; i < array.length; i++) {
                            rowValues.push(getFromNode("value", data, "scyq.jxyl.wg.gg." + array[i]) || "");
                        }
                        gxqScyqJxylWgGgDtTable.fnAddData(rowValues);
                        gxhScyqJxylWgGgDtTable.fnAddData(rowValues);
                        var yls = getFromNode("yls", data, "scyq.jxyl.wg.yl");
                        for (var i = yls.begin; i < yls.begin + yls.total; i++) {
                            var rowValues = [];
                            var array = ["dc", "ds", "djmc", "djsh", "djxqmc", "js", "zmc", "zsh", "zxqmc", "gzlxh"];
                            rowValues.push(getFromNode("value", data, "scyq.jxyl.wg.yl.gs") || "");
                            for (j = 0; j < array.length; j++) {
                                rowValues.push(getFromNode("value", data, "scyq.jxyl.wg.yl.yl" + i + "." + array[j]) || "");
                            }
                            gxqScyqJxylWgYlDtTable.fnAddData(rowValues);
                            var array = ["gs", "dc", "ds", "djmc", "djsh", "djxqmc", "js", "zmc", "zsh", "zxqmc", "gzlxh"];
                            for (var j = 0; j < rowValues.length; j++) {
                                rowValues[j] = "<input type='text' class='form-control input-sm' name='" + array[j] +
                                    "' value='" + rowValues[j] + "' ";
                                if (array[j] == "gs" ||
                                    array[j] == "djmc" ||
                                    array[j] == "djxqmc" ||
                                    array[j] == "zmc" ||
                                    array[j] == "zsh" ||
                                    array[j] == "zxqmc") {
                                    rowValues[j] += "disabled";
                                }
                                rowValues[j] += " />";
                            }
                            rowValues.push("<button class='btn btn-sm red'>删除</button>");
                            gxhScyqJxylWgYlData.push(rowValues);
                        }
                    }
                    var gxhScyqJxylZxgYlData = [];
                    if (zxgExist) {
                        var rowValues = [];
                        var array = ["jg", "zj", "nx", "qd", "tyfs", "nj", "bmzt"];
                        for (var i = 0; i < array.length; i++) {
                            rowValues.push(getFromNode("value", data, "scyq.jxyl.zxg.gg." + array[i]) || "");
                        }
                        gxqScyqJxylZxgGgDtTable.fnAddData(rowValues);
                        gxhScyqJxylZxgGgDtTable.fnAddData(rowValues);
                        var yls = getFromNode("yls", data, "scyq.jxyl.zxg.yl");
                        for (var i = yls.begin; i < yls.begin + yls.total; i++) {
                            var rowValues = [];
                            var array = ["dc", "ds", "djmc", "djsh", "djxqmc", "js", "zmc", "zsh", "zxqmc", "gzlxh"];
                            for (j = 0; j < array.length; j++) {
                                rowValues.push(getFromNode("value", data, "scyq.jxyl.zxg.yl.yl" + i + "." + array[j]) || "");
                            }
                            gxqScyqJxylZxgYlDtTable.fnAddData(rowValues);
                            for (var j = 0; j < rowValues.length; j++) {
                                rowValues[j] = "<input type='text' class='form-control input-sm' name='" + array[j] +
                                    "' value='" + rowValues[j] + "' ";
                                if (array[j] == "djmc" ||
                                    array[j] == "djxqmc" ||
                                    array[j] == "zmc" ||
                                    array[j] == "zsh" ||
                                    array[j] == "zxqmc") {
                                    rowValues[j] += "disabled";
                                }
                                rowValues[j] += " />";
                            }
                            rowValues.push("<button class='btn btn-sm red'>删除</button>");
                            gxhScyqJxylZxgYlData.push(rowValues)
                        }
                    }
                    var gxhScyqJxylXwxYlData = [];
                    if (xwxExist) {
                        var rowValues = [];
                        var array = ["lb", "zj", "nx", "hyl"];
                        for (var i = 0; i < array.length; i++) {
                            rowValues.push(getFromNode("value", data, "scyq.jxyl.xwx.gg." + array[i]) || "");
                        }
                        gxqScyqJxylXwxGgDtTable.fnAddData(rowValues);
                        gxhScyqJxylXwxGgDtTable.fnAddData(rowValues);
                        var rowValues = [];
                        var array = ["gymcxs", "zmc", "dh", "zl"];
                        for (i = 0; i < array.length; i++) {
                            rowValues.push(getFromNode("value", data, "scyq.jxyl.xwx.yl." + array[i]) || "");
                        }
                        gxqScyqJxylXwxYlDtTable.fnAddData(rowValues);
                        for (var i = 0; i < rowValues.length; i++) {
                            rowValues[i] = "<input type='text' class='form-control input-sm' name='" + array[i] +
                                "' value='" + rowValues[i] + "' />";
                        }
                        gxhScyqJxylXwxYlData.push(rowValues)
                    }
                    var gxhScyqJxylYzYlData = [];
                    if (yzExist) {
                        var rowValues = [];
                        var array = ["xh"];
                        for (var i = 0; i < array.length; i++) {
                            rowValues.push(getFromNode("value", data, "scyq.jxyl.yz.gg." + array[i]) || "");
                        }
                        gxqScyqJxylYzGgDtTable.fnAddData(rowValues);
                        gxhScyqJxylYzGgDtTable.fnAddData(rowValues);
                        var rowValues = [];
                        var array = ["tyfs", "dh", "zl"];
                        for (i = 0; i < array.length; i++) {
                            rowValues.push(getFromNode("value", data, "scyq.jxyl.yz.yl." + array[i]) || "");
                        }
                        gxqScyqJxylYzYlDtTable.fnAddData(rowValues);
                        for (var i = 0; i < rowValues.length; i++) {
                            rowValues[i] = "<input type='text' class='form-control input-sm' name='" + array[i] +
                                "' value='" + rowValues[i] + "' />";
                        }
                        gxhScyqJxylYzYlData.push(rowValues);
                    }
                    var gxhScyqJxylZjpYlData = [];
                    if (zjpExist) {
                        var rowValues = [];
                        var array = ["jg", "zj", "nx", "qd", "tyfs", "nj", "bmzt"];
                        for (var i = 0; i < array.length; i++) {
                            rowValues.push(getFromNode("value", data, "scyq.jxyl.zjp.gg." + array[i]) || "");
                        }
                        gxqScyqJxylZjpGgDtTable.fnAddData(rowValues);
                        gxhScyqJxylZjpGgDtTable.fnAddData(rowValues);
                        var yls = getFromNode("yls", data, "scyq.jxyl.zjp.yl");
                        for (var i = yls.begin; i < yls.begin + yls.total; i++) {
                            var rowValues = [];
                            var array = ["dc", "ds", "djmc", "djsh", "djxqmc", "js", "zmc", "zsh", "zxqmc", "gzlxh"];
                            for (j = 0; j < array.length; j++) {
                                rowValues.push(getFromNode("value", data, "scyq.jxyl.zjp.yl.yl" + i + "." + array[j]) || "");
                            }
                            gxqScyqJxylZjpYlDtTable.fnAddData(rowValues);
                            for (var j = 0; j < rowValues.length; j++) {
                                rowValues[j] = "<input type='text' class='form-control input-sm' name='" + array[j] +
                                    "' value='" + rowValues[j] + "' ";
                                if (array[j] == "djmc" ||
                                    array[j] == "djxqmc" ||
                                    array[j] == "zmc" ||
                                    array[j] == "zsh" ||
                                    array[j] == "zxqmc") {
                                    rowValues[j] += "disabled"
                                }
                                rowValues[j] += " />"
                            }
                            rowValues.push("<button class='btn btn-sm red'>删除</button>");
                            gxhScyqJxylZjpYlData.push(rowValues);
                        }
                    }
                    if (gExist) {
                        var gcs = getFromNode("gcs", data, "scyq.jxyl");
                        for (var i = gcs.begin; i < gcs.begin + gcs.total; i++) {
                            var gs = getFromNode("gs", data, "scyq.jxyl.gdc" + i);
                            for (var j = gs.begin; j < gs.begin + gs.total; j++) {
                                var qGgTable = $(".arrange " + ".gxq_scyq_jxyl_gdc" + i + "_g" + j + "_gg");
                                var hGgTable = $(".arrange " + ".gxh_scyq_jxyl_gdc" + i + "_g" + j + "_gg_index");
                                var qGgDtTable = qGgTable.dataTable(datatableOption);
                                var hGgDtTable = hGgTable.dataTable(datatableOption);
                                var qYlTable = $(".arrange " + ".gxq_scyq_jxyl_gdc" + i + "_g" + j + "_yl");
                                var qYlDtTable = qYlTable.dataTable(datatableOption);
                                var rowValues = [];
                                var array = ["jg", "zj", "nx", "qd", "tyfs", "nj", "bmzt"];
                                for (var k = 0; k < array.length; k++) {
                                    rowValues.push(getFromNode("value", data, "scyq.jxyl.gdc" + i + ".g" + j + ".gg." + array[k]) || "");
                                }
                                qGgDtTable.fnAddData(rowValues);
                                hGgDtTable.fnAddData(rowValues);
                                var yls = getFromNode("yls", data, "scyq.jxyl.gdc" + i + ".g" + j + ".yl");
                                for (var l = yls.begin; l < yls.begin + yls.total; l++) {
                                    var rowValues = [];
                                    var array = ["dc", "ds", "djmc", "djsh", "djxqmc", "js", "zmc", "zsh", "zxqmc", "gzlxh"];
                                    rowValues.push(getFromNode("value", data, "scyq.jxyl.gdc" + i + ".g" + j + ".yl.gs") || "");
                                    for (var m = 0; m < array.length; m++) {
                                        rowValues.push(getFromNode("value", data, "scyq.jxyl.gdc" + i + ".g" + j + ".yl.yl" + l + "." + array[m]) || "");
                                    }
                                    qYlDtTable.fnAddData(rowValues);
                                }
                            }
                        }
                    }
                    $(".arrange #gxq_scyq th").css("font-size", "12px");
                    $(".arrange #gxh_scyq_index th").css("font-size", "12px");
                    arrangeHtml = $(".arrange #gxh_accordion_index").prop("outerHTML");
                    if (jssxExist) {
                        var dtTable = $(".arrange .gxh_scyq_jxyl_jssx_yl_index").dataTable(datatableOption);
                        for (var i = 0; i < gxhScyqJxylJssxYlData.length; i++) {
                            dtTable.fnAddData(gxhScyqJxylJssxYlData[i]);
                        }
                    }
                    if (jsgxExist) {
                        var dtTable = $(".arrange .gxh_scyq_jxyl_jsgx_yl_index").dataTable(datatableOption);
                        for (var i = 0; i < gxhScyqJxylJsgxYlData.length; i++) {
                            dtTable.fnAddData(gxhScyqJxylJsgxYlData[i]);
                        }
                    }
                    if (bjsxExist) {
                        var dtTable = $(".arrange .gxh_scyq_jxyl_bjsx_yl_index").dataTable(datatableOption);
                        for (var i = 0; i < gxhScyqJxylBjsxYlData.length; i++) {
                            dtTable.fnAddData(gxhScyqJxylBjsxYlData[i]);
                        }
                    }
                    if (zxgExist) {
                        var dtTable = $(".arrange .gxh_scyq_jxyl_zxg_yl_index").dataTable(datatableOption);
                        for (var i = 0; i < gxhScyqJxylZxgYlData.length; i++) {
                            dtTable.fnAddData(gxhScyqJxylZxgYlData[i]);
                        }
                    }
                    if (wgExist) {
                        var dtTable = $(".arrange .gxh_scyq_jxyl_wg_yl_index").dataTable(datatableOption);
                        for (var i = 0; i < gxhScyqJxylWgYlData.length; i++) {
                            dtTable.fnAddData(gxhScyqJxylWgYlData[i]);
                        }
                    }
                    if (zjpExist) {
                        var dtTable = $(".arrange .gxh_scyq_jxyl_zjp_yl_index").dataTable(datatableOption);
                        for (var i = 0; i < gxhScyqJxylZjpYlData.length; i++) {
                            dtTable.fnAddData(gxhScyqJxylZjpYlData[i]);
                        }
                    }
                    if (xwxExist) {
                        var dtTable = $(".arrange .gxh_scyq_jxyl_xwx_yl_index").dataTable(datatableOption);
                        for (var i = 0; i < gxhScyqJxylXwxYlData.length; i++) {
                            dtTable.fnAddData(gxhScyqJxylXwxYlData[i]);
                        }
                    }
                    if (yzExist) {
                        var dtTable = $(".arrange .gxh_scyq_jxyl_yz_yl_index").dataTable(datatableOption);
                        for (var i = 0; i < gxhScyqJxylYzYlData.length; i++) {
                            dtTable.fnAddData(gxhScyqJxylYzYlData[i]);
                        }
                    }
                    if (gExist) {
                        var gcs = getFromNode("gcs", data, "scyq.jxyl");
                        for (var i = gcs.begin; i < gcs.begin + gcs.total; i++) {
                            var gs = getFromNode("gs", data, "scyq.jxyl.gdc" + i);
                            for (var j = gs.begin; j < gs.begin + gs.total; j++) {
                                var hYlTable = $(".arrange " + ".gxh_scyq_jxyl_gdc" + i + "_g" + j + "_yl_index");
                                var hYlDtTable = hYlTable.dataTable(datatableOption);
                                var yls = getFromNode("yls", data, "scyq.jxyl.gdc" + i + ".g" + j + ".yl");
                                for (var l = yls.begin; l < yls.begin + yls.total; l++) {
                                    var rowValues = [];
                                    var array = ["gs", "dc", "ds", "djmc", "djsh", "djxqmc", "js", "zmc", "zsh", "zxqmc", "gzlxh"];
                                    for (var m = 0; m < array.length; m++) {
                                        if (array[m] == "gs") {
                                            rowValues[m] = "<input type='text' class='form-control input-sm' name='" + array[m] +
                                                "' value='" + (getFromNode("value", data, "scyq.jxyl.gdc" + i + ".g" + j + ".yl." + array[m]) || "") +
                                                "' disabled />";
                                        }
                                        else {
                                            rowValues[m] = "<input type='text' class='form-control input-sm' name='" + array[m] +
                                                "' value='" + (getFromNode("value", data, "scyq.jxyl.gdc" + i + ".g" + j + ".yl.yl" + l + "." + array[m]) || "") +
                                                "' ";
                                            if (array[m] == "djmc" ||
                                                array[m] == "djxqmc" ||
                                                array[m] == "zmc" ||
                                                array[m] == "zsh" ||
                                                array[m] == "zxqmc") {
                                                rowValues[m] += "disabled";
                                            }
                                            rowValues[m] += " />";
                                        }
                                    }
                                    rowValues.push("<button class='btn btn-sm red'>删除</button>");
                                    hYlDtTable.fnAddData(rowValues);
                                }
                            }
                        }
                    }
                    var dtTable = $(".arrange .gxh_scyq_scsj_yjtcsj_index").dataTable(datatableOption);
                    var rowValues = [];
                    var array = ["kssj", "wcsj"];
                    for (var i = 0; i < array.length; i++) {
                        rowValues.push("<input type='text' class='form-control input-sm' name='" + array[i] +
                            "' value='" + (getFromNode("value", data, "scyq.scsj.yjtcsj." + array[i]) || "") + "' />");
                    }
                    dtTable.fnAddData(rowValues);
                    $($(".arrange .gxh_scyq_scsj_yjtcsj_index").find("input")).datetimepicker(datetimepickerOption);
                    // 设置作业计划更新后预计生产时间
                    var dtTable = $(".arrange .gxh_scyq_scsj_yjscsj_index").dataTable(datatableOption);
                    var rowValues = [];
                    var array = ["kssj", "wcsj"];
                    for (var i = 0; i < array.length; i++) {
                        rowValues.push("<input type='text' class='form-control input-sm' name='" + array[i] +
                            "' value='" + (getFromNode("value", data, "scyq.scsj.yjscsj." + array[i]) || "") + "' />");
                    }
                    dtTable.fnAddData(rowValues);
                    $($(".arrange .gxh_scyq_scsj_yjscsj_index").find("input")).datetimepicker(datetimepickerOption);
                    var dtTable;
                    if (isGss) {
                        dtTable = $(".arrange .gxh_scyq_cpyq_sxfs_gss_index").dataTable(datatableOption);
                    }
                    else {
                        dtTable = $(".arrange .gxh_scyq_cpyq_sxfs_not_gss_index").dataTable(datatableOption);
                    }
                    for (var i = 0; i < gxhScyqCpyqSxfsData.length; i++) {
                        dtTable.fnAddData(gxhScyqCpyqSxfsData[i]);
                    }
                    $(".arrange .modal-body").show();
                    $(".arrange #submit").show();
                });
            });
            $(".arrange").on('click', '.red', function (e) {
                e.preventDefault();
                var table = $(this).parents('table')[0];
                var trs = $(table).find("tbody tr:has(td:not(.dataTables_empty))");
                if (trs.length == 1) {
                    bootboxError("至少保留1条数据");
                    return;
                }
                var tr = $(this).parents('tr')[0];
                var dt = $(table).dataTable();
                if ($(table).attr("class").indexOf("gxh_fpjt") > 0) {
                    var index = $(tr).attr("index");
                    $(".arrange #gxh_accordion_" + index).remove();
                    if ($(tr).hasClass("selected")) {
                        $(tr).removeClass('selected');
                    }
                }
                dt.fnDeleteRow(tr);
            });
            $(".arrange").on('click', '.add', function (e) {
                e.preventDefault();
                var toolbar = $(this).parents('.table-toolbar')[0];
                var table = $(toolbar).prev().find("table");
                var dtTable = $(table).dataTable();
                var className = $(table).attr("class");
                if (className.indexOf("jssx") > 0 ||
                    className.indexOf("jsgx") > 0 ||
                    className.indexOf("bjsx") > 0 ||
                    className.indexOf("zxg") > 0 ||
                    className.indexOf("zjp") > 0) {
                    var names = ["dc", "ds", "djmc", "djsh", "djxqmc", "js", "zmc", "zsh", "zxqmc", "gzlxh"];
                    var array = [];
                    for (var i = 0; i < names.length; i++) {
                        if (names[i] == "djmc" ||
                            names[i] == "djxqmc" ||
                            names[i] == "zmc" ||
                            names[i] == "zsh" ||
                            names[i] == "zxqmc") {
                            array.push("<input type='text' class='form-control input-sm' name='" + names[i] + "' value='' disabled />");
                        }
                        else {
                            array.push("<input type='text' class='form-control input-sm' name='" + names[i] + "' value='' />");
                        }
                    }
                    array.push("<button class='btn btn-sm red'>删除</button>");
                    dtTable.fnAddData(array);
                }
                if (className.indexOf("sxfs_not_gss") > 0) {
                    var names = ["dc", "ds", "djmc", "djsh", "djscmc", "js", "zmc", "zsh", "zscmc", "gzlxh"];
                    var array = [];
                    for (var i = 0; i < names.length; i++) {
                        if (names[i] == "djmc" ||
                            names[i] == "djscmc" ||
                            names[i] == "zmc" ||
                            names[i] == "zsh" ||
                            names[i] == "zscmc") {
                            array.push("<input type='text' class='form-control input-sm' name='" + names[i] + "' value='' disabled />");
                        }
                        else {
                            array.push("<input type='text' class='form-control input-sm' name='" + names[i] + "' value='' />");
                        }
                    }
                    array.push("<button class='btn btn-sm red'>删除</button>");
                    dtTable.fnAddData(array);
                }
                if (className.indexOf("gdc") > 0 ||
                    className.indexOf("wg") > 0) {
                    var array = [];
                    array.push("<input type='text' class='form-control input-sm' name='gs' value='" +
                        $($(table).find("tbody tr:first input[name=gs]")).val() + "' disabled />");
                    var names = ["dc", "ds", "djmc", "djsh", "djxqmc", "js", "zmc", "zsh", "zxqmc", "gzlxh"];
                    for (var i = 0; i < names.length; i++) {
                        if (names[i] == "djmc" ||
                            names[i] == "djxqmc" ||
                            names[i] == "zmc" ||
                            names[i] == "zsh" ||
                            names[i] == "zxqmc") {
                            array.push("<input type='text' class='form-control input-sm' name='" + names[i] + "' value='' disabled />");
                        }
                        else {
                            array.push("<input type='text' class='form-control input-sm' name='" + names[i] + "' value='' />");
                        }
                    }
                    array.push("<button class='btn btn-sm red'>删除</button>");
                    dtTable.fnAddData(array);
                }
                if (className.indexOf("sxfs_gss") > 0) {
                    var names = ["djmc", "js", "zmc", "bzfs", "lpxh"];
                    var array = [];
                    for (var i = 0; i < names.length; i++) {
                        if (names[i] == "zmc") {
                            array.push("<input type='text' class='form-control input-sm' name='" + names[i] + "' value='' disabled />");
                        }
                        else {
                            array.push("<input type='text' class='form-control input-sm' name='" + names[i] + "' value='' />");
                        }
                    }
                    array.push("<button class='btn btn-sm red'>删除</button>");
                    dtTable.fnAddData(array);
                }
                if (className.indexOf("fpjt") > 0) {
                    var array = [];
                    var names = [
                        {"name": "cj", "width": "100px"},
                        {"name": "jth", "width": "120px"},
                        {"name": "jtmcxs", "width": "80px"},
                        {"name": "bzz", "width": "200px"},
                        {"name": "czg", "width": "180px"}
                    ];
                    array.push(getFromNode("value", arrangeData, "xdrq") || '');
                    array.push(getFromNode("value", arrangeData, "gdzzh") || '');
                    for (var i = 0; i < names.length; i++) {
                        if (names[i].name == "jth" || names[i].name == "bzz" || names[i].name == "czg" || names[i].name == "cj") {
                            array.push("<select class='form-control' style='width:" + names[i].width + "' name='" +
                                names[i].name + "' />");
                        }
                        else {
                            array.push("<input type='text' class='form-control' style='width:" + names[i].width +
                                "' name='" + names[i].name + "' />")
                        }
                    }
                    array.push("<button class='btn btn-sm blue detail'>明细</button><button class='btn btn-sm red'>删除</button>");
                    var t = dtTable.fnAddData(array);
                    $(dtTable.fnSettings().aoData[t].nTr).attr("index", index);
                    $($(gxhFpjtDtTable.fnSettings().aoData[t].nTr).find("select[name=jth]")).html(jthHtml).select2(select2Option);
                    $($(gxhFpjtDtTable.fnSettings().aoData[t].nTr).find("select[name=bzz]")).html(bzzHtml).select2(select2Option);
                    $($(gxhFpjtDtTable.fnSettings().aoData[t].nTr).find("select[name=czg]")).html(czgHtml).select2(select2Option);
                    $($(gxhFpjtDtTable.fnSettings().aoData[t].nTr).find("select[name=cj]")).html(cjHtml).select2(select2Option);
                    var html = arrangeHtml.replace(/index/g, index);
                    $(html).appendTo($(".gxh .portlet-body")).hide();
                    $(html).find("th").css("font-size", "12px");
                    if (jssxExist) {
                        var dtTable = $(".arrange .gxh_scyq_jxyl_jssx_yl_" + index).dataTable(datatableOption);
                        var array = [];
                        var names = ["dc", "ds", "djmc", "djsh", "djxqmc", "js", "zmc", "zsh", "zxqmc", "gzlxh"];
                        for (i = 0; i < names.length; i++) {
                            if (names[i] == "djmc" ||
                                names[i] == "djxqmc" ||
                                names[i] == "zmc" ||
                                names[i] == "zsh" ||
                                names[i] == "zxqmc") {
                                array.push("<input type='text' class='form-control input-sm' name='" + names[i] + "' value='' disabled/>");
                            }
                            else {
                                array.push("<input type='text' class='form-control input-sm' name='" + names[i] + "' value='' />");
                            }
                        }
                        array.push("<button class='btn btn-sm red'>删除</button>");
                        dtTable.fnAddData(array);
                    }
                    if (jsgxExist) {
                        var dtTable = $(".arrange .gxh_scyq_jxyl_jsgx_yl_" + index).dataTable(datatableOption);
                        var array = [];
                        var names = ["dc", "ds", "djmc", "djsh", "djxqmc", "js", "zmc", "zsh", "zxqmc", "gzlxh"];
                        for (i = 0; i < names.length; i++) {
                            if (names[i] == "djmc" ||
                                names[i] == "djxqmc" ||
                                names[i] == "zmc" ||
                                names[i] == "zsh" ||
                                names[i] == "zxqmc") {
                                array.push("<input type='text' class='form-control input-sm' name='" + names[i] + "' value='' disabled/>");
                            }
                            else {
                                array.push("<input type='text' class='form-control input-sm' name='" + names[i] + "' value='' />");
                            }
                        }
                        array.push("<button class='btn btn-sm red'>删除</button>");
                        dtTable.fnAddData(array);
                    }
                    if (bjsxExist) {
                        var dtTable = $(".arrange .gxh_scyq_jxyl_bjsx_yl_" + index).dataTable(datatableOption);
                        var array = [];
                        var names = ["dc", "ds", "djmc", "djsh", "djxqmc", "js", "zmc", "zsh", "zxqmc", "gzlxh"];
                        for (i = 0; i < names.length; i++) {
                            if (names[i] == "djmc" ||
                                names[i] == "djxqmc" ||
                                names[i] == "zmc" ||
                                names[i] == "zsh" ||
                                names[i] == "zxqmc") {
                                array.push("<input type='text' class='form-control input-sm' name='" + names[i] + "' value='' disabled/>");
                            }
                            else {
                                array.push("<input type='text' class='form-control input-sm' name='" + names[i] + "' value='' />");
                            }
                        }
                        array.push("<button class='btn btn-sm red'>删除</button>");
                        dtTable.fnAddData(array);
                    }
                    if (zxgExist) {
                        var dtTable = $(".arrange .gxh_scyq_jxyl_zxg_yl_" + index).dataTable(datatableOption);
                        var array = [];
                        var names = ["dc", "ds", "djmc", "djsh", "djxqmc", "js", "zmc", "zsh", "zxqmc", "gzlxh"];
                        for (i = 0; i < names.length; i++) {
                            if (names[i] == "djmc" ||
                                names[i] == "djxqmc" ||
                                names[i] == "zmc" ||
                                names[i] == "zsh" ||
                                names[i] == "zxqmc") {
                                array.push("<input type='text' class='form-control input-sm' name='" + names[i] + "' value='' disabled/>");
                            }
                            else {
                                array.push("<input type='text' class='form-control input-sm' name='" + names[i] + "' value='' />");
                            }
                        }
                        array.push("<button class='btn btn-sm red'>删除</button>");
                        dtTable.fnAddData(array);
                    }
                    if (wgExist) {
                        var dtTable = $(".arrange .gxh_scyq_jxyl_wg_yl_" + index).dataTable(datatableOption);
                        var array = [];
                        var names = ["gs", "dc", "ds", "djmc", "djsh", "djxqmc", "js", "zmc", "zsh", "zxqmc", "gzlxh"];
                        for (i = 0; i < names.length; i++) {
                            if (names[i] == "gs") {
                                array.push("<input type='text' class='form-control input-sm' name='" + names[i] + "' value='" +
                                    $(".arrange .gxh_scyq_jxyl_wg_yl_index tbody tr:first input[name=gs]").val() +
                                    "' disabled />");
                            }
                            else {
                                if (names[i] == "djmc" ||
                                    names[i] == "djxqmc" ||
                                    names[i] == "zmc" ||
                                    names[i] == "zsh" ||
                                    names[i] == "zxqmc") {
                                    array.push("<input type='text' class='form-control input-sm' name='" + names[i] + "' value='' disabled/>");
                                }
                                else {
                                    array.push("<input type='text' class='form-control input-sm' name='" + names[i] + "' value='' />");
                                }
                            }
                        }
                        array.push("<button class='btn btn-sm red'>删除</button>");
                        dtTable.fnAddData(array);
                    }
                    if (xwxExist) {
                        var dtTable = $(".arrange .gxh_scyq_jxyl_xwx_yl_" + index).dataTable(datatableOption);
                        var array = [];
                        var names = ["gymcxs", "zmc", "dh", "zl"];
                        for (i = 0; i < names.length; i++) {
                            array.push("<input type='text' class='form-control input-sm' name='" + names[i] + "' value='' />");
                        }
                        dtTable.fnAddData(array);
                    }
                    if (yzExist) {
                        var dtTable = $(".arrange .gxh_scyq_jxyl_yz_yl_" + index).dataTable(datatableOption);
                        var array = [];
                        var names = ["tyfs", "dh", "zl"];
                        for (i = 0; i < names.length; i++) {
                            array.push("<input type='text' class='form-control input-sm' name='" + names[i] + "' />");
                        }
                        dtTable.fnAddData(array);
                    }
                    if (gExist) {
                        var gcs = getFromNode("gcs", arrangeData, "scyq.jxyl");
                        for (var i = gcs.begin; i < gcs.begin + gcs.total; i++) {
                            var gs = getFromNode("gs", arrangeData, "scyq.jxyl.gdc" + i);
                            for (var j = gs.begin; j < gs.begin + gs.total; j++) {
                                var dtTable = $(".arrange " + ".gxh_scyq_jxyl_gdc" + i + "_g" + j + "_yl_" + index).dataTable(datatableOption);
                                var array = [];
                                array.push("<input type='text' class='form-control input-sm' name='gs' value='" +
                                    $(".arrange .gxh_scyq_jxyl_gdc" + i + "_g" + j + "_yl_index" +
                                        " tbody tr:first input[name=gs]").val() + "' disabled />");
                                var names = ["dc", "ds", "djmc", "djsh", "djxqmc", "js", "zmc", "zsh", "zxqmc", "gzlxh"];
                                for (var k = 0; k < names.length; k++) {
                                    if (names[k] == "djmc" ||
                                        names[k] == "djxqmc" ||
                                        names[k] == "zmc" ||
                                        names[k] == "zsh" ||
                                        names[k] == "zxqmc") {
                                        array.push("<input type='text' class='form-control input-sm' name='" + names[k] + "' value='' disabled/>");
                                    }
                                    else {
                                        array.push("<input type='text' class='form-control input-sm' name='" + names[k] + "' value='' />");
                                    }
                                }
                                array.push("<button class='btn btn-sm red'>删除</button>");
                                dtTable.fnAddData(array);
                            }
                        }
                    }
                    if (zjpExist) {
                        var dtTable = $(".arrange .gxh_scyq_jxyl_zjp_yl_" + index).dataTable(datatableOption);
                        var array = [];
                        var names = ["dc", "ds", "djmc", "djsh", "djxqmc", "js", "zmc", "zsh", "zxqmc", "gzlxh"];
                        for (i = 0; i < names.length; i++) {
                            if (names[i] == "djmc" ||
                                names[i] == "djxqmc" ||
                                names[i] == "zmc" ||
                                names[i] == "zsh" ||
                                names[i] == "zxqmc") {
                                array.push("<input type='text' class='form-control input-sm' name='" + names[i] + "' value='' disabled />");
                            }
                            else {
                                array.push("<input type='text' class='form-control input-sm' name='" + names[i] + "' value='' />");
                            }
                        }
                        array.push("<button class='btn btn-sm red'>删除</button>");
                        dtTable.fnAddData(array);
                    }
                    var dtTable = $(".arrange .gxh_scyq_scsj_yjtcsj_" + index).dataTable(datatableOption);
                    var array = [];
                    var names = ["kssj", "wcsj"];
                    for (i = 0; i < names.length; i++) {
                        array.push("<input type='text' class='form-control input-sm' name='" + names[i] + "' value='' />");
                    }
                    dtTable.fnAddData(array);
                    $(".arrange .gxh_scyq_scsj_yjtcsj_" + index).find("input").datetimepicker(datetimepickerOption);
                    var dtTable = $(".arrange .gxh_scyq_scsj_yjscsj_" + index).dataTable(datatableOption);
                    var array = [];
                    var names = ["kssj", "wcsj"];
                    for (i = 0; i < names.length; i++) {
                        array.push("<input type='text' class='form-control input-sm' name='" + names[i] + "' value='' />");
                    }
                    dtTable.fnAddData(array);
                    $(".arrange .gxh_scyq_scsj_yjscsj_" + index).find("input").datetimepicker(datetimepickerOption);
                    var dtTable;
                    if (isGss) {
                        dtTable = $(".arrange .gxh_scyq_cpyq_sxfs_gss_" + index).dataTable(datatableOption);
                    } else {
                        dtTable = $(".arrange .gxh_scyq_cpyq_sxfs_not_gss_" + index).dataTable(datatableOption);
                    }
                    var array = [];
                    var names;
                    if (isGss) {
                        names = ["djmc", "js", "zmc", "bzfs", "lpxh"];
                        for (i = 0; i < names.length; i++) {
                            if (names[i] == "zmc") {
                                array.push("<input type='text' class='form-control input-sm' name='" + names[i] + "' value='' disabled/>");
                            }
                            else {
                                array.push("<input type='text' class='form-control input-sm' name='" + names[i] + "' value='' />");
                            }
                        }
                    } else {
                        names = ["dc", "ds", "djmc", "djsh", "djscmc", "js", "zmc", "zsh", "zscmc", "gzlxh"];
                        for (i = 0; i < names.length; i++) {
                            if (names[i] == "djmc" ||
                                names[i] == "djscmc" ||
                                names[i] == "zmc" ||
                                names[i] == "zsh" ||
                                names[i] == "zscmc") {
                                array.push("<input type='text' class='form-control input-sm' name='" + names[i] + "' value='' disabled/>");
                            }
                            else {
                                array.push("<input type='text' class='form-control input-sm' name='" + names[i] + "' value='' />");
                            }
                        }
                    }
                    array.push("<button class='btn btn-sm red'>删除</button>");
                    dtTable.fnAddData(array);
                    index++;
                }
            });
            $(".arrange").on('click', '.detail', function (e) {
                e.preventDefault();
                var tr = $(this).parents("tr")[0];
                if (!$(tr).hasClass('selected')) {
                    $(".arrange .gxh_fpjt tr").removeClass("selected");
                    $(tr).addClass('selected');
                }
                var index = $(tr).attr("index");
                $(".arrange .gxh_accordion").hide();
                $(".arrange #gxh_accordion_" + index).show();
            });
            $(".arrange #submit").on('click', function (e) {
                e.preventDefault();
                $(".arrange #submit").prop("disabled", "disabled");
                $(".arrange #cancel").prop("disabled", "disabled");
                var array = [
                    {"name": "cj", "text": "车间"},
                    {"name": "jth", "text": "机台号"},
                    {"name": "jtmcxs", "text": "机台米长系数"},
                    {"name": "bzz", "text": "班长"}
                ];
                for (var i = 0; i < array.length; i++) {
                    if (array[i].name == "jth" || array[i].name == "bzz" || array[i].name == "czg" ||
                        array[i].name == "cj") {
                        var selects = $gxhFpjtTable.find("select[name=" + array[i].name + "]");
                        for (var j = 0; j < selects.length; j++) {
                            var result = checkValue(array[i].name, $(selects[j]).select2().select2("val"));
                            if (!result.valid) {
                                bootboxError("生产计划更新后-" + array[i].text + result.text);
                                $(".arrange #submit").removeProp("disabled");
                                $(".arrange #cancel").removeProp("disabled");
                                return;
                            }
                        }
                    }
                    else {
                        var inputs = $gxhFpjtTable.find("input[name=" + array[i].name + "]");
                        for (var j = 0; j < inputs.length; j++) {
                            var result = checkValue(array[i].name, $(inputs[j]).val());
                            if (!result.valid) {
                                bootboxError("生产计划更新后-" + array[i].text + result.text);
                                $(".arrange #submit").removeProp("disabled");
                                $(".arrange #cancel").removeProp("disabled");
                                return;
                            }
                        }
                    }
                }
                var trs = $gxhFpjtTable.find("tbody tr:has(td:not(.dataTables_empty))");
                for (var i = 0; i < trs.length; i++) {
                    var index = $(trs[i]).attr("index");
                    var array = [
                        {"name": "kssj", "text": "开始时间"},
                        {"name": "wcsj", "text": "完成时间"}
                    ];
                    for (var j = 0; j < array.length; j++) {
                        var input = $(".arrange .gxh_scyq_scsj_yjtcsj_" + index).find("input[name=" + array[j].name + "]");
                        var result = checkValue(array[j].name, $(input).val());
                        if (!result.valid) {
                            bootboxError("生产计划更新后-生产要求-生产时间-预计调产时间-" + array[j].text + result.text);
                            $(".arrange #submit").removeProp("disabled");
                            $(".arrange #cancel").removeProp("disabled");
                            return;
                        }
                    }
                    for (var j = 0; j < array.length; j++) {
                        var input = $(".arrange .gxh_scyq_scsj_yjscsj_" + index).find("input[name=" + array[j].name + "]");
                        var result = checkValue(array[j].name, $(input).val());
                        if (!result.valid) {
                            bootboxError("生产计划更新后-生产要求-生产时间-预计生产时间-" + array[j].text + result.text);
                            $(".arrange #submit").removeProp("disabled");
                            $(".arrange #cancel").removeProp("disabled");
                            return;
                        }
                    }
                    if (xwxExist) {
                        var array = [
                            {"name": "gymcxs", "text": "工艺米长系数"},
                            {"name": "zmc", "text": "总米长"},
                            {"name": "dh", "text": "吨耗"},
                            {"name": "zl", "text": "重量"}
                        ];
                        for (var j = 0; j < array.length; j++) {
                            var input = $(".arrange .gxh_scyq_jxyl_xwx_yl_" + index).find("input[name=" + array[j].name + "]");
                            var result = checkValue(array[j].name, $(input).val());
                            if (!result.valid) {
                                bootboxError("生产计划更新后-生产要求-进线用料-纤维芯-用量-" + array[j].text + result.text);
                                $(".arrange #submit").removeProp("disabled");
                                $(".arrange #cancel").removeProp("disabled");
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
                        for (var j = 0; j < array.length; j++) {
                            var input = $(".arrange .gxh_scyq_jxyl_yz_yl_" + index).find("input[name=" + array[j].name + "]");
                            var result = checkValue(array[j].name, $(input).val());
                            if (!result.valid) {
                                bootboxError("生产计划更新后-生产要求-进线用料-油脂-用量-" + array[j].text + result.text);
                                $(".arrange #submit").removeProp("disabled");
                                $(".arrange #cancel").removeProp("disabled");
                                return;
                            }
                        }
                    }
                    if (jssxExist) {
                        var array = [
                            {"name": "dc", "text": "段长"},
                            {"name": "ds", "text": "段数"},
                            {"name": "djmc", "text": "单件米长"},
                            {"name": "djsh", "text": "单件损耗"},
                            {"name": "djxqmc", "text": "单件需求米长"},
                            {"name": "js", "text": "件数"},
                            {"name": "zmc", "text": "总米长"},
                            {"name": "zsh", "text": "总损耗"},
                            {"name": "zxqmc", "text": "总需求米长"},
                            {"name": "gzlxh", "text": "工字轮型号"}
                        ];
                        for (var j = 0; j < array.length; j++) {
                            var inputs = $(".arrange .gxh_scyq_jxyl_jssx_yl_" + index).find("input[name=" + array[j].name + "]");
                            for (var k = 0; k < inputs.length; k++) {
                                var result = checkValue(array[j].name, $(inputs[k]).val());
                                if (!result.valid) {
                                    bootboxError("生产计划更新后-生产要求-进线用料-金属绳芯-用量-" + array[j].text + result.text);
                                    $(".arrange #submit").removeProp("disabled");
                                    $(".arrange #cancel").removeProp("disabled");
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
                            {"name": "djsh", "text": "单件损耗"},
                            {"name": "djxqmc", "text": "单件需求米长"},
                            {"name": "js", "text": "件数"},
                            {"name": "zmc", "text": "总米长"},
                            {"name": "zsh", "text": "总损耗"},
                            {"name": "zxqmc", "text": "总需求米长"},
                            {"name": "gzlxh", "text": "工字轮型号"}
                        ];
                        for (var j = 0; j < array.length; j++) {
                            var inputs = $(".arrange .gxh_scyq_jxyl_jsgx_yl_" + index).find("input[name=" + array[j].name + "]");
                            for (var k = 0; k < inputs.length; k++) {
                                var result = checkValue(array[j].name, $(inputs[k]).val());
                                if (!result.valid) {
                                    bootboxError("生产计划更新后-生产要求-进线用料-金属股芯-用量-" + array[j].text + result.text);
                                    $(".arrange #submit").removeProp("disabled");
                                    $(".arrange #cancel").removeProp("disabled");
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
                            {"name": "djsh", "text": "单件损耗"},
                            {"name": "djxqmc", "text": "单件需求米长"},
                            {"name": "js", "text": "件数"},
                            {"name": "zmc", "text": "总米长"},
                            {"name": "zsh", "text": "总损耗"},
                            {"name": "zxqmc", "text": "总需求米长"},
                            {"name": "gzlxh", "text": "工字轮型号"}
                        ];
                        for (var j = 0; j < array.length; j++) {
                            var inputs = $(".arrange .gxh_scyq_jxyl_zxg_yl_" + index).find("input[name=" + array[j].name + "]");
                            for (var k = 0; k < inputs.length; k++) {
                                var result = checkValue(array[j].name, $(inputs[k]).val());
                                if (!result.valid) {
                                    bootboxError("生产计划更新后-生产要求-进线用料-中心股-用量-" + array[j].text + result.text);
                                    $(".arrange #submit").removeProp("disabled");
                                    $(".arrange #cancel").removeProp("disabled");
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
                            {"name": "djsh", "text": "单件损耗"},
                            {"name": "djxqmc", "text": "单件需求米长"},
                            {"name": "js", "text": "件数"},
                            {"name": "zmc", "text": "总米长"},
                            {"name": "zsh", "text": "总损耗"},
                            {"name": "zxqmc", "text": "总需求米长"},
                            {"name": "gzlxh", "text": "工字轮型号"}
                        ];
                        for (var j = 0; j < array.length; j++) {
                            var inputs = $(".arrange .gxh_scyq_jxyl_bjsx_yl_" + index).find("input[name=" + array[j].name + "]");
                            for (var k = 0; k < inputs.length; k++) {
                                var result = checkValue(array[j].name, $(inputs[k]).val());
                                if (!result.valid) {
                                    bootboxError("生产计划更新后-生产要求-进线用料-半金属芯-用量-" + array[j].text + result.text);
                                    $(".arrange #submit").removeProp("disabled");
                                    $(".arrange #cancel").removeProp("disabled");
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
                            {"name": "djsh", "text": "单件损耗"},
                            {"name": "djxqmc", "text": "单件需求米长"},
                            {"name": "js", "text": "件数"},
                            {"name": "zmc", "text": "总米长"},
                            {"name": "zsh", "text": "总损耗"},
                            {"name": "zxqmc", "text": "总需求米长"},
                            {"name": "gzlxh", "text": "工字轮型号"}
                        ];
                        for (var j = 0; j < array.length; j++) {
                            var inputs = $(".arrange .gxh_scyq_jxyl_zjp_yl_" + index).find("input[name=" + array[j].name + "]");
                            for (var k = 0; k < inputs.length; k++) {
                                var result = checkValue(array[j].name, $(inputs[k]).val());
                                if (!result.valid) {
                                    bootboxError("生产计划更新后-生产要求-进线用料-" + zjpText + "-用量-" + array[j].text + result.text);
                                    $(".arrange #submit").removeProp("disabled");
                                    $(".arrange #cancel").removeProp("disabled");
                                    return;
                                }
                            }
                        }
                    }
                    if (wgExist) {
                        var array = [
                            {"name": "dc", "text": "段长"},
                            {"name": "ds", "text": "段数"},
                            {"name": "djmc", "text": "单件米长"},
                            {"name": "djsh", "text": "单件损耗"},
                            {"name": "djxqmc", "text": "单件需求米长"},
                            {"name": "js", "text": "件数"},
                            {"name": "zmc", "text": "总米长"},
                            {"name": "zsh", "text": "总损耗"},
                            {"name": "zxqmc", "text": "总需求米长"},
                            {"name": "gzlxh", "text": "工字轮型号"}
                        ];
                        for (var j = 0; j < array.length; j++) {
                            var inputs = $(".arrange .gxh_scyq_jxyl_wg_yl_" + index).find("input[name=" + array[j].name + "]");
                            for (var k = 0; k < inputs.length; k++) {
                                var result = checkValue(array[j].name, $(inputs[k]).val());
                                if (!result.valid) {
                                    bootboxError("生产计划更新后-生产要求-进线用料-外股-用量-" + array[j].text + result.text);
                                    $(".arrange #submit").removeProp("disabled");
                                    $(".arrange #cancel").removeProp("disabled");
                                    return;
                                }
                            }
                        }
                    }
                    if (gExist) {
                        var gcs = getFromNode("gcs", arrangeData, "scyq.jxyl");
                        for (var j = gcs.begin; j < gcs.begin + gcs.total; j++) {
                            var gs = getFromNode("gs", arrangeData, "scyq.jxyl.gdc" + j);
                            for (var k = gs.begin; k < gs.begin + gs.total; k++) {
                                var array = [
                                    {"name": "dc", "text": "段长"},
                                    {"name": "ds", "text": "段数"},
                                    {"name": "djmc", "text": "单件米长"},
                                    {"name": "djsh", "text": "单件损耗"},
                                    {"name": "djxqmc", "text": "单件需求米长"},
                                    {"name": "js", "text": "件数"},
                                    {"name": "zmc", "text": "总米长"},
                                    {"name": "zsh", "text": "总损耗"},
                                    {"name": "zxqmc", "text": "总需求米长"},
                                    {"name": "gzlxh", "text": "工字轮型号"}
                                ];
                                for (var l = 0; l < array.length; l++) {
                                    var inputs = $(".arrange .gxh_scyq_jxyl_gdc" + j + "_g" + k + "_yl_" + index).find("input[name=" + array[l].name + "]");
                                    for (var m = 0; m < inputs.length; m++) {
                                        var result = checkValue(array[l].name, $(inputs[m]).val());
                                        if (!result.valid) {
                                            bootboxError("生产计划更新后-生产要求-进线用料-第" + j + "层股-" + "股" + k + "-用量-" +
                                                array[l].text + result.text);
                                            $(".arrange #submit").removeProp("disabled");
                                            $(".arrange #cancel").removeProp("disabled");
                                            return;
                                        }
                                    }
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
                    } else {
                        array = [
                            {"name": "dc", "text": "段长"},
                            {"name": "ds", "text": "段数"},
                            {"name": "djmc", "text": "单件米长"},
                            {"name": "djsh", "text": "单件损耗"},
                            {"name": "djscmc", "text": "单件生产米长"},
                            {"name": "js", "text": "件数"},
                            {"name": "zmc", "text": "总米长"},
                            {"name": "zsh", "text": "总损耗"},
                            {"name": "zscmc", "text": "总生产米长"},
                            {"name": "gzlxh", "text": "工字轮型号"}
                        ]
                    }
                    for (var j = 0; j < array.length; j++) {
                        var inputs;
                        if (isGss) {
                            inputs = $(".arrange .gxh_scyq_cpyq_sxfs_gss_" + index).find("input[name=" + array[j].name + "]");
                        } else {
                            inputs = $(".arrange .gxh_scyq_cpyq_sxfs_not_gss_" + index).find("input[name=" + array[j].name + "]");
                        }
                        for (var k = 0; k < inputs.length; k++) {
                            var result = checkValue(array[j].name, $(inputs[k]).val());
                            if (!result.valid) {
                                bootboxError("生产计划更新后-生产要求-产品要求-收线方式-" + array[j].text + result.text);
                                $(".arrange #submit").removeProp("disabled");
                                $(".arrange #cancel").removeProp("disabled");
                                return;
                            }
                        }
                    }
                }
                var newForms = [];
                var saveForm;
                var id = arrangeData._id;
                for (var i = 0; i < gxhFpjtDtTable.fnGetNodes().length; i++) {
                    var node = gxhFpjtDtTable.fnGetNodes()[i];
                    var index = $(node).attr("index");
                    var data = $.extend(true, {}, arrangeData);
                    data._id = index;
                    var input = $(node).find("input[name=jtmcxs]");
                    setToNode("value", data, $(input).attr("name"), $(input).val());
                    var selects = $(node).find("select");
                    for (var j = 0; j < $(selects).length; j++) {
                        var name = $(selects[j]).attr("name");
                        if (name == "bzz" ||
                            name == "czg" ||
                            name == "jth") {
                            setToNode("value", data, name, $($(selects[j]).find("option:selected")).attr("name"));
                            setToNode("_id", data, name, $(selects[j]).select2().select2("val"));
                            data[name] = $($(selects[j]).find("option:selected")).attr("name");
                            if (name == "bzz") {
                                setToNode("value", data, "bz", $($(selects[j]).find("option:selected")).attr("bz"));
                                data["bz"] = $($(selects[j]).find("option:selected")).attr("bz");
                            }
                        }
                        else {
                            setToNode("value", data, name, $(selects[j]).select2().select2("val"));
                            data[name] = $(selects[j]).select2().select2("val");
                        }
                    }
                    if (yzExist) {
                        var tr = $(".arrange .gxh_scyq_jxyl_yz_yl_" + index).find("tbody tr:has(td:not(.dataTables_empty))");
                        var inputs = $(tr).find("input");
                        for (var j = 0; j < $(inputs).length; j++) {
                            setToNode("value", data, "scyq.jxyl.yz.yl." + $(inputs[j]).attr("name"), $(inputs[j]).val());
                        }
                    }
                    if (xwxExist) {
                        var tr = $(".arrange .gxh_scyq_jxyl_xwx_yl_" + index).find("tbody tr:has(td:not(.dataTables_empty))");
                        var inputs = $(tr).find("input");
                        for (var j = 0; j < $(inputs).length; j++) {
                            tree.set(data, "scyq.jxyl.xwx.yl." + $(inputs[j]).attr("name"), $(inputs[j]).val());
                        }
                    }
                    if (jssxExist) {
                        setToNode("children", data, "scyq.jxyl.jssx.yl", $.extend(true, [], getFromNode("children", module, "scyq.jxyl.jssx.yl")))
                        tree.expire(data);
                        var trs = $(".arrange .gxh_scyq_jxyl_jssx_yl_" + index).find("tbody tr:has(td:not(.dataTables_empty))");
                        drawNode(trs.length, getFromNode("json", data, "scyq.jxyl.jssx.yl"), getFromNode("json", data, "scyq.jxyl.jssx.yl.yln"), "yls", 1);
                        tree.expire(data);
                        for (var j = 0; j < trs.length; j++) {
                            var inputs = $(trs[j]).find("input");
                            for (var k = 0; k < $(inputs).length; k++) {
                                setToNode("value", data, "scyq.jxyl.jssx.yl.yl" + (j + 1) + "." + $(inputs[k]).attr("name"), $(inputs[k]).val());
                            }
                        }
                    }
                    if (jsgxExist) {
                        setToNode("children", data, "scyq.jxyl.jsgx.yl", $.extend(true, [], getFromNode("children", module, "scyq.jxyl.jsgx.yl")));
                        tree.expire(data);
                        var trs = $(".arrange .gxh_scyq_jxyl_jsgx_yl_" + index).find("tbody tr:has(td:not(.dataTables_empty))");
                        drawNode(trs.length, getFromNode("json", data, "scyq.jxyl.jsgx.yl"), getFromNode("json", data, "scyq.jxyl.jsgx.yl.yln"), "yls", 1);
                        tree.expire(data);
                        for (var j = 0; j < trs.length; j++) {
                            var inputs = $(trs[j]).find("input");
                            for (var k = 0; k < $(inputs).length; k++) {
                                setToNode("value", data, "scyq.jxyl.jsgx.yl.yl" + (j + 1) + "." + $(inputs[k]).attr("name"), $(inputs[k]).val());
                            }
                        }
                    }
                    if (bjsxExist) {
                        setToNode("children", data, "scyq.jxyl.bjsx.yl", $.extend(true, [], getFromNode("children", module, "scyq.jxyl.bjsx.yl")));
                        tree.expire(data);
                        var trs = $(".arrange .gxh_scyq_jxyl_bjsx_yl_" + index).find("tbody tr:has(td:not(.dataTables_empty))");
                        drawNode(trs.length, getFromNode("json", data, "scyq.jxyl.bjsx.yl"), getFromNode("json", data, "scyq.jxyl.bjsx.yl.yln"), "yls", 1);
                        tree.expire(data);
                        for (var j = 0; j < trs.length; j++) {
                            var inputs = $(trs[j]).find("input");
                            for (var k = 0; k < $(inputs).length; k++) {
                                setToNode("value", data, "scyq.jxyl.bjsx.yl.yl" + (j + 1) + "." + $(inputs[k]).attr("name"), $(inputs[k]).val());
                            }
                        }
                    }
                    if (zxgExist) {
                        setToNode("children", data, "scyq.jxyl.zxg.yl", $.extend(true, [], getFromNode("children", module, "scyq.jxyl.zxg.yl")));
                        tree.expire(data);
                        var trs = $(".arrange .gxh_scyq_jxyl_zxg_yl_" + index).find("tbody tr:has(td:not(.dataTables_empty))");
                        drawNode(trs.length, getFromNode("json", data, "scyq.jxyl.zxg.yl"), getFromNode("json", data, "scyq.jxyl.zxg.yl.yln"), "yls", 1);
                        tree.expire(data);
                        for (var j = 0; j < trs.length; j++) {
                            var inputs = $(trs[j]).find("input");
                            for (var k = 0; k < $(inputs).length; k++) {
                                setToNode("value", data, "scyq.jxyl.zxg.yl.yl" + (j + 1) + "." + $(inputs[k]).attr("name"), $(inputs[k]).val());
                            }
                        }
                    }
                    if (wgExist) {
                        setToNode("children", data, "scyq.jxyl.wg.yl", $.extend(true, [], getFromNode("children", module, "scyq.jxyl.wg.yl")));
                        tree.expire(data);
                        setToNode("value", data, "scyq.jxyl.wg.yl.gs", getFromNode("value", arrangeData, "scyq.jxyl.wg.yl.gs") || "");
                        var trs = $(".arrange .gxh_scyq_jxyl_wg_yl_" + index).find("tbody tr:has(td:not(.dataTables_empty))");
                        drawNode(trs.length, getFromNode("json", data, "scyq.jxyl.wg.yl"), getFromNode("json", data, "scyq.jxyl.wg.yl.yln"), "yls", 1);
                        tree.expire(data);
                        for (var j = 0; j < trs.length; j++) {
                            var inputs = $(trs[j]).find("input[name!=gs]");
                            for (var k = 0; k < $(inputs).length; k++) {
                                setToNode("value", data, "scyq.jxyl.wg.yl.yl" + (j + 1) + "." + $(inputs[k]).attr("name"), $(inputs[k]).val());
                            }
                        }
                    }
                    if (zjpExist) {
                        setToNode("children", data, "scyq.jxyl.zjp.yl", $.extend(true, [], getFromNode("children", module, "scyq.jxyl.zjp.yl")));
                        tree.expire(data);
                        var trs = $(".arrange .gxh_scyq_jxyl_zjp_yl_" + index).find("tbody tr:has(td:not(.dataTables_empty))");
                        drawNode(trs.length, getFromNode("json", data, "scyq.jxyl.zjp.yl"), getFromNode("json", data, "scyq.jxyl.zjp.yl.yln"), "yls", 1);
                        tree.expire(data);
                        for (var j = 0; j < trs.length; j++) {
                            var inputs = $(trs[j]).find("input");
                            for (var k = 0; k < $(inputs).length; k++) {
                                setToNode("value", data, "scyq.jxyl.zjp.yl.yl" + (j + 1) + "." + $(inputs[k]).attr("name"), $(inputs[k]).val());
                            }
                        }
                    }
                    if (gExist) {
                        var gcs = getFromNode("gcs", data, "scyq.jxyl");
                        for (var j = gcs.begin; j < gcs.begin + gcs.total; j++) {
                            var gs = getFromNode("gs", data, "scyq.jxyl.gdc" + j);
                            for (var k = gs.begin; k < gs.begin + gs.total; k++) {
                                setToNode("children", data, "scyq.jxyl.gdc" + j + ".g" + k + ".yl", $.extend(true, [], getFromNode("children", module, "scyq.jxyl.gdcn.gn.yl")));
                                tree.expire(data);
                                setToNode("value", data, "scyq.jxyl.gdc" + j + ".g" + k + ".yl.gs", getFromNode("value", arrangeData, "scyq.jxyl.gdc" + j + ".g" + k + ".yl.gs") || "");
                                var trs = $(".arrange .gxh_scyq_jxyl_gdc" + j + "_g" + k + "_yl_" + index).find("tbody tr:has(td:not(.dataTables_empty))");
                                drawNode(trs.length, getFromNode("json", data, "scyq.jxyl.gdc" + j + ".g" + k + ".yl"), getFromNode("json", data, "scyq.jxyl.gdc" + j + ".g" + k + ".yl.yln"), "yls", 1);
                                tree.expire(data);
                                for (var l = 0; l < trs.length; l++) {
                                    var inputs = $(trs[l]).find("input[name!=gs]");
                                    for (var m = 0; m < $(inputs).length; m++) {
                                        setToNode("value", data, "scyq.jxyl.gdc" + j + ".g" + k + ".yl.yl" + (l + 1) + "." + $(inputs[m]).attr("name"),
                                            $(inputs[m]).val())
                                    }
                                }
                            }
                        }
                    }
                    var trs = $(".arrange .gxh_scyq_scsj_yjtcsj_" + index).find("tbody tr:has(td:not(.dataTables_empty))");
                    for (var j = 0; j < trs.length; j++) {
                        var inputs = $(trs[j]).find("input");
                        for (var k = 0; k < $(inputs).length; k++) {
                            setToNode("value", data, "scyq.scsj.yjtcsj." + $(inputs[k]).attr("name"), $(inputs[k]).val());
                        }
                    }
                    var trs = $(".arrange .gxh_scyq_scsj_yjscsj_" + index).find("tbody tr:has(td:not(.dataTables_empty))");
                    for (var j = 0; j < trs.length; j++) {
                        var inputs = $(trs[j]).find("input");
                        for (var k = 0; k < $(inputs).length; k++) {
                            setToNode("value", data, "scyq.scsj.yjscsj." + $(inputs[k]).attr("name"), $(inputs[k]).val());
                        }
                    }
                    setToNode("children", data, "scyq.cpyq.sxfs", $.extend(true, [], getFromNode("children", module, "scyq.cpyq.sxfs")));
                    tree.expire(data);
                    var trs;
                    if (isGss) {
                        trs = $(".arrange .gxh_scyq_cpyq_sxfs_gss_" + index).find("tbody tr:has(td:not(.dataTables_empty))");
                        deleteFromNode(data, "scyq.cpyq.sxfs.sxfsn", "dc");
                        deleteFromNode(data, "scyq.cpyq.sxfs.sxfsn", "ds");
                        deleteFromNode(data, "scyq.cpyq.sxfs.sxfsn", "djsh");
                        deleteFromNode(data, "scyq.cpyq.sxfs.sxfsn", "djscmc");
                        deleteFromNode(data, "scyq.cpyq.sxfs.sxfsn", "zsh");
                        deleteFromNode(data, "scyq.cpyq.sxfs.sxfsn", "zscmc");
                        deleteFromNode(data, "scyq.cpyq.sxfs.sxfsn", "gzlxh");
                    }
                    else {
                        trs = $(".arrange .gxh_scyq_cpyq_sxfs_not_gss_" + index).find("tbody tr:has(td:not(.dataTables_empty))");
                        deleteFromNode(data, "scyq.cpyq.sxfs.sxfsn", "bzfs")
                        deleteFromNode(data, "scyq.cpyq.sxfs.sxfsn", "lpxh")
                    }
                    drawNode(trs.length, getFromNode("json", data, "scyq.cpyq.sxfs"), getFromNode("json", data, "scyq.cpyq.sxfs.sxfsn"), "sxfss", 1);
                    tree.expire(data);
                    var jhcl = 0;
                    for (var j = 0; j < trs.length; j++) {
                        var inputs = $(trs[j]).find("input");
                        for (var k = 0; k < $(inputs).length; k++) {
                            if ($(inputs[k]).attr("name") == (isGss ? "zmc" : "zscmc")) {
                                jhcl = accAdd(jhcl, $(inputs[k]).val());
                            }
                            setToNode("value", data, "scyq.cpyq.sxfs.sxfs" + (j + 1) + "." + $(inputs[k]).attr("name"), $(inputs[k]).val());
                        }
                    }
                    if (checkNodeExist(data, "cljh")) {
                        setToNode("value", data, "cljh.jhcl", jhcl);
                    }
                    else {
                        data.body.push({
                            "text": "产量计划",
                            "type": "folder",
                            "name": "cljh",
                            "children": [
                                {
                                    "text": "计划产量",
                                    "name": "jhcl",
                                    "unit": "m",
                                    "value": jhcl
                                }
                            ]
                        })
                    }
                    if (index == "index" && !sjclExist) {
                        data._id = id;
                        saveForm = data;
                        saveForm["status"] = "未下发";
                    }
                    else {
                        delete data._id;
                        data["status"] = "未下发";
                        newForms.push(data);
                    }
                }
                if (sjclExist) {
                    $.ajax({
                        url: "../user/reArrangeSuspendedHsWorkPlan",
                        method: "POST",
                        data: {"id":id}
                    }).success(function () {
                        $.ajax({
                            url: "../user/createWorkPlan",
                            method: "POST",
                            data: "forms=" + encodeURIComponent(JSON.stringify(newForms))
                        }).success(function (data) {
                            $(".arrange").modal("hide");
                            toastr.success("安排成功");
                            dtTable.ajax.reload();
                            clearTreeContainer();
                        }).fail(function () {
                            $(".arrange #submit").removeProp("disabled");
                            $(".arrange #cancel").removeProp("disabled");
                            toastr.fail("安排失败");
                        });
                    }).fail(function () {
                        $(".arrange #submit").removeProp("disabled");
                        $(".arrange #cancel").removeProp("disabled");
                        toastr.fail("安排失败");
                    });
                }
                else {
                    $.ajax({
                        url: "../user/saveWorkPlan",
                        method: "POST",
                        data: "form=" + encodeURIComponent(JSON.stringify(saveForm))
                    }).success(function (data) {
                        if (newForms.length > 0) {
                            $.ajax({
                                url: "../user/createWorkPlan",
                                method: "POST",
                                data: "forms=" + encodeURIComponent(JSON.stringify(newForms))
                            }).success(function (data) {
                                $(".arrange").modal("hide");
                                toastr.success("安排成功");
                                dtTable.ajax.reload();
                                clearTreeContainer();
                            }).fail(function () {
                                $(".arrange #submit").removeProp("disabled");
                                $(".arrange #cancel").removeProp("disabled");
                                toastr.fail("安排失败");
                            });
                        }
                        else {
                            $(".arrange").modal("hide");
                            toastr.success("安排成功");
                            dtTable.ajax.reload();
                            clearTreeContainer();
                        }
                    }).fail(function () {
                        $(".arrange #submit").removeProp("disabled");
                        $(".arrange #cancel").removeProp("disabled");
                        toastr.fail("安排失败");
                    });
                }
            });
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
                                        $(".verify").addClass("disabled");
                                        toastr.success("提交成功");
                                    }).fail(mesUtil.error);
                                }
                            }
                        }
                    )
                });
            }
            if ($(".general-action .scan").length > 0) {
                $(".general-action .scan").on("click", function (e) {
                    var machNo = $("input.mach-no").val();
                    if (machNo === "") {
                        bootbox.alert("请输入机台号");
                    } else {
                        var a = $(".general-action tbody tr td:nth-child(4)");
                        for (var i = 0; i < a.length; i++) {
                            if (a[i].textContent === machNo) {
                                var $tr = $(a[i]).parent();
                                if (!$tr.hasClass("selected")) $tr.trigger("click");
                                break;
                            }
                        }
                        $(".general-action input.mach-no").val("");
                    }
                });
            }
        }

        //function loadFormInsts() {
        //    dtTable.fnClearTable();
        //    if (formId) {
        //        $.getJSON("../user/formInsts?form_id=" + formId, function (data) {
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
            $.getJSON("../user/getHsWorkPlanModule", function (tmpl) {
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
                    url: "../user/getHsWorkPlans",
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
                    {"data": "sggSzj"},
                    {"data": "lb"},
                    {"data": "jhscksrq"},
                    {"data": "jhscjsrq"},
                    {"data": "cj"},
                    {"data": "jth"},
                    {"data": "bz"},
                    {"data": "bzz"},
                    {"data": "czg"},
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
            gxqFpjtDtTable = $gxqFpjtTable.dataTable(datatableOption);
            gxqScyqCpyqGdcpDtTable = $gxqScyqCpyqGdcpTable.dataTable(datatableOption);
            gxqScyqJxylXwxGgDtTable = $gxqScyqJxylXwxGgTable.dataTable(datatableOption);
            gxqScyqJxylXwxYlDtTable = $gxqScyqJxylXwxYlTable.dataTable(datatableOption);
            gxqScyqJxylYzGgDtTable = $gxqScyqJxylYzGgTable.dataTable(datatableOption);
            gxqScyqJxylYzYlDtTable = $gxqScyqJxylYzYlTable.dataTable(datatableOption);
            gxqScyqJxylJssxGgDtTable = $gxqScyqJxylJssxGgTable.dataTable(datatableOption);
            gxqScyqJxylJssxYlDtTable = $gxqScyqJxylJssxYlTable.dataTable(datatableOption);
            gxqScyqJxylJsgxGgDtTable = $gxqScyqJxylJsgxGgTable.dataTable(datatableOption);
            gxqScyqJxylJsgxYlDtTable = $gxqScyqJxylJsgxYlTable.dataTable(datatableOption);
            gxqScyqJxylBjsxGgDtTable = $gxqScyqJxylBjsxGgTable.dataTable(datatableOption);
            gxqScyqJxylBjsxYlDtTable = $gxqScyqJxylBjsxYlTable.dataTable(datatableOption);
            gxqScyqJxylZxgGgDtTable = $gxqScyqJxylZxgGgTable.dataTable(datatableOption);
            gxqScyqJxylZxgYlDtTable = $gxqScyqJxylZxgYlTable.dataTable(datatableOption);
            gxqScyqJxylWgGgDtTable = $gxqScyqJxylWgGgTable.dataTable(datatableOption);
            gxqScyqJxylWgYlDtTable = $gxqScyqJxylWgYlTable.dataTable(datatableOption);
            gxqScyqJxylZjpGgDtTable = $gxqScyqJxylZjpGgTable.dataTable(datatableOption);
            gxqScyqJxylZjpYlDtTable = $gxqScyqJxylZjpYlTable.dataTable(datatableOption);
            gxqSjclLjwcclSxfsDtTable = $gxqSjclLjwcclSxfsTable.dataTable(datatableOption);
            gxqSjclWwcclSxfsDtTable = $gxqSjclWwcclSxfsTable.dataTable(datatableOption);
            gxqSjclRclSxfsDtTable = $gxqSjclRclSxfsTable.dataTable(datatableOption);
            gxqSjclBhgpSxfsDtTable = $gxqSjclBhgpSxfsTable.dataTable(datatableOption);
            gxhFpjtDtTable = $gxhFpjtTable.dataTable(datatableOption);
            gxhScyqCpyqGdcpDtTable = $gxhScyqCpyqGdcpTable.dataTable(datatableOption);
            gxhScyqJxylXwxGgDtTable = $gxhScyqJxylXwxGgTable.dataTable(datatableOption);
            gxhScyqJxylYzGgDtTable = $gxhScyqJxylYzGgTable.dataTable(datatableOption);
            gxhScyqJxylJssxGgDtTable = $gxhScyqJxylJssxGgTable.dataTable(datatableOption);
            gxhScyqJxylJsgxGgDtTable = $gxhScyqJxylJsgxGgTable.dataTable(datatableOption);
            gxhScyqJxylBjsxGgDtTable = $gxhScyqJxylBjsxGgTable.dataTable(datatableOption);
            gxhScyqJxylZxgGgDtTable = $gxhScyqJxylZxgGgTable.dataTable(datatableOption);
            gxhScyqJxylWgGgDtTable = $gxhScyqJxylWgGgTable.dataTable(datatableOption);
            gxhScyqJxylZjpGgDtTable = $gxhScyqJxylZjpGgTable.dataTable(datatableOption);
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
                    showTree(treeData);
                    //layout();
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
        //    // 显示特定的字段
        //    var rowValues = [data.submit ? "" : "<input type='checkbox'/>"];
        //    // 设置计划生产开始日期，计划生产结束日期
        //    rowValues.push(data["jhscksrq"] || "");
        //    rowValues.push(data["jhscjsrq"] || "");
        //    // 设置机台号，机台米长系数，班长，班次，操作工
        //    var names = ["jth", "jtmcxs", "bc", "bz", "czg"];
        //    for (var i = 0; i < names.length; i++) {
        //        rowValues.push(getFromNode("value", data, names[i]) || "");
        //    }
        //    rowValues.push(data.arrange ? "是" : "否");
        //    rowValues.push(data.submit ? "是" : "否");
        //    var t = dtTable.fnAddData(rowValues);
        //    //var t = dtTable.row.add(rowValues).draw();
        //    $(dtTable.fnSettings().aoData[t].nTr).attr("id", data._id);
        //    $(dtTable.fnSettings().aoData[t].nTr).attr("arrange", data.arrange);
        //    $(dtTable.fnSettings().aoData[t].nTr).attr("submit", data.submit);
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
    }
)
;