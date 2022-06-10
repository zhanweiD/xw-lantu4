import createExhibitAdapter from '@exhibit-collection/exhibit-adapter-creater'
import MyVideo from '@wavesSrc/video'
import translate from './translate'

const Adapter = () =>
  createExhibitAdapter({
    // 初始化
    init({options}) {
      const mVideo = MyVideo.create()
      const translatedOptions = translate(options)
      // 初始化模型
      mVideo.init(translatedOptions, {})
      mVideo.data(translatedOptions, {})
      mVideo.draw({
        redraw: true,
      })

      return mVideo
    },

    // 处理包括数据、样式等变更
    update({options}) {
      try {
        const mVideo = MyVideo.create()
        const translatedOptions = translate(options)
        // 初始化模型
        mVideo.init(translatedOptions, {})
        mVideo.data(translatedOptions, {})
        mVideo.draw({
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
