import React, {useEffect} from 'react'
import {observer} from 'mobx-react-lite'
import ArtFrame from './frame-preview'

const ArtPreview = ({art}) => {
  return <ArtFrame frame={art.mainFrame_} art={art} />
}

export default observer(ArtPreview)
