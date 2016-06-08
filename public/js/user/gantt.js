Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

var scale = "day";
var select2 = {
    language: "zn-CN",
    placeholder: "请选择",
    allowClear: false,
    minimumResultsForSearch: -1
}
var view = {
    "day": {
        "min": "",
        "max": ""
    },
    "week": {
        "min": "",
        "max": ""
    },
    "month": {
        "min": "",
        "max": ""
    },
    "year": {
        "min": "",
        "max": ""
    }
}

var before = new Date();
before.setDate(before.getDay + 6);
before = new Date(before);

function initSel() {
    $.ajax({
        url: "../user/getOrders",
        type: "get"
    }).success(function (data) {
        var html = "<option value='all' selected>全部</option>";
        data.forEach(function (u) {
            html += "<option value='" + u + "'>" + u + "</option>";
        });
        $("#sel-order").html(html).select2(select2);
    })
    $("#sel-view").select2(select2);
}

function setScaleConfig(value) {
    switch (value) {
        case "day":
            gantt.config.scale_unit = "day";
            gantt.config.step = 1;
            gantt.config.date_scale = "%Y-%m-%d";
            gantt.config.task_height = 28;
            gantt.config.row_height = 36;
            gantt.config.scale_height = 44;
            gantt.config.subscales = [];
            gantt.templates.date_scale = null;
            break;
        case "week":
            var weekScaleTemplate = function (date) {
                var dateToStr = gantt.date.date_to_str("%Y-%m-%d");
                var endDate = gantt.date.add(gantt.date.add(date, 1, "week"), -1, "day");
                return dateToStr(date) + " - " + dateToStr(endDate);
            };
            gantt.config.scale_unit = "week";
            gantt.config.step = 1;
            gantt.templates.date_scale = weekScaleTemplate;
            gantt.config.subscales = [
                {unit: "day", step: 1, date: "%D"}
            ];
            gantt.config.scale_height = 44;
            break;
        case "month":
            gantt.config.scale_unit = "year";
            gantt.config.date_scale = "%Y";
            gantt.config.subscales = [
                {unit: "month", step: 1, date: "%m"}
            ];
            gantt.config.scale_height = 44;
            gantt.templates.date_scale = null;
            break;
        case "year":
            gantt.config.scale_unit = "year";
            gantt.config.step = 1;
            gantt.config.date_scale = "%Y";
            gantt.config.scale_height = 44;
            gantt.templates.date_scale = null;
            gantt.config.subscales = [];
            break;
    }
}

function setView(data) {
    view.day.min = data.date.day.min;
    view.day.max = data.date.day.max;
    view.week.min = data.date.week.min;
    view.week.max = data.date.week.max;
    view.month.min = data.date.month.min;
    view.month.max = data.date.month.max;
    view.year.min = data.date.year.min;
    view.year.max = data.date.year.max;
}

function initGantt(data) {
    gantt.config.readonly = true;
    gantt.config.grid_width = 360;
    gantt.config.xml_date = "%Y-%m-%d";
    gantt.config.start_date = data.date.day.min;
    gantt.config.end_date = data.date.day.max;
    gantt.config.columns = [
        {
            name: "text",
            label: "订单",
            tree: true,
            width: "140px",
            resize: true,
            template: function (item) {
                if (item.text.length > 8)
                    return "<span class='gantt-font'>" + item.text.substring(0, 8) + "..." + "</span>";
                else return "<span>" + item.text + "</span>";
            }
        },
        {
            name: "start_date_planned",
            label: "计划开始",
            align: "center",
            width: "74px",
            template: function (item) {
                if (item.start_date_planned)
                    return "<span class='gantt-font'>" + item.start_date_planned + "</span>";
                else return "";
            }
        },
        {
            name: "end_date_planned",
            label: "计划结束",
            align: "center",
            width: "74px",
            template: function (item) {
                if (item.end_date_planned)
                    return "<span class='gantt-font'>" + item.end_date_planned + "</span>";
                else return ""
            }
        },
        {
            name: "progress_text",
            label: "当前进度",
            align: "center",
            width: "*",
            template: function (item) {
                return "<span class='gantt-font'>" + item.progress_text + "</span>";
            }
        }
    ];
    setScaleConfig('day');
    setView(data);
    gantt.init("gantt");
    gantt.parse(data.tasks);
    gantt.showDate(before);
};

$("#sel-view").on("change", function () {
    $(".gantt-date-planned").remove();
    scale = $(this).find("option:selected").val();
    gantt.config.start_date = view[scale].min;
    gantt.config.end_date = view[scale].max;
    setScaleConfig(scale);
    gantt.render();
});

$("#sel-order").on("change", function () {
    $.ajax({
        url: "../user/getGantt",
        type: "get",
        data: "order=" + $(this).find("option:selected").val()
    }).success(function (data) {
        setView(data);
        gantt.config.start_date = view[scale].min;
        gantt.config.end_date = view[scale].max;
        gantt._clear_data();
        gantt.parse(data.tasks);
        gantt.showDate(before);
    })
});

function init() {
    initSel();
    $.ajax({
        url: "../user/getGantt",
        type: "get",
        data: "order=all"
    }).success(function (data) {
        initGantt(data);
    })
}

init();



