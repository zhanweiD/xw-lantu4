import {config} from './config'
import makeAdapter from './adapter'
import i18n from './i18n'

const uiTabButton = {
  lib: 'wave',
  id: 'DAY8',
  version: '1.0.0',
  completed: true,
  description: '低优先级',
  icon: 'tab',
  i18n,
  config,
  makeAdapter,
}

export default uiTabButton
