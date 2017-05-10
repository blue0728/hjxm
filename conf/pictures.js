var pictures = {
	insterPicture: 'insert into pictures(url, time) value(?,?)',
	queryAll: 'select * from pictures order by time desc limit ?,?',
	countAll: 'select count(*) from pictures',
	deleById: 'delete from pictures where id=?',
}

module.exports = pictures