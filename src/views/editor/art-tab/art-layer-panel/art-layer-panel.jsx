import React from 'react'
import {observer} from 'mobx-react-lite'
import c from 'classnames'
import IconButton from '@components/icon-button'
import Scroll from '@components/scroll'
import LayerList from './layer-list'
import s from './art-layer-panel.module.styl'

let selectFrame
const ArtLayerPanel = ({art}) => {
  const {
    isLayerPanelVisible,
    viewport,
    viewport: {frames, selectRange},
  } = art
  if (selectRange) {
    if (selectRange.range[0].frameId) {
      selectFrame = frames.find((item) => item.frameId === selectRange.range[0].frameId)
    }
  } else if (!selectFrame) {
    selectFrame = frames[0]
  }
  // console.log(selectFrame)
  // if (!selectFrame) return
  // console.log(selectFrame)
  const {groups = [], layerTreeList_ = []} = selectFrame

  return (
    <div className={c('h100p fbv', s.artLayerPanel, !isLayerPanelVisible && s.hidden)}>
      <div className={s.toolbarButton}>
        <IconButton icon="arrow-left" title="收起图层面板" layout="start" onClick={art.toggleLayerVisible} />
      </div>
      <Scroll>
        {layerTreeList_.map((item) => (
          <LayerList
            key={item.groupIds?.[0] || item?.boxes?.[0]?.boxId}
            layer={item}
            groups={groups}
            viewport={viewport}
            selectRange={selectRange}
            selectFrame={selectFrame}
          />
        ))}
      </Scroll>
    </div>
  )
}

export default observer(ArtLayerPanel)
