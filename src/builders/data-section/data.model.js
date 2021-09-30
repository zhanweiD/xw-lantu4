import {types, getParent, getEnv} from 'mobx-state-tree'
import cloneDeep from 'lodash/cloneDeep'
import hJSON from 'hjson'
import {reaction} from 'mobx'
import commonAction from '@utils/common-action'
import isDef from '@utils/is-def'
import makeFunction from '@utils/make-function'

const MValue = types
  .model('MValue', {
    type: types.optional(types.enumeration(['private', 'source']), 'private'),
    private: types.optional(types.string, ''),
    source: types.maybe(types.number),
    sourceProcessor: types.maybe(types.string),
  })
  .views((self) => ({
    get sourceColumn_() {
      if (self.type === 'private') {
        const value = hJSON.parse(self.private)[0]
        return value
      }
      if (self.type === 'source') {
        const {datas = []} = getEnv(self).art
        const sourceData = datas.find((v) => v.id === self.source)
        if (sourceData) {
          let value = []
          let result = sourceData.data
          if (sourceData.config.useDataProcessor) {
            result = makeFunction(sourceData.processorFunction)({data: sourceData.data})
          }
          switch (sourceData.dataType) {
            case 'json':
              value = result[0]
              break
            case 'excel':
              value = result.columns.map((col) => col.name)
              break
            default:
              value = result[0]
          }
          return value
        }
      }
      return []
    },
    get sourceName_() {
      const name = [
        ...getParent(self).spaceData_,
        ...getParent(self).projectData_,
        // ...getParent(self).officialData_,
      ].find((data) => data.dataId === self.source)?.dataName
      return name
    },
  }))
  .actions(commonAction(['set']))

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
      reaction(
        () => {
          return {
            data: self.env_.art.datas,
          }
        },
        () => {
          self.onAction()
        }
      )
    }

    const setValue = (value) => {
      self.value.set(value)
    }

    const getValue = () => {
      return isDef(self.value) ? self.value.toJSON() : self.defaultValue.toJSON()
    }

    const getSchema = () => {
      return self.getValue()
    }

    const setSchema = (schema) => {
      self.setValue(schema)
      self.onAction()
    }

    const onAction = () => {
      self.relationModels.map((model) => {
        const {sourceColumn_} = self.value
        model.update(sourceColumn_)
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
      self.setValue({
        source: dataId,
      })
      clearRelationModelValue()
      event.fire(`art.${art.artId}.addData`, {
        dataId,
        exhibitId,
        callback: self.onAction,
      })
    }

    const removeSource = (dataId) => {
      const {event, art, exhibitId} = self.env_
      self.setValue({
        source: undefined,
      })
      clearRelationModelValue()
      event.fire(`art.${art.artId}.removeData`, {
        dataId,
        exhibitId,
        callback: self.onAction,
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
