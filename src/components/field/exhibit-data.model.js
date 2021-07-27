import {types, getParent, getRoot, flow} from "mobx-state-tree"
import {reaction} from "mobx"
import commonAction from "@utils/common-action"
import uuid from "@utils/uuid"
import {commonFieldModelViews} from "./base"

const MSource = types
  .model("MSource", {
    // 唯一标识(跟绑定的全局数据源id保持一致)
    id: types.optional(types.number, NaN),
    // 对应数据源的 Id
    // sourceId: types.optional(types.string, ''),
    // 数据源名称
    name: types.optional(types.string, ""),
    // 用户自定义key，用于自定义函数中取值
    key: types.optional(types.string, ""),
    type: types.optional(
      types.enumeration(["global", "project", "official"]),
      "project"
    )
  })
  .views((self) => ({
    get root_() {
      return getRoot(self)
    },
    get sourceModel_() {
      if (self.type === "project") {
        return self.root_.projectData_.find((d) => {
          return d.dataId === self.id
        })
      }
      return self.root_.globalData_.datas_.find((d) => {
        return d.dataId === self.id
      })
    },
    get result_() {
      return self.sourceModel_.result_
    },
    get columns_() {
      try {
        return self.sourceModel_.dataField.dataField.options.map((d) => {
          return {
            key: d.value,
            name: d.key,
            type: d.remark,
            sourceId: `${self.id}`
          }
        })
      } catch (error) {
        return "返回的数据非标准结构，无法解析字段"
      }
    },

    get icon() {
      return self.sourceModel_.icon_
    }
  }))
  .actions(commonAction(["set"]))
  .actions((self) => ({
    afterCreate() {
      const dispose = reaction(
        () => {
          return {
            sources:
              self.root_.globalData_.datas_.length +
              self.root_.projectData_.length
          }
        },
        () => {
          let source
          if (self.type === "project") {
            source = self.root_.projectData_.find((d) => {
              return d.dataId === self.id
            })
          } else {
            source = self.root_.globalData_.datas_.find((d) => {
              return d.dataId === self.id
            })
          }
          if (source) {
            source.set({
              isExhibit: true
            })
            source.getData()
          }
          // 监听一次变化就好
          dispose()
        },
        {
          fireImmediately: true
        }
      )
    },
    setKey(key) {
      self.key = key
    }
  }))

// 这里存需要保存的值
const MValue = types
  .model("MValue", {
    mode: types.optional(types.enumeration(["json", "source"]), "json"),
    json: types.optional(types.map(types.string), {}),
    isOpenJsonProcessor: types.optional(types.boolean, false),
    jsonProcessor: types.optional(types.string, ""),
    isOpenSourceProcessor: types.optional(types.boolean, false),
    sourceProcessor: types.optional(types.string, ""),
    mappingValue: types.optional(types.frozen(), {}),
    sources: types.optional(types.array(MSource), []),
    effectLayers: types.optional(types.array(types.string), [])
  })
  .views((self) => ({
    get root_() {
      return getRoot(self)
    },
    // 返回数据源真实数据
    get sourceResult_() {
      // TODO 改造成多数据源结果返回
      return self.sources.map((source) => {
        return source.result_
      })[0]
    },

    get sources_() {
      if (self.mode === "json") {
        return Object.entries(self.json.toJSON()).map(([sourceId], i) => {
          return {
            key: `私有JSON${i + 1}`,
            value: sourceId
          }
        })
      }
      return self.sources.map((d) => ({
        key: d.name,
        value: `${d.id}`
      }))
    }
  }))
  .actions(commonAction(["set"]))
  .actions((self) => {
    const addSource = flow(function* addSource(source) {
      const sourceModel =
        source.type === "project"
          ? self.root_.projectData_.find((d) => {
              return d.dataId === source.id
            })
          : self.root_.globalData_.datas_.find((d) => {
              return d.dataId === source.id
            })

      sourceModel.set({
        isExhibit: true
      })
      yield sourceModel.getData()
      self.sources.push({...source, isLoad: true})

      const {event_, art_} = self.root_
      event_.fire(`art.${art_.artId}.addData`, {
        dataId: source.id,
        exhibitId: self.root_.id,
        // 新建数据源的数据
        data: sourceModel.result_
      })

      // TODO 通知主流程新建数据源 @柿子
      console.log(
        "新建数据源",
        "exhibitId:",
        self.root_.id,
        "dataId:",
        source.id,
        "新建数据源的数据为：",
        sourceModel.result_
      )
    })
    const removeSource = (source) => {
      self.sources = self.sources.filter((d) => d.id !== source.id)

      const {event_, art_} = self.root_
      event_.fire(`art.${art_.artId}.removeData`, {
        dataId: source.id,
        exhibitId: self.root_.id
      })

      // TODO 通知主流程移除数据源 @柿子
      console.log(
        "移除数据源",
        "exhibitId:",
        self.root_.id,
        "dataId:",
        source.id
      )
    }

    const setJson = (sourceId, json) => {
      self.json.set(sourceId, json)
    }
    return {
      // afterCreate() {
      //   self.set()
      // },
      addSource,
      removeSource,
      setJson
    }
  })

const MMappingItem = types.model("MMappingItem", {
  key: types.optional(types.string, ""),
  name: types.optional(types.string, ""),
  type: types.optional(types.string, "")
})

const MFieldsMappingConfig = types
  .model("MMappingConfig", {
    id: types.optional(types.string, ""),
    name: types.optional(types.string, ""),
    key: types.optional(types.string, ""),
    type: types.optional(types.array(types.string), []),
    range: types.optional(types.array(types.number), [1, 1]),
    value: types.array(MMappingItem),
    isDimension: types.optional(types.boolean, false)
  })
  .actions(commonAction(["set"]))

const MGroupMappingConfig = types
  .model("MLayerConfig", {
    id: types.optional(types.string, ""),
    name: types.optional(types.string, ""),
    fields: types.array(MFieldsMappingConfig),
    sourceId: types.optional(types.string, "")
  })
  .actions(commonAction(["set"]))
  .views((self) => ({
    get parent() {
      return getParent(self)
    }
  }))
  .actions((self) => ({
    afterCreate() {
      // 这个 id 没啥用，纯粹为了循环生成 div ，当key
      if (self.id === "") {
        self.set("id", uuid())
      }
      // 新拉进来的图表赋默认值
      if (self.sourceKey === "") {
        self.set("sourceKey", `json_${self.fields[0].index}`)
      }
    }
  }))

const MLayerMappingConfig = types
  .model("MLayerConfig", {
    id: types.optional(types.string, ""),
    groups: types.map(MGroupMappingConfig)
  })
  .actions(commonAction(["set"]))

// 这里需要柿子主程给默认值
const MConfig = types
  .model("MConfig", {
    // 图表默认数据
    json: types.frozen(),
    // json 的默认处理函数
    jsonProcessor: types.optional(
      types.string,
      `// @param data {object} 填写的JSON数据
  // @param ruleValue {object} 交互规则的参数，默认为{}
  return function ({data, tableList, instance, ruleValue, context}) {
    return data || tableList
  }`
    ),
    // json 的默认处理函数
    sourceProcessor: types.optional(
      types.string,
      `// @param data {object} 填写的JSON数据
  // @param ruleValue {object} 交互规则的参数，默认为{}
  return function ({data, tableList, instance, ruleValue, context}) {
    return data || tableList
  }`
    ),
    // 图表映射描述
    mappingConfig: types.map(MLayerMappingConfig)
  })
  .views((self) => ({
    get json_() {
      // 给 json 默认值
      const valueJson = {}
      Object.entries(self.json).forEach(([sourceId, groups]) => {
        valueJson[sourceId] = JSON.stringify(groups, null, 2)
      })
      return valueJson
    }
  }))

export const MExhibitDataField = types
  .model("MExhibitDataField", {
    section: types.optional(types.string, ""),
    type: types.enumeration(["exhibitData"]),
    label: types.optional(types.string, ""),
    value: types.optional(MValue, {}),
    config: types.optional(MConfig, {}),
    updateKey: types.optional(types.number, 0)
  })
  .views((self) => commonFieldModelViews(self))
  .views((self) => ({
    get root_() {
      return getRoot(self)
    },
    // 获取二维表表头信息,用于数据映射的下拉选项
    get columns_() {
      try {
        // 私有 json 模式下，直接根据 value.json 生成
        if (self.value.mode === "json") {
          const columns = []
          const jsons = self.value.json
            ? self.value.json.toJSON()
            : self.config.json

          Object.entries(jsons).forEach(([sourceId, d], j) => {
            const v = JSON.parse(d)
            const head = v[0]
            const firstDataRow = v[1]
            head.forEach((col, i) => {
              if (typeof col === "object") {
                columns.push({...col, i: j})
              } else {
                columns.push({
                  key: col,
                  name: col,
                  type: typeof firstDataRow[i],
                  sourceId
                })
              }
            })
          })

          return columns
        }

        // 绑定数据源模式下，把所有数据源各自的字段都扔进去
        let columns = []
        self.value.sources.forEach((source, i) => {
          columns = columns.concat(
            source.columns_.map((d) => ({
              ...d,
              index: i
            }))
          )
        })

        return columns
      } catch (error) {
        return []
      }
    },

    // TODO 写逻辑获取到经过数据源函数处理的结果
    get sourceProcessorResult_() {
      return [
        {
          key: "pro",
          name: "测试省份source",
          type: "string"
        },
        {
          key: "gz",
          name: "高职院校source",
          type: "string"
        },
        {
          key: "bk",
          name: "本科院校source",
          type: "string"
        }
      ]
    },

    // TODO 写逻辑获取到经过JSON函数处理的结果
    get jsonProcessorResult_() {
      return [
        {
          key: "pro",
          name: "测试省份json",
          type: "string"
        },
        {
          key: "gz",
          name: "高职院校json",
          type: "string"
        },
        {
          key: "bk",
          name: "本科院校json",
          type: "string"
        }
      ]
    },
    // TODO 对接全局/项目/官方数据源列表
    get sourceList_() {
      return {
        global: self.root_.globalData_.datas_.map(
          ({dataId, dataType, dataName, icon_}) => ({
            id: dataId,
            type: dataType,
            name: dataName,
            icon: icon_
          })
        ),
        project: self.root_.projectData_.map(
          ({dataId, dataType, dataName, icon_}) => ({
            id: dataId,
            type: dataType,
            name: dataName,
            icon: icon_
          })
        ),
        // project: [],
        official: [
          // {
          //   id: 'aaaa4',
          //   icon: 'data-excel',
          //   name: '3工时评估报告.xlsx',
          // },
        ]
      }
    }
  }))
  .actions(commonAction(["set"]))
  .actions((self) => ({
    afterCreate() {
      reaction(
        () => {
          return {
            config: self.config,
            // mappingValue: self.config.mappingValue_,
            mappingpingIds: self.config.mappingConfig.size
          }
        },
        () => {
          const {
            // json,
            mappingConfig,
            jsonProcessor,
            sourceProcessor
          } = self.config

          const newJson = {}
          // 给 json 默认值
          Object.entries(self.config.json_).forEach(
            ([sourceId, defaultJson]) => {
              if (!self.value.json.has(sourceId)) {
                newJson[sourceId] = defaultJson
              } else {
                newJson[sourceId] = self.value.json.get(sourceId)
              }
            }
          )

          self.setValue("json", newJson)

          // 给 json 处理函数默认值
          if (self.value.jsonProcessor === "") {
            self.setValue("jsonProcessor", jsonProcessor)
          }

          // 给映射关系默认值
          const newMapppingValue = {}
          Object.entries(mappingConfig.toJSON()).forEach(
            ([layerId, {groups}]) => {
              const item = self.value.mappingValue[layerId]
              if (!item) {
                const groupsMappingValue = {}
                Object.entries(groups).forEach(([groupId, group]) => {
                  groupsMappingValue[groupId] = {
                    // 默认选中的数据源id跟 组id 是一样的
                    sourceId: group.sourceId,
                    fields: group.fields.map((f) => {
                      return {
                        key: f.key,
                        value: f.value.map((v) => ({
                          ...v,
                          sourceId: group.sourceId
                        }))
                      }
                    })
                  }
                })
                newMapppingValue[layerId] = groupsMappingValue
              } else {
                newMapppingValue[layerId] = item
              }
            }
          )

          self.setValue("mappingValue", newMapppingValue)

          // 给数据源处理函数默认值
          if (self.value.sourceProcessor === "") {
            self.setValue("sourceProcessor", sourceProcessor)
          }
        },
        {
          fireImmediately: true
        }
      )
      // json 修改通知主流程，ps：要做校验
      reaction(
        () => {
          return {
            // mode: self.value.mode,
            // json: self.value.json,
            // jsonProcessor: self.value.jsonProcessor,
            // isOpenJsonProcessor: self.value.isOpenJsonProcessor,
            // mappingValue: self.value.mappingValue,
            // sources: self.value.sources.length,
            updateKey: self.updateKey,
            layers: self.effectLayers
          }
        },
        () => {
          const {mode, json, isOpenJsonProcessor, mappingValue} = self.value
          try {
            // 私有json模式校验
            if (mode === "json") {
              const testJsonStr = json
              // TODO 如果开启高级处理函数，要执行高级处理函数
              if (isOpenJsonProcessor) {
                // testJsonStr = json
              } else {
                Object.entries(testJsonStr.toJSON()).forEach((d) => {
                  JSON.parse(d[1])
                })
              }
              // 绑定数据源模式校验
            } else {
              // self.value.sources.map(source=>{})
            }

            // 映射关系校验
            const {mappingConfig} = self.config
            let mappingVerify = true
            const sources = self.value.sources_.map((d) => d.value)

            Object.entries(mappingConfig.toJSON()).forEach(
              ([layerId, layerMappingConfig]) => {
                Object.entries(layerMappingConfig.groups).forEach(
                  ([groupId, group]) => {
                    const item = mappingValue[layerId][groupId]
                    // 数据源有效性校验
                    if (!sources.includes(item.sourceId)) {
                      mappingVerify = false
                      throw new Error("映射关系选取了无效数据源")
                    } else {
                      group.fields.forEach(({type, range}, fieldIndex) => {
                        const fields = item.fields[fieldIndex].value || []
                        // 1. 检验数量
                        if (
                          fields.length < range[0] ||
                          item.length > range[1]
                        ) {
                          mappingVerify = false
                          throw new Error("映射关系字段数量选择不足")
                        }
                        fields.forEach((field) => {
                          // 2.检验同组内的字段是否来自同一个数据源
                          if (field.sourceId !== item.sourceId) {
                            // console.log(field, groupSourceKey)
                            mappingVerify = false
                            throw new Error(
                              "同组映射关系中选择了不同数据源字段"
                            )
                          }
                          // 3. 检验类型
                          if (type.length > 0 && !type.includes(field.type)) {
                            mappingVerify = false
                            throw new Error("映射关系中字段类型不匹配")
                          }
                        })
                      })
                    }
                  }
                )
              }
            )

            // return

            // mappingConfig.forEach((layerMappingConfig, layerIndex) => {
            //   layerMappingConfig.groups.forEach((groupMappingConfig, groupIndex) => {
            //     const group = mappingValue[layerIndex].groups[groupIndex]
            //     const groupSourceKey = group.sourceKey

            //   })
            // })

            if (mappingVerify) {
              console.log("通知主程更新")
              getParent(self).update(self.fieldOption)
            }
          } catch (error) {
            console.error(error)
          }
        },
        {
          delay: 300
        }
      )
    },
    setValue(key, value) {
      if (typeof key === "object") {
        self.value = key
      } else {
        self.value[key] = value
      }
    },
    setEffectLayer(layers) {
      self.value.effectLayers = layers
      self.updateKey++
    },
    clearValue() {
      self.value = {}
    },
    getValue() {
      // 保存前删除映射关系里的脏数据
      // const effectiveMappingValue = []
      // if (self.value.mappingValue) {
      //   self.config.mappingConfig.forEach((layerMappingConfig, layerIndex) => {
      //     layerMappingConfig.forEach((groupMappingConfig, groupIndex) => {
      //       d.forEach(({id}) => {
      //         if (self.value.mappingValue && self.value.mappingValue[id] && self.value.mappingValue[id].length > 0) {
      //           effectiveMappingValue[id] = self.value.mappingValue[id]
      //         }
      //       })
      //     })
      //   })
      // }
      return self.value.toJSON()
    }
  }))
