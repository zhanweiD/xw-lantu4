import {config} from './config'
import makeAdapter from './adapter'
import i18n from './i18n'

const tree = {
  lib: 'wave',
  id: 'tree',
  version: '1.0.0',
  completed: true,
  description: '',
  icon: 'catalog', // 暂用
  i18n,
  config,
  makeAdapter,
}

export default tree
