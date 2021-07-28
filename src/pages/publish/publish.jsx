import React, {useEffect} from "react"
import {observer} from "mobx-react-lite"
import art from "@models/art/art-preview"
import ArtPreview from "@views/public/art-preview"
import s from "./publish.module.styl"

const Publish = ({match}) => {
  const {publishId} = match.params
  useEffect(() => {
    art.getPublishArt(publishId)
  }, [publishId])
  return (
    <div className={s.publish}>
      <div className="wh100p">
        {art.fetchState === "success" && <ArtPreview art={art} />}
      </div>
    </div>
  )
}

export default observer(Publish)
