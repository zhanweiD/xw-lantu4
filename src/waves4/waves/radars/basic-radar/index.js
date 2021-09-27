import {config} from './config'
import makeAdapter from './adapter'
import i18n from './i18n'

const basicRadar = {
  lib: 'wave',
  id: 'rrbc',
  version: '1.0.0',
  completed: true,
  description: '',
  icon: 'radar',
  i18n,
  config,
  makeAdapter,
}

export default basicRadar
