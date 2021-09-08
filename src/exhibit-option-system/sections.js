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
      name: 'color',
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
  ],
}

// 阴影
const shadow = {
  fields: [
    {
      name: 'color',
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
  fields: [{name: 'color'}, {name: 'opacity'}, {name: 'lineWeight'}, {name: 'curveType'}],
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
      name: 'langitudeColumn',
    },
    {
      name: 'latitudeColumn',
    },
  ],
}

// 起点坐标
const startPointCoordinate = Object.assign({}, pointCoordinate, {name: 'startPointCoordinate'})

// 终点坐标
const endPointCoordinate = Object.assign({}, pointCoordinate, {name: 'endPointCoordinate'})

export default {
  line,
  text,
  shadow,
  format,
  label,
  pointCoordinate,
  startPointCoordinate,
  endPointCoordinate,
}
