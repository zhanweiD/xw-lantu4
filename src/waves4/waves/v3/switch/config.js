import layer from './layer'
//根据这个配置生成的组件的草包
export const config = (k) => ({
  // 这个key只是橱窗组件的key，不是图标库组件的key
  // 因为橱窗组件和图表库组件是N对N的关系
  key: 'switchs',
  name: k('switch'),
  layout: () => [2, 1],
  padding: [60, 0, 60, 60],
  layers: [layer()],
  interaction: {
    eventTriggerTypes: ['toggleSwitch'],
  },
})
