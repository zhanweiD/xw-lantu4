import {types, flow, getEnv} from "mobx-state-tree"
import io from "@utils/io"
import copy from "@utils/copy"
import commonAction from "@utils/common-action"

const PublishVersion = types.model("PublishVersion", {
  versionId: types.number,
  ctime: types.number,
  remark: types.string,
  isOnline: types.boolean
})

export const MPublishInfo = types
  .model("MPublishInfo", {
    publishId: types.string,
    projectId: types.number,
    artId: types.number,
    list: types.optional(types.array(PublishVersion), []),
    remark: types.optional(types.string, "")
  })
  .views((self) => ({
    get env_() {
      return getEnv(self)
    }
  }))
  .actions(commonAction(["set"]))
  .actions((self) => {
    const afterCreate = () => {
      self.getVersions()
    }

    const getVersions = flow(function* getVersions() {
      try {
        const {list} = yield io.art.getPublishVersions({
          ":artId": self.artId
        })
        self.list = list
      } catch (error) {
        // todo 统一修改
        console.log(error)
      }
    })

    const publish = flow(function* publish() {
      try {
        yield io.art.publish({
          ":artId": self.artId,
          ":projectId": self.projectId
        })
        self.getVersions()
        self.toggleArtOnline(true)
      } catch (error) {
        // TODO error 统一替换
        console.log(error)
      }
    })

    const online = flow(function* online(versionId) {
      try {
        yield io.art.updateVersionStatus({
          ":projectId": self.projectId,
          ":artId": self.artId,
          ":versionId": versionId,
          ":action": "publish"
        })
        self.getVersions()
        self.toggleArtOnline(true)
      } catch (error) {
        // TODO error 统一替换
        console.log(error)
      }
    })

    const offline = flow(function* offline(versionId) {
      try {
        yield io.art.updateVersionStatus({
          ":projectId": self.projectId,
          ":artId": self.artId,
          ":versionId": versionId,
          ":action": "unPublish"
        })
        self.getVersions()
        self.toggleArtOnline(false)
      } catch (error) {
        // TODO error 统一替换
        console.log(error)
      }
    })

    const remove = flow(function* remve(versionId) {
      try {
        yield io.art.removeVersion({
          ":projectId": self.projectId,
          ":artId": self.artId,
          ":versionId": versionId
        })
        self.getVersions()
      } catch (error) {
        // TODO error 统一替换
        console.log(error)
      }
    })

    const copyUrl = (path) => {
      copy(path)
      self.env_.tip.success({content: "复制成功"})
    }

    const toggleArtOnline = (isOnline) => {
      const {event} = self.env_
      event.fire("project-panel.project.updateArt", {
        projectId: self.projectId,
        artId: self.artId,
        publishId: self.publishId,
        isOnline
      })
    }

    return {
      afterCreate,
      getVersions,
      publish,
      online,
      offline,
      remove,
      copyUrl,
      toggleArtOnline
    }
  })
