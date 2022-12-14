import {types, getEnv} from 'mobx-state-tree'
import {globalEvent} from '@utils/create-event'
import {MHead} from './head'
import {MSidebar} from './sidebar'
import {MEditor} from './editor/editor'
import {MOptionPanel} from './option-panel'
import {MOverlayManager} from './common/overlay'
import {MColorPickerBox} from './common/color-picker-box'
import {MUser} from './user/user'

export const MRoot = types
  .model('MRoot', {
    user: types.optional(MUser, {}),
    head: types.maybe(MHead),
    sidebar: types.maybe(MSidebar),
    editor: types.maybe(MEditor),
    optionPanel: types.optional(MOptionPanel, {}),
    overlayManager: types.optional(MOverlayManager, {}),
    colorPickerBox: types.optional(MColorPickerBox, {}),
  })
  .views((self) => ({
    get env_() {
      return getEnv(self)
    },
  }))
  .actions((self) => {
    const afterCreate = () => {
      self.initRoot()
      globalEvent.on('globalClick', () => {
        self.overlayManager.hideAll()
      })

      // TODO: 这里只应该有全局的，自己模型私有使用的 直接自己实例化去玩
      // overlay
      self.overlayManager.create({
        id: 'menu',
        width: 160,
        closable: false,
        hideWhenOutsideClick: true,
      })

      self.overlayManager.create({
        id: 'confirm',
        hasMask: true,
        width: 300,
        canDrag: false,
      })

      self.overlayManager.create({
        id: 'dataSourceModal',
        width: 800,
        height: 600,
        canDrag: true,
      })

      self.overlayManager.create({
        id: 'colorPicker',
        width: 220,
        hideWhenOutsideClick: true,
      })

      self.overlayManager.create({
        id: 'selectMenu',
        width: 216,
      })

      self.overlayManager.create({
        id: 'dataSourceMenu',
        width: 216,
      })
    }

    const initRoot = () => {
      const {session} = self.env_
      const activePanelInSession = session.get('activePanel', 'projects')
      self.head = {
        activePanelButton: activePanelInSession,
      }
      self.sidebar = {
        activePanel: activePanelInSession,
      }
      self.editor = {}
    }

    /**
     * 提示
     * @param {Object} options
     */
    const confirm = (options) => {
      const confirmLayer = self.overlayManager.get('confirm')
      confirmLayer.onConfirm = options.onConfirm
      confirmLayer.show(options)
    }
    /**
     * 颜色拾取
     * @param {Object} options
     */
    const colorPicker = (options) => {
      const colorPickerLayer = self.overlayManager.get('colorPicker')
      colorPickerLayer.onChange = options.onChange
      colorPickerLayer.show({...options, closable: false})
      // 每次打开颜色选择器初始化
      self.colorPickerBox.setValue(options.content)
    }

    return {
      afterCreate,
      initRoot,
      confirm,
      colorPicker,
    }
  })
