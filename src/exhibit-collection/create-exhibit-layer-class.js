import {types} from "mobx-state-tree"
import {createConfigModelClass} from "@components/field"
import commonAction from "@utils/common-action"
import {MText} from "@models/art/art-option-tab/text"
import {MGraph} from "@models/art/art-option-tab/graph"
import uuid from "@utils/uuid"
import {MTooltip} from "@models/art/art-option-tab/tooltip"
import {MAnimation} from "@models/art/art-option-tab/animation"

const createLayerChild = (key, child) => {
  const MLayerChild = types
    .model(`M${key}LayerChild`, {
      tabId: types.optional(types.string, ""),
      name: types.optional(types.string, ""),
      option: types.optional(types.string, ""),
      normalKeys: types.frozen(["tabId", "name", "option"]),
      deepKeys: types.frozen(["text", "graph", "animation"])
    })
    .actions(commonAction(["set", "getSchema", "setSchema"]))
    .actions((self) => {
      const afterCreate = () => {
        self.config = {}
        if (child.text) {
          self.text = MText.create({})
          Object.values(child.text).forEach((value) => {
            value.readOnly = false
          })
          self.text.setConfigs(child.text)
          self.config.text = child.text
        }
        if (child.graph) {
          self.graph = MGraph.create({})
          Object.values(child.graph).forEach((value) => {
            value.readOnly = false
          })
          self.graph.setConfigs(child.graph)
          self.config.graph = child.graph
        }
        self.animation = MAnimation.create({})
        self.animation.setConfigs(child.animation)
        self.config.animation = child.animation
      }
      return {
        afterCreate
      }
    })
  return MLayerChild.create(child)
}
export const createLayer = (key, layer) => {
  const MLayer = types
    .model(`M${key}Layer`, {
      id: types.optional(types.string, uuid()),
      key: types.optional(types.string, ""),
      type: types.string,
      name: types.string,
      isVisible: types.optional(types.boolean, true),
      dataConfig: types.frozen(),
      defaultData: types.frozen(),
      axis: types.maybe(types.string),
      normalKeys: types.frozen([
        "id",
        "type",
        "key",
        "name",
        "isVisible",
        "axis"
      ]),
      deepKeys: types.frozen(["children", "other", "tooltip"])
    })
    .actions(commonAction(["set", "getSchema", "setSchema"]))
    .actions((self) => {
      const afterCreate = () => {
        if (layer.children) {
          self.children = layer.children.map((child) =>
            createLayerChild(key, child)
          )
        }
        if (layer.other) {
          const MOther = createConfigModelClass(`M${key}LayerOther`, {
            sections: layer.other.sections,
            fields: layer.other.fields
          })
          self.other = MOther.create({})
        }
        self.tooltip = MTooltip.create({})
      }
      return {
        afterCreate
      }
    })
  return MLayer.create(layer)
}

export const createExhibitLayersClass = (key, layers) => {
  const result = layers.map((layer) => {
    return createLayer(key, layer)
  })
  return result
}
