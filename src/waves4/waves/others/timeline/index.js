import {config} from './config'
import makeAdapter from './adapter'
import i18n from './i18n'

const dashboard = {
  lib: 'wave',
  id: 'timeline',
  version: '1.0.0',
  completed: true,
  description: '',
  icon: 'timeline',
  i18n,
  config,
  makeAdapter,
}

export default dashboard
