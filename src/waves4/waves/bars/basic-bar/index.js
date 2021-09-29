import {config} from './config'
import makeAdapter from './adapter'
import i18n from './i18n'

const basicBar = {
  lib: 'wave',
  id: 'brbc',
  version: '1.0.0',
  completed: true,
  description: '',
  icon: 'basic-bar',
  i18n,
  config,
  makeAdapter,
}

export default basicBar
