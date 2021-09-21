import isArray from 'lodash/isArray'
import mappingConfig from '../exhibit-option-system/fields'
import createConfigModelClass from '@builders/create-config-model-class'

const getFields = (fields) => {
  return fields.map((field) => {
    const config = mappingConfig[field.name]
    if (config) {
      return {...config, ...field}
    }
    return mappingConfig.missing
  })
}

const recusiveNode = (nodes) => {
  return nodes.map((node) => {
    let fields = node.fields
    let sections = node.sections
    const res = {}
    if (isArray(sections)) {
      res.sections = recusiveNode(sections)
    }

    if (isArray(fields)) {
      res.fields = getFields(fields)
    }

    return {
      ...node,
      ...res,
    }
  })
}

export const transform = ({id, name, effective, sections, fields}) => {
  const props = {
    effective,
    name,
  }
  if (isArray(sections)) {
    props.sections = recusiveNode(sections)
  }
  if (isArray(fields)) {
    props.fields = getFields(fields)
  }

  return createConfigModelClass(`MLayer${id}`, props)
}
