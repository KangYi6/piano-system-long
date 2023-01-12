<template>
	<view class="active">
		<view class="null">
			<image class="img" src="../../static/courses_nocus.png" mode=""></image>
			<view class="text">暂无活动</view>
		</view>
		<div class="goback" @click="goback"><image src="@/static/goback.png" mode="widthFix"></image></div>
	</view>
</template>

<script>
	export default{
		data(){
			return{
					
			}
		},
		methods:{
			// 返回上一步
			goback() {
				uni.navigateBack();
			},
		}
	}
	
</script>

<style>
@media screen and (min-width: 2560px) {
	* {
		margin: 0px;
		padding: 0px;
	}
	.active {
		width: 100%;
		height: 100%;
		overflow: hidden;
		background-color: #0a1050;
		position: relative;
	}
	.null {
		text-align: center;
		float: left;
		/* margin: 0 auto; */
	}
	.null .img {
		width: 444px;
		height: 302px;
		opacity: 0.5;
		float: left;
		margin: 150px 0px 50px 1050px;
	}
	.null .text {
		width: 378px;
		height: 35px;
		text-align: center;
		font-size: 36px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		color: #cacaca;
		position: absolute;
		top: 450px;
		left: 1100px;
	}
	/* 返回按钮 */
	.goback {
		position: absolute;
		bottom: 40px;
		right: 20px;
	}
	.goback image {
		width: 180px;
		height: 72px;
	}
}
@media screen and (max-width: 1925px) and (min-width: 1656px){
	* {
		margin: 0px;
		padding: 0px;
	}
	.active {
		width: 100%;
		height: 100%;
		overflow: hidden;
		background-color: #0a1050;
		position: relative;
	}
	.null {
		text-align: center;
		float: left;
		/* margin: 0 auto; */
	}
	.null .img {
		width: 444px;
		height: 302px;
		opacity: 0.5;
		float: left;
		margin: 300px 0px 50px 850px;
	}
	.null .text {
		width: 378px;
		height: 35px;
		text-align: center;
		font-size: 36px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		color: #cacaca;
		position: absolute;
		top: 600px;
		left: 880px;
	}
	/* 返回按钮 */
	.goback {
		position: absolute;
		bottom: 40px;
		right: 20px;
	}
	.goback image {
		width: 180px;
		height: 72px;
	}
}
@media screen and (max-width: 1655px) and (min-width: 1286px) {
 * {
  margin: 0px;
  padding: 0px;
 }
 .active {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #0a1050;
  background-size: 1653px 873px;
  position: relative;
 }
 .null {
  text-align: center;
  float: left;
  /* margin: 0 auto; */
 }
 .null .img {
  width: 444px;
  height: 302px;
  opacity: 0.5;
  float: left;
  margin: 250px 0px 50px 600px;
 }
 .null .text {
  width: 378px;
  height: 35px;
  text-align: center;
  font-size: 36px;
  font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
  font-weight: normal;
  color: #cacaca;
  position: absolute;
  top: 550px;
  left: 600px;
 }
 /* 返回按钮 */
 .goback {
  position: absolute;
  top: 40px;
  right: 20px;
 }
 .goback image {
  width: 180px;
  height: 72px;
 }
}
@media screen and (max-width: 1285px) and (min-width: 1006px) {
	*{
		margin: 0px;
		padding: 0px;
	}
	.active {
		width: 100%;
		height: 100%;
		overflow: hidden;
		background-color: #0a1050;
		background-size: 1653px 873px;
		position: relative;
	 }
	.null {
		text-align: center;
		float: left;
	}
	.null .img {
		width: 280px;
		height: 200px;
		float: left;
		margin-left: 520px;
		margin-top: 200px;
	}
	.null .text {
		width: 378px;
		height: 35px;
		text-align: center;
		font-size: 28px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		color: #cacaca;
		position: absolute;
		top: 420px;
		left: 480px;
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
	*{
		margin: 0px;
		padding: 0px;
	}
	.active {
		width: 100%;
		height: 100%;
		overflow: hidden;
		background-color: #0a1050;
		background-size: 1653px 873px;
		position: relative;
	 }
	.null {
		text-align: center;
		float: left;
	}
	.null .img {
		width: 250px;
		height: 180px;
		float: left;
		margin-left: 400px;
		margin-top: 170px;
	}
	.null .text {
		width: 378px;
		height: 35px;
		text-align: center;
		font-size: 24px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		color: #cacaca;
		position: absolute;
		top: 340px;
		left: 350px;
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