import layer from './layer'
import data from './data'
// 根据这个配置生成组件的模型
export const config = (k) => ({
  // 这个key只是橱窗组件的key，不是图标库组件的key
  // 因为橱窗组件和图表库组件是N对N的关系
  key: 'iframe',
  name: k('iframe'),
  layout: () => [14, 9],
  padding: [24, 24, 24, 24],
  layers: [layer()],
  completed: true,
  data,
})
