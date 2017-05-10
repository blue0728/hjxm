var singlepage = {
	queryAll: 'select * from page order by time desc limit ?,?',
	queryById: 'select * from page where id=?',
	deleById: 'delete from page where id=?',
	countAll: 'select count(*) from page',
	updateStatus: 'update page set status=? where id=?',
	update: 'update page set name=?, cname=?, content=?, time=?, status=? where id=?',
	insert: 'insert into page (name, cname, content, time, status) values(?,?,?,?,?)'
}

module.exports = singlepage