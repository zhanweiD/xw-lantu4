// import layersConfig from './layers'
import layer from './layers/baseMap'
// import bimWhite from './layers/bimWhite'
// import river from '../river/layer'
// import dashboard from '../../../configs/dashboard'

// 根据这个配置生成组件的模型
export const config = (k) => ({
  key: 'gis',
  name: k('gis'),
  layout: () => [10, 12],
  padding: [60, 0, 60, 60],
  layers: [layer()],
  gisBase: {
    name: 'gis',
    type: 'gis', // 必要
    sections: [
      {
        name: 'base',
        fields: [
          {name: 'origin'},
          {name: 'viewport'},
          {name: 'backgroundColor'},
          {name: 'sceneMode'},
          {name: 'showMask'},
          {name: 'viewFixed'},
          {name: 'coordinateAcquisitionResult'},
        ],
      },
      {
        name: 'gisSpecialEffects',
        fields: [{name: 'rain'}, {name: 'snow'}, {name: 'elevation'}],
      },
    ],
  },
})
