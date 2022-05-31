import {data} from './data'
import layer from './layer'

// 根据这个配置生成组件的模型
export const config = (k) => ({
  // 这个key只是橱窗组件的key，不是图标库组件的key
  // 因为橱窗组件和图表库组件是N对N的关系
  key: 'uiTabButton',
  name: k('uiTabButton'),
  layout: () => [10, 1],
  // 图表主绘图区域的内边距
  padding: [0, 0, 0, 0],
  interaction: {
    eventTriggerTypes: ['switchPanel'],
  },
  layers: [layer(k)],
  data,
})
