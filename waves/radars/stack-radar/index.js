import {config} from './config'
import makeAdapter from './adapter'
import i18n from './i18n'

const stackRadar = {
  lib: 'wave',
  id: 'rrsk',
  version: '1.0.0',
  completed: true,
  description: '',
  icon: 'stack-radar',
  i18n,
  config,
  makeAdapter,
}

export default stackRadar
