<template>
	<view class="details">
		<top></top>
		<!-- 左 -->
		<view class="left">
			<!-- 轮播 -->
			<view class="banner">
				<swiper
					class="swiper"
					:autoplay="true"
					:interval="3000"
					:duration="500"
					circular="true"
					indicator-dots="true"
					indicator-color="#fff"
					indicator-active-color="#ff0000"
				>
					<swiper-item v-for="(item, index) in info.p_images" :key="index"><image :src="item"></image></swiper-item>
				</swiper>
			</view>
			<!-- 课程详情 -->
			<view class="bottom" v-if="globalData.width < 2560">
			    <view class="title">{{ info.p_title }}</view>
				<view class="desc">{{ info.p_desc }}</view>
				<view class="price">￥{{ info.p_price }}</view>
				<view class="card" v-if="buy == 0">
					<image :src="info.qrcode"></image>
					<view>扫码购买</view>
				</view>
			</view>
		</view>

		<!-- 右 -->
		<view class="right">
			<view class="class"></view>
			<!-- 产品介绍 -->
			<view class="introduce" v-if="info.p_type == 3">
				<view class="title">{{ info.p_title }}</view>
				<view class="price">¥{{ info.p_price }}</view>
				<view class="text">{{ info.p_body_text}}</view>
			</view>
			<!-- 课程目录  -->
			<view class="list" v-else>
				<!-- 直播目录 样式需要重新写 -->
				<scroll-view class="scroll" scroll-y="true" v-if="info.p_type == 1">
					<view class="row" v-for="(item, index) in info.course" :key="index" @click="goCus(index,item)">
						<span class="img">
							<image src="@/static/icons/details_icon3.png"></image>
						</span>
						<span :class="index == current ? 'name nameColor' : 'name'">{{ item.s_desc }}</span>
						<span class="free"><image src="@/static/icons/details_icon4.png"></image></span>
						<view class="line"></view> 
					</view>
				</scroll-view>
				<!-- 闯关、课程 -->
				<scroll-view class="scroll" scroll-y="true" v-else>
					<view class="row" v-for="(item, index) in info.period" :key="index" @click="goCus(index,item)">
						<!-- 闯关 -->
						<span class="img" v-if="info.p_type == 2">
							<image src="@/static/details_lock.png" v-if="item.open == 0"></image>
							<image src="@/static/details_open.png" v-else="item.open == 1"></image>
						</span>
						<!-- 课程 -->
						<span class="img" v-else>
							<image src="@/static/period-icon.png"></image>
						</span>
						<!-- 课时名称 -->
						<span :class="index == current ? 'name nameColor' : 'name'">{{ item.c_name }}</span>
						<span class="free" v-show="item.c_free == 0"><image src="@/static/icons/details_icon4.png"></image></span>
						<view class="line"></view> 
					</view>
				</scroll-view>
			</view>
			
		</view>
		<!-- 最右侧选项按钮 -->
		<div class="goback" @click="goback()"><image src="@/static/goback.png" mode="widthFix"></image></div>
		<!-- 3.使用组件-支付弹窗 -->
		<pay v-show="payShow" :qrcode="info.qrcode" :price="info.p_price" @pay="pays"></pay>
	</view>
</template>

<script>
// 1.引入组件
import pay from '@/components/pay/pay.vue';
import { param } from '@/lib/common.js';
export default {
	// 2.定义组件
	components:{
		pay
	},
	data() {
		return {
			globalData: getApp().globalData,
			//课程id
			id: '',
			//是否已购买
			buy:'',
			//当前课时索引
			current:0,
			//购买弹窗
			payShow: false,
			//课程数据
			info:{},
		}
	},
	onLoad(option) {
		if(option.id){
			this.id = option.id
			this.buy = option.buy
		}
	},
	onShow(){
		if (this.$store.state.excessive) {
			let path = this.$store.state.excessive
			this.$store.state.excessive = ''
			let that = this
			setTimeout(function(){
				uni.navigateTo({
					url:path
				})
			},500);
		}
		this.getContent()
	},
	methods: {
		//获取课程目录
		getContent() { 
			this.$request({
				url: '/piano/aicourse/detail.html',
				method: 'POST',
				data: {
					id: this.id
				}
			}).then(res => {
				this.info = res.data.data
				this.info.qrcode = res.data.data.qrcode.replace(/[\r\n]/g, "")
			})
		},
		//进入课件列表页面
		goCus(index,item){
			if (!getApp().globalData.login) {
				uni.navigateTo({
					url:"/pages/login/login",
				})
				return
			}
			this.current = index
			//直播
			if (this.info.p_type == 1) {
				//是否已购买
				if (this.buy == 0) {
					this.payShow = true
					return
				}
				this.$request({
					url: '/piano/live/checkAuth.html',
					data: {
						s_id: item.s_id ,
					},
					method: 'POST'
				}).then(res => {
					if (res.data.code === 1000) {
						uni.navigateTo({
							url:"../live/live?s_id=" + item.s_id,
						})
					} else {
						uni.showToast({
							title:res.data.msg,
							icon:'none'
						})
					}
				});
			} else {
				//判断是否已购买
				if (item.c_free == 1 && this.buy == 0) {
					this.payShow = true
					return
				}
				if (this.info.p_type == 2 && item.open == 0) {
					uni.showToast({
						title: '未解锁',
						icon: 'error'
					})
					return
				}
				//获取课件信息，并判断第一个课件类型，根据类型进入相应的页面
				this.$request({
					url: '/piano/aicourse/list.html',
					data: {
						c_id:item.c_id,
						p_id:item.p_id
					},
					method: 'POST' 
				}).then(res => {
					console.log(res.data)
					if (res.data.code === 1000) {
						if (res.data.data) {
							let e = res.data.data[0]
							//保存课件信息
							this.$store.state.course = {
								content:res.data.data,
								index:0,
								show:true,
								pid:item.p_id,
								cid:item.c_id,
								ptype:this.info.p_type,
								prevType:e.cw_type
							}
							switch (e.cw_type) {
								// 视频
								case 1:{
									uni.navigateTo({
										url: param('/pages/video/video',{
											thumb:e.cw_content.thumb,
											video:e.cw_content.video,
											ptype:this.info.p_type, //类型
											cid:item.c_id, //课时ID
											pid:item.p_id, //产品ID
											cwid:e.cw_id
										})
									})
									break;
								}
								//曲谱
								case 2:{
									this.$store.state.xmlInfo = {
										ptype:this.info.p_type,
										cid:item.c_id,
										pid:item.p_id,
										id:0,
										cwid:e.cw_id,
										path:e.cw_content.xml,
										title:e.cw_name,
									}
									//曲谱参数，为了兼容旧课程数据，没有参数时，使用默认参数
									let param = {}
									param.pass = e.cw_content.pass ? e.cw_content.pass : 80
									param.mode = e.cw_content.mode ? e.cw_content.mode : false
									param.hands = e.cw_content.hands ? e.cw_content.hands : 0
									param.metronome = e.cw_content.metronome ? e.cw_content.metronome : false
									param.tempo = e.cw_content.tempo ? e.cw_content.tempo : 100
									param.keytips = e.cw_content.keytips ? e.cw_content.keytips : 'auto'
									this.$store.state.xmlParam = param
									uni.navigateTo({
										url: '/pages/musicxml/musicxml',
									})
									break;
								}
								//瀑布流
								case 3:{
									this.$store.state.xmlInfo = {
										ptype:this.info.p_type,
										cid:item.c_id,
										pid:item.p_id,
										id:0,
										cwid:e.cw_id,
										path:e.cw_content.xml,
										title:e.cw_name,
									}
									//曲谱参数，为了兼容旧课程数据，没有参数时，使用默认参数
									let param = {}
									param.pass = e.cw_content.pass ? e.cw_content.pass : 80
									param.mode = e.cw_content.mode ? e.cw_content.mode : false
									param.hands = e.cw_content.hands ? e.cw_content.hands : 0
									param.metronome = e.cw_content.metronome ? e.cw_content.metronome : false
									param.tempo = e.cw_content.tempo ? e.cw_content.tempo : 100
									param.keytips = e.cw_content.keytips ? e.cw_content.keytips : 'auto'
									this.$store.state.xmlParam = param
									uni.navigateTo({
										url: '/pages/waterfall/waterfall',
									})
									break;
								}
								//涂色
								case 4:{
									uni.navigateTo({
										url: param('/pages/coloring/coloring',{
											cwid:e.cw_id,
											pid:item.p_id,
											cid:item.c_id,
											ptype:this.info.p_type,
										})
									})
									break;
								}
								//选择题
								case 5:{
									uni.navigateTo({
										url: param('/pages/exercises/exercises',{
											cwid:e.cw_id,
											pid:item.p_id,
											cid:item.c_id,
											ptype:this.info.p_type,
											content:e.cw_content,
											//参数
											title_text:e.cw_content.title_text,
											title_img:e.cw_content.title_img,
											title_audio:e.cw_content.title_audio,
											select_a_img:e.cw_content.select_a_img,
											select_a_text:e.cw_content.select_a_text,
											select_b_img:e.cw_content.select_b_img,
											select_b_text:e.cw_content.select_b_text,
											select_c_img:e.cw_content.select_c_img,
											select_c_text:e.cw_content.select_c_text,
											select_d_img:e.cw_content.select_d_img,
											select_d_text:e.cw_content.select_d_text,
											right_answer:e.cw_content.right_answer,
										})
									})
									break;
								}
							}
						} else {
							uni.showToast({
								title:"暂无内容！",
							})
						}
					} else {
						uni.showToast({
							title:res.data.msg,
						})
					}
				});
			}
		},
		//返回到上一页
		goback(){
			uni.navigateBack()
		},
		pays(e){
			this.payShow = false;
		},
	},
}; 
</script> 

<style scoped> 
@media screen and (min-width: 2560px) {
	.details {
		width: 2560px;
		height: 720px;
		overflow: hidden;
		background-color: #0a1050;
		position: relative;
	}
	.left {
		width: 1068px;
		height: 583px;
		background-color: #fff;
		margin-left: 225px;
		margin-top: 77px;
		position: relative;
		border-radius: 15px;
	}
	/* 轮播 */
	.banner {
		width: 100%;
		height: 100%;
		border-radius: 10px;
	}
	.swiper {
		display: block;
		height: 583px;
		line-height: 10px;
		text-align: center;
	}
	.swiper image {
		width: 1068px;
		height: 583px;
		border-radius: 10px;
	}
	.card {
		position: absolute;
		right: 20px;
		top: 420px;
	}
	.card image {
		width: 120px;
		height: 120px;
	}
	.card view {
		width: 80px;
		height: 19px;
		font-size: 20px;
		color: #333333;
		margin-left: 18px;
	}
	.right {
		width: 1014px;
		height: 583px;
		background-color: #fff;
		border-radius: 15px;
		position: absolute;
		right: 227px;
		top: 77px;
		float: left;
	}
	/* 产品介绍 */
	.right .class {
		width: 20px;
		height: 100%;
		float: left;
		margin-top: 5px;
		background-image: url('@/static/details_class.png');
		background-size: 17px 17px;
		background-repeat: repeat-y;
	}
	.introduce .title {
		width: 702px;
		height: 31px;
		font-size: 32px;
		font-family: Source Han Sans CN, Source Han Sans CN-Regular;
		font-weight: bold;
		color: #000000;
		position: absolute;
		left: 77px;
		top: 51px;
	}
	.introduce .price {
		width: 262px;
		height: 23px;
		font-size: 30px;
		font-family: PingFang SC, PingFang SC-Bold;
		font-weight: bold;
		color: #ff0000;
		position: absolute;
		left: 75px;
		top: 117px;
		text-align: left;
	}
	.introduce .price span {
		color: #747d96;
		font-size: 25px;
		margin-left: 20px;
		text-decoration: line-through;
	}
	.introduce .text {
		width: 816px;
		line-height: 40px;
		font-size: 22px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		color: #333333;
		position: absolute;
		left: 75px;
		top: 182px;
		text-align: left;
		/* 多行文本超出显示省略号 */
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 5;
		-webkit-box-orient: vertical;
	}
	/* 课程目录 */
	.list {
		width: 1014px;
		height: 85%;
		margin-top: 55px;
		margin-left: 50px;
	}
	.scroll{
		height: 100%;
	}
	.list .row {
		width: 90%;
		height: 40px;
		float: left;
		margin-bottom: 25px;
	}
	.list .img image {
		width: 20px;
		height: 20px;
		float: left;
		margin-left: 20px;
		margin-top: 5px;
	}
	.list .name {
		/* width: 600px; */
		font-size: 22px;
		color: #000;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		float: left;
		margin-left: 20px;
	}
	.nameColor {
		color: #0077f1 !important;
	}
	.list .free image {
		width: 30px;
		height: 30px;
		float: left;
		margin-left: 10px;
		margin-top: 2px;
	}
	
	.list .time {
		font-size: 18px;
		color: #333333;
		width: 49px;
		height: 14px;
		float: left;
		margin-left: 10px;
		margin-top: 8px;
	}
	.list .line {
		width: 872px;
		height: 2px;
		background-color: #333333;
		opacity: 0.2;
		float: left;
		margin-left: 10px;
		margin-top: 8px;
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
@media screen and (max-width: 1925px) and (min-width: 1656px) {
	.details {
		width: 100%;
		height: 100%;
		overflow: hidden; 
		background-color: #0a1050;
		position: relative;
	}
	.left {
		width: 900px;
		height: 500px;
		background-color: #fff;
		margin-left: 50px;
		margin-top: 150px;
		position: relative;
		border-top-left-radius: 15px;
		border-top-right-radius: 15px;
	}
	/* 轮播 */
	.banner {
		width: 100%;
		height: 100%;
	}
	.swiper {
		height: 100%;
		line-height: 10px;
		text-align: center;
		display: block;
	}
	.swiper image {
		width: 100%;
		height: 100%;
	}
	/* 课程详情 */
	.bottom {
		background-color: #fff;
		height: 300px;
		/* width: 100%; */
		position: relative;
		padding-left: 10px;
		overflow: hidden;
		border-bottom-left-radius: 15px;
		border-bottom-right-radius: 15px;
	}
	.bottom .title {
		color: #333;
		font-size: 26px;
		font-weight: bold;
		margin-top: 10px;
	}
	.bottom .desc {
		font-size: 20px;
		width: 650px;
		height: 185px;
		color: #333;
		margin-top: 10px;
		overflow: hidden;
		text-overflow: ellipsis;
		-webkit-line-clamp: 5;
		display: -webkit-box;
		-webkit-box-orient: vertical;
	}
	.bottom .price {
		font-size: 22px;
		font-weight: bold;
		color: #f00;
	}
	.card {
		position: absolute;
		right: 20px;
		bottom: 40px;
	}
	.card image {
		width: 180px;
		height: 180px;
	}
	.card view {
		width: 180px;
		height: 19px;
		font-size: 24px;
		color: #333333;
		text-align: center;
	}
	.right {
		width: 900px;
		height: 800px;
		background-color: #fff;
		position: absolute;
		right: 50px;
		top: 150px;
		float: left;
		border-radius: 15px;
	}
	/* 课程介绍 */
	.right .class {
		width: 20px;
		height: 100%;
		float: left;
		margin-top: 2px;
		background-image: url('@/static/details_class.png');
		background-size: 20px 20px;
		background-repeat: repeat-y;
	}
	.introduce .title {
		width: 702px;
		height: 31px;
		font-size: 28px;
		font-family: Source Han Sans CN, Source Han Sans CN-Regular;
		font-weight: bold;
		color: #000000;
		position: absolute;
		left: 50px;
		top: 40px;
	}
	.introduce .price {
		width: 262px;
		height: 23px;
		font-size: 30px;
		font-family: PingFang SC, PingFang SC-Bold;
		font-weight: bold;
		color: #ff0000;
		position: absolute;
		left: 50px;
		bottom: 50px;
		text-align: left;
	}
	.introduce .text {
		width: 650px;
		line-height: 40px;
		height: 464px;
		font-size: 22px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		color: #333333;
		position: absolute;
		left: 50px;
		top: 100px;
		text-align: left;
		/* 多行文本超出显示省略号 */
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	/* 课程目录 */
	.scroll{
		height: 740px;
	}
	.list {
		width: 90%;
		height: 93%;
		margin-top: 30px;
		margin-left: 30px;
	}
	.list .row {
		width: 100%;
		height: 60px;
		margin-bottom: 10px;
		float: left;
	}
	.list .free image {
		width: 28px;
		height: 28px;
		float: left;
		margin-left: 10px;
		margin-top: 10px;
	}
	.list .img image {
		width: 23px;
		height: 23px;
		float: left;
		margin-left: 20px;
		margin-top: 12px;
	}
	.list .name {
		font-size: 22px;
		color: #333;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		float: left;
		margin-left: 10px;
		margin-top: 8px;
	}
	.list .time {
		font-size: 15px;
		color: #333333;
		width: 49px;
		height: 14px;
		float: left;
		margin-left: 10px;
		margin-top: 8px;
	}
	.list .line {
		width: 872px;
		height: 1px;
		background-color: #333333;
		opacity: 0.2;
		float: left;
		margin-top: 8px;
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
@media screen and (max-width: 1655px) and (min-width: 1286px) {
	.details {
		width: 100%;
		height: 100%;
		overflow: hidden;
		background-color: #0a1050;
		position: relative;
	}
	.left {
		width: 800px;
		height: 450px;
		background-color: #fff;
		margin-left: 20px;
		margin-top: 120px;
		position: relative;
		border-top-left-radius: 15px;
		border-top-right-radius: 15px;
	}
	/* 轮播 */
	.banner {
		width: 100%;
		height: 100%;
	}
	.swiper {
		display: block;
		height: 100%;
		line-height: 10px;
		text-align: center;
	}
	.swiper image {
		width: 100%;
		height: 100%;
	}
	/* 视频播放 */
	.play {
		width: 100%;
		height: 98%;
		float: left;
		margin-top: 10px;
		margin-left: 8px;
		text-align: center;
	}
	.videostart{
		width: 100%;
		height: 103%;
		margin-left: -15px;
		margin-top: -10px;
		border-radius: 15px;
		overflow: auto;
	}
	/* 课程详情 */
	.bottom {
		background-color: #fff;
		height: 250px;
		position: relative;
		padding-left: 10px;
		overflow: hidden;
		border-bottom-left-radius: 15px;
		border-bottom-right-radius: 15px;
	}
	.bottom .title {
		color: #333;
		font-size: 26px;
		font-weight: bold;
		margin-top: 10px;
	}
	.bottom .desc {
		font-size: 20px;
		width: 650px;
		height: 145px;
		color: #333;
		margin-top: 10px;
		overflow: hidden;
		text-overflow: ellipsis;
		-webkit-line-clamp: 4;
		display: -webkit-box;
		-webkit-box-orient: vertical;
	}
	.bottom .price {
		font-size: 22px;
		font-weight: bold;
		color: #f00;
	}
	.card {
		position: absolute;
		right: -10px;
		bottom: 40px;
	}
	.card image {
		width: 140px;
		height: 140px;
	}
	.card view {
		width: 180px;
		height: 19px;
		font-size: 20px;
		color: #333333;
		text-align: center;
		margin-left: -20px;
	}
	.right {
		width: 800px;
		height: 700px;
		background-color: #fff;
		position: absolute;
		right: 20px;
		top: 120px;
		float: left;
		border-radius: 15px;
	}
	/* 课程介绍 */
	.right .class {
		width: 20px;
		height: 100%;
		float: left;
		margin-top: 2px;
		background-image: url('@/static/details_class.png');
		background-size: 20px 20px;
		background-repeat: repeat-y;
	}
	.introduce .title {
		width: 702px;
		height: 31px;
		font-size: 24px;
		font-family: Source Han Sans CN, Source Han Sans CN-Regular;
		font-weight: bold;
		color: #000000;
		position: absolute;
		left: 50px;
		top: 40px;
	}
	.introduce .price {
		width: 262px;
		height: 23px;
		font-size: 24px;
		font-family: PingFang SC, PingFang SC-Bold;
		font-weight: bold;
		color: #ff0000;
		position: absolute;
		left: 50px;
		bottom: 50px;
		text-align: left;
	}
	.introduce .text {
		width: 480px;
		line-height: 40px;
		height: 464px;
		font-size: 18px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		color: #333333;
		position: absolute;
		left: 50px;
		top: 100px;
		text-align: left;
		/* 多行文本超出显示省略号 */
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.introduce .card {
		position: absolute;
		right: 30px;
		bottom: 30px;
	}
	.introduce .card image {
		width: 100px;
		height: 100px;
	}
	.introduce .card view {
		width: 80px;
		height: 19px;
		font-size: 16px;
		color: #333333;
		margin-left: 20px;
	}
	/* 课程目录 */
	.scroll{
		height: 640px;
	}
	.list {
		width: 90%;
		height: 93%;
		margin-top: 30px;
		margin-left: 30px;
	}
	.list .row {
		width: 100%;
		height: 60px;
		margin-bottom: 10px;
		float: left;
	}
	.list .free image {
		width: 25px;
		height: 25px;
		float: left;
		margin-left: 10px;
		margin-top: 10px;
	}
	.list .img image {
		width: 23px;
		height: 23px;
		float: left;
		margin-left: 20px;
		margin-top: 12px;
	}
	.list .name {
		font-size: 22px;
		color: #333;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		float: left;
		margin-left: 20px;
		margin-top: 8px;
	}
	.list .time {
		font-size: 15px;
		color: #333333;
		width: 49px;
		height: 14px;
		float: left;
		margin-left: 10px;
		margin-top: 8px;
	}
	.list .line {
		width: 872px;
		height: 1px;
		background-color: #333333;
		opacity: 0.2;
		float: left;
		margin-top: 8px;
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
@media screen and (max-width: 1285px) and (min-width: 1006px) {
	.details {
		width: 100%;
		height: 100%;
		overflow: hidden;
		background-color: #0a1050;
		position: relative;
	}
	.left {
		width: 600px;
		height: 300px;
		background-color: #fff;
		margin-left: 35px;
		margin-top: 100px;
		position: relative;
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
	}
	/* 轮播 */
	.banner {
		width: 100%;
		height: 100%;
	}
	.swiper {
		display: block;
		height: 100%;
		line-height: 10px;
		text-align: center;
	}
	.swiper image {
		width: 100%;
		height: 100%;
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
	}
	.bottom {
		background-color: #fff;
		height: 200px;
		position: relative;
		padding-left: 10px;
		overflow: hidden;
		border-bottom-left-radius: 10px;
		border-bottom-right-radius: 10px;
	}
	.bottom .title {
		color: #333;
		font-size: 20px;
		font-weight: bold;
		margin-top: 10px;
	}
	.bottom .desc {
		font-size: 14px;
		width: 650px;
		height: 100px;
		color: #333;
		margin-top: 10px;
		overflow: hidden;
		text-overflow: ellipsis;
		-webkit-line-clamp: 4;
		display: -webkit-box;
		-webkit-box-orient: vertical;
	}
	.bottom .price {
		font-size: 16px;
		font-weight: bold;
		color: #f00;
	}
	.card {
		position: absolute;
		right: 20px;
		bottom: 40px;
	}
	.card image {
		width: 80px;
		height: 80px;
	}
	.card view {
		width: 80px;
		height: 19px;
		font-size: 14px;
		color: #333;
		text-align: center;
	}
	.right {
		width: 600px;
		height: 500px;
		background-color: #fff;
		position: absolute;
		right: 35px;
		top: 100px; 
		float: left;
		border-radius: 15px;
	}
	/* 课程介绍 */
	.right .class {
		width: 20px;
		height: 100%;
		float: left;
		margin-top: 2px;
		background-image: url('@/static/details_class.png');
		background-size: 15px 15px;
		background-repeat: repeat-y;
	}
	.introduce .title {
		width: 702px;
		height: 31px;
		font-size: 22px;
		font-family: Source Han Sans CN, Source Han Sans CN-Regular;
		font-weight: bold;
		color: #000000;
		position: absolute;
		left: 50px;
		top: 30px;
	}
	.introduce .price {
		width: 262px;
		height: 23px;
		font-size: 18px;
		font-family: PingFang SC, PingFang SC-Bold;
		font-weight: bold;
		color: #ff0000;
		position: absolute;
		left: 50px;
		bottom: 20px;
		text-align: left;
	}
	.introduce .text {
		width: 480px;
		line-height: 40px;
		height: 464px;
		font-size: 15px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		color: #333333;
		position: absolute;
		left: 50px;
		top: 70px;
		text-align: left;
		/* 多行文本超出显示省略号 */
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	
	/* 课程目录 */
	.scroll{
		height: 93%;
	}
	.list {
		width: 90%;
		height: 93%;
		margin-top: 30px;
		margin-left: 30px;
	}
	.list .row {
		width: 100%;
		height: 40px;
		margin-bottom: 10px;
		float: left;
	}
	.list .free image {
		width: 25px;
		height: 25px;
		float: left;
		margin-left: 10px;
		margin-top: 10px;
	}
	.list .img image {
		width: 15px;
		height: 15px;
		float: left;
		margin-left: 10px;
		margin-top: 12px;
	}
	.list .name {
		font-size: 15px;
		color: #333;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		float: left;
		margin-left: 10px;
		margin-top: 8px;
	}
	.list .time {
		font-size: 15px;
		color: #333333;
		width: 49px;
		height: 14px;
		float: left;
		margin-left: 10px;
		margin-top: 8px;
	}
	.list .line {
		width: 872px;
		height: 1px;
		background-color: #333333;
		opacity: 0.2;
		float: left;
		margin-top: 8px;
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
}
@media screen and (max-width: 1005px) {
	.details {
		width: 100%;
		height: 100%;
		overflow: hidden;
		background-color: #0a1050;
		position: relative;
	}
	.left {
		width: 475px;
		height: 260px;
		background-color: #fff;
		margin-left: 20px;
		margin-top: 80px;
		position: relative; 
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
	}
	/* 轮播 */
	.banner {
		width: 100%;
		height: 100%;
	}
	.swiper {
		display: block;
		height: 100%;
		line-height: 10px;
		text-align: center;
	}
	.swiper image {
		width: 100%;
		height: 100%;
	}
	/* 课程详情 */
	.bottom {
		background-color: #fff;
		height: 180px;
		position: relative;
		padding-left: 10px;
		overflow: hidden;
		border-bottom-left-radius: 10px;
		border-bottom-right-radius: 10px;
	}
	.bottom .title {
		color: #333;
		font-size: 20px;
		font-weight: bold;
		margin-top: 10px;
	}
	.bottom .desc {
		font-size: 16px;
		width: 70%;
		height: 90px;
		color: #333;
		margin-top: 10px;
		overflow: hidden;
		text-overflow: ellipsis;
		-webkit-line-clamp: 4;
		display: -webkit-box;
		-webkit-box-orient: vertical;
	}
	.bottom .price {
		font-size: 18px;
		font-weight: bold;
		color: #f00;
	}
	.card {
		position: absolute;
		right: -40px;
		bottom: 20px;
	}
	.card image {
		width: 80px;
		height: 80px;
		margin-left: 30px;
	}
	.card view {
		width: 180px;
		height: 19px;
		font-size: 16px;
		color: #333333;
		text-align: center;
		margin-left: -20px;
	}
	.right {
		width: 475px;
		height: 440px;
		background-color: #fff;
		position: absolute;
		right: 20px;
		top: 80px;
		border-radius: 10px;
	}
	/* 课程介绍 */
	.right .class {
		width: 20px;
		height: 98%;
		float: left;
		margin-top: 3px;
		background-image: url('@/static/details_class.png');
		background-size: 14px 14px;
		background-repeat: repeat-y;
		letter-spacing: 20px;
	}
	.introduce .title {
		width: 702px;
		height: 31px;
		font-size: 18px;
		font-family: Source Han Sans CN, Source Han Sans CN-Regular;
		font-weight: bold;
		color: #000000;
		position: absolute;
		left: 20px;
		top: 20px;
	}
	.introduce .price {
		width: 262px;
		height: 23px;
		font-size: 16px;
		font-family: PingFang SC, PingFang SC-Bold;
		font-weight: bold;
		color: #ff0000;
		position: absolute;
		left: 20px;
		bottom: 20px;
		text-align: left;
	}
	.introduce .text {
		width: 410px;
		height: 200px;
		line-height: 25px;
		font-size: 12px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		color: #333333;
		position: absolute;
		left: 20px;
		top: 50px;
		text-align: left;
		/* 多行文本超出显示省略号 */
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.introduce .card {
		position: absolute;
		right: 10px;
		bottom: 10px;
	}
	.introduce .card image {
		width: 70px;
		height: 70px;
	}
	.introduce .card view {
		width: 80px;
		height: 19px;
		font-size: 12px;
		color: #333333;
		margin-left: 10px;
	}
	/* 课程目录 */
	.scroll{
		height: 93%;
	}
	.list {
		width: 90%;
		height: 93%;
		margin-top: 30px;
		margin-left: 30px;
	}
	.list .row {
		width: 100%;
		height: 40px;
		margin-bottom: 10px;
		float: left;
	}
	.list .free image { 
		width: 25px;
		height: 25px;
		float: left;
		margin-left: 10px;
		margin-top: 8px;
	}
	.list .img image {
		width: 18px;
		height: 18px;
		float: left;
		margin-left: 10px;
		margin-top: 12px;
	}
	.list .name {
		font-size: 16px;
		color: #333;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		float: left;
		margin-left: 10px;
		margin-top: 8px;
	}
	.list .time {
		font-size: 15px;
		color: #333333;
		width: 49px;
		height: 14px;
		float: left;
		margin-left: 10px;
		margin-top: 8px;
	}
	.list .line {
		width: 470px;
		height: 1px;
		background-color: #333333;
		opacity: 0.2;
		float: left;
		margin-top: 8px;
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
}
</style> 
