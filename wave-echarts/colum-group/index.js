import {config} from './config'
import makeAdapter from '../makeAdapter'
import createExhibitAdapter from '@exhibit-collection/exhibit-adapter-creater'

import i18n from '../i18n'

const echertsGroupColumn = {
  lib: 'wave',
  id: 'ecgroupColumn',
  version: '1.0.0',
  completed: true,
  description: '',
  icon: 'group-column',
  i18n,
  config,
  makeAdapter: (k) => makeAdapter({k, createExhibitAdapter}),
}

export {echertsGroupColumn}
