/* eslint-disable no-unused-vars */

import hJSON from 'hjson'
import _ from 'lodash'

// 平铺结构转为树结构
const arrToTree = (arr, pid) => {
  const res = []
  arr.forEach((item) => {
    if (item[3] === pid) {
      const children = arrToTree(
        arr.filter((v) => v[3] !== pid),
        item[2]
      )
      const currentItem = {
        name: item[0],
        value: item[1],
        id: item[2],
        pid: item[3],
      }
      if (children.length) {
        res.push({...currentItem, children})
      } else {
        res.push({...currentItem})
      }
    }
  })
  return res
}
const setOptionData = (options) => {
  const {title, dimension, data, layers, themeColors} = options
  const dataSource = [...data]
  const [column = []] = dataSource
  const [layer] = layers
  const {getOption} = layer
  const echartsOptions = hJSON.parse(getOption('echartsoption'))
  const {series = []} = echartsOptions
  const type = series?.[0]?.type
  // 目前并非所有图表都支持 dataset。
  // 支持 dataset 的图表有： line、bar、pie、scatter、effectScatter、parallel、candlestick、map、funnel、custom。
  // 当前支持： line、bar、pie、scatter、effectScatter、parallel、candlestick、funnel、custom、radar
  // 雷达图数据处理
  if (type === 'radar') {
    const {radar = {}} = echartsOptions
    const indicator = []
    const radarData = column.length ? [...column].splice(1, column.length).map((el) => ({value: []})) : []
    data?.forEach((el, i) => {
      if (i === 0) return
      el.forEach((_v, _i) => {
        if (_i === 0) {
          indicator.push({name: _v})
          return
        }
        radarData[_i - 1].value.push(_v)
      })
    })
    echartsOptions.radar = {
      ...radar,
      indicator,
    }
    echartsOptions.series[0].data = radarData
  } else if (type === 'boxplot') {
    // boxplot: 盒须图
    const radarData = dataSource.length ? [...dataSource].splice(1, dataSource.length) : []
    echartsOptions.dataset = [
      {
        // prettier-ignore
        source: radarData,
      },
      {
        transform: {
          type: 'boxplot',
          config: {itemNameFormatter: column},
        },
      },
      {
        fromDatasetIndex: 1,
        fromTransformResult: 1,
      },
    ]
  } else if (type === 'heatmap') {
    echartsOptions.series[0].data = data
    return echartsOptions
  } else if (type === 'graph') {
    const graphData = dataSource.length ? [...dataSource].splice(1, dataSource.length) : []
    const nodes = []
    const links = []
    graphData.forEach((v) => {
      nodes.push({id: v[0], name: v[1], symbolSize: v[2]})
      if (v.length > 3) {
        links.push({source: v[3], target: v[4]})
      }
    })
    echartsOptions.series[0].data = _.unionBy(nodes, 'id')
    echartsOptions.series[0].links = links
  } else if (type === 'sankey') {
    const graphData = dataSource.length ? [...dataSource].splice(1, dataSource.length) : []
    const node = []
    const link = []
    graphData.forEach((v) => {
      node.push({id: v[0], name: v[1]})
      if (v.length > 3) {
        link.push({source: v[3], target: v[4], value: v[2]})
      }
    })
    echartsOptions.series[0].data = _.unionBy(node, 'id')
    echartsOptions.series[0].links = link
  } else if (type === 'tree' || type === 'treemap' || type === 'sunburst') {
    const treeData = arrToTree(data, 0)
    echartsOptions.series[0].data = treeData
  } else {
    echartsOptions.dataset = {
      source: data,
    }
  }

  return echartsOptions
}

// eslint-disable-next-line no-unused-vars
const makeAdapter = ({k, createExhibitAdapter}) => {
  return createExhibitAdapter({
    // 初始化组件实例
    init({options, pathable}) {
      // console.log(options, 'options')
      const {container, height, width} = options
      const chart = echarts.init(container, null, {renderer: 'svg', height, width})
      const option = setOptionData(options)
      chart.setOption(option)
      return chart
    },

    // 处理包括数据、样式等变更
    update({instance, options, action, updated}) {
      const option = setOptionData(options)
      instance.setOption(option)
      return instance
    },

    // 销毁图表实例
    destroy({instance}) {
      // echart是dispose方法
      instance.dispose()
      // instance.destroy()
    },

    // 任何错误的处理
    warn({instance, warn}) {
      instance.warn(warn)
    },
  })
}

export default makeAdapter
