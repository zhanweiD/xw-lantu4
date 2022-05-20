import {config} from './config'
import makeAdapter from './adapter'
import i18n from './i18n'

const switchs = {
  lib: 'wave',
  id: 'NaDK',
  version: '1.0.0',
  completed: true,
  description: '低优先级',
  icon: 'switch',
  i18n,
  config,
  makeAdapter,
}

export default switchs
