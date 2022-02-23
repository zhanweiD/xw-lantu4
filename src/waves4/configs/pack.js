export default () => {
  return {
    name: '打包图',
    type: 'pack',
    sections: [
      {
        name: 'base',
        fields: [
          {
            name: 'layoutPosition',
            defaultValue: 'topLeft',
          },
          {
            name: 'offset',
            defaultValue: [0, 0],
          },
        ],
      },
    ],
  }
}
