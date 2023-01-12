<template>
    <view>
		<view class="setting">
			<view @click="startBtn()">
				<image class="start" src="@/static/waterfall/start-icon.png" mode="widthFix"></image>
				<image class="stop" src="@/static/waterfall/stop.png" mode="widthFix"></image>
			</view>
			<view @click="resetBtn()"><image src="@/static/waterfall/reset-icon.png" mode="widthFix"></image></view>
			<view @click="setBtn()"><image src="@/static/waterfall/set-icon.png" mode="widthFix"></image></view>
<!-- 			<view class="operation">
				<view class="title">逐梦音乐</view>
				<view class="param">
					<view class="info">
						<text class="mode">C 大调</text>
						<text class="signature">4/4</text>
						<text class="bpm">60 BPM</text>
					</view>
				</view>
				<view class="param">
					<view class="left fl">速度</view>
					<view class="right fl">
						<view class="speed">
							<view class="minus fl" @click="speedBtn('minus')"><text>-</text></view>
							<view class="value fl">
								<view class="percent">100</view>
								<view class="symbol">%</view>
							</view>
							<view class="plus fl" @click="speedBtn('plus')"><text>+</text></view>
						</view>
					</view>
				</view>
				<view class="param">
					<view class="left fl">伴音</view>
					<view class="right fl">
						<view class="hand fl">
							<view class="imgbox lefthand" @click="handBtn(this,1)">
								<image class="hide" src="@/static/waterfall/open.png" mode="widthFix"></image>
								<image src="@/static/waterfall/close.png" mode="widthFix"></image>
							</view>
							<text>左手</text>
						</view>
						<view class="hand fl">
							<view class="imgbox righthand" @click="handBtn(this,2)">
								<image class="hide" src="@/static/waterfall/open.png" mode="widthFix"></image>
								<image src="@/static/waterfall/close.png" mode="widthFix"></image>
							</view>
							<text>右手</text>
						</view>
					</view>
				</view>
				<view class="param">
					<view class="left fl">音量</view>
					<view class="right fl">
						<view id="slider"></view>
						<view class="velocity">60</view>
					</view>
				</view>
				<view class="param keyboard-switch">
					<view class="left fl">键盘</view>
					<view class="right fl" @click="keyBtn()">
						<view class="keyimg"><image src="@/static/waterfall/open.png" mode="widthFix"></image></view>
						<view class="keyimg hide"><image src="@/static/waterfall/close.png" mode="widthFix"></image></view>
					</view>
				</view>
				<view class="param keyboard-switch">
					<view class="left fl">难度</view>
					<view class="right fl">
						<text @click="difficultyBtn(this,15)">简单</text><text @click="difficultyBtn(this,10)" class="curbg">适中</text><text @click="difficultyBtn(this,5)">最难</text>
					</view>
				</view>
			</view> -->
		</view>
		<!-- 弹奏模式 -->
		<!-- <score></score> -->
		<!-- 键盘 -->
		<!-- <keyboard :curMidi="curMidi" :errMidi="errMidi"></keyboard> -->
		<!-- 返回 -->
		<view class="goback" onclick="goback()"><image src="@/static/waterfall/goback.png" mode="widthFix"></image></view>
		<!-- 仅出现在 app h5 -->
		<!-- #ifdef APP-PLUS || H5 -->
		<canvas canvas-id="canvas" class="canvas" :style="'width:'+globalData.width+'px;height:'+globalData.height+'px'" 
			:msg="order"
			:change:msg="animate.msg" 
			:data-width="globalData.width" 
			:data-height="globalData.height" 
			:data-speed="speed" 
			:data-list="codeRainArr" 
		></canvas>
		<!-- #endif -->
    </view>
</template>

<script module="animate" lang="renderjs">
    export default {
		data(){
			return {
				ch: 0,
				codeRainArr:[], //原始数据
				codeRainData:[], //时实数据
				width:0,
				height:0,
				speed:0,
				stop:false,
				myReq:null,
				cvs:null,
				ctx:null,
				move:0,
				i:0, //计数器
				now:null,
				last:null,
				delta:null
			}
		},
		onLoad(){
			console.log(123)
		},
        methods: {
			//接收uni指令
            msg(newVal, oldVal, owner, ins) {
				switch (newVal){
					case 'ready': //准备完成,读取数据
						this.cvs = document.querySelectorAll('.canvas>canvas')[0]
						this.ctx = this.cvs.getContext('2d')
						this.width = Number(ins.getDataset().width)
						this.height = Number(ins.getDataset().height)
						this.ch = Number(ins.getDataset().height) - 30
						this.speed = Number(ins.getDataset().speed)
						this.codeRainData = JSON.parse(ins.getDataset().list)
						this.globalDraw()
						break;
					case 'start': //开始

						break;
					case 'suspend': //暂停
						cancelAnimationFrame(this.myReq);
						break;
					case 'reset': //重置
						//清理动画
						cancelAnimationFrame(this.myReq);
						//清空画布
						this.ctx.clearRect(0,0,this.width,this.height);
						//数据重置
						// this.codeRainData = JSON.parse(JSON.stringify(this.codeRainArr))
						break;
					case 'update': //一般只更新高度跟速度
						this.height = Number(ins.getDataset().height)
						this.speed = Number(ins.getDataset().speed)
						break; //更新数据
					default:
						break;
				}
            },
			//重新画布
			globalDraw(){
				//已经移动的距离
				this.move += this.speed;
				//清空指引线位置
				let line = [];
				//内部循环时使用的距离
				let m = this.move;
				//计算
				this.judge();
				//把画布擦干净
				this.ctx.clearRect(0, 0, this.width, this.height)
				for (let n = 0; n < this.codeRainData.length; n++) {
					// if (stop) break;
					//取出列
					let col = this.codeRainData[n];
					try {
						//拿第一个值进行判断，如果yLoc大于speed，结束循环，减少内存消耗
						if (col[0].yLoc - m > this.speed) {
							break;
						} else {
							//遍历列，画出该列的代码
							for (let i = 0; i < col.length; i++) {
								// if (stop) break;
								//取出列
								let note = col[i];
								if (note.jump) {
									continue;
								}
								//高度
								let y = note.y + m
								//如果y大于屏幕高度，移除数据
								if (y > this.ch) {
									this.codeRainData[n][i].jump = 1;
								} else if (note.key == 0) { //小节线
									//填充颜色
									this.ctx.fillStyle = note.color;
									//画出矩形
									this.ctx.fillRect(note.x, y, note.w, note.h) //x,y,w,h
								} else {
									//画指引线，先判断是否画过，避免重复画
									if (line.indexOf(note.key) == -1) {
										this.ctx.fillStyle = "rgba(255,255,255,0.2)";
										this.ctx.fillRect(note.x, 0, note.w, this.ch);
										line.push(note.key);
									}
									this.ctx.fillStyle = note.color
									this.ctx.fillRect(note.x, y, note.w, note.h)
									//绘制并填充一个圆角矩形（有卡顿现象）
									// fillRoundRect(this.ctx, note.x, y, note.w, note.h, radiusNumb, note.color);
								}
							}
						}
					} catch(e) {
						continue
					}
				}
				var that = this
				requestAnimationFrame(function() {
					that.globalDraw()
				})
			},
			async judge(){
				//已经移动的距离
				// this.move += speed;
			},
			//向uni发送数据
			onClick(event, ownerInstance) {
				// 向 uni 的script发送信息
			},
        }
    }
</script>



<script>
	//读取xml数据
	let dataWv;
	import score from '@/components/common/score.vue';
	import keyboard from '@/components/common/keyboard.vue';
    export default {
		components:{
			score,
			keyboard
		},
        data() {
            return {
				globalData:getApp().globalData,
				xmlInfo:{
					id:0,
					cwid:0,
					path:'',
					title:''
				},
				xmlData:{},
				codeRainArr:'',
				endMidi:[],
				curMidi:[],
				errMidi:[],
				playMidi:[],
				w:getApp().globalData.width/52, //白键宽度
				b:getApp().globalData.width*1.2/100, //黑键宽度
				loc:[
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
				order:null, //向renderjs发送指令
				speed:2,
				standardLen:62.5*2, //代码雨长度
				subNVue:null,
			}
        },
        onReady: function() {
            this.$nextTick(() => {
                uni.createSelectorQuery().select(".canvas").boundingClientRect(data => {}).exec()
            })
        },
		onLoad(){
			uni.showLoading({
				title:'加载中...',
				mask:true
			})
			this.xmlInfo.title = "因为爱情"
			this.xmlInfo.path = "http://api.thedream.tech/uploads/download/2019-06-29/5d171f69b7751.xml"
			// #ifdef APP-PLUS
			if (getApp().globalData.width < 1925) {
				this.loc = [
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
				dataWv = plus.webview.create('/hybrid/html/readxml/index.html?url='+that.xmlInfo.path, '__data__', {
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
				//监听webview返回数据
				plus.globalEvent.addEventListener('plusMessage', (e) => {
					if (e.data.args.data.name == 'postMessage'){
						that.xmlData = JSON.parse(e.data.args.data.arg.action)
						that.createCodeRain()
					}
				})
			},1000);
			// #endif
		},
		methods:{
			sendMsg(msg){
				console.log(msg)
			},
			//创建瀑布流数据
			createCodeRain(){
				let rain = []
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
					if (rain.length) {
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
									y : Number('-'+(1+bottom)), 
									//Y轴开始距离顶部的距离
									yLoc : bottom, 
									//当前高度
									h : 1,
									//宽度
									w : getApp().globalData.width,
									//颜色
									color : "rgba(255,255,255,0.8)",
									//左右手
									hand : 0,
									velocity:0,
									//跳过
									jump:0
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
								x : this.loc[(midi[a][i].pitch - 21)].x,
								//Y轴位置
								y : Number('-'+(height+bottomTop)), 
								//Y轴开始距离顶部的距离
								yLoc : bottomTop, 
								//当前高度
								h : height,
								//宽度
								w : this.loc[(midi[a][i].pitch - 21)].w,
								//颜色
								color : color,
								//左右手
								hand : midi[a][i].hand,
								//声音(暂时理解为力度)
								velocity : midi[a][i].velocity,
								//跳过
								jump:0
							}
							col.push(note)
							nMidi.push(note)
							//松开
							let up = {}
							//Y轴结束距离顶部的距离(松开的距离)
							up.key = midi[a][i].pitch
							up.yLoc = height + bottomTop
							this.endMidi.push(up)
						}
					}
					if (col.length) {
						rain.push(col)
					}
					if (nMidi.length) {
						this.curMidi.push(nMidi)
					}
				}
				this.codeRainArr = JSON.stringify(rain)
				//按松开的距离从小到大排序
				this.endMidi.sort(this.compare("yLoc"))
				//添加结束标记
				this.endMidi.push({key:-1})
				//添加结束标记
				this.curMidi.push([{key:-1}])
				this.playMidi = this.curMidi
				//数据准备完成
				this.order = 'ready'
				uni.hideLoading()
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
		}

    }
</script>


<style>
	page{
		width:100%;
		height:100%;
		background: #000;
	}
	@media screen and (max-width:2565px){
		.setting{
			width:255px;
			height:85px;
			position: fixed;
			right:10px;
			top:20px;
			z-index: 9999999999999;
			background: red;
		}
		.setting image{
			width:85px;
			height:85px;
		}
		.operation{
			width:280px;
			/* height:380px; */
			height:450px;
			position: absolute;
			right:70px;
			top:5px;
			background: #3D3C3C;
			color:#fff;
			padding:30px;
			border-radius: 10px;
			display: none;
		}
		.operation h1{
			font-size: 24px;
			margin:0;
			border-bottom: 2px #656464 solid;
			padding-bottom:20px;
			margin-bottom:10px;
			font-weight: normal;
			text-overflow: ellipsis;
			white-space: nowrap;
			overflow: hidden;
		}
		.param{
			width:100%;
			height:auto;
			margin:10px auto 0;
			overflow: hidden;
		}
		.param .info{
			width: 100%;
			height:auto;
			text-align: center;
		}
		.param .info em{
			padding: 5px 16px;
			background: #7a7a7a1f;
			border-radius: 20px;
			text-align: center;
			font-size:16px;
			margin:10px auto;
			font-style: normal;
			display: inline-block;
			cursor:pointer;
		}
		.param .left{
			width:50px;
			height:auto;
			line-height: 50px;
			font-size:20px;
		}
		.param .right{
			width:calc(100% - 50px);
			height:auto;
		}
		.param .right p{
			width:calc(100% - 6px);
			padding:0 3px;
			font-size:18px;
			line-height: 50px;
			margin:0 auto;
		}
		.param i{
			width:calc(30% - 20px);
			height:auto;
			background: #7b7b7b;
			padding:5px 10px;
			border-radius: 15px;
			margin-top: 10px;
			display: inline-block;
			text-align: center;
			font-style: normal;
			margin-left:3.33%;
			cursor:pointer;
		}
		.curbg{
			background: #026be4 !important;
		}
		.hand{
			width:50%;
			height:auto;
			overflow: hidden;
			margin-top:3px;
		}
		.hand .imgbox{
			width:100%;
			height:auto;
			overflow: hidden;
		}
		.hand .imgbox img{
			max-width:118px;
			height:auto;
			float:left;
		}
		.hand p{
			width:100%;
			height:auto;
			text-align: center;
			line-height: 20px !important;
			font-size:14px !important;
		}
		.keyboard-switch img{
			max-width: 118px;
			position: relative;
			top:3px;
		}
		.speed{
			width:calc(100% - 11px);
			height:auto;
			border:2px #656464 solid;
			overflow: hidden;
			line-height: 50px;
			text-align: center;
			margin-top:8px;
			margin-left:7px;
			border-radius: 25px;
		}
		.speed .minus{
			width:50px;
			height:auto;
			line-height: 30px;
			border-right:2px #656464 solid;
			font-size:40px;
		}
		.speed .value{
			width:calc(100% - 104px);
			height:auto;
			line-height: 30px;
		}
		.speed .percent{
			display:inline-block;
		}
		.speed .symbol{
			display:inline-block;
		}
		.speed .plus{
			width:50px;
			height:auto;
			line-height: 30px;
			border-left:2px #656464 solid;
			font-size:34px;
		}
		.speed span{
			position: relative;
			top:-2px;
			cursor:pointer;
		}
		.speed .plus span{
			top:0px;
			cursor:pointer;
		}
		.goback{
			position: fixed;
			bottom:30px;
			right:10px;
			z-index: 99999999999;
		} 
		.goback img{
			width:180px;
			height:72px;
		}
		/*键盘样式*/
		.keyboard{
			width:2860px;
			height:30px;
			position: fixed;
			left:-193px;
			bottom:-0;
			overflow: hidden;
		}
		.key{
			/* width:calc(1.923% - 1px); */
			width:56.4px;
			height:100%;
			float:left;
			/* border-left:3px #fff solid; */
		}
		.key:first-child{
			border-left:0;
		}
		.key:last-child{
			border-right:1rpx #000 solid;
		}
		.whiteKey {
			background-color:#fff;
			width: calc(100% - 3px);
			height:100%;
			border-bottom-left-radius:5px;
			border-bottom-right-radius:5px;
		}
		.blackKey {
			width:30px;
			height:20px;
			background-color:#000;
			position: absolute;
			top:0;
			border-bottom-left-radius:5px;
			border-bottom-right-radius:5px;
		}
		/* 88键 每个键平均49.22  黑键半个键是22  所以全键盘每半个黑键的偏移量是27.22 */
		/* 由于长条屏尺寸，实际显示左右会各少 5个键 左右各少2个黑键，3个白键 经计算后，每个键为53.4 黑键半个键是15 所以实际全键盘每半个黑键的偏移量是33.64 */
		#key22 .blackKey{left:33.64px;}
		#key25 .blackKey{left:calc(2*53.4px + 33.64px);}
		#key27 .blackKey{left:calc(3*53.4px + 50px);}
		#key30 .blackKey{left:calc(5*53.4px + 46px);}
		#key32 .blackKey{left:calc(6*53.4px + 55px);}
		#key34 .blackKey{left:calc(7*53.4px + 64px);}
		#key37 .blackKey{left:calc(9*53.4px + 60px);}
		#key39 .blackKey{left:calc(10*53.4px + 71px);}
		#key42 .blackKey{left:calc(12*53.4px + 64px);}
		#key44 .blackKey{left:calc(13*53.4px + 76px);}
		#key46 .blackKey{left:calc(14*53.4px + 86px);}
		#key49 .blackKey{left:calc(16*53.4px + 90px);}
		#key51 .blackKey{left:calc(17*53.4px + 90px);}
		#key54 .blackKey{left:calc(19*53.4px + 88px);}
		#key56 .blackKey{left:calc(20*53.4px + 96px);}
		#key58 .blackKey{left:calc(21*53.4px + 106px);}
		#key61 .blackKey{left:calc(23*53.4px + 102px);}
		#key63 .blackKey{left:calc(24*53.4px + 112px);}
		#key66 .blackKey{left:calc(26*53.4px + 106px);}
		#key68 .blackKey{left:calc(27*53.4px + 114px);}
		#key70 .blackKey{left:calc(28*53.4px + 127px);}
		#key73 .blackKey{left:calc(30*53.4px + 118px);}
		#key75 .blackKey{left:calc(31*53.4px + 134px);}
		#key78 .blackKey{left:calc(33*53.4px + 130px);}
		#key80 .blackKey{left:calc(34*53.4px + 138px);}
		#key82 .blackKey{left:calc(35*53.4px + 148px);}
		#key85 .blackKey{left:calc(37*53.4px + 141px);}
		#key87 .blackKey{left:calc(38*53.4px + 154px);}
		#key90 .blackKey{left:calc(40*53.4px + 150px);}
		#key92 .blackKey{left:calc(41*53.4px + 160px);}
		#key94 .blackKey{left:calc(42*53.4px + 170px);}
		#key97 .blackKey{left:calc(44*53.4px + 165px);}
		#key99 .blackKey{left:calc(45*53.4px + 175px);}
		#key102 .blackKey{left:calc(47*53.4px + 170px);}
		#key104 .blackKey{left:calc(48*53.4px + 185px);}
		#key106 .blackKey{left:calc(49*53.4px + 140px);}
		.cur{
			background-color: #98ef96;
		}
		.current{
			background-color: #98ef96;
			border-left:3px #98ef96 solid;
		}
		.err{
			background-color: #f00 !important;
		}
		.blackbg{
			width:100%;
			height:100%;
			background: rgba(0,0,0,0.3);
			position: fixed;
			left:0;
			top:0;
			z-index: 999999;
			display: none;
		}
		.finish{
			width:540px;
			height:auto;
			position: fixed;
			left:calc(50% - 250px);
			top:calc(50% - 150px);
			text-align: center;
			padding:10px;
			z-index: 999;
			background-image: linear-gradient(to right, #044BD6 , #009FFA);
			border-radius: 10px;
		}
		.finish i{
			font-style: normal;
			}
		.close{
			width:32px;
			height:auto;
			position: absolute;
			bottom: -45px;
			left: calc(50% - 16px);
		}
		.close img{
			max-width:32px;
		}
		.cot{
			width:calc(100% - 10px);
			height:calc(100% - 10px);
			border:5px #F0F0F0 solid;
		}
		.head{
			width:200px;
			height:auto;
			margin:0 auto;
		}
		.head img{
			max-width:100%;
		}
		.box{
			width:calc(100% - 40px);
			height:auto;
			margin:30px 20px;
		}
		.box .left{
			width:40%;
			height:auto;
		}
		.scorebox{
			width:100%;
			height:auto;
			margin:10px auto;
			overflow: hidden;
		}
		.box .score{
			height:auto;
			font-size:20px;
			color:#fff;
			text-align: center;
		}
		.box .score span{
			font-size:60px;
			display: inline-block;
		}
		.box .left p{
			width:80%;
			height:auto;
			background: #fff;
			font-size:12px;
			text-align: center;
			color:#0365E1;
			line-height: 20px;
			border-radius: 10px;
			margin:0 auto;
		}
		.box .rightbox{
			width:60%;
			overflow: hidden;
			margin-top:20px;
			text-align: center;
		}
		.box .rightbox li{
			width:calc(33.33% - 1px);
			height:auto;
			float:left;
			color:#fff;
			font-size:14px;
			border-left:1px #ffffff2e solid;
		}
		.box em{
			font-size:26px;
			font-style: normal;
		}
		.tips{
			width:calc(100% - 20px);
			height:auto;
			font-size:16px;
			color:#fff;
			line-height: 24px;
			margin:25px 10px;
		}
		.operabtn{
			width:90%;
			height:auto;
			overflow: hidden;
			margin:0 auto;
		}
		.noplay{
			width:calc(48% - 2px);
			height:40px;
			float:left;
			background: #fff;
			border-radius:20px;
			margin-right:4%;
			line-height: 40px;
			text-align: center;
			border:1px #fff solid;
			color:#0365E1;
			font-size:16px;
			cursor: pointer;
		}
		.again{
			width:calc(48% - 2px);
			height:40px;
			line-height: 40px;
			text-align: center;
			background: linear-gradient(to right,#0449D5, #00A1FB);
			font-size:16px;
			border:1px #fff solid;
			color:#fff;
			border-radius:20px;
			float:left;
			cursor: pointer;
		}
	}
</style>
