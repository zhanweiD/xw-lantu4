import React from "react"
import {observer} from "mobx-react-lite"
import SectionFields from "@components/section-fields"
import Scroll from "@components/scroll"

const ApiData = ({data}) => {
  const {api} = data
  return (
    <Scroll className="h100p">
      <SectionFields
        onChange={(options) => {
          api.onOptionsChange(options)
        }}
        model={api.codeOptions}
        hasPadding={false}
      />
    </Scroll>
  )
}

export default observer(ApiData)
