import {config} from './config'
import makeAdapter from '../makeAdapter'
import createExhibitAdapter from '@exhibit-collection/exhibit-adapter-creater'

import i18n from '../i18n'

const echertsGroupColumnLine = {
  lib: 'wave',
  id: 'ecgroupColumnLine',
  version: '1.0.0',
  completed: true,
  description: '',
  icon: 'group-line-column',
  i18n,
  config,
  makeAdapter: (k) => makeAdapter({k, createExhibitAdapter}),
}

export {echertsGroupColumnLine}
