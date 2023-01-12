<template>
    <view>
		<!-- 仅出现在 app h5 -->
		<!-- #ifdef APP-PLUS || H5 -->
		<canvas canvas-id="canvas" class="canvas" :style="'width:'+globalData.width+'px;height:'+globalData.width+'px'" 
			:msg="order"
			:change:msg="animate.msg" 
			:data-width="globalData.width" 
			:data-height="globalData.height" 
			:data-speed="speed" 
			:data-loc="loc" 
			:data-codeRainArr="codeRainArr" 
		></canvas>
		<!-- #endif -->
    </view>
</template>

<script module="animate" lang="renderjs">
	//圆角矩形 
	function fillRoundRect(ctx, x, y, width, height, radius, fillColor) {
		//圆的直径必然要小于矩形的宽高          
		if (2 * radius > width || 2 * radius > height) { return false; }
		ctx.save();
		ctx.translate(x, y);
		ctx.fillStyle = fillColor || "#000"; //若是给定了值就用给定的值否则给予默认值  
		//绘制圆角矩形的各个边
		drawRoundRectPath(ctx, width, height, radius);
		ctx.fill();
		ctx.restore();
	}
	function drawRoundRectPath(ctx, width, height, radius) {
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
	}
	function codeRaining(array,w,h){
		if (this.stop) {
			return;
		}
		//把画布擦干净
		ctx.clearRect(0, 0, w, h)
		//创建有颜色的画布
		//画布背景颜色
		ctx.fillStyle = "000"
		ctx.fillRect(0, 0, w, h)
		for (var n = 0; n < array.length; n++) {
			//取出列
			var col = array[n]
			// 遍历列，画出该列的代码
			for (var i = 0; i < col.length; i++) {
				// 取出列
				let note = col[i]
				// 匀速降落
				note.y += 2;
				if (note.key == 0) { //小节线
					//填充颜色
					ctx.fillStyle = note.color;
					//画出矩形
					ctx.fillRect(note.x, note.y, note.w, note.h) //x,y,w,h
				} else {
					// 出现时，增加线条指示
					if (move - note.yLoc >= 0 && move - note.yLoc <= 1) {
						addLine(note.key,1);
					}
					//绘制并填充一个圆角矩形  
					fillRoundRect(ctx, note.x, note.y, note.w, note.h, 5, note.color,);
				}
			}
		}
		this.myReq = requestAnimationFrame(function() {
			if (this.stop) {
				return;
			}
			codeRaining(array,w,h)
		})
	}
	async function judge(speed){
		//已经移动的距离
		move += speed;
	}
	
	async function addLine(key,value){
		let index = key - 21;
		loc[index].line = loc[index].line + value;
		if (loc[index].line < 0) {
			loc[index].line = 0;
		}
	}
    export default {
		data(){
			return {
				ch: 0, //高度
				codeRainArr:[],
				width:0,
				height:0,
				speed:2,
				loc:[],
				stop:false,
				myReq:null,
			}
		},
        methods: {
			//接收uni指令
            msg(newVal, oldVal, owner, ins) {
				switch (newVal){
					case 'ready': //准备完成,读取数据
						let width = ins.getDataset().width
						let height = ins.getDataset().height
						let speed = ins.getDataset().speed
						let codeRainArr = ins.getDataset().codeRainArr
						let loc = ins.getDataset().loc
						break;
					case 'start': //暂停
						let cvs = document.querySelectorAll('.canvas>canvas')[0]
						let ctx = cvs.getContext('2d')
						function animate(rainList,w,h) {
							if (stop) {
								return;
							}
							//把画布擦干净
						    ctx.clearRect(0, 0, w, h)
							//创建有颜色的画布
							//画布背景颜色
							ctx.fillStyle = "000"
							ctx.fillRect(0, 0, w, h)
							for (var n = 0; n < rainList.length; n++) {
								//取出列
								var col = rainList[n]
								// 遍历列，画出该列的代码
								for (var i = 0; i < col.length; i++) {
									// 取出列
									let note = col[i]
									// 匀速降落
									note.y += 2;
									if (note.key == 0) { //小节线
										//填充颜色
										ctx.fillStyle = note.color;
										//画出矩形
										ctx.fillRect(note.x, note.y, note.w, note.h) //x,y,w,h
									} else {
										// 出现时，增加线条指示
										if (move - note.yLoc >= 0 && move - note.yLoc <= 1) {
											addLine(note.key,1);
										}
										//绘制并填充一个圆角矩形  
										fillRoundRect(ctx, note.x, note.y, note.w, note.h, 5, note.color,);
									}
								}
							}
						    requestAnimationFrame(function() {
								if (this.stop) {
									return;
								}
								animate(rainList,w,h)
						    })
						}
						animate(rainList,width,height)
						break;
					case 'suspend': //暂停
						break;
					case 'reset': //重置
						break;
					default:
						break;
				}
				if (!arr.length) {
					return
				}
				// let width = ins.getDataset().width
				// let height = ins.getDataset().height
				// let speed = ins.getDataset().speed
				// let rainList = JSON.parse(JSON.stringify(arr))
                // let cvs = document.querySelectorAll('.canvas>canvas')[0]
                // let ctx = cvs.getContext('2d')
     //            function animate(rainList,w,h) {
					// //把画布擦干净
     //                ctx.clearRect(0, 0, w, h)
					// //创建有颜色的画布
					// //画布背景颜色
					// ctx.fillStyle = "000"
					// ctx.fillRect(0, 0, w, h)
					// for (var n = 0; n < rainList.length; n++) {
					// 	//取出列
					// 	var col = rainList[n]
					// 	// 遍历列，画出该列的代码
					// 	for (var i = 0; i < col.length; i++) {
					// 		// 取出列
					// 		let note = col[i]
					// 		// 匀速降落
					// 		note.y += 2;
					// 		if (note.key == 0) { //小节线
					// 			//填充颜色
					// 			ctx.fillStyle = note.color;
					// 			//画出矩形
					// 			ctx.fillRect(note.x, note.y, note.w, note.h) //x,y,w,h
					// 		} else {
					// 			// 出现时，增加线条指示
					// 			if (move - note.yLoc >= 0 && move - note.yLoc <= 1) {
					// 				addLine(note.key,1);
					// 			}
					// 			//绘制并填充一个圆角矩形  
					// 			fillRoundRect(ctx, note.x, note.y, note.w, note.h, 5, note.color,);
					// 		}
					// 	}
					// }
     //                requestAnimationFrame(function() {
					// 	animate(rainList,w,h)
     //                })
     //            }
     //            animate(rainList,width,height)
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
    export default {
        data() {
            return {
				globalData:getApp().globalData,
				path:'',
				xmlData:{},
				codeRainArr:[],
				endMidi:[],
				curMidi:[],
				playMidi:[],
				w:getApp().globalData.width/52, //白键宽度
				b:getApp().globalData.width*1.2/100, //黑键宽度
				loc:[],
				order:null, //向renderjs发送指令
				speed:2,
				standardLen:120,
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
			let path = 'http://api.thedream.tech/uploads/download/2019-05-06/5ccfb043cc417.xml'
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
				dataWv = plus.webview.create('/hybrid/html/readxml/index.html?url='+path, '__data__', {
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
						that.createCodeRain('start')
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
			createCodeRain(type){
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
									y : Number('-'+(1+bottom)) + 100, 
									//Y轴开始距离顶部的距离
									yLoc : bottom + 100, 
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
								x : this.loc[(midi[a][i].pitch - 21)].x + 100,
								//Y轴位置
								y : Number('-'+(height+bottomTop)) + 100, 
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
				this.codeRainArr = rain
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
</style>
