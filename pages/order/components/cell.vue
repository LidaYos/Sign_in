<template>
	<view class="page" @click="onJump">
		<view class="page__left">
			{{title}}
		</view>
		<view class="page__right">
			{{value}}
		</view>
	</view>
</template>

<script lang="ts" setup>	
	defineProps<{
		title : string,
		value : string
	}>()
	const emit = defineEmits(['onJump'])
	const onJump = () => {
		emit("onJump")
	}
</script>

<style lang="scss">
	.page {
		height: 50px;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 0 10px;
		box-sizing: border-box;
		background-color: #bfbfbf;
		position: relative;

		&__left {
			font-size: 16px;
		}

		&__right {
			font-size: 14px;
		}
	}

	.page::after {
	  content: "";
	  position: absolute;
	  bottom: 0;
	  right: 10px;
	  left: 10px;
	  border-bottom: 1px solid pink;
	}
</style>