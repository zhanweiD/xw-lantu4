// import layersConfig from './layers'
import layer from './layer'
/**
 * 思路
 * - 这个文件中不应该出现工具专有词汇：exhibit
 */
// 根据这个配置生成组件的模型
export const config = (k) => ({
  // 这个key只是橱窗组件的key，不是图标库组件的key
  // 因为橱窗组件和图表库组件是N对N的关系
  key: 'gis',
  name: k('gis'),
  layout: () => [10, 6],
  padding: [60, 0, 60, 60],
  layers: [layer()],
  // data,
  // interaction: {
  //   triggerIdFallback: {
  //     undefined: 'onFlyTo',
  //   },
  //   // 响应事件的id向后兼容映射
  //   responserIdFallback: {

  //   },
  //   targets: [
  //     {
  //       id: 'onFlyTo',
  //       // 响应名称
  //       name: '飞到指定位置',

  //       // 响应方法名
  //       fnName: 'flyTo',

  //       // 响应的参数schema，参考 jsonschema https://github.com/tdegrunt/jsonschema#readme ，https://www.cnblogs.com/terencezhou/p/10474617.html
  //       paramSchema: {
  //         type: 'array',
  //         items: [
  //           {
  //             type: 'number',
  //             description: '经度',
  //           },
  //           {
  //             type: 'number',
  //             description: '维度',
  //           }],
  //       },

  //       // 响应说明
  //       remark: '地图视角飞跃到指定经纬度',
  //     },

  //     {
  //       id: 'onZoomTo',
  //       // 响应名称
  //       name: '调整视距11',

  //       // 响应方法名
  //       fnName: 'zoomTo',

  //       // 响应的参数schema，参考 jsonschema https://github.com/tdegrunt/jsonschema#readme ，https://www.cnblogs.com/terencezhou/p/10474617.html
  //       paramSchema: {
  //         type: 'number',
  //         description: '视距值,范围[1,3000]',
  //         exclusiveMinimum: 1,
  //         exclusiveMaximum: 3000,
  //       },

  //       // 响应说明
  //       remark: '调整视距',
  //     },
  //   ],
  //   responsers: [
  //     {
  //       // id轻易不要改变，如果变化需要做向后兼容
  //       id: 'gisFlyTo',
  //       name: '飞到指定经纬度',
  //       remark: '视角平滑飞行至指定经纬度点',
  //       inputType: 'object',
  //       // 定义响应方式
  //       action({
  //         adapter,
  //         instance,
  //         ruleValue,
  //       }) {
  //         // adapter.flyTo([120, 30, 100000])
  //         adapter.flyTo(ruleValue.data)
  //       },
  //     },
  //     {
  //       id: 'gisSetViewport',
  //       name: '调整摄像机视角',
  //       remark: '调整摄像机视角至指定偏航角，俯仰角，翻滚角',
  //       inputType: 'object',
  //       // 定义响应方式
  //       action({
  //         adapter,
  //         instance,
  //         ruleValue,
  //       }) {
  //         // adapter.setViewport([10, -80, 0])
  //         adapter.setViewport(ruleValue.data)
  //       },
  //     },
  //   ],
  //   triggers: [
  //     // 地图移动
  //     {
  //       // id轻易不要改变，如果变化需要做向后兼容
  //       id: 'earthMapMove',
  //       name: '地图移动',
  //       remark: '地图移动',
  //       outputType: 'object',
  //       // 定义绑定事件的方法，并返回解绑事件的方法
  //       _bind({adapter, action, earthAdapter}) {
  //         earthAdapter.event.on('earthMapMove', action)
  //         return () => {
  //           earthAdapter.event.off('earthMapMove', action)
  //         }
  //       },
  //     },
  //   ],
  // },
})
