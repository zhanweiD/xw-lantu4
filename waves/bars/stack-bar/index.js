import {config} from './config'
import makeAdapter from './adapter'
import i18n from './i18n'

const stackBar = {
  lib: 'wave',
  id: 'brsk',
  version: '1.0.0',
  completed: true,
  description: '',
  icon: 'stack-bar',
  i18n,
  config,
  makeAdapter,
}

export default stackBar
