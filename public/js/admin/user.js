$(function () {
    var handle="";
    var companyCode = ""; //公司前四位代码

    var dt = $("#tab").DataTable({
        ajax:{
            url:"../admin/listUsers",
            type:"GET"
        },
        serverSide:'true',
        paging:true,
        "columns": [
            { "data": null,createdCell: function (nTd, sData, oData, iRow, iCol) {
                var startnum=this.api().page()*(this.api().page.info().length);
                $(nTd).html(iRow+1+startnum);//分页行号累加：$(nTd).html(iRow+1);
            }},
            { "data": "last_name" },
            { "data": "first_name" },
            { "data": "username" },
            { "data": "roles" },
            { "data": "org1" },
            { "data": "org2" },
            { "data": "org3" },
            { "data": "email" },
            { "data": "sex","render": function ( data, type, full, meta ) {
                if(data == "F"){
                    return "女";
                }else if(data == "M"){
                    return "男";
                }else{
                    return "—"
                }
            }},
            { "data": "telephone" },
            { "data": "oper",render: function ( data, type, full, meta ) {
                return "<a id='" + full._id + "'class='btn green-meadow'><span>查看</span></a>"
            }}
            ],
            columnDefs:[ {
                "targets": "_all",
                "data": null, // Use the full data source object for the renderer's source
                "render": function ( data, type, full, meta ) {
                    return data||"—";
                }},
                { "targets":[4,5,6,7,11],
                    orderable:false
                }
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
            }
    });

    // pre-load parameters
    function enumInit(){
        mesUtil.loadEnums(function () {
            var html = "";
            //获取公司代码
            companyCode = mesUtil.params.company_code;
            $("input[name=roles]").select2({
                placeholder: "选择一个角色",
                allowClear: true,
                tags:mesUtil.params.roles
            });
            $("input[name='org1']").select2({
                placeholder: "选择一个车间",
                allowClear: true,
                tags:mesUtil.params.orgs.org1
            });
            $("input[name='org2']").select2({
                placeholder: "选择一个班组",
                allowClear: true,
                tags:mesUtil.params.orgs.org2
            });
            $("input[name='org3']").select2({
                placeholder: "选择一个工段",
                allowClear: true,
                tags:mesUtil.params.orgs.org3
            });
        });
    };

    enumInit();

    $(".btn-new").on("click", function (e) {
        handle="create";
        $('#update,#delete').hide();
        $('#submit').show();
        $('.modal-title').text("新建人员");
        $("input[class!='select2-input'],select,textarea").removeAttr("disabled");
        $("input[type!=checkbox],textarea").val('').trigger("change");
        $('input,select').removeAttr('checked').removeAttr('selected');
        $(".modal.new").modal({backdrop: "static", keyborad: false});
        $("form").data('formValidation').validate();
        $("form").data('formValidation').resetForm(true);
        $('input[name="username"]').val(companyCode);
    });

    $("#tab").on("click", "a", function (e) {
        var userId = $(this).attr("id");
        $.post("../admin/getUser", {id: userId}, function (data) {
            $('#submit').hide();
            $('#update,#delete').show();
            $('.modal-title').text("查看人员");
            $("form input,form select,form textarea").attr("disabled", "disabled");
            $("#delete").attr("name", userId);
            loadData(data);
            $(".modal.new").modal({backdrop: "static", keyborad: false});
        });
    });

    function loadData(obj) {
        var key, value, tagName, type, arr;
        $('input[name=org1],input[name=org2],input[name=org3]').val(null).trigger("change")
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
        $('.modal-title').text("修改人员");
        $("input[name!=username],select,textarea,#submit").removeAttr("disabled").removeClass("disabled");
        $("#update").hide();
        $("#submit,#delete").show();

    });

    $("#delete").on('click', function () {
        var handleOld=handle;
        handle="delete";
        bootbox.dialog({
            message: "确认删除该用户吗?",
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
                        var userId = $("#delete").attr("name");
                        $.ajax(
                            {
                                url: "../admin/deleteUser",
                                type: "DELETE",
                                data: {id: userId}
                            }).success(function () {
                                $(".modal.new").modal("hide");
                                enumInit();
                                dt.ajax.reload();
                                alertResult("删除成功");
                            }).fail(mesUtil.error);
                    }
                }
            ]
        });
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

    //用户表单验证规则
    $('form').formValidation({
        framework: 'bootstrap',
        fields: {
            last_name:{
                validators: {
                    notEmpty: {
                        message: '姓氏必须填写'
                    }
                }
            },
            first_name:{
                validators: {
                    notEmpty: {
                        message: '名字必须填写'
                    }
                }
            },
            username: {
                validators: {
                    callback:{
                        callback: function(value, validator, $field) {
                            var err = "";
                            if (!value){
                                err = '用户名必须填写';
                            }else if (value.indexOf(companyCode)!=0){
                                err = '必须以'+companyCode+"开头";
                            }else if (value.length!=8) {
                                err = "长度必须为8位"
                            }else if (!/^[0-9]{4}$/.test(value.substr(4,8))) {
                                err = "后四位必须为数字"
                            }
                            if(err)
                                return {valid:false,message:err}
                            else
                                return true;
                        }
                    }
                }
            },
            email: {
                validators: {
                    emailAddress: {
                        message: '邮箱必须符合格式'
                    }
                }
            },
            telephone:{
                validators: {
                    callback:{
                        callback: function(value, validator, $field) {
                            if (!/(^[0-9]{3,4}\-[0-9]{3,8}$)|(^[0-9]{3,8}$)|(^\([0-9]{3,4}\)[0-9]{3,8}$)|(^0{0,1}1[0-9]{10}$)/.test(value) && value) {
                                return {valid:false,message:"电话号码必须符合格式"}
                            }else{
                                return true;
                            }
                        }
                    }
                }
            }
        }
    });
    $('#submit').on("click",function (e) {
        $("form").data('formValidation').validate();
        var valid = $("form").data('formValidation').isValid();
        if(valid) {
            var $form = $("form");
            if(handle=="create"){
                $.ajax({
                    url: "../admin/user",
                    type: 'POST',
                    data: $form.serialize()
                }).success(function (data, status, jqXHR) {
                    $(".modal.new").modal("hide");
                    alertResult("添加成功");
                    enumInit();
                    dt.ajax.reload();
                }).fail(mesUtil.error);
            }
            else if(handle=="update"){
                $.ajax({
                    url: "../admin/updateUser",
                    type: 'POST',
                    data:  $form.serialize()+"&id"+"="+$("#delete").attr("name")
                }).success(function (data, status, jqXHR) {
                    $(".modal.new").modal("hide");
                    alertResult("修改成功");
                    enumInit();
                    dt.ajax.reload();
                }).fail(mesUtil.error);
            }
        }
    });


    //日期控件
    $("input[name='birthday']").datetimepicker({
        format: "yyyy-mm-dd",
        language:"zh-CN",
        maxView:'4',
        minView:'2',
        autoclose:true,
        todayBtn:true,
        startDate:new Date("1900"),
        endDate:new Date()
    });
});