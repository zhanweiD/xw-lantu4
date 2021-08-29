import React from "react"
import {observer} from "mobx-react-lite"
import Tab from "@components/tab"
import Scroll from "@components/scroll"
import SectionFields from "@components/section-fields"

const ArtOption = ({art}) => {
  const {viewport} = art
  const {selectRange} = viewport
  let exhibit
  let exhibitId
  let box
  if (selectRange) {
    if (selectRange.target === "box" && selectRange.boxes_.length === 1) {
      box = selectRange.boxes_[0]
      exhibitId = box.exhibit.id
      exhibit = box.frame_.art_.exhibitManager.get(exhibitId)
    }
  }
  return (
    <Tab sessionId="material-option" className="fb1">
      <Tab.Item name="数据呈现">
        <Scroll className="h100p">{exhibit && <SectionFields model={exhibit.style} />}</Scroll>
      </Tab.Item>
    </Tab>
  )
}

export default observer(ArtOption)
