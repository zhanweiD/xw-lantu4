import {config} from './config'
import {baseData, groupData} from './data'
import {makeAdapterLine} from 'wave-charts'
import createExhibitAdapter from '@exhibit-collection/exhibit-adapter-creater'
const i18n = {
  echertsBasicLine: ['echarts-基础折线', 'Basic Line'],
  echartsGroupLine: ['echarts-分组折线', 'Echarts Group Line'],
}

const echertsBasicLine = {
  lib: 'wave',
  id: 'echarts-lebc',
  version: '1.0.0',
  completed: true,
  description: '',
  icon: 'demo-line',
  i18n,
  config: (k) => config(k, baseData, 'echertsBasicLine', 'echarts-基础折线'),
  makeAdapter: (k) => makeAdapterLine({k, createExhibitAdapter}),
}

const echartsGroupLine = {
  lib: 'wave',
  id: 'echarts-lcgp',
  version: '1.0.0',
  completed: true,
  description: '',
  icon: 'multi-line',
  i18n,
  config: (k) => config(k, groupData, 'echartsGroupLine', 'echarts-分组折线'),
  makeAdapter: (k) => makeAdapterLine({k, createExhibitAdapter}),
}

export {echertsBasicLine, echartsGroupLine}
