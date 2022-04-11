export default () => {
  return {
    name: '模型层',
    type: 'gisTile', // 必要
    sections: [
      {
        name: 'base',
        fields: [
          {name: 'tileUrl'},
          {name: 'tileType'},
          // {name: 'loadOptions'},
        ],
      },
    ],
  }
}
