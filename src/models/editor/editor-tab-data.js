import {flow, getEnv, getParent, types} from 'mobx-state-tree'
import commonAction from '@utils/common-action'
import moment from 'moment'
import createLog from '@utils/create-log'
import uuid from '@utils/uuid'
import hJSON from 'hjson'
import random from '@utils/random'
import {MApi} from '../data/data-api'
import {MJson} from '../data/data-json'
import {MExcel} from '../data/data-excel'
import {MDataBasic} from '../data/data-basic'
import {MDataField} from '../data/data-field'

const log = createLog('@models/editor/editor-tab-data')

export const MDataTab = types
  .model('MDataTab', {
    dataId: types.maybe(types.number),
    dataName: types.maybe(types.string),
    folderId: types.maybe(types.number),
    dataType: types.maybe(types.string),
    basic: types.optional(MDataBasic, {}),
    excel: types.optional(MExcel, {}),
    json: types.optional(MJson, {}),
    api: types.optional(MApi, {}),
    dataField: types.optional(MDataField, {}),
    // 数据加载的状态
    state: types.optional(types.enumeration('State', ['loading', 'loadSuccess', 'loadError']), 'loadSuccess'),
    // 是否已经创建数据
    isCreate: types.maybe(types.boolean, false),
    // 以下字段兼容exhibit面板
    // 判断是否是组件面板创建的
    isExhibit: types.maybe(types.boolean, false),
    // 判断是否时项目面板
    // isProject: types.maybe(types.boolean, false),
    projectId: types.maybe(types.number),
  })
  .views((self) => ({
    get env_() {
      return getEnv(self)
    },
    get editor_() {
      return getParent(self, 3)
    },
    get icon_() {
      const iconMapping = {
        json: 'data-json',
        excel: 'data-excel',
        mysql: 'data-mysql',
        api: 'data-api',
      }
      return iconMapping[self.dataType] || ''
    },
    get result_() {
      if (self.dataType === 'api' || self.dataType === 'json' || self.dataType === 'database') {
        return hJSON.parse(self[self.dataType].codeOptions.result.value)
      }
      const {data, columns} = self.excel
      const columnsKey = columns.map((column) => column.name)
      const tableListData = data.map((rowData) => {
        return columnsKey.map((key) => rowData[key])
      })
      tableListData.unshift(columnsKey)
      return tableListData
    },
    get state_() {
      return self.state
    },
  }))
  .actions(commonAction(['set']))
  .actions((self) => {
    const getData = flow(function* getData() {
      const {tip} = self.env_
      self.dataField = {id: uuid()}
      // 有id证明有数据，开始进行赋值
      if (self.dataId) {
        // 各个数据开始加载数据之前将状态置成loading
        self.set({state: 'loading'})
        self.basic = {
          id: self.dataId,
        }
        const {io} = self.env_
        const dataIo = self.projectId ? io.project.data : io.data
        try {
          const data = yield dataIo.getData({
            ':dataId': self.dataId,
            ':projectId': self.projectId ? self.projectId : undefined,
          })
          self.setData(data)
        } catch (error) {
          self.isExhibit || tip.error({content: '获取数据失败'})
          log.error('Get Data Error', error)
          self.set('state', 'loadError')
        }
      } else {
        self.basic = {id: 0}
        self.basic.setSchema({customId: random(6)})
        // self.updateDataField()
      }
    })

    const setData = (data) => {
      const {dataType, dataName, ctime, mtime, remark, user, config} = data
      // basic赋值
      self.dataName = dataName
      self.basic.setSchema({
        ctime: moment(ctime).format('YYYY-MM-DD HH:mm:ss'),
        mtime: moment(mtime).format('YYYY-MM-DD HH:mm:ss'),
        creator: user ? user.nickname : '',
        dataName,
        remark,
      })
      // dataFiled赋值
      if (config && config.dataField) {
        self.dataField.setValues({
          dataFieldCode: JSON.stringify(config.dataField, null, 2),
        })
      }

      self[dataType].setData(data)

      self.set({
        dataType: dataType,
        isCreate: true,
      })
      self.basic.setSchema({isCreate: true})

      self.updateDataField()
      // 全部执行完成之后将状态置为成功
      self.set({state: 'loadSuccess'})
    }

    const saveData = () => {
      // 保存前校验，通不过直接就结束
      if (!beforeSave()) {
        return
      }
      const {tip} = self.env_
      try {
        const {dataType, folderId, basic, dataField} = self
        const {dataName, remark} = basic.getSchema()
        // 数据需要的配置
        let data = {
          dataType,
          folderId,
          dataName,
          remark,
          config: {
            dataField: hJSON.parse(dataField.dataFieldCode.value),
          },
        }
        // 数据源创建、修改后执行的函数
        if (dataType === 'json') {
          // 保存前先格式化
          self.json.formatData()
          const fileData = JSON.stringify(JSON.parse(self.json.codeOptions.data.value))
          const {useDataProcessor, dataProcessor} = self.json.codeOptions.getSchema()
          data = {
            ...data,
            config: {
              ...data.config,
              useDataProcessor,
            },
            fileData,
            processorFunction: dataProcessor,
          }
        } else if (dataType === 'api') {
          const {method, url} = self.api.options.getSchema()
          const {headers, query, body, dataProcessor, useDataProcessor} = self.api.codeOptions.getSchema()
          data = {
            ...data,
            config: {
              ...data.config,
              url,
              method,
              headers,
              qs: query,
              body,
              useDataProcessor,
            },
            processorFunction: dataProcessor,
          }
        } else if (dataType === 'excel') {
          const fileData = JSON.stringify({
            columns: self.excel.columns,
            data: self.excel.data,
          })
          const {row, limit, isSetAlias} = self.excel.options.getSchema()
          data = {
            ...data,
            fileData,
            config: {
              ...data.config,
              row,
              limit,
              isSetAlias,
            },
          }
        }
        self.updateData(data)
      } catch (error) {
        log.error('SaveData error', error)
        tip.error({content: '保存失败！'})
      }
    }

    // todo:留这个方法没有意义，准备干掉和save合并
    const updateData = flow(function* createData(data) {
      const {io, tip, event} = self.env_
      let dataIo = io.data
      if (self.projectId) {
        dataIo = io.project.data
        data = {...data, ':projectId': self.projectId}
      }
      try {
        // 判断是否已经创建
        if (self.isCreate) {
          const result = yield dataIo.updateData({
            ...data,
            ':dataId': self.dataId,
          })
          const {mtime} = result
          self.basic.setSchema({
            mtime: moment(mtime).format('YYYY-MM-DD HH:mm:ss'),
          })
        } else {
          const result = yield dataIo.createData(data)
          self.isCreate = true
          self.basic.setSchema({isCreate: true})
          const {nickname, ctime, mtime, dataName, remark, dataId} = result
          self.basic.setSchema({
            ctime: moment(ctime).format('YYYY-MM-DD HH:mm:ss'),
            mtime: moment(mtime).format('YYYY-MM-DD HH:mm:ss'),
            creator: nickname,
            dataName,
            remark,
            // customId: customId.toString()
          })
          self.dataId = dataId
        }

        self.set({
          dataName: self.basic.dataName.value,
        })

        // self.updateDataField()
        if (self.projectId) {
          event.fire('dataPanel.getFolders', {type: 'project'})
        } else {
          event.fire('dataPanel.getFolders', {type: 'space'})
        }

        self.editor_.finishCreate({...self, type: 'data'})
        tip.success({content: '保存成功'})
      } catch (error) {
        log.error('Create Data error', error)
        let content = '数据保存失败'
        if (error && error.code) {
          switch (error.code) {
            case 'ERROR_PARAMS_ERROR':
              content = '自定义ID校验错误，请检查是否包含数字和字母外的字符'
              break
            case 'ERROR_DATA_NAME_EXIST':
              content = '数据名称已存在，请检查当前文件夹下是否有重名文件'
              break
          }
        }
        tip.error({content})
      }
    })

    // 操作一维表的相关操作
    // 更新数据字段
    const updateDataField = (data) => {
      let dataField = []
      if (!data) {
        if (self.dataType !== 'excel') {
          self[self.dataType]?.getResult()
          return
        }
      }
      if (self.dataType !== 'excel') {
        try {
          // 真实的数据字段
          if (typeof data[0][0] === 'object') {
            [dataField] = data
          } else {
            dataField = data[0].map((key, i) => {
              return {
                key,
                name: key,
                type: typeof data[1][i],
              }
            })
          }
        } catch (error) {
          dataField = []
        }
      } else {
        if (data) {
          dataField = data.map(({alias, name, type}) => ({
            key: name,
            name: alias || name,
            type,
          }))
        } else {
          dataField = self.excel.columns.map(({alias, name, type}) => ({
            key: name,
            name: alias || name,
            type,
          }))
        }
      }

      const {dataFieldCode} = self.dataField.getSchema()
      let customDataField = ''
      let customDataFieldKey = []
      let dataFieldKey = []
      // 自定义的数据字段
      try {
        customDataField = hJSON.parse(dataFieldCode)
        customDataFieldKey = customDataField.map((field) => field.key)
        dataFieldKey = dataField.map((field) => field.key)
      } catch (error) {
        customDataField = []
        customDataFieldKey = []
        dataFieldKey = []
      }

      // 真实的数据字段里额外的数据字段
      const extraDataField = dataField.filter((field) => !customDataFieldKey.includes(field.key))
      // 自定义字段中无效的数据字段
      const invalidCustomDataField = []
      // 自定义字段中有效的数据字段
      const activeCustomDataField = []

      customDataField.forEach((field) => {
        if (dataFieldKey.includes(field.key)) {
          activeCustomDataField.push(field)
        } else {
          invalidCustomDataField.push(field)
        }
      })

      dataField = customDataField.concat(extraDataField)
      const dataFieldConfigs = []

      // 临时方法 往结果中塞字段
      const setDataFieldConfigs = (DataFields) => {
        DataFields.forEach(({name, type, key}) => {
          dataFieldConfigs.push({key: `${name}`, value: key, remark: type})
        })
      }
      setDataFieldConfigs(extraDataField)
      // 无效的先不放入结果中
      // setDataFieldConfigs(invalidCustomDataField, '无效')
      setDataFieldConfigs(activeCustomDataField)

      self.dataField.setValues({dataField: dataField.map((field) => field.key)})
      self.dataField.setConfigs({dataField: {options: dataFieldConfigs}})
    }

    // 保存前的校验
    // 后面可能存在扩展，单独抽出生命周期
    const beforeSave = () => {
      const {tip} = self.env_
      const {basic} = self
      const {dataName} = basic.getSchema()
      if (!dataName) {
        tip.error({content: '数据名称未填写，请填写数据名称'})
        return false
      }
      if (dataName.length > 32) {
        tip.error({content: '数据名称过长'})
        return false
      }
      return true
    }

    // const afterSave = () => {

    // }

    return {
      getData,
      setData,
      saveData,
      updateData,
      updateDataField,
    }
  })
