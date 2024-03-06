/**
 * 格式化时间
 */ 
function formatNumber(mea) {
	mea = mea.toString()
	// console.log(mea)
	return mea[1] ? mea : '0' + mea
}

function formatDate(date) {
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()
	
	return [year, month, day].map(formatNumber).join('-')
}

function formatTime(date) {
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()
	const hour = date.getHours()
	const minute = date.getMinutes()
	const second = date.getSeconds()
	return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

export { formatTime, formatDate }