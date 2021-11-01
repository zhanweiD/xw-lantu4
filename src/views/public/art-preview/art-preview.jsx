import React, {useEffect} from 'react'
import {observer} from 'mobx-react-lite'
import ArtFrame from './frame-preview'

const ArtPreview = ({art}) => {
  useEffect(() => {
    document.title = art.name
    window.addEventListener('resize', () => {
      art.update()
    })
  }, [])
  useEffect(() => {
    // 将整个art缩放到可视区域之内
    if (art.global.options.sections.other.fields.screenAdaption) {
    } else {
      art.initZoom()
    }
  }, [art.artId])

  return (
    <>
      <div
        id={`art-viewport-${art.artId}`}
        style={{
          width: `${art.totalWidth}px`,
          height: `${art.totalHeight}px`,
        }}
      >
        <ArtFrame frame={art.mainFrame_} art={art} />
      </div>
    </>
  )
}

export default observer(ArtPreview)
