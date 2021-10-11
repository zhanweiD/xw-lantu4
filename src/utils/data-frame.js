class DataFrame {
  // _data
  // _columns
  // error

  constructor({source = [], columns = []}) {
    this._data = source
    this._columns = columns
    this.error = ''
    this._getColumns()
  }

  get columns() {
    return this._columns
  }

  // 获取数据
  // TODO 增加type,columns字段
  getData() {
    return this._data
  }

  // 内部融合columns的方法
  _getColumns() {
    try {
      const columnList = this._data[0]
      const valueList = this._data[1]
      this._columns = columnList.map((column, i) => {
        return {
          column: column,
          alias: column,
          type: this._getDataType(valueList[i]),
        }
      })
    } catch (error) {
      this.error = error
    }
  }

  // 获取数据类型
  _getDataType(value) {
    switch (typeof value) {
      case 'string':
        return 'String'
      case 'number':
        return 'Number'
      case 'object':
        return 'Object'
      default:
        return 'undefined'
    }
  }

  // get error() {
  //   return this.error
  // }
}

export default DataFrame
