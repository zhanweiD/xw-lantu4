import {config} from './config'
import makeAdapter from './adapter'
import i18n from './i18n'

const intervalColumn = {
  lib: 'wave',
  id: 'cnil',
  version: '1.0.0',
  completed: true,
  description: '',
  icon: 'interval-column',
  i18n,
  config,
  makeAdapter,
}

export default intervalColumn
