import createExhibitAdapter from '@exhibit-collection/exhibit-adapter-creater'
import MPicture from '@wavesSrc/picture-group-scroll'
import translate from './translate'

// eslint-disable-next-line no-unused-vars
const Adapter = (k) =>
  createExhibitAdapter({
    // 初始化
    init({options}) {
      const mPicture = MPicture.create({})
      const translatedOptions = translate(options)
      // 初始化模型
      mPicture.init(translatedOptions, {})
      mPicture.data(translatedOptions, {})
      mPicture.draw({
        redraw: true,
      })
      return mPicture
    },

    // 处理包括数据、样式等变更
    update({options}) {
      try {
        const mPicture = MPicture.create()
        const translatedOptions = translate(options)
        // 初始化模型
        mPicture.init(translatedOptions, {})
        mPicture.data(translatedOptions, {})
        mPicture.draw({
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
