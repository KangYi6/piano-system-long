<!-- 确认弹窗组件 -->
<template>
	<div class="layer-alertbg">
		<div class="layer-alert">
			<image src="@/static/err1.png" @click="close()" mode="widthFix"></image>
			<div class="layer-title">{{title}}</div>
			<div class="layer-content">{{content}}</div>
			<div class="layer-btn" v-if="cancelBtn && confirmBtn">
				<div class="layer-cancel" @click="cancle()" v-show="cancelBtn">{{cancelText}}</div>
				<div class="layer-confirm" @click="confirm()" v-show="confirmBtn">{{confirmText}}</div>
			</div>
			<div class="layer-btn" v-else-if="confirmBtn && !cancelBtn">
				<div class="layer-confirm" @click="confirm()" v-show="confirmBtn">{{confirmText}}</div>
			</div>
			<div class="layer-btn" v-else-if="!confirmBtn && cancelBtn">
				<div class="layer-cancel" @click="cancle()" v-show="cancelBtn">{{cancelText}}</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name:'alert',
		props: {
			title: {
				type: String,
				value: "提示"
			},
			content: {
				type: String,
				value: "操作成功"
			},
			cancelBtn:{
				type:Boolean,
				value:true
			},
			cancelText:{
				type:String,
				value:'取消'
			},
			confirmBtn:{
				type:Boolean,
				value:true
			},
			confirmText:{
				type:String,
				value:'确定'
			}
		},
		data() {
			return {
				
			}
		},
		methods: {
			close(){
				this.$emit('closeAlert');
			},
			cancle(){
				this.$emit('cancelAlert');
			},
			confirm(){
				this.$emit('confirmAlert');
			}
		}
	}
</script>

<style>
	.layer-alertbg{
		width:100%;
		height:100%;
		background-color: rgba(0,0,0,0.4);
		position: absolute;
		left:0;
		top:0;
	}
	.layer-alert{
		background-color: rgba(67,109,192);
		border: #079fff solid 3px;
		width: 100%;
		max-width: 500px;
		box-shadow: 0px 0px 20px 4px #079fff;
		position: absolute;
		left:calc(50% - 250px);
		top:calc(50% - 130px);
	}
	.layer-alert image{
		width:40px;
		height:40px !important;
		position: absolute !important;
		top:20px;
		right:20px;
	}
	.layer-title{
		color:#fff;
		border-bottom: 1px solid rgb(255,255,255,0.5);
		padding:1em 1.6em;
		font-size:24px;
	}
	.layer-content{
		width:calc(100% - 40px);
		font-size:20px;
		color:#fff;
		padding:40px 20px;
		text-align: center;
	}
	.layer-btn{
		width:80%;
		height:50px;
		margin:0 10% 40px;
	}
	.layer-btn .layer-confirm{
		margin:0 auto;
		float:none;
	}
	.layer-btn .layer-cancle{
		width:calc(100% - 2px);
	}
	.layer-cancel{
		background-color: #fff;
		border-radius: 50px;
		width:calc(40% - 2px);
		height:auto;
		line-height: 30px;
		margin:10px 5%;
		float:left;
		text-align:center;
		color:#000;
		font-size:20px;
		padding:10px 0;
	}
	.layer-confirm{
		background-color: #0077F1;
		color:#fff !important;
		border-radius: 50px;
		width:calc(40% - 2px);
		height:auto;
		line-height: 30px;
		margin:10px 5% !important;
		float:left !important;
		text-align:center;
		font-size:20px;
		padding:10px 0;
	}
</style>
