import commonAction from '@utils/common-action'
import {getEnv, types, getParent, flow, getRoot} from 'mobx-state-tree'
import debounce from 'lodash/debounce'

import createLog from '@utils/create-log'
import isDef from '@utils/is-def'
import uuid from '@utils/uuid'
import {MLayout} from '../common/layout'
import {MBackgroundColor} from './art-ui-tab-property'

const log = createLog('@models/art/box.js')

export const MBox = types
  .model({
    boxId: types.union(types.string, types.number),
    name: types.string,
    frameId: types.number,
    artId: types.number,
    exhibit: types.frozen(),
    layout: types.maybe(MLayout),
    background: types.optional(MBackgroundColor, {}),

    // 使用素材的索引id
    materialIds: types.optional(types.array(types.string), []),
    remark: types.maybeNull(types.string),
    // 只有创建失败时才会需要用到的属性
    isCreateFail: types.maybe(types.boolean),

    isSelected: types.optional(types.boolean, false),
    normalKeys: types.frozen(['frameId', 'boxId', 'artId', 'exhibit', 'name', 'remark']),
    deepKeys: types.frozen(['layout', 'background']),
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
  .views((self) => ({
    get backgroundImage_() {
      if (self.background.options.sections.gradientColor.effective) {
        return self.background.options.sections.gradientColor.fields.gradientColor.value.reduce((total, current) => {
          total += `${current[0]} ${current[1] * 100}%`
          if (current[1] !== 1) {
            total += `,`
          }
          return total
        }, '')
      }
      return undefined
    },
    get backgroundColor_() {
      if (self.background.options.sections.singleColor.effective) {
        const rgb = self.background.options.sections.singleColor.fields.singleColor.value.match(/[\d.]+/g)
        const opatity = self.background.options.sections.singleColor.fields.opacity.value
        if (rgb && rgb.length >= 3) {
          return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${opatity})`
        }
        return self.background.options.sections.singleColor.fields.singleColor.value
      }
      return undefined
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
      debounceUpdate()
    }

    const updateExhibit = ({lib, key}) => {
      const {exhibitCollection, event} = self.env_
      const model = exhibitCollection.get(`${lib}.${key}`)
      if (model) {
        const art = self.art_
        const {dataPanel} = self.root_.sidebar
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
            data: dataPanel,
          })
        )
        self.exhibit = exhibit
        debounceUpdate()
      }
    }

    const updateBox = flow(function* updateBox() {
      const {io} = self.env_
      const {artId, projectId} = self.art_
      const {layout, name, frameId, exhibit, background, boxId, remark} = self
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
          remark,
        })
      } catch (error) {
        log.error('update Error: ', error)
      }
    })

    const recreateBox = flow(function* recreateBox() {
      const {io} = self.env_
      const {artId, projectId} = self.art_
      const {layout, name, frameId, exhibit, background} = self
      try {
        const box = yield io.art.createBox({
          exhibit,
          layout,
          name,
          background,
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

    const setLayout = ({x, y, height, width}) => {
      const {event} = self.env_
      self.layout.set({
        x: isDef(x) ? +x : self.layout.x,
        y: isDef(y) ? +y : self.layout.y,
        height: isDef(height) ? +height : self.layout.height,
        width: isDef(width) ? +width : self.layout.width,
      })
      const {x: x1, y: y1, height: h, width: w} = self.layout
      event.fire(`art.${self.artId}.select-range.setLayout`, {
        x1,
        y1,
        x2: x1 + w,
        y2: y1 + h,
      })
      debounceUpdate()
    }

    const debounceUpdate = debounce(() => {
      self.updateBox()
    }, 2000)

    const setRemark = ({name = self.name, remark = self.remark}) => {
      self.set({
        name,
        remark,
      })
      debounceUpdate()
    }

    return {
      resize,
      recreateBox,
      updateMaterialId,
      updateExhibit,
      setRemark,
      setLayout,
      updateBox,
    }
  })
