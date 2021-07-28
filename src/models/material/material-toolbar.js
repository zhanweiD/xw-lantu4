/**
 * @author 南风
 * @description 素材管理-搜索工具栏
 */
import commonAction from "@utils/common-action"
import {getEnv, getRoot, types, getParent} from "mobx-state-tree"

export const MMaterialToolbar = types
  .model({
    keyword: types.optional(types.string, ""),
    showtype: types.optional(
      types.enumeration(["grid-layout", "list", "thumbnail-list"]),
      "thumbnail-list"
    )
  })
  .views((self) => ({
    get env_() {
      return getEnv(self)
    },
    get root_() {
      return getRoot(self)
    },
    get materialPanel_() {
      return getParent(self, 1)
    }
  }))
  .actions(commonAction(["set"]))
  .actions((self) => {
    const afterCreate = () => {}

    const setshowtype = (size) => {
      self.showtype = size
    }

    const toggleshowtype = () => {
      if (self.showtype === "thumbnail-list") {
        self.setshowtype("grid-layout")
      } else if (self.showtype === "grid-layout") {
        self.setshowtype("list")
      } else if (self.showtype === "list") {
        self.setshowtype("thumbnail-list")
      }
      self.materialPanel_.saveLocal()
    }

    // TODO: 受阻于排序开发
    let seachDataSource = []
    const searchMaterials = () => {
      if (!self.keyword) {
        seachDataSource.length &&
          self.materialPanel_.set({
            folders: seachDataSource
          })
        seachDataSource = []
        return
      }

      if (!seachDataSource.length) {
        seachDataSource = [...self.materialPanel_.toJSON().folders]
      }

      const floderData = seachDataSource

      let searchMaterialData = []
      const noSearchMaterialData = []
      floderData.forEach((floder) => {
        if (floder.folderName.indexOf(self.keyword) !== -1) {
          searchMaterialData.push(floder)
        } else {
          noSearchMaterialData.push(floder)
        }
      })

      searchMaterialData = searchMaterialData
        .sort((a, b) => {
          return (
            b.folderName.split(self.keyword).length -
            a.folderName.split(self.keyword).length
          )
        })
        .splice(0, 5)

      noSearchMaterialData.concat(searchMaterialData.splice(5))

      if (searchMaterialData.length < 5) {
        noSearchMaterialData.forEach((floder) => {
          let hasMatchingMaterial = false
          floder.materials.forEach((material) => {
            if (
              material.name.indexOf(self.keyword) !== -1 &&
              searchMaterialData.length < 5
            ) {
              hasMatchingMaterial = true
            }
          })
          if (hasMatchingMaterial) {
            searchMaterialData.push(floder)
          }
        })
      }

      searchMaterialData = searchMaterialData.map((floder) => {
        const materialSort = [...floder.materials]
          .sort((a, b) => {
            return (
              b.name.split(self.keyword).length -
              a.name.split(self.keyword).length
            )
          })
          .map((material) => material.id)
        return {
          ...floder,
          materialSort
        }
      })

      self.materialPanel_.set({
        folders: searchMaterialData
      })
    }

    return {
      afterCreate,
      setshowtype,
      toggleshowtype,
      searchMaterials
    }
  })
