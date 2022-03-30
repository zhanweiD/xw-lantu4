// import {types, flow, getEnv} from 'mobx-state-tree'
// import io from '@utils/io'
// import commonAction from '@utils/common-action'
// import CryptoJS from 'crypto-js'
// import encryptionType from '@utils/base64-decode'
// import createLog from '@utils/create-log'

// const log = createLog('@models/art/art-version-info.js')

// const VersionList = types.model('VersionList', {
//   versionId: types.number,
//   ctime: types.number,
//   isOnline: types.boolean,
// })

// export const MVersionInfo = types
//   .model('MVersionInfo', {
//     projectId: types.number,
//     artId: types.number,
//     list: types.optional(types.array(VersionList), []),
//   })
//   .views((self) => ({
//     get env_() {
//       return getEnv(self)
//     },
//   }))
//   .actions(commonAction(['set']))
//   .actions((self) => {
//     const {tip} = self.env_
//     const afterCreate = () => {
//       console.log(11)
//       self.getVersions()
//     }
//     const getVersions = flow(function* getVersions() {
//       console.log(22)
//       try {
//         const {list} = yield io.art.getExportList({
//           ':artId': self.artId,
//         })
//         console.log(list)
//         self.list = list
//       } catch (error) {
//         log.error('getVersions Error: ', error)
//       }
//     })

//     const remove = flow(function* remve(versionId) {
//       try {
//         yield io.art.removeVersion({
//           ':projectId': self.projectId,
//           ':artId': self.artId,
//           ':versionId': versionId,
//         })
//         self.getVersions()
//       } catch (error) {
//         log.error('remove Error: ', error)
//       }
//     })

//     return {
//       afterCreate,
//       getVersions,
//       remove,
//     }
//   })
