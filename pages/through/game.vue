<template>
	<view class="game">
		<!-- 1.解锁闯关 -->
		<view class="unlock">
			<!-- 1.1.左右按钮 -->
			<!-- <view class="pre"><image src="../../static/icons/courses_pre.png" mode="" @click="pre()"></image></view> -->
			<!-- <view class="pre" v-if="page == 1"><image src="../../static/courses_pre_no.png"></image></view> -->
			<!-- <view class="next"><image src="../../static/icons/courses_next.png" @click="next()"></image></view> -->
			<!-- <view class="next" v-if="page == lastpage"><image src="../../static/courses_next_no.png"></image></view> -->
			<!-- 1.2.关卡 -->
			<scroll-view scroll-y="true" class="scrollb" :scroll-left="scrollto" scroll-with-animation="true">
			<view class="content_1">
				<!-- 关卡列表 -->
				<view class="list" v-for="(item, index) in list" :key="index" @click="godetails(item.open,item.buy,item.p_id,item.c_id)">
					<view class="bg1">
						<view class="mask" v-show="item.open==0"></view>
						<image :src="item.c_thumb" v-show="item.open==1" class="light"></image>
						<image :src="item.c_thumb" v-show="item.open==0" class="dark"></image>
						<image src="../../static/details_lock.png" class="lock" v-show="item.open==0"></image>
					</view> 
					<view class="star1">
						<image src="../../static/game_unlock_star1.png" mode=""></image>
						<image v-show="item.open==0" src="../../static/game_unlock_star4.png" mode=""></image>
					</view>
					<view class="star2">
						<image src="../../static/game_unlock_star2.png" mode=""></image>
						<image v-show="item.open==0" src="../../static/game_unlock_star5.png" mode=""></image>
					</view>
					<view class="star3">
						<image src="../../static/game_unlock_star3.png" mode=""></image>
						<image v-show="item.open==0" src="../../static/game_unlock_star6.png" mode=""></image>
					</view>
					<view class="text1">{{ item.c_name }}</view> 
				</view>
			</view>
			</scroll-view>
		</view>
		<!--
		<view class="dialogkey" v-show="dialogkey" @click="visbledialog">
			<view class="keydown">
				<span v-show="!isbuy">请先购买课程</span>
				<span v-show="isbuy">未解锁</span>
			</view>
		</view>
		-->
		<div class="goback" @click="goback"><image src="@/static/goback.png" mode="widthFix"></image></div>
	</view>
</template>
 
<script>
export default {
	data() {
		return {
			list: [], // 关卡列表
			pid:0, //产品ID
			page:1,
			lastpage:1,
			scrollto:0,
		};
	},
	onLoad(options){
		if(options.pid){
			this.pid = options.pid
		} else {
			uni.navigateBack({})
		}
	},
	onShow(){
		this.getdata()
	},
	methods: {
		//闯关列表
		getdata(){
			this.$request({
				url: '/piano/breakthrough/index.html',
				method: 'POST',
				data: {
					p_id:this.pid,
					limit:12,
					page:1,
				}
			}).then(res => {
				this.list = res.data.data
				//根据数量来赋值总页数
				if(this.list.length>16){
				}
			})
		},
		//闯关详情
		godetails(open,buy,pid,cid) {
			if (open == 1) {
				uni.navigateTo({
					url: '/pages/game/details?pid='+pid+'&cid='+cid,
				});
			} else {
				let text = '请先购买课程'
				if (buy == 1) text = '未解锁'
				uni.showToast({
					title:text,
					icon:'error'
				})
			}
		},
		//上一页
		pre(){
			this.page--
			this.scrollto-=2080
		},
		//下一页
		next(){
			this.page++
			this.scrollto+=2080
		},
		// 返回上一页
		goback() {
			uni.navigateTo({
				url: "/pages/courses/courses",
			});
		},
		//隐藏解锁窗口
		visbledialog(){
			this.dialogkey = false
		}
	}
};
</script>

<style>
@media screen and (min-width: 2560px) {
	.game {
		width: 2560px;
		height: 720px;
		background-color: #0a1050;
		position: relative;
		overflow: hidden;
	}
	.unlock {
		width: 2560px;
		height: 720px;
		position: relative;
	}
	.pre image,
	.next image {
		width: 96px;
		height: 96px;
		position: absolute;
		top: 300px;
	}
	.pre image {
		left: 65px;
	}
	.next image {
		right: 65px;
	}
	.content_1 {
		width: 2080px;
		height: 685px;
		/* margin: 25px auto; */
		/* display: flex; */
		/* flex-direction: column; */
		/* flex-wrap: wrap; */
		/* align-content: flex-start; */
		float: left;
	}
	.list {
		width: 200px;
		height: auto;
		margin: 30px 30px 0px 30px;
		position: relative;
		float: left;
	}
	.list .bg1{
		background: url('@/static/wifi/courseware.png') no-repeat;
		width: 200px;
		height: 258px;
		background-color: #fff;
		border-radius: 20px;
	}
	.list .bg1 .light{
		width: 162px;
		height: 162px;
		position: absolute;
		top: 23px;
		left: 22px;
	}
	.list .bg1 .dark{
		width: 160px;
		height: 160px;
		position: absolute;
		top: 24px;
		left: 24px;
		opacity: 0.3;
	}
	.list .bg1 .lock{
		width: 74px;
		height: 93px;
		position: absolute;
		left: 60px;
		top: 54px;
	}
	.list .bg1 .mask{
		width: 164px;
		height: 164px;
		background-color:#042139;
		position: absolute;
		top: 22px;
		left: 20px;
	}
	.list .star1 image,
	.list .star2 image,
	.list .star3 image {
		width: 30px;
		height: 30px;
		position: absolute;
	}
	.list .star1 image {
		left: 45px;
		bottom: 65px;
	}
	.list .star2 image {
		left: 85px;
		bottom: 70px;
	}
	.list .star3 image {
		right: 45px;
		bottom: 65px;
	}
	.list .text1 {
		/* width: 71px; */
		height: 23px;
		font-size: 20px;
		font-family: Source Han Sans CN, Source Han Sans CN-Regular;
		font-weight: 400;
		text-align: center;
		color: #fff;
		margin: 10px auto;
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
	.dialogkey{
		background: rgba(0,0,0, 0.6);
		position: fixed;
		z-index: 200;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
	@keyframes move{
		0%{
			transform: scale(0);
		}
		100%{
			transform: scale(1);
		}
	}
	.keydown{
		position: absolute;
		left: 45%;
		top: 30%;
		width: 400px;
		height: 100px;
		animation: move 0.5s;
		border: 2px solid #396AF7;
		background-color: #f0eac2;
		line-height: 100px;
		text-align: center;
	}
	.keydown span{
		font-size: 35px;
		color: #ff6600;
	}
	.scrollb{
		width: 2080px;
		height: 685px;
		margin: 25px auto;
	}
}
@media screen and (max-width:1925px) and (min-width:1656px) {
	.game {
		width: 100%;
		height: 100%;
		background-color: #0a1050;
		position: relative;
		overflow: hidden;
	}
	.unlock {
		width: 100%;
		height: 100%;
		position: relative;
	}
	.pre image,
	.next image {
		width: 96px;
		height: 96px;
		position: absolute;
		top: 35%;
	}
	.pre image {
		left: 65px;
	}
	.next image {
		right: 65px;
	}
	.scrollb{
		height: 800px;
		margin: 120px auto;
	}
	.content_1 {
		width: 85%;
		height: 800px;
		margin: 0px auto;
	}
	.list {
		width: 130px;
		height: auto;
		margin: 80px 100px 0px 40px;
		position: relative;
		float: left;
	}
	.list .bg1{
		background: url('@/static/wifi/courseware.png') no-repeat;
		width: 200px;
		height: 258px;
		background-color: #fff;
		border-radius: 20px;
	}
	.list .bg1 image {
		width: 222px;
		height: 286px;
		margin-bottom: 5px;
	}
	.list .bg1 .light{
		width: 162px;
		height: 162px;
		position: absolute;
		top: 23px;
		left: 22px;
	}
	.list .bg1 .dark{
		width: 160px;
		height: 160px;
		position: absolute;
		top: 24px;
		left: 24px;
		opacity: 0.3;
	}
	.list .bg1 .lock{
		width: 74px;
		height: 93px;
		position: absolute;
		left: 60px;
		top: 54px;
	}
	.list .bg1 .mask{
		width: 164px;
		height: 164px;
		background-color:#042139;
		position: absolute;
		top: 22px;
		left: 20px;
	}
	.list .star1 image,
	.list .star2 image,
	.list .star3 image {
		width: 25px;
		height: 25px;
		position: absolute;
	}
	.list .star1 image {
		left: 50px;
		bottom: 70px;
	}
	.list .star2 image {
		left: 90px;
		bottom: 76px;
	}
	.list .star3 image {
		right: -25px;
		bottom: 70px;
	}
	.list .text1 {
		width: 210px;
		height: 27px;
		font-size: 22px;
		font-family: Source Han Sans CN, Source Han Sans CN-Regular;
		font-weight: 400;
		text-align: left;
		text-align: center;
		color: #fff;
		margin: 10px auto;
	}
	/* 返回按钮 */
	.goback {
		position: absolute;
		top: 40px;
		right: 10px;
	}
	.goback image {
		width: 180px;
		height: 72px;
	}
	.dialogkey{
		background: rgba(0,0,0, 0.6);
		position: fixed;
		z-index: 200;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
	@keyframes move{
		0%{
			transform: scale(0);
		}
		100%{
			transform: scale(1);
		}
	}
	.keydown{
		position: absolute;
		left: 45%;
		top: 30%;
		width: 400px;
		height: 100px;
		animation: move 0.5s;
		border: 2px solid #396AF7;
		background-color: #f0eac2;
		line-height: 100px;
		text-align: center;
	}
	.keydown span{
		font-size: 35px;
		color: #ff6600;
	}
}
@media screen and (max-width:1655px) and (min-width:1286px) {
	.game {
		width: 100%;
		height: 100%;
		background-color: #0a1050;
		position: relative;
		overflow: hidden;
	}
	.unlock {
		width: 100%;
		height: 100%;
		position: relative;
	}
	.pre image,
	.next image {
		width: 96px;
		height: 96px;
		position: absolute;
		top: 50%;
	}
	.pre image {
		left: 65px;
	}
	.next image {
		right: 65px;
	}
	.scrollb{
		height: 690px;
		margin: 120px auto;
	}
	.content_1 {
		width: 85%;
		margin: 0 auto;
	}
	.list {
		width: 130px;
		height: auto;
		margin: 40px 80px 0px 60px;
		position: relative;
		float: left;
	}
	.list .bg1{
		background: url('@/static/wifi/courseware.png') no-repeat;
		width: 200px;
		height: 258px;
		background-color: #fff;
		border-radius: 20px;
	}
	.list .bg1 image {
		width: 222px;
		height: 286px;
		margin-bottom: 5px;
	}
	.list .bg1 .light{
		width: 162px;
		height: 162px;
		position: absolute;
		top: 23px;
		left: 22px;
	}
	.list .bg1 .dark{
		width: 160px;
		height: 160px;
		position: absolute;
		top: 24px;
		left: 24px;
		opacity: 0.3;
	}
	.list .bg1 .lock{
		width: 74px;
		height: 93px;
		position: absolute;
		left: 60px;
		top: 54px;
	}
	.list .bg1 .mask{
		width: 164px;
		height: 164px;
		background-color:#042139;
		position: absolute;
		top: 22px;
		left: 20px;
	}
	.list .star1 image,
	.list .star2 image,
	.list .star3 image {
		width: 25px;
		height: 25px;
		position: absolute;
	}
	.list .star1 image {
		left: 50px;
		bottom: 70px;
	}
	.list .star2 image {
		left: 90px;
		bottom: 76px;
	}
	.list .star3 image {
		right: -25px;
		bottom: 70px;
	}
	.list .text1 {
		width: 210px;
		height: 27px;
		font-size: 22px;
		font-family: Source Han Sans CN, Source Han Sans CN-Regular;
		font-weight: 400;
		text-align: left;
		text-align: center;
		color: #fff;
		margin: 10px auto;
	}
	/* 返回按钮 */
	.goback { 
		position: absolute;
		top: 40px;
		right: 10px;
	}
	.goback image {
		width: 180px;
		height: 72px;
	}
	.dialogkey{
		background: rgba(0,0,0, 0.6);
		position: fixed;
		z-index: 200;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
	@keyframes move{
		0%{
			transform: scale(0);
		}
		100%{
			transform: scale(1);
		}
	}
	.keydown{
		position: absolute;
		left: 45%;
		top: 30%;
		width: 400px;
		height: 100px;
		animation: move 0.5s;
		border: 2px solid #396AF7;
		background-color: #f0eac2;
		line-height: 100px;
		text-align: center;
	}
	.keydown span{
		font-size: 35px;
		color: #ff6600;
	}
}
@media screen and (max-width: 1285px) and (min-width: 1006px) {
	.game {
		width: 100%;
		height: 100%;
		background-color: #0a1050;
		position: relative;
		overflow: hidden;
	}
	.unlock {
		width: 100%;
		height: 100%;
		position: relative;
	}
	.pre image,
	.next image {
		width: 70px;
		height: 70px;
		position: absolute;
		top: 50%;
	}
	.pre image {
		left: 50px;
	}
	.next image {
		right: 50px;
	}
	.scrollb{
		height: 580px;
		margin: 80px auto;
	}
	.content_1 {
		width: 85%;
		margin: 0 auto;
	}
	.list {
		width: 130px;
		height: auto;
		margin: 20px 80px 0px 60px;
		position: relative;
		float: left;
	}
	.list .bg1{
		background: url('@/static/wifi/courseware.png') no-repeat;
		width: 200px;
		height: 238px;
		background-color: #fff;
		border-radius: 20px;
		transform: scale(0.7);
	}
	.list .bg1 image {
		width: 210px;
		height: 238px;
		margin-bottom: 5px;
	}
	/* 中间图片 */
	.list .bg1 .light{
		width: 165px;
		height: 165px;
		position: absolute;
		top: 18px;
		left: 18px;
	}
	.list .bg1 .dark{
		width: 165px;
		height: 165px;
		position: absolute;
		top: 20px;
		left: 20px;
		opacity: 0.3;
	}
	.list .bg1 .lock{
		width: 74px;
		height: 93px;
		position: absolute;
		left: 60px;
		top: 54px;
	}
	.list .bg1 .mask{
		width: 162px;
		height: 164px;
		background-color: #042139;
		position: absolute;
		top:20px;
		left: 19px;
	}
	.list .star1 image,
	.list .star2 image,
	.list .star3 image {
		width: 25px;
		height: 25px;
		position: absolute;
	}
	.list .star1 image {
		left: 50px;
		bottom: 45px;
	}
	.list .star2 image {
		left: 90px;
		bottom: 51px;
	}
	.list .star3 image {
		right: -25px;
		bottom: 45px;
	}
	.list .text1 {
		width: 250px;
		height: 27px;
		font-size: 18px;
		font-family: Source Han Sans CN, Source Han Sans CN-Regular;
		font-weight: 400;
		text-align: left;
		text-align: center;
		color: #fff;
		margin-left: -30px;
		margin-top: -20px;
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
	.dialogkey{
		background: rgba(0,0,0, 0.6);
		position: fixed;
		z-index: 200;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
	@keyframes move{
		0%{
			transform: scale(0);
		}
		100%{
			transform: scale(1);
		}
	}
	.keydown{
		position: absolute;
		left: 45%;
		top: 30%;
		width: 400px;
		height: 100px;
		animation: move 0.5s;
		border: 2px solid #396AF7;
		background-color: #f0eac2;
		line-height: 100px;
		text-align: center;
	}
	.keydown span{
		font-size: 35px;
		color: #ff6600;
	}
}
@media screen and (max-width: 1005px) {
	.game {
		width: 100%;
		height: 100%;
		background-color: #0a1050;
		position: relative;
		overflow: hidden;
	}
	.unlock {
		width: 100%;
		height: 100%;
		position: relative;
	}
	.pre image,
	.next image {
		width: 70px;
		height: 70px;
		position: absolute;
		top: 50%;
	}
	.pre image {
		left: 50px;
	}
	.next image {
		right: 50px;
	}
	.scrollb{
		height: 480px;
		margin: 80px auto;
	}
	.content_1 {
		width: 85%;
		margin-left: 50px;
	}
	.list {
		width: 130px;
		height: auto;
		margin: 20px 20px 0px 20px;
		position: relative;
		float: left;
	}
	.list .bg1{
		background: url('@/static/wifi/courseware.png') no-repeat;
		width: 200px;
		height: 238px;
		background-color: #fff;
		border-radius: 20px;
		transform: scale(0.7);
	}
	.list .bg1 image {
		width: 210px;
		height: 238px;
		margin-bottom: 5px;
	}
	/* 中间图片 */
	.list .bg1 .light{
		width: 165px;
		height: 165px;
		position: absolute;
		top: 18px;
		left: 18px;
	}
	.list .bg1 .dark{
		width: 165px;
		height: 165px;
		position: absolute;
		top: 20px;
		left: 20px;
		opacity: 0.3;
	}
	.list .bg1 .lock{
		width: 74px;
		height: 93px;
		position: absolute;
		left: 60px;
		top: 54px;
	}
	.list .bg1 .mask{
		width: 162px;
		height: 164px;
		background-color: #042139;
		position: absolute;
		top:20px;
		left: 19px;
	}
	.list .star1 image,
	.list .star2 image,
	.list .star3 image {
		width: 25px;
		height: 25px;
		position: absolute;
	}
	.list .star1 image {
		left: 50px;
		bottom: 45px;
	}
	.list .star2 image {
		left: 90px;
		bottom: 51px;
	}
	.list .star3 image {
		right: -25px;
		bottom: 45px;
	}
	.list .text1 {
		width: 250px;
		height: 27px;
		font-size: 18px;
		font-family: Source Han Sans CN, Source Han Sans CN-Regular;
		font-weight: 400;
		text-align: left;
		text-align: center;
		color: #fff;
		margin-left: -30px;
		margin-top: -20px;
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
	.dialogkey{
		background: rgba(0,0,0, 0.6);
		position: fixed;
		z-index: 200;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
	@keyframes move{
		0%{
			transform: scale(0);
		}
		100%{
			transform: scale(1);
		}
	}
	.keydown{
		position: absolute;
		left: 45%;
		top: 30%;
		width: 400px;
		height: 100px;
		animation: move 0.5s;
		border: 2px solid #396AF7;
		background-color: #f0eac2;
		line-height: 100px;
		text-align: center;
	}
	.keydown span{
		font-size: 35px;
		color: #ff6600;
	}
}

</style>