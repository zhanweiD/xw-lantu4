export default (k) => {
  return {
    name: '线层',
    type: 'line',
    sections: [
      {
        name: 'dataMap',
        fields: [
          {
            name: 'column',
            defaultValue: ['项目交付'],
          },
        ],
      },
      {
        name: 'line',
        fields: [
          {
            name: 'lineWidth',
            defaultValue: 2,
          },
          {
            name: 'lineCurve',
          },
        ],
        // sections: [
        //   {
        //     name: 'color',
        //     effective: false,
        //     fields: [
        //       {
        //         name: 'colorType',
        //         defaultValue: 'single',
        //       },
        //       {
        //         name: 'colorSingle',
        //       },
        //       {
        //         name: 'colorGradient',
        //       },
        //       {
        //         name: 'opacity',
        //       },
        //     ],
        //   },
        // ],
      },
      {
        name: 'point',
        fields: [
          {
            name: 'size',
            defaultValue: 4,
          },
          {
            name: 'colorSingle',
            defaultValue: 'rgb(255,255,255)',
          },
          {
            name: 'opacity',
            defaultValue: 1,
          },
        ],
      },
      {
        name: 'area',
        effective: false,
        fields: [
          {
            name: 'opacity',
            defaultValue: 0.4,
          },
        ],
      },
      {
        name: 'label',
        effective: true,
        fields: [
          {
            name: 'offset',
            defaultValue: [0, 0],
          },
          {
            name: 'relativePosition',
            defaultValue: 'top',
          },
        ],
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
                name: 'colorSingle',
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
                name: 'colorSingle',
                defaultValue: 'rgb(0,0,0)',
              },
            ],
          },
        ],
      },
    ],
  }
}
