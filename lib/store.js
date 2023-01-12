// 注册vuex
import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
		render:'', //曲谱是否加载完，主要用于控制收到midi后，是否进行判断处理
		operation:'', //闯关弹窗操作
		metronome:'1', //节拍器触发
		networkType:'none', //网络连接类型及状态
		midiDevice:false, //MIDI设备
		socket:false, //心跳
		mode:'', //选择弹奏模式，staff五线谱，waterfall瀑布流
		xmlInfo:{
			ptype:'', //课程类型
			pid:0, //课程id
			cid:0, //课时id
			id:0, //曲谱id
			cwid:0, //课件id
			path:'', //曲谱地址
			title:'', //曲谱标题
		},
		xmlParam:{ //曲谱参数(课程)
			pass:80,
			mode:false,
			hands:0,
			metronome:false,
			tempo:100,
			keytips:'auto'
		},
		course:{
			"content":{}, //课件内容
			"index":0, //当前索引
			"show":true, //是否显示
			"pid":0, //产品ID
			"prevType":'', //课件类型(上一个)，课件相同时，可以不用切换页面
		},
		//由于曲谱是预加载页，只能navigateBack才能保证不被销毁，所以在课件切换时，曲谱页会先返回到课程详情页，在onShow时，获取当前值，再判断，是否需要打开上一个/下一个课件
		excessive:'',
		timbre: '大钢琴', //音色
		level:3,//wifi信号
	}, // 存放数据
    getters: {}, // 计算属性
    mutations: {}, // 修改state中数据的一些方法
    actions: {}, // 异步方法
    modules: {} // store模块
})
// 暴露实例
export default store