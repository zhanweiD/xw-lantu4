import {config} from './config'
import makeAdapter from '../makeAdapter'
import createExhibitAdapter from '@exhibit-collection/exhibit-adapter-creater'

import i18n from '../i18n'

const echertsWaterfallBar = {
  lib: 'wave',
  id: 'ecwaterfallbar',
  version: '1.0.0',
  completed: true,
  description: '',
  icon: 'waterfall-bar',
  i18n,
  config,
  makeAdapter: (k) => makeAdapter({k, createExhibitAdapter}),
}

export {echertsWaterfallBar}
