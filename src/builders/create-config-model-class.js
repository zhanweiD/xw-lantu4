import {getParent, types} from 'mobx-state-tree'
import isArray from 'lodash/isArray'
import isFunction from 'lodash/isFunction'
import isPlainObject from 'lodash/isPlainObject'
import createLog from '@utils/create-log'
import commonAction from '@utils/common-action'
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
const createFieldClass = (fields) => {
  const result = []
  fields.forEach((field) => {
    if (fieldModel[field.type]) {
      // 后面根据配置会重新赋值
      let MFieldModel = fieldModel[field.type].actions((self) => ({
        getSchema() {
          return self.getValue()
        },
        setSchema(schema) {
          return self.setValue(schema)
        },
      }))
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
    .model('MSection', {
      name: types.optional(types.string, node.name),
    })
    .actions(commonAction(['set']))
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
        if (isDef(self.effective)) {
          values.effective = self.effective
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

      const setValues = (values) => {
        if (isPlainObject(values)) {
          Object.entries(values).forEach(([key, value]) => {
            if (['name', 'effective'].find((v) => v === key)) {
              self[key] = value
            } else if (key === 'sections') {
              if (self[key]) {
                self[key].forEach((section) => {
                  if (value.find((v) => v.name === section.name)) {
                    section.setSchema(value.find((v) => v.name === section.name))
                  }
                })
              }
            } else if (key === 'fields') {
              if (self[key]) {
                self[key].forEach((v) => {
                  Object.entries(v).forEach(([k, x]) => {
                    x.setSchema(value[k])
                  })
                })
              }
            }
          })
        }
      }

      const setSchema = (schema) => {
        self.setValues(schema)
      }

      const getRelationFields = (type) => {
        const values = []

        if (self.sections) {
          self.sections.forEach((section) => {
            values.push(...section.getRelationFields(type))
          })
        }

        if (self.fields) {
          self.fields.forEach((field) => {
            Object.entries(field).forEach(([, value]) => {
              if (value.type === type) {
                values.push(value)
              }
            })
          })
        }
        return values
      }

      const update = () => {
        getParent(self, 2).update()
      }
      return {
        afterCreate,
        getValues,
        setValues,
        setSchema,
        getRelationFields,
        update,
      }
    })
  return MSection.create({})
}
const createConfigModelClass = (modelName, config, initProps = {}) => {
  // 初始化数据也需要被保存下来
  const _keys = Object.keys(initProps)

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

    const setValues = (values) => {
      if (isPlainObject(values)) {
        Object.entries(values).forEach(([key, value]) => {
          if (_keys.find((v) => v === key)) {
            self[key] = value
          } else if (key === 'sections') {
            if (self[key]) {
              self[key].forEach((section) => {
                if (value.find((v) => v.name === section.name)) {
                  section.setSchema(value.find((v) => v.name === section.name))
                }
              })
            }
          } else if (key === 'fields') {
            if (self[key]) {
              self[key].forEach((v) => {
                Object.entries(v).forEach(([k, x]) => {
                  x.setSchema(value[k])
                })
              })
            }
          }
        })
      } else {
        log.error(`Param muse be a plainobject for setValues(), but it was, ${values}`)
      }
    }

    const update = () => {
      self.updateTime = Date.now()
    }
    const getValues = () => {
      const values = {}
      _keys.forEach((key) => {
        values[key] = self[key]
      })
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

    const getRelationFields = (type) => {
      const values = []
      if (self.fields) {
        self.fields.forEach((field) => {
          Object.entries(field).forEach(([, value]) => {
            if (value.type === type) {
              values.push(value)
            }
          })
        })
      }
      if (self.sections) {
        self.sections.forEach((section) => {
          values.push(...section.getRelationFields(type))
        })
      }
      return values
    }

    const dumpSchema = () => {
      console.log(JSON.stringify(self.getSchema(), null, 4))
    }

    return {
      afterCreate,
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
