import commonAction from '@utils/common-action'
import {getEnv, types, getParent, flow, getRoot} from 'mobx-state-tree'
import {MLayout} from '../common/layout'
import createLog from '@utils/create-log'
import uuid from '@utils/uuid'

const log = createLog('@models/art/box.js')

const MBackground = types
  .model('MBackground', {
    color: types.maybe(types.string, 'transparent'),
    opacity: types.optional(types.number, 1),
    gradient: types.maybe(types.string),
  })
  .actions(commonAction(['set']))

export const MBox = types
  .model({
    boxId: types.union(types.string, types.number),
    name: types.string,
    frameId: types.number,
    artId: types.number,
    exhibit: types.frozen(),
    layout: types.maybe(MLayout),
    background: types.maybeNull(MBackground),

    // 使用素材的索引id
    materialIds: types.optional(types.array(types.string), []),
    remark: types.maybeNull(types.string),
    // 只有创建失败时才会需要用到的属性
    isCreateFail: types.maybe(types.boolean),

    isSelected: types.optional(types.boolean, false),
    normalKeys: types.frozen(['frameId', 'boxId', 'artId', 'exhibit', 'background', 'name']),
    deepKeys: types.frozen(['layout']),
  })
  .views((self) => ({
    get root_() {
      return getRoot(self)
    },
    get env_() {
      return getEnv(self)
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
    get art_() {
      return getParent(self, 5)
    },
    get viewport_() {
      return getParent(self, 4)
    },
    get frame_() {
      return getParent(self, 2)
    },
  }))
  .actions(commonAction(['set', 'getSchema']))
  .actions((self) => {
    const resize = () => {
      const {layout} = self
      const {width, height} = layout
      if (self.exhibit) {
        const exhibitModel = self.art_.exhibitManager.get(self.exhibit.id)
        //   //这里if是因为exhibit组件根本没对接进来 暂时保证正确性
        if (exhibitModel.adapter) {
          exhibitModel.adapter.refresh(width, height)
        }
      }
    }

    const updateMaterialId = (data) => {
      self.materialIds.unshift(data.material.materialId)
      updateBox()
    }

    const updateExhibit = ({lib, key}) => {
      const {exhibitCollection, event} = self.env_
      const model = exhibitCollection.get(`${lib}.${key}`)
      if (model) {
        const art = self.art_
        const {dataPanel, projectPanel} = self.root_.sidebar
        const {projects} = projectPanel
        let dataList
        if (projects.length) {
          dataList = projects.find((o) => o.projectId === self.art_.projectId)?.dataList
        }
        const exhibitModel = model.initModel({
          art,
          themeId: art.basic.themeId,
          schema: {
            lib,
            key,
            id: uuid(),
          },
        })
        const exhibit = exhibitModel.getSchema()
        art.exhibitManager.set(
          exhibit.id,
          model.initModel({
            art,
            themeId: art.basic.themeId,
            schema: exhibit,
            event,
            globalData: dataPanel,
            projectData: dataList,
          })
        )
        self.exhibit = exhibit
        updateBox()
      }
    }

    const updateBox = flow(function* updateBox() {
      const {io} = self.env_
      const {artId, projectId} = self.art_
      const {layout, name, frameId, exhibit, background, boxId} = self
      try {
        yield io.art.updateBox({
          ':boxId': boxId,
          ':artId': artId,
          ':frameId': frameId,
          ':projectId': projectId,
          name,
          layout,
          exhibit,
          background,
        })
      } catch (error) {
        log.error('update Error: ', error)
      }
    })

    const recreateBox = flow(function* recreateBox() {
      const {io} = self.env_
      const {artId, projectId} = self.art_
      const {layout, name, frameId, exhibit} = self
      try {
        const box = yield io.art.createBox({
          exhibit,
          layout,
          name,
          ':artId': artId,
          ':frameId': frameId,
          ':projectId': projectId,
        })

        self.boxId = box.boxId
        self.isCreateFail = undefined
        self.viewport_.selectRange.set({
          range: [{frameId}],
        })
      } catch (error) {
        log.error('recreateBox Error: ', error)
      }
    })

    return {
      resize,
      recreateBox,
      updateMaterialId,
      updateExhibit,
    }
  })
