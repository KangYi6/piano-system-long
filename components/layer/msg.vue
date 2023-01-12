<!-- 提示消息组件 -->
<template>
	<div class="msg">
		<image v-if="icon == 'info'" src="@/static/layer/info.png" mode="widthFix"></image>
		<image v-else-if="icon == 'success'" src="@/static/layer/success.png" mode="widthFix"></image>
		<image v-else-if="icon == 'error'" src="@/static/layer/error.png" mode="widthFix"></image>
		<image v-else-if="icon == 'warn'" src="@/static/layer/warn.png" mode="widthFix"></image>
		<div class="content">{{content}}</div>
	</div>
</template>

<script>
	export default {
		name:'msg',
		props: {
			content: {
				type: String,
				value: "操作成功"
			},
			icon:{
				type:String,
				value:'info'
			}
		},
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style>
	.msg{
		width:auto;
		background-color: rgba(42,104,232,0.84);
		padding:10px 20px;
		position: absolute;
		left:calc(50% - 95px);
		top:calc(50% - 20px);
		z-index: 99999;
		box-shadow: 0px 0px 5px 1px #079fff;
		border-radius: 5px;
	}
	.msg image{
		width:40px;
		height:40px;
		float:left;
	}
	.content{
		width:auto;
		font-size:20px;
		line-height: 40px;
		padding-left:10px;
		float:left;
	}
</style>
