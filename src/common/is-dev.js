import getUrlQuery from './get-url-query'

// 使用环境变量判断是否为开发环境，在构建生产环境代码时，if代码块会被删掉
const isDev = getUrlQuery('dev') === '1' || process.env.NODE_ENV === 'development'

export default isDev
