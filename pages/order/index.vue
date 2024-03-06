<template>
	<view class="page">
		<view class="page__top">
			<view class="notLogin" v-if="user && tk">
				<view class="avatar">
					<image class="img" :src="user?.data.avatarUrl" />
				</view>
				<view class="item">
					{{user?.data.nickName}}
				</view>
				<view class="right" @click="cancelLogin">
					退出登录
				</view>
			</view>
			<view class="login" @click="jump" v-else>
				登录
			</view>

		</view>

		<view class="page__container">
			<Cell title="签到信息" value="前往" @onJump="onJump" />
		</view>
	</view>
</template>

<script lang="ts" setup>
	import { ref } from "vue"
	import Cell from "./components/cell.vue"
	import promiseUserInfo from "../../api/getUserIfon"
	import type { MyAcc } from "../../api/interface"

	let tk = '' // 是否已经登录
	const user = ref<MyAcc>(null)
	
	//跳到签到详情
	const onJump = () => {
		if (!tk) {
			uni.showToast({
				title: "先登录",
				icon: "none"
			})
			return
		}
		uni.navigateTo({
			url: "/pages/sign_detail/index"
		})
	}

	// 退出登录
	const cancelLogin = () => {
		uni.showModal({
			title: "确认退出登录吗?",
			success: ({ confirm }) => {
				if (!confirm) return
				uni.removeStorageSync("token")
				main()
			}
		})
	}

	// 请求用户信息
	async function main() {
		tk = uni.getStorageSync("token")
		const res : any = await promiseUserInfo(tk)
		user.value = res.data
	}
	main()

	// 跳到登录页
	const jump = () => {
		uni.navigateTo({
			url: "/pages/login/index",
			events: {
				updateMain: () => {
					main()
				}
			}
		})
	}
</script>

<style lang="scss">
	.page {
		height: 100%;
		display: flex;
		flex-direction: column;
		position: relative;

		&__top {
			height: 200px;
			background-color: skyblue;
			opacity: .8;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			.avatar {
				width: 70px;
				height: 70px;
				border: 1px solid pink;
				border-radius: 50%;

				.img {
					width: 100%;
					height: 100%;
					border-radius: 50%;
					display: block;
				}
			}

			.login {
				width: 100px;
				height: 40px;
				background-color: #f2f1ed;
				border-radius: 5px;
				text-align: center;
				line-height: 40px;
				font-size: 22px;
			}

			.item {
				padding-top: 5px;
				box-sizing: border-box;
				width: 120px;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				font-size: 16px;
				text-align: center;
			}
		}

		.right {
			position: absolute;
			top: 5px;
			right: 5px;
			font-size: 16px;
			color: #777
		}

		&__container {
			flex: 1;
			background-color: #bfbfbf;
			padding-bottom: 1px;
			position: relative;
			
		}
	}

	.notLogin {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>