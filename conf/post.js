var post = {
	queryAll: 'select * from post order by time desc limit ?,?',
	queryById: 'select * from post where id=?',
	deleById: 'delete from post where id=?',
	queryLike: 'select * from post where typeid like ?',
	countAll: 'select count(*) from post',
	updateStatus: 'update post set status=? where id=?',
	update: 'update post set title=?, content=?, time=?, author=?, source=?, status=?, typeid=?, cover=? where id=?',
	insert: 'insert into post (title, content, time, author, source, status, typeid, cover) values(?,?,?,?,?,?,?,?);'
}

module.exports = post