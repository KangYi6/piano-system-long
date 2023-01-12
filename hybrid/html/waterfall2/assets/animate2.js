onmessage = e => {
	let data = JSON.parse(e.data);
	//循环playMidi，获取要发声的音符
	playMidi(data.ch,data.playMidi,data.speed,data.move,data.midiVolume);
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

function message(type,data){
	postMessage(JSON.stringify({type:type,data:data}));
}