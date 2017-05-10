var express = require('express');
var mysql = require('mysql');
var dbConfig = require('../../conf/db.js');
var ad = require('../../conf/ad.js')
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

		connection.query(ad.countAll, function(err, result) {
			if (result) {
				total = result[0]['count(*)'];
				if (total > 0) {
					connection.query(ad.queryAll, [page, pageSize], function(err, result) {
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
		connection.query(ad.queryById, [param.id], function(err, result) {
			if (result && result.length == 1) {
				res.json({
					status: 'success',
					data: result[0]
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

router.post('/add', checkLogin, function(req, res, next) {
	var param = req.body;
	if (!param.name || !param.url || !param.image || !param.status) {
		res.json({
			status: 'error',
			msg: '参数错误'
		});
		return;
	}
	pool.getConnection(function(err, connection) {
		connection.query(ad.insert, [param.name, param.url, param.image, param.status, new Date()], function(err, result) {
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
		connection.query(ad.deleById, [param.id], function(err, result) {
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

router.post('/edit', checkLogin, function(req, res, next) {
	var param = req.body;

	if (!param.name || !param.url || !param.image || !param.status) {
		res.json({
			status: 'error',
			msg: '参数错误'
		});
		return;
	}
	pool.getConnection(function(err, connection) {
		connection.query(ad.update, [param.name, param.url, param.image, param.status, new Date(), param.id], function(err, result) {
			if (result) {
				res.json({
					status: 'success',
					msg: '更新成功'
				});
			} else {
				res.json({
					status: 'error',
					msg: '更新失败'
				});
			}
			connection.release();
		})
	})
})

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
		connection.query(ad.updateStatus, [param.status, param.id], function(err, result) {
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

module.exports = router;