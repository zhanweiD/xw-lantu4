import corner from './decorations/corner'
import brackect from './decorations/brackect'
import image from './image'
import i18n from '@i18n'

// !! 这里特殊处理了image 因为这个其实是内置的内容它的name和资源都不固定
const alldecorations = {
  corner,
  brackect,
  image,
}

Object.values(alldecorations).forEach((decoration) => {
  const k = i18n.sandbox(decoration.i18n, decoration.id || decoration.icon)
  decoration.config = decoration.config(k)
  decoration.Adapter = decoration.makeAdapter({k})
  // inject
  const {key, name} = decoration.config
  decoration.key = key
  decoration.name = name
})

const decorations = {
  corner,
  brackect,
}

export {alldecorations}
export default decorations
