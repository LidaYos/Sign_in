<template>
	<view class="page">
		<view class="page__card">
			<view class="avatar">
				<image class="img" :src="avatar" />
			</view>
			<view class="item">
				{{name}} - {{ sign }}
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
	defineProps<{
		avatar : string,
		name : string,
		sign : string
	}>()
</script>

<style lang="scss">
	.page {
		width: 100%;
		display: flex;
		justify-content: center;
		padding: 4px 0;
		margin-right: 3px;

		&__card {
			height: 110px;
			width: 96%;
			background-color: skyblue;
			display: flex;
			align-items: center;

			.avatar {
				width: 60px;
				height: 60px;
				border-radius: 50%;
				border: 1px solid pink;
				margin: 5px;
			}

			.img {
				border-radius: 50%;
				display: block;
				width: 100%;
				height: 100%;

			}

			.item {
				margin-bottom: 15px;
			}
		}
	}
</style>