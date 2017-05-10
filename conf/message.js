var message = {
	queryById: 'select * from message where id=?',
	deleById: 'delete from message where id=?',
	queryAll: 'select * from message order by time desc limit ?,?',
	countAll: 'select count(*) from message',
	updateStatus: 'update message set status=? where id=?',
}

module.exports = message