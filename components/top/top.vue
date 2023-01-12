<template>
	<view class="top">
		<!-- 时间 -->
		<view class="time">{{hour}}:{{min}}:{{sec}}</view>
		<!-- 网络连接 -->
		<!-- <image v-if="networkType == 'wifi'" src="@/static/wifi-icon.png"></image> -->
		<image src="../../static/wifi/signal_1.png" v-if="networkType == 'wifi' && level==0" style="height: 17px;transform: translateY(-3px);"></image>
		<image src="../../static/wifi/signal_2.png" v-if="networkType == 'wifi' && level==1" style="height: 17px;transform: translateY(-3px);"></image>
		<image src="../../static/wifi/signal_3.png" v-if="networkType == 'wifi' && level==2" style="height: 17px;transform: translateY(-3px);"></image>
		<image src="../../static/wifi/signal_4.png" v-if="networkType == 'wifi' && level==3" style="height: 17px;transform: translateY(-3px);"></image>
		<image v-else-if="networkType == 'none'" src="@/static/network-error.png"></image>
		<image v-else src="@/static/network-icon.png"></image>
		<!-- MIDI设备 -->
		<image v-show="!midiDevice" src="@/static/midi-no.png"></image>
		<image v-show="midiDevice" src="@/static/midi-yes.png"></image>
		<!-- 心跳 -->
		<image v-show="!socket" src="@/static/heartbeat-no.png"></image>
		<image v-show="socket" src="@/static/heartbeat-yes.png"></image>
		<!-- 音色 -->
		<view class="timbre">{{ $store.state.timbre }}</view>
	</view>
</template>
<script>
	export default {
		name:'top',
		data() {
			return {
				networkType:'none',
				level:3,
				midiDevice:false,
				socket:false,
				hour:'00',
				min:'00',
				sec:'00',
			}
		},
		mounted(){
			this.gettime()
		},
		computed: {
			//监听网络
		    network() {
				this.networkType = this.$store.state.networkType
		        return this.$store.state.networkType
		    },
			 //监听WIFI信号
			  looklevel() {
			 	this.level = this.$store.state.level
			      return this.$store.state.level
			  },
			//监听socket
			websocket() {
				this.socket = this.$store.state.socket
			    return this.$store.state.socket
			},
			//监听midi设备
			midi() {
				this.midiDevice = this.$store.state.midiDevice
			    return this.$store.state.midiDevice
			},
			// 监听音色
			ontimbre() {
				this.timbre = this.$store.state.timbre
				return this.$store.state.timbre
			},
		},
		watch: {
		    network: function(newVal, oldVal) {
				this.networkType = newVal
		    },
			 looklevel:function(newVal, oldVal){
				 this.level=newVal
			 },
			websocket: function(newVal, oldVal) {
				this.socket = newVal
		    },
			midi: function(newVal, oldVal) {
				this.midiDevice = newVal
			},
		},
		methods: {
			gettime(){
				setInterval(()=>{
					var d = new Date();
					this.hour = (d.getHours() < 10) ? ('0'+d.getHours()) : d.getHours()
					this.min = (d.getMinutes() < 10) ? ('0'+d.getMinutes()) : d.getMinutes()
					this.sec = (d.getSeconds() < 10) ? ('0'+d.getSeconds()) : d.getSeconds()
				},1000) 
			}, 
		}
	}
</script>

<style>
	/* 顶部图标显示 */
	.top {
		float: left;
		position: absolute;
		top: 15px;
		left: 35px;
	}
	.top image {
		width: 16px;
		height: 11px;
		float: left;
		margin-left: 4px;
	}
	.top .time {
	    width: 50px;
	    height: 10px;
		opacity: 0.76;
		font-size: 12px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		text-align: left;
		color: #fff;
		float: left;
		margin-top: -5px;
	}
	.timbre {
		/* width: 200px; */
		height: 10px;
		opacity: 0.76;
		font-size: 12px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		text-align: left;
		color: #fff;
		float: left;
		margin-left: 5px;
		margin-top: -5px;
	}
</style>