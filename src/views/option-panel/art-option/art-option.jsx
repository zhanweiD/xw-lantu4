import React from "react"
import {observer} from "mobx-react-lite"
import Tab from "@components/tab"
// import Section from "@components/section"
import Scroll from "@components/scroll"
import SectionFields from "@components/section-fields"
import {createConfigModelClass} from "@components/field"

const MModel = createConfigModelClass("MModel", {
  sections: ["__hide__"],
  fields: [
    {
      section: "__hide__",
      option: "data",
      field: {
        type: "data"
      }
    }
  ]
})
const model = MModel.create({})
const MaterialOption = () => {
  return (
    <Tab sessionId="material-option" className="fb1">
      <Tab.Item name="数据呈现">
        <Scroll className="h100p">
          <SectionFields model={model} />
        </Scroll>
      </Tab.Item>
    </Tab>
  )
}

export default observer(MaterialOption)
