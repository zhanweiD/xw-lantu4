import {config} from './config'
import makeAdapter from './adapter'
import i18n from './i18n'

const basicPie = {
  lib: 'wave',
  id: 'pebc',
  version: '1.0.0',
  completed: true,
  description: '',
  icon: 'pie',
  i18n,
  config,
  makeAdapter,
}

export default basicPie
