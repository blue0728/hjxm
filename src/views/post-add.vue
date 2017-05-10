<template>
<div>
	<h3>添加文章</h3>
	<el-form ref="detail" :rules="rules" :model="info" label-width="100px">
		<el-form-item label="文章标题" prop="title">
		    <el-input v-model="info.title" placeholder="请填写文章标题"></el-input>
		</el-form-item>
		<el-form-item label="文章分类">
		     <el-select v-model="typeid" multiple filterable allow-create placeholder="请选择文章分类">
			    <el-option v-for="item in types" :label="item.name" :value="item.id"></el-option>
			</el-select>
		</el-form-item>
		<!-- <el-form-item label="文章作者" prop="author">
		    <el-input v-model="info.author" placeholder="请填写文章作者"></el-input>
		</el-form-item> -->
		<el-form-item label="文章来源" prop="source">
		    <el-input v-model="info.source" placeholder="请填写文章来源"></el-input>
		</el-form-item>
		<el-form-item label="封面图" prop="cover">
			<el-upload action="/api/pictures/upload" list-type="picture-card" :before-upload="beforeUpload" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-success="handlSuccess" :file-list="info.fileList">
		    	<i class="el-icon-plus"></i>
				<div class="el-upload__tip" slot="tip">只能上传jpg/png/gif文件，且不超过8M，只保留第一张图片</div>
			</el-upload>
		</el-form-item>
		<el-form-item label="文章正文" prop="content">
		    <div id="content"></div>
		</el-form-item>
		<el-form-item label="状态" prop="status">
			 <el-select v-model="info.status">
			    <el-option value="OFF" label="下线"></el-option>
			    <el-option value="ON" label="上线"></el-option>
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
			dialogImageUrl: '',
        	dialogVisible: false,
			types: [],
			typeid: [],
			info: {
				title: '',
				//author: '',
				source: '',
				status: 'ON',
				fileList: [],
				image: ''
			},
			loading: false,
			rules: {
				title: [
					 { required: true, message: '请输入文章标题', trigger: 'blur' }
				]
			},
			editor: null
		}
	},
	mounted: function(){
        this.editor = UE.getEditor('content');
	},
	look: function(url){
		window.open(url);
	},
	destroyed: function(){
		this.editor.destroy();
	},
	created: function(){
		this.getTypes();
	},
	methods: {
		handleRemove: function(file, fileList){
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
		getTypes: function(){
			this.$http.post('/api/types/list').then(function(res){
				if(res.data.status == 'success'){
					this.types = res.data.data.list
				}else{
					this.$message.error(res.data.msg);
				}
			})
		},
		submit: function(){
			this.$refs['detail'].validate((valid) => {
	          	if (valid) {
					this.add();
	          	} else {
	            	return false;
	          	}
	        });
		},
		beforeUpload: function(){
			this.uploading = true;
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
		add: function(){
			var _this = this;
			var html = '';

			_this.editor.ready(function() {
			    html = _this.editor.getContent();
			});
			this.loading = true;
			this.$http.post('/api/post/add', {
				title: this.info.title,
				content: html,
				source: this.info.source,
				//author: this.info.author,
				status: this.info.status,
				cover: this.info.image.split(',')[0],
				typeid: this.typeid.join(',')
			}).then(function(res){
				this.loading = false;
				if(res.data.status == 'success'){
					this.$message.success(res.data.msg);
					setTimeout(function(){
						_this.$router.push({
							name: 'post-list'
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