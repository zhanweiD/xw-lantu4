/* eslint-disable */
class DataFrame {
  #data
  #columns
  #customColumns
  #dataColumns
  error = ''

  constructor({source = [], columns = []}) {
    this.setData(source)
    this.setColumns(columns)
    this.error = ''
  }

  get columns() {
    return this.#columns
  }

  // 获取数据
  getData(options) {
    const {type, columns = true} = options || {}
    const keys = this.#columns.map((item) => item.column)
    switch (type) {
      case 'dict': {
        return this.#data
      }
      case 'column': {
        const data = keys.map((key) => {
          return this.#data.map((row) => row[key])
        })
        if (columns) {
          return data.map((d, i) => [keys[i], ...d])
        } else {
          return data
        }
      }
      case 'keyValue': {
        const data = {}
        keys.forEach((key) => {
          data[key] = this.#data.map((row) => row[key])
        })
        return data
      }
      default: {
        const data = this.#data.map((row) => {
          return keys.map((key) => row[key])
        })
        if (columns) {
          return [this.#columns.map((item) => item.alias), ...data]
        } else {
          return data
        }
      }
    }
  }

  // 赋值数据
  setData(data) {
    let tempColumns = []
    let tempData = []
    try {
      // 判断第一层是否是数组
      if (this.#getDataType(data) === 'Array') {
        // 二维数组，将其打成数组对象，储存进#data [[],[]]
        if (this.#getDataType(data[0]) === 'Array') {
          const keys = data[0]
          for (let i = 1; i < data.length; i += 1) {
            const tempObject = {}
            keys.forEach((key, index) => {
              tempObject[key] = data[i][index]
            })
            tempData.push(tempObject)
          }
        } else if (this.#getDataType(data[0]) === 'Object') {
          tempData = data
        } else {
          this.error = 'dataFrame-setData失败，请检查传入数据是否合法'
          return
        }
        // 根据传入的数据解析出来的列头信息
        tempColumns = Object.keys(tempData[0]).map((key) => {
          return {
            column: key,
            alias: key,
            type: this.#getDataType(tempData[0][key]),
          }
        })
        this.#data = tempData
        this.#dataColumns = tempColumns
        this.#mergeColumns()
      } else {
        this.error = 'dataFrame-setData失败，请检查传入数据是否合法'
        tempColumns = []
      }
    } catch (error) {
      this.error = `dataFrame-setData失败,失败原因如下:${error}`
    }
  }

  // 设置列头
  setColumns(columns) {
    if (this.#checkColumns(columns)) {
      // 通过校验，自定义列头即为传入的列头信息
      this.#customColumns = columns.map(({column, alias, type}) => ({
        column: column.toString(),
        alias: alias.toString(),
        type,
      }))
      // 根据数据列头和自定义列头融合成真正的列头
    }
    this.#mergeColumns()
  }

  // 强制校验数据类型

  // 校验列头信息
  #checkColumns(columns) {
    try {
      const allDataType = ['Number', 'String', 'Boolean', 'Function', 'Object', 'Array', 'Undefined']
      const columnDataType = ['Number', 'String']
      if (this.#getDataType(columns) === 'Array') {
        // 位图排序
        const flagArray = {}
        columns.forEach((item) => {
          // 校验字段
          ;['column', 'alias'].forEach((key) => {
            if (!item[key] || columnDataType.indexOf(this.#getDataType(item[key])) === -1) {
              throw new Error('column,alias字段校验失败')
            }
          })
          if (!item.type || allDataType.indexOf(item.type) === -1) {
            throw new Error('type字段校验失败')
          }

          // alias是否重复
          if (flagArray[item.alias]) {
            throw new Error('alias字段重复')
          } else {
            flagArray[item.alias] = true
          }
        })
      } else {
        throw new Error('columns格式错误')
      }
      return true
    } catch (error) {
      this.error = error
      return false
    }
  }

  // 融合表头
  #mergeColumns() {
    try {
      this.#columns = this.#dataColumns.map((dataColumns) => {
        const realColumns = this.#customColumns.find((customColumns) => customColumns.column === dataColumns.column)
        if (realColumns) {
          return realColumns
        } else {
          return dataColumns
        }
      })
    } catch (error) {
      this.error = `dataFrame-mergeColumns失败,失败原因如下:${error}`
    }
  }

  // 获取数据类型
  #getDataType(value) {
    const str = Object.prototype.toString.call(value).split(' ')[1]
    const dataType = str.substr(0, str.length - 1)

    // 其他按照正常的类型进行判断
    switch (dataType) {
      case 'String':
        return 'String'
      case 'Number':
        return 'Number'
      case 'Boolean':
        return 'Boolean'
      case 'Function':
        return 'Function'
      case 'Object':
        return 'Object'
      case 'Array':
        return 'Array'
      // case ('Null' || 'Undefined'):
      //   return 'Undefined'
      default:
        return 'Undefined'
    }
  }
}

export default DataFrame
