import {config} from './config'
import {baseData} from './data'
import {makeAdapterLine} from 'wave-charts'
import createExhibitAdapter from '@exhibit-collection/exhibit-adapter-creater'
const i18n = {
  echertsBasicLine: ['echarts-折线图', 'Echarts Line'],
}

const echertsBasicLine = {
  lib: 'wave',
  id: 'echarts-lebc',
  version: '1.0.0',
  completed: true,
  description: '',
  icon: 'demo-line',
  i18n,
  config: (k) => config(k, baseData),
  makeAdapter: (k) => makeAdapterLine({k, createExhibitAdapter}),
}

export {echertsBasicLine}
