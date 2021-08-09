/*
 * @Author: 柿子
 * @Date: 2021-07-28 13:40:30
 * @LastEditTime: 2021-08-05 11:43:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /waveview-front4/src/exhibit-collection/exhibit-collection.js
 */
import onerStorage from "oner-storage"
import waves from "@waves4"
import isEdit from "@utils/is-edit"
import createLog from "@utils/create-log"
import {themeConfigs} from "@utils/theme"
import {createExhibitModelClass} from "./create-exhibit-model-class"

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
      initModel({art, schema, themeId, event}) {
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
            event
          }
        )
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
