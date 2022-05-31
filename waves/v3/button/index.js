import {config} from './config'
import makeAdapter from './adapter'
import i18n from './i18n'

const button = {
  lib: 'wave',
  id: 'GatB',
  version: '1.0.0',
  completed: true,
  description: '低优先级',
  icon: 'button',
  i18n,
  config,
  makeAdapter,
}

export default button
