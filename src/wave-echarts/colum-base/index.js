import {config} from './config'
import makeAdapter from '../makeAdapter'
import createExhibitAdapter from '@exhibit-collection/exhibit-adapter-creater'

import i18n from '../i18n'

const echertsBasicColumn = {
  lib: 'wave',
  id: 'ecbaseColumn',
  version: '1.0.0',
  completed: true,
  description: '',
  icon: 'basic-column',
  i18n,
  config,
  makeAdapter: (k) => makeAdapter({k, createExhibitAdapter}),
}

export {echertsBasicColumn}
