/**
 * @author 南风
 * @description 数据面板-新建数据
 */
import {types, flow, getEnv, getRoot} from "mobx-state-tree"
import config from "@utils/config"
import commonAction from "@utils/common-action"
import createLog from "@utils/create-log"

const log = createLog("@models/data/data-creater")

const MDatabase = types
  .model("MDatabase", {
    name: types.maybe(types.string),
    type: types.maybe(types.string),
    host: types.maybe(types.string),
    username: types.maybe(types.string),
    password: types.maybe(types.string),
    port: types.optional(types.number, 3306),
    config: types.optional(types.frozen(), {}),
    database: types.maybe(types.string),
    databaseList: types.maybe(types.array(types.frozen()))
  })
  .views((self) => ({
    get root_() {
      return getRoot(self)
    },
    get env_() {
      return getEnv(self)
    },
    get isMySQLFamily_() {
      return ["postgresql", "mysql"].includes(self.type)
    },
    get isOracle_() {
      return ["oracle"].includes(self.type)
    }
  }))
  .actions(commonAction(["set"]))
  .actions((self) => {
    const changeDatabaseType = (type) => {
      self.config = {}
      self.set({type})
    }

    const setConfig = (configs) => {
      self.set({
        config: {
          ...self.config,
          ...configs
        }
      })
    }

    const getDatabases = flow(function* getDatabases() {
      const {io, tip} = self.env_
      try {
        const res = yield io.data.getDatabases({
          dataType: self.type,
          config: self.config
        })
        self.databaseList = res.map((v) => ({
          key: v.database,
          value: v.database
        }))
        tip.success({content: "获取数据库列表成功"})
      } catch (error) {
        log.error("getDatabases.Error: ", error)
        tip.error({content: error.message})
      }
    })

    const create = flow(function* createByConfig() {
      const {io, event, tip} = self.env_
      try {
        yield io.data.createByConfig({
          dataType: self.type,
          name: self.name,
          config: self.config
        })
        event.fire("dataPanel.getDatas")
        tip.success({content: "添加数据库成功"})
      } catch (error) {
        console.log(error)
        tip.error({content: error.message})
      }
    })

    return {
      getDatabases,
      create,
      changeDatabaseType,
      setConfig
    }
  })

export const MDataCreater = types
  .model("MDataCreater", {
    type: types.optional(types.frozen(), "Excel"),
    files: types.optional(types.array(types.frozen()), []),
    state: types.optional(
      types.enumeration(["loading", "success", "error"]),
      "loading"
    ),
    database: types.optional(MDatabase, {})
  })
  .views((self) => ({
    get env_() {
      return getEnv(self)
    },
    get root_() {
      return getRoot(self)
    }
  }))
  .actions(commonAction(["set"]))
  .actions((self) => {
    const create = flow(function* create(datas, type) {
      const {tip} = self.env_
      const {
        sidebar: {dataPanel}
      } = self.root_
      const file = datas[0]

      const formData = new FormData()
      formData.append("dataType", type)
      formData.append("name", file.name)
      formData.append("file", file)

      self.state = "loading"
      try {
        yield fetch(`${config.urlPrefix}data/form`, {
          method: "POST",
          body: formData
        })
        tip.success({content: "数据新建成功"})
        self.state = "success"
        dataPanel.getDatas()
        self.files = []
      } catch (error) {
        tip.error({content: error.message, isManuallyClose: true})
        log.error("create.Error:", error)
        self.state = "error"
      }
    })

    const createByConfig = flow(function* createByConfig(option) {
      const {io, event} = self.env_
      try {
        yield io.data.createByConfig(option)
        event.fire("dataPanel.getDatas")
      } catch (error) {
        // TODO error 统一替换
        console.log(error)
      }
    })

    const createrApi = () => {
      // const modal = self.root_.overlayManager.get('fieldModal')
      // modal.show({
      //   attachTo: false,
      //   title: '添加API',
      //   field: {
      //     list: [{
      //       type: 'text',
      //       label: 'name',
      //       option: 'name',
      //       required: true,
      //     }, {
      //       type: 'text',
      //       label: 'URL',
      //       option: 'url',
      //       required: true,
      //     }, {
      //       type: 'select',
      //       label: '请求方式',
      //       option: 'method',
      //       value: 'GET',
      //       options: [{
      //         key: 'GET',
      //         value: 'GET',
      //       }, {
      //         key: 'POST',
      //         value: 'POST',
      //       }],
      //     }],
      //   },
      // })
    }

    const createrDatabase = () => {
      self.root_.overlayManager.get("modal").show({
        attachTo: false,
        title: "添加数据库"
      })
    }

    return {
      create,
      createByConfig,
      createrApi,
      createrDatabase
    }
  })
