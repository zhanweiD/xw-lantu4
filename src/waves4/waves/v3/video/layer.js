export default () => {
  return {
    name: '单视频层',
    type: 'video',
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
