import {config} from './config'
import makeAdapter from './adapter'
import i18n from './i18n'

const bubble = {
  lib: 'wave',
  id: 'srbe',
  version: '1.0.0',
  completed: true,
  description: '',
  icon: 'bubble',
  i18n,
  config,
  makeAdapter,
}

export default bubble
