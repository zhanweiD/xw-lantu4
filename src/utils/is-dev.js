import getUrlQuery from "./get-url-query"

const isDev = getUrlQuery("dev") === "1" || import.meta.env.DEV

export default isDev
