import React from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'react-i18next'
import Tab from '@components/tab'
import Scroll from '@components/scroll'
import Builder, {recusiveNode} from '@builders'
import isDef from '@utils/is-def'
import CommonTab from './common-tab'
import InteractionTab from './interaction-tab'

const createPanel = (exhibit, t, containerInfo) => {
  if (exhibit.key === 'image') return [] // 过滤图片空容器右侧配置

  const panels = []
  exhibit.parts.forEach((prop) => {
    if (isDef(exhibit[prop])) {
      if (exhibit[prop].name === 'interaction') {
        panels.push(
          <Tab.Item key={prop} name={t(exhibit[prop].name)}>
            <Scroll className="h100p">
              <InteractionTab exhibit={exhibit} containerInfo={containerInfo} />
            </Scroll>
          </Tab.Item>
        )
      } else {
        panels.push(
          <Tab.Item
            key={prop}
            name={t(exhibit[prop].name)}
            hasIcon={isDef(exhibit[prop].effective)}
            icon={exhibit[prop].effective ? 'eye-open' : 'eye-close'}
            onIconClick={(e) => {
              e.stopPropagation()
              exhibit[prop].toggleEffective()
            }}
          >
            <Scroll className="h100p">
              {recusiveNode({
                ...exhibit[prop].options,
                level: 0,
              })}
            </Scroll>
          </Tab.Item>
        )
      }
    }
  })
  return [
    <Tab.Item name={t('dataEncode')} key="data">
      <Scroll className="h100p">
        <Builder
          gisBase={exhibit.gisBase}
          data={exhibit.data}
          dimension={exhibit.dimension}
          layers={exhibit.layers}
          exhibit={exhibit}
        />
      </Scroll>
    </Tab.Item>,
  ].concat(...panels)
}

const ArtOption = ({art}) => {
  const {t} = useTranslation()
  const {viewport} = art
  const {selectRange} = viewport
  let exhibit
  let exhibitId
  let box
  let frame
  if (selectRange) {
    if (selectRange.target === 'frame') {
      frame = viewport.frames.find((o) => o.frameId === selectRange.range[0].frameId)
    } else if (selectRange.target === 'box' && selectRange.boxes_.length === 1) {
      box = selectRange.boxes_[0]
      exhibitId = box.exhibit?.id
      if (exhibitId) {
        exhibit = box.frame_.art_.exhibitManager.get(exhibitId)
      }
    }
    const containerInfo = box || frame
    // 配置面板
    return (
      <>
        <Tab sessionId="art-option" className="fb1">
          {exhibit && createPanel(exhibit, t, containerInfo)}
        </Tab>
        <CommonTab target={containerInfo} />
      </>
    )
  }
  return (
    <>
      <span className="m8">全局配置</span>
      <Scroll className="h100p">
        {recusiveNode({
          ...art.global.options,
          level: 0,
        })}
      </Scroll>
    </>
  )
}

export default observer(ArtOption)
