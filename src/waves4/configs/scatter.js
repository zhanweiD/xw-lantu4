export default ({pointSize = [10, 10]}) => {
  return {
    name: '散点图层',
    type: 'scatter',
    sections: [
      {
        name: 'base',
        fields: [
          {
            name: 'pointSize',
            type: 'multiNumber',
            option: 'pointSize',
            defaultValue: pointSize,
            items: [
              {
                key: '最小',
              },
              {
                key: '最大',
              },
            ],
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
