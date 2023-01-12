<template>
	<view class="exe">
		<view class="exercises">
			<view class="title">
				<!-- 标题图片 -->
				<view v-if="info.title_img != ''" class="img">
					<image :src="info.title_img" mode=""></image>
				</view>
				<!-- 音频控制按钮 -->
				<image v-show="info.title_audio != '' && play_show" class="playIcon" src="../../static/icons/details_play.png" mode="" @click="play"></image>
				<image v-show="info.title_audio != '' && pause_show" class="pauseIcon" src="../../static/icons/details_pause.png" mode="" @click="pause"></image>
			</view>
			<!-- 标题文字 -->
			<view class="text">
				{{ info.title_text }}
			</view>
			
			<!-- 图片答案 -->
			<view class="answer" v-if="info.select_a_img != '' && info.select_a_text == ''">
				<radio-group @change="radioChange">
					<label class="answerList" v-if="info.select_a_img != ''">
						<radio class="option" value="A" :checked="0 === current" />
						<image class="content" :src="info.select_a_img" mode=""></image>
					</label>
					<label class="answerList" v-if="info.select_b_img != ''">
						<radio class="option" value="B" :checked="0 === current" />
						<image class="content" :src="info.select_b_img" mode=""></image>
					</label>
					<label class="answerList" v-if="info.select_c_img != ''">
						<radio class="option" value="C" :checked="0 === current" />
						<image class="content" :src="info.select_c_img" mode=""></image>
					</label>
					<label class="answerList" v-if="info.select_d_img != ''">
						<radio class="option" value="D" :checked="0 === current" />
						<image class="content" :src="info.select_d_img" mode=""></image>
					</label>
				</radio-group>
			</view>
			
			<!-- 文字答案 -->
			<view class="answer_text" v-if="info.select_a_text != '' && info.select_a_img == ''">
				<view class="answerList_text">
					<view class="uni-list">
						<radio-group @change="radioChange">
							<label class="uni-list-cell uni-list-cell-pd" v-if="info.select_a_text != ''">
								<view class="answerList_text">
									<radio class="radio" value="A" :checked="0 === current" />
									<view class="content_text">{{ info.select_a_text }}</view>
								</view>
							</label>
							<label class="uni-list-cell uni-list-cell-pd" v-if="info.select_b_text != ''">
								<view class="answerList_text">
									<radio class="radio" value="B" :checked="1 === current" />
									<view class="content_text">{{ info.select_b_text }}</view>
								</view>
							</label>
							<label class="uni-list-cell uni-list-cell-pd" v-if="info.select_c_text != ''">
								<view class="answerList_text">
									<radio class="radio" value="C" :checked="2 === current" />
									<view class="content_text">{{ info.select_c_text }}</view>
								</view>
							</label>
							<label class="uni-list-cell uni-list-cell-pd" v-if="info.select_d_text != ''">
								<view class="answerList_text">
									<radio class="radio" value="D" :checked="3 === current" />
									<view class="content_text">{{ info.select_d_text }}</view>
								</view>
							</label>
						</radio-group>
					</view>
				</view>
			</view>
		</view>
		<!-- 答案弹窗 -->
		<!-- 答题正确 -->
		<view class="mask" v-show="successShow">
			<cover-view class="successlayer" :style="'left:'+left+'px; top:'+top+'px;'">
				<cover-view class="line">
					<cover-image class="title" src="@/static/common/right.png"></cover-image>
					<cover-view class="operabtn">
						<cover-view class="stop" @click.stop="stop()">不玩了</cover-view>
						<cover-view class="next" @click.stop="goSuccess()">下一关</cover-view>
					</cover-view>
				</cover-view>
			</cover-view>
		</view>
		<!-- 答题错误 -->
		<view class="mask" v-show="failShow">
			<cover-view class="faillayer" :style="'left:'+left+'px; top:'+top+'px;'">
				<cover-view class="line">
					<cover-image class="title" src="@/static/common/error.png"></cover-image>
					<cover-view class="operabtn">
						<cover-view class="stop" @click.stop="stop()">不玩了</cover-view>
						<cover-view class="next" @click.stop="again()">重新答题</cover-view>
					</cover-view>
				</cover-view>
			</cover-view>
		</view>

		<!-- 答题结束 -->
		<view class="mask" v-show="overShow">
			<cover-view v-show="overShow" class="over" :style="'left:'+left+'px;top:'+top+'px;'">
				<cover-view class="line">
					<cover-image class="title" src="@/static/common/over-title.png"></cover-image>
					<cover-view class="confirm" @click.stop="goback">确定</cover-view>
				</cover-view>
			</cover-view>
		</view>
		<view class="goback" @click="goback"><image src="@/static/goback.png" mode="widthFix"></image></view>
	</view>
</template>

<script>
	export default {
		data(){
			return {
				//选择题数据
				info: [],
				//答案
				answer: [],
				// 答题正确弹窗
				successShow: false,
				// 答题错误弹窗
				failShow: false,
				// 选择题类型
				type: '',
				current: '',
				// 被选中的选项
				value: '',
				// 音频对象
				innerAudioContext: null,
				// 音频播放状态
				play_show: true,
				pause_show: false,
				overShow: false,
				width: 0,
				height: 0,
				left: 0,
				top: 0,
				// 闯关上传分数
				score: '',
				subNVue: null ,//子窗口
			}
		},
		onLoad(options){
			this.info = options
			//弹窗的位置
			this.left = getApp().globalData.width/2 - 220
			this.top = getApp().globalData.height/2 - 125
			// 创建音频实例对象
			this.innerAudioContext = uni.createInnerAudioContext();
			this.innerAudioContext.src = this.info.title_audio;
			//获取nvue子窗口
			this.subNVue = uni.getSubNVueById('courseMenu')
			//默认先隐藏
			this.subNVue.hide()
			//获取store数据，如果需要显示
			if (this.$store.state.course.show) {
				this.subNVue.show()
			}
			let that = this
			//监听课件切换
			uni.$on('change',function(data){
				uni.navigateBack()
			})
			//监听课件更新
			uni.$on('update',function(data){
				that.info = data.info
				that.subNVue.show()
			})
			//课时已学完
			uni.$on('over',function(data){
				that.overShow = true
			})
		},
		methods: {
			// 返回
			goback(){
				//清理课程切换组件状态
				this.$store.state.course.show = false
				this.overShow = false
				//返回
				uni.navigateBack()
			},
			// 选择选项
			radioChange(e){
				this.value = e.target.value
				// 如果是闯关
				if (this.info.ptype && this.info.ptype == 2) {
					// 如果答题正确
					if(this.value == this.info.right_answer){
						this.score = 100
						this.successShow = true;
						this.failShow = false;
					}else{
						this.score = 0
						this.failShow = true;
						this.successShow = false;
					}
					//提交数据
					this.$request({
						url: '/piano/breakthrough/submission.html',
						method: 'POST',
						data: {
							p_id: this.info.pid,
							score: this.score, //闯关上传分数
							type: 5, //选择题课件类型
							cw_id: this.info.cwid,
							c_id: this.info.cid
						}
					}).then(res => {
						if (res.data.code == 1000) {
							// 根据返回值判断是否要解锁下一关
							if (res.data.data != 0 && this.value == this.info.right_answer){ //表示全部完成或者下一关需要购买用户未购买
								//解锁下一个课件的ID
								uni.$emit('unlocked',res.data.data)
							}
						} else {
							uni.showToast({
								title:res.data.msg,
								icon:'none'
							})
						}
					})
				//其它课程，显示弹窗
				} else if (this.info.ptype) {
					this.successShow = false
				}
			},
			// 再答一次
			stop(){
				this.failShow = false;
				this.successShow = false;
			},
			// 正确继续答题
			goSuccess(){
				this.successShow = false;
				uni.$emit('next')
			},
			// 错误重新答题
			again(){
				this.failShow = false;
			},
			//音频播放
			play(){
				this.innerAudioContext.play()
				this.play_show = false
				this.pause_show = true
			},
			// 音频暂停
			pause(){
				this.innerAudioContext.pause()
				this.play_show = true
				this.pause_show = false
			},
		},
		beforeDestroy(){
			// uni.$off('change')
			// uni.$off('update')
			// uni.$off('over')
		}
	}
</script>

<style>
@media screen and (min-width:2560px){
	.exe {
		width: 2560px;
		height: 720px;
		background-color: #0a1050;
		position: relative;
		overflow: auto;
	}
	.exercises{
		width: 1400px;
		height: 630px;
		background-color: #6cc4ff;
		border-radius: 12px;
		margin-top: 60px;
		margin-left: 580px;
	}
	.exercises .title{
		width: 100%;
		height: 80px;
	}
	.title .img{
		height: 60px;
		/* background-color: #00FF7F; */
		float: left;
		margin-top: 10px;
		margin-left: 10px;
		margin-right: 20px;
	}
	.title .img image{
		height: 60px;
	}
	.text{
		width: 100%;
		height: 50px;
		font-size: 30px;
		color: #333;
		float: left;
		margin-top: 15px;
		margin-bottom: 20px;
		margin-left: 10px;
	}
	.title .playIcon{
		width: 68px;
		height: 68px;
		float: left;
		margin: 10px 20px 0px 0px;
	}
	.title .pauseIcon{
		width: 80px;
		height: 80px;
		float: left;
		margin-top: 5px;
	}
	/* 图片答案 */
	.answer{
		width: 100%;
		height: 80%;
		margin-top: 120px;
		margin-left: 25px;
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: space-around;
	}
	.answerList{
		/* width: 23%; */
		/* height: 40%; */
		position: relative;
		overflow: auto;
		margin-right: 50px;
	}
	.option{
		width: 20px;
		height: 20px;
		font-size: 30px;
		color: #333;
		position: absolute;
		left: 150px;
		top: 80px;
	}
	.content{ 
		width: 300px;
		height: 200px;
	}
	/* 文字答案 */
	.answer_text{
		width: 100%;
		height: 80%;
		float: left;
		margin-left: 10px;
	}
	.answerList_text{
		width: 100%;
		height: 15%;
		margin-bottom: 20px;
		position: relative;
	}
	.answerList_text .radio{
		margin-top: 20px;
	}
	.content_text{
		width: 80%;
		height: 100%;
		margin-left: 50px;
		font-size: 26px;
		overflow: hidden;
		color: #333;
		margin-top: -30px;
	}
	/* 答案弹窗 */
	.mask{
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		background: rgba(0,0,0, 0.5);
		position: fixed;
	}
	.successlayer,
	.faillayer{
		width: 420px;
		height: 220px;
		position: fixed;
		text-align: center;
		padding: 10px;
		z-index: 999;	
		border-radius: 10px;
		margin-bottom: 20px;
	}
	.successlayer{
		background-image: linear-gradient(to right, #044BD6 , #009FFA);
		box-shadow: 0px 0px 10px 3px rgb(0 0 0 / 20%);
	}
	.faillayer{
		background-color: #fff;
	}
	.successlayer .line{
		width: 410px;
		height: 210px;
		border: 5px #fff solid;
		border-radius: 5px;
	}
	.faillayer .line{
		width: 410px;
		height: 210px;
		border: 5px #044BD6 solid;
		border-radius: 5px;
	}
	.title{
		width: 200px;
		height: 37px;
		margin: 40px 110px 60px;
	}
	.operabtn{
		width: 410px;
		height: 40px;
		margin-left: 20px;
		margin-top: 10px;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
	}
	.stop{
		width: 172px;
		height: 40px;
		border-radius:20px;
		line-height: 40px;
		font-size: 16px;
		text-align: center;
	}
	.successlayer .stop{
		background-color: #fff;
		border: 2px #fff solid;
		color: #0365E1;
	}
	.faillayer .stop{
		background-color: #044BD6;
		border: 2px #044BD6 solid;
		color: #fff;
	}
	.next{
		width: 172px;
		height: 40px;
		
		margin-left: 20px;
		border-radius: 20px;
		line-height: 40px;
		font-size: 16px;
		text-align: center;
	}
	.successlayer .next{
		background: #0270E6;
		border: 1px #fff solid;
		color: #fff;
	}
	.faillayer .next{
		background: #fff;
		border: 1px #0270E6 solid;
		color: #0270E6;
	}
	/* 课时完成 */
	.over{
		width:420px;
		height:220px;
		position: fixed;
		text-align: center;
		padding:10px;
		z-index: 999;
		background-image: linear-gradient(to right, #044BD6 , #009FFA);
		border-radius: 10px;
		box-shadow: 0px 0px 10px 3px rgb(0 0 0 / 20%);
		text-align: center;
		margin-bottom:20px;
	}
	.over .title{
		width:370px;
		height:34px;
		margin:40px 15px 43px;
	}
	.confirm{
		width:172px;
		height:40px;
		background: #0270E6;
		border:1px #fff solid;
		margin-left:120px;
		border-radius:20px;
		line-height: 40px;
		font-size:16px;
		color:#fff;
		text-align: center;
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
	.exe {
		width: 1920px;
		height: 1080px;
		background-color: #0a1050;
		position: relative;
		overflow: auto;
	}
	.exercises{
		width: 1550px;
		height: 700px;
		background-color: #6cc4ff;
		border-radius: 12px;
		margin-top: 200px;
		margin-left: 200px;
	}
	.exercises .title{
		width: 100%;
		height: 80px;
	}
	.title .img{
		height: 60px;
		/* background-color: #00FF7F; */
		float: left;
		margin-top: 10px;
		margin-left: 10px;
		margin-right: 20px;
	}
	.title .img image{
		height: 60px;
	}
	.text{
		width: 100%;
		height: 50px;
		font-size: 30px;
		color: #333;
		float: left;
		margin-top: 15px;
		margin-bottom: 20px;
		margin-left: 10px;
	}
	.title .playIcon{
		width: 68px;
		height: 68px;
		float: left;
		margin: 10px 20px 0px 0px;
	}
	.title .pauseIcon{
		width: 80px;
		height: 80px;
		float: left;
		margin-top: 5px;
	}
	/* 图片答案 */
	.answer{
		width: 100%;
		height: 80%;
		margin-top: 120px;
		margin-left: 25px;
		display: flex; 
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: space-around;
	}
	.answerList{
		/* width: 23%; */
		/* height: 40%; */
		position: relative;
		overflow: auto;
		margin-right: 50px;
	}
	.option{
		width: 20px;
		height: 20px;
		font-size: 30px;
		color: #333;
		position: absolute;
		left: 140px;
		top: 80px;
	}
	.content{ 
		width: 300px;
		height: 200px;
	}
	/* 文字答案 */
	.answer_text{
		width: 100%;
		height: 80%;
		float: left;
		margin-left: 10px;
	}
	.answerList_text{
		width: 100%;
		height: 15%;
		margin-bottom: 20px;
		position: relative;
	}
	.answerList_text .radio{
		margin-top: 20px;
	}
	.content_text{
		width: 80%;
		height: 100%;
		margin-left: 50px;
		font-size: 26px;
		overflow: hidden;
		color: #333;
		margin-top: -30px;
	}
	/* 答案弹窗 */
	.mask{
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		background: rgba(0,0,0, 0.5);
		position: fixed;
	}
	.successlayer,
	.faillayer{
		width: 420px;
		height: 220px;
		position: fixed;
		text-align: center;
		padding: 10px;
		z-index: 999;	
		border-radius: 10px;
		margin-bottom: 20px;
	}
	.successlayer{
		background-image: linear-gradient(to right, #044BD6 , #009FFA);
		box-shadow: 0px 0px 10px 3px rgb(0 0 0 / 20%);
	}
	.faillayer{
		background-color: #fff;
	}
	.successlayer .line{
		width: 410px;
		height: 210px;
		border: 5px #fff solid;
		border-radius: 5px;
	}
	.faillayer .line{
		width: 410px;
		height: 210px;
		border: 5px #044BD6 solid;
		border-radius: 5px;
	}
	.title{
		width: 200px;
		height: 37px;
		margin: 40px 110px 60px;
	}
	.operabtn{
		width: 410px;
		height: 40px;
		margin-left: 20px;
		margin-top: 10px;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
	}
	.stop{
		width: 172px;
		height: 40px;
		border-radius:20px;
		line-height: 40px;
		font-size: 16px;
		text-align: center;
	}
	.successlayer .stop{
		background-color: #fff;
		border: 2px #fff solid;
		color: #0365E1;
	}
	.faillayer .stop{
		background-color: #044BD6;
		border: 2px #044BD6 solid;
		color: #fff;
	}
	.next{
		width: 172px;
		height: 40px;
		margin-left: 20px;
		border-radius: 20px;
		line-height: 40px;
		font-size: 16px;
		text-align: center;
	}
	.successlayer .next{
		background: #0270E6;
		border: 1px #fff solid;
		color: #fff;
	}
	.faillayer .next{
		background: #fff;
		border: 1px #0270E6 solid;
		color: #0270E6;
	}
	/* 课时完成 */
	.over{
		width:420px;
		height:220px;
		position: fixed;
		text-align: center;
		padding:10px;
		z-index: 999;
		background-image: linear-gradient(to right, #044BD6 , #009FFA);
		border-radius: 10px;
		box-shadow: 0px 0px 10px 3px rgb(0 0 0 / 20%);
		text-align: center;
		margin-bottom:20px;
	}
	.over .title{
		width:370px;
		height:34px;
		margin:40px 15px 43px;
	}
	.confirm{
		width:172px;
		height:40px;
		background: #0270E6;
		border:1px #fff solid;
		margin-left:120px;
		border-radius:20px;
		line-height: 40px;
		font-size:16px;
		color:#fff;
		text-align: center;
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
@media screen and (max-width:1655px) and (min-width:1286px){
	.exe {
		width: 1652px;
		height: 873px;
		background-color: #0a1050;
		position: relative;
		overflow: auto;
	}
	.exercises{
		width: 1550px;
		height: 700px;
		background-color: #6cc4ff;
		border-radius: 12px;
		margin-top: 120px;
		margin-left: 50px;
	}
	.exercises .title{
		width: 100%;
		height: 80px;
	}
	.title .img{
		height: 60px;
		/* background-color: #00FF7F; */
		float: left;
		margin-top: 10px;
		margin-left: 10px;
		margin-right: 20px;
	}
	.title .img image{
		height: 60px;
	}
	.text{
		width: 100%;
		height: 50px;
		font-size: 30px;
		color: #333;
		float: left;
		margin-top: 15px;
		margin-bottom: 20px;
		margin-left: 10px;
	}
	.title .playIcon{
		width: 68px;
		height: 68px;
		float: left;
		margin: 10px 20px 0px 0px;
	}
	.title .pauseIcon{
		width: 80px;
		height: 80px;
		float: left;
		margin-top: 5px;
	}
	/* 图片答案 */
	.answer{
		width: 100%;
		height: 80%;
		margin-top: 120px;
		margin-left: 25px;
		display: flex; 
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: space-around;
	}
	.answerList{
		/* width: 23%; */
		/* height: 40%; */
		position: relative;
		overflow: auto;
		margin-right: 50px;
	}
	.option{
		width: 20px;
		height: 20px;
		font-size: 30px;
		color: #333;
		position: absolute;
		left: 140px;
		top: 80px;
	}
	.content{ 
		width: 300px;
		height: 200px;
	}
	/* 文字答案 */
	.answer_text{
		width: 100%;
		height: 80%;
		float: left;
		margin-left: 10px;
	}
	.answerList_text{
		width: 100%;
		height: 15%;
		margin-bottom: 20px;
		position: relative;
	}
	.answerList_text .radio{
		margin-top: 20px;
	}
	.content_text{
		width: 80%;
		height: 100%;
		margin-left: 50px;
		font-size: 26px;
		overflow: hidden;
		color: #333;
		margin-top: -30px;
	}
	/* 答案弹窗 */
	.mask{
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		background: rgba(0,0,0, 0.5);
		position: fixed;
	}
	.successlayer,
	.faillayer{
		width: 420px;
		height: 220px;
		position: fixed;
		text-align: center;
		padding: 10px;
		z-index: 999;	
		border-radius: 10px;
		margin-bottom: 20px;
	}
	.successlayer{
		background-image: linear-gradient(to right, #044BD6 , #009FFA);
		box-shadow: 0px 0px 10px 3px rgb(0 0 0 / 20%);
	}
	.faillayer{
		background-color: #fff;
	}
	.successlayer .line{
		width: 410px;
		height: 210px;
		border: 5px #fff solid;
		border-radius: 5px;
	}
	.faillayer .line{
		width: 410px;
		height: 210px;
		border: 5px #044BD6 solid;
		border-radius: 5px;
	}
	.title{
		width: 200px;
		height: 37px;
		margin: 40px 110px 60px;
	}
	.operabtn{
		width: 410px;
		height: 40px;
		margin-left: 20px;
		margin-top: 10px;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
	}
	.stop{
		width: 172px;
		height: 40px;
		border-radius:20px;
		line-height: 40px;
		font-size: 16px;
		text-align: center;
	}
	.successlayer .stop{
		background-color: #fff;
		border: 2px #fff solid;
		color: #0365E1;
	}
	.faillayer .stop{
		background-color: #044BD6;
		border: 2px #044BD6 solid;
		color: #fff;
	}
	.next{
		width: 172px;
		height: 40px;
		margin-left: 20px;
		border-radius: 20px;
		line-height: 40px;
		font-size: 16px;
		text-align: center;
	}
	.successlayer .next{
		background: #0270E6;
		border: 1px #fff solid;
		color: #fff;
	}
	.faillayer .next{
		background: #fff;
		border: 1px #0270E6 solid;
		color: #0270E6;
	}
	/* 课时完成 */
	.over{
		width:420px;
		height:220px;
		position: fixed;
		text-align: center;
		padding:10px;
		z-index: 999;
		background-image: linear-gradient(to right, #044BD6 , #009FFA);
		border-radius: 10px;
		box-shadow: 0px 0px 10px 3px rgb(0 0 0 / 20%);
		text-align: center;
		margin-bottom:20px;
	}
	.over .title{
		width:370px;
		height:34px;
		margin:40px 15px 43px;
	}
	.confirm{
		width:172px;
		height:40px;
		background: #0270E6;
		border:1px #fff solid;
		margin-left:120px;
		border-radius:20px;
		line-height: 40px;
		font-size:16px;
		color:#fff;
		text-align: center;
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
@media screen and (max-width:1285px){
	.exe {
		width: 1280px;
		height: 720px;
		background-color: #0a1050;
		position: relative;
		overflow: auto;
	}
	.exercises{
		width: 1260px;
		height: 550px;
		background-color: #6cc4ff;
		border-radius: 12px;
		margin-top: 100px;
		margin-left: 10px;
	}
	.exercises .title{
		width: 100%;
		height: 80px;
	}
	.title .img{
		height: 60px;
		/* background-color: #00FF7F; */
		float: left;
		margin-top: 10px;
		margin-left: 10px;
		margin-right: 20px;
	}
	.title .img image{
		height: 60px;
	}
	.text{
		width: 100%;
		height: 50px;
		font-size: 30px;
		color: #333;
		float: left;
		margin-top: 15px;
		margin-bottom: 20px;
		margin-left: 10px;
	}
	.title .playIcon{
		width: 68px;
		height: 68px;
		float: left;
		margin: 10px 20px 0px 0px;
	}
	.title .pauseIcon{
		width: 80px;
		height: 80px;
		float: left;
		margin-top: 5px;
	}
	/* 图片答案 */
	.answer{
		width: 100%;
		height: 80%;
		margin-top: 120px;
		margin-left: 25px;
		display: flex; 
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: space-around;
	}
	.answerList{
		/* width: 23%; */
		/* height: 40%; */
		position: relative;
		overflow: auto;
		margin-right: 50px;
	}
	.option{
		width: 20px;
		height: 20px;
		font-size: 30px;
		color: #333;
		position: absolute;
		left: 110px;
		top: 80px;
	}
	.content{ 
		width: 250px;
		height: 150px;
	}
	/* 文字答案 */
	.answer_text{
		width: 100%;
		height: 80%;
		float: left;
		margin-left: 10px;
	}
	.answerList_text{
		width: 100%;
		height: 15%;
		margin-bottom: 20px;
		position: relative;
	}
	.answerList_text .radio{
		margin-top: 20px;
	}
	.content_text{
		width: 80%;
		height: 100%;
		margin-left: 50px;
		font-size: 26px;
		overflow: hidden;
		color: #333;
		margin-top: -30px;
	}
	/* 答案弹窗 */
	.mask{
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		background: rgba(0,0,0, 0.5);
		position: fixed;
	}
	.successlayer,
	.faillayer{
		width: 420px;
		height: 220px;
		position: fixed;
		text-align: center;
		padding: 10px;
		z-index: 999;	
		border-radius: 10px;
		margin-bottom: 20px;
	}
	.successlayer{
		background-image: linear-gradient(to right, #044BD6 , #009FFA);
		box-shadow: 0px 0px 10px 3px rgb(0 0 0 / 20%);
	}
	.faillayer{
		background-color: #fff;
	}
	.successlayer .line{
		width: 410px;
		height: 210px;
		border: 5px #fff solid;
		border-radius: 5px;
	}
	.faillayer .line{
		width: 410px;
		height: 210px;
		border: 5px #044BD6 solid;
		border-radius: 5px;
	}
	.title{
		width: 200px;
		height: 37px;
		margin: 40px 110px 60px;
	}
	.operabtn{
		width: 410px;
		height: 40px;
		margin-left: 20px;
		margin-top: 10px;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
	}
	.stop{
		width: 172px;
		height: 40px;
		border-radius:20px;
		line-height: 40px;
		font-size: 16px;
		text-align: center;
	}
	.successlayer .stop{
		background-color: #fff;
		border: 2px #fff solid;
		color: #0365E1;
	}
	.faillayer .stop{
		background-color: #044BD6;
		border: 2px #044BD6 solid;
		color: #fff;
	}
	.next{
		width: 172px;
		height: 40px;
		margin-left: 20px;
		border-radius: 20px;
		line-height: 40px;
		font-size: 16px;
		text-align: center;
	}
	.successlayer .next{
		background: #0270E6;
		border: 1px #fff solid;
		color: #fff;
	}
	.faillayer .next{
		background: #fff;
		border: 1px #0270E6 solid;
		color: #0270E6;
	}
	/* 课时完成 */
	.over{
		width:420px;
		height:220px;
		position: fixed;
		text-align: center;
		padding:10px;
		z-index: 999;
		background-image: linear-gradient(to right, #044BD6 , #009FFA);
		border-radius: 10px;
		box-shadow: 0px 0px 10px 3px rgb(0 0 0 / 20%);
		text-align: center;
		margin-bottom:20px;
	}
	.over .title{
		width:370px;
		height:34px;
		margin:40px 15px 43px;
	}
	.confirm{
		width:172px;
		height:40px;
		background: #0270E6;
		border:1px #fff solid;
		margin-left:120px;
		border-radius:20px;
		line-height: 40px;
		font-size:16px;
		color:#fff;
		text-align: center;
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
	.exe {
		width: 1000px;
		height: 576px;
		background-color: #0a1050;
		position: relative;
		overflow: auto;
	}
	.exercises{
		width: 960px;
		height: 450px;
		background-color: #6cc4ff;
		border-radius: 12px;
		margin-top: 100px;
		margin-left: 20px;
	}
	.exercises .title{
		width: 100%;
		height: 80px;
	}
	.title .img{
		height: 60px;
		/* background-color: #00FF7F; */
		float: left;
		margin-top: 10px;
		margin-left: 10px;
		margin-right: 20px;
	}
	.title .img image{
		height: 60px;
	}
	.text{
		width: 100%;
		height: 50px;
		font-size: 30px;
		color: #333;
		float: left;
		margin-top: 15px;
		margin-bottom: 20px;
		margin-left: 10px;
	}
	.title .playIcon{
		width: 68px;
		height: 68px;
		float: left;
		margin: 10px 20px 0px 0px;
	}
	.title .pauseIcon{
		width: 80px;
		height: 80px;
		float: left;
		margin-top: 5px;
	}
	/* 图片答案 */
	.answer{
		width: 100%;
		height: 80%;
		margin-top: 120px;
		margin-left: 25px;
		display: flex; 
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: space-around;
	}
	.answerList{
		/* width: 23%; */
		/* height: 40%; */
		position: relative;
		overflow: auto;
		margin-right: 50px;
	}
	.option{
		width: 10px;
		height: 10px;
		position: absolute;
		left: 80px;
		top: 60px;
	}
	.content{ 
		width: 180px;
		height: 100px;
	}
	/* 文字答案 */
	.answer_text{
		width: 100%;
		height: 80%;
		float: left;
		margin-left: 10px;
	}
	.answerList_text{
		width: 100%;
		height: 15%;
		margin-bottom: 20px;
		position: relative;
	}
	.answerList_text .radio{
		margin-top: 20px;
	}
	.content_text{
		width: 80%;
		height: 100%;
		margin-left: 50px;
		font-size: 26px;
		overflow: hidden;
		color: #333;
		margin-top: -30px;
	}
	/* 答案弹窗 */
	.mask{
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		background: rgba(0,0,0, 0.5);
		position: fixed;
	}
	.successlayer,
	.faillayer{
		width: 420px;
		height: 220px;
		position: fixed;
		text-align: center;
		padding: 10px;
		z-index: 999;	
		border-radius: 10px;
		margin-bottom: 20px;
	}
	.successlayer{
		background-image: linear-gradient(to right, #044BD6 , #009FFA);
		box-shadow: 0px 0px 10px 3px rgb(0 0 0 / 20%);
	}
	.faillayer{
		background-color: #fff;
	}
	.successlayer .line{
		width: 410px;
		height: 210px;
		border: 5px #fff solid;
		border-radius: 5px;
	}
	.faillayer .line{
		width: 410px;
		height: 210px;
		border: 5px #044BD6 solid;
		border-radius: 5px;
	}
	.title{
		width: 200px;
		height: 37px;
		margin: 40px 110px 60px;
	}
	.operabtn{
		width: 410px;
		height: 40px;
		margin-left: 20px;
		margin-top: 10px;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
	}
	.stop{
		width: 172px;
		height: 40px;
		border-radius:20px;
		line-height: 40px;
		font-size: 16px;
		text-align: center;
	}
	.successlayer .stop{
		background-color: #fff;
		border: 2px #fff solid;
		color: #0365E1;
	}
	.faillayer .stop{
		background-color: #044BD6;
		border: 2px #044BD6 solid;
		color: #fff;
	}
	.next{
		width: 172px;
		height: 40px;
		margin-left: 20px;
		border-radius: 20px;
		line-height: 40px;
		font-size: 16px;
		text-align: center;
	}
	.successlayer .next{
		background: #0270E6;
		border: 1px #fff solid;
		color: #fff;
	}
	.faillayer .next{
		background: #fff;
		border: 1px #0270E6 solid;
		color: #0270E6;
	}
	/* 课时完成 */
	.over{
		width:420px;
		height:220px;
		position: fixed;
		text-align: center;
		padding:10px;
		z-index: 999;
		background-image: linear-gradient(to right, #044BD6 , #009FFA);
		border-radius: 10px;
		box-shadow: 0px 0px 10px 3px rgb(0 0 0 / 20%);
		text-align: center;
		margin-bottom:20px;
	}
	.over .title{
		width:370px;
		height:34px;
		margin:40px 15px 43px;
	}
	.confirm{
		width:172px;
		height:40px;
		background: #0270E6;
		border:1px #fff solid;
		margin-left:120px;
		border-radius:20px;
		line-height: 40px;
		font-size:16px;
		color:#fff;
		text-align: center;
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