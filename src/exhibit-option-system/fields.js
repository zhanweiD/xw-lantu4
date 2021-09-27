// type文档：https://dtwave.yuque.com/waveview/levoxx/eo63xo
// NOTE: 这个文件内只定义最新版的配置体系，不包含向后兼容的映射
// TODO:
// - 向后兼容的设计
// - 相对位置的图标

/**
 * =====================================
 * common
 * =====================================
 */

// 偏移
const offset = {
  type: 'multiNumber',
  label: 'offset',
  defaultValue: [0, 0],
  items: [
    {
      key: 'X',
      step: 1,
    },
    {
      key: 'Y',
      step: 1,
    },
  ],
}

// 间隔
const gap = {
  type: 'multiNumber',
  label: 'gap',
  defaultValue: [0, 0],
  items: [
    {
      key: 'IN',
      step: 1,
    },
    {
      key: 'OUT',
      step: 1,
    },
  ],
}

const blur = {
  type: 'number',
  label: 'blur',
  defaultValue: 0,
  min: 0,
  max: 10,
  hasSlider: true,
}

// 透明度
const opacity = {
  type: 'number',
  label: 'opacity',
  defaultValue: 1,
  min: 0,
  max: 1,
  step: 0.1,
  hasSlider: true,
}

// 相对位置
// NOTE: 锚点依赖relativePosition
const relativePosition = {
  type: 'check',
  label: 'position',
  defaultValue: 'top',
  // TODO
  options: [
    // {
    //   icon: 'relative-position-top-left',
    //   value: 'topLeft',
    // },
    {
      icon: 'relative-position-top-center',
      value: 'top',
    },
    // {
    //   icon: 'relative-position-top-right',
    //   value: 'topRight',
    // },
    {
      icon: 'relative-position-middle-left',
      value: 'left',
    },
    {
      icon: 'relative-position-middle-center',
      value: 'center',
    },
    {
      icon: 'relative-position-middle-right',
      value: 'right',
    },
    // {
    //   icon: 'relative-position-bottom-left',
    //   value: 'bottomLeft',
    // },
    {
      icon: 'relative-position-bottom-center',
      value: 'bottom',
    },
    // {
    //   icon: 'relative-position-bottom-right',
    //   value: 'bottomRight',
    // },
  ],
}

// NOTE: layoutPosition
const layoutPosition = {
  type: 'check',
  label: 'position',
  defaultValue: 'topLeft',
  options: [
    {
      icon: 'relative-position-top-left',
      value: 'topLeft',
    },
    {
      icon: 'relative-position-top-center',
      value: 'topCenter',
    },
    {
      icon: 'relative-position-top-right',
      value: 'topRight',
    },
    {
      icon: 'relative-position-middle-left',
      value: 'middleLeft',
    },
    {
      icon: 'relative-position-middle-center',
      value: 'middleCenter',
    },
    {
      icon: 'relative-position-middle-right',
      value: 'middleRight',
    },
    {
      icon: 'relative-position-bottom-left',
      value: 'bottomLeft',
    },
    {
      icon: 'relative-position-bottom-center',
      value: 'bottomCenter',
    },
    {
      icon: 'relative-position-bottom-right',
      value: 'bottomRight',
    },
  ],
}

// 坐标位置
const xyPosition = {
  type: 'multiNumber',
  label: 'coordinate',
  defaultValue: [0, 0],
  items: [
    {
      key: 'X',
      step: 1,
    },
    {
      key: 'Y',
      step: 1,
    },
  ],
}

// 锚点
const anchor = {
  type: 'check',
  label: 'anchor',
  defaultValue: 'topLeft',
  // TODO
  options: [
    {
      icon: 'anchor-top-left',
      value: 'topLeft',
    },
    {
      icon: 'anchor-top-center',
      value: 'topCenter',
    },
    {
      icon: 'anchor-top-right',
      value: 'topRight',
    },
    {
      icon: 'anchor-middle-left',
      value: 'middleLeft',
    },
    {
      icon: 'anchor-middle-center',
      value: 'middleCenter',
    },
    {
      icon: 'anchor-middle-right',
      value: 'middleRight',
    },
    {
      icon: 'anchor-bottom-left',
      value: 'bottomLeft',
    },
    {
      icon: 'anchor-bottom-center',
      value: 'bottomCenter',
    },
    {
      icon: 'anchor-bottom-right',
      value: 'bottomRight',
    },
  ],
}

// 角度
const angle = {
  type: 'number',
  label: 'angle',
  defaultValue: 0,
  min: 0,
  max: 360,
  step: 1,
  hasSlider: true,
}

// 触发事件类型
const eventType = {
  type: 'check',
  label: 'trigger',
  options: [
    {
      key: 'click',
      value: 'click',
    },
    {
      key: 'hover',
      value: 'hover',
    },
  ],
}

// 缺失
const missing = {
  type: 'missing',
  label: 'missing',
}

/**
 * =====================================
 * size
 * =====================================
 */

// 宽度
const width = {
  type: 'number',
  label: 'width',
  min: 0,
  max: 5000,
  step: 1,
}

// 高度
const height = {
  type: 'number',
  label: 'height',
  min: 0,
  max: 5000,
  step: 1,
}

// 尺寸
const size = {
  type: 'number',
  label: 'size',
  min: 1,
  max: 100,
  step: 1,
}

// 尺寸(宽高)
const areaSize = {
  type: 'multiNumber',
  label: 'size',
  defaultValue: [0, 0],
  items: [
    {
      key: 'width',
      min: 0,
      step: 1,
    },
    {
      key: 'height',
      min: 0,
      step: 1,
    },
  ],
}

/**
 * =====================================
 * color
 * =====================================
 */

// 颜色类型
const colorType = {
  type: 'check',
  label: 'colorType',
  defaultValue: 'single',
  options: [
    {
      key: 'singleColor',
      value: 'single',
    },
    {
      key: 'gradientColor',
      value: 'gradient',
    },
    {
      key: 'themeColor',
      value: 'theme',
    },
    // {
    //   key: 'listColor',
    //   value: 'list',
    // },
  ],
  defalltAction({parent, value}) {
    parent.singleColor.setVisible(value === 'single')
    parent.gradientColor.setVisible(value === 'gradient')
    parent.themeColor.setVisible(value === 'theme')
  },
}

// 单色
const singleColor = {
  type: 'color',
  label: 'singleColor',
  defaultValue: 'transparent',
}

// 渐变
const colorGradient = {
  type: 'gradient',
  label: 'gradientColor',
  defaultValue: ['#00D8FF', '#007EFF'],
}
const gradientColor = {
  type: 'gradient',
  label: 'gradientColor',
  defaultValue: ['#00D8FF', '#007EFF'],
}

// 颜色列表
const listColor = {
  type: 'colorList',
  label: 'listColor',
  defaultValue: ['#007EFF'],
}

/**
 * =====================================
 * column
 * =====================================
 */

// 普通字段
const column = {
  type: 'columnSelect',
  label: 'column',
}

// 经度字段
const longitudeColumn = {
  type: 'columnSelect',
  label: 'longitude',
}

// 维度字段
const latitudeColumn = {
  type: 'columnSelect',
  label: 'latitude',
}

// X轴
const xColumn = {
  type: 'columnSelect',
  label: 'xAxis',
}

// Y轴
const yColumn = {
  type: 'columnSelect',
  label: 'yAxis',
}

/**
 * =====================================
 * gis
 * =====================================
 */

// gis中心点坐标
const gisCenterCoordinate = {
  type: 'multiNumber',
  label: 'centerCoordinate',
  // 默认杭州
  defaultValue: [120.19, 30.26],
}

// gis缩放系数
const gisZoom = {
  type: 'number',
  label: 'zoom',
  defaultValue: 12,
  min: 1,
  max: 24,
  step: 0.1,
  hasSlider: true,
}

// gis倾斜角度
const gisPitch = {
  type: 'number',
  label: 'pitch',
  defaultValue: 45,
  min: 0,
  max: 60,
  step: 1,
  hasSlider: true,
}

// gis旋转角度
const gisBearing = {
  type: 'number',
  label: 'bearing',
  defaultValue: 0,
  step: 1,
}

// gis单位
const gisUnit = {
  type: 'check',
  label: 'unit',
  defaultValue: 'hover',
  options: [
    {key: 'meter', value: 'meter'},
    {key: 'px', value: 'px'},
  ],
}

/**
 * =====================================
 * text
 * =====================================
 */

// 名称
const name = {
  type: 'text',
  label: 'name',
  defaultValue: '',
}

// URL
const url = {
  type: 'text',
  label: 'url',
  defaultValue: '',
}

// 内容
const content = {
  type: 'text',
  label: 'content',
  defaultValue: '',
}

// 字号
const textSize = {
  type: 'number',
  label: 'textSize',
  defaultValue: 12,
  min: 4,
  max: 200,
  step: 1,
  hasSlider: true,
}

// 字重
const textWeight = {
  type: 'check', // 待确认
  label: 'textWeight',
  defaultValue: 200,
  options: [
    {key: '1', value: 100},
    {key: '2', value: 200},
    {key: '3', value: 300},
    {key: '4', value: 400},
    {key: '5', value: 500},
    {key: '6', value: 600},
    {key: '7', value: 700},
  ],
}

// 文字方向
const direction = {
  type: 'check',
  label: 'direction',
  defaultValue: 'horizontal',
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

/**
 * =====================================
 * number
 * =====================================
 */

// 千分位
const thousandDiv = {
  type: 'switch',
  label: 'thousandDiv',
  defaultValue: false,
}

// 百分比
const percentage = {
  type: 'switch',
  label: 'percentage',
  defaultValue: false,
}

// 小数位数
const decimalPlaces = {
  type: 'check',
  label: 'decimalPlaces',
  defaultValue: 0,
  options: [
    {
      key: '0',
      value: 0,
    },
    {
      key: '1',
      value: 1,
    },
    {
      key: '2',
      value: 2,
    },
    {
      key: '3',
      value: 3,
    },
    {
      key: '4',
      value: 4,
    },
    {
      key: '5',
      value: 5,
    },
    {
      key: '6',
      value: 6,
    },
    {
      key: '7',
      value: 7,
    },
  ],
}

/**
 * =====================================
 * line
 * =====================================
 */

// 线宽
const lineWidth = {
  type: 'number',
  label: 'lineWidth',
  defaultValue: 1,
  min: 1,
  max: 10,
  step: 1,
}

// 线样式
const lineCurve = {
  type: 'select',
  label: 'lineCurve',
  defaultValue: 'curveLinear',
  options: [
    {
      key: 'Linear',
      value: 'curveLinear',
    },
    {
      key: 'Natural',
      value: 'curveNatural',
    },
    {
      key: 'Step',
      value: 'curveStep',
    },
    {
      key: 'BumpX',
      value: 'curveBumpX',
    },
    {
      key: 'BumpY',
      value: 'curveBumpY',
    },
    {
      key: 'MonotoneX',
      value: 'curveMonotoneX',
    },
  ],
}

// 线光滑
const lineSmooth = {
  type: 'switch',
  label: 'lineSmooth',
  defaultValue: true,
}

// 线缺省
const lineFallback = {
  type: 'select',
  label: 'lineFallback',
  defaultValue: 'break',
  options: [
    {
      key: 'Zero',
      value: 'zero',
    },
    {
      key: 'Continue',
      value: 'continue',
    },
    {
      key: 'Break',
      value: 'break',
    },
  ],
}

/**
 * =====================================
 * range
 * =====================================
 */

// 数值范围
const numberRange = {
  type: 'numberRange',
  label: 'numberRange',
  defaultValue: [0, 20],
}

// 时间范围 暂不做

/**
 * =====================================
 * special
 * =====================================
 */

// 约束
const constraint = {
  type: 'constraint',
  label: 'constraint',
  // 上右下左宽高
  default: [false, false, false, false, true, true],
}

// 填充方式
const fillType = {
  type: 'check',
  label: 'fillType',
  defaultValue: 'shortEdgeFill',
  options: [
    {
      key: 'shortEdgeFill',
      value: 'shortEdgeFill',
    },
    {
      key: 'longEdgeFill',
      value: 'longEdgeFill',
    },
    {
      key: 'StretchFill',
      value: 'StretchFill',
    },
  ],
}

/**
 * =====================================
 * 比例尺类配置
 * =====================================
 */

// 刻度数量
const tickCount = {
  type: 'number',
  label: 'tickCount',
  defaultValue: 5,
  min: 1,
  max: 10,
  step: 1,
  hasSlider: true,
}

// 刻度是否包含0
const tickZero = {
  type: 'switch',
  label: 'tickZero',
  defaultValue: false,
}

// 比例尺内边距
const paddingInner = {
  type: 'number',
  label: 'tickCount',
  defaultValue: 0.3,
  min: 0,
  max: 1,
  step: 0.1,
  hasSlider: true,
}

export default {
  // 偏移
  offset,
  // 间隔,
  gap,
  // 模糊
  blur,
  // 透明度
  opacity,
  // 相对位置
  relativePosition,
  // 局部位置
  layoutPosition,
  // 坐标位置
  xyPosition,
  // 锚点
  anchor,
  // 角度
  angle,
  // 触发事件类型
  eventType,
  // 缺失
  missing,
  // 宽度
  width,
  // 高度
  height,
  // 尺寸
  size,
  // 尺寸(宽高)
  areaSize,
  // 颜色类型
  colorType,
  // 颜色单色
  singleColor,
  // 颜色渐变
  colorGradient,
  gradientColor,
  // 颜色列表
  listColor,
  // 普通字段
  column,
  // 经度
  longitudeColumn,
  // 纬度
  latitudeColumn,
  // X轴
  xColumn,
  // Y轴
  yColumn,
  // gis中心点坐标
  gisCenterCoordinate,
  // gis缩放系数
  gisZoom,
  // gis倾斜角度
  gisPitch,
  // gis旋转角度
  gisBearing,
  // gis单位
  gisUnit,
  // 名称
  name,
  // URL
  url,
  // 内容
  content,
  // 字号
  textSize,
  // 字重
  textWeight,
  // 文字方向
  direction,
  // 千分位
  thousandDiv,
  // 百分比
  percentage,
  // 小数位数
  decimalPlaces,
  // 线宽
  lineWidth,
  // 线样式
  lineCurve,
  // 线光滑
  lineSmooth,
  // 线缺省
  lineFallback,
  // 数值范围
  numberRange,
  // 约束
  constraint,
  // 填充方式
  fillType,
  // 刻度线数量
  tickCount,
  // 包含零刻度
  tickZero,
  // 比例尺内边距
  paddingInner,
}
