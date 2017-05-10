<style>
.thumbnail{
	width: 100px;
	height: 100px;
	border: 1px solid #eee;
	border-radius: 2px;
	padding: 10px;
	display: inline-block;
	margin: 0 10px 10px 0;
	text-align: center;
	line-height: 100px;
	position: relative;
}	
.thumbnail i.el-icon-circle-close{
	position: absolute;
	right: -5px;
    top: -5px;
    cursor: pointer;
}
.thumbnail img{
	cursor: pointer;
	display: block;
	width: 100px;
	height: 100px;
}
</style>
<template>
<div>
	<h3>添加纹绣师</h3>
	<el-form ref="detail" :rules="rules" :model="info" label-width="100px">
		<el-form-item label="姓名" prop="name">
		    <el-input v-model="info.name" placeholder="请填写姓名"></el-input>
		</el-form-item>
		<el-form-item label="性别" prop="sex">
		    <el-select v-model="info.sex">
			    <el-option value="1" label="男"></el-option>
			    <el-option value="2" label="女"></el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="年龄" prop="age">
		    <el-input v-model="info.age" placeholder="请填写年龄"></el-input>
		</el-form-item>
		<el-form-item label="居住地址" prop="address">
		    <el-input type="textarea" v-model="info.address" placeholder="请填写居住地址"></el-input>
		</el-form-item>
		<el-form-item label="出生日期" prop="date">
			<el-date-picker v-model="info.date" type="date" placeholder="选择日期"></el-date-picker>
		</el-form-item>
		<el-form-item label="电子邮箱" prop="email">
		    <el-input v-model="info.email" placeholder="请填写email"></el-input>
		</el-form-item>
		<el-form-item label="照片" prop="photos">
			<div style="display: flex;">
				<span class="thumbnail" v-for="(item, index) in info.fileList" :key="index">
					<img :src="item.url + '?imageMogr2/thumbnail/100x100'" @click="look(item.url)">
					<i class="el-icon-circle-close" @click="deleImg(item.name)" ></i>
				</span>
				<span v-if="uploading" class="thumbnail"><i class="el-icon-loading"></i>上传中...</span>
			</div>
		    <el-upload action="/api/pictures/upload" :before-upload="beforeUpload" :show-upload-list="showUploadList" :on-success="handlSuccess" :default-file-list="info.fileList">
			  	<el-button size="small" type="primary">点击上传</el-button>
			  	<div class="el-upload__tip" slot="tip">只能上传jpg/png/gif文件，且不超过8M</div>
			</el-upload>
		</el-form-item>
		<el-form-item label="手机号码" prop="phone">
		    <el-input v-model="info.phone" placeholder="请填写手机号码"></el-input>
		</el-form-item>
		<el-form-item label="QQ号码" prop="qq">
		    <el-input v-model="info.qq" placeholder="请填写QQ号码"></el-input>
		</el-form-item>
		<el-form-item label="个人履历" prop="introduce">
		    <el-input type="textarea" autosize v-model="info.introduce" placeholder="请填写个人履历"></el-input>
		</el-form-item>
		<el-form-item label="类型" prop="type">
			 <el-select v-model="info.type">
			    <el-option value="REGISTER" label="本站注册"></el-option>
			    <el-option value="STUDENT" label="内部学员"></el-option>
			    <el-option value="STAFF" label="内部员工"></el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="状态" prop="status">
			 <el-select v-model="info.status">
			    <el-option value="REVIEW" label="待审核"></el-option>
			    <el-option value="REFUSE" label="拒绝"></el-option>
			    <el-option value="ADOPTA" label="通过"></el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="级别" prop="level">
			 <el-select v-model="info.level">
			    <el-option value="1" label="初级认证"></el-option>
			    <el-option value="2" label="医院认证"></el-option>
			    <el-option value="3" label="高级认证"></el-option>
			</el-select>
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
			imagePrefix: 'http://ojnlldqnx.bkt.clouddn.com/',
			uploading: false,
			showUploadList: false,
			loading: false,
			info: {
				name: '',
				sex: '1',
				age: '',
				date: '',
				email: '',
				phone: '',
				photos: '',
				qq: '',
				introduce: '',
				status: 'ADOPTA',
				type: 'STUDENT',
				level: '1',
				fileList: []
			},
			rules: {
				name: [
					 { required: true, message: '请输入姓名', trigger: 'blur' }
				],
				sex: [
					 { required: true, message: '请选择性别', trigger: 'blur' }
				],
				age: [
					 { required: true, message: '请填写年龄', trigger: 'blur' }
				],
				date: [
					 {type: 'date', required: true, message: '请选择出生日期', trigger: 'change' }
				],
				email: [
					 { required: true, message: '请添加邮箱', trigger: 'blur' }
				],
				phone: [
					 { required: true, message: '请填写手机号码', trigger: 'blur' }
				],
				photos: [
					 { required: true, message: '请上传照片', trigger: 'blur' }
				],
				address: [
					 { required: true, message: '请填写居住地址', trigger: 'blur' }
				],
				qq: [
					 { required: true, message: '请填写QQ号码', trigger: 'blur' }
				],
				introduce: [
					 { required: true, message: '请填写个人履历', trigger: 'blur' }
				],
				status: [
					 { required: true, message: '请选择状态', trigger: 'change' }
				],
				type: [
					 { required: true, message: '请选择类型', trigger: 'change' }
				],
				level: [
					 { required: true, message: '请填选择级别码', trigger: 'change' }
				]
			}
		}
	},
	methods: {
		look: function(url){
  			window.open(url);
  		},
		deleImg: function(url){
			this.info.fileList = this.info.fileList.filter((item) => {
				return item.name != url;
			})
			var arr = this.info.photos.split(',').filter((item) => {
				return item != url
			})
			this.info.photos = arr.join(',');
		},
		beforeUpload: function(){
			this.uploading = true;
		},
	    handlSuccess: function(response, file, fileList){
	    	this.uploading = false;
	    	if(response.status == 'success'){
	    		if(this.info.photos == ''){
	    			this.info.photos = response.url;
	    		}else{
	    			this.info.photos += ',' + response.url;
	    		}
	    		this.info.fileList.push({
	    			name: response.url,
	    			url: this.imagePrefix + response.url
	    		});
	    	}else{
	    		this.$message.error(response.msg);
	    	}
	    },
		formatTime: function (date) {
			var _this = this;
			var year = date.getFullYear()
			var month = date.getMonth() + 1
			var day = date.getDate()
			return [year, month, day].map(_this.formatNumber).join('-')
		},
		formatNumber: function(n) {
			n = n.toString()
			return n[1] ? n : '0' + n
		},
		submit: function(){
			this.$refs['detail'].validate((valid) => {
	          	if (valid) {
					this.edit();
	          	} else {
	            	return false;
	          	}
	        });
		},
		edit: function(){
			var _this = this;
			this.loading = true;
			this.$http.post('/api/member/add', {
				name: this.info.name,
				age: this.info.age,
				sex: this.info.sex,
				email: this.info.email,
				phone: this.info.phone,
				qq: this.info.qq,
				date: this.formatTime(new Date(this.info.date)),
				address: this.info.address,
				photos: this.info.photos,
				introduce: this.info.introduce,
				type: this.info.type,
				level: this.info.level,
				status: this.info.status,
			}).then(function(res){
				this.loading = false;
				if(res.data.status == 'success'){
					this.$message.success(res.data.msg);
					setTimeout(function(){
						_this.$router.push({
							name: 'member-list'
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