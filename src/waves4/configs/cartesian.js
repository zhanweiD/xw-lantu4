export default (k) => {
  return {
    sections: [
      {
        name: 'base',
        fields: [
          {
            name: 'tickCount',
            defaultValue: 5,
          },
          {
            name: 'tickZero',
            defaultValue: false,
          },
        ],
      },
      {
        name: 'xAxis',
        sections: [
          {
            name: 'label',
            effective: true,
            fields: [
              {
                name: 'offset',
                defaultValue: [0, 0],
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
      },
      {
        name: 'yAxis',
        sections: [
          {
            name: 'label',
            effective: true,
            fields: [
              {
                name: 'offset',
                defaultValue: [0, -2],
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
          {
            name: 'yAxisLine',
            effective: true,
            fields: [
              {
                name: 'lineWidth',
                defaultValue: 1,
              },
              {
                name: 'singleColor',
                defaultValue: 'rgb(200,200,200)',
              },
              {
                name: 'opacity',
                defaultValue: 0.5,
              },
            ],
          },
          {
            name: 'yAxisSplitLine',
            effective: true,
            fields: [
              {
                name: 'lineWidth',
                defaultValue: 1,
              },
              {
                name: 'singleColor',
                defaultValue: 'rgb(200,200,200)',
              },
              {
                name: 'opacity',
                defaultValue: 0.3,
              },
            ],
          },
        ],
      },
    ],
  }
}
