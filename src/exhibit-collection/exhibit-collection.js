import onerStorage from "oner-storage"
import waves from "@waves4"
import isEdit from "@utils/is-edit"
import createLog from "@utils/create-log"
import {themeConfigs} from "@utils/theme"
import {createExhibitModelClass} from "./create-exhibit-model-class"
import {createExhibitLayersClass} from "./create-exhibit-layer-class"

const log = createLog("@exhibit-collection")

const exhibitCollection = onerStorage({
  type: "variable",
  key: "waveview-exhibit-adapter"
})

export const draw = ({exhibit, container, height, width, frame}) => {
  const model = frame.art_.exhibitManager.get(exhibit.id)
  // 如果有对应的模型存在才渲染，否则渲染空组件
  if (model) {
    const {Adapter} = exhibitCollection.get(`${model.lib}.${model.key}`)
    Adapter.draw({
      container,
      height,
      width,
      model,
      isEdit
    })
  } else {
    // TODO: 忽略或没找到模型的处理
    log.warn("组件模型未找到", exhibit.id)
  }
}

export const exhibitRegister = (exhibit) => {
  const {config, lib} = exhibit
  const Model = createExhibitModelClass(exhibit)

  if (!exhibitCollection.get(`${lib}.${config.key}`)) {
    exhibitCollection.set(`${lib}.${config.key}`, {
      config,
      // Model类将在MArt中，进行统一实例化并缓存
      Model,
      // 该方法共有两个时机调用
      // 1. 加载大屏时，对已有的组件，进行逐一的模型实例化，这个时候会包含Server端的值
      // 2. 新增组件时，及从组件列表拖拽到容器中，对该组件进行模型实例化，这个时候组件的配置都是默认值
      initModel({art, schema, themeId, event, globalData, projectData}) {
        // 创建组件的模型实例
        const model = Model.create(
          {
            context: {
              baseFontSize: (1080 / 1050).toFixed(2) - 0,
              themeColors: themeConfigs[themeId].colors
            }
          },
          {
            art,
            globalData,
            projectData,
            event
          }
        )
        let {layers} = config
        const {data} = config
        const {dimension, json} = data
        // TODO 现在判断了是gis的才这样做，等基础组件调整好 这个判断需要去掉
        if (schema?.layers) {
          const canAddLayers = config.getLayersConfig()
          const baseLayers = config.layers
          model.set({
            layersConfig: canAddLayers
          })
          layers = schema.layers.map((v) => ({
            id: v.id,
            name: v.name,
            ...baseLayers.concat(canAddLayers).filter((x) => x.key === v.key)[0]
          }))
        }
        model.set({
          layers: createExhibitLayersClass(config.key, layers)
        })
        const mappingConfig = {}
        const defaultJson = {}
        let sourceIndex = 0
        let lastSourceId
        model.layers
          .filter((layer) => layer.dataConfig)
          .forEach((layer) => {
            const groups = {}
            const gisIds = layer.defaultData?.map((d, groupIndex) => {
              const id = `${layer.id}_${groupIndex}`
              defaultJson[id] = d
              return id
            })

            layer.dataConfig.forEach((d, groupIndex) => {
              const fields = d.map((layerConfig) => ({
                ...layerConfig
              }))
              if (dimension) {
                fields.unshift(
                  ...dimension.map((di) => {
                    return {
                      isDimension: true,
                      ...di
                    }
                  })
                )
              }
              let jsonId = `${layer.id}_${groupIndex}`
              if (json[sourceIndex]) {
                defaultJson[jsonId] = json[sourceIndex]
                lastSourceId = jsonId
                sourceIndex++
              } else {
                jsonId = lastSourceId
              }

              groups[`${layer.id}_${groupIndex}`] = {
                sourceId: gisIds ? gisIds[groupIndex] : jsonId,
                fields
              }
            })
            mappingConfig[layer.id] = {
              name: layer.name,
              groups
            }
          })

        console.log("图表渲染映射关系：", mappingConfig)
        console.log("图表渲染默认数据：", defaultJson)
        model.data.setConfigs({
          data: {
            config: {
              json: defaultJson,
              mappingConfig
            }
          }
        })
        model.setSchema(schema)
        return model
      },
      Adapter: exhibit.Adapter
    })
  }
}

// 预览发布状态下只注册用到的组件类型
export const registerExhibit = (key) => {
  const exhibit = waves[key]
  exhibitRegister(exhibit)
  return exhibitCollection.get(`${exhibit.lib}.${key}`)
}

const addModal = (exhibits) =>
  Object.values(exhibits).forEach((exhibit) => {
    exhibitRegister(exhibit)
  })

// 编辑状态下需要初始化注册所有组件，预览发布状态下不需要
if (isEdit) {
  console.time("addWaves")
  addModal(waves, "wave")
  console.timeEnd("addWaves")
}

export default exhibitCollection
