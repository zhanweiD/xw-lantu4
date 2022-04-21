export default () => {
  return {
    name: '装饰',
    type: 'decoration', // 必要
    sections: [
      {
        name: 'base',
        fields: [
          {
            name: 'dure',
            defaultValue: 6,
          },
          {
            name: 'shape',
            defaultValue: 'square',
          },
          {
            name: 'color',
          },
        ],
      },
    ],
  }
}
