import {config} from './config'
import makeAdapter from './adapter'
import i18n from './i18n'

const groupLineColumn = {
  lib: 'wave',
  id: 'lcgp',
  version: '1.0.0',
  completed: true,
  description: '',
  icon: 'group-line-column',
  i18n,
  config,
  makeAdapter,
}

export default groupLineColumn
