import createExhibitAdapter from '@exhibit-collection/exhibit-adapter-creater'

const Adapter = () =>
  createExhibitAdapter({
    // 初始化组件实例
    init(options) {
      console.log('adapter init')
      console.log(options)

      // const style = util.mapOptions(options.layers[0], {
      //   'font.size': 'lable.text.textSize',
      // })

      // style.font.size

      // const a = new A({
      //   fontSize: options.get('label.text.xxxx'),
      // })

      const {container} = options

      // based on prepared DOM, initialize echarts instance
      const chart = echarts.init(container, 'dark')

      // specify chart configuration item and data
      const option = {
        backgroundColor: 'transparent',
        // title: {
        //   text: 'ECharts entry example',
        // },
        tooltip: {},
        legend: {
          data: ['Sales'],
        },
        xAxis: {
          data: ['shirt', 'cardign', 'chiffon shirt', 'pants', 'heels', 'socks'],
        },
        yAxis: {},
        series: [
          {
            name: 'Sales',
            type: 'line',
            data: [5, 20, 36, 10, 10, 20],
          },
        ],
      }

      chart.setOption(option)
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
