import {config} from './config'
import makeAdapter from './adapter'
import i18n from './i18n'

const waterfallBar = {
  lib: 'wave',
  id: 'brwl',
  version: '1.0.0',
  completed: true,
  description: '',
  icon: 'waterfall-bar',
  i18n,
  config,
  makeAdapter,
}

export default waterfallBar
