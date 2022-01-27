import {config} from './config'
import makeAdapter from '../makeAdapter'

import i18n from '../i18n'

const echertsWaterfallColumn = {
  lib: 'wave',
  id: 'echarts-waterfullColumn',
  version: '1.0.0',
  completed: true,
  description: '',
  icon: 'waterfall',
  i18n,
  config,
  makeAdapter: (k) => makeAdapter({k}),
}

export {echertsWaterfallColumn}
