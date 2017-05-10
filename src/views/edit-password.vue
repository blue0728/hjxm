<template>
<div style="width:300px;">
	<h3>修改密码</h3>
	<el-form label-width="80px" :model="loginForm" :rules="rules" ref="edit-password">
	  	<el-form-item label="原密码" prop="oldPassword">
		    <el-input type="password" v-model="loginForm.oldPassword" placeholder="请填写原密码"></el-input>
		</el-form-item>
		<el-form-item label="新密码" prop="newPassword">
		    <el-input type="password" v-model="loginForm.newPassword" placeholder="请填写新密码"></el-input>
		</el-form-item>
		<el-form-item>
		    <el-button type="primary" @click="submit" :loading="loading">提交</el-button>
		</el-form-item>
	</el-form>
</div>	
</template>
<script>
export default{
	data: function(){
		return {
			loginForm: {
				oldPassword: '',
				newPassword: ''
			},
			rules: {
				oldPassword: [
		            { required: true, message: '请填写原密码', trigger: 'blur' }
		        ],
		        newPassword: [
		            { required: true, message: '请填写新密码', trigger: 'blur' }
		        ]
			},
			loading: false
		}
	},
	methods: {
		submit: function(){
			this.$refs['edit-password'].validate((valid) => {
	          	if (valid) {
					this.editPassword();
	          	} else {
	            	return false;
	          	}
	        });
		},
		editPassword: function(){
			var _this = this;
			this.loading = true;
			this.$http.post('/api/admin/edit-password', {
				password: this.loginForm.oldPassword,
				newPassword: this.loginForm.newPassword
			}).then(function(res){
				this.loading = false;
				if(res.data.status == 'success'){
					this.$message.success(res.data.msg);
					location.reload();
				}else{
					this.$message.error(res.data.msg);
				}
			})
		}
	}
}	
</script>