import {config} from './config'
import makeAdapter from './adapter'
import i18n from './i18n'

const bulletColumn = {
  lib: 'wave',
  id: 'cnbt',
  version: '1.0.0',
  completed: true,
  description: '',
  icon: 'bullet-column',
  i18n,
  config,
  makeAdapter,
}

export default bulletColumn
