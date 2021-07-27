import React from "react"
import {observer} from "mobx-react-lite"
import isFunction from "lodash/isFunction"
import Overlay from "@components/overlay"

const Confirm = ({model}) => {
  return (
    <Overlay
      model={model}
      buttons={[
        {
          name: "取消",
          action: () => {
            model.hide()
          }
        },
        {
          name: "确认",
          action: () => {
            if (isFunction(model.onConfirm)) {
              model.onConfirm()
            }
            model.hide()
          }
        }
      ]}
    >
      <div className="p16">{model.content}</div>
    </Overlay>
  )
}

export default observer(Confirm)
