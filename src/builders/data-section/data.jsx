import React, {useState, useEffect} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'react-i18next'
import c from 'classnames'
import hJSON from 'hjson'
import tip from '@components/tip'
import copy from '@utils/copy'
import Modal from '@components/modal'
import Tab from '@components/tab'
import IconButton from '@components/icon-button'
import {NumberField} from '@components/field'
import {CodeField} from '../fields/code'
import Section from '../section'
import Processor from './processor'
import s from './data.module.styl'

const Check = ({value, onChange, options}) => {
  const {t} = useTranslation()
  return (
    <div className={c('fbh', s.wrap)}>
      {options.map((option) => (
        <div
          key={option.key}
          className={c(s.checkOption, {
            [s.checkOption_checked]: value === option.value,
          })}
          value={option.value}
          onClick={() => {
            onChange(option.value, option)
          }}
        >
          {t(option.key)}
        </div>
      ))}
    </div>
  )
}

const DataField = ({
  value,
  onChange = () => {},
  spaceData = [],
  projectData = [],
  // officialData = [],
  addSource = () => {},
  removeSource = () => {},
  type = 1,
  toggleBak = () => {},
  previewSource = () => {},
}) => {
  const {t} = useTranslation()
  const [json, setJson] = useState(value.private)
  const [isVisible, setIsVisible] = useState(false)
  useEffect(() => {
    setJson(value.private)
  }, [value.private])
  return (
    <>
      <div className="fbh fbac fbjc cfw2 h32">
        <Check
          value={value.type}
          options={[
            {
              key: 'privateJSON',
              value: 'private',
            },
            {
              key: 'dataSource',
              value: 'source',
            },
          ]}
          onChange={(v) => {
            if (value.type !== v) {
              toggleBak()
            }
            onChange({
              type: v,
            })
          }}
        />
      </div>
      {value.type === 'private' && (
        <>
          <Section name={t('privateJSON')} type={type} titleClassName="pr8">
            <CodeField
              childrenClassName="ml24"
              className="block"
              value={json}
              height={200}
              onChange={(value) => {
                // setJson(value)
                try {
                  const hjson = hJSON.parse(value)
                  onChange({
                    private: hJSON.stringify(hjson, {space: 2, quotes: 'strings', separator: true}),
                  })
                } catch (error) {
                  tip.error({content: '保存失败,请检查JSON是否合法'})
                }
              }}
              buttons={[
                {
                  name: '复制',
                  action: () => {
                    copy(json)
                    tip.success({content: '复制成功'})
                  },
                  position: 'left',
                },
                {
                  name: '格式化',
                  action: () => {
                    try {
                      const hjson = hJSON.parse(json)
                      setJson(hJSON.stringify(hjson, {space: 2, quotes: 'strings', separator: true}))
                    } catch (error) {
                      tip.error({content: '格式化失败,请检查JSON是否合法'})
                    }
                  },
                  position: 'left',
                },
                // {
                //   name: '保存',
                //   action: () => {
                //     try {
                //       const hjson = hJSON.parse(json)
                //       onChange({
                //         private: hJSON.stringify(hjson, {space: 2, quotes: 'strings', separator: true}),
                //       })
                //     } catch (error) {
                //       tip.error({content: '保存失败,请检查JSON是否合法'})
                //     }
                //   },
                //   position: 'right',
                // },
              ]}
            />
          </Section>
        </>
      )}
      {value.type === 'source' && (
        <>
          <Section name={t('dataSource')} type={type} titleClassName="pr8">
            {value.source ? (
              <div
                className="hand fbh fbac fbjsb mb8 ml24"
                onClick={() => {
                  setIsVisible(true)
                }}
              >
                <div className={c('fb1 lh24', s.name)}>{value.displayName}</div>
                <IconButton
                  icon="open-in-tab"
                  onClick={(e) => {
                    e.stopPropagation()
                    previewSource()
                  }}
                />
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
                className={c('hand fbh fbac fbjsb mb8 ml24 lh24 mr8 ctw20', s.name)}
                onClick={() => {
                  setIsVisible(true)
                }}
              >
                请选择数据源
              </div>
            )}
          </Section>
          {value.sourceType === 'api' && (
            <>
              <Processor
                type={type}
                name={t('headers')}
                value={value.apiHeader}
                effective={value.useApiHeader}
                onChange={(data) => {
                  onChange({
                    apiHeader: data,
                  })
                }}
                onIconClick={(data) => {
                  onChange({
                    useApiHeader: data,
                  })
                }}
              />
              <Processor
                type={type}
                name={t('queries')}
                value={value.apiQueries}
                effective={value.useApiQueries}
                onChange={(data) => {
                  onChange({
                    apiQueries: data,
                  })
                }}
                onIconClick={(data) => {
                  onChange({
                    useApiQueries: data,
                  })
                }}
              />
              <Section
                name="轮询"
                headIcon={
                  <IconButton
                    className="ml4"
                    icon={value.useApiPolling ? 'effective' : 'ineffective'}
                    iconSize={14}
                    buttonSize={18}
                    onClick={() =>
                      onChange({
                        useApiPolling: !value.useApiPolling,
                      })
                    }
                  />
                }
                type={type}
                titleClassName="pr8"
              >
                <NumberField
                  label="间隔（s）"
                  className="ml24"
                  value={value.apiPolling || 0}
                  min={1}
                  onChange={(v) =>
                    onChange({
                      apiPolling: v,
                    })
                  }
                />
                {/* <SelectField
                    className="fb1"
                    value={data.database.database}
                    // options={[{key: '1', value: '1'}, {key: '2', value: '2'}]}
                    options={data.database.databaseList.map((item) => ({
                      key: item.database,
                      value: item.database,
                    }))}
                    onChange={(v) => data.database.set('database', v)}
                  /> */}
              </Section>
              {value.apiConfig?.method !== 'GET' && (
                <Processor
                  type={type}
                  name={t('body')}
                  value={value.apiBody}
                  effective={value.useApiBody}
                  onChange={(data) => {
                    onChange({
                      apiBody: data,
                    })
                  }}
                  onIconClick={(data) => {
                    onChange({
                      useApiBody: data,
                    })
                  }}
                />
              )}
            </>
          )}
          {value.source && (
            <Processor
              name="数据处理"
              type={type}
              value={value.processor}
              effective={value.useProcessor}
              onChange={(data) => {
                onChange({
                  processor: data,
                })
              }}
              onIconClick={(data) => {
                onChange({
                  useProcessor: data,
                })
              }}
            />
          )}
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
                      className={c('fbh fbac lh24 pr8 pl8 ctw60 hand mb2', s.row)}
                      onClick={() => {
                        value.source && removeSource(value.source)
                        addSource(data.dataId)
                        setIsVisible(false)
                      }}
                    >
                      {data.dataName}
                    </div>
                  )
                })}
              </Tab.Item>
              <Tab.Item name="全局数据">
                {spaceData.map((data) => {
                  return (
                    <div
                      key={data.dataId}
                      className={c('fbh fbac lh24 pr8 pl8 ctw60 hand mb2', s.row)}
                      onClick={() => {
                        value.source && removeSource(value.source)
                        addSource(data.dataId)
                        setIsVisible(false)
                      }}
                    >
                      {data.dataName}
                    </div>
                  )
                })}
              </Tab.Item>
              {/* <Tab.Item name="官方数据">
                {officialData.map((data) => {
                  return (
                    <div
                      key={data.dataId}
                      className={c('fbh fbac lh24 pr8 pl8 ctw60 hand mb2', s.row)}
                      onClick={() => {
                        addSource(data.dataId)
                        setIsVisible(false)
                      }}
                    >
                      {data.dataName}
                    </div>
                  )
                })}
              </Tab.Item> */}
            </Tab>
          </Modal>
        </>
      )}
      <Section name="字段预览" type={type} titleClassName="pr8" childrenClassName="pt8 pb8 fbh fbw ml24">
        {value.columns.length > 0 ? (
          value.columns.map((v) => (
            <div className={c('mr4 mb4', s.fieldPreview)} key={v.alias}>
              {v.alias}
            </div>
          ))
        ) : (
          <div className={c('emptyNote mr8 fb1')}>
            <span>请选择合法的数据</span>
          </div>
        )}
      </Section>
    </>
  )
}

export default observer(DataField)
