export default () => {
  return {
    name: '开关层',
    type: 'switch',
    sections: [
      {
        name: 'base',
        fields: [
          {
            name: 'radius',
            defaultValue: 30,
          },
          {
            name: 'pointSizeItem',
            defaultValue: 25,
          },
          {
            name: 'pointColor',
            defaultValue: 'rgba(0,0,0,1)',
          },
          {
            name: 'activeBackgroundColor',
            defaultValue: 'rgba(255,255,255,0.1)',
          },
          {
            name: 'inactiveBackgroundColor',
            default: 'rgba(255,255,255,0.1)',
          },
        ],
      },
    ],
  }
}
