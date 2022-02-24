import {config} from './config'
import makeAdapter from './adapter'
import i18n from './i18n'

const pack = {
  lib: 'wave',
  id: 'pack',
  version: '1.0.0',
  completed: true,
  description: '',
  icon: 'pack',
  i18n,
  config,
  makeAdapter,
}

export default pack
