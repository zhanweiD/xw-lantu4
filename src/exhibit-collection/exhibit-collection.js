import onerStorage from 'oner-storage'
import waves from '@waves4'
import isEdit from '@utils/is-edit'
import createLog from '@utils/create-log'
import {themeConfigs} from '@utils/theme'
import {createExhibitModelClass} from './create-exhibit-model-class'
import {createExhibitLayersClass} from './create-exhibit-layer-class'

const log = createLog('@exhibit-collection')

const exhibitCollection = onerStorage({
  type: 'variable',
  key: 'waveview-exhibit-adapter',
})

export const draw = ({exhibit, container, height, width, frame}) => {
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

export const exhibitRegister = (exhibit) => {
  const {config, lib} = exhibit
  const Model = createExhibitModelClass(exhibit)

  if (!exhibitCollection.get(`${lib}.${config.key}`)) {
    exhibitCollection.set(`${lib}.${config.key}`, {
      config,
      Model,
      initModel({art, schema, themeId, event, globalData, projectData, officialData}) {
        // 创建组件的模型实例
        const model = Model.create(
          {
            context: {
              baseFontSize: (1080 / 1050).toFixed(2) - 0,
              themeColors: themeConfigs[themeId].colors,
            },
          },
          {
            art,
            event,
            globalData,
            projectData,
            officialData,
          }
        )
        const {layers} = config
        model.setLayers(
          createExhibitLayersClass(config.key, layers, {
            exhibitId: model.id,
            art,
            event,
            globalData,
            projectData,
            officialData,
          })
        )
        if (config.key === 'demo') {
          model.setData(config.data)
        }
        model.setSchema(schema)

        return model
      },
      Adapter: exhibit.Adapter,
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
  addModal(waves, 'wave')
}

export default exhibitCollection
