<template>
	<div class="black-bg" @click="modeBtn('close')">
		<div class="mode">
			<div class="border">
				<div class="title">
					<image src="@/static/mode/mode-title.png" mode="widthFix"></image>
				</div>
				<div class="box">
					<div class="list" @click.stop="modeBtn('staff')">
						<div class="icon hover">
							<image src="@/static/mode/staff-icon.png" mode="widthFix"></image>
							<!-- <image src="@/static/mode/staff-icon-hover.png" mode="widthFix"></image> -->
						</div>
						<div class="text">五线谱</div>
					</div>
					<div class="list" @click.stop="modeBtn('waterfall')">
						<div class="icon hover">
							<image src="@/static/mode/waterfall-icon.png" mode="widthFix"></image>
							<!-- <image src="@/static/mode/waterfall-icon-hover.png" mode="widthFix"></image> -->
						</div>
						<div class="text">瀑布流</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		name:'mode',
		data() {
			return {}
		},
		methods: {
			modeBtn(type){
				this.$store.state.mode = 'close'
				this.$store.state.course.show = false
				if (type == 'staff') {
					uni.navigateTo({
						url:"/pages/musicxml/musicxml"
					})
				} else if (type == 'waterfall') {
					uni.navigateTo({
						url:"/pages/waterfall/waterfall"
					})
				}
			}
		}
	}
</script>

<style>
	.black-bg{
		width:100%;
		height:100%;
		position: fixed;
		left:0;
		top:0;
		background: rgba(0,0,0,0.5);
	}
	.mode{
		width:480px;
		height:280px;
		background-image: linear-gradient(to right, #044BD6 , #009FFA);
		padding:10px;
		position: absolute;
		left:calc(50% - 250px);
		top:calc(50% - 150px);
		border-radius: 10px;
	}
	.border{
		width:calc(100% - 10px);
		height:calc(100% - 10px);
		border:5px solid #F0F0F0;
	}
	.title{
		width:100%;
		height:auto;
		text-align: center;
		margin-top:30px;
	}
	.title image{
		width:150px;
		height:28px;
	}
	.box{
		width:80%;
		height:auto;
		overflow: hidden;
		margin:30px auto 0;
	}
	.list{
		width:50%;
		height:auto;
		float: left;
		text-align: center;
	}
	.icon{
		width:100px;
		height:100px;
		border-radius: 50%;
		background:#fff;
		margin:0 auto;
	}
	.icon image{
		width:49px;
		height:63px;
		text-align: center;
		padding-top:19px;
	}
	.list:nth-child(2) image{
		padding-top:27px
	}
	.hover{
		background: #fff;
	}
	.text{
		font-size: 20px;
		color:#fff;
		margin-top:15px;
	}
</style>