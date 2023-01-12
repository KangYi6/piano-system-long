<!-- 
	存在问题：
	1、webview多次切换后，导致出现多个webview页面
	2、由于出现问题1，导致返回按钮会返回上一个webview页面，无法返回到闯关列表
	3、返回按钮使用了redirectTo
 -->
<template>
	<!-- 闯关详情 -->
	<view class="details">
		<!-- 左侧曲谱 -->
		<view class="left">
			<!-- 内容界面  -->
			<div class="book">
				<!-- 视频 -->
				<video v-if="curType == 1" class="video" :src="videosrc" id="d" :poster="thumb" controls show-fullscreen-btn="false" @ended="ended" :key="keys"></video>
				<!-- 曲谱 -->
				<web-view :src="webViewUrl" @message="handlePostMessage"></web-view>
				<!-- 选择题 -->
				<view class="exercises" v-if="curType == 4">
					<view class="title">
						<view class="img">
							<image src="" mode=""></image>
						</view>
						<view class="text">
							这一旋律的实际演奏（演唱）效果是（ ）。
						</view>
						<image class="playIcon" src="../../static/icons/details_play.png" mode=""></image>
						<image class="pauseIcon" src="../../static/icons/details_pause.png" mode=""></image>
					</view>
					<view class="answer">
						<view class="answerList" v-for="(item,key) in answer" :key="index">
							<view class="option">{{ item.option }}</view>
							<view class="content">{{ item.content }}</view>
						</view>
					</view>
				</view>
			</div>
		</view>
		
		<!-- 右侧进度 -->
		<view class="right">
			<scroll-view class="course" scroll-y="true">
			<view class="content" v-for="(item,index) in step" :key="index" @click="item.open == 1 ? chooseStep(index,item.cw_id,item.cw_type) : ''">	
				<view class="img">
					<image :src="item.open == 1 ? '../../static/game_details_step2.png' : '../../static/game_details_step1.png'" mode="widthFix"></image>
				</view>
				<view class="text" :class="{curcolor:current == index}">
					{{ item.cw_name }}
				</view>
				<view class="line" v-show="index+1<step.length"></view>
			</view>
			<!-- <view class="imgEnd"> -->
				<!-- <image v-show="end != 0 || !end" src= '../../static/game_details_step1.png'  mode="widthFix"></image> -->
				<!-- <image v-show="arr.cw_free != 1 && end && end == 0" src= '../../static/game_details_step2.png'  mode="widthFix"></image> -->
			<!-- </view> -->
			<!-- <view v-show="end != 0 || !end" class="textEnd">完成</view> -->
			<!-- <view v-show="arr.cw_free != 1 && end && end == 0" class="textEnd" :class="{curcolor_2:end == 0}">本课时已全部学完</view> -->
			</scroll-view>
		</view>
		<div class="goback" @click="goback"><image src="@/static/goback.png" mode="widthFix"></image></div>
		<view class="menu" @click="menu"><image src="../../static/menu.png" mode=""></image></view>
		
		<keyboard ref="keybord" :curMidi="curMidi" :errMidi="errMidi" :keyboard="keyboard"></keyboard>
	</view>
</template>
<script>
	let app = getApp()  
	// #ifdef APP-PLUS
	let midiModule = uni.requireNativePlugin("XM-Midi2")
	// #endif  
	let wv;//计划创建的webview
	//多线程
	// import { createWorker, onMessage, postMessage, terminate } from '@/lib/worker.js'
	//引入组件
	import keyboard from "@/components/xml/keyboard.vue";
	export default {
		//使用组件
		components:{
			keyboard
		},
		data() {
			return {
				globalData: getApp().globalData,
				current: 0,
				step: [],
				//提交数据
				pid:'', //产品ID
				id:'', //课程ID
				cid:'', //课时ID
				cwid:'', //课件ID
				score:0, //得分
				//视频
				dsrc:'', //播放地址
				thumb:'', //封面
				keys:1,
				videoContext:null, //视频对象
				//曲谱
				path:'', 
				title:'', //标题
				pass:'', //过关分数
				webViewUrl:'',
				//当前课件类型，默认1视频
				curType: 1, 
				end:'',
				//曲谱是否显示完成
				showFinish:false,
				//mid是否连接
				midiDevice:false,
				//当前收到的键值
				key:[],
				//曲谱是否渲染完成
				rendered:false,
				//xml转midi数据，用于卡住或跟弹
				midi:[],
				//当前弹奏位置
				index:0,
				//键盘显示状态
				keyboard:false,
				//键盘提示，默认自动
				keyTips:'auto',
				//当前要弹的琴键
				curMidi:[],
				//弹错的midi值
				errMidi:[],
				//弹错次数，如果连续弹错三次，自动弹起键盘提示
				playError:0,
				//开始按钮
				startBtn:true,
				//节拍器开关
				metronome:false,
				//跟弹卡住
				follow:false,
				//光标跟随，渲染完只能触发一次
				followCursor:false,
				//曲谱标准用时
				standardTime:0,
				//曲谱是否开始
				playStart:false,
				//计时器
				timer:'',
				//弹奏用时
				playTime:0,
				//按钮次数
				playNote:0,
				//总音符数
				noteTotal:0,
				arr: [],
				// 选择题答案
				answer: [
					{option:'A.', content:''},
					{option:'B.', content:''},
					{option:'C.', content:''},
					{option:'D.', content:''},
				],
				// 课件弹窗显示
				cws_show: false,
			};
		},
		onLoad(options) {
			this.pid = options.pid
			this.cid = options.cid
			this.id = options.id
			//获取课件列表数据
			this.getdata()
			//创建视频实例对象
			this.videoContext = uni.createVideoContext('video');
			let that = this
			//监听MIDI数据
			uni.$on('noteOn',function(data){
				that.keyDonw(data.note)
			})
			uni.$on('noteOff',function(data){
				that.keyUp(data.note)
			})
			//虚拟键盘按下&松开
			uni.$on('keyOn',function(data){
				that.keyStatus(data.note,'on')
			})
			uni.$on('keyOff',function(data){
				that.keyStatus(data.note,'off')
			})
		},
		onShow() {
			var that = this
			// #ifdef APP-PLUS
				//此对象相当于html5plus里的plus.webview.currentWebview()。在uni-app里vue页面直接使用plus.webview.currentWebview()无效
				var currentWebview = this.$scope.$getAppWebview()
				//如果是页面初始化调用时，需要延时一下
				setTimeout(function() {
					wv = currentWebview.children()[0]
					//默认先把webview设为0
					wv.setStyle({right:0,width:0,top:0,height:0})
					//隐藏曲谱webview
					plus.webview.hide()
				}, 500);
			// #endif
		},
		computed: {
			//监听弹窗按钮
			operation() {
				return this.$store.state.operation
			},
		},
		watch: {
			operation: function(newVal, oldVal) {
				this.$store.state.operation = ''
				if (newVal === 'next') { //下一关
					//判断是否为最后一个课件，否则加载下一个
					if (this.step.length == this.current + 1) {
						//回到第一个课件
						// this.chooseStep(0,this.step[0].cw_id,this.step[0].cw_type)
						// 弹出提示：恭喜你，本课程已全部学完
						this.popup('end')
					} else {
						//判断是否解锁、是否付费、是否购买
						if (!this.step[this.current+1].open) {
							if (this.step[this.current+1].cw_free && !this.step[this.current+1].buy) {
								uni.showToast({
									title:'请购买课程',
									icon:'error'
								})
							}
						} else {
							this.chooseStep(this.current+1,this.step[this.current+1].cw_id,this.step[this.current+1].cw_type)
						}
					}
				} else if (newVal === 'again') { //再玩一次
					this.scoreReset()
					this.reset()
					let that = this
					//延迟0.5秒，否则会出现不显示曲谱的情况
					setTimeout(function() {
						//设备兼容
						if (that.globalData.width > 1925) {
							wv.setStyle({right:671,width:1622,top:80,height:557})
						} else if (that.globalData.width <= 1925 && that.globalData.width > 1655) {
							wv.setStyle({right:500,width:1322,top:170,height:757})
						} else if (that.globalData.width <= 1655 && that.globalData.width > 1285) {
							wv.setStyle({right:510,width:1000,top:180,height:570})
						} else if (that.globalData.width <= 1285) {
							wv.setStyle({right:370,width:850,top:150,height:450})
						}
					}, 500);
					//显示曲谱webview
					plus.webview.show()
				} else if (newVal === 'over') { //结束
					this.goback()
				} else if (newVal === 'finish') { //结束
					this.goback()
				}
			}
		},
		methods: {
			getdata(){ 
				this.$request({ 
					url: '/piano/breakthrough/detail.html',
					method: 'POST',
					data: {
						p_id:this.pid,
						c_id:this.cid
					}
				}).then(res => {
					if (res.data.code == 1000) {
						this.step = res.data.data
						//显示第一个课件
						this.chooseStep(0,this.step[0].cw_id,this.step[0].cw_type)
					} else {
						uni.showToast({
							title:res.data.msg,
							icon:'none'
						})
					}
				})
			},
			// 切换step
			chooseStep(index,cwid,type){
				//判断是否解锁、是否付费、是否购买
				if (!this.step[index].open) {
					if (this.step[index].cw_free && !this.step[index].buy) {
						uni.showToast({
							title:'请购买课程',
							icon:'error'
						})
					}
				}
				this.scoreReset()
				//关闭加载窗，避免课件切换时，曲谱加载窗口不能及时关闭问题
				uni.hideLoading()
				//当前课件索引
				this.current = index
				//课件类型
				this.curType = type
				//课件ID
				this.cwid = cwid
				//获取课件内容
				this.courseware()
			},
			//课件内容
			courseware(){
				let that = this
				this.$request({
					url: '/piano/breakthrough/content.html',
					method: 'POST',
					data: {
						p_id:this.pid,
						c_id:this.cid,
						cw_id:this.cwid
					}
				}).then(res => {
					//暂停视频播放，避免课件切换时，视频还在播放问题
					this.videoContext.pause();
					if (res.data.code == 1000) {
						if (this.curType == 1) {
							this.videosrc = res.data.data.video //视频地址
							// this.videosrc = 'https://www.runoob.com/try/demo_source/movie.mp4'
							this.thumb = res.data.data.thumb //封面
							this.keys++
							this.webViewUrl = "/hybrid/html/build/index.html"
							wv.setStyle({right:0,width:0,top:0,height:0})
							//隐藏曲谱webview
							plus.webview.hide()
							this.curMidi = []
							//自动播放视频
							setTimeout(function(){
								that.videoContext.play()
							},500)
						} else if (this.curType == 2) {
							uni.showLoading({
								title: '加载中...'
							})
							this.path = res.data.data.xml //曲谱地址
							this.pass = res.data.data.pass //闯关分数
							this.title = this.step[this.current].cw_name
							this.webViewUrl = "/hybrid/html/build/index.html?url="+this.path+"&title="+this.title
							//延迟0.5秒，否则会出现不显示曲谱的情况
							setTimeout(function() {
								//设备兼容
								if (that.globalData.width > 1925) {
									wv.setStyle({right:671,width:1622,top:80,height:557})
								} else if (that.globalData.width <= 1925 && that.globalData.width > 1655) {
									wv.setStyle({right:500,width:1322,top:170,height:757})
								} else if (that.globalData.width <= 1655 && that.globalData.width > 1285) {
									wv.setStyle({right:510,width:1000,top:180,height:570})
								} else if (that.globalData.width <= 1285) {
									wv.setStyle({right:370,width:850,top:150,height:400})
								}
							}, 500);
							//显示曲谱webview
							plus.webview.show()
						}
					} else {
						uni.showToast({
							title:res.data.msg,
							icon:'none'
						})
					}
				})
			},
			//闯关完成提交
			submission(){
				let that = this
				let data = {
					p_id:this.pid,
					c_id:this.cid,
					cw_id:this.cwid,
				}
				let time = '' //用时
				let accuracy = 0 //准确率
				let error = 0 //错误音符
				let score = 0 //得分
				let fighting = 0 //打败用户
				let integral = 0 //积分(暂时无)
				if (this.curType == 2) {
					//曲谱标识为未加载完（标识后，midi收到值不在进行处理）
					this.rendered = false
					//当前midi设为空
					this.curMidi = []
					//计算用时
					let ii = Math.floor(this.playTime / 60)
					let ss = this.playTime % 60
					time = (ii < 10 ? '0'+ii : ii)+'分'+(ss < 10 ? '0'+ss : ss)+'秒'
					//计算准确率(总音符/弹奏音符*100)
					accuracy = parseFloat((this.noteTotal / this.playNote)).toFixed(2)*100
					//错误音符
					error = this.playNote - this.noteTotal
					//得分
					if (this.standardTime > this.playTime) {
						score = Math.floor(accuracy*0.8 + 20)
					} else {
						score = Math.floor(accuracy*0.8 + (this.standardTime / this.playTime)*20)
					}
					data.score = score
					data.time = this.playTime
					data.note = this.noteTotal
					data.playnote = this.playNote
					data.type = 2
					data.cw_id = this.cwid
				} else {
					data.score = 100
				}
				this.$request({
					url: '/piano/breakthrough/submission.html',
					method: 'POST',
					data: data
				}).then(res => {
					if (res.data.code == 1000) { //闯关成功
						this.end = res.data.data
						fighting = res.data.other
						// 判断当前课件是否是最后一课：如果是，弹出提示全部完成；如果不是，解锁下一关
						if (res.data.data == 0){ //全部完成
							this.step.filter((item,index) => {
								if(item.cw_id == this.cwid){ 
									this.arr = this.step[index + 1]
								}
							})
							// 如果下一关不是最后一课并且未购买
							if(this.arr.cw_free == 1 && this.arr.buy == 0){
								// 提示闯关成功，解锁下一关
								if (that.curType == 2) {
									that.popupTwo('success',that.playTime,accuracy,error,fighting,score,integral,that.pass)
								} else {
									that.popup('success')
								}
								// 提示购买
								uni.showToast({
									title:'下一关未购买',
									icon:'error'
								})
							} 
							// 否则如果下一关为最后一课，提示已完成全部课时
							else {
								if (that.curType == 2) {
									that.popupTwo('end',that.playTime,accuracy,error,fighting,score,integral,that.pass)
								} else {
									that.popup('end')
								}
							}
						}
						else if (res.data.data && res.data.data != 0) { //解锁下一关
							if (that.curType == 2) {
								that.popupTwo('success',that.playTime,accuracy,error,fighting,score,integral,that.pass)
							} else {
								that.popup('success')
							}
							let list = that.step
							for (let key in that.step) {
								if (that.step[key].cw_id == res.data.data) {
									that.step[key].open = 1
									break;
								}
							}
						}
					} else if (res.data.code == 1001){ //闯关失败
						fighting = res.data.data
						if (that.curType == 2) {
							that.popupTwo('fail',that.playTime,accuracy,error,fighting,score,integral,that.pass)
						} else {
							that.popup('fail')
						}
					} else {
						uni.showToast({
							title:res.data.msg,
							icon:'none'
						})
					}
				}) 
			},
			//视频闯关成功&失败弹窗
			popup(type){
				// #ifdef APP-PLUS
				uni.navigateTo({
					url:'../game/popup?type='+type
				})
				// #endif
				// #ifndef APP-PLUS
				uni.showModal({
					title: '仅支持App端'
				}) 
				// #endif
			},
			//五线谱闯关成功&失败
			popupTwo(type,time,accuracy,error,fighting,score,integral,pass){
				// #ifdef APP-PLUS
				uni.navigateTo({
					url: '../game/popup2?type='+type+'&time='+time+'&accuracy='+accuracy+'&error='+error+'&fighting='+fighting+'&score='+score+'&integral='+integral+'&pass='+this.pass
				})
				// #endif
				// #ifndef APP-PLUS
				uni.showModal({ 
					title: '仅支持App端'
				})
				// #endif
			},
			// 选择题闯关成功弹窗
			popupThree(type){
				// #ifdef APP-PLUS
				uni.navigateTo({
					url: '../game/popup3?type=' + type
				})
				// #endif
				// #ifndef APP-PLUS 
				uni.showModal({
					title: '仅支持App端'
				})
				// #endif
			},
			// 返回上一页
			goback() {
				uni.redirectTo({
					url:"/pages/details/details?id=" + this.id
				})
			},
			menu(){
				uni.navigateTo({
					url:'/pages/courseware/courseware?pid=' + this.pid + '&cid=' + this.cid + '&type=game'
				});
			},
			//播放结束
			ended(){
				this.keys++
				this.submission()
			},
			//---------------------曲谱--------------------------
			//虚拟按键
			keyStatus(note,type) {
				if (!this.showFinish) return
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
			//收到琴键按下
			keyDonw(value){
				//每按一次，记录一次
				this.playNote = this.playNote+1
				//当前弹奏位置
				let i = this.index;
				//按下键值
				this.down = value
				//是否已经存在值
				if (this.key.indexOf(value.toString()) == -1) {
					let key = this.key
					key.push(value.toString())
					this.key = key
				}
				this.errMidi.push(value.toString())
				this.errMidi = Array.from(this.errMidi)
				//midi总长度
				let count = this.midi.length
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
				let midi = this.midi[i]
				for (let val in midi) {
					if (midi[val].pitch == 0) {
						continue
					}
					//如果有找不到的值，说明有键没按下
					if (this.key.indexOf(midi[val].pitch.toString()) == -1) {
						if (this.keyTips == 'auto') {
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
				}
				//每往下走一步，清空一次当前保存的按键信息，以免出现之前按下的键未松开，导致误判，之前放在nextStep后
				this.key = []
				this.errMidi = []
				//判断，如果是系统打开键盘，弹对以后，自动关闭
				if (this.keyTips == 'auto') {
					//如果弹对，将错误次数重置
					this.playError = 0
					this.keyboard = false
				}
				//触发光标往下跳
				this.nextStep('step')
			},
			//收到琴键松开
			keyUp(value){
				//如果有键值
				if (this.key.length > 0) {
					this.up = value
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
			//开始按钮
			beginBtn(){
				if (!this.showFinish) return
				//接收MIDI
				app.midiDevices('resume')
				try {
					this.index = 0
					this.showCursor()
					//标识加载完成
					this.rendered = true
					this.startBtn = false
				} catch(e) {
					//TODO handle the exception
				}
			},
			//显示光标
			showCursor(){
				//调用webview中的方法
				wv.evalJS("showCursor();")
				//光标跟随
				if (!this.followCursor) {
					wv.evalJS("followCursor()")
					this.followCursor = true
				}
				let jump = true
				//当前位置的MIDI值
				let curMidi = this.midi[this.index]
				for (let k in curMidi) {
					//如果有值不等于0，则停止跳
					if (curMidi[k].pitch != 0) {
						jump = false
					}
				}
				if (jump) {
					// console.log('有休止符，继续走')
					this.nextStep('start')
				}
			},
			//下一步
			nextStep(type){
				//系统自动走的，不计算开始时间，用户弹奏开始计时，主要用type区分，type等于start是系统，step是用户弹奏
				//弹奏的时候，先判断是否开始，没有开始则设置数据为开始，并开启定时器，否则直接跳过
				//结束弹出分数时，设置结束
				if (type == 'step' && !this.playStart) {
					this.playStart = true
					this.timer = setInterval(() => {
						this.playTime = this.playTime+1
					}, 1000);
				}
				//判断当前是否是连音符，如果是连音符，再判断另外一只手是符有要弹的音符，如果没有则继续往前走一步（当前仅处理连音符两步的情况）
				let curNote = this.midi[this.index]
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
				//如果是卡住模式，则往下走，跟弹不需要管光标移动
				if (!this.follow) {
					wv.evalJS("nextStep();")
				}
				//获取下一步的索引
				this.index = this.index + 1
				//下一步的MIDI值
				let curMidi = this.curMidi = this.midi[this.index]
				//如果没有值，表示结束了，显示弹奏分数
				if (!curMidi) {
					this.curMidi = []
					//显示成绩
					// this.showScore()
					//提交成绩
					this.submission()
					return
				}
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
				if (jump) {
					// console.log('有休止符，继续走')
					this.nextStep('start')
				}
				//如果连音符为true
				if (link) {
					//当前(下一步索引后)，是符有要弹的音符，如果没有，再跳一步（通过判断下一个音符的开始时间，是否大于连音符的结束时间，如果大于等于，则跳一步，小于，则不跳
					if (endtime <= starttime) {
						// console.log('连音符，继续走')
						wv.evalJS("nextStep();")
					}
				}
			},
			//重置
			reset(){
				//暂停接收midi
				app.midiDevices('suspend')
				wv.evalJS("reset();")
				this.index = 0
				this.curMidi = this.midi[0]
				this.showCursor()
				this.rendered = true
			},
			//曲谱渲染完返回midi数据
			handlePostMessage(data){
				let obj = JSON.parse(data.detail.data[0].action) //获取到音符
				//速度
				this.tempo = obj.tempos[0].bpm
				//拍号
				this.signature = obj.timeSignatures[0].signature
			
				let notes = obj.tracks[0].notes
				//计算曲谱标准用时，即最后一个音符的start+end时长，单位（s）,向上取整
				this.noteTotal = notes.length
				let startTime = notes[this.noteTotal-1].start
				let endTime = notes[this.noteTotal-1].end
				if (endTime) {
					this.standardTime = Math.ceil(endTime)
				} else {
					this.standardTime = Math.ceil(startTime)
				}
				//XMl所有的midi值
				let allMidi = [] 
				//同时按下的键，转成新的数组
				let curNote = []
				//表示未开始
				let start = -1
				//过滤掉休止符后的音符数
				let noRest = 0
				for (let val in notes) {
					let e = notes[val]
					if (e.end != 0) {
						noRest++
					}
					e.start = Number(parseFloat(e.start).toFixed(5))
					// e.end = Number(parseFloat(e.end).toFixed(5))
					if (start == -1) { //第一个note直接放到新数组中
						curNote.push(e)
						start = e.start
					} else if (start == e.start) { //如果start值相等，表示跟上一个键同时按下
						curNote.push(e)
					} else { //如果不相等
						//先把之前的值，保存到总MIDI数组上
						allMidi.push(curNote)
						//然后再清空当前计算的键值
						curNote = []
						//把当前的值放到当前计算的数组上
						curNote.push(e)
						start = e.start
					}
					//如果是最后一个音符
					if (val == notes.length - 1) {
						allMidi.push(curNote)
						curNote = []
						start = -1
					}
				}
				this.midi = allMidi
				this.curMidi = allMidi[0]
				this.noteTotal = noRest
				//隐藏正在加载提示
				uni.hideLoading();
				//曲谱显示完成
				this.showFinish = true
				//点击开始
				this.beginBtn()
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
			//分数相关数据重置
			scoreReset(){
				//清定时器
				clearInterval(this.timer)
				//时间清零
				this.playTime = 0
				//开始
				this.playStart = false
				//弹奏音符数
				this.playNote = 0
				//分数重置
				this.score = 0
				//曲谱显示完成
				this.showFinish = true
			},
		},
		beforeDestroy() {
			//暂停接收MIDI数据
			app.midiDevices('suspend')
			//移除虚拟键盘监听
			uni.$off('keyOn')
			uni.$off('keyOff')
			//移除MIDI数据监听
			uni.$off('noteOn')
			uni.$off('noteOff')
		},
	};
</script>

<style lang="scss">
@media screen and (min-width: 2560px){
	.details {
		width: 2560px;
		height: 720px;
		background-color: #0a1050;
		position: relative;
		overflow: hidden;
	}
	.details .left {
		width: 1704px;
		height: 640px;
		border-radius: 10px;
		background-color: #294cc2;
		float: left;
		margin-top: 40px;
		margin-left: 227px;
	}
	.book{
		width: 1621px;
		height: 557px;
		background-color: #fff;
		// background-color: #7f7f7f;
		// opacity: 0.8;
		margin: 40px 40px; 
		overflow: hidden;
	}
	.video{
		width: 1621px;
		height: 557px;
	}
	// 选择题
	.exercises{
		width: 100%;
		height: 100%;
	}
	.exercises .title{
		width: 100%;
		height: 80px;
	}
	.title .img{
		width: 20%;
		height: 60px;
		background-color: #00FF7F;
		float: left;
		margin-top: 10px;
		margin-left: 10px;
	}
	.title .text{
		width: auto;
		height: 50px;
		font-size: 30px;
		color: #333;
		float: left;
		margin-top: 15px;
		margin-left: 20px;
	}
	.title .playIcon{
		width: 68px;
		height: 68px;
		float: left;
		margin: 10px 20px 0px 20px;
	}
	.title .pauseIcon{
		width: 80px;
		height: 80px;
		float: left;
		margin-top: 5px;
	}
	.exercises .answer{
		width: 100%;
		height: 80%;
		margin-top: 120px;
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: space-around;
	}
	.answerList{
		width: 23%;
		height: 40%;
		position: relative;
	}
	.option{
		width: 20px;
		height: 20px;
		font-size: 30px;
		color: #333;
		position: absolute;
		left: 0px;
		top: 0px;
	}
	.answer .content{ 
		width: 310px;
		height: 100%;
		border: 1px solid #333;
	}
	// 右侧
	.details .right {
		width: 357px;
		height: 640px;
		overflow: hidden;
		border-radius: 10px;
		background-color: #294cc2;
		float: left;
		margin-top: 40px;
		margin-left: 50px;
		position: relative;
	}
	.details .right .course{
		height: 544px;
		margin-top: 40px;
	}
	.line{
		width: 3px;
		height: 100px; 
		background-color: #75E1FF;
		// position: absolute;
	    margin-left: 16px;
		margin-top: 5px;
	}
	.content{
		width: 80%;
		height: 40px;
		float: left;
		margin-left: 64px;
		margin-bottom: 35px;
		padding-bottom: 10px;
	}
	.content .img image{
		width: 34px;
		height: 34px;
		float: left;
	}
	.imgEnd image{
		width: 34px;
		height: 34px;
		float: left;
		margin-left: 64px;
		margin-bottom: 35px;
	}
	.content .text,
	.textEnd{
		width: 155px;
		height: 26px;
		font-size: 20px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		float: left;
		margin-left: 30px;
	}
	.curcolor{
		color: #FFB23B;
	}
	/* 返回按钮 */
	.goback {
		position: absolute;
		bottom: 40px;
		right: 10px;
	}
	.goback image {
		width: 180px;
		height: 72px;
	}
	/* 菜单按钮 */
	.menu {
		position: absolute;
		top: 50px;
		left: 10px;
	}
	.menu image{
		width: 90px;
		height: 90px;
	}
}
@media screen and (max-width:1925px) and (min-width:1656px){
	.details {
		width: 100%;
		height: 100%;
		background-color: #0a1050;
		position: relative;
		overflow: hidden;
	}
	.details .left {
		width: 1400px;
		height: 840px;
		border-radius: 10px;
		background-color: #294cc2;
		float: left;
		margin-top: 130px;
		margin-left: 60px;
	}
	.book{
		width: 1321px;
		height: 757px;
		background-color: #fff;
		margin: 40px 40px;
	}
	.video{
		width: 1321px;
		height: 757px;
	}
	.details .right {
		width: 357px;
		height: 840px;
		border-radius: 10px;
		background-color: #294cc2;
		float: left;
		margin-top: 130px;
		margin-left: 50px;
		position: relative;
	}
	.details .right .course{
		height: 750px;
		margin-top: 40px;
	}
	.line{
		width: 3px;
		height: 100px; 
		background-color: #75E1FF;
		// position: absolute;
	    margin-left: 16px;
		margin-top: 5px;
	}
	.content{
		width: 80%;
		height: 40px;
		float: left;
		margin-left: 64px;
		margin-top: 35px;
		padding-bottom: 10px;
	}
	.content .img image{
		width: 34px;
		height: 34px;
		float: left;
	}
	.imgEnd image{
		width: 34px;
		height: 34px;
		float: left;
		margin-left: 64px;
		margin-bottom: 35px;
		margin-top: 50px;
	} 
	.content .text,
	.textEnd{
		width: 155px;
		height: 26px;
		font-size: 20px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal; 
		float: left;
		margin-left: 30px;
	}
	.textEnd{
		margin-top: 50px;
	}
	.curcolor{
		color: #FFB23B;
	}
	.curcolor_2{
		color: #00FF7F;
	}
	/* 返回按钮 */
	.goback {
		position: absolute;
		top: 40px;
		right: 40px;
	}
	.goback image {
		width: 180px;
		height: 72px;
	}
}
@media screen and (max-width:1655px) and (min-width:1286px){
	.details {
		width: 100%;
		height: 100%;
		background-color: #0a1050;
		position: relative;
		overflow: hidden;
	}
	.details .left {
		width: 68%;
		height: 80%;
		border-radius: 10px;
		background-color: #294cc2;
		float: left;
		margin-top: 130px;
		margin-left: 60px;
	}
	.book{
		width: 93%;
		height: 90%;
		background-color: #fff;
		margin: 40px 40px;
	}
	.video{
		width: 100%;
		height: 100%;
	}
	.details .right {
		width: 357px;
		height: 80%;
		border-radius: 10px;
		background-color: #294cc2;
		float: left;
		margin-top: 130px;
		margin-left: 50px;
		position: relative;
	}
	.details .right .course{
		height: 87%;
		// margin-top: -10px;
	}
	.line{
		width: 3px;
		height: 100px; 
		background-color: #75E1FF;
		// position: absolute;
	    margin-left: 16px;
		margin-top: 5px;
	}
	.content{
		width: 80%;
		height: 40px;
		float: left;
		margin-left: 64px;
		margin-top: 35px;
		padding-bottom: 10px;
	}
	.content .img image{
		width: 34px;
		height: 34px;
		float: left;
	}
	.imgEnd image{
		width: 34px;
		height: 34px;
		float: left;
		margin-left: 64px;
		margin-bottom: 35px;
		margin-top: 50px;
	} 
	.content .text,
	.textEnd{
		width: 155px;
		height: 26px;
		font-size: 20px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal; 
		float: left;
		margin-left: 30px;
	}
	.curcolor{
		color: #FFB23B;
	}
	/* 返回按钮 */
	.goback {
		position: absolute;
		top: 40px;
		right: 40px;
	}
	.goback image {
		width: 180px;
		height: 72px;
	}
	/* 遮罩 */
	.mask{
		background: rgba(0,0,0, 0.5);
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
	.mask .success{
		width: 480px;
		height: 470px;
		position: absolute;
		left: 34%;
		bottom: 27%;
	}
	.mask .stars{
		width: 200px;
		height: 90px;
		position: absolute;
		left: 41.5%;
		top: 39.2%;
	}
	.mask .pass{
		width: 250px;
		height: 70px;
		position: absolute;
		left: 40.4%;
		bottom: 36%;
	}
	.mask .title{
		width: 200px;
		height: 30px;
		font-size: 25px;
		color: #e25d24;
		position: absolute;
		left: 44.2%;
		bottom: 45%;
	}
	.mask .maskbtn{
		width: 180px;
		height: 110px;
	}
	.mask .nextgame{
		position: absolute;
		left: 36.7%;
		bottom: 17%;
	}
	.mask .next{
		width: 79px;
		height: 33px;
		font-size: 20px;
		font-family: Source Han Sans CN-Regular;
		font-weight: 400;
		color: #ffffff;
		transform: translateY(-86px) translateX(60px);
		text-align: center;
		margin-right: 200px;
	}
	.mask .end{
		width: 79px;
		height: 33px;
		font-size: 20px;
		font-family: Source Han Sans CN-Regular;
		font-weight: 400;
		color: #ffffff;
		transform: translateY(-86px) translateX(51px);
		
	}
	.mask .endgame{
		position: absolute;
		left: 45.7%;
		bottom: 17%;
	}
}
@media screen and (max-width: 1285px) and (min-width: 1006px){
	.details {
		width: 100%;
		height: 100%;
		background-color: #0a1050;
		background-size:100% 100%;
		position: relative;
		overflow: hidden;
	}
	.details .left { 
		width: 72%;
		height: 70%;
		border-radius: 10px;
		background-color: #294cc2;
		float: left;
		margin-top: 120px;
		margin-left: 30px;
	}
	.book{
		width: 95%;
		height: 90%;
		background-color: #fff;
		margin: 20px 20px;
	}
	.video{
		width: 100%;
		height: 100%;
	}
	.details .right {
		width: 20%;
		height: 70%;
		border-radius: 10px;
		background-color: #294cc2;
		float: left;
		margin-top: 120px;
		margin-left: 50px;
		position: relative;
	}
	.details .right .course{
		height: 90%;
		// margin-top: -10px;
	}
	.line{
		width: 3px;
		height: 100px; 
		background-color: #75E1FF;
		// position: absolute;
	    margin-left: 12px;
		margin-top: 5px;
	}
	.content{
		width: 80%;
		height: 40px;
		float: left;
		margin-left: 20px;
		margin-top: 35px;
		padding-bottom: 10px;
	}
	.content .img image{
		width: 28px;
		height: 28px;
		float: left;
	}
	.imgEnd image{
		width: 28px;
		height: 28px;
		float: left;
		margin-left: 20px;
		margin-bottom: 35px;
		margin-top: 50px;
	} 
	.content .text,
	.textEnd{
		width: 155px;
		height: 26px;
		font-size: 18px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal; 
		float: left;
		margin-left: 60px;
		margin-top: -28px;
	}
	.textEnd{
		margin-top: -65px;
		margin-left: 80px;
	}
	.curcolor{
		color: #FFB23B;
	}
	/* 返回按钮 */
	.goback {
		position: absolute;
		top: 20px;
		right: 45px;
	}
	.goback image {
		width: 130px;
		height: 52px;
	}
	/* 遮罩 */
	.mask{
		background: rgba(0,0,0, 0.5);
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
	.mask .success{
		width: 480px;
		height: 470px;
		position: absolute;
		left: 34%;
		bottom: 27%;
	}
	.mask .stars{
		width: 200px;
		height: 90px;
		position: absolute;
		left: 41.5%;
		top: 39.2%;
	}
	.mask .pass{
		width: 250px;
		height: 70px;
		position: absolute;
		left: 40.4%;
		bottom: 36%;
	}
	.mask .title{
		width: 200px;
		height: 30px;
		font-size: 25px;
		color: #e25d24;
		position: absolute;
		left: 44.2%;
		bottom: 45%;
	}
	.mask .maskbtn{
		width: 180px;
		height: 110px;
	}
	.mask .nextgame{
		position: absolute;
		left: 36.7%;
		bottom: 17%;
	}
	.mask .next{
		width: 79px;
		height: 33px;
		font-size: 20px;
		font-family: Source Han Sans CN-Regular;
		font-weight: 400;
		color: #ffffff;
		transform: translateY(-86px) translateX(60px);
		text-align: center;
		margin-right: 200px;
	}
	.mask .end{
		width: 79px;
		height: 33px;
		font-size: 20px;
		font-family: Source Han Sans CN-Regular;
		font-weight: 400;
		color: #ffffff;
		transform: translateY(-86px) translateX(51px);
		
	}
	.mask .endgame{
		position: absolute;
		left: 45.7%;
		bottom: 17%;
	}
}
@media screen and (max-width: 1005px){
	.details {
		width: 100%;
		height: 100%;
		background-color: #0a1050;
		background-size:100% 100%;
		position: relative;
		overflow: hidden;
	}
	.details .left { 
		width: 72%;
		height: 70%;
		border-radius: 10px;
		background-color: #294cc2;
		float: left;
		margin-top: 120px;
		margin-left: 30px;
	}
	.book{
		width: 95%;
		height: 90%;
		background-color: #fff;
		margin: 20px 20px;
	}
	.video{
		width: 100%;
		height: 100%;
	}
	.details .right {
		width: 20%;
		height: 70%;
		border-radius: 10px;
		background-color: #294cc2;
		float: left;
		margin-top: 120px;
		margin-left: 20px;
		position: relative;
	}
	.details .right .course{
		height: 400px;
	}
	.line{
		width: 2px;
		height: 100px; 
		background-color: #75E1FF;
	    margin-left: 10px;
		margin-top: 5px;
	}
	.content{
		width: 80%;
		height: 40px;
		float: left;
		margin-left: 20px;
		margin-top: 20px;
	}
	.content .img image{
		width: 20px;
		height: 20px;
		float: left;
	}
	.imgEnd image{
		width: 28px;
		height: 28px;
		float: left;
		margin-left: 20px;
		margin-bottom: 35px;
		margin-top: 50px;
	} 
	.content .text,
	.textEnd{
		width: 150px;
		height: 26px;
		font-size: 16px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal; 
		float: left;
		margin-left: 30px;
		margin-top: -23px;
	}
	.textEnd{
		margin-top: -65px;
		margin-left: 80px;
	}
	.curcolor{
		color: #FFB23B;
	}
	/* 返回按钮 */
	.goback {
		position: absolute;
		top: 20px;
		right: 45px;
	}
	.goback image {
		width: 130px;
		height: 52px;
	}
	/* 遮罩 */
	.mask{
		background: rgba(0,0,0, 0.5);
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
	.mask .success{
		width: 480px;
		height: 470px;
		position: absolute;
		left: 34%;
		bottom: 27%;
	}
	.mask .stars{
		width: 200px;
		height: 90px;
		position: absolute;
		left: 41.5%;
		top: 39.2%;
	}
	.mask .pass{
		width: 250px;
		height: 70px;
		position: absolute;
		left: 40.4%;
		bottom: 36%;
	}
	.mask .title{
		width: 200px;
		height: 30px;
		font-size: 25px;
		color: #e25d24;
		position: absolute;
		left: 44.2%;
		bottom: 45%;
	}
	.mask .maskbtn{
		width: 180px;
		height: 110px;
	}
	.mask .nextgame{
		position: absolute;
		left: 36.7%;
		bottom: 17%;
	}
	.mask .next{
		width: 79px;
		height: 33px;
		font-size: 20px;
		font-family: Source Han Sans CN-Regular;
		font-weight: 400;
		color: #ffffff;
		transform: translateY(-86px) translateX(60px);
		text-align: center;
		margin-right: 200px;
	}
	.mask .end{
		width: 79px;
		height: 33px;
		font-size: 20px;
		font-family: Source Han Sans CN-Regular;
		font-weight: 400;
		color: #ffffff;
		transform: translateY(-86px) translateX(51px);
	}
	.mask .endgame{
		position: absolute;
		left: 45.7%;
		bottom: 17%;
	}
}

</style>