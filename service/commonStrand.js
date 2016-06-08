/*
	股:id=2,	中心丝:id=3,	第一层丝的丝1:id=6
	油脂:id=5	1次捻股的丝1:id=6		1次捻股的油脂:id=7
	2次捻股的丝1:id=8 	2次捻股的油脂:id=9	第二层丝的丝1:id=10
	第二层丝的丝2:id=11	第三层丝的丝1:id=12	第三层的丝2:id=13
	第四层丝的丝1:id=14	第3次捻股的丝1:id=15	第3次捻股的油脂:id=16
	纤维芯:id=17	第1次捻股的纤维芯:id=18

	第1次捻股:id=40	第2次捻股:id=41 第3次捻股:id=42
	第一层丝:20	第二层丝:id=21  第三层丝:id=22 第四层丝:id=23

	成品丝:id=25	胚料:id=26
*/

/*
	首先匹配股规格是否存在
*/
var q = require("q");
var _ = require("underscore");
var fs = require("fs");
var tree = require("../util/tree");

var yzId = 38;
var ids = 6;
var ngId = 40;
// var floorsId = ['20','21','22','23'];
// var s2Ids = ['100','11','13'];
var floorsId = 20;
var ngs = 50;
var content = {
    code: "80002",
    message: "规格不合理,请修改规格"
}

function matchStruct(strandStruct, db, user){
	var deferred = q.defer();
	 
	for(var i=0;i<strandStruct.length;i++){

		for(var j=0;j<strandStruct[i].children.length;j++){
			var gg = strandStruct[i].children[j].spec;

			db.collection("internal_forms").find({
				"name":"dgjgb",
				"single_strand_struct":gg
			}).toArray(function(err,docs){
				if(err){
					console.log(err);
					deferred.reject(err);
				}
				if(docs.length==0){
					deferred.resolve(content);
				}else{
					//规格符合后
					helperCreateOrder(docs).then(function(data){
						//help之后
						deferred.resolve(data);
					}).fail(function(err){
						deferred.reject(err);
					});
				}
			});
		}
 	}

	return deferred.promise;
}

var templete = {
	//股模板
	guo:{

		text:"股",
		type:"folder",
		name:"g1",
		is_single_strand:"true",
		children:[],
		nzcs:"",
		id:"2",
		sxfss:"1"
		
	},
	//捻股模板
	ng:{
		text:"第N次捻股",
		type:"folder",
		name:"", 	//ngN
		children:[],
		id:"",
		sxfss:"1"
	},
	//丝1模板
	s1:{
		text:"丝1",
		type:"folder",
		name:"s1",
		num:"",
		id:"",
		sxfss:"1"
	},
	//丝2模板
	s2:{
		text:"丝2",
		type:"folder",
		name:"s2",
		num:"",
		id:"",
		sxfss:"1"
	},

	//第N层丝
	nFloor:{
		text:"第N层丝",
		type:"folder",
		name:"",	//sdcN
		children:[],
		id:""
	},
	//中心丝模板
	zxs:{
		text:"中心丝",
		type:"folder",
		name:"zxs",
		id:"3",
		sxfss:"1",
		num:""
	},
	//油脂
	yz:{
		text:"油脂",
		type:"folder",
		name:"yz",
		id:""
	},
	//纤维芯
	xwx:{
		text:"纤维芯",
		type:"folder",
		name:"xwx",
		value:"",
		id:"",
		num:""
	}
}

/*
	1.根据捻制次数分类
	2.根据空间层次结构
	3.每层结构钢丝的种类
	4.是否有无中心丝
	5.有无纤维芯
*/


function helperCreateOrder(docs){
	var deferred = q.defer();
	var thisSpecData = docs[0];

	var strand_struct = thisSpecData.strand_struct;//获取股结构
	var twist_number = thisSpecData.twist_number;//捻制次数
	var space_struct_number = thisSpecData.space_struct_number;//获取空间层次结构
	var center_wire = thisSpecData.center_wire; //中心丝
	var steel_wire_first_floor = thisSpecData.steel_wire_first_floor;//第一层钢丝规格种类
	var steel_wire_second_floor = thisSpecData.steel_wire_second_floor;//第二层钢丝种类
	var steel_wire_third_floor = thisSpecData.steel_wire_third_floor;//第三层钢丝种类
	var steel_wire_fourth_floor = thisSpecData.steel_wire_fourth_floor;//第四层钢丝种类

	//var struct = templete.guo;//将要创建的模板

	if(twist_number==1){
		//这里就不需要templete中的ng模板,1次捻制

		if(center_wire!=""){
			//有中心丝但数量不定
			if(center_wire==0){
				//像1*9W这种，中心丝为0
				createChildrenDataByFloor(space_struct_number,strand_struct,0,0,twist_number).then(function(data){

				}).fail(function(err){	
					deferred.reject(err);
				});
			}else{
				//正常有中心丝的情况
				 					
				//正常的空间最多4层,这里不管多少层都可以
				createChildrenDataByFloor(space_struct_number,strand_struct,1,0,twist_number).then(function(data){
					 //console.log(data);
					 
				}).fail(function(err){
					deferred.reject(err);
				});
					 
			}
		}else{
			//这里有纤维芯
			createChildrenDataByFloor(space_struct_number,strand_struct,1,1,twist_number).then(function(data){
				fs.writeFile("test.json",JSON.stringify(data),function(err){
                    if(err){
                        console.log(err);
                        return;
                    }
                    console.log("writeFile success");
                });
			}).fail(function(err){
				deferred.reject(err);
			});
		}

	}else if(twist_number>1){
		//n次捻制大于1次捻制
		createStructByManyTwist(thisSpecData).then(function(data){

		}).fail(function(err){
			deferred.reject(err);
		});
	}

	return deferred.promise;
}

function createChildrenDataByFloor(space_struct_number, strand_struct, flag, isXWX, twist_number){
	var deferred = q.defer();
	var cloneTemplete = clone(templete);//获取templete对象
	var lastStruct = cloneTemplete.guo;
	var structArray = strand_struct.split("+"); 
	var xwx_zxs = structArray[0];
	structArray = _.rest(structArray);//每层钢丝根数数组

	lastStruct.nzcs = twist_number;
	if(isXWX==1){
		//含有纤维芯
		cloneTemplete.xwx.num = xwx_zxs;
		lastStruct.children.push(cloneTemplete.xwx);
	}else if(isXWX==0){
		if(flag==0){
		//中心丝为0
		}else if(flag==1){
			cloneTemplete.zxs.num = xwx_zxs;
			lastStruct.children.push(cloneTemplete.zxs);//增加中心丝	
		}
	}

	for(var i=0;i<space_struct_number;i++){
		var types = structArray[i].split("/");
		
		if(types.length == 1){
			//单一一层丝包裹
			var s1 = {text:"丝1",type:"folder",name:"s1",num:"",id:"",sxfss:"1"};
			s1.num = types[i];
			s1.id = Number(ids)+Number(i);
			var nFloor = {
				text:"第N层丝",type:"folder",name:"",children:[],id:""
			};
			nFloor.children.push(s1);
			var floor = i+1;
			nFloor.text = "第"+floor+"层丝";
			nFloor.name = "sdc"+floor;
			nFloor.id = Number(floorsId)+Number(i);
			lastStruct.children.push(nFloor);
			deferred.resolve(lastStruct);
		}else if(types.length>1){
			//2层或者以上层丝包裹
			var floor = i+1;
			var nFloor = {
				text:"第N层丝",type:"folder",name:"",children:[],id:""
			};
			
			for(var k=0;k<types.length;k++){
				var s1 = {text:"丝1",type:"folder",name:"s1",num:"",id:"",sxfss:"1"};
				
				s1.text="丝"+(k+1);
				s1.name = "s"+(k+1);
				s1.num = types[k];
				s1.id = Number(floorsId)+k;
				nFloor.children.push(s1);
				nFloor.text = "第"+floor+"层丝";
				nFloor.name = "sdc"+floor;
				nFloor.id = Number(floorsId)+Number(i);
				
			}
			lastStruct.children.push(nFloor);
		}
	}

	return deferred.promise;
}

//多次捻制
function createStructByManyTwist(thisSpecData){
	var deferred = q.defer();
	var strand_struct = thisSpecData.strand_struct;//获取股结构
	var twist_number = thisSpecData.twist_number;//捻制次数
	var lastStruct = {text:"股",type:"folder",name:"g1",is_single_strand:"true",children:[],nzcs:"",id:"2",sxfss:"1"};
	lastStruct.nzcs = twist_number;	//赋值捻制次数

	var structArray = strand_struct.split("+"); 
	var xwx_zxs = structArray[0];	//中心丝或纤维芯数
	structArray = _.rest(structArray);//每层钢丝根数数组
	// var initNgTmpl = {text:"第N次捻股",type:"folder",name:"", children:[],id:"",sxfss:"1"};
	// initNgTmpl.text = "第"+(twist_number-1)+"次捻股";
	// initNgTmpl.name = "ng"+(twist_number-1);
	// initNgTmpl.id = ngs;
	// lastStruct.initNgTmpl;
	var middleArray = [];
	for(var i=0;i<twist_number;i++){
		var ngTmpl = {text:"第N次捻股",type:"folder",name:"", children:[],id:"",sxfss:"1"};
		var index = twist_number-i-1;
		var types = structArray[index].split("/");
		if(index!=0){

			ngTmpl.text = "第"+index+"次捻股";
			ngTmpl.name = "ng"+index;
			ngTmpl.id = Number(ngId) + Number(i);

			var s1 = {text:"丝1",type:"folder",name:"s1",num:"",id:"",sxfss:"1"};
			var yz = {text:"油脂",type:"folder",name:"yz",id:""};

			yz.id = Number(yzId)+Number(index);
			
			if(types.length == 1){
				//单一的一层丝
				s1.num = types[0];
				s1.id = Number(ngs)+Number(index);
				var lastData = [];
				lastData.push(ngTmpl);
				lastData.push(s1);
				lastData.push(yz);
				
				middleArray.push(lastData);
			}else if(types.length>1){
				//一层有多次N次丝
				var floor = i+1;
				var lastData = []; 
				lastData.push(ngTmpl);
				for(var k=0;k<types.length;k++){
					var s1 = {text:"丝1",type:"folder",name:"s1",num:"",id:"",sxfss:"1"};		
					s1.text="丝"+(k+1);
					s1.name = "s"+(k+1);
					s1.num = types[k];
					s1.id = Number(floorsId)+k;
					 
					lastData.push(s1);
				}
								
				lastData.push(yz);
				middleArray.push(lastData);
			}
			
		}else{
			var ngTmpl;
			if(thisSpecData.fiber_core!=""){
				ngTmpl = {text:"纤维芯",type:"folder",name:"xwx",value:"",id:"17",num:""}
			}else{
				ngTmpl = {text:"中心丝",type:"folder",name:"zxs",id:"3",sxfss:"1",num:""};
			}
			ngTmpl.num = xwx_zxs;
			var s1 = {text:"丝1",type:"folder",name:"s1",num:"",id:"",sxfss:"1"};
			s1.id = 4;
			s1.num = types[index];
			var yz = {text:"油脂",type:"folder",name:"yz",id:""};
			yz.id = 5;

			var lastData = [];
			lastData.push(ngTmpl);
			lastData.push(s1);
			lastData.push(yz);
			
			middleArray.push(lastData);
		}
		for(var m=middleArray.length-1;m>=0;m--){
			if(m>0){
				middleArray[m-1][0].children = middleArray[m];
			}
		}
		
	}
	lastStruct.children = middleArray[0];
	 fs.writeFile("test.json",JSON.stringify(lastStruct),function(err){
        if(err){
            console.log(err);
            return;
        }
        console.log("writeFile success");
    });
	return deferred.promise;
}

//clone obj
function clone(obj){  
    var o;  
    switch(typeof obj){  
    case 'undefined': break;  
    case 'string'   : o = obj + '';break;  
    case 'number'   : o = obj - 0;break;  
    case 'boolean'  : o = obj;break;  
    case 'object'   :  
        if(obj === null){  
            o = null;  
        }else{  
            if(obj instanceof Array){  
                o = [];  
                for(var i = 0, len = obj.length; i < len; i++){  
                    o.push(clone(obj[i]));  
                }  
            }else{  
                o = {};  
                for(var k in obj){  
                    o[k] = clone(obj[k]);  
                }  
            }  
        }  
        break;  
    default:          
        o = obj;break;  
    }  
    return o;     
} 


module.exports = {
	matchStruct:matchStruct
}