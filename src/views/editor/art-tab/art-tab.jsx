import React from "react"
import {observer} from "mobx-react-lite"
import ArtToolbar from "./art-toolbar"
import ArtViewport from "./art-viewport"
import PublishModal from "./art-publish-modal"

const ArtTab = ({art}) => {
  const {artToolbar} = art
  return (
    <div className="wh100p fbh">
      <ArtToolbar artToolbar={artToolbar} />
      <ArtViewport art={art} />
      <PublishModal art={art} />
    </div>
  )
}

export default observer(ArtTab)
