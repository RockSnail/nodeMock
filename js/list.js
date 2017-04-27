'use strict';
var vm;
var app = new Vue ({
		el: '#app',
		data: {
			listData:[]
		},
		mounted: function() {
			vm = this;
			init();
		},
		methods: {
			mockAdd:mockAdd,
			mockDel:mockDel,
			editMock:editMock,
			mockTest:mockTest
		},
		components: {
		}
	});
	

function init() {
	//获取列表数据
	$.ajax({
		type: "post",
		url: "/mockList",
		dataType: "json",
		contentType: "application/json",
		success: function(data) {
			if(data.code == 100) {
				vm.listData =  data.data;
			} else {
				alert(data.msg);
			}
		},
		error: function() {
			alert("网络错误");
		}
	});
}

//跳转新增页面
function mockAdd(){
	window.location.href = "add.html";
}

//删除mock
function mockDel(item){
	$.ajax({
		type:"post",
		url:"/delMock",
		data:{"mockId":item._id},
		//data:JSON.stringify({"mockUrl":_mockUrl,"mockText":_mockText}),
		dataType:"json",
		//contentType: "application/json",
		success:function(data){
			if(data.code == 100){
				alert(data.msg);
				init();
			}
			else{
				alert(data.msg);
			}
		},
		error:function(){
			alert("网络错误");
		}
	});
}

//修改mock
function editMock(item){
	var id = item._id;
	window.location.href = "add.html?mockId="+id;
}

//跳转到测试页面
function mockTest(){
	window.location.href = "mockTest.html";
}
