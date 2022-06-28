export default () => {
  return {
    name: '词云',
    type: 'wordCloud',
    sections: [
      // 标题
      {
        name: 'title',
        fields: [
          {
            name: 'titleVisible',
            defaultValue: true,
          },
          {
            name: 'titleSize',
            defaultValue: 22,
            max: 50,
            min: 8,
          },
          {
            name: 'titleColor',
            defaultValue: 'rgba(255, 255, 255, 1)',
          },
          {
            name: 'titleText',
            defaultValue: '其他网词频',
          },
          {
            name: 'titlePosition',
            defaultValue: 'left',
          },
          {
            name: 'titleOffset',
            defaultValue: [3, 5],
          },
        ],
      },
      // 单位
      {
        name: 'unit',
        fields: [
          {
            name: 'unitVisible',
            defaultValue: true,
          },
          {
            name: 'unitSize',
            defaultValue: 12,
            max: 50,
            min: 8,
          },
          {
            name: 'unitColor',
            defaultValue: 'rgba(255,255,255,0.65)',
          },
          {
            name: 'unitContent',
            defaultValue: '单位:热度',
          },
          {
            name: 'unitOffset',
            defaultValue: [10, 35],
          },
          {
            name: 'unitLowerSpacing',
            defaultValue: 16,
            min: 0,
            max: 200,
          },
        ],
      },
      // 图例
      {
        name: 'legend',
        fields: [
          {
            name: 'legendVisible',
            defaultValue: true,
          },
          {
            name: 'dataFilter',
            defaultValue: true,
          },
          {
            name: 'legendSize',
            defaultValue: 15,
            max: 100,
            min: 12,
          },
          {
            name: 'signFontColor',
            defaultValue: 'rgba(255,200,100,0.9)',
          },
          // 水品方向：左-中-右
          {
            name: 'legendAlign',
            defaultValue: 'RIGHT',
          },
          // 竖直方向：上-中-下
          {
            name: 'legendPosition',
            defaultValue: 'TOP',
          },
          {
            name: 'legendOffset',
            defaultValue: [0, 0],
          },
        ],
      },
      // 基础
      {
        name: 'base',
        fields: [
          {
            name: 'layoutType',
            defaultValue: 'ARCHIMEDEAN',
          },
        ],
      },
      // 词组
      {
        name: 'wordGroup',
        fields: [
          {
            name: 'fontSizeRange',
          },
          {
            name: 'opacityRange',
          },
          {
            name: 'cloudPadding',
            defaultValue: 7,
            min: 0,
            max: 200,
          },
          {
            name: 'cloudRotate',
            defaultValue: 0,
            min: -180,
            max: 180,
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
      // 动画
      {
        name: 'animation',
        fields: [
          {
            name: 'enableEnterAnimation',
            defaultValue: true,
          },
          {
            name: 'enterAnimationDuration',
            defaultValue: 2000,
            step: 200,
          },
          {
            name: 'enableLoopAnimation',
            defaultValue: true,
          },
          {
            name: 'loopAnimationDuration',
            defaultValue: 2000,
            step: 200,
          },
          {
            name: 'maxOffset',
            defaultValue: 20,
            min: 0,
            max: 100,
          },
        ],
      },
    ],
  }
}
