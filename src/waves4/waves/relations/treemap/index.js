import {config} from './config'
import makeAdapter from './adapter'
import i18n from './i18n'

const chord = {
  lib: 'wave',
  id: 'treemap',
  version: '1.0.0',
  completed: true,
  description: '',
  icon: 'treemap',
  i18n,
  config,
  makeAdapter,
}

export default chord
