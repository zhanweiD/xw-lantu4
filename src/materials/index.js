import corner from './decoration/corner'
import brackect from './decoration/brackect'
import i18n from '@i18n'

const decorations = {
  corner,
  brackect,
}

Object.values(decorations).forEach((decoration) => {
  const k = i18n.sandbox(decoration.i18n, decoration.id || decoration.icon)
  decoration.config = decoration.config(k)
  decoration.Adapter = decoration.makeAdapter({k})
  // inject
  const {key, name} = decoration.config
  decoration.key = key
  decoration.name = name
})

export default decorations
