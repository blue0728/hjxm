<template>
<div>
	<el-menu :router=true theme="dark" default-active="1" class="el-menu-demo" mode="horizontal">
	  	<el-menu-item index="/">首页</el-menu-item>
		<el-menu-item v-if="info" index="/page-list">页面管理</el-menu-item>
		<el-menu-item v-if="info" index="/types">分类管理</el-menu-item>
	  	<el-submenu v-if="info" index="ad">
		    <template slot="title">轮播管理</template>
		    <el-menu-item index="/ad-list">轮播列表</el-menu-item>
		    <el-menu-item index="/ad-add">添加轮播</el-menu-item>
		</el-submenu>
	  	<el-submenu v-if="info" index="post">
		    <template slot="title">文章管理</template>
		    <el-menu-item index="/post-list">文章列表</el-menu-item>
		    <el-menu-item index="/post-add">添加文章</el-menu-item>
		</el-submenu>
		<el-submenu v-if="info" index="member">
		    <template slot="title">纹绣师管理</template>
		    <el-menu-item index="/member-list">纹绣师列表</el-menu-item>
		    <el-menu-item index="/member-add">添加纹绣师</el-menu-item>
		</el-submenu>
		<el-menu-item v-if="info" index="/message-list">查看留言</el-menu-item>
		<el-menu-item v-if="info" index="/pictures">图片管理</el-menu-item>
	  	<el-submenu v-if="info" index="login" style="float: right;margin-right:30px;">
		    <template slot="title">欢迎您，{{info.name}}</template>
		    <el-menu-item v-if="info.level == 1" index="/user-list">用户管理</el-menu-item>
			<el-menu-item v-if="info.level == 1" index="/system-log">系统日志</el-menu-item>
		    <el-menu-item index="/edit-password">修改密码</el-menu-item>
		    <el-menu-item index="/logout">退出</el-menu-item>
		</el-submenu>
	</el-menu>
</div>	
</template>
<script>
export default {
	props: ['info']
}
</script>