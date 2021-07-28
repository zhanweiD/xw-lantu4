import React from "react"
import {observer} from "mobx-react-lite"
import SectionFields from "@components/section-fields"
import uuid from "@utils/uuid"
import {createLayer} from "@exhibit-collection/create-exhibit-layer-class"
import w from "@models"
import ConstructLayer from "@components/construct-layer"

const openOtherLayer = ({layer, target, onChange}) => {
  const {top} = target.getBoundingClientRect()
  w.overlayManager.get("otherlayer").show({
    title: layer.name,
    attachTo: false,
    right: 480,
    top,
    content: (
      <div className="pb32">
        <SectionFields
          model={layer.other}
          onListenChangeOption={(data) => {
            onChange(data)
          }}
        />
      </div>
    )
  })
}

const setExhibitConfig = (exhibit) => {
  const mappingConfig = {}
  const defaultJson = {}
  exhibit.layers
    .filter((l) => l.dataConfig)
    .forEach((l) => {
      const groups = {}
      // 这里目前只兼容 gis 的添加图层，如果要兼容普通图表，需要修改
      let sourceIndex = 0
      let lastSourceId
      l.dataConfig.forEach((d, i) => {
        const fields = d.map((layerConfig) => ({
          ...layerConfig
        }))

        let sourceId = `${l.id}_${sourceIndex}`
        if (l.defaultData[sourceIndex]) {
          defaultJson[sourceId] = l.defaultData[sourceIndex]
          lastSourceId = sourceId
          sourceIndex++
        } else {
          sourceId = lastSourceId
        }

        groups[`${l.id}_${i}`] = {
          sourceId,
          fields
        }
      })
      mappingConfig[l.id] = {
        name: l.name,
        groups
      }
    })
  exhibit.data.setConfigs({
    data: {
      config: {
        json: defaultJson,
        mappingConfig
      }
    }
  })
}
// 这里是显隐图层的代码 先放这里
//               layer.set({
//                 isVisible: true,
//               })
//               const data = layers.filter(v => v.isVisible).map(v => v.getSchema())
//               exhibit.adapter.toggleLayers(data)

const GisLayer = ({artOption, exhibit}) => {
  const {layers} = exhibit
  const source = layers.map((layer) => ({
    id: layer.id,
    name: layer.name,
    groups: [],
    isVisible: layer.isVisible
  }))

  return (
    <ConstructLayer
      withToolbar
      value={{
        source,
        groups: []
      }}
      buttons={[
        {
          key: "exhibit-focus",
          icon: "exhibit-focus",
          action: (id) => {
            console.log(id)
          }
        },
        {
          key: "copy",
          icon: "copy",
          action: (id, e) => {
            e.stopPropagation()
            const layer = layers.filter((v) => v.id === id)[0]
            const {key, layersConfig} = exhibit
            const layerSchema = layer.getSchema()
            layerSchema.id = uuid()
            const newLayerModel = createLayer(key, layersConfig[layer.type])
            newLayerModel.setSchema(layerSchema)
            const newLayers = [].concat(newLayerModel, ...exhibit.layers)
            exhibit.set({
              layers: newLayers
            })
            setExhibitConfig(exhibit)
            exhibit.adapter.addLayer(layerSchema)
          }
        },
        {
          key: "remove",
          icon: "remove",
          action: (id) => {
            const layerSchema = exhibit.layers
            const newLayers = layerSchema.filter((v) => v.id !== id)
            exhibit.set({
              layers: newLayers
            })
            setExhibitConfig(exhibit)
            exhibit.adapter.removeLayer(id)
          }
        }
      ]}
      onClick={(id, info, e) => {
        const layer = layers.filter((v) => v.id === info.groupId)[0]
        if (layer.other) {
          openOtherLayer({
            target: e.target,
            layer,
            onChange: (data) => {
              artOption.getOther(exhibit, data)
            }
          })
        }
        artOption.set({
          updateLayer: layer.id
        })
        artOption.setTooltip(layer.tooltip)
      }}
      onAdd={(e) => {
        e.stopPropagation()
        const config = exhibit.layersConfig
        const {overlayManager} = w
        const menu = overlayManager.get("menu")
        const list = Object.values(config).filter((v) => v.canCreate !== false)
        menu.toggle({
          attachTo: e.target,
          list: list.map((conf) => {
            return {
              name: conf.name,
              action: () => {
                const {key} = exhibit
                const layer = createLayer(key, conf)
                const layerSchema = exhibit.layers
                const newLayers = [].concat(layer, ...layerSchema)
                exhibit.set({
                  layers: newLayers
                })
                setExhibitConfig(exhibit)
                const {mappingValue, json} = exhibit.data.getValues().data
                const sc = layer.getSchema()
                sc.data = mappingValue[layer.id]
                console.log("新建层id:", layer.id)
                console.log("新建图层，全部映射关系：", mappingValue)
                console.log("新建图层，全部默认数据：", json)
                exhibit.adapter.addLayer(sc, json)
                openOtherLayer({
                  target: e.target,
                  layer,
                  onChange: (data) => {
                    artOption.getOther(exhibit, data)
                  }
                })
                artOption.set({
                  updateLayer: layer.id
                })
                menu.hide()
              }
            }
          })
        })
      }}
    />
  )
}

export default observer(GisLayer)
