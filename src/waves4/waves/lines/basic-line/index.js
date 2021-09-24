import {config} from './config'
import makeAdapter from './adapter'
import i18n from './i18n'

const basicLine = {
  lib: 'wave',
  id: 'lebc',
  version: '1.0.0',
  completed: true,
  description: '',
  icon: 'basic-line',
  i18n,
  config,
  makeAdapter,
}

export default basicLine
