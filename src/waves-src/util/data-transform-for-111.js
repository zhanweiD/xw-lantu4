// import IDataStructure from '../interfaces/idata'
import dataUtil from './data'

/**
 * @description 针对 1.1.1 格式数据的处理
 * @export
 * @param {IDataStructure} source
 * @returns 
 */
export default function dataTransform(source) {
  const datas = []
  
  const valueUnit = source.valueUnit[0]
  const valueDescription = source.valueDescription[0]

  const data = dataUtil.classify(source, true)[0].labels.map(d => d.data[0])
  
  data.forEach(d => {
    const label = d.dimensions[0]
    datas.push({
      value: d.values[0],
      label,
      origin: [d], // 保存源数据
      // id: d.id,
    })
  })

  return {
    valueUnit,
    valueDescription,
    datas,
  }
}
