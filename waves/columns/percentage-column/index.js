import {config} from './config'
import makeAdapter from './adapter'
import i18n from './i18n'

const percentageColumn = {
  lib: 'wave',
  id: 'cnpe',
  version: '1.0.0',
  completed: true,
  description: '',
  icon: 'percentage-column',
  i18n,
  config,
  makeAdapter,
}

export default percentageColumn
