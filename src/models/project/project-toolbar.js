/**
 * @author 南风
 * @description 项目工具栏
 */
import commonAction from "@utils/common-action"
import {getEnv, flow, getRoot, types, getParent} from "mobx-state-tree"
import {createConfigModelClass} from "@components/field"

export const MProjectToolbar = types
  .model({
    keyword: types.optional(types.string, ""),
    isThumbnailVisible: types.optional(types.boolean, false)
  })
  .views((self) => ({
    get env_() {
      return getEnv(self)
    },
    get root_() {
      return getRoot(self)
    },
    get projectPanel_() {
      return getParent(self, 1)
    }
  }))
  .actions(commonAction(["set"]))
  .actions((self) => {
    const toggleThumbnailVisible = () => {
      self.isThumbnailVisible = !self.isThumbnailVisible
      self.projectPanel_.saveLocal()
    }

    let seachDataSource = []
    const searchProjects = () => {
      if (!self.keyword) {
        seachDataSource.length &&
          self.projectPanel_.set({
            projects: seachDataSource
          })
        seachDataSource = []
        return
      }

      if (!seachDataSource.length) {
        seachDataSource = [...self.projectPanel_.toJSON().projects]
      }

      const projectsData = seachDataSource

      let searchProjectsData = []
      const noSearchProjectsData = []
      projectsData.forEach((project) => {
        if (project.name.indexOf(self.keyword) !== -1) {
          searchProjectsData.push(project)
        } else {
          noSearchProjectsData.push(project)
        }
      })

      searchProjectsData = searchProjectsData
        .sort((a, b) => {
          return (
            b.name.split(self.keyword).length -
            a.name.split(self.keyword).length
          )
        })
        .splice(0, 5)

      noSearchProjectsData.concat(searchProjectsData.splice(5))

      if (searchProjectsData.length < 5) {
        noSearchProjectsData.forEach((project) => {
          let hasMatchingArt = false
          project.arts.forEach((art) => {
            if (
              art.name.indexOf(self.keyword) !== -1 &&
              searchProjectsData.length < 5
            ) {
              hasMatchingArt = true
            }
          })
          if (hasMatchingArt) {
            searchProjectsData.push(project)
          }
        })
      }

      searchProjectsData = searchProjectsData.map((project) => {
        const artSort = [...project.arts]
          .sort((a, b) => {
            return (
              b.name.split(self.keyword).length -
              a.name.split(self.keyword).length
            )
          })
          .map((art) => art.artId)
        return {
          ...project,
          artSort
        }
      })

      self.projectPanel_.set({
        projects: searchProjectsData
      })
    }

    const createProject = () => {
      const modal = self.root_.overlayManager.get("fieldModal")

      const MFieldModdal = createConfigModelClass("MFieldModdal", {
        sections: ["__hide__"],
        fields: [
          {
            section: "__hide__",
            option: "name",
            field: {
              type: "text",
              label: "name",
              placeholder: "namePlaceholder",
              required: true
            }
          },
          {
            section: "__hide__",
            option: "description",
            field: {
              type: "textarea",
              label: "description.description",
              placeholder: "detailPlaceholder"
            }
          }
        ]
      })
      modal.show({
        attachTo: false,
        title: "新建项目",
        height: 160,
        content: MFieldModdal.create(),
        buttons: [
          {
            name: "取消",
            action: () => {
              modal.hide()
            }
          },
          {
            name: "确定",
            action: (schema) => {
              self.create(schema)
            }
          }
        ]
      })
    }

    const create = flow(function* create({name, description}) {
      const {io, event, tip} = self.env_
      const modal = self.root_.overlayManager.get("fieldModal")
      try {
        const project = yield io.project.create({
          name,
          description
        })
        event.fire("editor.finishCreate", {
          type: "project"
        })
        event.fire("project-panel.getProjects")
        event.fire("project-panel.setNewCreateProjectId", project.projectId)
        modal.hide()
        tip.success({content: "项目新建成功"})
      } catch (error) {
        // TODO: 统一替换
        console.log("error")
        tip.error({content: `项目新建失败：${error.message}`})
      }
    })

    return {
      createProject,
      toggleThumbnailVisible,
      create,
      searchProjects
    }
  })
