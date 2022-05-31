import {config} from './config'
import makeAdapter from './adapter'
import i18n from './i18n'

const donut = {
  lib: 'wave',
  id: 'pedt',
  version: '1.0.0',
  completed: true,
  description: '',
  icon: 'donut',
  i18n,
  config,
  makeAdapter,
}

export default donut
