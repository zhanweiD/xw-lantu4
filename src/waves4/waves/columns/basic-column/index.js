import {config} from './config'
import makeAdapter from './adapter'
import i18n from './i18n'

const basicColumn = {
  lib: 'wave',
  id: 'cnbc',
  version: '1.0.0',
  completed: true,
  description: '',
  icon: 'basic-column',
  i18n,
  config,
  makeAdapter,
}

export default basicColumn
