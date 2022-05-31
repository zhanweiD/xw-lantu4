import getUrlQuery from './get-url-query'

// 是否是截图方式查看大屏
// 用于node端截图使用的参数，如果带有这个参数
// - 任何组件的入场动画，轮播动画，轮询请求都失效
// - 视频组件1秒后触发ready
const isSnapshot = getUrlQuery('snapshot') === '1'

export default isSnapshot
