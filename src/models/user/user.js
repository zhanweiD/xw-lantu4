import {types, flow, getEnv} from "mobx-state-tree"
import createLog from "@utils/create-log"
import io from "@utils/io"
import commonAction from "@utils/common-action"
import {createConfigModelClass} from "@components/field"

const log = createLog("@models/user.js")

const MNickname = createConfigModelClass("MNickname", {
  sections: ["__hide__"],
  fields: [
    {
      section: "__hide__",
      option: "nickname",
      field: {
        type: "text",
        label: "昵称",
        defaultValue: ""
      }
    }
  ]
})
export const MUser = types
  .model("MUser", {
    userId: types.maybe(types.number),
    // organizationId为null时即个人空间
    organizationId: types.maybeNull(types.number),
    organizationName: types.maybe(types.string),
    nickname: types.optional(MNickname, {}),
    email: types.maybeNull(types.string),
    mobile: types.optional(types.string, ""),
    password: types.optional(types.string, ""),
    avatar: types.maybeNull(types.string),
    normalKeys: types.frozen(["nickname"])
  })
  .views((self) => ({
    get env_() {
      return getEnv(self)
    }
  }))
  .actions(commonAction(["set", "setSchema"]))
  .actions((self) => {
    const afterCreate = () => {
      self.getUserInfo()
    }

    const getUserInfo = flow(function* getUserInfo() {
      try {
        const {userId, avatar, nickname, mobile, email, organizationName, organizationId} = yield io.auth.loginInfo()
        self.set({
          userId,
          avatar,
          mobile,
          email,
          organizationName,
          organizationId
        })
        self.nickname.setSchema({
          nickname
        })
        console.log(self.toJSON())
      } catch (error) {
        log.error("getUserInfo Error: ", error)
      }
    })

    return {
      afterCreate,
      getUserInfo
    }
  })
