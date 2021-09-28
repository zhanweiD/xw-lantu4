export default ({
  column = [],
  axis = 'main',
  type = 'column',
  mode = 'group',
  labelPosition = ['center', 'center'],
}) => {
  return {
    name: '矩形层',
    type: 'rect',
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
          {
            name: 'custom',
            option: 'type',
            label: 'type',
            defaultValue: type,
            type: 'check',
            options: [
              {
                key: 'column',
                value: 'column',
              },
              {
                key: 'bar',
                value: 'bar',
              },
            ],
          },
          {
            name: 'custom',
            option: 'mode',
            label: 'mode',
            defaultValue: mode,
            type: 'select',
            options: [
              {
                key: 'group',
                value: 'group',
              },
              {
                key: 'stack',
                value: 'stack',
              },
              {
                key: 'interval',
                value: 'interval',
              },
              {
                key: 'waterfall',
                value: 'waterfall',
              },
              {
                key: 'percentage',
                value: 'percentage',
              },
            ],
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
        name: 'background',
        effective: false,
        fields: [
          {
            name: 'singleColor',
            defaultValue: 'rgb(255,255,255)',
          },
          {
            name: 'opacity',
            defaultValue: 0.3,
          },
        ],
      },
      {
        name: 'label',
        effective: true,
        fields: [
          {
            name: 'custom',
            type: 'select',
            label: 'maxPosition',
            option: 'maxLabelPosition',
            defaultValue: Array.isArray(labelPosition) ? labelPosition[1] : labelPosition,
            options: [
              {
                key: 'wave.center',
                value: 'center',
              },
              {
                key: 'wave.topInner',
                value: 'top-inner',
              },
              {
                key: 'wave.topOuter',
                value: 'top-outer',
              },
              {
                key: 'wave.rightInner',
                value: 'right-inner',
              },
              {
                key: 'wave.rightOuter',
                value: 'right-outer',
              },
              {
                key: 'wave.bottomInner',
                value: 'bottom-inner',
              },
              {
                key: 'wave.bottomOuter',
                value: 'bottom-outer',
              },
              {
                key: 'wave.leftInner',
                value: 'left-inner',
              },
              {
                key: 'wave.leftOuter',
                value: 'left-outer',
              },
            ],
          },
          {
            name: 'custom',
            type: 'select',
            label: 'minPosition',
            option: 'minLabelPosition',
            defaultValue: Array.isArray(labelPosition) ? labelPosition[0] : labelPosition,
            options: [
              {
                key: 'wave.center',
                value: 'center',
              },
              {
                key: 'wave.topInner',
                value: 'top-inner',
              },
              {
                key: 'wave.topOuter',
                value: 'top-outer',
              },
              {
                key: 'wave.rightInner',
                value: 'right-inner',
              },
              {
                key: 'wave.rightOuter',
                value: 'right-outer',
              },
              {
                key: 'wave.bottomInner',
                value: 'bottom-inner',
              },
              {
                key: 'wave.bottomOuter',
                value: 'bottom-outer',
              },
              {
                key: 'wave.leftInner',
                value: 'left-inner',
              },
              {
                key: 'wave.leftOuter',
                value: 'left-outer',
              },
            ],
          },
          {
            name: 'offset',
            defaultValue: [0, 0],
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
            defaultValue: mode === 'percentage',
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
    ],
  }
}
