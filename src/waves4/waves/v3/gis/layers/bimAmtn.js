export default () => {
  return {
    name: '倾斜摄影层',
    type: 'bimAmtn', // 必要
    sections: [
      {
        name: 'base',
        fields: [{name: 'elevation'}],
      },
    ],
    data: [
      ['日期', 'CPI'],
      ['2018-3', 98.9],
      ['2018-4', 99.8],
      ['2018-5', 99.8],
      ['2018-6', 99.9],
      ['2018-7', 100.3],
      ['2018-8', 100.7],
    ],
  }
}
