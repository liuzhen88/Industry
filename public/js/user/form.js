$(function () {

    var idCounter = 0;  // assign an id for each node
    var formId = $(".form-card").attr("id");
    var dtTable, $table = $("table.dataTable");
    var treeData, formPerm;
    var $treeContainer = $('.tree-container'),
        $treeBody = $('.tree-body', $treeContainer),
        $treeHeader = $('.tree-header', $treeContainer),
        $treeActions = $('.tree-actions', $treeContainer);
    var actions = {assign: "ASSIGN"};
    var $action = $(".action-right");
    var updates = {idForm: [], fields: []};     // 保存从input onChange来的所有更新，idForm用来检索每个改变字段属于哪个子表

    mesUtil.formInsts = {};
    mesUtil.initToastrAndBootbox();

    initJSTree();
    initDatatable();
    loadFormInsts();
    setupEventHandlers();

    function setupEventHandlers() {
        $('.submitBtn').on('click', function (e) {
            bootbox.confirm(
                {
                    message: "确认编辑完成, 提交表单吗?",
                    callback: function (result) {
                        if (result) {
                            $.ajax({
                                url: "../user/submitOrderItem",
                                method: "POST"
                            }).done(function (data) {
                                dtTable.clear();
                                loadFormInsts();
                                toastr.success("提交成功");
                            }).fail(mesUtil.error);
                        }
                    }
                }
            )
        });
        if ($(".verify").length > 0) {
            $(".verify").on("click", function (e) {
                bootbox.confirm(
                    {
                        message: "确认编辑完成? 提交审核后就不能再修改了。",
                        callback: function (result) {
                            if (result) {
                                var instId = $('tbody tr.selected', $table).attr("id");
                                var status = "审核中";
                                $.ajax({
                                    url: "../user/formStatus",
                                    method: "POST",
                                    data: $.param({id: instId, status: status})
                                }).done(function (data) {
                                    // update local data and show status change
                                    treeData.status = status;
                                    updateDTRow();
                                    $(".verify").addClass("disabled");
                                    toastr.success("提交成功");
                                }).fail(mesUtil.error);
                            }
                        }
                    }
                )
            });
        }
        if ($(".scan").length > 0) {
            $(".scan").on("click", function (e) {
                var machNo = $("input.mach-no").val();
                if (machNo === "") {
                    bootbox.alert("请输入机台号");
                } else {
                    var a = $("tbody tr td:nth-child(4)");
                    for (var i = 0; i < a.length; i++) {
                        if (a[i].textContent === machNo) {
                            var $tr = $(a[i]).parent();
                            if (!$tr.hasClass("selected")) $tr.trigger("click");
                            break;
                        }
                    }
                    $("input.mach-no").val("");
                }
            });
        }
    }

    function loadFormInsts() {
        if (formId) {
            $.getJSON("../user/formInsts?form_id=" + formId, function (data) {
                data.formInsts.forEach(function (d) {
                    addRecordToList(d);
                });
                formPerm = data.formPerm;
            }).fail(mesUtil.error);
        }
    }

    function initJSTree() {
        var inp = document.createElement('INPUT');
        inp.setAttribute('type', 'text');
        inp.className = "jstree-inp";

        $.jstree.plugins.inp = function (options, parent) {
            this.bind = function () {
                parent.bind.call(this);
                this.element
                    .on("change.jstree", ".jstree-inp", $.proxy(function (e) {
                        var $target = $(e.target);
                        updates.fields.push({id: +$target.parent().attr("id"), value: $target.val()});
                    }, this));
            };
            this.redraw_node = function (obj, deep, callback) {
                obj = parent.redraw_node.call(this, obj, deep, callback);
                if (obj && obj.className.indexOf("jstree-leaf") !== -1) {
                    // TODO: find node by id. this is not so efficient, but haven't found a way to get the value data except from core.data
                    var found = {};
                    findNodeById(treeData.body, obj.id, found);
                    var tmp = inp.cloneNode(true);
                    tmp.value = found.node.value || "";
                    if (treeData.readonly) {
                        tmp.setAttribute("disabled", "disabled");
                    }
                    obj.insertBefore(tmp, obj.childNodes[1].nextSibling);
                }
                return obj;
            };
        };
    }

    function initDatatable() {
        var option = {
            "paging": false,
            "searching": false,
            "info": false,
            "language": {
                "emptyTable": "目前表内没有数据"
            }
        };
        dtTable = $table.DataTable(option);
        $('tbody', $table).on('click', 'tr', function () {
            var $this = $(this);
            if ($this.children().length === 1) {
                return;     // no data row
            }
            if ($this.hasClass('selected')) {
                $this.removeClass('selected');
                clearTreeContainer();
            } else {
                $("tr.selected").removeClass("selected");
                $this.addClass('selected');
                treeData = mesUtil.formInsts[$this.attr("id")];
                layout();
            }
        });
    }

    function layout() {
        var username = $(".username").text(), today = moment().format("L");
        var status = treeData.status;
        var $verify = $(".verify");
        var header = {
            enabled: [],    // enabled inputs
            populate: []    // populated inputs
        };
        var options = { header: header };

        treeData.readonly = true;
        updates.idForm = [];
        walkTree(treeData.body, treeData.body, 1);

        if (!$verify.hasClass("disabled")) $verify.addClass("disabled");
        if (status === mesUtil.formStatus.NEW) {
            header.enabled = ["form_no", "version"];
            header.populate = [
                {name: "author", value: username},
                {name: "created", value: today}
            ];
            treeData.readonly = false;
            idCounter = 0;
            showTree(options);
        } else if ((status === mesUtil.formStatus.NOT_PROCESSED || status === mesUtil.formStatus.REJECTED) && formPerm.operate) {
            header.enabled = ["form_no", "version"];
            idCounter = 0;
            showTree(options);
            treeData.readonly = false;
            // enable submission button
            $verify.removeClass("disabled");
        } else if (status === mesUtil.formStatus.AUDITING && formPerm.approve) {
            header.populate = [
                {name: "auditor", value: username},
                {name: "audit-date", value: today}
            ];
            showTree(options);
        } else if (status == mesUtil.formStatus.AUDITED && formPerm.assign) {
            options.action = actions.assign;
            showTree(options);
        } else if ($.isEmptyObject(formPerm)) {
            showActionRight();
            showTree(options);
        } else {
            // if user has no permission, display default readonly tree
            options.noPermission = true;
            showTree(options);
        }
    }

    function findNodeById(node, id, foundNode) {
        if (node instanceof Array) {
            for (var i = 0; i < node.length; i++) {
                findNodeById(node[i], id, foundNode);
            }
        } else {
            if (node.id === id) {
                foundNode.node = node;
            } else {
                if (node.children && node.children.length > 0) {
                    findNodeById(node.children, id, foundNode);
                }
            }
        }
    }

    // walk through the tree and add layers
    function walkTree(node, parent, layers) {
        if (node instanceof Array) {
            for (var i = 0; i < node.length; i++) {
                walkTree(node[i], node, layers);
            }
        } else {
            if (node.repeat && node.repeat === "n") {
                node.repeat = layers;
                node.value = 1;
                for (var j = 2; j <= layers; j++) {
                    parent.push(addLayer(node, j));
                }
            }
            node.id = "" + idCounter++;
            if (node.sub_form) updates.idForm.push({startId: +node.id, instId: node._id});
            if (node.children && node.children.length > 0) {
                walkTree(node.children, node, layers);
            }
        }
    }

    function addLayer(obj, layer) {
        var target = {};
        for (var i in obj) {
            if (obj.hasOwnProperty(i) && i !== "repeat") {
                if (i === "text") {
                    target[i] = obj[i].replace("1", layer);
                } else if (obj[i] instanceof Array) {
                    target[i] = $.extend(true, [], obj[i]);
                } else {
                    target[i] = obj[i];
                }
            }
        }
        target.value = layer;
        return target;
    }

    function treeOnChangeHandler() {
        $("input", $treeHeader).on("change", function (e) {
            for (var i = 0; i < treeData.header.length; i++) {
                if (treeData.header[i].name === this.name) {
                    treeData.header[i].value = this.value;
                    break;
                }
            }
        });
    }

    var formHandlers = {
        createForm: function () {
            $treeBody.append("<div class='portlet-actions pull-right'><button class='cancel btn btn-default' type='button'>取消</button>" +
            "<button class='save btn btn-primary' type='button'>保存</button></div>");
            treeOnChangeHandler();

            $(".save", $treeBody).on("click", function (e) {
                treeData.status = "编辑中";
                treeData.tmpl_id = formId;
                delete treeData.readonly;
                $.ajax({
                    url: "../user/formInst",
                    method: "POST",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify({form: treeData})
                }).done(function (data, status, jqXHR) {
                    treeData._id = data.id;
                    addRecordToList(treeData);
                    clearTreeContainer();
                    toastr.success("添加成功");
                }).fail(mesUtil.error);
            });
        },
        modifyForm: function () {
            $treeBody.append(
                //"<div class='portlet-actions pull-left'><button class='delete btn btn-default btn-danger' type='button'>删除</button></div>" +
            "<div class='portlet-actions pull-right'><button class='cancel btn btn-default' type='button'>取消</button>" +
            "<button class='edit btn btn-primary' type='button'>修改</button></div>");
            treeOnChangeHandler();

            $(".edit", $treeBody).on("click", function (e) {

                // 根据node id值判断是哪个表单实例的修改
                var updatesByInstId = {}, instId;
                updates.fields.forEach(function (f) {
                    instId = getInstId(f.id);
                    if (!updatesByInstId[instId]) {
                        updatesByInstId[instId] = [];
                    }
                    var exist = false, d;
                    for (var i = 0; i < updatesByInstId[instId].length; i++) {
                        d = updatesByInstId[instId][i];
                        if (d.id === f.id) {
                            d.value = f.value;
                            exist = true;
                            break;
                        }
                    }
                    if (!exist) updatesByInstId[instId].push(f);
                });

                // 遍历树，根据node id把修改节点的路径找到
                treeData.body.forEach(function (b) {
                    if (updatesByInstId[b._id]) {
                        setPathById(b.children, updatesByInstId[b._id], []);
                    }
                });

                $.ajax({
                    url: "../user/formInst",
                    method: "PUT",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify({updates: updatesByInstId})
                }).done(function (data, status, jqXHR) {
                    dtTable.clear();
                    clearTreeContainer();
                    loadFormInsts();
                    toastr.success("更新成功");
                }).fail(mesUtil.error);
            });

            $(".delete", $treeBody).on("click", function (e) {
                bootbox.confirm({
                    message: "确定要删除吗?",
                    callback: function (result) {
                        if (result) {
                            $.ajax({
                                url: "../user/formInst",
                                method: "DELETE",
                                data: $.param({id: treeData._id})
                            }).done(function (data, status, jqXHR) {
                                clearTreeContainer();
                                dtTable.row($('tbody tr.selected', $table)).remove().draw();
                                toastr.success("删除成功");
                            }).fail(mesUtil.error);
                        }
                    }
                });
            });

            function getInstId(nodeId) {
                for (var i = 0; i < updates.idForm.length; i++) {
                    if (i + 1 === updates.idForm.length ||
                        (updates.idForm[i].startId < nodeId && updates.idForm[i + 1].startId > nodeId)) {
                        return updates.idForm[i].instId;
                    }
                }
            }

            function setPathById(node, updates, path) {
                if (node instanceof Array) {
                    for (var i = 0; i < node.length; i++) {
                        setPathById(node[i], updates, path);
                    }
                } else if (node.children instanceof Array) {
                    path.push(node.name);
                    for (var i = 0; i < node.children.length; i++) {
                        setPathById(node.children[i], updates, path);
                    }
                    path.pop();
                } else {
                    for (var i = 0; i < updates.length; i++) {
                        if (updates[i].id === +node.id) {
                            updates[i].name = path.length === 0 ? node.name : path.join(".") + '.' + node.name;
                            break;
                        }
                    }
                }
            }
        },
        auditForm: function () {
            $treeBody.append("<div class='portlet-actions pull-left'><button class='reject btn btn-default btn-danger' type='button'>未通过</button></div>" +
            "<div class='portlet-actions pull-right'><button class='cancel btn btn-default' type='button'>取消</button>" +
            "<button class='pass btn btn-primary' type='button'>通过</button></div>");

            $(".pass").on("click", function (e) {
                bootbox.confirm({
                    message: "确认审核通过? ",
                    callback: function (result) {
                        reviewHandler(result, "审核通过");
                    }
                })
            });

            $(".reject", $treeBody).on("click", function (e) {
                bootbox.confirm({
                    message: "确认审核未通过? ",
                    callback: function (result) {
                        reviewHandler(result, "审核未通过");
                    }
                });
            });

            function reviewHandler(result, status) {
                if (result) {
                    $.ajax({
                        url: "../user/formStatus",
                        method: "POST",
                        data: $.param({
                            id: treeData._id,
                            status: status,
                            auditor: $(".username").text(),
                            auditDate: moment().format("L")
                        })
                    }).done(function (data) {
                        // update local data and show status change
                        treeData.status = status;
                        updateDTRow();
                        toastr.success(status);
                    }).fail(mesUtil.error);
                }
            }
        },
        assignWorker: function () {
            $treeActions.empty();
            $treeActions.removeClass("hidden");
            $treeActions.append(
                "<div class='well'><label class='col-md-2'>操作工: </label><div class='col-md-6'>" +
                "<select id='worker-select' class='form-control'><option disabled></option></select></div>" +
                "<button id='assign-btn' class='btn btn-primary'>分配</button><div class='clearfix'></div>");

            var $workers = $("#worker-select");
            mesUtil.workers.forEach(function (worker) {
                $workers.append("<option id='" + worker._id + "' name='worker'>" + worker.last_name + worker.first_name + "</option>");
            });

            $("#assign-btn").on("click", function (e) {
                var $sel = $("#worker-select option:selected");
                var data = {
                    formInst_id: treeData._id,
                    worker_id: $sel.attr("id"),
                    worker_name: $sel.val()
                };
                $.ajax({
                    url: "../user/assign",
                    method: "POST",
                    data: $.param(data)
                }).done(function (data) {
                    toastr.success("分配成功");
                    $("#worker-select").val("");
                    clearTreeContainer();
                    dtTable.clear();
                    loadFormInsts();
                }).fail(mesUtil.error);
            });
        }
    };

    function showTree(options) {
        var header = options.header;
        var status = treeData.status;

        // caption update
        $(".caption-subject").text(treeData.name);
        $(".caption-helper").html(treeData.status || "新创建");

        // actions if any
        if (options.action) {
            $treeActions.show();
            if (options.action === actions.assign) {
                $.getJSON("../user/users?role=operator", function (data) {
                    mesUtil.workers = data.workers;
                    formHandlers.assignWorker();
                }).fail(mesUtil.error);
            }
        } else {
            $treeActions.empty();
            $treeActions.addClass("hidden");
        }

        // process header area: enable inputs and populate input values
        var html = "", htmlRow;
        if (treeData.header) {
            treeData.header.forEach(function (h, i) {
                htmlRow = "";
                if (i % 3 === 0) htmlRow += "<div class='row'>";

                // populate header values
                for (var j = 0; j < header.populate.length; j++) {
                    if (header.populate[j].name === h.name) {
                        h.value = header.populate[j].value;
                        break;
                    }
                }

                htmlRow +=
                    "<div class='form-group col-md-4'><label>" + h.text + "</label><input type='text' class='form-control input-sm' disabled name='"
                    + h.name + "' value='" + (h.value || "") + "'></div>";
                if (i % 3 === 2) htmlRow += "</div>";
                html += htmlRow;
            });
            $treeHeader.html(html);

            // enable input for header values
            header.enabled.forEach(function (h) {
                $("input[name='" + h + "']", $treeHeader).prop("disabled", false);
            });
        }

        // tree body
        $treeBody.empty();
        $treeBody.append("<div id='tree' class='col-md-12 param-tree'></div>");
        var root = {text: treeData.name, type: "folder", state: {opened: true}, children: treeData.body};
        mesUtil.tree.create("tree", $treeBody, root);

        if (!treeData.noPermission) {
            if (status === mesUtil.formStatus.NEW) {
                formHandlers.createForm();
            } else if (status === mesUtil.formStatus.NOT_PROCESSED) {
                formHandlers.modifyForm();
            } else if (status === mesUtil.formStatus.AUDITING) {
                formHandlers.auditForm();
            }
        }
        $(".cancel", $treeBody).on("click", function (e) {
            clearTreeContainer();
            $('tbody tr.selected').removeClass("selected");
        });
    }

    function clearTreeContainer() {
        $(".caption-helper").html("");
        $treeBody.empty();
        $treeHeader.empty();
        $treeActions.addClass("hidden");
        if (!$(".verify").hasClass("disabled")) $(".verify").addClass("disabled");
        if (!$action.hasClass("hidden")) $action.addClass("hidden");
    }

    function updateDTRow() {
        clearTreeContainer();
        var $row = $('tbody tr.selected', $table);
        var d = dtTable.row($row).data();
        for (var i = 1; i < d.length - 1; i++) {
            d[i] = treeData.body[0].children[i - 1].value || "";
        }
        d[i] = treeData.status;
        dtTable.row($row).data(d).draw();
        $row.removeClass("selected");
    }


    function addRecordToList(data) {
        mesUtil.formInsts[data._id] = data;
        var fields = data.body[0].children;
        // 显示前5个字段
        var displayFields = [], count = 0;
        findDisplayFields(fields);

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
        var $th = $(".dataTable th");
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
    }

    function showActionRight() {
        if (treeData.status === "审核通过") {
            initHandler();
        } else if (treeData.status === "调产中") {
            prepHandler();
        } else if (treeData.status === "执行中") {
            startHandler();
        } else if (treeData.status === "完工") {
            startHandler(true);
        }

        function initHandler() {
            setActions(
                "<div class='col-md-12'><button id='prep-btn' class='btn btn-primary center-block full-button'>开始调产</button></div><div class='clearfix' />",
                [{
                    buttonId: "#prep-btn",
                    handler: function (data) {
                        updateStatus("调产中", function (data) {
                            prepHandler();
                        });
                    }
                }]
            );
        }

        function prepHandler() {
            setActions(
                "<div class='col-md-12'><button id='start-btn' class='btn btn-primary center-block full-button'>调产结束，开始生产</button></div>" +
                "<div class='clearfix' />",
                [{
                    buttonId: "#start-btn",
                    handler: function (data) {
                        prompt("请扫描上线工字轮:", function (result) {
                            if (result) {
                                updateStatus("执行中", function (data) {
                                    startHandler();
                                })
                            }
                        })
                    }
                }]
            )
        }

        function startHandler(done) {
            setActions(
                "<div class='col-md-3'><button id='import-btn' class='btn btn-primary center-block'>上线</button></div>" +
                "<div class='col-md-3'><button id='export-btn' class='btn btn-primary center-block'>收线</button></div>" +
                "<div class='col-md-3'><button id='pause-btn' class='btn btn-primary' center-block>暂停</button></div>" +
                "<div class='col-md-3'><button id='finish-btn' class='btn btn-primary' center-block>完工</button></div><div class='clearfix' />",
                [
                    {buttonId: "#import-btn", handler: importHandler},
                    {buttonId: "#export-btn", handler: exportHandler},
                    {buttonId: "#pause-btn", handler: pauseHandler},
                    {buttonId: "#finish-btn", handler: finishHandler}
                ]
            );
            if (done) $(".action-right button").prop("disabled", true);
        }

        function importHandler(data) {
            prompt("请扫描上线工字轮:", function (result) {
                console.log("上线");    // TODO: save
            });
        }

        function exportHandler(data) {
            prompt("请扫描收线工字轮:", function (result) {
                console.log("收线");    // TODO: save
            });
        }

        function pauseHandler(data) {
            updateStatus("暂停中", function (data) {
                var startTime = new Date().getTime();
                bootbox.dialog({
                    title: "输入暂停原因:",
                    closeButton: false,
                    message: '<form class="bootbox-form"><input type="text" autocomplete="off" class="bootbox-input bootbox-input-text form-control"></form>',
                    buttons: {
                        confirm: {
                            label: "继续",
                            className: "btn-primary",
                            callback: function (result) {
                                var stopTime = new Date().getTime();
                                updateStatus("执行中", function (data) {
                                    console.log("pause resumed");
                                })
                            }
                        }
                    }
                });
            });
        }

        function finishHandler(data) {
            bootbox.dialog({
                title: "输入实际产量:",
                message: "<div class='row'><div class='col-md-12'><form class='form-horizontal'>" +
                "<div class='form-group'><label class='col-md-3 control-label'>件数</label>" +
                "<div class='col-md-7'><input name='import' class='form-control' type='text'></div></div>" +
                "<div class='form-group'><label class='col-md-3 control-label'>米长</label>" +
                "<div class='col-md-7'><input name='export' class='form-control' type='text'></div></div>" +
                "</form></div></div>",
                buttons: {
                    cancel: {
                        label: "取消",
                        className: "btn-default"
                    },
                    success: {
                        label: "确定",
                        className: "btn-primary",
                        callback: function (e) {
                            updateStatus("完工", function (data) {
                                $(".action-right button").prop("disabled", true);
                            });
                        }
                    }
                }
            })
        }

        function prompt(title, cb) {
            bootbox.prompt({
                title: title,
                buttons: {
                    cancel: {
                        label: "取消",
                        className: "btn-default"
                    },
                    confirm: {
                        label: "确认",
                        className: "btn-primary"
                    }
                },
                callback: cb
            });
        }
    }

    function setActions(buttonHtml, buttons) {
        if ($action.hasClass("hidden")) $action.removeClass("hidden");
        $action.empty();
        $action.append(buttonHtml);
        buttons.forEach(function (b) {
            $(b.buttonId).on("click", b.handler);
        })
    }

    function updateStatus(status, cb) {
        $.ajax({
            url: "../user/formStatus",
            method: "POST",
            data: $.param({id: treeData._id, status: status})
        }).done(function (data) {
            treeData.status = status;
            $("tbody tr.selected td:last-child").text(status);
            $(".caption-helper").text(status);
            cb(data);
        }).fail(mesUtil.error);
    }
});