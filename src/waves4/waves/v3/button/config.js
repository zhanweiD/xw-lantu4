// import {cartesian} from '@waves4/configs'
import layer from './layer'
// 根据这个配置生成组件的模型
export const config = (k) => ({
  // 这个key只是橱窗组件的key，不是图标库组件的key
  // 因为橱窗组件和图表库组件是N对N的关系
  key: 'button',
  name: k('button'),
  layout: () => [4, 2],
  padding: [60, 0, 60, 60],
  layers: [layer()],
  completed: true,
  interaction: {
    eventTriggerTypes: ['click', 'doubleClick'],
    sources: [
      {
        // 事件名称
        name: '点击',
        // 事件改变值的 key
        key: 'clickStamp',
        // 事件的参数schema，参考 jsonschema https://github.com/tdegrunt/jsonschema#readme，https://www.cnblogs.com/terencezhou/p/10474617.html
        paramSchema: {
          type: 'string',
          description: '按钮点击的时间戳',
        },
        // 事件的说明，参数的说明可以写到这里
        remark: '按钮被点击',
      },
    ],
    targets: [],
  },
  // 标题面板
})
