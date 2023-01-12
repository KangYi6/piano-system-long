<template>
	<view class="qrcode">
		<scroll-view scroll-x="true" class="scroll-view_H">
			<view class="imgs" v-for="(item,index) in content" :key="index">
				<image :src="item" mode="widthFix"></image>
			</view>
			</scroll-view>
			<view class="goback" @click="goback"><image src="@/static/goback.png" mode="widthFix"></image></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				content:[],
			}
		},
		onLoad(option) {
			uni.showLoading({
				title:"加载中"
				
			})
			this.content=option.content.split(',')
			if(option.type==1){
				this.pdfimg()
			}
		},
		onReady() {
			setTimeout(()=>{
				this.$nextTick(()=>{
					uni.hideLoading()
				})
			},2000)
		},
		methods:{
			//pdf转图片
			pdfimg(){
				this.$request({ 
					url: '/piano/musicxml/pdfToImg.html',
					method: 'POST',
					data:{pdf:this.content[0]}
				}).then(res => {
					this.content=res.data.data
				});
			},
			//返回上一页
			goback(){
				uni.navigateBack();
			}
			
		}
		
	}
</script>
   
<style>
.qrcode{
	width: 100%;
	height: 100%;
	text-align: center;
}
.imgs{
	width: 500px;
	height: 100%;
	display: inline-block;
}
.imgs image{
	width: 500px;
	height: 100%
}
.scroll-view_H {
	width: 100%;
	white-space: nowrap;
}
/* 返回按钮 */
.goback {
	position: absolute;
	bottom: 0px;
	right: 5px;
}
.goback image {
	width: 90px;
	height: 15px;
}
</style>
