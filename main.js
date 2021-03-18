import Vue from 'vue'
import App from './App'
import uView from 'uview-ui';
import store from './store'

//把vuex定义成全局组件
Vue.prototype.$store = store
Vue.config.productionTip = false

App.mpType = 'app'
Vue.use(uView);
const app = new Vue({
    ...App,
	//挂载
	store
})
app.$mount()
