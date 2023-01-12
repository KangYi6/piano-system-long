<template>
	<div class="appbg">
		<top></top>
		<div class="content clearfix">
			<div class="musicxml">
				<div class="search clearfix">
					<div class="input">
						<input type="text" :placeholder="keyword" @input="searchInput" @confirm="search()">
						<button class="search-btn" @click="search()">搜索</button>
					</div>
					<div class="commandkey">
						<span v-for="(item,index) in globalData.hotkey" @click='getkey(item)' v-show="index<4">{{item}}</span>
					</div>
				</div>
				<div class="musicxmlbox" v-if="list.length>=1">
					<scroll-view class="sv1" scroll-y="true" show-scrollbar="true" @scrolltolower="pagecur" lower-threshold="200" scroll-with-animation="true" android:scrollbars="none">
					<ul>
						<li v-for="(item,index) in list" :key="index" @click="musicxml(item.m_id,item.m_title);">
							<div class="title">
								<em><i>{{index+1}}.</i>{{item.m_title}}</em>
								<image src="@/static/fire-red.png" v-show="index==0"></image>
								<image src="../../static/fire-orange.png" v-show="index==1"></image>
							</div>
							<div class="attr">
								<span><image src="@/static/uploader.png" mode="widthFix"></image>{{item.u_nickname}}</span>
								<span><image src="@/static/eyes.png" mode="widthFix"></image>{{item.m_view}}</span>
								<span @click.stop="open(item.m_id,index)">
									<image src="@/static/collect-hover.png" mode="widthFix" v-if="searchcid.some(res=>res==item.m_id)"></image>
									<image src="@/static/collect.png" mode="widthFix" v-else></image>
									{{item.m_collect}}
								</span>
								<span @click.stop="fabulousthree(item.m_id,index)">
									<image src="@/static/thumbs-up-hover.png" mode="widthFix" v-if="searchvid.some(res=>res==item.m_id)"></image>
									<image src="@/static/thumbs-up.png" mode="widthFix" v-else></image>
									{{item.m_fabulous}}
								</span>
							</div>
						</li>
						<li class="notmore" v-show="notmorefour"><image src="../../static/xiaolian.png" mode="widthFix"></image><text>没有更多了哦</text></li>
					</ul>
					</scroll-view>
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
							<scroll-view scroll-y="true" scroll-with-animation="true" android:scrollbars="none">
								<ul>
									<li v-for="(i,d) in collect" :key="d" @click="addcollect(i.cc_id,i.cc_name)">{{i.cc_name}}</li>
								</ul>
							</scroll-view>
						</div>
					</div>
				</div>
				<div v-else-if="list.length==0" class="musicxmlnone">
					<image src="@/static/book.png" class="imgs"></image>
					<text class="tel">暂未找到您想要的曲谱</text>
					<button @click="seeking('show')">
						<image src="@/static/fly.png"></image>
						<span>我要求谱</span>
					</button>
				</div>
			</div>
			<div class="history">
				<div class="tabtitle">
					<ul>
						<li :class="{cur:curren==1}" @click="actives(1)">历史记录</li>
						<li :class="{cur:curren==2}" @click="actives(2)">推送记录</li>
					</ul>
				</div>
				<!-- 未登录前 -->
				<div v-show="curren == 1 && !globalData.login" class="curren1">
					<div>
						<text class="tet">暂时没有您的记录，请登录哦</text>
						<button class="btn" @click="backlogin">
							<image src="../../static/head.png" class="head"></image>
							<span>立即登录</span>
						</button>
					</div>
				</div>
				<!-- 登录成功后 -->
				<div class="list" v-show="curren==1 && globalData.login">
					<scroll-view class="scrollRight" scroll-y="true" show-scrollbar="true" scroll-with-animation="true" android:scrollbars="none" @scrolltolower="historyload">
					<ul>
						<li v-for="(item,index) in history" :key=index @click="musicxml(item.m_id,item.m_title)">
							<image src="@/static/note-icon.png" mode="widthFix" v-show="item"></image>
							<span>{{item.m_title}}</span>
						</li>
						<li class="notmore" v-show="notmorethree"><image src="../../static/xiaolian.png" mode="widthFix"></image><text>没有更多了哦</text></li>
					</ul>
		         </scroll-view>
				</div>
				<!-- 未登录前 -->
				<div v-show="curren == 2 && !globalData.login" class="curren1">
					<div>
						<text class="tet">暂时没有您的记录，请登录哦</text>
						<button class="btn" @click="backlogin">
							<image src="../../static/head.png" class="head"></image>
							<span>立即登录</span>
						</button>
					</div>
				</div>
				<!-- 登录成功后 -->
				<div class="list" v-show="curren==2 && globalData.login">
					<scroll-view class="scrollRight" scroll-y="true" show-scrollbar="true" scroll-with-animation="true" android:scrollbars="none" @scrolltolower="Pushload">
					<ul>
						<li v-for="(items,index) in record" :key=index @click="gorecord(items.p_content,items.p_type)">
							<image src="@/static/note-icon.png" mode="widthFix" v-show="items"></image>
							<span>{{items.p_title}}</span>
						</li>
					</ul>
					</scroll-view>
				</div>
			</div>
			<div class="mymusicxml">
				<div class="tabtitle">
					<ul>
						<li :class="{cur:curre==1}" @click="south(1)">我的收藏</li>
						<li :class="{cur:curre==2}" @click="south(2)">我的曲谱</li>
					</ul>
				</div>
				<!-- 未登录前 -->
				<div v-show="curre == 1 && !globalData.login" class="curren1">
					<div>
						<text class="tet">暂时没有您的记录，请登录哦</text>
						<button class="btn" @click="backlogin">
							<image src="../../static/head.png" class="head"></image>
							<span>立即登录</span>
						</button>
					</div>
				</div>
				<!-- 登录成功后 -->
				<div class="list" v-show="curre==1 && collectyes==false && globalData.login">
					<scroll-view class="scrollRight" scroll-y="true" show-scrollbar="true" scroll-with-animation="true" android:scrollbars="none" @scrolltolower="loadcollect">
					<ul>
						<li class="clearfix" v-for="(item,index) in collect" :key=index @click="getcollectxml(item.cc_id)" @longpress="longpresscollect(item.cc_id)">
							<div class="thumb">
								<image src="@/static/collect-thumb.png" mode="widthFix"></image>
							</div>
							<div class="info">
								<p>{{item.cc_name}}</p>
								<span>{{item.count}}首</span>
							</div>
							<div class="more">
								<image src="@/static/right-icon.png" mode="widthFix"></image>
							</div>
						</li>
					</ul>
					</scroll-view>
				</div>
				<!-- 未登录前 -->
				<div v-show="curre == 2 && !globalData.login" class="curren1">
					<div>
						<text class="tet">暂时没有您的记录，请登录哦</text>
						<button class="btn" @click="backlogin">
							<image src="../../static/head.png" class="head"></image>
							<span>立即登录</span>
						</button>
					</div>
				</div>
				<!-- 登录成功后 -->
				<div class="list" v-show="curre==2 && Musicalyes==false && globalData.login">
					<scroll-view class="scrollRight" scroll-y="true" show-scrollbar="true" scroll-with-animation="true" android:scrollbars="none" @scrolltolower="loadMusical">
					<ul>
						<li class="clearfix" v-for="(item,index) in Musical" :key=index @click="getMusicalxml(item.mc_id)">
							<div class="thumb">
								<image src="@/static/collect-thumb.png" mode="widthFix"></image>
							</div>
							<div class="info">
								<p>{{item.mc_name}}</p>
								<span>{{item.count}}首</span>
							</div>
							<div class="more">
								<image src="@/static/right-icon.png" mode="widthFix"></image>
							</div>
						</li>
					</ul>
					</scroll-view>
				</div>
				<!-- 我的收藏里曲谱列表 -->
				<div class="tablist" v-show="curre == 1 && collectyes">
					<scroll-view
						scroll-y="true"
						show-scrollbar="true"
						@scrolltolower="loadcollectxml"
						lower-threshold="500px"
						scroll-with-animation="true"
						android:scrollbars="none"
						class="scrollRight"
					>
						<ul>
							<li v-for="(item, index) in collectxml" :key="item.m_id" @click="musicxml(item.m_id, item.m_title)" @longpress="longpresscollectxml(item.m_id)">
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
									<span>
										<image src="@/static/collect.png" mode="widthFix"></image>
										{{ item.m_collect }}
									</span>
									<span @click.stop="fabuloustwo(item.m_id,index)">
										<image src="@/static/thumbs-up-hover.png" mode="widthFix" v-if="collectvid.some(res=>res==item.m_id)"></image>
										<image src="@/static/thumbs-up.png" mode="widthFix" v-else></image>
										{{ item.m_fabulous }}
									</span>
								</div>
							</li>
							<li class="notmore" v-show="notmore"><image src="../../static/xiaolian.png" mode="widthFix"></image><text>没有更多了哦</text></li>
						</ul>
					</scroll-view>
					<button class="collectbtn" @click="collectback">
						<image src="../../static/back.png" mode="widthFix"></image>
					   <span>返回</span>
					</button>
				</div>
				<!-- 我的曲谱里曲谱列表 -->
				<div class="tablist" v-show="curre == 2 && Musicalyes">
					<scroll-view
						class="scrollRight"
						scroll-y="true"
						show-scrollbar="true"
						@scrolltolower="loadMusicalxml"
						lower-threshold="500px"
						scroll-with-animation="true"
						android:scrollbars="none"
					>
						<ul>
							<li v-for="(item, index) in Musicalxml" :key="item.m_id" @click="musicxml(item.m_id, item.m_title)">
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
									<span>
										<image src="@/static/collect.png" mode="widthFix"></image>
										{{ item.m_collect }}
									</span>
									<span @click.stop="fabulous(item.m_id,index)">
										<image src="@/static/thumbs-up-hover.png" mode="widthFix" v-if="Musicalvid.some(res=>res==item.m_id)"></image>
										<image src="@/static/thumbs-up.png" mode="widthFix" v-else></image>
										{{ item.m_fabulous }}
									</span>
								</div>
							</li>
							<li class="notmore" v-show="notmoretwo"><image src="../../static/xiaolian.png" mode="widthFix"></image><text>没有更多了哦</text></li>
						</ul>
					</scroll-view>
					<button class="collectbtn" @click="Musicalback">
						<image src="../../static/back.png" mode="widthFix"></image>
					   <span>返回</span>
					</button>
				</div>
			</div>
		</div>
		<div class="goback" @click="goback();">
			<image src="@/static/goback.png" mode="widthFix"></image>
		</div>
		<!-- 弹奏模式 -->
		<mode v-show="playMode"></mode>
	</div>

	<!-- <msg ref="msgview" :content="msg.content" :icon="msg.icon" v-show="msg.show"></msg> -->
	<!-- <alert ref="alertview" :title="alert.title" :content="alert.content" :cancelBtn="alert.cancelBtn" :cancelText="alert.cancelText" :confirmBtn="alert.confirmBtn" :confirmText="alert.confirmText" v-show="alert.show" @closeAlert="seeking('hide')" @cancelAlert="seeking('hide')" @confirmAlert="seeking('confirm')"></alert> -->
</template>

<script>
	import mode from '@/components/common/mode.vue';
	export default {
		components:{
			mode
		},
		data() {
			return {
				globalData:getApp().globalData,
				//搜索关键词
				keyword:'',
				//默认搜索
				hotkey:'',
				//搜索列表
				list:[],
				//当前页数
				page:1,
				//当前页数总曲谱数量
				limit:20,
				//历史记录缓存数据
				history:null,
				//历史记录分页
				historypage:1,
				//我的收藏
				collect:[],
				//推送历史切换
				curren:1,
				//收藏和我的曲谱切换
				curre:1,
				//推送列表
				record:null,
				//曲谱分类
				Musical:null,
				//我的曲谱分类进入
				Musicalyes:false,
				//曲谱分类分页
				Musicalpage:1,
				//我的曲谱分类id
				Musicalid:'',
				//我的曲谱分类里的曲谱
				Musicalxml:[],
				//推送分页
				recordpage:1,
				//收藏分类分页
				collectpage:1,
				//收藏分类id
				collectid:'',
				//收藏分类里曲谱
				collectxml:[],
				//收藏分类曲谱进入
				collectyes:false,
				//收藏分类里曲谱分页
				collectxmlpage:1,
				//没有更多了
				notmore:false,
				notmoretwo:false,
				notmorethree:false,
				notmorefour:false,
				notmorefive:false,
				//点赞id列表
				Musicalvid:[],
				collectvid:[],
				searchvid:[],
				//弹窗出现
				conten:false,
				//添加曲谱的id
				addcollectxml:'',
				//收藏点亮列表
				searchcid:[],
				//添加分类曲谱下标
				addindex:'',
				//添加收藏分类名称
				cname:'',
				//提示消息
				msg:{
					content:'操作成功',
					icon:'info',
					show:false,
				},
				//弹窗
				alert:{
					cancelText:'取消',
					confirmText:'确认',
					cancelBtn:true,
					confirmBtn:true,
					content:'是否立即发送求谱信息',
					title:'提示',
					show:false,
				},
				//模式窗口
				playMode:false,
				//选择要弹奏的曲谱数据
				playData:{
					id:'',
					title:'',
					path:'',
				}
			}
		},
		onLoad(option) {
			this.keyword = option.value
			this.hotkey = this.globalData.hotkey[parseInt(Math.random() * (this.globalData.hotkey.length+1))]
			// if(this.keyword==''){
			// 	this.keyword=uni.getStorageSync('hotkey')
			// 	this.search()
			// }else{
			// 	this.search()
			// }
			// this.Hotkeyword()
			this.search()
			if(this.globalData.login){
				this.gethistory()
				this.getcolect()
			}
		},
		onShow(){
			if(this.globalData.login){
				this.gethistory()
				this.getcolect()
			}
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
			searchInput(event){
				this.keyword = event.target.value
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
			//返回到首页
			goback(){
				uni.navigateBack({})
			},
			//搜索
			search(){
				let keyword = this.keyword ? this.keyword : this.hotkey
				this.$request({
					url: "/piano/index/musicxml.html",
					data:{
						keyword:keyword,
						limit:this.limit,
						page:this.page,
					},
					method: "POST",
				}).then((res) => {
					if (res.data.code == 1000) {
						if (this.page == 1) {
							this.list = res.data.data.data;
						} else if(this.page<=res.data.data.last_page){
							this.list = this.list.concat(res.data.data.data);
						}else if(this.page>res.data.data.last_page){
							this.page=res.data.data.last_page
							this.notmorefour=true
						}
					} else {
						uni.showToast({
							title: "获取数据失败",
							icon:"error"
						})
					}
				});
			},
			//滚动加载列表
			pagecur(){
				this.page+=1
				this.search()
			},	
			//求谱
			seeking(type){
				if (type == 'show') {
					this.alert.show = true
				} else if (type == 'hide') {
					this.alert.show = false
				} else {
					this.$request({
						url: "/piano/musicxml/iwantmusicxml.html",
						method: "POST",
						data:{title:this.hotkey}
					}).then((res) => {
						if (res.data.code == 1000) {
							this.alert.show = false
						} else {
							uni.showToast({
								title:res.data.msg,
								icon:'none'
							})
						}
					})
				}
			},
			//关键词搜索
			getkey(e){
				this.keyword=e
				this.search()
			},
			//推送历史切换
			actives(index) {
				this.curren = index;
				if(this.curren==1 && this.globalData.login){
					this.gethistory()
				}
				if(this.curren==2 && this.globalData.login){
					this.pushrecord()
				}
			},
			//收藏我的曲谱切换
			south(i){
				this.curre=i
				if(this.curre==1 && this.globalData.login){
					this.getcolect()
				}
				if(this.curre==2 && this.globalData.login){
					this.getMusical()
				}
			},
			//推送加载
			Pushload(){
				this.recordpage+=1
				this.pushrecord()
			},
			//推送列表
			pushrecord(){
				this.$request({
					url: "/piano/musicxml/pushList.html",
					method: "POST",
					data:{page:this.recordpage}
				}).then((res) => {
					if (this.recordpage == 1) {
						this.record=res.data.data.data
					} else {
						this.record = this.record.concat(res.data.data.data);
					}
					if (this.recordpage >= res.data.data.last_page){
						this.recordpage=res.data.data.last_page
					}
				})
			},
			//历史记录
			gethistory(){
				this.$request({
					url: '/piano/history/list.html',
					method: 'POST',
					data:{page:this.historypage}
				}).then(res => {
					if (res.data.code == 1000) {
						if (this.historypage == 1) {
							this.history = res.data.data.data;
						} else if(this.historypage<=res.data.data.last_page){
							this.history = this.history.concat(res.data.data.data);
						}else if(this.historypage>res.data.data.last_page){
							this.historypage=res.data.data.last_page
							this.notmorethree=true
						}
					}
				});
			},
			//收藏分类
			getcolect(){
				this.$request({
					url: '/piano/musicxml/collectCate.html',
					method: 'POST',
					data:{page:this.collectpage}
				}).then(res => {
					if (res.data.code == 1000) {
						if (this.collectpage == 1) {
							this.collect=res.data.data.data
						} else {
							this.collect = this.collect.concat(res.data.data.data);
						}
						if (this.collectpage >= res.data.data.last_page){
							this.collectpage=res.data.data.last_page
						}
					}
				});
			},
			//曲谱分类
			getMusical(){
				this.$request({
					url: '/piano/musicxml/category.html',
					method: 'POST',
					data:{page:this.Musicalpage}
				}).then(res => {
					if (res.data.code == 1000) {
						if (this.Musicalpage == 1) {
							this.Musical=res.data.data.data
						} else {
							this.Musical = this.Musical.concat(res.data.data.data);
						}
						if (this.Musicalpage > res.data.data.last_page){
							this.Musicalpage=res.data.data.last_page
						}
					}
				});
			},
			//收藏分类里的曲谱
			getcollectxml(id){
				this.curre=1
				this.collectyes=true
				if(id){
					this.collectid=id
				}
				this.$request({
					url: '/piano/musicxml/collect.html',
					method: 'POST',
					data:{cc_id:this.collectid,page:this.collectxmlpage}
				}).then(res => {
					if (res.data.code == 1000) {
						if (this.collectxmlpage == 1) {
							this.collectxml = res.data.data.data;
						} else if(this.collectxmlpage<=res.data.data.last_page){
							this.collectxml = this.collectxml.concat(res.data.data.data);
						}else if(this.collectxmlpage>res.data.data.last_page){
							this.collectxmlpage=res.data.data.last_page
							this.notmore=true
						}
					}
				});
			},
			//我的曲谱分类里的曲谱
			getMusicalxml(id){
				this.curre=2
				this.Musicalyes=true
				if(id){
					this.Musicalid=id
				}
				this.$request({
					url: '/piano/musicxml/list.html',
					method: 'POST',
					data:{mc_id:this.Musicalid,page:this.Musicalpage}
				}).then(res => {
					if (res.data.code == 1000) {
						if (this.Musicalpage == 1) {
							this.Musicalxml = res.data.data.data;
						} else if(this.Musicalpage<=res.data.data.last_page){
							this.Musicalxml = this.Musicalxml.concat(res.data.data.data);
						}else if(this.Musicalpage>res.data.data.last_page){
							this.Musicalpage=res.data.data.last_page
							this.notmoretwo=true
						}
					}
				});
			},
			//历史记录滚动
			historyload(){
				this.historypage+=1
				this.gethistory()
			},
			//加载收藏分类
			loadcollect(){
				this.collectpage+=1
				this.getcolect()
			},
			//收藏返回
			collectback(){
				this.curre = 1
				this.collectyes=false
				this.collectid=''
				this.collectxml=[]
			},
			//收藏曲谱里的分页滚动
			loadcollectxml(){
				this.collectxmlpage+=1
				this.getcollectxml()
			},
			//我的曲谱分类分页滚动
			loadMusical(){
				this.Musicalpage+=1
				this.getMusical()
			},
			//我的曲谱分类里的曲谱滚动
			loadMusicalxml(){
				this.Musicalpage+=1
				this.getMusicalxml()
			},
			//我的曲谱返回
			Musicalback(){
				this.curre = 2
				this.Musicalyes=false
				this.Musicalid=''
				this.Musicalxml=[]
			},
			//未登录跳转
			backlogin(){
				uni.navigateTo({
					url:"/pages/login/login",
				})
			},
			//长按删除收藏分类
			longpresscollect(id){
				this.islongPress=true
				uni.showModal({
					title:"提示",
					content:"是否删除该分类",
					success:(r)=>{
						if(r.confirm){
							this.$request({
								url: '/piano/musicxml/delCollectCate.html',
								method: 'POST',
								data:{cc_id:id}
							}).then(res => {
								if (res.data.code == 1000) {
									uni.showToast({
										title:"删除成功",
										icon:"success",
									})
									this.getcolect()
								}
							})
						}else if(r.cancel){
							return
						}
					}
				})
			},
			//长按删除收藏列表下曲谱
			longpresscollectxml(id){
				uni.showModal({
					title:"提示",
					content:"是否删除该曲谱",
					success:(r)=>{
						if(r.confirm){
							this.$request({
								url: '/piano/musicxml/delCollect.html',
								method: 'POST',
								data:{cc_id:this.collectid,m_id:id}
							}).then(res => {
								if (res.data.code == 1000) {
									uni.showToast({
										title:"删除成功",
										icon:"success",
									})
									this.getcollectxml()
								}
							})
						}else if(r.cancel){
							return
						}
					}
				})
			},
			//点赞我的曲谱
			fabulous(id,index){
				if (!getApp().globalData.login) {
					uni.navigateTo({
						url:"/pages/login/login",
					})
					return;
				}
				if(this.Musicalvid.some(res=>res==id)){
					this.Musicalxml[index].m_fabulous-=1
					//过滤数组
					var cid=this.Musicalvid.indexOf(id)
					this.Musicalvid.splice(cid,1)
					return
				}
				this.$request({
					url: '/piano/musicxml/fabulous.html',
					method: 'POST',
					data:{id:id},
				}).then(res => {
					if (res.data.code == 1000) {
							this.Musicalvid=this.Musicalvid.concat(id)
							this.Musicalxml[index].m_fabulous+=1
					}
				})
			},
			//点赞我的收藏曲谱
			fabuloustwo(id,index){
				if (!getApp().globalData.login) {
					uni.navigateTo({
						url:"/pages/login/login",
					})
					return;
				}
				if(this.collectvid.some(res=>res==id)){
					this.collectxml[index].m_fabulous-=1
					//过滤数组
					var cid=this.collectvid.indexOf(id)
					this.collectvid.splice(cid,1)
					return
				}
				this.$request({
					url: '/piano/musicxml/fabulous.html',
					method: 'POST',
					data:{id:id}
				}).then(res => {
					if (res.data.code == 1000) {
						this.collectvid=this.collectvid.concat(id)
						this.collectxml[index].m_fabulous+=1
					}
				})
			},
			//点赞搜索页面曲谱
			fabulousthree(id,index){
				if (!getApp().globalData.login) {
					uni.navigateTo({
						url:"/pages/login/login",
					})
					return;
				}
				if(this.searchvid.some(res=>res==id)){
					this.list[index].m_fabulous-=1
					//过滤数组
					var cid=this.searchvid.indexOf(id)
					this.searchvid.splice(cid,1)
					return
				}
				this.$request({
					url: '/piano/musicxml/fabulous.html',
					method: 'POST',
					data:{id:id}
				}).then(res => {
					if (res.data.code == 1000) {
						this.searchvid=this.searchvid.concat(id)
						this.list[index].m_fabulous+=1
					}
				})
			},
			//添加分类
			open(id,index){
				if (!getApp().globalData.login) {
					uni.navigateTo({
						url:"/pages/login/login",
					})
					return;
				}
				// if(this.searchcid.some(res=>res==id)){
				// 	this.list[index].m_collect-=1
				// }
				this.conten=true
				this.addcollectxml=id
				this.addindex=index
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
						this.list[this.addindex].m_collect+=1
					}else{
						uni.showToast({
							title:"添加失败",
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
							title:res.data.msg,
							icon:"error"
						})
					}
				})
			},
			//推送列表
			gorecord(content,type){
				uni.navigateTo({
					url:"/pages/debugging/debugging?content="+content+"&type="+type,
				})
			},
			
		},
	}
</script>
<style>
@media screen and (min-width: 2560px) {
	.appbg{
		width:2560px;
		height:720px;
		overflow: hidden;
		background-color: #0a1050;
		position: relative;
	}
	.content{
		margin:74px auto 71px;
	}
	.musicxml{
		width:1035px;
		height:520px;
		float:left;
		border: 2px solid #079fff;
		border-radius: 10px;
		box-shadow: 0px 0px 20px 4px #079fff;
		padding:30px 50px;
		margin-right:64px;
		margin-left: 220px;
	}
	.input{
		width:452px;
		height:auto;
		overflow: hidden;
		float: left;
	}
	.input input{
		width:302px;
		height:50px;
		border-top-left-radius: 50px;
		border-bottom-left-radius: 50px;
		float:left;
		color:#6b6b6b;
		padding-left:50px;
		background: url('@/static/search.png') no-repeat #fff 15px 15px;
		background-size: 22px;
		line-height: 50px;
	}
	.input .search-btn{
		width:100px;
		height:50px;
		background:#e03e5b;
		font-size:18px;
		text-align: center;
		line-height: 50px;
		float:left;
		border-top-right-radius: 50px;
		border-bottom-right-radius: 50px;
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
		color:#fff;
		letter-spacing: 3px;
	}
	.search .search-btn:after{
		border:none;
	}
	.commandkey{
		width: calc(100% - 472px);
		height:50px;
		float: left;
		padding-left:20px;
		line-height: 50px;
	}
	.commandkey span{
		padding:8px 20px;
		border:1px #fff solid;
		border-radius: 20px;
		margin-right:10px;
		font-size: 18px;
	}
	.musicxmlbox{
		width:calc(100% - 40px);
		height:auto;
		padding:25px 20px;
		overflow: hidden;
	}
	.musicxmlbox li{
		width:48%;
		height:auto;
		overflow: hidden;
		padding-top:0px;
		margin-right:4%;
		float:left;
	}
	.musicxmlbox li:nth-child(2n){
		margin-right:0;
	}
	.musicxmlbox .title{
		padding:10px 0;
	}
	.musicxmlbox .title em{
		max-width:calc(100% - 21px);
		height:auto;
		overflow: hidden;
		font-style: normal;
		font-size:20px;
	}
	.musicxmlbox .title em i{
		font-style:normal;
		padding-right:20px;
		position: relative;
		top: 1px;
	}
	.musicxmlbox .title image{
		width:18px;
		height:18px;
		padding-left:5px;
		position: relative;
		top: 3px;
	}
	.musicxmlbox .attr{
		width:calc(100% - 32px);
		height:auto;
		padding:5px 0 10px 32px;
		opacity: 0.6;
		font-size:16px;
	}
	.musicxmlbox .attr image{
		width:20px;
		height:20px !important;
		padding-right:5px;
		position: relative;
		top:4px;
	}
	.musicxmlbox .attr span{
		padding-right:20px;
	}
	.history{
		width:415px;
		height:575px;
		float:left;
		border: 2px solid #079fff;
		border-radius: 10px;
		box-shadow: 0px 0px 20px 4px #079fff;
		margin-right:64px;
	}
	.tabtitle{
		width:295px;
		height:60px;
		line-height: 60px;
		margin:30px auto;
		background: #fff;
		border-radius: 30px;
		font-size:18px;
	}
	.tabtitle li{
		width:50%;
		height:60px;
		line-height: 60px;
		text-align: center;
		float:left;
		color:#000;
	}
	.tabtitle li:first-child{
		border-top-left-radius: 30px;
		border-bottom-left-radius: 30px;
	}
	.tabtitle li:last-child{
		border-top-right-radius: 30px;
		border-bottom-right-radius: 30px;
	}
	.tabtitle .cur{
		background: #0077F1;
		color:#fff;
	}
	.tablist .notmore{
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
	.history .list{
		position: relative;
		top:-15px;
	}
	.history .list li{
		width:calc(100% - 47px);
		height:auto;
		font-size:18px;
		padding:0 20px;
		line-height: 62px;
	}
	.history .list span{
		width: calc(100% - 45px);
		display: inline-block;
		overflow: hidden;
		height: 62px;
		line-height: 62px;
		text-overflow: ellipsis;/*文字隐藏后添加省略号*/
		white-space: nowrap;/*强制不换行*/
		float: left;
	}
	.history .list li image{
		width:30px;
		margin-right: 15px;
		position: relative;
		top: 15px;
		float: left;
	}
	.mymusicxml{
		width:415px;
		height:575px;
		float:left;
		border: 2px solid #079fff;
		border-radius: 10px;
		box-shadow: 0px 0px 20px 4px #079fff;
	}
	.mymusicxml .list li{
		width:calc(100% - 40px);
		height:auto;
		padding:0 20px;
		margin-bottom:20px;
	}
	.mymusicxml li .thumb{
		width:70px;
		height:70px;
		float:left;
		margin-right:10px;
	}
	.mymusicxml li .thumb image{
		width:70px;
		height:70px;
	}
	.mymusicxml .info{
		width:250px;
		height:auto;
		margin-right:10px;
		float:left;
		font-size:18px;
		line-height: 30px;
	}
	.mymusicxml .info p{
		overflow:hidden;
		text-overflow:ellipsis;
		white-space:nowrap;
	}
	.mymusicxml .info span{
		padding-top:10px;
		display: inline-block;
	}
	.mymusicxml .more{
		width:35px;
		height:auto;
		float:left;
		text-align: right;
		padding-top:26px;
	}
	.mymusicxml .more image{
		width:18px;
	}
	.goback{
		position: absolute;
		bottom:40px;
		right:10px;
	}
	.goback image{
		width:180px;
		height:72px;
	}
	.musicxmlnone{
		text-align: center;
		padding-top: 100px;
	}
	.musicxmlnone .imgs{
		width: 215px;
		height: 165px;
		opacity: 0.57;
		margin-bottom: 25px;
	}
	.musicxmlnone .tel{
		width: 209px;
		height: 20px;
		opacity: 0.55;
		font-size: 20px;
		font-family: Microsoft YaHei, Microsoft YaHei-Regular;
		font-weight: 400;
		text-align: left;
		color: #ffffff;
		line-height: 100px;
		letter-spacing: 1px;
		margin-left: -205px;
	}
	.musicxmlnone button{
		background-color: #254a9e;
		width: 212px;
		height: 51px;
		line-height: 51px;
		border: 1.2px solid #ffffff;
		border-radius: 21px;
		opacity: 0.7;
		border-radius: 25px;
	}
	.musicxmlnone button span{
		width: 84px;
		height: 20px;
		font-size: 21px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		text-align: left;
		color: #ffffff;
	}
	.musicxmlnone button image{
		width: 22px;
		height: 22px;
		padding-right: 10px;
		transform: translateY(4px);
	}
	.uni-modal {
		width: 300px;
	}
	.tablist {
		width: calc(100% - 40px);
		height: auto;
		padding: 0 20px;
		overflow: hidden;
		margin-top: -5px;
	}
	.tablist li {
		width: 100%;
		height: 100rpx;
		overflow: hidden;
		padding-top: 5px;
		padding-bottom: 11px;
		position: relative;
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
	.tablist .collectbtn{
		width: 133px;
		height: 44px;
		line-height: 44px;
		background-color: rgba(253,193,65,0.00);;
		border: 1.2px solid #ffffff;
		border-radius: 21px;
		text-align: center;
		position: absolute;
		bottom: 13%;
		right: 10%;
	}
	.tablist .collectbtn image{
		width: 17px;
		height: 15px;
		opacity: 0.68;
	}
	.tablist .collectbtn span{
		width: 41px;
		height: 20px;
		opacity: 0.68;
		font-size: 21px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		text-align: left;
		color: #ffffff;
		padding-left: 12px;
	}
	.curren1 {
		width: 423px;
		height: 403px;
		border-radius: 8px;
		padding-top: 85px;
	}
	.curren1 .head {
		width: 21px;
		height: 25px;
		transform: translateY(4px);
		padding-right: 5px;
	}
	.curren1 .tet {
		opacity: 0.53;
		margin-bottom: 50px;
		margin-left: 80px;
		padding-top: 50px;
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
	.list .notmore{
		text-align: center;
		padding-bottom: 0;
		transform: translateY(8px);
		height: 46px;
		line-height: 60px;
	}
	.list .notmore image{
		width: 28px;
		height: 28px;
		opacity: 0.63;
		transform: translateY(-1px);
		margin-right: 10px;
	}
	.list .notmore text{
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
	.musicxmlbox .notmore{
		text-align: center;
		padding-bottom: 0;
		transform: translateY(8px);
		height: 46px;
		line-height: 60px;
		width: 100%;
	}
	.musicxmlbox .notmore image{
		width: 28px;
		height: 28px;
		opacity: 0.63;
		transform: translateY(7px);
		margin-right: 15px;
	}
	.musicxmlbox .notmore text{
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
	scroll-view{
		height: 440px;
	}
}
@media screen and (max-width: 1925px) and (min-width: 1656px) {
	.appbg{
		width:100%;
		height:100%;
		overflow: hidden;
		background-color: #0a1050;
		position: relative;
	}
	.content{
		margin:140px auto 71px;
	}
	.musicxml{
		width:1050px;
		height:800px;
		float:left;
		border: 2px solid #079fff;
		border-radius: 10px;
		box-shadow: 0px 0px 20px 4px #079fff;
		padding:30px 50px;
		margin-right:40px;
		margin-left: 50px;
	}
	.input{
		width:43%;
		height:auto;
		overflow: hidden;
		float: left;
	}
	.input input{
		width:300px;
		height:50px;
		border-top-left-radius: 50px;
		border-bottom-left-radius: 50px;
		float:left;
		color:#6b6b6b;
		padding-left:50px;
		background: url('@/static/search.png') no-repeat #fff 15px 15px;
		background-size: 22px;
		line-height: 50px;
	}
	.input .search-btn{
		width:100px;
		height:50px;
		background:#e03e5b;
		font-size:18px;
		text-align: center;
		line-height: 50px;
		float:left;
		border-top-right-radius: 50px;
		border-bottom-right-radius: 50px;
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
		color:#fff;
		letter-spacing: 3px;
	}
	.search .search-btn:after{
		border:none;
	}
	.commandkey{
		width: calc(100% - 472px);
		height:50px;
		float: left;
		padding-left:20px;
		line-height: 50px;
	}
	.commandkey span{
		padding:8px 20px;
		border:1px #fff solid;
		border-radius: 20px;
		margin-right:10px;
		font-size: 18px;
	}
	.musicxmlbox{
		width:calc(100% - 40px);
		height:auto;
		padding:25px 20px;
		overflow: hidden;
	}
	.musicxmlbox li{
		width:48%;
		height:auto;
		overflow: hidden;
		padding-top:0px;
		margin-right:4%;
		float:left;
	}
	.musicxmlbox li:nth-child(2n){
		margin-right:0;
	}
	.musicxmlbox .title{
		padding:10px 0;
	}
	.musicxmlbox .title em{
		max-width:calc(100% - 21px);
		height:auto;
		overflow: hidden;
		font-style: normal;
		font-size:20px;
	}
	.musicxmlbox .title em i{
		font-style:normal;
		padding-right:20px;
		position: relative;
		top: 1px;
	}
	.musicxmlbox .title image{
		width:18px;
		height:18px;
		padding-left:5px;
		position: relative;
		top: 3px;
	}
	.musicxmlbox .attr{
		width:calc(100% - 32px);
		height:auto;
		padding:5px 0 10px 32px;
		opacity: 0.6;
		font-size:16px;
	}
	.musicxmlbox .attr image{
		width:20px;
		height:20px !important;
		padding-right:5px;
		position: relative;
		top:4px;
	}
	.musicxmlbox .attr span{
		padding-right:20px;
	}
	.history{
		width:620px;
		height:400px;
		float:left;
		border: 2px solid #079fff;
		border-radius: 10px;
		box-shadow: 0px 0px 20px 4px #079fff;
	}
	.tabtitle{
		width:295px;
		height:60px;
		line-height: 60px;
		margin:30px auto;
		background: #fff;
		border-radius: 30px;
		font-size:18px;
	}
	.tabtitle li{
		width:50%;
		height:60px;
		line-height: 60px;
		text-align: center;
		float:left;
		color:#000;
	}
	.tabtitle li:first-child{
		border-top-left-radius: 30px;
		border-bottom-left-radius: 30px;
	}
	.tabtitle li:last-child{
		border-top-right-radius: 30px;
		border-bottom-right-radius: 30px;
	}
	.tabtitle .cur{
		background: #0077F1;
		color:#fff;
	}
	.tablist .notmore{
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
	.sv1{
		height: 440px;
	}
	.scrollRight{
		height: 270px;
	}
	.history .list{
		position: relative;
		top:-15px;
	}
	.history .list li{
		width:calc(100% - 47px);
		height:auto;
		font-size:18px;
		padding:0 20px;
		line-height: 62px;
	}
	.history .list span{
		width: calc(100% - 45px);
		display: inline-block;
		overflow: hidden;
		height: 62px;
		line-height: 62px;
		text-overflow: ellipsis;/*文字隐藏后添加省略号*/
		white-space: nowrap;/*强制不换行*/
		float: left;
	}
	.history .list li image{
		width:30px;
		margin-right: 15px;
		position: relative;
		top: 15px;
		float: left;
	}
	.mymusicxml{
		width:620px;
		height:400px;
		float:left;
		border: 2px solid #079fff;
		border-radius: 10px;
		box-shadow: 0px 0px 20px 4px #079fff;
		margin-top: 55px;
	}
	.mymusicxml .list li{
		width:calc(100% - 40px);
		height:auto;
		padding:0 20px;
		margin-bottom:20px;
	}
	.mymusicxml li .thumb{
		width:70px;
		height:70px;
		float:left;
		margin-right:10px;
	}
	.mymusicxml li .thumb image{
		width:70px;
		height:70px;
	}
	.mymusicxml .info{
		width:250px;
		height:auto;
		margin-right:10px;
		float:left;
		font-size:18px;
		line-height: 30px;
	}
	.mymusicxml .info p{
		overflow:hidden;
		text-overflow:ellipsis;
		white-space:nowrap;
	}
	.mymusicxml .info span{
		padding-top:10px;
		display: inline-block;
	}
	.mymusicxml .more{
		width:35px;
		height:auto;
		float:left;
		text-align: right;
		padding-top:26px;
		margin-left: 180px;
	}
	.mymusicxml .more image{
		width:18px;
	}
	.goback{
		position: absolute;
		top:40px;
		right:40px;
	}
	.goback image{
		width:180px;
		height:72px;
	}
	.musicxmlnone{
		text-align: center;
		padding-top: 180px;
	}
	.musicxmlnone .imgs{
		width: 215px;
		height: 165px;
		opacity: 0.57;
		margin-bottom: 25px;
	}
	.musicxmlnone .tel{
		width: 209px;
		height: 20px;
		opacity: 0.55;
		font-size: 20px;
		font-family: Microsoft YaHei, Microsoft YaHei-Regular;
		font-weight: 400;
		text-align: left;
		color: #ffffff;
		line-height: 100px;
		letter-spacing: 1px;
		margin-left: -205px;
	}
	.musicxmlnone button{
		background-color: #254a9e;
		width: 212px;
		height: 51px;
		line-height: 51px;
		border: 1.2px solid #ffffff;
		border-radius: 21px;
		opacity: 0.7;
		border-radius: 25px;
	}
	.musicxmlnone button span{
		width: 84px;
		height: 20px;
		font-size: 21px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		text-align: left;
		color: #ffffff;
	}
	.musicxmlnone button image{
		width: 22px;
		height: 22px;
		padding-right: 10px;
		transform: translateY(4px);
	}
	.uni-modal {
		width: 300px;
	}
	.tablist {
		width: calc(100% - 40px);
		height: auto;
		padding: 0 20px;
		overflow: hidden;
		margin-top: -5px;
	}
	.tablist li {
		width: 100%;
		height: 100rpx;
		overflow: hidden;
		padding-top: 5px;
		padding-bottom: 11px;
		position: relative;
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
		width: calc(130% - 32px);
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
	.tablist .collectbtn{
		width: 133px;
		height: 44px;
		line-height: 44px;
		background-color: rgba(253,193,65,0.00);;
		border: 1.2px solid #ffffff;
		border-radius: 21px;
		text-align: center;
		position: absolute;
		bottom: 395px;
		right: 60px;
	}
	.tablist .collectbtn image{
		width: 17px;
		height: 15px;
		opacity: 0.68;
	}
	.tablist .collectbtn span{
		width: 41px;
		height: 20px;
		opacity: 0.68;
		font-size: 21px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		text-align: left;
		color: #ffffff;
		padding-left: 12px;
	}
	.curren1 {
		width: 423px;
		height: 403px;
		border-radius: 8px;
		padding-top: 85px;
	}
	.curren1 .head {
		width: 21px;
		height: 25px;
		transform: translateY(4px);
		padding-right: 5px;
	}
	.curren1 .tet {
		opacity: 0.53;
		margin-bottom: 50px;
		margin-left: 180px;
		margin-top: 0px;
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
		margin-left: 200px;
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
	.list .notmore{
		text-align: center;
		padding-bottom: 0;
		transform: translateY(8px);
		height: 46px;
		line-height: 60px;
		float: left;
		margin-left: 200px;
	}
	.list .notmore image{
		width: 28px;
		height: 28px;
		opacity: 0.63;
		transform: translateY(-1px);
		margin-right: 10px;
	}
	.list .notmore text{
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
	.musicxmlbox .notmore{
		text-align: center;
		padding-bottom: 0;
		transform: translateY(8px);
		height: 46px;
		line-height: 60px;
		width: 100%;
	}
	.musicxmlbox .notmore image{
		width: 28px;
		height: 28px;
		opacity: 0.63;
		transform: translateY(7px);
		margin-right: 15px;
	}
	.musicxmlbox .notmore text{
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
}	
@media screen and (max-width: 1655px) and (min-width: 1286px) {
	.appbg{
		width:100%;
		height:100%;
		overflow: hidden;
		background-color: #0a1050;
		position: relative;
	}
	.content{
		margin:120px auto 30px;
	}
	.musicxml{
		width: 50%;
		height: 540px;
		float:left;
		border: 2px solid #079fff;
		border-radius: 10px;
		box-shadow: 0px 0px 20px 4px #079fff;
		padding:30px 20px;
		margin-right:40px;
		margin-left: 80px;
		position: relative;
	}
	.input{
		width:40%;
		height:auto;
		overflow: hidden;
		float: left;
		/* border: 1px solid #fff; */
	}
	.input input{
		width:50%;
		height:50px;
		border-top-left-radius: 50px;
		border-bottom-left-radius: 50px;
		float:left;
		color:#6b6b6b;
		padding-left:50px;
		background: url('@/static/search.png') no-repeat #fff 15px 15px;
		background-size: 22px;
		line-height: 50px;
		/* border: 1px solid #fff; */
	}
	.input .search-btn{
		width:30%;
		height:50px;
		background:#e03e5b;
		font-size:18px;
		text-align: center;
		line-height: 50px;
		float:left;
		border-top-right-radius: 50px;
		border-bottom-right-radius: 50px;
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
		color:#fff;
		letter-spacing: 3px;
	} 
	.search .search-btn:after{
		border:none;
	}
	.commandkey{
		width: 50%;
		height:50px;
		float: left;
		padding-left:20px;
		line-height: 50px;
		overflow: hidden;
		/* margin-left: -50px; */
		/* border: 1px solid #fff; */
	}
	.commandkey span{
		padding:8px 20px;
		border:1px #fff solid;
		border-radius: 20px;
		margin-right:10px;
		font-size: 18px;
	}
	.musicxmlbox {
		width:calc(110% - 40px);
		height:auto;
		padding:25px 20px;
		overflow: hidden;
	}
	.musicxmlbox li{
		width: 50%;
		height: auto;
		overflow: hidden;
		padding-top: 0px;
		/* margin-right: 5px; */
		float: left;
	}
	.musicxmlbox li:nth-child(2n) {
		margin-right: 0;
	}
	.musicxmlbox .title{
		padding: 10px 0;
	}
	.musicxmlbox .title em {
		max-width:calc(100% - 21px);
		height:auto;
		overflow: hidden;
		font-style: normal;
		font-size:20px;
	}
	.musicxmlbox .title em i {
		font-style:normal;
		padding-right:20px;
		position: relative;
		top: 1px;
	}
	.musicxmlbox .title image {
		width:18px;
		height:18px;
		padding-left:5px;
		position: relative;
		top: 3px;
	}
	.musicxmlbox .attr {
		width:calc(100% - 32px);
		height:auto;
		padding:5px 0 10px 32px;
		opacity: 0.6;
		font-size:16px;
	}
	.musicxmlbox .attr image {
		width:20px;
		height:20px !important;
		padding-right:5px;
		position: relative;
		top:4px;
	}
	.musicxmlbox .attr span {
		padding-right:20px;
	}
	.sv1{
		height: 400px;
	}
	/* 历史记录 */
	.history {
		width: 35%;
		height: 30%;
		float: left;
		border: 2px solid #079fff;
		border-radius: 10px;
		box-shadow: 0px 0px 20px 4px #079fff;
	}
	.tabtitle{
		width: 50%;
		height: 40px;
		line-height: 40px;
		margin: 30px auto;
		background: #fff;
		border-radius: 30px;
		font-size: 18px;
	}
	.tabtitle li {
		width: 50%;
		height: 40px;
		line-height: 40px;
		text-align: center;
		float: left;
		color: #000;
	}
	.tabtitle li:first-child {
		border-top-left-radius: 30px;
		border-bottom-left-radius: 30px;
	}
	.tabtitle li:last-child{
		border-top-right-radius: 30px;
		border-bottom-right-radius: 30px;
	}
	.tabtitle .cur{
		background: #0077F1;
		color: #fff;
	}
	.tablist .notmore{
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
	.history .list{
		position: relative;
		top:-15px;
	}
	.history .list li{
		width:calc(100% - 47px);
		height:auto;
		font-size:18px;
		padding:0 20px;
		line-height: 62px;
	}
	.history .list span{
		width: calc(100% - 45px);
		display: inline-block;
		overflow: hidden;
		height: 62px;
		line-height: 62px;
		text-overflow: ellipsis;/*文字隐藏后添加省略号*/
		white-space: nowrap;/*强制不换行*/
		float: left;
	}
	.history .list li image{
		width:30px;
		margin-right: 15px;
		position: relative;
		top: 15px;
		float: left;
	}
	/* 收藏曲谱 */
	.mymusicxml{
		width:35%;
		height:275px;
		float:left;
		border: 2px solid #079fff;
		border-radius: 10px;
		box-shadow: 0px 0px 20px 4px #079fff;
		margin-top: 20px;
		overflow: hidden;
	}
	.mymusicxml .list li{
		width:calc(100% - 40px);
		height: 70px;
		padding:0 20px;
		margin-bottom:20px;
	}
	.mymusicxml li .thumb{
		width: 70px;
		height: 70px;
		float:left;
		margin-right: 10px;
	}
	.mymusicxml li .thumb image{
		width:50px;
		height:50px;
	}
	.mymusicxml .info{
		width:400px;
		height:auto;
		margin-right:10px;
		float:left;
		font-size:18px;
		line-height: 25px;
		margin-top: -5px;
	}
	.mymusicxml .info p{
		overflow:hidden;
		text-overflow:ellipsis;
		white-space:nowrap;
	}
	.mymusicxml .info span{
		padding-top:10px;
		display: inline-block;
	}
	.mymusicxml .more{
		width:35px;
		height:auto;
		float:left;
		text-align: right;
		padding-top:26px;
	}
	.mymusicxml .more image{
		width:18px;
		margin-top: -12px;
	}
	.goback{
		position: absolute;
		top: 40px;
		right: 40px;
	}
	.goback image{
		width: 180px;
		height: 72px;
	}
	.musicxmlnone{
		text-align: center;
		padding-top: 10%;
	}
	.musicxmlnone .imgs{
		width: 215px;
		height: 165px;
		opacity: 0.57;
		margin-bottom: 25px;
	}
	.musicxmlnone .tel{
		width: 209px;
		height: 20px;
		opacity: 0.55;
		font-size: 20px;
		font-family: Microsoft YaHei, Microsoft YaHei-Regular;
		font-weight: 400;
		text-align: left;
		color: #ffffff;
		line-height: 100px;
		letter-spacing: 1px;
		margin-left: -205px;
	}
	.musicxmlnone button{
		background-color: #254a9e;
		width: 212px;
		height: 51px;
		line-height: 51px;
		border: 1.2px solid #ffffff;
		border-radius: 21px;
		opacity: 0.7;
		border-radius: 25px;
	}
	.musicxmlnone button span{
		width: 84px;
		height: 20px;
		font-size: 21px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		text-align: left;
		color: #ffffff;
	}
	.musicxmlnone button image{
		width: 22px;
		height: 22px;
		padding-right: 10px;
		transform: translateY(4px);
	}
	.uni-modal {
		width: 300px;
	}
	.tablist {
		width: calc(100% - 40px);
		height: auto;
		padding: 0 20px;
		overflow: hidden;
		margin-top: -5px;
	}
	.tablist li {
		width: 100%;
		height: 100rpx;
		overflow: hidden;
		padding-top: 5px;
		padding-bottom: 11px;
		position: relative;
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
	.tablist .collectbtn{
		width: 120px;
		height: 44px;
		line-height: 44px;
		background-color: rgba(253,193,65,0.00);;
		border: 1.2px solid #ffffff;
		border-radius: 21px;
		text-align: center;
		position: absolute;
		bottom: 352px;
		right: 85px;
	}
	.tablist .collectbtn image{
		width: 12px;
		height: 15px;
		opacity: 0.68;
	}
	.tablist .collectbtn span{
		width: 41px;
		height: 20px;
		opacity: 0.68;
		font-size: 21px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		text-align: left;
		color: #ffffff;
		padding-left: 12px;
	}
	.curren1 {
		width: 423px;
		height: 403px;
		border-radius: 8px;
		padding-top: 85px;
	}
	.curren1 .head {
		width: 21px;
		height: 25px;
		transform: translateY(4px);
		padding-right: 5px;
	}
	.curren1 .tet {
		opacity: 0.53;
		margin-bottom: 50px;
		margin-left: 180px;
		margin-top: 0px;
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
		margin-left: 200px;
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
	.list .notmore{
		text-align: center;
		padding-bottom: 0;
		transform: translateY(8px);
		height: 46px;
		line-height: 60px;
	}
	.list .notmore image{
		width: 28px;
		height: 28px;
		opacity: 0.63;
		transform: translateY(-1px);
		margin-right: 10px;
	}
	.list .notmore text{
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
	.musicxmlbox .notmore{
		text-align: center;
		padding-bottom: 0;
		transform: translateY(8px);
		height: 46px;
		line-height: 60px;
		width: 100%;
	}
	.musicxmlbox .notmore image{
		width: 28px;
		height: 28px;
		opacity: 0.63;
		transform: translateY(7px);
		margin-right: 15px;
	}
	.musicxmlbox .notmore text{
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
	scroll-view {
		height: 200px;
	}
}
@media screen and (max-width: 1285px) and (min-width: 1006px) {
	.appbg{
		width:calc(100% - 100px);
		height:100%;
		overflow: hidden;
		background-color: #0a1050;
		position: relative;
		padding:100px 50px;
	}
	.content{
		width:100%;
		height:550px;
		/* margin:120px auto 30px; */
	}
	.musicxml{
		width: calc(70% - 64px);
		height: 490px;
		float:left;
		border: 2px solid #079fff;
		border-radius: 10px;
		box-shadow: 0px 0px 20px 4px #079fff;
		padding:30px 20px;
		margin-right:40px;
		position: relative;
	}
	.input{
		width:50%;
		height:auto;
		overflow: hidden;
		float: left;
	}
	.input input{
		width:calc(80% - 50px);
		height:50px;
		border-top-left-radius: 50px;
		border-bottom-left-radius: 50px;
		float:left;
		color:#6b6b6b;
		padding-left:50px;
		background: url('@/static/search.png') no-repeat #fff 15px 15px;
		background-size: 22px;
		line-height: 50px;
	}
	.input .search-btn{
		width:20%;
		height:50px;
		background:#e03e5b;
		font-size:18px;
		text-align: center;
		line-height: 50px;
		float:left;
		border-top-right-radius: 50px;
		border-bottom-right-radius: 50px;
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
		color:#fff;
		letter-spacing: 3px;
	} 
	.search .search-btn:after{
		border:none;
	}
	.commandkey{
		width: calc(50% - 20px);
		height:50px;
		float: left;
		padding-left:20px;
		line-height: 50px;
		overflow: hidden;
		/* margin-left: -50px; */
	}
	.commandkey span{
		padding:5px 10px;
		border:1px #fff solid;
		border-radius: 20px;
		margin-right:8px;
		font-size: 12px;
	}
	.musicxmlbox {
		width:calc(100% - 40px);
		height:440px;
		padding:25px 20px;
		overflow: hidden;
	}
	.musicxmlbox li{
		width: 50%;
		height: auto;
		overflow: hidden;
		padding-top: 0px;
		/* margin-right: 5px; */
		float: left;
	}
	.musicxmlbox li:nth-child(2n) {
		margin-right: 0;
	}
	.musicxmlbox .title{
		padding: 10px 0;
	}
	.musicxmlbox .title em {
		max-width:calc(100% - 21px);
		height:auto;
		overflow: hidden;
		font-style: normal;
		font-size:20px;
	}
	.musicxmlbox .title em i {
		font-style:normal;
		padding-right:20px;
		position: relative;
		top: 1px;
	}
	.musicxmlbox .title image {
		width:18px;
		height:18px;
		padding-left:5px;
		position: relative;
		top: 3px;
	}
	.musicxmlbox .attr {
		width:calc(100% - 32px);
		height:auto;
		padding:5px 0 10px 32px;
		opacity: 0.6;
		font-size:16px;
	}
	.musicxmlbox .attr image {
		width:20px;
		height:20px !important;
		padding-right:5px;
		position: relative;
		top:4px;
	}
	.musicxmlbox .attr span {
		padding-right:20px;
	}
	/* 历史记录 */
	.history {
		width: calc(30% - 25px);
		height: 265px;
		float: left;
		border: 2px solid #079fff;
		border-radius: 10px;
		box-shadow: 0px 0px 20px 4px #079fff;
	}
	.tabtitle{
		width: 70%;
		height: 40px;
		line-height: 40px;
		margin: 30px auto;
		background: #fff;
		border-radius: 30px;
		font-size: 18px;
	}
	.tabtitle li {
		width: 50%;
		height: 40px;
		line-height: 40px;
		text-align: center;
		float: left;
		color: #000;
	}
	.tabtitle li:first-child {
		border-top-left-radius: 30px;
		border-bottom-left-radius: 30px;
	}
	.tabtitle li:last-child{
		border-top-right-radius: 30px;
		border-bottom-right-radius: 30px;
	}
	.tabtitle .cur{
		background: #0077F1;
		color: #fff;
	}
	.tablist .notmore{
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
	.history .list{
		position: relative;
		top:-15px;
	}
	.history .list li{
		width:calc(100% - 47px);
		height:auto;
		font-size:18px;
		padding:0 20px;
		line-height: 62px;
	}
	.history .list span{
		width: calc(100% - 45px);
		display: inline-block;
		overflow: hidden;
		height: 62px;
		line-height: 62px;
		text-overflow: ellipsis;/*文字隐藏后添加省略号*/
		white-space: nowrap;/*强制不换行*/
		float: left;
	}
	.history .list li image{
		width:30px;
		margin-right: 15px;
		position: relative;
		top: 15px;
		float: left;
	}
	/* 收藏曲谱 */
	.mymusicxml{
		width:calc(30% - 25px);
		height:265px;
		float:left;
		border: 2px solid #079fff;
		border-radius: 10px;
		box-shadow: 0px 0px 20px 4px #079fff;
		margin-top: 20px;
		overflow: hidden;
	}
	.mymusicxml .list li{
		width: 130%;
		height: 70px;
		padding: 0 20px;
		margin-bottom: 20px;
		float: left;
	}
	.mymusicxml li .thumb{
		width: 70px;
		height: 70px;
		float:left;
		margin-right: 10px;
	}
	.mymusicxml li .thumb image{
		width:50px;
		height:50px;
		float: left;
	}
	.mymusicxml .info{
		width:250px;
		height:auto;
		margin-right:10px;
		float:left;
		font-size:18px;
		line-height: 25px;
		margin-top: -5px;
	}
	.mymusicxml .info p{
		overflow:hidden;
		text-overflow:ellipsis;
		white-space:nowrap;
	}
	.mymusicxml .info span{
		padding-top:10px;
		display: inline-block;
	}
	.mymusicxml .more{
		width:35px;
		height:auto;
		float:left;
		text-align: right;
		padding-top:26px;
	} 
	.mymusicxml .more image{
		width:18px;
		margin-top: -12px;
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
	.musicxmlnone{
		text-align: center;
		padding-top: 10%;
	}
	.musicxmlnone .imgs{
		width: 215px;
		height: 165px;
		opacity: 0.57;
		margin-bottom: 25px;
	}
	.musicxmlnone .tel{
		width: 209px;
		height: 20px;
		opacity: 0.55;
		font-size: 20px;
		font-family: Microsoft YaHei, Microsoft YaHei-Regular;
		font-weight: 400;
		text-align: left;
		color: #ffffff;
		line-height: 100px;
		letter-spacing: 1px;
		margin-left: -205px;
	}
	.musicxmlnone button{
		background-color: #254a9e;
		width: 212px;
		height: 51px;
		line-height: 51px;
		border: 1.2px solid #ffffff;
		border-radius: 21px;
		opacity: 0.7;
		border-radius: 25px;
	}
	.musicxmlnone button span{
		width: 84px;
		height: 20px;
		font-size: 21px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		text-align: left;
		color: #ffffff;
	}
	.musicxmlnone button image{
		width: 22px;
		height: 22px;
		padding-right: 10px;
		transform: translateY(4px);
	}
	.uni-modal {
		width: 300px;
	}
	.tablist {
		width: calc(100% - 40px);
		height: auto;
		padding: 0 20px;
		overflow: hidden;
		margin-top: -5px;
	}
	.tablist li {
		width: 100%;
		height: 100rpx;
		overflow: hidden;
		padding-top: 5px;
		padding-bottom: 11px;
		position: relative;
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
	.tablist .collectbtn{
		width: 110px;
		height: 44px;
		line-height: 44px;
		background-color: rgba(253,193,65,0.00);;
		border: 1.2px solid #ffffff;
		border-radius: 21px;
		text-align: center;
		position: absolute;
		top: 20px;
		right: 200px;
	}
	.tablist .collectbtn image{
		width: 17px;
		height: 15px;
		opacity: 0.68;
	}
	.tablist .collectbtn span{
		width: 41px;
		height: 20px;
		opacity: 0.68;
		font-size: 21px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		text-align: left;
		color: #ffffff;
		padding-left: 12px;
	}
	.curren1 {
		width: 423px;
		height: 403px;
		border-radius: 8px;
		padding-top: 25px;
		margin-left: -140px;
	}
	.curren1 .head {
		width: 21px;
		height: 25px;
		transform: translateY(4px);
		padding-right: 5px;
	}
	.curren1 .tet {
		opacity: 0.53;
		margin-bottom: 50px;
		margin-left: 180px;
		margin-top: 0px;
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
		margin-left: 200px;
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
	.list .notmore{
		text-align: center;
		padding-bottom: 0;
		transform: translateY(8px);
		height: 46px;
		line-height: 60px;
	}
	.list .notmore image{
		width: 28px;
		height: 28px;
		opacity: 0.63;
		transform: translateY(-1px);
		margin-right: 10px;
	}
	.list .notmore text{
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
	.musicxmlbox .notmore{
		text-align: center;
		transform: translateY(8px);
		height: 46px;
		line-height: 60px;
		width: 100%;
	}
	.musicxmlbox .notmore image{
		width: 28px;
		height: 28px;
		opacity: 0.63;
		transform: translateY(7px);
		margin-right: 15px;
	}
	.musicxmlbox .notmore text{
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
	.sv1 {
		height: 400px;
	}
	.scrollRight{
		height: 150px;
	}
}
@media screen and (max-width: 1005px) {
	.appbg{
		width:calc(100% - 100px);
		height:100%;
		overflow: hidden;
		background-color: #0a1050;
		position: relative;
		padding:100px 50px;
	}
	.content{
		width:100%;
		height:300px;
	}
	.musicxml{
		width: calc(70% - 64px);
		height: 370px;
		float:left;
		border: 2px solid #079fff;
		border-radius: 10px;
		box-shadow: 0px 0px 20px 4px #079fff;
		padding:30px 20px;
		margin-right:40px;
		position: relative;
	}
	.input{
		width: 40%;
		height: 40px;
		overflow: hidden;
		float: left;
	}
	.input input{
		width:calc(70% - 50px);
		height:40px;
		border-top-left-radius: 50px;
		border-bottom-left-radius: 50px;
		float:left;
		color:#6b6b6b;
		padding-left:50px;
		background: url('@/static/search.png') no-repeat #fff 10px;
		background-size: 18px;
		line-height: 40px;
	}
	.input .search-btn{
		width: 30%;
		height: 40px;
		background: #e03e5b;
		font-size:14px;
		text-align: center;
		line-height: 40px;
		float:left;
		border-top-right-radius: 50px;
		border-bottom-right-radius: 50px;
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
		color:#fff;
		letter-spacing: 3px;
	} 
	.search .search-btn:after{
		border:none;
	}
	.commandkey{
		width: calc(50% - 20px);
		height:50px;
		float: left;
		padding-left:20px;
		line-height: 50px;
		overflow: hidden;
	}
	.commandkey span{
		padding:5px 10px;
		border:1px #fff solid;
		border-radius: 20px;
		margin-right:8px;
		font-size: 12px;
	}
	.musicxmlbox {
		width:calc(100% - 40px);
		height:440px;
		padding:25px 20px;
		overflow: hidden;
	}
	.musicxmlbox li{
		width: 50%;
		height: auto;
		overflow: hidden;
		padding-top: 0px;
		float: left;
	}
	.musicxmlbox li:nth-child(2n) {
		margin-right: 0;
	}
	.musicxmlbox .title{
		padding: 10px 0;
	}
	.musicxmlbox .title em {
		max-width:calc(100% - 21px);
		height:auto;
		overflow: hidden;
		font-style: normal;
		font-size:16px;
	}
	.musicxmlbox .title em i {
		font-style:normal;
		padding-right:20px;
		position: relative;
		top: 1px;
	}
	.musicxmlbox .title image {
		width:18px;
		height:18px;
		padding-left:5px;
		position: relative;
		top: 3px;
	}
	.musicxmlbox .attr {
		width:calc(110% - 32px);
		height:auto;
		padding: 5px 0 10px 0px;
		opacity: 0.6;
		font-size: 12px;
	}
	.musicxmlbox .attr image {
		width: 15px;
		height: 15px !important;
		padding-right:5px;
		position: relative;
		top: 4px;
	}
	.musicxmlbox .attr span {
		padding-right:20px;
	}
	/* 历史记录 */
	.history {
		width: calc(30% - 25px);
		height: 200px;
		float: left;
		border: 2px solid #079fff;
		border-radius: 10px;
		box-shadow: 0px 0px 20px 4px #079fff;
	}
	.tabtitle{
		width: 70%;
		height: 40px;
		line-height: 40px;
		margin: 30px auto;
		background: #fff;
		border-radius: 30px;
		font-size: 14px;
	}
	.tabtitle li {
		width: 50%;
		height: 40px;
		line-height: 40px;
		text-align: center;
		float: left;
		color: #000;
	}
	.tabtitle li:first-child {
		border-top-left-radius: 30px;
		border-bottom-left-radius: 30px;
	}
	.tabtitle li:last-child{
		border-top-right-radius: 30px;
		border-bottom-right-radius: 30px;
	}
	.tabtitle .cur{
		background: #0077F1;
		color: #fff;
	}
	.tablist .notmore{
		text-align: center;
		padding-bottom: 0;
		transform: translateY(8px);
		height: 46px;
		line-height: 60px;
	}
	.tablist .notmore image{
		width: 20px;
		height: 20px;
		opacity: 0.63;
		transform: translateY(7px);
		margin-right: 10px;
	}
	.tablist .notmore text{
		width: 120px;
		height: 18px;
		opacity: 0.55;
		font-size: 14px;
		font-family: Microsoft YaHei, Microsoft YaHei-Regular;
		font-weight: 400;
		text-align: left;
		color: #ffffff;
		line-height: 18px;
	}
	.history .list{
		position: relative;
		top:-15px;
	}
	.history .list li{
		width: calc(100% - 47px);
		height: auto;
		font-size: 16px;
		padding: 0 20px;
		line-height: 62px;
	}
	.history .list span{
		width: calc(100% - 45px);
		display: inline-block;
		overflow: hidden;
		height: 50px;
		line-height: 50px;
		text-overflow: ellipsis;/*文字隐藏后添加省略号*/
		white-space: nowrap;/*强制不换行*/
		float: left;
	}
	.history .list li image{
		width: 20px;
		margin-right: 15px;
		position: relative;
		top: 15px;
		float: left;
	}
	/* 收藏曲谱 */
	.mymusicxml{
		width: calc(30% - 25px);
		height: 210px;
		float: left;
		border: 2px solid #079fff;
		border-radius: 10px;
		box-shadow: 0px 0px 20px 4px #079fff;
		margin-top: 20px;
		overflow: hidden;
	}
	.mymusicxml .list li{
		width: 130%;
		height: 70px;
		padding: 0 20px;
		margin-bottom: 10px;
		float: left;
	}
	.mymusicxml li .thumb{
		width: 70px;
		height: 70px;
		float: left;
		margin-right: 10px;
	}
	.mymusicxml li .thumb image{
		width: 45px;
		height: 45px;
		float: left;
	}
	.mymusicxml .info{
		width: 90px;
		height: auto;
		margin-right: 10px;
		float: left;
		font-size: 16px;
		line-height: 25px;
		margin-top: -5px;
	}
	.mymusicxml .info p{
		overflow:hidden;
		text-overflow:ellipsis;
		white-space:nowrap;
	}
	.mymusicxml .info span{
		padding-top:10px;
		display: inline-block;
	}
	.mymusicxml .more{
		width:35px;
		height:auto;
		float:left;
		text-align: right;
		padding-top:26px;
	} 
	.mymusicxml .more image{
		width:18px;
		margin-top: -12px;
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
	.musicxmlnone{
		text-align: center;
		padding-top: 10%;
	}
	.musicxmlnone .imgs{
		width: 215px;
		height: 165px;
		opacity: 0.57;
		margin-bottom: 25px;
	}
	.musicxmlnone .tel{
		width: 209px;
		height: 20px;
		opacity: 0.55;
		font-size: 20px;
		font-family: Microsoft YaHei, Microsoft YaHei-Regular;
		font-weight: 400;
		text-align: left;
		color: #ffffff;
		line-height: 100px;
		letter-spacing: 1px;
		margin-left: -205px;
	}
	.musicxmlnone button{
		background-color: #254a9e;
		width: 212px;
		height: 51px;
		line-height: 51px;
		border: 1.2px solid #ffffff;
		border-radius: 21px;
		opacity: 0.7;
		border-radius: 25px;
	}
	.musicxmlnone button span{
		width: 84px;
		height: 20px;
		font-size: 21px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		text-align: left;
		color: #ffffff;
	}
	.musicxmlnone button image{
		width: 22px;
		height: 22px;
		padding-right: 10px;
		transform: translateY(4px);
	}
	.uni-modal {
		width: 300px;
	}
	.tablist {
		width: calc(100% - 40px);
		height: auto;
		padding: 0 20px;
		overflow: hidden;
		margin-top: -5px;
	}
	.tablist li {
		width: 100%;
		height: 100rpx;
		overflow: hidden;
		padding-top: 5px;
		padding-bottom: 11px;
		position: relative;
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
	.tablist .collectbtn{
		width: 110px;
		height: 44px;
		line-height: 44px;
		background-color: rgba(253,193,65,0.00);;
		border: 1.2px solid #ffffff;
		border-radius: 21px;
		text-align: center;
		position: absolute;
		top: 20px;
		right: 200px;
	}
	.tablist .collectbtn image{
		width: 17px;
		height: 15px;
		opacity: 0.68;
	}
	.tablist .collectbtn span{
		width: 41px;
		height: 20px;
		opacity: 0.68;
		font-size: 21px;
		font-family: Hiragino Sans GB, Hiragino Sans GB-W3;
		font-weight: normal;
		text-align: left;
		color: #ffffff;
		padding-left: 12px;
	}
	.curren1 {
		width: 410px;
		/* height: 200px; */
		border-radius: 8px;
		margin-left: -150px;
		transform: scale(0.7);
		margin-top: -20px;
	}
	.curren1 .head {
		width: 21px;
		height: 25px;
		transform: translateY(4px);
		padding-right: 5px;
	}
	.curren1 .tet {
		opacity: 0.53;
		margin-bottom: 50px;
		margin-left: 110px;
		margin-top: 0px;
		transform: translateX(60px);
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
		margin-left: 200px;
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
	.list .notmore{
		text-align: center;
		padding-bottom: 0;
		transform: translateY(8px);
		height: 46px;
		line-height: 60px;
	}
	.list .notmore image{
		width: 28px;
		height: 28px;
		opacity: 0.63;
		transform: translateY(-1px);
		margin-right: 10px;
	}
	.list .notmore text{
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
	.musicxmlbox .notmore{
		text-align: center;
		transform: translateY(8px);
		height: 46px;
		line-height: 60px;
		width: 100%;
	}
	.musicxmlbox .notmore image{
		width: 28px;
		height: 28px;
		opacity: 0.63;
		transform: translateY(7px);
		margin-right: 15px;
	}
	.musicxmlbox .notmore text{
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
	.sv1 {
		height: 300px;
	}
	.scrollRight{
		height: 100px;
	}
}

</style>
