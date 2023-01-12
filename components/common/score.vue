<template>
	<div class="blackbg">
		<div class="finish">
			<div class="cot">
				<div class="box clearfix">
					<div class="head">
						<img src="assets/images/finish.png">
					</div>
					<div class="scorebox">
						<div class="left fl">
							<div class="score">
								<span id="score">0</span> 分
							</div>
							<p>练习用时 <i id="time">00分00秒</i></p>
						</div>
						<div class="rightbox fl">
							<ul>
								<li>
									<span><em id="accuracy">0</em> %</span>
									<p>准确率</p>
								</li>
								<li>
									<span><em id="error">0</em> 个</span>
									<p>错误</p>
								</li>
								<li>
									<span><em id="fighting">0</em> %</span>
									<p>打败用户</p>
								</li>
							</ul>
						</div>
					</div>
					<div class="tips">小梦评语：您的识谱非常棒，速度再提高就完美了！</div>
					<div class="operabtn">
						<div class="noplay" onclick="goback()">不练了</div>
						<div class="again">再练一次</div>
					</div>
				</div>
				<div class="close"><img src="assets/images/close-icon-2.png"></div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name:'score',
		data() {
			return {}
		},
		methods: {
			modeBtn(type){
				this.$store.state.mode = 'close'
				if (type == 'staff') {
					uni.navigateTo({
						url:"/pages/musicxml/musicxml"
					})
				} else if (type == 'waterfall') {
					uni.navigateTo({
						url:"/pages/waterfall/waterfall?id="+this.$store.state.id+"&path="+this.$store.state.path+"&title="+this.$store.state.title
					})
				}
			}
		}
	}
</script>

<style>
	.blackbg{
		width:100%;
		height:100%;
		background: rgba(0,0,0,0.3);
		position: fixed;
		left:0;
		top:0;
		z-index: 999999;
		display: none;
	}
	.finish{
		width:540px;
		height:auto;
		position: fixed;
		left:calc(50% - 250px);
		top:calc(50% - 150px);
		text-align: center;
		padding:10px;
		z-index: 999;
		background-image: linear-gradient(to right, #044BD6 , #009FFA);
		border-radius: 10px;
	}
	.finish i{
		font-style: normal;
		}
	.close{
		width:32px;
		height:auto;
		position: absolute;
		bottom: -45px;
		left: calc(50% - 16px);
	}
	.close img{
		max-width:32px;
	}
	.cot{
		width:calc(100% - 10px);
		height:calc(100% - 10px);
		border:5px #F0F0F0 solid;
	}
	.head{
		width:200px;
		height:auto;
		margin:0 auto;
	}
	.head img{
		max-width:100%;
	}
	.box{
		width:calc(100% - 40px);
		height:auto;
		margin:30px 20px;
	}
	.box .left{
		width:40%;
		height:auto;
	}
	.scorebox{
		width:100%;
		height:auto;
		margin:10px auto;
		overflow: hidden;
	}
	.box .score{
		height:auto;
		font-size:20px;
		color:#fff;
		text-align: center;
	}
	.box .score span{
		font-size:60px;
		display: inline-block;
	}
	.box .left p{
		width:80%;
		height:auto;
		background: #fff;
		font-size:12px;
		text-align: center;
		color:#0365E1;
		line-height: 20px;
		border-radius: 10px;
		margin:0 auto;
	}
	.box .rightbox{
		width:60%;
		overflow: hidden;
		margin-top:20px;
		text-align: center;
	}
	.box .rightbox li{
		width:calc(33.33% - 1px);
		height:auto;
		float:left;
		color:#fff;
		font-size:14px;
		border-left:1px #ffffff2e solid;
	}
	.box em{
		font-size:26px;
		font-style: normal;
	}
	.tips{
		width:calc(100% - 20px);
		height:auto;
		font-size:16px;
		color:#fff;
		line-height: 24px;
		margin:25px 10px;
	}
	.operabtn{
		width:90%;
		height:auto;
		overflow: hidden;
		margin:0 auto;
	}
	.noplay{
		width:calc(48% - 2px);
		height:40px;
		float:left;
		background: #fff;
		border-radius:20px;
		margin-right:4%;
		line-height: 40px;
		text-align: center;
		border:1px #fff solid;
		color:#0365E1;
		font-size:16px;
		cursor: pointer;
	}
	.again{
		width:calc(48% - 2px);
		height:40px;
		line-height: 40px;
		text-align: center;
		background: linear-gradient(to right,#0449D5, #00A1FB);
		font-size:16px;
		border:1px #fff solid;
		color:#fff;
		border-radius:20px;
		float:left;
		cursor: pointer;
	}
</style>