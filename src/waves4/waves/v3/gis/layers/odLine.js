export default () => {
  return {
    name: 'OD线层',
    type: 'odLine', // 必要
    sections: [
      {
        name: 'gisSpecialEffects',
        fields: [{name: 'gisElevation'}],
      },
    ],
  }
}
