var express = require('express');
var crypto = require('crypto');
var mysql = require('mysql');
var dbConfig = require('../../conf/db.js');
var user = require('../../conf/user.js');
var loginLog = require('../../conf/log.js')
var router = express.Router();
var pool = mysql.createPool(dbConfig.mysql);
var checkLogin = require('../checkLogin.js')
var log = require('log4js').getLogger("admin");
var fs = require('fs')

//获取IP
function getClientIp(req) {
    return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
}

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

router.get('/info', checkLogin, function (req, res, next) {
    res.json({
        status: 'success',
        data: req.session.user,
        msg: 'success'
    });
})

router.post('/login', function (req, res, next) {
    var param = req.body;

    if (!param.name || !param.password) {
        res.json({
            status: 'error',
            msg: '请输入用户名/密码'
        });
        return;
    }
    pool.getConnection(function (err, connection) {
        if (err) {
            log.error(err);
            res.json({
                status: 'error',
                msg: '异常'
            });
            return;
        }
        var md5 = crypto.createHash('md5'),
            password = md5.update(param.password).digest('hex');
        connection.query(user.query, [param.name, password], function (err, result) {
            if (result.length == 1) {

                if (result[0].status == 'OFF') {
                    res.json({
                        status: 'error',
                        msg: '账户已经禁用，请联系管理员解禁'
                    });
                    return;
                }

                req.session.user = {
                    name: result[0].name,
                    id: result[0].id,
                    level: result[0].level
                };
                connection.query(loginLog.insterLogin, [result[0].id, new Date(), getClientIp(req)], function (err, result) {//写入登录日志
                    if (err) {
                        log.error(err);
                    }
                })
                res.json({
                    status: 'success',
                    msg: '登录成功'
                });
            } else {
                log.error(err);
                res.json({
                    status: 'error',
                    msg: '用户名/密码错误'
                });
            }

            connection.release();
        })
    })
})

router.post('/list', checkLogin, function (req, res, next) {
    var param = req.body;

    if (!param.page || !param.pageSize) {
        res.json({
            status: 'error',
            msg: '参数错误'
        });
        return;
    }

    if (req.session.user.level != 1) {
        res.json({
            status: 'error',
            msg: '需管理员账户才能查看'
        });
        return
    }

    pool.getConnection(function (err, connection) {

        if (err) {
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

        connection.query(user.countAll, function (err, result) {
            if (result) {
                total = result[0]['count(*)'];
                if (total > 0) {
                    connection.query(user.queryAll, [page, pageSize], function (err, result) {
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

router.post('/add', checkLogin, function (req, res, next) {
    var param = req.body;

    if (!param.name || !param.password) {
        res.json({
            status: 'error',
            msg: '参数错误'
        });
        return;
    }

    if (req.session.user.level != 1) {
        res.json({
            status: 'error',
            msg: '需管理员账户才能添加'
        });
        return
    }

    pool.getConnection(function (err, connection) {
        if (err) {
            log.error(err);
            res.json({
                status: 'error',
                msg: '异常'
            });
            return;
        }
        var md5 = crypto.createHash('md5'),
            password = md5.update(param.password).digest('hex');
        var level = Number(req.session.user.level) + 1
        var fromuser = req.session.user.name

        connection.query(user.insert, [param.name, password, level, fromuser, new Date()], function (err, result) {
            //判断重名
            if (err && err.errno == '1062') {
                res.json({
                    status: 'error',
                    msg: '用户名重复了'
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

router.post('/set-status', checkLogin, function (req, res, next) {
    var param = req.body;
    if (!param.status || !param.id) {
        res.json({
            status: 'error',
            msg: '参数错误'
        });
        return;
    }

    if (req.session.user.level != 1) {
        res.json({
            status: 'error',
            msg: '需管理员账户才能修改'
        });
        return
    }

    if (req.session.user.id == param.id) {
        res.json({
            status: 'error',
            msg: '管理员账户不可修改状态'
        });
        return
    }

    pool.getConnection(function (err, connection) {
        if (err) {
            log.error(err);
            res.json({
                status: 'error',
                msg: '异常'
            });
            return;
        }
        connection.query(user.updateStatus, [param.status, param.id], function (err, result) {
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

router.post('/set-password', checkLogin, function (req, res, next) {
    var param = req.body;
    if (!param.password || !param.id) {
        res.json({
            status: 'error',
            msg: '参数错误'
        });
        return;
    }

    if (req.session.user.level != 1) {
        res.json({
            status: 'error',
            msg: '需管理员账户才能修改'
        });
        return
    }

    pool.getConnection(function (err, connection) {

        if (err) {
            log.error(err);
            res.json({
                status: 'error',
                msg: '异常'
            });
            return;
        }

        var md5 = crypto.createHash('md5'),
            password = md5.update(param.password).digest('hex');

        connection.query(user.updatePassword, [password, param.id], function (err, result) {
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

router.post('/edit-password', checkLogin, function (req, res, next) {
    var param = req.body;

    if (!param.password || !param.newPassword) {
        res.json({
            status: 'error',
            msg: '参数错误'
        });
        return;
    }

    pool.getConnection(function (err, connection) {

        if (err) {
            log.error(err);
            res.json({
                status: 'error',
                msg: '异常'
            });
            return;
        }

        var password = crypto.createHash('md5').update(param.password).digest('hex'),
            newPassword = crypto.createHash('md5').update(param.newPassword).digest('hex'),
            name = req.session.user.name,
            uid = req.session.user.id;

        connection.query(user.query, [name, password], function (err, result) {
            if (result.length == 1) {
                connection.query(user.updatePassword, [newPassword, uid], function (err, result) {
                    if (result) {
                        req.session.user = null;
                        res.json({
                            status: 'success',
                            msg: '密码修改成功，请重新登录'
                        });
                    } else {
                        log.error(err);
                        res.json({
                            status: 'error',
                            msg: '修改失败'
                        });
                    }
                })
            } else {
                res.json({
                    status: 'error',
                    msg: '原密码错误'
                });
            }
            connection.release();
        })
    })
})

router.post('/log', checkLogin, function (req, res, next) {
    var param = req.body;

    if (!param.page || !param.pageSize || !param.id) {
        res.json({
            status: 'error',
            msg: '参数错误'
        });
        return;
    }

    if (req.session.user.level != 1) {
        res.json({
            status: 'error',
            msg: '需管理员账户才能查看'
        });
        return
    }

    pool.getConnection(function (err, connection) {
        if (err) {
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

        connection.query(loginLog.countAllById, [param.id], function (err, result) {
            if (result) {
                total = result[0]['count(*)'];
                if (total > 0) {
                    connection.query(loginLog.queryAllById, [param.id, page, pageSize], function (err, result) {
                        if (result) {
                            result.forEach((item) => {
                                item.lasttime = formatTime(new Date(item.lasttime))
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

router.post('/logout', function (req, res, next) {
    req.session.user = null;
    res.json({
        status: 'success',
        msg: '退出成功'
    });
})

router.get('/opendir', checkLogin, function (req, res, next) {
    fs.readdir(process.cwd() + '/log/', function (err, files) {
        if (err) {
            log.error(err);
            res.json({
                status: 'error',
                msg: '日志目录读取失败'
            });
            return;
        } else {
            res.json({
                status: 'success',
                data: {
                    files: files
                }
            })
        }
    });
})

router.get('/readfile', checkLogin, function (req, res, next) {
    var file = req.query.file;
    fs.readFile(process.cwd() + '/log/' + file, function (err, data) {
        if (err) {
            log.error(err);
            res.json({
                status: 'error',
                msg: '日志读取失败'
            });
            return;
        }
        res.json({
            status: 'success',
            data: {
                logList: data.toString().split('\n'),
                fileName: file
            }
        })
    });
})

module.exports = router;