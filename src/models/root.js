import {types, getEnv} from "mobx-state-tree"
// import {globalEvent} from '@utils/create-event'
import {MHead} from "./head"
// import {MSidebar} from './sidebar'
// import {MEditor} from './editor/editor'
// import {MUser} from './user'
// import {MOptionPanel} from './option-panel'
// import {MOverlayManager} from './common/overlay'
// import {MColorPickerBox} from './common/color-picker-box'
// import {MDataProcessor} from './common/data-processor'

export const MRoot = types
  .model("MRoot", {
    // user: types.maybe(MUser),
    head: types.optional(MHead, {})
    // sidebar: types.optional(MSidebar, {}),
    // editor: types.optional(MEditor, {}),
    // optionPanel: types.optional(MOptionPanel, {}),
    // overlayManager: types.optional(MOverlayManager, {}),
    // colorPickerBox: types.optional(MColorPickerBox, {}),
    // dataProcessor: types.optional(MDataProcessor, {}),
  })
  .views((self) => ({
    get env_() {
      return getEnv(self)
    }
  }))
  .actions((self) => {
    const afterCreate = () => {
      const {session} = self.env_
      // self.getUserInfo()
      const activePanelInSession = session.get("activePanel", "projects")
      self.head = {
        activePanelButton: activePanelInSession
      }
      // self.sidebar = {}
      // event.fire('sidebar.toggleActivePanel', activePanelInSession)

      //   globalEvent.on('globalClick', () => {
      //     self.overlayManager.hideAll()
      //   })

      //   // overlay
      //   self.overlayManager.create({
      //     id: 'menu',
      //     width: 160,
      //     closable: false,
      //     hideWhenOutsideClick: true,
      //   })

      //   self.overlayManager.create({
      //     id: 'modal',
      //     hasMask: true,
      //     width: 800,
      //     height: 600,
      //   })

      //   self.overlayManager.create({
      //     id: 'confirm',
      //     hasMask: true,
      //     width: 300,
      //     canDrag: false,
      //   })

      //   self.overlayManager.create({
      //     id: 'fieldModal',
      //     type: 'fieldModal',
      //     hasMask: true,
      //     width: 320,
      //     canDrag: false,
      //   })

      //   self.overlayManager.create({
      //     id: 'dataProcessor',
      //     title: '数据处理',
      //     width: 800,
      //     height: 700,
      //     canDrag: true,
      //   })

      //   self.overlayManager.create({
      //     id: 'dataSourceModal',
      //     width: 800,
      //     height: 600,
      //     canDrag: true,
      //   })

      //   self.overlayManager.create({
      //     id: 'otherlayer',
      //     width: 360,
      //     canDrag: true,
      //   })

      //   self.overlayManager.create({
      //     id: 'materialModal',
      //     width: 800,
      //     height: 500,
      //   })

      //   self.overlayManager.create({
      //     id: 'colorPicker',
      //     width: 220,
      //     hideWhenOutsideClick: true,
      //   })

      //   self.overlayManager.create({
      //     id: 'selectMenu',
      //     width: 216,
      //   })

      //   self.overlayManager.create({
      //     id: 'dataSourceMenu',
      //     width: 216,
      //   })
    }
    // // 获取当前登录用户详情
    // const getUserInfo = flow(function* getUserInfo() {
    //   const {io} = self.env_
    //   const content = yield io.auth.loginInfo()
    //   self.user = content
    // })
    // /**
    //  * 判断用户是否有操作权限，注意还要结合数据的权限
    //  * @param {String}} permissionCode
    //  * @param {Array} permissions 项目的权限
    //  * @returns {Boolean}
    //  */
    // const hasPermission = (permissionCode = '', permissions = []) => {
    //   return self.user.hasPermission(permissionCode, permissions)
    // }
    // /**
    //  * 提示
    //  * @param {Object} options
    //  */
    // const confirm = options => {
    //   const confirmLayer = self.overlayManager.get('confirm')
    //   confirmLayer.onConfirm = options.onConfirm
    //   confirmLayer.show(options)
    // }
    // /**
    //  * 颜色拾取
    //  * @param {Object} options
    //  */
    // const colorPicker = options => {
    //   const colorPickerLayer = self.overlayManager.get('colorPicker')
    //   colorPickerLayer.onChange = options.onChange
    //   colorPickerLayer.isColorArrayForm = options.isColorArrayForm || false
    //   colorPickerLayer.opacityMax = options.opacityMax || 1
    //   // 不显示关闭按钮
    //   colorPickerLayer.show({...options, closable: false})
    //   // 每次打开颜色选择器初始化
    //   self.colorPickerBox.setValue(options.content)
    //   self.colorPickerBox.setOpacityMax(colorPickerLayer.opacityMax)
    // }

    return {
      afterCreate
      // getUserInfo,
      // hasPermission,
      // confirm,
      // colorPicker,
    }
  })
