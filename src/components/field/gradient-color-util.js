import isPlainObject from "lodash/isPlainObject"

// 渐变颜色数组格式转换
const colorArrayForm = (value) => {
  if (Array.isArray(value)) {
    if (Array.isArray(value[0])) {
      return value
    }
    return [...Array.from(value, (color, i) => [color, i / (value.length - 1)])]
  }
  const {gradientColorList = []} = value
  const copyList = JSON.parse(JSON.stringify(gradientColorList))
  copyList.sort((a, b) => a.position - b.position)
  return [...copyList.map(({color, position}) => [color, position])]
}
// 渐变颜色对象格式转换
const colorObjectForm = (value) => {
  if (Array.isArray(value)) {
    const gradientValue = {gradientColorType: "linear", gradientColorList: []}
    if (Array.isArray(value[0])) {
      value.forEach((item, index) => {
        const [color, scale] = item
        gradientValue.gradientColorList.push({
          key: `g${index}`,
          color,
          position: scale
        })
      })
    } else {
      value.forEach((color, index) => {
        gradientValue.gradientColorList.push({
          key: `g${index}`,
          color,
          position: index / (value.length - 1)
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

const getGradientColor = (gradientColorList, gradientColorType) => {
  const gradientColorOption = gradientColorType === "linear" ? "90deg," : ""
  const copyList = JSON.parse(JSON.stringify(gradientColorList))
  let colorList = ""

  if (gradientColorList.length === 2 && !gradientColorList[0].key) {
    return `${gradientColorType}-gradient(${gradientColorOption} ${gradientColorList[0].color} 0%, ${gradientColorList[1].color} 100%)`
  }
  copyList.sort((a, b) => a.position - b.position)
  copyList.forEach((item, index) => {
    colorList += `${item.color} ${item.position * 100}%${
      index === copyList.length - 1 ? "" : ","
    }`
  })
  return `${gradientColorType}-gradient(${gradientColorOption} ${colorList})`
}

export {colorArrayForm, colorObjectForm, getGradientColor}
