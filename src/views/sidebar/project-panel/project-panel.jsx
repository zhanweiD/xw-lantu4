/**
 * @author 南风
 * @description 项目管理面板
 */
import React, {Children} from "react"
import {observer} from "mobx-react-lite"
import {useTranslation} from "react-i18next"
import c from "classnames"
import w from "@models"
import Tab from "@components/tab"
import Scroll from "@components/scroll"
import Icon from "@components/icon"
import Loading from "@components/loading"
import ProjectThumbnail from "./project-thumbnail"
import ProjectToolbar from "./project-toolbar"

const ProjectPanel = () => {
  const {t} = useTranslation()
  const {sidebar} = w
  const {projectPanel} = sidebar
  const {projects_, hasProject_, recentProjects_, toolbar, activeIndex} = projectPanel
  return (
    <>
      {projectPanel.state === "success" ? (
        <Tab className="w100p" sessionId="project-panel" activeIndex={activeIndex}>
          <Tab.Item name={t("projectPanel.projects")}>
            <div className={c("h100p fbv")}>
              <ProjectToolbar toolbar={toolbar} />
              <Scroll>
                {projects_.topProjects.length ? projects_.topProjects.map((project) => project && Children.toArray(<ProjectThumbnail project={project} isTop />)) : ""}

                {projects_.basicProjects.length ? projects_.basicProjects.map((project) => project && Children.toArray(<ProjectThumbnail project={project} />)) : ""}

                {!hasProject_ ? (
                  toolbar.keyword ? (
                    <div className={c("m8 emptyNote")}>
                      <div className="fbh fbjc">{`抱歉，没有找到与"${toolbar.keyword}"相关的项目`}</div>
                    </div>
                  ) : (
                    <div className="fbv fbac fbjc mt30 pt30">
                      <div className="p10 fbv fbac fs10 lh32">
                        <Icon name="logo" fill="#fff5" size={42} />
                        <div className="ctw52">项目列表还是空空的，点击下面的按钮启程</div>
                        <div className="greenButton noselect" onClick={toolbar.createProject}>
                          新建项目
                        </div>
                      </div>
                    </div>
                  )
                ) : (
                  ""
                )}
              </Scroll>
            </div>
          </Tab.Item>
          <Tab.Item name={t("projectPanel.templates")}>
            <div className="fbv fbac fbjc mt30 pt30">
              <div className="p10 fbv fbac fs10 lh32">
                <Icon name="logo" fill="#fff5" size={42} />
                <div className="ctw52">暂无官方模板</div>
              </div>
            </div>
          </Tab.Item>
          {(recentProjects_.length || toolbar.keyword) && (
            <Tab.Item name={t("projectPanel.recent")}>
              <div className={c("h100p fbv")}>
                <ProjectToolbar toolbar={toolbar} hideCreateButton />
                <Scroll>
                  {recentProjects_.map((project) => project && Children.toArray(<ProjectThumbnail project={project} isRecent />))}
                  {!recentProjects_.length ? (
                    <div className={c("m8 emptyNote")}>
                      <div className="fbh fbjc">{`抱歉，没有找到与"${toolbar.keyword}"相关的项目`}</div>
                    </div>
                  ) : (
                    ""
                  )}
                </Scroll>
              </div>
            </Tab.Item>
          )}
        </Tab>
      ) : (
        <Loading data={projectPanel.state} />
      )}
    </>
  )
}

export default observer(ProjectPanel)
