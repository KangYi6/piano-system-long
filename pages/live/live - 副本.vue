<template>
	<view class="live">
		<!-- 直播前检查 -->
		<view class="liveIn" v-show="liveIn_show">
			<view class="info">
				<image src="../../static/icons/live_gou.png" mode=""></image>
				<span>为了保证上课流畅，建议使用WIFI网络进行上课；</span>
			</view>
			<view class="info">
				<image src="../../static/icons/live_gou.png" mode=""></image>
				<span>请提前确认钢琴MIDI已连接；</span>
			</view>
			<view class="info">
				<image src="../../static/icons/live_gou.png" mode=""></image>
				<span>如中途出现掉线、黑屏、卡住等情况，可以尝试退出课堂重新进入。</span>
			</view>	
			<view class="btn_in" @click="liveIn">进入课堂</view>
		</view>
		<!-- 直播详情 -->
		<view class="details">
			<view class="left">
				<view class="play_icon">
					<image src="../../static/icons/details_play.png" mode=""></image>
				</view>
				<view class="left_text">
					成人零基础钢琴入门课程
				</view>
			</view>
			<view class="right">
				<view class="class">
					<image src="../../static/details_class.png" mode=""></image>
				</view>
				<!-- 直播画面 -->
				<view class="live"></view>
				<!-- 直播信息 -->
				<view class="live_icon"><image src="../../static/live_icon.png" mode=""></image></view>
				<view class="live_text">NO SINGAL</view>
				<view class="live_time">上课时间: </view>
				<!-- 聊天 -->
			</view>
		</view>
		<div class="goback" @click="gocourses"><image src="@/static/goback.png" mode="widthFix"></image></div>
	</view>
</template>

<script type="module">
	export default{
		data(){
			return{
				liveIn_show: true,
				s_id: '',
				// 声网直播引擎
				engine: undefined,
				// 直播Appid,token,channel,chattoken,uid等参数
				options: {},
				// 聊天客户端实例对象
				chatClient: null,
				// 聊天频道对象
				chatChannel: null,
				// 直播状态，true表示开，false表示关
				liveVideo: false,
				// 视频窗口状态，full表示全屏，small表示小窗口
				videoScreen: 'full',
				// 聊天状态，true表示开，false表示关
				chat: false,
			}
		},
		onLoad(option) {
			this.s_id = option.id
			this.getdata();
		},
		onBackPress() {
			this.engine && this.engine.destroy();
		},
		methods: {
			// 获取直播数据
			getdata(){
				this.$request({
					url: this.$baseUrl + '/piano/live/checkAuth.html',
					method: 'POST',
					data: {
						s_id: this.s_id,
					}
				}).then(res => {
					this.options = res.data.data
					console.log(this.options)
			    })
			},
			//进入直播页
			liveIn(){
				this.liveIn_show = false
				//初始化声网直播服务
			},

			// 返回到课程页
			gocourses() {
				uni.navigateBack({
					url: '/pages/courses/courses' 
				});
			},
		}
	}
</script>

<style scoped>
@media screen and (min-width:2560px){
    .live{
    	width: 2560px;
    	height: 720px;
    	overflow: hidden;
    	background: url('@/static/appbg.jpg') no-repeat;
    	position: relative;
    }
    .liveIn{
    	margin: 219px auto 310px;
    	width: 1020px;
    	height: 191px;
    }
    .liveIn .info{
    	line-height: 20px;
    	text-align: left;
    	margin-bottom: 30px;
    }
    .liveIn .info image{
    	width: 36px;
    	height: 36px;
    	margin-right: 10px;
    	top: 8px;
    }
    .liveIn .info span{
    	font-size: 32px;
    	font-weight: normal;
    	font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
    }
    .liveIn .btn_in{
    	width: 150px;
    	height: 33px;
    	padding: 10px 67px 30px 77px;
    	font-size: 36px;
    	border: 2px solid #fff;
    	border-radius: 40px;
    	margin: 100px auto;
    }
	.left{
		width: 1231px;
		height: 554px; 
		float: left;
		margin-top: 57px;
		margin-left: 226px;
		background-color: #fff;
		text-align: center;
		border-radius: 10px;
	}
	.left .play_icon image{
		width: 125px;
		height: 125px;
		margin-top: 188px;
	}
	.left .left_text{
		/* width: 329px; */
		height: 29px;
		font-size: 30px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		text-align: left;
		color: #333333;
		line-height: 31px;
		text-align: center;
	}
	.right{
		width: 855px;
		height: 560px;
		background-color: #fff;
		border-radius: 10px;
		float: left;
		margin-top: 57px;
		margin-left: 10px;
		position: relative;
	}
	.right .class image{
		width: 18px;
		height: 560px;
		float: left;
	}
	.right .live{
		width: 800px;
		height: 364px;
		background-color: #000000 !important; 
		margin-top: 20px;
		margin-left: 35px;
		border-radius: 12px;
	}
	.live_icon image{
		width: 38px;
		height: 42px;
		position: absolute;
		top: 190px;
		left: 340px;
		opacity: 0.38;
	}
	.live_text{
		/* width: 135px; */
		height: 19px;
		opacity: 0.39;
		font-size: 24px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		text-align: left;
		position: absolute;
		top: 195px;
		left: 400px;
	}
	.live_time{
		width: 190px;
		height: 19px;
		font-size: 20px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		text-align: left;
		color: #DF122A;
		position: absolute;
		top: 350px;
		right: 130px;
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
}
@media screen and (max-width:1921px){
	.live{
		width: 1920px;
		height: 1080px;
		overflow: hidden;
		background: url('@/static/appbg_ipad.png') no-repeat;
		position: relative;
	}
	.liveIn{
		margin: 350px auto 310px;
		width: 1020px;
		height: 191px;
	}
	.liveIn .info{
		line-height: 20px;
		text-align: left;
		margin-bottom: 30px;
	}
	.liveIn .info image{
		width: 36px;
		height: 36px;
		margin-right: 10px;
		top: 8px;
	}
	.liveIn .info span{
		font-size: 32px;
		font-weight: normal;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
	}
	.liveIn .btn_in{
		width: 150px;
		height: 33px;
		padding: 10px 67px 30px 77px;
		font-size: 36px;
		border: 2px solid #fff;
		border-radius: 40px;
		margin: 100px auto;
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
}
</style>