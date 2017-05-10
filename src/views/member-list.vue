<template>
<div>
	<div><el-button type="primary" icon="plus" @click="go({name: 'member-add'})">添加纹绣师</el-button></div>
	<br>
	<el-table border :data="tableData" v-loading.body="loading" element-loading-text="拼命加载中" style="width: 100%">
        <el-table-column prop="id" label="ID" width="50"></el-table-column>
        <el-table-column label="编号" width="200">
        	<template scope="scope">
		        <el-tag type='success' v-if="scope.row.number">{{scope.row.number}}</el-tag>
		    </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="100"></el-table-column>
        <el-table-column prop="sexName" label="性别" width="100"></el-table-column>
        <el-table-column prop="age" label="年龄" width="100"></el-table-column>
        <el-table-column prop="date" label="出生日期"></el-table-column>
        <el-table-column prop="email" label="电子邮箱"></el-table-column>
        <el-table-column prop="phone" label="手机号码" width="150"></el-table-column>
      	<el-table-column prop="status" width="100" label="状态" :filter-method="filter" :filters="[{ text: '待审核', value: 'REVIEW' }, { text: '已通过', value: 'ADOPTA' }, { text: '已拒绝', value: 'REFUSE' }]">
      		<template scope="scope">
		        <el-tag v-if="scope.row.status === 'REVIEW'" type='warning' close-transition>{{scope.row.statusName}}</el-tag>
		        <el-tag v-if="scope.row.status === 'ADOPTA'" type='success' close-transition>{{scope.row.statusName}}</el-tag>
		        <el-tag v-if="scope.row.status === 'REFUSE'" type='danger' close-transition>{{scope.row.statusName}}</el-tag>
		    </template>
      	</el-table-column>
      	<el-table-column width="200" label="操作">
	      	<template scope="scope">
		        <el-button size="small" @click="go({name: 'member-detail', params: {id: scope.row.id}})">查看详情</el-button>
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
			this.$confirm('确定删除纹绣师吗？删除后不可恢复！！！', '提示', {
	         	confirmButtonText: '确定',
	          	cancelButtonText: '取消',
	          	type: 'warning'
	        }).then(() => {
	          	this.$http.post('/api/member/dele',{
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
		filter: function(value, row){
			return row.status === value;
		},
		go: function(opt){
			this.$router.push(opt)
		},
		getList: function(){
			this.loading = true;
			this.$http.post('/api/member/list',{
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