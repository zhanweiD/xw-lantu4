import {types, getEnv, flow, getParent} from 'mobx-state-tree'
import cloneDeep from 'lodash/cloneDeep'
import hJSON from 'hjson'
import {reaction} from 'mobx'
import commonAction from '@utils/common-action'
import isDef from '@utils/is-def'
import isDdit from '@utils/is-edit'
import makeFunction from '@utils/make-function'
import createLog from '@utils/create-log'

const log = createLog('@data-section')
let intervalKey
const MValue = types
  .model('MValue', {
    type: types.optional(types.enumeration(['private', 'source']), 'private'),
    private: types.optional(types.string, ''),
    source: types.maybe(types.number),
    boxId: types.maybe(types.number),

    sourceType: types.maybe(types.enumeration(['json', 'api', 'excel', 'database'])),
    apiConfig: types.frozen(),

    // api系列
    useApiHeader: types.optional(types.boolean, false),
    apiHeader: types.optional(
      types.string,
      `return function ({actionParams, context}) {
  return {
    // key1: value1
  }
}`
    ),
    useApiQueries: types.optional(types.boolean, false),
    apiQueries: types.optional(
      types.string,
      `return function ({actionParams, context}) {
  return {
    // key1: value1
  }
}`
    ),
    useApiBody: types.optional(types.boolean, false),
    apiBody: types.optional(
      types.string,
      `return function ({actionParams, context}) {
  return {
    // key1: value1
  }
}`
    ),
    // common系列
    useProcessor: types.optional(types.boolean, false),
    processor: types.optional(
      types.string,
      `return function ({dataFrame, actionParams, context, instance, queries}) {
  // data的进出结构：{columns: [], rows: [[], []], error: 'message'}
}`
    ),
    useApiPolling: types.optional(types.boolean, false),
    apiPolling: types.optional(types.number, 10),
    // 前端使用系列
    displayName: types.optional(types.string, ''),
    columns: types.optional(types.array(types.frozen()), []),
  })
  .views((self) => ({
    get art_() {
      return getEnv(self).art
    },
    get exhibit_() {
      return getEnv(self).exhibit
    },
    get box_() {
      let box, frames
      const {art, boxId} = getEnv(self)
      if (isDdit) frames = art.viewport.frames
      else frames = art.frames
      for (let i = 0; i < frames.length; i++) {
        box = frames[i].boxes.find((box) => box.boxId === boxId)
        if (box) break
      }
      return box
    },
  }))
  .actions(commonAction(['set']))
  .actions((self) => {
    const afterCreate = () => {
      // 放到setTimeout是afterCreate时拿不到apiConfig
      setTimeout(() => {
        // 轮询调用formatData重新获取api数据
        if (self.apiConfig?.useApiPolling) {
          clearInterval(intervalKey)
          intervalKey = setInterval(self.formatData, self.apiConfig?.apiPolling * 1000)
        }
        // 私有配置覆盖公共配置
        if (self.useApiPolling) {
          clearInterval(intervalKey)
          intervalKey = setInterval(self.formatData, self.apiPolling * 1000)
        }
      }, 100)
      reaction(
        () => {
          return {
            // 当大屏引用数据源发生变化重新获取数据
            data: self.art_.datas.length && self.art_.datas.map((data) => data.toJSON()),
          }
        },
        () => {
          self.formatData()
        }
      )
      reaction(
        () => {
          return {
            // 当轮询配置发生变化时重新设置定时器
            data: self.useApiPolling && self.apiPolling,
          }
        },
        ({data}) => {
          if (data === 0) return
          if (data > 0) {
            clearInterval(intervalKey)
            intervalKey = setInterval(self.formatData, self.apiPolling * 1000)
          } else {
            clearInterval(intervalKey)
            if (self.apiConfig?.useApiPolling) {
              intervalKey = setInterval(self.formatData, self.apiConfig?.apiPolling * 1000)
            }
          }
        },
        {
          delay: 300,
        }
      )
      !isDdit &&
        reaction(
          () => self.box_.actionParams,
          (data) => {
            if (self.box_.isDataFilter) self.dataFilter(data)
            self.formatData(data)
          },
          {delay: 100}
        )
    }

    /**
     * @Author: zhanwei
     * @description: 数据筛选处理函数
     * @param {*} data 交互组件透出参数
     */
    const dataFilter = (data) => {
      console.log(data)
      self.useProcessor = true
      self.processor = `return function ({dataFrame, actionParams, context, instance, queries}) {
        // data的进出结构：{columns: [], rows: [[], []], error: 'message'}
        console.log(actionParams)
      }`
    }

    const formatData = flow(function* format(actionParams) {
      try {
        if (self.type === 'private') {
          self.columns = hJSON.parse(self.private)[0].map((column) => ({
            column,
            alias: column,
            type: 'string',
          }))
          self.data = hJSON.parse(self.private)
        } else {
          const sourceData = self.art_.datas?.find((v) => v.dataId === self.source)
          if (sourceData) {
            self.sourceType = sourceData.dataType
            self.displayName = sourceData.displayName_
            self.apiConfig = sourceData.config
            const params = {}
            if (self.useApiHeader) {
              params.headers = makeFunction(self.apiHeader)({actionParams})
            }
            if (self.useApiQueries) {
              params.queries = makeFunction(self.apiQueries)({actionParams})
            }
            if (self.useApiBody) {
              params.body = makeFunction(self.apiBody)({actionParams})
            }
            const dataFrame = yield sourceData.getDataFrame(params)
            self.useProcessor
              ? makeFunction(self.processor)({dataFrame: dataFrame, actionParams}) || dataFrame
              : dataFrame
            self.columns = dataFrame.columns
            self.data = dataFrame.getData()
          } else {
            self.displayName = ''
            self.columns = []
            self.data = []
            self.sourceType = undefined
          }
        }
        self.exhibit_?.set({
          state: 'success',
        })
        getParent(self).onAction()
      } catch (error) {
        log.error('format error: ', error)
      }
    })
    const setValue = (values) => {
      self.set(values)
      self.formatData()
    }

    const getValue = () => {
      let values = {}
      const {
        type,
        private: privateData,
        source,
        sourceType,
        useApiHeader,
        apiHeader,
        useApiQueries,
        apiQueries,
        useApiBody,
        apiBody,
        // useApiProcessor,
        // apiProcessor,
        // useJsonProcessor,
        // jsonProcessor,
        // useExcelProcessor,
        // excelProcessor,
        useProcessor,
        processor,
        columns,
        useApiPolling,
        apiPolling,
      } = self
      if (self.type === 'private') {
        values = {
          type,
          private: privateData,
          columns: columns.toJSON()?.map((item) => item.column),
        }
      }
      if (self.type === 'source') {
        values = {
          type,
          source,
          useProcessor,
          processor,
          columns: columns?.map((item) => item.column),
        }
        if (sourceType === 'api') {
          values.useApiHeader = useApiHeader
          values.apiHeader = apiHeader
          values.useApiQueries = useApiQueries
          values.apiQueries = apiQueries
          values.useApiBody = useApiBody
          values.apiBody = apiBody
          values.apiPolling = apiPolling
          values.useApiPolling = useApiPolling
          // values.useApiProcessor = useApiProcessor
          // values.apiProcessor = apiProcessor
        }
        // if (sourceType === 'json') {
        //   values.useJsonProcessor = useJsonProcessor
        //   values.jsonProcessor = jsonProcessor
        // }
        // if (sourceType === 'excel') {
        //   values.useExcelProcessor = useExcelProcessor
        //   values.excelProcessor = excelProcessor
        // }
      }
      return values
    }

    return {
      afterCreate,
      formatData,
      setValue,
      getValue,
      dataFilter,
    }
  })

export const MDataField = types
  .model('MDataField', {
    type: types.enumeration(['data']),
    sectionStyleType: types.optional(types.number, 1),
    value: types.maybe(MValue),
    defaultValue: types.optional(MValue, {}),
    relationModels: types.optional(types.frozen(), []),
    sessionPrivate: types.optional(types.frozen(), []),
    sessionSource: types.optional(types.frozen(), []),
  })
  .views((self) => ({
    get env_() {
      return getEnv(self)
    },
  }))
  .views((self) => ({
    get spaceData_() {
      if (self.env_.data) {
        const {spaceFolders = []} = self.env_.data
        const datas = [].concat(...spaceFolders.map((folder) => folder.dataList))
        return datas
      }
      return []
    },
    // get officialData_() {
    //   if (self.env_.officialData) {
    //     const {folders = []} = self.env_.officialData
    //     const datas = [].concat(...folders.map((folder) => folder.datas))
    //     return datas
    //   }
    //   return []
    // },
    get projectData_() {
      if (self.env_.data) {
        const {projectFolders = []} = self.env_.data
        const datas = [].concat(...projectFolders.map((folder) => folder.dataList))
        return datas
      }
      return []
    },
  }))
  .actions(commonAction(['set']))
  .actions((self) => {
    const afterCreate = () => {
      if (!isDef(self.value)) {
        self.value = cloneDeep(self.defaultValue.toJSON())
      }
    }

    const setValue = (value) => {
      self.value.setValue(value)
    }

    const getValue = () => {
      return isDef(self.value) ? self.value.getValue() : self.defaultValue.getValue()
    }

    const getSchema = () => {
      return self.getValue()
    }

    const setSchema = (schema) => {
      self.setValue(schema)
    }

    const onAction = () => {
      // 修正关联的column
      self.relationModels.map((model) => {
        const {columns} = self.value
        model.update(columns)
      })
    }

    const clearRelationModelValue = () => {
      self.relationModels.map((model) => {
        model.setValue(undefined)
      })
    }

    const toggleBak = () => {
      const values = []
      const {value, relationModels} = self
      relationModels.map((model) => {
        values.push(model.getValue())
      })
      if (value.type === 'private') {
        self.sessionPrivate = values
        relationModels.map((model, index) => {
          model.setValue(self.sessionSource[index])
        })
      } else {
        self.sessionSource = values
        relationModels.map((model, index) => {
          model.setValue(self.sessionPrivate[index])
        })
      }
    }

    const bindRelationModels = (models) => {
      self.relationModels = models
    }

    const getRelationModels = () => {
      return self.relationModels
    }

    const addSource = (dataId) => {
      const {event, art, exhibitId} = self.env_
      event.fire(`art.${art.artId}.addData`, {
        dataId,
        exhibitId,
        callback: () => {
          self.initValue()
          self.setValue({
            source: dataId,
          })

          clearRelationModelValue()
        },
      })
    }

    const removeSource = (dataId) => {
      const {event, art, exhibitId} = self.env_

      event.fire(`art.${art.artId}.removeData`, {
        dataId,
        exhibitId,
        callback: () => {
          self.initValue()
          self.setValue({
            source: undefined,
          })
          clearRelationModelValue()
        },
      })
    }

    const initValue = () => {
      self.value.set({
        // api系列
        useApiHeader: false,
        apiHeader: `return function ({actionParams, context}) {
  return {
    // key1: value1
  }
}`,
        useApiQueries: false,
        apiQueries: `return function ({actionParams, context}) {
  return {
    // key1: value1
  }
}`,
        useApiBody: false,
        apiBody: `return function ({actionParams, context}) {
  return {
    // key1: value1
  }
}`,
        // common系列
        useProcessor: false,
        processor: `return function ({dataFrame, actionParams, context, instance, queries}) {
  // data的进出结构：{columns: [], rows: [[], []], error: 'message'}
}`,
      })
    }

    const previewSource = () => {
      const {art, event} = self.env_
      const {projectData_, spaceData_} = self
      const sourceData = art.datas?.find((v) => v.dataId === self.value.source)

      const data = [...projectData_, ...spaceData_].find((o) => o.dataId === sourceData.dataId)

      const {dataId, dataName, dataType, folderId, projectId} = data
      event.fire('editor.openTab', {
        id: dataId,
        name: dataName,
        type: 'data',
        tabOptions: {
          folderId,
          dataType,
          projectId,
        },
      })
    }

    return {
      afterCreate,
      initValue,
      setValue,
      getValue,
      setSchema,
      getSchema,
      addSource,
      removeSource,
      onAction,
      toggleBak,
      bindRelationModels,
      getRelationModels,
      previewSource,
    }
  })
