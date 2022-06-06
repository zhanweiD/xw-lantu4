import layer from './layer'
// 根据这个配置生成组件的模型
export const config = (k) => ({
  // 这个key只是橱窗组件的key，不是图标库组件的key
  // 因为橱窗组件和图表库组件是N对N的关系
  key: 'input',
  name: k('input'),
  layout: () => [12, 2],
  padding: [60, 0, 60, 60],
  layers: [layer()],
  interaction: {
    sources: [
      {
        // 事件名称
        name: '输入',
        // 事件改变值的 key
        key: 'changeStamp',
        // 事件的参数schema，参考 jsonschema https://github.com/tdegrunt/jsonschema#readme，https://www.cnblogs.com/terencezhou/p/10474617.html
        paramSchema: {
          type: 'string',
          description: '输入框点击的时间戳',
        },
        // 事件的说明，参数的说明可以写到这里
        remark: '输入值发生变化',
      },
    ],
    targets: [],
  },
})
