import {config} from './config'
import makeAdapter from './adapter'
import i18n from './i18n'

const intervalBar = {
  lib: 'wave',
  id: 'bril',
  version: '1.0.0',
  completed: true,
  description: '',
  icon: 'interval-bar',
  i18n,
  config,
  makeAdapter,
}

export default intervalBar
