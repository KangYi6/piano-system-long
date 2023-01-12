<template>
    <view>
<!-- 		<view class="setting">
			<view @click="startBtn()">
				<image class="start" src="assets/images/start-icon.png"></image>
				<image class="stop hide" src="assets/images/stop.png"></image>
			</view>
			<view @click="resetBtn()"><image src="assets/images/reset-icon.png"></image></view>
			<view @click="setBtn()"><image src="assets/images/set-icon.png"></image></view>
			<view class="operation">
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
							<view class="minus fl" @click="speedBtn('minus')"><span>-</span></view>
							<view class="value fl">
								<view class="percent">100</view>
								<view class="symbol">%</view>
							</view>
							<view class="plus fl" @click="speedBtn('plus')"><span>+</span></view>
						</view>
					</view>
				</view>
				<view class="param">
					<view class="left fl">伴音</view>
					<view class="right fl">
						<view class="hand fl">
							<view class="imgbox lefthand" @click="handBtn(this,1)">
								<img class="hide" src="assets/images/open.png">
								<img src="assets/images/close.png">
							</view>
							<p>左手</p>
						</view>
						<view class="hand fl">
							<view class="imgbox righthand" @click="handBtn(this,2)">
								<img class="hide" src="assets/images/open.png">
								<img src="assets/images/close.png">
							</view>
							<p>右手</p>
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
						<view class="keyimg"><img src="assets/images/open.png"></view>
						<view class="keyimg hide"><img src="assets/images/close.png"></view>
					</view>
				</view>
				<view class="param keyboard-switch">
					<view class="left fl">难度</view>
					<view class="right fl">
						<i @click="difficultyBtn(this,15)">简单</i><i @click="difficultyBtn(this,10)" class="curbg">适中</i><i @click="difficultyBtn(this,5)">最难</i>
					</view>
				</view>
			</view>
		</view> -->
		<!-- 弹奏模式 -->
		<!-- <score></score> -->
		<!-- 键盘 -->
		<!-- <keyboard :curMidi="curMidi" :errMidi="errMidi"></keyboard> -->
		<!-- 返回 -->
		<!-- <view class="goback" onclick="goback()"><img src="assets/images/goback.png"></view> -->
		<!-- 仅出现在 app h5 -->
		<!-- #ifdef APP-PLUS || H5 -->
		<canvas canvas-id="canvas" class="canvas" :style="'width:'+globalData.width+'px;height:'+globalData.width+'px'" 
			:msg="order"
			:change:msg="animate.msg" 
			:data-width="globalData.width" 
			:data-height="globalData.height" 
			:data-speed="speed" 
			:data-loc="locStr" 
			:data-list="codeRainArr" 
		></canvas>
		<!-- #endif -->
    </view>
</template>

<script module="animate" lang="renderjs">
    export default {
		data(){
			return {
				ch: 0, //高度
				codeRainArr:[], //原如数据
				codeRainData:[], //时实数据
				width:0,
				height:0,
				speed:0,
				loc:[],
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
        methods: {
			//接收uni指令
            msg(newVal, oldVal, owner, ins) {
				console.log(newVal)
				switch (newVal){
					case 'ready': //准备完成,读取数据
						this.cvs = document.querySelectorAll('.canvas>canvas')[0]
						this.ctx = this.cvs.getContext('2d')
						this.width = ins.getDataset().width
						this.height = ins.getDataset().height
						this.speed = ins.getDataset().speed
						this.codeRainArr = JSON.parse(ins.getDataset().list)
						this.codeRainData = JSON.parse(ins.getDataset().list)
						this.loc = JSON.parse(ins.getDataset().loc)
						//自动开始
						// this.codeRaining()
						this.last = Date.now();
						this.animate()
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
						this.codeRainData = JSON.parse(JSON.stringify(this.codeRainArr))
						break;
					case 'update': //一般只更新高度跟速度
						this.height = ins.getDataset().height
						this.speed = ins.getDataset().speed
						break; //更新数据
					default:
						break;
				}
            },
			//圆角矩形 
			fillRoundRect(ctx, x, y, width, height, radius, fillColor) {
				//圆的直径必然要小于矩形的宽高          
				if (2 * radius > width || 2 * radius > height) { return false; }
				ctx.save();
				ctx.translate(x, y);
				ctx.fillStyle = fillColor || "#000"; //若是给定了值就用给定的值否则给予默认值  
				//绘制圆角矩形的各个边
				this.drawRoundRectPath(ctx, width, height, radius);
				ctx.fill();
				ctx.restore();
			},
			drawRoundRectPath(ctx, width, height, radius) {
				ctx.beginPath(0);
				//从右下角顺时针绘制，弧度从0到1/2PI  
				ctx.arc(width - radius, height - radius, radius, 0, Math.PI / 2);
				//矩形下边线  
				ctx.lineTo(radius, height);
				//左下角圆弧，弧度从1/2PI到PI  
				ctx.arc(radius, height - radius, radius, Math.PI / 2, Math.PI);
				//矩形左边线  
				ctx.lineTo(0, radius);
				//左上角圆弧，弧度从PI到3/2PI  
				ctx.arc(radius, radius, radius, Math.PI, Math.PI * 3 / 2);
				//上边线  
				ctx.lineTo(width - radius, 0);
				//右上角圆弧  
				ctx.arc(width - radius, radius, radius, Math.PI * 3 / 2, Math.PI * 2);
				//右边线  
				ctx.lineTo(width, height - radius);
				ctx.closePath();
			},
			//重新画布
			globalDraw(){
				//把画布擦干净
				this.ctx.clearRect(0, 0, this.width, this.height)
				let length = this.codeRainData.length
				for (var n = 0; n < length; n++) {
					//取出列
					var col = this.codeRainData[n]
					// console.log(col);return;
					// 遍历列，画出该列的代码
					for (var i = 0; i < col.length; i++) {
						// 取出列
						let note = col[i]
						// 匀速降落
						note.y += 1;
						if (note.key == 0) { //小节线
							//填充颜色
							this.ctx.fillStyle = note.color;
							//画出矩形
							this.ctx.fillRect(note.x, note.y, note.w, note.h) //x,y,w,h
						} else {
							// 出现时，增加线条指示
							if (this.move - note.yLoc >= 0 && this.move - note.yLoc <= 1) {
								// this.addLine(note.key,1);
							}
							this.ctx.fillStyle = note.color
							this.ctx.fillRect(note.x, note.y, note.w, note.h) //x,y,w,h
							//绘制并填充一个圆角矩形  
							// this.fillRoundRect(this.ctx, note.x, note.y, note.w, note.h, 5, note.color);
						}
					}
				}
				//画线
				this.createLine('line');
				// var that = this
				// 计数器 % (60/一秒钟执行的次数)
				// if(this.i%parseInt(60/(1000/60)) == 0){
				// 	that.codeRaining()
				// }
				// i++
				// this.myReq = requestAnimationFrame(function() {
				// 	// console.log(1)
				// 	// if (this.stop) {
				// 	// 	return;
				// 	// }
				// 	that.codeRaining()
				// })
			},
			async judge(speed){
				//已经移动的距离
				this.move += speed;
			},
			async addLine(key,value){
				let index = key - 21;
				this.loc[index].line = this.loc[index].line + value;
				if (this.loc[index].line < 0) {
					this.loc[index].line = 0;
				}
			},
			//画指示线
			async createLine(type){
				// if (this.stop) {
				// 	return;
				// }
				for (let i = 0; i < this.loc.length; i++) {
					// if (this.stop) {
					// 	return;
					// }
					if (type == 'line') {
						if (this.loc[i].line) {
							this.ctx.fillStyle = "rgba(255,255,255,0.2)";
							this.ctx.fillRect(this.loc[i].x, 0, this.loc[i].w, this.height);
						}
					} else {
						if (this.loc[i].line) {
							this.loc[i].line = 0;
						}
					}
				}
			},
			//时间
			setDelta(){
			    this.now = Date.now();
			    this.delta = (this.now - this.last) / 1000;
			    this.last = this.now;
			},
			// //开始
			animate(){
				console.log(123)
			    this.setDelta();
			    this.globalDraw();
				// var that = this
			    requestAnimationFrame(this.animate());
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
				locStr:'',
				order:null, //向renderjs发送指令
				speed:1,
				standardLen:60,
			}
        },
        onReady: function() {
            this.$nextTick(() => {
                uni.createSelectorQuery().select(".canvas").boundingClientRect(data => {}).exec()
            })
        },
		onLoad(options){
			uni.showLoading({
				title:'加载中...',
				mask:true
			})
			this.xmlInfo.title = options.title
			this.xmlInfo.path = options.path
			try {this.xmlInfo.id = options.id} catch(e){}
			try {this.xmlInfo.cwid = options.cwid} catch(e){}	
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
			this.locStr = JSON.stringify(this.loc)
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
		background: #fff;
	}
</style>
