import {config} from './config'
import makeAdapter from '../makeAdapter'

import i18n from '../i18n'

const echertsStackColumn = {
  lib: 'wave',
  id: 'echarts-stackcolumn',
  version: '1.0.0',
  completed: true,
  description: '',
  icon: 'stack-column',
  i18n,
  config,
  makeAdapter: (k) => makeAdapter({k}),
}

export {echertsStackColumn}
