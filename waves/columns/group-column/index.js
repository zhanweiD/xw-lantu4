import {config} from './config'
import makeAdapter from './adapter'
import i18n from './i18n'

const groupColumn = {
  lib: 'wave',
  id: 'cngp',
  version: '1.0.0',
  completed: true,
  description: '',
  icon: 'group-column',
  i18n,
  config,
  makeAdapter,
}

export default groupColumn
