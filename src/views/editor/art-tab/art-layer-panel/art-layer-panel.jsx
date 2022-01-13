import React, {useState, useEffect} from 'react'
import {observer} from 'mobx-react-lite'
import c from 'classnames'
// import w from '@models'
import IconButton from '@components/icon-button'
import Scroll from '@components/scroll'
import LayerList from './layer-list'
import s from './art-layer-panel.module.styl'

const ArtLayerPanel = ({art}) => {
  const {
    isLayerPanelVisible,
    viewport: {frames, selectRange},
  } = art

  const [selectFrame, setSelectFrame] = useState(frames[0])

  useEffect(() => {
    // if (selectRange?.target === 'frame') {
    //   console.log(toJS(selectRange))
    //   const frame = frames.find(item => item.frameId === selectRange.range[0].frameId)
    //   setSelectFrame(frame || {})
    // } else {
    //   setSelectFrame(frames[0])
    // }
    console.log(111)
    if (!selectRange) return
    const frame = frames.find((item) => item.frameId === selectRange.range[0].frameId)
    setSelectFrame(frame || {})
  }, [selectRange?.range[0]?.frameId])
  return (
    <div className={c('h100p fbv', s.artLayerPanel, !isLayerPanelVisible && s.hidden)}>
      {/* <LayerToolbar /> */}
      <IconButton
        icon="arrow-left"
        title="收起图层面板"
        layout="start"
        className={c(s.toolbarButton)}
        onClick={() => {
          art.set({
            isLayerPanelVisible: false,
          })
        }}
      />
      <Scroll>
        {selectFrame?.boxes?.map((layer, index) => (
          <LayerList key={layer.boxId} layer={layer} index={index} />
        ))}
      </Scroll>
    </div>
  )
}

export default observer(ArtLayerPanel)
