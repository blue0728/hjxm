<template>
<div>
	<div><el-button type="primary" icon="plus" @click="go({name: 'post-add'})">添加文章</el-button></div>
	<br>
	<el-table border :data="tableData" v-loading.body="loading" element-loading-text="拼命加载中" style="width: 100%">
        <el-table-column prop="id" label="ID" width="100"></el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column label="所属分类">
      		<template scope="scope">
        		<el-tag type="success" v-for="item in scope.row.typeTextArr">{{item}}</el-tag>
      		</template>
        </el-table-column>
        <el-table-column prop="author" width="100" label="更新人"></el-table-column>
        <el-table-column prop="time" width="200" label="更新时间"></el-table-column>
        <el-table-column prop="source" label="文章来源"></el-table-column>
      	<!-- <el-table-column prop="times" width="100" label="阅读次数"></el-table-column> -->
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
		        <el-button size="small" @click="go({name: 'post-detail', params: {id: scope.row.id}})">编辑</el-button>
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
		this.getTypes();
	},
	methods: {
		dele: function(id){
			this.$confirm('确定删除文章吗？删除后不可恢复！！！', '提示', {
	         	confirmButtonText: '确定',
	          	cancelButtonText: '取消',
	          	type: 'warning'
	        }).then(() => {
	          	this.$http.post('/api/post/dele',{
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
		getTypes: function(){
			this.$http.post('/api/types/list').then(function(res){
				if(res.data.status == 'success'){
					this.types = res.data.data.list;
					this.getList();
				}
			})
		},
		setStatus: function(id, status){
			this.$http.post('/api/post/set-status',{
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
			this.$http.post('/api/post/list',{
				page: this.page,
				pageSize: this.pageSize
			}).then(function(res){
				this.loading = false;
				if(res.data.status == 'success'){
					for(let i = 0, lena = res.data.data.list.length; i < lena; i++){
						res.data.data.list[i].typeidArr = res.data.data.list[i].typeid ? res.data.data.list[i].typeid.split(',') : [];
						res.data.data.list[i].typeTextArr = [];
						for(var j = 0, lenb = this.types.length; j < lenb; j++){
							for(var m = 0, lenc = res.data.data.list[i].typeidArr.length; m < lenc; m++){
								if(res.data.data.list[i].typeidArr[m] == this.types[j].id){
									res.data.data.list[i].typeTextArr.push(this.types[j].name)
								}
							}
						}
					}
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