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
import {MGroup} from './group'

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
    background: types.optional(MBackgroundColor, {}),
    remark: types.maybe(types.string),
    materials: types.frozen(),

    // 只有创建失败时才会需要用到的属性
    isCreateFail: types.maybe(types.boolean),
    // 动态展示的位置信息，原点不定，可视区域中最小的左上角计算得出
    viewLayout: types.maybe(MLayout),
    grid: types.optional(MArtFrameGrid, {}),
    groups: types.optional(types.array(MGroup), []),
    normalKeys: types.frozen(['frameId', 'artId', 'name', 'isMain', 'materials', 'remark', 'groups']),
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

    // 将box根据groupId分类
    get layerTreeList_() {
      const boxes = [...self.boxes]
      let treeList = []
      // 统一面板和图层显示顺序
      boxes.reverse()

      boxes.forEach((item) => {
        const {groupIds = []} = item
        if (groupIds.length) {
          const groupIndex = treeList?.findIndex((group) => {
            return group?.groupIds?.[0] === groupIds?.[0]
          })
          if (groupIndex !== -1) {
            treeList[groupIndex].boxes.push(item)
          } else {
            treeList.push({
              groupIds: [...groupIds],
              boxes: [item],
            })
          }
        } else {
          // 保持treeList中的item格式统一，否则mobx无法观测到treeList的改变
          // treeList.push(item) // 控制台mobx会警告访问越界
          treeList.push({
            groupIds: [],
            boxes: [item],
          })
        }
      })
      return treeList
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

    const initBox = ({
      uid,
      artId,
      boxId,
      name,
      frameId,
      exhibit,
      layout,
      background,
      remark,
      materials,
      padding,
      constraints,
      groupIds,
    }) => {
      const {exhibitCollection, event} = self.env_
      const box = MBox.create({
        uid,
        artId,
        boxId,
        name,
        frameId,
        exhibit,
        layout,
        remark,
        materials,
        groupIds,
      })

      box.padding.setSchema(padding)
      box.background.setSchema(background)
      box.constraints.setSchema(constraints)
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

      const uid = uuid()
      const params = {
        artId,
        name: `容器-${uid.substring(0, 4)}`,
        frameId,
        exhibit,
        layout,
      }
      self.initBox({uid, ...params})
      self.viewport_.toggleSelectRange({
        target: 'box',
        selectRange: [
          {
            frameId,
            boxIds: [uid],
          },
        ],
      })
      const realBox = self.boxes.find((o) => o.uid === uid)
      try {
        const box = yield io.art.createBox({
          uid,
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
      // 同时处理box的关联的分组
      self.groups = self.groups
        .map((group) => {
          return {...group, boxIds: group.boxIds.filter((boxId) => !boxIds.includes(boxId))}
        })
        .filter((item) => item.boxIds?.length)
      self.art_.save()
    }

    const setLayout = ({x, y, height, width}) => {
      const {event} = self.env_
      const layout = {
        x: isDef(x) ? +x + self.viewLayout.x - self.layout.x : self.viewLayout.x,
        y: isDef(y) ? +y + self.viewLayout.y - self.layout.y : self.viewLayout.y,
        height: isDef(height) ? +height + self.viewLayout.height - self.layout.height : self.viewLayout.height,
        width: isDef(width) ? +width + self.viewLayout.width - self.layout.width : self.viewLayout.width,
      }
      const {x: x1, y: y1, height: h, width: w} = layout
      event.fire(`art.${self.artId}.select-range.setLayout`, {
        x1,
        y1,
        x2: x1 + w,
        y2: y1 + h,
      })
      self.viewLayout.set(layout)
      self.layout.set({
        x: isDef(x) ? +x : self.layout.x,
        y: isDef(y) ? +y : self.layout.y,
        height: isDef(height) ? +height : self.layout.height,
        width: isDef(width) ? +width : self.layout.width,
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

    const initGroup = ({id, name, boxIds}) => {
      const group = MGroup.create({id, boxIds, name})
      self.groups.push(group)
    }

    const copyBox = flow(function* copyBox(box) {
      const {io} = self.env_
      const {artId, projectId} = self.art_
      const uid = uuid()
      const layout = {...box.layout, x: box.layout.x + 20, y: box.layout.y + 20}
      const params = {
        materials: box.materials,
        artId,
        frameId: box.frameId,
        exhibit: box.exhibit,
        uid,
        name: `容器-${uid.substring(0, 4)}`,
        layout,
      }
      self.initBox(params)
      const realBox = self.boxes.find((o) => o.uid === uid)
      try {
        const currentBox = yield io.art.createBox({
          uid: params.uid,
          materials: box.materials,
          exhibit: box.exhibit,
          layout,
          name: params.name,
          ':artId': params.artId,
          ':frameId': params.frameId,
          ':projectId': projectId,
        })
        realBox.set({
          boxId: currentBox.boxId,
        })
        self.viewport_.selectRange.set({
          range: [
            {
              frameId: box.frameId,
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

      self.viewport_.toggleSelectRange({
        target: 'box',
        selectRange: [
          {
            frameId: box.frameId,
            boxIds: [uid],
          },
        ],
      })
    })
    const addBoxesToGroup = (boxes, groupId) => {
      let tempBoxes = self.boxes
      boxes.map((item) => {
        // 将tempbox处理为不包含成组box
        tempBoxes = tempBoxes.filter((box) => box.boxId !== item.boxId)
        item.addGroup(groupId)
      })
      // boxes排序
      self.boxes = tempBoxes.slice(0, boxes[0].zIndex_).concat(boxes).concat(tempBoxes.slice(boxes[0].zIndex_))
    }

    // 创建分组
    const createGroup = (boxes) => {
      // 成组之前如果box在其他组内，需要先解组
      // removeGroupByBoxes(boxes)
      const id = uuid()
      const groups = MGroup.create({
        id,
        boxIds: boxes.map((item) => item.boxId),
        name: `分组_${id.substring(0, 4)}`,
      })
      self.groups.push(groups)
      addBoxesToGroup(boxes, id)
    }

    // 根据box批量解组
    const removeGroupByBoxes = (boxes) => {
      boxes.forEach((box) => {
        if (!box.groupIds.length) return // 兼容拖拽操作
        // 移出分组同时box进行排序
        const sourceGroup = self.groups.find((item) => item.id === box?.groupIds[0])
        if (sourceGroup) {
          // 找到组内最后一个元素，解组后插到最后一个元素后边
          const lastBoxId = sourceGroup.boxIds[sourceGroup.boxIds.length - 1]
          const targetIndex = self.boxes.find((item) => item.boxId === lastBoxId).zIndex_
          if (targetIndex > box.zIndex_) {
            self.boxes = self.boxes
              .slice(0, box.zIndex_)
              .concat(self.boxes.slice(box.zIndex_ + 1, targetIndex + 1))
              .concat(box)
              .concat(self.boxes.slice(targetIndex + 1))
          }
        }

        // 在box解除绑定关系
        box.removeGroup()
        self.groups = self.groups
          .map((group) => {
            return {
              ...group,
              boxIds: group.boxIds.filter((item) => item !== box.boxId),
            }
          })
          .filter((group) => group.boxIds.length)
      })
    }

    // 根据groupids解组 /*----图层面板上的解组用到---*/
    const removeGroupByGroupIds = (groupIds) => {
      // group纬度上解组
      groupIds.forEach((groupId) => {
        self.groups.forEach((group) => {
          if (group.id === groupId) {
            const boxes = self.boxes.filter((item) => group.boxIds.includes(item.boxId))
            // 解除box上的分组绑定关系
            removeGroupByBoxes(boxes)
          }
        })
      })
    }

    // 将某个box移动至某个组
    const moveBoxToGroup = (boxes, groupId) => {
      // 先移出原分组
      removeGroupByBoxes(boxes)
      // 将box移至新分组
      addBoxesToGroup(boxes, groupId)
    }

    /**
     * 图层移动
     * @param {*} currentIndex box的原来位置
     * @param {*} targetIndex box的目标位置
     */
    const moveBox = (currentIndex, targetIndex) => {
      const boxList = [...self.boxes]
      const tmp = boxList[currentIndex] // 被移动的元素
      boxList.splice(currentIndex, 1) // 移除拖拽项
      boxList.splice(targetIndex, 0, tmp) // 插入放置项
      self.boxes = boxList
    }

    /**
     * 拖拽移动
     * @param {*} boxes 拖拽box
     * @param {*} targetIndex 拖拽的目标位置
     */
    const dropMove = (boxes, targetIndex) => {
      // 判断目标位置是否在组内
      const targetGroup = self.boxes[targetIndex]?.groupIds
      boxes.forEach((box) => {
        // 拖到组内（组到组或组外到组内）
        if (targetGroup.length) {
          // 同组拖动
          if (box.groupIds[0] === targetGroup[0]) {
            moveBox(box.zIndex_, targetIndex)
          } else {
            moveBoxToGroup([box], targetGroup[0])
            // 不同组拖动
            // box.removeGroup()
            // self.groups = self.groups
            //   .map((group) => {
            //     return {
            //       ...group,
            //       boxIds: group.boxIds.filter((item) => item !== box.boxId),
            //     }
            //   })
            //   .filter((group) => group.boxIds.length)
            // moveBoxToGroup([box], targetGroup[0])
          }
        } else {
          // 拖到组外（组内到组外）
          removeGroupByBoxes([box])
          // if (box?.groupIds?.length) {
          //   box.removeGroup()
          //   self.groups = self.groups
          //     .map((group) => {
          //       return {
          //         ...group,
          //         boxIds: group.boxIds.filter((item) => item !== box.boxId),
          //       }
          //     })
          //     .filter((group) => group.boxIds.length)
          // }
          // 组外到组外
          moveBox(box.zIndex_, targetIndex)
        }
      })
    }
    /**
     * 组移动
     * @param {*} currentIndex box的原来位置
     * @param {*} targetIndex box的目标位置
     */
    const moveGroup = (groupId, targetIndex) => {
      const groupBoxIds = self.groups.find((item) => item.id === groupId)?.boxIds || []
      const currentBoxes = self.boxes.map((item) => groupBoxIds.includes(item.boxId))
      let boxList = []
      const currentStartIndex = currentBoxes?.[0]?.zIndex_
      if (targetIndex > currentStartIndex) {
        // 下移
        boxList = self.boxes
          .slice(0, currentStartIndex)
          .concat(self.boxes.slice(currentStartIndex + currentBoxes.length, targetIndex + 1))
          .concat(currentBoxes)
          .concat(self.boxes.slice(targetIndex + 1))
      } else {
        // 上移
        boxList = self.boxes
          .slice(0, targetIndex + 1)
          .concat(currentBoxes)
          .concat(self.boxes.slice(targetIndex + currentBoxes.length + 1, currentStartIndex))
          .concat(self.boxes.slice(currentStartIndex + currentBoxes.length))
      }
      self.boxes = boxList
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
      initGroup,
      copyBox,
      createGroup,
      removeGroupByBoxes,
      removeGroupByGroupIds,
      addBoxesToGroup,
      moveBoxToGroup,
      moveBox,
      dropMove,
      moveGroup,
    }
  })
