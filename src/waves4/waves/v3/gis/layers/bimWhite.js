export default () => {
  return {
    name: '白盒模型层',
    type: 'bimWhite', // 必要
    sections: [
      {
        name: 'gisSpecialEffects',
        fields: [{name: 'gisElevation'}],
      },
    ],
  }
}
