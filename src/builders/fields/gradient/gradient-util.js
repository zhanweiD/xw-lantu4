import isPlainObject from 'lodash/isPlainObject'

// 渐变颜色对象格式转换
const colorObjectForm = (value) => {
  if (Array.isArray(value)) {
    const gradientValue = {gradientList: []}
    if (Array.isArray(value[0])) {
      value.forEach((item, index) => {
        const [color, scale] = item
        gradientValue.gradientList.push({
          key: `g${index}`,
          color,
          position: scale,
        })
      })
    } else {
      value.forEach((color, index) => {
        gradientValue.gradientList.push({
          key: `g${index}`,
          color,
          position: index / (value.length - 1),
        })
      })
    }
    return gradientValue
  }
  if (isPlainObject(value)) {
    return value
  }
  return {}
}

const getGradientColor = (gradientList) => {
  const copyList = JSON.parse(JSON.stringify(gradientList))
  let colorList = ''

  if (gradientList.length === 2 && !gradientList[0].key) {
    return `linear-gradient(90deg, ${gradientList[0].color} 0%, ${gradientList[1].color} 100%)`
  }
  copyList.sort((a, b) => a.position - b.position)
  copyList.forEach((item, index) => {
    colorList += `${item.color} ${item.position * 100}%${index === copyList.length - 1 ? '' : ','}`
  })
  return `linear-gradient(90deg, ${colorList})`
}

export {colorObjectForm, getGradientColor}
