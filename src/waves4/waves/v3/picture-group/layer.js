export default () => {
  return {
    name: '图片组',
    type: 'picture',
    sections: [
      {
        name: 'base',
        fields: [
          {
            name: 'columnNumber',
            defaultValue: 3,
            step: 1,
          },
          {
            name: 'gap',
            defaultValue: 20,
            step: 1,
            min: 0,
          },
          {
            name: 'leftLableFontSize',
            defaultValue: 10,
            max: 100,
            min: 0,
          },
          {
            name: 'rightLableFontSize',
            defaultValue: 10,
            max: 100,
            min: 0,
          },
          {
            name: 'leftLabelColor',
            defaultValue: 'rgb(255,255,255)',
          },
          {
            name: 'rightLabelColor',
            defaultValue: 'rgb(255,255,255)',
          },
          {
            name: 'backgroundColor',
            defaultValue: 'rgb(38,38,38)',
          },
          {
            name: 'isMarkVisible',
            defaultValue: true,
          },
          {
            name: 'animationDuration',
            defaultValue: 10,
            max: 100,
            min: 1,
          },
        ],
      },
    ],
  }
}
