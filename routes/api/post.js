var express = require('express');
var crypto = require('crypto');
var mysql = require('mysql');
var dbConfig = require('../../conf/db.js');
var post = require('../../conf/post.js')
var router = express.Router();
var pool = mysql.createPool(dbConfig.mysql);
var checkLogin = require('../checkLogin.js');

//格式化时间
function formatTime(date) {
	var year = date.getFullYear()
	var month = date.getMonth() + 1
	var day = date.getDate()

	var hour = date.getHours()
	var minute = date.getMinutes()
	var second = date.getSeconds()


	return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
	n = n.toString()
	return n[1] ? n : '0' + n
}

//文章列表
router.post('/list', checkLogin, function(req, res, next) {
	var param = req.body;
	if (!param.page || !param.pageSize) {
		res.json({
			status: 'error',
			msg: '参数错误'
		});
		return;
	}
	pool.getConnection(function(err, connection) {
		var total = 0;
		var page = (param.page - 1) * param.pageSize;
		var pageSize = parseInt(param.pageSize)

		connection.query(post.countAll, function(err, result) {
			if (result) {
				total = result[0]['count(*)'];
				if (total > 0) {
					connection.query(post.queryAll, [page, pageSize], function(err, result) {
						if (result) {
							result.forEach((item) => {
								item.time = formatTime(new Date(item.time))
								item.statusName = item.status == 'ON' ? '上线' : '下线'
							})
							res.json({
								status: 'success',
								data: {
									list: result,
									total: total,
									page: parseInt(param.page),
									pageSize: parseInt(param.pageSize)
								}
							});
						} else {
							res.json({
								status: 'error',
								msg: '查询失败'
							});
						}
					})
				} else {
					res.json({
						status: 'success',
						data: {
							list: [],
							total: total,
							page: parseInt(param.page),
							pageSize: parseInt(param.pageSize)
						}
					})
				}
			} else {
				res.json({
					status: 'error',
					msg: '查询失败'
				});
			}
			connection.release();
		})
	})
})

//文章详情
router.post('/detail', checkLogin, function(req, res, next) {
	var param = req.body;
	if (!param.id) {
		res.json({
			status: 'error',
			msg: '参数错误'
		});
		return;
	}
	pool.getConnection(function(err, connection) {
		connection.query(post.queryById, [param.id], function(err, result) {
			if (result && result.length > 0) {
				result[0].fileList = []
				if (result[0].cover) {
					result[0].cover.split(',').forEach((item) => {
						result[0].fileList.push({
							name: item,
							url: 'http://ojnlldqnx.bkt.clouddn.com/' + item
						})
					})
				}
				result[0].photos = result[0].cover
				res.json({
					data: result[0],
					status: 'success',
					msg: 'success'
				});
			} else {
				res.json({
					status: 'error',
					msg: '查询失败'
				});
			}
			connection.release();
		})
	})
})

//修改文章状态
router.post('/set-status', checkLogin, function(req, res, next) {
	var param = req.body;
	if (!param.status || !param.id) {
		res.json({
			status: 'error',
			msg: '参数错误'
		});
		return;
	}
	pool.getConnection(function(err, connection) {
		connection.query(post.updateStatus, [param.status, param.id], function(err, result) {
			if (result) {
				res.json({
					status: 'success',
					msg: '更新成功'
				});
			} else {
				res.json({
					status: 'error',
					msg: '查询失败'
				});
			}
			connection.release();
		})
	})
})

//添加文章
router.post('/add', checkLogin, function(req, res, next) {
	var param = req.body;

	if (param.title == '' || param.content == '') {
		res.json({
			status: 'error',
			msg: '标题/内容不能为空'
		});
		return
	}

	var typeid = param.typeid == '' ? '' : param.typeid + ',';
	var author = req.session.user.name

	pool.getConnection(function(err, connection) {
		connection.query(post.insert, [param.title, param.content, new Date(), author, param.source, param.status, typeid, param.cover], function(err, result) {
			if (result) {
				res.json({
					status: 'success',
					msg: '添加成功'
				});
			} else {
				res.json({
					status: 'error',
					msg: '添加失败'
				});
			}
			connection.release();
		})
	})
})

//删除文章
router.post('/dele', checkLogin, function(req, res, next) {
	var param = req.body;

	if (!param.id) {
		res.json({
			status: 'error',
			msg: '参数错误'
		});
		return;
	}

	pool.getConnection(function(err, connection) {
		connection.query(post.deleById, [param.id], function(err, result) {
			if (result) {
				res.json({
					status: 'success',
					msg: '删除成功'
				});
			} else {
				res.json({
					status: 'error',
					msg: '删除失败'
				});
			}
			connection.release();
		})
	})
})

//编辑文章
router.post('/edit', checkLogin, function(req, res, next) {
	var param = req.body;

	if (param.title == '' || param.content == '') {
		res.json({
			status: 'error',
			msg: '标题/内容不能为空'
		});
		return
	}
	var typeid = param.typeid == '' ? '' : param.typeid + ',';
	var author = req.session.user.name

	pool.getConnection(function(err, connection) {
		connection.query(post.update, [param.title, param.content, new Date(), author, param.source, param.status, typeid, param.cover, param.id], function(err, result) {
			if (result) {
				res.json({
					status: 'success',
					msg: '修改成功'
				});
			} else {
				res.json({
					status: 'error',
					msg: '修改失败'
				});
			}
			connection.release();
		})
	})
})

module.exports = router;