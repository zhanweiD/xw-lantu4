import {getEnv, types, applySnapshot} from 'mobx-state-tree'
import {reaction} from 'mobx'
import {viewport} from '@utils/zoom'
import {shortcut} from '@utils/create-event'
import {MEditorTab} from './editor-tab'
import commonAction from '@utils/common-action'

export const MEditor = types
  .model({
    tabs: types.optional(types.array(MEditorTab), []),
    activeTabId: types.maybe(types.union(types.number, types.string)),
    activeNote: types.optional(types.array(types.union(types.number, types.string)), []),
    isPointerEventsNone: types.optional(types.boolean, false),
  })
  .views((self) => ({
    get env_() {
      return getEnv(self)
    },
    get isOptionPanelVisible_() {
      const tab = self.tabs.find((item) => item.id === self.activeTabId)
      return ['art', 'material', 'data'].includes(tab?.type)
    },
  }))
  .actions(commonAction(['set']))
  .actions((self) => {
    const afterCreate = () => {
      const {event} = self.env_
      event.on('editor.openTab', ({type, name, id, tabOptions}) => {
        self.openTab({type, name, id, tabOptions})
      })
      event.on('editor.updateTabname', ({id, name}) => {
        self.updateTabname({id, name})
      })
      event.on('editor.finishCreate', (data) => {
        self.finishCreate(data)
      })
      event.on('editor.closeTab', (id) => {
        self.closeTab(id)
      })
      event.on('editor.setProps', (value) => {
        self.set(value)
      })
      event.on('editor.updateDataForArt', (data) => {
        self.fanoutData(data)
      })
      self.init()
      shortcut.add({
        keyName: 'commandS',
        keyDown: () => {
          if (self.activeTabId) {
            const tab = self.tabs.filter((item) => item.id === self.activeTabId)[0]
            tab.save()
          }
        },
        remark: 'Save',
      })
    }

    const finishCreate = (data) => {
      const {event} = self.env_
      const tab = self.tabs.filter((item) => item.id === self.activeTabId)[0]
      if (data.type === 'art') {
        // art init
        const {projectId} = data
        tab.type = data.type
        tab.id = data.artId
        tab.name = data.name
        const index = self.activeNote.findIndex((id) => id === self.activeTabId)
        self.activeNote.splice(index, 1, data.artId)
        self.activeTabId = data.artId
        tab.tabOptions = {projectId}
        self.showTabDetail()
        event.fire('project-panel.getProjects')
      } else if (data.type === 'data') {
        const {type, dataId, dataName, dataType, folderId, isProject, projectId} = data
        tab.type = type
        tab.id = dataId
        tab.name = dataName
        const index = self.activeNote.findIndex((id) => id === self.activeTabId)
        self.activeNote.splice(index, 1, dataId)
        self.activeTabId = dataId
        tab.tabOptions = {dataType, folderId, isProject, projectId}
        self.showTabDetail()
      }
      self.saveSession()
    }

    const init = () => {
      reaction(
        () => {
          return {
            length: self.tabs.length,
            activeTabId: self.activeTabId,
          }
        },
        ({length}) => {
          if (length > 0) {
            self.saveSession()
          } else {
            self.applySession()
          }
        },
        {
          fireImmediately: true,
          delay: 300,
        }
      )
    }

    const initZoom = (viewportEl) => {
      viewport.init(viewportEl, () => {
        // 是否需要鼠标的拖拽指针
        const hasPanZoom = () => {
          const activeTab = self.tabs.filter((tab) => tab.id === self.activeTabId)[0]
          return activeTab && ['art', 'material'].includes(activeTab.type)
        }

        // 绑定空格事件
        shortcut.add({
          keyName: 'space',
          keyDown: () => {
            if (hasPanZoom()) {
              viewportEl.classList.add('cursorGrab')
              viewport.set('isSpaceKeyDown', true)
            }
          },
          keyUp: () => {
            if (hasPanZoom()) {
              viewportEl.classList.remove('cursorGrab')
              viewport.set('isSpaceKeyDown', false)
            }
          },
          remark: 'Show changes of cursor to panzoom function(editor.js)',
        })
      })
    }

    const applySession = () => {
      const {session} = self.env_
      const sessionSchema = session.get('SKEditor')
      sessionSchema && applySnapshot(self, sessionSchema)
      self.showTabDetail()
    }

    const saveSession = () => {
      const tabsNote = self.tabs.map((tab) => ({
        id: tab.id,
        name: tab.name,
        type: tab.type,
        tabOptions: tab.tabOptions,
      }))
      const {session} = self.env_
      session.set('SKEditor', {
        activeTabId: self.activeTabId,
        tabs: tabsNote,
        activeNote: self.activeNote.toJSON(),
      })
    }

    const openTab = ({type, name, id, tabOptions}) => {
      const isOpened = self.tabs.some((tab) => tab.id === id)
      if (!isOpened) {
        if (type === 'art') {
          const {event} = self.env_
          event.fire('head.toggleActivePanel', 'NO_ACTIVE_PANEL')
        }
        self.tabs.push({
          id,
          name,
          type,
          tabOptions,
        })
      }
      self.updateActiveNote(id)
    }

    const closeTab = (id) => {
      // const tab = self.tabs.filter(item => item.id === id)[0]
      self.tabs = self.tabs.filter((item) => item.id !== id)
      self.activeNote.remove(id)
      if (!self.tabs.length) {
        self.activeTabId = undefined
        const {event} = self.env_
        event.fire('dataPanel.setProjectId', {projectId: undefined})
        self.saveSession()
        // 取消项目素材绑定
        event.fire('materialPanel.setProjectId', {projectId: undefined})
        return
      }
      if (self.activeTabId === id) {
        const nextId = self.activeNote.pop()
        self.updateActiveNote(nextId)
      }
    }

    const closeOtherTabs = (id) => {
      const tab = self.tabs.filter((item) => item.id === id)
      self.tabs = tab
      self.activeNote = [id]
      self.activeTabId = id
    }

    const closeAllTabs = () => {
      self.tabs = []
      self.activeNote = []
      self.activeTabId = undefined
      self.saveSession()
    }

    const updateActiveNote = (id) => {
      if (self.activeTabId !== id) {
        self.activeTabId = id
        self.activeNote.remove(id)
        self.activeNote.push(id)
        self.showTabDetail()
      }
    }

    const showTabDetail = () => {
      const tab = self.tabs.filter((item) => item.id === self.activeTabId)[0]
      tab && tab.showDetail()
    }

    const updateTabname = ({id, name}) => {
      const tab = self.tabs.filter((item) => item.id === id)[0]
      tab &&
        tab.set({
          name,
        })
      self.saveSession()
    }

    const fanoutData = (data) => {
      // 找到打开的数据屏
      const tabs = self.tabs.filter((item) => item.type === 'art')
      tabs.length &&
        tabs.forEach((tab) => {
          const {art} = tab
          if (art && art.datas) {
            art.datas = art.datas.map((d) => {
              if (d.dataId === data.dataId) {
                d.set({
                  config: data.config,
                  dataType: data.dataType,
                  dataName: data.dataName,
                  remark: data.remark,
                  processorFunction: data.processorFunction,
                  data: data.data,
                })
              }
              return d
            })
          }
        })
    }

    const getCurrentTab = () => {
      const tab = self.tabs.find((item) => item.id === self.activeTabId)
      return tab || {}
    }

    return {
      afterCreate,
      applySession,
      init,
      saveSession,
      openTab,
      initZoom,
      updateActiveNote,
      closeTab,
      closeOtherTabs,
      closeAllTabs,
      finishCreate,
      showTabDetail,
      updateTabname,
      fanoutData,
      getCurrentTab,
    }
  })
