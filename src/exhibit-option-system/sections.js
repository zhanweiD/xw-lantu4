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
      // isAdvance: true,
    },
    {
      name: 'opacity',
    },
    {
      name: 'textDirection',
      isAdvance: true,
    },
    {
      name: 'offset',
      isAdvance: true,
    },
    {
      name: 'relativePosition',
      isAdvance: true,
    },
    {
      name: 'anchor',
      isAdvance: true,
    },
    {
      name: 'angle',
      isAdvance: true,
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
      isAdvance: true,
    },
    {
      name: 'decimalPlaces',
      isAdvance: true,
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
      isAdvance: true,
    },
    {
      name: 'format',
      isAdvance: true,
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
      isAdvance: true,
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
  sections: [
    {
      name: 'fill',
    },
    {
      name: 'stroke',
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
      name: 'columnLangitude',
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

export default {
  // 文本
  text,
  // 阴影
  shadow,
  // 格式化
  format,
  // 标签
  label,
  // 线
  line,
  // 填充
  fill,
  // 描边
  stroke,
  // 点
  point,
  // 点坐标
  pointCoordinate,
  // 起点坐标
  startPointCoordinate,
  // 终点坐标
  endPointCoordinate,
  // 摄像机镜头
  cameraViewport,
}
