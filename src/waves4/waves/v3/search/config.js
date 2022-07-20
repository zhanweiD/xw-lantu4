/*
 * @Author: zhanwei
 * @Date: 2022-07-01 17:31:14
 * @LastEditors: zhanwei
 * @LastEditTime: 2022-07-13 14:38:48
 * @Description:
 */
import layer from './layer'
// 根据这个配置生成组件的模型
export const config = (k) => ({
  // 这个key只是橱窗组件的key，不是图标库组件的key
  // 因为橱窗组件和图表库组件是N对N的关系
  key: 'search',
  name: k('search'),
  layout: () => [12, 2],
  padding: [24, 24, 24, 24],
  layers: [layer()],
  interaction: {
    eventTriggerTypes: ['search'],
  },
})
