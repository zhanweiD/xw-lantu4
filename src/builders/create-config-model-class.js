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

const createSectionClass = (node) => {
  const models = []
  const sections = []
  if (isArray(node.sections)) {
    node.sections.forEach((v) => {
      sections.push(createSectionClass(v))
    })
  }

  if (isArray(node.fields)) {
    node.fields.forEach((field) => {
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

        models.push(MFieldModel.create(field))
      } else {
        log.warn(`Field for '${field.type}' is NOT supported yet!`)
      }
    })
  }
  const MSection = types
    .model("MSection", {
      name: types.optional(types.string, node.name)
    })
    .actions((self) => {
      const afterCreate = () => {
        if (isArray(node.fields)) {
          self.fields = models
        }
        if (isArray(node.sections)) {
          self.sections = sections
        }
        if (isDef(node.effective)) {
          self.effective = node.effective
        }
      }
      const getValues = () => {}
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
  const models = []
  const sections = []
  if (isArray(config.sections)) {
    config.sections.forEach((section) => {
      sections.push(createSectionClass(section))
    })
  }
  if (isArray(config.fields)) {
    config.fields.forEach((field) => {
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

        models.push(MFieldModel.create(field))
      } else {
        log.warn(`Field for '${field.type}' is NOT supported yet!`)
      }
    })
  }

  initProps.updateTime = types.optional(types.number, 0)

  return types.model(modelName, initProps).actions((self) => {
    const afterCreate = () => {
      if (models.length) {
        self.fields = models
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
      return values
    }

    return {
      afterCreate,
      getValues
    }
  })
}

export default createConfigModelClass
