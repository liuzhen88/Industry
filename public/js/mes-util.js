window.mesUtil = {
    params: {},
    getClientPath: function () {
        var client = this.getClientName();
        if (client === null) return null;
        return "/" + client;
    },
    getClientName: function () {
        var parts = window.location.pathname.split("/");
        if (parts.length >= 2) {
            return parts[1];
        } else {
            return null;
        }
    },
    error: function (xhr, status, err) {
        var $alert = $("#error-alert");
        var message = status;
        if (xhr.responseJSON && xhr.responseJSON.message) {
            message = xhr.responseJSON.message;
        }
        $("p.error-message", $alert).html(message);
        if (xhr.status === 401) {
            $("#alert-ok", $alert).on("click", function (e) {
                location.href = mesUtil.getClientPath();
            });
        }
        $alert.modal();
    },
    loadEnums: function (cb) {
        var that = this;
        $.getJSON("../admin/enums", function (data) {
            for(var i=0;i<data.length;i++){
                if (data[i].values) {
                    that.params[data[i].name] = data[i].values;
                } else if (data[i].value) {
                    that.params[data[i].name] = data[i].value;
                }
            };
        }).success(cb).fail(mesUtil.error);
    },
    initToastrAndBootbox: function () {
        if (toastr) {
            toastr.options.timeOut = 2000;
        }
        if (bootbox) {
            bootbox.setLocale("zh_CN");
        }
    },
    tree: {
        create: function (id, $container, data, clickCB) {
            var $tree = $("#" + id, $container);
            $tree.jstree({
                plugins: ["types", "inp"],
                core: {
                    themes: {responsive: false},
                    data: [data]
                },
                types: {
                    "default": {icon: "fa fa-file icon-state-warning icon-lg"},
                    folder: {icon: "fa fa-folder icon-state-warning icon-lg"}
                }
            });
            $tree.on("select_node.jstree", function (e, data) {
                if (data.node.icon.indexOf("fa-folder") !== -1) {
                    clickCB ? clickCB(data.node) : $tree.jstree(true).toggle_node(data.node);
                }
            });
        }
    },
    formStatus: {
        NEW: "新创建",
        NOT_PROCESSED: "未处理",
        PROCESSED: "已处理",
        EDITING: "编辑中",
        AUDITING: "审核中",
        AUDITED: "审核通过",
        REJECTED: "审核未通过",
        PREPARING: "调产中",
        EXECUTING: "执行中",
        FINISHED: "完工",
        CONFIRMED: "完工确认"
    },
    table: {
        /**
         * 把记录添加到DataTable中
         *
         * @param data 要添加的数据
         * @param dtTable DataTable
         * @param $th DataTable的thead (jQuery对象)
         */
        addRecordToDatatable: function (data, dtTable, $th) {
            // 显示前5个字段
            var displayFields = [], count = 0;
            findDisplayFields(data.body);

            for (var i = 0; i < displayFields.length; i++) {
                $th[i + 1].textContent = displayFields[i].text;     // 第一个是序号,跳过
            }
            var rowValues = [dtTable.data().length + 1];
            rowValues = rowValues.concat(displayFields.map(function (d) {
                return d.value || '';
            }));
            rowValues.push(data.status || '');

            var t = dtTable.row.add(rowValues).draw();
            $(t.node()).attr("id", data._id);

            // 目前只找最开始的5个,用depth first
            function findDisplayFields(node) {
                if (count === 5) return;
                if (node instanceof Array) {
                    for (var i = 0; i < node.length; i++) {
                        findDisplayFields(node[i]);
                    }
                } else if (node.children) {
                    for (var i = 0; i < node.children.length; i++) {
                        findDisplayFields(node.children[i]);
                    }
                } else {
                    count++;
                    displayFields.push(node);
                }
            }
        }
    }
};

$(function () {
    Metronic.init();
    Layout.init();

    moment.locale("zh-cn");
    $("p.today").html(moment().format("LLL"));
    $("a.logout").on("click", function (e) {
        e.preventDefault();
        var path = mesUtil.getClientPath();
        if (path !== null) {
            $.post(path + "/logout", function (data) {
                location.href = path;
            });
        }
    });
});