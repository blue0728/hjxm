var express = require('express');
var mysql = require('mysql');
var dbConfig = require('../../conf/db.js');
var message = require('../../conf/message.js')
var router = express.Router();
var pool = mysql.createPool(dbConfig.mysql);
var checkLogin = require('../checkLogin.js');
var log = require('log4js').getLogger("message");

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

		connection.query(message.countAll, function(err, result) {
			if (result) {
				total = result[0]['count(*)'];
				if (total > 0) {
					connection.query(message.queryAll, [page, pageSize], function(err, result) {
						if (result) {
							result.forEach((item) => {
								item.time = formatTime(new Date(item.time))
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
		connection.query(message.updateStatus, [param.status, param.id], function(err, result) {
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