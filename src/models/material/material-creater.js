/**
 * @author 南风
 * @description 素材管理-新建素材
 */
import {types, flow, getEnv, getRoot} from "mobx-state-tree"
import config from "@utils/config"
import commonAction from "@utils/common-action"
import createLog from "@utils/create-log"

const log = createLog("@models/material/material-creater")

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

export const MMaterialCreater = types
  .model("MMaterialCreater", {
    activeFolderId: types.optional(types.number, 0),
    type: types.optional(types.frozen(), "image"),
    files: types.optional(types.array(types.frozen()), []),
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
    get fileTypes() {
      return [
        {
          tempLayerKey: "materialUploader",
          accept: ".json, .geojson, image/*",
          tips: "将需要上传的内容拖入下面的区域，或者直接点击选择文件(GeoJson、图片，限5份/次))"
        }
      ]
    }
  }))
  .actions(commonAction(["set"]))
  .actions((self) => {
    const add = (images) => {
      const {tip} = self.env_
      let data = []
      if (self.files.length >= 5) {
        tip.error({content: "总上传数量不能大于5个"})
        return
      }
      if (images.length > 5) {
        images = images.slice(0, 5)
        tip.error({content: "一次上传数量不能大于5个"})
      }
      const length = self.files.length + images.length
      if (length >= 5) {
        const tempImages = [].concat(images.slice(0, 5 - self.files.length))
        data = [].concat(
          tempImages.map((file) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
              fileType: getType(file)
            })
          ),
          ...self.files
        )
      } else {
        data = [].concat(
          images.map((file) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
              fileType: getType(file)
            })
          ),
          ...self.files
        )
      }
      self.files = data
    }

    const remove = (index) => {
      const data = self.files
        .slice(0, index)
        .concat(self.files.slice(index + 1))
      self.files = data
    }

    const create = flow(function* create() {
      const {tip, event} = self.env_
      const formData = new FormData()
      while (self.files.length === 0) {
        tip.error({content: "上传列表不能为空！"})
        return
      }
      self.files.forEach((file) => {
        formData.append(file.fileType, file, file.name)
      })
      self.state = "loading"
      try {
        yield fetch(
          `${config.urlPrefix}material?folderId=${self.activeFolderId}`,
          {
            method: "POST",
            body: formData
          }
        )
        tip.success({content: "素材新建成功"})
        self.state = "success"
        self.files = []
        event.fire("materialPanel.getMaterials")
        self.root_.overlayManager.get("materialModal").hide()
      } catch (error) {
        tip.error({content: error.message, isManuallyClose: true})
        log.error("create.Error:", error)
        self.state = "error"
      }
    })

    const upload = flow(function* upload({
      fileCount,
      filePathName,
      uploadIndex = 0,
      files,
      folder
    }) {
      const {tip} = self.env_
      const successTip = (state = 0) =>
        tip.success({
          content: `正在上传 ”${filePathName}“....., 当前进度(${state}/${fileCount})`
        })

      try {
        successTip(uploadIndex)
        const formData = new FormData()
        files.slice(uploadIndex, uploadIndex + 5).forEach((file) => {
          formData.append(file.fileType, file, file.name)
        })
        yield fetch(`${config.urlPrefix}material?folderId=${folder.folderId}`, {
          method: "POST",
          body: formData
        })

        if (uploadIndex < fileCount) {
          yield upload({
            fileCount,
            filePathName,
            uploadIndex: (uploadIndex += 5),
            files,
            folder
          })
        } else {
          successTip(uploadIndex)
        }
      } catch (error) {
        tip.error({content: `上传素材到 ”${filePathName}“ 文件夹失败！`})
      }
    })

    const importFolder = flow(function* importFolder(files) {
      const {tip, io, event} = self.env_
      files = [...files].filter(getType).map((file) =>
        Object.assign(file, {
          fileType: getType(file)
        })
      )
      const fileCount = files.length
      // 如果没有符合条件的文件 直接跳出逻辑
      if (!fileCount) {
        tip.error({content: "上传的文件夹中没有符合要求的素材"})
        return
      }
      // 当前素材文件夹名称
      const filePathName = files[0].webkitRelativePath.split("/")[0]
      /**
       * 思路
       * 第一步: 拿到filePath来新建素材文件夹
       * 第二步: 新建好素材文件夹后, 使用对应的folderId来上传文件，上传文件5个每批次 依次上传
       * 第三步: 上传好后更新素材列表
       *
       * 优化点: 上传任务进度同步，总数量，当前上传数量
       */
      let folder
      try {
        tip.success({content: `开始新建 ”${filePathName}“ 文件夹`})
        folder = yield io.material.createFolder({folderName: filePathName})
        tip.success({content: `新建 ”${filePathName}“ 文件夹成功！`})
      } catch (error) {
        tip.error({
          content: `新建 ”${filePathName}“ 文件夹失败，${error.message}`
        })
        return
      }

      yield upload({
        fileCount,
        filePathName,
        files,
        folder
      })

      tip.success({content: `上传 ”${filePathName}“ 文件夹成功！`})
      event.fire("materialPanel.getMaterials")
    })

    return {
      add,
      remove,
      create,
      importFolder
    }
  })
