/*
 * @Author: changfeng
 * @LastEditors: changfeng
 * @LastEditTime: 2021-05-07 11:32:36
 * @Description: 全局配置 包含logo路径、 路由前缀等
 */

const config = {
  loginBack: '/login-bg.png',
  waveviewBack: '/waveview-bg.png',
  mascot: '/mascot.svg',
  slogan: '/slogan.png',
  pathPrefix: '',
  urlPrefix: '/api/v4/waveview/',
}

export default Object.assign(config, window.config)
