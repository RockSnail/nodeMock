var express = require('express');
var app = express();
var bodyParser = require('body-parser');
/*var mongodb = require('mongodb');
var server = new mongodb.Server('50.110.153.248', 27017, {
	auto_reconnect: true
});
var db = new mongodb.Db('admin', server, {});

var MongoClient = mongodb.MongoClient;
var DB_CONN_STR = 'mongodb://50.110.153.248:27017';*/

var mongoose = require('mongoose');
var mockDao = require('./dao/mockDao.js');

app.use(express.static("./"));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
	extended: true
})); // for parsing application/x-www-form-urlencoded

/*app.get('/addMock', function(req, res) {
	var _path = req.path;　　
	console.log(_path);
	res.send(_path);
});*/

/*var selectData = function(db, callback) {
	//连接到表  
	var collection = db.collection('t_mock');
	//查询数据
	var whereStr = {
	};
	collection.find(whereStr, function(error, cursor) {
		cursor.each(function(error, doc) {
			if(doc) {
				console.log(doc);
			}
		});

	});

}*/

//查询列表
app.post('/mockList', function(req, res) {

	var mockList = mockDao.find(function(err, result) {
		console.log('查询完成。');
		if(err) {
			res.send(err);
		} else {
			//res.json(result);
			res.json({
				code: 100,
				data: result
			});
		}
	});

});

//新增mock
app.post('/addMock', function(req, res) {
	console.log(req.body);
	var _url = req.body.mockUrl;
	var _text = req.body.mockText;
	console.log(_text);

	mockDao.findOne({
		'url': _url
	}, function(findErr, mockData) {
		if(findErr) {
			res.send({
				code: -100,
				data: {},
				msg: "查询失败！"
			});
			console.log(findErr);
		} else {
			if(mockData) {
				res.send({
					code: -100,
					data: {},
					msg: "已有该url地址的mock数据，请修改url！"
				});
			} else {
				//存储mongodb
				var mock = new mockDao({
					url: _url,
					text: JSON.stringify(_text)
				});

				mock.save(function(err, saveRes) {
					if(err) {
						//console.log("Error:" + err);
						res.send({
							code: -100,
							data: {},
							msg: "新增失败！"
						});
						console.log('新增失败');
						console.log(err);
					} else {
						//console.log("Res:" + res);
						res.send({
							code: 100,
							data: {},
							msg: "新增成功！"
						});
					}

				});

			}
		}
	});

});

//获取mock详情
app.post('/getMock', function(req, res) {
	var id = req.body.mockId;
	mockDao.findOne({
		'_id': id
	}, function(err, mock) {
		if(err) {
			res.send({
				code: -100,
				data: {},
				msg: "查询失败！"
			});
			console.log(err);
		} else {
			res.send({
				code: 100,
				data: mock,
				msg: "查询成功！"
			});
		}
	});
});

//更新mock
app.post('/updateMock', function(req, res) {
	var _id = req.body.mockId;
	var _url = req.body.mockUrl;
	var _text = req.body.mockText;
	_text = JSON.stringify(_text);
	mockDao.update({
		_id: _id
	}, {
		$set: {
			url: _url,
			text: _text
		}
	}, function(error) {
		if(error) {
			res.send({
				code: -100,
				data: {},
				msg: "修改失败！"
			});
			console.log('修改失败');
			console.log(error);
		} else {
			res.send({
				code: 100,
				data: {},
				msg: "修改成功！"
			});
		}

	});

});

//删除mock
app.post('/delMock', function(req, res) {
	var _id = req.body.mockId;
	var conditions = {
		_id: _id
	};
	mockDao.remove(conditions, function(error) {
		if(error) {
			res.send({
				code: -100,
				data: {},
				msg: "删除失败！"
			});
			console.log('删除失败');
			console.log(error);
		} else {
			res.send({
				code: 100,
				data: {},
				msg: "删除成功！"
			});
		}
	});
});

/**
 * 监听用户访问 返回对应的mock信息
 */
app.post('*', function(req, res) {
	
	var _url = req.path;
	console.log(_url);
	mockDao.findOne({
		'url': _url
	}, function(err, mock) {
		if(err) {
			res.send({
				status: -100,
				data: {},
				msg: "查询失败！"
			});
			console.log(err);
		} else {
				if(mock){
					res.send({
					status: 0,
					data: JSON.parse(mock.text),
					msg: "查询成功！"
				});
			}
			else{
				res.send({
					status: -100,
					data: null,
					msg: "查询成功！"
				});
			}
		}
	});
	/*

	console.log(_url);
	res.send({
		url: _url,
		text: _text
	});
*/
});

app.listen(1024, function(req, res) {
	console.log('app is running at port 1024');
});