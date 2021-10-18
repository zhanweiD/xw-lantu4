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
  getData(type, columns = false) {
    // const {type, columns=false} = options
    if (!type) {
      const keys = this.#columns.map((item) => item.alias)
      const data = this.#data.map((row) => {
        return keys.map((key) => row[key])
      })
      if (columns) {
        return data.unshift(keys)
      } else {
        return data
      }
    }
    return this.#data
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
    if (this.#getDataType(columns) === 'Array' && columns.length === 0) {
      this.#columns = this.#dataColumns
    }
    if (this.#checkColumns(columns)) {
      // 通过校验，自定义列头即为传入的列头信息
      this.#customColumns = columns
      // 根据数据列头和自定义列头融合成真正的列头
      try {
      } catch (error) {}
    } else {
      this.error = 'setColumns-error, columns不合法，请检查'
    }
  }

  // 校验列头信息
  #checkColumns(columns) {
    try {
      const allDataType = ['Number', 'String', 'Boolean', 'Function', 'Object', 'Array', 'Undefined']
      const ketDataType = ['Number', 'String']
      if (this.#getDataType(columns) === 'Array') {
        columns.forEach((item) => {
          ;['column', 'alias'].forEach((key) => {
            if (!item[key] || ketDataType.indexOf(item[key]) === -1) {
              return false
            }
          })
          if (!item.type || allDataType.indexOf(item.type) === -1) {
            return false
          }
        })
      } else {
        return false
      }
      return true
    } catch (error) {
      return false
    }
  }

  // // 内部融合columns的方法
  // #getColumns() {
  //   try {
  //     const columnList = this.#data[0]
  //     const valueList = this.#data[1]
  //     this.#columns = columnList.map((column, i) => {
  //       return {
  //         column: column,
  //         alias: column,
  //         type: this.getDataType(valueList[i]),
  //       }
  //     })
  //   } catch (error) {
  //     this.error = error
  //   }
  // }

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
