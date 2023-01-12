<template>
	<view class="courses">
			<top></top>
			<!-- 导航选项卡 -->
			<view class="tabbar">
				<view class="tab" v-for="(tab, index) in tab" :key="index + 'tab'" @click="chooseTab(index, tab.c_id)" :class="{ cur: current == index }">
					<view class="list">{{ tab.c_name }}</view>
				</view>
			</view> 
			<!-- 左右按钮 -->
			<view class="pre" v-if="page !== 1"><image src="../../static/icons/courses_pre.png" mode="" @click="pre()"></image></view>
			<view class="next" v-if="page < lastpage"><image src="../../static/icons/courses_next.png" mode="" @click="next()"></image></view>
			
			<!-- 课程列表 -->
			<scroll-view scroll-x="true" class="scroll-view_H" :scroll-left="scrollleft" scroll-with-animation="true" @scrolltolower="scrollright">
				<view class="content" :animation="animationData">
					
					<!-- 1. 非我的课程 -->
					<view class="content_1" v-for="(item, index) in content" :key="index + 'cb'" v-show="all_show" @click="godetails(item.p_id, item.buy)">
						<!-- 上部分 -->
						<view class="top"><image :src="item.p_thumb" class="topimage"></image></view>				
						<!-- 下部分 -->
						<view class="bottom">
							<view class="title">
								<view class="icon1" v-show="item.p_type == 1">
									<image src="../../static/icons/courses_icon1.png" mode="widthFix"></image>
									<span class="video">直播</span>
								</view>
								<view class="icon3" v-show="item.p_type == 2">
									<image src="../../static/courses_through.png" mode="widthFix"></image>
									<span class="video">闯关</span> 
								</view>
								<view class="icon4" v-show="item.p_type == 3">
									<image src="../../static/courses_product.png" mode="widthFix"></image>
									<span class="video">产品</span>
								</view> 
								<view class="icon2" v-show="item.p_type == 4 || item.p_type == 5">
									<image src="../../static/icons/courses_icon3.png" mode="widthFix"></image>
									<span class="video">课程</span>
								</view>
								<!-- <view class="icon5" v-show="item.p_type == 5">
									<image src="../../static/icons/courses_icon2.png" mode="widthFix"></image>
									<span class="video">曲谱</span>
								</view> -->
								<view class="font">{{ item.p_title }}</view>
							</view>
							<view class="text">{{ item.p_desc }}</view>
							<view class="price" v-show="item.buy == 1">已购买</view>
							<view class="price" v-show="item.buy == 0">￥{{ item.p_price }}</view>
						</view>
					</view>
					
					<!-- 2. 我的课程 -->
					<view class="content_1" v-for="(item, index) in mycontent" :key="index + 'c2'" v-show="mycus_show" @click="getlivecus(item.p_id, item.p_type, item.buy)">
						<view class="top"><image :src="item.p_thumb" mode="widthFix"></image></view>
						<view class="bottom">
							<view class="title">
								<view class="icon1" v-show="item.p_type == 1">
									<image src="../../static/icons/courses_icon1.png" mode="widthFix"></image>
									<span class="video">直播</span>
								</view>
								<view class="icon2" v-show="item.p_type == 4">
									<image src="../../static/icons/courses_icon2.png" mode="widthFix"></image>
									<span class="video">视频</span>
								</view>
								<view class="icon3" v-show="item.p_type == 2">
									<image src="../../static/courses_through.png" mode="widthFix"></image>
									<span class="video">闯关</span>
								</view> 
								<view class="icon4" v-show="item.p_type == 3">
									<image src="../../static/courses_product.png" mode="widthFix"></image>
									<span class="video">产品</span>
								</view>
								<view class="icon5" v-show="item.p_type == 5">
									<image src="../../static/icons/courses_icon3.png" mode="widthFix"></image>
									<span class="video">曲谱</span>
								</view>
								<view class="font">{{ item.p_title }}</view>
							</view>
							<view class="text">{{ item.p_desc }}</view>
							<view class="price">已购买</view>
						</view>
					</view>
				</view>
			</scroll-view>
			<!-- 视频课程（默认无购买课程） -->
			<view class="content_4">
				<view class="null" v-if="mycontent == []">
					<image src="../../static/courses_nocus.png" mode=""></image>
					<view class="text">暂无课程</view>
					<view class="btn" @click="buy">购买课程</view>
				</view>
				<!-- 4.2 直播课程 -->
				<view class="live_cus" v-for="(item, index) in live" :key="index" v-show="live_show">
					<view class="class">
						<view class="title">{{ item.g_name }}</view>
						<view class="status" v-if="item.s_status == 1" :class="{ status1: item.s_status == 1 }">正在上课</view>
						<view class="status" v-if="item.s_status == 2" :class="{ status2: item.s_status == 2 }">未上课</view>
						<view class="status" v-if="item.s_status == 3" :class="{ status3: item.s_status == 3 }">已上课</view>
						<view class="text">
							<view class="teacher">直播教师：{{ item.u_name }}</view>
							<view class="date">直播日期：{{ item.s_date }}</view>
							<view class="time">直播时间：{{ item.s_starttime }}-{{ item.s_endtime }}</view>
						</view>
						<view class="learn" v-if="current2 == 0" @click="golive(item.s_id)">开始学习</view>
						<view class="over" v-if="current2 == 1"><image src="../../static/courses_over.png" mode="heightFix"></image></view>
					</view>
				</view>
			</view>
			<div class="goback" @click="goback"><image src="@/static/goback.png" mode="widthFix"></image></div>
	</view>
</template>

<script>
// 引入图片
export default {
	data() {
		return {
			globalData: getApp().globalData, //全局数据
			current: 0,
			current2: 0,
			page: 1, //当前页数
			limit: '9999', //数据量
			lastpage: '', //最终页
			total: '', // 数据总量
			pageNum: '', // 每页数据量
			scrollWidth: '', // 移动宽度
			id: '', //分类id
			p_id: '', // 课程id
			scrollleft: 0, //滚动距离
			tab: [],
			// 全部课程
			content: [],
			mycontent: [], // 我的课程
			livetype: 'present', //直播课类型（默认为当前直播）
			animationData: {},
			live: [],
			all_show: true, // 全部课程
			live_show: false,
			mycus_show: false,
			changelive_show: false,
			option:{},
			options:'',
			nullShow: false,
		};
	},
	onLoad(option) {
		this.option = option.index
		this.p_id = option.id;
		this.getcurriculum();
		// this.getmycus();
		this.liveClass()
	},
	onShow() { 
		var animation = uni.createAnimation({
			duration: 1000,
			timingFunction: 'ease'
		});
		this.animation = animation;
	},
	methods: {
		//首页课程
		getcurriculum() {
			if (this.globalData.width > 1926) {
				this.pageNum = 5
			} else if (this.globalData.width < 1005) {
				this.pageNum = 3
			}else {
				this.pageNum = 4
			}
			this.$request({
				url: '/piano/aicourse/index.html',
				method: 'POST',
				data: {
					page: this.page,
					id: this.id,
					limit: this.limit
				}
			}).then(res => {
				if(this.page==1){
					this.content = res.data.other.data
				}else{
					this.content = res.data.other.data.concat(this.content);
				}
				this.total = this.content.length; //数据总量
				this.lastpage = Math.ceil(this.total/this.pageNum) ; //总页数
				// console.log(this.total,this.lastpage)
				this.page = res.data.other.current_page;
				this.tab = res.data.data
				this.tab.splice(0,0,{ c_name: '全部' })
				this.tab.splice(res.data.data.length,0,{ c_name: '我的课程' })
				// 移动宽度
				if(this.globalData.width>1926){
					this.scrollWidth = 2070
				}
				if(this.globalData.width>1656 && this.globalData.width<1925){
					this.scrollWidth = 1640
				}
				if(this.globalData.width>1286 && this.globalData.width<1655){
					this.scrollWidth = 1420
				}
				if(this.globalData.width>1006 && this.globalData.width<1285){
					this.scrollWidth = 1045
				}
				if(this.globalData.width<1005){
					this.scrollWidth = 790
				}
			});
		}, 
		//大师直播课
		liveClass(){
			if(this.option){
				this.current = 3
				setTimeout(()=>{
					this.id=this.tab[3].c_id
					this.getcurriculum()
				},400)
			}
		},
		// 我的课程
		getmycus() {
			this.$request({
				url: '/piano/center/myCourse.html',
				method: 'POST',
			}).then(res => {
				this.mycontent = res.data.data.data;
				this.live = res.data.data.data;
				this.page = res.data.data.current_page;
				this.lastpage = res.data.data.last_page;
				if(this.mycontent.length == 0){
					this.nullShow = true
				}else{
					this.nullShow = false
				}
			});
		},
		// 点击我的课程
		getlivecus(p_id, p_type, buy) {
			// 如果是直播课程，则显示直播课程列表
			if (p_type == 1) {
				// 获取直播排课数据
				this.$request({
					url: '/piano/center/myLive.html',
					method: 'POST',
					data: {
						type: this.livetype,
						p_id: p_id
					}
				}).then(res => { 
					this.live = res.data.data.data;
					this.page = res.data.data.current_page;
					this.lastpage = res.data.data.last_page;
					this.mycus_show = false;
					this.live_show = true;
					this.changelive_show = true;
				});
			}
			// 否则跳转至课程详情页面
			else  {
				uni.navigateTo({
					url: '/pages/details/details?id=' + p_id + '&buy=' + buy
				});
			}
		},
		// 切换顶部导航栏按钮
		chooseTab(index, id) {
			this.current = index;
			this.page = 1;
			// this.animation.translateX(0).step({ duration: 10 });
			// this.animationData = this.animation.export();
			// 切换至我的课程
			if (index == this.tab.length-1) {
				this.getmycus();
				this.all_show = false;
				this.mycus_show = true;
				this.live_show = false;
				this.changelive_show = false;
				// 如果未登录，跳转至登录页登录
				if (getApp().globalData.login !== true) {
					uni.navigateTo({
						url: '/pages/login/login'
					});
				}
			}
			// 切换至其它课程
			else{
				if (id) { 
					this.id = id;
					this.getcurriculum();
				} else {
					this.id = '';
					this.getcurriculum();
				}
				this.all_show = true;
				this.mycus_show = false;
				this.live_show = false;
				this.changelive_show = false;
			}
		},
		// 返回上一步
		goback() {
			uni.navigateTo({
				url:'/pages/index/index?name=' + 'courses',
				animationType: 'fade-in',
				animationDuration: 200,
			});
		},
		// 跳转到直播页
		golive(s_id) {
			uni.navigateTo({
				url: '/pages/live/live?id=' + s_id,
			});
		},
		// 跳转到课程详情页
		godetails(id, buy) {
			uni.navigateTo({
				url: '/pages/details/details?id=' + id + '&buy=' + buy
			});
		},
		buy() {
			uni.navigateTo({
				url: '/pages/courses/courses'
			});
		},
		//上一页
		pre(){
			this.page--
			this.scrollleft = this.scrollleft - this.scrollWidth
		},
	    //下一页
		next(){
			this.page++
			this.scrollleft = this.scrollleft + this.scrollWidth
		},
		//滚动加载
		scrollright(){},
	}
};
</script>

<style scoped>
@media screen and (min-width: 2560px) {
	* {
		margin: 0px;
		padding: 0px;
	}
	.courses {
		width: 2560px;
		height: 720px;
		overflow: hidden;
		background-color: #0a1050;
		position: relative;
	}
	.tabbar {
		margin-left: 255px;
	}
	.tab {
		float: left;
		margin-top: 70px;
		border-radius: 28px;
		padding: 10px 37px;
	}
	.tab .list {
		font-size: 24px;
		font-weight: bold;
	}
	.cur {
		background-color: #0077f1;
	}
	.choose_course {
		display: flex;
		margin-top: 87px;
		margin-left: 300px;
	}
	.choose_course .kuang {
		width: 23px;
		height: 23px;
		border: 1px solid #ffffff;
		border-radius: 4px;
		margin-left: 60px;
	}
	.choose_course image {
		width: 23px;
		height: 17px;
		margin-top: 3px;
	}
	.choose_course .text {
		font-size: 24px;
		margin-left: 15px;
		margin-top: -7px;
	}
	.top_right {
		margin-top: -10px;
		display: flex;
		font-size: 22px;
		margin-left: 610px;
	}
	.my_courses {
		padding: 10px 37px;
		background-color: #fff;
		border-radius: 28px;
		color: #000000;
		position: absolute;
		top: 70px;
		right: 480px;
	}
	.his_courses {
		margin-left: 30px;
		padding: 10px 37px;
		border-radius: 28px;
		background-color: #fff;
		color: #000000;
		position: absolute;
		top: 70px;
		right: 270px;
	}
	.cur2 {
		background-color: #0077f1;
		color: #fff;
	}
	.pre image,
	.next image {
		width: 96px;
		height: 96px;
		position: absolute;
		top: 347px;
	}
	.pre image {
		left: 138px;
	}
	.next image {
		right: 138px;
	}
	/* 1. 全部课程 */
	.scroll-view_H {
		width: 2050px;
		margin-left: 250px;
		display: flex;
	}
	.content {
		width: 2060px;
		margin: 0 auto;
		display: flex;
		height: 600px;
	}
	.content_1 {
		margin-top: 50px;
		width: 378px;
		height: 425px;
		background-color: #1a3883;
		margin-right: 35px;
		offset: 5px;
		border: 2px solid #079fff;
		border-radius: 10px;
		position: relative;
		-webkit-box-reflect: below 20px -webkit-linear-gradient(transparent 20%, transparent 90%, rgba(255, 255, 255, 0.6));
	}
	.top image {
		width: 378px;
		height: 224px;
		border-radius: 4px;
	}
	.bottom .title {
		display: flex;
	}
	.bottom .title .icon1,
	.bottom .title .icon2,
	.bottom .title .icon3,
	.bottom .title .icon4,
	.bottom .title .icon5{
		width: 76px;
		height: 26px;
		text-align: center;
		padding: 2px 2px;
		position: relative;
		border-radius: 13px;
		height: 26px;
		line-height: 26px;
		margin: 19px 15px 5px 15px;
	}
	.bottom .title .icon1 {
		background-color: #e03e5b;
	}
	.bottom .title .icon2 {
		background-color: #29c210;
	}
	.bottom .title .icon3 {		
		background-color: #ba29f0;
	}
	.bottom .title .icon4 {
		background-color: #f7a900;
	}
	.bottom .title .icon5 {
		background-color: #2194FF;
	}
	.bottom .title image {
		width: 21px;
		height: 17px;
		top: 4px;
	}
	.bottom .title .video {
		font-size: 20px;
		padding-left: 5px;
	}
	.bottom .title .font {
		font-size: 20px;
		font-weight: bold;
		overflow: hidden;
		margin-top: 19px;
		width: 240px;
		height: 53px;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	.bottom .text {
		font-size: 16px;
		margin-top: 10px;
		margin-left: 17px;
		width: 350px;
		color: #bbd9ff;
		overflow: hidden;
		text-overflow: -o-ellipsis-lastline;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical; /* autoprefixer: ignore next */
	}
	.bottom .price {
		font-size: 20px;
		top: 380px;
		left: 17px;
		color: #ff0000;
		position: absolute;
	}

	/* 我的课程 */
	.content_4 {
		width: 2100px;
		margin-left: 250px;
		/* display: flex; */
		float: left;
		margin-top: -550px;
		position: relative;
	}
	.null {
		text-align: center;
	}
	.null .img {
		width: 444px;
		height: 302px;
		opacity: 0.5;
		float: left;
		margin: 50px 0px 50px 830px;
	}
	.null image {
		width: 444px;
		height: 302px;
		opacity: 0.5;
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
		top: 300px;
		left: 860px;
	}
	.null .btn {
		width: 132px;
		height: 29px;
		border: 2px solid #ffffff;
		border-radius: 35px;
		font-size: 31px;
		padding: 8px 45px 25px;
		position: absolute;
		top: 400px;
		left: 940px;
	}

	.btn image {
		width: 21px;
		height: 25px;
		margin-top: 8px;
		margin-left: 26px;
		float: left;
	}
	.btn span {
		font-size: 21px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		color: #ffffff;
		margin-left: -12px;
		float: left;
	}
	.video_cus {
		float: left;
		width: 378px;
		height: 425px;
		background-color: #1a3883;
		margin-right: 35px;
		offset: 5px;
		border: 2px solid #079fff;
		border-radius: 10px;
		-webkit-box-reflect: below 20px -webkit-linear-gradient(transparent 20%, transparent 90%, rgba(255, 255, 255, 0.6));
	}
	/* 4.2 直播课程 */
	.live_cus .class {
		float: left;
		width: 478px;
		height: 210px;
		background: url('../../static/courses_bg2.png') no-repeat;
		position: relative;
		margin-right: 43px;
		margin-bottom: 32px;
	}
	.class .title {
		width: 183px;
		height: 23px;
		font-size: 24px;
		float: left;
		margin-left: 23px;
		margin-top: 20px;
		padding-bottom: 5px;
	}
	.class .status {
		font-size: 15px;
		float: left;
		margin-top: 25px;
		padding: 3px 12px;
		border-radius: 12px;
	}
	.status1 {
		background-color: #ffa800;
	}
	.status2 {
		background-color: #219631;
	}
	.status3 {
		background-color: #838383;
	}
	.class .text {
		margin-left: 23px;
		float: left;
		margin-top: 25px;
		font-size: 18px;
		color: #bbd9ff;
	}
	.class .teacher,
	.class .date,
	.class .time {
		padding-bottom: 15px;
	}
	.class .learn {
		font-size: 21px;
		position: absolute;
		top: 135px;
		right: 24px;
		padding: 8px 23px;
		border: 2px solid #fff;
		border-radius: 30px;
	}
	.class .over image {
		width: 106px;
		height: 106px;
		position: absolute;
		top: 85px;
		right: 20px;
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
	.topimage{
		width: 374px;
		height: 224px;
	}
}
@media screen and (max-width: 1925px) and (min-width: 1656px) {
	* {
		margin: 0px;
		padding: 0px;
	}
	.courses {
		width: 1920px;
		height: 1080px;
		overflow: hidden;
		background-color: #0a1050;
		position: relative;
	}
	.tabbar { 
		margin-left: 140px;
		margin-top: 80px;
	}
	.tab {
		float: left;
		margin-top: 70px;
		border-radius: 28px;
		padding: 10px 37px;
		margin-bottom: 80px;
	}
	.tab .list {
		font-size: 24px;
		font-weight: bold;
	}
	.cur {
		background-color: #0077f1;
	}
	.choose_course {
		display: flex;
		margin-top: 170px;
		margin-left: 300px;
	}
	.choose_course .kuang {
		width: 23px;
		height: 23px;
		border: 1px solid #ffffff;
		border-radius: 4px;
		margin-left: 60px;
	}
	.choose_course image {
		width: 23px;
		height: 17px;
		margin-top: 3px;
	}
	.choose_course .text {
		font-size: 24px;
		margin-left: 15px;
		margin-top: -7px;
	}
	.top_right {
		margin-top: -10px;
		display: flex;
		font-size: 22px;
		margin-left: 200px;
	}
	.my_courses {
		padding: 10px 37px;
		background-color: #fff;
		border-radius: 28px;
		color: #000000;
	}
	.his_courses {
		margin-left: 30px;
		padding: 10px 37px;
		border-radius: 28px;
		background-color: #fff;
		color: #000000;
	}
	.cur2 {
		background-color: #0077f1;
		color: #fff;
	}
	.pre image,
	.next image {
		width: 96px;
		height: 96px;
		position: absolute;
		top: 520px;
	}
	.pre image {
		left: 50px;
	}
	.next image {
		right: 50px;
	}
	/* 1. 全部课程 */
	.scroll-view_H {
		width: 1620px;
		margin-left: 145px;
		display: flex;
	}
	.content {
		margin: 0 auto;
		display: flex;
		height: 600px;
	}
	.content_1 {
		margin-top: 50px;
		width: 378px;
		height: 425px;
		background-color: #1a3883;
		margin-right: 30px;
		offset: 5px;
		border: 2px solid #079fff;
		border-radius: 10px;
		position: relative;
		-webkit-box-reflect: below 20px -webkit-linear-gradient(transparent 20%, transparent 90%, rgba(255, 255, 255, 0.6));
	}
	.top image {
		width: 378px;
		height: 224px;
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
	}
	.bottom .title {
		display: flex;
	}
	.bottom .title .icon1,
	.bottom .title .icon2,
	.bottom .title .icon3,
	.bottom .title .icon4,
	.bottom .title .icon5 {
		width: 76px;
		height: 26px;
		text-align: center;
		padding: 2px 2px;
		position: relative;
		border-radius: 13px;
		height: 26px;
		line-height: 26px;
		margin: 19px 15px 5px 15px;
	}
	.bottom .title .icon1 {
		background-color: #e03e5b;
	}
	.bottom .title .icon2 {
		background-color: #29c210;
	}
	.bottom .title .icon3 {		
		background-color: #ba29f0;
	}
	.bottom .title .icon4 {
		background-color: #f7a900;
	}
	.bottom .title .icon5 {
		background-color: #2194FF;
	}
	.bottom .title image {
		width: 21px;
		height: 17px;
		top: 4px;
	}
	.bottom .title .video {
		font-size: 14px;
		padding-left: 5px;
	}
	.bottom .title .font {
		font-size: 20px;
		font-weight: bold;
		overflow: hidden;
		margin-top: 19px;
		width: 240px;
		height: 53px;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	.bottom .text {
		font-size: 16px;
		margin-top: 10px;
		margin-left: 17px;
		width: 350px;
		color: #bbd9ff;
		overflow: hidden;
		text-overflow: -o-ellipsis-lastline;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical; /* autoprefixer: ignore next */
	}
	.bottom .price {
		font-size: 20px;
		top: 380px;
		left: 17px;
		color: #ff0000;
		position: absolute;
	}

	/* 我的课程 */
	.content_4 {
		width: 1800px;
		margin-left: 200px;
		float: left;
		margin-top: -600px;
		position: relative;
	}
	.null {
		margin: 100px 0px 50px 550px;
	}
	.null image {
		width: 444px;
		height: 302px;
		opacity: 0.5;
	}
	.null img {
		width: 444px;
		height: 302px;
		opacity: 0.5;
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
		top: 350px;
		left: 600px;
	}
	.null .btn {
		width: 132px;
		height: 29px;
		border: 2px solid #ffffff;
		border-radius: 35px;
		font-size: 31px;
		padding: 8px 45px 25px;
		position: absolute;
		top: 480px;
		left: 670px;
	}

	.btn image {
		width: 21px;
		height: 25px;
		margin-top: 8px;
		margin-left: 26px;
		float: left;
	}
	.btn span {
		font-size: 21px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		color: #ffffff;
		margin-left: -12px;
		float: left;
	}
	.video_cus {
		float: left;
		width: 378px;
		height: 425px;
		background-color: #1a3883;
		margin-right: 35px;
		offset: 5px;
		border: 2px solid #079fff;
		border-radius: 10px;
		-webkit-box-reflect: below 20px -webkit-linear-gradient(transparent 20%, transparent 90%, rgba(255, 255, 255, 0.6));
	}
	/* 4.2 直播课程 */
	.live_cus .class {
		float: left;
		width: 478px;
		height: 210px;
		background: url('../../static/courses_bg2.png') no-repeat;
		position: relative;
		margin-right: 43px;
		margin-bottom: 32px;
	}
	.class .title {
		width: 183px;
		height: 23px;
		font-size: 24px;
		float: left;
		margin-left: 23px;
		margin-top: 20px;
		padding-bottom: 5px;
	}
	.class .status {
		font-size: 15px;
		float: left;
		margin-top: 25px;
		padding: 3px 12px;
		background-color: #ffa800;
		border-radius: 12px;
	}
	.status2 {
		background-color: #219631;
		border-radius: 12px;
		padding: 3px 12px;
	}
	.status3 {
		background-color: #838383;
		padding: 3px 12px;
		border-radius: 12px;
	}
	.class .text {
		margin-left: 23px;
		float: left;
		margin-top: 25px;
		font-size: 18px;
		color: #bbd9ff;
	}
	.class .teacher,
	.class .date,
	.class .time {
		padding-bottom: 15px;
	}
	.class .learn {
		font-size: 21px;
		position: absolute;
		top: 135px;
		right: 24px;
		padding: 8px 23px;
		border: 2px solid #fff;
		border-radius: 30px;
	}
	.class .over image {
		width: 106px;
		height: 106px;
		position: absolute;
		top: 85px;
		right: -80px;
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
	* {
		margin: 0px;
		padding: 0px;
	}
	.courses {
		width: 100%;
		height: 100%;
		overflow: hidden;
		background-color: #0a1050;
		position: relative;
	}
	.tabbar {
		margin-left: 120px;
		margin-top: 80px;
	}
	.tab {
		float: left;
		margin-top: 70px;
		border-radius: 28px;
		padding: 10px 37px;
		margin-bottom: 30px;
	}
	.tab .list {
		font-size: 18px;
		font-weight: bold;
	}
	.cur {
		background-color: #0077f1;
	}
	.choose_course {
		display: flex;
		margin-top: 170px;
		margin-left: 300px;
	}
	.choose_course .kuang {
		width: 23px;
		height: 23px;
		border: 1px solid #ffffff;
		border-radius: 4px;
		margin-left: 60px;
	}
	.choose_course image {
		width: 23px;
		height: 17px;
		margin-top: 3px;
	}
	.choose_course .text {
		font-size: 24px;
		margin-left: 15px;
		margin-top: -7px;
	}
	.top_right {
		margin-top: -55px;
		display: flex;
		font-size: 15px;
		margin-left: 80px;
	}
	.my_courses {
		height: 10px;
		padding: 10px 37px 20px;
		background-color: #fff;
		border-radius: 28px;
		color: #000000;
	}
	.his_courses {
		height: 10px;
		margin-left: 30px;
		padding: 10px 37px 20px;
		border-radius: 28px;
		background-color: #fff;
		color: #000000;
	}
	.cur2 {
		background-color: #0077f1;
		color: #fff;
	}
	.pre image,
	.next image {
		width: 90px;
		height: 90px;
		position: absolute;
		top: 420px;
	}
	.pre image {
		left: 20px;
	}
	.next image {
		right: 20px;
	}
	/* 1. 全部课程 */
	.scroll-view_H {
		width: 1400px;
		margin-left: 125px;
		display: flex;
	}
	.content {
		margin: 0 auto;
		display: flex;
		height: 600px;
	}
	.content_1 {
		margin-top: 20px;
		width: 330px;
		height: 400px;
		background-color: #1a3883;
		margin-right: 20px;
		offset: 5px;
		border: 2px solid #079fff;
		border-radius: 10px;
		position: relative;
		-webkit-box-reflect: below 20px -webkit-linear-gradient(transparent 20%, transparent 90%, rgba(255, 255, 255, 0.6));
	}
	.top image {
		width: 330px;
		height: 200px;
		border-top-left-radius: 15px;
		border-top-right-radius: 15px;
	}
	.bottom .title {
		display: flex;
	}
	.bottom .title .icon1,
	.bottom .title .icon2,
	.bottom .title .icon3,
	.bottom .title .icon4,
	.bottom .title .icon5 {
		width: 76px;
		height: 26px;
		text-align: center;
		padding: 2px 2px;
		position: relative;
		border-radius: 13px;
		height: 26px;
		line-height: 26px;
		margin: 19px 15px 5px 15px;
	}
	.bottom .title .icon1 {
		background-color: #e03e5b;
	}
	.bottom .title .icon2 {
		background-color: #29c210;
	}
	.bottom .title .icon3 {		
		background-color: #ba29f0;
	}
	.bottom .title .icon4 {
		background-color: #f7a900;
	}
	.bottom .title .icon5 {
		background-color: #2194FF;
	}
	.bottom .title image {
		width: 21px;
		height: 17px;
		top: 4px;
	}
	.bottom .title .video {
		font-size: 14px;
		padding-left: 5px;
	}
	.icon3{
		margin-top: 18px;
		margin-left: 5px;
		width: 80px;
	}
	.bottom .title .font {
		font-size: 20px;
		font-weight: bold;
		overflow: hidden;
		margin-top: 19px;
		width: 320px;
		height: 53px;
		white-space: nowrap;
		text-overflow: ellipsis;
		/* border: 1px solid #fff; */
	}
	.bottom .text {
		font-size: 16px;
		margin-top: 10px;
		margin-left: 17px;
		width: 300px;
		color: #bbd9ff;
		overflow: hidden;
		text-overflow: -o-ellipsis-lastline;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical; /* autoprefixer: ignore next */
	}
	.bottom .price {
		font-size: 20px;
		top: 360px;
		left: 17px;
		color: #ff0000;
		position: absolute;
	}
	
	/* 我的课程 */
	.content_4 {
		width: 80%;
		margin-left: 100px;
		float: left;
		margin-top: -600px;
		position: relative;
	}
	.null {
		margin: 100px 0px 50px 500px;
	}
	.null image {
		width: 444px;
		height: 302px;
		opacity: 0.5;
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
		top: 350px;
		left: 550px;
	}
	.null .btn {
		width: 132px;
		height: 29px;
		border: 2px solid #ffffff;
		border-radius: 35px;
		font-size: 31px;
		padding: 8px 45px 25px;
		position: absolute;
		top: 480px;
		left: 670px;
	}
	.btn image {
		width: 21px;
		height: 25px;
		margin-top: 8px;
		margin-left: 26px;
		float: left;
	}
	.btn span {
		font-size: 21px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		color: #ffffff;
		margin-left: -12px;
		float: left;
	}
	.video_cus {
		float: left;
		width: 378px;
		height: 425px;
		background-color: #1a3883;
		margin-right: 35px;
		offset: 5px;
		border: 2px solid #079fff;
		border-radius: 10px;
		-webkit-box-reflect: below 20px -webkit-linear-gradient(transparent 20%, transparent 90%, rgba(255, 255, 255, 0.6));
	}
	/* 4.2 直播课程 */
	.live_cus .class {
		float: left;
		width: 30%;
		height: 190px;
		background-color: #1c4090;
		border-radius: 12px;
		border: 2px solid #0077f1;
		position: relative;
		/* margin-right: 5px; */
		margin-bottom: 32px;
		margin-left: 30px;
	}
	.class .title {
		width: 130px;
		height: 23px;
		font-size: 20px;
		float: left;
		margin-left: 23px;
		margin-top: 20px;
		padding-bottom: 5px;
	}
	.class .status {
		font-size: 15px;
		float: left;
		margin-top: 20px;
		margin-left: 10px;
		padding: 3px 12px;
		background-color: #ffa800;
		border-radius: 12px;
	}
	.status2 {
		background-color: #219631;
		border-radius: 12px;
		padding: 3px 12px;
	}
	.status3 {
		background-color: #838383;
		padding: 3px 12px;
		border-radius: 12px;
	}
	.class .text {
		margin-left: 23px;
		float: left;
		margin-top: 25px;
		font-size: 12px;
		color: #bbd9ff;
	}
	.class .teacher,
	.class .date,
	.class .time {
		padding-bottom: 15px;
	}
	.class .learn {
		font-size: 15px;
		position: absolute;
		top: 135px;
		right: 20px;
		padding: 4px 15px;
		border: 2px solid #fff;
		border-radius: 30px;
	}
	.class .over image {
		width: 70px;
		height: 70px;
		position: absolute;
		top: 105px;
		right: 20px;
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
@media screen and (max-width: 1285px) and (min-width: 1006px){
	* {
		margin: 0px;
		padding: 0px;
	}
	.courses {
		width: 100%;
		height: 100%;
		overflow: hidden;
		background-color: #0a1050;
		position: relative;
	}
	.tabbar {
		margin-left: 120px;
		margin-top: 40px;
	}
	.tab {
		float: left;
		margin-top: 70px;
		border-radius: 28px;
		padding: 10px 37px;
		margin-bottom: 30px;
	}
	.tab .list {
		font-size: 18px;
		font-weight: bold;
	}
	.cur {
		background-color: #0077f1;
	}
	.choose_course {
		display: flex;
		margin-top: 170px;
		margin-left: 300px;
	}
	.choose_course .kuang {
		width: 23px;
		height: 23px;
		border: 1px solid #ffffff;
		border-radius: 4px;
		margin-left: 60px;
	}
	.choose_course image {
		width: 23px;
		height: 17px;
		margin-top: 3px;
	}
	.choose_course .text {
		font-size: 24px;
		margin-left: 15px;
		margin-top: -7px;
	}
	.top_right {
		margin-top: -55px;
		display: flex;
		font-size: 15px;
		margin-left: 80px;
	}
	.my_courses {
		height: 10px;
		padding: 10px 37px 20px;
		background-color: #fff;
		border-radius: 28px;
		color: #000000;
	}
	.his_courses {
		height: 10px;
		margin-left: 30px;
		padding: 10px 37px 20px;
		border-radius: 28px;
		background-color: #fff;
		color: #000000;
	}
	.cur2 {
		background-color: #0077f1;
		color: #fff;
	}
	.pre image,
	.next image {
		width: 70px;
		height: 70px;
		position: absolute;
		top:350px;
	}
	.pre image {
		left: 50px;
	}
	.next image {
		right: 50px;
	}
	/* 1. 全部课程 */
	.scroll-view_H {
		width: 1030px;
		margin-left: 122px;
		display: flex;
	}
	.content {
		margin: 0 auto;
		display: flex;
		height: 600px;
	}
	.content_1 {
		margin-top: 20px;
		width: 230px;
		height: 350px;
		background-color: #1a3883;
		margin-right: 30px;
		offset: 5px;
		border: 2px solid #079fff;
		border-radius: 10px;
		position: relative;
		-webkit-box-reflect: below 20px -webkit-linear-gradient(transparent 20%, transparent 90%, rgba(255, 255, 255, 0.6));
	}
	.top image {
		width: 230px;
		height: 155px;
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
	}
	.bottom .title {
		display: flex;
	}
	.bottom .title .icon1,
	.bottom .title .icon2,
	.bottom .title .icon3,
	.bottom .title .icon4,
	.bottom .title .icon5 {
		width: 80px;
		height: 24px;
		text-align: center;
		padding: 2px 2px;
		position: relative;
		border-radius: 13px;
		line-height: 26px;
		margin: 5px 15px 0px 5px;
	}
	.bottom .title .icon1 {
		background-color: #e03e5b;
	}
	.bottom .title .icon2 {
		background-color: #29c210;
	}
	.bottom .title .icon3 {		
		background-color: #ba29f0;
	}
	.bottom .title .icon4 {
		background-color: #f7a900;
	}
	.bottom .title .icon5 {
		background-color: #2194FF;
	}
	.bottom .title image {
		width: 12px;
		height: 8px;
		top: 1px;
	}
	.bottom .title .video {
		font-size: 12px;
		margin-left: 5px;
	}
	.bottom .title .font {
		font-size: 14px;
		font-weight: bold;
		overflow: hidden;
		margin-top: 10px;
		margin-left: -8px;
		width: 220px;
		height: 53px;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	.bottom .text {
		font-size: 12px;
		margin-top: -10px;
		margin-left: 5px;
		width: 200px;
		color: #bbd9ff;
		overflow: hidden;
		text-overflow: -o-ellipsis-lastline;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical; /* autoprefixer: ignore next */
	}
	.bottom .price {
		font-size: 14px;
		top: 310px;
		left: 17px;
		color: #ff0000;
		position: absolute;
	}

	/* 我的课程 */
	.content_4 {
		width: 80%;
		margin-left: 100px;
		float: left;
		margin-top: -600px;
		position: relative;
	}
	.null {
		margin: 50px 0px 50px 330px;
	}
	.null image {
		width: 344px;
		height: 202px;
		opacity: 0.5;
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
		top: 250px;
		left: 320px;
	}
	.null .btn {
		width: 132px;
		height: 29px;
		border: 2px solid #ffffff;
		border-radius: 35px;
		font-size: 31px;
		padding: 8px 45px 25px;
		position: absolute;
		top: 480px;
		left: 670px;
	}
	.btn image {
		width: 21px;
		height: 25px;
		margin-top: 8px;
		margin-left: 26px;
		float: left;
	}
	.btn span {
		font-size: 21px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		color: #ffffff;
		margin-left: -12px;
		float: left;
	}
	.video_cus {
		float: left;
		width: 378px;
		height: 425px;
		background-color: #1a3883;
		margin-right: 35px;
		offset: 5px;
		border: 2px solid #079fff;
		border-radius: 10px;
		-webkit-box-reflect: below 20px -webkit-linear-gradient(transparent 20%, transparent 90%, rgba(255, 255, 255, 0.6));
	}
	/* 4.2 直播课程 */
	.live_cus .class {
		float: left;
		width: 30%;
		height: 190px;
		background-color: #1c4090;
		border-radius: 12px;
		border: 2px solid #0077f1;
		position: relative;
		/* margin-right: 5px; */
		margin-bottom: 32px;
		margin-left: 30px;
	}
	.class .title {
		width: 130px;
		height: 23px;
		font-size: 20px;
		float: left;
		margin-left: 23px;
		margin-top: 20px;
		padding-bottom: 5px;
	}
	.class .status {
		font-size: 15px;
		float: left;
		margin-top: 20px;
		margin-left: 10px;
		padding: 3px 12px;
		background-color: #ffa800;
		border-radius: 12px;
	}
	.status2 {
		background-color: #219631;
		border-radius: 12px;
		padding: 3px 12px;
	}
	.status3 {
		background-color: #838383;
		padding: 3px 12px;
		border-radius: 12px;
	}
	.class .text {
		margin-left: 23px;
		float: left;
		margin-top: 25px;
		font-size: 12px;
		color: #bbd9ff;
	}
	.class .teacher,
	.class .date,
	.class .time {
		padding-bottom: 15px;
	}
	.class .learn {
		font-size: 15px;
		position: absolute;
		top: 135px;
		right: 20px;
		padding: 4px 15px;
		border: 2px solid #fff;
		border-radius: 30px;
	}
	.class .over image {
		width: 70px;
		height: 70px;
		position: absolute;
		top: 105px;
		right: 20px;
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
	* {
		margin: 0px;
		padding: 0px;
	}
	.courses {
		width: 100%;
		height: 100%;
		overflow: hidden;
		background-color: #0a1050;
		position: relative;
	}
	.tabbar {
		margin-left: 50px;
		margin-top: 40px;
	}
	.tab {
		float: left;
		margin-top: 50px;
		border-radius: 28px;
		padding: 5px 20px;
		margin-bottom: 20px;
	}
	.tab .list {
		font-size: 14px;
		font-weight: bold;
	}
	.cur {
		background-color: #0077f1;
	}	
	.pre image,
	.next image {
		width: 60px;
		height: 60px;
		position: absolute;
		top:300px;
	}
	.pre image {
		left: 50px;
	}
	.next image {
		right: 50px;
	}
	/* 1. 全部课程 */
	.scroll-view_H {
		width: 765px;
		margin-left: 117px;
		display: flex;
	}
	.content {
		margin: 0 auto;
		display: flex;
		height: 600px;
	}
	.content_1 {
		margin-top: 20px;
		width: 230px;
		height: 350px;
		background-color: #1a3883;
		margin-right: 30px;
		offset: 5px;
		border: 2px solid #079fff;
		border-radius: 10px;
		position: relative;
		-webkit-box-reflect: below 20px -webkit-linear-gradient(transparent 20%, transparent 90%, rgba(255, 255, 255, 0.6));
	}
	.top image {
		width: 230px;
		height: 155px;
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
	}
	.bottom .title {
		display: flex;
	}
	.bottom .title .icon1,
	.bottom .title .icon2,
	.bottom .title .icon3,
	.bottom .title .icon4,
	.bottom .title .icon5 {
		width: 80px;
		height: 24px;
		text-align: center;
		padding: 2px 2px;
		position: relative;
		border-radius: 13px;
		line-height: 26px;
		margin: 5px 15px 0px 5px;
	}
	.bottom .title .icon1 {
		background-color: #e03e5b;
	}
	.bottom .title .icon2 {
		background-color: #29c210;
	}
	.bottom .title .icon3 {		
		background-color: #ba29f0;
	}
	.bottom .title .icon4 {
		background-color: #f7a900;
	}
	.bottom .title .icon5 {
		background-color: #2194FF;
	}
	.bottom .title image {
		width: 12px;
		height: 8px;
		top: 1px;
	}
	.bottom .title .video {
		font-size: 12px;
		margin-left: 5px;
	}
	.bottom .title .font {
		font-size: 14px;
		font-weight: bold;
		overflow: hidden;
		margin-top: 10px;
		margin-left: -8px;
		width: 220px;
		height: 53px;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	.bottom .text {
		font-size: 12px;
		margin-top: -10px;
		margin-left: 5px;
		width: 200px;
		color: #bbd9ff;
		overflow: hidden;
		text-overflow: -o-ellipsis-lastline;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical; /* autoprefixer: ignore next */
	}
	.bottom .price {
		font-size: 14px;
		top: 310px;
		left: 17px;
		color: #ff0000;
		position: absolute;
	}

	/* 我的课程 */
	.content_4 {
		width: 80%;
		margin-left: 100px;
		float: left;
		margin-top: -600px;
		position: relative;
	}
	.null {
		margin: 50px 0px 50px 330px;
	}
	.null image {
		width: 344px;
		height: 202px;
		opacity: 0.5;
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
		top: 250px;
		left: 320px;
	}
	.null .btn {
		width: 132px;
		height: 29px;
		border: 2px solid #ffffff;
		border-radius: 35px;
		font-size: 31px;
		padding: 8px 45px 25px;
		position: absolute;
		top: 480px;
		left: 670px;
	}
	.btn image {
		width: 21px;
		height: 25px;
		margin-top: 8px;
		margin-left: 26px;
		float: left;
	}
	.btn span {
		font-size: 21px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		color: #ffffff;
		margin-left: -12px;
		float: left;
	}
	.video_cus {
		float: left;
		width: 378px;
		height: 425px;
		background-color: #1a3883;
		margin-right: 35px;
		offset: 5px;
		border: 2px solid #079fff;
		border-radius: 10px;
		-webkit-box-reflect: below 20px -webkit-linear-gradient(transparent 20%, transparent 90%, rgba(255, 255, 255, 0.6));
	}
	/* 4.2 直播课程 */
	.live_cus .class {
		float: left;
		width: 30%;
		height: 190px;
		background-color: #1c4090;
		border-radius: 12px;
		border: 2px solid #0077f1;
		position: relative;
		/* margin-right: 5px; */
		margin-bottom: 32px;
		margin-left: 30px;
	}
	.class .title {
		width: 130px;
		height: 23px;
		font-size: 20px;
		float: left;
		margin-left: 23px;
		margin-top: 20px;
		padding-bottom: 5px;
	}
	.class .status {
		font-size: 15px;
		float: left;
		margin-top: 20px;
		margin-left: 10px;
		padding: 3px 12px;
		background-color: #ffa800;
		border-radius: 12px;
	}
	.status2 {
		background-color: #219631;
		border-radius: 12px;
		padding: 3px 12px;
	}
	.status3 {
		background-color: #838383;
		padding: 3px 12px;
		border-radius: 12px;
	}
	.class .text {
		margin-left: 23px;
		float: left;
		margin-top: 25px;
		font-size: 12px;
		color: #bbd9ff;
	}
	.class .teacher,
	.class .date,
	.class .time {
		padding-bottom: 15px;
	}
	.class .learn {
		font-size: 15px;
		position: absolute;
		top: 135px;
		right: 20px;
		padding: 4px 15px;
		border: 2px solid #fff;
		border-radius: 30px;
	}
	.class .over image {
		width: 70px;
		height: 70px;
		position: absolute;
		top: 105px;
		right: 20px;
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
