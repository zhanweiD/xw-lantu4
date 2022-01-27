import {config} from './config'
import makeAdapter from '../makeAdapter'

import i18n from '../i18n'

const echartsBasicAreaLine = {
  lib: 'wave',
  id: 'echarts-baseArealine',
  version: '1.0.0',
  completed: true,
  description: '',
  icon: 'area',
  i18n,
  config,
  makeAdapter: (k) => makeAdapter({k}),
}

export {echartsBasicAreaLine}
