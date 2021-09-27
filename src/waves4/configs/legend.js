export default ({direction = 'horizontal', position = 'topRight'}) => {
  return {
    effective: true,
    sections: [
      {
        name: 'base',
        fields: [
          {
            name: 'direction',
            defaultValue: direction,
          },
          {
            name: 'layoutPosition',
            defaultValue: position,
          },
          {
            name: 'offset',
            defaultValue: [0, 0],
          },
          {
            name: 'gap',
            defaultValue: [2, 5],
          },
        ],
      },
      {
        name: 'shape',
        fields: [
          {
            name: 'size',
            defaultValue: 10,
          },
          {
            name: 'opacity',
            defaultValue: 1,
          },
        ],
      },
      {
        name: 'label',
        sections: [
          {
            name: 'text',
            fields: [
              {
                name: 'textSize',
                defaultValue: 12,
              },
              {
                name: 'textWeight',
                defaultValue: 200,
              },
              {
                name: 'singleColor',
                defaultValue: 'rgb(255,255,255)',
              },
              {
                name: 'opacity',
                defaultValue: 1,
              },
            ],
          },
          {
            name: 'shadow',
            effective: false,
            fields: [
              {
                name: 'offset',
                defaultValue: [0, 0],
              },
              {
                name: 'blur',
                defaultValue: 2,
              },
              {
                name: 'singleColor',
                defaultValue: 'rgb(0,0,0)',
              },
            ],
          },
        ],
      },
    ],
  }
}
