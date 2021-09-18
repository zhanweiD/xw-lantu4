/**
 * =====================================
 * common
 * =====================================
 */

// 文本
const text = {
  name: 'text',
  fields: [
    {
      name: 'textSize',
    },
    {
      name: 'textWeight',
    },
    {
      name: 'colorSingle',
      //
    },
    {
      name: 'opacity',
    },
    {
      name: 'textDirection',
    },
    {
      name: 'offset',
    },
    {
      name: 'relativePosition',
    },
    {
      name: 'anchor',
    },
    {
      name: 'angle',
    },
    {
      name: 'colorGradient',
    },
  ],
}

// 阴影
const shadow = {
  fields: [
    {
      name: 'colorSingle',
    },
    {
      name: 'opacity',
    },
    {
      name: 'offset',
    },
    {
      name: 'blur',
    },
  ],
}

// 格式化
const format = {
  fields: [
    {
      name: 'thousandDiv',
    },
    {
      name: 'percentage',
    },
    {
      name: 'decimalPlaces',
    },
  ],
}

// 标签
const label = {
  name: 'label',
  sections: [
    {
      name: 'text',
    },
    {
      name: 'shadow',
    },
    {
      name: 'format',
    },
  ],
}

// 面积
const area = {
  name: 'area',
  // 如果有effective属性，且值为布尔，则该section可以整体切换是否生效
  effective: false,
  fields: [
    {
      name: 'colorSingle',
    },
    {
      name: 'opacity',
    },
  ],
}

// 线
const line = {
  name: 'line',
  fields: [
    {
      name: 'colorSingle',
    },
    {
      name: 'opacity',
    },
    {
      name: 'lineWidth',
    },
    {
      name: 'lineCurve',
    },
  ],
}

// 填充
const fill = {
  name: 'fill',
  fields: [
    {
      name: 'colorSingle',
    },
    {
      name: 'opacity',
    },
  ],
}

// 描边
const stroke = {
  name: 'stroke',
  fields: [
    {
      name: 'colorSingle',
    },
    {
      name: 'lineWidth',
    },
  ],
}

// 点
const point = {
  name: 'line',
  fields: [
    {
      name: 'size',
    },
    {
      name: 'relativePosition',
    },
  ],
  sections: [
    {
      name: 'fill',
    },
    {
      name: 'stroke',
    },
  ],
}

// 标题基础
const titleBase = {
  name: 'titleBase',
  fields: [
    {
      name: 'content',
    },
  ],
}

/**
 * =====================================
 * gis
 * =====================================
 */

// 点坐标
const pointCoordinate = {
  name: 'pointCoordinate',
  fields: [
    {
      name: 'columnLongitude',
    },
    {
      name: 'columnLatitude',
    },
  ],
}

// 起点坐标
const startPointCoordinate = Object.assign({}, pointCoordinate, {
  name: 'startPointCoordinate',
})

// 终点坐标
const endPointCoordinate = Object.assign({}, pointCoordinate, {
  name: 'endPointCoordinate',
})

// 摄像机镜头
const cameraViewport = {
  name: 'viewport',
  fields: [
    {
      name: 'gisCenterCoordinate',
    },
    {
      name: 'gisZoom',
    },
    {
      name: 'gisPitch',
    },
    {
      name: 'gisBearing',
    },
  ],
}

const base = {
  name: 'base',
  fields: [
    {
      name: 'size',
    },
    {
      name: 'position',
    },
    {
      name: 'offset',
    },
  ],
}
export default {
  // 文本
  text,
  // 阴影
  shadow,
  // 格式化
  format,
  // 标签
  label,
  // 面积
  area,
  // 线
  line,
  // 填充
  fill,
  // 描边
  stroke,
  // 点
  point,
  // 标题基础
  titleBase,
  // 点坐标
  pointCoordinate,
  // 起点坐标
  startPointCoordinate,
  // 终点坐标
  endPointCoordinate,
  // 摄像机镜头
  cameraViewport,
  base,
}
