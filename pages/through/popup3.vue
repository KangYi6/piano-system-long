<template>
	<!-- 选择题弹窗 -->
	<view class="mask">
		<view class="bg" v-if="success">
			<image class="bgTop"  src="../../static/icons/game_icon2.png" mode=""></image>
			<view class="text_1">回答正确</view>
			<view class="text_2">好棒哦，再接再厉！</view>
			<view class="btn_2">继续答题</view>
		</view>
		<view class="bg" v-if="fail">
			<image class="bgTop" src="../../static/icons/game_icon1.png" mode=""></image>
			<view class="text_1">回答错误</view>
			<view class="text_2">要继续加油哦~</view>
			<view class="btn_1">继续答题</view>
		</view>  
	</view>
</template>

<script>
	export default {
		data() {
			return {
				success:true,
				fail:false,
			}
		},
		onLoad(options) {
			console.log(options)
		},
		methods: {
			
		},
	}
</script>

<style>
	page{
		background: transparent;
	}
	.mask{
		/* width: 100%; */
		/* height: 100%; */
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
	.bg{
		width: 250px;
		height: 261px;
		background-color: #fff;
		border-radius: 30px;
		text-align: center;
		position: absolute;
		top: 200px;
		left: 950px;
		// margin: 100px auto; 
	}
	.bg .bgTop{
		width: 120px;
		height: 120px;
		margin-top: -20px;
	}
	.bg .text_1{
		font-size: 20px;
		color: #333;
	}
	.bg .text_2{
		color: #333;
		font-size: 15px;
		margin-top: 10px;
	}
	.bg .btn_1,
	.bg .btn_2{
		width: 70%;
		height: 50px;
		line-height: 50px;
		border-radius: 30px;
		font-size: 22px;
		font-family: iekie jianheiti, iekie jianheiti-Regular;
		font-weight: 400;
		margin: 20px auto;
	}
	.bg .btn_1{
		background-color: #ff5028;
	}
	.bg .btn_2{
		background-color: #2ac800;
	}
</style>