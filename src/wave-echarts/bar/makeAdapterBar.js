/* eslint-disable no-unused-vars */

const setOptionData = (options) => {
  const {title, dimension, data, layers, themeColors} = options
  const {getOption: titleGetOption} = title
  const dataSource = [...data]
  const [first = []] = dataSource

  const legendData = first.length ? [...first].splice(1, first.length) : []

  const series = legendData.map((item) => {
    const [layer] = layers
    const {getOption} = layer
    return {
      type: 'bar',
      name: item,
      lineStyle: {
        // 可配参数
        width: getOption('line.lineWidth'),
      },
      smooth: getOption('line.lineSmooth'),
      symbol: 'circle',
      // 可配参数
      symbolSize: getOption('point.size'),
      // 可配参数
      label: {
        show: true,
        color: '#fff',
        textShadowColor: '#000',
        textShadowBlur: 2,
        textShadow: true,
      },
    }
  })

  const layoutPosition = {
    topLeft: {left: 'left', top: 'top'},
    topCenter: {left: 'center', top: 'top'},
    topRight: {left: 'right', top: 'top'},
    middleLeft: {left: 'left', top: 'middle'},
    middleCenter: {left: 'center', top: 'middle'},
    middleRight: {left: 'right', top: 'middle'},
    bottomLeft: {left: 'left', top: 'bottom'},
    bottomCenter: {left: 'center', top: 'bottom'},
    bottomRight: {left: 'right', top: 'bottom'},
  }
  const titlePosition = layoutPosition[titleGetOption('base.layoutPosition') || 'topLeft']
  const titleShadow = titleGetOption('shadow.effective')
    ? {
        shadowColor: titleGetOption('shadow.singleColor'),
        shadowOffsetX: titleGetOption('shadow.offset')[0],
        shadowOffsetY: titleGetOption('shadow.offset')[1],
      }
    : {}

  const option = {
    // 全局可配参数
    color: themeColors,
    title: {
      // show: titleGetOption('base.effective'),
      text: titleGetOption('base.content'),
      //  水平位置 left | center | right
      //  垂直位置 top | middle | bottom
      // left: 'center',
      // top: 'top',
      ...titlePosition,
      textStyle: {
        color: titleGetOption('text.singleColor'),
        fontWeight: titleGetOption('text.textWeight'),
        opacity: titleGetOption('text.opacity'),
        fontSize: titleGetOption('text.textSize'),
      },
      // 文字阴影
      ...titleShadow,
    },
    // 图例
    legend: {
      data: legendData,
    },
    // TODO 对接面板
    grid: {
      right: 2,
      top: 60,
      bottom: 30,
      left: 60,
    },
    dataset: {
      source: data,
    },
    backgroundColor: 'transparent',
    xAxis: {
      type: 'category',
    },

    yAxis: {
      type: 'value',
    },
    series,
  }
  return option
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
