export default () => {
  return {
    name: '图标层',
    type: 'pointIcon', // 必要
    sections: [
      {
        name: 'gisSpecialEffects',
        fields: [{name: 'gisElevation'}],
      },
    ],
  }
}
