import Vue from 'vue'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui'
import routers from './routers'
import App from './App.vue'
import store from './store'
import 'element-ui/lib/theme-default/index.css'

Vue.use(VueRouter)
Vue.use(ElementUI)

const router = new VueRouter({
	base: __dirname,
	routes: routers
});

const app = new Vue({
	store,
	router,
	render: h => h(App)
}).$mount('#app')