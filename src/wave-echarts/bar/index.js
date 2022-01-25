import {config} from './config'
import {baseData} from './data'
import makeAdapterBar from './makeAdapterBar'
import createExhibitAdapter from '@exhibit-collection/exhibit-adapter-creater'
const i18n = {
  echertsBasicBar: ['echarts-柱状图', 'Echarts Bar'],
}

const echertsBasicBar = {
  lib: 'wave',
  id: 'echarts-bar',
  version: '1.0.0',
  completed: true,
  description: '',
  icon: 'column-facet',
  i18n,
  config: (k) => config(k, baseData),
  makeAdapter: (k) => makeAdapterBar({k, createExhibitAdapter}),
}

export {echertsBasicBar}
