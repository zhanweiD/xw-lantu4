export default () => {
  return {
    name: '海量点层',
    type: 'pointMuch', // 必要
    sections: [
      {
        name: 'gisSpecialEffects',
        fields: [{name: 'gisElevation'}],
      },
    ],
  }
}
