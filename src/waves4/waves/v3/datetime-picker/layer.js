export default () => {
  return {
    name: '日期选择层',
    type: 'datetimePicker',
    sections: [
      {
        name: 'base',
        fields: [
          {
            name: 'fontSize',
            defaultValue: 20,
          },
          {
            name: 'calanderThemeColor',
            defaultValue: 'rgba(1,28,69,0.50)',
          },
          {
            name: 'pickerType',
            defaultValue: 'month',
            options: [
              {
                key: '月',
                value: 'month',
              },
              {
                key: '年',
                value: 'year',
              },
              {
                key: '10年',
                value: 'decade',
              },
              {
                key: '世纪',
                value: 'century',
              },
            ],
          },
          {
            name: 'valueMethod',
            defaultValue: 'timePoint',
          },
          {
            name: 'connectLineType',
            defaultValue: 'wavyline',
          },
          {
            name: 'isDisabled',
            defaultValue: false,
          },
        ],
      },
    ],
  }
}
