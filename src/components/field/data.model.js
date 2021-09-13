import {types, getParent, getRoot} from "mobx-state-tree"
import cloneDeep from "lodash/cloneDeep"
import commonAction from "@utils/common-action"
import isDef from "@utils/is-def"

import {commonFieldModelViews} from "./base"

const MValue = types
  .model("MValue", {
    type: types.optional(types.enumeration(["private", "source"]), "private"),
    private: types.optional(types.string, ""),
    source: types.maybe(types.number),
    sourceProcessor: types.maybe(types.string)
  })
  .views((self) => ({
    get sourceData_() {
      const datas = getRoot(self).art_.datas
      const data = datas?.find((v) => v.id === self.source)?.data
      return data
    },
    get sourceName_() {
      const name = [
        ...getParent(self).globalData_,
        ...getParent(self).projectData_,
        ...getParent(self).officialData_
      ].find((data) => data.dataId === self.source)?.dataName
      return name
    }
  }))
  .actions(commonAction(["set"]))

export const MDataField = types
  .model("MDataField", {
    section: types.optional(types.string, ""),
    type: types.enumeration(["data"]),
    label: types.optional(types.string, ""),
    value: types.maybe(MValue),
    defaultValue: types.optional(MValue, {})
  })
  .views((self) => commonFieldModelViews(self))
  .views((self) => ({
    get root_() {
      return getRoot(self)
    }
  }))
  .views((self) => ({
    get globalData_() {
      if (self.root_.globalData_) {
        const {folders = []} = self.root_.globalData_
        const datas = [].concat(...folders.map((folder) => folder.datas))
        return datas
      }
      return []
    },
    get officialData_() {
      if (self.root_.officialData_) {
        const {folders = []} = self.root_.officialData_
        const datas = [].concat(...folders.map((folder) => folder.datas))
        return datas
      }
      return []
    },
    get projectData_() {
      if (self.root_.projectData_) {
        const datas = [].concat(...self.root_.projectData_)
        return datas
      }
      return []
    }
  }))
  .actions(commonAction(["set"]))
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

    const addSource = (dataId) => {
      const {event_, art_} = self.root_
      event_.fire(`art.${art_.artId}.addData`, {
        dataId,
        exhibitId: self.root_.id
      })
      self.setValue({
        source: dataId
      })
    }

    const removeSource = (dataId) => {
      const {event_, art_} = self.root_
      event_.fire(`art.${art_.artId}.removeData`, {
        dataId,
        exhibitId: self.root_.id
      })
      self.setValue({
        source: undefined
      })
    }

    return {
      afterCreate,
      setValue,
      getValue,
      addSource,
      removeSource
    }
  })
