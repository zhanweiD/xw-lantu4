import {types} from "mobx-state-tree"
import isArray from "lodash/isArray"
import isFunction from "lodash/isFunction"
import createLog from "@utils/create-log"

import {MTextField} from "./fields"
import isDef from "@utils/is-def"

const log = createLog("@builder/create-config-model-class")

const fieldModel = {
  text: MTextField
}
const createFieldClass = (fields) => {
  const result = []
  fields.forEach((field) => {
    if (fieldModel[field.type]) {
      // 后面根据配置会重新赋值
      let MFieldModel = fieldModel[field.type].actions((self) => ({
        getSchema() {
          return self.getValue()
        }
      }))
      // 如果有views，重新创建模型
      if (isFunction(field.views)) {
        MFieldModel = MFieldModel.views((self) => field.views(self))
      }

      result.push({[field.name]: MFieldModel.create(field)})
    } else {
      log.warn(`Field for '${field.type}' is NOT supported yet!`)
    }
  })
  return result
}

const createSectionClass = (node) => {
  let fields
  const sections = []
  if (isArray(node.sections)) {
    node.sections.forEach((v) => {
      sections.push(createSectionClass(v))
    })
  }

  if (isArray(node.fields)) {
    fields = createFieldClass(node.fields)
  }

  const MSection = types
    .model("MSection", {
      name: types.optional(types.string, node.name)
    })
    .actions((self) => {
      const afterCreate = () => {
        if (isArray(node.fields)) {
          self.fields = fields
        }
        if (isArray(node.sections)) {
          self.sections = sections
        }
        if (isDef(node.effective)) {
          self.effective = node.effective
        }
      }
      // 这种是保存用的
      const getValues = () => {
        const values = {}
        values.name = self.name
        if (self.sections) {
          const data = []
          self.sections.forEach((section) => {
            data.push(section.getValues())
          })
          values.sections = data
        }
        if (self.fields) {
          const fields = {}
          self.fields.forEach((field) => {
            Object.entries(field).forEach(([key, value]) => {
              fields[key] = value.getValue()
            })
          })
          values.fields = fields
        }
        return values
      }
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
      const setValues = () => {}
      return {
        afterCreate,
        getValues,
        setValues
      }
    })
  return MSection.create({})
}
const createConfigModelClass = (modelName, config, initProps = {}) => {
  let fields
  const sections = []
  if (isArray(config.sections)) {
    config.sections.forEach((section) => {
      sections.push(createSectionClass(section))
    })
  }
  if (isArray(config.fields)) {
    fields = createFieldClass(config.fields)
  }

  initProps.updateTime = types.optional(types.number, 0)

  return types.model(modelName, initProps).actions((self) => {
    const afterCreate = () => {
      if (fields && fields.length) {
        self.fields = fields
      }
      if (sections.length) {
        self.sections = sections
      }
    }
    // const setValues = (values) => {
    //   if(isPlainObject(values)) {

    //   } else {
    //     log.warn(`Param muse be a plainobject for setValues(), but it was, ${values}`)
    //   }
    // }
    const getValues = () => {
      const values = {}
      if (self.sections) {
        const sections = []
        self.sections.forEach((section) => {
          sections.push(section.getValues())
        })
        values.sections = sections
      }
      if (self.fields) {
        const fields = {}
        self.fields.forEach((field) => {
          Object.entries(field).forEach(([key, value]) => {
            fields[key] = value.getValue()
          })
        })
        values.fields = fields
      }
      return values
    }

    return {
      afterCreate,
      getValues
    }
  })
}

export default createConfigModelClass
