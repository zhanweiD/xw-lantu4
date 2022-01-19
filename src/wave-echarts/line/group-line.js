import {config} from './config'
import data from './group-data'
import {makeAdapterLine} from 'wave-charts'
import createExhibitAdapter from '@exhibit-collection/exhibit-adapter-creater'

const i18n = {
  echartsGroupLine: ['echarts-分组折线', 'Echarts Group Line'],
}

const echartsGroupLine = {
  lib: 'wave',
  id: 'echarts-lcgp',
  version: '1.0.0',
  completed: true,
  description: '',
  icon: 'multi-line',
  i18n,
  config: (k) => config(k, data, 'echartsGroupLine', 'echarts-分组折线'),
  makeAdapter: (k) => makeAdapterLine({k, createExhibitAdapter}),
}

export default echartsGroupLine
