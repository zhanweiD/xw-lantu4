import {types, getParent, getEnv, getRoot, flow} from 'mobx-state-tree'
import debounce from 'lodash/debounce'
import commonAction from '@utils/common-action'
import uuid from '@utils/uuid'
import isDef from '@utils/is-def'
import createLog from '@utils/create-log'
import {MBox} from './box'
import {MArtFrameGrid} from './art-frame-grid'
import {MLayout} from '../common/layout'
import {MBackgroundColor} from './art-ui-tab-property'

const log = createLog('@models/art/art-frame.js')
export const MArtFrame = types
  .model('MArtFrame', {
    frameId: types.union(types.string, types.number),
    artId: types.number,
    name: types.string,
    isMain: types.optional(types.boolean, false),
    // 实际上的位置信息，基于主画布的左上角坐标构建
    layout: types.maybe(MLayout),
    boxes: types.optional(types.array(MBox), []),
    background: types.optional(MBackgroundColor, {
      options: {
        sections: {
          gradientColor: {
            effective: true,
            fields: {
              gradientColor: [
                ['rgb(0,56,144)', 0],
                ['rgb(0,24,61)', 1],
              ],
            },
          },
        },
      },
    }),
    remark: types.maybe(types.string),
    materials: types.frozen(),

    // 只有创建失败时才会需要用到的属性
    isCreateFail: types.maybe(types.boolean),
    // 动态展示的位置信息，原点不定，可视区域中最小的左上角计算得出
    viewLayout: types.maybe(MLayout),
    grid: types.optional(MArtFrameGrid, {}),
    normalKeys: types.frozen(['frameId', 'artId', 'name', 'isMain', 'materials', 'remark']),
    deepKeys: types.frozen(['boxes', 'layout', 'background']),
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
    get viewport_() {
      return getParent(self, 2)
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
      return self.viewLayout.x
    },
    get y1_() {
      return self.viewLayout.y
    },
    get x2_() {
      return self.x1_ + self.viewLayout.width
    },
    get y2_() {
      return self.y1_ + self.viewLayout.height
    },
    get nameX_() {
      return self.x1_ * self.scaler_ + self.baseOffsetX_
    },
    get nameY_() {
      // 24是画布标题Y轴相对于画布定边缘的偏移
      return self.y1_ * self.scaler_ + self.baseOffsetY_ - 19
    },
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
  .actions(commonAction(['set', 'getSchema', 'dumpSchema']))
  .actions((self) => {
    const getNearlyOrigin = (origin, target) => {
      const grid = self.grid.unit_ * self.scaler_
      const x = Math.floor((target.x - origin.x) / grid) * grid - self.grid.extendX_ * self.scaler_
      const y = Math.floor((target.y - origin.y) / grid) * grid - self.grid.extendY_ * self.scaler_
      return {
        x,
        y,
      }
    }

    const initBox = ({artId, boxId, name, frameId, exhibit, layout, background, remark, materials, padding}) => {
      const {exhibitCollection, event} = self.env_
      const box = MBox.create({
        artId,
        boxId,
        name,
        frameId,
        exhibit,
        layout,
        remark,
        materials,
      })
      box.padding.setSchema(padding)
      box.background.setSchema(background)

      self.boxes.push(box)
      if (exhibit) {
        const model = exhibitCollection.get(`${exhibit.lib}.${exhibit.key}`)
        const {dataPanel} = self.root_.sidebar

        if (model) {
          const art = self.art_

          art.exhibitManager.set(
            exhibit.id,
            model.initModel({
              art,

              schema: exhibit,
              event,
              data: dataPanel,
            })
          )
        }
      }
      if (materials) {
        materials.forEach((material) => {
          const model = exhibitCollection.get(`${material.lib}.${material.key}`)
          if (model) {
            const art = self.art_
            art.exhibitManager.set(
              material.id,
              model.initModel({
                art,
                schema: material,
                event,
              })
            )
          }
        })
      }
    }

    const createBox = flow(function* createBox({position, lib, key}) {
      const {io, exhibitCollection} = self.env_
      const {artId, projectId} = self.art_
      const {frameId} = self
      const art = self.art_
      const findAdapter = exhibitCollection.has(`${lib}.${key}`)
      const model = findAdapter.value.initModel({
        art,
        schema: {
          lib,
          key,
          id: uuid(),
        },
      })

      const exhibit = model.getSchema()
      const frameviewport = document.querySelector(`#artFrame-${frameId}`).getBoundingClientRect()
      const gridOrigin = document.querySelector(`#artFramegrid-${frameId}`).getBoundingClientRect()
      const deviceXY = {
        x: frameviewport.x,
        y: frameviewport.y,
      }
      const nomal = {
        x: position.x - deviceXY.x,
        y: position.y - deviceXY.y,
      }
      const targetPosition = art.isSnap ? getNearlyOrigin(gridOrigin, position) : nomal
      const layout = {
        x: Math.round(targetPosition.x / self.scaler_),
        y: Math.round(targetPosition.y / self.scaler_),
        width: Math.round(exhibit.initSize[0] * self.grid.unit_),
        height: Math.round(exhibit.initSize[1] * self.grid.unit_),
      }

      const boxId = uuid()
      const params = {
        artId,
        name: `容器-${boxId.substring(0, 4)}`,
        frameId,
        exhibit,
        layout,
      }
      self.initBox({boxId, ...params})
      self.viewport_.toggleSelectRange({
        target: 'box',
        selectRange: [
          {
            frameId,
            boxIds: [boxId],
          },
        ],
      })
      const realBox = self.boxes.find((o) => o.boxId === boxId)
      try {
        const box = yield io.art.createBox({
          exhibit,
          layout,
          name: params.name,
          ':artId': params.artId,
          ':frameId': params.frameId,
          ':projectId': projectId,
        })
        realBox.set({
          boxId: box.boxId,
        })

        self.viewport_.selectRange.set({
          range: [
            {
              frameId,
              boxIds: [realBox.boxId],
            },
          ],
        })
      } catch (error) {
        realBox.set({
          isCreateFail: true,
        })
        log.error('createBox Error: ', error)
      }
    })

    const recreateFrame = flow(function* recreateFrame() {
      const {io} = self.env_
      const {artId, projectId} = self.art_
      const {layout, name} = self
      try {
        const {frameId} = yield io.art.addFrame({
          name,
          layout,
          ':projectId': projectId,
          ':artId': artId,
        })

        self.frameId = frameId
        self.isCreateFail = undefined
        self.viewport_.selectRange.set({
          range: [{frameId}],
        })
      } catch (error) {
        log.error('recreateFrame Error:', error)
      }
    })

    const updateFrame = flow(function* updateFrame() {
      const {io} = self.env_
      const {artId, projectId} = self.art_
      const {frameId, layout, background, remark, name, materials} = self
      try {
        yield io.art.updateFrame({
          layout,
          background,
          remark,
          name,
          materials,
          ':artId': artId,
          ':projectId': projectId,
          ':frameId': frameId,
        })
      } catch (error) {
        log.error('updateFrame Error:', error)
      }
    })

    const removeBoxes = (boxIds) => {
      self.boxes = self.boxes.filter((box) => !boxIds.includes(box.boxId))
    }

    const setLayout = ({x, y, height, width}) => {
      const {event} = self.env_
      self.viewLayout.set({
        x: isDef(x) ? +x + self.viewLayout.x - self.layout.x : self.viewLayout.x,
        y: isDef(y) ? +y + self.viewLayout.y - self.layout.y : self.viewLayout.y,
        height: isDef(height) ? +height + self.viewLayout.height - self.layout.height : self.viewLayout.height,
        width: isDef(width) ? +width + self.viewLayout.width - self.layout.width : self.viewLayout.width,
      })
      self.layout.set({
        x: isDef(x) ? +x : self.layout.x,
        y: isDef(y) ? +y : self.layout.y,
        height: isDef(height) ? +height : self.layout.height,
        width: isDef(width) ? +width : self.layout.width,
      })
      const {x: x1, y: y1, height: h, width: w} = self.viewLayout

      event.fire(`art.${self.artId}.select-range.setLayout`, {
        x1,
        y1,
        x2: x1 + w,
        y2: y1 + h,
      })
      debounceUpdate()
    }

    const debounceUpdate = debounce(() => {
      self.updateFrame()
    }, 2000)

    const setRemark = ({name = self.name, remark = self.remark}) => {
      self.set({
        name,
        remark,
      })
      debounceUpdate()
      if (self.isMain) {
        const {event} = self.env_
        event.fire('editor.updateTabname', {id: self.artId, name})
      }
    }

    const addBackground = ({key, lib, name, materialId, type}) => {
      const {exhibitCollection, event} = self.env_
      const model = exhibitCollection.get(`${lib}.${key}`)
      if (model) {
        const art = self.art_
        const schema = {
          lib,
          key,
        }
        if (type === 'image') {
          schema.id = `${materialId}.${uuid()}`

          schema.layers = [
            {
              id: materialId,
              name,
            },
          ]
        } else {
          schema.id = uuid()
        }
        const materialModel = model.initModel({
          art,
          schema,
        })
        const material = materialModel.getSchema()
        art.exhibitManager.set(
          material.id,
          model.initModel({
            art,
            schema: material,
            event,
          })
        )
        const materials = self.materials?.map((material) => art.exhibitManager.get(material.id).getSchema()) || []

        self.materials = [].concat(material).concat(...materials)
        debounceUpdate()
        event.fire(`art.${art.artId}.addMaterial`, {
          materialId,
          id: self.frameId,
        })
      }
    }
    const removeBackground = (materialId) => {
      const {event} = self.env_
      const materials = self.materials.map((material) => self.art_.exhibitManager.get(material.id).getSchema())
      self.materials = materials.filter((material) => material.id !== materialId)
      debounceUpdate()
      self.art_.exhibitManager.remove(materialId)
      event.fire(`art.${self.art_.artId}.removeMaterial`, {
        materialId: materialId.split('.')[0],
        id: self.frameId,
      })
    }
    const sortBackground = (materialId, direction) => {
      const index = self.materials.findIndex((material) => material.id === materialId)
      if (direction === 'up') {
        if (index !== 0) {
          self.materials = []
            .concat(self.materials.slice(0, index - 1))
            .concat(self.materials[index])
            .concat(self.materials[index - 1])
            .concat(self.materials.slice(index + 1))
        }
      }

      if (direction === 'down') {
        if (index !== self.materials.length - 1) {
          self.materials = []
            .concat(self.materials.slice(0, index))
            .concat(self.materials[index + 1])
            .concat(self.materials[index])
            .concat(self.materials.slice(index + 2))
        }
      }
    }

    const afterCreate = () => {
      console.log('artframe', self.background.getSchema())
    }
    return {
      initBox,
      createBox,
      removeBoxes,
      setRemark,
      setLayout,
      updateFrame,
      addBackground,
      removeBackground,
      sortBackground,
      recreateFrame,
      afterCreate,
    }
  })
