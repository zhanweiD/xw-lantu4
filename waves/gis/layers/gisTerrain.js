export default () => {
  return {
    name: '地形层',
    type: 'gisTerrain', // 必要
    sections: [
      {
        name: 'base',
        fields: [
          {name: 'elevationData'},
          {name: 'elevationDecoder'},
          // {name: 'bounds'},
          {name: 'texture'},
        ],
      },
    ],
  }
}
