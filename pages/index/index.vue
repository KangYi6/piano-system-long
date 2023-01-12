<template>
	<div class="appbg">
		<!-- 顶部公共图标 -->
		<top></top>	
		<div class="home">
			<div class="left">
				<div class="search">
					<input type="text" :placeholder="hotkey" v-model="keyword" @confirm="search()"/>
					<button class="search-btn" @click="search()">搜索</button>
				</div>
				<div class="tab">
					<div class="tabtitle">
						<ul>
							<li :class="{ cur: current == 1 }" @click="active(1)">热门推荐</li>
							<li :class="{ cur: current == 2 }" @click="active(2)">历史记录</li>
						</ul>
					</div>
					<!-- 热门记录 -->
					<div class="tablist">
						<scroll-view
							scroll-y="true"
							show-scrollbar="true"
							v-show="current == 1"
							@scrolltolower="pagecur"
							lower-threshold="400px"
							scroll-with-animation="true"
							android:scrollbars="none"
						>
							<ul>
								<li v-for="(item, index) in hotList" :key="item.m_id" @click="musicxml(item.m_id, item.m_title)">
									<div class="title">
										<em>
											<i>{{ index + 1 }}.</i>
											{{ item.m_title }}
										</em>
										<image src="@/static/fire-red.png" v-show="index == 0"></image>
										<image src="@/static/fire-orange.png" v-show="index == 1"></image>
									</div>
									<div class="attr">
										<span>
											<image src="@/static/uploader.png" mode="widthFix"></image>
											{{ item.u_nickname }}
										</span>
										<span>
											<image src="@/static/eyes.png" mode="widthFix"></image>
											{{ item.m_view }}
										</span>
										<span @click.stop="open(item.m_id,index)">
											<image src="@/static/collect-hover.png" mode="widthFix" v-if="searchcid.some(res=>res==item.m_id)"></image>
											<image src="@/static/collect.png" mode="widthFix" v-else></image>
											{{ item.m_collect }}
										</span>
										<span @click.stop="fabulous(item.m_id,index)">
											<image src="@/static/thumbs-up-hover.png" mode="widthFix" v-if="hotkeyid.some(res=>res==item.m_id)"></image>
											<image src="@/static/thumbs-up.png" mode="widthFix" v-else></image>
											{{ item.m_fabulous }}
										</span>
									</div>
								</li>
								<li class="notmore" v-show="notmore"><image src="../../static/xiaolian.png" mode="widthFix"></image><text>没有更多了哦</text></li>
							</ul>
						</scroll-view>
					</div>
					
					<!-- 登录成功但是没数据-->
					<div v-show="current == 2 && historyList.length==0 && globalData.login" class="curren1">
						<div class="curren2">
							<image src="../../static/lishi.png"></image>
							<text>暂无数据</text>
						</div>
					</div>
					
					<!-- 历史记录 登录成功并且有数据-->
					<div class="tablist trans" v-show="current == 2 && historyList && globalData.login">
						<scroll-view
							scroll-y="true"
							show-scrollbar="true"
							@scrolltolower="pagecurs"
							lower-threshold="400px"
							scroll-with-animation="true"
							android:scrollbars="none"
						>
							<ul>
								<li v-for="(item, index) in historyList" :key="item.m_id" @click="musicxml(item.m_id, item.m_title)">
									<div class="title">
										<em>
											<i>{{ index + 1 }}.</i>
											{{ item.m_title }}
										</em>
										<image src="@/static/fire-red.png" v-show="index == 0"></image>
										<image src="@/static/fire-orange.png" v-show="index == 1"></image>
									</div>
									<div class="attr">
										<span>
											<image src="@/static/uploader.png" mode="widthFix"></image>
											{{ item.u_nickname }}
										</span>
										<span>
											<image src="@/static/eyes.png" mode="widthFix"></image>
											{{ item.m_view }}
										</span>
										<span @click.stop="open(item.m_id,index)">
											<image src="@/static/collect-hover.png" mode="widthFix" v-if="searchcid.some(res=>res==item.m_id)"></image>
											<image src="@/static/collect.png" mode="widthFix" v-else></image>
											{{ item.m_collect }}
										</span>
										<span @click.stop="fabulousone(item.m_id,index)">
											<image src="@/static/thumbs-up-hover.png" mode="widthFix" v-if="historyid.some(res=>res==item.m_id)"></image>
											<image src="@/static/thumbs-up.png" mode="widthFix" v-else></image>
											{{ item.m_fabulous }}
										</span>
									</div>
								</li>
								<li class="notmore" v-show="notmoretwo"><image src="../../static/xiaolian.png" mode="widthFix"></image><text>没有更多了哦</text></li>
							</ul>
						</scroll-view>
					</div>
					
					<!-- 未登录 -->
					<div v-show="current == 2 && !globalData.login" class="curren1">
						<div class="">
							<image class="img_notdata" src="../../static/index_notdata_ipad.png" mode=""></image>
							<text class="tet">暂时没有您的记录，请登录哦</text>
							<button class="btn" @click="login">
								<image src="../../static/head.png" class="head"></image>
								<span>立即登录</span>
							</button>
						</div>
					</div>
				</div>
			</div>
			<!-- 弹窗 -->
			<div class="conten" v-if="conten">
				<div class="alert">
					<div class="title">
						<span>收藏分类</span>
						<image src="@/static/err1.png" @click="closealert"></image>
					</div>
					<div class="addcollect">
						<input type="text" v-model="cname" @confirm="addcollectname">
						<button class="collectbtn" @click="addcollectname">添加</button>
					</div>
					<div class="center">
						<scroll-view scroll-y="true" scroll-with-animation="true" android:scrollbars="none" class="collectbox">
							<ul>
								<li v-for="(i,d) in collect" :key="d" @click="addcollect(i.cc_id,i.cc_name)">{{i.cc_name}}</li>
							</ul>
						</scroll-view>
					</div>
				</div>
			</div>

			<div class="center">
				<ul>
					<li @click="courses">
						<view class=""></view>
						<p>AI钢琴课程</p>
					</li>
					<li @click="live(index)">
						<view class=""></view>
						<p>大师直播课</p>
					</li>
					<li @click="activity">
						<view class=""></view>
						<p>互动课堂</p>
					</li>
					<li @click="task">
						<view class=""></view>
						<p>陪练</p>
					</li>
				</ul>
			</div>

			<div class="right">
				<ul>
					<li @click="login">
						<image src="@/static/index-usercenter.png"></image>
						<div class="title">
							<p>个人中心</p>
							<span>PERSONAL CENTER</span>
						</div>
					</li>
					<li @click="set">
						<image src="@/static/index-set.png"></image>
						<div class="title">
							<p>钢琴设置</p>
							<span>PIANO SETTINGS</span>
						</div>
					</li>
					<li>
						<image src="@/static/index-moreapp.png"></image>
						<div class="title">
							<p>更多应用</p>
							<span>MORE APPLICATION</span>
						</div>
					</li>
				</ul>
			</div>
		</div>
		<div class="exit" @click="quitApp()"><image src="@/static/exit.png" mode="widthFix"></image></div>
		<!-- 弹奏模式 -->
		<mode v-show="playMode"></mode>
	</div>
</template>
 
<script>
	import mode from '@/components/common/mode.vue';
	export default {
		components:{
			mode
		},
		data() {
			return {
				// 预加载已完成的图片数量
				count: 0,
				// 进度条百分比%
				percent: "",
				// 图片总数据
				allList: [],
				// 全局数据
				globalData: getApp().globalData,
				sec:'',
				//搜索词
				keyword: '',
				//热门推荐
				hotList: [],
				//默认搜索
				hotkey:'',
				//历史记录
				historyList: [],
				//头部切换
				current: 2,
				//热门page页
				page: 1,
				//历史page页
				pages:1,
				//当前页码总页数
				limit: 10,
				//没有更多了
				notmore:false,
				notmoretwo:false,
				//点赞
				hotkeyid:[],
				historyid:[],
				//弹窗出现
				conten:false,
				//添加曲谱的id
				addcollectxml:'',
				//收藏点亮列表
				searchcid:[],
				//添加分类曲谱下标
				addindex:'',
				addindextwo:'',
				//添加收藏分类名称
				cname:'',
				//收藏分类列表
				collect: [],
				time: '',
				index: 3,
				options: [],
				//模式窗口
				playMode:false,
			};
		},
		onLoad(option) {
			this.options = option
			//刚进入获取上次存在亮度
			var Brightness = uni.getStorageSync('Brightness')
			if(Brightness){
				plus.screen.setBrightness(Brightness)
			}
			//搜索关键词
			this.Hotkeyword()
			//热门推荐
			this.getHot()
		},
		onShow(){
			//页面渲染完以后，重新获取一次全局参数，并判断是否登录，如果登录，则获取历史记录，也可以解决登录返回数据刷新问题
			this.globalData = getApp().globalData
			if (this.globalData.login) {
				this.getHistory() 
			} else {
				this.historyList = []
			}
		},
		created(){
			setTimeout(()=>{
				this.options = 1
			},2000)
		},
		computed: {
			//选择弹奏模式
			modeChange(){
				return this.$store.state.mode
			}
		},
		watch: {
			modeChange:function(newVal,oldVal){
				if (newVal == 'open') {
					this.playMode = true
				} else if (newVal == 'close') {
					this.playMode = false
				}
			}
		},
		methods: {
			//热门关键词
			Hotkeyword(){
				this.$request({
					url: "/piano/index/hotKeyword.html",
					method: "POST",
				}).then((res) => {
					getApp().globalData.hotkey = res.data.data
					this.hotkey = res.data.data[parseInt(Math.random() * (res.data.data.length+1))]
					uni.setStorageSync('hotkey',hotkey)
				})
			},
			//曲谱详情
			musicxml(id,title){
				//弹出模式选择窗口
				this.$store.state.mode = 'open'
				this.$request({
					url: "/piano/index/musicxmlUrl.html",
					data:{id:id},
					method: "POST",
				}).then((res)=>{
					//更新曲谱信息
					this.$store.state.xmlInfo = {
						ptype:0,
						pid:0,
						cid:0,
						id:id,
						cwid:0,
						path:res.data.data,
						title:title,
					}
					//曲谱参数，为了兼容旧课程数据，没有参数时，使用默认参数
					let param = {}
					param.pass = d.pass ? d.pass : 80
					param.mode = d.mode ? d.mode : false
					param.hands = d.hands ? d.hands : 0
					param.metronome = d.metronome ? d.metronome : false
					param.tempo = d.tempo ? d.tempo : 100
					param.keytips = d.keytips ? d.keytips : 'auto'
					this.$store.state.xmlParam = param
				}) 
			},
			//搜索
			search(){
				let keyword = (this.keyword ? this.keyword : this.hotkey) ?? ''
				uni.navigateTo({
					url:'../search/search?value=' + keyword,
				})
			},
			//退出APP
			quitApp(){
				//页面关闭时保存下最新亮度
				uni.setStorageSync('Brightness',plus.screen.getBrightness())
				switch (uni.getSystemInfoSync().platform) {
					case 'android': 
						plus.runtime.quit(); 
						break;
					case 'ios':
						plus.ios.import('UIApplication').sharedApplication().performSelector('exit');
						break;
				}
			},
			//热门推荐
			getHot(){
				this.$request({
					url: "/piano/index/hot.html",
					data:{
						page:this.page,
						limit:this.limit,
					},
					method: "POST",
				}).then((res) => {
					if (res.data.code == 1000) {
						if (this.page == 1) { 
							this.hotList = res.data.data.data;
						} else if (this.page<=res.data.data.last_page){
							this.hotList = this.hotList.concat(res.data.data.data)
						} else if (this.page>res.data.data.last_page){
							this.notmore=true
						}
					} else {
						uni.showToast({
							title: '获取数据失败',
							icon: 'error'
						});
					}
				});
			},
			//热门搜索&历史记录切换
			active(index) {
				this.current = index;
				if (this.current == 2 && this.globalData.login) {
					this.getHistory()
				}
				if (this.current == 1 && this.globalData.login) {
					this.getHot()
				}
			},
			//获取历史记录
			getHistory() {
				this.$request({
					url: '/piano/history/list.html',
					method: 'POST',
					data:{page:this.pages},
				}).then(res => {
					if (res.data.code == 1000) { 
						if (this.pages == 1) {
							this.historyList = res.data.data.data;
						} else if (this.pages <= res.data.data.last_page) {
							this.historyList = this.historyList.concat(res.data.data.data);
						}else if (this.pages > res.data.data.last_page) {
							this.notmoretwo = true
						}
					}
				})
			},
			//滚动加载热门
			pagecur() {
				this.page += 1
				this.getHot()
			},
			//滚动加载历史
			pagecurs(){
				this.pages += 1
				this.getHistory()
			},
			// 点击跳转 登录页
			login(){
				if (!getApp().globalData.login) {
					uni.navigateTo({
						url:"/pages/login/login",
					})
				} else {
					uni.navigateTo({
						url:"/pages/personal/personal",
					})
				} 
			},
			// 进入设置
			set(){
				uni.navigateTo({
					url: "/pages/set/set",
				});
			},
			// 进入AI钢琴课程
			courses(){
				uni.navigateTo({
					url: "/pages/courses/courses",
				});
			},
			live(index){
				uni.navigateTo({
					url: "/pages/courses/courses?index=" + index,
				});
			},
			//进入互动课堂
			activity(){
				// uni.navigateTo({
				// 	url: "/pages/active/active",
				// });
				if (plus.os.name == 'Android') {  
				    plus.runtime.launchApplication({
						pname: 'tv.yusi.grouplesson.version.custom',
					},(e) => {
						uni.showToast({
							title:"未安装应用",
						})	
					});
				} else if (plus.os.name == 'iOS') {  
					uni.showToast({
						title:"系统暂不支持",
					})
				    // plus.runtime.launchApplication({ action: 'taobao://' }, (e) => {  
				    //     console.log('Open system default browser failed: ' + e.message);  
				    // });  
				} 
			},
			//进入作业
			task(){
				if(getApp().globalData.login){
					uni.navigateTo({
						url: "/pages/task/task",
					});
				}else{
					uni.navigateTo({
						url:'/pages/login/login'
					})
				}
			},
			//热门点赞
			fabulous(id,index){
				if (!getApp().globalData.login) {
					uni.navigateTo({
						url:"/pages/login/login",
					})
					return;
				}
				if (this.hotkeyid.some(res=>res==id)) {
					this.hotList[index].m_fabulous -= 1
					//过滤数组
					var cid = this.hotkeyid.indexOf(id)
					this.hotkeyid.splice(cid,1)
					return
				}
				this.$request({
					url: '/piano/musicxml/fabulous.html',
					method: 'POST',
					data:{id:id},
				}).then(res => {
					if (res.data.code == 1000) {
						this.hotkeyid = this.hotkeyid.concat(id)
						this.hotList[index].m_fabulous += 1
					}
				})
			},
			//历史点赞
			fabulousone(id,index){
				if (!getApp().globalData.login) {
					uni.navigateTo({
						url:"/pages/login/login",
					})
					return;
				}
				if (this.historyid.some(res=>res==id)) {
					this.historyList[index].m_fabulous -= 1
					//过滤数组
					var cid=this.historyid.indexOf(id)
					this.historyid.splice(cid,1)
					return
				}
				this.$request({
					url: '/piano/musicxml/fabulous.html',
					method: 'POST',
					data:{id:id},
				}).then(res => {
					if (res.data.code == 1000) {
						this.historyid = this.historyid.concat(id)
						this.historyList[index].m_fabulous += 1
					}
				})
			},
			//添加分类
			open(id,index){
				//是否登录
				if (!getApp().globalData.login) {
					uni.navigateTo({
						url:"/pages/login/login",
					})
					return;
				}
				//获取收藏分类
				this.getcolect()
				if(this.searchcid.some(res=>res==id && this.current==1)){
					this.hotList[index].m_collect-=1
					if(this.hotList[index].m_collect==0 || this.hotList[index].m_collect<0){
						this.hotList[index].m_collect=0
					}
				}else{
					this.historyList[index].m_collect-=1
					if(this.historyList[index].m_collect==0 || this.historyList[index].m_collect<0){
						this.historyList[index].m_collect=0
					}
				}
				this.conten=true
				this.addcollectxml=id
				if(this.current==1){
					this.addindex=index
				}else{
					this.addindextwo=index
				}
			},
			//关闭弹窗
			closealert(){
				this.conten=false
			},
			//添加曲谱到收藏类
			addcollect(cid,cname){
				this.$request({
					url: '/piano/musicxml/addCollect.html',
					method: 'POST',
					data:{m_id:this.addcollectxml,cc_id:cid}
				}).then(res => {
					if (res.data.code == 1000) {
						this.conten=false
						this.getcolect()
						this.searchcid=this.searchcid.concat(this.addcollectxml)
						if(this.addindex){
							this.hotList[this.addindex].m_collect+=1
						}else{
							this.historyList[this.addindextwo].m_collect+=1
						}
					}else{
						uni.showToast({
							title:res.msg,
							icon:"error"
						})
					}
				})
			},
			//添加收藏分类
			addcollectname(){
				if (!this.cname) {
					uni.showToast({
						title:"请输入名称",
						icon:"error"
					})
					return;
				}
				this.$request({
					url: '/piano/musicxml/addCollectCate.html',
					method: 'POST',
					data:{cc_name:this.cname}
				}).then(res => {
					if (res.data.code == 1000) {
					   let arr=[{cc_name:this.cname}]
						this.collect=arr.concat(this.collect)
					}else{
						uni.showToast({
							title:res.msg,
							icon:"error"
						})
					}
				})
			},
			//获取收藏分类
			getcolect(){
				this.$request({
					url: '/piano/musicxml/collectCate.html',
					method: 'POST',
				}).then(res => {
					if (res.data.code == 1000) {
						this.collect=res.data.data.data
					}
				});
			},
			// 本地时间
			currentTime() {
			    setInterval(this.getTime, 500);
			},
			getTime() {
			    let hh = new Date().getHours() < 10 ? "0" + new Date().getHours() : new Date().getHours();
			    let mf = new Date().getMinutes() < 10 ? "0" + new Date().getMinutes() : new Date().getMinutes();
			    let ss = new Date().getSeconds() < 10 ? "0" + new Date().getSeconds() : new Date().getSeconds();
			    this.time = hh + ":" + mf;
			}
		}
	};
</script>

<style scoped>
	@media screen and (min-width: 2560px){
		.appbg {
			width: 2560px;
			height: 720px;
			overflow: hidden;
			background-color: #0a1050;
			position: relative;
		}
		.home {
			width: 2106px;
			height: calc(100% - 114px);
			background: url('@/static/index-bg-hover.png') no-repeat;
			padding: 114px 227px 0;
			overflow: hidden;
		}
		.left {
			width: 452px; 
			height: auto;
			float: left;
		}
		.search {
			width: 100%;
			height: auto;
			overflow: hidden;
		}
		.search input {
			width: 302px;
			height: 50px;
			border-top-left-radius: 50px;
			border-bottom-left-radius: 50px;
			float: left;
			color: #6b6b6b;
			padding-left: 50px;
			background: url('@/static/search.png') no-repeat #fff 15px 15px;
			background-size: 22px;
			line-height: 50px;
		}
		.search .search-btn {
			width: 100px;
			height: 50px;
			background: #e03e5b;
			font-size: 18px;
			text-align: center;
			line-height: 50px;
			float: left;
			border-top-right-radius: 50px;
			border-bottom-right-radius: 50px;
			border-top-left-radius: 0;
			border-bottom-left-radius: 0;
			color: #fff;
			letter-spacing: 3px;
		}
		.search .search-btn:after {
			border: none;
		}
		.tab {
			width: 100%;
			height: auto;
			margin-top: 28px;
			overflow: hidden;
		}
		.tabtitle li {
			width: 50%;
			height: 46px;
			text-align: center;
			float: left;
			font-size: 18px;
			line-height: 46px;
			border-bottom: 1px solid rgb(255,255,255,0.5);
		}
		.tabtitle li:first-child {
			border-top-left-radius: 18px;
		}
		.tabtitle li:last-child {
			border-top-right-radius: 18px;
		}
		.tabtitle .cur {
			background: #fff;
			color: #0a1050;
		}
		.tablist {
			width: calc(100% - 40px);
			height: auto;
			padding: 15px 20px;
			overflow: hidden;
		}
		.tablist li {
			width: 100%;
			height: 100rpx;
			overflow: hidden;
			padding-top: 5px;
			padding-bottom: 11px;
		}
		.tablist .notmore {
			text-align: center;
			padding-bottom: 0;
			transform: translateY(8px);
			height: 46px;
			line-height: 60px;
		}
		.tablist .notmore image{
			width: 28px;
			height: 28px;
			opacity: 0.63;
			transform: translateY(7px);
			margin-right: 10px;
		}
		.tablist .notmore text{
			width: 120px;
			height: 18px;
			opacity: 0.55;
			font-size: 18px;
			font-family: Microsoft YaHei, Microsoft YaHei-Regular;
			font-weight: 400;
			text-align: left;
			color: #ffffff;
			line-height: 18px;
		}
		.tablist .title {
			padding-bottom: 3px;
		}
		.tablist .title em {
			max-width: calc(100% - 21px);
			height: auto;
			overflow: hidden;
			font-style: normal;
			font-size: 18px;
		}
		.tablist .title em i {
			font-style: normal;
			padding-right: 20px;
			position: relative;
			top: 1px;
		}
		.tablist .title image {
			width: 18px;
			height: 18px;
			padding-left: 5px;
			position: relative;
			top: 3px;
		}
		.tablist .attr {
			width: calc(100% - 32px);
			height: auto;
			padding: 0 0 0 32px;
			opacity: 0.6;
		}
		.tablist .attr image {
			width: 16px;
			height: 16px !important;
			padding-right: 5px;
			position: relative;
			top: 2px;
		}
		.tablist .attr span {
			padding:5px 20px 10px 0;
			display: inline-block;
		}
		.img_notdata{
			width: 180px;
			height: 180px;
			margin-left: 140px;
			margin-top: -20px;
		}
		.curren1 .tet {
			opacity: 0.53;
			margin-bottom: 30px;
			margin-left: 95px;
		}
		.curren1 .btn {
			width: 212px;
			height: 51px;
			border: 1.33px solid #ffffff;
			border-radius: 25px;
			font-size: 10.5px;
			background-color: #254a9e;
			line-height: 51px;
			opacity: 0.7;
		}
		.curren1 button span {
			width: 84px;
			height: 20px;
			font-size: 21px;
			font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
			font-weight: normal;
			text-align: left;
			color: #ffffff;
			margin-left: 7px;
		}
		.center {
			width: 1253px;
			height: auto;
			margin: 0 40px 0 60px;
			overflow: hidden;
			float: left;
		}
		.center li {
			width: 290px;
			height: auto;
			float: left;
			margin-right: 31px;
		}
		.center li:last-child {
			margin-right: 0;
		}
		.center p {
			font-size: 20px;
			text-align: center;
			line-height: 100px;
			letter-spacing: 1px;
		}
		.center ul li:nth-child(1) view,
		.center ul li:nth-child(2) view,
		.center ul li:nth-child(3) view,
		.center ul li:nth-child(4) view{
			border-top-left-radius: 10px;
			border-top-right-radius: 10px;
			width: 290px;
			height: 373px;
		}
		.center ul li:nth-child(1) view{
			background: url('@/static/index/aicourse-thumb.png') no-repeat;
		}
		.center ul li:nth-child(2) view{
			background: url('@/static/index/orff-thumb.png') no-repeat;
		}
		.center ul li:nth-child(3) view{
			background: url('@/static/index/hudong-thumb.png') no-repeat;
		}
		.center ul li:nth-child(4) view{
			background: url('@/static/index/peilian-thumb.png') no-repeat;
		}
		.right {
			width: 300px;
			height: auto;
			float: left;
			overflow: hidden;
		}
		.right li {
			width: calc(100% - 80px);
			height: 60px;
			margin-bottom: 18px;
			border-radius: 5px;
			padding: 42.5px 40px;
		}
		.right li:first-child {
			background: #5bc338;
		}
		.right li:nth-child(2) {
			background: #4b93ff;
		}
		.right li:last-child {
			background: #ff3d53;
			margin-bottom: 0;
		}
		.right image {
			width: 60px;
			height: 60px;
			float: left;
		}
		.right .title {
			width: calc(100% - 80px);
			height: auto;
			float: left;
			padding-left: 20px;
			font-size: 18px;
			padding-top: 5px;
		}
		.right .title span {
			font-size: 8px;
		}
		.exit {
			position: absolute;
			bottom: 40px;
			right: 10px;
		}
		.exit image {
			width: 180px;
			height: 72px;
		}
		.data {
			position: absolute;
			left: 0;
			top: 0;
			color: #fff;
			font-size: 80px;
		}
		-webkit-scrollbar {
			color: transparent;
		}
		.curren1 {
			width: 452px;
			height: 403px;
			border-radius: 8px;
			padding-top: 28px;
		}
		.curren1 .curren2 {
			width: 249px;
			height: 260px;
			text-align: center;
			margin: auto;
			padding-top: 55px;
		}
		.curren1 .curren2 image {
			width: 155px;
			height: 122px;
			text-align: center;
			margin-left: 12px;
		}
		.curren1 text {
			width: 260px;
			height: 20px;
			display: block;
			opacity: 0.53;
			font-size: 20px;
			font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
			font-weight: normal;
			text-align: center;
			color: #ffffff;
		}
		.nocur {
			display: none;
		}
		.curren1 .head {
			width: 21px;
			height: 25px;
			transform: translateY(4px);
		}
		
		scroll-view {
			height: 320px;
		}
		.conten{
			background: rgba(0,0,0, 0.6);
			position: fixed;
			z-index: 200;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}
		.conten .alert{
			position: fixed;
			top: calc(50% - 250px);
			left: calc(50% - 250px);
			z-index: 210;
			width: 500px;
			height: 500px;
			background-color: rgba(67,109,192,0.85);
			border: #079fff solid 3px;
			border-radius: 12px;
			opacity: 0.95;
			box-shadow: 0px 0px 20px 4px #079fff;
		}
		.conten .alert .title{
			width: 500px;
			height: 80px;
			text-align: center;
			border-bottom:1px solid rgb(255,255,255,0.5);
		}
		.conten .alert .title span{
			font-size: 24px;
			font-weight: 400;
			text-align: left;
			color: #fff;
			display: inline-block;
			height: 80px;
			line-height: 80px;
			padding-left: 30px;
			float: left;
			font-weight: bold;
		}
		.conten .alert .title image{
			float: right;
			width: 47px;
			height: 47px;
			padding: 15px 15px 0 0;
		}
		.conten .alert .center{
			width:100%;
			text-align: center;
			font-size: 28px;
			font-family: Microsoft YaHei, Microsoft YaHei-Regular;
			font-weight: 400;
			color: #ffffff;
			padding-top: 20px;
			margin:0;
		}
		.conten .alert .center ul li{
			width: calc(50% - 57px);
			height: 55px;
			line-height: 55px;
			text-align: left;
			margin: 0 10px 20px 25px;
			/* border-bottom: 1px #eee dotted; */
			text-overflow: ellipsis;/*文字隐藏后添加省略号*/
			white-space: nowrap;/*强制不换行*/
			font-size:20px;
			border: 1px solid rgb(255,255,255,0.5);
			text-align: center;
			border-radius: 50px;
			float:left;
			padding:0 10px;
			overflow: hidden;
		}
		.conten .alert .center ul li:nth-child(2n){
			margin: 0 25px 20px 10px;
		}
		.conten .alert .addcollect{
			width: 500px;
			height: 55px;
			text-align: center;
			padding-top: 20px;
		}
		.conten .alert .addcollect input{
			width: 320px;
			height: 55px;
			color:#6b6b6b;
			border-radius: 12px;
			background-color: #fff;
			display: inline-block;
			padding-left: 30px;
			text-align: left;
			font-size: 25px;
			border-top-left-radius: 50px;
			border-bottom-left-radius: 50px;
			border-top-right-radius: 0;
			border-bottom-right-radius: 0;
		}
		.conten .alert .addcollect .collectbtn{
			width: 100px;
			height: 55px;
			line-height: 55px;
			border-radius: 12px;
			background-color: #e03e5b;
			display: inline-block;
			font-size: 20px;
			color: #fff;
			border-top-left-radius: 0;
			border-bottom-left-radius: 0;
			border-top-right-radius: 50px;
			border-bottom-right-radius: 50px;
		}
		.trans{
			transform: translateY(-30px);
		}
		.collectbox{
			height:300px;
		}
	}
	@media screen and (max-width: 1925px) and (min-width:1656px){
		*{
			padding: 0px;
			margin: 0px;
		}
		.appbg {
			width: 100%;
			height: 100%;
			overflow: hidden;
			background-color: #0a1050;
			position: relative;
		}
		/* 进度条 */
		.box{
			width: 1000px;
			height: 10px;
			border-radius: 10px;
			background: #999;
			margin: 100px auto;
			border: 1px solid #ff6780;
		}
		.child{
			position: relative;
			height: 100%;
			border-radius: inherit;
		}
		.process-animate{
			background: #ff6780;
			position: absolute;
			left: 0;
			top: 0;
			bottom: 0;
			border-radius:inherit;
		    animation: process 1s linear forwards ;
		}
		@keyframes process{
		    0% {left:0; right:100%;}
		    20% { right:80%}
		    40% {right:60%;}
		    60% {right:40%;}
		    80% {right:20%;}
		    100% {right:0;}
		}
		.home {
			width: 98%;
			height: 90%;
			margin: 150px 50px 50px;
			overflow: hidden;
		}
		.left {
			width: 24.4%; 
			height: 70%;
			float: left;
		}
		.search {
			width: 105%;
			height: auto;
			overflow: hidden;
		}
		.search input {
			width: 65%;
			height: 50px;
			border-top-left-radius: 50px;
			border-bottom-left-radius: 50px;
			float: left;
			color: #6b6b6b;
			padding-left: 50px;
			background: url('@/static/search.png') no-repeat #fff 15px 15px; 
			background-size: 22px;
			line-height: 50px;
		}
		.search .search-btn {
			width: 100px;
			height: 50px;
			background: #e03e5b;
			font-size: 18px;
			text-align: center;
			line-height: 50px;
			float: left;
			border-top-right-radius: 50px;
			border-bottom-right-radius: 50px;
			border-top-left-radius: 0;
			border-bottom-left-radius: 0;
			color: #fff;
			letter-spacing: 3px;
		}
		.search .search-btn:after {
			border: none;
		}
		.tab {
			width: 100%;
			height: 120%;
			margin-top: 28px;
			overflow: hidden;
			background: url('../../static/index_left_bg.png') no-repeat;
			border-top-right-radius: 18px;
			border-bottom-right-radius: 18px;
		}
		.tabtitle li {
			width: 50%;
			height: 46px;
			text-align: center;
			float: left;
			font-size: 18px;
			line-height: 46px;
			border-bottom: 1px solid rgb(255,255,255,0.5);
		}
		.tabtitle li:first-child {
			border-top-left-radius: 18px;
		}
		.tabtitle li:last-child {
			border-top-right-radius: 18px;
		}
		.tabtitle .cur {
			background: #fff;
			color: #0a1050;
		}
		.curren1{
			margin-top: -120%;
		}
		.img_notdata{
			width: 250px;
			height: 260px;
			margin-left: 25%;
			margin-top: 190px;
		}
		.tablist {
			width: 100%;
			height: auto;
			padding: 15px 20px;
			overflow: hidden;
		}
		.tablist li {
			width: 100%;
			height: 50px;
			overflow: hidden;
			padding-top: 5px;
			padding-bottom: 11px;
		}
		.tablist .notmore{
			text-align: center;
			padding-bottom: 0;
			transform: translateY(8px);
			height: 46px;
			line-height: 60px;
			margin-left: -30px;
		}
		.tablist .notmore image{
			width: 28px;
			height: 28px;
			opacity: 0.63;
			transform: translateY(7px);
			margin-right: 10px;
		}
		.tablist .notmore text{
			width: 120px;
			height: 18px;
			opacity: 0.55;
			font-size: 18px;
			font-family: Microsoft YaHei, Microsoft YaHei-Regular;
			font-weight: 400;
			text-align: left;
			color: #ffffff;
			line-height: 18px;
		}
		.tablist .title {
			padding-bottom: 3px;
		}
		.tablist .title em {
			max-width: calc(100% - 21px);
			height: auto;
			overflow: hidden;
			font-style: normal;
			font-size: 18px;
		}
		.tablist .title em i {
			font-style: normal;
			padding-right: 20px;
			position: relative;
			top: 1px;
		}
		.tablist .title image {
			width: 18px;
			height: 18px;
			padding-left: 5px;
			position: relative;
			top: 3px;
		}
		.tablist .attr {
			width: calc(100% - 32px);
			height: auto;
			padding: 0 0 0 32px;
			opacity: 0.6;
		}
		.tablist .attr image {
			width: 16px;
			height: 16px !important;
			padding-right: 5px;
			position: relative;
			top: 2px;
		}
		.tablist .attr span {
			padding:5px 20px 10px 0;
			display: inline-block;
		}
		.center {
			width: 72%;
			height: 63%;
			margin: 0 0px 0 40px;
			overflow: hidden;
			float: left;
			text-align: center
		}
		.center li {
			width: 22%;
			height: 56%;
			float: left;
			margin-right: 35px;
		}
		.center image {
			border-top-left-radius: 10px;
			border-top-right-radius: 10px;
			width: 100%;
			height: 610px;
		}
		.center li p {
			font-size: 20px;
			text-align: center;
			line-height: 100px;
			letter-spacing: 1px;
			float: left;
			position: absolute;
			top: 61.5%;
		}
		.center ul li:nth-child(1) view,
		.center ul li:nth-child(2) view,
		.center ul li:nth-child(3) view,
		.center ul li:nth-child(4) view{
			width: 100%;
			height: 610px;
		}
		.center ul li:nth-child(1) view{
			background: url('@/static/index/aicourse-thumb_ipad.png') no-repeat;
		}
		.center ul li:nth-child(2) view{
			background: url('@/static/index/orff-thumb_ipad.png') no-repeat;
		}
		.center ul li:nth-child(3) view{
			background: url('@/static/index/hudong-thumb_ipad.png') no-repeat;
		}
		.center ul li:nth-child(4) view{
			background: url('@/static/index/peilian-thumb_ipad.png') no-repeat;
		}
		.center ul li:nth-child(1) p,
		.center ul li:nth-child(2) p,
		.center ul li:nth-child(3) p{
			margin-left: 110px;
		}
		.center ul li:nth-child(4) p{
			margin-left: 140px;
		}
		.right {
			width: 72%;
			height: auto;
			float: left;
			overflow: hidden;
			margin-top: 35px;
			margin-left: 40px;
		} 
		.right li {
			/* width: 180px; */
			margin-right: 38px;
			border-radius: 5px;
			float: left;
			padding: 63px 128px;
		}
		.right li:first-child {
			background: #5bc338;
		}
		.right li:nth-child(2) {
			background: #4b93ff;
		}
		.right li:last-child {
			background: #ff3d53;
			margin-bottom: 0;
		}
		.right image {
			width: 60px;
			height: 60px;
			float: left;
		}
		.right .title {
			width: calc(100% - 80px);
			height: auto;
			float: left;
			padding-left: 20px;
			font-size: 18px;
			padding-top: 5px;
		}
		.right .title span {
			font-size: 8px;
		}
		.exit {
			position: absolute;
			top: 40px;
			right: 40px;
		}
		.exit image {
			width: 180px;
			height: 72px;
		}
		.data {
			position: absolute;
			left: 0;
			top: 0;
			color: #fff;
			font-size: 80px;
		}
		-webkit-scrollbar {
			color: transparent;
		}
		.curren1 {
			width: 452px;
			height: 403px;
			border-radius: 8px;
			padding-top: 28px;
		}
		.curren1 .curren2 {
			width: 249px;
			height: 260px;
			margin: 680px auto;
		}
		.curren1 .curren2 image {
			width: 250px;
			height: 260px;
			text-align: center;
			margin-left: 12px;
		}
		.curren1 text {
			width: 260px;
			height: 20px;
			display: block;
			opacity: 0.53;
			font-size: 28px;
			font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
			font-weight: normal;
			text-align: center;
			color: #ffffff;
		}
		.nocur {
			display: none;
		}
		.curren1 .head {
			width: 21px;
			height: 25px;
			transform: translateY(4px);
		}
		.curren1 .tet {
			width: 100%;
			text-align: center;
			opacity: 0.53;
			margin-bottom: 50px;
			padding-top: 50px;
			font-size: 22px;
		}
		.curren1 .btn {
			width: 212px;
			height: 51px;
			border: 1.33px solid #ffffff;
			border-radius: 25px;
			font-size: 10.5px;
			background-color: #254a9e;
			line-height: 51px;
			opacity: 0.7;
			margin-left: 120px;
		}
		.curren1 button span {
			width: 84px;
			height: 20px;
			font-size: 21px;
			font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
			font-weight: normal;
			text-align: left;
			color: #ffffff;
			margin-left: 7px;
		}
		scroll-view {
			height: 600px;
		}
		.conten{
			background: rgba(0,0,0, 0.6);
			position: fixed;
			z-index: 200;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}
		.conten{
			background: rgba(0,0,0, 0.6);
			position: fixed;
			z-index: 200;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}
		.conten .alert{
			position: fixed;
			top: calc(50% - 250px);
			left: calc(50% - 250px);
			z-index: 210;
			width: 500px;
			height: 500px;
			background-color: rgba(67,109,192,0.85);
			border: #079fff solid 3px;
			border-radius: 12px;
			opacity: 0.95;
			box-shadow: 0px 0px 20px 4px #079fff;
		}
		.conten .alert .title{
			width: 500px;
			height: 80px;
			text-align: center;
			border-bottom:1px solid rgb(255,255,255,0.5);
		}
		.conten .alert .title span{
			font-size: 24px;
			font-weight: 400;
			text-align: left;
			color: #fff;
			display: inline-block;
			height: 80px;
			line-height: 80px;
			padding-left: 30px;
			float: left;
			font-weight: bold;
		}
		.conten .alert .title image{
			float: right;
			width: 47px;
			height: 47px;
			padding: 15px 15px 0 0;
		}
		.conten .alert .center{
			width:100%;
			text-align: center;
			font-size: 28px;
			font-family: Microsoft YaHei, Microsoft YaHei-Regular;
			font-weight: 400;
			color: #ffffff;
			padding-top: 20px;
			margin:0;
		}
		.conten .alert .center ul li{
			width: calc(50% - 57px);
			height: 55px;
			line-height: 55px;
			text-align: left;
			margin: 0 10px 20px 25px;
			border-bottom: 1px #eee dotted;
			text-overflow: ellipsis;
			white-space: nowrap;
			font-size:20px;
			border: 1px solid rgb(255,255,255,0.5);
			text-align: center;
			border-radius: 50px;
			float:left;
			padding:0 10px;
			overflow: hidden;
		}
		.conten .alert .center ul li:nth-child(2n){
			margin: 0 25px 20px 10px;
		}
		.conten .alert .addcollect{
			width: 500px;
			height: 55px;
			text-align: center;
			padding-top: 20px;
		}
		.conten .alert .addcollect input{
			width: 320px;
			height: 55px;
			color:#6b6b6b;
			border-radius: 12px;
			background-color: #fff;
			display: inline-block;
			padding-left: 30px;
			text-align: left;
			font-size: 25px;
			border-top-left-radius: 50px;
			border-bottom-left-radius: 50px;
			border-top-right-radius: 0;
			border-bottom-right-radius: 0;
		}
		.conten .alert .addcollect .collectbtn{
			width: 100px;
			height: 55px;
			line-height: 55px;
			border-radius: 12px;
			background-color: #e03e5b;
			display: inline-block;
			font-size: 20px;
			color: #fff;
			border-top-left-radius: 0;
			border-bottom-left-radius: 0;
			border-top-right-radius: 50px;
			border-bottom-right-radius: 50px;
		}
		.trans{
			transform: translateY(-30px);
		}
		.collectbox{
			height:300px;
		} 
	}
	@media screen and (max-width: 1655px) and (min-width: 1286px){
		*{
			padding: 0px;
			margin: 0px;
		}
		.appbg {
			width: 100%;
			height: 100%;
			overflow: hidden;
			background-color: #0a1050;
			position: relative;
		}
		.home {
			width: 98%;
			height: 820px;
			margin: 140px 50px 50px;
			overflow: hidden;
		}
		.left {
			width: 24.4%; 
			height: 63%;
			float: left;
		}
		.search {
			width: 100%;
			height: auto;
			overflow: hidden;
		}
		.search input {
			width: 62%;
			height: 50px;
			border-top-left-radius: 50px;
			border-bottom-left-radius: 50px;
			float: left;
			color: #6b6b6b;
			padding-left: 50px;
			background: url('@/static/search.png') no-repeat #fff 15px 15px; 
			background-size: 22px;
			line-height: 50px;
		}
		.search .search-btn {
			width: 100px;
			height: 50px;
			background: #e03e5b;
			font-size: 18px;
			text-align: center;
			line-height: 50px;
			float: left;
			border-top-right-radius: 50px;
			border-bottom-right-radius: 50px;
			border-top-left-radius: 0;
			border-bottom-left-radius: 0;
			color: #fff;
			letter-spacing: 3px;
		}
		.search .search-btn:after {
			border: none;
		}
		.tab {
			width: 100%;
			height: 590px;
			margin-top: 28px;
			overflow: hidden;
			background: url('../../static/index_left_bg.png') no-repeat;
			border-top-right-radius: 18px;
		}
		.tabtitle li {
			width: 50%;
			height: 46px;
			text-align: center;
			float: left;
			font-size: 18px;
			line-height: 46px;
			border-bottom: 1px solid rgb(255,255,255,0.5);
		}
		.tabtitle li:first-child {
			border-top-left-radius: 18px;
		}
		.tabtitle li:last-child {
			border-top-right-radius: 18px;
		}
		.tabtitle .cur {
			background: #fff;
			color: #0a1050; 
		}
		.curren1{
			margin-top: -120%;
		}
		.img_notdata{
			width: 250px;
			height: 260px;
			margin-left: 140px;
			margin-top: 120px;
		}
		/* 歌曲列表 */
		.tablist {
			width: 100%;
			height: auto;
			padding: 15px 20px;
			overflow: hidden;
		}
		.tablist li {
			width: 100%;
			height: 50px;
			overflow: hidden;
			padding-top: 5px;
			padding-bottom: 11px;
			
		}
		.tablist .notmore {
			text-align: center;
			padding-bottom: 0;
			transform: translateY(8px);
			height: 46px;
			line-height: 60px;
			margin-left: -20px;
		}
		.tablist .notmore image {
			width: 28px;
			height: 28px;
			opacity: 0.63;
			transform: translateY(7px);
			margin-right: 20px;
		}
		.tablist .notmore text {
			width: 120px;
			height: 18px;
			opacity: 0.55;
			font-size: 18px;
			font-family: Microsoft YaHei, Microsoft YaHei-Regular;
			font-weight: 400;
			text-align: center;
			color: #ffffff;
			line-height: 18px;
		}
		.tablist .title {
			padding-bottom: 3px;
		}
		.tablist .title em {
			max-width: calc(100% - 21px);
			height: auto;
			overflow: hidden;
			font-style: normal;
			font-size: 18px;
		}
		.tablist .title em i {
			font-style: normal;
			padding-right: 20px;
			position: relative;
			top: 1px;
		}
		.tablist .title image {
			width: 18px;
			height: 18px;
			padding-left: 5px;
			position: relative;
			top: 3px;
		}
		.tablist .attr {
			width: calc(100% - 32px);
			height: auto;
			padding: 0 0 0 32px;
			opacity: 0.6;
		}
		.tablist .attr image {
			width: 16px;
			height: 16px !important;
			padding-right: 5px;
			position: relative;
			top: 2px;
		}
		.tablist .attr span {
			padding:5px 20px 10px 0;
			display: inline-block;
		}
		.center {
			width: 72%;
			height: 60%;
			margin: 0 0px 0 30px;
			overflow: hidden;
			float: left;
			text-align: center;
		}
		.center li {
			width: 21%;
			height: 100%;
			float: left;
			margin-right: 35px;
		}
		.center ul li view{
			border-top-left-radius: 10px;
			border-top-right-radius: 10px;
			width: 100%;
			height: 470px;
		}
		.center ul li:nth-child(1) view{
			background: url('@/static/index/aicourse-thumb_ipad.png') no-repeat;
			background-size: 100% 470px;
		}
		.center ul li:nth-child(2) view{
			background: url('@/static/index/orff-thumb_ipad.png') no-repeat;
			background-size: 100% 470px;
		}
		.center ul li:nth-child(3) view{
			background: url('@/static/index/hudong-thumb_ipad.png') no-repeat;
			background-size: 100% 470px;
		}
		.center ul li:nth-child(4) view{
			background: url('@/static/index/peilian-thumb_ipad.png') no-repeat;
			background-size: 100% 470px;
		}
		.center li p {
			font-size: 20px;
			text-align: center;
			line-height: 100px;
			letter-spacing: 1px;
			float: left;
			position: absolute;
			top: 520px;
		}
		.center ul li:nth-child(1) p,
		.center ul li:nth-child(2) p,
		.center ul li:nth-child(3) p{
			margin-left: 80px;
		}
		.center ul li:nth-child(4) p{
			margin-left: 105px;
		}
		.right {
			width: 72%;
			height: auto;
			float: left;
			overflow: hidden;
			margin-top: -5px;
			margin-left: 425px;
			display: flex;
		} 
		.right li {
			margin-right: 62px;
			border-radius: 5px;
			float: left;
			padding: 50px 90px;
		}
		.right li:first-child {
			background: #5bc338;
		}
		.right li:nth-child(2) {
			background: #4b93ff;
		}
		.right li:last-child {
			background: #ff3d53;
			margin-bottom: 0;
		}
		.right image {
			width: 40px;
			height: 40px;
			float: left;
			margin-top: 10px;
		}
		.right .title {
			width: 80px;
			height: auto;
			float: left;
			padding-left: 20px;
			font-size: 18px;
			padding-top: 5px;
		}
		.right .title span {
			font-size: 8px;
		}
		.exit {
			position: absolute;
			top: 40px;
			right: 20px;
		}
		.exit image {
			width: 180px;
			height: 72px;
		}
		.data {
			position: absolute;
			left: 0;
			top: 0;
			color: #fff;
			font-size: 80px;
		}
		-webkit-scrollbar {
			color: transparent;
		}
		.curren1 {
			width: 452px;
			height: 403px;
			border-radius: 8px;
			padding-top: 28px;
			margin-left: -65px;
		}
		.curren1 .curren2 {
			width: 249px;
			height: 260px;
			margin-top: 550px;
			margin-left: 130px;
		}
		.curren1 .curren2 image {
			width: 250px;
			height: 260px;
			text-align: center;
			margin-left: 12px;
		}
		.curren1 text {
			width: 260px;
			height: 20px;
			display: block;
			opacity: 0.53;
			font-size: 20px;
			font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
			font-weight: normal;
			text-align: center;
			color: #ffffff;
		}
		.nocur {
			display: none;
		}
		.curren1 .head {
			width: 21px;
			height: 25px;
			transform: translateY(4px);
		}
		.curren1 .tet {
			opacity: 0.53;
			margin-bottom: 30px;
			margin-left: 130px;
		}
		.curren1 .btn {
			width: 212px; 
			height: 51px;
			border: 1.33px solid #ffffff;
			border-radius: 25px;
			font-size: 10.5px;
			background-color: #254a9e;
			line-height: 51px;
			opacity: 0.7;
			margin-left: 150px;
		} 
		.curren1 button span {
			width: 84px;
			height: 20px;
			font-size: 21px;
			font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
			font-weight: normal;
			text-align: left;
			color: #ffffff;
			margin-left: 7px;
		}
		scroll-view {
			height: 500px;
		}
		.conten{
			 background: rgba(0,0,0,0.6);
			 position: fixed;
			 z-index: 200;
			 top: 0;
			 left: 0;
			 width: 100%;
			 height: 100%;
		}
		.conten{
			background: rgba(0,0,0, 0.6);
			position: fixed;
			z-index: 200;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}
		.conten .alert{
			position: fixed;
			top: calc(50% - 250px);
			left: calc(50% - 250px);
			z-index: 210;
			width: 500px;
			height: 500px;
			background-color: rgba(67,109,192,0.85);
			border: #079fff solid 3px;
			border-radius: 12px;
			opacity: 0.95;
			box-shadow: 0px 0px 20px 4px #079fff;
		}
		.conten .alert .title{
			width: 500px;
			height: 80px;
			text-align: center;
			border-bottom:1px solid rgb(255,255,255,0.5);
		}
		.conten .alert .title span{
			font-size: 24px;
			font-weight: 400;
			text-align: left;
			color: #fff;
			display: inline-block;
			height: 80px;
			line-height: 80px;
			padding-left: 30px;
			float: left;
			font-weight: bold;
		}
		.conten .alert .title image{
			float: right;
			width: 47px;
			height: 47px;
			padding: 15px 15px 0 0;
		}
		.conten .alert .center{
			width:100%;
			text-align: center;
			font-size: 28px;
			font-family: Microsoft YaHei, Microsoft YaHei-Regular;
			font-weight: 400;
			color: #ffffff;
			padding-top: 20px;
			margin:0;
		}
		.conten .alert .center ul li{
			width: calc(50% - 57px);
			height: 55px;
			line-height: 55px;
			text-align: left;
			margin: 0 10px 20px 25px;
			border-bottom: 1px #eee dotted;
			text-overflow: ellipsis;
			white-space: nowrap;
			font-size:20px;
			border: 1px solid rgb(255,255,255,0.5);
			text-align: center;
			border-radius: 50px;
			float:left;
			padding:0 10px;
			overflow: hidden;
		}
		.conten .alert .center ul li:nth-child(2n){
			margin: 0 25px 20px 10px;
		}
		.conten .alert .addcollect{
			width: 500px;
			height: 55px;
			text-align: center;
			padding-top: 20px;
		}
		.conten .alert .addcollect input{
			width: 320px;
			height: 55px;
			color:#6b6b6b;
			border-radius: 12px;
			background-color: #fff;
			display: inline-block;
			padding-left: 30px;
			text-align: left;
			font-size: 25px;
			border-top-left-radius: 50px;
			border-bottom-left-radius: 50px;
			border-top-right-radius: 0;
			border-bottom-right-radius: 0;
		}
		.conten .alert .addcollect .collectbtn{
			width: 100px;
			height: 55px;
			line-height: 55px;
			border-radius: 12px;
			background-color: #e03e5b;
			display: inline-block;
			font-size: 20px;
			color: #fff;
			border-top-left-radius: 0;
			border-bottom-left-radius: 0;
			border-top-right-radius: 50px;
			border-bottom-right-radius: 50px;
		}
		.trans{
			transform: translateY(-30px);
		}
		.collectbox{
			height:300px;
		}
	}
	@media screen and (max-width: 1285px) and (min-width: 1006px){
		*{
			padding: 0px;
			margin: 0px;
		}
		.appbg {
			width: calc(100% - 100px);
			height: 100%;
			overflow: hidden;  
			background-color: #0a1050;
			position: relative;
			padding:100px 50px;
		}
		.home {
			width: 100%;
			height: 550px;
			overflow: hidden;
		}
		.left {
			width: 28%; 
			height: 550px;
			float: left;
			overflow: hidden;
		}
		.search {
			width: 100%;
			height: auto;
			overflow: hidden;
		}
		.search input {
			width: calc(70% - 50px);
			height: 50px;
			border-top-left-radius: 50px;
			border-bottom-left-radius: 50px;
			float: left;
			color: #6b6b6b;
			padding-left: 50px;
			background: url('@/static/search.png') no-repeat #fff 15px 15px; 
			background-size: 20px;
			line-height: 50px;
		}
		.search .search-btn {
			width: 30%;
			height: 50px;
			background: #e03e5b;
			font-size: 18px;
			text-align: center;
			line-height: 50px;
			float: left;
			border-top-right-radius: 50px;
			border-bottom-right-radius: 50px;
			border-top-left-radius: 0;
			border-bottom-left-radius: 0;
			color: #fff;
			letter-spacing: 3px;
		}
		.search .search-btn:after {
			border: none;
		}
		.tab {
			width: 100%;
			height: 450px;
			margin-top: 28px;
			overflow: hidden;
			background: url('../../static/index_left_bg.png') no-repeat;
			border-top-right-radius: 18px;
			border-bottom-left-radius: 5px;
			border-bottom-right-radius: 5px;
		}
		.tabtitle li {
			width: 50%;
			height: 40px;
			text-align: center;
			float: left;
			font-size: 14px;
			line-height: 46px;
			border-bottom: 1px solid rgb(255,255,255,0.5);
		}
		.tabtitle li:first-child {
			border-top-left-radius: 18px;
		}
		.tabtitle li:last-child {
			border-top-right-radius: 18px;
		}
		.tabtitle .cur {
			background: #fff;
			color: #0a1050; 
		}
		.curren1{
			margin-top: -120%;
		}
		.curren1 .img_notdata{
			width: 180px;
			height: 180px;
			position: absolute;
			left: 130px;
			top: 300px;
		}
		.curren1 .tet {
			opacity: 0.53;
			margin-bottom: 20px;
			margin-left: 95px;
			margin-top: 600px;
		}
		.curren1 .btn {
			width: 212px; 
			height: 51px;
			border: 1.33px solid #ffffff;
			border-radius: 25px;
			font-size: 6px;
			background-color: #254a9e;
			line-height: 51px;
			opacity: 0.7;
			margin-left: 120px;
		} 
		.curren1 button span {
			width: 84px;
			height: 20px;
			font-size: 17px;
			font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
			font-weight: normal;
			text-align: left;
			color: #ffffff;
			margin-left: 7px;
		}
		/* 歌曲列表 */
		.tablist {
			width: 100%;
			height: auto;
			padding: 15px 20px;
			overflow: hidden;
		}
		.tablist li {
			width: 100%;
			height: 50px;
			overflow: hidden;
			padding-top: 5px;
			padding-bottom: 11px;
			
		}
		.tablist .notmore {
			text-align: center;
			padding-bottom: 0;
			transform: translateY(8px);
			height: 46px;
			/* line-height: 60px; */
			margin-left: -20px;
			/* margin-top: -20px; */
		}
		.tablist .notmore image {
			width: 28px;
			height: 28px;
			opacity: 0.63;
			transform: translateY(7px);
			margin-right: 20px;
		}
		.tablist .notmore text {
			width: 120px;
			height: 18px;
			opacity: 0.55;
			font-size: 14px;
			font-family: Microsoft YaHei, Microsoft YaHei-Regular;
			font-weight: 400;
			text-align: center;
			color: #ffffff;
			line-height: 18px;
		}
		.tablist .title {
			padding-bottom: 3px;
		}
		.tablist .title em {
			max-width: calc(100% - 21px);
			height: auto;
			overflow: hidden;
			font-style: normal;
			font-size: 14px;
		}
		.tablist .title em i {
			font-style: normal;
			padding-right: 20px;
			position: relative;
			top: 1px;
		}
		.tablist .title image {
			width: 18px;
			height: 18px;
			padding-left: 5px;
			position: relative;
			top: 3px;
		}
		.tablist .attr {
			width: calc(100% - 32px);
			height: auto;
			padding: 0 0 0 32px;
			opacity: 0.6;
		}
		.tablist .attr image {
			width: 16px;
			height: 16px !important;
			padding-right: 5px;
			position: relative;
			top: 2px;
		}
		.tablist .attr span {
			padding:5px 20px 10px 0;
			display: inline-block;
		}
		.center {
			width: calc(72% - 30px);
			height: 374px;
			margin: 0 0px 0 30px;
			overflow: hidden;
			float: left;
			text-align: center
		}
		.center li {
			width: calc(25% - 23.5px);
			height: 430px;
			float: left;
			margin-right: 30px;
		}
		.center ul li view {
			border-top-left-radius: 10px;
			border-top-right-radius: 10px;
			width: 100%;
			height: 374px;
		}
		.center ul li:nth-child(1) view{
			background: url('@/static/index/aicourse-thumb_ipad.png') no-repeat;
			background-size: 100% 374px;
		}
		.center ul li:nth-child(2) view{
			background: url('@/static/index/orff-thumb_ipad.png') no-repeat;
			background-size: 100% 374px;
		}
		.center ul li:nth-child(3) view{
			background: url('@/static/index/hudong-thumb_ipad.png') no-repeat;
			background-size: 100% 374px;
		}
		.center ul li:nth-child(4) view{
			background: url('@/static/index/peilian-thumb_ipad.png') no-repeat;
			background-size: 100% 374px;
		}
		.center li p {
			font-size: 16px;
			text-align: center;
			line-height: 100px;
			letter-spacing: 1px;
			float: left;
			position: absolute;
			top: 395px;
		}
		.center ul li:nth-child(1) p,
		.center ul li:nth-child(2) p,
		.center ul li:nth-child(3) p{
			margin-left: 55px;
		}
		.center ul li:nth-child(4) p{
			margin-left: 80px;
		}
		.center li:last-child{
			margin-right:0;
		}
		.right {
			width: calc(72% - 30px);
			height: auto;
			float: left;
			overflow: hidden;
			margin-top: 30px;
			margin-left:30px;
		} 
		.right li {
			width:calc(33.33% - 120px);
			margin-right: 38px;
			border-radius: 5px;
			float: left;
			padding: 38px 60px 38px 40px;
			margin-right:30px;
		}
		.right li:first-child {
			background: #5bc338;
		}
		.right li:nth-child(2) {
			background: #4b93ff;
		}
		.right li:last-child {
			background: #ff3d53;
			margin-bottom: 0;
			margin-right:0;
		}
		.right image {
			width: 40px;
			height: 40px;
			float: left;
			margin-top: 6px;
		}
		.right .title {
			width: calc(100% - 60px);
			height: auto;
			float: left;
			padding-left: 20px;
			font-size: 14px;
			padding-top: 5px;
		}
		.right .title span {
			font-size: 6px;
		}
		.exit {
			position: absolute;
			top: 20px;
			right: 45px;
		}
		.exit image {
			width: 130px;
			height: 52px;
		}
		.data {
			position: absolute;
			left: 0;
			top: 0;
			color: #fff;
			font-size: 80px;
		}
		-webkit-scrollbar {
			color: transparent;
		}
		.curren1 {
			width: 452px;
			height: 403px;
			border-radius: 8px;
			padding-top: 28px;
			margin-left: -65px;
		}
		.curren1 .curren2 {
			width: 249px;
			height: 260px;
			text-align: center;
			margin-top: 450px;
			margin-left: 100px;
		}
		.curren1 .curren2 image {
			width: 155px;
			height: 122px;
			text-align: center;
			margin-left: 12px;
		}
		.curren1 text {
			width: 260px;
			height: 20px;
			display: block;
			opacity: 0.53;
			font-size: 16px;
			font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
			font-weight: normal;
			text-align: center;
			color: #ffffff;
		}
		.nocur {
			display: none;
		}
		.curren1 .head {
			width: 21px;
			height: 25px;
			transform: translateY(4px);
		}
		
		scroll-view {
			height: 400px;
		}
		.conten{
			 background: rgba(0,0,0,0.6);
			 position: fixed;
			 z-index: 200;
			 top: 0;
			 left: 0;
			 width: 100%;
			 height: 100%;
		}
		.conten{
			background: rgba(0,0,0, 0.6);
			position: fixed;
			z-index: 200;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}
		.conten .alert{
			position: fixed;
			top: calc(50% - 250px);
			left: calc(50% - 250px);
			z-index: 210;
			width: 500px;
			height: 500px;
			background-color: rgba(67,109,192,0.85);
			border: #079fff solid 3px;
			border-radius: 12px;
			opacity: 0.95;
			box-shadow: 0px 0px 20px 4px #079fff;
		}
		.conten .alert .title{
			width: 500px;
			height: 80px;
			text-align: center;
			border-bottom:1px solid rgb(255,255,255,0.5);
		}
		.conten .alert .title span{
			font-size: 20px;
			font-weight: 400;
			text-align: left;
			color: #fff;
			display: inline-block;
			height: 80px;
			line-height: 80px;
			padding-left: 30px;
			float: left;
			font-weight: bold;
		}
		.conten .alert .title image{
			float: right;
			width: 47px;
			height: 47px;
			padding: 15px 15px 0 0;
		}
		.conten .alert .center{
			width:100%;
			text-align: center;
			font-size: 24px;
			font-family: Microsoft YaHei, Microsoft YaHei-Regular;
			font-weight: 400;
			color: #ffffff;
			padding-top: 20px;
			margin:0;
		}
		.conten .alert .center ul li{
			width: calc(50% - 57px);
			height: 55px;
			line-height: 55px;
			text-align: left;
			margin: 0 10px 20px 25px;
			border-bottom: 1px #eee dotted;
			text-overflow: ellipsis;
			white-space: nowrap;
			font-size: 16px;
			border: 1px solid rgb(255,255,255,0.5);
			text-align: center;
			border-radius: 50px;
			float:left;
			padding:0 10px;
			overflow: hidden;
		}
		.conten .alert .center ul li:nth-child(2n){
			margin: 0 25px 20px 10px;
		}
		.conten .alert .addcollect{
			width: 500px;
			height: 55px;
			text-align: center;
			padding-top: 20px;
		}
		.conten .alert .addcollect input{
			width: 320px;
			height: 55px;
			color:#6b6b6b;
			border-radius: 12px;
			background-color: #fff;
			display: inline-block;
			padding-left: 30px;
			text-align: left;
			font-size: 20px;
			border-top-left-radius: 50px;
			border-bottom-left-radius: 50px;
			border-top-right-radius: 0;
			border-bottom-right-radius: 0;
		}
		.conten .alert .addcollect .collectbtn{
			width: 100px;
			height: 55px;
			line-height: 55px;
			border-radius: 12px;
			background-color: #e03e5b;
			display: inline-block;
			font-size: 16px;
			color: #fff;
			border-top-left-radius: 0;
			border-bottom-left-radius: 0;
			border-top-right-radius: 50px;
			border-bottom-right-radius: 50px; 
		}
		.trans{
			transform: translateY(-30px);
		}
		.collectbox{
			height:280px;
		} 
	}
	@media screen and (max-width: 1005px) {
		*{
			padding: 0px;
			margin: 0px;
		}
		.appbg {
			width: calc(100% - 100px);
			height: 100%;
			overflow: hidden;  
			background-color: #0a1050;
			position: relative;
			padding:100px 50px;
		}
		.home {
			width: 100%;
			height: 440px;
			overflow: hidden;
		}
		.left {
			width: 28%; 
			height: 550px;
			float: left;
			overflow: hidden;
		}
		.search {
			width: 100%;
			height: auto;
			overflow: hidden;
		}
		.search input {
			width: calc(70% - 50px);
			height: 40px;
			border-top-left-radius: 50px;
			border-bottom-left-radius: 50px;
			float: left;
			color: #6b6b6b;
			padding-left: 50px;
			background: url('@/static/search.png') no-repeat #fff 20px;
			background-size: 20px;
			line-height: 50px;
		}
		.search .search-btn {
			width: 30%;
			height: 40px;
			background: #e03e5b;
			font-size: 16px;
			text-align: center;
			float: left;
			border-top-right-radius: 50px;
			border-bottom-right-radius: 50px;
			border-top-left-radius: 0;
			border-bottom-left-radius: 0;
			color: #fff;
			letter-spacing: 3px;
		}
		.search .search-btn:after {
			border: none;
		}
		.tab {
			width: 100%;
			height: 380px;
			margin-top: 20px;
			overflow: hidden;
			background: url('../../static/index_left_bg.png') no-repeat;
			border-top-right-radius: 18px;
			border-bottom-left-radius: 5px;
			border-bottom-right-radius: 5px;
		}
		.tabtitle li {
			width: 50%;
			height: 40px;
			text-align: center;
			float: left;
			font-size: 14px;
			line-height: 46px;
			border-bottom: 1px solid rgb(255,255,255,0.5);
		}
		.tabtitle li:first-child {
			border-top-left-radius: 18px;
		}
		.tabtitle li:last-child {
			border-top-right-radius: 18px;
		}
		.tabtitle .cur {
			background: #fff;
			color: #0a1050; 
		}
		.curren1{
			margin-top: -120%;
		}
		/* 未登录状态提示 */
		.curren1 .img_notdata{
			width: 150px;
			height: 150px;
			position: absolute;
			left: 110px;
			top: 250px;
		}
		.curren1 .tet {
			opacity: 0.53;
			margin-bottom: 20px;
			margin-left: 65px;
			margin-top: 450px;
		}
		.curren1 .btn {
			width: 180px; 
			height: 45px;
			border: 1.33px solid #ffffff;
			border-radius: 25px;
			font-size: 6px;
			background-color: #254a9e;
			opacity: 0.7;
			float: left;
			margin-left: 100px;
		} 
		.curren1 button span {
			width: 84px;
			height: 20px;
			font-size: 17px;
			font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
			font-weight: normal;
			text-align: left;
			color: #ffffff;
			margin-left: 7px;
		}
		/* 歌曲列表 */
		.tablist {
			width: 100%;
			height: auto;
			padding: 15px 20px;
			overflow: hidden;
		}
		.tablist li {
			width: 100%;
			height: 50px;
			overflow: hidden;
			padding-top: 5px;
			padding-bottom: 11px;
		}
		.tablist .notmore {
			text-align: center;
			padding-bottom: 0;
			transform: translateY(8px);
			/* height: 46px; */
			line-height: 60px;
			margin-left: -20px;
			margin-top: -20px;
		}
		.tablist .notmore image {
			width: 20px;
			height: 20px;
			opacity: 0.63;
			transform: translateY(7px);
			margin-right: 10px;
			margin-top: -15px;
		}
		.tablist .notmore text {
			width: 120px;
			height: 18px;
			opacity: 0.55;
			font-size: 14px;
			font-family: Microsoft YaHei, Microsoft YaHei-Regular;
			font-weight: 400;
			text-align: center;
			color: #ffffff;
		}
		.tablist .title {
			padding-bottom: 3px;
		}
		.tablist .title em {
			max-width: calc(100% - 21px);
			height: auto;
			overflow: hidden;
			font-style: normal;
			font-size: 14px;
		}
		.tablist .title em i {
			font-style: normal;
			padding-right: 20px;
			position: relative;
			top: 1px;
		}
		.tablist .title image {
			width: 18px;
			height: 18px;
			padding-left: 5px;
			position: relative;
			top: 3px;
		}
		.tablist .attr {
			width: calc(100% - 32px);
			height: auto;
			padding: 0 0 0 32px;
			opacity: 0.6;
		}
		.tablist .attr image {
			width: 16px;
			height: 16px !important;
			padding-right: 5px;
			position: relative;
			top: 2px;
		}
		.tablist .attr span {
			padding:5px 20px 10px 0;
			display: inline-block;
		}
		scroll-view {
			height: 320px;
		}
		.center {
			width: calc(72% - 30px);
			height: 300px;
			margin-left: 30px;
			overflow: hidden;
			float: left;
			text-align: center;
		}
		.center li {
			width: calc(25% - 23.5px);
			height: 300px;
			float: left;
			margin-right: 30px;
		}
		.center ul li view {
			border-top-left-radius: 10px;
			border-top-right-radius: 10px;
			width: 100%;
			height: 300px;
		}
		.center ul li:nth-child(1) view{
			background: url('@/static/index/peilian-thumb_ipad.png') no-repeat;
			background-size: 100% 300px;
		}
		.center ul li:nth-child(2) view{
			background: url('@/static/index/orff-thumb_ipad.png') no-repeat;
			background-size: 100% 300px;
		}
		.center ul li:nth-child(3) view{
			background: url('@/static/index/hudong-thumb_ipad.png') no-repeat;
			background-size: 100% 300px;
		}
		.center ul li:nth-child(4) view{
			background: url('@/static/index/peilian-thumb_ipad.png') no-repeat;
			background-size: 100% 300px;
		}
		.center li p {
			font-size: 14px;
			text-align: center;
			line-height: 100px;
			letter-spacing: 1px;
			float: left;
			position: absolute;
			top: 330px;
		}
		.center ul li:nth-child(1) p,
		.center ul li:nth-child(2) p,
		.center ul li:nth-child(3) p{
			margin-left: 40px;
		}
		.center ul li:nth-child(4) p{
			margin-left: 60px;
		}
		.center li:last-child{
			margin-right:0;
		}
		.right {
			width: 615px;
			height: 110px;
			float: left;
			overflow: hidden;
			margin-top: 30px;
			margin-left: 30px;
		} 
		.right li {
			width: 166px;
			height: 40px;
			border-radius: 5px;
			float: left;
			padding: 33px 0px 35px 30px;
			
		}
		.right li:first-child {
			background: #5bc338;
			border-bottom-left-radius: 5px;
		}
		.right li:nth-child(2) {
			background: #4b93ff;
			margin-left: 13px;
		}
		.right li:last-child {
			background: #ff3d53;
			margin-left: 14px;
		}
		.right image {
			width: 30px;
			height: 30px;
			float: left;
			margin-top: 10px;
		}
		.right .title {
			width: 80px;
			height: auto;
			float: left;
			padding-left: 20px;
			font-size: 14px;
			padding-top: 5px;
		}
		.right .title span {
			font-size: 6px;
		}
		.exit {
			position: absolute;
			top: 20px;
			right: 45px;
		}
		.exit image {
			width: 130px;
			height: 52px;
		}
		.data {
			position: absolute;
			left: 0;
			top: 0;
			color: #fff;
			font-size: 80px;
		}
		-webkit-scrollbar {
			color: transparent;
		}
		.curren1 {
			width: 452px;
			height: 403px;
			border-radius: 8px;
			padding-top: 28px;
			margin-left: -65px;
		}
		.curren1 .curren2 {
			width: 249px;
			height: 260px;
			text-align: center;
			margin-top: 330px;
			margin-left: 70px;
		}
		.curren1 .curren2 image {
			width: 155px;
			height: 122px;
			text-align: center;
			margin-left: 12px;
		}
		.curren1 text {
			width: 260px;
			height: 20px;
			display: block;
			opacity: 0.53;
			font-size: 16px;
			font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
			font-weight: normal;
			text-align: center;
			color: #ffffff;
		}
		.nocur {
			display: none;
		}
		.curren1 .head {
			width: 21px;
			height: 25px;
			transform: translateY(4px);
		}
		.conten{
			 background: rgba(0,0,0,0.6);
			 position: fixed;
			 z-index: 200;
			 top: 0;
			 left: 0;
			 width: 100%;
			 height: 100%;
		}
		.conten{
			background: rgba(0,0,0, 0.6);
			position: fixed;
			z-index: 200;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}
		.conten .alert{
			position: fixed;
			top: calc(50% - 250px);
			left: calc(50% - 250px);
			z-index: 210;
			width: 500px;
			height: 500px;
			background-color: rgba(67,109,192,0.85);
			border: #079fff solid 3px;
			border-radius: 12px;
			opacity: 0.95;
			box-shadow: 0px 0px 20px 4px #079fff;
		}
		.conten .alert .title{
			width: 500px;
			height: 80px;
			text-align: center;
			border-bottom:1px solid rgb(255,255,255,0.5);
		}
		.conten .alert .title span{
			font-size: 20px;
			font-weight: 400;
			text-align: left;
			color: #fff;
			display: inline-block;
			height: 80px;
			line-height: 80px;
			padding-left: 30px;
			float: left;
			font-weight: bold;
		}
		.conten .alert .title image{
			float: right;
			width: 47px;
			height: 47px;
			padding: 15px 15px 0 0;
		}
		.conten .alert .center{
			width:100%;
			text-align: center;
			font-size: 24px;
			font-family: Microsoft YaHei, Microsoft YaHei-Regular;
			font-weight: 400;
			color: #ffffff;
			padding-top: 20px;
			margin:0;
		}
		.conten .alert .center ul li{
			width: calc(50% - 57px);
			height: 55px;
			line-height: 55px;
			text-align: left;
			margin: 0 10px 20px 25px;
			border-bottom: 1px #eee dotted;
			text-overflow: ellipsis;
			white-space: nowrap;
			font-size: 16px;
			border: 1px solid rgb(255,255,255,0.5);
			text-align: center;
			border-radius: 50px;
			float:left;
			padding:0 10px;
			overflow: hidden;
		}
		.conten .alert .center ul li:nth-child(2n){
			margin: 0 25px 20px 10px;
		}
		.conten .alert .addcollect{
			width: 500px;
			height: 55px;
			text-align: center;
			padding-top: 20px;
		}
		.conten .alert .addcollect input{
			width: 320px;
			height: 55px;
			color:#6b6b6b;
			border-radius: 12px;
			background-color: #fff;
			display: inline-block;
			padding-left: 30px;
			text-align: left;
			font-size: 20px;
			border-top-left-radius: 50px;
			border-bottom-left-radius: 50px;
			border-top-right-radius: 0;
			border-bottom-right-radius: 0;
		}
		.conten .alert .addcollect .collectbtn{
			width: 100px;
			height: 55px;
			line-height: 55px;
			border-radius: 12px;
			background-color: #e03e5b;
			display: inline-block;
			font-size: 16px;
			color: #fff;
			border-top-left-radius: 0;
			border-bottom-left-radius: 0;
			border-top-right-radius: 50px;
			border-bottom-right-radius: 50px;
		}
		.trans{
			transform: translateY(-30px);
		}
		.collectbox{
			height:300px;
		} 
	}
</style>