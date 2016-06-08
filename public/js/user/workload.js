$(function () {

    var select2Option = {
        language: "zn-CN",
        placeholder: "请选择",
        allowClear: false,
        minimumResultsForSearch: -1
    }

    initSel();
    initDtp();
    initEvent();


    var chart;
    var dt;

    function initSel() {
        mesUtil.loadEnums(function () {
            var cj = mesUtil.params.orgs.org1;
            var cjHtml = "<option disabled selected></option>";
            for (var i = 0; i < cj.length; i++) {
                cjHtml += "<option value='" + cj[i] + "'>" + cj[i] + "</option>";
            }
            $("#sel-cj").html(cjHtml);
            var bz = mesUtil.params.orgs.org2;
            var bzHtml = "<option disabled selected></option>";
            for (var i = 0; i < bz.length; i++) {
                bzHtml += "<option value='" + bz[i] + "'>" + bz[i] + "</option>";
            }
            $("#sel-bz").html(bzHtml);

            $.ajax({
                url: "../admin/findUsers",
                type: "POST"
            }).success(function (data) {
                var czgHtml = "<option disabled selected></option>";
                czgHtml += "<optgroup label='&nbsp;用户名&nbsp;&nbsp;姓名'>";
                data.forEach(function (u) {
                    czgHtml += "<option value='" + u._id + "' name=" + u.last_name + u.first_name + ">" +
                        u.username + "&nbsp;" + u.last_name + u.first_name + "</option>";
                });
                czgHtml += "</optgroup>";
                $("#sel-czg").html(czgHtml).select2(select2Option);
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
                $("#sel-jth").html(jthHtml).select2(select2Option);
            }).fail(function () {
            });

            $("#sel-cj,#sel-bz,#sel-gdcp,#sel-type,#sel-month,#sel-week,#sel-item").select2(select2Option);
        });
    }

    function initDtp() {
        $("#ipt-year-begin,#ipt-year-end,#ipt-year").datetimepicker(
            {
                format: "yyyy",
                language: "zh-CN",
                startView: "decade",
                minView: 'decade',
                autoclose: true
            }
        );
        $("#ipt-day").datetimepicker({
            format: "yyyy-mm-dd",
            language: "zh-CN",
            startView: "decade",
            minView: "month",
            autoclose: true
        });
    }

    function initEvent() {
        $("#sel-item").on("change", function () {
            $(".item").hide();
            switch ($(this).val()) {
                case "jth":
                    $("#sel-jth").val("").trigger("change");
                    $(".jth").show();
                    break;
                case "czg":
                    $("#sel-czg").val("").trigger("change");
                    $(".czg").show();
                    break;
                case "jg":
                    $("#sel-jg").val("").trigger("change");
                    $(".jg").show();
                    break;
            }
        });
        $("#sel-type").on("change", function () {
            $(".type").hide();
            switch ($(this).val()) {
                case "years":
                    $(".sel-item,.item").hide();
                    $(".dataTables_wrapper").hide();
                    $("#ipt-year-begin,#ipt-year-end").val("");
                    $(".year-begin,.year-end").show();
                    $("#chart").show();
                    break;
                case "year":
                    $(".sel-item,.item").hide();
                    $(".dataTables_wrapper").hide();
                    $("#ipt-year").val("");
                    $(".year").show();
                    $("#chart").show();
                    break;
                case "month":
                    $(".sel-item,.item").hide();
                    $(".dataTables_wrapper").hide();
                    $("#ipt-year").val("");
                    $("#sel-month").val("").trigger("change");
                    $(".year,.month").show();
                    $("#chart").show();
                    break;
                case "week":
                    $(".sel-item,.item").hide();
                    $(".dataTables_wrapper").hide();
                    $("#ipt-year").val("");
                    $("#sel-week").val("").trigger("change");
                    $(".year,.week").show();
                    $("#chart").show();
                    break;
                case "day":
                    $("#ipt-day").val("");
                    $(".day,.sel-item").show();

            }
        });

        $("#search").on("click", function () {
            $("#chart").hide();
            $(".dataTables_wrapper").hide();
            var labels = [];
            var data = {};
            var title = "";
            var cj = $("#sel-cj").find("option:selected").val();
            if (cj == "") {
                alertResult("车间不能为空", "error");
                return;
            }
            data.cj = cj;
            var bz = $("#sel-bz").find("option:selected").val();
            if (bz == "") {
                alertResult("班组不能为空", "error");
                return;
            }
            data.bz = bz;
            var gdcp = $("#sel-gdcp").find("option:selected").val();
            if (gdcp == "") {
                alertResult("工段产品不能为空", "error");
                return;
            }
            data.alias = gdcp;
            var type = $("#sel-type").find("option:selected").val();
            if (type == "") {
                alertResult("报表类型不能为空", "error");
                return;
            }
            data.type = type;
            title += cj + bz + $("#sel-gdcp").find("option:selected").text() + "工段";
            switch (type) {
                case "years":
                    var begin = $("#ipt-year-begin").val();
                    if (begin == "") {
                        alertResult("开始年份不能为空", "error");
                        return;
                    }
                    var end = $("#ipt-year-end").val();
                    if (end == "") {
                        alertResult("结束年份不能为空", "error");
                        return;
                    }
                    var sub = parseInt(acc.sub(end, begin));
                    if (sub <= 0) {
                        alertResult("开始年份必须小于结束年份", "error");
                        return;
                    }
                    var duration = [];
                    for (var i = 0; i <= sub; i++) {
                        duration.push(acc.add(begin, i));
                    }
                    data.duration = JSON.stringify(duration);
                    labels = duration;
                    title += begin + "年-" + end + "年生产量年报表";
                    break;
                case "year":
                    var year = $("#ipt-year").val();
                    if (year == "") {
                        alertResult("年不能为空", "error");
                        return;
                    }
                    data.year = year;
                    labels = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
                    title += year + "年生产量月报表";
                    break;
                case "month":
                    var year = $("#ipt-year").val();
                    if (year == "") {
                        alertResult("年不能为空", "error");
                        return;
                    }
                    var month = $("#sel-month").find("option:selected").val()
                    if (month == "") {
                        alertResult("月不能为空", "error");
                        return;
                    }
                    data.year = year;
                    data.month = month;
                    title += year + "年" + month + "月生产量日报表";
                    break;
                case "week":
                    var year = $("#ipt-year").val();
                    if (year == "") {
                        alertResult("年不能为空", "error");
                        return;
                    }
                    var week = $("#sel-week").find("option:selected").val();
                    if (week == "") {
                        alertResult("周不能为空", "error");
                        return;
                    }
                    data.year = year;
                    data.duration = JSON.stringify(week.split(","));
                    labels = week.split(",");
                    title += year + "年" + $("#sel-week").find("option:selected").text() + "生产量周报表";
                    break;
                case "day":
                    var day = $("#ipt-day").val();
                    if (day == "") {
                        alertResult("日不能为空", "error");
                        return;
                    }
                    data.day = day;
                    switch ($("#sel-item").find("option:selected").val()) {
                        case "jth":
                            data.jth = $("#sel-jth").find("option:selected").val();
                            break;
                        case"czg":
                            data.czg = $("#sel-czg").find("option:selected").val();
                            break;
                        case "jg":
                            data.jg = $("#ipt-jg").val();
                            break;
                    }
            }
            console.log("data:" + data);
            if (type == "day") {

                $(".dataTables_wrapper").remove();
                var dtHtml = "<div class='dataTables_wrapper no-footer' style='display:none'>" +
                    "<table id='tab' class='table table-striped table-hover table-bordered dataTable no-footer' role='row'>" +
                        "<thead>" +
                            "<tr role='role'>" +
                                "<th>#</th>" +
                                "<th>机台号</th>" +
                                "<th>操作工</th>" +
                                "<th>结构</th>" +
                                "<th>直径</th>" +
                                "<th>捻向</th>" +
                                "<th>类别</th>" +
                                "<th>米数</th>" +
                                "<th>备注</th>" +
                            "</tr>" +
                        "</thead>" +
                    "</table>" +
                  "</div>"
                $(".datatb").append(dtHtml);
                dt = $('#tab').DataTable({
                    ajax: {
                        url: "../user/getWorkLoad",
                        type: "post",
                        data: data
                    },
                    serverSide: 'true',
                    paging: true,
                    "searching": true,
                    "columns": [
                        {
                            "data": null, createdCell: function (nTd, sData, oData, iRow, iCol) {
                            var startnum = this.api().page() * (this.api().page.info().length);
                            $(nTd).html(iRow + 1 + startnum);//分页行号累加：$(nTd).html(iRow+1);
                        }
                        },
                        {"data": "jth.name"},
                        {"data": "czg.name"},
                        {"data": "jg"},
                        {"data": "zj"},
                        {"data": "nx"},
                        {"data": "lb"},
                        {"data": "djmc"},
                        {"data": "comment"}
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

                $(".dataTables_wrapper").show();
            }else {
                $.ajax({
                    type: "post",
                    url: "../user/getWorkLoad",
                    data: data
                }).success(function (res) {
                    if (type == "month") {
                        for (var i = 1; i < res.length + 1; i++) {
                            labels.push(i);
                        }
                    }
                    chart = new iChart.Area2D({
                        render: "#chart",
                        data: [
                            {
                                "name": "",
                                value: res,
                                color: '#1f7e92',
                                line_width: 2
                            }
                        ],
                        title: title,
                        subtitle: {
                            text: "单位：Kg",
                            fontsize: 12,
                            color: "black",
                            textAlign: "left",
                            padding: "0 40",
                            height: 20
                        },
                        width: 950,
                        height: 300,
                        coordinate: {height: '90%', background_color: '#edf8fa'},
                        sub_option: {
                            hollow_inside: false,
                            point_size: 10
                        },
                        labels: labels
                    });
                    chart.draw();
                    $("#chart").show();
                }).fail(function () {
                    alertResult("请稍后再试", "error");
                });
            }
        });
    }

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

    var acc = {
        add: function (arg1, arg2) {
            var r1, r2, m;
            try {
                r1 = arg1.toString().split(".")[1].length;
            }
            catch (e) {
                r1 = 0;
            }
            try {
                r2 = arg2.toString().split(".")[1].length;
            }
            catch (e) {
                r2 = 0;
            }
            m = Math.pow(10, Math.max(r1, r2));
            return (arg1 * m + arg2 * m) / m;
        },
        sub: function (arg1, arg2) {
            var r1, r2, m, n;
            try {
                r1 = arg1.toString().split(".")[1].length;
            }
            catch (e) {
                r1 = 0;
            }
            try {
                r2 = arg2.toString().split(".")[1].length;
            }
            catch (e) {
                r2 = 0;
            }
            m = Math.pow(10, Math.max(r1, r2));
            n = (r1 >= r2) ? r1 : r2;
            return ((arg1 * m - arg2 * m) / m).toFixed(n);
        }
    }

});
