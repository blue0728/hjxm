var admin = require('./admin.js');
var post = require('./post.js');
var pictures = require('./pictures.js');
var member = require('./member.js');
var types = require('./types.js');
var ad = require('./ad.js');
var page = require('./page.js');
var message = require('./message.js');

module.exports = function(app) {
	app.use('/api/admin', admin)
	app.use('/api/post', post)
	app.use('/api/pictures', pictures)
	app.use('/api/member', member)
	app.use('/api/types', types)
	app.use('/api/adver', ad)
	app.use('/api/page', page)
	app.use('/api/message', message)
}