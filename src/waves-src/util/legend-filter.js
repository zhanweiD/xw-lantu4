/**
 * 
 * @param {object} _this 图表对象，这里主要是为了调用 update 函数
 * @param {object} _data 图表数据（老格式）
 * @param {function} getLegends 自变量获取函数，从老的数据对象中取标注
 * @param {function} getLegends 自变量设置函数，从老的数据对象中设置标注
 * @param {function} getData 因变量获取函数，从老的数据对象中取数据
 * @param {function} getData 因变量设置函数，从老的数据对象中设置数据
 */
export const createFilter = (_this, _data, getLegends, setLegends, getData, setData) => {
  // 取出数据做备份
  const {legends, data} = _data
  // 针对每一个图表的激活状态向量
  const labelStatus = legends.map(item => ({label: item.label, isActive: true}))

  return ({legend, isActive}) => {
    // 重置数据
    let filteredData = data
    // 设置改变的图例状态
    labelStatus.find(item => item.label === legend).isActive = isActive
    // 筛选数据
    filteredData = filteredData.map(dataItem => {
      const independent = getLegends(dataItem)
      const dependent = getData(dataItem)
      const newIndependent = []
      const newDependent = []
      
      if (!independent || !dependent) {
        console.error('数据格式错误')
        return null
      }

      // 检查激活状态，更新新数据
      for (let i = 0; i < independent.length; i++) {
        if (labelStatus.find(item => item.label === independent[i]).isActive) {
          newIndependent.push(independent[i])
          newDependent.push(dependent[i])
        }
      }

      const result = {...dataItem}
      setLegends(_data, newIndependent)
      setData(_data, newDependent)
      return result
    })

    // 通过引用更新数据，这么写是为了方便，拓展性较差
    _data.data = filteredData
    _this.update()
  }
}
