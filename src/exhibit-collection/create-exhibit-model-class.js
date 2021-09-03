import {types, getEnv} from "mobx-state-tree"
import commonAction from "@utils/common-action"
// import createConfigModelClass from "../builders/create-config-model-class"
import {transform} from "./exhibit-config"

// 根据schema创建组件独有的模型
export const createExhibitModelClass = (exhibit) => {
  const {config} = exhibit
  const {fields, sections} = config.layers[0]

  // const Layer = createConfigModelClass(`MLayer${id}`, {
  //   sections,
  //   fields
  // })
  const c = transform({
    sections,
    fields
  })
  console.log(c)
  // console.log(Layer.create({}))
  const MExhibit = types
    .model(`MExhibit${config.key}`, {
      id: types.optional(types.string, ""),
      lib: types.optional(types.enumeration(["wave", "echarts"]), "wave"),
      key: types.optional(types.string, ""),
      icon: types.optional(types.string, ""),
      name: types.optional(types.string, config.name),
      initSize: types.frozen(config.layout()),
      // style: types.optional(MStyle, {}),
      context: types.frozen(),
      normalKeys: types.frozen(["id", "lib", "key", "initSize"])
      // deepKeys: types.frozen(["style"])
    })
    .views((self) => ({
      get art_() {
        return getEnv(self).art
      },
      get event_() {
        return getEnv(self).event
      },
      get globalData_() {
        return getEnv(self).globalData
      },
      get projectData_() {
        return getEnv(self).projectData
      },
      get officialData_() {
        return getEnv(self).officialData
      }
    }))
    .actions(commonAction(["getSchema", "setSchema", "dumpSchema"]))
    .actions((self) => {
      const setCachedData = (data) => {
        self.cachedData = data
      }

      const setContext = (context) => {
        self.context = context
      }

      return {
        setCachedData,
        setContext
      }
    })

  return MExhibit
}
