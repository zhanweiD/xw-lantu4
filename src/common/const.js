const CONTAINER_ALL_SCHEMA = 'container-all-schema'
const CONTAINER_SUBSCHEMA = 'container-subschema'
const CONTAINER_BOX = 'container-box'
const CONTAINER_BOXSTORY = 'container-box-story'

// 全局响应：切换 subschema 显隐状态
const TARGET_TOGGLE_MODAL = 'toggle_modal'

// 全局响应：切换画布分镜显示/隐藏状态
const TARGET_SWITCH_BOX_STORY = 'switch_box_story'

// 全局响应：重新获取数据
const TARGET_REDATA = 'redata'

// const noParam = {
//   type: 'none',
//   description: '不需要参数',
// }

const anyParam = {
  type: 'any',
  description: '任何参数',
}

export default {
  /**
   * 图表组件向box拖拽 key
   */
  EXHIBIT_DRAG_KEY: 'EXHIBIT_DRAG_KEY',

  INTERACTIVE_DRAG_KEY: 'NTERACTIVE_DRAG_KEY',

  // 模板拖拽 key
  EXAMPLE_DRAG_KEY: 'EXAMPLE_DRAG_KEY',

  // 全局事件
  EVENTS_LEVEL_GLOBAL: 'events-global',

  // 组件事件
  EVENTS_LEVEL_STORY: 'events-story',

  // 不触发函数的返回值
  NOT_TRIGGER: 'fn-not-trigger',


  // 全部 schema
  CONTAINER_ALL_SCHEMA,
  // subschema
  CONTAINER_SUBSCHEMA,
  // box
  CONTAINER_BOX,
  // boxStory
  CONTAINER_BOXSTORY,

  TARGET_TOGGLE_MODAL,
  TARGET_SWITCH_BOX_STORY,
  TARGET_REDATA,
  // 定义全局响应
  GLOBAL_TARGETS: [
    {
      key: TARGET_TOGGLE_MODAL,
      // 响应名称
      name: '显示/隐藏画布分镜',

      // 关联容器
      container: [CONTAINER_SUBSCHEMA],

      // 响应的参数schema，参考 jsonschema https://github.com/tdegrunt/jsonschema#readme ，https://www.cnblogs.com/terencezhou/p/10474617.html
      paramSchema: {
        type: 'boolean',
        description: '显示/隐藏状态',
      },

      // 响应说明
      remark: '切换画布分镜显示/隐藏状态',
    },
    {
      key: TARGET_SWITCH_BOX_STORY,
      // 响应名称
      name: '切换容器分镜',

      // 关联容器
      container: [CONTAINER_ALL_SCHEMA, CONTAINER_BOX],

      // 响应的参数schema
      paramSchema: {
        type: 'number',
        description: '要激活的分镜索引（0 开始）',
      },

      // 响应说明
      remark: '切换指定容器到指定分镜',
    },

    {
      key: TARGET_REDATA,
      // 响应名称
      name: '重新获取数据',

      // 关联容器
      container: [CONTAINER_ALL_SCHEMA, CONTAINER_BOX, CONTAINER_BOXSTORY],

      // 响应的参数schema
      paramSchema: anyParam,

      // 响应说明
      remark: '重新获取指定分镜的图表数据',
    },
  ],


  // 默认转换函数
  DEFAULT_TANSFORM_FN: `/**
  * @param value any , 值
  * @param notTrigger  string, 不需要触发时返回
  * eg： if(value < 10) return notTrigger
  */
  function(value, notTrigger) {
   return value
  }`,


}
