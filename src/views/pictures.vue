<style>
.img-box{
	overflow: hidden;
	padding-bottom: 2px;
}
.img-list{
	border:1px solid #eee;
	padding: 10px;
	width: 200px;
	float: left;
	position: relative;
	margin-bottom: -1px;
	margin-right: -1px;
}
.img-list img{
	display: block;
}
.img-list .time{
	font-size: 12px;
	padding: 0;
	margin: 5px 0;
}
</style>
<template>
<div>
	<div class="img-box" v-loading.body="loading" element-loading-text="拼命加载中">
		<div class="img-list" v-for="item in tableData">
		    <img :src="'http://ojnlldqnx.bkt.clouddn.com/' + item.url + '?imageMogr2/thumbnail/200x150'" width="200" height="150">
		    <p class="time">上传时间：{{item.time}}</p>
		    <el-button type="success" size="mini" @click="look(item.url)">预览</el-button>
		    <el-button type="danger" size="mini" @click="dele(item.id, item.url)">删除</el-button>
		</div>
		<div v-if="tableData.length == 0">暂时没有图片</div>
	</div>
	<div style="padding: 20px;text-align: right;">
    	<el-pagination @current-change="handleCurrentChange" :current-page="page" :page-size="pageSize" layout="total, prev, pager, next" :total="total"></el-pagination>
    </div>
</div>	
</template>
<script>
export default{
	data: function(){
		return {
			dialogVisible: false,
			loading: false,
			tableData: [],
			page: 1,
			pageSize: 30,
			total: 0
		}
  	},
  	created: function(){
		this.getList();
	},
  	methods: {
  		look: function(url){
  			window.open('http://ojnlldqnx.bkt.clouddn.com/' + url);
  		},
  		getList: function(){
			this.loading = true;
			this.$http.post('/api/pictures/list',{
				page: this.page,
				pageSize: this.pageSize
			}).then(function(res){
				this.loading = false;
				if(res.data.status == 'success'){
					this.tableData = res.data.data.list;
					this.total = res.data.data.total;
				}else{
					this.$message.error(res.data.msg);
				}
			})
		},
		dele: function(id, name){
			this.$confirm('确定删除图片吗？删除后不可恢复！！！', '提示', {
	         	confirmButtonText: '确定',
	          	cancelButtonText: '取消',
	          	type: 'warning'
	        }).then(() => {
	          	this.$http.post('/api/pictures/dele',{
	          		id: id,
	          		name: name
	          	}).then(function(res){
	          		if(res.data.status == 'success'){
	          			this.$message.success(res.data.msg);
	          			this.getList();
	          		}else{
	          			this.$message.error(res.data.msg);
	          		}
	          	})
	        })
		},
		handleCurrentChange: function(val){
			this.page = val;
			this.getList();
		},
  	}
}	
</script>