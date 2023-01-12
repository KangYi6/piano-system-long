<!-- 读取XML数据的webview组件 -->
<template>
	<web-view :src="xmlurl"></web-view>
</template>
<script>
	export default {
		name:"read",
		props:{
			xmlurl:{
				type:String,
				default:'',
			},
		},
		data() {
			return {
				
			}
		},
		mounted() {},
		methods: {}
	}
</script>

<style>
	
</style>