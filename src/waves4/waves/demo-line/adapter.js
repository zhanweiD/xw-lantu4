import createExhibitAdapter from '@exhibit-collection/exhibit-adapter-creater'

const Adapter = () =>
  createExhibitAdapter({
    // 初始化组件实例
    init(options) {
      // console.log('adapter init')
      // console.log(options)

      const {container, data, layers} = options

      const chart = echarts.init(container, 'dark', {
        renderer: 'svg',
      })

      const series = layers.map((layer) => {
        const {options} = layer
        console.log('layer', layer)
        return {
          type: 'line',
          // TODO 对接面板
          encode: {
            x: '成员名称',
            y: '项目交付',
          },
          lineStyle: {
            // TODO 对接面板
            width: 3,
          },
          // TODO 对接面板
          smooth: true,
          symbol: 'circle',
          // TODO 对接面板
          symbolSize: 10,
          label: {
            show: true,
            color: '#fff',
            textShadowColor: '#000',
            textShadowBlur: 2,
          },
        }
      })

      const option = {
        color: ['#d95850', '#eb8146', '#ffb248', '#f2d643', '#ebdba4', '#c4db8a'],
        // TODO 对接面板
        grid: {
          right: 2,
          top: 30,
          bottom: 30,
          left: 60,
        },
        dataset: {
          // NOTE: 临时方案
          source: JSON.parse(data.private),
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
              color: '#ccc',
            },
          },
          // 分割线
          // splitLine: {
          //   show: true,
          //   lineStyle: {
          //     color: '#ffff00',
          //   },
          // },
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
    update(options) {
      console.log('update')
      console.log(options)
      // updateWave(options)
    },

    // 销毁图表实例
    destroy({instance}) {
      instance.destroy()
    },

    // 任何错误的处理
    warn({instance, warn}) {
      instance.warn(warn)
    },
  })

export default Adapter
