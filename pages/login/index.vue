<template>
	<view class="page">
		<view class="login" @click="onLogin">
			微信一键登录
		</view>
		<!-- <button @click="aa">111</button> -->
	</view>
	<van-toast id="van-toast" />
</template>

<script lang="ts" setup>
	import { getCurrentInstance } from 'vue'  
	// 需要拿出通道对象
	const _this = getCurrentInstance().proxy
	
	// uni.login 需要参数的类型r
	interface MyLogin {
		code : string,
		errMsg : string
	}
	// promiseRequest返回值类型
	interface MyHome {
		code : number,
		data : {
			expire : number,
			refreshExpire : number,
			refreshToken : string,
			token : string
		}
	}

	// uni.login 封装成promise
	function promiseLogin() {
		return new Promise((resolve) => {
			uni.login({
				success: (res : MyLogin) => {
					resolve(res)
				}
			})
		})
	}

	// uni.request 封装成promise
	function promiseRequest(code : string, encryptedData : string, iv : string) {
		return new Promise((resolve, reject) => {
			uni.request({
				method: "POST",
				url: "http://1.14.198.102:8001/app/user/login/mini",
				data: {
					code,
					encryptedData,
					iv,
				},
				success: (res : any) => {
					resolve(res)
				},
				fail: (err : any) => {
					reject(err)
				}
			})

		})
	}

	const onLogin = async () => {
		const { encryptedData, iv } = await uni.getUserProfile({ desc: "desc" })
		// @ts-ignore
		const { code } = await promiseLogin()
		const { data } : any = await promiseRequest(code, encryptedData, iv)
		const res : MyHome = data
		// console.log("=== 报错",data)
		// 业务状态判断
		if (res.code !== 1000) {
			uni.showToast({
				title: "请重试..",
				icon: "none"
			})
			return;
		}
		uni.setStorageSync('token', res.data.token)
		// @ts-ignore
		const eventChannel = _this.getOpenerEventChannel()
		eventChannel.emit('updateMain')
		uni.showToast({
			title:"登录成功"
		})
		setTimeout(() => {
		uni.navigateBack()
		},1000)
	}
</script>

<style lang="scss">
	.page {
		width: 100%;
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: pink;
		opacity: .6;
	}

	.login {
		width: 170px;
		height: 50px;
		background-color: #009ce9;
		color: #fff;
		border-radius: 5px;
		text-align: center;
		line-height: 50px;
		font-size: 22px;
		margin-top: -400px;
	}
</style>