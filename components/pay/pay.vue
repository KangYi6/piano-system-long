<template>
	<view class="bg">
		<view class="pay">
			<view class="text">该课程为付费内容，请购买后再使用！</view>
			<view class="card"><image :src="qrcode"></image></view>
			<view class="price">￥{{ price }}</view>
			<view class="x" @click="close"><image src="@/static/pay_x.png"></image></view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			qrcode:{
				type: String,
				value: ""
			},
			price: {
				type: String,
				value: 0
			}
		},
		methods: {
			close(){
				this.$emit("pay",false)
			}
		}
	}
</script>

<style>
	.bg {
		width: 100%;
		height: 100%;
		position: fixed;
		left:0;
		top:0;
		background: rgba(0,0,0,0.5);
	}
	.pay {
		width: 300px;
		height: 380px;
		border-radius: 20px;
		background-image: linear-gradient(180deg, #018bf1 30%, #0367e2 60%);
		overflow: auto;
		position: fixed;
		left:calc(50% - 150px);
		top:calc(50% - 190px);
		text-align: center;
	}
	.text {
		width: 80%;
		height: auto;
		font-size: 20px;
		color: #fff;
		text-align: center;
		margin: 50px auto 20px;
	}
	.card {
		width: 100%;
		height: 100%;
		text-align: center;
	}
	.card image {
		width: 150px;
		height: 150px;
	}
	.price {
		color: #fff;
		font-size: 28px;
		text-align: center;
		position: absolute;
		bottom:20px;
		width:100%;
		height:auto;
	}
	.x image{
		width: 30px;
		height: 30px;
		position: absolute;
		top: 10px;
		right: 10px;
	}
</style>