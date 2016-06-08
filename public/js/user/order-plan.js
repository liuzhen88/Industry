$(function () {

    var idCounter = 0;  // assign an id for each node
    var formId = $(".form-card").attr("id");
    var dtTable, $table = $("table.dataTable");
    var treeData, formPerm, originalData;
    var $treeContainer = $('.tree-container'),
        $treeBody = $('.tree-body'),
        $treeHeader = $('.tree-header');
    var updates = [];
    var cache = {};

    var datetimepickerOption = {
        format: "yyyy-mm-dd",
        language: "zh-CN",
        maxView: '4',
        minView: '2',
        autoclose: true,
        todayBtn: true,
        startDate: new Date(),
        endDate: moment().add(1, 'y').toDate()
    }

    mesUtil.formInsts = {};
    mesUtil.initToastrAndBootbox();

    initJSTree();
    initDatatable();
    setupEventHandlers();

    var tree = {
        get: function (tree, name) {
            if (!tree || !tree._id || !tree.body || !name) return null;
            return checkMap(tree)[name];
        },
        set: function (tree, name, value) {
            if (!tree || !tree._id || !tree.body || !name) return null;
            var node = checkMap(tree)[name];
            node.value = value;
        },
        expire: function (tree) {
            if (!tree || !tree._id) return null;
            delete cache[tree._id];
        }
    }

    function checkMap(tree) {
        var treeMap;
        if (cache[tree._id]) {
            if (cache[tree._id]._obj !== tree) {
                delete cache[tree._id];     // 如果id相同，但是实例并不是同一个，这时候也要重新build map
            } else {
                treeMap = cache[tree._id];
            }
        }
        if (!treeMap) {
            // rebuild map
            treeMap = {_obj: tree};
            buildMap(tree.body, [], treeMap);
            cache[tree._id] = treeMap;
        }
        return treeMap;
    }

    function buildMap(node, path, map) {
        if (node instanceof Array) {
            for (var i = 0; i < node.length; i++) {
                buildMap(node[i], path, map);
            }
        } else {
            path.push(node.name);
            map[path.join(".")] = node;
            if (node.children) {
                for (var i = 0; i < node.children.length; i++) {
                    buildMap(node.children[i], path, map);
                }
            }
            path.pop();
        }
    }

    function getFullName(tree, node) {
        var son = tree.get_node(node);
        var name = son.original.name;
        var parents = son.parents;
        for (var i = 0; i < parents.length; i++) {
            var parent = tree.get_node(parents[i]);
            if (i < parents.length - 2) {
                name = parent.original.name + "." + name;
            }
        }
        return name;
    }

    function initJSTree() {
        var inp = document.createElement('INPUT');
        inp.setAttribute('type', 'text');
        inp.className = "jstree-inp-sm";

        $.jstree.plugins.inp = function (options, parent) {
            this.bind = function () {
                parent.bind.call(this);
                this.element
                    .on("change.jstree", ".jstree-inp-sm", $.proxy(function (e) {
                        var $target = $(e.target);
                        var name = getFullName($("#tree", $treeBody).jstree(), $target.parent());
                        if (updates.length == 0) {
                            updates.push({
                                name: name,
                                value: $target.val()
                            });
                        }
                        else {
                            var exist = false;
                            for (var i = 0; i < updates.length; i++) {
                                if (updates[i].name == name) {
                                    exist = true;
                                    updates[i].value = $target.val();
                                    break;
                                }
                            }
                            if (!exist) {
                                updates.push({
                                    name: name,
                                    value: $target.val()
                                });
                            }
                        }
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
                    tmp.name = found.node.name || "";
                    if (tmp.name == "ksrq" || tmp.name == "wcrq" || tmp.name == "jhcl"||tmp.name == "sjcl") {
                        if (tmp.name == "ksrq" || tmp.name == "wcrq") {
                            $(tmp).datetimepicker(datetimepickerOption);
                        }
                    }
                    else {
                        tmp.setAttribute("disabled", "disabled");
                    }
                    obj.insertBefore(tmp, obj.childNodes[1].nextSibling);
                }
                return obj;
            };
        };
    }

    function initDatatable() {
        dtTable = $table.DataTable({
            ajax: {
                url: "../user/getOrderPlans",
                type: "GET"
            },
            serverSide: 'true',
            paging: true,
            "columns": [
                {"data": "ddh"},
                {"data": "cpbh"},
                {"data": "lb"},
                {"data": "gg"},
                {"data": "zj"},
            ],
            columnDefs: [
                {
                    "targets": "_all",
                    "data": null, // Use the full data source object for the renderer's source
                    "render": function (data, type, full, meta) {
                        return data || "—";
                    }
                }
            ],
            "createdRow": function ( row, data, index ) {
                mesUtil.formInsts[data._id]=data;
            },
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
                originalData = $.extend(true, {}, treeData);
                showTree(treeData);
            }
        });
    }

    function setupEventHandlers(){

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

    function setupEventHandlers() {
        $('.expand').on('click', function () {
            $('#tree').jstree(true).open_all();
        });
        $('.compress').on('click', function () {
            var $tree = $('#tree').jstree(true);
            $tree.close_all();
            $tree.redraw(true);
        });
        $(".cancel", $treeHeader).on("click", function (e) {
            clearTreeContainer();
            $('tbody tr.selected').removeClass("selected");
        });
        $(".edit", $treeHeader).on("click", function (e) {
            for (var i = 0; i < updates.length; i++) {
                tree.set(originalData, updates[i].name, updates[i].value);
            }
            $.ajax({
                url: "../user/saveOrderPlan",
                method: "POST",
                data: "form=" + encodeURIComponent(JSON.stringify(originalData))
            }).done(function (data, status, jqXHR) {
                cache = {};
                updates = [];
                dtTable.ajax.reload();
                clearTreeContainer();
                toastr.success("更新成功");
            }).fail(mesUtil.error);
        });
    }

    function showTree(tree) {
        walkTree(tree.body, tree.body, 1);
        $(".caption-subject").text(tree.name);
        $('.expand').removeClass('hidden');
        $('.compress').removeClass('hidden');
        $treeBody.empty();
        $treeBody.append("<div id='tree' class='col-md-12 param-tree'></div>");
        var root = {text: tree.name, type: "folder", state: {opened: true}, children: tree.body};
        mesUtil.tree.create("tree", $treeBody, root);
        $treeHeader.removeClass('hidden');
        $('input', $treeHeader).each(function (idx) {
            for (var i = 0, len = tree.header.length; i < len; i++) {
                if (tree.header[i].name === this.getAttribute('name')) {
                    this.value = tree.header[i].value || '';
                }
            }
        });
    }

    function clearTreeContainer() {
        $('.expand').addClass('hidden');
        $('.compress').addClass('hidden');
        $(".caption-helper").html("");
        $treeBody.empty();
        $treeHeader.addClass('hidden');
    }

});