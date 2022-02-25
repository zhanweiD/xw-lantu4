import {config} from './config'
import makeAdapter from './adapter'
import i18n from './i18n'

const textarea = {
  lib: 'wave',
  id: 'v3ta',
  version: '1.0.0',
  completed: true,
  description: '',
  icon: 'textarea',
  i18n,
  config,
  makeAdapter,
}

export default textarea
