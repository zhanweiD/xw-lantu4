import React, {useEffect, useState, useRef} from "react"
import {observer} from "mobx-react-lite"
import np from "number-precision"
import isNumber from "lodash/isNumber"
import c from "classnames"
import trim from "lodash/trim"
import isNumeric from "@utils/is-numberic"
import isDef from "@utils/is-def"
import {Field} from "./base"
import s from "./number.module.styl"

const isSpecialString = (string, min) =>
  ["", (isNumber(min) && min < 0) || !isDef(min) ? "-" : "", "+", "."].indexOf(
    string
  ) > -1

const fixRange = (n, min, max) => {
  if (isNumeric(min)) {
    n = n < min ? min : n
  }
  if (isNumeric(max)) {
    n = n > max ? max : n
  }
  return n
}

const NumberRange = ({min, max}) => {
  let range
  if (isDef(min) && isDef(max)) {
    range = `${min}-${max}`
  } else if (isDef(min)) {
    range = `>${min}`
  } else if (isDef(max)) {
    range = `<${max}`
  }
  return <div className={c("ctw40", s.range)}>{range}</div>
}

export const NumberInput = observer(
  ({
    value,
    defaultValue = 0,
    onChange,
    min,
    max,
    step,
    readOnly,
    placeholder,
    className,
    toggleFocus = () => {},
    isExternal
  }) => {
    const [inputValue, setInputValue] = useState("")
    const codeRef = useRef(null)

    useEffect(() => {
      codeRef.current.addEventListener("keyup", (e) => {
        e.stopPropagation()
      })
    }, [])

    useEffect(() => {
      if (isExternal) {
        setInputValue(value)
      }
    }, [value])

    // !NOTE value属性错误的写法：value={value || defaultValue} 会导致输入过程不能为空字符串
    return (
      <input
        className={className}
        type="text"
        ref={codeRef}
        value={isExternal ? inputValue : isDef(value) ? value : defaultValue}
        placeholder={placeholder}
        disabled={readOnly}
        onKeyDown={(e) => {
          const v = trim(e.target.value)
          if (isNumeric(v)) {
            let n = +v
            if (e.key === "ArrowUp") {
              n = np.plus(n, step)
            }
            if (e.key === "ArrowDown") {
              n = np.minus(n, step)
            }

            // 仅按上下键的时候才触发值的改变
            if (e.key === "ArrowUp" || e.key === "ArrowDown") {
              onChange(fixRange(n, min, max))
            }
          }
        }}
        onFocus={() => toggleFocus(true)}
        onBlur={(e) => {
          const v = trim(e.target.value)
          // 如果是合理的特殊字符
          if (isSpecialString(v, min)) {
            onChange(defaultValue)
            isExternal && setInputValue(defaultValue)
          } else if (isNumeric(v)) {
            onChange(fixRange(+v, min, max))
            isExternal && setInputValue(fixRange(+v, min, max))
          }
          if (
            !(
              e.relatedTarget &&
              e.relatedTarget.className.indexOf("numberSlider") > -1
            )
          ) {
            toggleFocus(false)
          }
        }}
        onChange={(e) => {
          const v = trim(e.target.value)
          if (isSpecialString(v, min) || isNumeric(v)) {
            // !NOTE 当满足 isNumeric(v) 时，下面一行不能写成onChange(+v) !!!
            // ! 因为onChange抛出去的值是中间过程的值，'1.'不应该强制转换成'1'
            if (isExternal) {
              setInputValue(v)
            } else {
              onChange(v)
            }
          }
        }}
      />
    )
  }
)

export const NumberField = observer(
  ({
    label,
    tip,
    value,
    defaultValue,
    onChange = () => {},
    className,
    min,
    max,
    step = 1,
    readOnly = false,
    isExternal = true,
    useProcessor = false,
    supportProcessor = false,
    updateProcessor = () => {},
    hasSlider,
    hasSaveCode
  }) => {
    const [isFocus, setIsFocus] = useState(false)
    // const scale = ['0', '20', '40', '60', '80', '100']

    return (
      <Field
        className={className}
        label={label}
        tip={tip}
        supportProcessor={supportProcessor}
        useProcessor={useProcessor}
        updateProcessor={(target) => updateProcessor(target)}
        hasSaveCode={hasSaveCode}
      >
        <div className="fb1 pr">
          {/* 刻度 */}
          {/* <div>
        {isFocus && scale.map(degree => <div key={degree} className={c('pa', s.scaleBase, s[`scale${degree}`])} />)}
      </div> */}
          <NumberInput
            className={c(className, {[s.sliderFocus]: hasSlider && isFocus})}
            value={value}
            defaultValue={defaultValue}
            onChange={onChange}
            min={min}
            max={max}
            step={step}
            readOnly={readOnly}
            toggleFocus={(status) => hasSlider && setIsFocus(status)}
            isExternal={isExternal}
          />
          {/* 滑块 */}
          {hasSlider && isFocus && (
            <input
              type="range"
              className={c("pa numberSlider", s.slider)}
              min={min}
              max={max}
              step={step}
              value={value}
              onBlur={(e) => {
                if (
                  !(
                    e.relatedTarget &&
                    e.relatedTarget.className.indexOf("sliderFocus") > -1
                  )
                ) {
                  setIsFocus(false)
                }
              }}
              onChange={(e) => {
                onChange(+e.target.value)
              }}
            />
          )}
        </div>
        <NumberRange min={min} max={max} />
      </Field>
    )
  }
)
