function checkLogin(req, res, next) {
	if (!req.session.user) {
		res.json({
			flag: -100,
			status: 'error',
			msg: '请登录'
		});
	} else {
		next();
	}
}

module.exports = checkLogin;