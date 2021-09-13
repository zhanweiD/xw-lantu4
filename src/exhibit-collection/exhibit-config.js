import isDef from '@utils/is-def'
import isArray from 'lodash/isArray'
import mappingConfig from '../exhibit-option-system/fields'
import allSections from '../exhibit-option-system/sections'
import createConfigModelClass from '../builders/create-config-model-class'

const getFields = (fields) => {
  return fields.map((field) => {
    const config = mappingConfig[field.name]
    return {...config, ...field}
  })
}

const recusiveNode = (nodes, isExtend) => {
  return nodes.map((node) => {
    let fields = node.fields
    let subSections = node.sections
    let section
    const res = {}
    section = allSections[node.name]
    if (!isDef(fields)) {
      fields = section.fields?.filter((v) => !v.isAdvance)
    } else {
      const sf = isExtend ? section.fields.filter((v) => !v.isAdvance) : section.fields
      fields = fields.filter((field) => sf.some((v) => v.name === field.name))
    }
    if (!isDef(subSections)) {
      subSections = section.sections?.filter((v) => !v.isAdvance)
      if (isArray(subSections)) {
        res.sections = recusiveNode(subSections, true)
      }
    } else if (isArray(subSections)) {
      subSections = subSections.filter((sSection) => section.sections?.some((v) => v.name === sSection.name))
      res.sections = recusiveNode(subSections, false)
    }

    if (isDef(fields)) {
      res.fields = getFields(fields)
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
  if (isDef(fields)) {
    props.fields = getFields(fields)
  }

  return createConfigModelClass(`MLayer${id}`, props)
}
