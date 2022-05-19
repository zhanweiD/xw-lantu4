export default () => {
  return {
    name: '开关层',
    type: 'switchs',
    sections: [
      {
        name: 'base',
        fields: [
          {
            name: 'radius',
            defaultValue: 50,
          },
          {
            name: 'pointSizes',
            defaultValue: 25,
          },
          {
            name: 'pointColor',
            defaultValue: 'rgba(0,0,0,1)',
          },
          {
            name: 'activeColor',
            defaultValue: 'rgb(0,119,255,1)',
          },
          {
            name: 'inactiveColor',
            defaultValue: 'rgba(255,255,255,0.1)',
          },
        ],
      },
    ],
  }
}
