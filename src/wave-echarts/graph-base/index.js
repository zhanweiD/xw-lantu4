import {config} from './config'
import makeAdapter from '../makeAdapter'
import createExhibitAdapter from '@exhibit-collection/exhibit-adapter-creater'
import i18n from '../i18n'

const echartsGraphBase = {
  lib: 'wave',
  id: 'ecGraphBase',
  version: '1.0.0',
  completed: true,
  description: '',
  icon: 'graph',
  i18n,
  config,
  makeAdapter: (k) => makeAdapter({k, createExhibitAdapter}),
}

export {echartsGraphBase}
