import {types, getParent, getEnv} from 'mobx-state-tree'
import cloneDeep from 'lodash/cloneDeep'
import commonAction from '@utils/common-action'
import isDef from '@utils/is-def'

const MValue = types
  .model('MValue', {
    type: types.optional(types.enumeration(['private', 'source']), 'private'),
    private: types.optional(types.string, ''),
    source: types.maybe(types.number),
    sourceProcessor: types.maybe(types.string),
  })
  .views((self) => ({
    get sourceData_() {
      const datas = getEnv(self).art.datas
      const data = datas?.find((v) => v.id === self.source)?.data
      return data
    },
    get sourceName_() {
      const name = [
        ...getParent(self).globalData_,
        ...getParent(self).projectData_,
        ...getParent(self).officialData_,
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
  })
  .views((self) => ({
    get env_() {
      return getEnv(self)
    },
  }))
  .views((self) => ({
    get globalData_() {
      if (self.env_.globalData) {
        const {folders = []} = self.env_.globalData
        const datas = [].concat(...folders.map((folder) => folder.datas))
        return datas
      }
      return []
    },
    get officialData_() {
      if (self.env_.officialData) {
        const {folders = []} = self.env_.officialData
        const datas = [].concat(...folders.map((folder) => folder.datas))
        return datas
      }
      return []
    },
    get projectData_() {
      if (self.env_.projectData_) {
        const datas = [].concat(...self.env_.projectData)
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
        const {type, sourceData_, private: privateData} = self.value
        model.update(type === 'private' ? privateData : sourceData_)
      })
    }

    const setRelationModels = (models) => {
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
      })
      self.setValue({
        source: dataId,
      })
    }

    const removeSource = (dataId) => {
      const {event, art, exhibitId} = self.env_
      event.fire(`art.${art.artId}.removeData`, {
        dataId,
        exhibitId,
      })
      self.setValue({
        source: undefined,
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
      setRelationModels,
      getRelationModels,
    }
  })
