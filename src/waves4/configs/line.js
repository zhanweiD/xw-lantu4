export default ({lineCurve = 'curveLinear', hasArea = false, axis = 'main', column = []}) => {
  return {
    name: '折线层',
    type: 'line',
    sections: [
      {
        name: 'dataMap',
        fields: [
          {
            name: 'column',
            defaultValue: column,
          },
        ],
      },
      {
        name: 'base',
        fields: [
          {
            name: 'axisBinding',
            defaultValue: axis,
          },
          // {
          //   name: 'custom',
          //   option: 'mode',
          //   label: 'mode',
          //   defaultValue: mode,
          //   type: 'select',
          //   options: [
          //     {
          //       key: 'group',
          //       value: 'group',
          //     },
          //     {
          //       key: 'stack',
          //       value: 'stack',
          //     },
          //   ],
          // },
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
            defaultValue: lineCurve,
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
        effective: hasArea,
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
                defaultValue: 'rgba(0,0,0,1)',
              },
            ],
          },
        ],
      },
      {
        name: 'unit',
        fields: [
          {name: 'show', defaultValue: false},
          {name: 'textSize', defaultValue: 12},
          {name: 'singleColor', defaultValue: 'rgba(255,255,255,0.5)'},
          {name: 'offset', defaultValue: [0, 48]},
          {name: 'content', defaultValue: '单位'},
        ],
      },
      {
        name: 'tooltip',
        fields: [{name: 'show', defaultValue: false}],
      },
      {
        name: 'animation',
        sections: [
          {
            name: 'enterAnimation',
            fields: [{name: 'animationType'}, {name: 'duration'}, {name: 'delay'}],
          },
          {
            name: 'loopAnimation',
            fields: [
              {name: 'animationType', defaultValue: 'scan'},
              {name: 'duration'},
              {name: 'delay', defaultValue: 2000},
              {name: 'singleColor', defaultValue: 'rgba(255, 255, 255, 1)'},
              {name: 'animationDirection'},
              {name: 'scope'},
            ],
          },
        ],
      },
    ],
  }
}
