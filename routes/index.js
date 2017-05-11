var fs = require("fs")
var express = require('express');
var router = express.Router();
var log = require('log4js').getLogger("index");

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {
        title: 'Express'
    });
});

router.get('/admin', function (req, res, next) {
    var title = '杭州绘聚绣美健康管理有限公司';
    fs.readFile('./dist/webpack-assets.json', function (err, data) {
        if (err) {
            res.render('admin', {
                title: title,
                status: 'error',
                msg: '请重新编译代码',
                src: ''
            });
            log.error(err);
            return
        }
        res.render('admin', {
            title: title,
            status: 'success',
            msg: 'ok',
            src: JSON.parse(data).main.js,
        });
    });
})

module.exports = router;