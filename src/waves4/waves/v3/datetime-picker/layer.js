/*
 * @Author: zhanwei
 * @Date: 2022-07-01 17:31:14
 * @LastEditors: zhanwei
 * @LastEditTime: 2022-07-19 16:31:20
 * @Description:
 */
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
                key: '日',
                value: 'date',
              },
              {
                key: '周',
                value: 'week',
              },
              {
                key: '月',
                value: 'month',
              },
              {
                key: '年',
                value: 'year',
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
