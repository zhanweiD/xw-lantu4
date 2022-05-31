/**
 * @author 溪风
 * @description 数据源管理
 */
import {types, flow, getEnv, getSnapshot} from 'mobx-state-tree'
import commonAction from '@utils/common-action'
import createLog from '@utils/create-log'

const log = createLog('@models/editor-tab-data-manager')
let modalDafaultValue = {}
const MDataSourceOption = types
  .model('MDataSourceOption', {
    type: types.optional(types.string, 'MySQL'),
    host: types.optional(types.string, ''),
    username: types.optional(types.string, ''),
    password: types.optional(types.string, ''),
    port: types.optional(types.number, 3306),
    database: types.optional(types.string, ''),
  })
  .actions(commonAction(['set']))

const MDataManagerModal = types
  .model('MDataManagerModal', {
    dataSourceName: types.optional(types.string, ''),
    remark: types.optional(types.string, ''),
    config: types.optional(MDataSourceOption, {}),
  })
  .actions(commonAction(['set']))

export const MDataManager = types
  .model('MDataManager', {
    dataSourceId: types.maybe(types.number),
    dataSourceName: types.maybe(types.string),

    config: types.optional(MDataSourceOption, {}),
    remark: types.optional(types.string, ''),

    nickName: types.maybe(types.string),
    userId: types.maybe(types.number),
    organizationId: types.optional(types.frozen(), null),
    mtime: types.maybe(types.frozen()),
    ctime: types.maybe(types.frozen()),
  })
  .actions(commonAction(['set', 'getSchema', 'setSchema']))

export const MDataSourceManager = types
  .model('MDataSourceManager', {
    id: types.union(types.number, types.string),
    dataSources: types.optional(types.array(MDataManager), []),
    modal: types.optional(MDataManagerModal, {}),
    databaseTypes: types.frozen(),
    databaseList: types.optional(types.array(types.string), []),
  })
  .views((self) => ({
    get root_() {
      return getEnv(self)
    },
    get env_() {
      return getEnv(self)
    },
  }))
  .actions(commonAction(['set', 'getSchema', 'setSchema']))
  .actions((self) => {
    modalDafaultValue = getSnapshot(self.modal)
    const afterCreate = () => {
      const {event} = self.env_
      self.getDatabaseSource()

      event.on('dataSourceManager.getDatabaseSource', self.getDatabaseSource)
    }

    const getDatabaseTypes = () => {
      const data = ['Postgres', 'MySQL', 'MariaDB', 'SQLite', 'SQLServer', 'Oracle', 'ClickHouse']
      self.set({databaseTypes: data.map((val) => ({key: val, value: val}))})
    }

    // 获取数据库列表
    const getDatabases = flow(function* getDatabases() {
      const {tip} = self.env_
      const {io} = self.root_
      const {type, host, port, username, password} = self.modal.config
      try {
        const res = yield io.data.getDatabases({
          dataType: type.toLowerCase(),
          config: {
            host,
            port,
            username,
            password,
          },
        })
        self.databaseList = res.map((v) => v.database)
        tip.success({content: '获取数据库列表成功'})
      } catch (error) {
        log.error('getDatabases.Error: ', error)
        tip.error({content: error.message})
      }
    })

    // 创建数据库源
    const createDataSource = flow(function* saveData() {
      const {io, tip, event} = self.env_

      const {dataSourceName, remark, config} = self.modal
      try {
        const data = {
          dataSourceName,
          remark,
          config,
          dataType: config.type.toLowerCase(),
        }
        yield io.data.createDataSource(data)
        tip.success({content: '保存成功！'})
        event.fire('dataSourceManager.getDatabaseSource')
      } catch (error) {
        console.log('SaveData error', error)
        tip.error({content: '保存失败！'})
      }
    })

    // 获取全局数据源（database）
    // const getDataSource = flow(function* getDataSource() {
    //   const {io} = self.env_
    //   try {
    //     const {list} = yield io.data.getDataSource()
    //     self.set({dataSources: list})
    //   } catch (error) {
    //     // TODO error 统一替换
    //     console.log(error)
    //   }
    // })

    // 删除全局数据源
    const removeDataSource = flow(function* removeDataSource({dataSourceId}) {
      const {io, event} = self.env_
      try {
        yield io.data.removeDataSource({':dataSourceId': dataSourceId})
        event.fire('dataSourceManager.getDatabaseSource')
      } catch (error) {
        // TODO error 统一替换
        console.log(error)
      }
    })

    const getDataList = (database) => {
      if (self.databaseList.length > 0) {
        return self.databaseList.map((val) => ({key: val, value: val}))
      }
      if (self.databaseList.length === 0 && database) {
        return [{key: database, value: database}]
      }
      return []
    }

    // 后面可能被移出此模型的方法
    // 获取数据库数据源
    const getDatabaseSource = flow(function* getDatabaseSource() {
      const {io} = self.env_
      try {
        const {list} = yield io.data.getDataSource()
        const databaseList = list.filter((data) => data.dataType === 'mysql')
        self.set({dataSources: databaseList})
      } catch (error) {
        // TODO error 统一替换
        console.log(error)
      }
    })

    // 初始化model？
    const applyModalValue = () => {
      console.log(modalDafaultValue)
      self.modal.set(modalDafaultValue)
      self.set('databaseList', [])
    }

    return {
      getDatabaseTypes,
      getDatabases,
      createDataSource,
      // getDataSource,
      applyModalValue,
      getDataList,
      removeDataSource,
      getDatabaseSource,
      afterCreate,
    }
  })
