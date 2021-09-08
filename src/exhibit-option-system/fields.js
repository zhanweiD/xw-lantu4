// type文档：https://dtwave.yuque.com/waveview/levoxx/eo63xo
// NOTE: 这个文件内只定义最新版的配置体系，不包含向后兼容的映射

/**
 * =====================================
 * common
 * =====================================
 */

// 颜色
const color = {
  type: 'colorPicker',
  label: 'color',
  defaultValue: '#ffffff',
}

// 偏移
const offset = {
  type: 'multiNumber',
  label: 'offset',
  defaultValue: [0, 0],
  items: [
    {
      key: 'X',
      min: 0,
      max: 50,
      step: 1,
    },
    {
      key: 'Y',
      min: 0,
      max: 50,
      step: 1,
    },
  ],
}

// 透明度
const opacity = {
  type: 'number',
  label: 'opacity',
  defaultValue: 1,
  min: 0,
  max: 1,
  step: 0.1,
}

// 相对位置
// NOTE: 锚点依赖position
const position = {
  type: 'check',
  label: 'position',
  defaultValue: 'topCenter',
  // TODO
  options: [
    {
      icon: 'position-top-left',
      value: 'topLeft',
    },
    {
      icon: 'position-top-center',
      value: 'topCenter',
    },
    {
      icon: 'position-top-right',
      value: 'topRight',
    },
    {
      icon: 'position-middle-left',
      value: 'middleLeft',
    },
    {
      icon: 'position-middle-center',
      value: 'middleCenter',
    },
    {
      icon: 'position-middle-right',
      value: 'middleRight',
    },
    {
      icon: 'position-bottom-left',
      value: 'bottomLeft',
    },
    {
      icon: 'position-bottom-center',
      value: 'bottomCenter',
    },
    {
      icon: 'position-bottom-right',
      value: 'bottomRight',
    },
  ],
}

// 锚点
const anchor = Object.assign({}, position, {
  label: 'anchor',
})

// 角度
const angle = {
  type: 'number',
  label: 'angle',
  defaultValue: 0,
  min: 0,
  max: 360,
  step: 1,
}

/**
 * =====================================
 * gis
 * =====================================
 */

// 经度字段选择
const logitudeColumn = {
  type: 'columnSelect',
  label: 'longitude',
}

// 维度字段选择
const latitudeColumn = {
  type: 'columnSelect',
  label: 'longitude',
}

/**
 * =====================================
 * text
 * =====================================
 */

// 字号
const textSize = {
  type: 'number',
  label: 'textSize',
  min: 4,
  step: 1,
  defaultValue: 12,
}

// 字重
const textWeight = {
  type: 'check', // 待确认
  label: 'textWeight',
  defaultValue: '2',
  options: [
    {key: '1', value: '100'},
    {key: '2', value: '00'},
    {key: '3', value: '00'},
    {key: '4', value: '00'},
    {key: '5', value: '00'},
    {key: '6', value: '600'},
    {key: '7', value: '700'},
    {key: '8', value: '800'},
    {key: '9', value: '900'},
  ],
}

// 文字方向
const textDirection = {
  type: 'check',
  label: 'textextDirection',
  defaultValue: 1,
  options: [
    {
      key: 'horizontal',
      value: 'horizontal',
    },
    {
      key: 'vertical',
      value: 'vertical',
    },
  ],
}

export default {
  color,
  offset,
  opacity,
  position,
  anchor,
  angle,
  logitudeColumn,
  latitudeColumn,
  textSize,
  textWeight,
  textDirection,
}
