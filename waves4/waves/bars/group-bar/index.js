import {config} from './config'
import makeAdapter from './adapter'
import i18n from './i18n'

const groupBar = {
  lib: 'wave',
  id: 'brgp',
  version: '1.0.0',
  completed: true,
  description: '',
  icon: 'group-bar',
  i18n,
  config,
  makeAdapter,
}

export default groupBar
