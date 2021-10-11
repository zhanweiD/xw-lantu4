import {types, getEnv, flow, getParent} from 'mobx-state-tree'
import cloneDeep from 'lodash/cloneDeep'
import hJSON from 'hjson'
import {reaction} from 'mobx'
import commonAction from '@utils/common-action'
import isDef from '@utils/is-def'
// import makeFunction from '@utils/make-function'

const MValue = types
  .model('MValue', {
    type: types.optional(types.enumeration(['private', 'source']), 'private'),
    private: types.optional(types.string, ''),
    source: types.maybe(types.number),
    sourceType: types.maybe(types.enumeration(['json', 'api', 'excel', 'sql'])),
    // api系列
    useApiHeader: types.optional(types.boolean, false),
    apiHeader: types.optional(types.string, ''),
    useApiQueries: types.optional(types.boolean, false),
    apiQueries: types.optional(types.string, ''),
    useApiBody: types.optional(types.boolean, false),
    apiBody: types.optional(types.string, ''),
    useApiProcessor: types.optional(types.boolean, false),
    apiProcessor: types.optional(types.string, ''),
    // json系列

    // 前端使用系列
    displayName: types.optional(types.string, ''),
    columns: types.optional(types.array(types.frozen()), []),
    data: types.optional(types.array(types.frozen()), []),
  })
  .views((self) => ({
    get art_() {
      return getEnv(self).art
    },
  }))
  .actions(commonAction(['set']))
  .actions((self) => {
    const afterCreate = () => {
      reaction(
        () => {
          return {
            data: self.art_.datas.length && self.art_.datas.map((data) => data.toJSON()),
          }
        },
        () => {
          self.formatData()
        }
      )
    }

    const formatData = flow(function* format() {
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
          self.displayName = sourceData.displayName_
          const dataFrame = yield sourceData.getDataFrame()
          self.columns = dataFrame.columns
          self.data = dataFrame.getData()
        }
      }
      getParent(self).onAction()
    })

    const setValue = (values) => {
      self.set(values)
      self.formatData()
    }

    return {
      afterCreate,
      formatData,
      setValue,
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
      return isDef(self.value) ? self.value.toJSON() : self.defaultValue.toJSON()
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
          self.setValue({
            source: undefined,
          })
          clearRelationModelValue()
        },
      })
    }

    return {
      afterCreate,
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
    }
  })
