var follow = false;//跟弹模式
var hands = 0; //左右手 0双手 1左手 2右手
var method = 'through' //练习模式exercise 闯关模式through
var metronome = false; //节拍器
var metronomeVolume = 60; //节拍器音量
var keyTips = "auto"; //键盘提示
var defaultFifths = ""; //原始调式
var scaleAll = ""; //可选择的移调调式
var curFifths = ""; //当前调式
var support = false; //是否支持移调
var index = ""; //当前调式索引
var rightColor = "#008000";
var errorColor = "#FF0000";
var bgColor = ["#FEF0DE","#dbf5ce","#eeeeee","#ffffff"];
var colorIndex = 3;
var through = { //闯关参数
    follow:false,
    hands:0,
    metronome:false,
    keytips:'auto'
}
var isThrough = false //是否闯关环节

document.addEventListener('UniAppJSBridgeReady', function() {
    //页面准备完成，获取背景颜色
    uniMessage('colorIndex');
    try {
        $( "#slider").slider({
            orientation:"horizontal",
            value:60,
            slide: function( event, ui ) {
                volume = ui.value;
                $('.velocity').text(volume);
                metronomeVolume = volume;
                metronomeVolumeBtn();
            }
        });
    } catch (error) {
        
    }
})

//返回
function uniMessage(type,data){
    uni.postMessage({
        data: {
            action: JSON.stringify({type:type,data:data})
        }
    });
}

//更新曲谱
function paramBtn(url){
    $('#url').val(url)
    $('#send-btn').click();
}

//接收参数
function setParam(param){
    through.follow = false; //暂时全部为卡住
    // through.follow = param.mode; //暂时全部为卡住
    through.hands = param.hands;
    through.metronome = param.metronome;
    through.keytips = param.keytips;
    // if (false) {
        // modeBtn('follow');
    // } else {
        modeBtn('stuck');
    // }
    handBtn(param.hands);
    if (param.metronome) {
        metronomeBtn('open');
    } else {
        metronomeBtn('close');
    }
    keyboardBtn(param.keytips);
}

//练习模式
function methodBtn(type,active){
	if (type == 'through') {
		$('.'+type).hide().siblings().show();
		$('.mode').show();
		if (active) {
			setParam(through);
		} else {
			isThrough = true
		}
	} else if (type == 'exercise') {
		$('.'+type).hide().siblings().show();
		$('.mode').show();
	} else {
		$('.mode').hide();
	}
}

//操作按钮隐藏&显示
function operationBtn(type,tempo,signature){
    if (tempo) {
        $('.tempo').text(tempo+'BPM');
    }
    if (signature) {
        $('.signature').text(signature[0]+'/'+signature[1]);
    }
    if (type == 'show') {
        $('.controls').show();
    } else {
        $('.controls').hide();
    }
}

//设置按钮
function setBtn(type){
    if (type == undefined) {
        type = $('.switch').attr('data-status');
    }
    if (type == 'close') {
        $('.console').hide();
        $('.switch').attr('data-status','open');
    } else {
        $('.console').show();
        $('.switch').attr('data-status','close');
    }
}

//开始&重置
function startBtn(type,mark,back = 0){
    $('.'+type).hide().siblings().show();
    if (back) {
        uniMessage(type,mark);
    }
}

//还原状态，五线谱隐藏时触发(解决数据残留问题)
function reduction(){
    //左右手
    handBtn(0);
    //节拍器
    metronomeBtn('close');
    metronomeVolume = 60;
    $('.velocity').text(metronomeVolume)
    $( "#slider").slider({
        orientation:"horizontal",
        value:metronomeVolume
    });
    //模式
    modeBtn('stuck');
    //键盘
    keyboardBtn('auto');
    //隐藏按钮
    operationBtn('hide');
    //关闭分数窗
    closeBtn();
}

//跟弹&卡住
function modeBtn(type){
    if (type == 'follow') {
        $(".follow").hide().siblings().show();
        follow = true;
    } else {
        $(".stuck").hide().siblings().show();
        follow = false;
    }
	throughCheck()
}

//节拍器
function metronomeBtn(type){
    metronome = type == 'open' ? true : false;
    $('.metronome-'+type).hide().siblings().show();
	throughCheck()
}

//节拍器音量
function metronomeVolumeBtn(){
    uniMessage('metronomeVolume',metronomeVolume);
}

//左右手
function handBtn(value){
    hands = value;
    $('.hand'+hands).show().siblings().hide();
	throughCheck()
}

//键盘
function keyboardBtn(type){
    keyTips = type;
    $('.keyboard-'+type).show().siblings().hide();
	throughCheck()
}

//闯关&练习
function throughCheck(){
	if (isThrough) {
		if (follow == through.follow && metronome == through.metronome && hands == through.hands && keyTips == through.keytips) {
			methodBtn('through',false)
		} else {
			methodBtn('exercise',false)
		}
	}
}

//背景颜色
function bgBtn(index,type){
    $('body').css('background',bgColor[index]);
    colorIndex = index
    $('.color-'+index).addClass('cur').siblings().removeClass('cur');
    if (type == 'active') { //主动
        uniMessage('setColor',index);
    }
}

//放大&缩小
function zoom(type){
    if (type) {
        $('#zoom-in-btn').click();
    } else {
        $('#zoom-out-btn').click();
    }
}

//移调数据
function transposeData(data){
    defaultFifths = data.defaultFifths
    scaleAll = data.scaleAll
    curFifths = data.curFifths
    support = data.support
    $('.value').text(curFifths);
}

function transpositionBtn(type){
    if (support) {
        //当前调式在可移动调式中的索引
        var i = Object.keys(scaleAll).find(key=>scaleAll[key]==curFifths);
        if (type == 'minus') {
            if (i > -5) {
                curFifths = scaleAll[--i];
                $('.value').text(curFifths);
                index = i;
            } else {
                return false;
            }
        } else {
            if (i < 6) {
                curFifths = scaleAll[++i];
                $('.value').text(curFifths);
                index = i;
            } else {
                return false;
            }
        }
    } else {
        uniMessage('toast','该曲谱暂不支持移调功能!');
    }
}

function test(){
    metronomeVolume = 80;
    $('.velocity').text(metronomeVolume)
    $( "#slider").slider({
        orientation:"horizontal",
        value:metronomeVolume
    });
}

//确认
function confirm(){
    var data = {
		follow:follow,
		metronome:metronome,
		hands:hands,
		keyTips:keyTips,
		curFifths:curFifths,
		index:index,
		colorIndex:colorIndex
	};
    setBtn('close');
    uniMessage('param',data);
}

//分数面板
function score(data,type){
    $('.finish').removeClass('success fail');
    if (type == 'success') {
        $('.finish').addClass('success');
    } else if (type == 'fail') {
        $('.finish').addClass('fail');
    }
    $('#score').text(data.score);
    $('#accuracy').text(data.accuracy);
    $('#error').text(data.error);
    $('#fighting').text(data.fighting);
    $('.tips').text(data.tips);
    $('#time').text(data.time);
    $('.blackbg').show();
    operationBtn('hide');
    startBtn('reset','none',0);
}

//再弹一次
function again(){
    operationBtn('show');
    $('.blackbg').hide();
    startBtn('start','none',1);
}

//关闭分数
function closeBtn(){
    operationBtn('show');
    $('.blackbg').hide();
}

//下一关
function next(){
	uniMessage('next');
}

//课时学完
function over(){
	operationBtn('hide');
	$('.blackbg').hide();
	$('.over').show();
}

//返回
function goback(){
	$('.blackbg').hide();
	$('.over').hide();
    uniMessage('back');
}

//清空
function clearBtn(){
    reduction();
    $('#debug-clear-btn').click();
}


//显示光标
function showCursor(){
    $('#show-cursor-btn').click();
}
//隐藏光标
function hideCursor(){
    $('#hide-cursor-btn').click();
}
//下一步
function nextStep(){
    $('#next-cursor-btn').click();
}
//重置
function reset(){
    $('#reset-cursor-btn').click();
}
//跟随光标
function followCursor(){
    $('#follow-cursor-checkbox').click();
}
//移调值(自带)
function transpose(val){
    $('#transpose').val(val);
}
//移调(自带)
function transposeBtn(){
    $('#transpose-btn').click();
}
//跟弹开始&暂停
function followPlay(){
    $('.playpause-button').click();
}
//跟弹重置
function followReset(){
    $('.reset-button').click();
}
//速度
function setTempo(tempo){
    osmd.PlaybackManager.bpmChanged(Number(tempo), true);
}
//节拍器
function setMetronome(value){
    if (value == 0) {
        osmd.PlaybackManager.volumeMute(-1) //静音
    } else {
        try {
            osmd.PlaybackManager.volumeUnmute(1) //取消静音
        } catch (error) {
            
        }
        osmd.PlaybackManager.Metronome.Volume = Number(value)
        // or
        // osmd.PlaybackManager.volumeChanged(-1,Number(metronome))
    }
}
//声音
function setVoice(voice){
    if (voice == 0) {
        osmd.PlaybackManager.volumeMute(0)
    } else {
        try {
            osmd.PlaybackManager.volumeUnmute(0)
        } catch (error) {
            
        }
        osmd.PlaybackManager.volumeChanged(0,Number(voice))
    }
}
//钢琴
function setPiano(piano){
    if (piano == 0) {
        osmd.PlaybackManager.volumeMute(1)
    } else {
        try {
            osmd.PlaybackManager.volumeUnmute(1)
        } catch (error) {
            
        }
        osmd.PlaybackManager.volumeChanged(1,Number(piano))
    }
}
//监听
function listenBtn(){
    $('#listen-btn').click();
}
//光标跳到指定小节
function measureBtn(measure){
    osmd.PlaybackManager.setPlaybackStart(osmd.Sheet.SourceMeasures[measure].AbsoluteTimestamp);
}
//去色(重新渲染)
function render(){
    osmd.render();
}
//渲染结束
function rendered(){
    uniMessage('rendered','rendered');
}
//跟弹结束
function playEnd(){
    uniMessage('playend','playend');
}

//移动光标(手动)
function currentBtn(index){
    if (index == 2) {
        const iterator = osmd.cursor.Iterator;
        const iteratorCurrentTimeStampInMs = osmd.PlaybackManager.timingSource.getDurationInMs(iterator.currentTimeStamp);
        let res = {};
        if (iteratorCurrentTimeStampInMs) {
            let obj = osmd.cursor.GNotesUnderCursor();
            res.timestamp = iteratorCurrentTimeStampInMs
            let data = [];
            for (let i = 0; i < obj.length; i++) {
                const element = obj[i];
                try {
                    if (element.sourceNote.playbackNote.MidiKey) {
                        data.push(element.sourceNote.playbackNote.MidiKey);
                    }
                } catch (error) {}
            }
            res.data = data;
        } else {
            res.data = [];
            //开始位置
            res.timestamp = 0;
        }
        uniMessage('move',res);
    }
}

//光标移动(自动)
function cursor(){
    //获取当前的midi
    const iterator = osmd.cursor.Iterator;
    const iteratorCurrentTimeStampInMs = osmd.PlaybackManager.timingSource.getDurationInMs(iterator.currentTimeStamp);
    if (iteratorCurrentTimeStampInMs) {
        console.log(iteratorCurrentTimeStampInMs)
        //解决漏音问题
        let obj = osmd.cursor.GNotesUnderCursor();
        let data = [];
        for (let i = 0; i < obj.length; i++) {
            const element = obj[i];
            try {
                if (element.sourceNote.playbackNote.MidiKey) {
                    console.log(element.sourceNote.playbackNote.MidiKey)
                    let obj = {};
                    obj.pitch = element;
                    data.push(obj)
                }
            } catch (error) {}
        }
        if (data.length > 0) {
            // uniMessage('key',data);
        }
    }
}
//跟弹，光标对应的midi值
function midiVal(midi){
    var data = [];
    var note = [];
    for (let index = 0; index < midi.length; index++) {
        const element = midi[index].MidiKey;
        let obj = {};
        obj.pitch = element;
        data.push(obj);
        note.push(element);
    }
    uniMessage('key',{data:data,note:note})
}
//音符颜色，全对或全错
function markBtn(val){
    let obj = osmd.cursor.GNotesUnderCursor();
    for (let i = 0; i < obj.length; i++) {
        const element = obj[i];
        if (val) {
            try {
                element.getSVGGElement().children[0].children[0].children[0].style.fill = rightColor;
                element.getSVGGElement().children[0].children[1].children[0].style.fill = rightColor;
                element.getSVGGElement().children[0].children[2].children[0].style.fill = rightColor;
                element.getSVGGElement().children[0].children[3].children[0].style.fill = rightColor;
                element.getSVGGElement().children[0].children[4].children[0].style.fill = rightColor;
            } catch (error) {}
        } else {
            if (element.sourceNote.playbackNote) {
                try {
                    element.getSVGGElement().children[0].children[0].children[0].style.fill = errorColor;
                    element.getSVGGElement().children[0].children[1].children[0].style.fill = errorColor;
                    element.getSVGGElement().children[0].children[2].children[0].style.fill = errorColor;
                    element.getSVGGElement().children[0].children[3].children[0].style.fill = errorColor;
                    element.getSVGGElement().children[0].children[4].children[0].style.fill = errorColor;
                } catch (error) {}
            } else {
                //休止符标绿
                try {
                    element.getSVGGElement().children[0].children[0].children[0].style.fill = rightColor;
                    element.getSVGGElement().children[0].children[1].children[0].style.fill = rightColor;
                    element.getSVGGElement().children[0].children[2].children[0].style.fill = rightColor;
                    element.getSVGGElement().children[0].children[3].children[0].style.fill = rightColor;
                    element.getSVGGElement().children[0].children[4].children[0].style.fill = rightColor;
                } catch (error) {}
            }
        }
    }
}
//音符颜色，部分正确or错误
function correction(note,val){
    let obj = osmd.cursor.GNotesUnderCursor();
    for (let i = 0; i < obj.length; i++) {
        const element = obj[i];
        try {
            if (element.sourceNote.playbackNote.MidiKey == note) {
                var color = rightColor
                if (!val) {
                    color = errorColor
                }
                try {
                    element.getSVGGElement().children[0].children[0].children[0].style.fill = color;
                    element.getSVGGElement().children[0].children[1].children[0].style.fill = color;
                    element.getSVGGElement().children[0].children[2].children[0].style.fill = color;
                    element.getSVGGElement().children[0].children[3].children[0].style.fill = color;
                    element.getSVGGElement().children[0].children[4].children[0].style.fill = color;
                } catch (error) {}
            }
        } catch (error) {}
    }
}
//指定位置且指定音符修改颜色
function noteColor(location,color,note){

            //当前光标所在位置的MidiKey
            // var cursor = osmd.cursor;
            // cursor.show();
            // cursor.next();
            // const cursorVoiceEntry = cursor.Iterator.CurrentVoiceEntries[0];
            // console.log(cursor.Iterator.CurrentVoiceEntries[0].Notes[0].playbackNote.MidiKey)
            // console.log(cursor.Iterator.CurrentVoiceEntries[1].Notes[0].playbackNote.MidiKey)


            // for (let i=0; i<osmd.GraphicSheet.MeasureList.length; i++) {
            //     const bbox = osmd.GraphicSheet.MeasureList[i][0].staffEntries[0].graphicalVoiceEntries[0].notes[0].getSVGGElement().getBBox();
            //     console.log(`pos: (${bbox.x}, ${bbox.y})`);
            //     osmd.Drawer.DrawOverlayLine({x: bbox.x / 10, y: bbox.y / 10}, {x: bbox.x / 10 + 2, y: bbox.y / 10}, osmd.GraphicSheet.MusicPages[0])
            // }


            //右1
            console.log(osmd.graphic.measureList[0][0].staffEntries[0].graphicalVoiceEntries[0].notes[0].getSVGGElement().children[0].children[0].children[0].style.fill = "#FF0000")
            console.log(osmd.graphic.measureList[0][0].staffEntries[0].graphicalVoiceEntries[0].notes[0].getSVGGElement().children[0].children[1].children[0].style.fill = "#FF0000")
            //右2
            console.log(osmd.graphic.measureList[0][0].staffEntries[1].graphicalVoiceEntries[0].notes[0].getSVGGElement().children[0].children[0].children[0].style.fill = "#008000")
            console.log(osmd.graphic.measureList[0][0].staffEntries[2].graphicalVoiceEntries[0].notes[0].getSVGGElement().children[0].children[0].children[0].style.fill = "#008000")
            console.log(osmd.graphic.measureList[0][0].staffEntries[3].graphicalVoiceEntries[0].notes[0].getSVGGElement().children[0].children[0].children[0].style.fill = "#008000")
            console.log(osmd.graphic.measureList[0][0].staffEntries[4].graphicalVoiceEntries[0].notes[0].getSVGGElement().children[0].children[0].children[0].style.fill = "#008000")
            console.log(osmd.graphic.measureList[0][0].staffEntries[4].graphicalVoiceEntries[0].notes[0].getSVGGElement().children[0].children[1].children[0].style.fill = "#008000")
            console.log(osmd.graphic.measureList[0][0].staffEntries[5].graphicalVoiceEntries[0].notes[0].getSVGGElement().children[0].children[0].children[0].style.fill = "#008000")
            console.log(osmd.graphic.measureList[0][0].staffEntries[6].graphicalVoiceEntries[0].notes[0].getSVGGElement().children[0].children[0].children[0].style.fill = "#008000")
            console.log(osmd.graphic.measureList[0][0].staffEntries[7].graphicalVoiceEntries[0].notes[0].getSVGGElement().children[0].children[0].children[0].style.fill = "#008000")
            // console.log(osmd.graphic.measureList[0][0].staffEntries[8].graphicalVoiceEntries[0].notes[0].getSVGGElement().children[0].children[0].children[0].style.fill = "#008000")


            console.log(osmd.graphic.measureList[0][1].staffEntries[0].graphicalVoiceEntries[0].notes[0].sourceNote.playbackNote.MidiKey)
            console.log(osmd.graphic.measureList[0][1].staffEntries[0].graphicalVoiceEntries[0].notes[0].getSVGGElement())
            // console.log(osmd.graphic.measureList[0][1].staffEntries[0].graphicalVoiceEntries[0].notes[0].getSVGGElement().sourceNote.playbackNote.MidiKey)
            // console.log(osmd.graphic.measureList[0][1].staffEntries[0].graphicalVoiceEntries[0].notes[0].getSVGGElement().sourceNote.playbackNote.MidiKey)
            console.log(osmd.graphic.measureList[0][1].staffEntries[0].graphicalVoiceEntries[0].notes[0].getSVGId())

            // 右1
            console.log(osmd.graphic.measureList[0][1].staffEntries[0].graphicalVoiceEntries[0].notes[0].getSVGGElement().children[0].children[1].children[0].style.fill = "#008000")
            console.log(osmd.graphic.measureList[0][1].staffEntries[0].graphicalVoiceEntries[0].notes[0].getSVGGElement().children[0].children[2].children[0].style.fill = "#008000")
            // 右2
            console.log(osmd.graphic.measureList[0][1].staffEntries[1].graphicalVoiceEntries[0].notes[0].getSVGGElement().children[0].children[1].children[0].style.fill = "#008000")
            console.log(osmd.graphic.measureList[0][1].staffEntries[1].graphicalVoiceEntries[0].notes[0].getSVGGElement().children[0].children[2].children[0].style.fill = "#008000")


            // console.log(osmd.graphic.measureList[0][1].staffEntries[2].graphicalVoiceEntries[0].notes[0].getSVGGElement().children[0].children[2].children[0].style.fill = "#008000")

}
//播放声音
function playNote(channel,key,volume,length){
    uniMessage('playnote',{channel:channel,key:key,volume:volume,length:length});
}