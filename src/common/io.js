import onerIO from 'oner-io'
import decodeAes from './aes-decode'
import urlPrefix from './urlPrefix'

export const context = onerIO.context({
  rest: true,
  header: {
    'Content-Type': 'application/json;charset=utf-8',
  },
  // 目前还没有做鉴权, 下面的设置为 false, 和服务端的 * 相对应
  // 如果设为 true, 需要服务端设置响应头 Access-Control-Allow-Origin 为具体的白名单
  withCredentials: false,
  mock: false,
  // mockUrlPrefix: 'http://111.231.93.26:7300/mock/5ecddb1ce73049638f1a4aa4/example/',
  mockUrlPrefix: 'http://111.231.93.26:7300/mock/5fe58f5ba08e381d781a820e/example/',
  urlPrefix,
  // 添加额外参数后端会报错
  urlMark: false,
  urlStamp: true,
  fit(response) {
    if (response.code === 403) {
      window.waveview.session.data({})
      window.location.href = `${response.params.url}`
      // this.toReject({
      //   message: '登录超时'
      // })
    } else if (response.success === false) {
      this.toReject({
        message: decodeAes(response.message),
        code: response.code,
      })
    } else {
      this.toResolve(response.content || {})
    }
  },
})

// 操作项目的接口
context.create('io.project', {
  // 获取项目列表
  getList: {
    method: 'GET',
    // mock: true,
    mockUrl: 'project',
    url: 'project',
    // url: 'http://192.168.90.160:9067/project',
    process(content) {
      // 将每个项目的大屏列表根据`sort`排序
      content.list.map(project => {
        const {sort} = project
        // 后端返回一定有id，由id生成索引idx
        project.idx = project.projectId
        project.id = project.projectId
        // 根据sort字段对大屏进行排序
        project.arts.sort((art1, art2) => sort.indexOf(art1.artId) - sort.indexOf(art2.artId))
        project.arts.map(val => {
          val.id = val.artId
          return val
        })

        project.data.map(d => {
          switch (d.data.type) {
            case 0:
              d.viewType = 'excelData'
              d.typeName = 'excel'
              d.name = d.data.excel.fileName
              d.dataId = d.data.dataId
              break
            case 1:
              d.viewType = 'jsonData'
              d.typeName = 'json'
              d.name = d.data.json.fileName
              d.dataId = d.data.dataId
              break
            case 2:
              d.viewType = 'apiData'
              d.typeName = 'api'
              d.name = d.data.api.name
              d.dataId = d.data.dataId
              break
            case 3:
              d.viewType = 'sqlData'
              d.typeName = 'database'
              d.name = d.data.dataSource.name
              d.dataId = d.data.dataId
              break
            default:
              d.viewType = 'excelData'
              d.typeName = 'excel'
          }
          d.type = d.data.type
          return d
        })
        /**
       * 0: 管理员
       * 1: 成员
       * 2: 只读成员
       *
       * c: 超级管理员
       * a: 组织管理员
       * b: 组织成员
       */
        // 当前权限
        // const role1 = 0
        // const role2 = 'a'
        // const nowPermission = (`${({
        //   0: '管理员',
        //   1: '成员',
        //   2: '只读成员',
        // })[role1]}/${({
        //   c: '超级管理员',
        //   a: '组织管理员',
        //   b: '组织成员',
        // })[role2]}`)
        // project.permission = testPermission.getPermission(role1 + role2)
        // console.log('process -> project.permission ', nowPermission, project.permission)
        return project
      })
      return content
    },
  },
  // 更新项目信息
  update: {
    method: 'PUT',
    mockUrl: 'project/:projectId',
    url: 'project/:projectId',
  },

  // 创建项目
  create: {
    method: 'POST',
    mockUrl: 'project',
    url: 'project',
    process(content) {
      content.id = content.projectId
      return content
    },
  },

  // 删除项目
  remove: {
    method: 'DELETE',
    mockUrl: 'project/:projectId',
    url: 'project/:projectId',
  },

  // 批量添加成员
  createMember: {
    method: 'POST',
    url: 'project/:projectId/member',
    process(content) {
      delete content.id
      delete content.ctime
      delete content.mtime
      return content
    },
  },

  // 删除成员
  removeMember: {
    method: 'DELETE',
    url: 'project/:projectId/member',
    willFetch: (vars, config) => {
      config.query = vars.data
    },
  },

  // 退出项目
  leave: {
    method: 'DELETE',
    url: 'project/:projectId/member/leave',
  },

  // 授权用户角色
  authorizeRole: {
    method: 'PUT',
    url: 'project/:projectId/member/authorize',
  },
})

// 操作大屏的接口
context.create('io.art', {
  // 获取大屏配置
  getDetail: {
    method: 'GET',
    mockUrl: 'art/:artId/:version',
    url: 'art/:artId/:version',
    process(content) {
      content.id = content.artId
      return content
    },

  },

  // 获取大屏内用到的组件列表
  getExhibits: {
    method: 'GET',
    mockUrl: 'art/:artId/:version/exhibit2',
    url: 'art/:artId/:version/exhibit',
  },

  // 创建大屏
  create: {
    method: 'POST',
    mockUrl: 'art',
    url: 'art',
    process(content) {
      content.id = content.artId
      return content
    },
  },
  // 更新大屏配置
  update: {
    method: 'PUT',
    mockUrl: 'art/:artId/:version',
    url: 'art/:artId/:version',
  },
  // 删除大屏
  remove: {
    method: 'DELETE',
    mockUrl: 'art/:artId',
    url: 'art/:artId',
  },
  export: {
    method: 'POST',
    url: 'art/export/private/waveview',
    fit(response) {
      if (response.code === 403) {
        window.location.href = `${response.params.url}`
      } else if (response.success === false) {
        this.toReject({
          message: response.message,
          code: response.code,
        })
      } else {
        this.toResolve(response)
      }
    },
  },
  getPreviewData: {
    method: 'GET',
    mockUrl: 'art/:artId/:versionId/schema/exhibit',
    url: 'art/:artId/:versionId/schema/exhibit',
  },
})

// 版本相关
context.create('io.artVersion', {
  // 获取版本列表
  getAll: {
    method: 'GET',
    mockUrl: 'art/:artId/version/list',
    url: 'art/:artId/version/list',
    process: response => {
      response.list && response.list.forEach(v => {
        v.id = v.versionId
      })
      return response
    },
  },

  // 发布
  release: {
    method: 'POST',
    url: 'art/:artId/release',
  },

  // 上线
  publish: {
    method: 'PUT',
    url: 'art/:artId/:versionId/publish',
  },

  // 下线
  unpublish: {
    method: 'PUT',
    url: 'art/:artId/:versionId/unpublish',
  },

  // 删除
  remove: {
    method: 'DELETE',
    url: 'art/:artId/:versionId/version',
  },

  // 校验大屏路径
  checkPublishId: {
    method: 'GET',
    url: 'art/publish/:publishId/only/path',
  },

  // 保存大屏路径
  savePublishId: {
    method: 'PUT',
    url: 'art/:publishId/publish/only/path',
  },

})

// 组件库相关接口
context.create('io.exhibit', {
  // 接口代理
  proxy: {
    method: 'POST',
    url: 'proxy',
  },
  getCustomCategories: {
    method: 'GET',
    mock: true,
    url: 'exhibit/customlist',
    mockUrl: 'exhibit/customlist',
  },
  createCustomExhibit: {
    method: 'POST',
    mock: true,
    url: 'exhibit/custom/create',
    mockUrl: 'exhibit/custom/create',
  },
  getCustomExhibit: {
    method: 'GET',
    mock: true,
    url: 'exhibit/custom',
    mockUrl: 'exhibit/custom',
  },
})

context.create('io.material', {
  getMaterialTypes: {
    method: 'GET',
    url: 'file/material/supported/type',
    mock: false,
    mockUrl: 'file/material/supported/type',
  },
  getMaterials: {
    method: 'GET',
    url: 'file/material',
    mock: false,
    mockUrl: 'file/material',
    process: response => {
      response && response.forEach(v => {
        v.createTime = v.ctime
        v.creater = v.userName
        v.id = v.fileId
        v.name = v.fileName
      })
      return response
    },
  },
  removeMaterial: {
    method: 'DELETE',
    url: 'file/material/:fileId',
  },
  updateMaterial: {
    method: 'PUT',
    url: 'file/material/:fileId',
  },
  getMaterialDetail: {
    method: 'GET',
    url: 'file/material/:fileId',
    mock: false,
    mockUrl: 'file/material/:fileId',
    process: response => {
      response.createTime = response.ctime
      response.creater = response.user?.nickName
      response.id = response.fileId
      response.name = response.fileName
      delete response.ctime
      delete response.mtime
      delete response.userName
      delete response.fileId
      delete response.fileName
      return response
    },
  },
})

context.create('io.data', {
  getDataTypes: {
    method: 'GET',
    url: 'data/supported/type',
  },
  getDatas: {
    method: 'GET',
    url: 'data',
    process: response => {
      response && response.forEach(v => {
        switch (v.type) {
          case 0:
            v.data = v.excel
            v.data.id = v.data.dataId
            v.data.name = v.data.fileName
            v.data.type = v.type
            break
          case 1:
            v.data = v.json
            v.data.id = v.data.dataId
            v.data.name = v.data.fileName
            v.data.type = v.type
            break
          case 2:
            v.data = v.api
            v.data.type = v.type
            v.data.id = v.data.dataId
            break
          case 3:
            v.data = v.dataSource
            v.data.id = v.data.dataId
            v.data.type = v.type
            break
          default: v.data = []
        }
      })
      return response
    },
  },
  getDetail: {
    method: 'GET',
    url: 'data/:dataId',
  },
  getAuthorizedProjects: {
    method: 'GET',
    url: 'data/:dataId/authorized/project',
  },
  getAvailableProjects: {
    method: 'GET',
    url: 'data/:dataId/available/project',
  },
  addAuthorizeProject: {
    method: 'POST',
    url: 'data/:dataId/authorized/project',
  },
  removeAuthorizedProject: {
    method: 'DELETE',
    url: 'data/:dataId/authorized/project',
    willFetch: (vars, config) => {
      config.query = vars.data
    },
  },
  updateAuthorizedTime: {
    method: 'PUT',
    url: 'data/:dataId/authorized/project',
  },
  updateData: {
    method: 'PUT',
    url: 'data/:dataId',
  },
  removeData: {
    method: 'DELETE',
    url: 'data/:dataId',
    willFetch: (vars, config) => {
      config.query = vars.data
    },
  },
  createData: {
    method: 'POST',
    url: 'data',
  },
  getDatabases: {
    method: 'POST',
    url: 'data/source/database',
  },

  getSqlResult: {
    method: 'POST',
    url: 'data/source/:dataId/query',
  },
  getSqlDetail: {
    method: 'GET',
    url: 'database/:databaseId',
    mock: true,
    mockUrl: 'database/:databaseId',
  },
})

context.create('io.auth', {
  login: {
    method: 'POST',
    url: `${window.appData?.pathPrefix || ''}/login/waveview`,
  },
})

context.create('io.template', {
  getTemplates: {
    method: 'GET',
    url: 'template/art',
    process: response => {
      response.list && response.list.forEach(v => {
        v.id = v.templateId
        v.name = v.templateName
      })
      return response
    },
  },
  // 获取大屏模版详细信息
  getDetail: {
    method: 'GET',
    url: 'template/art/:templateId',
    process(content) {
      content.id = content.artId
      return content
    },
  },
  // 获取大屏模版组件信息
  getExhibits: {
    method: 'GET',
    url: 'template/art/:templateId/exhibit',
  },
  // 另存为模板
  saveAsTemplate: {
    method: 'POST',
    url: 'template/art',
    process: response => {
      response.id = response.templateId
      response.name = response.templateName
      return response
    },
  },
  // 删除模板
  removeTemplate: {
    method: 'DELETE',
    url: 'template/art/:templateId',
  },

})

context.create('io.publish', {
  // 根据大屏id获取在线的版本, token认证
  getArt: {
    method: 'GET',
    url: 'art/publish/:publishId/online',
  },
  // 根据大屏id修改密码与开启大屏密码校验
  updateCipher: {
    method: 'PUT',
    url: 'art/publish/:artId/password',
  },
  // 发布页验证密码，返回生成的token
  confirmCipher: {
    method: 'POST',
    url: 'art/publish/:publishId/login',
  },
})

// 权限--成员管理页面相关的接口
context.create('io.member', {
  // 获取当前组织下的所有已加入成员
  getMemberList: {
    method: 'GET',
    url: 'organization/user',
  },

  // 获取当前组织下的所有已申请的用户
  getAppliedList: {
    method: 'GET',
    url: 'organization/approval',
  },

  // 删除组织用户
  remove: {
    method: 'DELETE',
    url: 'organization/:userId/user',
  },

  // 授权用户角色
  authorizeRole: {
    method: 'PUT',
    url: 'organization/authorize',
  },

  // 成员退出当前组织
  exit: {
    method: 'DELETE',
    url: 'organization/leave',
  },

  // 审批用户加入：通过/拒绝
  approval: {
    method: 'PUT',
    url: 'organization/approval/:userId/:action',
  },
})

// 权限--个人中心页面相关的接口
context.create('io.personal', {
  getPersonalInfo: {
    method: 'GET',
    url: 'user',
  },

  changeUserDetail: {
    method: 'PUT',
    url: 'user',
  },

  // 切换组织空间
  changeOrganization: {
    method: 'PUT',
    url: 'last/workspace',
  },
  // 退出登陆
  logout: {
    method: 'GET',
    url: 'logout',
  },
})

// 权限--组织管理页面
context.create('io.organization', {
  // 获取当前用户下的所有组织
  getOrganizationList: {
    method: 'GET',
    url: 'organization',
    mock: false,
    mockUrl: 'http://111.231.93.26:7300/mock/5eec1e1fe99185234d3695c3/auth/organization/list',
    process: response => {
      return response.map(item => {
        return {
          id: item.organizationId,
          name: item.organizationName,
          description: item.description,
          count: item.count,
          ctime: item.ctime,
          type: Number(item.roleCode),
        }
      })
    },
  },

  // 创建组织
  create: {
    method: 'POST',
    url: 'organization',
    process: response => {
      response.id = response.organizationId
      return response
    },
  },
  // 更新组织信息
  update: {
    method: 'PUT',
    url: 'organization',
  },
  // 删除组织
  remove: {
    method: 'DELETE',
    url: 'organization',
  },
  // 获取验证码，删除组织时需要
  getVerifyCode: {
    url: '', // 待定
  },
  // 获取邀请token
  getInviteToken: {
    method: 'GET',
    url: 'organization/token',
  },
  // 切换邀请角色时获取不同的邀请token
  changeInviteToken: {
    method: 'PUT',
    url: 'organization/token',
  },
  // 申请加入组织
  join: {
    method: 'POST',
    url: 'organization/join',
  },
  // 查询当前状态
  approvalStatus: {
    method: 'GET',
    url: 'organization/join/status',
  },
  // 删除记录
  removeApprovalLog: {
    method: 'DELETE',
    url: 'organization/approval/:approvalId',
  },
})

// 日志相关
context.create('io.log', {
  getLogs: {
    method: 'GET',
    url: '',
    mock: true,
    mockUrl: 'http://111.231.93.26:7300/mock/5e6b1b4cd1d64b61af0076c8/test/logs',
  },
})

// 给sdk专用的代理
context.create('io.sdk', {
  // 接口代理
  proxy: {
    method: 'POST',
    url: 'proxy',
  },
})

const {io} = context.api

export default io
