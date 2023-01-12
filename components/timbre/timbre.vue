<template>
	<view class="bg">
		<!-- <view class="tabbbar">
			<view class="headlist" v-for="(item,index) in headtab" :key="index+'a'" :class="{tabCur: tabCur == index}" @click="headTab(index)">
				{{ item.title }}
			</view>
		</view> -->
		<view class="left">
			<scroll-view class="scroll" scroll-y="true" >
				<view class="leftlist" v-for="(item,index) in lefttab" :key="index+'b'" @click="leftTab(index,item)">
					<view class="title" :class="{fontcolor: leftCur == index}">{{ item.title }}</view>
				</view>
			</scroll-view>
			
		</view>
		<view class="line"></view>
		<view class="r_title">{{ title }}</view>
		<view class="goback" @click="back"><image src="@/static/goback.png" mode="widthFix"></image></view>
		<view class="rights">
			<scroll-view class="scroll" scroll-y="true">
				<view class="rightlist" v-for="(item,index) in timbre" :key="index+'c'" @click="chooseTimbre(index,item)">
					<view class="text" :class="rightCur == index ? 'r_text' : 'text'">{{ item.text }}</view>
				</view>
			</scroll-view>
		</view>
		
	</view>
</template>

<script>
	let app = getApp()
	// #ifdef APP-PLUS
	let midiModule = uni.requireNativePlugin("XM-Midi2")
	// #endif
	
	import { getCurrentNo } from '@/lib/updata.js';
	import { MIDIhead, edition, timbre } from '@/lib/MIDIinstructions.js';
	export default {
		data(){
			return {
				globalData: getApp().globalData,
				tabCur: 0,
				leftCur: 0,
				rightCur: '',
				title: '钢琴',
				//midi音色号
				midiTimbre: '',
				// 音色列表
				timbre: [
					{text:'大钢琴'},{text:'亮音钢琴'},{text:'电钢琴'},{text:'酒吧钢琴'},{text:'电钢琴 1'},
					{text:'电钢琴 2'},{text:'大键琴'},{text:'古钢琴'},
				],
				// 音色设置顶部导航栏数据
				headtab: [
					{title:'音色'},{title:'节奏'},{title:'移调'},{title:'节拍器'},{title:'效果器'},{title:'录音'},
					{title:'歌曲'},{title:'LED测试'},{title:'力度'},{title:'键盘分割'},{title:'双音色'},
				],
				// 左侧导航栏数据
				lefttab: [
					{title:'钢琴'},{title:'敲击乐器'},{title:'风琴'},{title:'吉他'},{title:'贝斯'},
					{title:'弦乐'},{title:'合奏'},{title:'管铜'},{title:'簧片'},{title:'吹管'},
					{title:'合成主音旋律'},{title:'合成音衬底'},{title:'合成音效果'},{title:'民族'},
					// {title:'打击'},
					// {title:'音效'},{title:'钢琴组2'},{title:'敲击乐器2'},{title:'风琴2'},{title:'吉他2'},
					// {title:'贝斯&电子音'},{title:'弦乐2'},{title:'合奏2'},{title:'铜管2'},{title:'簧片2'},
					// {title:'吹管2'},{title:'合成音主旋律2'},{title:'合成音效果2'},{title:'民族2'},{title:'打击2'},
					// {title:'音效2'},{title:'民乐敲击乐器'},{title:'民乐拨弦乐器1'},{title:'民乐吹奏乐器1'},{title:'民乐吹奏乐器2'},
					// {title:'民乐弓弦乐器'},
				],
				// 右侧音色数据
				timbres: [
					// 钢琴1
					[{text:'大钢琴'},{text:'亮音钢琴'},{text:'电钢琴'},{text:'酒吧钢琴'},{text:'电钢琴 1'},
					{text:'电钢琴 2'},{text:'大键琴'},{text:'古钢琴'}],
					// 敲击乐器2
					[{text:'钢片琴'},{text:'钟琴'},{text:'八音盒'},{text:'抖音琴'},{text:'玛林巴'},
					{text:'木琴'},{text:'管钟'},{text:'扬琴'}],
					// 风琴3
					[{text:'爵士风琴'},{text:'敲击风琴'},{text:'摇滚风琴'},{text:'教堂风琴'},{text:'簧风琴'},
					{text:'手风琴'},{text:'口琴'},{text:'探戈手风琴'}],
					// 吉他4
					[{text:'古典吉他'},{text:'民谣吉他'},{text:'爵士电吉他'},{text:'清音电吉他'},{text:'闷音电吉他'},
					{text:'超载电吉他'},{text:'失真电吉他'},{text:'吉他泛音'}],
					// 贝斯5
					[{text:'大贝司'},{text:'弹指电贝司'},{text:'拨片电贝司'},{text:'无品贝司'},{text:'拍击贝士1'},
					{text:'拍击贝士2'},{text:'合成贝士1'},{text:'合成贝士2'}],
					// 弦乐6
					[{text:'小提琴'},{text:'中提琴'},{text:'大提琴'},{text:'低音提琴'},{text:'颤弓弦乐'},
					{text:'弹拨弦乐'},{text:'竖琴'},{text:'定音鼓'}],
					// 合奏7
					[{text:'合奏弦乐1'},{text:'合奏弦乐2'},{text:'合成弦乐1'},{text:'合成弦乐2'},{text:'人声(啊)'},
					{text:'人声(嘟)'},{text:'合成人声'},{text:'管弦乐队断奏'}],
					// 铜管8
					[{text:'小号'},{text:'长号'},{text:'大号'},{text:'加弱音器小号'},{text:'圆号'},
					{text:'铜管合奏'},{text:'合成铜管1'},{text:'合成铜管2'}],
					// 簧片9
					[{text:'高音萨克斯'},{text:'次高音萨克斯'},{text:'中音萨克斯'},{text:'次中音萨克斯'},{text:'双簧管'},
					{text:'英国管'},{text:'大管'},{text:'单簧管'}],
					// 吹管10
					[{text:'短笛'},{text:'长笛'},{text:'竖笛'},{text:'排箫'},{text:'吹瓶声'},
					{text:'日本尺八'},{text:'哨声'},{text:'陶笛'}],
					// 合成音主旋律11
					[{text:'合成主音1（方波）'},{text:'合成主音2（锯齿波）'},{text:'合成主音3'},{text:'合成主音4'},
					{text:'合成主音5'},{text:'合成主音6'},{text:'合成主音7'},{text:'合成主音8'}],
					// 合成音衬底12
					[{text:'合成音色1（新世纪）'},{text:'合成音色2（温暖）'},{text:'合成音色3'},{text:'合成音色4（合唱）'},
					{text:'合成音色5'},{text:'合成音色6（金属声）'},{text:'合成音色7（光环）'},{text:'合成音色8'}],
					// 合成音效果13
					[{text:'合成效果1（雨声）'},{text:'合成效果2（音轨）'},{text:'合成效果3（水晶）'},{text:'合成效果4（大气）'},
					{text:'合成效果5（明亮）'},{text:'合成效果6（魅影）'},{text:'合成效果7（回音）'},{text:'合成效果8（科幻）'}],
					// 民族14
					[{text:'西塔琴'},{text:'班卓琴'},{text:'三味线'},{text:'十三弦筝'},{text:'卡林巴'},
					{text:'苏格兰风笛'},{text:'古提琴'},{text:'山奈'}],
					// 打击15
					[{text:'叮当铃'},{text:'阿哥哥鼓'},{text:'钢鼓'},{text:'木鱼'},{text:'太鼓'},
					{text:'通通鼓'},{text:'合成鼓'},{text:'铜钹'}],
					// 音效16
					[{text:'吉他磨弦声'},{text:'呼吸'},{text:'海浪'},{text:'鸟叫'},{text:'电话铃'},
					{text:'直升机'},{text:'鼓掌声'},{text:'枪声'}],
					// 钢琴組2 17
					[{text:'宽广的大钢琴'},{text:'暗淡的大钢琴'},{text:'平台电钢琴2'},{text:'平台电钢琴3'},
					{text:'宽广的酒吧钢琴'},{text:'柔和的电钢琴2'},{text:'失谐电钢琴1'},{text:'力度渐变电钢琴1'},
					{text:'60年代电钢琴'},{text:'电钢琴2'},{text:'失谐电钢琴2'},{text:'力度渐变电钢琴2'},
					{text:'大键琴2'},{text:'大键琴3'},{text:'大键琴4'},{text:'古钢琴2'}],
					// 敲击乐器2 18
					[{text:'钢片琴2'},{text:'铁琴2'},{text:'八音盒2'},{text:'抖音琴2'},{text:'马林巴2'},
					{text:'柔音木琴2'},{text:'管钟2'},{text:'管钟3'},{text:'扬琴2'}],
					// 风琴2 19
					[{text:'管风琴 101'},{text:'失谐管风琴1'},{text:'60年代管风琴'},{text:'管风琴1'},{text:'管风琴 201'},
					{text:'失谐管风琴2'},{text:'管风琴2'},{text:'摇滚风琴2'},{text:'教堂风琴2'},{text:'教堂风琴3'},
					{text:'簧风琴2'},{text:'手风琴2'},{text:'手风琴3'},{text:'口琴2'},{text:'小手风琴'}],
					// 吉他2 20
					[{text:'古典吉他2'},{text:'古典吉他3'},{text:'古典吉他4'},{text:'古典吉他5'},{text:'古典吉他6'},
					{text:'尤克里里'},{text:'古典吉他7'},{text:'古典吉他8'},{text:'民谣吉他2'},{text:'民谣吉他3'},
					{text:'12 吉他'},{text:'曼陀林'},{text:'柔和的吉他'},{text:'夏威夷吉他'},{text:'电吉他2'},
					{text:'电吉他3'},{text:'电吉他4'},{text:'电吉他5'},{text:'合唱吉他'},{text:'闷音电吉他2'},
					{text:'闷音电吉他3'},{text:'闷音电吉他3'},{text:'闷音电吉他4'},{text:'放克吉他1'},{text:'放克吉他2'},
					{text:'变音电吉他2'},{text:'变音电吉他3'},{text:'变音电吉他4'},{text:'反馈吉他'},{text:'反馈吉他2'}],
					// 贝斯&電子音 21
					[{text:'合成器1'},{text:'合成器2'},{text:'合成器3'},{text:'合成器4'},{text:'合成器5'},
					{text:'合成器6'},{text:'合成器7'},{text:'合成器8'},{text:'合成器9'},{text:'合成器10'},
					{text:'合成器11'},{text:'合成器12'},{text:'合成器13'},{text:'合成器14'},{text:'合成器15'},
					{text:'合成器16'},{text:'合成器17'},{text:'合成器18'},{text:'合成器19'},{text:'合成器20'},
					{text:'合成器21'},{text:'合成器22'},{text:'合成器23'},{text:'合成器24'},{text:'合成器25'},
					{text:'合成器26'},{text:'合成器27'},{text:'合成器28'}],
					// 弦乐2 22
					[{text:'小提琴2'},{text:'小提琴3'},{text:'中提琴2'},{text:'大提琴2'},{text:'低音提琴2'},
					{text:'竖琴2'},{text:'弦乐'}],
					// 合奏2 23
					[{text:'合成弦乐'},{text:'弦乐2'},{text:'唱诗乐(啊)2'},{text:'唱诗乐(嘟)2'},{text:'合成人声2'}],
					// 铜管2 24
					[{text:'小号2'},{text:'长号2'},{text:'长号3'},{text:'大号2'},{text:'闷音小号2'},{text:'法国号2'},
					{text:'法国号3'},{text:'铜管乐2'},{text:'合成铜管3'},{text:'模拟铜管1'},{text:'合成铜管4'},{text:'模拟铜管2'}],
					// 簧片2 25
					[{text:'高音萨克管2'},{text:'高音萨克管3'},{text:'中音萨克管2'},{text:'次中音萨克管2'},{text:'次中音萨克管3'},
					{text:'次中音萨克管4'},{text:'上低音萨克管2'},{text:'双簧管2'},{text:'英国管2'},{text:'低音管2'},{text:'单簧管2'}],
					// 吹管2 26
					[{text:'短笛2'},{text:'长笛2'},{text:'直笛2'},{text:'排笛2'},{text:'吹瓶声2'},{text:'尺八箫2'}],
					// 合成音主旋律2 27
					[{text:'方波2'},{text:'正弦波'},{text:'锯齿波2'},{text:'医生'},{text:'人声主奏'}],
					// 合成音效果2 28
					[{text:'太空声音'},{text:'合成木槌'},{text:'明亮2'},{text:'魅影2'},{text:'回音铃'},{text:'回音盘'}],
					// 民族2 29
					[{text:'西塔琴2'}],
					// 打击2 30
					[{text:'响板'},{text:'音乐会大鼓'},{text:'古式高音鼓2'},{text:'808嗵鼓'},{text:'电子打击乐'}],
					// 音效2 31
					[{text:'静音吉他'},{text:'拍击弦乐'},{text:'电键噪声'},{text:'雨声2'},{text:'雷声'},
					{text:'风声'},{text:'河流'},{text:'冒泡'},{text:'狗叫声'},{text:'马跑声'},
					{text:'鸟叫声2'},{text:'电话铃声2'},{text:'嘎吱声'},{text:'门声'},{text:'刮擦声'},
					{text:'风铃声'},{text:'汽车引擎'},{text:'汽车停止'},{text:'汽车路过'},{text:'汽车碰撞'},
					{text:'警车'},{text:'火车'},{text:'喷射机'},{text:'飞船'},{text:'脉冲噪声'},
					{text:'笑声'},{text:'尖叫声'},{text:'穿孔'},{text:'心跳声'},{text:'脚步声'},
					{text:'机关枪'},{text:'激光枪'},{text:'爆炸'}],
					// 民乐敲击乐器 32
					[{text:'锣1'},{text:'锣2'},{text:'锣3'},{text:'锣4'},{text:'排鼓'},
					{text:'磬'},{text:'编钟'},{text:'扬琴'}],
					// 民乐拨弦乐器 33
					[{text:'柳琴'},{text:'琵琶'},{text:'中阮'},{text:'大阮'},{text:'月琴'},
					{text:'三弦'},{text:'古筝'},{text:'古琴'}],
					// 民乐吹奏乐器1 34
					[{text:'笙1'},{text:'笙2'},{text:'吶子1'},{text:'吶子2'},{text:'筚篥'},
					{text:'管子1'},{text:'管子2'},{text:'把乌'}],
					// 民乐吹奏乐器2 35
					[{text:'笛子1'},{text:'笛子2'},{text:'葫芦丝'},{text:'排萧'},{text:'南萧'},
					{text:'萧'},{text:'口笛'},{text:'埙'}],
					// 民乐弓弦乐器 36
					[{text:'高胡'},{text:'二胡'},{text:'中胡'},{text:'马头琴'},{text:'胡群2'},
					{text:'板胡'},{text:'京胡'},{text:'胡群1'}],
				],
			}
		},
		onLoad(){
			console.log(this.globalData.midi)
		},
		methods: {
			// 选择音色
			chooseTimbre(index, item){
				if(this.globalData.midi){
					this.$store.state.timbre = item.text
				}else{
					uni.showModal({
						title: '提示',
						showCancel: false,
						content: 'midi连接错误，请检查mini是否正确连接',
					})
				}
				
				// 拼接当前数组之前的数组
				let arr = this.timbres.slice(0,this.leftCur)
				// 定义音色编号 num
				let num = arr.reduce((x,y) => x + y.length, 0) + index +1
				this.rightCur = index
				this.midiTimbre = timbre(num)
				app.midiDevices('resume') //恢复midi连接
				midiModule.sendMidiSystemExclusive({
					cable: 0,
					systemExclusive: MIDIhead + this.midiTimbre
				}, (ret) => {
					//调用结果在这里
					// console.log(ret)
				}) 
				// app.midiDevices('suspend') //断开midi连接
			},
			// 切换音色顶部导航栏
			headTab(index){
				this.tabCur = index;
			},
			// 切换左侧标题导航栏
			leftTab(index, item){
				this.leftCur = index;
				this.title = item.title;
				this.timbre = this.timbres[index]
				this.rightCur = '';
			},
			// 传参给父组件
			back(){
				this.$emit("timbre",false)
			},
		}
	}
</script>

<style>
	.bg {
		width: 100%;
		height: 100%;
		background-color: #0a1f71;
		overflow: auto;
	}
	.tabbbar {
		width: 100%;
		height: auto;
		margin-bottom: 20px;
	}
	.tabCur {
		background-color: #123cbd;
	}
	.headlist {
		font-size: 28px;
		padding: 20px 42.4px;
		border: 2px solid #079fff;
		float: left;
		box-shadow: 0px 0px 10px 4px #079fff;
	}
	.left {
		width: 740px;
		height: 560px;
		background-color: #0a1f71;
		float: left;
		margin-left: -180px;
		margin-top: -65px;
	}
	.scroll{
		margin-top: 20px;
		height: 95%;
	}
	.leftlist {
		width: 200px;
		height: 50px;
		float: left;
		margin-top: 15px;
		margin-left: 30px;
	}
	.title {
		font-size: 24px;
		font-weight: normal;
		opacity: 0.75;
	}
	.fontcolor {
		color: #ffc71c;
		border-bottom: 1px solid #ffc71c;
	}
	.r_text {
		color: #F00;
	}
	.line {
		width: 4px;
		height: 540px;
		background-color: #123cbd;
		float: left;
		margin-left: 215px;
		margin-top: 20px;
	}
	.r_title {
		width: 300px;
		height: 60px;
		font-size: 32px;
		color: #ffc71c;
		float: left;
		margin-top: 30px;
		margin-left: 20px;
		text-align: left;
	}
	/* 返回按钮 */
	.goback {
		position: absolute;
		top: 20px;
		right: 40px;
	}
	.goback image {
		width: 180px;
		height: 72px;
	}
	.rights {
		width: 980px;
		height: 480px;
		float: left;
		margin-left: 20px;
		margin-top: -10px;
		/* border: 2px solid #f00; */
	}
	.rightlist {
		width: 200px;
		height: 50px;
		background-color: #fff;
		color: #000;
		border-radius: 50px;
		line-height: 50px;
		font-size: 20px;
		float: left;
		margin-top: 40px;
		margin-right: 45px;
	}
</style>