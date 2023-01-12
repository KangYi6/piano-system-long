<template>
	<view></view>
</template>
<script>
	let app = getApp()
	// #ifdef APP-PLUS
	let midiModule = uni.requireNativePlugin("XM-Midi2")
	// #endif
	//瀑布流html
	let wv;
	//读取xml数据
	let dataWv;
	export default {
		data() {
			return {
				//调试距离
				debug:0,
				//全局数据
				globalData:getApp().globalData,
				//webview进度样式
				webviewStyles: {
					progress: {
						color: '#079FFF'
					},
				},
				//瀑布流webview
				webViewUrl:"/hybrid/html/waterfall/index.html",
				//曲谱地址
				path:"",
				//曲谱ID
				id:0,
				//课件ID
				cwid:0,
				//曲谱数据
				xmlData:{},
				//当前要弹的midi
				curMidi:[],
				//MIDI设备
				midiDevice:false,
				//需要传递到网页的数据
				webData:{
					//瀑布流数据
					codeRainArr:[],
					//结束MIDI
					endMidi:[],
					//标题
					title:'',
					//位置
					loc:[],
					//速度
					tempo:60,
					//拍号
					signature:[],
					//调式
					mode:'C',
					//格式化后的midi
					curMidi:[],
					playMidi:[],
					//数据是否准备完成
					ready:false,
				},
				//琴键坐标(长条屏)
				locLong:[
					{"x": -20,"w": 20,"line": 0}, //21
					{"x": -20,"w": 20,"line": 0}, //22
					{"x": -20,"w": 20,"line": 0}, //23
					{"x": -20,"w": 20,"line": 0}, //24
					{"x": -20,"w": 20,"line": 0}, //25
					{"x": 0,"w": 17,"line": 0}, //26 start
					{"x": 19,"w": 28,"line": 0}, //27
					{"x": 49,"w": 37,"line": 0}, //28
					{"x": 89,"w": 30,"line": 0}, //29
					{"x": 121,"w": 28,"line": 0}, //30
					{"x": 151,"w": 30,"line": 0}, //31
					{"x": 183,"w": 28,"line": 0}, //32
					{"x": 213,"w": 31,"line": 0}, //33
					{"x": 246,"w": 28,"line": 0}, //34
					{"x": 276,"w": 36,"line": 0}, //35
					{"x": 315,"w": 32,"line": 0}, //36
					{"x": 349,"w": 28,"line": 0}, //37
					{"x": 379,"w": 33,"line": 0}, //38
					{"x": 414,"w": 28,"line": 0}, //39
					{"x": 444,"w": 37,"line": 0}, //40
					{"x": 484,"w": 28,"line": 0}, //41
					{"x": 514,"w": 28,"line": 0}, //42
					{"x": 544,"w": 33,"line": 0}, //43
					{"x": 579,"w": 28,"line": 0}, //44
					{"x": 609,"w": 31,"line": 0}, //45
					{"x": 642,"w": 28,"line": 0}, //46
					{"x": 672,"w": 34,"line": 0}, //47
					{"x": 709,"w": 41,"line": 0}, //48
					{"x": 752,"w": 28,"line": 0}, //49
					{"x": 782,"w": 22,"line": 0}, //50
					{"x": 806,"w": 28,"line": 0}, //51
					{"x": 836,"w": 39,"line": 0}, //52
					{"x": 878,"w": 31,"line": 0}, //53
					{"x": 911,"w": 28,"line": 0}, //54
					{"x": 941,"w": 30,"line": 0}, //55
					{"x": 973,"w": 28,"line": 0}, //56
					{"x": 1003,"w": 30,"line": 0}, //57
					{"x": 1035,"w": 28,"line": 0}, //58
					{"x": 1065,"w": 36,"line": 0}, //59
					{"x": 1104,"w": 32,"line": 0}, //60
					{"x": 1138,"w": 28,"line": 0}, //61
					{"x": 1168,"w": 34,"line": 0}, //62
					{"x": 1204,"w": 28,"line": 0}, //63
					{"x": 1234,"w": 36,"line": 0}, //64
					{"x": 1273,"w": 27,"line": 0}, //65
					{"x": 1302,"w": 28,"line": 0}, //66
					{"x": 1332,"w": 31,"line": 0}, //67
					{"x": 1365,"w": 28,"line": 0}, //68
					{"x": 1395,"w": 34,"line": 0}, //69
					{"x": 1431,"w": 28,"line": 0}, //70
					{"x": 1461,"w": 35,"line": 0}, //71
					{"x": 1499,"w": 28,"line": 0}, //72
					{"x": 1529,"w": 28,"line": 0}, //73
					{"x": 1559,"w": 36,"line": 0}, //74
					{"x": 1597,"w": 28,"line": 0}, //75
					{"x": 1627,"w": 38,"line": 0}, //76
					{"x": 1668,"w": 31,"line": 0}, //77
					{"x": 1701,"w": 28,"line": 0}, //78
					{"x": 1731,"w": 30,"line": 0}, //79
					{"x": 1763,"w": 28,"line": 0}, //80
					{"x": 1793,"w": 31,"line": 0}, //81
					{"x": 1826,"w": 28,"line": 0}, //82
					{"x": 1856,"w": 34,"line": 0}, //83
					{"x": 1893,"w": 31,"line": 0}, //84
					{"x": 1926,"w": 28,"line": 0}, //85
					{"x": 1956,"w": 33,"line": 0}, //86
					{"x": 1991,"w": 28,"line": 0}, //87
					{"x": 2021,"w": 39,"line": 0}, //88
					{"x": 2063,"w": 29,"line": 0}, //89
					{"x": 2094,"w": 28,"line": 0}, //90
					{"x": 2124,"w": 32,"line": 0}, //91
					{"x": 2158,"w": 28,"line": 0}, //92
					{"x": 2188,"w": 32,"line": 0}, //93
					{"x": 2222,"w": 28,"line": 0}, //94
					{"x": 2252,"w": 33,"line": 0}, //95
					{"x": 2288,"w": 32,"line": 0}, //96
					{"x": 2322,"w": 28,"line": 0}, //97
					{"x": 2352,"w": 32,"line": 0}, //98
					{"x": 2386,"w": 28,"line": 0}, //99
					{"x": 2416,"w": 38,"line": 0}, //100
					{"x": 2457,"w": 30,"line": 0}, //101
					{"x": 2489,"w": 28,"line": 0}, //102
					{"x": 2519,"w": 35,"line": 0}, //103
					{"x": 2556,"w": 28,"line": 0}, //104 end
					{"x": 2560,"w": 20,"line": 0}, //105
					{"x": 2560,"w": 20,"line": 0}, //106
					{"x": 2560,"w": 20,"line": 0}, //107
					{"x": 2560,"w": 20,"line": 0}, //108
				],
				w:getApp().globalData.width/52, //白键宽度
				b:getApp().globalData.width*1.2/100, //黑键宽度
				//琴键坐标(标准屏)
				locStandard:[],
				//成绩
				score:{
					playNote:0,//按键次数
					playRight:0, //弹对次数
					timer:null, //计时器
					playTime:0, //弹奏用时
					//成绩提示
					tips:[
						'继续加油哦，请先保证准确率，慢慢来不要急。',
						'您的识谱得到很大提高，速度还需要加油。',
						'您的识谱准非常棒，速度再提高就完美了。',
						'你已经非常熟练了，控制节奏速度，就能弹出非常好听的歌曲。',
						'恭喜您熟练掌握这个曲谱，可以出去表演了',
					],
				},
				subNVue:null,
				standardLen:60, //代码雨长度
			}
		},
		onLoad(){
			// #ifdef APP-PLUS
			this.webData.title = this.$store.state.xmlInfo.title
			this.path = this.$store.state.xmlInfo.path
			this.id = this.$store.state.xmlInfo.id
			if (getApp().globalData.width < 1925) {
				this.locStandard = [
					{"x": 0,"w": this.w-this.b/2-1,"line":0},
					{"x": this.w-this.b/2,"w": this.b-1,"line":0},
					{"x": this.w-this.b/2 + this.b,"w": this.b+1,"line":0},
					{"x": this.w*2,"w": this.w-this.b/2,"line":0},
					{"x": this.w*3-this.b/2+1,"w": this.b-3,"line":0},
					{"x": this.w*3+this.b/2-1,"w": this.w-this.b,"line":0},
					{"x": this.w*4-this.b/2,"w": this.b-1,"line":0},
					{"x": this.w*4+this.b/2,"w": this.w-this.b/2-1,"line":0},
					{"x": this.w*5,"w": this.w-this.b/2-1,"line":0},
					{"x": this.w*6-this.b/2,"w": this.b-1,"line":0},
					{"x": this.w*6+this.b/2,"w": this.w-this.b,"line":0},
					{"x": this.w*7-this.b/2+1,"w": this.b-2,"line":0},
					{"x": this.w*7+this.b/2,"w": this.w-this.b,"line":0},
					{"x": this.w*8-this.b/2+1,"w": this.b-2,"line":0},
					{"x": this.w*8+this.b/2,"w": this.w-this.b/2-1,"line":0},
					{"x": this.w*9,"w": this.w-this.b/2,"line":0},
					{"x": this.w*10-this.b/2+1,"w": this.b-2,"line":0},
					{"x": this.w*10+this.b/2,"w": this.w-this.b,"line":0},
					{"x": this.w*11-this.b/2+1,"w": this.b-2,"line":0},
					{"x": this.w*11+this.b/2,"w": this.w-this.b/2-1,"line":0},
					{"x": this.w*12,"w": this.w-this.b/2-1,"line":0},
					{"x": this.w*13-this.b/2,"w": this.b-1,"line":0},
					{"x": this.w*13+this.b/2,"w": this.w-this.b,"line":0},
					{"x": this.w*14-this.b/2+1,"w": this.b-2,"line":0},
					{"x": this.w*14+this.b/2,"w": this.w-this.b,"line":0},
					{"x": this.w*15-this.b/2+1,"w": this.b-2,"line":0},
					{"x": this.w*15+this.b/2,"w": this.w-this.b/2-1,"line":0},
					{"x": this.w*16,"w": this.w-this.b/2,"line":0},
					{"x": this.w*17-this.b/2+1,"w": this.b-2,"line":0},
					{"x": this.w*17+this.b/2,"w": this.w-this.b,"line":0},
					{"x": this.w*18-this.b/2+1,"w": this.b-2,"line":0},
					{"x": this.w*18+this.b/2,"w": this.w-this.b/2,"line":0},
					{"x": this.w*19+1,"w": this.w-this.b/2-1,"line":0},
					{"x": this.w*20-this.b/2+1,"w": this.b-2,"line":0},
					{"x": this.w*20+this.b/2,"w": this.w-this.b,"line":0},
					{"x": this.w*21-this.b/2+1,"w": this.b-2,"line":0},
					{"x": this.w*21+this.b/2,"w": this.w-this.b,"line":0},
					{"x": this.w*22-this.b/2+1,"w": this.b-2,"line":0},
					{"x": this.w*22+this.b/2,"w": this.w-this.b/2-1,"line":0},
					{"x": this.w*23,"w": this.w-this.b/2,"line":0},
					{"x": this.w*24-this.b/2+1,"w": this.b-2,"line":0},
					{"x": this.w*24+this.b/2,"w": this.w-this.b,"line":0},
					{"x": this.w*25-this.b/2+1,"w": this.b-2,"line":0},
					{"x": this.w*25+this.b/2,"w": this.w-this.b/2-1,"line":0},
					{"x": this.w*26,"w": this.w-this.b/2-1,"line":0},
					{"x": this.w*27-this.b/2,"w": this.b-2,"line":0},
					{"x": this.w*27+this.b/2-1,"w": this.w-this.b,"line":0},
					{"x": this.w*28-this.b/2,"w": this.b-1,"line":0},
					{"x": this.w*28+this.b/2,"w": this.w-this.b,"line":0},
					{"x": this.w*29-this.b/2+1,"w": this.b-2,"line":0},
					{"x": this.w*29+this.b/2,"w": this.w-this.b/2-1,"line":0},
					{"x": this.w*30,"w": this.w-this.b/2,"line":0},
					{"x": this.w*31-this.b/2+1,"w": this.b-2,"line":0},
					{"x": this.w*31+this.b/2,"w": this.w-this.b,"line":0},
					{"x": this.w*32-this.b/2+1,"w": this.b-2,"line":0},
					{"x": this.w*32+this.b/2,"w": this.w-this.b/2-1,"line":0},
					{"x": this.w*33,"w": this.w-this.b/2,"line":0},
					{"x": this.w*34-this.b/2+1,"w": this.b-2,"line":0},
					{"x": this.w*34+this.b/2,"w": this.w-this.b,"line":0},
					{"x": this.w*35-this.b/2+1,"w": this.b-2,"line":0},
					{"x": this.w*35+this.b/2,"w": this.w-this.b,"line":0},
					{"x": this.w*36-this.b/2+1,"w": this.b-2,"line":0},
					{"x": this.w*36+this.b/2,"w": this.w-this.b/2-1,"line":0},
					{"x": this.w*37,"w": this.w-this.b/2,"line":0},
					{"x": this.w*38-this.b/2+1,"w": this.b-2,"line":0},
					{"x": this.w*38+this.b/2,"w": this.w-this.b-1,"line":0},
					{"x": this.w*39-this.b/2,"w": this.b-1,"line":0},
					{"x": this.w*39+this.b/2,"w": this.w-this.b/2-1,"line":0},
					{"x": this.w*40,"w": this.w-this.b/2-1,"line":0},
					{"x": this.w*41-this.b/2,"w": this.b-2,"line":0},
					{"x": this.w*41+this.b/2-1,"w": this.w-this.b,"line":0},
					{"x": this.w*42-this.b/2,"w": this.b-2,"line":0},
					{"x": this.w*42+this.b/2-1,"w": this.w-this.b,"line":0},
					{"x": this.w*43-this.b/2,"w": this.b-2,"line":0},
					{"x": this.w*43+this.b/2-1,"w": this.w-this.b/2,"line":0},
					{"x": this.w*44,"w": this.w-this.b/2,"line":0},
					{"x": this.w*45-this.b/2+1,"w": this.b-2,"line":0},
					{"x": this.w*45+this.b/2,"w": this.w-this.b,"line":0},
					{"x": this.w*46-this.b/2+1,"w": this.b-2,"line":0},
					{"x": this.w*46+this.b/2,"w": this.w-this.b/2-1,"line":0},
					{"x": this.w*47,"w": this.w-this.b/2,"line":0},
					{"x": this.w*48-this.b/2+1,"w": this.b-2,"line":0},
					{"x": this.w*48+this.b/2,"w": this.w-this.b,"line":0},
					{"x": this.w*49-this.b/2+1,"w": this.b-2,"line":0},
					{"x": this.w*49+this.b/2,"w": this.w-this.b,"line":0},
					{"x": this.w*50-this.b/2+1,"w": this.b-2,"line":0},
					{"x": this.w*50+this.b/2,"w": this.w-this.b/2-1,"line":0},
					{"x": this.w*51,"w": this.w,"line":0},
				]
			}
			var that = this
			setTimeout(function(){
				//读取xml数据
				dataWv = plus.webview.create('/hybrid/html/readxml/index.html?url='+that.path, '__data__', {
					opacity: 0,
					width: '0px',
					height: '0px',
					'uni-app': 'none',
					blockNetworkImage: true,
					webviewBGTransparent: true
				});
				dataWv.setBlockNetworkImage(true);
				dataWv.setContentVisible(false);
				dataWv.setVisible(false);
				dataWv.addEventListener('close', (res) => {});
				//打开瀑布流页面
				wv = plus.webview.create("/hybrid/html/waterfall/index.html","__waterfall__",{'uni-app': 'none'})
				var currentWebview = that.$scope.$getAppWebview();
				currentWebview.append(wv);
				//监听webview返回数据
				plus.globalEvent.addEventListener('plusMessage', (e) => {
					if (e.data.args.data.name == 'postMessage'){
						that.vwMessage(e.data.args.data.arg.action)
					}
				})
				//通过id获取nvue子窗体
				that.subNVue = uni.getSubNVueById('loading'); 
				that.subNVue.setStyle({
					zindex:99999,
				})
				that.subNVue.show('zoom-fade-out', 200,()=>{//第一个参数指定动画，我这里设置的是新窗体逐渐放大
					//第二个参数执行时间，第三个参数是执行完的回调
				})
			},1000);
			// #endif
		},
		onUnload() {
			//移除监听配置的原生子窗体
			uni.$off('loading');
		},
		onReady() {
			let that = this
			//监听MIDI数据
			uni.$on('noteOn',function(data){
				that.keyDonw(data.note)
			})
			uni.$on('noteOff',function(data){
				that.keyUp(data.note)
			})
		},
		onShow() {
			//获取nvue子窗口
			this.subNVue = uni.getSubNVueById('courseMenu')
			//默认隐藏
			this.subNVue.hide()
			//获取store数据，如果需要显示
			if (this.$store.state.course.show) {
				this.subNVue.show()
			}
		},
		methods: {
			//网页传递的信息
			vwMessage(obj){
				switch (obj.type){
					case 'suspend': //暂停接收midi
						//清理定时器
						clearInterval(this.score.timer)
						app.midiDevices('suspend')
						break;
					case 'resume': //恢复接收midi
						app.midiDevices('resume')
						break;
					case 'keydown':
						midiModule.sendMidiNoteOn({
							cable: 0,
							channel: 0,
							note: obj.data.key,
							velocity: obj.data.velocity
						}, (ret) => {
							// this.keyDonw(obj.data)
						})
						break;
					case 'keyup':
						//从当前midi中移除
						let index = this.curMidi.indexOf(obj.data);
						if(index > -1){
						    this.curMidi.splice(index,1);
						}
						midiModule.sendMidiNoteOff({
							cable: 0,
							channel: 0,
							note: obj.data,
							velocity: 0
						}, (ret) => {
							// this.keyDonw(obj.data)
						})
						break;
					case 'curMidi':
						//添加到当前midi中
						this.curMidi.push(obj.data);
						break;
					case 'back':
						//清理课程切换组件状态
						this.$store.state.course.show = false
						uni.navigateBack()
						break;
					case 'ready':
						this.readSuccess()
						break;
					case 'create':
						//清理定时器
						clearInterval(this.score.timer)
						//计时器清雨零
						this.score.playTime = 0
						//按键次数
						this.score.playNote = 0
						//弹对次数
						this.score.playRight = 0
						//重新创建方块
						this.createCodeRain('again')
						//暂停接收midi
						app.midiDevices('suspend')
						break;
					case 'start': //开始
						this.score.timer = setInterval(() => {
							this.score.playTime++
						}, 1000);
						//开始接收midi
						app.midiDevices('resume')
						break;
					case 'over': //结束
						//计算分数
						this.achievement(obj.data)
						break;
					default: //读取xml
						this.xmlData = JSON.parse(obj)
						//生成瀑布流所需数据
						this.createCodeRain('start')
						break;
				}
			},
			//xml读取并循环完成
			readSuccess(){
				//webview页面准备完成
				let that = this
				if (this.webData.ready) {
					//关闭subNVue
					uni.hideLoading()
					this.subNVue.hide();
					//传递数据
					this.createCodeRain('again')
				} else {
					setTimeout(function(){
						that.readSuccess()
					},1000)
				}
			},
			//创建瀑布流数据
			createCodeRain(type){
				if (type == 'start') {
					if (getApp().globalData.width > 1925) {
						this.webData.loc = this.locLong
					} else {
						this.webData.loc = this.locStandard
					}
					this.webData.tempo = this.xmlData.tempo
					this.webData.signature = this.xmlData.signature
					this.webData.mode = this.xmlData.mode
					let midi = this.xmlData.midi
					//要减去的时间(主要为了减去开始的休止符时间)
					let minusTime = -1
					//音符个数(先保存，提高for效率)
					let len = midi.length
					//小节线索引
					let measureIndex = 0
					for (let a = 0; a < len; a++) {
						let col = []
						let nMidi = []
						//开始不需要画小节线
						if (this.webData.codeRainArr.length) {
							//方块底部距离轨道顶部的距离
							let bottom = (midi[a][0].start - minusTime)*this.standardLen
							//画小节线
							for (let index = measureIndex; index < this.xmlData.measureTimes.length; index++) {
								if (this.xmlData.measureTimes[index] > midi[a][0].start) {
									break;
								} else if (this.xmlData.measureTimes[index] == midi[a][0].start) {
									measureIndex++
									let line = {
										//key
										key: 0,
										//X轴位置
										x : 0,
										//Y轴位置
										y : Number('-'+(1+bottom)) + this.debug, 
										//Y轴开始距离顶部的距离
										yLoc : bottom + this.debug, 
										//当前高度
										h : 1,
										//宽度
										w : getApp().globalData.width,
										//颜色
										color : "rgba(255,255,255,0.2)",
										//左右手
										hand : 0,
										velocity:0,
									}
									col.push(line)
									break;
								}
							}
						}
						for (let i = 0; i < midi[a].length; i++) {
							if (midi[a][i].pitch == 0) {
								continue
							} else {
								if (minusTime == -1) {
									minusTime = midi[a][i].start;
								}
								//颜色
								let color = "rgb(114,255,121)"
								if (midi[a][i].hand == 2) {
									color = "rgb(0,234,255)"
								}
								//计算方块高度
								let height = (midi[a][i].end - midi[a][i].start)*this.standardLen
								//方块底部距离轨道顶部的距离
								let bottomTop = (midi[a][i].start - minusTime)*this.standardLen
								//音符参数
								let note = {
									//key
									key: midi[a][i].pitch,
									//X轴位置
									x : this.webData.loc[(midi[a][i].pitch - 21)].x,
									//Y轴位置
									y : Number('-'+(height+bottomTop)) + this.debug, 
									//Y轴开始距离顶部的距离
									yLoc : bottomTop + this.debug, 
									//当前高度
									h : height,
									//宽度
									w : this.webData.loc[(midi[a][i].pitch - 21)].w,
									//颜色
									color : color,
									//左右手
									hand : midi[a][i].hand,
									//声音(暂时理解为力度)
									velocity : midi[a][i].velocity,
								}
								col.push(note)
								nMidi.push(note)
								//松开
								let up = {}
								//Y轴结束距离顶部的距离(松开的距离)
								up.key = midi[a][i].pitch
								up.yLoc = height + bottomTop - this.debug
								this.webData.endMidi.push(up)
							}
						}
						if (col.length) {
							this.webData.codeRainArr.push(col)
						}
						if (nMidi.length) {
							this.webData.curMidi.push(nMidi)
						}
					}
					//按松开的距离从小到大排序
					this.webData.endMidi.sort(this.compare("yLoc"))
					//添加结束标记
					this.webData.endMidi.push({key:-1})
					//添加结束标记
					this.webData.curMidi.push([{key:-1}])
					this.webData.playMidi = this.webData.curMidi
					this.webData.ready = true;
				} else {
					wv.evalJS("createCodeRain("+JSON.stringify(this.webData)+")")
				}
			},
			//数据排序
			compare(prop) {
				return function (obj1, obj2) {
					var val1 = obj1[prop]
					var val2 = obj2[prop]
					if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
						val1 = Number(val1)
						val2 = Number(val2)
					}
					if (val1 < val2) {
						return -1
					} else if (val1 > val2) {
						return 1
					} else {
						return 0
					}  
				} 
			},
			//计算成绩
			achievement(hand) {
				//计算用时
				let ii = Math.floor(this.score.playTime / 60)
				let ss = this.score.playTime % 60
				let time = (ii < 10 ? '0'+ii : ii)+'分'+(ss < 10 ? '0'+ss : ss)+'秒'
				//总音符数量
				let totalNote = this.xmlData.noteTotal
				if (hand == 2) {
					totalNote = this.xmlData.leftTotal
				} else if (hand == 1) {
					totalNote = this.xmlData.rightTotal
				}
				let accuracy = 0 //计算准确率(总音符/弹奏音符*100)
				let error = 0 //错误音符
				let score = 0 //得分
				let integral = 0 //积分(暂时无)
				if (true) { //跟弹
					if (this.score.playNote == 0) { //没有弹
						score = 0
						accuracy = 0
						error = this.score.playNote - this.score.playRight
					} else {
						accuracy = Number(parseFloat(this.score.playRight / this.score.playNote).toFixed(2)*100)
						error = this.score.playNote - this.score.playRight
						score = accuracy
					}
					// let playNote = this.xmlData.noteTotal
					// //如果弹的数量少于总数，则使用总数
					// if (this.score.playNote > this.xmlData.totalNote) {
					// 	playNote = this.score.playNote
					// }
					// accuracy = Number(parseFloat(this.score.playRight / playNote).toFixed(2)*100)
					// error = playNote - this.score.playRight
					// score = accuracy
				} else { //卡住
					accuracy = Number(parseFloat(totalNote / this.score.playNote).toFixed(2)*100)
					error = this.score.playNote - totalNote
					if (this.xmlData.standardTime > this.score.playTime) {
						score = Math.floor(accuracy*0.5 + 50)
					} else {
						score = Math.floor(accuracy*0.5 + (this.xmlData.standardTime / this.score.playTime)*50)
					}
				}
				//提示语
				let tips = this.score.tips[0]
				//判断时长倍数
				let multiple = parseFloat(this.score.playTime / this.xmlData.standardTime).toFixed(1)
				if (accuracy > 60 && accuracy < 90) {
					tips = this.score.tips[1]
				} else if (accuracy >= 90){
					if (multiple >= 3) {
						tips = this.score.tips[2]
					} else if (multiple > 3 && multiple < 1.5) {
						tips = this.score.tips[3]
					} else {
						tips = this.score.tips[4]
					}
				}
				//打败用户
				let fighting = 0
				let that = this
				this.$request({
					url: '/piano/index/fighting.html',
					data:{
						score:score,
						time:this.score.playTime,
						note:this.xmlData.noteTotal,
						right:this.score.playRight,
						title:this.webData.title,
						error:this.xmlData.noteTotal - this.score.playRight,
						m_id:this.id?this.id:0,
						cwid:this.cwid?this.cwid:0,
						type:3
					},
					method: 'POST'
				}).then((res) => {
					if (res.data.code == 1000) {
						let e = {}
						e.score = score,
						e.fighting = res.data.data
						e.accuracy = accuracy
						e.error = error
						e.tips = tips
						e.time = time
						wv.evalJS("score("+JSON.stringify(e)+")")
					}
				});
			},
			//收到琴键按下
			keyDonw(value){
				this.score.playNote++
				if (this.curMidi.indexOf(value) == -1) { //弹错
					wv.evalJS("keyDown("+value+",0)")
				} else { //弹对
					wv.evalJS("keyDown("+value+",1)")
					this.score.playRight++
				}
			},
			//收到琴键松开
			keyUp(value){
				wv.evalJS("keyUp("+value+")")
			},
		},
		beforeDestroy(){
			//移除MIDI数据监听
			uni.$off('noteOn')
			uni.$off('noteOff')
		}
	}
</script>

<style>
	page{
		background: #000;
	}
</style>