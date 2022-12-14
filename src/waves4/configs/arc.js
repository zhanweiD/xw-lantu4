export default ({mode = 'default', type = 'pie', innerRadius = 0, labelPosition = 'outer', column = []}) => {
  return {
    name: '圆弧',
    type: 'arc',
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
                key: 'default',
                value: 'default',
              },
              {
                key: 'stack',
                value: 'stack',
              },
            ],
          },
          {
            name: 'custom',
            option: 'type',
            label: 'type',
            defaultValue: type,
            options: [
              {
                key: 'pie',
                value: 'pie',
              },
              {
                key: 'nightingaleRose',
                value: 'nightingaleRose',
              },
            ],
            type: 'select',
          },
          {
            name: 'innerRadius',
            type: 'number',
            option: 'innerRadius',
            defaultValue: innerRadius,
          },
        ],
        // sections: [
        //   {
        //     name: 'color',
        //     effective: false,
        //     fields: [
        //       {
        //         name: 'singleColor',
        //         defaultValue: 'rgba(52,200,254,1)',
        //       },
        //     ],
        //   },
        // ],
        sections: [
          {
            name: 'color',
            effective: false,
            fields: [{name: 'colorList'}],
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
              // TODO: 值有问题，不对应
              {
                key: 'wave.center',
                value: 'inner',
              },
              {
                key: 'wave.topOuter',
                value: 'outer',
              },
            ],
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
    ],
  }
}
