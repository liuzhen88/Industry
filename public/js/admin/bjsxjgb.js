$(function () {
    var handle="";

    var dt = $('#tab').DataTable({
        ajax:{
            url:"../admin/internalForm/list?subForm=bjsxjgb",
            type:"GET"
        },
        serverSide:'true',
        paging:true,
        "columns": [
            { "data": null,createdCell: function (nTd, sData, oData, iRow, iCol) {
                var startnum=this.api().page()*(this.api().page.info().length);
                $(nTd).html(iRow+1+startnum);//分页行号累加：$(nTd).html(iRow+1);
            }},
            { "data": "bjssxjg" },
            { "data": "zxxwx" },
            { "data": "wcgsgs" },
            { "data": "wcgsggs" },
            { "data": "explain" },
            { "data": "oper",render: function ( data, type, full, meta ) {
                return "<a id='" + full._id + "'class='btn green-meadow'><span>查看</span></a>"
            }}
        ],
        columnDefs:[ {
            "targets": "_all",
            "data": null, // Use the full data source object for the renderer's source
            "render": function ( data, type, full, meta ) {
                return data||"—";
            }}
        ],
        "language": {
            "lengthMenu": "_MENU_ 条记录每页",
            "search":"查询",
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


    $("#tab").on("click", "a", function (e) {
        var id = $(this).attr("id");
        $.post("../admin/internalForm/get?subForm=bjsxjgb", {id: id}, function (data) {
            $('#submit').hide();
            $('#update,#delete').show();
            $('.modal-title').text("查看半金属芯结构表");
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
                    $(this).val(value);
                }
            });
        }
    };

    $("#update").on("click", function () {
        handle="update";
        $('.modal-title').text("修改半金属芯结构表");
        $("input[name!=username],select,textarea,#submit").removeAttr("disabled").removeClass("disabled");
        $("#update").hide();
        $("#submit,#delete").show();

    });

    $("#delete").on('click', function () {
        var handleOld=handle;
        handle="delete";
        bootbox.dialog({
            message: "确认删除该半金属芯结构表吗?",
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
                        handle=handleOld;
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
                                url: "../admin/internalForm/del?subForm=bjsxjgb",
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
        fields: {
        }
    }).on('success.form.fv', function (e) {
        e.preventDefault();
        var $form = $(e.target);
        if(handle=="create"){
            $.ajax({
                url: "../admin/internalForm/create?subForm=bjsxjgb",
                type: 'POST',
                data: $form.serialize()
            }).success(function (data, status, jqXHR) {
                $(".modal.new").modal("hide");
                alertResult("添加成功");
                dt.ajax.reload();
            }).fail(mesUtil.error);
        }
        else if(handle=="update"){
            $.ajax({
                url: "../admin/internalForm/update?subForm=bjsxjgb",
                type: 'POST',
                data:  $form.serialize()+"&id"+"="+$("#delete").attr("name")
            }).success(function (data, status, jqXHR) {
                $(".modal.new").modal("hide");
                alertResult("修改成功");
                dt.ajax.reload();
            }).fail(mesUtil.error);
        }
    });    //modal 新建
    $(".btn-new").on("click", function (e) {
        handle="create";
        $('#update,#delete').hide();
        $('#submit').show();
        $('.modal-title').text("新建半金属芯结构表");
        $("input[class!='select2-input'],select,textarea").removeAttr("disabled");
        $("input[type!=radio],textarea").val('').trigger("change");
        $('input,select').removeAttr('checked').removeAttr('selected');
        $(".modal.new").modal({backdrop: "static", keyborad: false});
    });
    $("input[date='true']").datetimepicker({
        format: "yyyy-mm-dd",
        language:"zh-CN",
        maxView:'4',
        minView:'2',
        autoclose:true,
        todayBtn:true,
        startDate:new Date("1900"),
        endDate:new Date()
    });

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
});
