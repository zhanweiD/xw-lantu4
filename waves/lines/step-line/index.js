import {config} from './config'
import makeAdapter from './adapter'
import i18n from './i18n'

const stepLine = {
  lib: 'wave',
  id: 'lesp',
  version: '1.0.0',
  completed: true,
  description: '',
  icon: 'step-line',
  i18n,
  config,
  makeAdapter,
}

export default stepLine
