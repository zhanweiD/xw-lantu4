import {config} from './config'
import makeAdapter from './adapter'
import i18n from './i18n'

const sankey = {
  lib: 'wave',
  id: 'rnsy',
  version: '1.0.0',
  completed: true,
  description: '',
  icon: 'sankey',
  i18n,
  config,
  makeAdapter,
}

export default sankey
