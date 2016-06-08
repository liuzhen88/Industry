/**
 * Created by ���� on 2015/10/20.
 */

$(function () {
    var dataGlobal = null;
    $("#gd").select2({
        ajax:{
            url: "../admin/internalForm/list?subForm=gdzzhysb",
            dataType:'JSON',
            data: function (term, pageNo) {     //在查询时向服务器端传输的数据
                term = $.trim(term);
                return {
                    search: term,    //联动查询的字符
                    pageSize: 10,    //一次性加载的数据条数
                    pageNo:pageNo,    //页码
                }
            },
            results: function (dataObj,pageNo) {
                if(dataObj){   //如果没有查询到数据，将会返回空串
                    var data = dataObj.data;
                    var total = dataObj.total;
                    for(var i in data){
                        data[i].text = data[i].section_make_no;
                        data[i].id = data[i]._id;
                    }
                    dataGlobal = data ;
                    var more = (pageNo*10)<total; //用来判断是否还有更多数据可以加载
                    //

                    return {
                        results:data,more:more
                    };
                }else{
                    return {results:""};
                }
            }
        },
        width:"400px",
        placeholder: "请输入工段制造号",
        allowClear: true,
        multiple:false
    });

    $('#gd').on("change", function () {
        $('#makeNo').html('');
        for(var i in dataGlobal){
            if(this.value == dataGlobal[i].id){
                for(var j in dataGlobal[i].mappings){
                    $('#makeNo').append("<option>"+dataGlobal[i].mappings[j]+"</option>")
                }
            }
        }
    })

})