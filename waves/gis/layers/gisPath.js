export default () => {
  return {
    name: '轨迹线层',
    type: 'gisPath', // 必要
    sections: [
      {
        name: 'base',
        fields: [
          {name: 'showPath'},
          {name: 'pathWidth'},
          {name: 'pathColor'},
          {name: 'rounded'},
          {name: 'showTrail'},
          {name: 'trailWidth'},
          {name: 'trailLength'},
          {name: 'trailColor'},
          {name: 'trailSpeed'},
          {name: 'showEndVertex'},
          {name: 'endVertexColor'},
          {name: 'endVertexSize'},
          {name: 'showVertex'},
          {name: 'vertexColor'},
          {name: 'vertexSize'},
        ],
      },
    ],
    data: [
      ['vendor', 'path', 'timestamps'],
      [
        0,
        [
          [120, 30],
          [120.20986, 30.81773],
          [120.20987, 30.81765],
          [120.20998, 30.81746],
          [120.21062, 30.81682],
          [120.21002, 30.81644],
          [120.21084, 30.81536],
          [120.21142, 30.8146],
          [120.20965, 30.81354],
          [120.21166, 30.81158],
          [120.21247, 30.81073],
          [120.21294, 30.81019],
          [120.21302, 30.81009],
          [120.21055, 30.80768],
          [120.20995, 30.80714],
          [120.20674, 30.80398],
          [120.20659, 30.80382],
          [120.20634, 30.80352],
          [120.20466, 30.80157],
        ],
        [
          1190, 1191, 1193.803, 1205.321, 1249.883, 1277.923, 1333.85, 1373.257, 1451.769, 1527.939, 1560.114, 1579.966,
          1583.555, 1660.904, 1678.797, 1779.882, 1784.858, 1793.853, 1868.948,
        ],
      ],
      [
        1,
        [
          [120, 30],
          [120.03806, 30.74578],
          [120.03893, 30.74289],
          [120.03934, 30.74158],
          [120.0384, 30.74142],
          [120.03746, 30.74126],
          [120.03824, 30.73872],
          [120.03878, 30.73693],
          [120.03893, 30.73693],
          [120.03974, 30.73704],
          [120.03979, 30.7369],
          [120.03964, 30.73677],
          [120.03916, 30.73685],
          [120.03881, 30.73686],
          [120.03854, 30.73684],
          [120.03864, 30.73655],
          [120.03879, 30.73571],
          [120.03943, 30.73155],
          [120.03954, 30.7308],
          [120.03791, 30.73066],
          [120.03782, 30.73065],
          [120.03789, 30.73024],
          [120.03795, 30.72999],
          [120.03797, 30.72988],
          [120.03798, 30.7298],
          [120.0368, 30.7298],
          [120.03646, 30.72977],
          [120.03613, 30.72971],
          [120.03604, 30.72969],
          [120.03222, 30.72883],
        ],
        [
          1250, 1252, 1322.247, 1354.152, 1376.76, 1399.368, 1465.21, 1511.568, 1513.634, 1524.966, 1528.315, 1531.664,
          1538.363, 1546.856, 1553.434, 1562.913, 1589.717, 1722.155, 1746.018, 1753.951, 1754.391, 1763.725, 1769.463,
          1770.434, 1771.137, 1784.274, 1788.085, 1791.863, 1792.908, 1822.248,
        ],
      ],
    ],
  }
}
