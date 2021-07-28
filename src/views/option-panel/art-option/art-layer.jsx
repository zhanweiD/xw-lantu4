import React, {Children} from "react"
import {observer} from "mobx-react-lite"

import Section from "@components/section"

const ArtLayer = ({frame}) => {
  const {boxes} = frame

  return (
    <>
      <Section id={`frame-${frame.name}`} name={frame.name}>
        {boxes.map((box) => Children.toArray(<div>{box.name}</div>))}
      </Section>
    </>
  )
}
export default observer(ArtLayer)
