import io from './io'

const sdk = {
  io: {
    proxy(options) {
      const {url, method = 'GET', body = {}, headers = {}, queries = {}} = options

      return io.sdk.proxy({
        url,
        method,
        body,
        headers,
        queries,
      })
    },
    getJSON(id) {
      return io.data.getDetail({
        ':dataId': id,
        type: 1,
      })
    },
    getGeoJSON(id) {
      return io.data.getDetail({
        ':dataId': id,
        type: 4,
      })
    },
  },
}

export default sdk
