import {config} from './config'
import data from './line-data'
import {makeAdapterLine} from 'wave-charts'
import createExhibitAdapter from '@exhibit-collection/exhibit-adapter-creater'
const i18n = {
  echertsBasicLine: ['echarts-基础折线', 'Basic Line'],
}

const echertsBasicLine = {
  lib: 'wave',
  id: 'echarts-lebc',
  version: '1.0.0',
  completed: true,
  description: '',
  icon: 'demo-line',
  i18n,
  config: (k) => config(k, data, 'echertsBasicLine', 'echarts-基础折线'),
  makeAdapter: (k) => makeAdapterLine({k, createExhibitAdapter}),
}

export default echertsBasicLine
