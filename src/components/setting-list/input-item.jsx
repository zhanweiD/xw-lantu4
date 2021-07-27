import React, {useState, useRef} from "react"
import c from "classnames"
import Button from "@components/button"
import s from "./setting-list.module.styl"

export const InputItem = ({
  type,
  name,
  label,
  className,
  value,
  placeholder,
  onOk
}) => {
  const [isOnChange, setIsOnChange] = useState(false)
  const [currentValue, setCurrentValue] = useState(value)
  const el = useRef(null)

  const Element = type === "textarea" ? "textarea" : "input"

  const isValueChanged = () => {
    return value !== currentValue
  }
  const onFocus = () => setIsOnChange(true)
  const onBlur = () => {
    if (!isValueChanged()) setIsOnChange(false)
  }
  const onChange = (e) => setCurrentValue(e.target.value)

  const Action = () => {
    return (
      <Button
        type="text"
        name="修改"
        onClick={() => {
          if (isOnChange) return
          console.log("xiugai")
          el.current.select()
          onFocus()
        }}
      />
    )
  }
  const OnChangeAction = () => {
    return (
      <>
        <Button
          type="text"
          name="保存"
          onMouseDown={() => {
            console.log("baocun")
            if (isValueChanged()) onOk({[name]: currentValue})
            setIsOnChange(false)
          }}
        />
        <Button
          type="text"
          name="取消"
          color="#ddd"
          onMouseDown={() => {
            console.log("cancel")
            setIsOnChange(false)
            setCurrentValue(value)
          }}
        />
      </>
    )
  }

  return (
    <li
      className={c(s.item, s.box, "cfw12 fbh fbac fs14 pt12 pb12", className)}
    >
      {label && <span className={s.label}>{label}</span>}
      <Element
        value={currentValue}
        placeholder={placeholder}
        ref={el}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        rows={type === "textarea" ? 4 : null}
      />
      <div className={s["action-box"]}>
        {isOnChange ? <OnChangeAction /> : <Action />}
      </div>
    </li>
  )
}
