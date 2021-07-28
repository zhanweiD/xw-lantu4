import React from "react"
import {observer} from "mobx-react-lite"
import {useTranslation} from "react-i18next"
import c from "classnames"
import IconButton from "@components/icon-button"
import s from "./project-toolbar.module.styl"

const Toolbar = ({toolbar, hideCreateButton = false}) => {
  const {t} = useTranslation()
  const {keyword, set, searchProjects, createProject, root_} = toolbar
  return (
    <div className={c("fbh fbac cfw2 pl8", s.toolbar)}>
      <div className="fb1">
        <input
          type="text"
          value={keyword}
          placeholder={t("searchPlaceholder")}
          onChange={(e) => {
            set("keyword", e.target.value)
          }}
          onBlur={() => !keyword && searchProjects()}
          onKeyDown={(e) => e.key === "Enter" && searchProjects()}
        />
      </div>

      {keyword ? (
        <IconButton
          icon="close"
          title={t("remove")}
          onClick={() => {
            set("keyword", "")
            searchProjects()
          }}
        />
      ) : (
        ""
      )}

      <IconButton
        icon="search"
        className="cfw6"
        title={t("search")}
        onClick={searchProjects}
      />
      <IconButton
        icon={toolbar.isThumbnailVisible ? "list" : "thumbnail-list"}
        title="显示切换"
        className="cfw10"
        onClick={toolbar.toggleThumbnailVisible}
      />
      {!hideCreateButton && root_.hasPermission("project.create") && (
        <IconButton
          icon="create-project"
          className="cfw10"
          title={t("projectPanel.createProject")}
          onClick={createProject}
        />
      )}
    </div>
  )
}

export default observer(Toolbar)
