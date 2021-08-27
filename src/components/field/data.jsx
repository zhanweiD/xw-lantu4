import React, {useState} from "react"
import {observer} from "mobx-react-lite"
import c from "classnames"
import hJSON from "hjson"
import Section from "@components/section"
import tip from "@components/tip"
import copy from "@utils/copy"
import {CodeField} from "./code"
import {Field} from "./base"
import s from "./data.module.styl"

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

export const DataField = observer(({label, value, onChange = () => {}}) => {
  const [json, setJson] = useState(value.private)
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
            value={json}
            height={140}
            onChange={(value) => {
              setJson(value)
            }}
            buttons={[
              {
                name: "复制",
                action: () => {
                  copy(json)
                  tip.success({content: "复制成功"})
                },
                position: "left"
              },
              {
                name: "格式化",
                action: () => {
                  try {
                    const hjson = hJSON.parse(json)
                    setJson(hJSON.stringify(hjson, {space: 2, quotes: "strings", separator: true}))
                  } catch (error) {
                    tip.error({content: "格式化失败,请检查JSON是否合法"})
                  }
                },
                position: "left"
              },
              {
                name: "保存",
                action: () => {
                  try {
                    const hjson = hJSON.parse(json)
                    onChange({
                      private: hJSON.stringify(hjson, {space: 2, quotes: "strings", separator: true})
                    })
                  } catch (error) {
                    tip.error({content: "保存失败,请检查JSON是否合法"})
                  }
                },
                position: "right"
              }
            ]}
          />
          <div>
            <div>字段预览</div>
            {value.private && (
              <div>
                {hJSON.parse(value.private)[0].map((v) => (
                  <span className="mr8" key={v}>
                    {v}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Section>
      )}
    </>
  )
})
