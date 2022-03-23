export default () => {
  return {
    name: '轨迹线层',
    type: 'tripLine', // 必要
    sections: [
      {
        name: 'gisSpecialEffects',
        fields: [{name: 'gisElevation'}],
      },
    ],
  }
}
