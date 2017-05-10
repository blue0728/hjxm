<style>
body{
	padding: 0;
	margin: 0;
	word-break: break-all;
    word-wrap: break-word;
    box-sizing: border-box;
}
</style>
<template>
<div>
	<div v-loading.fullscreen.lock="fullscreenLoading">
		<top-menu :info.sync="info"></top-menu>
		<div v-if="info">
			<router-view style="padding: 20px;"></router-view>
		</div>
		<login v-if="!islogin"></login>
	</div>
</div>
</template>
<script>
import topMenu from './components/public/topMenu.vue'
import login from './components/login.vue'
export default{
	components: {
    	topMenu,
    	login
    },
	data: function(){
		return {
			islogin: true,
			info: null,
			fullscreenLoading: true
		}
	},
	created: function(){
		this.$http.get('/api/admin/info').then(function(res){
			if(res.data.status == 'success'){
				this.info = res.data.data
				this.islogin = true;
				this.fullscreenLoading = false;
			}else{
				this.islogin = false;
		        this.fullscreenLoading = false;
			}
		})
	}
}	
</script>
