/**
 *
 * @param {[]} conditions 添加列表 {fieldName: 'key', fieldValue: '选项一', operator: '='}
 * @param {string} triggerCondition 'some'满足任意， 'every'满足全部
 * @return {boolean} 是否满足条件
 */
export const isMatchCondition = (conditions, triggerCondition, eventData) => {
  if (!conditions || !conditions.length) {
    return false
  }
  const {data} = eventData
  const result = conditions.map((cd) => {
    const {fieldName, fieldValue, operator} = cd
    return match(operator, data[fieldName], fieldValue)
  })
  if (triggerCondition === 'some') {
    return result.some((res) => res)
  }
  return result.every((res) => res)
}

function match(operator, v1, v2) {
  switch (operator) {
    case '=':
      return v1 === v2
    case '!=':
      return v1 !== v2
    case '>':
      return +v1 > +v2
    case '<':
      return +v1 < +v2
    case '>=':
      return +v1 >= +v2
    case '<=':
      return +v1 <= +v2
    case '包含':
      if (typeof v1 === 'string' || Array.isArray(v1)) {
        return v1.includes(v2)
      }
      return false
    case '不包含':
      if (typeof v1 === 'string' || Array.isArray(v1)) {
        return !v1.includes(v2)
      }
      return false
    default:
      return false
  }
}
