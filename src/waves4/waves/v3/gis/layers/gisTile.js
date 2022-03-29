export default () => {
  return {
    name: '模型层',
    type: 'gisTile', // 必要
    sections: [
      {
        name: 'gisSpecialEffects',
        fields: [{name: 'gisElevation'}],
      },
    ],
  }
}
