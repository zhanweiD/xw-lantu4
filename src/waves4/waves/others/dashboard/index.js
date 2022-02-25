import {config} from './config'
import makeAdapter from './adapter'
import i18n from './i18n'

const dashboard = {
  lib: 'wave',
  id: 'dashboard',
  version: '1.0.0',
  completed: true,
  description: '',
  icon: 'gauge',
  i18n,
  config,
  makeAdapter,
}

export default dashboard
