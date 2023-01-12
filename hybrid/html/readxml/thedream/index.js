$(function(){
	var url = '';
	//获取URL参数
	function getQueryVariable(variable,url){
		//如果传递了URL
		if (url) {
			var param = url.split('?');
			var query = param[1].substring(0);
		} else {
			var query = window.location.search.substring(1);
		}
		var vars = query.split("&");
		for (var i=0;i<vars.length;i++) {
			var pair = vars[i].split("=");
			if(pair[0] == variable){return pair[1];}
		}
		return(false);
	}
	url = getQueryVariable('url',window.location.href); //原始路径
	//转midi数据
	//文件转blob
	function getFileFromUrl(url, fileName) {
		return new Promise((resolve, reject) => {
			var blob = null;
			var xhr = new XMLHttpRequest();
			xhr.open("GET", url);
			xhr.setRequestHeader('Accept', 'text/xml');
			xhr.responseType = "blob";
			// 加载时处理
			xhr.onload = () => {
				// 获取返回结果
				blob = xhr.response;
				let file= new File([blob], fileName, { type: 'text/xml' });
				// 返回结果
				resolve(file);
			};
			xhr.onerror = (e) => {
				reject(e)
			};
			// 发送
			xhr.send();
		});
	}
	//转midi
	async function uploadMusicPiece(fileUpload,content) {
		if (!fileUpload) {
			return null;
		}
		const n = fileUpload.name;
		if (!n) {
			return null;
		}
		// MIDI
		if (n.endsWith(".midi") || n.endsWith(".mid")) {
			const uintArray = new Uint8Array(await fileUpload.arrayBuffer());
			return musicvislib.MusicPiece.fromMidi(n, uintArray);
		}
		// MusicXML
		if (n.endsWith(".xml") || n.endsWith(".musicxml")) {
			return musicvislib.MusicPiece.fromMusicXml(n, content);
			return musicvislib.MusicPiece.fromMusicXml(n, await fileUpload.text());
		}
		// Compressed MusicXML
		if (n.endsWith(".mxl")) {
			const compressed = await fileUpload.arrayBuffer();
			const extracted = await JSZip.loadAsync(compressed);
			// Get XML file with score from archive
			const scoreFile = Object.keys(extracted.files).filter((d) => !d.startsWith("META"))[0];
			const xml = await extracted.file(scoreFile).async("string");
			return musicvislib.MusicPiece.fromMusicXml(n, xml);
		}
	}
	function readContent(){
		getFileFromUrl(url,'test.xml').then(res=>{
			var reader = new FileReader();
			reader.readAsText(res);
			reader.onload=function(e){
				var text = reader.result;
				uploadMusicPiece(res,text).then(e=>{
					var data = {};
					//调式
					data.mode = e.keySignatures[0].key
					//速度
					data.tempo = e.tempos[0].bpm;
					//拍号
					data.signature = e.timeSignatures[0].string;
					//总音符
					data.notes = e.tracks[0].notes;
					//小节时长
					data.measureTimes = e.measureTimes;
					//小节索引
					data.measureIndices = e.tracks[0].measureIndices;
					//计算曲谱标准用时，即最后一个音符的start+end时长，单位（s）,向上取整
					data.standardTime = 0;
					var noteTotal = data.notes.length
					var startTime = data.notes[noteTotal-1].start;
					var endTime = data.notes[noteTotal-1].end;
					if (endTime) {
						data.standardTime = Math.ceil(endTime);
					} else {
						data.standardTime = Math.ceil(startTime);
					}
					//XMl所有的midi值
					var allMidi = [];
					//同时按下的键，转成新的数组
					var curNote = [];
					//左手音符数
					data.leftTotal = 0;
					//表示未开始
					var start = -1
					//过滤掉休止符后的音符数
					var noRest = 0
					for (var val in data.notes) {
						var d = data.notes[val]
						if (d.end != 0) {
							noRest++
							if (d.hand == 1) {
								data.leftTotal += 1
							}
						}
						d.start = Number(parseFloat(d.start).toFixed(5))
						if (start == -1) { //第一个note直接放到新数组中
							curNote.push(d)
							start = d.start
						} else if (start == d.start) { //如果start值相等，表示跟上一个键同时按下
							curNote.push(d)
						} else { //如果不相等
							//先把之前的值，保存到总MIDI数组上
							allMidi.push(curNote)
							//然后再清空当前计算的键值
							curNote = []
							//把当前的值放到当前计算的数组上
							curNote.push(d)
							start = d.start
						}
						//如果是最后一个音符
						if (val == data.notes.length - 1) {
							allMidi.push(curNote)
							curNote = []
							start = -1
						}
					}
					//完整MIDI
					data.midi = allMidi;
					//当前MIDI
					data.curMidi = allMidi[0];
					data.noteTotal = noRest;
					data.rightTotal = data.noteTotal - data.leftTotal;
					uni.postMessage({
						data: {
							action: JSON.stringify(data)
						}
					});
				})
			}
		})
	}
	document.addEventListener('UniAppJSBridgeReady', function() {
		readContent();
		// xmlBaseInfo();
	})
	
})