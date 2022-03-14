import {types, flow, getEnv, getRoot, getParent} from 'mobx-state-tree'
import AES from 'crypto-js/aes'
import UTF8 from 'crypto-js/enc-utf8'
import commonAction from '@utils/common-action'
import createLog from '@utils/create-log'
import {createConfigModelClass} from '@components/field'
import {MDataManager} from '../editor/editor-tab-data-manager'

const encodeAes = (input) => AES.encrypt(input, 'waveview').toString()
const decodeAes = (input) => AES.decrypt(input, 'waveview').toString(UTF8)
const log = createLog('@models/data/data-database')

const defaultSql = `-- sql语句
SELECT * FROM`

export const MDatabaseCodeOptions = createConfigModelClass('MDatabaseCodeOptions', {
  id: types.identifier,
  sections: ['dataPanel.sql', 'dataPanel.sqlResult'],
  fields: [
    {
      section: 'dataPanel.sql',
      option: 'sql',
      field: {
        type: 'code',
        mode: 'mysql',
        readOnly: false,
        height: 300,
        value: defaultSql,
        buttons: [
          {
            name: '执行',
            position: 'left',
            action: (self) => {
              const parent = getParent(self, 1)
              parent.getResult()
            },
          },
        ],
      },
    },
    {
      section: 'dataPanel.sqlResult',
      option: 'result',
      field: {
        type: 'code',
        readOnlyCode: true,
        defaultValue: '',
        height: 300,
      },
    },
  ],
})

export const MDatabaseOptions = createConfigModelClass('MDatabaseOptions', {
  id: types.identifier,
  sections: ['optionPanel.databaseInfo', 'dataPanel.sqlResult'],
  fields: [
    {
      section: 'optionPanel.databaseInfo',
      option: 'type',
      field: {
        type: 'select',
        label: '数据库类型',
        value: 'mysql',
        options: [
          {
            key: 'MySQL',
            value: 'mysql',
          },
        ],
      },
    },
    {
      section: 'optionPanel.databaseInfo',
      option: 'host',
      field: {
        type: 'text',
        label: '数据库地址',
        value: '192.168.90.160',
      },
    },
    {
      section: 'optionPanel.databaseInfo',
      option: 'userName',
      field: {
        type: 'text',
        label: '用户名',
        value: 'root',
      },
    },
    {
      section: 'optionPanel.databaseInfo',
      option: 'password',
      field: {
        type: 'password',
        label: '密码',
        value: '123456',
      },
    },
    {
      section: 'optionPanel.databaseInfo',
      option: 'port',
      field: {
        type: 'number',
        label: '端口',
        value: 3306,
      },
    },
    // {
    //   section: 'optionPanel.databaseInfo',
    //   option: 'database',
    //   field: {
    //     type: 'text',
    //     label: '数据库',
    //     value: '',
    //   },
    // },
  ],
})

const MDatabaseObj = types.model('MDatabaseObj', {
  database: types.string,
})

export const MDatabase = types
  .model('MDatabase', {
    id: types.maybe(types.number),
    database: types.maybe(types.string),
    options: types.optional(MDatabaseOptions, {}), // 数据库配置信息

    sql: defaultSql,
    result: types.frozen(),
    dataSources: types.optional(types.array(MDataManager), []),

    // 准备干掉的
    dataSource: types.optional(MDataManager, {}),

    // 优化的
    codeOptions: types.optional(MDatabaseCodeOptions, {}),
    databaseList: types.optional(types.array(MDatabaseObj), []),
  })
  .views((self) => ({
    get root_() {
      return getRoot(self)
    },
    get env_() {
      return getEnv(self)
    },
    get data_() {
      return getParent(self, 1)
    },
    get databaseTypes() {
      const data = ['Postgres', 'MySQL', 'MariaDB', 'SQLite', 'SQLServer', 'Oracle', 'ClickHouse']
      return data.map((val) => ({key: val, value: val}))
    },
  }))
  .actions(commonAction(['set', 'getSchema', 'setSchema']))
  .actions((self) => {
    const getDatabaseTypes = () => {
      const data = ['Postgres', 'MySQL', 'MariaDB', 'SQLite', 'SQLServer', 'Oracle', 'ClickHouse']
      return {databaseTypes: data.map((val) => ({key: val, value: val}))}
    }

    const getResult = flow(function* getResult() {
      const {io, tip} = self.env_
      try {
        const {sql} = self.codeOptions.getSchema()
        const response = yield io.data.getDatabaseResult({
          ':dataId': self.data_.dataId,
          sql,
        })
        self.codeOptions.setValues({
          result: JSON.stringify(response, null, 2),
        })
        self.data_.updateDataField(response)
        tip.success({content: 'SQL执行成功'})
      } catch (error) {
        self.data_.updateDataField([])
        tip.error({content: 'SQL执行错误'})
        log.error('getResult.Error:', error)
      }
    })

    // 测试连通性
    const testDatabaseConnectivity = flow(function* testDatabaseConnectivity() {
      const {io, tip} = self.env_
      try {
        const {type, host, port, userName, password, database} = self.option
        yield io.data.test({
          host,
          port,
          dbType: type.toLowerCase(),
          userName,
          password: encodeAes(password),
          database,
        })
        tip.success({content: '连通成功'})
        // self.result = JSON.stringify(response, null, 4)
      } catch (error) {
        console.log(error)
        tip.error({content: '连通失败'})
        log.error('getResult.Error:', error)
      }
    })

    // 获取数据库
    const getDatabases = flow(function* getDatabases() {
      const {tip, io} = self.env_
      const {type, host, port, userName, password} = self.options.getSchema()
      try {
        const result = yield io.data.getDatabases({
          dataType: type,
          config: {
            host,
            port,
            username: userName,
            password: encodeAes(password),
          },
        })
        self.set({databaseList: result})
        tip.success({content: '获取数据库列表成功'})
      } catch (error) {
        log.error('getDatabases.Error: ', error)
        tip.error({content: error.message})
      }
    })

    const setDataSource = (dataSource) => {
      const {dataSourceId, dataSourceName, dataType, config, remark, userId, organizationId, mtime, ctime} = dataSource
      // 更新自己的options
      self.options.setSchema({
        ...config,
        name: dataSourceName,
        remark,
        userName: config.userName,
      })

      self.data_.dataSource.set({
        dataSourceId,
        dataSourceName,
        dataType,
        config,
        remark,
        userId,
        organizationId,
        mtime,
        ctime,
      })
    }

    const setData = (data) => {
      const {
        config: {type, host, username, password, port, database, sql},
      } = data
      self.options.setSchema({
        userName: username,
        type,
        host,
        password: decodeAes(password),
        port,
      })
      self.set({database})
      self.codeOptions.setValues({sql})
    }

    return {
      getDatabaseTypes,
      getResult,
      getDatabases,
      testDatabaseConnectivity,
      setDataSource,
      setData,
    }
  })
