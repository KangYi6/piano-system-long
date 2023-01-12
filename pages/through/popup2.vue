<template>
	<!-- 练习成绩弹窗 五线谱-->
	<view class="mask">
		<view :class="success ? 'content success-bg' : 'content fail-bg'">
			<view class="title">过关分数：{{pass}}分</view>
			<image class="tips" :src="success ? '../../static/breakthrough/success.png' : '../../static/breakthrough/fail.png'"></image>
			<view class="databox">
				<view class="list">
					<view class="data">{{score}}<text class="unit">分</text></view>
					<text>本次得分</text>
				</view>
				<view class="list">
					<view class="data">{{accuracy}}<text class="unit">%</text></view>
					<text>准确率</text>
				</view>
				<view class="list">
					<view class="data">{{error}}<text class="unit">个</text></view>
					<text>错误</text>
				</view>
				<view class="list">
					<view class="data">{{fighting}}<text class="unit">%</text></view>
					<text>打败用户</text>
				</view>
			</view>
			<view class="success" v-if="success && !end ">
				<view class="btn" @click="next()">
					<image src="@/static/breakthrough/next-btn.png"></image>
					<view class="text">下一关</view>
				</view>
				<view class="btn" @click="noplay()">
					<image src="@/static/breakthrough/no-play.png"></image>
					<view class="text">不玩了</view>
				</view>
			</view>
			<view class="success" v-if="end">
				<view class="textEnd">恭喜你</view>
				<view class="textEnd">本课时已经全部学完！</view>
				<view class="btn" @click="noplay">
					<image src="@/static/breakthrough/no-play.png"></image>
					<view class="text">好的，知道了</view>
				</view>
			</view>
			<view class="fail" v-if="fail">
				<view class="btn" @click="again()">
					<image src="@/static/breakthrough/agin-btn.png"></image>
					<view class="text">再来一次</view>
				</view>
				<view class="btn" @click="noplay()">
					<image src="@/static/breakthrough/no-play.png"></image>
					<view class="text">不玩了</view>
				</view>
			</view>
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				success:true,
				time:'',
				accuracy:0,
				error:0,
				fighting:0,
				score:0,
				integral:0,
				pass:'',
				end:false,
			}
		},
		onLoad(options) {
			if (options.type == 'fail') {
				this.success = false
				this.end = false
			} else if (options.type == 'end') {
				this.success = true
				this.end = true
			}
			this.time = options.time
			this.accuracy = options.accuracy
			this.error = options.error
			this.fighting = options.fighting
			this.score = options.score
			this.integral = options.integral
			this.pass = options.pass
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
			//不完了
			noplay() {
				this.$store.state.operation = 'over'
				uni.navigateBack()
			}
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
		width: 355px;
		height: 470px;
		position: relative;
	}
	.success-bg {
		background:url('@/static/breakthrough/successbg.png') no-repeat;
		background-size: 100% 100%;
	}
	.fail-bg{
		background:url('@/static/breakthrough/failbg.png') no-repeat;
	}
	.title{
		width:200px;
		height:auto;
		font-size:24px;
		text-align: center;
		margin:110px auto 0;
		color:#E04F0C;
	}
	.textEnd{
		width:340px;
		height:auto;
		font-size:24px;
		text-align: center;
		margin: -8px auto 2px;
		color:#E04F0C;
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
		left:43px;
	}
	.tips image{
		width:270px;
		height:71px;
	}
	.databox{
		width:90%;
		height:auto;
		margin:0 auto 20px;
		overflow: hidden;
		position: relative;
		top:-15px;
	}
	.databox .list{
		width:calc(25% - 1px);
		height:auto;
		float:left;
		border-right:1px #F6E3D1 solid;
		text-align: center;
	}
	.databox .list:last-child{
		border-right:none;
	}
	.databox text{
		color:#834208;
		font-size:18px;
		text-align: center;
	}
	.databox .list .data{
		color:#935B26;
		font-size:30px;
		font-weight: bold;
	}
	.databox .list .unit{
		color:#935B26;
		font-size:16px;
	}
	.btn{
		width:100%;
		height:46px;
		margin:20px auto;
		text-align: center;
	}
	.btn image{
		width:249px;
		height:46px;
	}
	.text{
		font-size: 22px;
		position: relative;
		top:-44px;
		left:-5px;
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
		width: 355px;
		height: 470px;
		position: relative;
	}
	.success-bg {
		background:url('@/static/breakthrough/successbg.png') no-repeat;
		background-size: 100% 100%;
	}
	.fail-bg{
		background:url('@/static/breakthrough/failbg.png') no-repeat;
	}
	.title{
		width:200px;
		height:auto;
		font-size:24px;
		text-align: center;
		margin:110px auto 0;
		color:#E04F0C;
	}
	.textEnd{
		width:340px;
		height:auto;
		font-size:24px;
		text-align: center;
		margin: -8px auto 2px;
		color:#E04F0C;
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
		left:43px;
	}
	.tips image{
		width:270px;
		height:71px;
	}
	.databox{
		width:90%;
		height:auto;
		margin:0 auto 20px;
		overflow: hidden;
		position: relative;
		top:-15px;
	}
	.databox .list{
		width:calc(25% - 1px);
		height:auto;
		float:left;
		border-right:1px #F6E3D1 solid;
		text-align: center;
	}
	.databox .list:last-child{
		border-right:none;
	}
	.databox text{
		color:#834208;
		font-size:18px;
		text-align: center;
	}
	.databox .list .data{
		color:#935B26;
		font-size:30px;
		font-weight: bold;
	}
	.databox .list .unit{
		color:#935B26;
		font-size:16px;
	}
	.btn{
		width:100%;
		height:46px;
		margin:20px auto;
		text-align: center;
	}
	.btn image{
		width:249px;
		height:46px;
	}
	.text{
		font-size: 22px;
		position: relative;
		top:-44px;
		left:-5px;
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
		width: 355px;
		height: 470px;
		position: relative;
	}
	.success-bg {
		background:url('@/static/breakthrough/successbg.png') no-repeat;
		background-size: 100% 100%;
	}
	.fail-bg{
		background:url('@/static/breakthrough/failbg.png') no-repeat;
	}
	.title{
		width:200px;
		height:auto;
		font-size:24px;
		text-align: center;
		margin:110px auto 0;
		color:#E04F0C;
	}
	.textEnd{
		width:340px;
		height:auto;
		font-size:24px;
		text-align: center;
		margin: -8px auto 2px;
		color:#E04F0C;
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
		left:43px;
	}
	.tips image{
		width:270px;
		height:71px;
	}
	.databox{
		width:90%;
		height:auto;
		margin:0 auto 20px;
		overflow: hidden;
		position: relative;
		top:-15px;
	}
	.databox .list{
		width:calc(25% - 1px);
		height:auto;
		float:left;
		border-right:1px #F6E3D1 solid;
		text-align: center;
	}
	.databox .list:last-child{
		border-right:none;
	}
	.databox text{
		color:#834208;
		font-size:18px;
		text-align: center;
	}
	.databox .list .data{
		color:#935B26;
		font-size:30px;
		font-weight: bold;
	}
	.databox .list .unit{
		color:#935B26;
		font-size:16px;
	}
	.btn{
		width:100%;
		height:46px;
		margin:20px auto;
		text-align: center;
	}
	.btn image{
		width:249px;
		height:46px;
	}
	.text{
		font-size: 22px;
		position: relative;
		top:-44px;
		left:-5px;
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
		width: 355px;
		height: 470px;
		position: relative;
	}
	.success-bg {
		background:url('@/static/breakthrough/successbg.png') no-repeat;
		background-size: 100% 100%;
	}
	.fail-bg{
		background:url('@/static/breakthrough/failbg.png') no-repeat;
	}
	.title{
		width:200px;
		height:auto;
		font-size:24px;
		text-align: center;
		margin:110px auto 0;
		color:#E04F0C;
	}
	.textEnd{
		width:340px;
		height:auto;
		font-size:24px;
		text-align: center;
		margin: -8px auto 2px;
		color:#E04F0C;
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
		left:43px;
	}
	.tips image{
		width:270px;
		height:71px;
	}
	.databox{
		width:90%;
		height:auto;
		margin:0 auto 20px;
		overflow: hidden;
		position: relative;
		top:-15px;
	}
	.databox .list{
		width:calc(25% - 1px);
		height:auto;
		float:left;
		border-right:1px #F6E3D1 solid;
		text-align: center;
	}
	.databox .list:last-child{
		border-right:none;
	}
	.databox text{
		color:#834208;
		font-size:18px;
		text-align: center;
	}
	.databox .list .data{
		color:#935B26;
		font-size:30px;
		font-weight: bold;
	}
	.databox .list .unit{
		color:#935B26;
		font-size:16px;
	}
	.btn{
		width:100%;
		height:46px;
		margin:20px auto;
		text-align: center;
	}
	.btn image{
		width:249px;
		height:46px;
	}
	.text{
		font-size: 22px;
		position: relative;
		top:-44px;
		left:-5px;
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
		width: 355px;
		height: 470px;
		position: relative;
	}
	.success-bg {
		background:url('@/static/breakthrough/successbg.png') no-repeat;
		background-size: 100% 100%;
	}
	.fail-bg{
		background:url('@/static/breakthrough/failbg.png') no-repeat;
	}
	.title{
		width:200px;
		height:auto;
		font-size:24px;
		text-align: center;
		margin:110px auto 0;
		color:#E04F0C;
	}
	.textEnd{
		width:340px;
		height:auto;
		font-size:24px;
		text-align: center;
		margin: -8px auto 2px;
		color:#E04F0C;
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
		left:43px;
	}
	.tips image{
		width:270px;
		height:71px;
	}
	.databox{
		width:90%;
		height:auto;
		margin:0 auto 20px;
		overflow: hidden;
		position: relative;
		top:-15px;
	}
	.databox .list{
		width:calc(25% - 1px);
		height:auto;
		float:left;
		border-right:1px #F6E3D1 solid;
		text-align: center;
	}
	.databox .list:last-child{
		border-right:none;
	}
	.databox text{
		color:#834208;
		font-size:18px;
		text-align: center;
	}
	.databox .list .data{
		color:#935B26;
		font-size:30px;
		font-weight: bold;
	}
	.databox .list .unit{
		color:#935B26;
		font-size:16px;
	}
	.btn{
		width:100%;
		height:46px;
		margin:20px auto;
		text-align: center;
	}
	.btn image{
		width:249px;
		height:46px;
	}
	.text{
		font-size: 22px;
		position: relative;
		top:-44px;
		left:-5px;
	}
}

</style>
