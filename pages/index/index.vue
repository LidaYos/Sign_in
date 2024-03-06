<template>
	<view class="content">
		<map class="map" :latitude="lat" :longitude="lng" show-location :markers="markers" />

		<view class="checkIn">
			<!-- 签到版面 -->
			<view class="backg1">
				<image class="bg" src="../../static/bg.png" />
				<!-- 地址显示 -->
				<view class="position">
					<image class="psicon" src="../../static/positionIcon.png" />
					<view class="ps_item">
						{{site?.address}}
					</view>
				</view>
				<view class="ps_distance">
					距离公司{{ dis }}米
				</view>
			</view>

			<!-- 点击签到 -->
			<view class="backg2" @click="onSingIn">
				<image class="check" src="../../static/check.png" />
				<view class="che_item">
					<view class="item_one">
						{{isSign?"今日已签到":"签到"}}
					</view>
					<view class="item_tow">
						{{time}}
					</view>
				</view>
			</view>

			<!-- 重新定位 -->
			<view :class="['rePostion', active ? 'active' : '']" @click="onPosition">
				<image class="reP_ico" src="../../static/rePosition.png" />
				<view class="reP_item">
					重新定位
				</view>
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
	import { ref, watch } from "vue";
	import { onShow, onHide, onLoad } from "@dcloudio/uni-app"
	import { ReverseAdd } from "../../api/reverseAddress"
	import getLoctaion from "../../hooks/location"
	import { formatTime, formatDate } from "../../utils/times"
	import getDistance from "../../utils/distance"

	// 逆地址类型, formatDate
	interface Mks {
		address : string
		location : [{
			lat : number
			lng : number
		}]
	}
	const active = ref(false) // 重新获取定位，是否禁止点击
	const lat = ref(0)
	const lng = ref(0)
	const site = ref<Mks>(null) // 当前地址，逆解析
	const time = ref()
	let timeQuantum = null // 打卡时间显示
	let add = null // 打卡地址显示
	let markers : any = ref([])
	let tk = '' // 是否已经登录
	// 公司位置
	const firmLat = 22.630551
	const firmLng = 113.838963
	// 员工距离公司的位置
	const dis = ref<string | number>("***")
	// 是否在打卡范围内
	let isDis : boolean
	// 当日签到没有
	let isSign : boolean = uni.getStorageSync("isSign") == false || null ? false : true

	// 拿到距离
	watch(() => dis.value, (newVal) => {
		dis.value = newVal;
		// 定义打卡距离
		if (newVal > 100005) {
			// 不可打卡
			// console.log('不可打卡')
			isDis = true
		} else {
			// 允许打卡
			// console.log('允许打卡')
			isDis = false
		}
	}, {
		immediate: true
	})


	// 点击重新获取定位
	let lastRequestTime = 0;
	const onPosition = () => {
		const now = new Date().getTime(); // 当前时间 *1000
		if (now - lastRequestTime >= 5000) { // 点击后，有间隔时间不可再发请
			lastRequestTime = now;
			active.value = true
			uni.showLoading({
				title: "正在获取定位...",
			});
			curPath();
			// console.log("重新获取定位");
			setTimeout(() => {
				uni.hideLoading(); // 2秒之后清除 loading
				active.value = false
			}, 2000);
		} else {
			uni.showToast({
				title: "操作频繁,请稍后再试",
				icon: "none",
			});
		}
	};

	// 收集签到
	let collection = uni.getStorageSync('sign_in') || [];
	// 点击签到
	const onSingIn = () => {
		// 年月日
		const tmp = formatDate(new Date())
		if (!tk) {
			uni.showToast({
				title: "先登录",
				icon: "none"
			})
			return
		} else if (isDis) {
			uni.showToast({
				title: "请先到达公司~",
				icon: "none"
			})
			return
		} else if (isSign) {
			uni.showToast({
				title: "今天已经打卡~",
				icon: "none"
			})
			return
		}

		uni.showModal({
			title: "打卡详情",
			content: `地点:${add}\n时间:${timeQuantum}`
			, success({ confirm }) {
				if (confirm) {
					// 签到状态改变
					uni.setStorageSync("isSign", true)
					isSign = uni.getStorageSync("isSign")
					// 首位添加
					collection.unshift(`签到时间 ${tmp}-${time.value}`)
					uni.setStorageSync('sign_in', collection)
					uni.showToast({
						title: "签到成功！"
					})
				}
			}
		})
	}

	// 定时器 当前时间
	onShow(() => {
		fetchMarkers(firmLat, firmLng)
		tk = uni.getStorageSync("token")
		console.log("创建(定时器)")
		// 间隔时间刷新当前地址
		const time2 = setInterval(() => {
			curPath()
			// console.log("间隔刷新用户当前位置(定时器)")
		}, 20000)

		const timer = setInterval(() => {
			const tt = formatTime(new Date());
			time.value = tt.slice(-8);
			// 每天 00:00:00 签到重置
			if (time.value == "11:05:36") {
				uni.setStorageSync("isSign", false)
				isSign = uni.getStorageSync("isSign")
				// console.log("====签到重置")
			}
		}, 1000);

		watch(() => time.value, (newV) => {
			// console.log(newV);
			timeQuantum = newV
		});
		// 销毁定时器
		onHide(() => {
			// clearInterval(timer)
			clearInterval(time2) // 清理获取位置定时器
			console.log("定时器已被清除") // 切换页面
		});

	});

	// 公司位置 [地址写死]。
	function fetchMarkers(lat : number, lng : number) {
		markers = [
			{
				id: 1,
				latitude: lat,
				longitude: lng,
				width: 30,
				height: 35,
				iconPath: '/static/positionIconTow.png',
				"callout": {
					"content": "公司位置",
					"borderRadius": 5,
					"display": "ALWAYS",
					"padding": 7,
					"bgColor": "#ccc"
				}
			}
		]

	}


	function curPath() {
		// 用户当前定位
		async function fetchData() {
			const { latitude, longitude } = await getLoctaion();
			lat.value = latitude.value
			lng.value = longitude.value
			fetchList(latitude.value, longitude.value) // 逆地址解析传递参数
			// 两地距离
			let res = getDistance(latitude.value, longitude.value, firmLat, firmLng)
			res = Math.round(res)
			dis.value = res
		}

		// 逆地址解析
		async function fetchList(lat : number, lng : number) {
			// @ts-ignore
			const { data: { result } } : any = await ReverseAdd(lat, lng)
			site.value = result
			add = site.value?.address
		}
		// 默认调用获取当前地址
		fetchData();
	}
	curPath()
</script>

<style lang="scss">
	// 地图
	.map {
		width: 100%;
		height: 100vh;
	}

	// 打卡面板
	.backg1 {
		width: 88%;
		height: 275px;
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		// padding-bottom: env(safe-area-inset-bottom);
		padding-bottom: 50px;
		box-sizing: border-box;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.bg {
		width: 100%;
		height: 100%;
		display: block;
		opacity: 0.7;
	}

	.backg2 {
		width: 130px;
		height: 130px;
		position: absolute;
		bottom: 176px;
		left: 50%;
		transform: translateX(-50%);
		padding-bottom: env(safe-area-inset-bottom);
		z-index: 2;
		box-shadow: 50%;
	}

	.che_item {
		position: relative;
		bottom: 70%;
		left: 0;
		text-align: center;
	}

	.item_one {
		font-size: 18px;
		color: #fff;
		height: 30px;
	}

	.item_tow {
		font-size: 16px;
		color: #ccc;
	}

	.check {
		width: 100%;
		height: 100%;
		display: block;
	}

	.position {
		width: 60%;
		text-align: center;
		position: absolute;
		bottom: 150px;
		left: 50%;
		transform: translateX(-50%);
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.psicon {
		width: 15px;
		height: 20px;
		display: inline-block;
	}

	.ps_item {
		width: 200px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 14px;
		padding-left: 5px;
	}

	.ps_distance {
		width: 200px;
		position: absolute;
		bottom: 100px;
		text-align: center;
		font-size: 14px;
	}

	.rePostion {
		width: 100px;
		height: 25px;
		background-color: #fff;
		border-radius: 5px;
		display: flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		bottom: 282px;
		left: 6%;
	}

	.reP_ico {
		width: 18px;
		height: 18px;
		display: block;
	}

	.reP_item {
		font-size: 14px;
		padding-left: 5px;
	}

	.active {
		pointer-events: none;
	}
</style>