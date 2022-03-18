// import layersConfig from './layers'
import layer from './layer'
import button from '../button/layer'
// import river from '../river/layer'
import dashboard from '../../../configs/dashboard'

// 根据这个配置生成组件的模型
export const config = (k) => ({
  key: 'gis',
  name: k('gis'),
  layout: () => [10, 6],
  padding: [60, 0, 60, 60],
  layers: [layer(), button(), dashboard({dashboard: 'dashboard', name: '指标卡'})],
  gisBase: {
    name: 'gis',
    type: 'gis', // 必要
    sections: [
      {
        name: 'base',
        fields: [
          {name: 'gisPosition'},
          {name: 'gisAngle'},
          {name: 'gisBackground'},
          {name: 'gisProjection'},
          {name: 'gisInteraction'},
          {name: 'gisAngleFixed'},
          {name: 'gisClickXY'},
        ],
      },
      {
        name: 'gisSpecialEffects',
        fields: [{name: 'gisRain'}, {name: 'gisSnow'}, {name: 'gisElevation'}],
      },
    ],
  },
})
