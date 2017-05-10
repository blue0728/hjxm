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
	<h3>添加轮播图</h3>
	<el-form ref="detail" :rules="rules" :model="info" label-width="100px">
		<el-form-item label="标题" prop="name">
		    <el-input v-model="info.name" placeholder="请填写标题"></el-input>
		</el-form-item>
		<el-form-item label="链接地址" prop="url">
		    <el-input v-model="info.url" placeholder="请填写链接地址"></el-input>
		</el-form-item>
		<el-form-item label="照片" prop="photos">
			<div style="display: flex;">
				<span class="thumbnail" v-for="(item, index) in info.fileList" :key="index">
					<img :src="item.url + '?imageMogr2/thumbnail/100x100'" @click="look(item.url)">
					<i class="el-icon-circle-close" @click="deleImg(item.name)"></i>
				</span>
				<span v-if="uploading" class="thumbnail"><i class="el-icon-loading"></i>上传中...</span>
			</div>
		    <el-upload action="/api/pictures/upload" :before-upload="beforeUpload" :show-upload-list="showUploadList" :on-success="handlSuccess" :default-file-list="info.fileList">
			  	<el-button size="small" type="primary">点击上传</el-button>
			  	<div class="el-upload__tip" slot="tip">只能上传jpg/png/gif文件，且不超过8M，只保留第一张图片</div>
			</el-upload>
		</el-form-item>
		<el-form-item label="状态" prop="status">
			 <el-select v-model="info.status">
			    <el-option value="OFF" label="上线"></el-option>
			    <el-option value="ON" label="下线"></el-option>
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
				url: '',
				photos: '',
				status: 'OFF',
				fileList: []
			},
			rules: {
				name: [
					 { required: true, message: '请输入标题', trigger: 'blur' }
				],
				url: [
					 { required: true, message: '请输入URL地址', trigger: 'blur' }
				],
				photos: [
					 { required: true, message: '请上传照片', trigger: 'blur' }
				],
				status: [
					 { required: true, message: '请选择状态', trigger: 'change' }
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
			this.$http.post('/api/adver/add', {
				name: this.info.name,
				url: this.info.url,
				image: this.info.photos,
				status: this.info.status
			}).then(function(res){
				this.loading = false;
				if(res.data.status == 'success'){
					this.$message.success(res.data.msg);
					setTimeout(function(){
						_this.$router.push({
							name: 'ad-list'
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