import {config} from './config'
import makeAdapter from './adapter'
import i18n from './i18n'

const groupLine = {
  lib: 'wave',
  id: 'legp',
  version: '1.0.0',
  completed: true,
  description: '',
  icon: 'multi-line',
  i18n,
  config,
  makeAdapter,
}

export default groupLine
