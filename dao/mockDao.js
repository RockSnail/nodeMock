var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://'); //连接admin数据库

var Schema = mongoose.Schema; //创建模型
var mockSchema = new Schema({
	url: String,
	text: String
}, {
	collection: "t_mock"
});


mockSchema.methods.addMock = function(mock, callback) {
	this.url = mock.url;
	this.text = mock.text;
	this.save(callback);
}

var mock = db.model('mock', mockSchema);
//exports.student=mock;
module.exports = mock;