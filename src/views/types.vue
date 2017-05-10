<template>
<div>
	<div><el-button type="primary" icon="plus" @click="dialogVisible = true">添加分类</el-button></div>
	<br>
	<el-table border :data="tableData" v-loading.body="loading" element-loading-text="拼命加载中" style="width: 100%">
        <el-table-column prop="id" label="ID" width="100"></el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
      	<el-table-column width="200" label="操作">
	      	<template scope="scope">
		        <el-button size="small" type="warning" @click="showDialog(scope.row.id, scope.row.name)">修改名称</el-button>
		        <el-button size="small" type="danger" @click="dele(scope.row.id)">删除</el-button>
	        </template>
       	</el-table-column>
    </el-table>

    <el-dialog :title="title" v-model="dialogVisible" size="tiny" @close="close">
	  	<el-input v-model="name" placeholder="请输入分类名称，请勿重名"></el-input>
	  	<span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisible = false">取 消</el-button>
		    <el-button type="primary" :loading="submitloading" @click="submit">确 定</el-button>
	  	</span>
	</el-dialog>
</div>	
</template>
<script>
export default{
	data: function(){
		return {
			title: '添加分类',
			dialogVisible: false,
			tableData: [],
			loading: false,
			name: '',
			submitloading: false,
			id: ''
		}
	},
	created: function(){
		this.getList();
	},
	methods: {
		close: function(){
			this.id = '';
			this.name = '';
			this.title = '添加分类';
		},
		showDialog: function(id, name){
			this.title = '修改分类';
			this.id = id;
			this.name = name;
			this.dialogVisible = true
		},
		getList: function(){
			this.loading = true
			this.$http.post('/api/types/list').then(function(res){
				this.loading = false
				if(res.data.status == 'success'){
					this.tableData = res.data.data.list
				}else{
					this.$message.error(res.data.msg);
				}
			})
		},
		submit: function(){
			this.submitloading = true

			if(this.id){
				this.$http.post('/api/types/edit',{
					id: this.id,
					name: this.name
				}).then(function(res){
					this.submitloading = false
					if(res.data.status == 'success'){
						this.$message.success(res.data.msg);
						this.dialogVisible = false;
						this.getList();
					}else{
						this.$message.error(res.data.msg);
					}
				})
			}else{
				this.$http.post('/api/types/add',{
					name: this.name
				}).then(function(res){
					this.submitloading = false
					if(res.data.status == 'success'){
						this.$message.success(res.data.msg);
						this.dialogVisible = false;
						this.getList();
					}else{
						this.$message.error(res.data.msg);
					}
				})
			}
		},
		dele: function(id){
			this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
		        confirmButtonText: '确定',
		        cancelButtonText: '取消',
		        type: 'warning',
		        beforeClose: (action, instance, done) => {
		            if (action === 'confirm') {
		              	instance.confirmButtonLoading = true;
		              	instance.confirmButtonText = '删除中...';
		              	done();
		              	instance.confirmButtonLoading = false;
		            } else {
		              	done();
		            }
		        }
	        }).then(() => {
	          	this.$http.post('/api/types/dele',{
					id: id,
				}).then(function(res){
					if(res.data.status == 'success'){
						this.$message.success(res.data.msg);
						this.getList();
					}else{
						this.$message.error(res.data.msg);
					}
				})
	        })
		}
	}
}	
</script>