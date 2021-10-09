class DataFrame {
  // _data
  // _columns
  // error

  constructor({source, columns}) {
    this._data = source
    this._columns = columns
    this.error = ''
    this._getColumns()
  }

  getData() {
    return this._data
  }

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

  get columns() {
    return this._columns
  }

  // get error() {
  //   return this.error
  // }
}

export default DataFrame
