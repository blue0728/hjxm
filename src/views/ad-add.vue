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
		<el-form-item label="图片" prop="image">
		    <el-upload action="/api/pictures/upload" list-type="picture-card" :before-upload="beforeUpload" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-success="handlSuccess" :file-list="info.fileList">
		    	<i class="el-icon-plus"></i>
				<div class="el-upload__tip" slot="tip">只能上传jpg/png/gif文件，且不超过8M，只保留第一张图片</div>
			</el-upload>
		</el-form-item>
		<el-form-item label="状态" prop="status">
			 <el-select v-model="info.status">
			    <el-option value="ON" label="上线"></el-option>
			    <el-option value="OFF" label="下线"></el-option>
			</el-select>
		</el-form-item>
		<el-form-item>
		    <el-button type="primary" @click="submit" :loading="loading">提交</el-button>
		</el-form-item>
	</el-form>
	<el-dialog v-model="dialogVisible" size="tiny">
	  <img width="100%" :src="dialogImageUrl" alt="">
	</el-dialog>
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
			dialogImageUrl: '',
        	dialogVisible: false,
			info: {
				name: '',
				url: '',
				image: '',
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
				image: [
					 { required: true, message: '请上传照片', trigger: 'blur' }
				],
				status: [
					 { required: true, message: '请选择状态', trigger: 'change' }
				]
			}
		}
	},
	methods: {
		beforeUpload: function(){
			this.uploading = true;
		},
		handleRemove(file, fileList) {
			this.info.fileList = this.info.fileList.filter((item) => {
				return item.name != file.name;
			})
			var arr = this.info.image.split(',').filter((item) => {
				return item != file.name
			})
			this.info.image = arr.join(',');
	    },
		handlePictureCardPreview(file) {
	        this.dialogImageUrl = file.url;
	        this.dialogVisible = true;
	     },
	    handlSuccess: function(response, file, fileList){
	    	this.uploading = false;
	    	if(response.status == 'success'){
	    		if(this.info.image == ''){
	    			this.info.image = response.url;
	    		}else{
	    			this.info.image += ',' + response.url;
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
				image: this.info.image.split(',')[0],
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