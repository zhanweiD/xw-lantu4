import React, {useState} from "react"
import {observer} from "mobx-react-lite"
import c from "classnames"
import hJSON from "hjson"
import Section from "@components/section"
import tip from "@components/tip"
import copy from "@utils/copy"
import Modal from "@components/modal"
import Tab from "@components/tab"
import Icon from "@components/icon"
import IconButton from "@components/icon-button"
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

export const DataField = observer(
  ({
    label,
    value,
    onChange = () => {},
    globalData = [],
    projectData = [],
    officialData = [],
    addSource = () => {},
    removeSource = () => {}
  }) => {
    const [json, setJson] = useState(value.private)
    const [isVisible, setIsVisible] = useState(false)
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
          <Section name="私有JSON" dashed childrenClassName="pt8">
            <CodeField
              value={json}
              height={200}
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
            <div className="ml24">
              <div className="mb8">字段预览</div>
              {value.private && (
                <div>
                  {hJSON.parse(value.private)[0].map((v) => (
                    <span className={c("mr8", s.fieldPreview)} key={v}>
                      {v}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Section>
        )}
        {value.type === "source" && (
          <>
            <Section name="数据源" dashed childrenClassName="ml24">
              {value.source ? (
                <div
                  className="hand fbh fbac fbjsb mb8"
                  onClick={() => {
                    setIsVisible(true)
                  }}
                >
                  <div className={c("fb1 lh24", s.name)}>{value.sourceName_}</div>
                  <IconButton
                    icon="remove"
                    buttonSize={24}
                    onClick={(e) => {
                      e.stopPropagation()
                      removeSource(value.source)
                    }}
                  />
                </div>
              ) : (
                <div
                  className={c("hand fbh fbac fbjsb mb8 lh24 mr16 ctw20", s.name)}
                  onClick={() => {
                    setIsVisible(true)
                  }}
                >
                  请选择数据源
                </div>
              )}
              <div>
                <div className="mb8">字段预览</div>
                {value.sourceData_ && (
                  <div>
                    {value.sourceData_[0].map((v) => (
                      <span className={c("mr8", s.fieldPreview)} key={v}>
                        {v}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Section>
            <Modal
              width={270}
              height={400}
              title="绑定数据源"
              isVisible={isVisible}
              onClose={() => {
                setIsVisible(false)
              }}
            >
              <Tab>
                <Tab.Item name="项目数据">
                  {projectData.map((data) => {
                    return (
                      <div
                        key={data.dataId}
                        className={c("fbh fbac lh24 pr8 pl8 ctw60 hand mb2", s.row)}
                        onClick={() => {
                          addSource(data.dataId)
                          setIsVisible(false)
                        }}
                      >
                        <Icon name={data.icon_} fill="#ffffff" />
                        {data.dataName}
                      </div>
                    )
                  })}
                </Tab.Item>
                <Tab.Item name="全局数据">
                  {globalData.map((data) => {
                    return (
                      <div
                        key={data.dataId}
                        className={c("fbh fbac lh24 pr8 pl8 ctw60 hand mb2", s.row)}
                        onClick={() => {
                          addSource(data.dataId)
                          setIsVisible(false)
                        }}
                      >
                        <Icon name={data.icon_} fill="#ffffff" />
                        {data.dataName}
                      </div>
                    )
                  })}
                </Tab.Item>
                <Tab.Item name="官方数据">
                  {officialData.map((data) => {
                    return (
                      <div
                        key={data.dataId}
                        className={c("fbh fbac lh24 pr8 pl8 ctw60 hand mb2", s.row)}
                        onClick={() => {
                          addSource(data.dataId)
                          setIsVisible(false)
                        }}
                      >
                        <Icon name={data.icon_} fill="#ffffff" />
                        {data.dataName}
                      </div>
                    )
                  })}
                </Tab.Item>
              </Tab>
            </Modal>
          </>
        )}
      </>
    )
  }
)