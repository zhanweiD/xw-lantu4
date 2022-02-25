import {config} from './config'
import makeAdapter from './adapter'
import i18n from './i18n'

const baseMap = {
  lib: 'wave',
  id: 'baseMap',
  version: '1.0.0',
  completed: true,
  description: '',
  icon: 'china-map',
  i18n,
  config,
  makeAdapter,
}

export default baseMap
