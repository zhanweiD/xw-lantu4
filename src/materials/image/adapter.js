import createExhibitAdapter from '@exhibit-collection/exhibit-adapter-creater'
import WaveImage from './image'
import config from '@utils/config'

const makeAdapter = () => {
  // k 组件私有化多语言方法
  return createExhibitAdapter({
    // 初始化组件实例
    init({options}) {
      const {container, layers} = options
      const layer = layers[0]
      const o = layer.mapOption([
        ['base.opacity', 'opacity'],
        ['base.fillType', 'fillType'],
        ['effective', 'effective'],
      ])

      const instance = new WaveImage({
        container,
        url: `${config.urlPrefix}material/download/${layer.id}`,
        fillType: o.get('fillType'),
        opacity: o.get('opacity'),
        effective: o.get('effective'),
      })
      instance.draw()
      return instance
    },

    // 处理包括数据、样式等变更
    update({updated, instance}) {
      instance.update({
        fillType: updated.getOption('base.fillType'),
        opacity: updated.getOption('base.opacity'),
        effective: updated.getOption('effective'),
      })
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
}

export default makeAdapter
