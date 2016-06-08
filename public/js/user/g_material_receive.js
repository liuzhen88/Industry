$(function () {

    var select2Option = {
        language: "zn-CN",
        placeholder: "请选择",
        allowClear: false,
        minimumResultsForSearch: -1
    };

    initData();
    initSel();

    function initData() {
        var wlHtml = "<option disabled selected></option>" +
            "<option value='主料'>主料</option>" +
            "<option value='辅料'>辅料</option>";
        $(".new select[name='wl']").html(wlHtml).select2(select2Option);

        $("#ipt-day,input[name='llrq']").datetimepicker({
            format: "yyyy-mm-dd",
            language: "zh-CN",
            startView: "decade",
            minView: "month",
            autoclose: true
        });
        mesUtil.loadEnums(function () {
            $(".new input[name='cj']").select2({
                placeholder: "请选择",
                allowClear: true,
                maximumSelectionSize: 1,
                tags: mesUtil.params.orgs.org1
            });
        });

    }

    function initSel() {
        mesUtil.loadEnums(function () {
            var cj = mesUtil.params.orgs.org1;
            var cjHtml = "<option disabled selected></option>";
            for (var i = 0; i < cj.length; i++) {
                cjHtml += "<option value='" + cj[i] + "'>" + cj[i] + "</option>";
            }
            $("#sel-cj").html(cjHtml);

            $("#sel-wl,#sel-cj,#sel-bc").select2(select2Option);
        });

        $.ajax({
            url: "../admin/internalForm/list?subForm=jtb",
            type: "GET"
        }).success(function (data) {
            var jthHtml = "<option disabled selected></option>";
            jthHtml += "<optgroup label='&nbsp;机台&nbsp;状态'>";
            data.data.forEach(function (u) {
                jthHtml += "<option value='" + u._id + "' name='" + u.device_num + "'>" + u.device_num + " &nbsp;" + (u.status || "") + "</option>";
            });
            jthHtml += "</optgroup>";
            $(".new select[name='jth']").html(jthHtml).select2(select2Option);
        }).fail(function () {
        });

        var bcHtml = "<option disabled selected></option>" +
            "<option value='白班'>白班</option>" +
            "<option value='晚班'>晚班</option>";
        $("#sel-bc").html(bcHtml).select2(select2Option);

        var wlHtml = "<option disabled selected></option>" +
            "<option value='主料'>主料</option>" +
            "<option value='辅料'>辅料</option>";
        $("#sel-wl").html(wlHtml).select2(select2Option);

    }

    var res = {};
    var handle = "";
    var dt;

    $("#search").on("click", function () {

        var wl = $("#sel-wl").find("option:selected").val();
        if (wl == "") {
            alertResult("物料不能为空", "error");
            return;
        }
        res.wl = wl;
        var llrq = $("#ipt-day").val();
        if (llrq == "") {
            alertResult("领料日期不能为空", "error");
        }
        res.llrq = llrq;
        var cj = $("#sel-cj").find("option:selected").val();
        if (cj == "") {
            alertResult("车间不能为空", "error");
            return;
        }
        res.cj = cj;
        var bc = $("#sel-bc").find("option:selected").val();
        if (bc == "") {
            alertResult("班次不能为空", "error");
            return;
        }
        res.bc = bc;

        dt = $("#tab").DataTable({
            ajax: {
                url: "../user/getGMaterialReceives",
                type: "GET",
                data: res
            },
            serverSide: 'true',
            paging: true,
            "searching": true,
            "columns": [
                {"data": "jth.name"},
                {"data": "gssjg"},
                {"data": "lb"},
                {"data": "wlgg.lb"},
                {"data": "wlgg.bmzt"},
                {"data": "wlgg.sfdz"},
                {"data": "wlgg.zj"},
                {"data": "wlgg.qd"},
                {"data": "yl.djmc"},
                {"data": "yl.gzlxh"},
                {"data": "jhly.js"},
                {"data": "jhly.comment"},
                {"data": "sjly.js"},
                {"data": "sjly.comment"},
                {
                    "data": "oper", render: function (data, type, full, meta) {
                    return "<a id='" + full._id + "'class='btn green-meadow'><span>查看</span></a>";
                }
                }
            ],
            columnDefs: [{
                "targets": "_all",
                "data": null, // Use the full data source object for the renderer's source
                "render": function (data, type, full, meta) {
                    return data || "";
                }
            }],
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
        $("#tab").DataTable().draw();
        console.log("res:"+res);
        console.log("res:"+JSON.stringify(res));

        //打印
        $("#print").on("click", function () {
            $("#ipt-day").attr("value", $("#ipt-day").val());
            $("#tab tr :last-child").hide();
            $(".select2-arrow").hide();
            $("#check1,#check2").show();
            $(".type,#tab,#check1,#check2").jqprint();
            $(".select2-arrow").show();
            $("#tab tr :last-child").show();
            $("#check1,#check2").hide();
        });
    });


    dt = $("#tab").DataTable({
        ajax: {
            url: "../user/getGMaterialReceives",
            type: "GET"
        },
        serverSide: 'true',
        paging: true,
        "searching": true,
        "columns": [
            {"data": "jth.name"},
            {"data": "gssjg"},
            {"data": "lb"},
            {"data": "wlgg.lb"},
            {"data": "wlgg.bmzt"},
            {"data": "wlgg.sfdz"},
            {"data": "wlgg.zj"},
            {"data": "wlgg.qd"},
            {"data": "yl.djmc"},
            {"data": "yl.gzlxh"},
            {"data": "jhly.js"},
            {"data": "jhly.comment"},
            {"data": "sjly.js"},
            {"data": "sjly.comment"},
            {
                "data": "oper", render: function (data, type, full, meta) {
                return "<a id='" + full._id + "'class='btn green-meadow'><span>查看</span></a>";
            }
            }
        ],
        columnDefs: [{
            "targets": "_all",
            "data": null, // Use the full data source object for the renderer's source
            "render": function (data, type, full, meta) {
                return data || "";
            }
        }],
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

    $("#tab").on("click", "a", function (e) {
        var id = $(this).attr("id");
        $.post("../user/getGMaterialReceive", {id: id}, function (data) {
            $('#submit').hide();
            $('#update,#delete').show();
            $('.modal-title').text("查看捻股工段领料计划单");
            $("form input,form select,form textarea").attr("disabled", "disabled");
            $("#delete").attr("name", id);
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
    }

    //修改
    $("#update").on("click", function () {
        handle = "update";
        $('.modal-title').text("修改捻股工段领料计划单");
        $(".new #update_new input[name!=username],.new #update_new textarea,.new #submit").removeAttr("disabled").removeClass("disabled");
        $(".new #update").hide();
        $(".new #submit,.new #delete").show();

    });

    //删除
    $("#delete").on('click', function () {
        var handleOld = handle;
        handle = "delete";
        bootbox.dialog({
            message: "确认删除该条数据吗?",
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
                                url: "../user/deleteGMaterialReceive",
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

    //新建
    $('form').formValidation({
        framework: 'bootstrap',
        fields: {}
    }).on('success.form.fv', function (e) {
        e.preventDefault();
        var $form = $(e.target);
        if (handle == "create") {
            $.ajax({
                url: "../user/createGMaterialReceive",
                type: 'POST',
                data: $form.serialize() + "&jthName=" + ($($("select[name='jth']").find("option:selected")).attr("name") || "")
            }).success(function (data, status, jqXHR) {
                $(".modal.new").modal("hide");
                alertResult("添加成功");
                dt.ajax.reload();
            }).fail(mesUtil.error);
        }
        else if (handle == "update") {
            $.ajax({
                url: "../user/updateGMaterialReceive",
                type: 'POST',
                data: $form.serialize() + "&id" + "=" + $("#delete").attr("name") +
                "&jthName=" + ($($("select[name='jth']").find("option:selected")).attr("name") || "")
            }).success(function (data, status, jqXHR) {
                $(".modal.new").modal("hide");
                alertResult("修改成功");
                dt.ajax.reload();
            }).fail(mesUtil.error);
        }
    });

    //modal 新建
    $(".btn-new").on("click", function (e) {
        handle = "create";
        $('.new #update,.new #delete').hide();
        $('.new #submit').show();
        $('.modal-title').text("新建领料计划单");
        $(".new input[class!='select2-input'],.new select,.new textarea").removeAttr("disabled");
        $(".new input[type!=radio],.new textarea,.new select").val('').trigger("change");
        $('.new input,.new select').removeAttr('checked').removeAttr('selected');
        $(".modal.new").modal({backdrop: "static", keyborad: false});
    });


    function alertResult(msg, result) {
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

});
