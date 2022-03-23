// type文档：https://dtwave.yuque.com/waveview/levoxx/eo63xo
// NOTE: 这个文件内只定义最新版的配置体系，不包含向后兼容的映射
// TODO:
// - 向后兼容的设计
// - 相对位置的图标

// gis
// 相机位置
const origin = {
  type: 'multiNumber',
  label: 'origin',
  defaultValue: [120.14857128194079, 30.251288234866852, 10000],
  items: [
    {
      key: '经度',
      step: 1,
    },
    {
      key: '纬度',
      step: 1,
    },
    {
      key: '海拔',
      step: 1,
    },
  ],
}
// 相机角度
const viewport = {
  type: 'multiNumber',
  label: 'viewport',
  defaultValue: [0, -90, 0],
  items: [
    {
      key: '偏航角(Y)',
      step: 1,
    },
    {
      key: '俯仰角(X)',
      step: 1,
    },
    {
      key: '翻滚角(Z)',
      step: 1,
    },
  ],
}
// const gisBackground = {
//   type: 'color',
//   label: 'gisBackground',
//   defaultValue: 'rgba(0,0,0,1)',
// }
const sceneMode = {
  type: 'check',
  label: 'sceneMode',
  defaultValue: 'SCENE3D',
  options: [
    {
      key: '3D',
      value: 'SCENE3D',
    },
    {
      key: '2D',
      value: 'PLANAR3D',
    },
  ],
}
const showMask = {
  type: 'switch',
  label: 'showMask',
  defaultValue: true,
}
const viewFixed = {
  type: 'switch',
  label: 'viewFixed',
  defaultValue: false,
}
const coordinateAcquisitionResult = {
  type: 'text',
  label: 'coordinateAcquisitionResult',
  defaultValue: ' ',
  // hasSlider: true,
}
const snow = {
  type: 'switch',
  label: 'snow',
  defaultValue: false,
}
const rain = {
  type: 'switch',
  label: 'rain',
  defaultValue: false,
}
const elevation = {
  type: 'text',
  label: 'elevation',
  defaultValue: ' ',
  // hasSlider: true,
}
const layerName = {
  type: 'text',
  label: 'layerName',
  defaultValue: ' ',
  // hasSlider: true,
}

const mapService = {
  type: 'switch',
  label: 'mapService',
  defaultValue: false,
}
const gisTheme = {
  type: 'select',
  label: 'gisTheme',
  defaultValue: 'blue',
  options: [
    {
      key: '蓝色',
      value: 'blue',
    },
    {
      key: '黑色',
      value: 'black',
    },
  ],
}

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

// padding
const padding = {
  type: 'multiNumber',
  label: 'padding',
  defaultValue: [40, 40, 40, 40],
  items: [
    {
      key: '上',
      step: 1,
    },
    {
      key: '右',
      step: 1,
    },
    {
      key: '下',
      step: 1,
    },
    {
      key: '左',
      step: 1,
    },
  ],
}

// show
const show = {
  type: 'switch',
  label: 'show',
  defaultValue: true,
}

// 区域偏移
const areaOffset = {
  type: 'offset',
  defaultValue: [0, 0, 0, 0],
}

// 间隔
const gap = {
  type: 'number',
  label: 'gap',
  defaultValue: 0,
}

// 内外间隔
// TODO 不通用
const gap2 = {
  type: 'multiNumber',
  label: 'gap',
  defaultValue: [0, 0],
  items: [
    {
      key: 'in',
      step: 1,
    },
    {
      key: 'out',
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
  defaultValue: 'singleColor',
  options: [
    {
      key: 'singleColor',
      value: 'singleColor',
    },
    {
      key: 'gradientColor',
      value: 'gradientColor',
    },
    // {
    //   key: 'themeColor',
    //   value: 'theme',
    // },
    // {
    //   key: 'listColor',
    //   value: 'list',
    // },
  ],
  // Action({siblings, value}) {
  //   siblings.singleColor.setEffective(value === 'singleColor')
  //   siblings.gradientColor.setEffective(value === 'gradientColor')
  //   // siblings.themeColor.setEffective(value === 'themeColor')
  // },
  action({siblings, value}) {
    // console.log('field action', siblings, value)
    siblings.singleColor.setEffective(value === 'singleColor')
    siblings.gradientColor.setEffective(value === 'gradientColor')
    // siblings.themeColor.setEffective(value === 'themeColor')
  },
}

// 单色
const singleColor = {
  type: 'color',
  label: 'singleColor',
  defaultValue: 'transparent',
}
// 边框宽度
const borderWidth = {
  type: 'number',
  label: 'borderWidth',
  defaultValue: 2,
}
// 边框颜色
const borderColor = {
  type: 'color',
  label: 'borderColor',
  defaultValue: 'rgb(255, 255, 255)',
}
// 背景色
const backgroundColor = {
  type: 'color',
  label: 'backgroundColor',
  defaultValue: 'rgb(0, 119, 255)',
}

// NOTE 将删除
const colorSingle = {
  type: 'color',
  label: 'singleColor',
  defaultValue: 'transparent',
}

// 渐变
const gradientColor = {
  type: 'gradient',
  label: 'gradientColor',
  defaultValue: ['#00D8FF', '#007EFF'],
}

// NOTE 将删除
const colorGradient = {
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
  label: 'dataColumn',
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
      key: 'zeroFallback',
      value: 'zero',
    },
    {
      key: 'continueFallback',
      value: 'continue',
    },
    {
      key: 'breakFallback',
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

// 填充模式
const fillMode = {
  type: 'check',
  label: 'fillMode',
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
      key: 'stretchFill',
      value: 'stretchFill',
    },
  ],
}

// 宽度适配
const widthAdaption = {
  type: 'check',
  label: 'width',
  defaultValue: 'zoomToScreenWidth',
  options: [
    {
      key: 'zoomToScreenWidth',
      value: 'zoomToScreenWidth',
    },
    {
      key: 'scrollHorizontal',
      value: 'scrollHorizontal',
    },
  ],
}

// 高度适配
const heightAdaption = {
  type: 'check',
  label: 'height',
  defaultValue: 'zoomToScreenHeight',
  options: [
    {
      key: 'zoomToScreenHeight',
      value: 'zoomToScreenHeight',
    },
    {
      key: 'scrollVertical',
      value: 'scrollVertical',
    },
  ],
}

// 宽度适配
// const widthAdaption = {
//   type: 'switch',
//   label: 'screenAdaption',
//   defaultValue: true,
// }

// 密码
const password = {
  type: 'password',
  label: 'password',
}

// 图片混合模式
const blendMode = {
  type: 'select',
  label: 'blendMode',
  defaultValue: 'normal',
  options: [
    {
      key: 'normal',
      value: 'normal',
    },
    {
      key: 'multiply',
      value: 'multiply',
    },
    {
      key: 'screen',
      value: 'screen',
    },
    {
      key: 'overlay',
      value: 'overlay',
    },
    {
      key: 'darken',
      value: 'darken',
    },
    {
      key: 'lighten',
      value: 'lighten',
    },
    {
      key: 'color-dodge',
      value: 'color-dodge',
    },
    {
      key: 'color-burn',
      value: 'color-burn',
    },
    {
      key: 'hard-light',
      value: 'hard-light',
    },
    {
      key: 'soft-light',
      value: 'soft-light',
    },
    {
      key: 'difference',
      value: 'difference',
    },
    {
      key: 'exclusion',
      value: 'exclusion',
    },
    {
      key: 'hue',
      value: 'hue',
    },
    {
      key: 'saturation',
      value: 'saturation',
    },
    {
      key: 'color',
      value: 'color',
    },
    {
      key: 'luminosity',
      value: 'luminosity',
    },
  ],
}

/**
 * =====================================
 * 坐标轴和比例尺类配置
 * =====================================
 */

// 绑定主轴或副轴
const axisBinding = {
  type: 'check',
  label: 'axisBinding',
  defaultValue: 'main',
  options: [
    {
      key: 'mainAxis',
      value: 'main',
    },
    {
      key: 'minorAxis',
      value: 'minor',
    },
  ],
}

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

// 比例尺内边距比值
const paddingInner = {
  type: 'number',
  label: 'paddingInner',
  defaultValue: 0.3,
  min: 0,
  max: 1,
  step: 0.1,
  hasSlider: true,
}

const echartsoption = {
  type: 'echartsoption',
  label: 'echartsoption',
}

// 内半径
const innerRadius = {
  type: 'number',
  label: 'innerRadius',
  defaultValue: 30,
  min: 0,
  hasSlider: true,
}

// 散点图，散点大小
const pointSize = {
  type: 'multiNumber',
  label: 'pointSize',
  defaultValue: [10, 10],
}

// 圆角
const borderRadius = {
  type: 'number',
  label: 'borderRadius',
  defaultValue: 10,
}

/**
 * =====================================
 * 段落
 * =====================================
 */
const textarea = {
  type: 'textarea',
  label: 'content',
  defaultValue: '',
}

// 关键词颜色
const keywordColor = {
  type: 'color',
  label: 'keywordColor',
  defaultValue: 'rgba(0, 255, 255, 1)',
}

// 关键词字重
const keywordFontWeight = {
  type: 'check',
  label: 'keywordFontWeight', // 影响显示的名称
  defaultValue: 400,
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

// 是否应用关键词大小
const hasKeywordFontSize = {
  type: 'switch',
  label: 'hasKeywordFontSize',
  defaultValue: false,
}

// 关键词大小
const keywordFontSize = {
  type: 'number',
  label: 'keywordFontSize',
  defaultValue: 14,
  min: 4,
  max: 200,
  step: 1,
  hasSlider: true,
}

// 首行缩进
const textIndent = {
  type: 'number',
  label: 'textIndent',
  defaultValue: 0,
}

// 行高
const lineHeight = {
  type: 'number',
  label: 'lineHeight',
  min: 0,
}

// 对齐
const textAlign = {
  type: 'check',
  label: 'textAlign',
  defaultValue: 'left',
  options: [
    {
      key: 'L',
      value: 'left',
    },
    {
      key: 'C',
      value: 'center',
    },
    {
      key: 'R',
      value: 'right',
    },
  ],
}

// 段间距
const paragraphMargin = {
  type: 'number',
  label: 'paragraphMargin',
  min: 0,
}

// 刻度文字
const tickSize = {
  type: 'number',
  label: 'tickSize',
  defaultValue: 10,
  min: 0,
  max: 50,
}

// 标签偏移
const labelOffset = {
  type: 'number',
  label: 'labelOffset',
  defaultValue: 5,
  min: 0,
  max: 50,
}

// 圆大小
const circleSize = {
  type: 'number',
  label: 'circleSize',
  defaultValue: 10,
}

// 桑基图对齐
const sankeyAlign = {
  type: 'check',
  label: 'sankeyAlign',
  defaultValue: 'middle',
  options: [
    {key: '上', value: 'start'},
    {key: '中', value: 'middle'},
    {key: '下', value: 'end'},
  ],
}
// 节点线宽
const nodeWidth = {
  type: 'number',
  label: 'nodeWidth',
  defaultValue: 10,
}
// 节点间距
const nodeGap = {
  type: 'number',
  label: 'nodeGap',
  defaultValue: 10,
}

export default {
  echartsoption,
  // 偏移
  offset,
  padding,
  areaOffset,
  // 间隔,
  gap,
  // 内外间隔
  gap2,
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
  colorSingle,
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
  // 填充模式
  fillMode,
  // 宽度自适应
  widthAdaption,
  // 高度自适应
  heightAdaption,
  // 密码
  password,
  // 图片混合模式
  blendMode,
  // 绑定主轴或副轴
  axisBinding,
  // 刻度线数量
  tickCount,
  // 包含零刻度
  tickZero,
  // 比例尺内边距
  paddingInner,
  // 内半径
  innerRadius,
  // 散点大小
  pointSize,
  // 段落
  textarea,
  // 关键词颜色
  keywordColor,
  // 关键词字重
  keywordFontWeight,
  // 是否应用关键词大小
  hasKeywordFontSize,
  // 关键词大小
  keywordFontSize,
  // 首行缩进
  textIndent,
  // 行高
  lineHeight,
  // 对齐
  textAlign,
  // 段间距
  paragraphMargin,
  // 刻度线长度
  tickSize,
  // 大小圆大小
  circleSize,
  // 文字偏移
  labelOffset,
  // 桑基图对齐
  sankeyAlign,
  nodeWidth,
  nodeGap,
  // 圆角大小
  borderRadius,
  show,
  backgroundColor,
  borderColor,
  borderWidth,
  // gis
  origin,
  viewport,
  sceneMode,
  showMask,
  viewFixed,
  coordinateAcquisitionResult,
  snow,
  rain,
  elevation,
  layerName,
  mapService,
  gisTheme,
}
