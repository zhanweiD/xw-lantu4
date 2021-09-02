import React from "react"
import {observer} from "mobx-react-lite"
import Tab from "@components/tab"
import Scroll from "@components/scroll"
// import SectionFields from "@components/section-fields"
import Builder from "../../../builders/builder"

const DATA = [
  // --------------------
  // 地理坐标section
  // --------------------
  {
    name: "coordinate",
    sections: [
      {
        name: "rectCoordinate"
        // fields: [
        //   {
        //     name: "lang",
        //     defaultValue: 0
        //   }
        // ]
      }
    ]
  },
  // -------------------
  // 标签section
  // --------------------
  {
    name: "label",
    // 如果有effective属性，且值为布尔，则该section可以整体切换是否生效
    effective: false,
    sections: [
      {
        name: "text",
        fields: [
          {
            name: "color1",
            defaultValue: "#fff"
          },
          {
            name: "textSize",
            defaultValue: 10
          }
        ]
      }
    ]
  }
]

const ArtOption = ({art}) => {
  // const {viewport} = art
  // const {selectRange} = viewport
  // let exhibit
  // let exhibitId
  // let box
  // if (selectRange) {
  //   if (selectRange.target === "box" && selectRange.boxes_.length === 1) {
  //     box = selectRange.boxes_[0]
  //     exhibitId = box.exhibit?.id
  //     if (exhibitId) {
  //       exhibit = box.frame_.art_.exhibitManager.get(exhibitId)
  //     }
  //   }
  // }
  console.log(art)
  return (
    <Tab sessionId="material-option" className="fb1">
      <Tab.Item name="数据呈现">
        <Scroll className="h100p">
          <Builder sections={DATA} />
        </Scroll>
        {/* <Scroll className="h100p">{exhibit && <SectionFields model={exhibit.style} />}</Scroll> */}
      </Tab.Item>
    </Tab>
  )
}

export default observer(ArtOption)
