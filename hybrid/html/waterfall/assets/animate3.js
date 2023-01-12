onmessage = e => {
	let data = JSON.parse(e.data);
	//循环endMidi，结束音符
	endMidi(data.ch,data.endMidi,data.speed,data.move);
};

async function endMidi(ch,midi,speed,move){
	for (let i = 0; i < midi.length; i++) {
		let note = midi[i];
		if (note.key == -1) { //终点，结束
			message('over');
			break;
		}
		//尾部距离底边的距离
		var curLoc = move - ch - note.yLoc;
		if (curLoc < Number('-'+speed)) {
			break;
		}
		// if (curLoc >= Number('-'+speed)) {
		if (curLoc >= Number('-'+speed) && curLoc <= 0) {
			message('keyup',note.key);
		}
	}
}

function message(type,data){
	postMessage(JSON.stringify({type:type,data:data}));
}