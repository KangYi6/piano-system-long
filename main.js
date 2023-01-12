import App from './App'

//引入封装的axios
import request from './lib/request.js'
import store from './lib/store.js'
//引入弹窗组件
import msg from './components/layer/msg.vue';
import alert from './components/layer/alert.vue';
import top from './components/top/top.vue';

// #ifndef VUE3
import Vue from 'vue'
//挂载组件
Vue.component('msg',msg)
Vue.component('alert',alert)
Vue.component('top',top)

Vue.config.productionTip = false

//安装插件
// Vue.use(request)
//全局挂载axios 
Vue.prototype.$request = request
Vue.prototype.$store = store
//测试Socket地址  
// Vue.prototype.$wss = 'wss://testmusic.thedream.tech/websocket'
//正式Socket地
Vue.prototype.$wss = 'ws://118.31.127.186:2348'


App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif

// import App from './App'
// //引入封装的axios
// import request from './lib/request.js'
// //引入弹窗组件
// import msg from './components/layer/msg.vue';
// import alert from './components/layer/alert.vue';
// // 引入页面顶部公共显示组件
// import top from './components/top/top.vue';


// // #ifndef VUE3
// import Vue from 'vue'
// Vue.config.productionTip = false
// // 注册全局组件
// App.mpType = 'app'
// const app = new Vue({
//     ...App
// })
// app.$mount()
// // #endif

// // #ifdef VUE3
// import { createSSRApp } from 'vue'
// export function createApp() {
// 	const app = createSSRApp(App)
// 	app.component({
// 		'msg':msg,
// 		'alert':alert,
// 		'top':top,
// 	})
// 	//全局挂载axios
// 	app.config.globalProperties.$request = request
// 	app.config.globalProperties.$baseUrl = 'https://testmusic.thedream.tech' //测试服务器接口
// 	// app.config.globalProperties.$baseUrl = 'http://192.168.1.113:81' //本地接口
// 	// app.config.globalProperties.$baseUrl = 'http://music.thedream.tech' //正式服务器接口
// 	app.config.globalProperties.$wss = 'wss://testmusic.thedream.tech/websocket' //测试Socket地址
// 	// app.config.globalProperties.$wss = 'ws://music.thedream.tech:/webcoket' //正式Socket地址
// 	return {
// 		app
// 	}
// }
// // #endif