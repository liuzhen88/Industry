$(function () {

    var form = {
        id: $('.form-card').attr('id'),     // 模版表单id, 不是实例id
        perm: {}                            // 用户对当前表单的权限
    };
    var dtTableOption = {
        'paging': false,
        'searching': false,
        'ordering': true,
        'info': false,
        'language': {
            'emptyTable': '目前表内没有数据'
        }
    };
    String.prototype.replaceAll  = function(s1,s2){  
     return this.replace(new RegExp(s1,"gm"),s2);   
    }
    var treeData = {};                      // 保存所有表单实例数据的map, key是实例id, value是实例
    var curTree, curNode;                   // 当前选中的树实例, 树节点
    var dtTable, $table = $('table.dataTable.list');
    var $treeContainer = $('.tree-container'),
        $treeBody = $('.tree-body', $treeContainer),
        $treeHeader = $('.tree-header');
    var $detail = $('#detail'), $detailBody = $('.portlet-body', $detail), dtTableDetail;
    var $tmpls = $('#tmpls');
    var repeatMap = {'sxfs': 'sxfss', 'gsxfs': 'sxfss', 'ssxfs': 'sxfss', 'lbcs': 'lbcs'};      // 类型到类型数量映射
    var $modalDetail = $('#modal-detail');

    mesUtil.initToastrAndBootbox();

    initDatatable();
    //loadFormInsts();
    setupEventHandlers();

    function initDatatable() {
        //dtTable = $table.DataTable(dtTableOption);
        dtTable = $table.DataTable({
            ajax: {
                url: "../user/getOrderItems",
                type: "GET"
            },
            serverSide: 'true',
            paging: true,
            "columns": [
                {"data": "ddh"},
                {"data": "cpbh"},
                {"data": "lb"},
                {"data": "yt"},
                {"data": "gg"},
                {"data": "zj"},
                {"data": "djmc"},
                {"data": "js"},
                {"data": "status"}
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
            "createdRow": function (row, data, index) {
                treeData[data._id] = data;
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
                $('tr.selected').removeClass('selected');
                $this.addClass('selected');
                curTree = treeData[$this.attr('id')];
                //console.log(JSON.stringify(curTree));
                if(curTree.orderState){
                    showTree(curTree);
                }else{
                    var hscsProp = curTree.data.props.hscs;
                    if (hscsProp !== '' && !isNaN(hscsProp)) {
                        showTree(curTree);
                        return;
                    }
                    var hscs = hscsProp.split(',');
                    if (hscs.length > 1) {
                        hscs.sort();
                        // 如果合绳次数不是单一值,要用户选择
                        var html = '';
                        hscs.forEach(function (h, idx) {
                            html += '<label class="col-md-3 control-label radio-inline">' +
                                '<input name="hscs" type="radio" value="' + h + '">' + h + '次</label>';
                        });
                        bootbox.dialog({
                            title: '选择合绳次数',
                            message: '<div class="row hscs-sel"><div class="col-md-12"><form><div class="form-group">' + html + '</div></form></div></div>',
                            buttons: {
                                success: {
                                    label: "确定",
                                    className: "btn-success",
                                    callback: function () {
                                        var hscs = $("input[name='hscs']:checked").val();
                                        var layerSel = ($('.assign-hscs').length === 0 || $('.assign-hscs input[name="selLayers"]:checked').val());
                                        if (!hscs || !layerSel) {
                                            bootbox.alert('必须选择合绳次数');
                                            return false;
                                        } else {
                                            // 修改树形结构, 保存, 再显示
                                            var data = {id: curTree._id, hscs: hscs};
                                            if ($('.assign-hscs').length > 0) {
                                                data.csHsList = [];
                                                for (var i = 1; i <= +hscs; i++) {
                                                    if (i === 1) {
                                                        data.csHsList.push(+$('.assign-hscs input[name="selLayers"]:checked').val());
                                                    } else {
                                                        data.csHsList.push(+$('.last-layer').html().substr(0, 1));
                                                    }
                                                }
                                            }
                                            $.ajax({
                                                url: '../user/updateHSCS',
                                                method: 'PUT',
                                                dataType: 'json',
                                                data: data
                                            }).done(function (result) {
                                                var updatedOrderItem = result.orderItem;
                                                treeData[updatedOrderItem._id] = updatedOrderItem;
                                                curTree = updatedOrderItem;
                                                showTree(curTree);
                                            }).fail(mesUtil.error);
                                        }
                                    }
                                }
                            }
                        });
                        $('.hscs-sel input').on('change', function (e) {
                            var selHscs = +this.value;
                            var allHscs = curTree.data.props.hscs.split(',').map(function (d) {
                                return +d;
                            });
                            if (allHscs[0] !== selHscs && allHscs[allHscs.length - 1] !== selHscs) {
                                var panelBody = '';
                                for (var i = 0; i < selHscs; i++) {
                                    if (i < selHscs - 1) {
                                        var radioHtml = '';
                                        for (var j = 1; j < allHscs[allHscs.length - 1]; j++) {
                                            radioHtml += '<label class="radio-inline"><input type="radio" name="selLayers" value="' + j + '">' + j + '层</label>';
                                        }
                                        panelBody += '<li class="list-group-item borderless">第' + (i + 1) + '次合绳:' + radioHtml + '</li>';
                                    } else {
                                        panelBody += '<li class="list-group-item borderless">第' + (i + 1) + '次合绳:<label class="last-layer"></label></li>';
                                    }
                                }
                                $('.hscs-sel').parent().append(
                                    '<div class="panel panel-default assign-hscs" style="margin-top: 20px"><div class="panel-heading">指定每次合绳的合绳层数</div>' +
                                    '<div class="panel-body"><ul class="list-group">' + panelBody + '</ul></div></div>');
                                $('.borderless input').on('change', function (e) {
                                    $('.last-layer').html((allHscs[allHscs.length - 1] - (+this.value)) + '层');
                                });
                            } else {
                                $('.assign-hscs').remove();
                            }
                        });
                    } else {
                        showTree(curTree);
                    }
                }
            }
        });
    }

    function showTree(tree) {
        // caption update
        $('.caption-subject').text(tree.name);
        $('.caption-helper', $('.form-card')).html(tree.status);
        $('.expand').removeClass('hidden');
        $('.compress').removeClass('hidden');

        // tree body
        $treeBody.empty();
        $treeBody.append('<div id="tree" class="col-md-12 param-tree"></div>');
        tree.body[0].state = {opened: true};
        // 最后的function参数是用户点击后的handler, 在这里就是显示明细窗口
        mesUtil.tree.create('tree', $treeBody, tree.body[0], function (node) {
            // 显示明细
            //console.log(node);
            curNode = node.original;
            showNodeDetails(curNode);
        });

        $treeHeader.removeClass('hidden');
        $('input', $treeHeader).each(function (idx) {
            for (var i = 0, len = curTree.header.length; i < len; i++) {
                if (curTree.header[i].name === this.getAttribute('name')) {
                    this.value = curTree.header[i].value || '';
                }
            }
        });
    }

    function addTable(tableId, headHtml) {
        //console.log(headHtml);
        $detailBody.append(
            '<table role="grid" class="table table-striped table-hover table-bordered dataTable no-footer" id="' + tableId + '">' +
            headHtml + '</table>');
        return $('#' + tableId).DataTable(dtTableOption);

    }

    // 显示节点数据
    function showNodeDetails(node) {
        resetDetail();

        var tmplName = getTmplName(node);
        //console.log("tmplName is :"+tmplName);
        // 坯料, 特殊处理
        if ('pl' === tmplName && node.lbcs === -1) {    // 坯料, 没有选择拉拔次数, 要提示用户选择
            askLBCS(curNode.id);
            return;
        }

        // get template
        //如果是单股的分解，显示的股就和钢丝绳的信息一样的格式
        //其他的股还是正常显示
        if(node.is_single_strand||node.is_cps){
            tmplName="gss";
        }
        var $mainTmpl = getTmpl(tmplName);
        if ($mainTmpl.attr('tmpl-ref')) {
            $mainTmpl = getTmpl($mainTmpl.attr('tmpl-ref'));
        }

        setupCaption();
        $detail.removeClass('hidden');

        if (!curTree.data[curNode.id] || ('pl' === tmplName && node.lbcs === 0)) {
            $detailBody.html('<h5>没有数据</h5>');
            if ('pl' === tmplName && node.lbcs === 0) {
                setupActions($mainTmpl);
            }
            return;
        }
        // setup action buttons
        setupActions($mainTmpl);

        // add table and header
        var dt;
        if ($mainTmpl.html()) {
            dt = addTable(tmplName + '-tab', $mainTmpl.html());
            fillDataRow($mainTmpl);
        }

        // add extra tables if any
        var tmpls = $mainTmpl.attr('tmpls'), $extraTmpl;
        if (tmpls) {
            tmpls.split(' ').forEach(function (tmplCls) {
                       // console.log("tmplCls is:"+tmplCls);
                $extraTmpl = getTmpl(tmplCls);
                var total = 1, dataAttr;
                
                if (node[repeatMap[tmplCls]] > 1) {
                    total = node[repeatMap[tmplCls]];
                }          
                for (var i = 0; i < total; i++) {
                    //console.log(total+"=======================");
                     

                        $extraTmpl = $extraTmpl.clone();
                        var $repeat = $('th.repeat', $extraTmpl);
                        //console.log($repeat.text());
                        var textContent = $repeat.text().replace(i, (i+1));
                        if(tmplCls=="ssxfs"){
                            textContent = "收线方式"+(i+1);
                        }
                        $repeat.text(textContent);
                        
                        $('th', $extraTmpl).each(function () {
                            if($(this).attr("data-attr")){
                                dataAttr = $(this).attr('data-attr');
                                     
                                if (dataAttr) {
                                    //console.log("当前i是:"+i);
                                    var newAttr = dataAttr.replace(i, i + 1)
                                    
                                    //console.log("=================================================");
                                    $(this).attr('data-attr', newAttr);
                                }
                                //console.log($(this).attr('data-attr'));
                            }                      
                        });
                       
                     
                    dt = addTable(tmplCls + '-tab' + i, $extraTmpl.html());
                    //console.log($extraTmpl);
                    fillDataRow($extraTmpl,i);
                }
            });
        }

        function setupActions($tmpl) {
            // console.log("********************************");
            // console.log($tmpl);
            // console.log(curTree.status);
            // console.log(mesUtil.formStatus.PROCESSED);
            if (curTree.status === mesUtil.formStatus.PROCESSED) return;
            var ops = $tmpl.attr('ops').split(' ');
            // console.log("=======================");
            // console.log(ops);
            // console.log("=======================");
            ops.forEach(function (op) {
                $('.' + op).removeClass('hidden');
            });
        }

        // add table row data
        function fillDataRow($tmpl,i) {
             //console.log(i);
            var data = curTree.data[node.id], rowData = [];
            $('th', $tmpl).each(function (index,value) {
                //console.log(this.getAttribute('data-attr'));
                for (var i = 0, len = data.length; i < len; i++) {
                    if (data[i].name === this.getAttribute('data-attr')) {
                        // console.log("match name = "+data[i].name);
                        // console.log("match attr = "+this.getAttribute('data-attr'));
                        rowData.push(data[i].value);
                        break;
                    }
                }
            });
           
            //console.log(rowData);
            dt.row.add(rowData).draw();
        }

        // remove all tables and clean up
        function resetDetail() {
            var $detailTables = $('#detail .dataTable');
            if ($detailTables.length > 0) {
                $detailTables.each(function (index) {
                    $(this).DataTable().destroy();
                });
            }
            $detailBody.empty();
            $('#detail .actions .btn').addClass('hidden');
        }

        // setup caption and helper
        function setupCaption() {
            $('.caption-detail', $detail).text(node.text);
            var capHelperText = '';
            if (node.hscs) {
                capHelperText = node.hscs + '次合绳';
            } else if (node.nzcs) {
                capHelperText = node.nzcs + '次捻制';
            } else if (node.lbcs >= 0) {
                capHelperText = (node.lbcs === 0 ? '不经过拉拔' : node.lbcs + '次拉拔');
            }
            $('.caption-helper', $detail).text(capHelperText);
        }
    }

    function askLBCS(nodeId) {
        var html = '<label class="col-md-4 control-label radio-inline"><input name="lbcs" type="radio" value="0">不经过拉拔</label>' +
            '<label class="col-md-4 control-label radio-inline"><input name="lbcs" type="radio" value="1">一次拉拔</label>' +
            '<label class="col-md-3 control-label radio-inline"><input name="lbcs" type="radio" value="2">二次拉拔</label>';
        bootbox.dialog({
            title: '选择拉拔次数',
            message: '<div class="row"><div class="col-md-12"><form class="popup-form"><div class="form-group">' + html + '</div></form></div></div>',
            buttons: {
                cancel: {
                    label: "取消"
                },
                success: {
                    label: "确定",
                    className: "btn-success",
                    callback: function () {
                        var lbcs = $("input[name='lbcs']:checked").val();
                        if (!lbcs) {
                            bootbox.alert('必须选择拉拔次数');
                            return false;
                        } else {
                            lbcs = +lbcs;
                            if (lbcs !== curNode.lbcs) {
                                // 修改树形结构, 保存, 再显示
                                var path = [];
                                getPathForId(curTree.body, nodeId, path);
                                var data = {id: curTree._id, path: path.join('.'), lbcs: lbcs};
                                $.ajax({
                                    url: '../user/updateLBCS',
                                    method: 'PUT',
                                    dataType: 'json',
                                    data: data
                                }).done(function (result) {
                                    curNode.lbcs = lbcs;
                                    var updatedOrderItem = result.orderItem;
                                    treeData[updatedOrderItem._id] = updatedOrderItem;
                                    curTree = updatedOrderItem;
                                    showNodeDetails(curNode);
                                }).fail(mesUtil.error);
                            }
                        }
                    }
                }
            }
        });
        if (curNode.lbcs >= 0) $('.popup-form')[0].lbcs.value = curNode.lbcs;
    }

    function getTmpl(name) {
        //console.log("选择器是 :"+'table.'+name);
        return $('table.' + name, $tmpls);
    }

    function getTmplName(node) {
        var tmplName = node.name;
        if (+tmplName.slice(-1) > 1) {
            tmplName = tmplName.substr(0, tmplName.length - 1) + "1";
        }
        if (tmplName === 'jsgx' || tmplName === 'jssx') {
            tmplName = 'jsx';
        }
        return tmplName;
    }

    //function loadFormInsts() {
    //    $.getJSON('../user/formInsts?form_id=' + form.id, function (data) {
    //        data.formInsts.forEach(function (d) {
    //            var values = d.data[d.body[0].id];
    //            var display = [];
    //            for (var i = 0; i < 8; i++) {
    //                display.push(values[i].value);
    //            }
    //            display.push(d.status);
    //            var t = dtTable.row.add(display).draw();
    //            $(t.node()).attr('id', d._id);
    //            treeData[d._id] = d;
    //        });
    //        form.perm = data.formPerm;
    //    }).fail(mesUtil.error);
    //}

    function clearTreeContainer() {
        $('.caption-helper').html('');
        $('.expand').addClass('hidden');
        $('.compress').addClass('hidden');
        $('#detail').addClass('hidden');
        $treeBody.empty();
        $treeHeader.addClass('hidden');
    }

    function setupEventHandlers() {
        // 提交按钮
        $('.submitBtn').on('click', function (e) {
            bootbox.confirm(
                {
                    message: '确认编辑完成, 提交表单吗?',
                    callback: function (result) {
                        if (result) {
                            $.ajax({
                                url: '../user/submitOrderItem',
                                method: 'POST'
                            }).done(function (data) {
                                dtTable.ajax.reload();
                                toastr.success('提交成功');
                            }).fail(mesUtil.error);
                        }
                    }
                }
            )
        });

        // 编辑明细记录按钮
        $('.edit-detail').on('click', function (e) {
            e.preventDefault();
            var $modalBody = $('.modal-body', $modalDetail);

            $modalBody.empty();
            $('.modal-title', $modalDetail).html($('.caption-detail').html());

            var tmplName = getTmplName(curNode);
            //如果是单股的分解，显示的股就和钢丝绳的信息一样的格式
            //其他的股还是正常显示
            if(curNode.is_single_strand||curNode.is_cps){
                tmplName="gss";
            }
            //console.log("tmplName="+tmplName);
            var $tmpl = $('#tmpls-edit form.' + tmplName);
            if ($tmpl.attr('tmpl-ref')) {
                $tmpl = $('#tmpls-edit form.' + $tmpl.attr('tmpl-ref'));
            }
            var $formTmpl = $tmpl.clone();
            var panels = $formTmpl.attr('panels').split(' ');
            //console.log(panels);
            panels.forEach(function (panel) {
                var $panel = $('#panels .panel.' + panel);
                var panelHtml = $panel[0].outerHTML;
                var total = 1, attr;
                if (repeatMap[panel]) total = curNode[repeatMap[panel]];
                var $clone = $panel.clone();
                for (var i = 1; i < total; i++) {
                    
                    var $repeat = $('.repeat', $clone).clone();
                    var stingHtml = $repeat[0];
                     
                    var $title = $('.detail-section-title', $repeat);
                    
                   var textContent = $title.text().replace(i, i + 1);
                    $title.text("收线方式"+(i+1)+":");
                    $('input', $repeat).each(function () {
                        attr = this.getAttribute('name');
                        this.setAttribute('name', attr.replace("1", i + 1));
                    });
                    $('.panel-body', $clone).append(stingHtml);
                    panelHtml = $clone[0].outerHTML;
                }
                localStorage.setItem("total",total);
                $formTmpl.append(panelHtml);
            });
            if (tmplName === 'pl' && curNode.lbcs > 1) {
                var $lbcs = $formTmpl.clone(), attr;
                $('h5', $lbcs).text($('h5', $lbcs).text().replace('1', curNode.lbcs));
                $('input', $lbcs).each(function () {
                    attr = this.getAttribute('name');
                    this.setAttribute('name', attr.replace('1', curNode.lbcs));
                });
                $formTmpl.append($lbcs[0].outerHTML);
            }

            // 赋值
            var values = curTree.data[curNode.id];
            $('input', $formTmpl).each(function (index) {
                var $this = $(this);
                var name = $this.attr('name');
                for (var i = 0; i < values.length; i++) {
                    if (values[i].name === name) {
                        $this.attr('value', values[i].value);
                        break;
                    }
                }
            });

            $modalBody.html($formTmpl.html());
            $modalDetail.modal();

            // 自动计算某些值
            var totalNum = localStorage.getItem("total");
            var $dc=[];var $ds=[];var $mc=[];var $zmc = [];
            var $js=[];var $zzl=[];var $zj=[];
            for(var m=0;m<totalNum;m++){
               var n = m+1;
                $dc.push($("input[name='yl.sxfs"+n+".dc']", $modalBody));
                $ds.push($("input[name='yl.sxfs"+n+".ds']", $modalBody));
                $mc.push($("input[name='yl.sxfs"+n+".djmc']", $modalBody));
                $zmc.push($("input[name='yl.sxfs"+n+".zmc']", $modalBody));
                $js.push($("input[name='yl.sxfs"+n+".js']", $modalBody));
                $zzl.push($("input[name='yl.sxfs"+n+".zzl']", $modalBody));
                $zj.push($("input[name='gg.zj']", $modalBody));

                (function(m){

                    $dc[m].on('input', function (e) {
                       
                        updateDjmc(m);
                    });

                    $ds[m].on('input', function (e) {
                         
                        updateDjmc(m);
                    });

                    $js[m].on('input', function (e) {
                        updateZmc(m);
                    });

                    $zj[m].on('input', function (e) {
                        updateZzl(m);
                    });
                })(m);
            }
 
            function updateDjmc(m) {
                
                $mc[m].val(+$dc[m].val() * +$ds[m].val());
                updateZmc(m);
            }

            function updateZmc(m) {
                
                $zmc[m].val(+$js[m].val() * +$mc[m].val());
                updateZzl(m);
            }

            function updateZzl(m) {
               
                var zj = +$zj[m].val();
                $zzl[m].val((zj * zj * 0.617 * $zmc[m].val() / 100).toFixed(2));
            }

            

            var $xwxZmc = $('input[name="yl.zmc"]', $modalBody),
                $xs = $('input[name="yl.gymcxs"]', $modalBody),
                $dh = $('input[name="yl.dh"]', $modalBody),
                $zl = $('input[name="yl.zl"]', $modalBody);

            $xs.on('input', function (e) {
                if(curTree.data[0]){      
                    var gss = curTree.data[0];
                    var value = +this.value;
                    gss.forEach(function (d) {
                        if (d.name === 'djmc' || d.name === 'js') {
                            value = value * d.value;
                        }
                    });
                    $xwxZmc.val(value);
                }
            });
            $dh.on('input', function (e) {
                var gss = curTree.data[0];
                var value = +this.value;
                //console.log(value);
                gss.forEach(function (d) {
                    if (d.name === 'ckzzl') {
                        value = value * d.value;
                    }
                });
                $zl.val((value / 100).toFixed(2));
            });
        });

        $('#detail-save').on('click', function (e) {
            e.preventDefault();
            var data = $('#modal-detail form').serialize();
            data += '&id=' + curTree._id + '&node_id=' + curNode.id;

            $.ajax({
                url: '../user/orderItem',
                method: 'PUT',
                data: data
            }).done(function (result) {
                var oldData = curTree.data[curNode.id];
                var changed = result.changed;
                for (var i = 0; i < changed.length; i++) {
                    // 更新本地的cache
                    for (var j = 0; j < oldData.length; j++) {
                        if (oldData[j].name === changed[i].name) {
                            oldData[j].value = changed[i].value;
                            break;
                        }
                    }
                }
                showNodeDetails(curNode);
                toastr.success("修改成功");
                $modalDetail.modal('hide');
            }).fail(mesUtil.error);
        });

        $('.sxfs-edit').on('click', function (e) {
            e.preventDefault();
            bootbox.prompt({
                title: '修改收线方式次数',
                value: curNode.sxfss,
                callback: function (result) {
                    if (result && !isNaN(result) && +result !== curNode.sxfss) {
                        curNode.sxfss = +result;
                        var path = [];
                        //console.log("curTree.body is:"+JSON.stringify(curTree.body));
                        //console.log("curNode.id is :" +curNode.id);
                        //console.log("path is:"+path);
                        getPathForId(curTree.body, curNode.id, path);
                        var data = {id: curTree._id, path: path.join('.'), sxfss: curNode.sxfss};
                        console.log(data);
                        $.ajax({
                            url: '../user/updateSXFSS',
                            method: 'PUT',
                            dataType: 'json',
                            data: data
                        }).done(function (res) {
                            toastr.success("修改成功");
                            // 更新本地缓存
                            var updatedOrderItem = res.orderItem;
                            treeData[updatedOrderItem._id] = updatedOrderItem;
                            curTree = updatedOrderItem;
                            //console.log("curNode is:"+JSON.stringify(curNode));
                            // 刷新明细
                            showNodeDetails(curNode);
                        }).fail(mesUtil.error);
                    }
                }
            })
        });

        $('.lbcs-edit').on('click', function (e) {
            e.preventDefault();
            askLBCS(curNode.id, curNode.lbcs);
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

    // 根据id, 得到到达id的路径
    function getPathForId(node, id, path) {
        if (node instanceof Array) {
            for (var i = 0; i < node.length; i++) {
                if (getPathForId(node[i], id, path)) return true;
            }
        } else {
            path.push(node.name);
            if (node.id === id) return true;
            if (node.children) {
                for (var i = 0; i < node.children.length; i++) {
                    if (getPathForId(node.children[i], id, path)) return true;
                }
            }
            path.pop();
        }
        return false;
    }
});