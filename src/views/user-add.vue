<template>
<div>
	<h3>添加用户</h3>
	<div style="width:600px">
	<el-form ref="detail" :rules="rules" :model="info" label-width="100px">
		<el-form-item label="用户名" prop="name">
		    <el-input v-model="info.name" placeholder="请填写用户名"></el-input>
		</el-form-item>
		<el-form-item label="密码" prop="password">
		    <el-input type="password" v-model="info.password" placeholder="请填写密码"></el-input>
		</el-form-item>
		<el-form-item>
		    <el-button type="primary" @click="submit" :loading="loading">提交</el-button>
		</el-form-item>
	</el-form>
	</div>
</div>	
</template>
<script>
export default{
	data: function(){
		return {
			info: {
				name: '',
				password: ''
			},
			rules: {
				name: [
					 { required: true, message: '请填写用户名', trigger: 'blur' }
				],
				password: [
					 { required: true, message: '请填写密码', trigger: 'blur' }
				]
			},
			loading: false,
		}
	},
	methods: {
		submit: function(){
			this.$refs['detail'].validate((valid) => {
	          	if (valid) {
					this.add();
	          	} else {
	            	return false;
	          	}
	        });
		},
		add: function(){
			var _this = this;
			this.loading = true;
			this.$http.post('/api/admin/add', {
				name: this.info.name,
				password: this.info.password,
			}).then(function(res){
				this.loading = false;
				if(res.data.status == 'success'){
					this.$message.success(res.data.msg);
					setTimeout(function(){
						_this.$router.push({
							name: 'user-list'
						})
					}, 1000)
				}else{
					this.$message.error(res.data.msg);
				}
			})
		}
	}
}	
</script>