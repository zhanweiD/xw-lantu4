import React from "react"
import {observer} from "mobx-react-lite"
import c from "classnames"
import {Field} from "./base"
import s from "./data.module.styl"
import Section from "@components/section"
import {CodeField} from "./code"

const Check = ({value, onChange, options}) => {
  return (
    <div className={c("fbh", s.wrap)}>
      {options.map((option) => (
        <div
          key={option.key}
          className={c("fb1", s.checkOption, {
            [s.checkOption_checked]: value === option.value
          })}
          value={option.value}
          onClick={() => {
            onChange(option.value, option)
          }}
        >
          {option.key}
        </div>
      ))}
    </div>
  )
}

export const DataField = observer(
  ({label, value, onChange = () => {}, onCopy = () => {}, onFormat = () => {}, onSave = () => {}}) => {
    return (
      <>
        <Field label={label}>
          <Check
            value={value.type}
            options={[
              {
                key: "私有JSON",
                value: "private"
              },
              {
                key: "数据源",
                value: "source"
              }
            ]}
            onChange={(value) => {
              onChange({
                type: value
              })
            }}
          />
        </Field>
        {value.type === "private" && (
          <Section name="私有JSON">
            <CodeField
              value={value.private}
              height={140}
              onChange={(value) => {
                onChange({
                  private: value
                })
              }}
              buttons={[
                {
                  name: "复制",
                  action: onCopy,
                  position: "left"
                },
                {
                  name: "格式化",
                  action: onFormat,
                  position: "left"
                },
                {
                  name: "保存",
                  action: onSave,
                  position: "right"
                }
              ]}
            />
          </Section>
        )}
        <div>
          <div>字段预览</div>
          <div></div>
        </div>
      </>
    )
  }
)
