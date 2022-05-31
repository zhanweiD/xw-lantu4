import isDef from './is-def'

const getObjectData = (nodes) => {
  const {sections, fields, effective} = nodes
  let values = {}
  if (isDef(effective)) {
    values.effective = effective
  }
  if (!isDef(effective) || effective) {
    if (isDef(sections)) {
      Object.values(sections).forEach((node) => {
        if (isDef(node.effective)) {
          values[node.name] = {
            effective: node.effective,
          }
        }
        if (!isDef(node.effective) || node.effective) {
          values[node.name] = {
            ...values[node.name],
            ...node.fields,
          }

          if (node.sections) {
            values[node.name] = {...values[node.name], ...getObjectData(node)}
          }
        }
      })
    }
    if (isDef(fields)) {
      values = {
        ...values,
        ...nodes.fields,
      }
    }
  }
  return values
}

export default getObjectData
