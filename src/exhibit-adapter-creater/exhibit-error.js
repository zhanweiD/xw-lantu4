const errorMap = {
  DATA_PARSE_ERROR: {
    text: "数据(JSON)解析错误",
    onClick: ({data, error}) => {
      console.warn(
        "Origin stringify JSON data has syntax error, check it below:"
      )
      console.log(data)
      console.log(error)
    }
  },
  JSON_NOT_SELECTED: {
    text: "未选择JSON数据",
    onClick: ({error}) => {
      console.log(error)
    }
  },
  JSON_FETCH_ERROR: {
    text: "JSON数据获取失败",
    onClick: ({error}) => {
      console.warn("JSON data fetch error, check it below:")
      console.log(error)
    }
  },
  DATA_PROCESS_ERROR: {
    text: "数据处理函数错误",
    onClick: ({error}) => {
      console.warn("Data processing error, check it below:")
      console.log(error)
    }
  },
  EXHIBIT_DATA_HOOK_ERROR: {
    text: "组件适配层数据方法执行异常",
    onClick: ({data, error}) => {
      console.warn("Error catched in exhibit data hook, check it below:")
      console.log(data)
      console.log(error)
    }
  },
  EXHIBIT_DRAW_HOOK_ERROR: {
    text: "组件适配层渲染方法执行异常",
    onClick: ({data, error}) => {
      console.warn("Error catched in exhibit draw hook, check it below:")
      console.log(data)
      console.log(error)
    }
  },
  EXHIBIT_DATA_STRUCTURE_ERROR: {
    text: "组件数据结构错误",
    onClick: ({data, error}) => {
      console.warn("data transform to bad data error, check it below:")
      console.log(data)
      console.log(error)
    }
  },
  API_CONFIG_MISSING: {
    text: "API配置不完整",
    onClick: ({error}) => {
      console.warn("Some of api configs is missing, check it below:")
      console.log(error)
    }
  },
  API_NOT_SELECT: {
    text: "未选择API数据",
    onClick: ({error}) => {
      console.log(error)
    }
  },
  API_GET_FAILED: {
    text: "API可用接口获取异常",
    onClick: ({error}) => {
      console.warn("Api fetch error, check it below:")
      console.log(error)
    }
  },
  API_FETCH_FAILED: {
    text: "API接口调用异常",
    onClick: ({error}) => {
      console.warn("Api fetch error, check it below:")
      console.log(error)
    }
  },
  API_QUERIES_PROCESS_ERROR: {
    text: "API请求参数解析失败",
    onClick: ({error}) => {
      console.warn("Api queries failed to parse,  check it below:")
      console.dir(error)
    }
  },
  API_HEADERS_PROCESS_ERROR: {
    text: "API请求头解析失败",
    onClick: ({error}) => {
      console.warn("Api headers failed to parse,  check it below:")
      console.log(error)
    }
  },
  API_BODY_PROCESS_ERROR: {
    text: "API请求体解析失败",
    onClick: ({error}) => {
      console.warn("Api body failed to parse,  check it below:")
      console.log(error)
    }
  },
  DATA_FETCH_RESPONSE_ERROR: {
    text: "数据请求返回出错",
    onClick: ({data, error}) => {
      console.warn("Api fetch error, check it below:")
      console.log(data)
      console.log(error)
    }
  },
  LOOP_QUERIES_ERROR: {
    text: "轮询参数解析异常",
    onClick: ({error}) => {
      console.warn("Some of loop queries is missing,  check it below:")
      console.log(error)
    }
  },
  EXCEL_NOT_SELECTED: {
    text: "未选择Excel文件",
    onClick: ({error}) => {
      console.log(error)
    }
  },
  EXCEL_FIELD_ERROR: {
    text: "获取文件详情失败",
    onClick: ({error}) => {
      console.warn(
        "The api which to get the Excel list has some error,  check it below:"
      )
      console.log(error)
    }
  },
  EXCEL_FIELDS_NOT_SELECTED: {
    text: "未选择数据字段",
    onClick: ({error}) => {
      console.log(error)
    }
  },
  TABLE_NOT_SELECTED: {
    text: "未选择数据表",
    onClick: ({error}) => {
      console.log(error)
    }
  },
  SQL_SELECT_ERROR: {
    text: "SQL查询出错",
    onClick: ({error}) => {
      console.warn("Sql select error,  check it below:")
      console.log(error)
    }
  },
  DATA_MAPPING_CONFIG_MISSING: {
    text: "数据映射配置出错",
    onClick: ({error}) => {
      console.warn("Mapping config has error,  check it below:")
      console.log(error)
    }
  }
}
export default errorMap
