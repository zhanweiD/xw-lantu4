/*
 * @Author: changfeng
 * @LastEditors: changfeng
 * @LastEditTime: 2021-05-07 11:32:36
 * @Description: 全局配置 包含logo路径、 路由前缀等
 */

const config = {
  logo: "/public/logo.svg",
  loginBack: "/public/bk.png",
  mascot: "/public/mascot.svg",
  slogan: "/public/slogan.png",
  pathPrefix: "",
  urlPrefix: "/api/v4/waveview/"
}
export default Object.assign(config, window.config)
