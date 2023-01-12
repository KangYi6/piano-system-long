<template>
	<view class="content">
		<!-- 左-->
		<view class="left">
			<image src="../../static/login_before_logo.png" mode=""></image>
			<view class="left_text">欢迎登录逐梦智能钢琴</view>
		</view>
		<!-- 右-->
		<view class="right"> 
			<view class="kuang">
				<!-- <view class="text1">二维码登录</view> -->
				<view class="text1">二维码登录</view>
				<view class="line"></view>
			    <image :src="erweima"></image>
			    <view class="text2">请使用微信扫一扫</view>
			</view>
			<image class="right_bg" src="../../static/login_before_bg.png" mode=""></image>
		</view>
		<div class="goback" @click="goback">
			<image src="@/static/goback.png" mode="widthFix"></image>
		</div>
	</view>
</template>

<script>
import { getInfo } from '@/lib/common.js'
export default {
	data() {
		return {
			erweima:'', //登录二维码
			globalData:getApp().globalData, //全局参数
		};
	},
	onLoad() {
		getApp().globalData.loginPageOpen = true //设置打开登录页 
		
	},
	onShow(){
		this.getData()
	},
	onBackPress(){
		getApp().globalData.loginPageOpen = false //设置关闭登录页
	},
	methods: {
		// 获取二维码
		getData() {
			this.$request({
				url: '/piano/login/getQrcode.html',
				method: 'POST'
			}).then((res) => {
				this.erweima = res.data.data;
				// 解决base64图片不显示问题
				this.erweima = this.erweima.replace(/[\r\n]/g, "")
			});
		},
		goback(){
			//返回到上一页，并执行上一页方法
			let pages = getCurrentPages() //当前页面
			if (pages.length - 2 > 1) {
				uni.navigateBack()
			} else {
				uni.navigateTo({
					url:'/pages/index/index',
					animationType: 'fade-in',
					animationDuration: 300,
				})
			}
		}
	},
};
</script>

<style>
@media screen and (min-width:2560px){
	.content {
		width: 2560px;
		height: 720px;
	}
	.left {
		width: 1296px;
		height: 720px;
		background: url('@/static/login_before.png') no-repeat;
		float: left;
		text-align: center;
	}
	.left image {
		width: 491px;
		height: 89px;
		margin-top: 261px;
		margin-bottom: 30px;
	}
	.right{
		width: 1264px;
		height: 720px;
		text-align: center;
		float: left;
	}
	.kuang{
		width: 430px;
		height: 408px;
		margin-top: 150px;
		margin-left: 450px;
		background-color: #fff;
		box-shadow:  #091D69;
		z-index: 0;
	}
	.text1{
		font-size: 26px;
		color: #2374F9;
	}
	.line{
		width: 90px;
		height: 2px;
		background-color: #2374F9;
		margin-top: 20px;
		margin-left: 170px;
		margin-bottom: 20px;
	}
	.kuang image{
		width: 287px;
		height: 301px;
		border: 1px dashed #333333;
		z-index: 0;
	}
	.text2{
		color: #333333;
	}
	.right_bg{
		width: 1291px;
		height: 252px;
		z-index: 0;
		top: -90px;
	}
	/* 返回按钮 */
	.goback{
		position: absolute;
		bottom:40px;
		right:10px;
	}
	.goback image{
		width:180px;
		height:72px;
	}
}
@media screen and (max-width:1925px) and (min-width:1656px){
	.content {
		width: 100%;
		height: 100%;
	}
	/* width: 1017
	   height: 1080
	*/
	.left {
		width: 53%;
		height: 100%;
		background: url('@/static/login_before_ipad.png') no-repeat;
		float: left;
		text-align: center;
	}
	.left image {
		width: 48%;
		height: 8%;
		margin-top: 40%;
		margin-bottom: 2.7%;
	}
	.left .left_text{
		width: 50%;
		height: 3.2%;
		font-size: 36px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		margin: 0 auto;
	}
	/* width: 903
	   height: 1080
	*/
	.right{
		width: 47%;
		height: 100%;
		text-align: center;
		float: left;
	}
	.text1{
		font-size: 26px;
		color: #2374F9;
		margin: 27% auto 0px;
	}
	.line{
		width: 120px;
		height: 3px;
		background-color: #2374F9;
		margin-left: 170px;
		margin: 20px auto;
	}
	.kuang image{
		width: 357px;
		height: 373px;
		border: 1px dashed #333333;
		z-index: 0;
	}
	.text2{
		color: #333333;
	}
	.right_bg{
		width: 67%;
		height: 23.3%;
		z-index: 0;
		position: absolute;
		bottom: 0px;
		right: 0px;
	}
	/* 返回按钮 */
	.goback{
		position: absolute;
		top:40px;
		right:40px;
	}
	.goback image{
		width:180px;
		height:72px;
	}
}
@media screen and (max-width:1655px) and (min-width:1286px){
	.content {
		width: 100%;
		height: 100%;
	}
	.left {
		width: 53%;
		height: 100%;
		background: url('@/static/login_before_ipad.png') no-repeat;
		float: left;
		text-align: center;
	}
	.left image {
		width: 48%;
		height: 8%;
		margin-top: 40%;
		margin-bottom: 2.7%;
	}
	.left .left_text{
		width: 50%;
		height: 3.2%;
		font-size: 36px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		margin: 0 auto;
	}
	/* width: 903
	   height: 1080
	*/
	.right{
		width: 47%;
		height: 100%;
		text-align: center;
		float: left;
	}
	.text1{
		font-size: 26px;
		color: #2374F9;
		margin: 27% auto 0px;
	}
	.line{
		width: 120px;
		height: 3px;
		background-color: #2374F9;
		margin-left: 170px;
		margin: 20px auto;
	}
	.kuang image{
		width: 357px;
		height: 373px;
		border: 1px dashed #333333;
		z-index: 0;
	}
	.text2{
		color: #333333;
	}
	.right_bg{
		width: 105%;
		height: 23.3%;
		z-index: 0;
		position: absolute;
		bottom: 0px;
		right: 0px;
	}
	/* 返回按钮 */
	.goback{
		position: absolute;
		top:40px;
		right:40px;
	}
	.goback image{
		width:180px;
		height:72px;
	}
}
@media screen and (max-width:1285px){
	.content {
		width: 100%;
		height: 100%;
	}
	.left {
		width: 53%;
		height: 100%;
		background: url('@/static/login_before_ipad.png') no-repeat;
		float: left;
		text-align: center;
	}
	.left image {
		width: 48%;
		height: 8%;
		margin-top: 40%;
		margin-bottom: 2.7%;
	}
	.left .left_text{
		width: 60%;
		height: 3.2%;
		font-size: 22px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		margin: 0 auto;
	}
	.right{
		width: 47%;
		height: 100%;
		text-align: center;
		float: left;
	}
	.text1{
		font-size: 20px;
		color: #2374F9;
		margin: 27% auto 0px;
	}
	.line{
		width: 100px;
		height: 2px;
		background-color: #2374F9;
		margin-left: 170px;
		margin: 10px auto;
	}
	.kuang image{
		width: 200px;
		height: 200px;
		border: 1px dashed #333333;
		z-index: 0;
		margin-top: 20px;
	}
	.text2{
		color: #333333;
	}
	.right_bg{
		width: 105%;
		height: 23.3%;
		z-index: 0;
		position: absolute;
		bottom: 0px;
		right: 0px;
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
