import createExhibitAdapter from '@exhibit-collection/exhibit-adapter-creater'
import MyVideoMulti from '@wavesSrc/video-multi'
import translate from './translate'

const Adapter = () =>
  createExhibitAdapter({
    // 初始化
    init({options, event}) {
      const mVideoMulti = MyVideoMulti.create()
      const translatedOptions = translate(options)
      // 初始化模型
      mVideoMulti.init(translatedOptions, {})
      mVideoMulti.data(translatedOptions, {})
      mVideoMulti.draw({
        redraw: true,
      })

      mVideoMulti.event.on('ready', () => {
        event.fire('ready')
      })

      return mVideoMulti
    },

    // 处理包括数据、样式等变更
    update({options}) {
      try {
        const mVideoMulti = MyVideoMulti.create()
        const translatedOptions = translate(options)
        // 初始化模型
        mVideoMulti.init(translatedOptions, {})
        mVideoMulti.data(translatedOptions, {})
        mVideoMulti.draw({
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
