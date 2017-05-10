<style>
.el-form-item__content #content{
	font-size: 14px;
    line-height: 100%;
}
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
</div>	
</template>
<script>
export default{
	data: function(){
		return {
			imagePrefix: 'http://ojnlldqnx.bkt.clouddn.com/',
			uploading: false,
			showUploadList: false,
			types: [],
			typeid: [],
			info: {
				title: '',
				//author: '',
				source: '',
				status: 'ON',
				fileList: [],
				photos: ''
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
				cover: this.info.photos,
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