export default () => {
  return {
    name: '进度条',
    type: 'progress', // 必要
    sections: [
      {
        name: 'basic',
        fields: [
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
            name: 'show',
            defaultValue: true,
          },
          {
            name: 'labelSize',
            defaultValue: 24,
          },
          {
            name: 'labelColor',
            defaultValue: 'rgba(255, 255, 255, 0.65)',
          },
          {
            name: 'decimalNumber',
            defaultValue: 0,
            min: 0,
            max: 5,
          },
          {
            name: 'labelYOffset',
            defaultValue: 0,
          },
        ],
      },
      {
        name: 'rect',
        fields: [
          {
            name: 'height',
            defaultValue: 40,
            min: 0,
            max: 200,
          },
          {
            name: 'trackBagHeight',
            defaultValue: 40,
            min: 0,
            max: 200,
          },
          {
            name: 'arcBackgroundColor',
            defaultValue: 'RGBA(255, 255, 255, 0.65)',
          },
        ],
      },
    ],
  }
}
