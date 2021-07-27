import React, {useRef, useEffect} from "react"
import {observer} from "mobx-react-lite"
import c from "classnames"
import {Field} from "./base"
import s from "./constraints.module.styl"

// 顺序不能变
const OPTIONS = [
  {
    key: "top",
    line: "left"
  },
  {
    key: "right",
    line: "top"
  },
  {
    key: "bottom",
    line: "left"
  },
  {
    key: "left",
    line: "top"
  },
  {
    key: "width",
    line: "top"
  },
  {
    key: "height",
    line: "left"
  }
]

export const ConstraintsField = observer(
  ({
    label,
    tip,
    value = [],
    defaultValue = [true, true, false, false, true, true],
    onChange = () => {},
    className,
    readOnly = false
  }) => {
    const constraintsRef = useRef()
    const currentValue = value.length < 6 ? defaultValue : value

    const getNotAllowedOption = (keyName) => {
      const options = {}
      const conditionHeight = {
        top: currentValue[0],
        bottom: currentValue[2],
        height: currentValue[5]
      }
      const conditionWidth = {
        right: currentValue[1],
        left: currentValue[3],
        width: currentValue[4]
      }

      if (
        Object.values(conditionHeight).filter((option) => option).length > 1
      ) {
        Object.keys(conditionHeight).forEach((key) => {
          // 返回true显示禁止的cursor样式
          options[key] = true
        })
      }
      if (Object.values(conditionWidth).filter((option) => option).length > 1) {
        Object.keys(conditionWidth).forEach((key) => {
          options[key] = true
        })
      }
      return options[keyName]
    }

    useEffect(() => {
      const width = constraintsRef.current.offsetWidth || 300
      constraintsRef.current.style.height = `${width / 2}px`
    }, [])

    return (
      <Field label={label} className={className} tip={tip}>
        <div
          className={c("fbh fbac fbjc pr w100p fieldLayout", s.box, {
            noEvent: readOnly
          })}
          ref={constraintsRef}
        >
          {OPTIONS.map(({key, line}, index) => (
            <div
              key={key}
              className={c("pa fbh fbac fbjc hand", s[`${key}Div`], {
                [s.notAllowCheck]:
                  !currentValue[index] && getNotAllowedOption(key)
              })}
              onClick={() => {
                const cloneValue = [].concat(currentValue)
                cloneValue[index] = !currentValue[index]
                if (cloneValue[0] && cloneValue[2] && cloneValue[5]) {
                  console.warn("选项上、下、高度不能同时选中")
                } else if (cloneValue[1] && cloneValue[3] && cloneValue[4]) {
                  console.warn("选项左、右、宽度不能同时选中")
                } else {
                  onChange(cloneValue)
                }
              }}
            >
              <div
                className={c("pa", s[`${key}Arrow1`], {
                  [s.check]: currentValue[index]
                })}
              />
              <div
                className={c("pa", s[`${key}Arrow2`], {
                  [s.check]: currentValue[index]
                })}
              />
              <div
                className={c("pa", s[`${key}Line`], {
                  [s.check]: currentValue[index],
                  [s[`${line}Solid`]]: currentValue[index]
                })}
              />
            </div>
          ))}
          <div className={c("cfw10 pa", s.middleBox)} />
        </div>
      </Field>
    )
  }
)
