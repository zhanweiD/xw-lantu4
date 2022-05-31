import {config} from './config'
import makeAdapter from './adapter'
import i18n from './i18n'

const stackAreaLine = {
  lib: 'wave',
  id: 'lesk',
  version: '1.0.0',
  completed: true,
  description: '',
  icon: 'stack-area-line',
  i18n,
  config,
  makeAdapter,
}

export default stackAreaLine
