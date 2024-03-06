// 逆地址解析
export async function ReverseAdd(lat : number, lng : number) {
	return await uni.request({
		url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${lat},${lng}&key=2BTBZ-AFMW3-KQC3N-3SAXF-K7UP6-EMBN4`
	})
}
