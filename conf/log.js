var log = {
	insterLogin: 'insert into log(uid, lasttime, lastip) value(?,?,?)',
	queryAllById: 'select * from log where uid=? order by lasttime desc limit ?,?',
	countAllById: 'select count(*) from log where uid=?',
}

module.exports = log