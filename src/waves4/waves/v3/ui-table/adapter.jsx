import createExhibitAdapter from '@exhibit-collection/exhibit-adapter-creater'
import MyTable from '@wavesSrc/ui-table'

import translate from './translate'

const Adapter = () =>
  createExhibitAdapter({
    // 初始化
    init({options}) {
      const myTable = MyTable.create({})
      const translatedOptions = translate(options)
      // 初始化模型
      myTable.init(translatedOptions, {})
      myTable.data(translatedOptions, {})
      myTable.draw({
        redraw: true,
      })
      return myTable
    },

    // 处理包括数据、样式等变更
    update({options}) {
      try {
        const myTable = MyTable.create()
        const translatedOptions = translate(options)
        // 初始化模型
        myTable.init(translatedOptions, {})
        myTable.data(translatedOptions, {})
        myTable.draw({
          redraw: true,
        })
      } catch (error) {
        console.error('图层配置解析错误，更新失败', error)
      }
    },

    // 销毁
    destroy({instance}) {
      instance.destroy()
    },

    // 任何错误的处理
    warn({instance, warn}) {
      instance.warn(warn)
    },
  })

export default Adapter
