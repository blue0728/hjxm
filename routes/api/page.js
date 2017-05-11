var express = require('express');
var mysql = require('mysql');
var dbConfig = require('../../conf/db.js');
var singlepage = require('../../conf/page.js')
var router = express.Router();
var pool = mysql.createPool(dbConfig.mysql);
var checkLogin = require('../checkLogin.js');
var log = require('log4js').getLogger("page");

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

        if(err){
            log.error(err);
            res.json({
                status: 'error',
                msg: '异常'
            });
            return;
        }

		var total = 0;
		var page = (param.page - 1) * param.pageSize;
		var pageSize = parseInt(param.pageSize)
		connection.query(singlepage.countAll, function(err, result) {
			if (result) {
				total = result[0]['count(*)'];
				if (total > 0) {
					var b = connection.query(singlepage.queryAll, [page, pageSize], function(err, result) {
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
                            log.error(err);
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
                log.error(err);
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
        if(err){
            log.error(err);
            res.json({
                status: 'error',
                msg: '异常'
            });
            return;
        }
		connection.query(singlepage.queryById, [param.id], function(err, result) {
			if (result && result.length == 1) {
				res.json({
					status: 'success',
					data: result[0]
				});
			} else {
                log.error(err);
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
	if (!param.name || !param.cname || !param.content || !param.status) {
		res.json({
			status: 'error',
			msg: '参数错误'
		});
		return;
	}

	if (!/^[A-Za-z0-9]+$/.test(param.name)) {
		res.json({
			status: 'error',
			msg: '英文名称只能填写数字+字母'
		});
		return;
	}

	pool.getConnection(function(err, connection) {
        if(err){
            log.error(err);
            res.json({
                status: 'error',
                msg: '异常'
            });
            return;
        }
		connection.query(singlepage.insert, [param.name, param.cname, param.content, new Date(), param.status], function(err, result) {
			//判断重名
			if (err && err.errno == '1062') {
				res.json({
					status: 'error',
					msg: '请勿添加相同英文名称'
				});
				return
			}
			if (result) {
				res.json({
					status: 'success',
					msg: '添加成功'
				});
			} else {
                log.error(err);
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
        if(err){
            log.error(err);
            res.json({
                status: 'error',
                msg: '异常'
            });
            return;
        }
		connection.query(singlepage.deleById, [param.id], function(err, result) {
			if (result) {
				res.json({
					status: 'success',
					msg: '删除成功'
				});
			} else {
                log.error(err);
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

	if (!param.name || !param.cname || !param.content || !param.status) {
		res.json({
			status: 'error',
			msg: '参数错误'
		});
		return;
	}

	if (!/^[A-Za-z0-9]+$/.test(param.name)) {
		res.json({
			status: 'error',
			msg: '英文名称只能填写数字+字母'
		});
		return;
	}

	pool.getConnection(function(err, connection) {
        if(err){
            log.error(err);
            res.json({
                status: 'error',
                msg: '异常'
            });
            return;
        }
		connection.query(singlepage.update, [param.name, param.cname, param.content, new Date(), param.status, param.id], function(err, result) {
			//判断重名
			if (err && err.errno == '1062') {
				res.json({
					status: 'error',
					msg: '请勿添加相同英文名称'
				});
				return
			}
			if (result) {
				res.json({
					status: 'success',
					msg: '更新成功'
				});
			} else {
                log.error(err);
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
        if(err){
            log.error(err);
            res.json({
                status: 'error',
                msg: '异常'
            });
            return;
        }
		connection.query(singlepage.updateStatus, [param.status, param.id], function(err, result) {
			if (result) {
				res.json({
					status: 'success',
					msg: '更新成功'
				});
			} else {
                log.error(err);
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