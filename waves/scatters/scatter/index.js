import {config} from './config'
import makeAdapter from './adapter'
import i18n from './i18n'

const scatter = {
  lib: 'wave',
  id: 'srsr',
  version: '1.0.0',
  completed: true,
  description: '',
  icon: 'scatter',
  i18n,
  config,
  makeAdapter,
}

export default scatter
