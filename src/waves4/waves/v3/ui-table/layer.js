export default () => {
  return {
    name: '表格',
    type: 'table',
    sections: [
      // 基础
      {
        name: 'base',
        fields: [
          {
            name: 'adapterContainer',
            defaultValue: false,
          },
          {
            name: 'rowNumber',
            defaultValue: 100,
          },
          {
            name: 'lineSpacing',
            defaultValue: 5,
          },
          {
            name: 'columnSpacing',
            defaultValue: 5,
          },
        ],
      },
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
            defaultValue: 25,
            max: 50,
            min: 8,
          },
          {
            name: 'titleColor',
            defaultValue: 'rgba(255, 255, 255, 1)',
          },
          {
            name: 'titleBackground',
            defaultValue: 'rgba(255, 255, 255, 0)',
          },
          {
            name: 'titleText',
            defaultValue: '2019年分学科硕士招生数',
          },
          {
            name: 'titlePosition',
            defaultValue: 'left',
          },
          {
            name: 'titleLowerSpacing',
            defaultValue: 20,
            min: 0,
            max: 200,
          },
        ],
      },
      // 表头
      {
        name: 'tableHead',
        fields: [
          {
            name: 'headVisible',
            defaultValue: true,
          },
          {
            name: 'headFontSize',
            defaultValue: 20,
          },
          {
            name: 'headFontColor',
            defaultValue: 'rgb(255,255,255)',
          },
          {
            name: 'headBackground',
            defaultValue: 'rgba(255,255,255,0)',
          },
          {
            name: 'headPosition',
            defaultValue: 'left',
          },
        ],
      },
      // 单元格
      {
        name: 'tableCell',
        fields: [
          {
            name: 'isAutoWidth',
            defaultValue: false,
          },
          {
            name: 'cellWidth',
            defaultValue: 200,
          },
          {
            name: 'cellHeight',
            defaultValue: 30,
          },
          {
            name: 'cellFontSize',
            defaultValue: 20,
          },
          {
            name: 'cellFontColor',
            defaultValue: 'rgb(255,255,255)',
          },
          {
            name: 'cellBackground',
            defaultValue: 'rgba(255,255,255,0.1)',
          },
        ],
      },
      // 动画
      {
        name: 'animation',
        fields: [
          {
            name: 'enableLoopAnimation',
            defaultValue: false,
          },
          {
            name: 'loopAnimationDuration',
            defaultValue: 2000,
            step: 200,
          },
          {
            name: 'loopAnimationDelay',
            defaultValue: 2000,
            step: 200,
          },
        ],
      },
    ],
  }
}
