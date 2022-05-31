import {config} from './config'
import makeAdapter from './adapter'
import i18n from './i18n'

const rectMatrix = {
  lib: 'wave',
  id: 'mxrt',
  version: '1.0.0',
  completed: true,
  description: '',
  icon: 'heatmap',
  i18n,
  config,
  makeAdapter,
}

export default rectMatrix
