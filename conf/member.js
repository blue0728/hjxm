var member = {
	queryById: 'select * from member where id=?',
	deleById: 'delete from member where id=?',
	queryAll: 'select * from member order by time desc limit ?,?',
	countAll: 'select count(*) from member',
	updateStatus: 'update member set status=? where id=?',
	update: 'update member set name=?, age=?, sex=?, email=?, phone=?, qq=?, date=?, address=?, photos=?,introduce=?, time=? ,type=?, level=?, status=? where id=?',
	insert: 'insert into member (number, name, age, sex, email, phone, qq,date,address,photos,introduce,time,type,level,status) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);'
}

module.exports = member