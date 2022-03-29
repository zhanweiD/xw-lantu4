export default () => {
  return {
    name: '地形层',
    type: 'gisTerrain', // 必要
    sections: [
      {
        name: 'gisSpecialEffects',
        fields: [{name: 'gisElevation'}],
      },
    ],
    data: [
      ['rScaler', 'gScaler', 'bScaler', 'offset'],
      [6553.6, 25.6, 0.1, -10000],
    ],
  }
}
