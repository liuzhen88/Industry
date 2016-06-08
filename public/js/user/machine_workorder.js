$(function () {

    var cache = {};
    var id = 0;
    var data;

    initDt();
    initJSTree();
    initEvent();

    function initJSTree() {
        var inp = document.createElement('INPUT');
        inp.setAttribute('type', 'text');
        inp.className = "jstree-inp-sm";
        $.jstree.plugins.inp = function (options, parent) {
            this.redraw_node = function (obj, deep, callback) {
                obj = parent.redraw_node.call(this, obj, deep, callback);
                if (obj && obj.className.indexOf("jstree-leaf") !== -1) {
                    var found = {};
                    findNodeById(data.body, obj.id, found);
                    var tmp = inp.cloneNode(true);
                    tmp.name = found.node.name || "";
                    tmp.value = found.node.value;
                    tmp.setAttribute("disabled", "disabled");
                    if (!found.node.empty) {
                        obj.insertBefore(tmp, obj.childNodes[1].nextSibling);
                    }
                }
                return obj;
            };
        };
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

    function walkTree(node) {
        if (node instanceof Array) {
            for (var i = 0; i < node.length; i++) {
                walkTree(node[i]);
            }
        } else {
            node.id = "" + id++;
            if (node.children && node.children.length > 0) {
                walkTree(node.children);
            }
        }
    }

    function showTree(tree) {
        walkTree(tree.body);
        $('.expand').removeClass('hidden');
        $('.compress').removeClass('hidden');
        $(".jstree").empty();
        $(".jstree").append("<div id='tree'></div>");
        mesUtil.tree.create("tree", $(".jstree"), {
            text: data.device_num,
            type: "folder",
            state: {opened: true},
            children: tree.body
        });
    }

    function clearTreeContainer() {
        $('.expand,.compress').addClass('hidden');
        $(".jstree").empty();
    }

    function initDt() {
        var dt = $("#tab").DataTable({
            ajax: {
                url: "../user/getMachineWorkorders",
                type: "GET",
                data: {
                    "status": JSON.stringify(["未下发", "已下发", "已终止", "已完工"])
                }
            },
            serverSide: 'true',
            paging: true,
            "columns": [
                {
                    "data": null, createdCell: function (nTd, sData, oData, iRow, iCol) {
                    var startnum = this.api().page() * (this.api().page.info().length);
                    $(nTd).html(iRow + 1 + startnum);
                }
                },
                {"data": "device_num"},
                {"data": "device_model"},
                {"data": "length_error_rate"}
            ],
            columnDefs: [
                {
                    "targets": "_all",
                    "data": null,
                    "render": function (data, type, full, meta) {
                        return data || "";
                    }
                }
            ],
            "createdRow": function (row, data, index) {
                cache[data.DT_RowId] = data;
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
    }

    function initEvent() {
        $("#tab").on('click', 'tr', function () {
            if ($(this).children().length === 1)return;
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
                clearTreeContainer();
            } else {
                $("#tab tr.selected").removeClass("selected");
                $(this).addClass('selected');
                data = cache[$(this).attr("id")];
                showTree(data);
            }
        });
        $('.expand').on('click', function () {
            $('#tree').jstree(true).open_all();
        });
        $('.compress').on('click', function () {
            var $tree = $('#tree').jstree(true);
            $tree.close_all();
            $tree.redraw(true);
        });
    }
});
