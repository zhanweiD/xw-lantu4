import isArray from 'lodash/isArray'
import mappingConfig from '../exhibit-option-system/fields'
import createConfigModelClass from '@builders/create-config-model-class'
import isDef from '@utils/is-def'

const getFields = (fields) => {
  return fields.map((field) => {
    const config = mappingConfig[field.name]

    if (config) {
      // 白名单之内的field，不能更改label和type
      const {label, type, ...other} = field
      const ret = {
        ...config,
        ...other,
      }

      // 白名单之内的配置项，来自对接层的配置，当前只有以下两项生效
      // if (isDef(field.effective)) {
      //   ret.effective = field.effective
      // }

      // if (isDef(field.defaultValue)) {
      //   ret.defaultValue = field.defaultValue
      // }
      // console.log('🎒', ret)
      return ret
    } else if (field.name === 'custom') {
      // console.log('🦀', {...field})
      return {...field}
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
