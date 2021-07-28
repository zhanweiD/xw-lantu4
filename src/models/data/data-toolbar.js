/**
 * @author 南风
 * @description 数据工具栏
 */
import commonAction from "@utils/common-action"
import {getEnv, getRoot, getParent, types} from "mobx-state-tree"
import {MDataCreater} from "./data-creater"

export const MDataToolbar = types
  .model({
    keyword: types.optional(types.string, ""),
    type: types.optional(types.string, "all"),
    creater: types.optional(MDataCreater, {})
  })
  .views((self) => ({
    get env_() {
      return getEnv(self)
    },
    get root_() {
      return getRoot(self)
    },
    get dataPanel_() {
      return getParent(self, 1)
    }
  }))
  .actions(commonAction(["set"]))
  .actions((self) => {
    let seachDataSource = []
    const searchDatas = () => {
      if (!self.keyword) {
        seachDataSource.length &&
          self.dataPanel_.set({
            datas: seachDataSource
          })
        seachDataSource = []
        return
      }

      if (!seachDataSource.length) {
        seachDataSource = [...self.dataPanel_.toJSON().datas]
      }

      const datas = seachDataSource

      let searchData = []
      const noSearchData = []
      datas.forEach((data) => {
        if (data.name.indexOf(self.keyword) !== -1) {
          searchData.push(data)
        } else {
          noSearchData.push(data)
        }
      })

      searchData = searchData.sort((a, b) => {
        return (
          b.name.split(self.keyword).length - a.name.split(self.keyword).length
        )
      })

      self.dataPanel_.set({
        datas: searchData
      })
    }

    const createByType = (type) => {
      if (type === "api") {
        self.creater.createrApi()
      } else {
        self.creater.createrDatabase()
      }
    }

    return {
      searchDatas,
      createByType
    }
  })
