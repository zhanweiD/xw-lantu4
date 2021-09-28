import {config} from './config'
import makeAdapter from './adapter'
import i18n from './i18n'

const waterfallColumn = {
  lib: 'wave',
  id: 'cnwl',
  version: '1.0.0',
  completed: true,
  description: '',
  icon: 'waterfall',
  i18n,
  config,
  makeAdapter,
}

export default waterfallColumn
