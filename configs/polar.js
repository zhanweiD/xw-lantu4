export default () => {
  return {
    name: '极坐标',
    type: 'polar',
    sections: [
      {
        name: 'base',
        fields: [
          {
            name: 'tickZero',
            defaultValue: false,
          },
          {
            name: 'tickCount',
            defaultValue: 6,
          },
          {
            name: 'type',
            defaultValue: 'polar',
          },
        ],
      },
    ],
  }
}
