<template>
<div>欢迎您使用~</div>	
</template>
<script>
export default{
	created: function(){
		this.$confirm('确定退出系统?', '提示', {
         	confirmButtonText: '确定',
          	cancelButtonText: '取消',
          	type: 'warning'
        }).then(() => {
          	this.$http.post('/api/admin/logout').then(function(res){
          		if(res.data.status == 'success'){
          			location.href = '/'
          		}else{
                    this.$message.error(res.data.msg);
                }
          	})
        })
	}
}	
</script>