/* eslint-disable */
class DataFrame {
  #data
  #columns
  #customColumns
  error = ''

  constructor({source = [], columns = []}) {
    this.#data = source
    this.#columns = columns
    this.error = ''
    this.#getColumns()
  }

  get columns() {
    return this.#columns
  }

  // 获取数据
  // TODO 增加type,columns字段
  getData() {
    return this.#data
  }

  // 内部融合columns的方法
  #getColumns() {
    try {
      const columnList = this.#data[0]
      const valueList = this.#data[1]
      this.#columns = columnList.map((column, i) => {
        return {
          column: column,
          alias: column,
          type: this.getDataType(valueList[i]),
        }
      })
    } catch (error) {
      this.error = error
    }
  }

  // 加载数据
  setData(data) {
    try {
      // 判断第一层是否是数组
      if (this.#getDataType(data) === 'Array') {
        // 二维数组
        if (this.#getDataType(data[0]) === 'Array') {
        }
        // 数组对象
        if (this.#getDataType(data[0]) === 'Object') {
        }
      } else {
        this.error = 'dataFrame-setData失败，请检查传入数据是否合法'
      }
    } catch (error) {
      this.error = `dataFrame-setData失败,失败原因如下:${error}`
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
