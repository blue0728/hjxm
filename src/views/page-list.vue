<template>
<div>
	<div><el-button type="primary" icon="plus" @click="go({name: 'page-add'})">添加页面</el-button></div>
	<br>
	<el-table border :data="tableData" v-loading.body="loading" element-loading-text="拼命加载中" style="width: 100%">
        <el-table-column prop="id" label="ID" width="100"></el-table-column>
        <el-table-column prop="cname" label="中文名称"></el-table-column>
        <el-table-column prop="name" width="200" label="英文名称"></el-table-column>
        <el-table-column prop="time" width="200" label="更新时间"></el-table-column>
      	<el-table-column width="100" label="状态">
      		<template scope="scope">
      			<el-tag v-if="scope.row.status == 'ON'" type="success">已{{scope.row.statusName}}</el-tag>
      			<el-tag v-if="scope.row.status == 'OFF'" type="danger">已{{scope.row.statusName}}</el-tag>
      		</template>
      	</el-table-column>
      	<el-table-column width="250" label="操作">
	      	<template scope="scope">
		        <el-button v-if="scope.row.status == 'ON'" size="small" type="danger" @click="setStatus(scope.row.id, 'OFF')">立即下线</el-button>
		        <el-button v-if="scope.row.status == 'OFF'" size="small" type="success" @click="setStatus(scope.row.id, 'ON')">立即上线</el-button>
		        <el-button size="small" @click="go({name: 'page-detail', params: {id: scope.row.id}})">编辑</el-button>
		        <el-button size="small" type="danger" @click="dele(scope.row.id)">删除</el-button>
	        </template>
       	</el-table-column>
    </el-table>
    <div style="padding: 20px;text-align: right;">
    	<el-pagination @current-change="handleCurrentChange" :current-page="page" :page-size="pageSize" layout="total, prev, pager, next" :total="total"></el-pagination>
    </div>
</div>	
</template>
<script>
export default {
	data: function(){
		return {
			types: [],
			tableData: [],
			loading: false,
			page: 1,
			pageSize: 10,
			total: 0
		}
	},
	created: function(){
		this.getList();
	},
	methods: {
		dele: function(id){
			this.$confirm('确定删除页面吗？删除后不可恢复！！！', '提示', {
	         	confirmButtonText: '确定',
	          	cancelButtonText: '取消',
	          	type: 'warning'
	        }).then(() => {
	          	this.$http.post('/api/page/dele',{
	          		id: id
	          	}).then(function(res){
	          		if(res.data.status == 'success'){
	          			this.$message.success(res.data.msg);
	          			this.getList();
	          		}else{
	          			this.$message.error(res.data.msg);
	          		}
	          	})
	        })
		},
		setStatus: function(id, status){
			this.$http.post('/api/page/set-status',{
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
		go: function(opt){
			this.$router.push(opt)
		},
		getList: function(){
			this.loading = true;
			this.$http.post('/api/page/list',{
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
		handleCurrentChange: function(val){
			this.page = val;
			this.getList();
		}
	}
}	
</script>