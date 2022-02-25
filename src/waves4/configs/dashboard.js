export default ({type, name}) => {
  return {
    name,
    type: 'dashboard',
    sections:
      type === 'dashboard'
        ? [
            {
              name: 'line',
              fields: [
                {
                  name: 'lineWidth',
                  defaultValue: 10,
                  min: 1,
                  max: 50,
                },
                {
                  name: 'tickSize',
                  defaultValue: 10,
                },
              ],
            },
            {
              name: 'text',
              sections: [
                {
                  name: 'centerText',
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
                    {
                      name: 'offset',
                      defaultValue: [0, -20],
                    },
                  ],
                },
                {
                  name: 'outsideText',
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
                    {
                      name: 'offset',
                      defaultValue: [0, 0],
                    },
                  ],
                },
                {
                  name: 'circleText',
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
              ],
            },
          ]
        : [
            {
              name: 'line',
              fields: [
                {
                  name: 'lineWidth',
                  defaultValue: 10,
                  min: 1,
                  max: 50,
                },
              ],
            },
            {
              name: 'text',
              sections: [
                {
                  name: 'centerText',
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
                    {
                      name: 'offset',
                      defaultValue: [0, 20],
                    },
                  ],
                },
                {
                  name: 'outsideText',
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
                    {
                      name: 'offset',
                      defaultValue: [0, 0],
                    },
                  ],
                },
              ],
            },
          ],
  }
}
