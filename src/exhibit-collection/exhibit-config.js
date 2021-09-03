import isDef from "@utils/is-def"
import isArray from "lodash/isArray"
import mappingConfig from "./config-fields-mapping"

const text = {
  name: "text",
  fields: [
    {
      name: "textSize",
      defaultValue: 12
    },
    {
      name: "opacity",
      defaultValue: 0.8
    },
    {
      name: "angle",
      defaultValue: 30,
      isAdvance: true
    }
  ]
}

const label = {
  name: "label",
  sections: [text]
}

const rectCoordinate = {
  name: "rectCoordinate",
  isAdvance: true,
  fields: [
    {
      name: "lang",
      defaultValue: 12
    },
    {
      name: "lat",
      defaultValue: 10
    }
  ]
}

const pointCoordinate = {
  name: "pointCoordinate",

  fields: [
    {
      name: "lang",
      defaultValue: 12
    },
    {
      name: "lat",
      defaultValue: 10
    }
  ]
}

const coordinate = {
  name: "coordinate",
  sections: [pointCoordinate, rectCoordinate]
}

export const allSections = {
  label,
  text,
  coordinate,
  rectCoordinate,
  pointCoordinate
}

//
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
      res.sections = recusiveNode(subSections, true)
    }

    if (isDef(fields)) {
      res.fields = getFields(fields)
    }

    return {
      ...node,
      ...res
    }
  })
}

export const transform = ({sections, fields}) => {
  const res = {}
  if (isArray(sections)) {
    res.sections = recusiveNode(sections)
  }
  if (isDef(fields)) {
    res.fields = getFields(fields)
  }
  return res
}
