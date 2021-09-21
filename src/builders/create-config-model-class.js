import {types, getParent, hasParent, isStateTreeNode} from 'mobx-state-tree'
import isArray from 'lodash/isArray'
import {reaction} from 'mobx'
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
import getObjectData from '@utils/get-object-data'
import commonAction from '@utils/common-action'

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
        afterAttach() {
          reaction(
            () => {
              return {
                value: isStateTreeNode(self.value) ? self.value.toJSON() : self.value,
              }
            },
            () => {
              const value = {
                [self.option]: self.getValue(),
              }
              getParent(self, 2).update(value, self.option, false)
            },
            {
              delay: 300,
            }
          )
        },
      }))

      initProps[field.name] = types.optional(MFieldModel, {
        ...field,
        option: field.name,
      })
    } else {
      log.warn(`Field for '${field.type}' is NOT supported yet!`)
    }
  })
  return types.model(initProps)
}

const createConfigModelClass = (modelName, config = {}, initProps = {}) => {
  if (isArray(config.fields)) {
    initProps.fields = types.optional(createFieldsClass(config.fields), {})
  }

  if (isArray(config.sections)) {
    const sections = {}

    config.sections.forEach((section) => {
      sections[section.name] = types.optional(createConfigModelClass(`${modelName}.section`, section), {})
    })
    const Model = types.model(sections)

    initProps.sections = types.optional(Model, {})
  }

  if (isDef(config.name)) {
    initProps.name = config.name
  }
  if (isDef(config.effective)) {
    initProps.effective = config.effective
  }

  // initProps.updatedOptions = types.frozen()
  initProps.updatedPath = types.optional(types.string, '')

  return types
    .model(modelName, initProps)
    .actions(commonAction(['set']))
    .actions((self) => {
      const update = (value, path, isFromSection) => {
        if (hasParent(self) && (self.effective !== false || isFromSection)) {
          const updateValue = {
            [self.name]: {
              ...value,
            },
          }
          getParent(self, 2).update(updateValue, `${self.name}.${path}`)
        } else {
          self.updatedPath = path
          self.updatedOptions = value
        }
      }

      const toggleEffective = () => {
        self.effective = !self.effective
        const updatedOptions = getObjectData(self.getSchema())
        self.update(updatedOptions, 'effective', true)
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
          const sections = {}
          Object.entries(self.sections).forEach(([key, section]) => {
            sections[key] = section.getValues()
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
                Object.entries(self[key]).forEach(([fieldKey, fieldModel]) => {
                  fieldModel.setSchema(value[fieldKey])
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
          Object.entries(self.sections).forEach(([, fieldModel]) => {
            values.push(...fieldModel.getRelationFields(type))
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
        toggleEffective,
      }
    })
}

export default createConfigModelClass
