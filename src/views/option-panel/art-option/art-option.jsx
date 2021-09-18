import React from 'react'
import {observer} from 'mobx-react-lite'
import Tab from '@components/tab'
import Scroll from '@components/scroll'
import Builder, {recusiveNode} from '@builders'
import isDef from '@utils/is-def'

const ArtOption = ({art}) => {
  const {viewport} = art
  const {selectRange} = viewport
  let exhibit
  let exhibitId
  let box
  if (selectRange) {
    if (selectRange.target === 'box' && selectRange.boxes_.length === 1) {
      box = selectRange.boxes_[0]
      exhibitId = box.exhibit?.id
      if (exhibitId) {
        exhibit = box.frame_.art_.exhibitManager.get(exhibitId)
      }
    }
  }

  return (
    <Tab sessionId="art-option" className="fb1">
      {exhibit && (
        <Tab.Item name="数据呈现">
          <Scroll className="h100p">
            <Builder data={exhibit.data} dimension={exhibit.dimension} layers={exhibit.layers} exhibit={exhibit} />
          </Scroll>
        </Tab.Item>
      )}
      {exhibit && exhibit.title && (
        <Tab.Item
          name="标题"
          hasIcon={isDef(exhibit.title.effective)}
          icon={exhibit.title.effective ? 'eye-open' : 'eye-close'}
          onIconClick={(e) => {
            e.stopPropagation()
            exhibit.title.toggleEffective()
          }}
        >
          <Scroll className="h100p">
            {recusiveNode({
              sections: exhibit.title.options.sections,
              // fields: exhibit.title.fields,
              level: 0,
            })}
          </Scroll>
        </Tab.Item>
      )}
      {exhibit && exhibit.lenged && (
        <Tab.Item
          name="图例"
          hasIcon={isDef(exhibit.lenged.effective)}
          icon={exhibit.lenged.effective ? 'eye-open' : 'eye-close'}
          onIconClick={(e) => {
            e.stopPropagation()
            exhibit.lenged.toggleEffective()
          }}
        >
          <Scroll className="h100p">
            {recusiveNode({
              sections: exhibit.lenged.options.sections,
              // fields: exhibit.title.fields,
              level: 0,
            })}
          </Scroll>
        </Tab.Item>
      )}
    </Tab>
  )
}

export default observer(ArtOption)
