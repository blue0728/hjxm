var express = require('express');
var mysql = require('mysql');
var dbConfig = require('../../conf/db.js');
var member = require('../../conf/member.js')
var router = express.Router();
var pool = mysql.createPool(dbConfig.mysql);
var checkLogin = require('../checkLogin.js');

//格式化时间
function formatTime(date) {
	var year = date.getFullYear()
	var month = date.getMonth() + 1
	var day = date.getDate()

	return [year, month, day].map(formatNumber).join('-')
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

		connection.query(member.countAll, function(err, result) {
			if (result) {
				total = result[0]['count(*)'];
				if (total > 0) {
					connection.query(member.queryAll, [page, pageSize], function(err, result) {
						if (result) {
							result.forEach((item) => {
								item.date = formatTime(new Date(item.date))
								item.statusName = item.status == 'ADOPTA' ? '已通过' : item.status == 'REFUSE' ? '已拒绝' : '待审核'
								item.sexName = item.sex == '1' ? '男' : '女'
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
		connection.query(member.queryById, [param.id], function(err, result) {
			if (result && result.length == 1) {
				result[0].date = new Date(result[0].date)
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
	if (!param.name || !param.age || !param.sex || !param.email || !param.phone || !param.qq || !param.date || !param.address || !param.photos || !param.introduce || !param.type || !param.level || !param.status) {
		res.json({
			status: 'error',
			msg: '参数错误'
		});
		return;
	}
	var number = '';
	var newDate = new Date();
	var year = newDate.getFullYear().toString().substr(2, 2)
	var month = formatNumber(newDate.getMonth() + 1);
	var date = formatNumber(newDate.getDate());
	var hours = newDate.getHours();
	var minutes = newDate.getMinutes();
	var seconds = newDate.getSeconds();
	var mseconds = newDate.getMilliseconds();
	var str = hours * 60 * 60 + minutes * 60 + seconds;
	var len = str.toString().length;
	var len2 = mseconds.toString().length;

	for (var i = 0; i < 6 - len; i++) {
		str = '0' + str;
	}

	for (var i = 0; i < 4 - len2; i++) {
		mseconds = '0' + mseconds;
	}

	number = 'WX' + year + '' + month + '' + date + '' + str + '' + mseconds;

	pool.getConnection(function(err, connection) {
		connection.query(member.insert, [number, param.name, param.age, param.sex, param.email, param.phone, param.qq, param.date, param.address, param.photos, param.introduce, new Date(), param.type, param.level, param.status], function(err, result) {
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
		connection.query(member.deleById, [param.id], function(err, result) {
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

	if (!param.id || !param.name || !param.age || !param.sex || !param.email || !param.phone || !param.qq || !param.date || !param.address || !param.photos || !param.introduce || !param.type || !param.level || !param.status) {
		res.json({
			status: 'error',
			msg: '参数错误'
		});
		return;
	}
	pool.getConnection(function(err, connection) {
		connection.query(member.update, [param.name, param.age, param.sex, param.email, param.phone, param.qq, param.date, param.address, param.photos, param.introduce, new Date(), param.type, param.level, param.status, param.id], function(err, result) {
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

module.exports = router;