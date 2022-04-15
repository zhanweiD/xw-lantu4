export default ({mode = 'stack', hasArea = true, column = [], labelPosition = 'center'}) => {
  return {
    name: '雷达',
    type: 'radar',
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
            ],
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
        name: 'line',
        fields: [
          {
            name: 'lineWidth',
            defaultValue: 2,
          },
        ],
      },
      {
        name: 'point',
        fields: [
          {
            name: 'size',
            defaultValue: 6,
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
            label: 'position',
            option: 'labelPosition',
            defaultValue: labelPosition,
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
      {
        name: 'tooltip',
        fields: [{name: 'show', defaultValue: false}],
      },
    ],
  }
}
