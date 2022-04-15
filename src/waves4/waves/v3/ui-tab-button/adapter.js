import createExhibitAdapter from '@exhibit-collection/exhibit-adapter-creater'
import MTabButton from '@wavesSrc/ui-tab-button'
// import translate from './translate'

/**
 * 标准二维表数据额格式转换为非标准数据格式
 * @param {object} data
 */
function tableListToBadData(data) {
  const labels = data[0]
  return data.slice(1).map((item) => {
    const valueObject = {}
    labels.forEach((name, i) => {
      valueObject[name] = item[i]
    })
    return valueObject
  })
}

/**
 * react hook 组件适配器
 */
const Adapter = () =>
  createExhibitAdapter({
    // 初始化
    init({options, event}) {
      const mTabButton = MTabButton.create({options: tableListToBadData(options.data)})
      // 初始化模型
      mTabButton.init(options, {})
      mTabButton.draw({
        redraw: false,
      })
      mTabButton.event.on('onSwitchButton', ({data}) => {
        console.log(data)
        event.fire('tabChange')
      })
      return mTabButton
    },

    // 配置组件数据
    update({instance}) {
      instance.draw({
        redraw: true,
      })
    },

    // /**
    //  * 非标准数据格式转换为标准二维表数据额格式
    //  * @param {object} data
    //  */
    // badDataToTableList(data) {
    //   const labels = Object.keys(data[0])
    //   const values = data.map(item => {
    //     return labels.map(name => item[name])
    //   })
    //   return [labels, values]
    // },

    // 如果组件有销毁函数，就调用
    destroy({instance}) {
      instance.destroy()
    },

    // 任何错误的处理
    warn({instance, warn}) {
      instance.warn(warn)
    },
  })

export default Adapter
