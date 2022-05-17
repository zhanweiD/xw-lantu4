import {config} from './config'
import makeAdapter from './adapter'
import i18n from './i18n'

const dot = {
  lib: 'wave',
  id: 'dot',
  version: '1.0.0',
  completed: true,
  description: '装饰素材-点状图',
  icon: 'material-docaratedot',
  i18n,
  config,
  makeAdapter,
}

export default dot
