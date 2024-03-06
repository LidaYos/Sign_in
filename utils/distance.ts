/**计算两个经纬度距离
* @param lat1 第一个纬度
* @param log1 第一个经度
* @param lat2 第二个维度
* @param log2 第二个经度
* @return 两点距离(单位: m)
*/
export default function getDistance(lat1, lon1, lat2, lon2) {
   let radLat1 = (lat1 * Math.PI) / 180; //将角度换算为弧度
   let radLat2 = (lat2 * Math.PI) / 180; //将角度换算为弧度
   let a = radLat1 - radLat2;
   let b = (lon1 * Math.PI) / 180 - (lon2 * Math.PI) / 180;
   let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
   s = s * 6378137.0; // 取WGS84标准参考椭球中的地球长半径(单位:m)
   return s; //(单位:m)
}