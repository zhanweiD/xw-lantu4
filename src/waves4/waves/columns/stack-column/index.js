import {config} from './config'
import makeAdapter from './adapter'
import i18n from './i18n'

const stackColumn = {
  lib: 'wave',
  id: 'cnsk',
  version: '1.0.0',
  completed: true,
  description: '',
  icon: 'stack-column',
  i18n,
  config,
  makeAdapter,
}

export default stackColumn
