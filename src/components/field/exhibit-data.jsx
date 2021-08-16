/**
 * @author 7w
 * 组件数据面板
 */
import React, {useEffect, useState} from "react"
import {observer} from "mobx-react-lite"
import c from "classnames"
import Button from "@components/button"
import {useTranslation} from "react-i18next"
import Icon from "@components/icon"
import {SelectFilterField} from "./select-filter"
import {ExhibitDataTitle} from "./exhibit-data-title"
import {CheckField} from "./check"
import Section from "../section"
import {CodeField} from "./code"

// 静态 json 面板
const JsonField = observer(
  ({
    jsonValue,
    defaultJsonValue,
    isOpenJsonProcessor,
    onJsonChange,
    onToogleJsonProcessor,
    jsonProcessor,
    defaultJsonProcessor,
    onJsonProcessorChange,
    jsonProcessorResult,
    setEffectLayer,
    getEffectLayersBySouceId
  }) => {
    const {t} = useTranslation()

    return (
      <>
        <Section canIconFold name={t("dataPanel.authJson")}>
          {Object.entries(jsonValue.toJSON()).map(([sourceId, json], i) => {
            return (
              <div className="pt8 pb8" key={sourceId}>
                {/* { `默认json数据${i + 1}` } */}
                <div className="pb4 pl8">私有JSON{i + 1}</div>
                <Code
                  value={json}
                  defaultValue={defaultJsonValue[sourceId]}
                  onChange={(v) => {
                    try {
                      // jsonValue.set(sourceId, v)
                      // JSON.parse(v)
                      // const newJsonValue = JSON.parse(JSON.stringify(jsonValue))
                      // newJsonValue[sourceId] = v
                      // onJsonChange(newJsonValue)
                      const effectLayers = getEffectLayersBySouceId(sourceId)
                      onJsonChange(sourceId, v)
                      setEffectLayer(effectLayers)
                    } catch (error) {
                      console.error(error)
                    }
                  }}
                  onFormat={(v) => {
                    return JSON.stringify(JSON.parse(v), null, 2)
                  }}
                />
              </div>
            )
          })}
        </Section>

        {false && (
          <Section
            canIconFold
            name={t("optionPanel.dataProcessor")}
            sectionConfigField={
              <div
                className={c("fbh fbac fbjc hand")}
                style={{
                  width: "24px",
                  height: "24px"
                }}
                onClick={() => {
                  onToogleJsonProcessor(!isOpenJsonProcessor)
                }}
              >
                <Icon size={14} name={isOpenJsonProcessor ? "section-selected" : "section-not-selected"} fill="#ffffff" />
              </div>
            }
          >
            <div className="pt8 pb16">
              <Code
                value={jsonProcessor}
                defaultValue={defaultJsonProcessor}
                readOnly={!isOpenJsonProcessor}
                onChange={(v) => {
                  try {
                    onJsonProcessorChange(v)
                  } catch (error) {
                    console.error(error)
                  }
                }}
                onExecute={() => {
                  // TODO 调用json函数执行
                }}
              />

              <div className="mt8">
                <ExhibitDataTitle prefix="函数输出：" />
                <SelectFilterField
                  className="pt2"
                  value={jsonProcessorResult?.map((col) => col.key)}
                  isMulti
                  readOnly
                  options={jsonProcessorResult?.map((col) => ({
                    key: col.name,
                    value: col.key
                  }))}
                />
              </div>
            </div>
          </Section>
        )}
      </>
    )
  }
)

// 带格式化、重置按钮的代码输入框
const Code = observer(({value, defaultValue, onChange = () => {}, onFormat, readOnly, onExecute}) => {
  const {t} = useTranslation()
  const [codeValue, setCodeValue] = useState("")
  useEffect(() => {
    if (value) {
      setCodeValue(value)
    } else {
      setCodeValue(defaultValue)
    }
  }, [value])

  const buttons = [
    {
      position: "right",
      name: t("optionPanel.reset"),
      action: () => {
        const v = typeof defaultValue === "object" ? JSON.stringify(defaultValue, null, 2) : defaultValue
        setCodeValue(v)
        onChange(v)
      }
    }
  ]
  if (onFormat) {
    buttons.push({
      position: "left",
      name: "格式化",
      action: () => {
        const v = onFormat(codeValue)
        setCodeValue(v)
        // onChange(v)
      }
    })
  }
  return (
    <div>
      <CodeField
        readOnly={readOnly}
        height={300}
        onChange={(v) => {
          setCodeValue(v)
          onChange(v)
        }}
        value={codeValue}
        buttons={buttons}
      />

      {false && (
        <div className="pr8 pl8">
          {onFormat && (
            <Button
              className="mr8"
              width={80}
              type="primary"
              name={t("text.format")}
              onClick={() => {
                const v = onFormat(codeValue)
                setCodeValue(v)
                onChange(v)
              }}
            />
          )}

          {onExecute && (
            <Button
              className="mr8"
              width={80}
              type="primary"
              name={t("optionPanel.execute")}
              onClick={() => {
                onExecute()
              }}
            />
          )}
          <Button
            width={80}
            name={t("optionPanel.reset")}
            onClick={() => {
              const v = typeof defaultValue === "object" ? JSON.stringify(defaultValue, null, 2) : defaultValue
              setCodeValue(v)
              onChange(v)
            }}
          />
        </div>
      )}
    </div>
  )
})

// 组件数据源面板
const SourceField = observer(
  ({
    isOpenSourceProcessor,
    onToogleSourceProcessor,
    onSourceProcessorChange,
    defaultSourceProcessor,
    sourceProcessor,
    // 已绑定的数据源
    sources,
    onRemoveSource,
    // 所有数据源列表
    // 执行结果
    sourceProcessorResult
  }) => {
    const {t} = useTranslation()

    return (
      <div>
        <Section canIconFold name={t("optionPanel.bindDataSource")}>
          <div className="p8 pb16">
            {sources.length === 0 ? (
              <div className="emptyNote">
                还没有绑定的数据源，点击
                <span className="ctSecend hand">绑定</span>
              </div>
            ) : (
              <div>
                {sources.map((source, i) => {
                  const {id, name, columns_: columns = []} = source
                  return (
                    <div key={id} className={c(i > 0 && "mt8")}>
                      <div className={c("fb1 pr")}>
                        <ExhibitDataTitle
                          prefix={name}
                          // text={key}
                          // onChange={v => {
                          //   setKey(v)
                          // }}
                          onRemove={() => {
                            onRemoveSource(source)
                          }}
                        />
                        <div className="mt4">
                          <SelectFilterField
                            className="pt2"
                            value={columns.map((col) => col.key)}
                            isMulti
                            readOnly
                            options={columns.map((col) => ({
                              key: col.name,
                              value: col.key
                            }))}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
                {sources.length < 3 && <div className="emptyNote hand">再绑定一个数据源</div>}
              </div>
            )}
          </div>
        </Section>

        {false && (
          <Section
            canIconFold
            name={t("optionPanel.dataProcessor")}
            sectionConfigField={
              <div
                className={c("fbh fbac fbjc hand")}
                style={{
                  width: "24px",
                  height: "24px"
                }}
                onClick={() => {
                  onToogleSourceProcessor(!isOpenSourceProcessor)
                }}
              >
                <Icon size={14} name={isOpenSourceProcessor ? "section-selected" : "section-not-selected"} fill="#ffffff" />
              </div>
            }
          >
            <div className="pt8 pb16">
              <Code
                value={sourceProcessor}
                defaultValue={defaultSourceProcessor}
                readOnly={!isOpenSourceProcessor}
                onChange={(v) => {
                  try {
                    onSourceProcessorChange(v)
                  } catch (error) {
                    console.error(error)
                  }
                }}
                onExecute={() => {
                  // TODO 调用数据源函数执行
                }}
              />

              <div className="mt8">
                <ExhibitDataTitle prefix="函数输出：" />
                <SelectFilterField
                  className="pt2"
                  value={sourceProcessorResult?.map((col) => col.key)}
                  isMulti
                  readOnly
                  options={sourceProcessorResult?.map((col) => ({
                    key: col.name,
                    value: col.key
                  }))}
                />
              </div>
            </div>
          </Section>
        )}
      </div>
    )
  }
)

// 映射关系
const SourceMap = observer(({mappingConfig, columns, value, setEffectLayer, sources, onChange}) => {
  const {t} = useTranslation()

  // range 语义化
  const getRangeText = (range) => {
    if (range[0] === range[1]) {
      return range[0]
    }
    if (range[1] === Infinity) {
      return `>=${range[0]}`
    }
    return `${range[0]}~${range[1]}`
  }
  return (
    <Section canIconFold name={t("optionPanel.dataMapping")}>
      {Object.entries(mappingConfig.toJSON()).map(([layerId, layerMappingConfig], layerIndex) => {
        return (
          <div key={layerId}>
            <div>层{layerIndex}</div>

            {Object.entries(layerMappingConfig.groups).map(([groupId, groupMappingConfig], groupIndex) => {
              const selectedSource = value[layerId][groupId].sourceId
              return (
                <div className="p8" key={groupId}>
                  <div>组{groupIndex}</div>

                  <SelectFilterField
                    className="pt2"
                    value={selectedSource}
                    isMulti={false}
                    onChange={(v) => {
                      if (v === selectedSource) {
                        return
                      }

                      const saveValue = JSON.parse(JSON.stringify(value))
                      saveValue[layerId][groupId].sourceId = v
                      saveValue[layerId][groupId].fields.forEach((f) => {
                        f.value = []
                      })
                      onChange(saveValue)
                    }}
                    options={sources}
                  />
                  {groupMappingConfig.fields.map((fieldsMappingConfig, fieldIndex) => {
                    const {name, type = [], range} = fieldsMappingConfig
                    let selectedValue
                    try {
                      selectedValue = value[layerId][groupId].fields[fieldIndex].value.map((d) => d.key)
                    } catch (error) {
                      selectedValue = []
                    }

                    return (
                      <div key={fieldsMappingConfig.name}>
                        {name}：(类型：
                        {type.length > 0 ? type.join(" | ") : "any"}； 数量：{getRangeText(range)}；)
                        <SelectFilterField
                          className="pt2"
                          value={selectedValue}
                          isMulti
                          onChange={(v, fullValue) => {
                            if (fullValue.length > range[1]) {
                              return
                            }
                            const saveValue = JSON.parse(JSON.stringify(value))
                            saveValue[layerId][groupId].fields[fieldIndex].value = fullValue
                            onChange(saveValue)
                            setEffectLayer([layerId])
                          }}
                          options={columns
                            .filter((d) => {
                              // 一组内只能选择同意数据源里的字段
                              if (d.sourceId !== selectedSource) {
                                return false
                              }

                              // 类型校验，不定义类型就不校验
                              if (type.length > 0) {
                                return type.includes(d.type)
                              }
                              return true
                            })
                            .map((d) => {
                              return {
                                key: d.name,
                                value: d.key,
                                data: d
                              }
                            })}
                        />
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        )
      })}
    </Section>
  )
})

export const ExhibitDataField = observer(({onChange = () => {}, setEffectLayer, value, config, columns, sourceList, sourceProcessorResult, jsonProcessorResult}) => {
  const {t} = useTranslation()

  const {mode, json, isOpenJsonProcessor, jsonProcessor, mappingValue, isOpenSourceProcessor, sourceProcessor, sources, sources_, addSource, removeSource, setJson} = value

  const {
    mappingConfig,
    // mappingValue_: defaultMappingValue,
    json_: defaultJsonValue,
    jsonProcessor: defaultJsonProcessor,
    sourceProcessor: defaultSourceProcessor
  } = config

  const getEffectLayersBySouceId = (sourceId) => {
    const layers = []
    if (mode === "json") {
      Object.entries(mappingValue).forEach(([layerId, groups]) => {
        Object.entries(groups).forEach(([, group]) => {
          if (sourceId === group.sourceId) {
            layers.push(layerId)
          }
        })
      })
    }
    return layers
  }

  return (
    <div className="w100p">
      <Section canIconFold name={t("optionPanel.data")}>
        <div className="pb8 pt8">
          <CheckField
            label={t("optionPanel.source")}
            value={value.mode}
            options={[
              {
                key: "私有JSON",
                value: "json"
              },
              {
                key: "绑定数据源",
                value: "source"
              }
            ]}
            onChange={(v) => {
              onChange("mode", v)
            }}
          />
        </div>
      </Section>
      {mode === "json" ? (
        <JsonField
          setEffectLayer={setEffectLayer}
          jsonValue={json}
          getEffectLayersBySouceId={getEffectLayersBySouceId}
          defaultJsonValue={defaultJsonValue}
          onJsonChange={setJson}
          isOpenJsonProcessor={isOpenJsonProcessor}
          onToogleJsonProcessor={(v) => {
            onChange("isOpenJsonProcessor", v)
          }}
          jsonProcessor={jsonProcessor}
          defaultJsonProcessor={defaultJsonProcessor}
          onJsonProcessorChange={(v) => {
            onChange("jsonProcessor", v)
          }}
          jsonProcessorResult={jsonProcessorResult}
        />
      ) : (
        <SourceField
          isOpenSourceProcessor={isOpenSourceProcessor}
          onToogleSourceProcessor={(v) => {
            onChange("isOpenSourceProcessor", v)
          }}
          onSourceProcessorChange={(v) => {
            onChange("sourceProcessor", v)
          }}
          onAddSource={(source) => {
            addSource(source)
          }}
          onRemoveSource={(source) => {
            removeSource(source)
          }}
          defaultSourceProcessor={defaultSourceProcessor}
          sourceProcessor={sourceProcessor}
          sources={sources}
          sourceList={sourceList}
          sourceProcessorResult={sourceProcessorResult}
        />
      )}

      <SourceMap
        onChange={(v) => {
          onChange("mappingValue", v)
        }}
        setEffectLayer={setEffectLayer}
        value={mappingValue}
        columns={columns}
        mappingConfig={mappingConfig}
        sources={sources_}
      />
    </div>
  )
})
