import {config} from './config'
import makeAdapter from './adapter'
import i18n from './i18n'

const percentageBar = {
  lib: 'wave',
  id: 'cnpe',
  version: '1.0.0',
  completed: true,
  description: '',
  icon: 'percentage-bar',
  i18n,
  config,
  makeAdapter,
}

export default percentageBar
