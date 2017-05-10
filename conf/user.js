var user = {
	query: 'select * from users where name=? and password=?',
	queryAll: 'select * from users order by time desc limit ?,?',
	countAll: 'select count(*) from users',
	updatePassword: 'update users set password=? where id=?',
	updateStatus: 'update users set status=? where id=?',
	insert: 'insert into users (name, password, level, fromuser, time) values(?,?,?,?,?)'
}

module.exports = user