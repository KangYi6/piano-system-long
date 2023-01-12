onmessage = e => {
	let data = JSON.parse(e.data);
	for (let i = 0; i < data.curMidi.length; i++) {
		let note = data.curMidi[i];
		if (note[0].key == -1) { //终点，结束
			break;
		}
		//头部距离底边的距离
		var curLoc = data.ch - note[0].y - note[0].h - data.move
		if (curLoc > data.difficulty*data.speed) { //大于难度系数跳过
			break;
		} else {
			message('move','curMidi');
			for (let j = 0; j < note.length; j++) {
				message('curMidi',note[j].key);
			}
		}
	}
	for (let i = 0; i < data.playMidi.length; i++) {
		let note = data.playMidi[i];
		if (note[0].key == -1) { //终点，结束
			break;
		}
		//头部距离底边的距离
		var curLoc = data.ch - note[0].y - note[0].h - data.move
		if (curLoc >= data.speed) {
			break;
		} else {
			message('move','playMidi');
			for (let j = 0; j < note.length; j++) {
				let data = {
					key = note[j].key;
					hand = note[j].hand;
					velocity = note[j].velocity*data.midiVolume;
				};
				message('keydown',data);
			}
		}
	}
	for (let i = 0; i < data.endMidi.length; i++) {
		let note = data.endMidi[i];
		if (note[0].key == -1) { //终点，结束
			break;
		}
		//头部距离底边的距离
		var curLoc = data.ch - note[0].y - note[0].h - data.move
		if (curLoc >= data.speed) {
			break;
		} else {
			message('move','playMidi');
			for (let j = 0; j < note.length; j++) {
				let data = {
					key = note[j].key;
					hand = note[j].hand;
					velocity = note[j].velocity*data.midiVolume;
				};
				message('keydown',data);
			}
		}
	}
};



async function playMidi(ch,midi,speed,move,midiVolume){
	for (let i = 0; i < midi.length; i++) {
		let note = midi[i];
		if (note[0].key == -1) { //终点，结束
			break;
		}
		//头部距离底边的距离
		var curLoc = ch - note[0].y - note[0].h - move
		if (curLoc >= speed) {
			break;
		} else {
			message('move','playMidi');
			for (let j = 0; j < note.length; j++) {
				let data = {};
				data.key = note[j].key;
				data.hand = note[j].hand;
				data.velocity = note[j].velocity*midiVolume;
				message('keydown',data);
			}
		}
	}
}

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