import createExhibitAdapter from '@exhibit-collection/exhibit-adapter-creater'

const Adapter = () =>
  createExhibitAdapter({
    // 初始化组件实例
    init({options}) {
      console.log('🚗 init', options)

      const {container, dimension, data, layers, themeColors} = options

      const chart = echarts.init(container, 'dark', {
        renderer: 'svg',
      })

      const series = layers.map((layer) => {
        const {getOption} = layer

        return {
          type: 'line',
          encode: {
            // // 可配维度
            x: dimension.columnX[0],
            y: getOption('data.column'),
          },
          lineStyle: {
            // 可配参数
            width: getOption('line.lineWidth'),
          },
          // 可配参数
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

      const option = {
        // 全局可配参数
        color: themeColors,
        // TODO 对接面板
        grid: {
          right: 2,
          top: 30,
          bottom: 30,
          left: 60,
        },
        dataset: {
          source: data,
        },
        backgroundColor: 'transparent',
        xAxis: {
          type: 'category',
          axisLabel: {
            // TODO 对接面板
            fontSize: 12,
          },
          axisTick: {
            show: true,
            alignWithLabel: true,
            lineStyle: {
              color: '#ccc',
            },
          },
          // 主轴线
          axisLine: {
            lineStyle: {
              // TODO 对接面板
              color: '#ccc',
            },
          },
        },

        // 这个去掉会报错
        yAxis: {
          // 分割线
          splitLine: {
            show: true,
            lineStyle: {
              // TODO 对接面板
              color: 'rgba(255, 255, 255, 0.3)',
              type: [3, 5],
            },
          },
        },
        series,
      }

      chart.setOption(option)
      return chart
    },

    // 处理包括数据、样式等变更
    update({instance, options, updatedData, updatedDimension, updatedLayer, action}) {
      console.log('🚗 update')
      console.log({instance, options, updatedData, updatedDimension, updatedLayer, action})
      // updateWave(options)
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

export default Adapter
