import React from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'react-i18next'
import c from 'classnames'
import w from '@models'
import Tab from '@components/tab'
import Scroll from '@components/scroll'
import Icon from '@components/icon'
import Loading from '@components/loading'
import {ProjectList, TemplateList} from './project-list'
import ProjectToolbar from './project-toolbar'

// 项目面板无项目时的 UI
const ProjectFallback = ({keyword, set}) =>
  keyword ? (
    <div className={c('m8 emptyNote')}>
      <div className="fbh fbjc">{`抱歉，没有找到与"${keyword}"相关的内容`}</div>
    </div>
  ) : (
    <div className="fbv fbac fbjc mt30 pt30">
      <div className="p10 fbv fbac fs10 lh32">
        <Icon name="logo" fill="#fff5" size={42} />
        <div className="ctw52">项目列表还是空空的，点击下面的按钮启程</div>
        <div className="greenButton noselect" onClick={() => set('isCreateModalVisible', true)}>
          创建项目
        </div>
      </div>
    </div>
  )

// 项目下无数据屏时的 UI
const ProjectListFallback = ({project}) =>
  !project.arts_.length && (
    <div className={c('ml8 mr8 mb8 emptyNote')}>
      项目内还没有创建数据屏，点击
      <span className="ctSecend hand" onClick={project.createArt}>
        创建
      </span>
    </div>
  )

// 项目面板无模板时的 UI
const TemplateFallback = () => (
  <div className="p10 fbv fbac fs10 lh32">
    <Icon name="logo" fill="#fff5" size={42} />
    <div className="ctw52">模板列表还是空空的</div>
  </div>
)

const ProjectPanel = () => {
  const {t} = useTranslation()
  const {sidebar} = w
  const {projectPanel} = sidebar
  const {projects_, recentProjects_, templates_, keyword, activeIndex, set} = projectPanel
  const {topProjects, basicProjects} = projects_
  return (
    <Loading data={projectPanel.state}>
      <Tab className="w100p" sessionId="project-panel" activeIndex={activeIndex}>
        <Tab.Item name={t('projectPanel.projects')}>
          <div className={c('h100p fbv')}>
            <ProjectToolbar useCreateButton />
            <Scroll>
              {topProjects.map((project) => (
                <ProjectList key={project.projectId} project={project} isTop>
                  <ProjectListFallback project={project} />
                </ProjectList>
              ))}
              {basicProjects.map((project) => (
                <ProjectList key={project.projectId} project={project}>
                  <ProjectListFallback project={project} />
                </ProjectList>
              ))}
              {!topProjects.length && !basicProjects.length && <ProjectFallback keyword={keyword} set={set} />}
            </Scroll>
          </div>
        </Tab.Item>
        <Tab.Item name={t('projectPanel.templates')}>
          <div className={c('h100p fbv')}>
            <ProjectToolbar />
            <Scroll>
              <TemplateList id="official-template" name="官方模板" arts={[]} isTemplate>
                <TemplateFallback />
              </TemplateList>
              <TemplateList id="user-template" name="自定义模板" arts={templates_} isTemplate>
                {!templates_.length && <TemplateFallback />}
              </TemplateList>
            </Scroll>
          </div>
        </Tab.Item>
        {(recentProjects_.length || (!recentProjects_.length && keyword)) && (
          <Tab.Item name={t('projectPanel.recent')}>
            <div className={c('h100p fbv')}>
              <ProjectToolbar />
              <Scroll>
                {recentProjects_.map((project) => (
                  <ProjectList key={project.projectId} project={project} isRecent>
                    <ProjectListFallback project={project} />
                  </ProjectList>
                ))}
              </Scroll>
            </div>
          </Tab.Item>
        )}
      </Tab>
    </Loading>
  )
}

export default observer(ProjectPanel)
