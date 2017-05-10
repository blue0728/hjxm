import Vue from 'vue'
import VueResource from 'vue-resource'

Vue.use(VueResource)
Vue.http.interceptors.push((request, next) => {

	request.emulateJSON = true
	request.credentials = true

	next((response) => {
		return response
	});
});

const baseUrl = ''

export default {
	// ajax 商品详情
	getDetails: (params) => {
		return Vue.resource(baseUrl + '/api/product/detail-cdn').get(params)
	}
}