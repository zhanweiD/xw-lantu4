/*
 * @Author: zhanwei
 * @Date: 2022-06-28 16:15:04
 * @LastEditors: zhanwei
 * @LastEditTime: 2022-06-29 18:02:47
 * @Description:
 */
export default () => {
  return {
    name: '标签组',
    type: 'tab',
    sections: [
      {
        name: 'dataMap',
        fields: [
          {
            name: 'column',
            defaultValue: ['性别'],
          },
        ],
      },
      {
        name: 'basic',
        fields: [
          {
            name: 'alignmentDirection',
          },
          {
            name: 'fontSize',
            defaultValue: 20,
          },
          {
            name: 'activeTextColor',
            defaultValue: 'rgb(90,153,243)',
          },
          {
            name: 'activeBorderWidth',
            defaultValue: 5,
            max: 50,
            min: 1,
          },
          {
            name: 'inactiveTextColor',
          },

          // {
          //   name: 'backgroundColor',
          //   defaultValue: 'rgb(0,0,0)',
          // },
          // {
          //   name: 'borderWidth',
          //   defaultValue: 2,
          //   max: 30,
          //   min: 1,
          // },
          // {
          //   name: 'activeBorderWidth',
          //   defaultValue: 5,
          //   max: 50,
          //   min: 1,
          // },
        ],
      },
      {
        name: 'background',
        effective: false,
        fields: [
          {
            name: 'activeColor',
            defaultValue: 'rgb(90,153,243)',
          },
          {
            name: 'inactiveColor',
          },
        ],
      },
    ],
  }
}
