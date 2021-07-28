// 全局数据-sql视图层
import React from "react"
import {observer} from "mobx-react-lite"
import SectionFields from "@components/section-fields"
import Scroll from "@components/scroll"

const SqlData = ({data}) => {
  const {database} = data
  return (
    <Scroll className="h100p">
      {() => (
        <>
          <SectionFields model={database.codeOptions} hasPadding={false} />
        </>
      )}
    </Scroll>
  )
}

export default observer(SqlData)
