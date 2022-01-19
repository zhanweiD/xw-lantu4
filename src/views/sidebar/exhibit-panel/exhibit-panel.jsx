import React, {Children} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'react-i18next'
import c from 'classnames'
import w from '@models'
import Tab from '@components/tab'
import Section from '@builders/section'
import Caption from '@components/caption'
import Scroll from '@components/scroll'
import Grid from '@components/grid'
import {DragSource} from '@components/drag-and-drop'
import Icon from '@components/icon'
import s from './exhibit-panel.module.styl'

const Category = ({category}) => {
  const {t} = useTranslation()
  const {name, exhibits} = category
  console.log('ccc', `${t(`exhibit.${name}`)} (${exhibits.length})`)
  console.dir(category)
  return (
    <Section
      id={`category-${category.name}`}
      sessionId={`category-${category.name}`}
      childrenClassName=""
      name={`${t(`exhibit.${name}`)} (${exhibits.length})`}
    >
      <Grid column={4}>
        {exhibits.map((exhibit) => (
          <Grid.Item key={exhibit.key}>
            <Caption content={t(exhibit.name)}>
              <div className="fbv fbac fbjc" content={t(exhibit.name)}>
                <DragSource
                  key={exhibit.key}
                  onEnd={(dropResult, data, position) => {
                    w.env_.event.fire('editor.setProps', {isPointerEventsNone: false})
                    dropResult.create({
                      lib: data.lib,
                      key: data.key,
                      type: data.type,
                      position,
                    })
                  }}
                  onBegin={() => {
                    w.env_.event.fire('editor.setProps', {isPointerEventsNone: true})
                  }}
                  dragKey="CREATE_EXHIBIT_DRAG_KEY"
                  data={exhibit}
                >
                  {exhibit.icon ? <Icon name={exhibit.icon} fill="white" size={40} /> : t(exhibit.name)}
                </DragSource>
              </div>
            </Caption>
          </Grid.Item>
        ))}
      </Grid>
    </Section>
  )
}

const ExhibitPanel = () => {
  const {t} = useTranslation()
  const {exhibitPanel} = w.sidebar
  const {categories, categoriesEcharts} = exhibitPanel

  const TabItemContent = (cate) => (
    <div className="fbh h100p">
      {/* 临时隐藏掉 */}
      <div className="pb8 hide">
        {Object.entries(cate).map(([id, category]) => (
          <Caption content={t(`exhibit.${category.name}`)} key={id}>
            <div
              onClick={() => {
                scrollToFn(`#category-${category.name}`)
              }}
              className={c('hand fbv fbac fbjc', s.naviIcon)}
            >
              {category.icon ? (
                <Icon name={category.icon} fill="white" size={16} />
              ) : (
                t(`exhibit.${category.name}`).substring(0, 1)
              )}
            </div>
          </Caption>
        ))}
      </div>
      <Scroll className="fb1 pb8">
        {({scrollTo}) => {
          scrollToFn = scrollTo
          return cate.map((category) => Children.toArray(<Category category={category} />))
        }}
      </Scroll>
    </div>
  )
  let scrollToFn
  return (
    <>
      <Tab sessionId="exhibit-panel" className="fb1">
        <Tab.Item name={t('exhibitPanel.official')}>{TabItemContent(categories)}</Tab.Item>
        <Tab.Item name={t('exhibitPanel.echarts')}>{TabItemContent(categoriesEcharts)}</Tab.Item>
      </Tab>
    </>
  )
}

export default observer(ExhibitPanel)
