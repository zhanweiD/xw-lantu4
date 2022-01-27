import {config} from './config'
import makeAdapter from '../makeAdapter'

import i18n from '../i18n'

const echertsBasicColumnLine = {
  lib: 'wave',
  id: 'echarts-baseColumnCine',
  version: '1.0.0',
  completed: true,
  description: '',
  icon: 'line-column',
  i18n,
  config,
  makeAdapter: (k) => makeAdapter({k}),
}

export {echertsBasicColumnLine}
