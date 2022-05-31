/**
 * @author fenfen.wff 白浅
 * @description GIS地图相关的处理工具
 */

/**
 * @desc 根据地图的缩放将像素值放大到米的单位，比如128像素在zoom为7的视图下直接为12800000.
 * 转化依据：https://wiki.openstreetmap.org/wiki/Zoom_levels
 * @param value number ｜ number[] 像素值
 * @param zoom 地图当前所在的缩放层级
 * @param latitude 地图当前所在的纬度
 * @return number | number[] 转化成的米值
 */
export const getTransformNumber = (value, zoom, latitude) => {
  if (Array.isArray(value)) {
    return value.map((item) => getTransformNumber(item, zoom, latitude))
  }

  const earthCircumference = 40075017
  const latitudeRadians = latitude * (Math.PI / 180)
  const metersPerPixel = (earthCircumference * Math.cos(latitudeRadians)) / Math.pow(2, zoom + 8)

  return (value * metersPerPixel) / 2
}
