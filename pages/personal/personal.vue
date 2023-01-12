<template>
	<view class="personal">
		<top></top>
		<!-- 左 -->
		<view class="person">
			<image :src="globalData.logindata.u_headimg"></image>
			<view class="text">你好，{{ globalData.logindata.u_nickname }}</view>
			<view class="edit" v-show="false">编辑资料</view>
			<view class="exit" @click="logout">退出登录</view>
		</view>
		<!-- 中 -->
		<view class="detail">
			<view class="left">
				<view class="left_top">
					<image src="@/static/icons/person_icon1.png" mode=""></image>
					<view class="font1">{{ rank.time }}</view>
					<view class="font2">累计练琴</view>
				</view>
				<view class="left_bottom">
					<image src="@/static/icons/person_icon2.png" mode=""></image>
					<view class="font1">{{ rank.numb }}</view>
					<view class="font2">敲击琴键</view>
				</view>
			</view>
			<view class="right">
				<view class="right_top">
					<image src="@/static/icons/person_icon3.png" mode=""></image>
					<view class="font1">{{ rank.figting }}</view>
					<view class="font2">打败全国用户</view>
				</view>
				<view class="right_bottom">
					<image src="@/static/icons/person_icon4.png" mode=""></image>
					<view class="font1">{{ rank.lv }}</view>
					<view class="font2">练琴等级</view>
				</view>
			</view>
		</view>
		<!-- 右 -->
		<view class="music">
			<scroll-view>
				<view class="tabbar">
					<!-- 导航栏列表 --> 
					<view class="list" v-for="(tab, index) in data" :key="index" @click="chooseTab(index)" :class="{ cur: current == index }">
						{{ tab.title }}
					</view>
				</view>
			</scroll-view>
			
			<!-- 练习课程列表 -->
			<scroll-view v-if="list.length > 0" class="row" scroll-y="true" show-scrollbar="true" @scrolltolower="pagecurs" lower-threshold="300px" scroll-with-animation="true" android:scrollbars="none">
				<view class="content" v-for="(item,index) in list" :key='index'>
					<span class="test1" :class="{ test5:item.type=='1', test2:item.type=='2', test3:item.type=='3', test4:item.type=='4'}"> {{item.tag}} </span>
					<span class="song"> {{item.name}} </span>
					<p> {{item.content}} </p>
				</view>			
			</scroll-view>
		</view>
		<div class="goback" @click="goback"><image src="@/static/goback.png" mode="widthFix"></image></div>
	</view>
</template>

<script>
export default {
	data() {
		return {
			globalData: getApp().globalData,
			// 练习课列表
			list: [],
			// 个人信息
			rank: [],
			//type值
			type: 'all',
			//当前页数
			page: 1,

			current: 0,
			data: [{ title: '全部' }, { title: '今日' }, { title: '昨日' }, { title: '本周' }, { title: '本月' }]
		};
	},
	onLoad() {
		this.getdata();
	},
	methods: {
		//返回到首页
		goback() {
			uni.navigateBack()
		},
		chooseTab(index) {
			this.current = index;
			if (index == 0) {
				this.type = 'all';
			} else if (index == 1) {
				this.type = 'today';
			} else if (index == 2) {
				this.type = 'yesterday';
			} else if (index == 3) {
				this.type = 'week';
			} else if (index == 4) {
				this.type = 'mouth';
			}
			this.getdata()
		},
		//退出账号
		logout() {
			//清除用户缓存
			uni.removeStorageSync('user');
			uni.removeStorageSync('tokenTime');
			//设置登录状态为false
			getApp().globalData.login = false;
			//全局用户信息为空
			getApp().globalData.logindata = '';
			//返回到上一页，并执行上一页方法
			uni.navigateBack();
		},
		//获取数据
		getdata() {
			this.$request({
				url: '/piano/center/statistics.html',
				data: {
					type: this.type,
					page: this.page,
				},
				method: 'POST',
			}).then(res => { 
				console.log(res.data)
				this.rank = res.data.rank;
				if (this.page == 1) {
					this.list = res.data.data;
				} else if (this.page <= res.data.last_page) {
					this.list = this.list.concat(res.data.data);
				} else if (this.page > res.data.last_page) {
					this.page =res.data.last_page
				}
			});
			console.log(this.globalData.logindata)
		},
		//滚动加载列表
		pagecurs() {
			this.page += 1;
			this.getdata();
		},
	}
};
</script>

<style>
@media screen and (min-width:2560px){
	.personal {
		width: 2560px;
		height: 720px;
		background-color: #0a1050;
		position: relative;
	}
	/* 左 */
	.person {
		background: linear-gradient(#248EFF, #72B6FF);
		width: 346px;
		height: 522px;
		border-radius: 20px;
		text-align: center;
		float: left;
		margin-top: 107px;
		margin-left: 228px;
	}
	.person image {
		width: 167px;
		height: 167px;
		margin-top: 61px;
		border-radius: 50%;
	}
	.person .text {
		font-size: 23px;
		color: #fff;
		margin-top: 32px;
	}
	.person .edit {
		width: 187px;
		height: 35px;
		font-size: 23px;
		color: #fff;
		border-radius: 28px;
		border: 1px solid #fff;
		margin-top: 60px;
		margin-left: 80px;
		padding: 5px 0px;
	}
	.person .exit {
		width: 187px;
		height: 35px;
		font-size: 23px;
		color: #0078f4;
		background-color: #fff;
		border-radius: 28px;
		margin-top: 100px;
		margin-left: 80px;
		padding: 5px 0px;
	}
	/* 中 */
	.detail {
		width: 672px;
		height: 522px;
		float: left;
		margin-left: 38px;
		margin-top: 110px;
	}
	.detail image {
		width: 55px;
		height: 55px;
		margin-top: 40px;
	}
	.detail .font1 {
		font-size: 40px;
		font-weight: bold;
		margin-top: 10px;
	}
	.detail .font2 {
		font-size: 18px;
		font-weight: bold;
		margin-top: 10px;
	}
	.left_top {
		width: 326px;
		height: 250px;
		background-image: linear-gradient(to right, #6858F6 , #898FFF);
		margin-bottom: 35px;
		text-align: center;
		border-radius: 20px;
	}
	.left_bottom {
		width: 326px;
		height: 250px;
		background-image: linear-gradient(to right, #BF23FF , #D673FF);
		text-align: center;
		margin-top: -10px;
		border-radius: 20px;
	}
	.right_top {
		width: 326px;
		height: 250px;
		background-image: linear-gradient(to right, #FFB588 , #FF9860);
		float: right;
		margin-top: -525px;
		text-align: center;
		border-radius: 20px;
	}
	.right_bottom {
		width: 326px;
		height: 250px;
		background-image: linear-gradient(to right, #1BC7C0 , #34DCA3);
		float: right;
		margin-top: -250px;
		text-align: center;
		border-radius: 20px;
	}
	/* 右 */
	.music {
		width: 1004px;
		height: 518px;
		position: absolute;
		top: 110px;
		right: 227px;
		border: 2px solid #079fff;
		border-radius: 10px;
		box-shadow: 0px 0px 20px 4px #079fff;
	}
	.tabbar {
		margin-top: 20px;
		margin-left: 120px;
	}
	.tabbar .list {
		margin-left: 40px;
		float: left;
		font-size: 21px;
		color: #fff;
		padding: 5px 30px;
	}
	.cur {
		background-color: #0077f1;
		height: 32px;
		border-radius: 21px;
	}
	.row {
		width: 100%;
		height: 420px;
		margin-top: 30px;
	}
	.row .content {
		width: 460px;
		height: 70px;
		float: left;
		margin-left: 40px;
		margin-bottom: 18px;
		position: relative;
	}
	.row .test1 {
		border-radius: 13px;
		padding: 5px 15px;
		font-size: 14px;
		font-weight: bold;
	}
	.test2 {
		background-color: #ff8605;
	}
	.test3 {
		background-color: #42a2f7;
	}
	.test4 {
		background-color: #a36ffc;
	}
	.test5 {
		background-color: #32CD32;
	}
	.row .song {
		font-size: 18px;
		margin-left: 15px;
	}
	.row p {
		margin: 10px 0px;
		font-size: 14px;
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
@media screen and (max-width:1925px) and (min-width:1656px){
    .personal {
    	width: 100%;
    	height: 100%;
    	background-color: #0a1050;
    	position: relative;
    }
    /* 左 */
    .person {
    	background: linear-gradient(#248EFF, #72B6FF);
    	width: 23%;
    	height: 70%;
    	border-radius: 20px;
    	text-align: center;
    	float: left;
    	margin-top: 9.5%;
    	margin-left: 4%;
    }
    .person image {
    	width: 238px;
    	height: 238px;
    	margin: 76px auto 40px;
		border-radius: 50%;
    }
    .person .text {
    	font-size: 23px;
    	color: #fff;
    }
    .person .edit {
    	width: 40%;
    	height: 4.5%;
    	font-size: 23px;
    	color: #fff;
    	border-radius: 28px;
    	border: 1px solid #fff;
    	margin: 25% auto 8%;
    	padding: 10px 50px;
    }
    .person .exit {
    	width: 40%;
    	height: 4.5%;
    	font-size: 23px;
    	color: #0078f4;
    	background-color: #fff;
    	border-radius: 28px;
    	margin-top: 8%;
    	margin-left: 18%;
    	padding: 10px 50px; 
    }
    /* 中 */
    .detail {
    	width: 70%;
    	height: 30%;
    	float: left;
    	margin-left: 2%;
    	margin-top: 9.5%;
    }
    .detail image {
    	width: 55px;
    	height: 55px;
    	margin-top: 13%;
    }
    .detail .font1 {
    	font-size: 40px;
    	font-weight: bold;
    	margin-top: 10px;
    }
    .detail .font2 {
    	font-size: 18px;
    	font-weight: bold;
    	margin-top: 10px;
    }
    .left_top {
    	width: 24%;
    	height: 240px;
    	background-image: linear-gradient(to right, #6858F6 , #898FFF);
    	text-align: center;
		float: left;
		margin-right: 0.5%;
		border-radius: 20px;
    }
    .left_bottom {
    	width: 24%;
    	height: 240px;
    	background-image: linear-gradient(to right, #BF23FF , #D673FF);
    	text-align: center;
		float: left;
		margin-right: 0.5%;
		border-radius: 20px;
    }
    .right_top {
    	width: 24%;
    	height: 240px;
    	background-image: linear-gradient(to right, #FFB588 , #FF9860);
    	text-align: center;
		float: left;
		margin-right: 0.5%;
		border-radius: 20px;
    }
    .right_bottom {
    	width: 24%;
    	height: 240px;
    	background-image: linear-gradient(to right, #1BC7C0 , #34DCA3);
    	float: left;
    	text-align: center;
		border-radius: 20px;
    }
    /* 右 */
    .music {
    	width: 67.5%;
    	height: 44.5%;
    	position: absolute;
    	top: 42%;
    	right: 3.3%;
    	border: 2px solid #079fff;
    	border-radius: 10px;
    	box-shadow: 0px 0px 20px 4px #079fff;
    }
    .tabbar {
    	margin-top: 50px;
    	margin-left: 21%;
    }
    .tabbar .list {
    	margin-left: 40px;
    	float: left;
    	font-size: 21px;
    	color: #fff;
    	padding: 5px 30px;
    }
    .cur {
    	background-color: #0077f1;
    	height: 32px;
    	border-radius: 21px;
    }
    .row {
    	width: 100%;
    	height: 70%;
    	margin-top: 3%;
    }
    .row .content {
    	width: 35%;
    	height: 20%;
    	float: left;
    	margin-left: 5%;
		margin-right: 10%; 
    	margin-bottom: 18px;
    	position: relative;
    }
    .row .test1 {
    	border-radius: 13px;
    	padding: 5px 15px;
    	font-size: 14px;
    	font-weight: bold;
    }
    .test2 {
    	background-color: #ff8605;
    }
    .test3 {
    	background-color: #42a2f7;
    }
    .test4 {
    	background-color: #a36ffc;
    }
    .row .song {
    	font-size: 18px;
    	margin-left: 15px;
    }
    .row p {
    	margin: 10px 0px;
    	font-size: 14px;
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
@media screen and (max-width:1655px) and (min-width:1286px){
	.personal {
		width: 100%;
		height: 100%;
		background-color: #0a1050;
		position: relative;
	}
	/* 左 */
	.person {
		background: linear-gradient(#248EFF, #72B6FF);
		width: 23%;
		height: 75%;
		border-radius: 20px;
		text-align: center;
		float: left;
		margin-top: 9.5%;
		margin-left: 4%;
	}
	.person image {
		width: 120px;
		height: 120px;
		margin: 76px auto 40px;
		border-radius: 50%;
	}
	.person .text {
		font-size: 23px;
		color: #fff;
	}
	.person .edit {
		width: 40%;
		height: 4.5%;
		font-size: 23px;
		color: #fff;
		border-radius: 28px;
		border: 1px solid #fff;
		margin: 25% auto 8%;
		padding: 5px 50px 15px;
	}
	.person .exit {
		width: 40%;
		height: 4.5%;
		font-size: 23px;
		color: #0078f4;
		background-color: #fff;
		border-radius: 28px;
		margin-top: 8%;
		margin-left: 17%;
		padding: 5px 50px 15px;
	}
	/* 中 */
	.detail {
		width: 70%;
		height: 10%;
		float: left;
		margin-left: 2%;
		margin-top: 9.5%;
	}
	.detail image {
		width: 40px;
		height: 40px;
		margin-top: 13%;
	}
	.detail .font1 {
		font-size: 30px;
		font-weight: bold;
		margin-top: 10px;
	}
	.detail .font2 {
		font-size: 18px;
		font-weight: bold;
		margin-top: 10px;
	} 
	.left_top {
		width: 23%;
		height: 200px;
		background-image: linear-gradient(to right, #6858F6 , #898FFF);
		text-align: center;
		float: left;
		margin-right: 2%;
		border-radius: 20px;
	}
	.left_bottom {
		width: 23%;
		height: 200px;
		background-image: linear-gradient(to right, #BF23FF , #D673FF);
		text-align: center;
		float: left;
		margin-right: 2%;
		border-radius: 20px;
	}
	.right_top {
		width: 23%;
		height: 200px;
		background-image: linear-gradient(to right, #FFB588 , #FF9860);
		text-align: center;
		float: left;
		margin-right: 2%;
		border-radius: 20px;
	}
	.right_bottom {
		width: 23%;
		height: 200px;
		background-image: linear-gradient(to right, #1BC7C0 , #34DCA3);
		float: left;
		text-align: center;
		border-radius: 20px;
	}
	/* 右 */
	.music {
		width: 68%;
		height: 47.5%;
		position: absolute;
		top: 45%;
		right: 2.5%;
		border: 2px solid #079fff;
		border-radius: 10px;
		box-shadow: 0px 0px 20px 4px #079fff;
	}
	.tabbar {
		margin-top: 3%;
		margin-left: 8%;
	}
	.tabbar .list {
		margin-left: 40px;
		float: left;
		font-size: 21px;
		color: #fff;
		padding: 5px 30px;
	}
	.cur {
		background-color: #0077f1;
		height: 32px;
		border-radius: 21px;
	}
	.row {
		width: 120%;
		height: 70%;
		margin-top: 3%;
	}
	.row .content {
		width: 37%;
		height: 20%;
		float: left;
		margin-left: 3%;
		/* margin-right: 5%; */
		margin-bottom: 18px;
		position: relative;
	}
	.row .test1 {
		border-radius: 13px;
		padding: 5px 13px;
		font-size: 14px;
		font-weight: bold;
	}
	.test2 {
		background-color: #ff8605;
	}
	.test3 {
		background-color: #42a2f7;
	}
	.test4 {
		background-color: #a36ffc;
	}
	.row .song {
		font-size: 18px;
		margin-left: 15px;
		overflow: hidden;
	}
	.row p {
		margin: 10px 0px;
		font-size: 14px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
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
@media screen and (max-width:1285px) and (min-width:1006px){
    .personal {
    	width: calc(100% - 100px);
    	height: 100%;
    	background-color: #0a1050;
    	position: relative;
		padding:100px 50px;
    }
    /* 左 */
    .person {
		background: linear-gradient(#248EFF, #72B6FF);
    	width: 23%;
    	height: 550px;
    	border-radius: 20px;
    	text-align: center;
    	float: left;
    }
    .person image {
    	width: 120px;
    	height: 120px;
    	margin: 76px auto 40px;
		border-radius: 50%;
		
    }
    .person .text {
    	font-size: 20px;
    	color: #fff;
    }
    .person .exit {
    	width: 40%;
    	height: 36px;
		line-height: 36px;
    	font-size: 20px;
    	color: #0078f4;
    	background-color: #fff;
    	border-radius: 28px;
    	margin:30px auto 0;
		padding:5px 20px;
    }
    /* 中 */
    .detail {
    	width: 75%;
    	height: 550px;
    	float: left;
    	margin-left: 2%;
    }
    .detail image {
    	width: 25px;
    	height: 25px;
    	margin-top: 20px;
    }
    .detail .font1 {
    	font-size: 30px;
    	font-weight: bold;
    	margin-top: 10px;
    }
    .detail .font2 {
    	font-size: 18px;
    	margin-top: 10px;
    } 
    .left_top {
    	width: 23.5%;
    	height: 170px;
		background-image: linear-gradient(to right, #6858F6 , #898FFF);
    	text-align: center;
		float: left;
		margin-right: 2%;
		border-radius: 20px;
    }
    .left_bottom {
    	width: 23.5%;
    	height: 170px;
		background-image: linear-gradient(to right, #BF23FF , #D673FF);
    	text-align: center;
		float: left;
		margin-right: 2%;
		border-radius: 20px;
    }
    .right_top {
    	width: 23.5%;
    	height: 170px;
		background-image: linear-gradient(to right, #FFB588 , #FF9860);
    	text-align: center;
		float: left;
		margin-right: 2%;
		border-radius: 20px;
    }
    .right_bottom {
    	width: 23.5%;
    	height: 170px;
		background-image: linear-gradient(to right, #1BC7C0 , #34DCA3);
    	float: left;
    	text-align: center;
		border-radius: 20px;
		margin-right:0;
    }
    /* 右 */
    .music {
    	width: 68%;
    	height: 350px;
		position: absolute;
    	top: 290px;
    	right: 4.5%;
    	border: 2px solid #079fff;
    	border-radius: 10px;
    	box-shadow: 0px 0px 20px 4px #079fff;
    }
    .tabbar {
    	margin-top: 10px;
    	margin-left: 8%;
    }
    .tabbar .list {
    	margin-left: 40px;
    	float: left;
    	font-size: 16px;
    	color: #fff;
    	padding: 5px 30px;
		line-height: 32px;
    }
    .cur {
    	background-color: #0077f1;
    	height: 32px;
    	border-radius: 21px;
    }
    .row {
    	width: 120%;
    	height: 70%;
    	margin-top: 20px;
    }
    .row .content {
    	width: 37%;
    	height: 28%;
    	float: left;
    	margin-left: 3%;
    	margin-bottom: 18px;
    	position: relative;
    }
    .row .test1 {
    	border-radius: 13px;
    	padding: 3px 10px;
    	font-size: 12px;
    	font-weight: bold;
    }
    .test2 {
    	background-color: #ff8605;
    }
    .test3 {
    	background-color: #42a2f7;
    }
    .test4 {
    	background-color: #a36ffc;
    }
    .row .song {
    	font-size: 18px;
    	margin-left: 15px;
		overflow: hidden;
    }
    .row p {
    	margin: 10px 0px;
    	font-size: 14px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
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
@media screen and (max-width:1005px){
    .personal {
    	width: calc(100% - 100px);
    	height: 100%;
    	background-color: #0a1050;
    	position: relative;
		padding: 100px 50px;
    }
    /* 左 */
    .person {
		background: linear-gradient(#248EFF, #72B6FF);
    	width: 23%;
    	height: 435px;
    	border-radius: 20px;
    	text-align: center;
    	float: left;
    }
    .person image {
    	width: 80px;
    	height: 80px;
    	margin: 76px auto 40px;
		border-radius: 50%;
    }
    .person .text {
    	font-size: 16px;
    	color: #fff;
    }
    .person .exit {
    	width: 40%;
    	height: 36px;
		line-height: 36px;
    	font-size: 16px;
    	color: #0078f4;
    	background-color: #fff;
    	border-radius: 28px;
    	margin: 100px auto 0;
		padding: 5px 20px;
    }
    /* 中 */
    .detail {
    	width: 75%;
    	height: 430px;
    	float: left;
    	margin-left: 2%;
    }
    .detail image {
    	width: 25px;
    	height: 25px;
    	margin-top: 10px;
    }
    .detail .font1 {
    	font-size: 26px;
    	font-weight: bold;
    	margin-top: 10px;
    }
    .detail .font2 {
    	font-size: 14px;
    	margin-top: 10px;
    } 
    .left_top {
    	width: 23.5%;
    	height: 140px;
		background-image: linear-gradient(to right, #6858F6 , #898FFF);
    	text-align: center;
		float: left;
		margin-right: 2%;
		border-radius: 20px;
    }
    .left_bottom {
    	width: 23.5%;
    	height: 140px;
		background-image: linear-gradient(to right, #BF23FF , #D673FF);
    	text-align: center;
		float: left;
		margin-right: 2%;
		border-radius: 20px;
    }
    .right_top {
    	width: 23.5%;
    	height: 140px;
		background-image: linear-gradient(to right, #FFB588 , #FF9860);
    	text-align: center;
		float: left;
		margin-right: 2%;
		border-radius: 20px;
    }
    .right_bottom {
    	width: 23.5%;
    	height: 140px;
		background-image: linear-gradient(to right, #1BC7C0 , #34DCA3);
    	float: left;
    	text-align: center;
		border-radius: 20px;
		margin-right:0;
    }
    /* 右 */
    .music {
    	width: 68%;
    	height: 270px;
		position: absolute;
    	top: 260px;
    	right: 4.5%;
    	border: 2px solid #079fff;
    	border-radius: 10px;
    	box-shadow: 0px 0px 20px 4px #079fff;
    }
    .tabbar {
    	margin-top: 20px;
    	margin-left: 8%;
    }
    .tabbar .list {
		line-height: 20px;
		font-size: 16px;
		color: #fff;
		float: left;
    	margin-left: 20px;
    	padding: 5px 30px;
    }
    .cur {
    	background-color: #0077f1;
    	height: 20px;
    	border-radius: 21px;
    }
    .row {
    	width: 120%;
    	height: 70%;
    	margin-top: 20px;
    }
    .row .content {
    	width: 37%;
    	height: 28%;
    	float: left;
    	margin-left: 3%;
    	margin-bottom: 18px;
    	position: relative;
    }
    .row .test1 {
    	border-radius: 13px;
    	padding: 3px 10px;
    	font-size: 12px;
    	font-weight: bold;
    }
    .test2 {
    	background-color: #ff8605;
    }
    .test3 {
    	background-color: #42a2f7;
    }
    .test4 {
    	background-color: #a36ffc;
    }
    .row .song {
    	font-size: 16px;
    	margin-left: 15px;
		font: bold;
		overflow: hidden;
    }
    .row p {
    	margin: 10px 0px;
    	font-size: 14px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
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
