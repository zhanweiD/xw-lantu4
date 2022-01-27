/* eslint-disable no-unused-vars */
import createExhibitAdapter from '@exhibit-collection/exhibit-adapter-creater'

import hJSON from 'hjson'
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
  } else {
    echartsOptions.dataset = {
      source: data,
    }
  }
  return echartsOptions
  // series
}

// eslint-disable-next-line no-unused-vars
const makeAdapter = ({k}) => {
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
