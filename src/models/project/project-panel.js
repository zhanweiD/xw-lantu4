/**
 * @author 南风
 * @description 项目管理面板
 */
import {
  types,
  getEnv,
  flow,
  applySnapshot,
  isAlive,
  getRoot
} from "mobx-state-tree"
import commonAction from "@utils/common-action"
import {MProjectToolbar} from "./project-toolbar"
import {MProjectThumbnail} from "./project-thumbnail"

export const MProjectPanel = types
  .model({
    name: "projectPanel",
    projects: types.optional(types.array(MProjectThumbnail), []),
    projectSort: types.optional(types.array(types.number), []),
    isNewCreateProjectId: types.maybe(types.number),
    recentProjectIds: types.optional(types.array(types.number), []),
    toolbar: types.optional(MProjectToolbar, {}),
    activeIndex: types.optional(types.number, 0),
    state: types.optional(
      types.enumeration(["loading", "success", "error"]),
      "loading"
    )
  })
  .views((self) => ({
    get env_() {
      return getEnv(self)
    },
    get root_() {
      return getRoot(self)
    },
    get hasRecentProject_() {
      return self.recentProjectIds.length
    },
    get recentProjects_() {
      if (self.projects.length) {
        return self.recentProjectIds.map((projectId) =>
          self.projects.find((project) => project.projectId === projectId)
        )
      }
      return []
    },
    get projects_() {
      const basicProjects = []
      const topProjects = []
      self.projects.forEach((project) => {
        if (self.projectSort.includes(project.projectId)) {
          topProjects.push(project)
        } else {
          basicProjects.push(project)
        }
      })
      return {
        basicProjects,
        topProjects
      }
    },
    get hasProject_() {
      return !!self.projects.length
    }
  }))
  .actions(commonAction(["set"]))
  .actions((self) => {
    const afterCreate = () => {
      const {event} = self.env_
      event.on("project-panel.getProjects", (keyword) => {
        self.getProjects(keyword)
      })

      self.getProjects()
      event.on("project-panel.createRecentProject", self.createResentProject)
      self.applyLocal()

      event.on("project-panel.setNewCreateProjectId", (projectId) => {
        self.setNewCreateProjectId(projectId)
        setTimeout(() => {
          if (isAlive(self)) {
            self.setNewCreateProjectId(-1)
          }
        }, 3000)
      })

      event.on(
        "project-panel.project.updateArt",
        ({projectId, artId, ...params}) => {
          const project = self.projects.find(
            (value) => value.projectId === projectId
          )
          project &&
            project.arts.find((value) => value.artId === artId)?.set(params)
        }
      )
    }

    const setNewCreateProjectId = (projectId) => {
      self.isNewCreateProjectId = projectId
    }

    const createResentProject = (id) => {
      if (self.recentProjectIds.includes(id)) {
        return
      }
      if (self.recentProjectIds.length >= 5) {
        self.recentProjectIds.pop()
      }
      self.recentProjectIds.unshift(id)
      self.saveLocal()
    }

    const applyLocal = () => {
      const {local} = self.env_
      const localSchema = local.get("SKRecentProject")
      localSchema && applySnapshot(self, localSchema)
    }

    const saveLocal = () => {
      const {local} = self.env_
      local.set("SKRecentProject", {
        recentProjectIds: self.recentProjectIds,
        toolbar: self.toolbar
      })
    }

    // 首次加载才可切换到最近使用
    let canToggletoRecent = true

    const getProjects = flow(function* getProjects() {
      const {io, tip} = self.env_
      try {
        const list = yield io.project.getProjects()
        self.projects = list.list
        self.projectSort = list.projectSort
        self.recentProjectIds = self.recentProjectIds.filter((projectId) =>
          self.projects.find((project) => project.projectId === projectId)
        )
        if (self.hasRecentProject_ && canToggletoRecent) {
          self.activeIndex = 2
          canToggletoRecent = false
        }
        setTimeout(() => {
          self.set({state: "success"})
        }, 100)
      } catch (error) {
        tip.error({content: "加载项目列表失败"})
        self.set({state: "error"})
      }
    })

    const toggleProjectTop = flow(function* toggleProjectTop(project, isTop) {
      if (isTop || self.projectSort.includes(project.projectId)) {
        self.projectSort = self.projectSort.filter(
          (sortId) => sortId !== project.projectId
        )
      } else {
        self.projectSort.push(project.projectId)
      }
      const {io, tip} = self.env_
      try {
        yield io.user.top({
          ":type": "project",
          organizationId: self.root_.user.organizationId,
          sortArr: self.projectSort
        })
      } catch (error) {
        // TODO error 统一替换
        tip.error({content: "置顶失败"})
        console.log(error)
      }
    })

    return {
      afterCreate,
      getProjects,
      createResentProject,
      applyLocal,
      saveLocal,
      setNewCreateProjectId,
      toggleProjectTop
    }
  })
