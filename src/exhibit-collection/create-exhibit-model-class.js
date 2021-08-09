/*
 * @Author: 柿子
 * @Date: 2021-07-28 13:40:30
 * @LastEditTime: 2021-08-03 18:20:27
 * @LastEditors: 柿子
 * @Description: In User Settings Edit
 * @FilePath: /waveview-front4/src/exhibit-collection/create-exhibit-model-class.js
 */
import {types, getEnv} from "mobx-state-tree"
import commonAction from "@utils/common-action"

export const createExhibitModelClass = (exhibit) => {
  const {config} = exhibit

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
      cachedData: types.frozen(),
      context: types.frozen(),
      normalKeys: types.frozen(["id", "lib", "key", "initSize", "coordinate"])
    })
    .views((self) => ({
      get art_() {
        return getEnv(self).art
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

      const setAdapter = (adapter) => {
        self.adapter = adapter
      }

      return {
        setCachedData,
        setContext,
        setAdapter
      }
    })

  return MExhibit
}
