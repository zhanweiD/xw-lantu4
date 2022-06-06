export default () => {
  return {
    name: '图片层',
    type: 'picture', // 必要
    sections: [
      {
        name: 'base',
        fields: [
          {
            name: 'borderRadius',
          },
          {
            name: 'backgroundColor',
            defaultValue: 'rgba(0,119,255,1)',
          },
          {
            name: 'borderWidth',
          },
          {
            name: 'borderColor',
          },
          {
            name: 'opacity',
          },
          {
            name: 'padding',
            defaultValue: [0, 0, 0, 0],
          },
          {
            name: 'dotColor',
            defaultValue: '#fff',
          },
          {
            name: 'dotSize',
            defaultValue: 10,
          },
        ],
      },
      {
        name: 'animation',
        fields: [
          {
            name: 'updateDuration',
          },
          {
            name: 'animationType',
            defaultValue: 'normal',
            options: [
              {
                key: '左右切换',
                value: 'normal',
              },
            ],
          },
        ],
      },
    ],
  }
}
