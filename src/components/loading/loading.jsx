import React, {Children} from "react"
import {observer} from "mobx-react-lite"
import {useTranslation} from "react-i18next"
import s from "./loading.module.styl"

// Loading组件
const Loading = ({data, retry = () => {}, children}) => {
  const {t} = useTranslation()

  const Load = () => {
    return (
      <div className={s.swing}>
        <div className={s.swingLeft} />
        {new Array(5).fill(<div />).map((value) => Children.toArray(value))}
        <div className={s.swingRight} />
      </div>
    )
  }

  const LoadError = () => {
    return (
      <div className={s.container}>
        <div>{t("loading.error")}</div>
        <div className={s.loadingButton} onClick={retry}>
          {t("loading.retry")}
        </div>
      </div>
    )
  }

  switch (data) {
    case "loading": {
      return (
        <div className="fbh fbac fbjc wh100p">
          <Load />
        </div>
      )
    }
    case "success": {
      return children
    }
    case "error": {
      return (
        <div className="fbh fbac fbjc wh100p">
          <LoadError />
        </div>
      )
    }
    default: {
      return children
    }
  }
}

export default observer(Loading)
