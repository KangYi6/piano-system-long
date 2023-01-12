//指令由协议固定开头(start)，协议头部(symbol)，命令(command)，数据长度(Data Count)，数据(data)，MIDI命令结束(End)组成

//MIDI协议固定开头(start)和协议头部(symbol)
let MIDIhead='F0'+'00676574'

//1.读取版本号
let edition='0106'+'00F7'

//2.音色命令函数
//接收data为MIDI音色号
export let timbre=function(data){
	//十进制转换为十六进制
	let sound=data.toString(16)
	if(sound.length==3){
		sound='100E'+'03'+sound+'000F7'
	}else if(sound.length==1){
		sound='100E'+'030'+sound+'0000F7'
	}else{
		sound='100E'+'03'+sound+'0000F7'
	}
	return sound
}

//3.双键盘开关(1为开启，其他则为关闭)
export let Dualkeyboard=function(data){
	let val=''
	if(data==1){
		val='1109'+'03'+'010000F7'
	}else{
		val='1109'+'03'+'000000F7'
	}
	return val
}

//4.双键盘分离点设置
export let Dualkeyboardpoint=function(data){ 
	//传进来的十进制转换为十六进制
	let point=data.toString(16)
	if(point.length==1){
		point='120E'+'030'+point+'0000F7'
	}else{
		point='120E'+'03'+point+'0000F7'
	}
	return point
}

//5.双键盘音色设置
export let Dualkeyboardtimbre=function(data){
	let keyboardtimbre=data.toString(16)
	if(keyboardtimbre.length==3){
		keyboardtimbre='130E'+'03'+keyboardtimbre+'000F7'
	}else if(keyboardtimbre.length==1){
		keyboardtimbre='130E'+'030'+keyboardtimbre+'0000F7'
	}else{
		keyboardtimbre='130E'+'03'+keyboardtimbre+'0000F7'
	}
	return keyboardtimbre
}

//6.双音色开关设置(1为开启，其他则为关闭)
export let Doublevoiceswitch=function(data){
	let Doublevoice=''
	if(data==1){
		Doublevoice='1609'+'03'+'010000F7'
	}else{
		Doublevoice='1609'+'03'+'000000F7'
	}
	return Doublevoice
}

//7.双音色音色设置
export let Doublevoiceset=function(data){
	let set=data.toString(16)
	if(set.length==3){
		set='170E'+'03'+set+'000F7'
	}else if(set.length==1){
		set='170E'+'030'+set+'0000F7'
	}else{
		set='170E'+'03'+set+'0000F7'
	}
	return set
}

//8.双钢琴开关设置(1为开启，其他则为关闭)
export let Doublepianoswitch=function(data){
	let Doublepiano=''
	if(data==1){
		Doublepiano='1A09'+'03'+'010000F7'
	}else{
		Doublepiano='1A09'+'03'+'000000F7'
	}
	return Doublepiano
}

//9.节拍器开关设置(1为开启，其他则为关闭)
export let Metronomeswitch=function(data){
	let Metronome=''
	if(data==1){
		Metronome='2009'+'03'+'010000F7'
	}else{
		Metronome='2009'+'03'+'000000F7'
	}
	return Metronome
}

//10.读取节拍器拍号
let Metronomenum='2106'+'00F7'

//11.节拍器拍号设置(传入拍号)
export let Metronomenumset=function(data,val){
	if(data.toString(16).length==1){
		data='0'+data
	}
	if(val.toString(16).length==1){
		val='0'+val
	}
	let numset='210E'+'06'+data+'0000'+val+'0000'+'F7'
	return numset
}

//12.速度设置
export let Speedset=function(data){
	let speedset=speedcount(data)
	speedset='220E03'+speedset+'F7'
	return speedset
}

//13.速度读取
let Speedread='220600F7'

//14.速度调节系数设置
export let Speedregset=function(data){
	let regset=speedcount(data)
	regset='230E03'+regset+'F7'
	return regset
}

//15.节拍器音量设置
export let Metronomevolume=function(data){
	let Metronome = data.toString(16)
	if(Metronome.length==1){
		Metronome='240E030'+Metronome+'0000F7'
	}else{
		Metronome='240E03'+Metronome+'0000F7'
	}
	return Metronome
}

//16.移调设置(-12到12)
export let transposition=function(data){
	data=data.toString()
	switch(data){
		case '-12':
		return '2A0E03'+'000000'+'F7'
		break
		case '-11':
		return '2A0E03'+'010000'+'F7'
		break
		case '-10':
		return '2A0E03'+'020000'+'F7'
		break
		case '-9':
		return '2A0E03'+'030000'+'F7'
		break
		case '-8':
		return '2A0E03'+'040000'+'F7'
		break
		case '-7':
		return '2A0E03'+'050000'+'F7'
		break
		case '-6':
		return '2A0E03'+'060000'+'F7'
		break
		case '-5':
		return '2A0E03'+'070000'+'F7'
		break
		case '-4':
		return '2A0E03'+'080000'+'F7'
		break
		case '-3':
		return '2A0E03'+'090000'+'F7'
		break
		case '-2':
		return '2A0E03'+'100000'+'F7'
		break
		case '-1':
		return '2A0E03'+'110000'+'F7'
		break
		case '0':
		return '2A0E03'+'120000'+'F7'
		break
		case '1':
		return '2A0E03'+'130000'+'F7'
		break
		case '2':
		return '2A0E03'+'140000'+'F7'
		break
		case '3':
		return '2A0E03'+'150000'+'F7'
		break
		case '4':
		return '2A0E03'+'160000'+'F7'
		break
		case '5':
		return '2A0E03'+'170000'+'F7'
		break
		case '6':
		return '2A0E03'+'180000'+'F7'
		break
		case '7':
		return '2A0E03'+'190000'+'F7'
		break
		case '8':
		return '2A0E03'+'200000'+'F7'
		break
		case '9':
		return '2A0E03'+'210000'+'F7'
		break
		case '10':
		return '2A0E03'+'220000'+'F7'
		break
		case '11':
		return '2A0E03'+'230000'+'F7'
		break
		case '12':
		return '2A0E03'+'240000'+'F7'
		break
	}
}

//17.力度开关(1为开启，0为键盘力度)
export let forceswitch=function(data){
	if(data==1){
		return '600903'+'010000F7'
	}else{
		return '600903'+'000000F7'
	}
}

//18.力度参数设置
export let Forceparameters=function(data){
	data=data.toString(16)
	if(data.length==1){
		return '610E030'+data+'0000F7'
	}else{
		return '610E03'+data+'0000F7'
	}
}

//19.总音量调节
export let Totalvolume=function(data){
	data=data.toString(16)
	if(data.length==1){
		return 'F0457002000'+data+'0000F7'
	}else{
		return 'F045700200'+data+'0000F7'
	}
}

//20.琴键按下(传值两个一个按键值和一个力度值0-127)
export let keyspress=function(data,val){
	data=data.toString(16)
	val=val.toString(16)
	if(data.length==1){
		data='0'+data
	}
	if(val.length==1){
		val='0'+val
	}
	return 'F05A10'+data+val+'F7'
}

//21.琴键释放(传值按键位)
export let keysrelease=function(data){
	data=data.toString(16)
	if(data.length==1){
		data='0'+data
	}
	return 'F05A00'+data+'00F7'
}

//22.延音踏板
export let Sustain=function(data){
	data=data.toString(16)
	if(data.length==1){
		data='0'+data
	}
	return 'F05A3040'+data+'F7'
}

//23.柔音踏板
export let Softtone=function(data){
	data=data.toString(16)
	if(data.length==1){
		data='0'+data
	}
	return 'F05A3043'+data+'F7'
}

//23.持音踏板
export let tenuto=function(data){
	data=data.toString(16)
	if(data.length==1){
		data='0'+data
	}
	return 'F05A3042'+data+'F7'
}

//24.Port选择（即上下16音轨选择）传入1或者0
export let portselect=function(data){
	if(data==1){
		return 'F05C75'+'01'+'F7'
	}else{
		return 'F05C75'+'00'+'F7'
	}
}

//25.琴键音量(0~127)
export let modulation=function(data){
	data=data.toString(16)
	if(data.length==1){
		return 'F05C770'+data+'F7'
	}else{
		return 'F05C77'+data+'F7'
	}
}

//26.Port0 Pitch wheel 
//F0 5D 6n ll hh F7
//n：channel  ll:LSbyte   hh:MSbyte

//27.Port0 Modulation Wheel
// F0 5D 3n 01 xx F7
// n:channel   xx:Modulation wheel (0~127)

export{
	MIDIhead,
	edition
}

//速度计算值
function speedcount(data){
	let value=''
	if(data<128){
		value=data.toString(16)+'00'+'00'
	}else{
		if((data-(Math.floor(data/128))*128).toString(16).length==1){
			value='0'+(data-(Math.floor(data/128))*128).toString(16)+'0'+Math.floor(data/128)+'00'
		}else{
			value=(data-(Math.floor(data/128))*128).toString(16)+'0'+Math.floor(data/128)+'00'
		}
	}
	return value
}