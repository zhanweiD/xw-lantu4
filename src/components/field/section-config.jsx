import React from "react"
import {observer} from "mobx-react-lite"
import IconButton from "@components/icon-button"
import makeFunction from "@utils/make-function"
import c from "classnames"

// 配置图标集合
const iconMap = {
  checkbox: ["section-selected", "section-not-selected"],
  eye: ["eye-open", "eye-close"],
  add: "add"
}

export const SectionConfigField = observer(
  ({
    icon,
    iconSize = 14,
    value,
    onChange,
    onAction = () => {},
    action,
    readOnly
  }) => {
    const iconName = iconMap[icon]
    return (
      <>
        {iconMap[icon] && (
          <IconButton
            icon={
              Array.isArray(iconName)
                ? value
                  ? iconName[0]
                  : iconName[1]
                : iconName
            }
            className={c({noEvent: readOnly})}
            iconSize={iconSize}
            buttonSize={24}
            onClick={(e) => {
              if (Array.isArray(iconMap[icon])) {
                onChange(!value)
              }
              onAction({
                event: e,
                action: action && makeFunction(`return ${action}`)
              })
            }}
          />
        )}
      </>
    )
  }
)
