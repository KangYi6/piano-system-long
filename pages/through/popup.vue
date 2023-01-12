<template>
	<!-- 练习成绩弹窗 视频-->
	<view class="mask">
		<view v-if="success && !end" class="content success-bg">
			<image class="star" src="@/static/breakthrough/success-star.png"></image>
			<view class="title">恭喜你</view>
			<image class="tips" src="@/static/breakthrough/success.png"></image>
			<view class="btn next" @click="next()">
				<image src="@/static/breakthrough/success-next.png"></image>
				<view class="text">下一关</view>
			</view>
			<view class="btn end" @click="noplay()">
				<image src="@/static/breakthrough/success-end.png"></image>
				<view class="text noplay">不玩了</view>
			</view>
		</view>
		<view v-if="!success" class="content fail-bg">
			<image class="star" src="@/static/breakthrough/fail-star.png"></image>
			<view class="title">很遗憾</view>
			<image class="tips" src="@/static/breakthrough/fail.png"></image>
			<view class="btn next" @click="again()">
				<image src="@/static/breakthrough/fail-agin.png"></image>
				<view class="text">再来一次</view>
			</view>
			<view class="btn end" @click="noplay()">
				<image src="@/static/breakthrough/fail-end.png"></image>
				<view class="text noplay">不玩了</view>
			</view>
		</view>
		<view v-if="end" class="content success-bg">
			<image class="star" src="@/static/breakthrough/success-star.png"></image>
			<view class="title">恭喜你</view>
			<view class="endTitle">本课时已全部学完!</view>
			<!-- <view class="endTitle"></view> -->
			<view class="btnBack" @click="goGame">
				<image src="@/static/breakthrough/no-play.png"></image>
				<view class="text">好的，我知道了</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return { 
				success:true,
				end:false,
			}
		},
		onLoad(options) {
			if (options.type == 'fail') {
				this.success = false
			}
			if (options.type == 'end') {
				this.success = true
				this.end = true
			}
		},
		methods: {
			//下一关
			next(){
				this.$store.state.operation = 'next'
				uni.navigateBack()
			},
			//再玩一次
			again(){
				this.$store.state.operation = 'again'
				uni.navigateBack()
			},
			//不玩了
			noplay() {
				this.$store.state.operation = 'over'
				uni.navigateBack()
			},
			// 返回课时列表
			goGame(){
				this.$store.state.operation = 'finish'
				uni.navigateBack()
			}, 
		}
	}
</script>

<style>
@media screen and (min-width: 2560px){
	page {
		background: transparent;
	}
	.mask {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		justify-content: center;
		align-items: center;
		background-color: rgba(0, 0, 0, 0.4);
	}
	.content {
		width: 516px;
		height: 531px;
		position: relative;
	}
	.success-bg {
		background:url('@/static/breakthrough/success-bg.png') no-repeat;
	}
	.fail-bg {
		background:url('@/static/breakthrough/fail-bg.png') no-repeat;
	}
	.star{
		width:233px;
		height:106px;
		position: absolute;
		left:141.5px;
		top:100px;
	}
	.title{
		width:100px;
		height:auto;
		font-size:30px;
		text-align: center;
		margin:270px auto 0;
		color:#E04F0C;
	}
	.endTitle{
		width: 300px;
		height: auto;
		font-size: 30px;
		text-align: center;
		margin:0 auto 0;
		color: #E04F0C;
	}
	.btnBack{
		width:100%;
		height:46px;
		margin:20px auto;
		text-align: center;
	}
	.btnBack image{
		width:249px;
		height:46px;
	}
	.btnBack .text{
		font-size: 22px;
		position: relative;
		top:-44px;
		left:-5px;
	}
	.fail-bg .title{
		color:#181818;
	}
	.tips{
		width:270px;
		height:71px;
		margin:10px auto 0;
		text-align: center;
		position: relative;
		left:125px;
	}
	.tips image{
		width:270px;
		height:71px;
	}
	.btn{
		position: absolute;
		bottom:-85px;
	}
	.btn image{
		width:203px;
		height:132px;
	}
	.text{
		font-size: 24px;
		position: relative;
		top:-105px;
		left:75px;
	}
	.fail-bg .text{
		left:65px;
	}
	.noplay{
		left:60px;
	}
	.next{
		left:60px;
	}
	.end{
		right:60px;
	}
}
@media screen and (max-width: 1925px) and (min-width: 1656px){
	page {
		background: transparent;
	}
	.mask {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		justify-content: center;
		align-items: center;
		background-color: rgba(0, 0, 0, 0.4);
	}
	.content {
		width: 516px;
		height: 531px;
		position: relative;
	}
	.success-bg {
		background:url('@/static/breakthrough/success-bg.png') no-repeat;
	}
	.fail-bg {
		background:url('@/static/breakthrough/fail-bg.png') no-repeat;
	}
	.star{
		width:233px;
		height:106px;
		position: absolute;
		left:141.5px;
		top:100px;
	}
	.title{
		width: 100px;
		height: auto;
		font-size: 30px;
		text-align: center;
		margin:270px auto 0;
		color: #E04F0C;
	}
	.endTitle{
		width: 300px;
		height: auto;
		font-size: 30px;
		text-align: center;
		margin:0 auto 0;
		color: #E04F0C;
	}
	.btnBack{
		width:100%;
		height:46px;
		margin:20px auto;
		text-align: center;
	}
	.btnBack image{
		width:249px;
		height:46px;
	}
	.btnBack .text{
		font-size: 22px;
		position: relative;
		top:-44px;
		left:-5px;
	}
	.fail-bg .title{
		color:#181818;
	}
	.tips{
		width:270px;
		height:71px;
		margin:10px auto 0;
		text-align: center;
		position: relative;
		left:125px;
	}
	.tips image{
		width:270px;
		height:71px;
	}
	.btn{
		position: absolute;
		bottom:-85px;
	}
	.btn image{
		width:203px;
		height:132px;
	}
	.text{
		font-size: 24px;
		position: relative;
		top:-105px;
		left:75px;
	}
	.fail-bg .text{
		left:65px;
	}
	.noplay{
		left:60px;
	}
	.next{
		left:60px;
	}
	.end{
		right:60px;
	}
}
@media screen and (max-width: 1655px) and (min-width: 1286px){
	page {
		background: transparent;
	}
	.mask {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		justify-content: center;
		align-items: center;
		background-color: rgba(0, 0, 0, 0.4);
	}
	.content {
		width: 516px;
		height: 531px;
		position: relative;
	}
	.success-bg {
		background:url('@/static/breakthrough/success-bg.png') no-repeat;
	}
	.fail-bg {
		background:url('@/static/breakthrough/fail-bg.png') no-repeat;
	}
	.star{
		width:233px;
		height:106px;
		position: absolute;
		left:141.5px;
		top:100px;
	}
	.title{
		width:100px;
		height:auto;
		font-size:30px;
		text-align: center;
		margin:270px auto 0;
		color:#E04F0C;
	}
	.endTitle{
		width: 300px;
		height: auto;
		font-size: 30px;
		text-align: center;
		margin:0 auto 0;
		color: #E04F0C;
	}
	.btnBack{
		width:100%;
		height:46px;
		margin:20px auto;
		text-align: center;
	}
	.btnBack image{
		width:249px;
		height:46px;
	}
	.btnBack .text{
		font-size: 22px;
		position: relative;
		top:-44px;
		left:-5px;
	}
	.fail-bg .title{
		color:#181818;
	}
	.tips{
		width:270px;
		height:71px;
		margin:10px auto 0;
		text-align: center;
		position: relative;
		left:125px;
	}
	.tips image{
		width:270px;
		height:71px;
	}
	.btn{
		position: absolute;
		bottom:-85px;
	}
	.btn image{
		width:203px;
		height:132px;
	}
	.text{
		font-size: 24px;
		position: relative;
		top:-105px;
		left:75px;
	}
	.fail-bg .text{
		left:65px;
	}
	.noplay{
		left:60px;
	}
	.next{
		left:60px;
	}
	.end{
		right:60px;
	}
}
@media screen and (max-width: 1285px) and (min-width: 1006px){
	page {
		background: transparent;
	}
	.mask {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		justify-content: center;
		align-items: center;
		background-color: rgba(0, 0, 0, 0.4);
	}
	.content {
		width: 516px;
		height: 531px;
		position: relative;
	}
	.success-bg {
		background:url('@/static/breakthrough/success-bg.png') no-repeat;
	}
	.fail-bg {
		background:url('@/static/breakthrough/fail-bg.png') no-repeat;
	}
	.star{
		width:233px;
		height:106px;
		position: absolute;
		left:141.5px;
		top:100px;
	}
	.title{
		width:100px;
		height:auto;
		font-size:30px;
		text-align: center;
		margin:270px auto 0;
		color:#E04F0C;
	}
	.endTitle{
		width: 300px;
		height: auto;
		font-size: 30px;
		text-align: center;
		margin:0 auto 0;
		color: #E04F0C;
	}
	.btnBack{
		width:100%;
		height:46px;
		margin:20px auto;
		text-align: center;
	}
	.btnBack image{
		width:249px;
		height:46px;
	}
	.btnBack .text{
		font-size: 22px;
		position: relative;
		top:-44px;
		left:-5px;
	}
	.fail-bg .title{
		color:#181818;
	}
	.tips{
		width:270px;
		height:71px;
		margin:10px auto 0;
		text-align: center;
		position: relative;
		left:125px;
	}
	.tips image{
		width:270px;
		height:71px;
	}
	.btn{
		position: absolute;
		bottom:-85px;
	}
	.btn image{
		width:203px;
		height:132px;
	}
	.text{
		font-size: 24px;
		position: relative;
		top:-105px;
		left:75px;
	}
	.fail-bg .text{
		left:65px;
	}
	.noplay{
		left:60px;
	}
	.next{
		left:60px;
	}
	.end{
		right:60px;
	}
}	
@media screen and (max-width: 1005px){
	page {
		background: transparent;
	}
	.mask {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		justify-content: center;
		align-items: center;
		background-color: rgba(0, 0, 0, 0.4);
	}
	.content {
		width: 516px;
		height: 531px;
		position: relative;
	}
	.success-bg {
		background:url('@/static/breakthrough/success-bg.png') no-repeat;
	}
	.fail-bg {
		background:url('@/static/breakthrough/fail-bg.png') no-repeat;
	}
	.star{
		width:233px;
		height:106px;
		position: absolute;
		left:141.5px;
		top:100px;
	}
	.title{
		width:100px;
		height:auto;
		font-size:30px;
		text-align: center;
		margin:270px auto 0;
		color:#E04F0C;
	}
	.endTitle{
		width: 300px;
		height: auto;
		font-size: 30px;
		text-align: center;
		margin:0 auto 0;
		color: #E04F0C;
	}
	.btnBack{
		width:100%;
		height:46px;
		margin:20px auto;
		text-align: center;
	}
	.btnBack image{
		width:249px;
		height:46px;
	}
	.btnBack .text{
		font-size: 22px;
		position: relative;
		top:-44px;
		left:-5px;
	}
	.fail-bg .title{
		color:#181818;
	}
	.tips{
		width:270px;
		height:71px;
		margin:10px auto 0;
		text-align: center;
		position: relative;
		left:125px;
	}
	.tips image{
		width:270px;
		height:71px;
	}
	.btn{
		position: absolute;
		bottom:-85px;
	}
	.btn image{
		width:203px;
		height:132px;
	}
	.text{
		font-size: 24px;
		position: relative;
		top:-105px;
		left:75px;
	}
	.fail-bg .text{
		left:65px;
	}
	.noplay{
		left:60px;
	}
	.next{
		left:60px;
	}
	.end{
		right:60px;
	}
}
</style>
