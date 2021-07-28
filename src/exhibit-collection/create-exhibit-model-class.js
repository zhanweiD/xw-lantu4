import {types, getEnv} from "mobx-state-tree"
import find from "lodash/find"
import commonAction from "@utils/common-action"
import {createConfigModelClass} from "@components/field"

export const createExhibitModelClass = (exhibit) => {
  const {config} = exhibit

  const MData = createConfigModelClass(`M${config.key}Data`, {
    sections: ["__hide__"],
    fields: [
      {
        section: "__hide__",
        option: "data",
        field: {
          type: "exhibitData"
        }
      }
    ],
    padding: [0, 0, 0, 0]
  })

  const MExhibit = types
    .model(`MExhibit${config.key}`, {
      id: types.optional(types.string, ""),
      lib: types.optional(types.enumeration(["wave"]), "wave"),
      key: types.optional(types.string, ""),
      icon: types.optional(types.string, ""),
      name: types.optional(types.string, config.name),
      coordinate: types.frozen(config.coordinate),
      padding: types.frozen(config.padding),
      initSize: types.frozen(config.layout()),
      data: types.optional(MData, {}),
      cachedData: types.frozen(),
      context: types.frozen(),
      normalKeys: types.frozen(["id", "lib", "key", "initSize", "coordinate"]),
      deepKeys: types.frozen(["layers", "data"])
    })
    .views((self) => ({
      get art_() {
        return getEnv(self).art
      },
      get globalData_() {
        return getEnv(self).globalData
      },
      get projectData_() {
        return getEnv(self).projectData
      },
      get event_() {
        return getEnv(self).event
      }
    }))
    .actions(commonAction(["set", "getSchema", "setSchema"]))
    .actions((self) => {
      const setCachedData = (data) => {
        self.cachedData = data
      }

      const setContext = (context) => {
        self.context = context
      }

      const getLayers = () => {
        const layers = self.layers
          .filter((v) => v.isVisible)
          .map((layer) => layer.getSchema())
        const {data} = self.data.getValues()
        const {mappingValue} = data
        Object.entries(mappingValue).forEach(([key, value]) => {
          const layer = find(layers, (o) => o.id === key)
          if (layer) {
            layer.data = value
          }
        })
        return layers
      }

      const getCoordinate = () => {
        return self.coordinate
      }

      const getData = () => {
        // TODO 这里还要改进，比如说开启高级处理函数
        const {data} = self.data.getValues()
        const {datas} = self.art_
        const {json, mode, mappingValue} = data
        let result
        const temp = {}
        const schema = self.getSchema()
        const {layers} = schema
        Object.entries(mappingValue).forEach(([key, value]) => {
          const layer = find(layers, (o) => o.id === key)
          if (layer) {
            layer.data = value
          }
          if (mode === "source") {
            Object.values(value).forEach((v) => {
              temp[v.sourceId] = JSON.stringify(
                datas.find((d) => v.sourceId === `${d.id}`).data
              )
            })
          }
        })
        if (mode === "source") {
          result = temp
        } else {
          result = json
        }
        return result
      }

      const setAdapter = (adapter) => {
        self.adapter = adapter
      }

      return {
        setCachedData,
        setContext,
        getLayers,
        getData,
        setAdapter,
        getCoordinate
      }
    })

  return MExhibit
}
