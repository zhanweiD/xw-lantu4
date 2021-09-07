import isDef from "@utils/is-def"
import isArray from "lodash/isArray"
import mappingConfig from "./config-fields-mapping"
import createConfigModelClass from "../builders/create-config-model-class"

// 这种格式是给组件的 但是不能用于保存
// const getValues = () => {
//   let values = {}
//   if (self.sections) {
//     const data = {}
//     self.sections.forEach((section) => {
//       data[section.name] = section.getValues()
//     })
//     values = {...data}
//   }
//   if (self.fields) {
//     self.fields.forEach((field) => {
//       Object.entries(field).forEach(([key, value]) => {
//         values[key] = value.getValue()
//       })
//     })
//   }
//   return values
// }
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

const text = {
  name: "text",
  fields: [
    {
      name: "textSize",
      defaultValue: 10
    },
    {
      name: "opacity",
      defaultValue: 0.8,
      isAdvance: true
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
      res.sections = recusiveNode(subSections, false)
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

export const transform = ({id, type, name, sections, fields}) => {
  const props = {}
  if (isArray(sections)) {
    props.sections = recusiveNode(sections)
  }
  if (isDef(fields)) {
    props.fields = getFields(fields)
  }

  return createConfigModelClass(`MLayer${id}`, props, {
    id,
    type,
    name
  }).create({})
}
