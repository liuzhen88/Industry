//var q = require("q");
//var request = require("request");
//var config = require("config");
//
//// var appid = config.corpid;
//// var corpsecret = config.corpsecret;
//// var redirect = config.redirect;
//// var response_type = config.response_type;
//// var scope = config.scope;
//// var url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+appid+"&redirect_uri="+redirect+"&response_type="+response_type+"&scope="+scope+"#wechat_redirect";
//var access_token = "wwgQsPcg6uVm83ui7ko-6p0v3WO9Rg426qyfuTrZLcX_3f8EQDC79gHFWIrC2htf";
//var getUserId = config.getUserId;
//
//function getUserInfoByWeiXin(code){
//	var deferred = q.defer();
//	var context = {};
//	var url = getUserId + "?access_token="+access_token+"&code="+code;
//	if(code==""){
//		context.dataCode = "80002";
//		context.message = "缺少code参数";
//		deferred.reject(context);
//		return;
//	}
//	request({url:url} , function(error , response ,body){
//		if(error){
//			console.log(error);
//			context.dataCode = "80001";
//			context.message = "请求微信接口错误";
//			deferred.reject(context);
//			return;
//		}
//		context.dataCode = "200";
//		context.message = "成功";
//		context.data = response;
//		deferred.resolve(context);
//	});
//	return deferred.promise;
//
//}
//
//exports = {
//	getUserInfoByWeiXin:getUserInfoByWeiXin
//}
