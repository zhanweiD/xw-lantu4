import {config} from './config'
import makeAdapter from './adapter'
import i18n from './i18n'

const river = {
  lib: 'wave',
  id: 'ri23',
  version: '1.0.0',
  completed: true,
  description: '',
  icon: 'river',
  i18n,
  config,
  makeAdapter,
}

export default river
