import React from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'react-i18next'
import Tab from '@components/tab'
import Scroll from '@components/scroll'
import Builder, {recusiveNode} from '@builders'
import isDef from '@utils/is-def'
import CommonTab from './common-tab'

const createPanel = (exhibit, t) => {
  const panels = []
  exhibit.parts.forEach((prop) => {
    if (isDef(exhibit[prop])) {
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
  })

  return [
    <Tab.Item name="数据呈现" key="data">
      <Scroll className="h100p">
        <Builder data={exhibit.data} dimension={exhibit.dimension} layers={exhibit.layers} exhibit={exhibit} />
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
  }

  return (
    <>
      <Tab sessionId="art-option" className="fb1">
        {exhibit && createPanel(exhibit, t)}
      </Tab>
      <CommonTab box={box} frame={frame} />
    </>
  )
}

export default observer(ArtOption)
