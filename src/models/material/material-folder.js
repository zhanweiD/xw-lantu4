import commonAction from "@utils/common-action"
import {types, getEnv, getParent} from "mobx-state-tree"
import createLog from "@utils/create-log"
import config from "@utils/config"
import {MMaterial} from "./material-thumbnail"

const log = createLog("@models/material/material-folder.js")
function getType(file) {
  const fileType = file.type.split("/")
  let type
  if (fileType[0] === "image") {
    type = "image"
  }
  if (fileType[0] === "application") {
    if (fileType[1] === "json") {
      type = "GeoJSON"
    }
  }
  return type
}

export const MFolder = types
  .model("MFolder", {
    folderId: types.number,
    folderName: types.string,
    isVisible: types.optional(types.boolean, false),
    materials: types.optional(types.array(MMaterial), []),
    // 前端存储上传file
    files: types.optional(types.array(types.frozen()), [])
  })
  .views((self) => ({
    get env_() {
      return getEnv(self)
    },
    get materialPanel_() {
      return getParent(self, 2)
    }
  }))
  .actions(commonAction(["set"]))
  .actions((self) => {
    const addMaterial = (images) => {
      const {tip} = self.env_
      if (images.length > 5) {
        tip.error({content: "一次上传数量不能大于5个"})
        return
      }
      if (self.files.length + images.length > 5) {
        tip.error({content: "总上传数量不能大于5个"})
        return
      }
      const files = images
        .map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
            fileType: getType(file)
          })
        )
        .concat(...self.files)
      self.set({
        files
      })
    }

    const uploadMaterial = () => {
      const {tip, event, session} = self.env_
      const formData = new FormData()
      const tabIndex = session.get("tab-material-panel-tab", -1)
      const {projectId} = self.materialPanel_
      while (self.files.length === 0) {
        tip.error({content: "上传列表不能为空！"})
        return
      }
      self.files.forEach((file) => {
        formData.append(file.fileType, file, file.name)
      })
      let url
      if (tabIndex === 0) {
        url = `${config.urlPrefix}project/${projectId}/folder/${self.folderId}/materials`
      } else {
        url = `${config.urlPrefix}material?folderId=${self.folderId}`
      }
      fetch(url, {method: "POST", body: formData})
        .then((res) => res.json())
        .then((res) => {
          if (!res.success) {
            log.error("upload Error: ", res)
            tip.error({content: res.message, isManuallyClose: true})
          } else {
            tip.success({content: "素材新建成功"})
            self.set({
              files: [],
              isVisible: false
            })
            if (tabIndex === 0) {
              event.fire("materialPanel.getProjectFolders")
            } else if (tabIndex === 1) {
              event.fire("materialPanel.getFolders")
            }
          }
        })
        .catch((error) => {
          log.error("upload Error: ", error)
          tip.error({content: error, isManuallyClose: true})
        })
    }
    const removeMaterial = (index) => {
      const data = self.files.slice(0, index).concat(self.files.slice(index + 1))
      self.set({
        files: data
      })
    }

    const resetUpload = () => {
      self.set({
        files: [],
        isVisible: false
      })
    }
    return {
      uploadMaterial,
      addMaterial,
      removeMaterial,
      resetUpload
    }
  })
