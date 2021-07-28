export const createTableListData = () => {
  const originalData = [
    ["年份", "中等专业学校", "成人中专", "职业高中", "技工学校"],
    ["1985", 157.1, 40, 184.3, 74.2],
    ["1990", 224.4, 158.8, 247.1, 133.2],
    ["2000", 489.5, 169.3, 414.6, 140.1],
    ["2005", 629.8, 112.5, 582.4, 275.3],
    ["2007", 781.6, 113, 725.2, 367.1],
    ["2009", 840.4, 161, 778.4, 398.8],
    ["2011", 855.2, 238.7, 681, 430.4],
    ["2013", 772.2, 230, 534.2, 386.6],
    ["2015", 732.7, 162.7, 439.9, 321.5],
    ["2016", 718.1, 141.2, 416.6, 323.2]
  ]
  const column = Math.floor(Math.random() * (originalData[0].length - 4) + 4)
  const row = Math.floor(Math.random() * (originalData.length - 6) + 3)
  const finalData = originalData
    .slice(0, row + 1)
    .map((item) => item.slice(0, column + 1))
  return finalData
}

export const createTableData = () => {
  const rows = [
    "2008",
    "2009",
    "2010",
    "2011",
    "2012",
    "2013",
    "2014",
    "2015",
    "2016",
    "2017",
    "2018"
  ]
  const columns = [
    "河北",
    "山西",
    "辽宁",
    "黑龙江",
    "江苏",
    "浙江",
    "安徽",
    "福建",
    "江西",
    "山东",
    "河南"
  ]
  const data = [
    [1811, 1871, 1951, 2006, 2063, 2108, 2098, 2141, 2191, 2328, 2457],
    [1979, 2050, 2132, 2202, 2351, 2474, 2519, 2504, 2439, 2401, 2383],
    [2621, 2659, 2671, 2712, 2811, 2903, 2933, 2876, 2845, 2859, 2866],
    [2352, 2420, 2447, 2409, 2441, 2529, 2555, 2518, 2427, 2403, 2405],
    [2679, 2786, 2819, 2824, 2786, 2814, 2858, 2896, 2937, 3045, 3143],
    [2324, 2303, 2285, 2218, 2288, 2363, 2408, 2414, 2355, 2345, 2370],
    [1658, 1742, 1841, 2007, 2101, 2203, 2245, 2309, 2259, 2250, 2245],
    [1937, 2039, 2144, 2200, 2301, 2435, 2513, 2508, 2438, 2352, 2355],
    [2062, 2118, 2162, 2212, 2295, 2381, 2527, 2654, 2698, 2676, 2771],
    [2071, 2153, 2202, 2191, 2238, 2304, 2421, 2516, 2620, 2519, 2588],
    [1648, 1774, 1839, 1901, 2012, 2114, 2203, 2293, 2352, 2455, 2653]
  ]
  const columnNumber = Math.floor(Math.random() * (rows.length - 7) + 7)
  const rowNumber = Math.floor(Math.random() * (columns.length - 7) + 7)
  const finalData = [
    rows.slice(0, rowNumber),
    columns.slice(0, columnNumber),
    data.slice(0, rowNumber).map((array) => array.slice(0, columnNumber))
  ]
  return finalData
}

export const createGaugeData = (type) => {
  const value = Math.floor(Math.random() * 100)
  return {
    value,
    label: type === "gauge" ? "仪表盘" : "环形指标卡",
    fragments:
      type === "gauge"
        ? [
            [0, 30, "低"],
            [30, 60, "中"],
            [60, 100, "高"]
          ]
        : [
            [0, value, "当前"],
            [value, 100, "剩余"]
          ]
  }
}

export const createSankeyData = () => {
  const nodes = [
    ["name"],
    ["一年级"],
    ["二年级"],
    ["三年级"],
    ["四年级"],
    ["五年级"],
    ["六年级"],
    ["受过学前教育"],
    ["少数民族"],
    ["五年制"],
    ["九年一贯制学校"],
    ["十二年一贯制学校"],
    ["在校生数"],
    ["招生数"]
  ]
  const links = [
    ["from", "to", "value"],
    ["一年级", "少数民族", 2400624],
    ["二年级", "少数民族", 2283704],
    ["三年级", "少数民族", 2134564],
    ["四年级", "少数民族", 2094022],
    ["五年级", "少数民族", 2010922],
    ["六年级", "少数民族", 1904885],
    ["一年级", "五年制", 568079],
    ["二年级", "五年制", 567358],
    ["三年级", "五年制", 529367],
    ["四年级", "五年制", 517509],
    ["五年级", "五年制", 506344],
    ["一年级", "九年一贯制学校", 2094962],
    ["二年级", "九年一贯制学校", 2061417],
    ["三年级", "九年一贯制学校", 1956352],
    ["四年级", "九年一贯制学校", 1963816],
    ["五年级", "九年一贯制学校", 1973973],
    ["六年级", "九年一贯制学校", 1868869],
    ["受过学前教育", "少数民族", 2342952],
    ["受过学前教育", "五年制", 566962],
    ["受过学前教育", "九年一贯制学校", 2078893],
    ["受过学前教育", "十二年一贯制学校", 251227],
    ["招生数", "受过学前教育", 5240034],
    ["在校生数", "一年级", 5316946],
    ["在校生数", "二年级", 5161013],
    ["在校生数", "三年级", 4847000],
    ["在校生数", "四年级", 4801482],
    ["在校生数", "五年级", 4729154],
    ["在校生数", "六年级", 4015254]
  ]
  return [nodes, links]
}

export const createEdgeBundleData = () => {
  const nodes = [
    ["name", "value", "category"],
    ["清华", 15, "大学"],
    ["浙大", 25, "大学"],
    ["复旦", 53, "大学"],
    ["交大", 45, "大学"],
    ["北大", 45, "大学"],
    ["慈溪中学", 48, "宁波高中"],
    ["镇海中学", 82, "宁波高中"],
    ["富阳中学", 67, "杭州高中"],
    ["杭州二中", 23, "杭州高中"],
    ["余姚中学", 98, "上海高中"],
    ["曹杨二中", 1, "上海高中"],
    ["复旦附中", 34, "上海高中"],
    ["华师大二附中", 41, "上海高中"],
    ["交大附中", 43, "上海高中"],
    ["交附嘉定", 71, "上海高中"],
    ["上海中学", 34, "上海高中"],
    ["松江二中", 99, "上海高中"],
    ["敬业中学", 86, "上海高中"],
    ["上外附中", 40, "上海高中"],
    ["上外浦外", 88, "上海高中"],
    ["吴淞中学", 19, "上海高中"],
    ["向明中学", 40, "上海高中"]
  ]
  const links = [
    ["from", "to"],
    ["慈溪中学", "清华"],
    ["慈溪中学", "浙大"],
    ["慈溪中学", "复旦"],
    ["慈溪中学", "交大"],
    ["富阳中学", "清华"],
    ["富阳中学", "浙大"],
    ["富阳中学", "复旦"],
    ["富阳中学", "交大"],
    ["杭州二中", "清华"],
    ["杭州二中", "浙大"],
    ["杭州二中", "复旦"],
    ["杭州二中", "交大"],
    ["镇海中学", "清华"],
    ["镇海中学", "浙大"],
    ["镇海中学", "复旦"],
    ["镇海中学", "交大"],
    ["余姚中学", "清华"],
    ["曹杨二中", "北大"],
    ["曹杨二中", "复旦"],
    ["曹杨二中", "交大"],
    ["复旦附中", "北大"],
    ["复旦附中", "清华"],
    ["复旦附中", "复旦"],
    ["复旦附中", "交大"],
    ["复旦附中", "浙大"],
    ["华师大二附中", "北大"],
    ["华师大二附中", "清华"],
    ["华师大二附中", "复旦"],
    ["华师大二附中", "交大"],
    ["交大附中", "北大"],
    ["交大附中", "清华"],
    ["交大附中", "复旦"],
    ["交大附中", "交大"],
    ["交附嘉定", "清华"],
    ["交附嘉定", "复旦"],
    ["交附嘉定", "交大"],
    ["交附嘉定", "浙大"],
    ["上海中学", "北大"],
    ["上海中学", "清华"],
    ["上海中学", "复旦"],
    ["上海中学", "交大"],
    ["松江二中", "清华"],
    ["松江二中", "复旦"],
    ["松江二中", "交大"],
    ["敬业中学", "北大"],
    ["敬业中学", "浙大"],
    ["上外附中", "清华"],
    ["上外附中", "交大"],
    ["上外附中", "浙大"],
    ["上外浦外", "北大"],
    ["上外浦外", "清华"],
    ["上外浦外", "复旦"],
    ["上外浦外", "交大"],
    ["吴淞中学", "清华"],
    ["吴淞中学", "复旦"],
    ["吴淞中学", "交大"],
    ["吴淞中学", "浙大"],
    ["向明中学", "北大"],
    ["向明中学", "复旦"],
    ["向明中学", "交大"],
    ["向明中学", "浙大"]
  ]
  return [nodes, links]
}
