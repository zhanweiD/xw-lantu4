export const getRealData = (setData, dataSource, keys) => {
  try {
    if (!dataSource) return {}
    if (!keys) return setData(dataSource)
    const headers = dataSource[0]
    const indexs = keys.map((key) => headers.findIndex((value) => value === key))
    const filterData = dataSource.map((row) => indexs.map((index) => row[index]))
    return setData(filterData)
  } catch (e) {
    console.error('数据解析失败', {dataSource})
    return []
  }
}
