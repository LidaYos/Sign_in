	// uni.request 封装成promise
	export default function promiseRequest(token : string) {
		return new Promise((resolve, reject) => {
			uni.request({
				url: "http://1.14.198.102:8001/app/user/info/person",
				header: {
					Authorization: token
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
