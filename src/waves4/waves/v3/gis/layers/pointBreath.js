export default () => {
  return {
    name: '呼吸点层',
    type: 'pointBreath', // 必要
    sections: [
      {
        name: 'gisSpecialEffects',
        fields: [{name: 'gisElevation'}],
      },
    ],
  }
}
