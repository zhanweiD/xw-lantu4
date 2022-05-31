import {types, flow, getEnv} from 'mobx-state-tree'
import createLog from '@utils/create-log'
import io from '@utils/io'
import commonAction from '@utils/common-action'

const log = createLog('@models/user.js')

export const MUser = types
  .model('MUser', {
    userId: types.maybe(types.number),
    // organizationId为null时即个人空间
    organizationId: types.maybeNull(types.number),
    organizationName: types.maybe(types.string),
    nickname: types.optional(types.string, ''),
    email: types.maybeNull(types.string),
    mobile: types.optional(types.string, ''),
    password: types.optional(types.string, ''),
    avatar: types.maybeNull(types.string),
  })
  .views((self) => ({
    get env_() {
      return getEnv(self)
    },
  }))
  .actions(commonAction(['set']))
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
          nickname,
          email,
          organizationName,
          organizationId,
        })
      } catch (error) {
        log.error('getUserInfo Error: ', error)
      }
    })

    const logout = flow(function* logout() {
      try {
        yield io.auth.logout()
      } catch (error) {
        log.error('logout Error: ', error)
      }
    })

    return {
      afterCreate,
      getUserInfo,
      logout,
    }
  })
