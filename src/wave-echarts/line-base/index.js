import {config} from './config'
import makeAdapter from '../makeAdapter'

import i18n from '../i18n'

const echertsBasicLine = {
  lib: 'wave',
  id: 'echarts-baseline',
  version: '1.0.0',
  completed: true,
  description: '',
  icon: 'basic-line',
  i18n,
  config,
  makeAdapter: (k) => makeAdapter({k}),
}

export {echertsBasicLine}
