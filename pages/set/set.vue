<template>
	<view class="set">
		<top></top>
		<!-- 左侧标题导航栏 -->
		<scroll-view class="left" scroll-y>
			<view class="tabbar" v-for="(item,index) in tabList" :key='index' :class="{ cur: current == index }" @click="chooseTab(index)">
				<image :src="item.icon" mode=""></image>
				<view class="font">{{ item.text }}</view>
			</view>
		</scroll-view>
		
		<!-- 右侧详情栏 -->
		<view class="right">
			<!-- 0.常用音色界面 -->
			<view v-show="current == 0 && timbre_show == false" class="r_tim">
				<view class="u_title">音色设置</view>
				<!-- 第一层 -->
				<view class="onef">
					<ul>
						<li v-if="globalData.width>1925" v-for="(item1, index) in onef" :key="index+'1'" @click="timbreOnef(index,item1)">
							<view class="icons_bg" :class="index == icons_1 && stairs == 1 ? 'icons_bgs' : 'icons_bg'"><image :src="item1.url" mode=""></image></view>
							<view class="timbre_text1">{{ item1.title }}</view>
							<view class="timbre_text2">{{ item1.text }}</view>
						</li>
						<li v-if="globalData.width<=1925" v-for="(item1, index) in onef_ipad" :key="index+'2'" @click="timbreOnef(index,item1)">
							<view class="icons_bg" :class="index == icons_1 && stairs == 1 ? 'icons_bgs' : 'icons_bg'"><image :src="item1.url" mode=""></image></view>
							<view class="timbre_text1">{{ item1.title }}</view>
							<view class="timbre_text2">{{ item1.text }}</view>
						</li>
					</ul>
				</view>
				<!-- 第二层 -->
				<view class="twof">
					<ul>
						<li v-if="globalData.width>1925" v-for="(item2, index) in twof" :key="index+'3'" @click="timbreTwof(index,item2)">
							<view class="icons_bg" :class="index == icons_2 && stairs == 2? 'icons_bgs' : 'icons_bg'"><image :src="item2.url" mode=""></image></view>
							<view class="timbre_text1">{{ item2.title }}</view>
							<view class="timbre_text2">{{ item2.text }}</view>
						</li>
						<li v-if="globalData.width<=1920 && globalData.height<=1080" v-for="(item2, index) in twof_ipad" :key="index+'4'" @click="timbreTwof(index,item2)">
							<view class="icons_bg" :class="index == icons_2 && stairs == 2 ? 'icons_bgs' : 'icons_bg'"><image :src="item2.url" mode=""></image></view>
							<view class="timbre_text1">{{ item2.title }}</view>
							<view class="timbre_text2">{{ item2.text }}</view>
						</li>
					</ul>
				</view>
			</view>
			<!-- 更多音色 -->
			<timbre v-show="current == 0 && timbre_show == true" @timbre="moreTimbre"></timbre>
			<!-- 1.背光亮度 -->
			<view v-show="current == 1" class="r_bri">
				<view class="u_title">背光亮度</view>
				<view class="beiguang" style="">
					<slider class="slider" :value="Brightness" block-color="#FFD200" activeColor="#FFD200" backgroundColor="#EFEFEF" block-size="20" show-value @changing="getscreen"/>
				</view>
			</view>
			<!-- 2.本机信息 -->
			<view v-show="current == 2" class="r_info">
				<view class="u_title">
					<view class="locinfo">本机信息</view>
				</view>
				<view class="info_text">
					<ul>
						<li class="cur_info">型号：{{ model }}</li>
						<li v-show="globalData.width==2560 && globalData.height==720" class="cur_info">屏幕尺寸：{{ screen }}</li>
						<li v-show="globalData.width<=1920 && globalData.height<=1080" class="">屏幕尺寸：{{ screen }}</li>
						<li v-show="globalData.width==2560 && globalData.height==720" v-for="(info, index) in data_info" :key="index+'5'" :class="{cur_info:index==2||index==3}">{{ info.text }}</li>
						<li v-show="globalData.width<=1920 && globalData.height<=1080" v-for="(info, index) in data_info_ipad" :key="index+'6'" :class="{cur_info:index==0||index==2||index==4}">{{ info.text }}</li>
					</ul>
				</view>
			</view>
			<!-- 3.关于我们 -->
			<view v-show="current == 3" class="r_user"> 
				<view class="u_title">关于我们</view>
				<view class="u_text">{{ aboutList.content }}</view>
				<view class="u_erweima"><image :src="aboutList.qrcode"></image></view>
				<span>{{ aboutList.qrtitle }}</span>
				<view class="u_footer">{{ aboutList.copyright }}</view>
			</view>
			<!-- 4.无线网络 -->
			<view v-show="current == 4" class="wifi">
				<!-- wifi开关控制 -->
				<view class="title_ctrl" v-show="!key_show">
					<view class="title">无线网络</view>
					<view class="ctrl">
						<image v-if="ctrl == 0" src="../../static/icons/wifi_off.png" @click="ctrl0"></image>
						<image v-if="ctrl == 1" src="../../static/icons/wifi_on.png" @click="ctrl1"></image>
						<image src="../../static/icons/wifi_refresh.png" mode="" @click="getwifi"></image>
					</view>
				</view>
				<!-- 未打开wifi -->
				<view v-show="ctrl == 0" class="closeWifi">
					<view>
						<view class="nowifi"><image src="../../static/book.png" mode=""></image></view>
						<text class="tet">您还没有搜索WIFI</text>
						<button class="btn" @click="ctrl0">
							<image src="../../static/search.png" class="head"></image>
							<span>立即搜索</span>
						</button>
					</view>
				</view>
				<!-- 已打开wifi --> 
				<scroll-view class="wifi_content" v-show="ctrl == 1" scroll-y="true" show-scrollbar="true" scroll-with-animation="true" android:scrollbars="none">
					<!-- wifi列表 -->
					<view class="wifi_list" v-for="(item, index) in wifilist" :key="index+'7'" @click="item.title==wifisuccessid ? disconnectshow(item.title) : key_ps(item.title, item.type,item.level)">
						<view class="w_text">
							<span>{{ item.title }}</span>
							<span style="margin-left: -30px;" v-if="item.title==wifisuccessid">(已连接)</span>
							<span style="margin-left: -30px;" v-else>(未连接)</span>
							<span style="transform: translateY(-1px);" v-if="item.title==wifisuccessid"><image class="image5" src="../../static/wifi/wifisuccess.png" ></image></span>
							<image class="image2" src="../../static/wifi/signal_1.png" v-if="item.level==0"></image>
							<image class="image2" src="../../static/wifi/signal_2.png" v-if="item.level==1"></image>
							<image class="image2" src="../../static/wifi/signal_3.png" v-if="item.level==2"></image>
							<image class="image2" src="../../static/wifi/signal_4.png" v-if="item.level==3"></image>
						</view>
					</view>
				</scroll-view>
			</view>
			<!-- 1.1 WIFI密码输入 -->
			<view class="keyboard" v-show="key_show">
				<view class="key_top">
					<view class="name">
						<!-- <image src="@/static/icons/wifi.png" mode="data"></image> -->
						<image src="../../static/wifi/signal_1.png" v-if="levelnum==0" class="wifiline"></image>
						<image src="../../static/wifi/signal_2.png" v-if="levelnum==1" class="wifiline"></image>
						<image src="../../static/wifi/signal_3.png" v-if="levelnum==2" class="wifiline"></image>
						<image src="../../static/wifi/signal_4.png" v-if="levelnum==3" class="wifiline"></image>
						<view class="wifiname">{{ keyup }}</view>
					</view>
					<!-- 输入框 -->
					<view class="search">
						<input type="text" placeholder="请输入密码" disabled="disabled" autocomplete="off" v-model="message" />
						<button class="search-btn" @click="ConnectWifi()">连接</button>
						<view class="back" @click="key_back()"><image src="@/static/goback.png" mode="widthFix"></image></view>
					</view>
				</view>
				<!-- 数字按键 -->
				<view class="letter" v-for="(key1, index) in data.data1" :key="index+'1'" @click="num(index)">
					<view class="num">{{ key1.num }}</view>
				</view>
				<!-- 大写字母按键 -->
				<view class="letter" v-show="big_show" v-for="(key2, index) in data.data2" :key="index+'2'" @click="small(index)">
					<view class="big">{{ key2.big }}</view>
				</view> 
				<!-- 小写字母按键 -->
				<view class="letter" v-show="small_show" v-for="(key3, index) in data.data3" :key="index+'3'" @click="big(index)">
					<view class="small">{{ key3.small }}</view>
				</view>
				<!-- 符号按键 -->
				<view class="letter" v-show="sign_show" v-for="(key4, index) in data.data4" :key="index+'4'" @click="sign(index)">
					<view class="sign">{{ key4.sign }}</view>
				</view>
			</view>
			
			<!-- wifi连接后点击进入 -->
			<view class="mask" v-show="disconnect">
				<view class="main">
					<view class="header">
						<image src="../../static/wifi/signal_1.png" v-if="levelnum==0"></image>
						<image src="../../static/wifi/signal_2.png" v-if="levelnum==1"></image>
						<image src="../../static/wifi/signal_3.png" v-if="levelnum==2"></image>
						<image src="../../static/wifi/signal_4.png" v-if="levelnum==3"></image>
						<text v-show="wifitype==2">WEP</text>
						<text v-show="wifitype==3">WPA</text>
						<image src="../../static/err1.png" class="rightimg" @click="disconnectnoshow"></image>
					</view>
					<view class="title">{{wifititle}}</view>
					<view class="footer">
						<button @click="failwifi">断开连接</button>
						<button @click="removewifi">取消保存</button>
					</view>
				</view>
			</view>
			<!-- 5.文件夹 -->
			<view v-show="false" class="r_fol"><view class="u_title">文件夹</view></view>
		</view>
		<div class="goback" @click="goback"><image src="@/static/goback.png" mode="widthFix"></image></div>
	</view>
</template>
<script>
import timbres from '@/components/timbre/timbre.vue';
import { getInfo } from '@/lib/common.js';
import { getCurrentNo } from '@/lib/updata.js';
import { MIDIhead, edition, timbre } from '@/lib/MIDIinstructions.js';
let app = getApp()
// #ifdef APP-PLUS
let midiModule = uni.requireNativePlugin("XM-Midi2")
// #endif
export default {
	data() {
		return {
			globalData: getApp().globalData,
			message: '',
			tabList:[
				{icon:'../../static/icons/timbre.png', text:'音色设置'},
				{icon:'../../static/icons/brightness.png', text:'背光亮度'},
				{icon:'../../static/icons/information.png', text:'本机信息'},
				{icon:'../../static/icons/user.png', text:'关于我们'},
				{icon:'../../static/icons/wifi.png', text:'无线网络'},
				// {icon:'../../static/icons/folder.png', text:'文件夹'},
			],
			current: 0,
			// 显示隐藏 
			w_show: false,
			// 键盘输入
			key_show: false,
			big_show: true,
			small_show: false,
			sign_show: false,
			timbre_show: false,
			// 音色设置数据
			icons_1: 0,
			icons_2: '',
			stairs: '',
			onef: [
				{ url: '../../static/set_timbre_1.png', title: '大钢琴', text: 'Grand Piano' },
				{ url: '../../static/set_timbre_2.png', title: '大键琴', text: 'Harpsichord' },
				{ url: '../../static/set_timbre_3.png', title: '马林巴', text: 'Marimba' },
				{ url: '../../static/set_timbre_4.png', title: '手风琴', text: 'Accordion' },
				{ url: '../../static/set_timbre_5.png', title: '民谣吉他', text: 'Folk pop guitar' },
				{ url: '../../static/set_timbre_6.png', title: '小提琴', text: 'Violin' },
				{ url: '../../static/set_timbre_7.png', title: '定音鼓', text: 'Timpani' }
			], 
			twof: [
				{ url: '../../static/set_timbre_8.png', title: '小号', text: 'Trumpet' },
				{ url: '../../static/set_timbre_9.png', title: '短笛', text: 'Piccolo' },
				{ url: '../../static/set_timbre_10.png', title: '叮当铃', text: 'Jingle Bell' },
				{ url: '../../static/set_timbre_11.png', title: '更多', text: 'More' },
			],
			onef_ipad: [
				{ url: '../../static/set_timbre_1.png', title: '大钢琴', text: 'Grand Piano' },
				{ url: '../../static/set_timbre_2.png', title: '大键琴', text: 'Harpsichord' },
				{ url: '../../static/set_timbre_3.png', title: '马林巴', text: 'Marimba' },
				{ url: '../../static/set_timbre_4.png', title: '手风琴', text: 'Accordion' },
				{ url: '../../static/set_timbre_5.png', title: '民谣吉他', text: 'Folk pop guitar' },
			],
			twof_ipad: [
				{ url: '../../static/set_timbre_6.png', title: '小提琴', text: 'Violin' },
				{ url: '../../static/set_timbre_7.png', title: '定音鼓', text: 'Timpani' },
				{ url: '../../static/set_timbre_8.png', title: '小号', text: 'Trumpet' },
				{ url: '../../static/set_timbre_9.png', title: '短笛', text: 'Piccolo' },
				{ url: '../../static/set_timbre_10.png', title: '叮当铃', text: 'Jingle Bell' },
			],		
			// 本机信息数据
			data_info: [{ text: '' }, { text: '' }, { text: '' }, { text: '' },{ text: '' }],
			data_info_ipad: [{ text: '' }, { text: '' }, { text: '' }, { text: '' },{ text: '' }],
			// 无线网络数据
			ctrl: 0, 
			data: {
				data1: [{ num: '1' }, { num: '2' }, { num: '3' }, { num: '4' }, { num: '5' }, { num: '6' }, { num: '7' }, { num: '8' }, { num: '9' }, { num: '0' }],
				data2: [
					{ big: 'Q' },{ big: 'W' },{ big: 'E' },{ big: 'R' },{ big: 'T' },{ big: 'Y' },{ big: 'U' },{ big: 'I' },{ big: 'O' },{ big: 'P' },
					{ big: 'A' },{ big: 'S' },{ big: 'F' },{ big: 'G' },{ big: 'H' },{ big: 'D' },{ big: 'J' },{ big: 'K' },{ big: 'L' },{ big: '大写' },
					{ big: 'Z' },{ big: 'X' },{ big: 'C' },{ big: 'V' },{ big: 'B' },{ big: 'N' },{ big: 'M' },{ big: 'Del' },{ big: '符号' },{ big: '小写' },
				],
				data3: [
					{ small: 'q' },{ small: 'w' },{ small: 'e' },{ small: 'r' },{ small: 't' },{ small: 'y' },{ small: 'u' },{ small: 'i' },{ small: 'o' },{ small: 'p' },
					{ small: 'a' },{ small: 's' },{ small: 'd' },{ small: 'f' },{ small: 'g' },{ small: 'h' },{ small: 'j' },{ small: 'k' },{ small: 'l' },{ small: '大写' },
					{ small: 'z' },{ small: 'x' },{ small: 'c' },{ small: 'v' },{ small: 'b' },{ small: 'n' },{ small: 'm' },{ small: 'Del' },{ small: '符号' },{ small: '小写' },
				],
				data4: [
					{ sign: '`' },{ sign: '!' },{ sign: '@' },{ sign: '#' },{ sign: '$' },{ sign: '%' },{ sign: '^' },{ sign: '&' },{ sign: '*' },{ sign: ',' },{ sign: '.' },
					{ sign: '/' },{ sign: '-' },{ sign: '_' },{ sign: '' },{ sign: '' },{ sign: '' },{ sign: '' },{ sign: '' },{ sign: '大写' },{ sign: '' },{ sign: '' },
					{ sign: '' },{ sign: '' },{ sign: '' },{ sign: '' },{ sign: '' },{ sign: 'Del' },{ sign: '符号' },{ sign: '小写' },
				]
			},
			ps: '',
			cur: '',
			//关于我们信息
			aboutList: [],
			//本机信息
			model: '',
			screen: '',
			//是否有网络
			network: '',
			mac: getInfo('mac'),
			wifilist: [],
			keyup: '',
			wifitype:"",//wifi加密方式
			levelnum:0,//wifi信号
			disconnect:false,//断开连接显示
			wifititle:"",//wifi名称
			//文件夹隐藏
			hidefol:false,
			//之前亮度
			Brightness:'',
			//已连接wifi的ssid
			wifisuccessid:'',
			//存储&内存信息
			totalMemorySize:0, //总存储
			memorySize:0, //可用存储
			totalRamSize:0, //总内存
			ramSize:0, //可用内存
			ipAddr:'127.0.0.1' ,//IP地址
			osVersion:'V1.0.1' ,//软件版本
			midiTimbre: '',//midi音色号
		};
	},
	onLoad() {
		//总存储
		this.totalMemorySize = getInfo('totalMemorySize')
		//可用存储
		this.memorySize = getInfo('memorySize')
		//总内存
		this.totalRamSize = getInfo('totalRamSize')
		//可用内存
		this.ramSize = getInfo('ramSize')
		//获取IP地址
		this.ipAddr = getInfo('ipAddr')
		//序号号
		this.mac = getInfo('mac')
		//获取版本信息
		getCurrentNo(res=>{
			this.osVersion = res.version
			this.data_info[2].text = '软件版本：' + this.osVersion;
		})
		// if(this.Brightness){
		// 	plus.screen.setBrightness(this.Brightness)
		// }
		this.Brightness=plus.screen.getBrightness()
		this.Information();
		this.About();
		this.data_info[4].text = 'IP地址：'+this.ipAddr
		this.data_info[3].text = 'MAC：' + this.mac;
		this.data_info[1].text = `设备存储：可用 ${this.memorySize} GB / ${this.totalMemorySize} GB`;
		this.data_info[0].text = `运行内存：可用 ${this.ramSize} GB / ${this.totalRamSize} GB`;
		this.data_info_ipad = this.data_info;
		// var context = plus.android.importClass("android.content.Context");
		// var locationManager=plus.android.importClass("android.location.LocationManager");
		// var main=plus.android.runtimeMainActivity();
		// var mainSvr=main.getSystemService(context.LOCATION_SERVICE);
		// plus.geolocation.getCurrentPosition(function(p){
		// 		console.log('X轴:' + p.coords.latitude + 'Y轴:' + p.coords.longitude);
		//  },function(err){
		// 	 console.log('定位失败');
		//  })
		uni.getNetworkType({
			success: function (res) {
				console.log(res.networkType);
				if(res.networkType=='wifi'){
					this.$store.state.networkType='wifi'
				}else{
					this.$store.state.networkType='none'
				}
			}
		});
	},
	methods: {
		moreTimbre(e){
			console.log(e)
			this.timbre_show = false
		},
		// 选择音色_第1行
		timbreOnef(index,item){
			app.midiDevices('resume') //连接midi
			// 判断midi是否连接
			if(this.globalData.midi){
				this.icons_1 = index
				this.stairs = 1
				this.$store.state.timbre = item.title
			}else{
				uni.showModal({
					title: '提示',
					showCancel: false,
					content: 'midi连接错误，请检查mini是否正确连接！',
				})
			}
			if(this.globalData.width>1925){
				switch(index){
					case 0: this.midiTimbre = timbre(1);
					break;
					case 1: this.midiTimbre = timbre(7);
					break;
					case 2: this.midiTimbre = timbre(13);
					break;
					case 3: this.midiTimbre = timbre(22);
					break;
					case 4: this.midiTimbre = timbre(26);
					break;
					case 5: this.midiTimbre = timbre(41);
					break;
					case 6: this.midiTimbre = timbre(48);
					break;
				}
			}else{
				switch(index){
					case 0: this.midiTimbre = timbre(1);
					break;
					case 1: this.midiTimbre = timbre(7);
					break;
					case 2: this.midiTimbre = timbre(13);
					break;
					case 3: this.midiTimbre = timbre(22);
					break;
					case 4: this.midiTimbre = timbre(26);
					break;
				}
			}
			
			midiModule.sendMidiSystemExclusive({
				cable: 0,
				systemExclusive: MIDIhead + this.midiTimbre,
			}, (ret) => {
				//调用结果在这里
				// console.log(ret) 
			})
		},
		// 选择音色_第2行
		timbreTwof(index,item){
			app.midiDevices('resume') //连接midi
			if(item.title != '更多'){
				// 判断midi是否连接
				if(this.globalData.midi){
					this.$store.state.timbre = item.title
					this.icons_2 = index
					this.stairs = 2
				}else{
					uni.showModal({
						title: '提示',
						showCancel: false,
						content: 'midi连接错误，请检查mini是否正确连接！',
					})
				}
			}
			if(this.globalData.width>1925){
				switch(index){
					case 0: this.midiTimbre = timbre(57);
					break;
					case 1: this.midiTimbre = timbre(73);
					break;
					case 2: this.midiTimbre = timbre(113);
					break;
					case 3: 
					this.timbre_show = true;
					break;
				}
			}else{
				switch(index){
					case 0: this.midiTimbre = timbre(41);
					break;
					case 1: this.midiTimbre = timbre(48);
					break;
					case 2: this.midiTimbre = timbre(57);
					break;
					case 3: this.midiTimbre = timbre(73);
					break;
					case 4: this.midiTimbre = timbre(113);
					break;
				}
			}
			
			midiModule.sendMidiSystemExclusive({
				cable: 0,
				systemExclusive: MIDIhead + this.midiTimbre,
			}, (ret) => {
				//调用结果在这里
				console.log(ret) 
			}) 
		},
		//返回到首页
		goback() {
			uni.navigateBack({});
			app.midiDevices('suspend') //断开midi
		},
		//关于我们
		About() {
			this.$request({
				url: '/piano/baseinfo/about.html',
				method: 'POST'
			}).then(res => {
				this.aboutList= res.data.data;
			});
		},
		//本机信息
		Information() {
			this.$request({
				url: '/piano/baseinfo/information.html',
				method: 'POST'
			}).then(res => {
				this.model = res.data.data.model;
				this.screen = res.data.data.screen;
			});
		},
		// 点击触发事件
		key_ps(e,type,level) {
			this.key_show = true;
			this.ctrl=2
			this.keyup = e;
			this.ps = '';
			this.wifitype=type
			this.levelnum=level
		},
		key_back() {
			this.ctrl=1
			this.message = '';
			this.key_show = false;
		},
		// 切换左侧导航栏
		chooseTab(index){
			this.current = index
			if(index == 2){
				this.Information();
			}else if(index == 4){
				this.key_show = false;
			}else if(index == 3){
				this.About();
			}
		}, 
		// 打开wifi
		ctrl0() {
			this.ctrl = 1;
			if (this.wifilist) {
				this.wifilist = [];
				plus.android.importClass('android.net.wifi.WifiManager');
				plus.android.importClass('android.net.wifi.WifiInfo');
				var Context = plus.android.importClass('android.content.Context');
				if(plus.android.runtimeMainActivity().getSystemService(Context.WIFI_SERVICE).isWifiEnabled()){
					this.loadWifiInfo();
				}else{
					uni.showLoading({
						title:"开启wifi中"
					})
					plus.android.runtimeMainActivity().getSystemService(Context.WIFI_SERVICE).setWifiEnabled(true);
					setTimeout(()=>{
						this.loadWifiInfo();
						uni.hideLoading()
					},4000)
					return
				}
			}
			this.w_show = true;
		},
		//关闭wifi
		ctrl1() {
			plus.android.importClass('android.net.wifi.WifiManager');
			plus.android.importClass('android.net.wifi.WifiInfo');
			var Context = plus.android.importClass('android.content.Context');
			// plus.android.runtimeMainActivity().getSystemService(Context.WIFI_SERVICE).setWifiEnabled(false);
			this.ctrl = 0;
			this.w_show = false;
		},
		// 刷新wifi列表
		getwifi() {
			this.wifilist = [];
			this.loadWifiInfo();
		},
		num(index) {
			if (index == 28) {
				this.ps = this.ps.slice(0, this.ps.length - 1);
			}
			this.ps = this.ps.concat(this.data.data1[index].num);
			this.ps = this.ps.replace('大写', '');
			this.ps = this.ps.replace('符号', '');
			this.ps = this.ps.replace('Del', '');
			this.ps = this.ps.replace('小写', '');
			this.message = this.ps;
		},
		small(index) {
			if (index == 29) {
				this.small_show = true;
				this.big_show = false;
				this.sign_show = false;
			} else if (index == 28) {
				this.small_show = false;
				this.big_show = false;
				this.sign_show = true;
			} else if (index == 27) {
				this.ps = this.ps.slice(0, this.ps.length - 1);
			}
			this.ps = this.ps.concat(this.data.data2[index].big);
			this.ps = this.ps.replace('大写', '');
			this.ps = this.ps.replace('符号', '');
			this.ps = this.ps.replace('Del', '');
			this.ps = this.ps.replace('小写', '');
			this.message = this.ps;
		},
		big(index) {
			if (index == 19) {
				this.small_show = false;
				this.big_show = true;
				this.sign_show = false;
			} else if (index == 28) {
				this.small_show = false;
				this.big_show = false;
				this.sign_show = true;
			} else if (index == 27) {
				this.ps = this.ps.slice(0, this.ps.length - 1);
			}
			this.ps = this.ps.concat(this.data.data3[index].small);
			this.ps = this.ps.replace('大写', '');
			this.ps = this.ps.replace('符号', '');
			this.ps = this.ps.replace('Del', '');
			this.ps = this.ps.replace('小写', '');
			this.message = this.ps;
		},
		sign(index) {
			if (index == 29) {
				this.small_show = true;
				this.big_show = false;
				this.sign_show = false;
			} else if (index == 27) {
				this.ps = this.ps.slice(0, this.ps.length - 1);
			} else if (index == 19) {
				this.small_show = false;
				this.big_show = true;
				this.sign_show = false;
			}
			this.ps = this.ps.concat(this.data.data4[index].sign);
			this.ps = this.ps.replace('大写', '');
			this.ps = this.ps.replace('符号', '');
			this.ps = this.ps.replace('Del', '');
			this.ps = this.ps.replace('小写', '');
			this.message = this.ps;
		},
		loadWifiInfo() {
			var context = plus.android.importClass("android.content.Context");
			var locationManager=plus.android.importClass("android.location.LocationManager");
			var main=plus.android.runtimeMainActivity();
			var mainSvr=main.getSystemService(context.LOCATION_SERVICE);
			// var gpsProvider = mainSvr.isProviderEnabled(locationManager.GPS_PROVIDER);//检查是否开启了GPS
			// if(!gpsProvider) {
			// this.ctrl=0
			// var message = "为了获取wifi列表，请开启GPS定位权限";
			// var title = "定位未开启";
			// var alertCB = function () {
			// var Intent = plus.android.importClass("android.content.Intent");
			// var mIntent = new Intent('android.settings.LOCATION_SOURCE_SETTINGS');
			// main.startActivity(mIntent);//打开GPS设置
			// }
			// plus.nativeUI.alert( message, alertCB, title);
			// }
			// 主窗体
			var MainActivity = plus.android.runtimeMainActivity();
			// 上下文
			var Context = plus.android.importClass('android.content.Context');
			// 导入WIFI管理 和 WIFI 信息 的class
			plus.android.importClass('android.net.wifi.WifiManager');
			plus.android.importClass('android.net.wifi.WifiInfo');
			plus.android.importClass('android.net.wifi.ScanResult');
			plus.android.importClass('java.util.ArrayList');
			// 获取 WIFI 管理实例
			var wifiManager = MainActivity.getSystemService(Context.WIFI_SERVICE);
			// 获取当前连接WIFI的信息
			var info = wifiManager.getConnectionInfo();
			// console.log(info.getLinkSpeed());
			// 获取当前 WIFI 连接的 SSID (WIFI 名称)
			var ssid = info.getSSID();
			// 这里的 获取到的名称 是 带 双引号的 如 "cmcc"
			// 所以我们这里处理一下
			ssid = ssid.replace(/(^\"*)|(\"*$)/g, '');
			this.wifisuccessid=ssid
			var resultList = wifiManager.getScanResults();
			var len = resultList.size();
			for (var i = 0; i < len; i++) {
				this.wifilist.push({"title":resultList.get(i).plusGetAttribute('SSID'),"level":wifiManager.calculateSignalLevel(resultList.get(i).plusGetAttribute("level"), 3),"type":resultList.get(i).plusGetAttribute('capabilities').search('WPA2-PSK-CCMP')!=-1 ? 3 :2});
			}
			console.log(this.wifilist);
		},
		//连接wifi
		// infowifi(ssid, pwd) {
		// 	ssid = this.keyup;
		// 	pwd = this.message;
		// 	// 主窗体
		// 	var MainActivity = plus.android.runtimeMainActivity();
		// 	// 上下文
		// 	var Context = plus.android.importClass('android.content.Context');
		// 	// 导入WIFI管理 和 WIFI 信息 的class
		// 	plus.android.importClass('android.net.wifi.WifiManager');
		// 	plus.android.importClass('android.net.wifi.WifiInfo');
		// 	plus.android.importClass('android.net.wifi.ScanResult');
		// 	plus.android.importClass('java.util.ArrayList');
		// 	plus.android.importClass('java.lang.String');
		// 	// 获取 WIFI 管理实例
		// 	var wifiManager = MainActivity.getSystemService(Context.WIFI_SERVICE);
		// 	wifiManager.disableNetwork(wifiManager.getConnectionInfo().getNetworkId());
		// 	var netId = wifiManager.addNetwork(this.getWifiConfig(ssid, pwd));
		// 	var msg = wifiManager.enableNetwork(netId, true);
		// },
		// getWifiConfig(ssid, pws) {
		// 	var WifiConfiguration = plus.android.importClass('android.net.wifi.WifiConfiguration');
		// 	var config = new WifiConfiguration();
		// 	config.SSID = '\"' + ssid + '\"';
		// 	config.preSharedKey = '\"' + pws + '\"';
		// 	config.status = WifiConfiguration.Status.ENABLED;
		// 	config.hiddenSSID = true;
		// 	config.internetRecoveryStatus = 3;
		// 	return config;
		// },
		//调节亮度
		getscreen(e){
			console.log(e.detail.value/100);
			plus.screen.setBrightness(e.detail.value/100)
			// this.Brightness=plus.screen.getBrightness()
		},
		//连接wifi
		ConnectWifi(ssid, keyword, type, level){
			ssid = this.keyup;
			keyword = this.message;
			type=this.wifitype;
			var SSID = ssid;
			var Password = keyword;
			var Context = plus.android.importClass("android.content.Context");  
			var WifiManager = plus.android.importClass("android.net.wifi.WifiManager");  
			var wifiManager = plus.android.runtimeMainActivity().getSystemService(Context.WIFI_SERVICE);  
			var WifiConfiguration = plus.android.importClass('android.net.wifi.WifiConfiguration'); 
		   var config = new WifiConfiguration();
			if (type == 1) {
				var allowedKeyManagement = plus.android.getAttribute(config, 'allowedKeyManagement');  
				plus.android.importClass(allowedKeyManagement);  
				allowedKeyManagement.set(WifiConfiguration.KeyMgmt.NONE);
				plus.android.setAttribute(config, 'SSID', "\"" + SSID + "\"");  
			}  
			if (type == 2) {
				plus.android.setAttribute(config, 'wepKeys[0]', "\"" + Password + "\"");  
				plus.android.setAttribute(config, 'hiddenSSID', true);  
				var allowedAuthAlgorithms = plus.android.getAttribute(config, 'allowedAuthAlgorithms');  
				plus.android.importClass(allowedAuthAlgorithms);  
				allowedAuthAlgorithms.set(WifiConfiguration.AuthAlgorithm.SHARED);  
				var allowedGroupCiphers = plus.android.getAttribute(config, 'allowedGroupCiphers');  
				plus.android.importClass(allowedGroupCiphers);  
				allowedGroupCiphers.set(WifiConfiguration.GroupCipher.CCMP);  
				allowedGroupCiphers.set(WifiConfiguration.GroupCipher.TKIP);  
				allowedGroupCiphers.set(WifiConfiguration.GroupCipher.WEP40);  
				allowedGroupCiphers.set(WifiConfiguration.GroupCipher.WEP104);  
				var allowedKeyManagement = plus.android.getAttribute(config, 'allowedKeyManagement');  
				plus.android.importClass(allowedKeyManagement);  
				allowedKeyManagement.set(WifiConfiguration.KeyMgmt.NONE);  
				config.wepTxKeyIndex = 0;
			}  
			if (type == 3) { 
				plus.android.setAttribute(config, 'SSID', "\"" + SSID + "\"");  
				plus.android.setAttribute(config, 'preSharedKey', "\"" + Password + "\"");  
				plus.android.setAttribute(config, 'hiddenSSID', true);  
				var allowedAuthAlgorithms = plus.android.getAttribute(config, 'allowedAuthAlgorithms');  
				plus.android.importClass(allowedAuthAlgorithms);  
				allowedAuthAlgorithms.set(WifiConfiguration.AuthAlgorithm.OPEN);  
				var allowedGroupCiphers = plus.android.getAttribute(config, 'allowedGroupCiphers');  
				plus.android.importClass(allowedGroupCiphers);  
				allowedGroupCiphers.set(WifiConfiguration.GroupCipher.TKIP);  
				var allowedKeyManagement = plus.android.getAttribute(config, 'allowedKeyManagement');  
				plus.android.importClass(allowedKeyManagement);  
				allowedKeyManagement.set(WifiConfiguration.KeyMgmt.WPA_PSK);  
				var allowedPairwiseCiphers = plus.android.getAttribute(config, 'allowedPairwiseCiphers');  
				plus.android.importClass(allowedPairwiseCiphers);  
				allowedPairwiseCiphers.set(WifiConfiguration.PairwiseCipher.TKIP);  
				var allowedGroupCiphers = plus.android.getAttribute(config, 'allowedGroupCiphers');  
				plus.android.importClass(allowedGroupCiphers);  
				allowedGroupCiphers.set(WifiConfiguration.GroupCipher.CCMP);  
				var allowedPairwiseCiphers = plus.android.getAttribute(config, 'allowedPairwiseCiphers');  
				plus.android.importClass(allowedPairwiseCiphers);  
				allowedPairwiseCiphers.set(WifiConfiguration.PairwiseCipher.CCMP);  
				plus.android.setAttribute(config, 'status', WifiConfiguration.Status.ENABLED);  
			}
			// if(this.wifisuccessid){
			// 	this.failwifi()
			// }
			var wcgID = wifiManager.addNetwork(config);
			var iswcg=wifiManager.enableNetwork(wcgID, true);
			// console.log(iswcg);
			uni.showLoading({
				title:"连接中"
			})
			setTimeout(()=>{
				if(iswcg && wifiManager.getConnectionInfo().getSSID()=='"'+SSID+'"'){
					uni.showToast({
						title:"连接成功",
						icon:'success'
					})
					this.key_show=false
					this.ctrl=1
					this.wifisuccessid=SSID
					this.$store.state.networkType='wifi'
					this.$store.state.level=this.levelnum
				}else{
					uni.showToast({
						title:"连接失败",
						icon:'error'
					})
				}
				uni.hideLoading()
			},5000)
		   // plus.webview.currentWebview().reload();
		},
		//断开连接点击显示
		disconnectshow(title){
			this.disconnect=true
			this.wifititle=title
		},
		//断开连接点击隐藏
		disconnectnoshow(){
			this.disconnect=false
		},
		//断开wifi连接
		failwifi(){
			// 主窗体
			var MainActivity = plus.android.runtimeMainActivity();
			// 上下文
			var Context = plus.android.importClass('android.content.Context');
			// 获取 WIFI 管理实例
			var wifiManager = MainActivity.getSystemService(Context.WIFI_SERVICE);
			wifiManager.disableNetwork(this.wifisuccessid)
			wifiManager.disconnect()
			this.disconnect=false
			this.wifisuccessid="shekttpptkglgdsdsd"
		},
		//取消wifi保存
		removewifi(){
			// 主窗体
			var MainActivity = plus.android.runtimeMainActivity();
			// 上下文
			var Context = plus.android.importClass('android.content.Context');
			// 获取 WIFI 管理实例
			var wifiManager = MainActivity.getSystemService(Context.WIFI_SERVICE);
			// var netid=wifiManager.getConfiguredNetworks().get(1).plusGetAttribute('networkId')
			// console.log(wifiManager.getConfiguredNetworks().get(1).plusGetAttribute('networkId'));
			wifiManager.removeNetwork(this.wifisuccessid)
			wifiManager.saveConfiguration()
			this.disconnect=false
			this.wifilist=[]
			this.loadWifiInfo()
			// this.wifisuccessid="shekttpptkglgsdsdsd"
		},
	}
};
</script>

<style>
@media screen and (min-width: 2560px){
	* {
		padding: 0;
		margin: 0;
	}
	.set {
		width: 2560px;
		height: 720px;
		background-color: #0a1050;
		position: relative;
	}
	/* 1.左侧 */
	/* 1.1 左侧边框 */
	.left {
		width: 258px;
		height: 576px;
		background-color: #072f7f;
		border-radius: 12px;
		position: relative;
		top: 72px;
		left: 200px;
	}
	/* 1.2 左侧标题 */
	.tabbar {
		width: 155px;
		height: 54px;
		position: relative;
		padding: 33px 0px 15px 55px;
	}
	.left image {
		float: left;
		width: 37px;
		height: 37px;
		margin-top: 0px;
		padding-right: 10px;
	}
	.font {
		font-size: 21px;
		line-height: 35px;
		color: #cfcfcf;
		font-style: normal;
	}
	.cur {
		width: 100%;
		background-color: #0077f1;
	}
	/* 2.右侧 */
	.right {
		width: 1785px;
		height: 580px;
		position: absolute;
		top: 70px;
		left: 529px;
		text-align: center;
		border: 2px solid #079fff;
		border-radius: 10px;
		box-shadow: 0px 0px 20px 4px #079fff;
		overflow: hidden;
	}
	/* 2.2 右侧内容 */
	/* 公用标题样式 */
	.u_title {
		text-align: center;
		font-size: 34px;
		color: #fff;
		font-weight: bold;
		margin-top: 40px;
		/* margin-left: 800px; */
	}
	/* 2.2.1 无线网络 */
	/* 标题+图标 */
	.title_ctrl {
		margin-top: 40px;
		margin-left: 820px;
		height: 50px;
	}
	.title {
		font-size: 34px;
		color: #fff;
		font-weight: bold;
		float: left;
	}
	.ctrl {
		float: right;
		margin-right: 80px;
	}
	.ctrl image {
		width: 50px;
		height: 50px;
		margin-left: 20px;
	}
	.nowifi image {
		width: 215px;
		height: 165px;
		opacity: 0.57;
	}
	.closeWifi {
		width: 423px;
		height: 403px;
		border-radius: 8px;
		padding-top: 85px;
		margin: 0px auto;
	}
	.closeWifi .head {
		width: 21px;
		height: 25px;
		transform: translateY(4px);
		padding-right: 5px;
	}
	.closeWifi .tet {
		opacity: 0.53;
		margin-bottom: 50px;
		margin-left: 80px;
		padding-top: 50px;
	}
	.closeWifi .btn {
		width: 212px;
		height: 51px;
		border: 1.33px solid #ffffff;
		border-radius: 25px;
		font-size: 10.5px;
		background-color: #254a9e;
		line-height: 51px;
		opacity: 0.7;
	}
	.closeWifi text {
		width: 260px;
		height: 20px;
		display: block;
		opacity: 0.53;
		font-size: 20px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		text-align: center;
		color: #ffffff;
	}
	.closeWifi .btn image {
		width: 21px;
		height: 25px;
		margin-top: 8px;
		margin-left: 26px;
		float: left;
	}
	.closeWifi .btn span {
		font-size: 21px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		color: #ffffff;
		margin-left: -12px;
		float: left;
	}
	/* wifi列表主体 */
	.right .wifi_content {
		width: 100%;
		height: 520px;
		margin-top: 40px;
	}
	/* wifi列表 */
	.wifi_list {
		width: 786px;
		height: 48px;
		background-color: #345aa9;
		border-radius: 24px;
		float: left;
		margin-top: 20px;
		margin-left: 66px;
		margin-bottom: 18px;
		position: relative;
	}
	.w_text {
		padding-top: 12px;
	}
	.wifi span {
		float: left;
		padding-left: 33px;
		padding-top: 3px;
	}
	.wifi .image1 {
		float: left;
		width: 26px;
		height: 19px;
		padding-top: 2px;
	}
	.wifi .image2 {
		float: left;
		width: 35px;
		height: 35px;
		float: right;
		margin-right: 20px;
		margin-top: -5px;
	}
	/* 输入密码 */
	.keyboard {
		width: 60%;
		height: 90%;
		margin: 70px auto;
	}
	.key_top {
		width: 100%;
		height: 56px;
	}
	.keyboard .name {
		font-size: 25px;
		margin-right: 50px;
		width: 380px;
	}
	.name image {
		width: 40px;
		height: 40px;
		margin-right: 30px;
		top: 5px;
		float: left;
	}
	.name .wifiname {
		float: left;
		height: 40px;
		width: 280px;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		margin-top: 14px;
	}
	.search {
		width: 650px;
		height: 60px;
		overflow: hidden;
		float: left;
		margin-bottom: 50px;
	}
	.search input {
		width: 330px;
		height: 56px;
		border-top-left-radius: 50px;
		border-bottom-left-radius: 50px;
		float: left;
		color: #6b6b6b;
		background: #fff;
		background-size: 22px;
		line-height: 50px;
		outline: none;
	}
	.search .search-btn {
		width: 123px;
		height: 57px;
		background-color: #e03e5b;
		font-size: 18px;
		text-align: center;
		float: left;
		border-top-right-radius: 50px;
		border-bottom-right-radius: 50px;
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
		color: #fff;
		letter-spacing: 3px;
		padding-top: 5px;
	}
	.search .back {
		float: left;
		/* bottom: 40px;
		right: 10px; */
		width: 180px;
		height: 72px;
	}
	.search .back image {
		width: 150px;
		height: auto;
		margin-left: 50px;
	}
	.letter {
		width: 100%;
		margin-top: 35px;
	}
	.small,
	.big,
	.num,
	.sign {
		width: 91px;
		height: 85px;
		line-height: 85px;
		font-size: 25px;
		color: #000;
		background-color: #fff;
		float: left;
		margin-right: 10px;
		margin-bottom: 10px;
		border-radius: 12px;
	}
	/* 2.2.2 音色设置 */	
	.r_tim .onef ul {
		display: flex;
		float: left;
		margin-left: 195px;
		margin-top: 50px;
	}
	.r_tim ul li {
		padding: 0 30px;
	}
	.r_tim .twof ul {
		margin-left: 500px;
		display: flex;
		float: left;
		margin-top: 40px;
	}
	.icons_bg {
		width: 140px;
		height: 140px;
		border-radius: 18px;
		background-color: #1945a4;
		border: 3px solid #4b93ff;
	}
	.icons_bgs {
		background-color: #0181ed;
	}
	.r_tim .icons_bg image {
		width: 60px;
		height: 60px;
		margin-top: 40px;
	}
	.timbre_text1 {
		font-size: 20px;
		color: #fbfcfa;
	}
	.timbre_text2 {
		font-size: 8px;
		color: #f2f3f1;
	}
	.icons_text {
		font-size: 80px;
	}
	
	/* 2.2.3 背光亮度*/
	.beiguang {
		width: 80%;
		margin: 200px auto;
	}
	
	/* 2.2.5 本机信息 */
	.info_text {
		text-align: left;
		margin: 60px 0px 0px 94px;
		font-size: 21px;
		color: #cfcfcf;
	}
	.info_text ul li {
		width: 700px;
		height: 45px;
		float: left;
		margin-top: 20px;
		padding-left: 80px;
		padding-top: 10px;
		margin-right: 50px;
	}
	.ctrl_ref image{
		width: 50px;
		height: 50px;
		position: absolute;
		right: 10%;
		top: 8%;
	}
	.cur_info {
		width: 725px;
		height: 48px;
		background-color: #345aa9;
		border-radius: 24px;
	}
	/* 2.2.6 关于我们 */
	.u_text {
		width: 1649px;
		height: 125px;
		font-size: 20px;
		padding-top: 30px;
		margin-left: 78px;
		text-align: left;
	}
	.r_user image {
		width: 171px;
		height: 171px;
		margin-top: 40px;
	}
	.r_user #span {
		font-size: 16px;
	}
	.u_footer {
		font-size: 16px;
		color: #fff;
		margin-top: 50px;
	}
	/* 返回按钮 */
	.goback {
		position: absolute;
		bottom: 40px;
		right: 10px;
	}
	.goback image {
		width: 180px;
		height: 72px;
	}
	.forceupdata{
		/* transform: translateY(3px); */
		position: absolute;
		top: 332px;
		left: 350px;
	}
	.image5{
		width: 30px;
		height: 25px;
	}
	.wifiline{
		transform: scale(1.5);
	}
	.mask{
		width:100%;
		height:100%;
		position: fixed;
		left:0;
		top:0;
		background: rgba(0,0,0,0.5);
	}
	.mask .main{
		width: 18%;
		height: 37%;
		border: 3px solid #0893ed;
		border-radius: 10px;
		background-color: #3b6cc0;
		position: absolute;
		left: 40%;
		top: 28%;
	}
	.mask .header{
		width: 100%;
		height: 25%;
		border-bottom: 3px solid #b2c2df;
	}
	.mask .header image{
		width: 16%;
		height: 100%;
		float: left;
		margin-left: 2%;
	}
	.mask .header text{
		height: 100%;
		font-size: 27px;
		float: left;
		transform: translateY(15px);
	}
	.mask .header .rightimg{
		width: 10%;
		height: 70%;
		float: right;
		margin-right: 2%;
		margin-top: 2.2%;
	}
	.mask .title{
		width: 100%;
		text-align: center;
		font-size: 25px;
		margin-top: 8%;
		margin-bottom: 8%;
	}
	.mask .footer{
		width: 100%;
		height: 20%;
	}
	.mask .footer button{
		width: 35%;
		height: 100%;
		border-radius: 30px;
		display: inline-block;
		margin-right: 6%;
		font-size: 20px;
	}
	.mask .footer button:first-child{
		margin-left: 8%;
	}
	.mask .footer button:nth-child(2){
		border: 2px solid #ffffff;
		background-color: #0077f1;
		color: #ffffff;
	}
}
@media screen and (max-width: 1925px) and (min-width: 1656px){
	* {
		padding: 0;
		margin: 0;
	}
	.set {
		width: 1920px;
		height: 1080px;
		background-color: #0a1050;
		position: relative;
	}
	/* 1.左侧 */
	/* 1.1 左侧边框 */
	.left {
		width: 334px;
		height: 750px;
		background-color: #072f7f;
		border-radius: 12px;
		position: relative;
		top: 156px;
		left: 63px;
	}
	/* 1.2 左侧标题 */
	.tabbar {
		width: 155px;
		/* height: 54px; */
		position: relative;
		padding: 30px 30px 30px 90px; 
	}
	.left image {
		float: left;
		width: 37px;
		height: 37px;
		margin-top: 0px;
		padding-right: 10px;
	}
	.font {
		font-size: 21px;
		line-height: 50px;
		color: #cfcfcf;
		font-style: normal;
	}
	.cur {
		width: 100%;
		background-color: #0077f1;
	}
	/* 2.右侧 */
	.right {
		width: 1420px;
		height: 750px;
		position: absolute;
		top: 156px;
		left: 440px;
		text-align: center;
		border: 2px solid #079fff;
		border-radius: 10px;
		box-shadow: 0px 0px 20px 4px #079fff;
		overflow: hidden;
	}
	/* 2.2 右侧内容 */
	/* 公用标题样式 */
	.u_title {
		text-align: center;
		font-size: 34px;
		color: #fff;
		font-weight: bold;
		margin-top: 40px;
		/* margin-left: 800px; */
	}
	/* 2.2.1 无线网络 */
	/* 标题+图标 */
	.title_ctrl {
		margin-top: 40px;
		margin-left: 820px;
		height: 50px;
	}
	.title {
		font-size: 34px;
		color: #fff;
		font-weight: bold;
		float: left;
		margin-left: -175px;
	}
	.ctrl {
		float: right;
		margin-right: 80px;
	}
	.ctrl image {
		width: 50px;
		height: 50px;
		margin-left: 20px;
	}
	.nowifi image {
		width: 215px;
		height: 165px;
		opacity: 0.57;
		margin-top: 100px;
	}
	.closeWifi {
		width: 423px;
		height: 403px;
		border-radius: 8px;
		padding-top: 85px;
		margin: 0px auto;
	}
	.closeWifi .head {
		width: 21px;
		height: 25px;
		transform: translateY(4px);
		padding-right: 5px;
	}
	.closeWifi .tet {
		opacity: 0.53;
		margin-bottom: 50px;
		margin-left: 80px;
		padding-top: 50px;
	}
	.closeWifi .btn {
		width: 212px;
		height: 51px;
		border: 1.33px solid #ffffff;
		border-radius: 25px;
		font-size: 10.5px;
		background-color: #254a9e;
		line-height: 51px;
		opacity: 0.7;
	}
	.closeWifi text {
		width: 260px;
		height: 20px;
		display: block;
		opacity: 0.53;
		font-size: 20px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		text-align: center;
		color: #ffffff;
	}
	.closeWifi .btn image {
		width: 21px;
		height: 25px;
		margin-top: 8px;
		margin-left: 26px;
		float: left;
	}
	.closeWifi .btn span {
		font-size: 21px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		color: #ffffff;
		margin-left: -12px;
		float: left;
	}
	/* wifi列表主体 */
	.right .wifi_content {
		width: 100%;
		height: 520px;
		margin-top: 40px;
	}
	/* wifi列表 */
	.wifi_list {
		width: 90%;
		height: 48px;
		background-color: #345aa9;
		border-radius: 24px;
		float: left;
		margin-top: 20px;
		margin-left: 66px;
		margin-bottom: 18px;
		position: relative;
	}
	.w_text {
		padding-top: 12px;
	}
	.wifi span {
		float: left;
		padding-left: 33px;
		padding-top: 3px;
	}
	.wifi .image1 {
		float: left;
		width: 26px;
		height: 19px;
		padding-top: 2px;
	}
	.wifi .image2 {
		/* float: left; */
		width: 35px;
		height: 35px;
		float: right;
		margin-right: 20px;
		margin-top: -5px;
	}
	/* 输入密码 */
	.keyboard {
		width: 1050px;
		height: 90%;
		margin: 70px auto;
	}
	.key_top {
		width: 100%;
		height: 56px;
	}
	.keyboard .name {
		font-size: 25px;
		margin-right: 50px;
		width: 380px;
	}
	.name image {
		width: 40px;
		height: 40px;
		margin-right: 30px;
		top: 5px;
		float: left;
	}
	.name .wifiname {
		float: left;
		height: 40px;
		width: 280px;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		margin-top: 14px;
	}
	.search {
		width: 750px;
		height: 60px;
		overflow: hidden;
		float: left;
		margin-bottom: 100px;
		margin-left: -70px;
	}
	.search input {
		width: 400px;
		height: 56px;
		border-top-left-radius: 50px;
		border-bottom-left-radius: 50px;
		float: left;
		color: #6b6b6b;
		background: #fff;
		background-size: 22px;
		line-height: 50px;
		outline: none;
	}
	.search .search-btn {
		width: 123px;
		height: 57px;
		background-color: #e03e5b;
		font-size: 18px;
		text-align: center;
		float: left;
		border-top-right-radius: 50px;
		border-bottom-right-radius: 50px;
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
		color: #fff;
		letter-spacing: 3px;
		padding-top: 5px;
	}
	.search .back {
		float: left;
		/* bottom: 40px;
		right: 10px; */
		width: 180px;
		height: 72px;
	}
	.search .back image {
		width: 150px;
		height: auto;
		position: absolute;
		left: 1050px;
	}
	.letter {
		width: 100%;
		margin-top: 35px;
	}
	.small,
	.big,
	.num,
	.sign {
		width: 91px;
		height: 55px;
		font-size: 25px;
		color: #000;
		background-color: #fff;
		float: left;
		margin-right: 10px;
		margin-bottom: 10px;
		padding-top: 30px;
		border-radius: 12px;
	}
	/* 2.2.2 音色设置 */
	.r_tim .onef ul {
		display: flex;
		float: left;
		margin-left: 145px;
		margin-top: 80px;
	}
	.r_tim ul li {
		padding: 0 30px;
	}
	.r_tim .twof ul {
		margin-left: 145px;
		display: flex;
		float: left;
		margin-top: 40px;
	}
	.icons_bg {
		width: 160px;
		height:160px;
		border-radius: 18px;
		background-color: #1945a4;
		border: 3px solid #4b93ff;
	}
	.icons_bgs {
		background-color: #0181ed;
	}
	.r_tim .icons_bg image {
		width: 80px;
		height: 80px;
		margin-top: 45px;
	}
	.timbre_text1 {
		font-size: 22px;
		color: #fbfcfa;
	}
	.timbre_text2 {
		font-size: 8px;
		color: #f2f3f1;
	}
	.icons_text {
		font-size: 80px;
	}
	
	/* 2.2.3 背光亮度*/
	.beiguang {
		width: 80%;
		margin: 300px auto;
	}
	 
	/* 2.2.5 本机信息 */
	.u_title .locinfo{
		font-size: 34px;
		color: #fff;
		font-weight: bold;
		float: left;
		text-align: center;
		margin-left: 640px; 
		margin-top: -60px;
		margin-bottom: 80px;
	}
	.info_text {
		text-align: left;
		margin: 100px 0px 0px 94px;
		font-size: 21px;
		color: #cfcfcf;
	}
	.info_text ul li {
		width: 1150px;
		height: 45px;
		float: left;
		margin-top: 20px;
		padding-left: 80px;
		padding-top: 10px;
		margin-right: 50px;
	}
	.ctrl_ref image{
		width: 50px;
		height: 50px;
		position: absolute;
		right: 10%;
		top: 5%;
	}
	.cur_info {
		width: 700px;
		height: 48px;
		background-color: #345aa9;
		border-radius: 24px;
	}
	/* 2.2.6 关于我们 */
	.u_text {
		width: 1331px;
		height: 182px;
		font-size: 20px;
		padding-top: 30px;
		margin-left: 40px;
		text-align: left;
	}
	.r_user image {
		width: 171px;
		height: 171px;
		margin-top: 80px;
	}
	.r_user #span {
		font-size: 16px;
	}
	.u_footer {
		font-size: 16px;
		color: #fff;
		margin-top: 200px;
	}
	/* 返回按钮 */
	.goback {
		position: absolute;
		top: 40px;
		right: 40px;
	}
	.goback image {
		width: 180px;
		height: 72px;
	}
	.forceupdata{
		/* transform: translateY(3px); */
		position: absolute;
		top: 502px;
		left: 350px;
	}
	.image5{
		width: 30px;
		height: 25px;
	}
	.mask{
		width:100%;
		height:100%;
		position: fixed;
		left:0;
		top:0;
		background: rgba(0,0,0,0.5);
	}
	.mask .main{
		width: 18%;
		height: 37%;
		border: 3px solid #0893ed;
		border-radius: 10px;
		background-color: #3b6cc0;
		position: absolute;
		left: 40%;
		top: 28%;
	}
	.mask .header{
		width: 100%;
		height: 25%;
		border-bottom: 3px solid #b2c2df;
	}
	.mask .header image{
		width: 16%;
		height: 100%;
		float: left;
		margin-left: 2%;
	}
	.mask .header text{
		height: 100%;
		font-size: 27px;
		float: left;
		transform: translateY(15px);
	}
	.mask .header .rightimg{
		width: 10%;
		height: 70%;
		float: right;
		margin-right: 2%;
		margin-top: 2.2%;
	}
	.mask .title{
		width: 100%;
		text-align: center;
		font-size: 25px;
		margin-top: 8%;
		margin-bottom: 8%;
	}
	.mask .footer{
		width: 100%;
		height: 20%;
	}
	.mask .footer button{
		width: 35%;
		height: 100%;
		border-radius: 30px;
		display: inline-block;
		margin-right: 6%;
		font-size: 20px;
	}
	.mask .footer button:first-child{
		margin-left: 8%;
	}
	.mask .footer button:nth-child(2){
		border: 2px solid #ffffff;
		background-color: #0077f1;
		color: #ffffff;
	}
}
@media screen and (max-width: 1655px) and (min-width: 1286px){
	* {
		padding: 0;
		margin: 0;
	}
		.set {
			width: 100%;
			height: 100%;
			background-color: #0a1050;
			position: relative;
		}
		/* 1.左侧 */
		/* 1.1 左侧边框 */
		.left {
			width: 18%;
			height: 70%;
			background-color: #072f7f;
			border-radius: 15px;
			position: relative;
			top: 21%;
			left: 3%;	
		}
		/* 1.2 左侧标题 */
		.tabbar {
			width: 60%;
			/* height: 54px; */
			position: relative;
			padding: 40px 20px 30px 80px;
		}
		.left image {
			float: left;
			width: 37px;
			height: 37px;
			margin-top: 0px;
			padding-right: 10px;
		}
		.font {
			font-size: 21px;
			line-height: 35px;
			color: #cfcfcf;
			font-style: normal;
		}
		.cur {
			width: 100%;
			background-color: #0077f1;
		}
		
		/* 2.右侧 */
		.right {
			width: 70%;
			height: 68%;
			position: absolute;
			top: 21%;
			left: 25%;
			text-align: center;
			border: 2px solid #079fff;
			border-radius: 10px;
			box-shadow: 0px 0px 20px 4px #079fff;
			overflow: hidden;
		}
		/* 2.2 右侧内容 */
		/* 公用标题样式 */
		.u_title {
			text-align: center;
			font-size: 34px;
			color: #fff;
			font-weight: bold;
			margin-top: 40px;
			/* margin-left: 800px; */
		}
		/* 2.2.1 无线网络 */
		/* 标题+图标 */
		.title_ctrl {
			margin-top: 40px;
			margin-left: 43%;
			height: 50px;
		}
		.title {
			font-size: 34px;
			color: #fff;
			font-weight: bold;
			float: left;
		}
		.ctrl {
			float: right;
			margin-right: 80px;
		}
		.ctrl image {
			width: 50px;
			height: 50px;
			margin-left: 20px;
		}
		.nowifi image {
			width: 150px;
			height: 140px;
			opacity: 0.57;
			margin-top: -20px;
			margin-left: -40px;
		}
		.closeWifi {
			width: 423px;
			height: 403px;
			border-radius: 8px;
			padding-top: 85px;
			margin: 0px auto;
		}
		.closeWifi .head {
			width: 21px;
			height: 25px;
			transform: translateY(4px);
			padding-right: 5px;
		}
		.closeWifi .tet {
			opacity: 0.53;
			margin-bottom: 50px;
			margin-left: 80px;
			padding-top: 50px;
		}
		.closeWifi .btn {
			width: 212px;
			height: 51px;
			border: 1.33px solid #ffffff;
			border-radius: 25px;
			font-size: 10.5px;
			background-color: #254a9e;
			line-height: 51px;
			opacity: 0.7;
			margin-left: 90px;
		}
		.closeWifi text {
			width: 260px;
			height: 20px;
			display: block;
			opacity: 0.53;
			font-size: 20px;
			font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
			font-weight: normal;
			text-align: center;
			color: #ffffff;
		}
		.closeWifi .btn image {
			width: 21px;
			height: 25px;
			margin-top: 8px;
			margin-left: 26px;
			float: left;
		}
		.closeWifi .btn span {
			font-size: 21px;
			font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
			font-weight: normal;
			color: #ffffff;
			margin-left: -12px;
			float: left;
		}
		/* wifi列表主体 */
		.right .wifi_content {
			width: 100%;
			height: 520px;
			margin-top: 40px;
		}
		/* wifi列表 */
		.wifi_list {
			width: 90%;
			height: 48px;
			background-color: #345aa9;
			border-radius: 24px;
			float: left;
			margin-top: 20px;
			margin-left: 66px;
			margin-bottom: 18px;
			position: relative;
		}
		.w_text {
			padding-top: 12px;
		}
		.wifi span {
			float: left;
			padding-left: 33px;
			padding-top: 3px;
		}
		.wifi .image1 {
			float: left;
			width: 26px;
			height: 19px;
			padding-top: 2px;
		}
		.wifi .image2 {
			float: left;
			width: 35px;
			height: 35px;
			float: right;
			margin-right: 20px;
			margin-top: -5px;
		}
		
		/* 输入密码 */
		.keyboard {
			width: 95%;
			height: 90%;
			margin: 5% auto;
		}
		.key_top {
			width: 100%;
			height: 56px;
		}
		.keyboard .name {
			font-size: 25px;
			margin-right: 20px;
			width: 40%;
		}
		.name image {
			width: 40px;
			height: 40px;
			float: left;
		}
		.name .wifiname {
			float: left;
			height: 40px;
			width: 70%;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
			margin-top: 3px;
		}
		.search {
			width: 60%;
			height: 60px;
			overflow: hidden;
			float: left;
			margin-bottom: 100px;
			margin-top: -5px;
		}
		.search input {
			width: 50%;
			height: 56px;
			border-top-left-radius: 50px;
			border-bottom-left-radius: 50px;
			float: left;
			color: #6b6b6b; 
			background: #fff;
			background-size: 22px;
			line-height: 50px;
			outline: none;
		}
		.search .search-btn {
			width: 20%;
			height: 57px;
			background-color: #e03e5b;
			font-size: 18px;
			text-align: center;
			float: left;
			border-top-right-radius: 50px;
			border-bottom-right-radius: 50px;
			border-top-left-radius: 0;
			border-bottom-left-radius: 0;
			color: #fff;
			letter-spacing: 3px;
			padding-top: 5px;
		}
		.search .back image {
			width: 150px;
			height: auto;
			position: absolute;
			top: 40px;
			right: 10px;
		}
		.letter {
			width: 100%;
			margin-top: 35px;
		}
		.small,
		.big,
		.num,
		.sign {
			width: 90px;
			height: 60px;
			font-size: 25px;
			color: #000;
			background-color: #fff;
			float: left;
			margin: -40px 14px 50px 5px;
			padding-top: 20px;
			border-radius: 12px;
		}
		/* 2.2.2 音色设置 */
		.r_tim .onef ul {
			display: flex;
			float: left;
			margin-left: 90px;
			margin-top: 50px;
		}
		.r_tim ul li {
			padding: 0 30px;
		}
		.r_tim .twof ul {
			margin-left: 90px;
			display: flex;
			float: left;
			margin-top: 40px;
		}
		.icons_bg {
			width: 130px;
			height: 130px;
			border-radius: 18px;
			background-color: #1945a4;
			border: 3px solid #4b93ff;
		}
		.icons_bgs {
			background-color: #0181ed;
		}
		.r_tim .icons_bg image {
			width: 60px;
			height: 60px;
			margin-top: 35px;
		}
		.timbre_text1 {
			font-size: 22px;
			color: #fbfcfa;
		}
		.timbre_text2 {
			font-size: 8px;
			color: #f2f3f1;
		}
		.icons_text {
			font-size: 80px;
		}
		/* 2.2.3 背光亮度*/
		.beiguang {
			width: 80%;
			margin: 20% auto;
		}
		/* 2.2.5 本机信息 */
		.u_title .locinfo{
			font-size: 34px;
			color: #fff;
			font-weight: bold;
			float: left;
			text-align: center;
			margin-left: 43%; 
			margin-top: -60px;
		}
		.info_text {
			text-align: left;
			margin: 100px 0px 0px 94px;
			font-size: 21px;
			color: #cfcfcf;
		}
		.info_text ul li {
			width: 80%;
			height: 45px;
			float: left;
			margin-top: 10px;
			padding-left: 80px;
			padding-top: 10px;
			margin-right: 50px;
		}
		.ctrl_ref image{
			width: 50px;
			height: 50px;
			position: absolute;
			right: 10%;
			top: 8%;
		}
		.cur_info {
			width: 700px;
			height: 48px;
			background-color: #345aa9;
			border-radius: 24px;
		}
		/* 2.2.6 关于我们 */
		.u_text {
			width: 90%;
			height: 200px;
			font-size: 20px;
			padding-top: 30px;
			margin-left: 40px;
			text-align: left;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		.r_user image {
			width: 120px;
			height: 120px;
			margin-top: 40px;
		}
		.r_user #span {
			font-size: 16px;
		}
		.u_footer {
			font-size: 16px;
			color: #fff;
			margin-top: 200px;
		}
		/* 返回按钮 */
		.goback {
			position: absolute;
			top: 40px;
			right: 40px;
		}
		.goback image {
			width: 180px;
			height: 72px;
		}
		.forceupdata{
			/* transform: translateY(3px); */
			position: absolute;
			left: 360px;
			top: 383px;
		}
		.image5{
			width: 30px;
			height: 25px;
		}
		.mask{
			width:100%;
			height:100%;
			position: fixed;
			left:0;
			top:0;
			background: rgba(0,0,0,0.5);
		}
		.mask .main{
			width: 18%;
			height: 37%;
			border: 3px solid #0893ed;
			border-radius: 10px;
			background-color: #3b6cc0;
			position: absolute;
			left: 40%;
			top: 28%;
		}
		.mask .header{
			width: 100%;
			height: 25%;
			border-bottom: 3px solid #b2c2df;
		}
		.mask .header image{
			width: 16%;
			height: 100%;
			float: left;
			margin-left: 2%;
		}
		.mask .header text{
			height: 100%;
			font-size: 27px;
			float: left;
			transform: translateY(15px);
		}
		.mask .header .rightimg{
			width: 10%;
			height: 70%;
			float: right;
			margin-right: 2%;
			margin-top: 2.2%;
		}
		.mask .title{
			width: 100%;
			text-align: center;
			font-size: 25px;
			margin-top: 8%;
			margin-bottom: 8%;
		}
		.mask .footer{
			width: 100%;
			height: 20%;
		}
		.mask .footer button{
			width: 35%;
			height: 100%;
			border-radius: 30px;
			display: inline-block;
			margin-right: 6%;
			font-size: 20px;
		}
		.mask .footer button:first-child{
			margin-left: 8%;
		}
		.mask .footer button:nth-child(2){
			border: 2px solid #ffffff;
			background-color: #0077f1;
			color: #ffffff;
		}
	
}
@media screen and (max-width: 1285px) and (min-width: 1006px){
	* {
		padding: 0;
		margin: 0;
	}
	.set {
		width: calc(100% - 100px);
		height: 100%;
		background-color: #0a1050;
		position: relative;
		padding:100px 50px;
	}
	/* 1.左侧 */
	/* 1.1 左侧边框 */
	.left {
		width: 18%;
		height: 500px;
		background-color: #072f7f;
		border-radius: 15px;
	}
	/* 1.2 左侧标题 */
	.tabbar {
		width: 80%;
		/* height: 54px; */
		position: relative;
		padding: 30px 20px 30px 50px;
	}
	.left image {
		float: left;
		width: 28px;
		height: 28px;
		margin-top: 0px;
		padding-right: 10px;
	}
	.font {
		font-size: 18px;
		line-height: 28px;
		color: #cfcfcf;
		font-style: normal;
	}
	.cur {
		width: 100%;
		background-color: #0077f1;
	}
	
	/* 2.右侧 */
	.right {
		width: 70%;
		height: 500px;
		position: absolute;
		top: 100px;
		left: 25%;
		text-align: center;
		border: 2px solid #079fff;
		border-radius: 10px;
		box-shadow: 0px 0px 20px 4px #079fff;
		overflow: hidden;
	}
	/* 2.2 右侧内容 */
	/* 公用标题样式 */
	.u_title {
		text-align: center;
		font-size: 22px;
		color: #fff;
		font-weight: bold;
		margin-top: 40px;
		/* margin-left: 800px; */
	}
	/* 2.2.1 无线网络 */
	/* 标题+图标 */
	.title_ctrl {
		margin-top: 40px;
		margin-left: 45%;
		height: 50px;
	}
	.title {
		font-size: 22px;
		color: #fff;
		font-weight: bold;
		float: left;
	}
	.ctrl {
		float: right;
		margin-right: 80px;
	}
	.ctrl image {
		width: 30px;
		height: 30px;
		margin-left: 20px;
	}
	.nowifi image {
		width: 100px;
		height: 90px;
		opacity: 0.57;
		margin-top: -20px;
		margin-left: -30px;
	}
	.closeWifi {
		width: 423px;
		height: 403px;
		border-radius: 8px;
		padding-top: 85px;
		margin: 0px auto;
	}
	.closeWifi .head {
		width: 21px;
		height: 25px;
		transform: translateY(4px);
		padding-right: 5px;
	}
	.closeWifi .tet {
		opacity: 0.53;
		margin-bottom: 50px;
		margin-left: 80px;
		padding-top: 50px;
	}
	.closeWifi .btn {
		width: 212px;
		height: 51px;
		border: 1.33px solid #ffffff;
		border-radius: 25px;
		font-size: 10.5px;
		background-color: #254a9e;
		line-height: 51px;
		opacity: 0.7;
		margin-left: 90px;
	}
	.closeWifi text {
		width: 260px;
		height: 20px;
		display: block;
		opacity: 0.53;
		font-size: 20px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		text-align: center;
		color: #ffffff;
	}
	.closeWifi .btn image {
		width: 25px;
		height: 25px;
		margin-top: 8px;
		margin-left: 26px;
		float: left;
	}
	.closeWifi .btn span {
		font-size: 21px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		color: #ffffff;
		margin-left: -12px;
		float: left;
	}
	/* wifi列表主体 */
	.right .wifi_content {
		width: 100%;
		height: 520px;
		margin-top: 40px;
	}
	/* wifi列表 */
	.wifi_list {
		width: 90%;
		height: 48px;
		background-color: #345aa9;
		border-radius: 24px;
		float: left;
		margin-top: 20px;
		margin-left: 66px;
		margin-bottom: 18px;
		position: relative;
	}
	.w_text {
		padding-top: 12px;
	}
	.wifi span {
		float: left;
		padding-left: 33px;
		padding-top: 3px;
	}
	.wifi .image1 {
		float: left;
		width: 26px;
		height: 19px;
		padding-top: 2px;
	}
	.wifi .image2 {
		float: left;
		width: 35px;
		height: 35px;
		float: right;
		margin-right: 20px;
		margin-top: -5px;
	}
	
	/* 输入密码 */
	.keyboard {
		width: 95%;
		height: 90%;
		margin: 5% auto;
	}
	.key_top {
		width: 100%;
		height: 56px;
	}
	.keyboard .name {
		font-size: 25px;
		margin-right: 20px;
		width: 40%;
	}
	.name image {
		width: 40px;
		height: 40px;
		float: left;
	}
	.name .wifiname {
		float: left;
		height: 40px;
		width: 70%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		margin-top: 3px;
	}
	.search {
		width: 60%;
		height: 60px;
		overflow: hidden;
		float: left;
		margin-bottom: 100px;
		margin-top: -5px;
		margin-left: 5px;
	}
	.search input {
		width: 50%;
		height: 56px;
		border-top-left-radius: 50px;
		border-bottom-left-radius: 50px;
		float: left;
		color: #6b6b6b; 
		background: #fff;
		background-size: 22px;
		line-height: 50px;
		outline: none;
	}
	.search .search-btn {
		width: 20%;
		height: 57px;
		background-color: #e03e5b;
		font-size: 18px;
		text-align: center;
		float: left;
		border-top-right-radius: 50px;
		border-bottom-right-radius: 50px;
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
		color: #fff;
		letter-spacing: 3px;
		padding-top: 5px;
	}
	.search .back image {
		width: 150px;
		height: auto;
		position: absolute;
		top: 2px;
		right: -5px;
	}
	.letter {
		width: 100%;
		margin-top: 35px;
	}
	.small,
	.big,
	.num,
	.sign {
		width: 70px;
		height: 50px;
		font-size: 25px;
		color: #000;
		background-color: #fff;
		float: left;
		margin: -40px 10px 50px 5px;
		padding-top: 20px;
		border-radius: 12px;
	}
	/* 2.2.2 音色设置 */
	.r_tim .onef ul {
		display: flex;
		float: left;
		margin-left: 35px;
		margin-top: 50px;
	}
	.r_tim ul li {
		padding: 0 30px;
	}
	.r_tim .twof ul {
		margin-left: 35px;
		display: flex;
		float: left;
		margin-top: 40px;
	}
	.icons_bg {
		width: 100px;
		height: 100px;
		border-radius: 18px;
		background-color: #1945a4;
		border: 3px solid #4b93ff;
	}
	.icons_bgs {
		background-color: #0181ed;
	}
	.r_tim .icons_bg image {
		width: 40px;
		height: 40px;
		margin-top: 35px;
	}
	.timbre_text1 {
		font-size: 16px;
		color: #fbfcfa;
	}
	.timbre_text2 {
		font-size: 8px;
		color: #f2f3f1;
	}
	.icons_text {
		font-size: 80px;
	}
	/* 2.2.3 背光亮度*/
	.beiguang {
		width: 80%;
		margin: 20% auto;
	}
	 
	/* 2.2.5 本机信息 */
	.u_title .locinfo{
		font-size: 22px;
		color: #fff;
		font-weight: bold;
		float: left;
		text-align: center;
		margin-left: 43%; 
		margin-top: -60px;
	}
	.info_text {
		text-align: left;
		margin: 80px 0px 0px 94px;
		font-size: 15px;
		color: #cfcfcf;
	}
	.info_text ul li {
		width: 80%;
		height: 30px;
		float: left;
		margin-top: 15px;
		padding-left: 80px;
		padding-top: 10px;
		margin-right: 50px;
	}
	.cur_info {
		width: 700px;
		height: 48px;
		background-color: #345aa9;
		border-radius: 24px;
	}
	/* 2.2.6 关于我们 */
	.u_text {
		width: 90%;
		height: 200px;
		font-size: 16px;
		padding-top: 30px;
		margin-left: 40px;
		text-align: left;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.r_user image {
		width: 80px;
		height: 80px;
		margin-top: 40px;
	}
	.r_user #span {
		font-size: 16px;
	}
	.u_footer {
		font-size: 16px;
		color: #fff;
		margin-top: 200px;
	}
	/* 返回按钮 */
	.goback {
		position: absolute;
		top: 20px;
		right: 45px;
	}
	.goback image {
		width: 130px;
		height: 52px;
	}
	.forceupdata{
		/* transform: translateY(3px); */
		position: absolute;
		left: 300px;
		top: 345px;
	}
	.image5{
		width: 30px;
		height: 25px;
	}
	.mask{
		width:100%;
		height:100%;
		position: fixed;
		left:0;
		top:0;
		background: rgba(0,0,0,0.5);
	}
	.mask .main{
		width: 35%;
		height: 37%;
		border: 3px solid #0893ed;
		border-radius: 10px;
		background-color: #3b6cc0;
		position: absolute;
		left: 30%;
		top: 28%;
	}
	.mask .header{
		width: 100%;
		height: 25%;
		border-bottom: 3px solid #b2c2df;
	}
	.mask .header image{
		width: 16%;
		height: 100%;
		float: left;
		margin-left: 2%;
	}
	.mask .header text{
		height: 100%;
		font-size: 27px;
		float: left;
		transform: translateY(15px);
	}
	.mask .header .rightimg{
		width: 10%;
		height: 70%;
		float: right;
		margin-right: 2%;
		margin-top: 2.2%;
	}
	.mask .title{
		width: 100%;
		text-align: center;
		font-size: 25px;
		margin-top: 8%;
		margin-bottom: 8%;
	}
	.mask .footer{
		width: 100%;
		height: 20%;
	}
	.mask .footer button{
		width: 35%;
		height: 100%;
		border-radius: 30px;
		display: inline-block;
		margin-right: 6%;
		font-size: 20px;
	}
	.mask .footer button:first-child{
		margin-left: 8%;
	}
	.mask .footer button:nth-child(2){
		border: 2px solid #ffffff;
		background-color: #0077f1;
		color: #ffffff;
	}
}
@media screen and (max-width: 1005px){
	* {
		padding: 0;
		margin: 0;
	}
	.set {
		width: calc(100% - 100px);
		height: 100%;
		background-color: #0a1050;
		position: relative;
		padding:100px 50px;
	}
	/* 1.左侧 */
	/* 1.1 左侧边框 */
	.left {
		width: 18%;
		height: 420px;
		background-color: #072f7f;
		border-radius: 15px;
	}
	/* 1.2 左侧标题 */
	.tabbar {
		width: 80%;
		position: relative;
		padding: 25px 20px 25px 25px;
	}
	.left image {
		float: left;
		width: 30px;
		height: 30px;
		margin-top: 0px;
		padding-right: 10px;
	}
	.font {
		font-size: 16px;
		line-height: 30px;
		color: #cfcfcf;
		font-style: normal;
	}
	.cur {
		width: 100%;
		background-color: #0077f1;
	}
	
	/* 2.右侧 */
	.right {
		width: 70%;
		height: 420px;
		position: absolute;
		top: 100px;
		left: 25%;
		text-align: center;
		border: 2px solid #079fff;
		border-radius: 10px;
		box-shadow: 0px 0px 20px 4px #079fff;
		overflow: hidden;
	}
	/* 2.2 右侧内容 */
	/* 公用标题样式 */
	.u_title {
		text-align: center;
		font-size: 22px;
		color: #fff;
		font-weight: bold;
		margin-top: 40px;
		/* margin-left: 800px; */
	}
	/* 2.2.1 无线网络 */
	/* 标题+图标 */
	.title_ctrl {
		margin-top: 40px;
		margin-left: 43%;
		height: 50px;
	}
	.title {
		font-size: 22px;
		color: #fff;
		font-weight: bold;
		float: left;
	}
	.ctrl {
		float: right;
		margin-right: 80px;
	}
	.ctrl image {
		width: 30px;
		height: 30px;
		margin-left: 20px;
	}
	.nowifi image {
		width: 100px;
		height: 90px;
		margin-top: -30px;
		margin-left: -30px;
	}
	.closeWifi {
		width: 423px;
		height: 403px;
		border-radius: 8px;
		padding-top: 85px;
		margin: 0px auto;
	}
	.closeWifi .head {
		width: 21px;
		height: 25px;
		transform: translateY(4px);
		padding-right: 5px;
	}
	.closeWifi .tet {
		opacity: 0.53;
		margin-bottom: 50px;
		margin-left: 80px;
		padding-top: 50px;
	}
	.closeWifi .btn {
		width: 212px;
		height: 51px;
		border: 1.33px solid #ffffff;
		border-radius: 25px;
		font-size: 10.5px;
		background-color: #254a9e;
		line-height: 51px;
		opacity: 0.7;
		margin-left: 90px;
	}
	.closeWifi text {
		width: 260px;
		height: 20px;
		display: block;
		opacity: 0.53;
		font-size: 20px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		text-align: center;
		color: #ffffff;
	}
	.closeWifi .btn image {
		width: 25px;
		height: 25px;
		margin-top: 8px;
		margin-left: 26px;
		float: left;
	}
	.closeWifi .btn span {
		font-size: 21px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		color: #ffffff;
		margin-left: -12px;
		float: left;
	}
	/* wifi列表主体 */
	.right .wifi_content {
		width: 100%;
		height: 520px;
		margin-top: 40px;
	}
	/* wifi列表 */
	.wifi_list {
		width: 90%;
		height: 48px;
		background-color: #345aa9;
		border-radius: 24px;
		float: left;
		margin-top: 20px;
		margin-left: 66px;
		margin-bottom: 18px;
		position: relative;
	}
	.w_text {
		padding-top: 12px;
	}
	.wifi span {
		float: left;
		padding-left: 33px;
		padding-top: 3px;
	}
	.wifi .image1 {
		float: left;
		width: 26px;
		height: 19px;
		padding-top: 2px;
	}
	.wifi .image2 {
		float: left;
		width: 35px;
		height: 35px;
		float: right;
		margin-right: 20px;
		margin-top: -5px;
	}
	
	/* 输入密码 */
	.keyboard {
		width: 95%;
		height: 90%;
		margin: 5% auto;
	}
	.key_top {
		width: 100%;
		height: 56px;
	}
	.keyboard .name {
		font-size: 25px;
		margin-right: 20px;
		width: 40%;
	}
	.name image {
		width: 40px;
		height: 40px;
		float: left;
	}
	.name .wifiname {
		float: left;
		height: 40px;
		width: 70%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		margin-top: 3px;
	}
	.search {
		width: 60%;
		height: 60px;
		overflow: hidden;
		float: left;
		margin-bottom: 100px;
		margin-top: -5px;
	}
	.search input {
		width: 50%;
		height: 56px;
		border-top-left-radius: 50px;
		border-bottom-left-radius: 50px;
		float: left;
		color: #6b6b6b; 
		background: #fff;
		background-size: 22px;
		line-height: 50px;
		outline: none;
	}
	.search .search-btn {
		width: 20%;
		height: 57px;
		background-color: #e03e5b;
		font-size: 18px;
		text-align: center;
		float: left;
		border-top-right-radius: 50px;
		border-bottom-right-radius: 50px;
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
		color: #fff;
		letter-spacing: 3px;
		padding-top: 5px;
	}
	.search .back image {
		width: 150px;
		height: auto;
		position: absolute;
		top: 40px;
		right: 10px;
	}
	.letter {
		width: 100%;
		margin-top: 35px;
	}
	.small,
	.big,
	.num,
	.sign {
		width: 70px;
		height: 50px;
		font-size: 25px;
		color: #000;
		background-color: #fff;
		float: left;
		margin: -40px 10px 50px 5px;
		padding-top: 20px;
		border-radius: 12px;
	}
	/* 2.2.2 音色设置 */
	.r_tim .onef ul {
		display: flex;
		float: left;
		margin-left: 10px;
		margin-top: 50px;
	}
	.r_tim ul li {
		padding: 0 30px;
	}
	.r_tim .twof ul {
		margin-left: 10px;
		display: flex;
		float: left;
		margin-top: 40px;
	}
	.icons_bg {
		width: 70px;
		height: 70px;
		border-radius: 18px;
		background-color: #1945a4;
		border: 3px solid #4b93ff;
	}
	.icons_bgs {
		background-color: #0181ed;
	}
	.r_tim .icons_bg image {
		width:30px;
		height: 30px;
		margin-top: 20px;
	}
	.timbre_text1 {
		font-size: 16px;
		color: #fbfcfa;
	}
	.timbre_text2 {
		font-size: 8px;
		color: #f2f3f1;
	}
	.icons_text {
		font-size: 80px;
	}
	/* 2.2.3 背光亮度*/
	.beiguang {
		width: 80%;
		margin: 20% auto;
	}
	 
	/* 2.2.5 本机信息 */
	.u_title .locinfo{
		font-size: 22px;
		color: #fff;
		font-weight: bold;
		float: left;
		text-align: center;
		margin-left: 43%; 
		margin-top: -60px;
	}
	.info_text {
		text-align: left;
		margin: 80px 0px 0px 94px;
		font-size: 15px;
		color: #cfcfcf;
	}
	.info_text ul li {
		width: 80%;
		height: 30px;
		float: left;
		margin-top: 5px;
		padding-left: 80px;
		padding-top: 10px;
		margin-right: 50px;
	}
	.cur_info {
		width: 700px;
		height: 48px;
		background-color: #345aa9;
		border-radius: 24px;
	}
	/* 2.2.6 关于我们 */
	.u_text {
		width: 90%;
		height: 200px;
		font-size: 14px;
		padding-top: 30px;
		margin-left: 40px;
		text-align: left;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.r_user image {
		width: 80px;
		height: 80px;
	}
	.r_user #span {
		font-size: 16px;
	}
	.u_footer {
		font-size: 16px;
		color: #fff;
		margin-top: 200px;
	}
	/* 返回按钮 */
	.goback {
		position: absolute;
		top: 20px;
		right: 45px;
	}
	.goback image {
		width: 130px;
		height: 52px;
	}
	.forceupdata{
		/* transform: translateY(3px); */
		position: absolute;
		left: 300px;
		top: 270px;
	}
	.image5{
		width: 30px;
		height: 25px;
	}
	.mask{
		width:100%;
		height:100%;
		position: fixed;
		left:0;
		top:0;
		background: rgba(0,0,0,0.5);
	}
	.mask .main{
		width: 18%;
		height: 37%;
		border: 3px solid #0893ed;
		border-radius: 10px;
		background-color: #3b6cc0;
		position: absolute;
		left: 40%;
		top: 28%;
	}
	.mask .header{
		width: 100%;
		height: 25%;
		border-bottom: 3px solid #b2c2df;
	}
	.mask .header image{
		width: 16%;
		height: 100%;
		float: left;
		margin-left: 2%;
	}
	.mask .header text{
		height: 100%;
		font-size: 27px;
		float: left;
		transform: translateY(15px);
	}
	.mask .header .rightimg{
		width: 10%;
		height: 70%;
		float: right;
		margin-right: 2%;
		margin-top: 2.2%;
	}
	.mask .title{
		width: 100%;
		text-align: center;
		font-size: 25px;
		margin-top: 8%;
		margin-bottom: 8%;
	}
	.mask .footer{
		width: 100%;
		height: 20%;
	}
	.mask .footer button{
		width: 35%;
		height: 100%;
		border-radius: 30px;
		display: inline-block;
		margin-right: 6%;
		font-size: 20px;
	}
	.mask .footer button:first-child{
		margin-left: 8%;
	}
	.mask .footer button:nth-child(2){
		border: 2px solid #ffffff;
		background-color: #0077f1;
		color: #ffffff;
	}
}

</style>