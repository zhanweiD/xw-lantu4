import {flow, getEnv, getParent, types} from "mobx-state-tree"
import commonAction from "@utils/common-action"
import moment from "moment"
import createLog from "@utils/create-log"
import uuid from "@utils/uuid"
import hJSON from "hanson"
import random from "@utils/random"
import {MDatabase} from "../data/data-database"
import {MApi} from "../data/data-api"
import {MJson} from "../data/data-json"
import {MExcel} from "../data/data-excel"
import {MDataBasic} from "../data/data-basic"
import {MDataSource} from "../data/data-source"
import {MDataField} from "../data/data-field"

const log = createLog("@models/editor/editor-tab-data")

export const MDataTab = types
  .model("MDataTab", {
    dataId: types.maybe(types.number),
    dataName: types.maybe(types.string),
    folderId: types.maybeNull(types.number),
    dataType: types.maybe(types.string),
    basic: types.optional(MDataBasic, {}),
    excel: types.optional(MExcel, {}),
    json: types.optional(MJson, {}),
    api: types.optional(MApi, {}),
    database: types.optional(MDatabase, {}),
    dataField: types.optional(MDataField, {}),
    dataSource: types.optional(MDataSource, {}),
    dataSources: types.optional(types.array(MDataSource), []),
    // 是否已经创建数据
    isCreate: types.maybe(types.boolean, false),
    // 以下字段兼容exhibit面板
    // 判断是否是组件面板创建的
    isExhibit: types.maybe(types.boolean, false),
    // 判断是否时项目面板
    isProject: types.maybe(types.boolean, false),
    projectId: types.maybeNull(types.number)
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
        json: "data-json",
        excel: "data-excel",
        mysql: "data-mysql",
        api: "data-api"
      }
      return iconMapping[self.dataType] || ""
    },
    get result_() {
      if (
        self.dataType === "api" ||
        self.dataType === "json" ||
        self.dataType === "database"
      ) {
        return hJSON.parse(self[self.dataType].codeOptions.result.value)
      }
      const {data, columns} = self.excel
      const columnsKey = columns.map((column) => column.name)
      const tableListData = data.map((rowData) => {
        return columnsKey.map((key) => rowData[key])
      })
      tableListData.unshift(columnsKey)
      return tableListData
    }
  }))
  .actions(commonAction(["set"]))
  .actions((self) => {
    const getData = flow(function* getData() {
      const {tip} = self.env_
      self.dataField = {id: uuid()}
      // 有id证明有数据，那么进行赋值
      if (self.dataId) {
        self.basic = {
          id: self.dataId
        }
        const {io} = self.env_
        const dataIo = self.isProject ? io.project.data : io.data
        try {
          const data = yield dataIo.getData({
            ":dataId": self.dataId,
            ":projectId": self.isProject ? self.projectId : null
          })
          self.setData(data)
        } catch (error) {
          self.isExhibit || tip.error({content: "获取数据失败"})
          log.error("Get Data Error", error)
        }
      } else {
        self.basic = {id: 0}
        self.basic.setSchema({customId: random(6)})
        // self.updateDataField()
        self.getDataSources({type: "database"})
      }
    })

    const setData = (data) => {
      const {
        dataType,
        dataName,
        ctime,
        mtime,
        remark,
        user,
        config,
        dataSource,
        customId
      } = data
      let type = dataType
      // basic赋值
      self.dataName = dataName
      self.basic.setSchema({
        ctime: moment(ctime).format("YYYY-MM-DD HH:mm:ss"),
        mtime: moment(mtime).format("YYYY-MM-DD HH:mm:ss"),
        creator: user ? user.nickname : "",
        dataName,
        remark,
        customId: customId.toString()
      })
      // dataFiled赋值
      if (config && config.dataField) {
        self.dataField.setValues({
          dataFieldCode: JSON.stringify(config.dataField, null, 2)
        })
      }

      if (type === "excel") {
        self.excel.options.setSchema({...config})
        const excelData = JSON.parse(data.fileData)
        self.excel.set({
          data: excelData.data,
          columns: excelData.columns,
          hasExcel: excelData.data.length > 0
        })
      } else if (type === "json") {
        const {useDataProcessor} = config
        const codeOptions = {
          data: data.fileData,
          useDataProcessor:
            typeof useDataProcessor === "boolean" ? useDataProcessor : true
        }
        self.json.codeOptions.setValues(codeOptions)
        self.json.formatData(false)
        self.json.onOptionsChange(codeOptions)
        data.processorFunction &&
          self.json.codeOptions.setValues({
            dataProcessor: data.processorFunction
          })
      } else if (type === "api") {
        const {processorFunction} = data
        const {url, method, headers, qs, body, useDataProcessor} = config

        self.api.options.setValues({url, method})
        self.api.codeOptions.setValues({
          headers,
          dataProcessor: processorFunction,
          query: qs,
          useDataProcessor:
            typeof useDataProcessor === "boolean" ? useDataProcessor : true
        })
        body && self.api.codeOptions.setValues({body})
      } else {
        // 站在全局数据角度看，类型只有database/sql
        type = "database"

        self.database.options.setSchema({
          ...dataSource.config,
          userName: dataSource.config.username,
          name: dataSource.dataSourceName,
          remark: dataSource.remark
        })
        self.database.dataSource.set(dataSource)
        self.database.codeOptions.setValues({sql: config.sql})
        self.getDataSources({type: "database"})
      }

      self.set({
        dataType: type,
        isCreate: true
      })
      self.basic.setSchema({isCreate: true})
      const {dataSourceId, dataSourceName} = dataSource
      self.dataSource.set({
        dataSourceId,
        dataSourceName,
        type,
        config: dataSource.config
      })
      self.updateDataField()
    }

    const saveData = flow(function* saveData() {
      const {tip} = self.env_
      try {
        const {dataType, folderId, basic, isCreate, dataField} = self
        const {dataName, remark, customId} = basic.getSchema()
        // 数据需要的配置
        let data = {
          folderId,
          dataName,
          remark,
          customId,
          config: {
            dataField: hJSON.parse(dataField.dataFieldCode.value)
          }
        }
        // 数据源需要的配置
        let dataSourceOptions = {
          dataType,
          dataSourceName: dataName,
          config: {}
        }
        // 数据源创建、修改后执行的函数
        let afterDataSourceHandel = () => {}
        if (dataType === "database") {
          const {dataSource} = self
          const {sql} = self.database.codeOptions.getSchema()
          data = {
            ...data,
            dataSourceId: dataSource.dataSourceId,
            config: {...data.config, sql}
          }
          self.updateData(data)
        } else if (dataType === "json") {
          // 保存前先格式化
          self.json.formatData()
          const {useDataProcessor, dataProcessor} =
            self.json.codeOptions.getSchema()
          const jsonData = JSON.stringify(
            JSON.parse(self.json.codeOptions.data.value)
          )
          // Q: 为什么要这么实现
          // A: 一个全局数据由数据和数据源两部分组成，数据一定要包含一个数据源，所以创建数据之前一定要创建数据源
          dataSourceOptions = {
            ...dataSourceOptions,
            data: jsonData
          }
          afterDataSourceHandel = (dataSource) => {
            data = {
              ...data,
              dataSourceId: dataSource.dataSourceId,
              config: {
                ...data.config,
                useDataProcessor
              },
              processorFunction: dataProcessor
            }
            self.updateData(data)
            self.dataSource.set({...dataSource})
          }
        } else if (dataType === "api") {
          dataSourceOptions = {
            ...dataSourceOptions,
            config: {
              url: self.api.options.url.value
            }
          }
          afterDataSourceHandel = (dataSource) => {
            // self.dataSource.set(...dataSource)
            const {method, url} = self.api.options.getSchema()
            const {headers, query, body, dataProcessor, useDataProcessor} =
              self.api.codeOptions.getSchema()
            data = {
              ...data,
              dataSourceId: dataSource.dataSourceId,
              config: {
                ...data.config,
                url,
                method,
                headers,
                qs: query,
                body,
                useDataProcessor
              },
              processorFunction: dataProcessor
            }
            self.updateData(data)
            self.dataSource.set({...dataSource})
          }
        } else if (dataType === "excel") {
          const excelData = JSON.stringify({
            columns: self.excel.columns,
            data: self.excel.data
          })
          const {row, limit, isSetAlias} = self.excel.options.getSchema()
          dataSourceOptions = {
            ...dataSourceOptions,
            data: excelData
          }
          afterDataSourceHandel = (dataSource) => {
            data = {
              ...data,
              dataSourceId: dataSource.dataSourceId,
              config: {
                ...data.config,
                row,
                limit,
                isSetAlias
              }
            }
            self.updateData(data)
            self.dataSource.set({...dataSource})
          }
        }

        if (dataType === "json" || dataType === "excel" || dataType === "api") {
          if (isCreate) {
            dataSourceOptions = {
              ...dataSourceOptions,
              ":dataSourceId": self.dataSource.dataSourceId
            }
            yield self.dataSource.updateDataSource({
              dataSourceOptions,
              afterUpdate: afterDataSourceHandel
            })
          } else {
            yield self.dataSource.createDataSource({
              dataSourceOptions,
              afterCreate: afterDataSourceHandel
            })
          }
        }
      } catch (error) {
        log.error("SaveData error", error)
        tip.error({content: "保存失败！"})
      }
    })

    const updateData = flow(function* createData(data) {
      const {io, tip, event} = self.env_
      let dataIo = io.data
      if (self.isProject) {
        dataIo = io.project.data
        data = {...data, ":projectId": self.projectId}
      }
      try {
        // 判断是否已经创建
        if (self.isCreate) {
          const result = yield dataIo.updateData({
            ...data,
            ":dataId": self.dataId
          })
          const {mtime} = result
          self.basic.setSchema({
            mtime: moment(mtime).format("YYYY-MM-DD HH:mm:ss")
          })
        } else {
          const result = yield dataIo.createData(data)
          self.isCreate = true
          self.basic.setSchema({isCreate: true})
          const {nickname, ctime, mtime, dataName, remark, dataId, customId} =
            result
          self.basic.setSchema({
            ctime: moment(ctime).format("YYYY-MM-DD HH:mm:ss"),
            mtime: moment(mtime).format("YYYY-MM-DD HH:mm:ss"),
            creator: nickname,
            dataName,
            remark,
            customId: customId.toString()
          })
          self.dataId = dataId
        }

        self.set({
          dataName: self.basic.dataName.value
        })

        self.updateDataField()
        if (self.isProject) {
          event.fire("projectDetail.getData")
        } else {
          event.fire("dataPanel.getDataFolder")
        }

        self.editor_.finishCreate({...self, type: "data"})
        tip.success({content: "保存成功"})
      } catch (error) {
        log.error("Create Data error", error)
        if (error && error.code === "ERROR_PARAMS_ERROR") {
          tip.error({
            content: "自定义ID校验错误，请检查是否包含数字和字母外的字符"
          })
        } else {
          tip.error({content: error.message})
        }
      }
    })

    // 操作一维表的相关操作
    // 更新数据字段
    const updateDataField = (data) => {
      let dataField = []
      if (!data) {
        if (self.dataType === "json") {
          self.json.getResult()
          return
        }
        if (self.dataType === "api") {
          self.api.getResult()
          return
        }
        if (self.dataType === "database") {
          self.database.getSqlResult()
          return
        }
      }
      if (self.dataType !== "excel") {
        try {
          // 真实的数据字段
          if (typeof data[0][0] === "object") {
            [dataField] = data
          } else {
            dataField = data[0].map((key, i) => {
              return {
                key,
                name: key,
                type: typeof data[1][i]
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
            type
          }))
        } else {
          dataField = self.excel.columns.map(({alias, name, type}) => ({
            key: name,
            name: alias || name,
            type
          }))
        }
      }

      const {dataFieldCode} = self.dataField.getSchema()
      // 自定义的数据字段
      const customDataField = hJSON.parse(dataFieldCode)

      const customDataFieldKey = customDataField.map((field) => field.key)
      const dataFieldKey = dataField.map((field) => field.key)

      // 真实的数据字段里额外的数据字段
      const extraDataField = dataField.filter(
        (field) => !customDataFieldKey.includes(field.key)
      )
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

    const getDataSources = flow(function* getDataSources({type = ""}) {
      const {io} = self.env_
      const dataIo = self.isProject ? io.project.data : io.data
      try {
        const {list} = yield dataIo.getDataSource({
          ":projectId": self.isProject ? self.projectId : null
        })
        const dataSources =
          type === "database" &&
          list.filter(
            (data) =>
              data.dataType !== "json" &&
              data.dataType !== "api" &&
              data.dataType !== "excel"
          )
        self.set({dataSources})
      } catch (error) {
        // TODO error 统一替换
        log.error(error)
      }
    })

    return {
      getData,
      setData,
      saveData,
      updateData,
      updateDataField,
      getDataSources
    }
  })
