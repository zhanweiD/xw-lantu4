import {types} from "mobx-state-tree"
import uuid from "@utils/uuid"
import commonAction from "@utils/common-action"
import {transform} from "./exhibit-config"

// const createLayer = (key, layer) => {
//   const {name, type, id = uuid(), sections, fields} = layer
//   const MLayer = types
//     .model(`M${key}Layer`, {
//       id: types.optional(types.string, id),
//       type: types.optional(types.string, type),
//       name: types.optional(types.string, name)
//     })
//     .actions(commonAction(["set", "getSchema", "setSchema"]))
//     .actions((self) => {
//       const afterCreate = () => {
//         const MConfig = transform({id, sections, fields})
//         const x = MConfig.create({})
//         console.log(x)
//       }
//       return {
//         afterCreate
//       }
//     })
//   return MLayer.create(layer)
// }

export const createExhibitLayersClass = (key, layers) => {
  const result = layers.map((layer) => {
    // createLayer(key, layer)
    const {name, type, id = uuid(), sections, fields} = layer
    return transform({id, type, name, sections, fields})
  })
  return result
}
