<template>
	<view class="details">
		<view class="left">
			<view class="title">{{list.h_title}}</view>
			<view class="name">
				<image src="../../static/wifi/rectangle.png"></image>
				<span>布置作业</span>
			</view>
			<view class="desc">{{list.h_desc}}</view>
			<view class="date">完成时间：{{list.h_date}}</view>
		</view>
		<view class="right">
			<view class="class"><image src="../../static/details_class.png"></image></view>
			<view class="content" v-for="(i,n) in course" :key="n">
				<view class="task" @click="study(i.cw_id,i.cw_content,i.cw_type,i.cw_name)">
					<image src="../../static/icons/details_icon1.png" v-if="i.cw_type==1"></image>
					<image src="../../static/icons/details_icon2.png" v-if="i.cw_type==2"></image>
					<span class="text">{{i.cw_name}}</span>
					<span class="learn">开始学习>></span>
				</view>
			</view>
		</view>
		
		<view class="goback" @click="gotask"><image src="@/static/goback.png" mode="widthFix"></image></view>
	</view>
</template>

<script>
	export default {
		data(){
			return {
				//左边详情
				list:{},
				//右边课件
				course:[],
				//作业id
				hid:'',
				cwid:'',
				//分数
				score:100,
			}
		},
		onLoad(options) {
			this.hid = options.hid
			this.getdata()
		},
		methods:{
			//获取作业详情
			getdata(){
				this.$request({
					url: "/piano/homework/detail.html",
					method: "POST",
					data:{
						h_id:this.hid
					}
				}).then((res)=>{
					this.list=res.data.data.info
					this.course=res.data.data.data
				})
			},
			//开始学习
			study(cwid,content,type,title){
				this.cwid = cwid
				if (type == 1) {
					uni.navigateTo({
						url:'/pages/video/video?video='+content.video+'&thumb='+content.thumb
					})
				} else if (type == 2) {
					uni.navigateTo({
						url:'/pages/musicxml/musicxml?path='+content.xml+'&title='+title+'&cwid='+cwid
					})
				}
			},
			//返回作业
			gotask(){
				uni.navigateBack()
			}
		},
	}
</script>

<style>
@media screen and (min-width: 2560px){
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
	}
	.left .title{
		width: 1068px;
		height: 38px;
		font-size: 38px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		text-align: center;
		color: #000000;
		padding-top: 40px;
	}
	.left .name{
		margin-left: 50px;
		margin-top: 30px;
	}
	.left .name span{
		width: 118px;
		height: 35px;
		font-size: 30px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		color: #000000;
	}
	.left .name image{
		width: 8px;
		height: 35px;
		border-radius: 4px;
		transform: translateY(5px);
		padding-right: 15px;
	}
	.left .desc{
		width: 984px;
		height: auto;
		max-height: 170px;
		font-size: 24px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		color: #838383;
		margin-left: 50px;
		margin-top: 25px;
		line-height: 40px;
		display: -webkit-box;
		overflow: hidden;
		-webkit-box-orient: vertical;// 在父元素设置,子元素的排列方式/vertical(垂直)
		-webkit-line-clamp: 4; // 只显示4行
	}
	.left .date{
		width: 984px;
		height: 40px;
		font-size: 24px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		color: #838383;
		margin-left: 50px;
		margin-top: 30px;
	}
	.left .subscore{
		width: 1060px;
		text-align: center;
		margin-top: 40px;
	}
	.left .subscore image{
		width: 354px;
		height: 83px;
	}
	.right {
		width: 1014px;
		height: 583px;
		background-color: #fff;
		position: absolute;
		right: 227px;
		top: 77px;
		float: left;
	}
	.right .content{
		width: 850px;
		height: auto;
		margin-left: 90px;
		margin-top: 45px;
	}
	.right .content .task{
		height: 35px;
	}
	.right .content .task image{
		width: 26px;
		height: 21px;
		margin-right: 20px;
		transform: translateY(3px);
	}
	.right .content .task .text{
		width: 181px;
		height: 22px;
		font-size: 22px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		color: #333333;
	}
	.right .content .task .learn{
		font-size: 22px;
		color: #ff8400;
		width: 150px;
		height: 35px;
		float: right;
	}
	.right .class image {
		width: 29px;
		height: 583px;
		float: left;
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
@media screen and (max-width: 1925px) and (min-width: 1656px){
	.details {
		width: 100%;
		height: 100%;
		overflow: hidden;
		background-color: #0a1050;
		position: relative;
	}
	.left {
		width: 53%;
		height: 67%;
		background-color: #fff;
		margin-left: 50px;
		margin-top: 150px;
		position: relative;
		border-radius: 15px;
	}
	.left .title{
		width: 100%;
		height: 38px;
		font-size: 38px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		text-align: center;
		color: #000000;
		padding-top: 40px;
		margin-bottom: 100px;
	}
	.left .name{
		margin-left: 50px;
		margin-top: 30px;
	}
	.left .name span{
		width: 118px;
		height: 35px;
		font-size: 30px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		color: #000000;
	}
	.left .name image{
		width: 8px;
		height: 35px;
		border-radius: 4px;
		transform: translateY(5px);
		padding-right: 15px;
	}
	.left .desc{
		width: 90%;
		height: auto;
		max-height: 170px;
		font-size: 24px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		color: #838383;
		margin-left: 50px;
		margin-top: 25px;
		line-height: 40px;
		display: -webkit-box;
		overflow: hidden;
		-webkit-box-orient: vertical;// 在父元素设置,子元素的排列方式/vertical(垂直)
		-webkit-line-clamp: 4; // 只显示4行
	}
	.left .date{
		width: 984px;
		height: 40px;
		font-size: 24px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		color: #838383;
		margin-left: 50px;
		margin-top: 30px;
	}
	.left .subscore{
		width: 1060px;
		text-align: center;
		margin-top: 40px;
	}
	.left .subscore image{
		width: 354px;
		height: 83px;
	}
	.right {
		width: 40%;
		height: 67%;
		background-color: #fff;
		position: absolute;
		right: 50px;
		top: 150px;
		float: left;
		border-radius: 15px;
		margin-left: 250px;
	}
	.right .content{
		width: 850px;
		height: auto;
		margin-left: 90px;
		margin-top: 45px;
	}
	.right .content .task{
		height: 35px;
	}
	.right .content .task image{
		width: 26px;
		height: 21px;
		margin-right: 20px;
		transform: translateY(3px);
	}
	.right .content .task .text{
		width: 181px;
		height: 22px;
		font-size: 22px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		color: #333333;
	}
	.right .content .task .learn{
		font-size: 22px;
		color: #ff8400;
		width: 150px;
		height: 35px;
		float: right;
		margin-right: 200px;
	}
	.right .class image {
		width: 29px;
		height: 740px;
		float: left;
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
@media screen and (max-width: 1655px) and (min-width: 1286px){
	.details {
		width: 100%;
		height: 100%;
		overflow: hidden;
		background-color: #0a1050;
		position: relative;
	}
	.left {
		width: 53%;
		height: 67%;
		background-color: #fff;
		margin-left: 50px;
		margin-top: 150px;
		position: relative;
		border-radius: 15px;
	}
	.left .title{
		width: 100%;
		height: 38px;
		font-size: 38px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		text-align: center;
		color: #000000;
		padding-top: 40px;
		margin-bottom: 100px;
	}
	.left .name{
		margin-left: 50px;
		margin-top: 30px;
	}
	.left .name span{
		width: 118px;
		height: 35px;
		font-size: 30px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		color: #000000;
	}
	.left .name image{
		width: 8px;
		height: 35px;
		border-radius: 4px;
		transform: translateY(5px);
		padding-right: 15px;
	}
	.left .desc{
		width: 90%;
		height:auto;
		max-height: 170px;
		font-size: 24px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		color: #838383;
		margin-left: 50px;
		margin-top: 25px;
		line-height: 40px;
		display: -webkit-box;
		overflow: hidden;
		-webkit-box-orient: vertical;// 在父元素设置,子元素的排列方式/vertical(垂直)
		-webkit-line-clamp: 4; // 只显示4行
	}
	.left .date{
		width: 984px;
		height: 40px;
		font-size: 24px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		color: #838383;
		margin-left: 50px;
		margin-top: 30px;
	}
	.left .subscore{
		width: 1060px;
		text-align: center;
		margin-top: 40px;
	}
	.left .subscore image{
		width: 354px;
		height: 83px;
	}
	.right {
		width: 40%;
		height: 67%;
		background-color: #fff;
		position: absolute;
		right: 50px;
		top: 150px;
		float: left;
		border-radius: 15px;
	}
	.right .content{
		width: 850px;
		height: auto;
		margin-left: 60px;
		margin-top: 45px;
	}
	.right .content .task{
		height: 35px;
	}
	.right .content .task image{
		width: 26px;
		height: 21px;
		margin-right: 20px;
		transform: translateY(3px);
	}
	.right .content .task .text{
		width: 181px;
		height: 22px;
		font-size: 22px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		color: #333333;
	}
	.right .content .task .learn{
		font-size: 22px;
		color: #ff8400;
		width: 150px;
		height: 35px;
		float: right;
		margin-right: 260px;
	}
	.right .class image {
		width: 29px;
		height: 583px;
		float: left;
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
@media screen and (max-width: 1285px) and (min-width: 1006px){
	.details {
		width: calc(100% - 100px);
		height: 100%;
		overflow: hidden;
		background-color: #0a1050;
		position: relative;
		padding:100px 50px;
	}
	.left {
		width: 53%;
		height: 550px;
		background-color: #fff;
		border-radius: 15px;
		float:left;
	}
	.left .title{
		width: 100%;
		height: 38px;
		font-size: 28px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		text-align: center;
		color: #000000;
		padding-top: 40px;
		margin-bottom: 20px;
	}
	.left .name{
		margin-left: 50px;
		/* margin-top: 30px; */
	}
	.left .name span{
		width: 118px;
		height: 35px;
		font-size: 20px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		color: #000000;
	}
	.left .name image{
		width: 8px;
		height: 35px;
		border-radius: 4px;
		transform: translateY(5px);
		padding-right: 15px;
	}
	.left .desc{
		width: 90%;
		height: auto;
		max-height: 120px;
		font-size: 16px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		color: #838383;
		margin-left: 50px;
		margin-top: 25px;
		line-height: 40px;
		display: -webkit-box;
		overflow: hidden;
		-webkit-box-orient: vertical;// 在父元素设置,子元素的排列方式/vertical(垂直)
		-webkit-line-clamp: 4; // 只显示4行
	}
	.left .date{
		width: 984px;
		height: 40px;
		font-size: 16px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		color: #838383;
		margin-left: 50px;
		margin-top: 10px;
	}
	.left .subscore{
		width: 1060px;
		text-align: center;
		margin-top: 40px;
	}
	.left .subscore image{
		width: 354px;
		height: 83px;
	}
	.right {
		width: 45%;
		height: 550px;
		background-color: #fff;
		float: left;
		border-radius: 15px;
		margin-left:2%;
	}
	.right .content{
		width: 90%;
		height: auto;
		margin-left: 50px;
		margin-top: 30px;
	}
	.right .content .task{
		height: 35px;
	}
	.right .content .task image{
		width: 26px;
		height: 21px;
		margin-right: 20px;
		transform: translateY(3px);
	}
	.right .content .task .text{
		width: 181px;
		height: 22px;
		font-size: 14px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		color: #333333;
	}
	.right .content .task .learn{
		font-size: 18px;
		color: #ff8400;
		width: 120px;
		height: 35px;
		float: right;
		margin-right: 20px;
	}
	.right .class image {
		width: 29px;
		height: 583px;
		float: left;
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
@media screen and (max-width: 1005px){
	.details {
		width: calc(100% - 100px);
		height: 100%;
		overflow: hidden;
		background-color: #0a1050;
		position: relative;
		padding:100px 50px;
	}
	.left {
		width: 53%;
		height: 420px;
		background-color: #fff;
		border-radius: 15px;
		float:left;
	}
	.left .title{
		width: 100%;
		height: 38px;
		font-size: 28px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		text-align: center;
		color: #000000;
		padding-top: 40px;
		margin-bottom: 20px;
	}
	.left .name{
		margin-left: 50px;
		/* margin-top: 30px; */
	}
	.left .name span{
		width: 118px;
		height: 35px;
		font-size: 20px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		color: #000000;
	}
	.left .name image{
		width: 8px;
		height: 35px;
		border-radius: 4px;
		transform: translateY(5px);
		padding-right: 15px;
	}
	.left .desc{
		width: 90%;
		height: auto;
		max-height: 120px;
		font-size: 16px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		color: #838383;
		margin-left: 50px;
		margin-top: 25px;
		line-height: 40px;
		display: -webkit-box;
		overflow: hidden;
		-webkit-box-orient: vertical;// 在父元素设置,子元素的排列方式/vertical(垂直)
		-webkit-line-clamp: 4; // 只显示4行
	}
	.left .date{
		width: 984px;
		height: 40px;
		font-size: 16px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		color: #838383;
		margin-left: 50px;
		margin-top: 10px;
	}
	.left .subscore{
		width: 1060px;
		text-align: center;
		margin-top: 40px;
	}
	.left .subscore image{
		width: 354px;
		height: 83px;
	}
	.right {
		width: 45%;
		height: 420px;
		background-color: #fff;
		float: left;
		border-radius: 15px;
		margin-left:2%;
	}
	.right .content{
		width: 90%;
		height: auto;
		margin-left: 50px;
		margin-top: 30px;
	}
	.right .content .task{
		height: 35px;
	}
	.right .content .task image{
		width: 20px;
		height: 18px;
		margin-right: 20px;
		transform: translateY(3px);
	}
	.right .content .task .text{
		width: 181px;
		height: 22px;
		font-size: 14px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		color: #333333;
	}
	.right .content .task .learn{
		font-size: 14px;
		color: #ff8400;
		width: 120px;
		height: 35px;
		float: right;
		margin-right: 20px;
		margin-top: 4px;
	}
	.right .class image {
		width: 20px;
		height: 430px;
		float: left;
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