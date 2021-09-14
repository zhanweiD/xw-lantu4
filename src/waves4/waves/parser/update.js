import {createWave} from '@waveview/wave'
import translate from './translate'

// 初始化图表
const reinitializeWave = (wave, schema) => {
  while (wave.layer.length !== 0) {
    wave.layer[0].instance.destroy()
  }
  createWave(translate(schema), wave)
}

// 图表更新策略
const updateWave = ({action, ...other}) => {
  try {
    if (action === 'data') {
      const {instance, schema} = other
      reinitializeWave(instance, schema)
    } else {
      updateStyle(other)
    }
  } catch (error) {
    console.error('图层配置解析错误，更新失败', error)
  }
}

// 根据配置更新一个图表
const updateStyle = ({layerId, instance}) => {
  const target = instance.layer.find(({id}) => id === layerId)
  const layer = target.instance
  // 由于覆盖问题所有图层都需要重新渲染
  layer.setData()
  layer.setStyle()
  instance.draw()
}

export default updateWave
