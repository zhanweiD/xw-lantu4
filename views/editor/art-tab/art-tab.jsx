import React from 'react'
import {observer} from 'mobx-react-lite'
import ArtToolbar from './art-toolbar'
import ArtLayerPanel from './art-layer-panel'
import ArtViewport from './art-viewport'
import PublishModal from './art-publish-modal'
import VersionModal from './art-version-modal'

const ArtTab = ({art}) => {
  return (
    <div className="wh100p fbh">
      <ArtToolbar art={art} />
      <ArtLayerPanel art={art} />
      <ArtViewport art={art} />
      <PublishModal art={art} />
      <VersionModal art={art} />
    </div>
  )
}

export default observer(ArtTab)
