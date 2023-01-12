<template>
	<view class="content">
		<top></top>
		
		<!-- 左右图标 -->
		<image src="../../static/courses_pre.png" class="left" v-if="page>1" @click="prev"></image>
		<image src="../../static/courses_next.png" class="right" @click="next" v-if="page<lastpage"></image>
		
		<!-- 作业不存在 -->
		<view class="notcusIpad2" v-if="list.length == 0">
			<image src="../../static/live_notcus.png" mode=""></image>
			<text class="left_text1Ipad2">老师还没有布置作业哦</text>
		</view>
		
		<!-- 作业列表 -->
		<scroll-view scroll-x="true" class="scrollh" :scroll-left="scrollleft" scroll-with-animation="true" @scrolltolower="scrollright">
		<view class="tasks">
			<view class="task" v-for="(item,index) in list" :key="index" @click="godetail(item.h_id)">
				<view class="title">
					{{item.h_title}}
				</view>
				<view class="time">
					{{item.h_date}}
				</view>
				<view class="desk">
					{{item.h_desc}}
				</view>
				<view class="foot">
					<image src="../../static/wifi/people.png"></image>
					<text v-if="item.u_name">{{item.u_name}}</text>
					<text v-else>{{item.u_nickname}}</text>
					<image src="../../static/wifi/class.png"></image>
					<text>{{item.g_name}}</text>
				</view>
				<view class="iscomplete" v-show="item.finish==0">未读</view>
				<view class="complete" v-show="item.finish==1">已读</view>
			</view>
		</view>
		</scroll-view>
		<view class="goback" @click="goback"><image src="@/static/goback.png"></image></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				//作业列表
				list:[],
				// 作业列表（测试）
				listTest:[
					{h_title:'《卡农》练习钢琴曲', h_date:'2021-12-02', h_desc:'卡农是一种曲式的名称，这种曲式的特征是间隔数音节不停重复同一段乐曲。', u_name:'老师：蕾蕾老师', g_name:'体验班'},
					{h_title:'《卡农》练习钢琴曲', h_date:'2021-12-02', h_desc:'卡农是一种曲式的名称，这种曲式的特征是间隔数音节不停重复同一段乐曲。', u_name:'老师：蕾蕾老师', g_name:'体验班'},
					{h_title:'《卡农》练习钢琴曲', h_date:'2021-12-02', h_desc:'卡农是一种曲式的名称，这种曲式的特征是间隔数音节不停重复同一段乐曲。', u_name:'老师：蕾蕾老师', g_name:'体验班'},
					{h_title:'《卡农》练习钢琴曲', h_date:'2021-12-02', h_desc:'卡农是一种曲式的名称，这种曲式的特征是间隔数音节不停重复同一段乐曲。', u_name:'老师：蕾蕾老师', g_name:'体验班'},
					{h_title:'《卡农》练习钢琴曲', h_date:'2021-12-02', h_desc:'卡农是一种曲式的名称，这种曲式的特征是间隔数音节不停重复同一段乐曲。', u_name:'老师：蕾蕾老师', g_name:'体验班'},
					{h_title:'《卡农》练习钢琴曲', h_date:'2021-12-02', h_desc:'卡农是一种曲式的名称，这种曲式的特征是间隔数音节不停重复同一段乐曲。', u_name:'老师：蕾蕾老师', g_name:'体验班'},
					{h_title:'《卡农》练习钢琴曲', h_date:'2021-12-02', h_desc:'卡农是一种曲式的名称，这种曲式的特征是间隔数音节不停重复同一段乐曲。', u_name:'老师：蕾蕾老师', g_name:'体验班'},
					{h_title:'《卡农》练习钢琴曲', h_date:'2021-12-02', h_desc:'卡农是一种曲式的名称，这种曲式的特征是间隔数音节不停重复同一段乐曲。', u_name:'老师：蕾蕾老师', g_name:'体验班'},
					{h_title:'《卡农》练习钢琴曲', h_date:'2021-12-02', h_desc:'卡农是一种曲式的名称，这种曲式的特征是间隔数音节不停重复同一段乐曲。', u_name:'老师：蕾蕾老师', g_name:'体验班'},
					{h_title:'《卡农》练习钢琴曲', h_date:'2021-12-02', h_desc:'卡农是一种曲式的名称，这种曲式的特征是间隔数音节不停重复同一段乐曲。', u_name:'老师：蕾蕾老师', g_name:'体验班'},
				],
				//分页数据
				page:1,
				//滚动距离
				scrollleft:0,
				//总页数(测试)
				lastpage:1,
			} 
		},
		onLoad() {
			this.getdata()
		},
		methods: {
			//作业列表
			getdata(){
				this.$request({
					url: "/piano/homework/list.html",
					method: "POST",
					data:{
						page:this.page
					}
				}).then((res)=>{
					if(res.data.code==1000){
						this.lastpage=res.data.data.last_page
						if(this.page==1){
							this.list=res.data.data.data
						}else{
							this.list=this.list.concat(res.data.data.data)
						}
					}
				})
			},
			//进入详情页
			godetail(hid){
				uni.navigateTo({
					url:'/pages/task/taskdetail?hid='+hid
				})
			},
			//下一页
			next(){
				this.page++
				this.scrollleft = this.scrollleft+1860
			},	
			//上一页
			prev(){
				this.page--
				this.scrollleft = this.scrollleft-1860
			},
			//滚动加载
			scrollright(){
				this.page+=1
				this.getdata()
			},
			
			//返回
			goback(){
				uni.navigateBack()
			},
		}
	}
</script>

<style>
@media screen and (min-width: 2560px){
	.content {
		width: 100%;
		height: 100%;
		position: absolute;
		background-color: #0a1050;
	}
	.notcusIpad2{
		width: 216px;
		float: left;
		margin-left: 1200px;
		margin-top: 250px;
	}
	.notcusIpad2 image{
		width: 216px;
		height: 170px;
		float: left;
		opacity: 0.8;
	}
	.notcusIpad2 .left_text1Ipad2{
		width: 200px;
		height: 11.5px;
		font-size: 20px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		text-align: center;
		float: left;
		margin-top: 30px;
		margin-left: 10px;
	}
	.scrollh{
		width: 1860px;
		height: 555px;
		position: absolute;
		left: 360px;
		bottom: 80px;
	}
	.tasks{
		width: 1860px;
		height: 555px;
		/* display: flex; */
		/* flex-wrap: wrap; */
		/* flex-direction: column; */
		/* align-content: flex-start; */
		float: left
	}
	.task{
		width: 440px;
		height: 250px;
		padding-right: 25px;
		background: url('@/static/wifi/mokuai.png') no-repeat;
		background-size: 440px 250px;
		position: relative;
		padding-bottom: 20px;
		float: left;
	}
	.task .title{
		width: 219px;
		height: 25px;
		font-size: 24px;
		font-family: Source Han Sans CN, Source Han Sans CN-Regular;
		font-weight: 400;
		text-align: left;
		color: #ffffff;
		padding-left: 25px;
		padding-top: 25px;
	}
	.task .time{
		width: 106px;
		height: 14px;
		opacity: 0.47;
		font-size: 18px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		text-align: left;
		color: #ffffff;
		padding-left: 25px;
		padding-top: 20px;
	}
	.task .desk{
		width: 400px;
		height: 78px;
		font-size: 18px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		text-align: left;
		color: #f0f0f0;
		padding-left: 23px;
		padding-top: 20px;
		display: -webkit-box;
		overflow: hidden;
		-webkit-box-orient: vertical;// 在父元素设置,子元素的排列方式/vertical(垂直)
		-webkit-line-clamp: 3; // 只显示3行
	}
	.task .foot{
		padding-left: 17px;
		padding-top: 20px;
	}
	.task .foot image{
		width: 40px;
		height: 40px;
	}
	.task .foot text{
		font-size: 20px;
		font-family: Source Han Sans CN, Source Han Sans CN-Regular;
		font-weight: 400;
		text-align: left;
		color: #ffffff;
		display: inline-block;
		transform: translateY(-13px);
		padding-right: 10px;
	}
	.task .iscomplete{
		background: url('@/static/wifi/red.png') no-repeat;
		background-size: 100px 40px;
		width: 100px;
		height: 40px;
		line-height: 40px;
		position: absolute;
		right: 0;
		top: 0;
		padding-right: 25px;
		font-size: 18px;
		font-family: Source Han Sans CN, Source Han Sans CN-Regular;
		font-weight: 400;
		color: #ffffff;
		text-align: center;
	}
	.task .complete{
		background: url('@/static/wifi/green.png') no-repeat;
		background-size: 100px 40px;
		width: 100px;
		height: 40px;
		line-height: 40px;
		position: absolute;
		right: 0;
		top: 0;
		padding-right: 25px;
		font-size: 18px;
		font-family: Source Han Sans CN, Source Han Sans CN-Regular;
		font-weight: 400;
		color: #ffffff;
		text-align: center;
	}
	.left{
		width: 96px;
		height: 96px;
		position: absolute;
		left: 200px;
		top: 305px;
	}
	.right{
		width: 96px;
		height: 96px;
		position: absolute;
		right: 200px;
		top: 305px;
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
	.content {
		width: 100%;
		height: 100%;
		position: absolute;
		background-color: #0a1050;
	}
	.notcusIpad2{
		width: 216px;
		float: left;
		margin-left: 900px;
		margin-top: 400px;
	}
	.notcusIpad2 image{
		width: 216px;
		height: 170px;
		float: left;
		opacity: 0.8;
	}
	.notcusIpad2 .left_text1Ipad2{
		width: 200px;
		height: 11.5px;
		font-size: 20px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		text-align: center;
		float: left;
		margin-top: 30px;
		margin-left: 10px;
	}
	.scrollh{
		width: 72%;
		height: 555px;
		position: absolute;
		left: 260px;
		bottom: 330px;
	}
	.tasks{
		width: 1800px;
		height: 555px;
		/* display: flex; */
		/* flex-wrap: wrap; */
		/* flex-direction: column; */
		/* align-content: flex-start; */
		float: left;
	}
	.task{
		width: 440px;
		height: 250px;
		padding-right: 25px;
		background: url('@/static/wifi/mokuai.png') no-repeat;
		background-size: 440px 250px;
		position: relative;
		padding-bottom: 20px;
		float: left;
	}
	.task .title{
		width: 219px;
		height: 25px;
		font-size: 24px;
		font-family: Source Han Sans CN, Source Han Sans CN-Regular;
		font-weight: 400;
		text-align: left;
		color: #ffffff;
		padding-left: 25px;
		padding-top: 25px;
	}
	.task .time{
		width: 106px;
		height: 14px;
		opacity: 0.47;
		font-size: 18px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		text-align: left;
		color: #ffffff;
		padding-left: 25px;
		padding-top: 20px;
	}
	.task .desk{
		width: 400px;
		height: 78px;
		font-size: 18px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		text-align: left;
		color: #f0f0f0;
		padding-left: 23px;
		padding-top: 20px;
		display: -webkit-box;
		overflow: hidden;
		-webkit-box-orient: vertical;// 在父元素设置,子元素的排列方式/vertical(垂直)
		-webkit-line-clamp: 3; // 只显示3行
	}
	.task .foot{
		padding-left: 17px;
		padding-top: 20px;
	}
	.task .foot image{
		width: 40px;
		height: 40px;
	}
	.task .foot text{
		font-size: 20px;
		font-family: Source Han Sans CN, Source Han Sans CN-Regular;
		font-weight: 400;
		text-align: left;
		color: #ffffff;
		display: inline-block;
		transform: translateY(-13px);
		padding-right: 10px;
	}
	.task .iscomplete{
		background: url('@/static/wifi/red.png') no-repeat;
		background-size: 100px 40px;
		width: 100px;
		height: 40px;
		line-height: 40px;
		position: absolute;
		right: 0;
		top: 0;
		padding-right: 25px;
		font-size: 18px;
		font-family: Source Han Sans CN, Source Han Sans CN-Regular;
		font-weight: 400;
		color: #ffffff;
		text-align: center;
	}
	.task .complete{
		background: url('@/static/wifi/green.png') no-repeat;
		background-size: 100px 40px;
		width: 100px;
		height: 40px;
		line-height: 40px;
		position: absolute;
		right: 0;
		top: 0;
		padding-right: 25px;
		font-size: 18px;
		font-family: Source Han Sans CN, Source Han Sans CN-Regular;
		font-weight: 400;
		color: #ffffff;
		text-align: center;
	}
	.left{
		width: 70px;
		height: 70px;
		position: absolute;
		left: 50px;
		top: 420px;
	}
	.right{
		width: 70px;
		height: 70px;
		position: absolute;
		right: 50px;
		top: 420px;
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
	.content{
		width: 100%;
		height: 100%;
		position: absolute;
		background-color: #0a1050;
	}
	.notcusIpad2{
		width: 216px;
		/* height: 200px; */
		float: left;
		margin-left: 700px;
		margin-top: 300px;
	}
	.notcusIpad2 image{
		width: 216px;
		height: 170px;
		float: left;
		opacity: 0.8;
	}
	.notcusIpad2 .left_text1Ipad2{
		width: 200px;
		height: 11.5px;
		font-size: 20px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		text-align: center;
		float: left;
		margin-top: 30px;
		margin-left: 10px;
	}
	.scrollh{
		width: 1400px;
		height: 525px;
		position: absolute;
		left: 140px;
		bottom: 150px;
	}
	.tasks{
		float: left;
	}
	.task{
		width: 440px;
		height: 250px;
		padding-right: 25px;
		background: url('@/static/wifi/mokuai.png') no-repeat;
		background-size: 440px 250px;
		position: relative;
		padding-bottom: 20px;
		float: left;
	}
	.task .title{
		width: 219px;
		height: 25px;
		font-size: 24px;
		font-family: Source Han Sans CN, Source Han Sans CN-Regular;
		font-weight: 400;
		text-align: left;
		color: #ffffff;
		padding-left: 25px;
		padding-top: 25px;
	}
	.task .time{
		width: 106px;
		height: 14px;
		opacity: 0.47;
		font-size: 18px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		text-align: left;
		color: #ffffff;
		padding-left: 25px;
		padding-top: 20px;
	}
	.task .desk{
		width: 400px;
		height: 78px;
		font-size: 18px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		text-align: left;
		color: #f0f0f0;
		padding-left: 23px;
		padding-top: 20px;
		display: -webkit-box;
		overflow: hidden;
		-webkit-box-orient: vertical;// 在父元素设置,子元素的排列方式/vertical(垂直)
		-webkit-line-clamp: 3; // 只显示3行
	}
	.task .foot{
		padding-left: 17px;
		padding-top: 20px;
	}
	.task .foot image{
		width: 40px;
		height: 40px;
	}
	.task .foot text{
		font-size: 20px;
		font-family: Source Han Sans CN, Source Han Sans CN-Regular;
		font-weight: 400;
		text-align: left;
		color: #ffffff;
		display: inline-block;
		transform: translateY(-13px);
		padding-right: 10px;
	}
	.task .iscomplete{
		background: url('@/static/wifi/red.png') no-repeat;
		background-size: 100px 40px;
		width: 100px;
		height: 40px;
		line-height: 40px;
		position: absolute;
		right: 0;
		top: 0;
		padding-right: 25px;
		font-size: 18px;
		font-family: Source Han Sans CN, Source Han Sans CN-Regular;
		font-weight: 400;
		color: #ffffff;
		text-align: center;
	}
	.task .complete{
		background: url('@/static/wifi/green.png') no-repeat;
		background-size: 100px 40px;
		width: 100px;
		height: 40px;
		line-height: 40px;
		position: absolute;
		right: 0;
		top: 0;
		padding-right: 25px;
		font-size: 18px;
		font-family: Source Han Sans CN, Source Han Sans CN-Regular;
		font-weight: 400;
		color: #ffffff;
		text-align: center;
	}
	.left{
		width: 70px;
		height: 70px;
		position: absolute;
		left: 50px;
		top: 420px;
	}
	.right{
		width: 70px;
		height: 70px;
		position: absolute;
		right: 50px;
		top: 420px;
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
	.content {
		width: 100%;
		height: 100%;
		position: absolute;
		background-color: #0a1050;
	}
	.notcusIpad2{
		width: 216px;
		/* height: 200px; */
		float: left;
		margin-left: 550px;
		margin-top: 250px;
	}
	.notcusIpad2 image{
		width: 216px;
		height: 170px;
		float: left;
		opacity: 0.8;
	}
	.notcusIpad2 .left_text1Ipad2{
		width: 200px;
		height: 11.5px;
		font-size: 20px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		text-align: center;
		float: left;
		margin-top: 30px;
		margin-left: 10px;
	}
	.scrollh{
		width: 80%;
		height: 555px;
		position: absolute;
		left: 130px;
		bottom: 80px;
	}
	.tasks{
		width: 83%;
		height: 555px;
		/* display: flex; */
		/* flex-wrap: wrap; */
		/* flex-direction: column; */
		/* align-content: flex-start; */
		margin-left: -20px;
		float: left;
		margin-top: 50px;
	}
	.task{
		width: 300px;
		height: 180px;
		padding-right: 25px;
		background-color: #1A4399;
		float: left;
		position: relative;
		padding-bottom: 20px;
		margin-left: 20px;
		margin-top: 20px;
		border-radius: 15px;
	}
	.task .title{
		width: 219px;
		height: 25px;
		font-size: 16px;
		font-family: Source Han Sans CN, Source Han Sans CN-Regular;
		font-weight: 400;
		text-align: left;
		color: #ffffff;
		padding-left: 20px;
		padding-top: 10px;
	}
	.task .time{
		width: 106px;
		height: 14px;
		opacity: 0.47;
		font-size: 14px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		text-align: left;
		color: #ffffff;
		padding-left: 20px;
		padding-top: 15px;
	}
	.task .desk{
		width: 95%;
		height: 78px;
		font-size: 12px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		text-align: left;
		color: #f0f0f0;
		padding-left: 20px;
		padding-top: 20px;
		display: -webkit-box;
		overflow: hidden;
		-webkit-box-orient: vertical;// 在父元素设置,子元素的排列方式/vertical(垂直)
		-webkit-line-clamp: 3; // 只显示3行
	}
	.task .foot{
		padding-left: 17px;
	}
	.task .foot image{
		width: 30px;
		height: 30px;
	}
	.task .foot text{
		font-size: 14px;
		font-family: Source Han Sans CN, Source Han Sans CN-Regular;
		font-weight: 400;
		text-align: left;
		color: #ffffff;
		display: inline-block;
		transform: translateY(-13px);
		padding-right: 15px;
	}
	.task .iscomplete{
		background: url('@/static/wifi/red.png') no-repeat;
		background-size: 100px 40px;
		width: 100px;
		height: 40px;
		line-height: 40px;
		position: absolute;
		left: 225px;
		top: 0;
		padding-right: 25px;
		font-size: 12px;
		font-family: Source Han Sans CN, Source Han Sans CN-Regular;
		font-weight: 400;
		color: #ffffff;
		text-align: center;
	}
	.task .complete{
		background: url('@/static/wifi/green.png') no-repeat;
		background-size: 100px 40px;
		width: 100px;
		height: 40px;
		line-height: 40px;
		position: absolute;
		left: 225px;
		top: 0;
		padding-right: 25px;
		font-size: 14px;
		font-family: Source Han Sans CN, Source Han Sans CN-Regular;
		font-weight: 400;
		color: #ffffff;
		text-align: center;
	}
	.left{
		width: 70px;
		height: 70px;
		position: absolute;
		left: 50px;
		top: 350px;
	}
	.right{
		width: 70px;
		height: 70px;
		position: absolute;
		right: 50px;
		top: 350px;
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
	.content {
		width: 100%;
		height: 100%;
		position: absolute;
		background-color: #0a1050;
	}
	/* 未布置作业 */
	.notcusIpad2{
		width: 216px;
		/* height: 200px; */
		float: left;
		margin-left: 420px;
		margin-top: 180px;
	}
	.notcusIpad2 image{
		width: 180px;
		height: 130px;
		float: left;
		opacity: 0.8;
	}
	.notcusIpad2 .left_text1Ipad2{
		width: 200px;
		height: 11.5px;
		font-size: 20px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		text-align: center;
		float: left;
		margin-top: 30px;
	}
	.scrollh{
		width: 800px;
		height: 555px;
		position: absolute;
		left: 50px;
		bottom: 80px;
	}
	.tasks{
		width: 800px;
		height: 300px;
		margin-left: -20px;
		float: left;
		margin-top: 60px;
	}
	.task{
		width: 250px;
		height: 170px;
		padding-right: 25px;
		background-color: #1A4399;
		float: left;
		position: relative;
		padding-bottom: 20px;
		margin-top: 100px;
		margin-left: 30px;
		border-radius: 10px;
	}
	.task .title{
		width: 219px;
		height: 25px;
		font-size: 16px;
		font-family: Source Han Sans CN, Source Han Sans CN-Regular;
		font-weight: 400;
		text-align: left;
		color: #ffffff;
		padding-left: 20px;
		padding-top: 10px;
	}
	.task .time{
		width: 106px;
		height: 14px;
		opacity: 0.47;
		font-size: 14px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		text-align: left;
		color: #ffffff;
		padding-left: 20px;
		padding-top: 15px;
	}
	.task .desk{
		width: 95%;
		height: 78px;
		font-size: 12px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		text-align: left;
		color: #f0f0f0;
		padding-left: 20px;
		padding-top: 20px;
		display: -webkit-box;
		overflow: hidden;
		-webkit-box-orient: vertical;// 在父元素设置,子元素的排列方式/vertical(垂直)
		-webkit-line-clamp: 3; // 只显示3行
	}
	.task .foot{
		padding-left: 17px;
		margin-top: -10px;
	}
	.task .foot image{
		width: 30px;
		height: 30px;
	}
	.task .foot text{
		font-size: 14px;
		font-family: Source Han Sans CN, Source Han Sans CN-Regular;
		font-weight: 400;
		text-align: left;
		color: #ffffff;
		display: inline-block;
		transform: translateY(-13px);
		padding-right: 15px;
	}
	.task .iscomplete,.task .complete{
		color: #ffffff;
		text-align: center;
		font-weight: 400;
		font-family: Source Han Sans CN, Source Han Sans CN-Regular;
		font-size: 12px;
		position: absolute;
		left: 195px;
		top: 0;
		padding-right: 30px;
		width: 80px;
		height: 32px;
		line-height: 35px;
	}
	.task .iscomplete{
		background: url('@/static/wifi/red.png') no-repeat;
		background-size: 80px 32px;
	}
	.task .complete{
		background: url('@/static/wifi/green.png') no-repeat;
		background-size: 80px 32px;
	}
	.left{
		width: 70px;
		height: 70px;
		position: absolute;
		left: 50px;
		top: 350px;
	}
	.right{
		width: 70px;
		height: 70px;
		position: absolute;
		right: 50px;
		top: 350px;
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
