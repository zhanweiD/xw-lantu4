import React, {useEffect} from "react"
import {observer} from "mobx-react-lite"
import art from "@models/art/art-preview"
import ArtPreview from "@views/public/art-preview"
import s from "./preview.module.styl"

const Preview = ({match}) => {
  const {artId} = match.params
  useEffect(() => {
    art.getArt(artId)
  }, [artId])
  return (
    <div className={s.preview}>
      <div className="wh100p">{art.fetchState === "success" && <ArtPreview art={art} />}</div>
    </div>
  )
}

export default observer(Preview)
