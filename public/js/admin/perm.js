$(function () {

        var open = false;
        var loadData;

        var initForm = function (data) {
            var html = "<th  tabindex='0' width='10%'  rowspan='1', colspan='1'>类型</th>" +
                "<th tabindex='0', width='30%', rowspan='1', colspan='1'>名称</th>";
            mesUtil.params.perms.forEach(function (o, index) {
                html += "<th tabindex='0', width='auto', rowspan='1', colspan='1'>" + o.value + "</th>";
            });
            $("#tab-list-perms thead tr").html(html);
            html = "<tr id='empty' class='odd'><td valign='top' colspan='" + (mesUtil.params.perms.length + 2) +
                "' class='dataTables_empty'>目前表内没有数据</td></tr>"
            $("#tab-list-perms tbody").html(html);
            var openList = [];
            data.forEach(function (f, idx) {
                if (f.category.name == "form") {
                    f.class = f.type.value;
                }
                else {
                    f.class = f.category.value;
                }
                if (f.children != undefined && f.children != null && f.children instanceof Array &&
                    f.children.length > 0) {
                    open = true;
                    openList.push(f);
                }
            });
            if (open) {
                var hasAll = [];
                for (var i = 0; i < openList.length; i++) {
                    var has = [];
                    for (var j = 0; j < openList[i].children.length; j++) {
                        for (var k = 0; k < data.length; k++) {
                            if (openList[i].children[j]._id == data[k]._id) {
                                has.push(data[k]);
                                hasAll.push(data[k]);
                            }
                        }
                    }
                    openList[i].children = has;
                }
                for (var i = 0; i < hasAll.length; i++) {
                    for (var j = 0; j < data.length; j++) {
                        if (hasAll[i]._id == data[j]._id) {
                            data.splice(j, 1);
                            break;
                        }
                    }
                }
                for (var i = 0; i < openList.length; i++) {
                    for (var j = 0; j < data.length; j++) {
                        if (openList[i]._id == data[j]._id) {
                            data[j] = openList[i];
                            break;
                        }
                    }
                }
                for (var i = 0; i < data.length; i++) {
                    var f = data[i];
                    if (f.children != undefined && f.children != null && f.children instanceof Array &&
                        f.children.length > 0) {
                        var html = "<tr role='p' len='" + f.children.length + "'><td>" + f.class +
                            "</td><td><a class='insevo-icon insevo-checkbox insevo-checkbox-add-delete " +
                            "insevo-checkbox-add'></a></td><td>" + f.name + "</td>";
                        for (var j = 0; j < mesUtil.params.perms.length; j++) {
                            var equal = false;
                            for (var k = 0; k < f.perms.length; k++) {
                                if (mesUtil.params.perms[j].name == f.perms[k]) {
                                    html += "<td><a class='insevo-icon insevo-checkbox insevo-checkbox-unchecked' " +
                                        "name='" + mesUtil.params.perms[j].name + "'/></a></td>";
                                    equal = true;
                                    break;
                                }
                            }
                            if (!equal) {
                                html += "<td></td>";
                            }
                        }
                        html += "</tr>";
                        $(html).insertBefore($("#empty"));
                        html = "";
                        for (var j = 0; j < f.children.length; j++) {
                            html += "<tr role='s' index='" + (j + 1) + "' form_id='" + f.children[j]._id + "'>" +
                                "<td>&nbsp;-</td><td>" + f.children[j].name + "</td>";
                            for (var k = 0; k < mesUtil.params.perms.length; k++) {
                                var equal = false;
                                for (var l = 0; l < f.children[j].perms.length; l++) {
                                    if (mesUtil.params.perms[k].name == f.children[j].perms[l]) {
                                        html += "<td><a class='insevo-icon insevo-checkbox insevo-checkbox-unchecked' " +
                                            "name='" + mesUtil.params.perms[k].name + "'/></a></td>";
                                        equal = true;
                                        break;
                                    }
                                }
                                if (!equal) {
                                    html += "<td></td>";
                                }
                            }
                            html += "</tr>";
                        }
                        $(html).insertBefore($("#empty")).hide();
                    }
                    else {
                        html = "<tr form_id='" + f._id + "'><td>" + f.class + "</td><td></td><td>" + f.name + "</td>";
                        for (var j = 0; j < mesUtil.params.perms.length; j++) {
                            var equal = false;
                            for (var k = 0; k < f.perms.length; k++) {
                                if (mesUtil.params.perms[j].name == f.perms[k]) {
                                    html += "<td><a class='insevo-icon insevo-checkbox insevo-checkbox-unchecked' " +
                                        "name='" + mesUtil.params.perms[j].name + "'/></a></td>";
                                    equal = true;
                                    break;
                                }
                            }
                            if (!equal) {
                                html += "<td></td>";
                            }
                        }
                        html += "</tr>";
                        $(html).insertBefore($("#empty"));
                        ;
                    }
                }
                $("#tab-list-perms .insevo-checkbox-add-delete").on("click", function () {
                    var tr = $(this).parents("tr")[0];
                    var td = $($(this).parents("td")[0]).prev();
                    var len = $(tr).attr("len");
                    if ($(this).hasClass("insevo-checkbox-add")) {
                        $(td).attr("rowspan", parseInt(len) + 1);
                        $(tr).nextAll().slice(0, len).show();
                        $(this).removeClass("insevo-checkbox-add").addClass("insevo-checkbox-delete");
                    }
                    else {
                        $(td).removeAttr("rowspan");
                        $(tr).nextAll().slice(0, len).hide();
                        $(this).removeClass("insevo-checkbox-delete").addClass("insevo-checkbox-add");
                    }
                });
            }
            else {
                var html = "";
                for (var i = 0; i < data.length; i++) {
                    var f = data[i];
                    html += "<tr form_id='" + f._id + "'><td>" + f.class + "</td><td>" + f.name + "</td>";
                    for (var j = 0; j < mesUtil.params.perms.length; j++) {
                        var equal = false;
                        for (var k = 0; k < f.perms.length; k++) {
                            if (mesUtil.params.perms[j].name == f.perms[k]) {
                                html += "<td><a class='insevo-icon insevo-checkbox insevo-checkbox-unchecked' name='" +
                                    mesUtil.params.perms[j].name + "'/></a></td>";
                                equal = true;
                                break;
                            }
                        }
                        if (!equal) {
                            html += "<td></td>";
                        }
                    }
                    html += "</tr>";
                }
                $(html).insertBefore($("#empty"));
                ;
            }
            $("#tab-list-perms tbody tr:not(#empty)").wrapAll("<div id='wrap'>");
            $("#wrap").hide();
            $("#tab-list-perms tbody td").css("vertical-align", "middle");
            initParams();
        }

        var initParams = function () {
            $("#tab-list-perms a:not([class*=insevo-checkbox-add-delete])")
                .removeClass("insevo-checkbox-unchecked insevo-checkbox-checked insevo-checkbox-undetermined")
                .addClass("insevo-checkbox-unchecked");
            $("#tab-list-perms tr[form_id] .insevo-checkbox-unchecked").attr("value", 0);
        }

        var loadParams = function (data) {
            var perms = data.perms;
            if (perms != null && perms instanceof Array && perms.length > 0) {
                $("#tab-list-perms tbody tr[form_id]").each(function (index, f) {
                    for (var i = 0; i < perms.length; i++) {
                        if ($(f).attr("form_id") == perms[i].form_id) {
                            var as = $(f).find("a");
                            as.each(function (index, a) {
                                var name = $(a).attr("name");
                                if (perms[i][name]) {
                                    $(a).removeClass("insevo-checkbox-unchecked")
                                        .addClass("insevo-checkbox-checked");
                                    $(a).attr("value", 1);
                                }
                            })
                            break;
                        }
                    }
                });
            }
            var ps = $("#tab-list-perms tr[role=p]");
            if (ps.length > 0) {
                ps.each(function (index, p) {
                    var len = $(p).attr("len");
                    var as = $(p).find("a");
                    as.each(function (index, a) {
                        var name = $(a).attr("name");
                        var sell = $(p).nextAll().slice(0, len).find("a[name='" + name + "'][value=1]").length;
                        if (len == sell == 1 || len == sell > 1) {
                            $(a).removeClass("insevo-checkbox-unchecked").addClass("insevo-checkbox-checked");
                        }
                        if (sell > 0 && sell < len) {
                            $(a).removeClass("insevo-checkbox-unchecked").addClass("insevo-checkbox-undetermined");
                        }
                    })
                });
            }
            $("#edit").removeAttr("disabled");
        }

        var ontd = function () {
            $("#tab-list-perms").on('click', "td:has(a:not([class*=insevo-checkbox-add-delete]))", function (e) {
                    var tr = $(this).parents("tr")[0];
                    var a = $(this).find("a");
                    var name = a.attr("name");
                    var role = $(tr).attr("role");
                    if (role == "p") {
                        var len = $(tr).attr("len");
                        var row = $(tr).nextAll().slice(0, len).find("a[name='" + name + "']");
                        if (a.hasClass("insevo-checkbox-unchecked")) {
                            row.removeClass("insevo-checkbox-unchecked").addClass("insevo-checkbox-checked")
                                .attr("value", 1);
                            a.removeClass("insevo-checkbox-unchecked").addClass("insevo-checkbox-checked");
                        }
                        else {
                            row.removeClass("insevo-checkbox-checked").addClass("insevo-checkbox-unchecked")
                                .attr("value", 0);
                            a.removeClass("insevo-checkbox-checked insevo-checkbox-undetermined")
                                .addClass("insevo-checkbox-unchecked");
                        }
                    }
                    else if (role == "s") {
                        var index = parseInt($(tr).attr("index"));
                        for (var i = 0; i < index; i++) {
                            tr = $(tr).prev();
                        }
                        var len = $(tr).attr("len");
                        var pa = tr.find("a[name='" + name + "']");
                        if (a.hasClass("insevo-checkbox-unchecked")) {
                            a.removeClass("insevo-checkbox-unchecked").addClass("insevo-checkbox-checked")
                                .attr("value", 1);
                            var row = $(tr).nextAll().slice(0, len).find("a[name='" + name + "'][value=1]");
                            if (len == 1) {
                                pa.removeClass("insevo-checkbox-unchecked")
                                    .addClass("insevo-checkbox-checked");
                            }
                            else if (row.length == len) {
                                pa.removeClass("insevo-checkbox-undetermined")
                                    .addClass("insevo-checkbox-checked");
                            }
                            else {
                                if (!pa.hasClass("insevo-checkbox-undetermined")) {
                                    pa.addClass("insevo-checkbox-undetermined");
                                }
                                if (pa.hasClass("insevo-checkbox-unchecked")) {
                                    pa.removeClass("insevo-checkbox-unchecked");
                                }
                            }
                        }
                        else {
                            a.removeClass("insevo-checkbox-checked").addClass("insevo-checkbox-unchecked").attr("value", 0);
                            var row = $(tr).nextAll().slice(0, len).find("a[name='" + name + "'][value=0]");
                            if (len == 1) {
                                pa.removeClass("insevo-checkbox-checked").addClass("insevo-checkbox-unchecked");
                            }
                            else if (row.length == len) {
                                pa.removeClass("insevo-checkbox-undetermined")
                                    .addClass("insevo-checkbox-unchecked");
                            }
                            else {
                                if (pa.hasClass("insevo-checkbox-checked")) {
                                    pa.removeClass("insevo-checkbox-checked").addClass("insevo-checkbox-undetermined");
                                }
                            }
                        }
                    }
                    else {
                        if (a.hasClass("insevo-checkbox-unchecked")) {
                            a.removeClass("insevo-checkbox-unchecked").addClass("insevo-checkbox-checked")
                                .attr("value", 1);
                        }
                        else {
                            a.removeClass("insevo-checkbox-checked insevo-checkbox-undetermined")
                                .addClass("insevo-checkbox-unchecked").attr("value", 0);
                        }
                    }
                }
            )
        }

        var offtd = function () {
            $("#tab-list-perms").off('click', "td:has(a:not([class*=insevo-checkbox-add-delete]))");
        }

        var alertResult = function (msg, result) {
            toastr.options = {
                "closeButton": true,
                "debug": false,
                "positionClass": "toast-bottom-right",
                "onclick": null,
                "showDuration": "1000",
                "hideDuration": "1000",
                "timeOut": "5000",
                "extendedTimeOut": "1000",
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut"
            };
            if (result == "success") {
                toastr.success(msg);
            }
            else {
                toastr.error(msg)
            }
        }

        $.ajax({
            url: "../admin/forms",
            type: "POST",
            data: "categoryName=form&formDisplay=true&categoryName=module"
        }).success(function (data) {
            if (data == undefined || data == null || data.length == 0) {
                return;
            }
            mesUtil.loadEnums(function () {
                var html = "";
                mesUtil.params.roles.forEach(function (o) {
                    html += "<option value='" + o + "'>" + o + "</option>";
                });
                $("#sel-role").append(html);
                $("#sel-user").html("<option disabled selected></option>");
                $("#sel-role").select2({
                    language: "zn-CN",
                    placeholder: "请选择角色",
                    allowClear: false,
                    minimumResultsForSearch: -1
                });
                $("#sel-user").select2({
                    language: "zn-CN",
                    placeholder: "请选择用户",
                    allowClear: false
                });
                initForm(data);
                $(".portlet-body").show();
            });
            $("#sel-role").on("change", function () {
                $("#sel-user").prop("disabled", "disabled");
                $("#sel-user").prev().find(".select2-chosen").html("");
                $("#submit,#edit,#cancel").hide();
                if (open) {
                    $("#add-delete").hide();
                }
                var wrap = $("#tab-list-perms tbody").find("#wrap");
                if (wrap.length == 0) {
                    $("#tab-list-perms tbody tr:not(#empty)").wrapAll("<div id='wrap'>");
                    $("#wrap").hide();
                    $("#empty td").attr("colspan", $("#tab-list-perms thead th").length);
                    $("#empty").show();
                }
                $.ajax({
                    url: "../admin/findUsers",
                    type: "POST",
                    data: "roles=" + $("#sel-role").val()
                }).success(function (data) {
                    var html = "<option disabled selected></option>";
                    html += "<optgroup label='&nbsp;用户名&nbsp;&nbsp;姓名'>";
                    data.forEach(function (u) {
                        html += "<option value='" + u._id + "'>" + u.username + "&nbsp;" + u.last_name + u.first_name + "</option>";
                    });
                    html += "</optgroup>";
                    $("#sel-user").html(html);
                    $("#sel-user").removeProp("disabled");
                    $("#sel-user").select2({
                        placeholder: "请选择用户"
                    });
                }).fail(function () {
                    mesUtil.error;
                    alertResult("网络异常,请稍后再试", "error");
                });
            });
            $("#sel-user").on('change', function () {
                offtd();
                $("#edit").prop("disabled", "disabled");
                if (open) {
                    if ($("#tab-list-perms thead").find($("#add-delete")).length == 0) {
                        $("<th id='add-delete' tabindex='0', width='4%', rowspan='1', colspan='1'></th>")
                            .insertAfter($("#tab-list-perms thead th:eq(0)"));
                    }
                    else {
                        $("#add-delete").show();
                    }
                }
                initParams();
                var wrap = $("#tab-list-perms tbody").find("#wrap");
                if (wrap.length == 1) {
                    wrap.find("tr").unwrap();
                    $("#empty").hide();
                }
                $("#edit").show();
                $("#submit,#cancel").hide();
                $.ajax({
                    url: "../admin/getUser",
                    type: "POST",
                    async: true,
                    data: "id=" + $("#sel-user").val()
                }).success(function (data) {
                    loadData = data;
                    loadParams(data);
                }).fail(function () {
                    mesUtil.error;
                    alertResult("网络异常,请稍后再试", "error");
                });
            });
            $("#edit").on("click", function () {
                ontd();
                $("#edit").hide();
                $("#submit,#cancel").show();
            });
            $("#cancel").on("click", function () {
                offtd();
                initParams();
                loadParams(loadData);
                $("#cancel").hide();
                $("#submit").hide();
                $("#edit").show();
            });
            $("#submit").on('click', function () {
                offtd();
                $("#submit").attr("disabled", "disabled");
                $("#cancel").attr("disabled", "disabled");
                var trs = $("#tab-list-perms tbody").find("tr[form_id]:has(a[value=1])");
                var updateData = [];
                trs.each(function (index, tr) {
                    var r = {};
                    r["form_id"] = $(tr).attr("form_id");
                    $(tr).find("a").each(function (index, a) {
                        if (parseInt($(a).attr("value")) == 0) {
                            r[$(a).attr("name")] = false;
                        }
                        else {
                            r[$(a).attr("name")] = true;
                        }
                    })
                    updateData.push(r);
                });
                $.ajax({
                    url: "../admin/perm",
                    type: "POST",
                    data: "perms=" + encodeURIComponent(JSON.stringify(updateData)) + "&userId=" + $("#sel-user").val()
                }).success(function (data, status, jqXHR) {
                    $("#submit,#cancel").hide();
                    $("#submit,#cancel").removeAttr("disabled");
                    $("#edit").show();
                    alertResult("保存成功", "success");
                    loadData.perms = updateData;
                }).fail(function () {
                    mesUtil.error;
                    alertResult("网络异常，请稍后再试", "error");
                    $("#submit,#cancel").removeAttr("disabled");
                });
            });
        }).fail(mesUtil.error);
    }
)
;