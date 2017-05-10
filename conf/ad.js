var ad = {
	queryAll: 'select * from ad order by time desc limit ?,?',
	queryById: 'select * from ad where id=?',
	deleById: 'delete from ad where id=?',
	countAll: 'select count(*) from ad',
	updateStatus: 'update ad set status=? where id=?',
	update: 'update ad set name=?, url=?, image=?, status=?, time=? where id=?',
	insert: 'insert into ad (name, url, image, status, time) values(?,?,?,?,?)'
}

module.exports = ad