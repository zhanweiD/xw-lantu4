import React from "react"
import {useTranslation} from "react-i18next"

const Main = () => {
  const {t} = useTranslation()
  return <div>{t("description.description")}</div>
}

export default Main
