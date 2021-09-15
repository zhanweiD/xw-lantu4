import {types} from 'mobx-state-tree'
import isArray from 'lodash/isArray'
import isFunction from 'lodash/isFunction'
import isPlainObject from 'lodash/isPlainObject'
import createLog from '@utils/create-log'
import {
  MTextField,
  MNumberField,
  MCheckField,
  MSwitchField,
  MTextareaField,
  MColorField,
  MMultiNumberField,
  MSelectField,
  MCodeField,
  MGradientField,
  MColumnSelectField,
} from './fields'
import isDef from '@utils/is-def'

const log = createLog('@builder/create-config-model-class')

const fieldModel = {
  text: MTextField,
  number: MNumberField,
  check: MCheckField,
  switch: MSwitchField,
  textarea: MTextareaField,
  color: MColorField,
  multiNumber: MMultiNumberField,
  select: MSelectField,
  code: MCodeField,
  gradient: MGradientField,
  columnSelect: MColumnSelectField,
}

const createFieldsClass = (fields) => {
  const initProps = {}
  fields.forEach((field) => {
    if (fieldModel[field.type]) {
      let MFieldModel = fieldModel[field.type].actions((self) => ({
        getSchema() {
          return self.getValue()
        },
        setSchema(schema) {
          return self.setValue(schema)
        },
      }))

      initProps[field.name] = types.optional(MFieldModel, {
        ...field,
      })
    } else {
      log.warn(`Field for '${field.type}' is NOT supported yet!`)
    }
  })
  return types.model(initProps)
}

const createConfigModelClass = (modelName, config, initProps = {}) => {
  if (isArray(config.fields)) {
    initProps.fields = types.optional(createFieldsClass(config.fields), {})
  }

  if (isArray(config.sections)) {
    const sections = config.sections.map((section) => createConfigModelClass(`${modelName}.section`, section).create())
    initProps.sections = types.optional(types.frozen(), sections)
  }

  if (isDef(config.name)) {
    initProps.name = config.name
  }
  if (isDef(config.effective)) {
    initProps.effective = config.effective
  }

  initProps.updateTime = types.optional(types.number, 0)
  return types.model(modelName, initProps).actions((self) => {
    const update = () => {
      self.updateTime = Date.now()
    }

    const setSchema = (schema) => {
      self.setValues(schema)
      // 保存和util的setSchema一样，都支持afterSetSchema方法
      if (isFunction(self.afterSetSchema)) {
        self.afterSetSchema()
      }
    }

    // 仅供递归调用，功能和getValues一样
    const getSchema = () => {
      return self.getValues()
    }
    const dumpSchema = () => {
      console.log(JSON.stringify(self.getSchema(), null, 4))
    }

    const getValues = () => {
      const values = {}
      if (isDef(self.name)) {
        values.name = self.name
      }
      if (isDef(self.effective)) {
        values.effective = self.effective
      }
      if (self.sections) {
        const sections = []
        self.sections.forEach((section) => {
          sections.push(section.getValues())
        })
        values.sections = sections
      }
      if (self.fields) {
        const fields = {}
        Object.entries(self.fields).forEach(([key, field]) => {
          fields[key] = field.getValue()
        })
        values.fields = fields
      }
      return values
    }

    const setValues = (values) => {
      if (isPlainObject(values)) {
        Object.entries(values).forEach(([key, value]) => {
          if (key === 'sections') {
            if (self[key]) {
              self[key].forEach((section) => {
                if (value.find((v) => v.name === section.name)) {
                  section.setSchema(value.find((v) => v.name === section.name))
                }
              })
            }
          } else if (key === 'fields') {
            if (self[key]) {
              Object.entries(self[key]).forEach(([fieldKey, fieldModel]) => {
                fieldModel.setSchema(value[fieldKey])
              })
            }
          } else {
            self[key] = value
          }
        })
      } else {
        log.error(`Param muse be a plainobject for setValues(), but it was, ${values}`)
      }
    }

    const getRelationFields = (type) => {
      const values = []
      if (self.fields) {
        Object.entries(self.fields).forEach(([, fieldModel]) => {
          if (fieldModel.type === type) {
            values.push(fieldModel)
          }
        })
      }
      if (self.sections) {
        self.sections.forEach((section) => {
          values.push(...section.getRelationFields(type))
        })
      }
      return values
    }

    return {
      setValues,
      getValues,
      update,
      setSchema,
      getSchema,
      dumpSchema,
      getRelationFields,
    }
  })
}

export default createConfigModelClass
