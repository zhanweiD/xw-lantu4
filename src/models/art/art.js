import onerStorage from "oner-storage"
import {getEnv, types, flow, getParent} from "mobx-state-tree"
import commonAction from "@utils/common-action"
import io from "@utils/io"
import config from "@utils/config"
import {createManagerModel} from "@utils/create-manager-model"
import {MArtToolbar} from "./art-toolbar"
import {MArtViewport} from "./art-viewport"
import {MArtOption} from "./art-option"
import {MPublishInfo} from "./art-publish-info"

const MData = types
  .model({
    id: types.maybe(types.number),
    usedByExhibits: types.optional(types.array(types.string), []),
    normalKeys: types.frozen(["id", "usedByExhibits"])
  })
  .actions(commonAction(["getSchema", "setSchema"]))
  .actions((self) => {
    const removeExhibit = (id) => {
      self.usedByExhibits = self.usedByExhibits.filter((v) => v !== id)
      if (self.usedByExhibits.length === 0) {
        const manager = getParent(self, 2)
        manager.remove(self.id)
      }
    }
    const addExhibit = (id) => {
      if (!self.usedByExhibits.find((v) => v === id)) {
        self.usedByExhibits.push(id)
      }
    }
    return {
      addExhibit,
      removeExhibit
    }
  })

const MDataManager = createManagerModel("MDataManager", MData)

export const MArtTab = types
  .model({
    artId: types.number,
    artToolbar: types.maybe(MArtToolbar),
    viewport: types.maybe(MArtViewport),
    artOption: types.maybe(MArtOption),
    artPublishInfo: types.maybe(MPublishInfo),
    projectId: types.maybe(types.number),
    publishId: types.maybe(types.string),
    dataManager: types.optional(MDataManager, {}),
    datas: types.frozen(),
    isArtPublishInfoVisible: types.optional(types.boolean, false),
    normalKeys: types.frozen(["artId", "projectId"]),
    deepKeys: types.frozen(["viewport", "dataManager", "artOption"]),
    fetchState: types.optional(
      types.enumeration("MArtTab.fetchState", ["loading", "success", "error"]),
      "loading"
    )
  })
  .views((self) => ({
    get env_() {
      return getEnv(self)
    }
  }))
  .actions(commonAction(["set", "getSchema"]))
  .actions((self) => {
    const afterCreate = () => {
      const {event} = self.env_
      const exhibitManager = onerStorage({
        type: "variable",
        key: `waveview-exhibit-manager-${self.frameId}` // !!! 唯一必选的参数, 用于内部存储 !!!
      })

      self.exhibitManager = exhibitManager
      event.on(`art.${self.artId}.addData`, ({exhibitId, dataId, data}) => {
        if (self.dataManager.get(dataId)) {
          const mData = self.dataManager.get(dataId)
          mData.addExhibit(exhibitId)
        } else {
          self.dataManager.create({
            id: dataId,
            usedByExhibits: [exhibitId]
          })
          if (!self.datas) {
            self.set({
              datas: []
            })
          }
          self.set({
            datas: self.datas.concat({
              id: dataId,
              data
            })
          })
        }
      })
      event.on(`art.${self.artId}.removeData`, ({exhibitId, dataId}) => {
        const data = self.dataManager.get(dataId)
        data.removeExhibit(exhibitId)
      })
    }
    const getArt = flow(function* getArt() {
      self.fetchState = "loading"
      try {
        const art = yield io.art.getDetail({
          ":artId": self.artId,
          hasBoxes: true
        })
        const ids = []
        self.dataManager = art.dataManager
        self.dataManager.map.forEach((value, key) => {
          ids.push(key)
        })
        let data
        if (ids.length > 0) {
          data = yield io.data.getDatasInfo({
            ids: ids.join(",")
          })
        }

        self.datas = data
        self.artOption.basic.setSchema({
          themeId: art.themeId,
          gridUnit: art.gridUnit,
          watermark: art.watermark,
          password: art.password
        })
        self.projectId = art.projectId
        self.publishId = art.publishId
        self.viewport.setSchema({
          frames: art.frames,
          projectId: art.projectId
        })
        self.artPublishInfo = {
          publishId: art.publishId,
          projectId: art.projectId,
          artId: art.artId
        }
        self.fetchState = "success"
      } catch (error) {
        // TODO error 统一替换
        console.log(error)
        self.fetchState = "error"
      }
    })

    const getArtData = flow(function* getData(id) {
      try {
        const data = yield io.data.getDatasInfo({
          ids: id
        })
        self.datas = data
      } catch (error) {
        console.error("Get Data Error", error)
      }
    })

    const save = flow(function* save() {
      try {
        const {artOption, viewport, artId, projectId, dataManager} =
          self.getSchema()
        const {basic} = artOption
        const {frames} = viewport
        frames.forEach((frame) => {
          frame.layout = frame.logicLayout
          const {boxes} = frame
          boxes.forEach((box) => {
            const exhibitModel = self.exhibitManager.get(box.exhibit.id)
            if (exhibitModel) {
              const schema = exhibitModel.getSchema()
              box.exhibit = schema
            }
          })
          delete frame.logicLayout
        })
        const params = {
          ":projectId": projectId,
          ":artId": artId,
          dataManager,
          ...basic,
          ...viewport
        }
        yield io.art.update(params)
        self.env_.tip.success({content: "保存成功"})
      } catch (error) {
        // TODO error 统一替换
        console.log(error)
        self.env_.tip.error({content: "保存失败"})
      }
    })

    const preview = () => {
      self.save()
      window.open(
        `${window.location.origin}${config.pathPrefix}/preview/${self.artId}`,
        "previewWindow"
      )
    }
    return {
      afterCreate,
      getArt,
      save,
      preview,
      getArtData
    }
  })
