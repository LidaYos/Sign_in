import { ref } from "vue"

export default async function getLoctaion() {
	const latitude = ref(0)
	const longitude = ref(0)
	// 获取当前位置
	async function loca() {
		const res = await uni.getLocation({
			type: 'gcj02',
			isHighAccuracy: true // 精度定位
		})
		latitude.value = res.latitude
		longitude.value = res.longitude
	}
	await loca()
	return {
		latitude,
		longitude
	}
}