export default () => {
  return {
    name: '符号层',
    type: 'gisIcon', // 必要
    sections: [
      {
        name: 'base',
        fields: [
          {name: 'iconSize'},
          {name: 'showLabel'},
          {name: 'labelSize', defaultValue: 16},
          {name: 'labelColor'},
          {name: 'billboard'},
          {name: 'getAngle'},
          {name: 'getTextAnchor'},
          {name: 'getAlignmentBaseline'},
        ],
      },
    ],
    data: [
      ['name', 'coordinates', 'url'],
      [
        'name1',
        [120, 30.66033],
        'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2442415550,512389431&fm=26&gp=0.jpg',
      ],
      [
        'name2',
        [120.1, 30.66033],
        'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2442415550,512389431&fm=26&gp=0.jpg',
      ],
      [
        'name3',
        [120.2, 30.66033],
        'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2442415550,512389431&fm=26&gp=0.jpg',
      ],
    ],
  }
}
