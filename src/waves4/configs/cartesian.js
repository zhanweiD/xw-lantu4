export default ({tickZero = false, percentage = false, type = 'bandX-linearY'}) => {
  return {
    sections: [
      {
        name: 'base',
        fields: [
          {
            name: 'tickZero',
            defaultValue: tickZero,
          },
          {
            name: 'tickCount',
            defaultValue: 5,
          },
          {
            name: 'paddingInner',
          },
        ],
      },
      {
        name: 'xAxis',
        sections: [
          {
            name: 'label',
            effective: true,
            fields:
              type === 'linearX-bandY'
                ? [
                    {
                      name: 'offset',
                      defaultValue: [0, 0],
                    },
                    {
                      name: 'thousandDiv',
                      defaultValue: false,
                    },
                    {
                      name: 'percentage',
                      defaultValue: percentage,
                    },
                  ]
                : [
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
                    defaultValue: 10,
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
          type === 'linearX-bandY' && {
            name: 'xAxisLine',
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
          type === 'linearX-bandY' && {
            name: 'xAxisSplitLine',
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
        ].filter(Boolean),
      },
      {
        name: 'yAxis',
        sections: [
          {
            name: 'label',
            effective: true,
            fields:
              type === 'bandX-linearY'
                ? [
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
                      defaultValue: percentage,
                    },
                  ]
                : [
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
                    defaultValue: 10,
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
          type === 'bandX-linearY' && {
            name: 'axisLine',
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
          type === 'bandX-linearY' && {
            name: 'axisSplitLine',
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
        ].filter(Boolean),
      },
    ],
  }
}
