$(function () {

    var select2Option = {
        language: "zn-CN",
        placeholder: "请选择",
        allowClear: false,
        minimumResultsForSearch: -1
    }

    var mul = [{
        index: 1,
        id: "",
        value: "",
        bz: "",
        children: [
            {
                index: 1,
                id: "",
                value: ""
            }
        ]
    }];
    var bzzIndex = 1;
    var czgIndex = 1;
    var bzzHtml = "";
    var czgHtml = "";
    var zjyHtml = "";

    initData();

    function initData() {
        mesUtil.loadEnums(function () {
            $(".new input[name='cj']").select2({
                placeholder: "请选择",
                allowClear: true,
                maximumSelectionSize: 1,
                tags: mesUtil.params.orgs.org1
            });
        })
        $.ajax({
            url: "../admin/findUsers",
            type: "POST",
            data: "roles=质检部"
        }).success(function (data) {
            zjyHtml = "<option disabled selected></option>";
            zjyHtml += "<optgroup label='用户名&nbsp;&nbsp;姓名'>";
            data.forEach(function (u) {
                zjyHtml += "<option value='" + u._id + "' name=" + u.last_name + u.first_name + ">" +
                    u.username + "&nbsp;&nbsp;" + u.last_name + u.first_name + "</option>";
            });
            zjyHtml += "</optgroup>";
            $(".new select[name='zjy']").html(zjyHtml).select2(select2Option);
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
            $(".new select[name='bzz1']").html(bzzHtml).select2(select2Option);
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
            $(".new select[name='bzz1_czg1']").html(czgHtml).select2(select2Option);
        }).fail(function () {
        });
        $.ajax({
            url: "../admin/internalForm/list?subForm=jtb",
            type: "GET"
        }).success(function (data) {
            var jthHtml = "<option disabled selected></option>";
            jthHtml += "<optgroup label='&nbsp;机台&nbsp;&nbsp;状态'>";
            data.data.forEach(function (u) {
                jthHtml += "<option value='" + u._id + "' name='" + u.device_num + "'>" + u.device_num + " &nbsp;" + (u.status || "") + "</option>";
            });
            jthHtml += "</optgroup>";
            $(".new select[name='jth']").html(jthHtml).select2(select2Option);
        }).fail(function () {
        });
    }

    var handle = "";

    var dt = $('#tab').DataTable({
        ajax: {
            url: "../user/getSVirtualLibrarys",
            type: "GET"
        },
        serverSide: 'true',
        paging: true,
        "columns": [
            {
                "data": null, createdCell: function (nTd, sData, oData, iRow, iCol) {
                var startnum = this.api().page() * (this.api().page.info().length);
                $(nTd).html(iRow + 1 + startnum);//分页行号累加：$(nTd).html(iRow+1);
            }
            },
            {"data": "gzlbh"},
            {"data": "gzlxh"},
            {"data": "gdzzh"},
            {"data": "sfdz"},
            {"data": "cj"},
            {"data": "jth.name"},
            {"data": "bz"},
            {"data": "bzz"},
            {"data": "czg"},
            {"data": "lb"},
            {"data": "isZjp"},
            {"data": "jg"},
            {"data": "zj"},
            {"data": "nx"},
            {"data": "qd"},
            {"data": "tyfs"},
            {"data": "nj"},
            {"data": "bmzt"},
            {"data": "tsyq"},
            {"data": "dc"},
            {"data": "ds"},
            {"data": "djmc"},
            {"data": "zl"},
            {"data": "rksj"},
            {"data": "cksj"},
            {"data": "comment"},
            {"data": "zjy.name"},
            {"data": "zjsj"},
            {"data": "sfhg"},
            {"data": "bhgyy"},
            {
                "data": "oper", render: function (data, type, full, meta) {
                return "<a id='" + full._id + "'class='btn green-meadow'><span>查看</span></a>"
            }
            }
        ],
        columnDefs: [{
            "targets": "_all",
            "data": null, // Use the full data source object for the renderer's source
            "render": function (data, type, full, meta) {
                return data || "";
            }
        }
        ],
        "language": {
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


    $("#tab").on("click", "a", function (e) {
        var id = $(this).attr("id");
        $.post("../user/getSVirtualLibrary", {id: id}, function (data) {
            $('#submit').hide();
            if (data.sfhg == "不合格") $(".new .bhgyy").show();
            else $(".new .bhgyy").hide();
            $('#update,#delete').show();
            $('.modal-title').text("查看绳库");
            $("#delete").attr("name", id);
            var m = data.mul;
            var h = "";
            bzzIndex = 0;
            czgIndex = 0;
            for (var i = 0; i < m.length; i++) {
                bzzIndex++;
                m[i].index = bzzIndex;
                data["bzz" + bzzIndex] = m[i].id;
                h += "<div class='bzz bzz" + bzzIndex + "'>";
                for (var j = 0; j < m[i].children.length; j++) {
                    czgIndex++;
                    data["bzz" + bzzIndex + "_czg" + czgIndex] = m[i].children[j].id;
                    m[i].children[j].index = czgIndex;
                    h += "<div class='form-group czg czg" + czgIndex + "'>";
                    h += "<div class='col-md-5'>";
                    if (j == 0) {
                        h += "<label class='control-label' style='margin-right:5%'>班长</label>";
                        h += "<div class='fa ";
                        i == 0 ? h += "fa-plus bzz-plus' " : h += "fa-times bzz-del' ";
                        h += "bzz='" + bzzIndex + "'></div>";
                        h += "<select id='sel-bzz' class='form-control' name='bzz" + bzzIndex + "' type='text' value='" + m[i].id + "'></select>";
                    }
                    h += "</div>";
                    h += "<div class='col-md-4'>";
                    h += "<label class='control-label' style='margin-right:5%'>操作工</label>";
                    h += "<div class='fa ";
                    j == 0 ? h += "fa-plus czg-plus' " : h += "fa-times czg-del' ";
                    h += "bzz='" + bzzIndex + "' czg='" + czgIndex + "'></div>";
                    h += "<select id='sel-czg' class='form-control' name='bzz" + bzzIndex + "_czg" + czgIndex +
                        "' type='text'></select>";
                    h += "</div>";
                    if (m.length > 1 || (m.length == 1 && m[0].children.length > 1)) {
                        data["bzz" + bzzIndex + "_czg" + czgIndex + "_wcmc"] = m[i].children[j].wcmc;
                        h += "<div class='col-md-3'>";
                        h += "<label class='control-label'>完成米长</label>";
                        h += "<input class='form-control' name='bzz" + bzzIndex + "_czg" + czgIndex +
                            "_wcmc' type='text' />";
                        h += "</div>";
                    }
                    h += "</div>";
                }
                h += "</div>";
            }
            mul = m;
            $(".new .mul").html(h);
            $(".new #sel-bzz").html(bzzHtml).select2(select2Option);
            $(".new #sel-czg").html(czgHtml).select2(select2Option);
            $(".new .fa-plus,.new .fa-times").hide();
            $("form input,form select,form textarea").attr("disabled", "disabled");
            loadData(data);
            $(".modal.new").modal({backdrop: "static", keyborad: false});
        });
    });
    function loadData(obj) {
        var key, value, tagName, type, arr;
        for (x in obj) {
            key = x;
            value = obj[x];
            $("[name='" + key + "']").each(function () {
                tagName = $(this)[0].tagName;
                type = $(this).attr('type');
                if (tagName == 'INPUT') {
                    if (type == 'radio') {
                        $(this).prop('checked', $(this).val() == value);
                    } else if (type == 'checkbox') {
                        var checked = false;
                        for (var i = 0; i < value.length; i++) {
                            if ($(this).val() == value[i]) {
                                checked = true;
                                break;
                            }
                        }
                        if (checked) {
                            $(this).prop('checked', true);
                        }
                        else {
                            $(this).removeProp('checked');
                        }
                    } else {
                        $(this).val(value).trigger("change");
                    }
                } else if (tagName == 'SELECT' || tagName == 'TEXTAREA') {
                    $(this).val(value).trigger("change");
                }
            });
        }
    };

    $("#update").on("click", function () {
        handle = "update";
        $('.modal-title').text("修改绳库");
        $(".new input[name!=username],.new select,.new textarea,.new #submit").removeAttr("disabled").removeClass("disabled");
        $(".new #update").hide();
        $(".new #submit,.new #delete").show();
    });

    $("#delete").on('click', function () {
        var handleOld = handle;
        handle = "delete";
        bootbox.dialog({
            message: "确认删除该绳库吗?",
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
                        handle = handleOld;
                        $("button[type=submit]").removeAttr("disabled");
                        $("button[type=submit]").removeClass("disabled");
                    }
                },
                {
                    label: "确认",
                    className: "btn blue",
                    callback: function () {
                        var id = $("#delete").attr("name");
                        $.ajax(
                            {
                                url: "../user/deleteSVirtualLibrary",
                                type: "DELETE",
                                data: {id: id}
                            }).success(function () {
                                $(".modal.new").modal("hide");
                                dt.ajax.reload();
                                alertResult("删除成功");
                            }).fail(mesUtil.error);
                    }
                }
            ]
        });
    });
    $('form').formValidation({
        framework: 'bootstrap',
        fields: {}
    }).on('success.form.fv', function (e) {
        e.preventDefault();
        var $form = $(e.target);
        if (handle == "create") {
            $.ajax({
                url: "../user/createSVirtualLibrary",
                type: 'POST',
                data: $form.serialize() + "&jthName=" +
                ($($("select[name='jth']").find("option:selected")).attr("name") || "") +
                "&zjyName=" + ($($("select[name='zjy']").find("option:selected")).attr("name") || "") +
                "&mul=" + JSON.stringify(mul)
            }).success(function (data, status, jqXHR) {
                $(".modal.new").modal("hide");
                alertResult("添加成功");
                dt.ajax.reload();
            }).fail(mesUtil.error);
        }
        else if (handle == "update") {
            $.ajax({
                url: "../user/updateSVirtualLibrary",
                type: 'POST',
                data: $form.serialize() + "&id" + "=" + $("#delete").attr("name") + "&jthName=" +
                ($($("select[name='jth']").find("option:selected")).attr("name") || "") +
                "&zjyName=" + ($($("select[name='zjy']").find("option:selected")).attr("name") || "") +
                "&mul=" + JSON.stringify(mul)
            }).success(function (data, status, jqXHR) {
                $(".modal.new").modal("hide");
                alertResult("修改成功");
                dt.ajax.reload();
            }).fail(mesUtil.error);
        }
    });

    $(".btn-new").on("click", function (e) {
        handle = "create";
        $('.new #update,.new #delete,.new .bhgyy').hide();
        $('.new #submit').show();
        $('.modal-title').text("新建绳库");
        $(".new input[class!='select2-input'],.new select,.new textarea").removeAttr("disabled");
        $(".new .mul").empty();
        $(".new input[type!=radio],.new textarea,.new select").val('').trigger("change");
        $(".new .mul").html("<div class='bzz bzz1'>" +
            "<div class='form-group czg czg1'>" +
            "<div class='col-md-5'>" +
            "<label class='control-label' style='margin-right:5%'>班长</label>" +
            "<div class='fa fa-plus bzz-plus' bzz='1'></div>" +
            "<select id='sel-bzz' class='form-control' name='bzz1' type='text'></select>" +
            "</div>" +
            "<div class='col-md-4'>" +
            "<label class='control-label' style='margin-right:5%'>操作工</label>" +
            "<div class='fa fa-plus czg-plus' bzz='1' czg='1'></div>" +
            "<select id='sel-czg' class='form-control' name='bzz1_czg1' type='text'></select>" +
            "</div>" +
            "</div>" +
            "</div>");
        $(".new select[name='bzz1']").html(bzzHtml).select2(select2Option);
        $(".new select[name='bzz1_czg1']").html(czgHtml).select2(select2Option);
        $('.new input,.new select').removeAttr('checked').removeAttr('selected');
        mul = [{
            index: 1,
            id: "",
            value: "",
            bz: "",
            children: [
                {
                    index: 1,
                    id: "",
                    value: ""
                }
            ]
        }];
        $(".modal.new").modal({backdrop: "static", keyborad: false});
    });

    $("input[name='rksj'],input[name='cksj'],input[name='zjsj']").datetimepicker({
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
    });

    $(".new input[name='djmc'],.new input[name='zj']").on('input propertychange', function () {
        var zj = $(".new input[name='zj']").val();
        var djmc = $(".new input[name='djmc']").val();
        $(".new input[name='zl']").val(accMul(zj, zj, djmc, 0.38) / 100);
    });

    $(".new").on("change", "#sel-bzz", function (e) {
        e.preventDefault();
        var bzz = $(this).attr("name").slice(3);
        for (var i = 0; i < mul.length; i++) {
            if (mul[i].index == bzz) {
                mul[i].bz = $(this).find("option:selected").attr("bz");
                mul[i].id = $(this).find("option:selected").attr("value");
                mul[i].value = $(this).find("option:selected").attr("name");
                break;
            }
        }
    });

    $(".new").on("change", "#sel-czg", function (e) {
        e.preventDefault();
        var bzz = $(this).attr("name").split("_")[0].slice(3);
        var czg = $(this).attr("name").split("_")[1].slice(3);
        for (var i = 0; i < mul.length; i++) {
            if (mul[i].index == bzz) {
                for (var j = 0; j < mul[i].children.length; j++) {
                    if (mul[i].children[j].index == czg) {
                        mul[i].children[j].id = $(this).find("option:selected").attr("value");
                        mul[i].children[j].value = $(this).find("option:selected").attr("name");
                        break;
                    }
                }
            }
        }
    });

    $(".new").on("click", ".fa-plus.czg-plus", function (e) {
        e.preventDefault();
        var bzz = $(this).attr("bzz");
        var czg = $(this).attr("czg");
        if ($(".new .czg").length == 1) {
            $(".new .bzz1 .czg1").append("<div class='col-md-3'><label class='control-label'>完成米长</label>" +
                "<input class='form-control' name='bzz1_czg1_wcmc' type='text'/></div>")
        }
        czgIndex++;
        for (var i = 0; i < mul.length; i++) {
            if (mul[i].index == bzz) {
                mul[i].children.push({
                    index: czgIndex,
                    id: "",
                    value: ""
                });
            }
        }
        var html = "<div class='form-group czg czg" + czgIndex + "'>" +
            "<div class='col-md-5'></div>" +
            "<div class='col-md-4'>" +
            "<label class='control-label' style='margin-right:5%'>操作工</label>" +
            "<div class='fa fa-times czg-del' bzz='" + bzz + "' czg='" + czgIndex + "'></div>" +
            "<select class='form-control' name='bzz" + bzz + "_" + "czg" + czgIndex + "' id='sel-czg' type='text'></select>" +
            "</div>" +
            "<div class='col-md-3'>" +
            "<label class='control-label'>完成米长</label>" +
            "<input class='form-control' name='bzz" + bzz + "_" + "czg" + czgIndex + "_wcmc' type='text' />" +
            "</div>" +
            "</div>";
        $(".new .mul .bzz" + bzz).append(html);
        $(".new select[name='bzz" + bzz + "_" + "czg" + czgIndex + "']").html(czgHtml).select2(select2Option);
    })

    $(".new").on("click", ".fa-times.czg-del", function (e) {
        e.preventDefault();
        var bzz = $(this).attr("bzz");
        var czg = $(this).attr("czg");
        $(".new .mul .bzz" + bzz + " .czg" + czg).remove();
        if ($(".new .czg").length == 1) {
            $(".mul .bzz1 .czg1 .col-md-3").remove();
        }
        for (var i = 0; i < mul.length; i++) {
            if (mul[i].index == bzz) {
                for (var j = 0; i < mul[i].children.length; j++) {
                    if (mul[i].children[j].index == czg) {
                        mul[i].children.splice(j, 1);
                        break;
                    }
                }
            }
        }
    })

    $(".new").on("click", ".fa-plus.bzz-plus", function (e) {
        e.preventDefault();
        if ($(".new .czg").length == 1) {
            $(".new .bzz1 .czg1").append("<div class='col-md-3'><label class='control-label'>完成米长</label>" +
                "<input class='form-control' name='bzz1_czg1_wcmc' type='text'/></div>")
        }
        bzzIndex++;
        czgIndex++;
        mul.push({
            index: bzzIndex,
            id: "",
            value: "",
            bz: "",
            children: [
                {
                    index: czgIndex,
                    id: "",
                    value: ""
                }
            ]
        })
        var html = "<div class='bzz bzz" + bzzIndex + "'>" +
            "<div class='form-group czg czg" + czgIndex + "'>" +
            "<div class='col-md-5'>" +
            "<label class='control-label' style='margin-right:5%'>班长</label>" +
            "<div class='fa fa-times bzz-del' bzz='" + bzzIndex + "'></div>" +
            "<select class='form-control' name='bzz" + bzzIndex + "' id='sel-bzz' type='text'></select>" +
            "</div>" +
            "<div class='col-md-4'>" +
            "<label class='control-label' style='margin-right:5%'>操作工</label>" +
            "<div class='fa fa-plus czg-plus' bzz='" + bzzIndex + "' czg='" + czgIndex + "'></div>" +
            "<select class='form-control' name='bzz" + bzzIndex + "_" + "czg" + czgIndex + "' id='sel-czg' type='text'></select>" +
            "</div>" +
            "<div class='col-md-3'>" +
            "<label class='control-label'>收线米长</label>" +
            "<input class='form-control' name='bzz" + bzzIndex + "_" + "czg" + czgIndex + "_wcmc' type='text' />" +
            "</div>" +
            "</div>" +
            "</div>";
        $(".new .mul").append(html);
        $(".new select[name='bzz" + bzzIndex + "']").html(bzzHtml).select2(select2Option);
        $(".new select[name='bzz" + bzzIndex + "_" + "czg" + czgIndex + "']").html(czgHtml).select2(select2Option);
    })

    $(".new").on("click", ".fa-times.bzz-del", function (e) {
        e.preventDefault();
        var bzz = $(this).attr("bzz");
        $(".new .mul .bzz" + bzz).remove();
        if ($(".new .czg").length == 1) {
            $(".new .mul .bzz1 .czg1 .col-md-3").remove();
        }
        for (var i = 0; i < mul.length; i++) {
            if (mul[i].index == bzz) {
                mul.splice(i, 1);
                break;
            }
        }
    })

    $(".new input[name='sfhg']").on("change", function () {
        if ($(this).val() == "不合格") {
            $(".new .bhgyy").show();
        }
        else {
            $(".new textarea[name='bhgyy']").val("");
            $(".new .bhgyy").hide();
        }
    })

    function alertResult(msg) {
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
        toastr.success(msg);
    }

    function accMul(arg1, arg2, arg3, arg4) {
        var m = 0, s1 = arg1.toString(), s2 = arg2.toString(), s3 = arg3.toString(), s4 = arg4.toString();
        try {
            m += s1.split(".")[1].length
        } catch (e) {
        }
        try {
            m += s2.split(".")[1].length
        } catch (e) {
        }
        try {
            m += s3.split(".")[1].length
        } catch (e) {
        }
        try {
            m += s4.split(".")[1].length
        } catch (e) {
        }
        return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) * Number(s3.replace(".", "")) * Number(s4.replace(".", "")) / Math.pow(10, m)
    }
});
