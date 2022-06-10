export default () => {
  return {
    name: '图片组滚动条',
    type: 'picture-group-scroll',
    sections: [
      {
        name: 'base',
        fields: [
          {
            name: 'isMarkVisible',
            defaultValue: true,
          },
        ],
      },
    ],
  }
}
