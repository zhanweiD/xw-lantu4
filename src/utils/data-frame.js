class DataFrame {
  // _data

  constructor({source, columns}) {
    this._data = source
    this._columns = columns
  }

  getData() {
    return this._data
  }
}

export default DataFrame
