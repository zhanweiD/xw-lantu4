import layer from './layer'
import data from './data'
// 根据这个配置生成组件的模型
export const config = (k) => ({
  // 这个key只是橱窗组件的key，不是图标库组件的key
  // 因为橱窗组件和图表库组件是N对N的关系
  key: 'picture',
  name: k('picture'),
  layout: () => [6, 6],
  padding: [60, 0, 60, 60],
  layers: [layer()],
  completed: true,
  data,
})
