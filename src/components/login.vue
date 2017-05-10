<style>
.login-box{
	margin-top: 100px;
	padding: 24px;
	margin-bottom: -22px;
	border: 1px solid #eaeefb;
	border-radius: 4px;
	box-shadow: 0 0 8px 0 rgba(232,237,250,.6), 0 2px 4px 0 rgba(232,237,250,.5);
}	
</style>
<template>
<div>
	<el-row type="flex" justify="center">
	  	<el-col class="login-box" :span="6">
	  		<el-form label-width="80px" :model="loginForm" :rules="rules" ref="login">
			  	<el-form-item label="用户名" prop="name">
				    <el-input v-model="loginForm.name" placeholder="请填写用户名"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
				    <el-input type="password" v-model="loginForm.password" placeholder="请填写密码"></el-input>
				</el-form-item>
				<el-form-item>
				    <el-button type="primary" @click="submit">提交</el-button>
				</el-form-item>
			</el-form>
	  	</el-col>
	</el-row>
</div>	
</template>
<script>
export default{
	data: function(){
		return {
			loginForm: {
				name: '',
				password: ''
			},
			rules: {
				name: [
		            { required: true, message: '请输入用户名', trigger: 'blur' }
		        ],
		        password: [
		            { required: true, message: '请输入密码', trigger: 'blur' }
		        ]
			},
			captchaObj: null		
		}
	},
	methods: {
		submit: function(){
			this.$http.post('/api/admin/login', {
				name: this.loginForm.name,
				password: this.loginForm.password
			}).then(function(res){
				if(res.data.status == 'success'){
					location.reload();
				}else{
					this.$message.error(res.data.msg);
				}
			})
		}
	}
}	
</script>