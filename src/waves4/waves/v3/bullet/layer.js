export default () => {
  return {
    name: '子弹柱状',
    type: 'bulletColumn', // 必要
    sections: [
      {
        name: 'base',
        fields: [
          {
            name: 'trackHeight',
            defaultValue: 20,
          },
          {
            name: 'trackBagHeight',
            defaultValue: 20,
          },
          {
            name: 'thresholdHeight',
            defaultValue: 20,
          },
          {
            name: 'trackBagColor',
            defaultValue: 'rgba(255,255,255,0.2)',
          },
          {
            name: 'thresholdWidth',
            defaultValue: 4,
          },
          {
            name: 'trackShow',
            defaultValue: true,
          },
        ],
        sections: [
          {
            name: 'color',
            effective: false,
            fields: [
              {
                name: 'colorType2',
                defaultValue: 'customColors',
              },
              {
                name: 'singleColor',
                defaultValue: 'rgba(52,200,254,1)',
              },
              {
                name: 'rangeColors',
                effective: false,
              },
            ],
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
        name: 'label',
        fields: [
          {
            name: 'show',
            defaultValue: true,
          },
          {
            name: 'labelSize',
            defaultValue: 12,
          },
          {
            name: 'labelColor',
            defaultValue: 'rgba(255, 255, 255, 0.65)',
          },
          {
            name: 'showLabelValue',
            defaultValue: true,
          },
          {
            name: 'labelValueColor',
            defaultValue: 'rgba(255, 255, 255, 0.65)',
          },
          {
            name: 'labelPosition',
            defaultValue: 'TOP',
          },
          {
            name: 'labelYOffset',
            defaultValue: 0,
          },
          {
            name: 'labelXOffset',
            defaultValue: 0,
          },
          {
            name: 'labelRightGap',
            defaultValue: 40,
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
            name: 'valueSize',
            defaultValue: 12,
          },
          {
            name: 'valueWidth',
            defaultValue: 700,
          },
          {
            name: 'valueColor',
            defaultValue: 'RGBA(255, 255, 255, 0.65)',
          },
          {
            name: 'valuePosition',
            defaultValue: 'TOP',
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
