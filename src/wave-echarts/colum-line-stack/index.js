import {config} from './config'
import makeAdapter from '../makeAdapter'
import createExhibitAdapter from '@exhibit-collection/exhibit-adapter-creater'

import i18n from '../i18n'

const echertsStackColumnLine = {
  lib: 'wave',
  id: 'ecstackColumnLine',
  version: '1.0.0',
  completed: true,
  description: '',
  icon: 'stack-line-column',
  i18n,
  config,
  makeAdapter: (k) => makeAdapter({k, createExhibitAdapter}),
}

export {echertsStackColumnLine}
