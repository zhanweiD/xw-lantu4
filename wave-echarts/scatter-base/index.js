import {config} from './config'
import makeAdapter from '../makeAdapter'
import createExhibitAdapter from '@exhibit-collection/exhibit-adapter-creater'
import i18n from '../i18n'

const echartsBaseScatter = {
  lib: 'wave',
  id: 'ecBaseScatter',
  version: '1.0.0',
  completed: true,
  description: '',
  icon: 'scatter',
  i18n,
  config,
  makeAdapter: (k) => makeAdapter({k, createExhibitAdapter}),
}

export {echartsBaseScatter}
