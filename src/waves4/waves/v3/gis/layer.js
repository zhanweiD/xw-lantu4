export default () => {
  return {
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
      // {
      //   name: 'gisSubLayer',
      //   sections: [
      //     {
      //       name: 'base',
      //       fields: [
      //         {name: 'gisPosition'},
      //       ],
      //     },
      //   ]
      // },
    ],
  }
}
