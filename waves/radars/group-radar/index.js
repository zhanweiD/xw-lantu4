import {config} from './config'
import makeAdapter from './adapter'
import i18n from './i18n'

const groupRadar = {
  lib: 'wave',
  id: 'rrgp',
  version: '1.0.0',
  completed: true,
  description: '',
  icon: 'group-radar',
  i18n,
  config,
  makeAdapter,
}

export default groupRadar
