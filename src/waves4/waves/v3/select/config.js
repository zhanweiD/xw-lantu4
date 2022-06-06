import data from './data'
import layer from './layer'

export const config = (k) => ({
  // 这个key只是橱窗组件的key，不是图标库组件的key
  // 因为橱窗组件和图表库组件是N对N的关系
  key: 'select',
  name: k('select'),
  layout: () => [12, 2],
  padding: [60, 0, 60, 60],
  layers: [layer()],
  interaction: {
    eventTriggerTypes: ['switchPanel'],
  },
  data,
})
