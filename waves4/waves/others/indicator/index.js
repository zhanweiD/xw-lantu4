import {config} from './config'
import makeAdapter from './adapter'
import i18n from './i18n'

const indicator = {
  lib: 'wave',
  id: 'indicator',
  version: '1.0.0',
  completed: true,
  description: '',
  icon: 'cicular-indicator',
  i18n,
  config,
  makeAdapter,
}

export default indicator
