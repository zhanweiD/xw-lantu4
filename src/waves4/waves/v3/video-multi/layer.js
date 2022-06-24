export default () => {
  return {
    name: '滚动视频组',
    type: 'video Group SCroll',
    sections: [
      {
        name: 'base',
        fields: [
          {
            name: 'isMarkVisible',
            defaultValue: true,
          },
          {
            name: 'backgroundColor',
            defaultValue: '#000',
          },
        ],
      },
    ],
  }
}
