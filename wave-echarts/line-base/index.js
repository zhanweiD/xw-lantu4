import {config} from './config'
import makeAdapter from '../makeAdapter'
import createExhibitAdapter from '@exhibit-collection/exhibit-adapter-creater'

import i18n from '../i18n'

const echertsBasicLine = {
  lib: 'wave',
  id: 'ecbaseline',
  version: '1.0.0',
  completed: true,
  description: '',
  icon: 'basic-line',
  i18n,
  config,
  makeAdapter: (k) => makeAdapter({k, createExhibitAdapter}),
}

export {echertsBasicLine}
