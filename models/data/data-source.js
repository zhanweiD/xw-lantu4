import {flow, getEnv, getParent, types, getRoot} from 'mobx-state-tree'
import commonAction from '@utils/common-action'
import createLog from '@utils/create-log'
import aesDecode from '@utils/aes-decode'

const log = createLog('@models/data/data-source')

const databaseTypesTabel = {
  postgres: 'Postgres',
  mysql: 'MySQL',
  mariadb: 'MariaDB',
  sqlite: 'SQLite',
  sqlserver: 'SQLServer',
  oracle: 'Oracle',
  clickhouse: 'ClickHouse',
}

export const MDataSourceModelManager = types
  .model('MDataSourceModelManager', {
    modelConfig: types.optional(types.frozen(), {}),
    modelStatus: types.optional(types.string, 'create'),
  })
  .views((self) => ({
    get env_() {
      return getEnv(self)
    },
    get dataSource_() {
      return getParent(self, 1)
    },
  }))
  .actions(commonAction(['set', 'getSchema', 'setSchema']))
  .actions((self) => {
    const beforeOpenCreateModel = () => {
      self.set({
        modelConfig: {},
        modelStatus: 'create',
      })
    }

    const beforeOpenUpdateModel = (dataSource) => {
      const {dataSourceId, dataSourceName, dataType, config, remark} = dataSource
      const {host, username, password, port, database} = config
      const realPassword = aesDecode(password)
      self.set({
        modelConfig: {
          dataSourceId,
          dataSourceName,
          remark,
          type: databaseTypesTabel[dataType],
          host,
          userName: username,
          password: realPassword,
          port,
          database,
        },
        modelStatus: 'update',
      })
    }

    const toDoNext = () => {
      if (self.modelStatus === 'create') {
        self.dataSource_.createDataSource({
          dataSourceOptions: self.modelConfig,
        })
      } else {
        self.dataSource_.updateDataSource({
          dataSourceOptions: self.modelConfig,
        })
      }
    }

    return {
      beforeOpenCreateModel,
      beforeOpenUpdateModel,
      toDoNext,
    }
  })

export const MDataSource = types
  .model('MDataSource', {
    dataSourceId: types.maybe(types.number),
    dataSourceName: types.maybe(types.string),
    dataType: types.maybe(types.string),
    config: types.optional(types.frozen(), {}), // 数据目前选择的config
    remark: types.optional(types.string, ''),
    userId: types.maybe(types.number),
    organizationId: types.optional(types.frozen(), null),
    mtime: types.maybe(types.frozen()),
    ctime: types.maybe(types.frozen()),
    modelManager: types.optional(MDataSourceModelManager, {}),
  })
  .views((self) => ({
    get env_() {
      return getEnv(self)
    },
    get data_() {
      return getParent(self, 1)
    },
    get dataSourceName_() {
      return self.dataSourceName
    },
    get root_() {
      return getRoot(self)
    },
    get dataIo_() {
      const {io} = self.env_
      return self.data_.isProject ? io.project.data : io.data
    },
  }))
  .actions(commonAction(['set', 'getSchema', 'setSchema']))
  .actions((self) => {
    // 新建数据库源
    const createDataSource = flow(function* createDataSource({dataSourceOptions, afterCreate = () => {}}) {
      const {tip} = self.env_
      const {dataType, remark = '数据源'} = dataSourceOptions
      if (dataType === 'api' || dataType === 'excel' || dataType === 'json') {
        try {
          yield self.dataIo_
            .createDataSource({
              ...dataSourceOptions,
              remark,
              ':projectId': self.data_.isProject ? self.data_.projectId : null,
            })
            .then((response) => {
              afterCreate(response)
            })
        } catch (error) {
          log.error('Create DataSource Error', error)
          tip.error({content: '新建数据源失败'})
        }
      } else {
        const {dataSourceName, database, host, password, port, type, userName} = dataSourceOptions
        try {
          yield self.dataIo_
            .createDataSource({
              dataSourceName,
              remark,
              dataType: type.toLowerCase(),
              config: {
                database,
                host,
                password,
                port,
                username: userName,
                type: type.toLowerCase(),
              },
              ':projectId': self.data_.isProject ? self.data_.projectId : null,
            })
            .then((response) => {
              afterCreate(response)
            })
          self.data_.getDataSources({type: 'database'})
          tip.success({content: '新建数据源成功'})
          self.root_.overlayManager.get('dataSourceModal').hide()
        } catch (error) {
          log.error('Create DataSource Error', error)
          tip.error({content: '新建数据源失败'})
        }
      }
    })

    const removeDataSource = flow(function* removeDataSource({dataSourceId}) {
      const {tip} = self.env_
      try {
        yield self.dataIo_.removeDataSource({
          ':dataSourceId': dataSourceId,
          ':projectId': self.data_.isProject ? self.data_.projectId : null,
        })
        self.data_.getDataSources({type: 'database'})
        tip.success({content: '删除数据源成功'})
      } catch (error) {
        log.error('Remove DataSource Error', error)
        tip.error({content: '删除数据源失败'})
      }
    })

    const updateDataSource = flow(function* updateDataSource({dataSourceOptions, afterUpdate = () => {}}) {
      const {tip} = self.env_
      const {dataType, remark = '数据源'} = dataSourceOptions
      if (dataType === 'api' || dataType === 'excel' || dataType === 'json') {
        try {
          yield self.dataIo_
            .updateDataSource({
              ...dataSourceOptions,
              remark,
              ':projectId': self.data_.isProject ? self.data_.projectId : null,
            })
            .then((response) => {
              afterUpdate(response)
            })
        } catch (error) {
          log.error('Create DataSource Error', error)
          tip.error({content: '修改数据源失败'})
        }
      } else {
        const {dataSourceId, dataSourceName, database, host, password, port, type, userName} = dataSourceOptions
        try {
          yield self.dataIo_
            .updateDataSource({
              dataSourceName,
              remark,
              dataType: type.toLowerCase(),
              config: {
                database,
                host,
                password,
                port,
                username: userName,
                type: type.toLowerCase(),
              },
              ':dataSourceId': dataSourceId,
              ':projectId': self.data_.isProject ? self.data_.projectId : null,
            })
            .then((response) => {
              afterUpdate(response)
            })
          self.data_.getDataSources({type: 'database'})
          tip.success({content: '修改数据源成功'})
          self.root_.overlayManager.get('dataSourceModal').hide()
        } catch (error) {
          log.error('Create DataSource Error', error)
          tip.error({content: '修改数据源失败'})
        }
      }
    })

    return {
      createDataSource,
      removeDataSource,
      updateDataSource,
    }
  })
