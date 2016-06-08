/**
 * Created by 天宇 on 2015/10/28.
 */
$(function () {


    /**
     * 1. ajax获取当前选择的自定义表单的结构数据
     */

    $.post(
        "../user/getBomStructure",{id:$("#formId").val()},
        function (data) {
            initDataTable(data);
        },
        "JSON"
    );

    /**
     * 2.datatable和页面结构的初始化
     * @param data
     */
    function initDataTable(data) {
        /**
         * 2.1 主料结构的构建
         */
        var zls = getObject(data.body[0].body,"主料");

        $("#zl").html("<div class=\" sortable_portlets row ui-sortable\">\n");

        for(var i in zls.children){
            var zl = zls.children[i];

            //dataTables 的栏目数据
            var columns = [
                { "data": null,createdCell: function (nTd, sData, oData, iRow, iCol) {
                    var startnum=this.api().page()*(this.api().page.info().length);
                    $(nTd).html(iRow+1+startnum);//分页行号累加：$(nTd).html(iRow+1);
                }},
                { "data": "bgrq" },
                { "data": "sfdz" },
                { "data": "dzcpbh" }
            ];
            //html的表格数据
            var htmlTab =
                    "<th cname='bgrq'>变更日期</th>"+
                    "<th cname='sfdz'>是否定制</th>"+
                    "<th cname='dzcpbh'>定制产品编号</th>";

            for(var j in zl.children){
                var col = zl.children[j];
                columns.push({"data":col.name});
                htmlTab+="<th cname='"+col.name+"'>"+col.text+"</th>";
            }

            $("#zl .sortable_portlets").append(
                "    <div class=\" col-md-6 column sortable\">\n"+
                "        <div class=\" portlet portlet-sortable light bordered\">\n"+
                "            <div class=\" portlet-title\">\n"+
                "                <div class=\" caption font-green-sharp\">\n"+
                "                    <i class=\" icon-speech font-green-sharp\"></i>\n"+
                "                    <span class=\" caption-subject hold uppercase\">"+zl.text+"</span>\n"+
                "                </div>\n"+
                "                <div class=\"tools\">\n"+
                "                    <a href=\"#\" class=\"collapse\"></a>\n"+
                "                </div>\n"+
                "            </div>\n"+
                "            <div class=\" portlet-body\">\n"+
                "                \n"+
                "<table id='zlTab"+i+"' class='table table-striped table-hover table-bordered dataTable no-footer' role='grid'>" +
                "<thead>" +
                "<tr>" +
                "<th>#</th>"+

                    htmlTab+

                "<th>操作</th>"+
                "</tr>"+
                "</thead>"+
                "</table>"+
                "            </div>\n"+
                "        </div>\n"+
                "    </div>\n"
            )
            columns.push({ "data": null,createdCell: function (nTd, sData, oData, iRow, iCol) {
                var startnum=this.api().page()*(this.api().page.info().length);
                var $a = $("<a id='" + oData.id + "'class='btn green-meadow'><span>查看</span></a>");
                $a.on("click", function () {
                    setData(nTd,iRow);
                })
                $(nTd).html($a);
            }});

            //生成dataTable
            $("#zlTab"+i).DataTable({
                ajax:{
                    url:"../user/listZlBoms",
                    type:"POST",
                    data:{id:$("#formId").val(),zlName:zl.name}
                },
                serverSide:'true',
                paging:true,
                "columns": columns,
                columnDefs:[ {
                    "targets": "_all",
                    "data": null, // Use the full data source object for the renderer's source
                    "render": function ( data, type, full, meta ) {
                        if(data=="undefined")
                            return "—";
                        else{
                            return data||"—";
                        }
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
                }
            })
        }
        $("#zl").append("</div>\n");






        /**
         * 2.2 辅料结构的构建
         */
        var fls = getObject(data.body[0].body,"辅料");

        $("#fl").html("<div class=\" sortable_portlets row ui-sortable\">\n");

        for(var i in fls.children){
            var fl1 = fls.children[i];
            $("#fl .sortable_portlets").append("<div class=\" col-md-4 column sortable fl-col\">");

            for(var x in fl1.children){
                var fl = fl1.children[x];
                //dataTables 的栏目数据
                var columns = [
                    { "data": null,createdCell: function (nTd, sData, oData, iRow, iCol) {
                        var startnum=this.api().page()*(this.api().page.info().length);
                        $(nTd).html(iRow+1+startnum);//分页行号累加：$(nTd).html(iRow+1);
                    }},
                    { "data": "bgrq" }
                ];
                //html的表格数据
                var htmlTab =
                    "<th cname='bgrq'>变更日期</th>";

                for(var j in fl.children){
                    var col = fl.children[j];
                    columns.push({"data":col.name});
                    htmlTab+="<th cname="+col.name+">"+col.text+"</th>";
                }

                columns.push({ "data": null,createdCell: function (nTd, sData, oData, iRow, iCol) {
                    var startnum=this.api().page()*(this.api().page.info().length);
                    var $a = $("<a id='" + oData.id + "'class='btn green-meadow'><span>查看</span></a>");
                    $a.on("click", function () {
                        setData(nTd,iRow);
                    })
                    $(nTd).html($a);
                }});

                $("#fl .sortable_portlets .fl-col").eq(i).append(
                    "        <div class=\" portlet portlet-sortable light bordered\">\n"+
                    "            <div class=\" portlet-title\">\n"+
                    "                <div class=\" caption font-green-sharp\">\n"+
                    "                    <i class=\" icon-speech font-green-sharp\"></i>\n"+
                    "                    <span class=\" caption-subject hold uppercase\">"+fl1.text+"</span>\n"+
                    "                    <span class=\" caption-helper\">"+fl.text+"</span>\n"+
                    "                </div>\n"+
                    "                <div class=\"tools\">\n"+
                    "                    <a href=\"#\" class=\"collapse\"></a>\n"+
                    "                </div>\n"+
                    "            </div>\n"+
                    "            <div class=\" portlet-body\">\n"+
                    "                \n"+
                    "<table id='flTab"+i+x+"' class='table table-striped table-hover table-bordered dataTable no-footer' role='grid'>" +
                    "<thead>" +
                    "<tr>" +
                    "<th>#</th>"+

                    htmlTab+

                    "<th>操作</th>"+
                    "</tr>"+
                    "</thead>"+
                    "</table>"+
                        "            </div>\n"+
                    "        </div>\n"
                );

                //生成dataTable
                $("#flTab"+i+x).DataTable({
                    ajax:{
                        url:"../user/listFlBoms",
                        type:"POST",
                        data:{id:$("#formId").val(),flName:"fl."+fl1.name+"."+fl.name}
                    },
                    serverSide:'true',
                    paging:true,
                    "columns": columns,
                    columnDefs:[ {
                        "targets": "_all",
                        "data": null, // Use the full data source object for the renderer's source
                        "render": function ( data, type, full, meta ) {
                            if(data=="undefined")
                                return "—";
                            else{
                                return data||"—";
                            }
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
                    }
                });
            }
            $("#fl .sortable_portlets").append("</div>");
        }

        $("#fl").append("</div>\n");



        /**
         * porlet 初始化
         */
        PortletDraggable.init();

    }


    function setData(nTd,iRow){
        var selectorTab = $(nTd).parents("table").attr("id");
        var row = $("#"+selectorTab).DataTable().column(iRow).data()[0];
        var index = 0 ;
        var modalHtml = "<div class='modal'>" +
                            "<div class='modal-dialog'>" +
                                "<form class='form-horizontal' role='form'>" +
                                    "<div class='modal-content'>" +
                                        "<div class='modal-header'>" +
                                            "<button type='button' class='close' data-dismiss='modal' aria-hidden='true'>×</button>'"+
                                            "<h4 class='modal-title'>查看物料情况</h4></div>"+
                                        "<div class='modal-body'>";
        var formHtml = "";
        for(var obj in row){
            index++;
            var text = $(nTd).parents("table").children("thead").children("tr").children("th").eq(index).html();
            var name = $(nTd).parents("table").children("thead").children("tr").children("th").eq(index).attr("cname");
            var value = row[name];
            if(text!="操作"){
                formHtml += "<div class='form-group'>" +
                                "<div class='col-md-12'>" +
                                    "<label class='control-label'>"+text+"</label>" +
                                    "<input class='form-control' name='"+name+"' type='text' value='"+value+"'/>" +
                                "</div>"+
                            "</div>";
            }
        }
        modalHtml +=formHtml+
                                        "</div>"+
                                        "<div class='modal-footer'>" +
                                            "<button class='btn btn-default' type='button' data-dismiss='modal'>取消</button>"+
                                            "<button class='save btn yellow' type='button' data-dismiss='modal'>修改</button>"+
                                            "<button class='btn red' type='button' style='position:absolute;left:10px;bottom:15px;background-color:rgb(245,128,128);' data-dismiss='modal'>删除</button>"+
                                        "</div>"+
                                    "</div>" +
                                "</form>"+
                            "</div>"+
                        "</div>";
        $(modalHtml).modal({backdrop: true, keyboard: true});
    }


    /**
     * 按照对象的name获取整个对象
     * @param array
     * @param text
     * @returns {*}
     */
    function getObject(array, text) {
        for (var index in array) {
            if (array[index].text == text) {
                return array[index];
            }
        }
        return null;
    }
})