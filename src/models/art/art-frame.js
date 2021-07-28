import {types, getParent, flow, getEnv, getRoot} from "mobx-state-tree"
import commonAction from "@utils/common-action"
import uuid from "@utils/uuid"
import {MArtFrameGrid} from "./art-frame-grid"
import {MLayout} from "../common/layout"
import {MBox} from "./box"
import {MBackground} from "../common/background"

export const MArtFrame = types
  .model({
    frameId: types.number,
    id: types.identifier,
    artId: types.number,
    projectId: types.number,
    name: types.string,
    isSelected: types.optional(types.boolean, false),
    isMain: types.optional(types.boolean, false),
    grid: types.optional(MArtFrameGrid, {}),
    logicLayout: types.maybe(MLayout),
    layout: types.maybe(MLayout),
    boxes: types.optional(types.array(MBox), []),
    backgroud: types.optional(MBackground, {}),
    normalKeys: types.frozen(["frameId", "artId", "name", "isMain"]),
    deepKeys: types.frozen(["boxes", "logicLayout"])
  })
  .views((self) => ({
    get env_() {
      return getEnv(self)
    },
    get root_() {
      return getRoot(self)
    },
    get art_() {
      return getParent(self, 3)
    },
    get isSnap_() {
      return getParent(self, 2).isSnap
    },
    get baseOffsetX_() {
      return getParent(self, 2).baseOffsetX
    },
    get baseOffsetY_() {
      return getParent(self, 2).baseOffsetY
    },
    get scaler_() {
      return getParent(self, 2).scaler
    },
    get x1_() {
      return self.layout.x
    },
    get y1_() {
      return self.layout.y
    },
    get x2_() {
      return self.x1_ + self.layout.width
    },
    get y2_() {
      return self.y1_ + self.layout.height
    },
    get nameX_() {
      return self.x1_ * self.scaler_ + self.baseOffsetX_
    },
    get nameY_() {
      // 24是画布标题Y轴相对于画布定边缘的偏移
      return self.y1_ * self.scaler_ + self.baseOffsetY_ - 19
    }
  }))
  .actions(commonAction(["set", "getSchema"]))
  .actions((self) => {
    // 选中
    const select = () => {
      self.set({
        isSelected: true
      })
    }
    // 取消选中
    const unselect = () => {
      self.set({
        isSelected: false
      })
    }

    const getNearlyOrigin = (origin, target) => {
      const grid = self.grid.unit_ * self.scaler_
      const x =
        Math.floor((target.x - origin.x) / grid) * grid -
        self.grid.extendX_ * self.scaler_
      const y =
        Math.floor((target.y - origin.y) / grid) * grid -
        self.grid.extendY_ * self.scaler_
      return {
        x,
        y
      }
    }

    const createBox = flow(function* createBox(params) {
      const {io, exhibitCollection} = self.env_
      const {projectId, data} = params
      const {frameId, artId} = self
      const findAdapter = exhibitCollection.has(`${data.lib}.${data.key}`)
      if (findAdapter.has) {
        const art = getParent(self, 3)
        const model = findAdapter.value.initModel({
          art,
          themeId: art.artOption.basic.themeId,
          schema: {
            lib: data.lib,
            key: data.key,
            id: uuid()
          }
        })
        const exhibit = model.getSchema()
        const frameviewport = document
          .querySelector(`#artFrame-${frameId}`)
          .getBoundingClientRect()
        const gridOrigin = document
          .querySelector(`#artFramegrid-${frameId}`)
          .getBoundingClientRect()
        const deviceXY = {
          x: frameviewport.x,
          y: frameviewport.y
        }

        const nomal = {
          x: data.position.x - deviceXY.x,
          y: data.position.y - deviceXY.y
        }

        const targetPosition = self.isSnap_
          ? getNearlyOrigin(gridOrigin, data.position)
          : nomal
        const layout = {
          x: Math.round(targetPosition.x / self.scaler_),
          y: Math.round(targetPosition.y / self.scaler_),
          width: Math.round(exhibit.initSize[0]),
          height: Math.round(exhibit.initSize[1])
        }
        try {
          const box = yield io.art.createBox({
            exhibit,
            layout,
            layer: {},
            name: `容器-${uuid().substring(0, 4)}`,
            ":artId": artId,
            ":frameId": frameId,
            ":projectId": projectId
          })
          self.initBox(box)
          getParent(self, 2).toggleSelectRange({
            target: "box",
            selectRange: [
              {
                frameId,
                boxIds: [box.boxId]
              }
            ]
          })
        } catch (error) {
          // todo
          console.log(error)
        }
      }
    })
    const initBox = ({artId, boxId, name, frameId, exhibit, layout}) => {
      const {exhibitCollection, event} = self.env_
      const box = MBox.create({
        artId,
        boxId,
        name,
        frameId,
        exhibit,
        layout,
        logicLayout: layout
      })
      self.boxes.push(box)
      const model = exhibitCollection.get(`${exhibit.lib}.${exhibit.key}`)
      if (model) {
        const art = self.art_
        const {sidebar} = self.root_
        const {dataPanel, projectPanel} = sidebar
        const {projects} = projectPanel
        const {dataList} = projects.find((o) => o.projectId === self.projectId)
        art.exhibitManager.set(
          exhibit.id,
          model.initModel({
            art,
            themeId: art.artOption.basic.themeId,
            schema: exhibit,
            event,
            globalData: dataPanel,
            projectData: dataList
          })
        )
      }
    }

    const updateFrame = flow(function* updateFrame(params) {
      const {io} = self.env_
      const {artId, projectId, frameId} = self
      try {
        yield io.art.updateFrame({
          layout: {
            ...params
          },
          ":artId": artId,
          ":projectId": projectId,
          ":frameId": frameId
        })
        self.logicLayout = {...params}
      } catch (error) {
        console.log(error)
      }
    })

    const removeBoxes = (boxIds) => {
      self.boxes = self.boxes.filter((box) => !boxIds.includes(box.boxId))
    }

    return {
      select,
      unselect,
      createBox,
      updateFrame,
      initBox,
      removeBoxes
    }
  })
