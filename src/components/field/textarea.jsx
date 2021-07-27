import React, {useRef, useEffect} from "react"
import {observer} from "mobx-react-lite"
import isDef from "@utils/is-def"
import autosize from "autosize"
import {Field} from "./base"

// 多行文本
// <TextareaField label={t('描述')} value={xxx.description} onChange={e=>xxx.setDescription(e.target.value)}/>
export const TextareaField = observer(
  ({
    label,
    tip,
    value,
    placeholder,
    onChange,
    className,
    onBlur = () => {},
    readOnly
  }) => {
    const ta = useRef(null)

    useEffect(() => {
      autosize(ta.current)
      return () => {
        autosize.destroy(ta.current)
      }
    })

    return (
      <Field label={label} className={className} tip={tip}>
        <textarea
          ref={ta}
          value={isDef(value) ? value : ""}
          placeholder={placeholder}
          disabled={readOnly}
          onChange={(e) => {
            onChange(e.target.value)
          }}
          onBlur={(e) => {
            onBlur(e.target.value)
          }}
          autoComplete="off"
        />
      </Field>
    )
  }
)
