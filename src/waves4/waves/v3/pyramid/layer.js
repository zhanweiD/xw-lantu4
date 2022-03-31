export default () => {
  return {
    name: '金字塔',
    type: 'pyramid', // 必要
    sections: [
      {
        name: 'basic',
        fields: [
          {
            name: 'orderType',
            defaultValue: 'DEFAULT',
          },
          {
            name: 'DIRECTION',
            defaultValue: 'HORIZONTAL',
          },
          {
            name: 'padding',
            defaultValue: [40, 40, 40, 40],
          },
        ],
      },
      {
        name: 'title',
        fields: [
          {
            name: 'show',
            defaultValue: true,
          },
          {
            name: 'content',
            defaultValue: '中等职业教育分布情况',
          },
          {
            name: 'textSize',
            defaultValue: 12,
          },
          {
            name: 'singleColor',
            defaultValue: 'rgb(255,255,255)',
          },
        ],
      },
      {
        name: 'label',
        fields: [
          {
            name: 'labelSize',
            defaultValue: 12,
          },
          {
            name: 'labelColor',
            defaultValue: 'rgba(255, 255, 255, 0.65)',
          },
          {
            name: 'gap',
            defaultValue: 10,
            min: 0,
            max: 50,
          },
        ],
      },
      {
        name: 'xAxis',
        fields: [
          {
            name: 'textSize',
            defaultValue: 12,
            min: 8,
            max: 50,
          },
          {
            name: 'tickCount',
            defaultValue: 8,
            min: 0,
            max: 20,
          },
          {
            name: 'opacity',
            defaultValue: 0.2,
            min: 0,
            max: 1,
            step: 0.1,
          },
          {
            name: 'singleColor',
            defaultValue: 'rgba(255, 255, 255, 0.65)',
          },
          {
            name: 'labelOffset',
            defaultValue: 0,
            min: -50,
            max: 50,
          },
        ],
      },
      {
        name: 'value',
        fields: [
          {
            name: 'valueVisible',
            defaultValue: true,
          },
          {
            name: 'valueInPosition',
            defaultValue: 'inside',
          },
          {
            name: 'decimalNumber',
            defaultValue: 0,
          },
          {
            name: 'groupBarGap',
            defaultValue: 0,
            min: 0,
            max: 20,
            step: 0.1,
          },
          {
            name: 'valueSize',
            defaultValue: 12,
          },
          {
            name: 'singleColor',
            defaultValue: 'rgba(255, 255, 255, 0.65)',
          },
          {
            name: 'width',
            defaultValue: 0,
            min: 0,
            max: 50,
          },
          {
            name: 'showShadow',
            defaultValue: false,
          },
          {
            name: 'shadowOptions',
            defaultValue: [0, 0, 5],
          },
          {
            name: 'noLabelColor',
            defaultValue: 'rgba(255, 255, 255, 0.65)',
          },
        ],
      },
    ],
  }
}