$(function () {
    var handle="";

    $.ajax({
        url:"../admin/internalForm/findMaxPlies?subForm=gssjgb",
        type:"GET",
            success:function(data){

            //可变栏目
            var columns = [
                { "data": null,createdCell: function (nTd, sData, oData, iRow, iCol) {
                    var startnum=this.api().page()*(this.api().page.info().length);
                    $(nTd).html(iRow+1+startnum);//分页行号累加：$(nTd).html(iRow+1);
                }},
                { "data": "wire_rope_structure" },
                { "data": "gc_plies" }];

            data.max_gc_plies = data.max_gc_plies || 3;
            data.max_gs_plies = data.max_gs_plies || 3;

            console.log(data)
            var $cusTr = $("#cusTr");
            $cusTr.append("<th>层数</th>");
            for(var i=1;i<=data.max_gc_plies;i++){
                columns.push({ "data": "gc_plies_"+i });
                $cusTr.append("<th>第"+i+"层</th>");
            }
            for(var i=1;i<=data.max_gc_plies;i++){
                columns.push({ "data": "ggg_plies_"+i });
                $cusTr.append("<th>第"+i+"层</th>");
            }
            columns.push({ "data": "gc_explain" });
            columns.push({ "data": "hscs" });

            $cusTr.append("<th>纤维芯</th>");
            $cusTr.append("<th>中心丝</th>");
            $cusTr.append("<th>层数</th>");


            $("#custTh1").prop("colspan",Number(data.max_gc_plies)+1);
            $("#custTh2").prop("colspan",data.max_gc_plies);
            $("#custTh3").prop("colspan",Number(data.max_gs_plies)+4);
            $("#custTh4").prop("colspan",data.max_gs_plies);

            columns = columns.concat([
                { "data": "gs_fiber_core" },
                { "data": "gs_center_wire" },
                { "data": "gs_plies" },
                ]);
            for(var i=1;i<=data.max_gs_plies;i++){
                columns.push({ "data": "gs_plies_"+i });
                $cusTr.append("<th>第"+i+"层</th>");
            }
            $cusTr.append("<th>股结构</th>");
            columns.push({ "data": "gs_structure" });
            for(var i=1;i<=data.max_gs_plies;i++){
                columns.push({ "data": "gsi_plies_"+i });
                $cusTr.append("<th>第"+i+"层</th>");
            }
            columns = columns.concat([
                { "data": "gs_explain" },
                { "data": "nzcs" },
                { "data": "oper",render: function ( data, type, full, meta ) {
                    return "<a id='" + full._id + "'class='btn green-meadow'><span>查看</span></a>"
                }}
            ]);
            $("input[name='gc_plies'],input[name='gs_plies']").on("keyup", function () {
                initCeng(this);
            });

            initDataTable(columns);
        }
    });
    function initCeng(dom){
        if(/[1-9]/.test($(dom).val())&& $(dom).val()<20){
            var $group = $(dom).parents("div.form-group").next("div.form-group");
            var $group2 = null;
            var ns = "";
            if($(dom).prop("name") == "gc_plies"){
                ns = "ggg_plies";
                $group2 = $(dom).parents("div.form-group").next("div.form-group").next("div.form-group").next("div.form-group");
            }else if($(dom).prop("name") == "gs_plies"){
                ns = "gsi_plies";
                $group2 = $(dom).parents("div.form-group").next("div.form-group").next("div.form-group").next("div.form-group").next("div.form-group");
            }
            $group.html("");
            $group2.html("");
            for(var i=1;i<=Number($(dom).val());i++){
                $group.append("<div class='col-md-"+Math.round(12/$(dom).val())+"'><label class='control-label'>第"+i+"层</label><input class='form-control' type='text' name='"+$(dom).prop("name")+"_"+i+"' ></div>");
                $group2.append("<div class='col-md-"+Math.round(12/$(dom).val())+"'><label class='control-label'>第"+i+"层</label><input class='form-control' type='text' name='"+ns+"_"+i+"' ></div>");
            }
        }else{
            mesUtil.error({responseJSON:{message:"输入层数必须为小于20层的正整数."}});
        }
    }
    function initDataTable(columns){

        var dt = $('#tab').DataTable({
            ajax:{
                url:"../admin/internalForm/list?subForm=gssjgb",
                type:"GET"
            },
            serverSide:'true',
            paging:true,
            columns: columns,
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
            $.post("../admin/internalForm/get?subForm=gssjgb", {id: id}, function (data) {
                $("input[name='gc_plies'],input[name='gs_plies']").each(function () {
                    if (this.name == "gc_plies") this.value = data.gc_plies;
                    if (this.name == "gs_plies") this.value = data.gs_plies;
                    initCeng(this);
                })
                $('#submit').hide();
                $('#update,#delete').show();
                $('.modal-title').text("查看钢丝绳结构表");
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
            };
        };

        $("#update").on("click", function () {
            handle="update";
            $('.modal-title').text("修改钢丝绳结构表");
            $("input[name!=username],select,textarea,#submit").removeAttr("disabled").removeClass("disabled");
            $("#update").hide();
            $("#submit,#delete").show();

        });

        $("#delete").on('click', function () {
            var handleOld=handle;
            handle="delete";
            bootbox.dialog({
                message: "确认删除该钢丝绳结构表吗?",
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
                                    url: "../admin/internalForm/del?subForm=gssjgb",
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
                    url: "../admin/internalForm/create?subForm=gssjgb",
                    type: 'POST',
                    data: $form.serialize()
                }).success(function (data, status, jqXHR) {
                    $(".modal.new").modal("hide");
                    alertResult("添加成功");
                    window.location = "";
                }).fail(mesUtil.error);
            }
            else if(handle=="update"){
                $.ajax({
                    url: "../admin/internalForm/update?subForm=gssjgb",
                    type: 'POST',
                    data:  $form.serialize()+"&id"+"="+$("#delete").attr("name")
                }).success(function (data, status, jqXHR) {
                    $(".modal.new").modal("hide");
                    alertResult("修改成功");
                    window.location = "";
                }).fail(mesUtil.error);
            }
        });    //modal 新建
        $(".btn-new").on("click", function (e) {
            handle="create";
            $('#update,#delete').hide();
            $('#submit').show();
            $('.modal-title').text("新建钢丝绳结构表");
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

    }
});
