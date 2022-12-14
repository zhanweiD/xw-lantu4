import {config} from './config'
import makeAdapter from './adapter'
import i18n from './i18n'

const basicLineColumn = {
  lib: 'wave',
  id: 'lcbc',
  version: '1.0.0',
  completed: true,
  description: '',
  icon: 'line-column',
  i18n,
  config,
  makeAdapter,
}

export default basicLineColumn
