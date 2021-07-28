import {types} from "mobx-state-tree"
import isArray from "lodash/isArray"
import isFunction from "lodash/isFunction"
import isString from "lodash/isString"
import isPlainObject from "lodash/isPlainObject"
import createLog from "@utils/create-log"
import isDef from "@utils/is-def"
import {
  defaultDataProcessor,
  getProcessorFunction,
  getDefaultValue,
  getProcessorCode,
  getUseProcessor,
  valueIsFunction,
  getHasSaveCode
} from "@utils/field-processor"
import {MTextField} from "./text.model"
import {MNumberField} from "./number.model"
import {MMultiNumberField} from "./multi-number.model"
import {MCheckField} from "./check.model"
import {MCodeField} from "./code.model"
import {MSelectField} from "./select.model"
import {MSwitchField} from "./switch.model"
import {MColorField} from "./color.model"
import {MRangeColorField} from "./range-color.model"
import {MGradientColorField} from "./gradient-color.model"
import {MRangeNumberField} from "./range-number.model"
import {MTextareaField} from "./textarea.model"
import {MConstraintsField} from "./constraints.model"
import {MImageField} from "./image.model"
import {MAlignmentField} from "./alignment.model"
import {MSectionConfigField} from "./section-config.model"
import {MOffsetField} from "./offset.model"
import {MExhibitDataField} from "./exhibit-data.model"

const log = createLog("@components/field/create-config-model-class")

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
  rangeNumber: MRangeNumberField,
  constraints: MConstraintsField,
  image: MImageField,
  alignment: MAlignmentField,
  sectionConfig: MSectionConfigField,
  offset: MOffsetField,
  exhibitData: MExhibitDataField
}

const MSectionField = types.model("MSectionField", {
  section: types.string,
  fields: types.frozen()
})

const isValidModelProp = (field) => {
  return (
    ["id", "key", "sections"].indexOf(field.option) === -1 &&
    "field" in field &&
    field.field.type
  )
}

const createConfigModelClass = (modelName, config, initProps = {}) => {
  if (isArray(config.fields)) {
    // section可配置,将section自定义field置于config.fields集合内，自定义field不设置option则保存时会被过滤
    config.sections.forEach((section, index) => {
      if (typeof section === "object") {
        section.fields.forEach((sectionField) => {
          config.fields.push({
            section: section.section,
            option: sectionField.option
              ? section.option || sectionField.option
              : `${section.section}_unsaveWithoutOption_${index}`,
            field: {
              ...sectionField,
              sectionOption: section.option,
              action: sectionField.action?.toString()
            }
          })
        })
      }
    })
    // 收集子模型的名称
    const fields = []
    config.fields.forEach((item) => {
      const {field} = item
      // NOTE: 模型其他属性的命名不能使用内部已经占用的
      if (isValidModelProp(item)) {
        fields.push(item.option)
        if (fieldModel[field.type]) {
          // 后面根据配置会重新赋值
          let MFieldModel = fieldModel[field.type].actions((self) => {
            // 高级处理：field统一加上更新方法
            const updateProcessor = (target) => {
              const {overlayManager, dataProcessor} = window.waveview
              // const dataProcessor = overlayManager.get('dataProcessor')

              switch (target) {
                case "status":
                  // 更新启用/禁用状态
                  self.set("useProcessor", !self.useProcessor)
                  overlayManager.get("menu").hide()
                  break
                case "code":
                  // 打开悬浮层初始化
                  dataProcessor.reset()
                  dataProcessor.set(
                    "processorCode",
                    self.processorCode || defaultDataProcessor
                  )
                  // 保存时更新代码
                  dataProcessor.event.on("save", ({processorCode}) => {
                    self.set("processorCode", processorCode)
                    self.set("hasSaveCode", true)
                  })
                  break
                default:
                  console.warn("no operatation")
              }
            }

            // 更新属性
            const setConfig = (attrs) => {
              if (isPlainObject(attrs)) {
                Object.entries(attrs).forEach(([key, value]) => {
                  self.set(key, value)
                  if (key === "defaultValue") {
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
              getSchema
            }
          })
          // 高级处理：field统一加上计算属性
          MFieldModel = MFieldModel.views((self) => ({
            // 获取处理函数字符串
            get processorFunction() {
              return getProcessorFunction(
                self.useProcessor,
                self.value,
                self.processorCode,
                self.hasSaveCode
              )
            }
          }))
          // 组件本身模型option键值对
          MFieldModel = MFieldModel.views((self) => ({
            get fieldOption() {
              return {[item.option]: self.getValue()}
            }
          }))
          // 如果有views，重新创建模型
          if (isFunction(field.views)) {
            // NOTE 重要经验(差点就放弃了): views方法并不扩展调用views方法的模型，而是创建新的模型返回
            MFieldModel = MFieldModel.views((self) => field.views(self))
          }

          // 根据option配置field模型
          initProps[item.option] = types.optional(MFieldModel, {
            ...field,
            section: item.section,
            when: isFunction(item.when) ? item.when.toString() : item.when,
            useReaction: isFunction(item.action)
          })
        } else {
          log.warn(`Field for '${field.type}' is NOT supported yet!`)
        }
      } else {
        log.warn("Field config is invalid, pleas check", item)
      }
    })

    initProps.__fields = types.optional(types.array(types.string), fields)
  }

  initProps.sections = types.optional(
    types.array(types.union(types.string, MSectionField)),
    config.sections
  )

  initProps.updateTime = types.optional(types.number, 0)

  initProps.changeOption = types.frozen()

  return types.model(modelName, initProps).actions((self) => {
    const setValues = (values) => {
      // todo 首次拖入组件的时候没有values，会收到一个undefined
      if (isPlainObject(values)) {
        const fields = self.__fields.toJSON()
        Object.entries(values).forEach(([key, value]) => {
          if (fields.indexOf(key) > -1) {
            // pro field2
            if (self[key].supportProcessor) {
              if (valueIsFunction(value)) {
                // 解构schema中函数字符串value
                self[key].set("useProcessor", getUseProcessor(value))
                self[key].set("processorCode", getProcessorCode(value))
                self[key].setValue(getDefaultValue(value, self[key].type))
                self[key].set("hasSaveCode", getHasSaveCode(value))
              } else {
                // 支持数据处理却从未开启
                self[key].set("useProcessor", false)
                // 赋值默认函数
                self[key].set("processorCode", defaultDataProcessor)
                self[key].setValue(value)
              }
            } else if (self[key].type === "sectionConfig") {
              if (typeof value === "boolean") {
                self[key].set("value", value)
              } else {
                // 解析section配置值, 目前只支持第一个
                Object.entries(value).forEach(([, propValue]) => {
                  self[key].set("value", Object.values(propValue)[0])
                })
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
        log.error(
          `Param muse be a plainobject for setValues(), but it was, ${values}`
        )
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

    // 从模型中提取样式配置
    const getValues = () => {
      const fields = self.__fields
        .toJSON()
        .filter((field) => field.indexOf("_unsaveWithoutOption_") === -1)
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

    // 用于外部访问有field模型的属性列表，如SectionFields组件
    const getFieldKeys = () => {
      return self.__fields.toJSON()
    }

    // 外部监听变化option
    const getChangeOption = () => {
      return self.changeOption
    }

    const dump = () => {
      console.log(JSON.stringify(self.getValues(), null, 4))
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

    // 两个写法都可以
    // self.set('unit', 40)
    // self.set({unit: 40, width: 200})
    // NOTE set和setValues方法都支持field属性和mobx标准属性的赋值
    // NOTE 纯CMC模型，建议使用setValues方法
    // NOTE 由CMC模型扩展出来的模型(M.named().props())，建议使用set方法
    const set = (keyOrObject, value) => {
      self.setValues(
        isString(keyOrObject)
          ? {
              [keyOrObject]: value
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
      getChangeOption
    }
  })
}

export default createConfigModelClass
