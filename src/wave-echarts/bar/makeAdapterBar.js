/* eslint-disable no-unused-vars */

const setOptionData = (options) => {
  const {title, dimension, data, layers, themeColors} = options
  const dataSource = [...data]
  const [first = []] = dataSource

  const legendData = first.length ? [...first].splice(1, first.length) : []

  const [layer] = layers
  const {getOption} = layer
  const series = getOption('echartsoption')
  return JSON.parse(series)
}

// eslint-disable-next-line no-unused-vars
const makeAdapterBar = ({k, createExhibitAdapter}) => {
  return createExhibitAdapter({
    // 初始化组件实例
    init({options, pathable}) {
      console.log(options, 'options')
      const {container, height, width} = options
      const chart = echarts.init(container, 'dark', {renderer: 'svg', height, width})
      const option = setOptionData(options)
      chart.setOption(option)
      return chart
    },

    // 处理包括数据、样式等变更
    update({instance, options, action, updated}) {
      // console.log('🚗 update', {
      //   // instance,
      //   // options,
      //   // action,
      //   updated,
      // })
      const option = setOptionData(options)
      instance.setOption(option)
      // console.log(instance,'ins')
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

export default makeAdapterBar
