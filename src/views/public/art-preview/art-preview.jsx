import React, {useEffect} from 'react'
import {observer} from 'mobx-react-lite'
import ArtFrame from './frame-preview'

const ArtPreview = ({art}) => {
  useEffect(() => {
    document.title = art.name
    // window.addEventListener('resize', () => {
    //   art.update()
    // })
  }, [])
  return <ArtFrame frame={art.mainFrame_} art={art} />
}

export default observer(ArtPreview)
