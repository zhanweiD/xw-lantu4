import {config} from './config'
import makeAdapter from './adapter'
import i18n from './i18n'

const nightingaleRose = {
  lib: 'wave',
  id: 'penr',
  version: '1.0.0',
  completed: true,
  description: '',
  icon: 'nightingale-rose',
  i18n,
  config,
  makeAdapter,
}

export default nightingaleRose
