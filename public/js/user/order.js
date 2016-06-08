$(function () {
    var handle = "";
    var formId = $(".form-card").attr("id");
    var specRegex = /^(\w+\*\w+)\+?([0-9]?FC|IWR|IWS)?$/i;
    var dt = $('#tab').DataTable({
        ajax: {
            url: "../user/listPrdOrd?id=" + formId,
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
            {"data": "ddh"},
            {"data": "dhdw"},
            {"data": "ddlx"},
            {"data": "khdm"},
            {"data": "xjdrq"},
            {"data": "status"},
            {"data": "bz"},
            {
                "data": null, createdCell: function (nTd, sData, oData, iRow, iCol) {
                var startnum = this.api().page() * (this.api().page.info().length);
                $(nTd).html("<a id='" + oData._id + "'class='btn green-meadow'><span>查看</span></a>" +
                    "<a id='" + oData._id + "'class='btn btn-danger' name='" + oData.ddh + "' status='" + oData.status + "'><span>明细</span></a>")
            }
            }
        ],
        columnDefs: [{
            "targets": "_all",
            "data": null, // Use the full data source object for the renderer's source
            "render": function (data, type, full, meta) {
                return data || "—";
            }
        }
        ],
        "order": [[5, "desc"]],
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

//日期格式化函数扩展
    Date.prototype.format = function (fmt) { //author: meizz
        var o = {
            "M+": this.getMonth() + 1,                 //月份
            "d+": this.getDate(),                    //日
            "h+": this.getHours(),                   //小时
            "m+": this.getMinutes(),                 //分
            "s+": this.getSeconds(),                 //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds()             //毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }

    $("#selectType").change(function(){
        if($(this).val()=="成品丝"){
           $("#ggType").hide();
           $("#nxType").hide();
        }else{
           $("#ggType").show();
           $("#nxType").show(); 
        }
    });

    $("#tab").on("click", "a.green-meadow", function (e) {
        var id = $(this).attr("id");
        $('tr.selected', $('#tab')).removeClass('selected');
        $(this).closest('tr').addClass('selected');
        $.post("../user/getPrdOrd", {id: id}, function (data) {
            $('#submit').hide();
            $('#update,#delete').show();
            $('.modal-title').text("查看生产订单");
            $("form input,form select,form textarea").attr("disabled", "disabled");
            $("#delete").attr("name", id);
            $("input[type!=radio],textarea").val('').trigger("change");
            if (data.status === mesUtil.formStatus.PROCESSED) {
                $(".modal.new .form-group.audit").removeClass("hidden");
                $('#delete,#update').addClass('hidden');
            } else {
                $(".modal.new .form-group.audit").addClass("hidden");
                $('#delete,#update').removeClass('hidden');
            }
            loadData(data);
            $(".modal.new").modal({backdrop: "static", keyborad: false});
        });
    });

    $("#tab").on("click", "a.btn-danger", function (e) {
        var id = $(this).attr("id");
        var ddh = $(this).attr("name");
        var status = $(this).attr("status");
        $('tr.selected', $('#tab')).removeClass('selected');
        $(this).closest('tr').addClass('selected');
        $(".addDetail").removeAttr("disabled");
        $("#detailSpan").html("订单号：" + ddh + "-明细列表");
        $("#detailDdh").val(ddh);
        $('.detailFooter button').unbind();
        $('#detail').html("<table id='detailTab'  class='table table-striped table-hover table-bordered dataTable no-footer' role='grid'>" +
            "<thead>" +
            "<tr>" +
            "<th>#</th>" +
            "<th>操作</th>" +
            "<th>产品编号</th>" +
            "<th>产品类别</th>" +
            "<th>用途</th>" +
            "<th>规格</th>" +
            "<th class='detail-jsx-spec'>金属芯规格</th>" +
            "<th>直径(mm)</th>" +
            "<th>单件米长(m)</th>" +
            "<th>件数</th>" +
            "<th>参考重量</th>" +
            "<th>强度</th>" +
            "<th>捻向</th>" +
            "<th>涂油方式</th>" +
            "<th>紧急程度</th>" +
            "<th>是否定制</th>" +
            "<th>交货日期</th>" +
            "<th>质量要求与技术标准</th>" +
            "<th>包装方式</th>" +
            "<th>特殊要求</th>" +
            "</tr>" +
            "</thead>" +
            "</table>"
        );
        $("#cancel2").attr("name", id);
        $("#cancel2").attr("status", status);
        if (getSelectedRowStatus() === mesUtil.formStatus.PROCESSED) {
            $(".addDetail").addClass('hidden');
        } else {
            $(".addDetail").removeClass('hidden');
        }
        dt2 = initDetailDataTable();
    });

    function getSelectedRowStatus() {
        var selData = dt.rows('.selected').data()[0];
        return selData.status;
    }

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
                    $(this).val(value);
                }
            });
        }
    };

    $("#update").on("click", function () {
        handle = "update";
        $('.modal-title').text("修改生产订单");
        $("input[name!=username],select,textarea,#submit").removeAttr("disabled").removeClass("disabled");
        $("#update").hide();
        $("#submit,#delete").show();
    });

    $("#delete").on('click', function () {
        var handleOld = handle;
        handle = "delete";
        bootbox.dialog({
            message: "确认删除该生产订单吗?",
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
                        $("#submit").removeAttr("disabled");
                        $("#submit").removeClass("disabled");
                    }
                },
                {
                    label: "确认",
                    className: "btn blue",
                    callback: function () {
                        var id = $("#delete").attr("name");
                        $.ajax(
                            {
                                url: "../user/deletePrdOrd",
                                type: "DELETE",
                                data: {id: id}
                            }).success(function () {
                                $(".modal.new").modal("hide");
                                dt.ajax.reload();
                                alertResult("删除成功", "success");
                            }).fail(mesUtil.error);
                    }
                }
            ]
        });
    });
    $('#form').formValidation({
        framework: 'bootstrap',
        fields: {
            form_no: {
                validators: {
                    notEmpty: {
                        message: '订单编号必须填写'
                    }
                }
            },
            author: {
                validators: {
                    notEmpty: {
                        message: '制表人必须填写'
                    }
                }
            },
            created: {
                validators: {
                    callback: {
                        callback: function (value, validator, $field) {
                            var err;
                            if (!/^\d{4}-\d{1,2}-\d{1,2}$/.test(value)) {
                                err = "制表日期必须填写且符合日期格式yyyy-MM-dd"
                            }
                            if (err)
                                return {valid: false, message: err}
                            else
                                return true;
                        }
                    }
                }
            },
            ddh: {
                validators: {
                    notEmpty: {
                        message: '订单编号必须填写'
                    }
                }
            },
            dhdw: {
                validators: {
                    notEmpty: {
                        message: '订货单位必须填写'
                    }
                }
            },
            ddlx: {
                validators: {
                    notEmpty: {
                        message: '订单类型必须填写'
                    }
                }
            },
            khdm: {
                validators: {
                    notEmpty: {
                        message: '客户代码必须填写'
                    }
                }
            },
            xjdrq: {
                validators: {
                    callback: {
                        callback: function (value, validator, $field) {
                            var err;
                            if (!/^\d{4}-\d{1,2}-\d{1,2}$/.test(value)) {
                                err = "下/接单日期必须填写且符合日期格式yyyy-MM-dd"
                            }
                            if (err)
                                return {valid: false, message: err}
                            else
                                return true;
                        }
                    }
                }
            }
        }
    })
    $('#submit').on("click", function (e) {
        $("#form").data('formValidation').validate();
        var valid = $("#form").data('formValidation').isValid();
        if (valid) {
            var $form = $("#form");
            if (handle == "create") {
                $.ajax({
                    url: "../user/createPrdOrd",
                    type: 'POST',
                    data: $form.serialize()
                }).success(function (data, status, jqXHR) {
                    $(".modal.new").modal("hide");
                    alertResult("添加成功", "success");
                    dt.ajax.reload();
                }).fail(mesUtil.error);
            }
            else if (handle == "update") {
                $.ajax({
                    url: "../user/updatePrdOrd",
                    type: 'POST',
                    data: $form.serialize() + "&id" + "=" + $("#delete").attr("name")
                }).success(function (data, status, jqXHR) {
                    $(".modal.new").modal("hide");
                    alertResult("修改成功", "success");
                    dt.ajax.reload();
                    $("#detailDdh").val($('input[name="ddh"]').val());
                }).fail(mesUtil.error);
            }
        }
    });    //modal 新建
    $(".addOrder").on("click", function (e) {
        handle = "create";
        $('#update,#delete').hide();
        $('#submit').show();
        $('.modal-title').text("新建生产订单");
        $("input[class!='select2-input'],select,textarea").removeAttr("disabled");
        $("input[type!=radio],textarea").val(null).trigger("change");
        $('input,select').removeAttr('checked').removeAttr('selected');
        $(".modal.new").modal({backdrop: "static", keyborad: false});
        $("#form").data('formValidation').validate();
        $("#form").data('formValidation').resetForm(true);
        $("input[name=form_no]").val('DD-' + moment().format('YYYYMMDD-HHmmssS'));
        $("input[name='created']").val(new Date().format("yyyy-MM-dd"));
        $("input[name='author']").val($('#user').attr("name"));
        $(".modal.new .form-group.audit").addClass("hidden");
    });
    $("input[date='true']").datetimepicker({
        format: "yyyy-mm-dd",
        language: "zh-CN",
        maxView: '4',
        minView: '2',
        autoclose: true,
        todayBtn: true,
        startDate: new Date(),
        endDate: moment().add(1, 'y').toDate()
    }).on('changeDate', function (ev) {
        $('form').formValidation('revalidateField', this.name);
    });

    function alertResult(msg, type) {
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
        if (type == "success") {
            toastr.success(msg);
        }
        else {
            toastr.error(msg);
        }
    }


    //明细--------------------------
    var handle2 = "";
    var dt2 = null;

    $("#update2").on("click", function () {
        handle2 = "update";
        $('.modal.new2 .modal-title').text("修改订单明细");
        $(".modal.new2 input[name!=est_weight],.modal.new2 select,.modal.new2 textarea,#submit2").removeAttr("disabled").removeClass("disabled");
        $("#update2").hide();
        $("#submit2,#delete2").show();
    });

    $("#delete2").on('click', function () {
        var handleOld = handle2;
        handle2 = "delete";
        bootbox.dialog({
            message: "确认删除该订单明细吗?",
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
                        handle2 = handleOld;
                    }
                },
                {
                    label: "确认",
                    className: "btn blue",
                    callback: function () {
                        var index = $("#delete2").attr("name");
                        $.ajax(
                            {
                                url: "../user/deletePrdOrdDetail",
                                type: "DELETE",
                                data: {index: index, id: $('#cancel2').attr("name")}
                            }).success(function () {
                                $(".modal.new2").modal("hide");
                                dt2.ajax.reload();
                                alertResult("删除成功", "success");
                            }).fail(mesUtil.error);
                    }
                }
            ]
        });
    });
    $('#form2').formValidation({
        framework: 'bootstrap',
        fields: {
            product_category: {
                validators: {
                    notEmpty: {
                        message: '产品类别必须填写'
                    }
                }
            },
            spec: {
                validators: {
                    notEmpty: {
                        message: '规格必须填写'
                    },
                    regexp: {
                        regexp: specRegex,
                        message: '规格不完整. 完整的规格格式如: 6*19S+FC.'
                    }
                }
            },
            jsx_spec: {
                validators: {
                    notEmpty: {
                        message: '金属芯规格必须填写'
                    },
                    regexp: {
                        //特殊钢丝绳的金属芯规格没有规律,故屏蔽正则匹配金属芯
                        // regexp: /^(\w+\*\w+)$/,
                        regexp: "",
                        message: '规格不符合要求. 正确的规格格式如: 1*19.'
                    }
                }
            },
            diameter: {
                validators: {
                    notEmpty: {
                        message: '直径必须填写'
                    }
                }
            },
            length: {
                validators: {
                    notEmpty: {
                        message: '长度必须填写'
                    }
                }
            },
            count: {
                validators: {
                    notEmpty: {
                        message: '件数必须填写'
                    }
                }
            }, strength: {
                validators: {
                    notEmpty: {
                        message: '强度必须填写'
                    }
                }
            }, direction: {
                validators: {
                    notEmpty: {
                        message: '捻向必须填写'
                    }
                }
            }, oil_method: {
                validators: {
                    notEmpty: {
                        message: '涂油方式必须填写'
                    }
                }
            },
            is_customized: {
                validators: {
                    notEmpty: {
                        message: '是否定制必须填写'
                    }
                }
            },
            ship_date: {
                validators: {
                    callback: {
                        callback: function (value, validator, $field) {
                            var err;
                            if (!/^\d{4}-\d{1,2}-\d{1,2}$/.test(value)) {
                                err = "交货日期必须填写且符合日期格式yyyy-MM-dd"
                            }
                            if (err)
                                return {valid: false, message: err}
                            else
                                return true;
                        }
                    }
                }
            },
            created: {
                validators: {
                    callback: {
                        callback: function (value, validator, $field) {
                            var err;
                            if (!/^\d{4}-\d{1,2}-\d{1,2}$/.test(value)) {
                                err = "制表日期必须填写且符合日期格式yyyy-MM-dd"
                            }
                            if (err)
                                return {valid: false, message: err}
                            else
                                return true;
                        }
                    }
                }
            },
            ddh: {
                validators: {
                    notEmpty: {
                        message: '订单编号必须填写'
                    }
                }
            },
            dhdw: {
                validators: {
                    notEmpty: {
                        message: '订货单位必须填写'
                    }
                }
            },
            ddlx: {
                validators: {
                    notEmpty: {
                        message: '订单类型必须填写'
                    }
                }
            },
            khdm: {
                validators: {
                    notEmpty: {
                        message: '客户代码必须填写'
                    }
                }
            },
            xjdrq: {
                validators: {
                    callback: {
                        callback: function (value, validator, $field) {
                            var err;
                            if (!/^\d{4}-\d{1,2}-\d{1,2}$/.test(value)) {
                                err = "下/接单日期必须填写且符合日期格式yyyy-MM-dd"
                            }
                            if (err)
                                return {valid: false, message: err}
                            else
                                return true;
                        }
                    }
                }
            },
            quality_spec: {
                validators: {
                    notEmpty: {
                        message: '质量要求与技术标准必须填写'
                    }
                }
            },
            package_method: {
                validators: {
                    notEmpty: {
                        message: '包装方式必须填写'
                    }
                }
            }
        }
    });

    $('input[name=spec]').on('change', function (e) {
        displayJSXGG();
    });

    function displayJSXGG() {
        var $jsx = $('#jsx_spec');
        var matchResult = $('input[name=spec]').val().match(specRegex);
        if(matchResult){
            /*
                此处为原来的判断代码，这里存在问题，钢丝绳规格也可能是
                1开头，这里判断存在一个小问题
            */
            // var sub = matchResult;
            // sub = sub.toString();
            // sub = sub.substr(0,1);
            // if(Number(sub)==1){
            //     return;
            // }
            var sub = matchResult;
            sub = sub.toString();
            sub = sub.split("*")[0];
            if(Number(sub)==1){
                return;
            }
        }
        if (matchResult && !/[1-9]?FC/.test(matchResult[2])) {
            $jsx.removeClass('hidden');
        } else {
            $jsx.addClass('hidden');
            $('input', $jsx).val('');
        }
    }

    $('#submit2').on("click", function (e) {
        $("#form2").data('formValidation').validate();
        var valid = $("#form2").data('formValidation').isValid();
        if (valid) {
            var $form = $("#form2");
            if (handle2 == "create") {
                $.ajax({
                    url: "../user/createPrdOrdDetail?id=" + $('#cancel2').attr("name"),
                    type: 'POST',
                    data: $form.serialize() + "&ddh" + "=" + $("#detailDdh").val()
                }).success(function (data, status, jqXHR) {
                    $(".modal.new2").modal("hide");
                    alertResult("添加成功", "success");
                    dt2.ajax.reload();
                }).fail(mesUtil.error);
            }
            else if (handle2 == "update") {
                $.ajax({
                    url: "../user/updatePrdOrdDetail?id=" + $('#cancel2').attr("name"),
                    type: 'POST',
                    data: $form.serialize() + "&index" + "=" + $("#delete2").attr("name") + "&ddh" + "=" + $("#detailDdh").val()
                }).success(function (data, status, jqXHR) {
                    $(".modal.new2").modal("hide");
                    alertResult("修改成功", "success");
                    dt2.ajax.reload();
                }).fail(mesUtil.error);
            }
        }
    });    //modal 新建
    $(".addDetail").on("click", function (e) {
        handle2 = "create";
        $('#update2,#delete2').hide();
        $('#submit2').show();
        $('.modal.new2 .modal-title').text("新建订单明细");
        $(".modal.new2 input[class!='select2-input'],.modal.new2 select,.modal.new2 textarea").removeAttr("disabled");
        $(".modal.new2 input[name=est_weight]").prop('disabled', true);
        $(".modal.new2 input[type!=radio],.modal.new2 textarea").val('').trigger("change");
        $('.modal.new2 input,.modal.new2,select').removeAttr('checked').removeAttr('selected');
        $(".modal.new2").modal({backdrop: "static", keyborad: false});
        displayJSXGG();
        $("#form2").data('formValidation').validate();
        $("#form2").data('formValidation').resetForm(true);
    });

    function initDetailDataTable() {
        $("#detailTab").on("click", "a.green-meadow", function (e) {
            var index = $(this).attr("id");
            $.post("../user/getPrdOrdDetail", {index: index, id: $('#cancel2').attr("name")}, function (data) {
                $(".modal.new2").modal({backdrop: "static", keyborad: false});
                $("#form2 input").removeAttr('disabled');
                $('#form2').data('formValidation').resetForm();
                $('.modal.new2 input,.modal.new2,select').removeAttr('checked').removeAttr('selected');
                $('#submit2').hide();
                $('#update2,#delete2').show();
                $('.modal.new2 .modal-title').text("查看订单明细");
                $("#form2 input,#form2 select,#form2 textarea").attr("disabled", "disabled");
                $("#delete2").attr("name", index);
                if (data.status === mesUtil.formStatus.PROCESSED) {
                    $("#delete2,#update2").addClass("hidden");
                } else {
                    $("#delete2,#update2").removeClass("hidden");
                }
                loadData(data.detail);
                displayJSXGG();
            });
        });
        $("#detailTab").on("click", "a.default", function (e) {
            bootbox.dialog({
                message: "确认撤销订单明细吗?",
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
                                url: "../user/revokePrdOrdDetail",
                                type: 'POST',
                                data: "cpbh=" + $(".default").attr("cpbh")
                            }).success(function (data, status, jqXHR) {
                                if (data.result == "success") {
                                    if (data.type == "order") {
                                        $(".addDetail").attr("disabled","disabled");
                                        $("#detailSpan").text("生产订单 - 明细");
                                        $("#detail").html("<span>选择订单，查看明细。</span>")
                                        alertResult(data.message, "success");
                                        dt.ajax.reload();
                                    } else {
                                        alertResult(data.message, "success");
                                        dt2.ajax.reload();
                                    }
                                }
                                else {
                                    alertResult(data.message, "fail");
                                }
                            }).fail(mesUtil.error);
                        }
                    }
                ]
            });
        });
        return $('#detailTab').DataTable({
            ajax: {
                url: "../user/listPrdOrdDetail?id=" + $('#cancel2').attr("name"),
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
                {
                    "data": null, createdCell: function (nTd, sData, oData, iRow, iCol) {
                    var startnum = this.api().page() * (this.api().page.info().length);
                    var html = "<a id='" + (iRow + startnum) + "'class='btn green-meadow'><span>查看</span></a>";
                    if ($('#cancel2').attr("status") == "已处理") {
                        html += "<a cpbh='" + oData.cpbh + "'class='btn default'><span>撤销</span></a>";
                    }
                    $(nTd).html(html)
                }
                },
                {"data": "cpbh"},
                {"data": "product_category"},
                {"data": "purpose"},
                {"data": "spec"},
                {"data": "jsx_spec"},
                {"data": "diameter"},
                {"data": "length"},
                {"data": "count"},
                {"data": "est_weight"},
                {"data": "strength"},
                {"data": "direction"},
                {"data": "oil_method"},
                {"data": "urgency"},
                {"data": "is_customized"},
                {"data": "ship_date"},
                {"data": "quality_spec"},
                {"data": "package_method"},
                {"data": "special_need"}
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
            },
        });
    }

    $(".confirmBtn").on("click", function () {
        bootbox.dialog({
            message: "确认提交该订单明细吗?",
            title: "提交确认",
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
                            url: "../user/submitPrdOrd",
                            type: 'POST'
                        }).success(function (data, status, jqXHR) {
                            if(data.code=="80001"){
                                alertResult("暂无未处理订单","success");
                            }else if(data.code=="80002"){
                                alertResult(data.message,"fail");
                            }else{
                                
                                alertResult("提交成功", "success");
                                dt.ajax.reload();
                                dt2.ajax.reload();
                            }
                        }).fail(mesUtil.error);
                    }
                }
            ]
        });
    });
});
