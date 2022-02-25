export default ({pointSize = [10, 10]}) => {
  return {
    name: '散点',
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
            ]
          },
        ]
      }
    ]
  }
}