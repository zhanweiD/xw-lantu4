import isArray from 'lodash/isArray'
import mappingConfig from '../exhibit-option-system/fields'
import allSections from '../exhibit-option-system/sections'
import createConfigModelClass from '../builders/create-config-model-class'

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
    let subSections = node.sections
    let section
    const res = {}
    section = allSections[node.name]
    if (isArray(subSections)) {
      subSections = subSections.filter((sSection) => section.sections?.some((v) => v.name === sSection.name))
      res.sections = recusiveNode(subSections)
    }

    if (isArray(fields)) {
      res.fields = getFields(fields)
      console.log(res.fields)
    }

    return {
      ...node,
      ...res,
    }
  })
}

export const transform = ({id, type, name, sections, fields}) => {
  const props = {}
  if (isArray(sections)) {
    props.sections = recusiveNode(sections)
  }
  if (isArray(fields)) {
    props.fields = getFields(fields)
  }

  return createConfigModelClass(`MLayer${id}`, props)
}
