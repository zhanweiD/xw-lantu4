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
          {
            name: 'lineFallback',
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
        //         name: 'singleColor',
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
          {
            name: 'decimalPlaces',
            defaultValue: 2,
          },
          {
            name: 'thousandDiv',
            defaultValue: false,
          },
          {
            name: 'percentage',
            defaultValue: false,
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
