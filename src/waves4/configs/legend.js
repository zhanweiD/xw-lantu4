export default (k) => {
  return {
    effective: true,
    sections: [
      {
        name: 'base',
        fields: [
          {
            name: 'direction',
            defaultValue: 'horizontal',
          },
          {
            name: 'layoutPosition',
            defaultValue: 'topRight',
          },
          {
            name: 'offset',
            defaultValue: [0, 0],
          },
          {
            name: 'gap',
            defaultValue: [0, 5],
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
                defaultValue: 400,
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
