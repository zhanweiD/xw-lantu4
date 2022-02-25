import getUrlQuery from './get-url-query'

// 使用环境变量判断是否为开发环境，在构建生产环境代码时，if代码块会被删掉
const isLvfa = getUrlQuery('lvfa') === '1'
const isHuatai = getUrlQuery('huatai') === '1'
const isLafei = getUrlQuery('isLafei') === '1'

export {isLvfa, isHuatai, isLafei}
