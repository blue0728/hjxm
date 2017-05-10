var types = {
	queryAll: 'select * from types',
	update: 'update types set name=? where id=?',
	insert: 'insert into types (name) values(?);',
	delete: 'delete from types where id=?'
}

module.exports = types