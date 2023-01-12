<template>
	<view>
		<view class="" :top="top"></view>
	</view>
</template>
<script>
	import {getInfo} from '@/lib/common.js'
	import {getCurrentNo,getload,getDownload} from '@/lib/updata.js'
	//腾讯Bugly
	// const bugly = uni.requireNativePlugin("LX-Bugly")
	// #ifdef APP-PLUS
	let midiModule = uni.requireNativePlugin("XM-Midi2")
	// #endif
	export default {
		onLaunch: function() {
			//获取屏幕尺寸
			this.getsize()
			//异常上报
			// bugly.init("d0dae9d8fd")
			//网络
			this.getNetworkType()
			// #ifdef APP-PLUS
			//锁定屏幕方向 横屏
			plus.screen.lockOrientation('landscape-primary')
			//检查是否有midi设备
			this.midiDevices('connect')
			// #endif
			//检查版本
			this.version();
			//查看用户缓存
			let user = uni.getStorageSync('user')
			if (user) {
				this.globalData.login = true
				this.globalData.logindata = user
			}
			this.globalData.launch = true
		},
		onShow: function() {
			//预加载曲谱页
			uni.preloadPage({
				url: "/pages/musicxml/musicxml"
			});
		},
		onHide: function() {
			// console.log('App Hide')
		},
		//全局配置
		globalData: {
			width:'',
			height:'',
			launch:false, //应用是否启动
			logindata:[], //登录数据
			login:false, //登录成功
			loginPageOpen:false ,//是否打开登录页面
			hotkey:'',//搜索关键词列表
			updata:[],//提交版本更新数据
			midi:[], //发送midi指令返回信息
		},
		methods:{
			//获取网络
			getNetworkType(){
				let that = this
				uni.getNetworkType({
					success: (res) => {
						this.$store.state.networkType = res.networkType
						if (res.networkType == 'none') {
							uni.showModal({
								title:'提示',
								content:'网络未连接，请检查！',
								showCancel:false,
								success:function(res){}
							})
						} else {
							that.connectSocket()
						}
					},
					complete: (res) => {
						//监听网络变化
						uni.onNetworkStatusChange(function (res) {
							this.$store.state.networkType = res.networkType
							if (res.networkType == 'none') {
								uni.showModal({
									title:'提示',
									content:'网络未连接，请检查！',
									showCancel:false,
									success:function(res){}
								})
							} else {
								that.connectSocket()
							}
						});
					}
				})
			},
			//连接socket
			connectSocket(){
				let mac = getInfo('mac')
				// 创建WebSocket连接
				const socket = uni.connectSocket({
					url: this.$wss,
					success:res=>{
						this.$store.state.socket = true
					},
					fail:res=>{
						this.$store.state.socket = false
					}
				});
				//监听WebSocket连接打开，打开后，发送设备绑定
				uni.onSocketOpen(function (res) {
					uni.sendSocketMessage({
						data:JSON.stringify({
							type:'bind',
							mac:mac,
						})
					})
				});
				//收到Socket消息
				uni.onSocketMessage(function(res){
					let data = JSON.parse(res.data)
					if (data.type !== undefined) {
						switch (data.type){
							case 'bind': //绑定成功，定时发送心跳
								setInterval(() => {
									uni.sendSocketMessage({
										data:JSON.stringify({
											type:'ping',
										})
									})
								}, 30000);
								break;
							case 'login': //登录成功
								// console.log(data.data)
								getApp().globalData.login = true
								getApp().globalData.logindata = data.data
								uni.setStorageSync('user',data.data) 
								uni.setStorageSync('tokenTime',data.data.time)
								//判断是否有打开登录页，如果有打开，则返回上一页
								if (getApp().globalData.loginPageOpen) {
									uni.navigateBack({})
								}
								break;
							default:
								break;
						}
					}
					
				})
				//异常，Socket重连或做其它操作(还有问题)
				uni.onSocketError(function (res) {
					this.$store.state.socket = false
					let that = this
					//掉线，等30秒后重连
					setTimeout(function() {
						that.connectSocket()
					}, 5000);
				});
			},
			// 获取屏幕尺寸
		    getsize(){
				uni.getSystemInfo({
					success: function(res){
						getApp().globalData.width = res.windowWidth
						getApp().globalData.height = res.windowHeight
					}
				})
			},
			//获取版本更新
			version(){
				this.$request({
					url: '/piano/update/index.html',
					data:{
						width:getApp().globalData.width,
						height:getApp().globalData.height,
					},
					method: 'POST',
				}).then(res => {
					if (res.data.code == 1009) {
						var force = false
						if (res.data.data.v_force == 0) {
							force = false
						} else {
							force = true
						}
						getApp().globalData.updata = {"versionCode":res.data.data.v_version_code,"versionName":res.data.data.v_name,"versionInfo":res.data.data.v_description,"forceUpdate":force,"downloadUrl":res.data.data.v_path}
						//判定是否为强制更新，强制更新则跳过提示
						if (force) {
							getDownload(getApp().globalData.updata)
						} else {
							getload(getApp().globalData.updata)
						}
					}		
				});
			},
			//连接&断开MIDI设备
			midiDevices(type,data='') {
				switch (type){
					case 'connect': //连接
						midiModule.connect((res) => {
							if (res.success) {
								this.$store.state.midiDevice = true
								//连接后，先暂停接收
								try {midiModule.suspendMidiDevices()} catch(e) {}
							} else {
								this.$store.state.midiDevice = false
							}
						}, (data)=> {
							this.globalData.midi = data
							if (data.msg == 'onMidiNoteOn') {
								uni.$emit('noteOn',{note:data.data.note})
							} else if (data.msg == 'onMidiNoteOff') {
								uni.$emit('noteOff',{note:data.data.note});
							} else {
								uni.$emit('midi',{data:data.data})
							}
						})
						break;
					case 'suspend': //暂停
						try {midiModule.suspendMidiDevices()} catch(e) {}
						break;
					case 'resume': //恢复
						try {midiModule.resumeMidiDevices()} catch(e) {}
						break;
					case 'msg':
						try {
							midiModule.sendMidiSystemExclusive({
								cable: 0xF0,
								systemExclusive: data
							}, (ret) => {
								
							})
						} catch(e) {
							
						}
						break;
					default: //断开
						try {midiModule.disconnect((ret) => {})} catch(e) {}
						break;
				}
			},
		}
	}
</script>

<style>
/* #ifndef APP-PLUS-NVUE */
	/*每个页面公共css */
	page{
		width:100%;
		height:100%;
		overflow: hidden;
		color:#fff;
		font-size:14px;
		/* background: url('@/static/appbg_ipad.png') no-repeat; */
	}
	ul{
		padding:0;
	}
	ul li{
		list-style: none;
	}
	#app{
		width:100%;
		height:100%;
	}
	uni-page-head{
		display: none;
	}
	.uni-page-head{
		display: none;
	}
	.content{
		width:100%;
		height:auto;
		margin:0 auto;
	}
	.clearfix:after {
		visibility: hidden;
		display: block;
		font-size: 0;
		content: " ";
		clear: both;
		height: 0;
	}
	.clearfix{
		/* *zoom:1; */
	}
/* #endif */
</style>
