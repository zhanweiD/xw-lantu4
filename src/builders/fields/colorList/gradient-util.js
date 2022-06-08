import isPlainObject from 'lodash/isPlainObject'

const colorArrayForm = (value) => {
  if (Array.isArray(value)) {
    if (Array.isArray(value[0])) {
      return value
    }
    return [...Array.from(value, (color, i) => [color, i / (value.length - 1)])]
  }
  const {gradientList = []} = value
  const copyList = JSON.parse(JSON.stringify(gradientList))
  copyList.sort((a, b) => a.position - b.position)
  return [...copyList.map(({color, position, key}, index) => [color, position, key || `g${index}`])]
}

// 渐变颜色对象格式转换
const colorObjectForm = (value) => {
  if (Array.isArray(value)) {
    const gradientValue = {gradientList: []}
    if (Array.isArray(value[0])) {
      value.forEach((item, index) => {
        const [color, scale, key] = item
        gradientValue.gradientList.push({
          key: key || `g${index}`,
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
  if (gradientList.length === 1) {
    return gradientList[0].color
  }
  if (gradientList.length === 2 && !gradientList[0].key) {
    return `linear-gradient(180deg, ${gradientList[0].color} 0%, ${gradientList[1].color} 100%)`
  }
  copyList.sort((a, b) => a.position - b.position)
  copyList.forEach((item, index) => {
    colorList += `${item.color} ${item.position * 100}%${index === copyList.length - 1 ? '' : ','}`
  })
  return `linear-gradient(180deg, ${colorList})`
}

export {colorArrayForm, colorObjectForm, getGradientColor}
