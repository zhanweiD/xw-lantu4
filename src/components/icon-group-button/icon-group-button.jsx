import React from "react"
import {observer} from "mobx-react-lite"
import c from "classnames"
import Icon from "@components/icon"
import Caption from "@components/caption"
import s from "./icon-group-button.module.styl"

const IconGroupButton = ({
  icon,
  title,
  className,
  layout,
  onClick,
  canUse = true,
  canClick = true
}) => (
  <Caption content={title}>
    <div
      className={c("fbh fbac fbjc", s.iconGroupButton, className, {
        [s.iconGroupButton_alone]: layout === undefined,
        [s.iconGroupButton_start]: layout === "start",
        [s.iconGroupButton_center]: layout === "center",
        [s.iconGroupButton_end]: layout === "end"
      })}
      onClick={canClick ? onClick : () => {}}
    >
      <Icon name={icon} size={16} className={canUse ? "ciw" : "ciGray"} />
    </div>
  </Caption>
)

export default observer(IconGroupButton)
