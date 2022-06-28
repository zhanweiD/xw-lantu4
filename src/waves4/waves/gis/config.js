// 根据这个配置生成组件的模型
import {auxiliary} from '@waves4/configs'

export const config = (k) => ({
  key: 'gis',
  name: k('gis'),
  layout: () => [24, 20],
  padding: [24, 24, 24, 24],
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
  // 直角坐标系坐标轴

  auxiliary: auxiliary({k, type: 'horizontal'}),
})
