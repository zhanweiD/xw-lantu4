import onerIO from "oner-io"

export const context = onerIO.context({
  rest: true,
  header: {
    "Content-Type": "application/json;charset=utf-8"
  },
  // 如果设为 true, 需要服务端设置响应头 Access-Control-Allow-Origin 为具体的白名单
  withCredentials: false,
  mock: false,
  mockUrlPrefix: "http://119.45.200.52:38080/app/mock/20/",
  urlPrefix: "/api/v4/waveview/",
  // 添加额外参数后端会报错
  urlMark: false,
  urlStamp: true,
  fit(response) {
    if (response.code === 403) {
      window.waveview.session.remove()
    } else if (response.success === false) {
      if (response.code === "ERROR_USER_NOT_LOGGED") {
        window.location.href = "/login"
      } else {
        this.toReject({
          message: response.message,
          code: response.code
        })
      }
    } else {
      if (response.content) {
        this.toResolve(response.content || {})
      } else {
        this.toResolve(response)
      }
    }
  }
})

// 操作项目的接口
context.create("io.project", {
  getProjects: {
    method: "GET",
    url: "project",
    process(content) {
      content.list.map((project) => {
        project.arts.map((art) => {
          art.projectId = project.projectId
          return art
        })
        return project
      })
      return content
    }
  },
  create: {
    method: "POST",
    url: "project"
  },
  update: {
    method: "PUT",
    url: "project/:projectId"
  },
  remove: {
    method: "DELETE",
    url: "project/:projectId"
  },
  sort: {
    method: "POST",
    url: "project/:projectId/art/sort"
  },
  getDetail: {
    method: "GET",
    url: "project/:projectId"
  },
  addMembers: {
    method: "POST",
    url: "project/:projectId/members"
  },
  removeMembers: {
    url: "project/:projectId/members",
    method: "DELETE"
  },
  authorizeRole: {
    method: "PUT",
    url: "project/:projectId/members/authorize"
  },
  quit: {
    url: "project/:projectId/quit",
    method: "DELETE"
  },
  getTemplates: {
    method: "GET",
    url: "template"
  },
  removeTemplate: {
    method: "DELETE",
    url: "template/:templateId",
    willFetch: (vars, config) => {
      config.query = vars.data
    }
  }
})

context.create("io.data", {
  // 创建
  createDataFolder: {
    method: "POST",
    url: "data/folder"
  },
  createDataSource: {
    method: "POST",
    url: "data/source"
  },
  createData: {
    method: "POST",
    url: "data"
  },
  parseExcel: {
    method: "POST",
    url: "data/parse/excel"
  },
  removeDataFolder: {
    method: "DELETE",
    url: "data/folder/:folderId"
  },
  removeDataSource: {
    method: "DELETE",
    url: "data/source/:dataSourceId"
  },
  removeData: {
    method: "DELETE",
    url: "data/:dataId"
  },
  getDataFolder: {
    method: "GET",
    url: "data/folder",
    mock: false,
    mockUrl: "data/folder"
  },
  getDataSource: {
    method: "GET",
    url: "data/source"
  },
  getData: {
    method: "GET",
    url: "data/:dataId/detail"
  },
  // 接口代理
  proxy: {
    method: "POST",
    url: "proxy"
  },
  getDatabases: {
    method: "POST",
    url: "data/source/database"
  },
  getDatabaseResult: {
    method: "GET",
    url: "data/source/:dataSourceId/query"
  },
  test: {
    method: "GET",
    url: "database/test"
  },
  updateData: {
    method: "PUT",
    url: "data/:dataId"
  },
  updateDataSource: {
    method: "PUT",
    url: "data/source/:dataSourceId"
  },
  getDatasInfo: {
    method: "GET",
    url: "bulk/data"
  }
})

context.create("io.project.data", {
  createData: {
    method: "POST",
    url: "project/:projectId/data"
  },
  createDataSource: {
    method: "POST",
    url: "project/:projectId/data/source"
  },
  getDataList: {
    method: "GET",
    url: "project/:projectId/data"
  },
  getDataSource: {
    method: "GET",
    url: "project/:projectId/data/source"
  },
  removeDataSource: {
    method: "DELETE",
    url: "project/:projectId/data/source/:dataSourceId"
  },
  removeData: {
    method: "DELETE",
    url: "project/:projectId/data/:dataId"
  },
  updateDataSource: {
    method: "PUT",
    url: "project/:projectId/data/source/:dataSourceId"
  },
  updateData: {
    method: "PUT",
    url: "project/:projectId/data/:dataId"
  },
  getData: {
    method: "GET",
    url: "project/:projectId/data/:dataId/detail"
  }
})

context.create("io.art", {
  create: {
    method: "POST",
    url: "project/:projectId/art"
  },
  getDetail: {
    method: "GET",
    url: "art/:artId"
  },
  remove: {
    method: "DELETE",
    url: "project/:projectId/art/:artId"
  },
  update: {
    method: "PUT",
    url: "project/:projectId/art/:artId"
  },
  addFrame: {
    method: "POST",
    url: "project/:projectId/art/:artId/frame"
  },
  updateFrame: {
    method: "PUT",
    url: "project/:projectId/art/:artId/frame/:frameId"
  },
  removeFrame: {
    method: "DELETE",
    url: "project/:projectId/art/:artId/frame/:frameId"
  },
  createBox: {
    method: "POST",
    url: "project/:projectId/art/:artId/:frameId/box"
  },
  getBox: {
    method: "GET",
    url: "art/:artId/:frameId/box"
  },
  updateBoxes: {
    method: "PUT",
    url: "project/:projectId/art/:artId/move/boxes"
  },
  removeBoxes: {
    method: "POST",
    url: "project/:projectId/art/:artId/delete/boxes"
  },
  publish: {
    method: "POST",
    url: "project/:projectId/art/:artId/publish"
  },
  getPublishDetail: {
    method: "GET",
    url: "art/publish/:publishId/online"
  },
  getPublishVersions: {
    method: "GET",
    url: "art/:artId/version"
  },
  updateVersionStatus: {
    method: "PUT",
    url: "project/:projectId/art/:artId/:versionId/:action"
  },
  removeVersion: {
    method: "DELETE",
    url: "project/:projectId/art/:artId/:versionId/version"
  },
  copy: {
    method: "POST",
    url: "project/:projectId/copy/art/:artId"
  },
  saveAsTemplate: {
    method: "POST",
    url: "art/:artId/template"
  },
  getThumbnail: {
    method: "POST",
    url: "art/:artId/capture"
  }
})

context.create("io.auth", {
  login: {
    method: "POST",
    url: "login"
  },
  loginInfo: {
    method: "GET",
    url: "user/login_info"
  },
  // 退出登陆
  logout: {
    method: "POST",
    url: "logout"
  }
})
context.create("io.user", {
  update: {
    method: "put",
    url: "user"
  },
  changeWorkspace: {
    method: "PUT",
    url: "user/change_workspace"
  },
  changeLoginDefault: {
    method: "PUT",
    url: "user/change_login_default"
  },
  top: {
    method: "POST",
    url: "organization/:type/top"
  }
})
context.create("io.organization", {
  getOrganizationList: {
    method: "GET",
    url: "organization"
  },
  // 创建组织
  create: {
    method: "POST",
    url: "organization"
  },
  updateOrgById: {
    method: "PUT",
    url: "organization/:organizationId"
  },
  // 删除组织
  removeOrganization: {
    method: "DELETE",
    url: "organization/:organizationId"
  },
  // 退出
  quitOrganization: {
    method: "DELETE",
    url: "organization/:organizationId/quit"
  },
  search: {
    method: "GET",
    url: "organization/:organizationId/user/search"
  },
  getOrgMembers: {
    method: "GET",
    url: "organization/:organizationId/user"
  },
  addMembers: {
    method: "POST",
    url: "organization/:organizationId/user"
  },
  removeMember: {
    method: "DELETE",
    url: "organization/:organizationId/user/:userId"
  },
  updateMember: {
    method: "PUT",
    url: "organization/:organizationId/user/:userId/authorize"
  },
  getOrganizationInfo: {
    method: "GET",
    url: "organization/info"
  },
  updateOrganization: {
    method: "PUT",
    url: "organization"
  },
  // 更新组织信息
  update: {
    method: "PUT",
    url: "organization"
  }
})

context.create("io.material", {
  uploadMaterials: {
    url: "material",
    method: "POST"
  },
  getMaterialTypes: {
    method: "GET",
    url: "material/supported/type"
  },
  removeMaterial: {
    method: "DELETE",
    url: "material/:materialId"
  },
  updateMaterial: {
    method: "PUT",
    url: "material/:materialId"
  },
  getTypes: {
    method: "GET",
    url: "material/supported/type"
  },
  getMaterials: {
    method: "GET",
    url: "material"
  },
  createFolder: {
    method: "POST",
    url: "material/folder"
  },
  removeFolder: {
    method: "DELETE",
    url: "material/folder/:folderId"
  },
  sort: {
    method: "POST",
    url: "material/folder/:folderId/sort"
  },
  getMaterialDetail: {
    method: "GET",
    url: "material/:materialId"
  }
})

const {io} = context.api

export default io
