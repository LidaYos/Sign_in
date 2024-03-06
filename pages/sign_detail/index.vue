<template>
	<view class="page" v-if="sign_in">
		<Card v-for="item in signIn" :key="item.index" :avatar="ava" :name="nick" :sign="item.item" />
	</view>
</template>

<script lang="ts" setup>
	import Card from "./components/card.vue"
	import promiseUserInfo from "../../api/getUserIfon"
	import { ref, computed } from "vue"
	import { onShow } from "@dcloudio/uni-app"

	let tk = '' // 是否已经登录
	let sign = ref([])
	const ava = ref('')
	const nick = ref('')
	const sign_in = uni.getStorageSync("sign_in") // 是否有签到记录
	sign.value = uni.getStorageSync("sign_in")

	// 组装需要渲染的数据
	const signIn = computed(() => {
		let tmp = sign.value.map((item, index) => ({ item, index }))
		return tmp
	})

	onShow(() => {
		tk = uni.getStorageSync("token")
		if (!tk) {
			uni.showToast({
				title: "先登录",
				icon: "none"
			})
			uni.navigateTo({
				url: "/pages/login/index"
			})
			return
		}
		promiseUserInfo(tk).then(({ data }) => {
			ava.value = data.data.avatarUrl
			nick.value = data.data.nickName
		})
	})
</script>

<style lang="scss">
	.page {
		height: 100%;
		padding-bottom: env(safe-area-inset-bottom);
		box-sizing: border-box;
	}
</style>