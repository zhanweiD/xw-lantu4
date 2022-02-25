/*
 * @file 处理数据相关的一些工具函数 
 */
// import IDataStructure from '../interfaces/idata'
// import {isArray} from './is'

function getSource() {
  return {
    // 数据的完整维度和标签 数据可以不包含维度信息（dimension = []） 如果包含那么一定需要一个有效的维度名称和至少包含一个标签
    dimension: [],
    // 值的描述集合 他的数组索引顺序必须和条目的数值的顺序保持一致
    valueDescription: [],
    // 值的单位集合 他的数组索引顺序必须和条目的数值的顺序保持一致
    valueUnit: [],
    // 每条数据都会有多个值 如果这些值都是数值 那么不同的值是不是应该都有个不同的上限？数值总不能无限大吧？
    // 这个上限的作用主要用作图表数据更新上 他的数组索引顺序必须和条目的数值的顺序保持一致
    // 属性值为键值对 键必须用valueUnit中的单位 不同的单位表示不同值的上限值
    maxValue: {},
    // 去重后的单位
    unit: [],
    // 数据条目集合
    data: [],
  }
}

/**
 * 将数据按照标签归类
 * 归类后可能会出现这么几种情况
 * 1、一个标签可能会出现零条或多条数据
 * 2、有些数据不在任何标签中那么这条数据可能会被过滤
 * @param {IDataStructure} source 源数据
 * @param {boolean}        filter 如果filter为true并且当前标签一条数据都没有那么会删除这个标签
 * @param {boolean}        sum    对标签下的数据条目的数值类型的数据求和
 */
function classify(source, filter = false, sum = true) {
  if (!source.data.length) return

  const dimension = []
  const list = source.data
  
  // 处理维度
  source.dimension.forEach(dim => {
    // eslint-disable-next-line no-underscore-dangle
    const _dim = {
      name: dim.name,
      labels: [],
      obj: {},
    }
    for (let i = 0, l = dim.labels.length; i < l; i += 1) {
      const label = dim.labels[i]
      _dim.labels.push(_dim.obj[label] = {
        label,
        data: [],
        total: sum ? source.valueDescription.map(() => 0) : [],
      })
    }
    dimension.push(_dim)
  })

  // 遍历条目的维度 看其在维度的哪个标签中
  let item = null
  let itemDimensions = null
  let itemValues = null
  let label = null
  let dim = null
  for (let i = 0, l = list.length; i < l; i += 1) {
    item = list[i]
    itemDimensions = item.dimensions

    for (let d = 0, dl = itemDimensions.length; d < dl; d += 1) {
      label = itemDimensions[d]
      dim = dimension[d]
      if (dim && dim.obj[label]) {
        const labelItem = dim.obj[label]
        labelItem.data.push(item)

        // 针对数字类型的值 统计总值
        if (sum) {
          itemValues = item.values
          for (let n = 0; n < itemValues.length; n++) {
            if (typeof itemValues[n] === 'number') {
              labelItem.total[n] += itemValues[n]
            }
          }
        }
      }
    }
  }

  return dimension.map(dim => {
    delete dim.obj
    // 如果filter为true并且当前标签一条数据都没有那么会删除这个标签
    if (filter) {
      const ls = dim.labels
      for (let i = 0; i < ls.length; i++) {
        if (!ls[i].data.length) {
          ls.splice(i, 1)
          i -= 1
        }
      }
    }
    return dim
  })
}

/**
 * 统计源数据中各个单位的最大值
 * 该方法会去重单位 
 * @param {IDataStructure} source 源数据
 * @param {object}         baseValues 初始值
 */
function maxValue(source, base) {
  const baseValues = base || source.maxValue || {}
  const list = source.data
  const {valueUnit} = source
  const vs = {}
  valueUnit.forEach(k => (vs[k] = baseValues[k] || 0))

  let itemValue = null
  let k = null
  for (let i = 0, l = list.length; i < l; i += 1) {
    itemValue = list[i].values
    for (let n = 0, nl = itemValue.length; n < nl; n += 1) {
      k = valueUnit[n]
      vs[k] = Math.max(vs[k], itemValue[n])
    }
  }
  return vs
}

/**
 * 统计经过classify方法处理后的值范围(统计data.total)
 * 准确来讲这个方法统计的是各个标签的值范围
 * @param {IDataStructure} source 源数据
 * @param {array}          datas classify处理后的数据 每个标签应该包含total
 */
function assembleValueRange(datas, source) {
  const baseValues = source.maxValue || {}
  const {valueUnit} = source
  const vs = {}
  valueUnit.forEach(k => {
    vs[k] = [Infinity, baseValues[k] || 0]
  })

  datas.forEach(data => {
    for (let i = 0, l = data.labels.length; i < l; i++) {
      const item = data.labels[i]

      item.total.forEach((value, index) => {
        const u = valueUnit[index]
        const v = vs[u]
        v[0] = Math.min(v[0], value)
        v[1] = Math.max(v[1], value)
      })
    }
  })

  return vs
}

/**
 * 统计每一列数值的最大值
 * 单位不会去重，直接按列统计
 * @param {IDataStructure} source 源数据
 */
function colMaxValue(source) {
  const baseValues = source.maxValue || {}
  const vs = (o => { source.valueUnit.forEach((u, i) => o[i] = baseValues[u] || 0); return o })([])
  let ds = null
  for (let i = source.data.length; i--;) {
    ds = source.data[i].values
    for (let n = 0, l = ds.length; n < l; n++) {
      vs[n] = Math.max(vs[n], ds[n])
    }
  }
  return vs
}

/**
 * 统计源数据中各个单位值的大小范围
 * @param {IDataStructure} source 源数据
 * @param {object}         baseValues 初始值
 */
function range(source, base) {
  const baseValues = base || source.maxValue || {}
  const list = source.data
  const {valueUnit} = source
  const vs = {}
  valueUnit.forEach(k => {
    vs[k] = [null, null]
    vs[k][1] = baseValues[k] === undefined ? null : baseValues[k]
  })

  let itemValue = null
  let k = null
  let max = null
  let min = null
  for (let i = 0, l = list.length; i < l; i += 1) {
    itemValue = list[i].values
    for (let n = 0, nl = itemValue.length; n < nl; n += 1) {
      k = valueUnit[n]
      max = vs[k][1] === null ? itemValue[n] : vs[k][1]
      min = vs[k][0] === null ? itemValue[n] : vs[k][0]

      vs[k][1] = Math.max(max, itemValue[n])
      vs[k][0] = Math.min(min, itemValue[n])
    }
  }
  return vs
}

/**
 * 转换新的数据格式为老的格式
 * @param {string[]} dimensions 维度键
 * @param {values}   values     数值键
 * @param {data}     data       源数据
 */
function transform(dimensions, values, data) {
  dimensions = dimensions.filter(v => !!v)
  const source = getSource()
  const dimensionObj = {}

  let item = null
  let row = null
  let label = ''
  let dimensionKey = ''

  // eslint-disable-next-line no-multi-assign
  const valueKeys = source.valueDescription = [].concat(...values)
  const valueKeyLength = valueKeys.length
  const dimensionLength = dimensions.length
  for (let i = 0, l = data.length; i < l; i++) {
    row = {
      id: i,
      values: [],
      dimensions: [],
    }
    item = data[i]

    // 将label添加到维度中
    for (let n = 0; n < dimensionLength; n++) {
      dimensionKey = dimensions[n]
      dimensionObj[dimensionKey] = dimensionObj[dimensionKey] || {}
      label = item[dimensionKey]
      dimensionObj[dimensionKey][label] = true
      row.dimensions.push(`${label}`)
    }

    // 添加值
    for (let n = 0; n < valueKeyLength; n++) {
      row.values.push(item[valueKeys[n]])
    }
    source.data.push(row)
  }

  // 填充单位
  values.forEach((keys, i) => {
    const unit = `unit-${i}`
    source.unit.push(unit)
    source.valueUnit = source.valueUnit.concat(keys.map(() => unit))
  })

  // 组装维度
  Object.keys(dimensionObj).forEach((d) => {
    source.dimension.push({
      name: d,
      labels: Object.keys(dimensionObj[d]),
    })
  })

  return source
}

// 获取数值类型的值
function getNumber(v, r = 0) {
  return v === null ? r : v
}

// 获取文本类型的值
function getString(v, r = '') {
  return v === null ? r : v
}

export default {
  classify,
  maxValue,
  range,
  colMaxValue,
  getNumber,
  getString,
  assembleValueRange,
  transform,
  getSource,
}
