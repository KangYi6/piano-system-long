var cvs = document.getElementById("cvs"); 
var ctx = cvs.getContext("2d");
var cw = cvs.width = document.body.clientWidth;
var ch = cvs.height = document.body.clientHeight - 30;
//动画绘制对象
var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
var curMidi = []; //当前要弹
var playMidi = []; //正在弹
var endMidi = []; //结束MIDI
var codeRainArr = []; //代码雨数组
var move = 0; //已经移动的距离
var worker = null;
var loc = []; //琴键位置信息(用于画图)
var midiVolume = 60; //midi音量
var stepSpeed = 0.1; //速度调节长度
var myReq = null; //下落对象
var start = false; //开始&暂停
var stop = false; //停止(结束)
var speed = 2; //移动速度(px)
var tempo = 60; //曲谱速度
var hand = 0; //伴音 1左右 2右手 3双手 0关闭(默认)
var keyboard = true; //键盘显示
var operation = false; //设置面板显示
var difficulty = 10; //难度，默认适中
var first = true; //是否第一次拿数据
var line = []; //画指示线的位置 21-108
//按键效果
var fire = [];
var bound = [cw/2, ch/2, 90, 120];
//雨滴圆角弧度
var radiusNumb = 7;
if (cw < 1925) {
	radiusNumb = 4;
}
//开始&暂停
function startBtn() {
	stop = false;
	start = !start;
	if (start) {
		//显示暂停按钮
		$('.start').hide();
		$('.stop').show();
		// genFire()
		//创建线程
		worker = new Worker('assets/animate.js');
		worker2 = new Worker('assets/animate2.js');
		worker3 = new Worker('assets/animate3.js');
		worker.onmessage = function (e) {
			let data = JSON.parse(e.data)
			if (data.type == 'move') { //音符挪至尾部
				curMidi.push(curMidi.shift());
			} else if (data.type == 'curMidi') { //加下当前可弹MIDI
				message('curMidi',data.data);
			} else if (data.type == 'over') { //结束进程
				//终止线程
				worker.terminate()
			}
		}
		worker2.onmessage = function (e) {
			let data = JSON.parse(e.data)
			if (data.type == 'move') { //音符挪至尾部
				playMidi.push(playMidi.shift());
			} else if (data.type == 'keydown') { //播放MIDI
				if (hand == 3) {
					message('keydown',data.data);
				} else if (hand == data.data.hand){
					message('keydown',data.data);
				}
			} if (data.type == 'over') { //结束进程
				worker2.terminate()
			}
		}
		worker3.onmessage = function (e) {
			let data = JSON.parse(e.data)
			if (data.type == 'keyup') { //松开按键
				endMidi.push(endMidi.shift());
				message('keyup',data.data);
			} else if (data.type == 'over') { //结束
				//终止线程
				worker3.terminate()
				//计算成绩
				message('over',hand);
			}
		}
		//开始计时
		message('start');
		//开始动画
		myReq = requestAnimationFrame(codeRaining);
	} else {
		cancelAnimationFrame(myReq);
		//显示开始按钮
		$('.start').show();
		$('.stop').hide();
		//暂停接收midi
		message('suspend');
	}
}
//显示成绩
function score(data){
	$('#score').text(data.score);
	$('#time').text(data.time);
	$('#error').text(data.error);
	$('#accuracy').text(data.accuracy);
	$('#fighting').text(data.fighting);
	$('.tips').text(data.tips);
	$('.blackbg').show();
	//重置按钮
	resetBtn();
}

//成绩确定
$('.again').click(function(){
	$('.blackbg').hide();
	startBtn();
})
//成绩关闭
$('.close').click(function(){
	$('.blackbg').hide();
})
//重置
function resetBtn(){
	//清理动画
	cancelAnimationFrame(myReq);
	//清空画布
	ctx.clearRect(0,0,cw,ch);
	//清空数据
	codeRainArr = [];
	//重新拉取数据
	message('create');
	start = false;
	stop = true;
	move = 0;
	//显示开始按钮
	$('.start').show();
	$('.stop').hide();
	//最后再清理一次琴键
	$('.key div:first-child').removeClass('err cur');
}
//加速&减速(指在原来曲谱的速度上增加或减少10%，即0.1px)
function speedBtn(type){
	let percent = Number($('.percent').text());
	if (type == 'plus') {
		if (percent >= 200) {
			return;
		}
		speed += stepSpeed;
		percent += 10;
		
	} else {
		if (percent <= 10) {
			return;
		}
		speed -= stepSpeed;
		percent -= 10;
	}
	$('.percent').text(percent);
	//计算百分比，计算曲谱速度
	$('.bpm').text(tempo*(percent)*0.01+' BPM');
}
//伴音
function handBtn(that,type){
	if (type == 1) { //左手
		if (hand == 1) {
			$('.lefthand img:first-child').hide();
			$('.lefthand img:last-child').show();
			hand = 0;
		} else if (hand == 2) {
			$('.lefthand img:first-child').show();
			$('.lefthand img:last-child').hide();
			hand = 3;
		} else if (hand == 3) {
			$('.lefthand img:first-child').hide();
			$('.lefthand img:last-child').show();
			hand = 2;
		} else if (hand == 0) {
			$('.lefthand img:first-child').show();
			$('.lefthand img:last-child').hide();
			hand = 1;
		}
	} else { //右手
		if (hand == 1) {
			$('.righthand img:first-child').show();
			$('.righthand img:last-child').hide();
			hand = 3;
		} else if (hand == 2) {
			$('.righthand img:first-child').hide();
			$('.righthand img:last-child').show();
			hand = 0;
		} else if (hand == 3) {
			$('.righthand img:first-child').hide();
			$('.righthand img:last-child').show();
			hand = 1;
		} else {
			$('.righthand img:first-child').show();
			$('.righthand img:last-child').hide();
			hand = 2;
		}
	}
}
//键盘开关
function keyBtn(){
	// let cvsData = ctx.getImageData(0, 0, cvs.width, cvs.height);
	keyboard = !keyboard;
	if (keyboard) { //显示
		ch -= 30;
		$('.keyimg:first-child').show();
		$('.keyimg:last-child').hide();
		$('.keyboard').show();
	} else { //隐藏
		ch += 30;
		$('.keyimg:first-child').hide();
		$('.keyimg:last-child').show();
		$('.keyboard').hide();
	}
	cvs.height = ch
	console.log(cvs.height)
	// ctx.putImageData(cvsData, cw, ch);
}
//难度
function difficultyBtn(that,value){
	difficulty = value;
	$(that).addClass('curbg').siblings().removeClass('curbg');
}
//设置
function setBtn(){
	operation = !operation;
	if (operation) {
		$('.operation').show();
	} else {
		$('.operation').hide();
	}
}
//标记琴键颜色
function keyDown(key,right){
	if (!right) {
		$('#key'+key+' div:first-child').addClass('err');
	} else {
		$('#key'+key+' div:first-child').addClass('cur');
	}
}
//琴键松开
function keyUp(key){
	$('#key'+key+' div:first-child').removeClass('err cur');
}
//返回上一页
function goback(){
	message('back');
}
//创建代码雨
function createCodeRain(obj) {
	codeRainArr = obj.codeRainArr;
	endMidi = obj.endMidi;
	curMidi = obj.curMidi;
	playMidi = obj.playMidi;
	loc = obj.loc;
	if (first) {
		first = false;
		tempo = obj.tempo;
		$('.title').text(obj.title);
		$('.mode').text(obj.mode+' 大调');
		$('.signature').text(obj.signature);
		$('.bpm').text(tempo+' BPM');
	}
	startBtn()
}
//背景颜色
function createColorCv() {
	//画布背景颜色
	ctx.fillStyle = "#000";
	ctx.fillRect(0,0,cw,ch); 
}

//代码雨下起来
function codeRaining(){
	if (stop) return;
	//已经移动的距离
	move += speed;
	//数据
	// var obj = Object.assign({},codeRainArr);
	// var obj = JSON.parse(JSON.stringify(codeRainArr));
	//清空指引线位置
	line = [];
	//内部循环时使用的距离
	var m = move;
	//计算
	judge();
	//把画布擦干净
	ctx.clearRect(0,0,cw,ch);
	//创建有颜色的画布
	createColorCv();
	for (var n = 0; n < codeRainArr.length; n++) {
		if (stop) break;
		//取出列
		var col = codeRainArr[n];
		// if (!col.length) {
		// 	continue
		// }
		try {
			//拿第一个值进行判断，如果yLoc大于speed，结束循环，减少内存消耗
			if (col[0].yLoc - m > speed) {
				break;
			} else {
				//遍历列，画出该列的代码
				for (var i = 0; i < col.length; i++) {
					if (stop) break;
					//取出列
					var note = col[i];
					if (note.jump) {
						continue;
					}
					//高度
					var y = note.y + m
					//如果y大于屏幕高度，移除数据
					if (y > ch) {
						codeRainArr[n][i].jump = 1;
						// codeRainArr[n].splice(i,1);
					} else if (note.key == 0) { //小节线
						//填充颜色
						ctx.fillStyle = note.color;
						//画出矩形
						ctx.fillRect(note.x, y, note.w, note.h) //x,y,w,h
					} else {
						//画指引线，先判断是否画过，避免重复画
						if (line.indexOf(note.key) == -1) {
							ctx.fillStyle = "rgba(255,255,255,0.2)";
							ctx.fillRect(note.x, 0, note.w, ch);
							line.push(note.key);
						}
						ctx.fillStyle = note.color
						ctx.fillRect(note.x, y, note.w, note.h)
						//绘制并填充一个圆角矩形（有卡顿现象）
						// fillRoundRect(ctx, note.x, y, note.w, note.h, radiusNumb, note.color);
					}
				}
				//如果没有元素了，则整个移除
				// if (codeRainArr[n].length == 0) {
				// 	codeRainArr.splice(n,1)
				// }
			}
		} catch(e) {
			continue
		}
	}
	myReq = requestAnimationFrame(codeRaining);
}

async function judge(){
	// worker.postMessage(
	// 	JSON.stringify({
	// 		curMidi:curMidi,
	// 		playMidi:playMidi,
	// 		endMidi:endMidi,
	// 		speed:speed,
	// 		ch:ch,
	// 		move:move,
	// 		difficulty:difficulty,
	// 		midiVolume:midiVolume*0.01
	// 	})
	// );
	worker.postMessage(JSON.stringify({curMidi:curMidi,speed:speed,ch:ch,move:move,difficulty:difficulty}));
	worker2.postMessage(JSON.stringify({playMidi:playMidi,speed:speed,ch:ch,move:move,difficulty:difficulty,midiVolume:midiVolume*0.01}));
	worker3.postMessage(JSON.stringify({endMidi:endMidi,speed:speed,ch:ch,move:move,difficulty:difficulty}));
}

/**该方法用来绘制一个有填充色的圆角矩形 
 *@param ctx:canvas的上下文环境 
 *@param x:左上角x轴坐标 
 *@param y:左上角y轴坐标 
 *@param width:矩形的宽度 
 *@param height:矩形的高度 
 *@param radius:圆的半径 
 *@param fillColor:填充颜色 
 **/
function fillRoundRect(content, x, y, width, height, radius, fillColor) {
	//圆的直径必然要小于矩形的宽高          
	if (2 * radius > width || 2 * radius > height) { return false; }
	content.save();
	content.translate(x, y);
	content.fillStyle = fillColor || "#000"; //若是给定了值就用给定的值否则给予默认值  
	//绘制圆角矩形的各个边
	drawRoundRectPath(content, width, height, radius);
	content.fill();
	content.restore();
}
function drawRoundRectPath(content, width, height, radius) {
	content.beginPath(0);
	//从右下角顺时针绘制，弧度从0到1/2PI  
	content.arc(width - radius, height - radius, radius, 0, Math.PI / 2);
	//矩形下边线  
	content.lineTo(radius, height);
	//左下角圆弧，弧度从1/2PI到PI  
	content.arc(radius, height - radius, radius, Math.PI / 2, Math.PI);
	//矩形左边线  
	content.lineTo(0, radius);
	//左上角圆弧，弧度从PI到3/2PI  
	content.arc(radius, radius, radius, Math.PI, Math.PI * 3 / 2);
	//上边线  
	content.lineTo(width - radius, 0);
	//右上角圆弧  
	content.arc(width - radius, radius, radius, Math.PI * 3 / 2, Math.PI * 2);
	//右边线  
	content.lineTo(width, height - radius);
	content.closePath();
}

//加载发生变化时调用
document.onreadystatechange = subSomething
function subSomething() {
    // 判断是否加载完成
    if (document.readyState == 'complete') {
		setTimeout(function(){
			//页面准备完成
			message('ready');
		},2500)
	}
	//伴音音量调整
	$( "#slider").slider({
		orientation:"horizontal",
		value:midiVolume,
		slide: function( event, ui ) {
			midiVolume = ui.value
			$('.velocity').text(midiVolume)
		}
	});
}

mR = (n, i) => Math.floor(Math.random() * n) + i

async function genFire(){
	for (let i = fire.length; i < 2; i++) {
		fire.push([mR(bound[2]/3, bound[0]+bound[2]/3), mR(bound[3], bound[1]), -Math.random(10)/100 + 1, Math.random(), mR(5, 1)])
	}
}

async function think(){
	bound[0] = 1500-bound[2]/2
	bound[1] = 690-bound[3]/1.2
	
	// console.log(bound)
	// console.log(fire)
	for (let i = 0; i < fire.length; i++) {
	  fire[i][0] > bound[0]+bound[2]/2 && fire[i][1] > bound[1]+bound[3]/3 ? fire[i][0]+= 0.3: fire[i][0]-= 0.4
	  fire[i][0] < bound[0]+bound[2]/2 && fire[i][1] > bound[1]+bound[3]/3 ? fire[i][0]-= 0.3: fire[i][0]+= 0.4
	  fire[i][3]-= 0.01
	  fire[i][1]*= fire[i][2]
	  fire[i][1] <= 0 || fire[i][3] <= 0 ? fire.splice(i, 1): null
	  // console.log(fire);
	  genFire()
	}
	
	bound[0] = 1300-bound[2]/2
	bound[1] = 690-bound[3]/1.2
	
	// console.log(bound)
	// console.log(fire)
	for (let i = 0; i < fire.length; i++) {
	  fire[i][0] > bound[0]+bound[2]/2 && fire[i][1] > bound[1]+bound[3]/3 ? fire[i][0]+= 0.3: fire[i][0]-= 0.4
	  fire[i][0] < bound[0]+bound[2]/2 && fire[i][1] > bound[1]+bound[3]/3 ? fire[i][0]-= 0.3: fire[i][0]+= 0.4
	  fire[i][3]-= 0.01
	  fire[i][1]*= fire[i][2]
	  fire[i][1] <= 0 || fire[i][3] <= 0 ? fire.splice(i, 1): null
	  // console.log(fire);
	  genFire()
	}
	animate()
}

function animate(){
	for (let i = 0; i < fire.length; i++) {
		dC(fire[i][0], fire[i][1], fire[i][4], fire[i][3])
	}
}

function dC(x, y, s, c){
  let rC = ["rgba(255, 0, 0, "+c+")", "rgba(255, 69, 0, "+c+")", "rgba(255, 140, 0, "+c+")"]
  ctx.beginPath()
  ctx.save()
  ctx.shadowColor = rC[mR(rC.length, 0)]
  ctx.shadowBlur = s/2
  ctx.fillStyle = rC[mR(rC.length, 0)]
  ctx.arc(x, y, s, 0, Math.PI*2, true)
  ctx.fill()
  ctx.restore()
}


//返回数据
function message(type,data){
	var res = {};
	res.type = type;
	if (data != 'undefined') {
		res.data = data;
	}
	uni.postMessage({
		data: {
			action: res
		}
	});
}