onmessage = e => {
	let data = JSON.parse(e.data);
	//循环curMidi，获取当前要弹的音符
	curMidi(data.ch,data.curMidi,data.difficulty,data.speed,data.move);
};

async function curMidi(ch,midi,difficulty,speed,move){
	for (let i = 0; i < midi.length; i++) {
		let note = midi[i];
		if (note[0].key == -1) { //终点，结束
			break;
		}
		//头部距离底边的距离
		var curLoc = ch - note[0].y - note[0].h - move
		if (curLoc > difficulty*speed) { //大于难度系数跳过
			break;
		} else {
			message('move','curMidi');
			for (let j = 0; j < note.length; j++) {
				message('curMidi',note[j].key);
			}
		}
	}
}
function message(type,data){
	postMessage(JSON.stringify({type:type,data:data}));
}