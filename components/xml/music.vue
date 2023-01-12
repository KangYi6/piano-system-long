<template>
	<!-- <div class="appbg" :style="{ background: bgColor[colorIndex] }"> -->
	<!-- <div class="appbg" :style="{ background: bgColor[colorIndex] }"> -->
	<div class="appbg" style="width:100px;height:100px;">
		<!-- 曲谱界面  -->
		<div class="detail">
			<web-view :src="'/hybrid/html/build/index.html?url='+xmlInfo.path+'&title='+xmlInfo.title" @message="vwMessage"></web-view>
		</div>
	</div>
</template>

<script>
	// #ifdef APP-PLUS
	let midiModule = uni.requireNativePlugin("XM-Midi2")
	// #endif
	let wv;//计划创建的曲谱webview
	let metronomeWv; //计划创建的节拍器webview
	export default {
		props: {
			xmlInfo:{
				type: Object,
				value:{}
			},
			width:{
				type:Number,
				value:0
			},
			height:{
				type:Number,
				value:0
			},
			top:{
				type:Number,
				value:0
			},
			right:{
				type:Number,
				value:0
			}
		},
		data() {
			return {
				//操作按钮
				operation:{
					begin:true,          //开始按钮
					hands:0,             //左右手 0表示双手 1表示左手 2表示右手
					follow:false,        //当前模式跟弹&卡住
					followPlay:false,    //跟弹是否开始
					followVoice:false,    //跟弹是否有声音
					metronome:false,     //节拍器按钮
					metronomePlay:false, //节拍器是否开始
					keyboard:false,      //键盘显示状态
					keyTips:'auto',      //键盘提示，默认自动
					followCursor:true, 	 //光标跟随，渲染完只能触发一次
					resetBtn:false,		 //系统重置(回到起始位置)，区别于reset
				},
				//读取的XML数据
				xmlData:'',
				//计算成绩相关数据
				score:{
					//计时器
					timer:'',
					//弹奏用时
					playTime:0,
					//按键次数
					playNote:0,
					//弹对音符（跟弹）
					playRight:0,
					//成绩提示
					tips:[
						'继续加油哦，请先保证准确率，慢慢来不要急。',
						'您的识谱得到很大提高，速度还需要加油。',
						'您的识谱准非常棒，速度再提高就完美了。',
						'你已经非常熟练了，控制节奏速度，就能弹出非常好听的歌曲。',
						'恭喜您熟练掌握这个曲谱，可以出去表演了',
					],
				},
				//是否标注颜色
				color:false,
				//曲谱显示完成
				rendered:false,
				//midi设备是否连接
				midiDevice:false,
				//当前收到的键值
				key:[],
				//当前弹奏位置
				index:0,
				//当前要弹的琴键
				followCurMidi:[],
				curMidi:[],
				//弹错的midi值
				errMidi:[],
				//弹错次数，如果连续弹错三次，自动弹起键盘提示
				playError:0,
				//练习模式,如果用户点击了光标，则进入练习模式(不计算成绩，弹完后继续弹)
				practise:0,
				//监听曲谱
				listen:false,
				//移调
				transpose:{
					defaultFifths:'', //原始调式
					scaleAll:'', //可选择的移调调式
					curFifths:'', //当前调式
					support:'', //是否支持移调功能
				},
				//背景颜色
				colorIndex:3,
				//颜色值
				bgColor:["#FEF0DE","#dbf5ce","#eeeeee","#ffffff"],
			}
		},
		created(){
			this.xmlData = this.width
			console.log(this.width)
			console.log(this.xmlData)
			if (!this.midiDevice) {
				this.midiDevices('connect')
			}
			let that = this
			//虚拟键盘按下&松开
			uni.$on('keyOn',function(data){
				that.keyStatus(data.note,'on')
			})
			uni.$on('keyOff',function(data){
				that.keyStatus(data.note,'off')
			})
			uni.showLoading({
				title: '加载中...'
			})
			// #ifdef APP-PLUS
				// var styles = {hardwareAccelerated:true}; // true表示开启Webview的硬件加速，false表示关闭Webview的邮件加速 
				// var webview = plus.webview.create( "url", "id", styles );     
				// webview.show();
				//此对象相当于html5plus里的plus.webview.currentWebview()。在uni-app里vue页面直接使用plus.webview.currentWebview()无效
				var currentWebview = this.$scope.$getAppWebview()
				console.log(currentWebview);return;
				//如果是页面初始化调用时，需要延时一下
				let width = 100
				let height = 100
				let right = 20
				let top = 20
				setTimeout(function() {
					wv = currentWebview.children()[0]
					// wv.setStyle({right:right,width:width,top:top,height:height})
					wv.setStyle({right:right,width:width,top:top,height:height,scrollIndicator:"none",hardwareAccelerated:true})
				}, 500);
				//节拍器
				metronomeWv = plus.webview.create('/hybrid/html/metronome/index.html', '__worker__', {
					opacity: 0,
					width: '0px',
					height: '0px',
					'uni-app': 'none',
					blockNetworkImage: true,
					webviewBGTransparent: true
				});
				metronomeWv.setBlockNetworkImage(true);
				metronomeWv.setContentVisible(false);
				metronomeWv.setVisible(false);
				metronomeWv.addEventListener('close', (res) => {
				});
			// #endif
			this.beginBtn()
		},
		methods: {
			keyOn(note){
				uni.$emit('keyOn',{note:note});
			},
			keyOff(note){
				uni.$emit('keyOff',{note:note});
			},
			//开始按钮
			beginBtn(){
				console.log(this.xmlData);return;
				//接收MIDI
				this.midiDevices('resume')
				this.operation.begin = false
				//音符索引
				this.index = 0
				//时间清零
				this.score.playTime = 0
				//开始计时
				this.playTime()
				//系统重置
				this.operation.resetBtn = false
				//弹奏音符数
				this.playNote = 0
				if (this.operation.follow) { //跟弹
					this.operation.followPlay = true
					// // #ifdef APP-PLUS
					// //弹出预备拍，传递速度跟拍号
					// uni.navigateTo({
					// 	url: '../musicxml/prepare?tempo='+this.tempo+'&signature='+this.signature[0]
					// })
					// // #endif
					// // #ifndef APP-PLUS
					// uni.showModal({
					// 	title: '仅支持App端'
					// })
					// // #endif
					//设置曲谱速度
					// wv.evalJS("setTempo(30);")
					wv.evalJS("setTempo("+this.xmlData.tempo+");")
					//设置节拍器声音
					if (this.operation.metronome) {
						wv.evalJS("setMetronome(100);")
					}
					//开始
					wv.evalJS("followPlay();")
				} else { //卡住
					if (this.operation.hands == 0) {
						this.curMidi = this.xmlData.midi[this.index]
					} else {
						this.curMidi = []
						for (let value in this.xmlData.midi[this.index]) {
							if (this.operation.hands == 1 && this.xmlData.midi[this.index][value] && this.xmlData.midi[this.index][value].hand == 1) {
								this.curMidi.push(this.xmlData.midi[this.index][value])
							} else if (this.operation.hands == 2 && this.xmlData.midi[this.index][value] && this.xmlData.midi[this.index][value].hand == 2) {
								this.curMidi.push(this.xmlData.midi[this.index][value])
							}
						}
					}
					
					this.jump()
					if (this.operation.metronome) {
						this.metronomeSwitch('open')
					}
				}
			},
			//光标下一步(跟弹不会走这步)
			nextStep(){
				//卡住模式全部标正确
				wv.evalJS("markBtn(1);")
				if (!this.color) {
					this.color = true
				}
				try{
					//判断当前是否是连音符，如果是连音符，再判断另外一只手是符有要弹的音符，如果没有则继续往前走一步（当前仅处理连音符两步的情况）
					let curNote = this.xmlData.midi[this.index]
					//是否有连音符
					let link = false
					let endtime = 0
					for (let val in curNote) {
						//如果是连音符(有都是连音符的情况，需要判断最后值的大小，取最小的长度的连音符作判断)
						if (curNote[val].link == 1) {
							if (endtime == 0) {
								endtime = curNote[val].end
								link = true
							} else if (endtime > curNote[val].end) {//如果有更小的结束时间
								endtime = curNote[val].end
								link = true
							}
						} else {
							if (endtime == 0) {
								endtime = curNote[val].end
								link = false
							} else if (endtime > curNote[val].end) { //如果一起的有不是连音符，且时间小于连音符结束时间
								endtime = curNote[val].end
								link = false
							}
						}
					}
					//往下走一步
					wv.evalJS("nextStep();")
					//获取下一步的索引
					this.index = this.index + 1
					//下一步的MIDI值
					let curMidi = this.xmlData.midi[this.index]
					if (!curMidi) {//如果没有值
						if (this.practise) {//但有点击光标，则进行循环练习
							wv.evalJS("reset();")
							this.index = this.practise
							this.getCurMidi(this.index)
						} else {//否则表示结束了，显示成绩
							this.showScore()
						}
						return
					}
					this.getCurMidi(this.index)
					//查看当前所在位置，是否为休止符，如果有则继续往下走
					let jump = true
					let starttime = 999999999999999
					for (let k in curMidi) {
						//如果有值不等于0，则停止跳
						if (curMidi[k].pitch != 0) {
							jump = false
						}
						if (curMidi[k].start < starttime) {
							starttime = curMidi[k].start
						}
					}
					//休止符
					if (jump) {
						if (this.operation.hands == 0) {
							this.nextStep()
						}
					}
					//连音符
					if (link) {
						//当前(下一步索引后)，是符有要弹的音符，如果没有，再跳一步（通过判断下一个音符的开始时间，是否大于连音符的结束时间，如果大于等于，则跳一步，小于，则不跳
						if (endtime <= starttime) {
							wv.evalJS("markBtn(1);")
							wv.evalJS("nextStep();")
						}
					}
				}catch(e){
					console.log('error')
				}
				// try{
				// 	//判断当前是否是连音符，如果是连音符，再判断另外一只手是符有要弹的音符，如果没有则继续往前走一步（当前仅处理连音符两步的情况）
				// 	let curNote = this.xmlData.midi[this.index]
				// 	//是否有连音符
				// 	let link = false
				// 	let endtime = 0
				// 	for (let val in curNote) {
				// 		//如果是连音符(有都是连音符的情况，需要判断最后值的大小，取最小的长度的连音符作判断)
				// 		if (curNote[val].link == 1) {
				// 			if (endtime == 0) {
				// 				endtime = curNote[val].end
				// 				link = true
				// 			} else if (endtime > curNote[val].end) {//如果有更小的结束时间
				// 				endtime = curNote[val].end
				// 				link = true
				// 			}
				// 		} else {
				// 			if (endtime == 0) {
				// 				endtime = curNote[val].end
				// 				link = false
				// 			} else if (endtime > curNote[val].end) { //如果一起的有不是连音符，且时间小于连音符结束时间
				// 				endtime = curNote[val].end
				// 				link = false
				// 			}
				// 		}
				// 	}
				// 	//如果是卡住模式，则往下走，跟弹不需要管光标移动
				// 	if (!this.operation.follow) {
				// 		wv.evalJS("nextStep();")
				// 	}
				// 	//获取下一步的索引
				// 	this.index = this.index + 1
				// 	//下一步的MIDI值
				// 	let curMidi = this.curMidi = this.xmlData.midi[this.index]
				// 	//如果没有值，表示结束了，显示弹奏分数
				// 	if (!curMidi) {
				// 		if (this.practise) {
				// 			wv.evalJS("reset();")
				// 			this.index = this.practise
				// 			curMidi = this.xmlData.midi[this.practise]
				// 			if (this.operation.hands == 0) {
				// 				this.curMidi = curMidi
				// 			} else {
				// 				this.curMidi = []
				// 				for (let value in curMidi) {
				// 					if (this.operation.hands == 1 && curMidi[value] && curMidi[value].pitch != 0 && curMidi[value].hand == 1) {
				// 						this.curMidi.push(curMidi[value])
				// 					} else if (this.operation.hands == 2 && curMidi[value] && curMidi[value].pitch != 0 && curMidi[value].hand == 2) {
				// 						this.curMidi.push(curMidi[value])
				// 					}
				// 				}
				// 				this.jump()
				// 			}
				// 		} else {
				// 			//显示成绩
				// 			this.showScore()
				// 		}
				// 		return
				// 	}
				// 	if (this.operation.hands == 0) {
				// 		this.curMidi = curMidi
				// 	} else {
				// 		this.curMidi = []
				// 		for (let value in curMidi) {
				// 			if (this.operation.hands == 1 && curMidi[value] && curMidi[value].pitch != 0 && curMidi[value].hand == 1) {
				// 				this.curMidi.push(curMidi[value])
				// 			} else if (this.operation.hands == 2 && curMidi[value] && curMidi[value].pitch != 0 && curMidi[value].hand == 2) {
				// 				this.curMidi.push(curMidi[value])
				// 			}
				// 		}
				// 		//没有要弹的音符
				// 		if (!this.curMidi.length) {
				// 			if (!this.operation.follow) {
				// 				this.nextStep()
				// 			}
				// 		}
				// 	}
				// 	//查看当前所在位置，是否为休止符，如果有则继续往下走
				// 	let jump = true
				// 	let starttime = 999999999999999
				// 	for (let k in curMidi) {
				// 		//如果有值不等于0，则停止跳
				// 		if (curMidi[k].pitch != 0) {
				// 			jump = false
				// 		}
				// 		if (curMidi[k].start < starttime) {
				// 			starttime = curMidi[k].start
				// 		}
				// 	}
				// 	//休止符
				// 	if (jump) {
				// 		if (this.operation.hands == 0) {
				// 			if (!this.operation.follow) {
				// 				this.nextStep()
				// 			}
				// 		}
				// 	}
				// 	//连音符
				// 	if (link) {
				// 		//当前(下一步索引后)，是符有要弹的音符，如果没有，再跳一步（通过判断下一个音符的开始时间，是否大于连音符的结束时间，如果大于等于，则跳一步，小于，则不跳
				// 		if (endtime <= starttime) {
				// 			if (!this.operation.follow) {
				// 				wv.evalJS("nextStep();")
				// 			}
				// 		}
				// 	}
				// }catch(e){
				// 	console.log('error')
				// }
			},
			//休止符
			jump(){
				//开始状态下才往下走
				if (!this.operation.begin) {
					//没有要弹的音符
					if (!this.curMidi.length) {
						this.nextStep()
					} else {
						let jump = true
						for (let k in this.curMidi) {
							//如果有值不等于0，则停止跳
							if (this.curMidi[k].pitch != 0) {
								jump = false
							}
						}
						if (jump) {
							this.nextStep()
						}
					}
				}
			},
			//重置
			reset(type){
				//暂停接收midi
				this.midiDevices('suspend')
				if (this.color) {
					if (type == 'loading') {
						uni.showLoading({
							title:'加载中...'
						})
					}
					//去掉标记色
					wv.evalJS("render();")
					this.color = false
				}
				//系统重置
				this.operation.resetBtn = true
				//修改为开始按钮
				this.operation.begin = true
				//清定弹奏时间计时器
				clearInterval(this.score.timer)
				//光标回到起点
				wv.evalJS("measureBtn(0);")
				wv.evalJS("measureBtn(0);")
				//练习位置（即手动点击）
				this.practise = 0
				//索引位置
				this.index = 0
				//关闭节拍器
				this.metronomeSwitch('close')
				//关闭跟弹
				this.closeFollow()
				this.curMidi = []
				this.errMidi = []
				this.key = []
			},
			//弹奏计时
			playTime(){
				this.score.timer = setInterval(() => {
					this.score.playTime = this.score.playTime+1
				}, 1000);
			},
			//曲谱渲染完返回midi数据
			vwMessage(data){
				let obj = JSON.parse(data.detail.data[0].action)
				switch (obj.type){
					case 'loaded': //曲谱加载完成
					// console.log(JSON.stringify(obj));
					return;
						this.xmlData = obj
						//隐藏正在加载提示
						uni.hideLoading();
						//监听数据，仅一次
						if (!this.listen) {
							//监听数据
							wv.evalJS("listenBtn();")
							this.listen = true
						}
						//曲谱显示完成
						this.rendered = true
						//显示操作按钮
						wv.evalJS("operationBtn('show')")
						//获取移调
						this.readMusixInfo();
						break;
					case 'move':
						//按下
						// midiModule.sendMidiNoteOn({
						// 	cable: 0,
						// 	channel: 0, //暂时定0为右手 1为左手
						// 	note:60,
						// 	velocity: 100
						// }, (ret) => {})
						//用户移动了光标位置
						if (!this.operation.follow) {
							for (let key in this.xmlData.midi) {
								if (Math.round(this.xmlData.midi[key][0].start*1000) == obj.data) {
									this.index = this.practise = Number(key)
									//根据左右手情况，获取当前的音符
									this.getCurMidi(this.index)
									//判断是否有休止符
									this.jump()
									break
								}
							}
						}
						break;
					case 'playend': //跟弹结束
						this.showScore()
						break;
					case 'playnote': //播放音符
						if (this.operation.followVoice) {
							//按下
							midiModule.sendMidiNoteOn({
								cable: 0,
								channel: 0, //暂时定0为右手 1为左手
								note: obj.data.key,
								velocity: 100
							}, (ret) => {})
						}
						break;
					case 'key': //跟弹键值
						return;
						console.log(obj)
						//全部标红
						wv.evalJS("markBtn(0)")
						this.key = []
						this.followCurMidi = obj.data.note
						this.curMidi = obj.data.data
						if (!this.color) {
							this.color = true
						}
						break;
					case 'rendered': //去色加载完
						uni.hideLoading()
						break;
					case 'start': //开始
						this.beginBtn()
						break;
					case 'reset': //重置
						this.reset(obj.data)
						break;
					case 'param': //参数设置：跟弹&卡住，节拍器，左右手，调式，键盘
						let load = false
						//如果以下值有改变，数据需要重置
						if (this.operation.follow != obj.data.follow || this.operation.metronome != obj.data.metronome || this.operation.hands != obj.data.hands ||this.operation.hands != obj.data.hands || this.transpose.curFifths != obj.data.curFifths) {
							load = true
						}
						//如果调式未变化
						if (this.transpose.curFifths != obj.data.curFifths) {
							wv.evalJS("operationBtn('hide')")
							this.transpose.curFifths = obj.data.curFifths
							this.webViewUrl = "/hybrid/html/build/index.html?url="+this.transpose.xmllist[obj.data.index]+"&title="+this.xmlInfo.title
						}
						this.operation.follow = obj.data.follow
						this.operation.metronome = obj.data.metronome
						this.operation.hands = obj.data.hands
						this.operation.keyTips = obj.data.keyTips
						this.operation.keyboard = this.operation.keyTips == 'open' ? true : false
						if (load) {
							this.reset('loading')
						}
						break;
					case 'toast': //提示窗
						uni.showToast({
							title:obj.data
						})
						break;
					case 'loading': //加载窗
						this.showLoading(obj.data)
						break;
					case 'colorIndex': //背景色
						//获取背景颜色
						this.colorIndex = uni.getStorageSync('colorIndex') ? uni.getStorageSync('colorIndex') : 0
						wv.evalJS("bgBtn("+this.colorIndex+",'passive')")
						break;
					case 'setColor':
						this.colorIndex = obj.data
						//背景颜色缓存
						uni.setStorageSync('colorIndex',obj.data)
						break;
					case 'back':
						this.goback()
						break;
					default:
						break;
				}
				wv.evalJS("followCursor()")
			},
			//获取当前的音符midi
			getCurMidi(index){
				//判断左右手
				if (this.operation.hands == 0) {
					this.curMidi = this.xmlData.midi[this.index]
				} else {
					this.curMidi = []
					for (let value in this.xmlData.midi[this.index]) {
						if (this.operation.hands == 1 && this.xmlData.midi[this.index][value] && this.xmlData.midi[this.index][value].hand == 1) {
							this.curMidi.push(this.xmlData.midi[this.index][value])
						} else if (this.operation.hands == 2 && this.xmlData.midi[this.index][value] && this.xmlData.midi[this.index][value].hand == 2) {
							this.curMidi.push(this.xmlData.midi[this.index][value])
						}
					}
					this.jump()
				}
			},
			//获取曲谱信息（调式，可移调式）
			readMusixInfo(){
				if (this.xmlInfo.id) {
					var that = this
					this.$request({
						url: "/piano/xml/readMusixInfo.html",
						data:{path:this.xmlInfo.path,id:this.xmlInfo.id},
						method: "POST",
					}).then((res)=>{
						if (res.data.code == 1000) {
							this.transpose.defaultFifths = res.data.data.fifthsStr
							this.transpose.curFifths = res.data.data.fifthsStr
							this.transpose.scaleAll = res.data.data.scaleAll
							this.transpose.xmllist = res.data.data.xmllist
							this.transpose.support = true
						} else {
							this.transpose.support = false
						}
						wv.evalJS("transposeData("+JSON.stringify(this.transpose)+");")
					})
				} else {
					this.transpose.support = false
					wv.evalJS("transposeData("+JSON.stringify(this.transpose)+");")
				}
			},
			//加载中
			showLoading(text,time){
				uni.showLoading({
					title:text ? text : '加载中...',
				})
				setTimeout(() => {
					uni.hideLoading()
				}, time ? time : 1000)
			},
			//分数面板
			showScore() {
				//计算用时
				let ii = Math.floor(this.score.playTime / 60)
				let ss = this.score.playTime % 60
				let time = (ii < 10 ? '0'+ii : ii)+'分'+(ss < 10 ? '0'+ss : ss)+'秒'
				//总音符数量
				let totalNote = this.xmlData.noteTotal
				if (this.operation.hands == 1) {
					totalNote = this.xmlData.leftTotal
				} else if (this.operation.hands == 2) {
					totalNote = this.xmlData.rightTotal
				}
				let accuracy = 0 //计算准确率(总音符/弹奏音符*100)
				let error = 0 //错误音符
				let score = 0 //得分
				let integral = 0 //积分(暂时无)
				if (this.operation.follow) { //跟弹
					let playNote = this.xmlData.noteTotal
					//如果弹的数量少于总数，则使用总数
					if (this.score.playNote > this.xmlData.totalNote) {
						playNote = this.score.playNote
					}
					accuracy = Number(parseFloat(this.score.playRight / playNote).toFixed(2)*100)
					error = playNote - this.score.playRight
					score = accuracy
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
						right:this.xmlData.noteTotal,
						title:this.xmlInfo.title,
						error:error,
						m_id:this.xmlInfo.id?this.xmlInfo.id:0,
						cwid:this.xmlInfo.cwid?this.xmlInfo.cwid:0,
						type:this.follow ? 1 : 0
					},
					method: 'POST'
				}).then((res) => {
					if (res.data.code == 1000) {
						let e = {}
						e.fighting = res.data.data
						e.score = score
						e.time = time
						e.tips = tips
						e.error = error
						e.accuracy = accuracy
						wv.evalJS("score("+JSON.stringify(e)+");")
					}
					setTimeout(function(){
						//重置
						that.reset('none')
					},500);
				});
			},
			//连接&断开MIDI设备
			midiDevices(type) {
				switch (type){
					case 'connect': //连接
						midiModule.connect((res) => {
							if (res.success) {
								this.midiDevice = true
								//连接后，先暂停接收
								try {midiModule.suspendMidiDevices()} catch(e) {}
							} else {
								uni.showToast({
									title:res.msg,
									icon:'error'
								})
							}
						}, (data)=> {
							//收到midi值
							if (data.msg == 'onMidiNoteOn') { //按下
								this.keyDonw(data.data.note)
							} else if (data.msg == 'onMidiNoteOff') { //松开
								this.keyUp(data.data.note)
							}
						})
						break;
					case 'suspend': //暂停
						try {midiModule.suspendMidiDevices()} catch(e) {}
						break;
					case 'resume': //恢复
						try {midiModule.resumeMidiDevices()} catch(e) {}
						break;
					default: //断开
						try {midiModule.disconnect((ret) => {})} catch(e) {}
						break;
				}
			},
			//按下midi按钮
			async noteOn(note,velocity,hand){
				if (this.followVoice) {
					if (this.hand == 0) {
						midiModule.sendMidiNoteOn({
							cable: 0,
							channel: 0,
							note: note,
							velocity: velocity
						}, (ret) => {
							this.keyDonw(note)
						})
					} else if (this.hand == hand){
						midiModule.sendMidiNoteOn({
							cable: 0,
							channel: 0,
							note: note,
							velocity: velocity
						}, (ret) => {
							this.keyDonw(note)
						})
					}
				} else {
					if (this.hands == 0) {
						this.keyDonw(note)
					} else if (this.hands == hand) {
						this.keyDonw(note)
					}
				}
			},
			//松开midi按钮
			async noteOff(note){
				//参考收到的消息
				midiModule.sendMidiNoteOff({
					cable: 0,
					channel: 0,
					note: note,
					velocity: 0
				}, (ret) => {
					this.keyUp(note)
				})
			},
			//播放MIDI文件
			sendMidiFile() {
				if (!this.rendered) return
				// plus.io.convertLocalFileSystemURL
				// midiModule.sendMidiFile({
				// 	filePath: '/storage/emulated/0/Android/data/uni.UNIC8C25C3/apps/__UNI__C8C25C3/doc/uniapp_save/16630598456460.mid'
				// 	// filePath: file
				// }, (ret) => {
				// 	//连接时报错或者连接成功后的回调在这里
				// })
				
				// return;
				// let that = this
				uni.downloadFile({
					url:'https://edusystem.thedream.tech/edusystem/upload/49_54/20220906/ff3296799f4bbd7ce10ada0e689d7325.mid',
					success:function(res){
						midiModule.sendMidiFile({
							filePath: plus.io.convertLocalFileSystemURL(res.tempFilePath)
							// filePath: file
						}, (ret) => {
							//连接时报错或者连接成功后的回调在这里
						})
					}
				})
			},
			//收到琴键按下
			keyDonw(value){
				//每按一次，记录一次
				this.score.playNote += 1
				//跟弹纠错
				if (this.operation.follow) {
					if (this.followCurMidi.indexOf(value) == -1) {
						//放入弹错音符中
						this.errMidi.push(value.toString())
						this.errMidi = Array.from(this.errMidi)
					} else {
						this.score.playRight += 1
						//标绿
						wv.evalJS("correction("+value+","+1+")")
					}
					return
				}
				//当前弹奏位置
				let i = this.index
				//是否已经存在值
				if (this.key.indexOf(value.toString()) == -1) {
					// let key = this.key
					// key.push(value.toString())
					// this.key = key
					this.key.push(value.toString())
				}
				this.errMidi.push(value.toString())
				this.errMidi = Array.from(this.errMidi)
				//midi总长度
				let count = this.xmlData.midi.length
				//首先判断一次，midi是否为空
				if (!count) {
					return
				}
				//再判断i是否大于midi长度
				if (count - 1 < i) {
					this.curMidi = []
					return
				}
				//获取midi中的第i组值，并在this.key中查询，是否有值，即代表是否按下，如果i组中的值都能key中能找到，则触发下一步
				let midi = this.xmlData.midi[this.index]
				for (let val in midi) {
					if (midi[val].pitch == 0) {
						continue
					}
					if (this.operation.hands == 0) {
						//如果有找不到的值，说明有键没按下
						if (this.key.indexOf(midi[val].pitch.toString()) == -1) {
							if (this.operation.keyTips == 'auto') {
								//累计弹错次数
								let errNumb = this.playError
								this.playError = Number(errNumb) + 1
								//如果弹错五次，弹窗键盘提示，并将错误次数重置
								if (this.playError >= 5 ) {
									this.operation.keyboard = true
								}
							}
							return
						}
					} else if (this.operation.hands == 1) {
						if (midi[val].hand == 1) {
							//如果有找不到的值，说明有键没按下
							if (this.key.indexOf(midi[val].pitch.toString()) == -1) {
								if (this.operation.keyTips == 'auto') {
									//累计弹错次数
									let errNumb = this.playError
									this.playError = Number(errNumb) + 1
									//如果弹错五次，弹窗键盘提示，并将错误次数重置
									if (this.playError >= 5 ) {
										this.keyboard = true
									}
								}
								return
							}
						} else {
							continue
						}
					} else if (this.operation.hands == 2) {
						if (midi[val].hand == 2) {
							//如果有找不到的值，说明有键没按下
							if (this.key.indexOf(midi[val].pitch.toString()) == -1) {
								if (this.operation.keyTips == 'auto') {
									//累计弹错次数
									let errNumb = this.playError
									this.playError = Number(errNumb) + 1
									//如果弹错五次，弹窗键盘提示，并将错误次数重置
									if (this.playError >= 5 ) {
										this.operation.keyboard = true
									}
								}
								return
							}
						} else {
							continue
						}
					}
				}
				//每往下走一步，清空一次当前保存的按键信息，以免出现之前按下的键未松开，导致误判，之前放在nextStep后
				this.key = []
				this.errMidi = []
				//判断，如果是系统打开键盘，弹对以后，自动关闭
				if (this.operation.keyTips == 'auto') {
					//如果弹对，将错误次数重置
					this.playError = 0
					this.operation.keyboard = false
				}
				//触发光标往下跳
				this.nextStep()
			},
			//收到琴键松开
			keyUp(value){
				//如果有键值
				if (this.key.length > 0) {
					//过滤掉值为value的元素
					let setArr = new Set(this.key)
					let result = setArr.delete(value.toString())
					this.key = Array.from((setArr))
				}
				//错误按键
				if (this.errMidi.length > 0) {
					//过滤掉值为value的元素
					let setArrErr = new Set(this.errMidi)
					let resultErr = setArrErr.delete(value.toString())
					this.errMidi = Array.from(setArrErr)
				}
			},
			//虚拟按键
			keyStatus(note,type) {
				if (!this.rendered) return
				if (type == 'on') {
					if (this.midiDevice) {
						//参考收到的消息
						midiModule.sendMidiNoteOn({
							cable: 10,
							channel: 5,
							note: note,
							velocity: 100
						}, (ret) => {
							this.keyDonw(note)
						})
					} else {
						this.keyDonw(note)
					}
				} else {
					this.keyUp(note)
				}
			},
			//关闭节拍器
			metronomeSwitch(type){
				if (type == 'open' && !this.operation.metronomePlay) { //开
					this.operation.metronomePlay = true
					metronomeWv.evalJS("play("+this.xmlData.tempo+","+this.xmlData.signature[0]+",100);")
				} else if (type == 'close' && this.operation.metronomePlay) { //关
					this.operation.metronomePlay = false
					metronomeWv.evalJS("play("+this.xmlData.tempo+","+this.xmlData.signature[0]+",100);")
				}
			},
			//关闭跟弹
			closeFollow(){
				if (this.operation.followPlay) {
					wv.evalJS("followPlay();")
					this.operation.followPlay = false
				}
			},
			//进入瀑布流
			waterfall(){
				uni.redirectTo({
					url:"/pages/waterfall/waterfall?path="+this.xmlInfo.path+"&title="+this.xmlInfo.title+"&id="+this.xmlInfo.id
				})
			},
			//返回到上一页
			goback(){
				uni.navigateBack()
			}
		},
		beforeDestroy(){
			//关闭节拍器
			this.metronomeSwitch('close')
			//断开midi连接
			this.midiDevices()
			//关闭跟弹
			this.closeFollow()
			//移除虚拟键盘监听
			uni.$off('keyOn')
			uni.$off('keyOff')
		}
	}
</script>

<style lang="scss">
	.appbg{
		width:100%;
		height:100%;
		overflow: hidden;
		background: #fff;
		position: relative;
	}
	.detail{
		width:100%;
		height:100%;
	}
</style>