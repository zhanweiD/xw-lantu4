import getUrlQuery from "./get-url-query"

const isDev = getUrlQuery("dev") === "1"

export default isDev
