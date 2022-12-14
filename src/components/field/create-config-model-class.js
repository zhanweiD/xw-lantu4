import {types} from 'mobx-state-tree'
import isArray from 'lodash/isArray'
import isFunction from 'lodash/isFunction'
import isString from 'lodash/isString'
import isPlainObject from 'lodash/isPlainObject'
import createLog from '@utils/create-log'
import isDef from '@utils/is-def'
import {
  defaultDataProcessor,
  getProcessorFunction,
  getDefaultValue,
  getProcessorCode,
  getUseProcessor,
  valueIsFunction,
  getHasSaveCode,
} from '@utils/field-processor'
import {MTextField} from './text.model'
import {MNumberField} from './number.model'
import {MMultiNumberField} from './multi-number.model'
import {MCheckField} from './check.model'
import {MCodeField} from './code.model'
import {MSelectField} from './select.model'
import {MSwitchField} from './switch.model'
import {MColorField} from './color.model'
import {MRangeColorField} from './range-color.model'
import {MGradientColorField} from './gradient-color.model'
import {MRangeNumberField} from './range-number.model'
import {MTextareaField} from './textarea.model'
import {MConstraintsField} from './constraints.model'
import {MAlignmentField} from './alignment.model'
import {MOffsetField} from './offset.model'

const log = createLog('@components/field/create-config-model-class')

const fieldModel = {
  text: MTextField,
  password: MTextField,
  textarea: MTextareaField,
  number: MNumberField,
  multiNumber: MMultiNumberField,
  check: MCheckField,
  code: MCodeField,
  select: MSelectField,
  selectFilter: MSelectField,
  selectGradientColor: MSelectField,
  selectWithThumbnail: MSelectField,
  selectThemeColor: MSelectField,
  switch: MSwitchField,
  color: MColorField,
  rangeColor: MRangeColorField,
  gradientColor: MGradientColorField,
  colorList: MGradientColorField,
  rangeNumber: MRangeNumberField,
  constraints: MConstraintsField,
  alignment: MAlignmentField,
  offset: MOffsetField,
}

const MSectionField = types.model('MSectionField', {
  section: types.string,
  fields: types.frozen(),
})

const isValidModelProp = (field) => {
  return ['id', 'key', 'sections'].indexOf(field.option) === -1 && 'field' in field && field.field.type
}

const createConfigModelClass = (modelName, config, initProps = {}) => {
  if (isArray(config.fields)) {
    // section?????????,???section?????????field??????config.fields?????????????????????field?????????option????????????????????????
    config.sections.forEach((section, index) => {
      if (typeof section === 'object') {
        section.fields.forEach((sectionField) => {
          config.fields.push({
            section: section.section,
            option: sectionField.option
              ? section.option || sectionField.option
              : `${section.section}_unsaveWithoutOption_${index}`,
            field: {
              ...sectionField,
              sectionOption: section.option,
              action: sectionField.action?.toString(),
            },
          })
        })
      }
    })
    // ????????????????????????
    const fields = []
    config.fields.forEach((item) => {
      const {field} = item
      // NOTE: ????????????????????????????????????????????????????????????
      if (isValidModelProp(item)) {
        fields.push(item.option)
        if (fieldModel[field.type]) {
          // ?????????????????????????????????
          let MFieldModel = fieldModel[field.type].actions((self) => {
            // ???????????????field????????????????????????
            const updateProcessor = (target) => {
              const {overlayManager, dataProcessor} = window.waveview
              // const dataProcessor = overlayManager.get('dataProcessor')

              switch (target) {
                case 'status':
                  // ????????????/????????????
                  self.set('useProcessor', !self.useProcessor)
                  overlayManager.get('menu').hide()
                  break
                case 'code':
                  // ????????????????????????
                  dataProcessor.reset()
                  dataProcessor.set('processorCode', self.processorCode || defaultDataProcessor)
                  // ?????????????????????
                  dataProcessor.event.on('save', ({processorCode}) => {
                    self.set('processorCode', processorCode)
                    self.set('hasSaveCode', true)
                  })
                  break
                default:
                  console.warn('no operatation')
              }
            }

            // ????????????
            const setConfig = (attrs) => {
              if (isPlainObject(attrs)) {
                Object.entries(attrs).forEach(([key, value]) => {
                  self.set(key, value)
                  if (key === 'defaultValue') {
                    self.setValue(value)
                  }
                })
              }
            }

            const getConfig = (attrNames) => {
              const attrs = {}
              attrNames.forEach((attrName) => {
                if (isDef(self[attrName])) {
                  attrs[attrName] = self[attrName]
                }
              })
              return attrs
            }

            const getSchema = () => {
              return self.getValue()
            }

            return {
              updateProcessor,
              setConfig,
              getConfig,
              getSchema,
            }
          })
          // ???????????????field????????????????????????
          MFieldModel = MFieldModel.views((self) => ({
            // ???????????????????????????
            get processorFunction() {
              return getProcessorFunction(self.useProcessor, self.value, self.processorCode, self.hasSaveCode)
            },
          }))
          // ??????????????????option?????????
          MFieldModel = MFieldModel.views((self) => ({
            get fieldOption() {
              return {[item.option]: self.getValue()}
            },
          }))
          // ?????????views?????????????????????
          if (isFunction(field.views)) {
            // NOTE ????????????(??????????????????): views????????????????????????views????????????????????????????????????????????????
            MFieldModel = MFieldModel.views((self) => field.views(self))
          }

          // ??????option??????field??????
          initProps[item.option] = types.optional(MFieldModel, {
            ...field,
            section: item.section,
            when: isFunction(item.when) ? item.when.toString() : item.when,
            useReaction: isFunction(item.action),
          })
        } else {
          log.warn(`Field for '${field.type}' is NOT supported yet!`)
        }
      } else {
        log.warn('Field config is invalid, pleas check', item)
      }
    })

    initProps.__fields = types.optional(types.array(types.string), fields)
  }

  initProps.sections = types.optional(types.array(types.union(types.string, MSectionField)), config.sections)

  initProps.updateTime = types.optional(types.number, 0)

  initProps.changeOption = types.frozen()

  return types.model(modelName, initProps).actions((self) => {
    const setValues = (values) => {
      // todo ?????????????????????????????????values??????????????????undefined
      if (isPlainObject(values)) {
        const fields = self.__fields.toJSON()
        Object.entries(values).forEach(([key, value]) => {
          if (fields.indexOf(key) > -1) {
            // pro field2
            if (self[key].supportProcessor) {
              if (valueIsFunction(value)) {
                // ??????schema??????????????????value
                self[key].set('useProcessor', getUseProcessor(value))
                self[key].set('processorCode', getProcessorCode(value))
                self[key].setValue(getDefaultValue(value, self[key].type))
                self[key].set('hasSaveCode', getHasSaveCode(value))
              } else {
                // ?????????????????????????????????
                self[key].set('useProcessor', false)
                // ??????????????????
                self[key].set('processorCode', defaultDataProcessor)
                self[key].setValue(value)
              }
            } else {
              self[key].setValue(value)
            }
          } else if (key in self) {
            self[key] = value
          } else {
            log.warn(
              `The prop '${key}' is not existed on model ${modelName}, but ${modelName}.${key}.setValue() is called.`
            )
          }
        })
      } else {
        log.error(`Param muse be a plainobject for setValues(), but it was, ${values}`)
      }
    }

    const update = (changeOption) => {
      self.updateTime = Date.now()
      self.changeOption = changeOption
    }
    const setOptions = (key, options) => {
      const fields = self.__fields.toJSON()
      if (fields.indexOf(key) > -1) {
        self[key].setOptions(options)
      }
    }

    const setConfigs = (configs) => {
      if (isPlainObject(configs)) {
        const fields = self.__fields.toJSON()
        Object.entries(configs).forEach(([key, value]) => {
          if (fields.indexOf(key) > -1) {
            self[key].setConfig(value)
          }
        })
      }
    }

    const getConfigs = (attrsNames) => {
      const fields = self.__fields.toJSON()
      const configs = {}
      fields.forEach((key) => {
        configs[key] = self[key].getConfig(attrsNames)
      })
      return configs
    }

    // ??????????????????????????????
    const getValues = () => {
      const fields = self.__fields.toJSON().filter((field) => field.indexOf('_unsaveWithoutOption_') === -1)
      const values = {}
      fields.forEach((field) => {
        if (self[field]) {
          values[field] = self[field].getValue()
        } else {
          log.warn(`${field} is not found on model`, self.toJSON())
        }
      })
      return values
    }

    // ?????????????????????field???????????????????????????SectionFields??????
    const getFieldKeys = () => {
      return self.__fields.toJSON()
    }

    // ??????????????????option
    const getChangeOption = () => {
      return self.changeOption
    }

    const dump = () => {
      console.log(JSON.stringify(self.getValues(), null, 4))
    }

    const setSchema = (schema) => {
      self.setValues(schema)
      // ?????????util???setSchema??????????????????afterSetSchema??????
      if (isFunction(self.afterSetSchema)) {
        self.afterSetSchema()
      }
    }

    // ??????????????????????????????getValues??????
    const getSchema = () => {
      return self.getValues()
    }

    const dumpSchema = () => {
      console.log(JSON.stringify(self.getSchema(), null, 4))
    }

    // ?????????????????????
    // self.set('unit', 40)
    // self.set({unit: 40, width: 200})
    // NOTE set???setValues???????????????field?????????mobx?????????????????????
    // NOTE ???CMC?????????????????????setValues??????
    // NOTE ???CMC???????????????????????????(M.named().props())???????????????set??????
    const set = (keyOrObject, value) => {
      self.setValues(
        isString(keyOrObject)
          ? {
              [keyOrObject]: value,
            }
          : keyOrObject
      )
    }

    return {
      set,
      setValues,
      getValues,
      getFieldKeys,
      dump,
      setSchema,
      getSchema,
      dumpSchema,
      setOptions,
      update,
      setConfigs,
      getConfigs,
      getChangeOption,
    }
  })
}

export default createConfigModelClass
