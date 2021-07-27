import React from "react"
import {observer} from "mobx-react-lite"
import Overlay from "@components/overlay"
import SectionFields from "../section-fields"
import s from "./data-processor.module.styl"

// 布局配置面板
const DataProcessorLayer = ({model}) => {
  const {dataProcessor} = window.waveview

  return (
    <Overlay
      model={model}
      className={s.zIndex}
      onClose={() => {
        dataProcessor.reset()
      }}
      buttons={[
        {
          name: "测试运行",
          action: () => {
            dataProcessor.process()
          }
        },
        {
          name: "保存",
          action: () => {
            dataProcessor.save()
          }
        },
        {
          name: "保存并关闭",
          action: () => {
            dataProcessor.save()
            dataProcessor.reset()
            model.hide()
          }
        }
      ]}
    >
      <SectionFields model={dataProcessor} />
    </Overlay>
  )
}

export default observer(DataProcessorLayer)
