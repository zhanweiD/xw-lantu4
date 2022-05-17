import {config} from './config'
import makeAdapter from './adapter'
import i18n from './i18n'

const input = {
  lib: 'wave',
  id: 'Cy6R',
  version: '1.0.0',
  completed: true,
  description: '低优先级',
  icon: 'input',
  i18n,
  config,
  makeAdapter,
}

export default input
