import onerIO from 'oner-io'

export const context = onerIO.context({
  rest: true,
  header: {
    'Content-Type': 'application/json;charset=utf-8',
  },
  // 目前还没有做鉴权, 下面的设置为 false, 和服务端的 * 相对应
  // 如果设为 true, 需要服务端设置响应头 Access-Control-Allow-Origin 为具体的白名单
  withCredentials: false,
  url: 'http://192.168.90.160:9068/',
  // Mock配置地址 http://111.231.93.26:7300/
  // mockUrlPrefix: `http://111.231.93.26:7300/mock/${id}/waveview/`,
  // mockUrlPrefix: '/mock/5e21744fdacfc14d85801922/waveview/',
  urlPrefix: 'api/v1/waveview/',
  // 添加额外参数后端会报错
  urlMark: false,
  urlStamp: true,
  fit(response) {
    this.toResolve(response)
  },
})

// 操作项目的接口
context.create('geo', {
  // 获取项目列表
  get: {
    mock: true,
    method: 'GET',
    mockUrl: 'geojson/:id',
    url: 'geojson/:id',
  },
})

export default context.api.geo
