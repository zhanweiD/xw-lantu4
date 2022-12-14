/**
 * @author 南风
 * @description 项目详情
 */
import React from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'react-i18next'
import c from 'classnames'
import Section from '@builders/section'
// import DataTable from '@components/data-table'
import {TextField, TextareaField} from '@components/field'
import s from './project-detail-tab.module.styl'

const ProjectDetailTab = ({project}) => {
  const {t} = useTranslation()
  return (
    <div className={c('fbh fbac fbjc')}>
      <scroll className="wh100p">
        <Section props={project.section} childrenClassName="pt8 pb8" name="基础信息">
          <div className="fbh">
            <div className="fb1">
              <TextField
                label={t('name')}
                value={project.name}
                onChange={(value) => project.set('name', value)}
                onBlur={project.update}
              />
              <TextareaField
                label={t('description')}
                value={project.description}
                onChange={(value) => project.set('description', value)}
                onBlur={project.update}
              />
            </div>
            <div className="fb2" />
          </div>
        </Section>

        {/* TODO 成员管理 */}
        {/* <Section
          props={project.section}
          name="成员管理"
          childrenClassName="pt8 pb8"
          icon={<IconButton icon="add" onClick={project.addMemberConfirm} />}
        >
          <ProjectMember project={project} />
        </Section> */}

        <Section props={project.section} name="危险操作" childrenClassName="pt8 pb8" tipColor="#fa0">
          <div className="fbh">
            <div className="fb1">
              <div className="fbh mb8">
                <div className="fb1">删除项目</div>
                <div>当前项目包含 {project.arts.length} 块数据屏</div>
              </div>
              <div className={c('p8 mb8', s.removeProjectNote)}>
                删除项目会同时删除项目中包含的所有数据屏、成员信息和数据信息，且删除后不可恢复。删除前请考虑是否需要备份项目。
              </div>
              <div className={s.removeProjectButton} onClick={project.removeConfirm}>
                删除项目
              </div>
            </div>
            <div className="fb2" />
          </div>
        </Section>
      </scroll>
    </div>
  )
}

export default observer(ProjectDetailTab)
