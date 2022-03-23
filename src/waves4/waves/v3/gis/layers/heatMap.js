export default () => {
  return {
    name: '热力层',
    type: 'heatMap', // 必要
    sections: [
      {
        name: 'gisSpecialEffects',
        fields: [{name: 'gisElevation'}],
      },
    ],
  }
}
