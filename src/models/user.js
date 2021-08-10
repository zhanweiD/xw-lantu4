import {types, flow, getEnv} from "mobx-state-tree"
import createLog from "@utils/create-log"
import io from "@utils/io"
import commonAction from "@utils/common-action"
import {createStorage} from "@utils/storage"

const log = createLog("@models/user.js")
export const MUser = types
  .model("MUser", {
    userId: types.maybe(types.number),
    // organizationId为null时即个人空间
    organizationId: types.maybeNull(types.number),
    organizationName: types.maybe(types.string),
    nickname: types.optional(types.string, ""),
    email: types.maybeNull(types.string),
    mobile: types.optional(types.string, ""),
    password: types.optional(types.string, ""),
    avatar: types.maybeNull(types.string)
  })
  .views((self) => ({
    get env_() {
      return getEnv(self)
    }
  }))
  .actions(commonAction(["set"]))
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
          nickname,
          mobile,
          email,
          organizationName,
          organizationId
        })
        self.env_.local = createStorage({
          type: "localStorage",
          key: `${self.userId}.${self.organizationId}`
        })
        self.env_.session = createStorage({
          type: "sessionStorage",
          key: `${self.userId}.${self.organizationId}`
        })
      } catch (error) {
        log.error("getUserInfo Error: ", error)
      }
    })

    return {
      afterCreate,
      getUserInfo
    }
  })
