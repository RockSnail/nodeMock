'use strict';
var vm;
var app = new Vue({
	el: '#app',
	data: {
		url: "http://59.110.153.248:1024",
		text: ''
	},
	mounted: function() {
		vm = this;
	},
	methods: {
		initData: initData,
		backList:backList
	},
	components: {}
});


//获取详情数据
function initData() {
	$.ajax({
		type: "post",
		url:  trim(vm.url),
		data: {
		},
		dataType: "json",
		success: function(data) {
			if(data.status == 0) {
				vm.text = data.data;
			} else {
				alert(data.msg);
			}
		},
		error: function() {
			alert("网络错误");
		}
	});
}

//返回列表
function backList(){
	window.location.href = "list.html";
}


//删除左右两端的空格
function trim(str) {
	return (str+'').replace(/(^\s*)|(\s*$)/g, "");
}
