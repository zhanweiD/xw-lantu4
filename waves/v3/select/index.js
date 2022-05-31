import {config} from './config'
import makeAdapter from './adapter'
import i18n from './i18n'

const select = {
  lib: 'wave',
  id: 'KPfA',
  version: '1.0.0',
  completed: true,
  description: '低优先级',
  icon: 'select',
  i18n,
  config,
  makeAdapter,
}

export default select
