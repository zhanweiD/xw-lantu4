import React, {Children} from "react"
import {observer} from "mobx-react-lite"
import {useTranslation} from "react-i18next"
import c from "classnames"
import isDef from "@utils/is-def"
import {ColorField} from "./color"
import {Field} from "./base"
import s from "./range-color.module.styl"

export const RangeColorField = observer(
  ({
    label,
    tip,
    value = [],
    defaultValue = [],
    onChange = () => {},
    className,
    items = [],
    themeColors,
    readOnly,
    onDataProcessor = () => {},
    useProcessor = false,
    supportProcessor2 = false,
    hasSaveCode = false,
    operateProcessor = () => {}
  }) => {
    const {t} = useTranslation()
    return (
      <Field
        label={label}
        className={className}
        isMulti
        tip={tip}
        // pro field 2
        useProcessor={useProcessor}
        onDataProcessor={(operate, state) => onDataProcessor(operate, state)}
        supportProcessor2={supportProcessor2}
        hasSaveCode={hasSaveCode}
        operateProcessor={(op) => operateProcessor(op)}
      >
        {items.map((item, index) =>
          // !需要保证有value的长度验证
          // eslint-disable-next-line implicit-arrow-linebreak
          Children.toArray(
            <div className="fbh">
              <div className={c("lh28", "mr8", "fb1", s.labelColor)}>
                {t(item.key)}
              </div>
              <div className="fb7">
                <ColorField
                  value={
                    isDef(value[index]) ? value[index] : defaultValue[index]
                  }
                  onChange={(v) => {
                    const clonedValue = [].concat(value)
                    clonedValue.splice(index, 1, v)
                    onChange(clonedValue)
                  }}
                  themeColors={themeColors}
                  readOnly={readOnly}
                />
              </div>
            </div>
          )
        )}
      </Field>
    )
  }
)
