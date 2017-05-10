<template>
<div>
	<div><el-button type="primary" icon="plus" @click="go({name: 'user-add'})">添加用户</el-button></div>
	<br>
	<el-table border :data="tableData" v-loading.body="loading" element-loading-text="拼命加载中" style="width: 100%">
        <el-table-column prop="id" label="ID" width="100"></el-table-column>
        <el-table-column prop="name" label="用户名"></el-table-column>
        <el-table-column width="100" label="级别">
        	<template scope="scope">
      			<el-tag v-if="scope.row.level == 1" type="success">超级管理员</el-tag>
      			<el-tag v-if="scope.row.level == 2" type="primary">操作员</el-tag>
      			<el-tag v-if="scope.row.level == 3" type="warning">查看员</el-tag>
      		</template>
        </el-table-column>
        <el-table-column prop="time" width="200" label="添加时间"></el-table-column>
        <el-table-column prop="fromuser" width="200" label="添加人"></el-table-column>
      	<el-table-column width="100" label="状态">
      		<template scope="scope">
      			<el-tag v-if="scope.row.status == 'ON'" type="success">正常</el-tag>
      			<el-tag v-if="scope.row.status == 'OFF'" type="danger">禁用</el-tag>
      		</template>
      	</el-table-column>
      	<el-table-column width="350" label="操作">
	      	<template scope="scope">
		        <el-button v-if="scope.row.status == 'ON' && scope.row.level != 1" size="small" type="danger" @click="setStatus(scope.row.id, 'OFF')">禁用</el-button>
		        <el-button v-if="scope.row.status == 'OFF' && scope.row.level != 1" size="small" type="success" @click="setStatus(scope.row.id, 'ON')">解禁</el-button>
		        <el-button size="small" type="warning" @click="showDialog({id: scope.row.id, name: scope.row.name})">修改密码</el-button>
		        <el-button size="small" type="success" @click="showLog(scope.row.id)">查看登录日志</el-button>
	        </template>
       	</el-table-column>
    </el-table>
    <div style="padding: 20px;text-align: right;">
    	<el-pagination @current-change="handleCurrentChange" :current-page="page" :page-size="pageSize" layout="total, prev, pager, next" :total="total"></el-pagination>
    </div>
    <el-dialog title="修改密码" v-model="dialogVisible" size="tiny" @close="close">
    	<p>用户名：{{current.name}}</p>
	  	<el-input type="password" v-model="current.password" placeholder="请输入密码"></el-input>
	  	<span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisible = false">取 消</el-button>
		    <el-button type="primary" :loading="submitloading" @click="setPassword">确 定</el-button>
	  	</span>
	</el-dialog>
	<el-dialog title="登录日志" v-model="dialogFormVisible2">
	  	<el-table border :data="tableData2" v-loading.body="loading2" element-loading-text="拼命加载中">
		    <el-table-column property="lasttime" label="登录时间" width="200"></el-table-column>
		    <el-table-column property="lastip" label="登录IP"></el-table-column>
		</el-table>
		<div style="padding: 20px;text-align: right;">
	    	<el-pagination @current-change="handleCurrentChange2" :current-page="page2" :page-size="pageSize2" layout="total, prev, pager, next" :total="total2"></el-pagination>
	    </div>
	</el-dialog>
</div>	
</template>
<script>
export default {
	data: function(){
		return {
			dialogFormVisible2: false,
			dialogVisible: false,
			submitloading: false,
			types: [],
			tableData: [],
			tableData2: [],
			page2: 1,
			pageSize2: 10,
			total2: 10,
			loading2: false,
			loading: false,
			page: 1,
			pageSize: 10,
			total: 0,
			current: {
				id: '',
				name: '',
				password: ''
			},
			curId: ''
		}
	},
	created: function(){
		this.getList();
	},
	methods: {
		showLog: function(id){
			this.dialogFormVisible2 = true;
			this.getLog(id)
			this.curId = id;
		},
		showDialog: function(data){
			this.dialogVisible = true;
			this.current = {
				id: data.id,
				name: data.name,
				password: ''
			}
		},
		close: function(){
			this.current = {
				id: '',
				name: '',
				password: ''
			}
			this.tableData2 = [];
			this.page2 = 0;
			this.pageSize2 = 0;
			this.total2 = 0;
			this.dialogVisible = false;
			this.dialogVisible2 = false;

		},
		setStatus: function(id, status){
			this.$http.post('/api/admin/set-status',{
				status: status,
				id: id
			}).then(function(res){
				if(res.data.status == 'success'){
					this.getList();
				}else{
					this.$message.error(res.data.msg);
				}
			})
		},
		setPassword: function(){
			this.$http.post('/api/admin/set-password',{
				password: this.current.password,
				id: this.current.id
			}).then(function(res){
				if(res.data.status == 'success'){
					this.$message.success(res.data.msg);
					this.dialogVisible = false;
					this.getList();
				}else{
					this.$message.error(res.data.msg);
				}
			})
		},
		go: function(opt){
			this.$router.push(opt)
		},
		getList: function(){
			this.loading = true;
			this.$http.post('/api/admin/list',{
				page: this.page,
				pageSize: this.pageSize
			}).then(function(res){
				this.loading = false;
				if(res.data.status == 'success'){
					this.tableData = res.data.data.list;
					this.total = res.data.data.total;
				}else{
					this.$message.error(res.data.msg);
				}
			})
		},
		getLog: function(id){
			this.loading2 = true;
			this.$http.post('/api/admin/log',{
				id: id,
				page: this.page2,
				pageSize: this.pageSize2
			}).then(function(res){
				this.loading2 = false;
				if(res.data.status == 'success'){
					this.tableData2 = res.data.data.list;
					this.total2 = res.data.data.total;	
				}else{
					this.$message.error(res.data.msg);
				}
			})
		},
		handleCurrentChange: function(val){
			this.page = val;
			this.getList();
		},
		handleCurrentChange2: function(val){
			this.page2 = val;
			this.getLog(this.curId);
		}
	}
}	
</script>