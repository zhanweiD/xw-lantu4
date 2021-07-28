// TODO 之后这个模型重写，里面揉杂了太多的不同格式的模型，实际上不需要
import {getEnv, types, getRoot} from "mobx-state-tree"
import find from "lodash/find"
import commonAction from "@utils/common-action"
import {MArtBasic} from "./art-basic"
import {MLayout} from "../common/layout"
import {MDescription} from "../common/description"
import {MBackground} from "../common/background"
import {MConstraints, MGap} from "../common/exhibit-layout"
import {MText} from "./art-option-tab/text"
import {MGraph} from "./art-option-tab/graph"
import {MTooltip} from "./art-option-tab/tooltip"
import {MAnimation} from "./art-option-tab/animation"

export const MArtOption = types
  .model({
    id: types.number,
    // TODO basic 之后需要删除掉，现在捆绑在art上,死板不好扩展,需要换一种实现方式.
    basic: types.optional(MArtBasic, {}),
    layout: types.optional(MLayout, {}),
    constraints: types.optional(MConstraints, {}),
    gap: types.optional(MGap, {}),
    background: types.optional(MBackground, {}),
    graph: types.optional(MGraph, {}),
    text: types.optional(MText, {}),
    tooltip: types.optional(MTooltip, {}),
    animation: types.optional(MAnimation, {}),
    description: types.optional(MDescription, {}),
    deepKeys: types.frozen(["basic"]),

    updateLayer: types.maybe(types.string),
    updateOption: types.maybe(types.string)
  })
  .views((self) => ({
    get env_() {
      return getEnv(self)
    },
    get root_() {
      return getRoot(self)
    }
  }))
  .actions(commonAction(["set", "getSchema"]))
  .actions((self) => {
    const {event} = self.env_

    const afterCreate = () => {
      event.on(
        `art.${self.id}.art-option.setLayout`,
        ({x, y, width, height}) => {
          self.setLayout({x, y, height, width})
        }
      )
      event.on(
        `art.${self.id}.art-option.setDescription`,
        ({name, description}) => {
          self.setDescription({name, description})
        }
      )
      event.on(`art.${self.id}.art-option.clearTab`, () => {
        self.clearTab()
      })
    }

    const clearTab = () => {
      self.text = MText.create({})
      self.graph = MGraph.create({})
      self.root_.overlayManager.get("otherlayer").hide()
      self.updateLayer = ""
      self.updateOption = ""
    }

    const setLayout = ({x, y, height, width}) => {
      self.layout.set({
        x,
        y,
        height,
        width
      })
    }

    const setDescription = ({name, description}) => {
      self.description.set({
        name,
        description
      })
    }

    const setTooltip = (tooltip) => {
      const defaultValue = tooltip.getSchema()
      self.tooltip = MTooltip.create({})
      self.tooltip.setSchema(defaultValue)
    }

    const getTooltip = (exhibit, data) => {
      if (self.updateLayer && exhibit) {
        const layer = find(exhibit.layers, (o) => o.id === self.updateLayer)
        layer.tooltip.setSchema(data)
      }
    }

    const setAnimationInPanel = (child) => {
      const {config, animation} = child
      self.animation = MAnimation.create({})
      self.animation.setConfigs(config.animation)
      self.animation.setSchema(animation.getSchema())
    }

    const setAnimationInExhibit = (exhibit, data) => {
      if (self.updateLayer && self.updateOption && exhibit) {
        const layer = find(exhibit.layers, (o) => o.id === self.updateLayer)
        const child = find(
          layer.children,
          (o) => o.option === self.updateOption
        )
        child.animation.setSchema(data)
      }
    }

    const setTabConfig = (child) => {
      const {config, tabId, graph, text} = child
      switch (tabId) {
        case "graph":
          self.graph = MGraph.create({})
          Object.entries(self.text).forEach(([key, value]) => {
            const fields = self.text.getFieldKeys()
            if (fields.indexOf(key) > -1) {
              value.setConfig({
                readOnly: true
              })
            }
          })
          self.graph.setConfigs(config.graph)
          self.graph.setSchema(graph.getSchema())
          break
        case "text":
          self.text = MText.create({})
          Object.entries(self.graph).forEach(([key, value]) => {
            const fields = self.graph.getFieldKeys()
            if (fields.indexOf(key) > -1) {
              value.setConfig({
                readOnly: true
              })
            }
          })
          self.text.setConfigs(config.text)
          self.text.setSchema(text.getSchema())
          break
        default:
          null
      }
    }

    const getTabValues = (exhibit, data) => {
      if (self.updateLayer && self.updateOption && exhibit) {
        const layer = find(exhibit.layers, (o) => o.id === self.updateLayer)
        const child = find(
          layer.children,
          (o) => o.option === self.updateOption
        )
        if (child.tabId === "graph") {
          child.graph.setSchema(data)
        }
        if (child.tabId === "text") {
          child.text.setSchema(data)
        }
        const schema = exhibit.getSchema()
        const layers = exhibit.getLayers()
        schema.data = exhibit.getData()
        schema.layers = layers
        console.log(schema)
        exhibit.adapter.update({
          action: "style",
          tabId: child.tabId,
          layerId: self.updateLayer,
          option: self.updateOption,
          value: child[child.tabId].getSchema(),
          schema
        })
      }
    }

    const getOther = (exhibit, data) => {
      const layer = find(exhibit.layers, (o) => o.id === self.updateLayer)
      if (self.updateLayer && exhibit) {
        const schema = exhibit.getSchema()
        const layers = exhibit.getLayers()
        schema.data = exhibit.getData()
        schema.layers = layers
        exhibit.adapter.update({
          action: "style",
          tabId: "other",
          layerId: self.updateLayer,
          option: "other",
          value: data,
          schema,
          totalValue: layer.other.getSchema()
        })
      }
    }

    const sendDescriptionEmitters = () => {
      const {name, description} = self.description
      event.fire(`art.${self.id}.select-range.setDescription`, {
        name,
        description
      })
    }

    const sendLayoutEmitters = () => {
      const {x, y, height, width} = self.layout
      event.fire(`art.${self.id}.select-range.setLayout`, {
        x1: x,
        y1: y,
        x2: x + width,
        y2: y + height
      })
    }

    const beforeDestroy = () => {
      event.off(`art.${self.id}.art-option.setLayout`)
      event.off(`art.${self.id}.art-option.setDescription`)
    }

    return {
      afterCreate,
      beforeDestroy,
      setLayout,
      setDescription,
      sendLayoutEmitters,
      sendDescriptionEmitters,
      clearTab,
      getOther,
      setTooltip,
      getTooltip,
      setAnimationInExhibit,
      setAnimationInPanel,

      setTabConfig,
      getTabValues
    }
  })
