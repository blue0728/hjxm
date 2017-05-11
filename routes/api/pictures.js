var express = require('express');
var qiniu = require('qiniu');
var router = express.Router();
var mysql = require('mysql');
var dbConfig = require('../../conf/db.js');
var pictures = require('../../conf/pictures.js')
var checkLogin = require('../checkLogin.js')
var formidable = require('formidable');
var pool = mysql.createPool(dbConfig.mysql);
var log = require('log4js').getLogger("pictures");

//七牛 key
qiniu.conf.ACCESS_KEY = 'AmJ7iOGbO1SERXursngARi3Kdanr2OR8Cboohi51';
qiniu.conf.SECRET_KEY = 'BFHh6y-eMybbiT7zTaznIkPGj2msaqXG2RtTn3TM';

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

//获取token
router.get('/token', checkLogin, function (req, res, next) {
    //要上传的空间
    var bucket = 'images';

    //上传到七牛后保存的文件名
    var key = null;

    //构建上传策略函数
    function uptoken(bucket) {
        var putPolicy = new qiniu.rs.PutPolicy(bucket);
        return putPolicy.token();
    }

    //生成上传 Token
    var token = uptoken(bucket);

    res.json({
        status: 'success',
        data: {
            token: token
        }
    })
})

//普通上传
router.post('/upload', function (req, res, next) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        if (files.file.type != 'image/gif' && files.file.type != 'image/jpeg' && files.file.type != 'image/png' && files.file.type != 'image/pjpeg' && files.file.type != 'image/bmp' && files.file.type != 'image/x-png') {
            res.json({
                status: 'error',
                state: 'ERROR',
                msg: '不能上传非图片类型'
            });
            return
        }
        if (files.file.size > 1024 * 1024 * 8) {
            res.json({
                status: 'error',
                state: 'ERROR',
                msg: '大小不能超过8M'
            });
            return
        }
        upload2Qiniu(res, files.file.path)
    })
})

//删除图片
router.post('/dele', checkLogin, function (req, res, next) {
    var param = req.body;
    //构建bucketmanager对象
    var client = new qiniu.rs.Client();

    //你要测试的空间， 并且这个key在你空间中存在
    var bucket = 'images';
    var key = param.name;

    //删除资源
    client.remove(bucket, key, function (err, ret) {
        if (!err) {
            pool.getConnection(function (err, connection) {
                connection.query(pictures.deleById, [param.id], function (err, result) {
                    if (result) {
                        res.json({
                            status: 'success',
                            msg: '删除成功'
                        });
                    } else {
                        log.error(err);
                        res.json({
                            status: 'error',
                            msg: '本地删除失败，七牛云已经成功删除'
                        });
                    }
                    connection.release();
                })
            })
        } else {
            log.error(err);
            res.json({
                status: 'error',
                msg: '删除失败'
            });
        }
    });
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

        connection.query(pictures.countAll, function (err, result) {
            if (result) {
                total = result[0]['count(*)'];
                if (total > 0) {
                    connection.query(pictures.queryAll, [page, pageSize], function (err, result) {
                        if (result) {
                            result.forEach((item) => {
                                item.time = formatTime(new Date(item.time))
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

//百度编辑器上传
router.get('/upload2ue', checkLogin, function (req, res, next) {
    UEditorUpload(req, res, next)
})

router.post('/upload2ue', checkLogin, function (req, res, next) {
    UEditorUpload(req, res, next)
})


//上传到七牛
function upload2Qiniu(res, filePath) {
    //要上传的空间
    var bucket = 'images';

    //上传到七牛后保存的文件名
    var key = null;

    //构建上传策略函数
    function uptoken(bucket) {
        var putPolicy = new qiniu.rs.PutPolicy(bucket);
        return putPolicy.token();
    }

    //生成上传 Token
    var token = uptoken(bucket);
    //要上传文件的本地路径
    filePath = filePath

    //构造上传函数
    function uploadFile(uptoken, key, localFile) {
        var extra = new qiniu.io.PutExtra();
        qiniu.io.putFile(uptoken, key, localFile, extra, function (err, ret) {
            if (!err) {
                pool.getConnection(function (err, connection) {
                    connection.query(pictures.insterPicture, [ret.hash, new Date()]) //写入picture表
                    connection.release();
                })
                res.json({
                    status: 'success',
                    state: 'SUCCESS',
                    url: ret.hash,
                    _url: ret.hash,
                    data: {
                        hash: ret.hash,
                        key: ret.key
                    }
                });
            } else {
                res.json({
                    status: 'error',
                    state: 'ERROR',
                    msg: err
                });
            }
        });
    }

    uploadFile(token, key, filePath);
}

//百度编辑器上传
function UEditorUpload(req, res, next) {
    var param = req.query;
    switch (param.action) {
        case 'config':
            res.json(require('./uploadConfig.js'));
            break;
        case 'uploadimage':
            var form = new formidable.IncomingForm();
            form.parse(req, function (err, fields, files) {
                upload2Qiniu(res, files.upfile.path)
            })
            break;
    }
}

module.exports = router;