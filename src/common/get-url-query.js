import queryString from 'query-string'
import isDef from './is-def'

const getUrlQuery = key => {
  // eslint-disable-next-line no-restricted-globals
  const queries = queryString.parse(location.search)
  return isDef(key) ? queries[key] : queries
}

export default getUrlQuery
