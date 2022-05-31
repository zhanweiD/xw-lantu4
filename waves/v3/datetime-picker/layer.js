export default () => {
  return {
    name: '日期选择层',
    type: 'datetimePicker',
    sections: [
      {
        name: 'base',
        fields: [
          {
            name: 'width',
            defaultValue: 300,
          },
          {
            name: 'height',
            defaultValue: 40,
          },
          {
            name: 'fontSize',
            defaultValue: 20,
          },
          {
            name: 'scale',
            defaultValue: 1,
          },
          {
            name: 'backgroundColor',
            defaultValue: 'rgba(255,255,255,0.1)',
          },
          {
            name: 'pickerType',
            defaultValue: 'date',
          },
          {
            name: 'valueMethod',
            defaultValue: 'timePoint',
          },
        ],
      },
    ],
  }
}
