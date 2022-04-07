import onerStorage from 'oner-storage'
import waves from '@waves4'
import {alldecorations} from '@materials'
import isEdit from '@utils/is-edit'
import createLog from '@utils/create-log'
import {createExhibitModelClass} from './create-exhibit-model-class'
import {themeConfigs} from '@common/theme'

import {
  gisPoint,
  gisIcon,
  geojson,
  gisHeatmap,
  odLine,
  gisTile,
  gisTerrain,
  gisPath,
} from '../waves4/waves/v3/gis/layers'
// import {Earth, PointLayer} from 'wave-map-test'
// import {getRealData} from '@utils/index'

const log = createLog('@exhibit-collection')

const exhibitCollection = onerStorage({
  type: 'variable',
  key: 'waveview-exhibit-adapter',
})

const setGisLayers = (config, gisLayers = []) => {
  if (config.key !== 'gis') {
    return config.layers
  }
  const modelLayers = [...config.layers]
  gisLayers.forEach((item) => {
    switch (item.type) {
      case 'gisPoint':
        modelLayers.push(gisPoint())

        // const option = gisPoint()
        // const pointLayer = new PointLayer({
        //   data: getRealData(item.data),
        // })
        // option.instanceLayer = pointLayer
        // modelLayers.push(option)
        break
      case 'gisIcon':
        modelLayers.push(gisIcon())
        break
      case 'geojson':
        modelLayers.push(geojson())
        break
      case 'gisHeatmap':
        modelLayers.push(gisHeatmap())
        break
      case 'odLine':
        modelLayers.push(odLine())
        break
      case 'gisTile':
        modelLayers.push(gisTile())
        break
      case 'gisTerrain':
        modelLayers.push(gisTerrain())
        break
      case 'gisPath':
        modelLayers.push(gisPath())
        break
      default:
        break
    }
  })
  return modelLayers
}

export const draw = ({exhibit, container, height, width, frame, material}) => {
  if (exhibit) {
    const model = frame.art_.exhibitManager.get(exhibit.id)
    if (model) {
      const {Adapter} = exhibitCollection.get(`${model.lib}.${model.key}`)
      Adapter.draw({
        container,
        height,
        width,
        model,
        isEdit,
      })
    } else {
      log.warn('组件模型未找到', exhibit.id)
    }
  }
  if (material) {
    const model = frame.art_.exhibitManager.get(material.id)
    if (model) {
      const {Adapter} = exhibitCollection.get(`${model.lib}.${model.key}`)
      Adapter.draw({
        container,
        height,
        width,
        model,
        isEdit,
      })
    } else {
      log.warn('组件模型未找到', material.id)
    }
  }
}

export const exhibitRegister = (exhibit) => {
  const {config, lib} = exhibit
  const Model = createExhibitModelClass(exhibit)
  if (!exhibitCollection.get(`${lib}.${config.key}`)) {
    // 将注册的容器相关内容写入内存
    exhibitCollection.set(`${lib}.${config.key}`, {
      config,
      Model,
      initModel({art, schema, event, data}) {
        // 创建组件的模型实例
        let themeType = ''
        // 创建组件的模型实例
        if (art.global.options.sections.themeColor.fields.theme.value) {
          themeType = art.global.options.sections.themeColor.fields.theme.value
        } else {
          themeType = art.global.options.sections.themeColor.fields.theme
        }
        const model = Model.create(
          {
            context: {
              theme: themeConfigs[themeType].colors,
              baseFontSize: (1080 / 1050).toFixed(2) - 0,
              themeColors: themeConfigs[themeType].colors,
            },
          },
          {
            art,
            event,
            data,
          }
        )
        // ! 这里这么麻烦写setLayers 其实是有原因的。
        // 从config里拿到的layer配置实际上是初始化的，当用户添加层后，这里config.layers就不是期望的数据了，而应该由后端保存值获取对应的type再调用此type对应的配置
        // model.setLayers(config.layers)
        if (schema) {
          model.set({id: schema.id})
          model.init()
          model.setLayers(setGisLayers(config, schema.layers))
          model.setSchema(schema)
        }
        return model
      },
      Adapter: exhibit.Adapter,
    })
  }
}
// 预览发布状态下只注册用到的组件类型
export const registerExhibit = (key) => {
  const exhibit = waves[key] || alldecorations[key]
  exhibitRegister(exhibit)
  return exhibitCollection.get(`${exhibit.lib}.${key}`)
}

const addModal = (exhibits) => {
  Object.values(exhibits).forEach((exhibit) => {
    exhibitRegister(exhibit)
  })
}

// 编辑状态下需要初始化注册所有组件，预览发布状态下不需要
if (isEdit) {
  addModal(waves)
  addModal(alldecorations)
}

export default exhibitCollection
