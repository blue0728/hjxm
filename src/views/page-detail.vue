<style>
.el-form-item__content #content{
	font-size: 14px;
    line-height: 100%;
}
</style>
<template>
<div>
	<h3>编辑页面</h3>
	<el-form ref="detail" :rules="rules" :model="info" label-width="100px">
		<el-form-item label="中文名称" prop="cname">
		    <el-input v-model="info.cname" placeholder="请填写页面中文名称"></el-input>
		</el-form-item>
		<el-form-item label="英文名称" prop="name">
		    <el-input v-model="info.name" placeholder="请填写页面英文名称"></el-input>
		</el-form-item>
		<el-form-item label="页面正文" prop="content">
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
import '../libs/ueditor/ueditor.config.js'
import '../libs/ueditor/ueditor.all.js'
import '../libs/ueditor/lang/zh-cn/zh-cn.js'
export default{
	data: function(){
		return {
			info: {
				cname: '',
				name: '',
				status: 'ON'
			},
			loading: false,
			rules: {
				cname: [
					 { required: true, message: '请填写页面中文名称', trigger: 'blur' }
				],
				name: [
					 { required: true, message: '请填写页面英文名称（数字/字母）', trigger: 'blur' }
				]
			},
			editor: null
		}
	},
	mounted: function(){
		this.editor = UE.getEditor('content', {
          	UEDITOR_HOME_URL: '/../../src/libs/ueditor/',
          	serverUrl:'/api/pictures/upload2ue',
          	autoHeight: false,
          	initialFrameHeight: '250',
          	toolbars: [[
		        'fullscreen', 'source', '|', 'undo', 'redo', '|',
		        'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
		        'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
		        'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
		        'directionalityltr', 'directionalityrtl', 'indent', '|',
		        'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase', '|',
		        'link', 'unlink', 'anchor', '|', 'imagenone', 'imageleft', 'imageright', 'imagecenter', '|',
		        'insertimage', 'emotion','template', '|',
		        'horizontal', 'date', 'time', 'spechars', '|',
		        'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', '|',
		         'preview', 'searchreplace', 'drafts', 'help'
		    ]]
	    });
	},
	destroyed: function(){
		this.editor.destroy();
	},
	created: function(){
		var _this = this;
		this.$http.post('/api/page/detail', {
			id: this.$route.params.id
		}).then(function(res){
			if(res.data.status == 'success'){
				this.info = res.data.data;
				this.editor.ready(function() {
				    _this.editor.setContent(_this.info.content);
				});
			}else{
				this.$message.error(res.data.msg);
			}
		})
	},
	methods: {
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
			var html = '';

			_this.editor.ready(function() {
			    html = _this.editor.getContent();
			});

			if(!html){
				this.$message.error('请填写页面正文');
				return;
			}

			this.loading = true;
			this.$http.post('/api/page/edit', {
				id: this.info.id,
				cname: this.info.cname,
				content: html,
				name: this.info.name,
				status: this.info.status
			}).then(function(res){
				this.loading = false;
				if(res.data.status == 'success'){
					this.$message.success(res.data.msg);
					setTimeout(function(){
						_this.$router.push({
							name: 'page-list'
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