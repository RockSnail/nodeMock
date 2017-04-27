'use strict';
var vm;
var app = new Vue({
	el: '#app',
	data: {
		id: "",
		url: "http://192.168.0.1",
		text: '{"a":1,"b":2}',
		type: 0 //操作类型  0 新增 1修改
	},
	mounted: function() {
		vm = this;
		init();

	},
	methods: {
		mockSave: mockSave,
	},
	components: {}
});

function init() {
	var param = getParamFromURL();
	var mockId = param['mockId'];
	if(mockId) {
		vm.type = 1;
		vm.id = mockId;
		initData();
	}
}

//获取详情数据
function initData() {
	$.ajax({
		type: "post",
		url: "/getMock",
		data: {
			mockId: vm.id
		},
		dataType: "json",
		success: function(data) {
			if(data.code == 100) {
				vm.url = data.data.url;
				vm.text = data.data.text;
			} else {
				alert(data.msg);
			}
		},
		error: function() {
			alert("网络错误");
		}
	});
}

//新增修改mock
function mockSave() {

	if(trim(vm.url) == '') {
		alert('请输入mock数据的请求地址');
		return false;
	}
	if(trim(vm.text) == '') {
		alert('请输入mock的返回内容');
		return false;
	}

	var textObj;
	try {
		textObj = JSON.parse(vm.text);
	} catch(e) {
		alert('请输入正确的json数据');
		return false;
	}

	var _url;
	var _data = {};
	_data.mockUrl = vm.url;
	_data.mockText = textObj;
	
	if(vm.type == 0){ //新增
		_url = "/addMock";
	}
	else{
		_url = "/updateMock";
		_data.mockId = vm.id;
	}
	
	$.ajax({
		type: "post",
		url: _url,
		//data:{"mockUrl":_mockUrl,"mockText":_mockText},
		data: JSON.stringify(_data),
		dataType: "json",
		contentType: "application/json",
		success: function(data) {
			if(data.code == 100) {
				alert(data.msg);
				//alert('新增成功!');
				window.location.href = "list.html";
			} else {
				alert(data.msg);
			}
		},
		error: function() {
			alert("网络错误");
		}
	});
}

//删除左右两端的空格
function trim(str) {
	return (str+'').replace(/(^\s*)|(\s*$)/g, "");
}

function getParamFromURL() {
	var _url = window.location.href;
	var paramArr = _url.substring(_url.lastIndexOf('?') + 1, _url.length).split('&');
	var oJson = {};
	for(var i = 0; i < paramArr.length; i++) {
		var name = paramArr[i].split('=')[0];
		var laue = paramArr[i].split('=')[1];
		oJson[name] = laue;
	}
	return oJson;
}