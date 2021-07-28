/**
 * @author 南风
 * @description 素材预览
 */
import config from "@utils/config"
import {getEnv, types, flow, getRoot} from "mobx-state-tree"

export const MMaterialThumbnail = types
  .model({
    folderId: types.number,
    materialId: types.identifier,
    id: types.number,
    type: types.string,
    name: types.optional(types.string, ""),
    user: types.optional(types.frozen(), {}),
    height: types.optional(types.number, 0),
    width: types.optional(types.number, 0),
    path: types.optional(types.string, ""),

    mtime: types.maybe(types.frozen()),
    ctime: types.maybe(types.frozen()),
    dtime: types.maybe(types.frozen())
  })
  .views((self) => ({
    get env_() {
      return getEnv(self)
    },
    get root_() {
      return getRoot(self)
    },
    get isActive_() {
      return getRoot(self).editor.activeTabId === self.materialId
    }
  }))
  .actions((self) => {
    const download = flow(function* download() {
      const {log} = self.env_
      try {
        const res = yield fetch(
          `${config.urlPrefix}material/download/${self.id}`
        )
        res.blob().then((blob) => {
          const elink = document.createElement("a")
          elink.download = self.name
          elink.style.display = "none"
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href)
        })
      } catch (error) {
        log.error("download.Error: ", error)
      }
    })

    const remove = () => {
      self.root_.confirm({
        content: `确认删除素材“${self.name}”么？删除后无法恢复！`,
        onConfirm: self.removeMaterial,
        attachTo: false
      })
    }

    const showDetail = () => {
      const {event} = self.env_
      event.fire("editor.openTab", {
        id: self.materialId,
        name: self.name || "未命名素材",
        type: "materialView",
        tabOptions: {
          id: self.materialId,
          name: self.name,
          user: self.user,
          type: self.type,
          height: self.height,
          width: self.width,
          path: self.path,
          ctime: self.ctime,
          dtime: self.dtime,
          mtime: self.mtime
        }
      })
    }

    const removeMaterial = flow(function* removeMaterial() {
      const {io, log, event} = self.env_
      try {
        yield io.material.removeMaterial({
          ":materialId": self.materialId
        })
        event.fire("editor.closeTab", self.materialId)
        event.fire("materialPanel.getMaterials")
      } catch (error) {
        log.error("remove.Error: ", error)
      }
    })

    return {
      remove,
      removeMaterial,
      showDetail,
      download
    }
  })
