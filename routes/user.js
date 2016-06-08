var express = require('express');
var router = express.Router();
var enums = require('../util/enums');
var service = require('../service/user');
var wx = require("../service/weixin");
var orderService = require('../service/orderService');
var instanceService = require('../service/instanceService');
var bomService = require('../service/bomService');

router.get('/home', function (req, res, next) {
    service.form(req, res, next);
});

router.get('/form', function (req, res, next) {
    if (!req.query.id) {
        return res.status(400).json({message: "缺少表单ID."});
    }
    service.getFormById(req, res, next);
});

router.post('/formInst', function (req, res, next) {
    if (!req.body.form) {
        return res.status(400).json({message: "缺少表单数据."});
    }
    service.createFormInst(req, res, next);
});

router.post('/createForm', function (req, res, next) {
    if (!req.body.form) {
        return res.status(400).json({message: "缺少表单数据."});
    }
    service.createForm(req, res, next);
});

router.post('/createForms', function (req, res, next) {
    if (!req.body.forms) {
        return res.status(400).json({message: "缺少表单数据."});
    }
    service.createForms(req, res, next);
});


// 通过模板id获取实例
router.get('/formInsts', function (req, res, next) {
    if (!req.query.form_id) {
        return res.status(400).json({message: "缺少表单ID."});
    }
    service.listFormInsts(req, res, next);
});

// 通过实例ids获取实例
router.get('/formInstsByIds', function (req, res, next) {
    if (!req.query.ids) {
        return res.status(400).json({message: "缺少表单IDS."});
    }
    service.listFormInstsByIds(req, res, next);
});

// 通过实例ids获取实例
router.get('/formInstById', function (req, res, next) {
    if (!req.query.id) {
        return res.status(400).json({message: "缺少表单IDS."});
    }
    service.getFormInstById(req, res, next);
});

router.delete('/formInst', function (req, res, next) {
    if (!req.body.id) {
        return res.status(400).json({message: "缺少表单ID."});
    }
    service.deleteFormInst(req, res, next);
});

// get users by role
router.get('/users', function (req, res, next) {
    if (!req.query.role) {
        return res.status(400).json({message: "缺少用户角色."});
    }
    service.getUsersByRole(req, res, next);
});

// get assigned forms by user id
router.get('/assignedForms', function (req, res, next) {
    service.getAssignedForms(req, res, next);
});

// 更新某个表单实例字段. 只是更新一个表单实例, 所有的更新都来自一个实例
router.put('/formInst', function (req, res, next) {
    if (!req.body.updates) {
        return res.status(400).json({message: "缺少表单数据."});
    }
    if (!req.body.id) {
        return res.status(400).json({message: "缺少表单ID."});
    }
    service.updateFormInst(req, res, next);
});

// 更新合绳次数
router.put('/updateHSCS', function (req, res, next) {
    if (!req.body.id) {
        return res.status(400).json({message: "缺少表单ID."});
    }
    if (!req.body.hscs) {
        return res.status(400).json({message: "缺少合绳次数."});
    }
    service.updateHSCS(req, res, next);
});

// 更新收线方式数
router.put('/updateSXFSS', function (req, res, next) {
    if (!req.body.id) {
        return res.status(400).json({message: "缺少表单ID."});
    }
    if (!req.body.path || !req.body.sxfss) {
        return res.status(400).json({message: "缺少更新数据."});
    }
    service.updateSXFSS(req, res, next);
});

// 更新拉拔次数
router.put('/updateLBCS', function (req, res, next) {
    if (!req.body.id) {
        return res.status(400).json({message: "缺少表单ID."});
    }
    if (!req.body.path || !req.body.lbcs) {
        return res.status(400).json({message: "缺少更新数据."});
    }
    service.updateLBCS(req, res, next);
});

router.put('/orderPlanInst', function (req, res, next) {
    if (!req.body.updates) {
        return res.status(400).json({message: "缺少表单数据."});
    }
    service.updateOrderPlanInst(req, res, next);
});

// 更新订单分解数据
router.put('/orderItem', function (req, res, next) {
    if (!req.body.id) {
        return res.status(400).json({message: "缺少表单ID."});
    }
    if (!req.body.node_id) {
        return res.status(400).json({message: "缺少表单节点ID."});
    }
    service.updateOrderItem(req, res, next);
});

router.post('/submitOrderItem', function (req, res, next) {
    service.submitOrderItem(req, res, next);
});

router.post('/formStatus', function (req, res, next) {
    if (!req.body.id) {
        return res.status(400).json({message: "缺少表单ID."});
    }
    if (!req.body.status) {
        return res.status(400).json({message: "缺少表单状态."});
    }
    service.updateFormStatus(req, res, next);
});

//列出生产订单
router.get('/listPrdOrd', function (req, res, next) {
    orderService.listPrdOrd(req, res, next);
});
//创建生产订单
router.post('/createPrdOrd', function (req, res, next) {
    orderService.createPrdOrd(req, res, next);
});
//修改生产订单
router.post('/updatePrdOrd', function (req, res, next) {
    orderService.updatePrdOrd(req, res, next);
});
//删除生产订单
router.delete('/deletePrdOrd', function (req, res, next) {
    orderService.deletePrdOrd(req, res, next);
});
//查询单个生产订单
router.post('/getPrdOrd', function (req, res, next) {
    orderService.getPrdOrd(req, res, next);
});

//查询单个生产订单明细数据
router.get('/listPrdOrdDetail', function (req, res, next) {
    orderService.listPrdOrdDetail(req, res, next);
});
//创建生产订单明细数据
router.post('/createPrdOrdDetail', function (req, res, next) {
    orderService.createPrdOrdDetail(req, res, next);
});
//修改生产订单明细数据
router.post('/updatePrdOrdDetail', function (req, res, next) {
    orderService.updatePrdOrdDetail(req, res, next);
});
//删除生产订单明细数据
router.delete('/deletePrdOrdDetail', function (req, res, next) {
    orderService.deletePrdOrdDetail(req, res, next);
});
//查询单个生产订单明细数据
router.post('/getPrdOrdDetail', function (req, res, next) {
    orderService.getPrdOrdDetail(req, res, next);
});

// 撤销订单明细
router.post('/revokePrdOrdDetail', function (req, res, next) {
    if (!req.body.cpbh) {
        return res.status(400).json({message: "缺少产品编号."});
    }
    orderService.revokePrdOrdDetail(req, res, next);
});

//提交至分解表
router.post('/submitPrdOrd', function (req, res, next) {
    orderService.submitPrdOrd(req, res, next);
});

//根据模板id获取对应实例的数据集合
router.post('/getInstancesByTemplateId', function (req, res, next) {
    instanceService.getByTemplateId(req, res, next);
});

//根据表单实例id获取表单单个实例
router.post('/getInstanceById', function (req, res, next) {
    instanceService.getById(req, res, next);
});

//选择的BOM表单的结构体
router.post('/getBomStructure', function (req, res, next) {
    bomService.getBomStructure(req, res, next);
});

//列出主料
router.post('/listZlBoms', function (req, res, next) {
    bomService.listZlBoms(req, res, next);
});

//列出辅料
router.post('/listFlBoms', function (req, res, next) {
    bomService.listFlBoms(req, res, next);
});

router.post('/listGantt', function (req, res, next) {
    service.listGantt(req, res, next);
});

// ============================== 订单分解 ==============================
//获取订单分解表
router.get('/getOrderItems', function (req, res, next) {
    service.getOrderItems(req, res, next);
});

router.get('/getOrderPlans', function (req, res, next) {
    service.getOrderPlans(req, res, next);
});

router.post('/saveOrderPlan', function (req, res, next) {
    if (!req.body.form) {
        return res.status(400).json({message: "缺少表单数据."});
    }
    service.saveOrderPlan(req, res, next);
});

router.get('/getHsProductionPlanModule', function (req, res, next) {
    service.getHsProductionPlanModule(req, res, next);
});

router.get('/getNgProductionPlanModule', function (req, res, next) {
    service.getNgProductionPlanModule(req, res, next);
});

router.get('/getHsProductionPlans', function (req, res, next) {
    service.getHsProductionPlans(req, res, next);
});

router.get('/getNgProductionPlans', function (req, res, next) {
    service.getNgProductionPlans(req, res, next);
});

router.post('/createProductionPlan', function (req, res, next) {
    if (!req.body.form) {
        return res.status(400).json({message: "缺少表单数据."});
    }
    service.createProductionPlan(req, res, next);
});
router.get('/getProductionPlan', function (req, res, next) {
    if (!req.query.ids) {
        return res.status(400).json({message: "缺少表单IDS."});
    }
    service.getProductionPlan(req, res, next);
});
router.post('/submitProductionPlan', function (req, res, next) {
    if (!req.body.ids) {
        return res.status(400).json({message: "缺少表单IDS."});
    }
    service.submitProductionPlan(req, res, next);
});
router.post('/backProductionPlan', function (req, res, next) {
    if (!req.body.ids) {
        return res.status(400).json({message: "缺少表单IDS."});
    }
    service.backProductionPlan(req, res, next);
});
router.post('/saveProductionPlan', function (req, res, next) {
    if (!req.body.form) {
        return res.status(400).json({message: "缺少表单数据."});
    }
    service.saveProductionPlan(req, res, next);
});
router.post('/updateMergedProductionPlan', function (req, res, next) {
    if (!req.body.ids) {
        return res.status(400).json({message: "缺少表单数据."});
    }
    service.updateMergedProductionPlan(req, res, next);
});

router.get('/getHsWorkPlanModule', function (req, res, next) {
    service.getHsWorkPlanModule(req, res, next);
});

router.get('/getNgWorkPlanModule', function (req, res, next) {
    service.getNgWorkPlanModule(req, res, next);
});

router.get('/getHsWorkPlans', function (req, res, next) {
    service.getHsWorkPlans(req, res, next);
});

router.get('/getNgWorkPlans', function (req, res, next) {
    service.getNgWorkPlans(req, res, next);
});

router.post('/suspendHsWorkPlans', function (req, res, next) {
    if (!req.body.ids) {
        return res.status(400).json({message: "缺少表单IDS."});
    }
    service.suspendHsWorkPlans(req, res, next);
});

router.post('/suspendNgWorkPlans', function (req, res, next) {
    if (!req.body.ids) {
        return res.status(400).json({message: "缺少表单IDS."});
    }
    service.suspendNgWorkPlans(req, res, next);
});

router.post('/deleteHsWorkPlan', function (req, res, next) {
    if (!req.body.id) {
        return res.status(400).json({message: "缺少表单ID."});
    }
    service.deleteHsWorkPlan(req, res, next);
});

router.post('/reArrangeSuspendedHsWorkPlan', function (req, res, next) {
    if (!req.body.id) {
        return res.status(400).json({message: "缺少表单ID."});
    }
    service.reArrangeSuspendedHsWorkPlan(req, res, next);
});

router.post('/reArrangeSuspendedNgWorkPlan', function (req, res, next) {
    if (!req.body.id) {
        return res.status(400).json({message: "缺少表单ID."});
    }
    service.reArrangeSuspendedNgWorkPlan(req, res, next);
});

router.post('/deleteNgWorkPlan', function (req, res, next) {
    if (!req.body.id) {
        return res.status(400).json({message: "缺少表单ID."});
    }
    service.deleteNgWorkPlan(req, res, next);
});

router.post('/saveWorkPlan', function (req, res, next) {
    if (!req.body.form) {
        return res.status(400).json({message: "缺少表单数据."});
    }
    service.saveWorkPlan(req, res, next);
});
router.post('/createWorkPlan', function (req, res, next) {
    if (!req.body.forms) {
        return res.status(400).json({message: "缺少表单数据."});
    }
    service.createWorkPlan(req, res, next);
});
router.post('/submitWorkPlan', function (req, res, next) {
    service.submitWorkPlan(req, res, next);
});

router.post('/getWorkOrders', function (req, res, next) {
    service.getWorkOrders(req, res, next);
});

router.post('/getWorkOrder', function (req, res, next) {
    if (!req.body.id) {
        return res.status(400).json({message: "缺少工单ID."});
    }
    service.getWorkOrder(req, res, next);
});

router.post('/startAdjust', function (req, res, next) {
    if (!req.body.id) {
        return res.status(400).json({message: "缺少工单ID."});
    }
    service.startAdjust(req, res, next);
});

router.post('/pauseAdjust', function (req, res, next) {
    if (!req.body.id) {
        return res.status(400).json({message: "缺少工单ID."});
    }
    service.pauseAdjust(req, res, next);
});

router.post('/pauseAdjust', function (req, res, next) {
    if (!req.body.id) {
        return res.status(400).json({message: "缺少工单ID."});
    }
    service.pauseAdjust(req, res, next);
});

router.post('/continueAdjust', function (req, res, next) {
    if (!req.body.id) {
        return res.status(400).json({message: "缺少工单ID."});
    }
    service.continueAdjust(req, res, next);
});

router.post('/completeAdjust', function (req, res, next) {
    if (!req.body.id) {
        return res.status(400).json({message: "缺少工单ID."});
    }
    service.completeAdjust(req, res, next);
});

router.post('/startProduce', function (req, res, next) {
    if (!req.body.id) {
        return res.status(400).json({message: "缺少工单ID."});
    }
    service.stratProduce(req, res, next);
});

router.post('/pauseProduce', function (req, res, next) {
    if (!req.body.id) {
        return res.status(400).json({message: "缺少工单ID."});
    }
    if (!req.body.reason) {
        return res.status(400).json({message: "缺少停机原因."});
    }
    if (req.body.changeOperator == "true") {
        if (req.body.wsxmc == undefined) {
            return res.status(400).json({message: "缺少未收线米长."});
        }
    }
    service.pauseProduce(req, res, next);
});

router.post('/continueProduce', function (req, res, next) {
    if (!req.body.id) {
        return res.status(400).json({message: "缺少工单ID."});
    }
    service.continueProduce(req, res, next);
});

router.post('/completeProduce', function (req, res, next) {
    if (!req.body.id) {
        return res.status(400).json({message: "缺少工单ID."});
    }
    service.completeProduce(req, res, next);
});

router.post('/confirmComplete', function (req, res, next) {
    if (!req.body.id) {
        return res.status(400).json({message: "缺少工单ID."});
    }
    service.confirmComplete(req, res, next);
});

router.post('/assignWorkOrder', function (req, res, next) {
    if (!req.body.id) {
        return res.status(400).json({message: "缺少工单ID."});
    }
    if (!req.body.username) {
        return res.status(400).json({message: "缺少操作工姓名."});
    }
    if (!req.body.userid) {
        return res.status(400).json({message: "缺少操作工ID."});
    }
    service.assignWorkOrder(req, res, next);
});

router.post('/suspendWorkOrder', function (req, res, next) {
    if (!req.body.id) {
        return res.status(400).json({message: "缺少工单ID."});
    }
    service.suspendWorkOrder(req, res, next);
});

router.post('/changeTeamLeader', function (req, res, next) {
    if (!req.body.username) {
        return res.status(400).json({message: "缺少班长用户名."});
    }
    if (!req.body.userid) {
        return res.status(400).json({message: "缺少班长ID."});
    }
    service.changeTeamLeader(req, res, next);
});

router.post('/scannSpool', function (req, res, next) {
    if (!req.body.id) {
        return res.status(400).json({message: "缺少工单ID."});
    }
    if (!req.body.gzlbh) {
        return res.status(400).json({message: "缺少工字轮编号."});
    }
    service.scannSpool(req, res, next);
});

router.post('/onlineSpool', function (req, res, next) {
    if (!req.body.gzlbh) {
        return res.status(400).json({message: "缺少工字轮编号."});
    }
    if (!req.body.id) {
        return res.status(400).json({message: "缺少工单ID."});
    }
    service.onlineSpool(req, res, next);
});

router.post('/getSpool', function (req, res, next) {
    if (!req.body.id) {
        return res.status(400).json({message: "缺少工字轮ID."});
    }
    service.getSpool(req, res, next);
});

router.post('/getPresentOnlineSpools', function (req, res, next) {
    if (!req.body.id) {
        return res.status(400).json({message: "缺少工单ID."});
    }
    service.getPresentOnlineSpools(req, res, next);
});

router.post('/getHistoryOnlineSpools', function (req, res, next) {
    if (!req.body.id) {
        return res.status(400).json({message: "缺少工单ID."});
    }
    service.getHistoryOnlineSpools(req, res, next);
});

router.post('/deletePresentOnlineSpool', function (req, res, next) {
    if (!req.body.gzlbh) {
        return res.status(400).json({message: "缺少工字轮编号."});
    }
    if (!req.body.id) {
        return res.status(400).json({message: "缺少工单ID."});
    }
    service.deletePresentOnlineSpool(req, res, next);
});

router.post('/getHistoryOfflineSpools', function (req, res, next) {
    if (!req.body.id) {
        return res.status(400).json({message: "缺少工单ID."});
    }
    service.getHistoryOfflineSpools(req, res, next);
});

router.post('/offlineSpool', function (req, res, next) {
    if (!req.body.id) {
        return res.status(400).json({message: "缺少工单ID."});
    }
    if (!req.body.gzlbh) {
        return res.status(400).json({message: "缺少工字轮编号."});
    }
    if (!req.body.sxfs) {
        return res.status(400).json({message: "缺少收线方式."});
    }
    if (!req.body.djmc) {
        return res.status(400).json({message: "缺少单件米长."});
    }
    service.offlineSpool(req, res, next);
});

router.post('/checkProduct', function (req, res, next) {
    if (!req.body.gzlbh) {
        return res.status(400).json({message: "缺少工字轮编号."});
    }
    service.checkProduct(req, res, next);
});

router.post('/getProduct', function (req, res, next) {
    if (!req.body.id) {
        return res.status(400).json({message: "缺少产品id."});
    }
    service.getProduct(req, res, next);
});

router.post('/qualifyProduct', function (req, res, next) {
    if (!req.body.id) {
        return res.status(400).json({message: "缺少产品ID."});
    }
    service.qualifyProduct(req, res, next);
});

router.post('/unqualifyProduct', function (req, res, next) {
    if (!req.body.id) {
        return res.status(400).json({message: "缺少产品ID."});
    }
    if (!req.body.reason) {
        return res.status(400).json({message: "缺少不合格原因."});
    }
    service.unqualifyProduct(req, res, next);
});

router.post('/getUncheckedProducts', function (req, res, next) {
    service.getUncheckedProducts(req, res, next);
});

router.post('/getCheckedProducts', function (req, res, next) {
    service.getCheckedProducts(req, res, next);
});

router.get('/getGVirtualLibrarys', function (req, res, next) {
    service.getGVirtualLibrarys(req, res, next);
});

router.post('/getGVirtualLibrary', function (req, res, next) {
    if (!req.body.id) {
        return res.status(400).json({message: "缺少表单ID."});
    }
    service.getGVirtualLibrary(req, res, next);
});

router.post('/createGVirtualLibrary', function (req, res, next) {
    if (!req.body) {
        return res.status(400).json({message: "缺少表单数据."});
    }
    service.createGVirtualLibrary(req, res, next);
});

router.delete('/deleteGVirtualLibrary', function (req, res, next) {
    if (!req.body.id) {
        return res.status(400).json({message: "缺少表单ID."});
    }
    service.deleteGVirtualLibrary(req, res, next);
});

router.post('/updateGVirtualLibrary', function (req, res, next) {
    if (!req.body.id) {
        return res.status(400).json({message: "缺少表单ID."});
    }
    if (!req.body) {
        return res.status(400).json({message: "缺少表单数据."});
    }
    service.updateGVirtualLibrary(req, res, next);
});

router.get('/getSVirtualLibrarys', function (req, res, next) {
    service.getSVirtualLibrarys(req, res, next);
});

router.post('/getSVirtualLibrary', function (req, res, next) {
    if (!req.body.id) {
        return res.status(400).json({message: "缺少表单ID."});
    }
    service.getSVirtualLibrary(req, res, next);
});

router.post('/createSVirtualLibrary', function (req, res, next) {
    if (!req.body) {
        return res.status(400).json({message: "缺少表单数据."});
    }
    service.createSVirtualLibrary(req, res, next);
});

router.delete('/deleteSVirtualLibrary', function (req, res, next) {
    if (!req.body.id) {
        return res.status(400).json({message: "缺少表单ID."});
    }
    service.deleteSVirtualLibrary(req, res, next);
});

router.post('/updateSVirtualLibrary', function (req, res, next) {
    if (!req.body.id) {
        return res.status(400).json({message: "缺少表单ID."});
    }
    if (!req.body) {
        return res.status(400).json({message: "缺少表单数据."});
    }
    service.updateSVirtualLibrary(req, res, next);
});

router.get('/getGantt', function (req, res, next) {
    service.getGantt(req, res, next);
});

router.get('/getOrders', function (req, res, next) {
    service.getOrders(req, res, next);
});

// ============================== 物料领用 ==============================

// 获取捻股工段领料计划单列表
router.get('/getGMaterialReceives', function (req, res, next) {
    service.getGMaterialReceives(req, res, next);
});

// 通过id获取捻股工段领料计划单
router.post('/getGMaterialReceive', function (req, res, next) {
    if (!req.body.id) {
        return res.status(400).json({message: "缺少表单ID."});
    }
    service.getGMaterialReceive(req, res, next);
});

// 创建捻股工段领料计划单
router.post('/createGMaterialReceive', function (req, res, next) {
    if (!req.body) {
        return res.status(400).json({message: "缺少表单数据."});
    }
    if (!req.body.wl) {
        return res.status(400).json({message: "缺少物料类型."});
    }
    service.createGMaterialReceive(req, res, next);
});

// 删除捻股工段领料计划单
router.delete('/deleteGMaterialReceive', function (req, res, next) {
    if (!req.body.id) {
        return res.status(400).json({message: "缺少表单ID."});
    }
    service.deleteGMaterialReceive(req, res, next);
});

// 更新捻股工段领料计划单
router.post('/updateGMaterialReceive', function (req, res, next) {
    if (!req.body.id) {
        return res.status(400).json({message: "缺少表单ID."});
    }
    if (!req.body) {
        return res.status(400).json({message: "缺少表单数据."});
    }
    service.updateGMaterialReceive(req, res, next);
});

router.post('/getWorkLoad', function (req, res, next) {
    service.getWorkLoad(req, res, next);
});

router.get('/getMachineWorkorders', function (req, res, next) {
    if (!req.query.status) {
        return res.status(400).json({message: "缺少工单状态."});
    }
    service.getMachineWorkorders(req, res, next);
});


//微信sdk接入测试接口
router.get("/weixin", function (req, res) {
    var code = req.query.code ? req.query.code : "";
    wx.getUserInfoByWeiXin(code).then(function (data) {
        res.send(data);
    }).fail(function (err) {
        console.log(err);
        res.send("something is error");
    });
});


module.exports = router;