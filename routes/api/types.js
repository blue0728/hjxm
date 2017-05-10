var express = require('express');
var crypto = require('crypto');
var mysql = require('mysql');
var dbConfig = require('../../conf/db.js');
var types = require('../../conf/types.js')
var post = require('../../conf/post.js')
var router = express.Router();
var pool = mysql.createPool(dbConfig.mysql);
var checkLogin = require('../checkLogin.js');

router.post('/list', checkLogin, function(req, res, next) {
	pool.getConnection(function(err, connection) {
		connection.query(types.queryAll, function(err, result) {
			if (result) {
				res.json({
					status: 'success',
					data: {
						list: result
					}
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
	if (!param.name) {
		res.json({
			status: 'error',
			msg: '参数错误'
		});
		return;
	}
	pool.getConnection(function(err, connection) {
		connection.query(types.insert, [param.name], function(err, result) {
			//判断重名
			if (err && err.errno == '1062') {
				res.json({
					status: 'error',
					msg: '请勿添加相同名称分类'
				});
				return
			}
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

router.post('/edit', checkLogin, function(req, res, next) {
	var param = req.body;
	if (!param.name || !param.id) {
		res.json({
			status: 'error',
			msg: '参数错误'
		});
		return;
	}
	pool.getConnection(function(err, connection) {
		connection.query(types.update, [param.name, param.id], function(err, result) {
			//判断重名
			if (err && err.errno == '1062') {
				res.json({
					status: 'error',
					msg: '请勿添加相同名称分类'
				});
				return
			}
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
		connection.query(post.queryLike, ['%' + param.id + ',%'], function(err, result) {
			if (result) {
				if (result.length > 0) {
					res.json({
						status: 'error',
						msg: '该分类里面有文章,无法删除'
					});
				} else {
					connection.query(types.delete, [param.id], function(err, result) {
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

module.exports = router;