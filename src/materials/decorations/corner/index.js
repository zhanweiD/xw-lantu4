import {config} from './config'
import makeAdapter from './adapter'
import i18n from './i18n'

const corner = {
  lib: 'wave',
  id: 'corner',
  version: '1.0.0',
  completed: true,
  description: '',
  icon: 'material-corner',
  i18n,
  config,
  makeAdapter,
}

export default corner
