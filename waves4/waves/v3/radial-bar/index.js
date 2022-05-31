import {config} from './config'
import makeAdapter from './adapter'
import i18n from './i18n'

const radialBar = {
  lib: 'wave',
  id: 'its3',
  version: '1.0.0',
  completed: true,
  description: '',
  icon: 'radial-bar',
  i18n,
  config,
  makeAdapter,
}

export default radialBar
