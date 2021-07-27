import React, {useEffect, useRef} from "react"
import {observer} from "mobx-react-lite"
import c from "classnames"
import isDef from "@utils/is-def"
import {Field} from "./base"
import s from "./offset.module.styl"
import {NumberInput} from "./number"

export const OffsetField = observer(
  ({
    label,
    tip,
    className,
    value,
    defaultValue = {},
    onChange = () => {},
    readOnly
  }) => {
    const offsetRef = useRef()
    const {margin = [0, 0, 0, 0], padding = [0, 0, 0, 0]} = isDef(value)
      ? value
      : defaultValue
    const [marginTop, marginRight, marginBottom, marginLeft] = margin
    const [paddingTop, paddingRight, paddingBottom, paddingLeft] = padding
    const offset = {
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
      paddingTop,
      paddingRight,
      paddingBottom,
      paddingLeft
    }
    // TODO 文本输入优化，中间区域自适应，能够完全显示数值
    // const [boxOffset, setBoxOffset] = useState({marginLeft: 20, marginRight: 20, paddingLeft: 20, paddingRight: 20})
    const boxOffset = {}

    useEffect(() => {
      const width = offsetRef.current.offsetWidth || 300
      offsetRef.current.style.height = `${width / 2}px`
    }, [])

    return (
      <Field label={label} tip={tip} className={className}>
        <div
          className={c("fbh fbac fbjc pr w100p fieldOffset", s.marginBox)}
          ref={offsetRef}
        />
        <div className={c("pa", s.paddingBox)} />
        <div className={c("cfw10 pa", s.contentBox)} />
        {Object.entries(offset).map(([key, itemValue], index) => {
          return (
            <div
              className={c("pa", s[`${key}Input`])}
              key={key}
              style={{width: boxOffset[key] || 20}}
            >
              <NumberInput
                className={s.baseInput}
                value={isDef(itemValue) ? itemValue : 0}
                readOnly={readOnly}
                onChange={(v) => {
                  const clonedValue = {
                    margin: margin.map((o) => o),
                    padding: padding.map((o) => o)
                  }
                  if (index < 4) {
                    clonedValue.margin.splice(index, 1, v)
                  } else {
                    clonedValue.padding.splice(index - 4, 1, v)
                  }
                  onChange(clonedValue)
                }}
                isExternal
              />
            </div>
          )
        })}
      </Field>
    )
  }
)
