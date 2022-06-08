export default ({type = 'horizontal'}) => {
  return {
    effective: false,
    sections: [
      {
        name: 'calibration',
        fields: [
          {
            name: 'calibrationTitle',
            defaultValue: '刻度线',
          },
          {
            name: 'calibrationValue',
            defaultValue: 0,
            min: 0,
            max: Infinity,
          },
          {
            name: 'direction',
            defaultValue: type,
            options: [
              {
                key: type,
                value: type,
              },
            ],
          },
        ],
      },
      {
        name: 'text',
        fields: [
          {
            name: 'relativePosition',
            defaultValue: 'right',
          },
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
        name: 'line',
        fields: [
          {
            name: 'lineWidth',
            default: 1,
          },
          {
            name: 'singleColor',
            defaultValue: 'rgb(255,255,255)',
          },
          {
            name: 'opacity',
            defaultValue: 0.5,
          },
          {
            name: 'dasharrayLength',
            defaultValue: 0,
          },
          {
            name: 'dasharraySpacing',
            defaultValue: 0,
          },
        ],
      },
    ],
  }
}
