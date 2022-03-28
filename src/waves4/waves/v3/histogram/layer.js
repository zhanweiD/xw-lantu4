export default () => {
  return {
    name: '锤子沙漏',
    type: 'renju', // 必要
    sections: [
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
        name: 'legend',
        fields: [
          {
            name: 'show',
            defaultValue: true,
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
        name: 'value',
        fields: [
          {
            name: 'valueSize',
            defaultValue: 12,
          },
          {
            name: 'valueColor',
            defaultValue: 'RGBA(255, 255, 255, 0.65)',
          },
        ],
      },
    ],
  }
}
