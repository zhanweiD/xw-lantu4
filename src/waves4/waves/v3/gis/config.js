// import layersConfig from './layers'
// import layer from './layers/baseMap'
// import bimWhite from './layers/bimWhite'
// import river from '../river/layer'
// import dashboard from '../../../configs/dashboard'

// 根据这个配置生成组件的模型
export const config = (k) => ({
  key: 'gis',
  name: k('gis'),
  layout: () => [24, 20],
  padding: [60, 0, 60, 60],
  layers: [],
  gisBase: {
    name: 'gis',
    type: 'gis', // 必要
    fields: [
      {name: 'baseMapStyle'},
      {name: 'viewportMode'},
      {name: 'longitude'},
      {name: 'latitude'},
      {name: 'zoom'},
      {name: 'pitch'},
      {name: 'bearing'},
      {name: 'viewFixed'},
      {name: 'showMapHelper'},
      {name: 'showMapControl'},
      {name: 'enableMapInteractive'},
      // {name: 'origin'},
      // {name: 'viewport'},
      // {name: 'backgroundColor'},
      // {name: 'sceneMode'},
      // {name: 'enableMapInteractive'},
      // {name: 'coordinateAcquisitionResult'},
      // {
      //   name: 'gisSpecialEffects',
      //   fields: [{name: 'rain'}, {name: 'snow'}, {name: 'elevation'}],
      // },
    ],
  },
})
