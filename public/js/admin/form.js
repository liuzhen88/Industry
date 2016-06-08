$(function () {

        var steps;
        var types = [];
        var refresh = false;
        var modalData;

        var initForm = function (data) {
            var open = false;
            var openList = [];
            data.forEach(function (f, idx) {
                if (f.children != undefined && f.children != null && f.children instanceof Array &&
                    f.children.length > 0) {
                    open = true;
                    openList.push(f);
                }
            });
            if (open) {
                $("<th id='add-delete' tabindex='0', width='4%', rowspan='1', colspan='1'></th>")
                    .insertAfter($("#tab-list-forms thead th:eq(0)"));
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
                        var html = "<tr role='p' len='" + f.children.length + "'form_id='" + f._id + "' form_name='" +
                            f.name + "' style='height:51px'><td>" + f.type.value + "</td><td>" +
                            "<a class='insevo-icon insevo-checkbox insevo-checkbox-add-delete insevo-checkbox-add'></a>" +
                            "</td><td>" + f.name + "</td><td></td></tr>";
                        $(html).appendTo($("#tab-list-forms tbody"));
                        html = "";
                        for (var j = 0; j < f.children.length; j++) {
                            html += "<tr role='s' index='" + (j + 1) + "' form_id='" + f.children[j]._id +
                                "' form_name='" + f.children[j].name + "' type_name='" + f.children[j].type.name +
                                "' type_value='" + f.children[j].type.value + "' ";
                            if (!f.default) {
                                html += "mixed='" + f.children[j].mixed + "'";
                            }
                            html += "><td>&nbsp;-</td><td>" + f.children[j].name + "</td><td>";
                            if (f.default) {
                                html += "<a class='btn green-meadow'><span>查看</span></a>";
                            }
                            else {
                                if (!f.children[j].complete) {
                                    html += "<a class='btn blue-madison'><span>添加</span></a>";
                                }
                                else {
                                    html += "<a class='btn green-meadow'><span>查看</span></a>";
                                }
                                html += " <a class='btn red-sunglo'><span>删除</span></a>";
                            }
                            html += "</td></tr>";
                        }
                        $(html).appendTo($("#tab-list-forms tbody")).hide();
                    }
                    else {
                        var html = "<tr form_id='" + f._id + "' form_name='" + f.name + "' type_name='" + f.type.name +
                            "' type_value='" + f.type.value + "' ";
                        if (!f.default) {
                            html += "mixed='" + f.mixed + "'";
                        }
                        html += "><td>" + f.type.value + "</td><td></td><td>" + f.name + "</td><td>";
                        if (f.default) {
                            html += "<a class='btn green-meadow'><span>查看</span></a>";
                        }
                        else {
                            if (!f.complete) {
                                html += "<a class='btn blue-madison'><span>添加</span></a>"
                            }
                            else {
                                html += "<a class='btn green-meadow'><span>查看</span></a>";
                            }
                            html += " <a class='btn red-sunglo'><span>删除</span></a>";
                        }
                        html += "</td></tr>";
                        $(html).appendTo($("#tab-list-forms tbody"));
                    }
                }
                $("#tab-list-forms .insevo-checkbox-add-delete").on("click", function () {
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
                    html += "<tr form_id='" + f._id + "' form_name='" + f.name + "' type_name='" + f.type.name +
                        "' type_value='" + f.type.value + "' ";
                    if (!f.default) {
                        html += "mixed='" + f.mixed + "'";
                    }
                    html += "><td>" + f.type.value + "</td><td>" + f.name + "</td><td>";
                    if (f.default) {
                        html += "<a class='btn green-meadow'><span>查看</span></a>";
                    }
                    else {
                        if (!f.complete) {
                            html += "<a class='btn blue-madison'><span>添加</span></a>"
                        }
                        else {
                            html += "<a class='btn green-meadow'><span>查看</span></a>";
                        }
                        html += " <a class='btn red-sunglo'><span>删除</span></a>";
                    }
                    html += "</td></tr>";
                }
                $(html).appendTo($("#tab-list-forms tbody"));
            }
            $("#tab-list-forms tbody td").css("vertical-align", "middle");
        }

        $('.new form').formValidation({
            framework: 'bootstrap',
            fields: {
                name: {
                    validators: {
                        notEmpty: {
                            message: '请填写名称'
                        }
                    }
                },
                type: {
                    validators: {
                        notEmpty: {
                            message: '请选择类型'
                        }
                    }
                }
            }
        })

        $("#new").on("click", function (e) {
            $(".new #step").hide();
            $(".new input[name='name']").val("");
            $(".new #sel-type").val("");
            $(".new input[name='step']").select2({
                placeholder: "选择工段/工序",
                allowClear: true,
                maximumSelectionSize: 1,
                tags: steps
            });
            $(".new #sel-type").select2({
                placeholder: "选择表单类型",
                allowClear: false,
                maximumSelectionSize: 1,
            });
            $(".new").modal(
                {
                    backdrop: "static",
                    keyborad: false
                }
            );
        });

        $(".new #sel-type").on("change", function (e) {
            $(".new input[name='step']").val("").trigger("change");
            var option = $(".new #sel-type option:checked");
            if (option.attr("steps") == "true") {
                $(".new #step").show();
            }
            else {
                $(".new #step").hide();
            }
        })

        $(".new #cancel,.new .close").on("click", function (e) {
            $(".new form").data('formValidation').resetForm();
        })

        $(".new #submit").on("click", function (e) {
            var valid = $(".new form").data('formValidation').isValid();
            if (valid == null || valid == false) {
                return;
            }
            $(".new #submit").prop("disabled", "disabled");
            $(".new #cancel").prop("disabled", "disabled");
            var name = $(".new input[name='name']").val();
            var typeName = $(".new #sel-type option:checked").attr("name");
            var typeValue = $(".new #sel-type").val();
            var mixed = $(".new #sel-type option:checked").attr("mixed");
            var perms = $(".new #sel-type option:checked").attr("perms");
            var step = $(".new input[name='step']").val();
            var order = $(".new #sel-type option:checked").attr("order");
            $.ajax({
                url: "../admin/createForm",
                type: 'POST',
                data: "name=" + encodeURIComponent(name) + "&" + "typeName=" + typeName + "&" + "typeValue=" + typeValue + "&"
                + "mixed=" + mixed + "&" + "perms=" + perms + "&" + "step=" + encodeURIComponent(step) + "&" + "order=" + order
            }).success(function (data) {
                if (data.result == "exists") {
                    $(".new form").data('formValidation').updateMessage("name", "notEmpty", "名称已存在");
                    $(".new form").data('formValidation').updateStatus("name", "INVALID", "notEmpty");
                    $(".new input[name='name']").one("keydown", function () {
                        $(".new form").data('formValidation').updateMessage("name", "notEmpty", "请填写名称");
                    })
                    $(".new #submit").removeProp("disabled");
                    $(".new #cancel").removeProp("disabled");
                    return;
                }
                else {
                    $(".new form").data('formValidation').resetForm();
                    $(".new").modal("hide");
                    $(".new #cancel").removeProp("disabled");
                    $(".new #submit").removeProp("disabled");
                    alertResult("添加成功", "success");
                    init();
                }
            }).fail(function () {
                mesUtil.error;
                alertResult("网络异常,请稍后再试", "error");
                $(".new #submit").removeProp("disabled");
                $(".new #cancel").removeProp("disabled");
            });
        });

        $("#tab-list-forms").on("click", ".green-meadow", function () {
            $(".view #tree").empty();
            $(".view #tree").html("<div id='view-jstree'></div>");
            var tr = $(this).parents("tr")[0];
            var id = $(tr).attr("form_id");
            var name = $(tr).attr("form_name");
            var typeValue = $(tr).attr("type_value");
            if ($(tr).attr("role") == "s") {
                var index = parseInt($(tr).attr("index"));
                for (var i = 0; i < index; i++) {
                    tr = $(tr).prev();
                }
                name = tr.attr("form_name") + " - " + name;
            }
            $(".view input[name=name]").val(name);
            $(".view input[name=type]").val(typeValue);
            $(".view").modal(
                {
                    backdrop: "static",
                    keyborad: false
                }
            );
            $.ajax({
                url: "../admin/getForm",
                type: "POST",
                data: "id=" + id
            }).success(function (data) {
                $('.view #view-jstree').jstree({
                    "core": {
                        "themes": {
                            "responsive": true
                        },
                        "data": data.body,
                    },
                    "types": {
                        "default": {
                            "icon": "fa fa-folder icon-state-warning icon-lg"
                        },
                        "file": {
                            "icon": "fa fa-file icon-state-warning icon-lg"
                        }
                    },
                    "plugins": ["types"]
                });
            }).fail(function () {
                mesUtil.error;
                alertResult("网络异常,请稍后再试", "error");
            });
        })

        $("#tab-list-forms").on("click", ".blue-madison", function () {
                refresh = false;
                $(".add #tree").empty();
                var tr = $(this).parents("tr")[0];
                var name = $(tr).attr("form_name");
                var typeValue = $(tr).attr("type_value");
                var typeName = $(tr).attr("type_name");
                var id = $(tr).attr("form_id");
                var mixed = $(tr).attr("mixed");
                if ($(tr).attr("role") == "s") {
                    var index = parseInt($(tr).attr("index"));
                    for (var i = 0; i < index; i++) {
                        tr = $(tr).prev();
                    }
                    name = tr.attr("form_name") + " - " + name;
                }
                $(".add input[name=name]").val(name);
                $(".add input[name=type]").val(typeValue);
                $(".add #sel-modal").html("");
                $(".add #sel-modal").prev().find(".select2-chosen").html("");
                $(".add #modal").hide();
                $(".add #data").hide();
                $(".add #submit").attr("form_id", id);
                $(".add #submit").hide();
                $(".add #cancel").text("取消");
                $(".add #cancel").hide();
                $(".add .alert").remove();
                $(".add").modal(
                    {
                        backdrop: "static",
                        keyborad: false
                    }
                );
                $.ajax({
                    url: "../admin/forms",
                    type: "POST",
                    data: "valid=true&categoryName=form&formDisplay=false&formSelected=false&formTypeName=" + typeName
                }).success(function (data) {
                        if (data.length == 0) {
                            var html = alertHtml("该类型的模板已全部选择", "danger");
                            $(html).insertAfter($(".add .row"));
                            $(".add #cancel").text("关闭");
                            $(".add #cancel").show();
                            return;
                        }
                        var html = "<option  disabled selected></option>";
                        var open = false;
                        var openList = [];
                        data.forEach(function (f, idx) {
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
                        }
                        for (var i = 0; i < data.length; i++) {
                            var f = data[i];
                            if (f.children != undefined && f.children != null && f.children instanceof Array &&
                                f.children.length > 0) {
                                html += "<optgroup label='" + f.name + "'>";
                                for (var j = 0; j < f.children.length; j++) {
                                    html += "<option value='" + f.children[j]._id + "'>" + f.children[j].name + "</option>";
                                }
                                html += "</optgroup>";
                            }
                            else {
                                html += "<option value='" + f._id + "'>" + f.name + "</option>";
                            }
                        }
                        $(".add #sel-modal").html(html);
                        $(".add #sel-modal").select2({
                            language: "zn-CN",
                            placeholder: "请选择表单",
                            allowClear: false
                        });
                        $(".add #cancel").show();
                        $(".add #modal").show();
                        $(".add #data").show()
                        $(".add #submit").show();
                    }
                ).fail(function () {
                        mesUtil.error;
                        alertResult("网络异常,请稍后再试", "error");
                        $(".add #cancel").text("关闭");
                        $(".add #cancel").show();
                    });
            }
        )

        $('.add form').formValidation({
            framework: 'bootstrap',
            fields: {
                modal: {
                    validators: {
                        notEmpty: {
                            message: '请选择模板'
                        }
                    }
                }
            }
        })

        $(".add #sel-modal").on("change", function () {
                //$(".add #tree").prev("label").css("color", "");
                //$(".add #tree").next("span").css("color", "").text("");
                $(".add #tree").empty();
                $(".add #tree").html("<div id='add-jstree'></div>");
                var id = $(".add #sel-modal").val();
                $.ajax({
                    url: "../admin/getForm",
                    type: "POST",
                    data: "id=" + id
                }).success(function (data) {
                    modalData = data;
                    $('.add #add-jstree').jstree({
                        "core": {
                            "themes": {
                                "responsive": true
                            },
                            "data": data.body,
                        },
                        "types": {
                            "default": {
                                "icon": "fa fa-folder icon-state-warning icon-lg"
                            },
                            "file": {
                                "icon": "fa fa-file icon-state-warning icon-lg"
                            }
                        },
                        "plugins": ["types"]
                    });
                }).fail(function () {
                    mesUtil.error;
                    alertResult("网络异常,请稍后再试", "error");
                });
            }
        )

        //$(".add #tree").on("click", "a", function () {
        //    var tree = $(".add #add-jstree").jstree();
        //    var ids = getCheckedIds(tree);
        //    if (ids.length == 0) {
        //        $(".add #tree").prev("label").css("color", "rgb(169,68,66)");
        //        $(".add #tree").next("span").css("color", "rgb(169,68,66)").text("请选择数据");
        //    }
        //    else {
        //        $(".add #tree").prev("label").css("color", "rgb(60,118,61)");
        //        $(".add #tree").next("span").css("color", "").text("");
        //    }
        //})

        $(".add #submit").on("click", function (e) {
            var valid = $(".add form").data('formValidation').isValid();
            if (valid == null || valid == false) {
                return;
            }
            //var tree = $(".add #add-jstree").jstree();
            //var ids = getCheckedIds(tree);
            //if (ids.length == 0) {
            //    $(".add #tree").prev("label").css("color", "rgb(169,68,66)");
            //    $(".add #tree").next("span").css("color", "rgb(169,68,66)").text("请选择数据");
            //    return;
            //}
            //var body = generateCheckedTree(tree);
            var body = modalData.body;
            $(".add #cancel").prop("disabled", "disabled");
            $(".add #submit").prop("disabled", "disabled");
            var from = $(".add #sel-modal").val();
            var id = $(".add #submit").attr("form_id");
            $.ajax({
                url: "../admin/updateForm",
                type: "POST",
                data: "id=" + id + "&" + "from=" + from + "&" + "body=" + encodeURIComponent(JSON.stringify(body))
            }).success(function (data) {
                //$(".add #tree").prev("label").css("color", "");
                $(".add form").data('formValidation').resetForm();
                $(".add").modal("hide");
                $(".add #cancel").removeProp("disabled");
                $(".add #submit").removeProp("disabled");
                init();
                alertResult("添加成功", "success");
            }).fail(function () {
                mesUtil.error;
                alertResult("网络异常,请稍后再试", "error");
                $(".add #cancel").removeProp("disabled");
                $(".add #submit").removeProp("disabled");
            });
        });

        $(".add #cancel,.add .close").on("click", function (e) {
            $(".add form").data('formValidation').resetForm();
            //$(".add #tree").prev("label").css("color", "");
            //$(".add #tree").next("span").css("color", "").text("");
            if (refresh) {
                init();
            }
        })

        $("#tab-list-forms").on("click", ".red-sunglo", function () {
            var tr = $(this).parents("tr")[0];
            var id = $(tr).attr("form_id");
            bootbox.dialog({
                message: "确认删除该表单吗?",
                title: "删除确认",
                show: true,
                backdrop: true,
                closeButton: false,
                className: "my-modal",
                buttons: [
                    {
                        label: "取消",
                        className: "btn-default",
                        callback: function () {
                        }
                    },
                    {
                        label: "确认",
                        className: "btn blue",
                        callback: function () {
                            $.ajax({
                                url: "../admin/deleteForm",
                                type: "POST",
                                data: "id=" + id
                            }).success(function (data) {
                                alertResult("删除成功", "success");
                                init();
                            }).fail(function () {
                                mesUtil.error;
                                alertResult("网络异常,请稍后再试", "error");
                            });
                        }
                    }
                ]
            });
        })

        //var getCheckedIds = function (tree) {
        //    var bottoms = tree.get_bottom_checked(true);
        //    var ids = [];
        //    for (var i = 0; i < bottoms.length; i++) {
        //        ids.push(bottoms[i].id);
        //        var parentsIds = bottoms[i].parents;
        //        for (var j = 0; j < parentsIds.length; j++) {
        //            if (parentsIds[j] == "#") {
        //                continue;
        //            }
        //            else {
        //                var exists = false;
        //                for (var k = 0; k < ids.length; k++) {
        //                    if (parentsIds[j] == ids[k]) {
        //                        exists = true;
        //                        break;
        //                    }
        //                }
        //                if (!exists) {
        //                    ids.push(parentsIds[j]);
        //                }
        //            }
        //        }
        //    }
        //    return ids;
        //}

        //var joinCheckedData = function (tree, id, ids) {
        //    var array = [];
        //    var pNode = tree.get_node(id);
        //    var children = pNode.children;
        //    for (var i = 0; i < children.length; i++) {
        //        for (var j = 0; j < ids.length; j++) {
        //            if (children[i] == ids[j]) {
        //                var sNode = tree.get_node(children[i]);
        //                var original = sNode.original;
        //                if (sNode.children.length == 0) {
        //                    array.push(original);
        //                }
        //                else {
        //                    original.children = joinCheckedData(tree, sNode.id, ids);
        //                    array.push(original);
        //                }
        //            }
        //        }
        //    }
        //    return array;
        //}

        //var generateCheckedTree = function (tree) {
        //    var ids = getCheckedIds(tree);
        //    var array = joinCheckedData(tree, "#", ids);
        //    return array;
        //}
        //
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

        var alertHtml = function (msg, result) {
            var html = "<div class='alert alert-" + result + " alert-dismissible fade in' style='margin-bottom:0px' " +
                "role='alert'><button  class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>" +
                "&times;</span></button><span>" + msg + "</span></div>";
            return html;
        }

        var init = function () {
            $(".portlet-body").hide();
            $.ajax({
                url: "../admin/forms",
                type: "POST",
                data: "categoryName=form&formDisplay=true"
            }).success(function (data) {
                if (data == undefined || data == null || data.length == 0) {
                    var html = "<tr id='empty' class='odd'><td valign='top' colspan='3' " +
                        "class='dataTables_empty'>" +
                        "目前表内没有数据</td></tr>"
                    $("#tab-list-forms tbody").html(html);
                    $(".portlet-body").show();
                    return;
                }
                $("#tab-list-forms tbody").html("");
                $("#add-delete").remove();
                initForm(data);
                $(".portlet-body").show();
            }).fail(mesUtil.error);
        }

        mesUtil.loadEnums(function () {
            steps = mesUtil.params.steps;
            for (var i = 0; i < mesUtil.params.types.length; i++) {
                if (mesUtil.params.types[i].display) {
                    types.push(mesUtil.params.types[i]);
                }
            }
            var html = "<option  disabled selected></option>";
            for (var i = 0; i < types.length; i++) {
                html += "<option name='" + types[i].name + "' value='" + types[i].value + "' mixed='" + types[i].mixed +
                    "' steps='" + types[i].steps + "' perms='" + types[i].perms + "' order='" + types[i].order + "'>" +
                    types[i].value + "</option>";
            }
            $(".new #sel-type").html(html);
            init();
        })
    }
)
;