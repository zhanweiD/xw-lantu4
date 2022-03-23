export default () => {
  return {
    name: '波纹点层',
    type: 'pointWave', // 必要
    sections: [
      {
        name: 'gisSpecialEffects',
        fields: [{name: 'gisElevation'}],
      },
    ],
  }
}
