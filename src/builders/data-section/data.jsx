import React, {useState} from 'react'
import {observer} from 'mobx-react-lite'
import c from 'classnames'
import hJSON from 'hjson'
import tip from '@components/tip'
import copy from '@utils/copy'
import Modal from '@components/modal'
import Tab from '@components/tab'
import Icon from '@components/icon'
import IconButton from '@components/icon-button'
import {CodeField} from '../fields/code'
import Section from '../section'
import s from './data.module.styl'

const Check = ({value, onChange, options}) => {
  return (
    <div className={c('fbh', s.wrap)}>
      {options.map((option) => (
        <div
          key={option.key}
          className={c('fb1', s.checkOption, {
            [s.checkOption_checked]: value === option.value,
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
}) => {
  const [json, setJson] = useState(value.private)
  const [isVisible, setIsVisible] = useState(false)

  return (
    <>
      <div className="fbh fbjc mt8 ml24 mb8">
        <Check
          value={value.type}
          options={[
            {
              key: '私有JSON',
              value: 'private',
            },
            {
              key: '数据源',
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
          <Section name="私有JSON" type={type} childrenClassName="pt8 pb8">
            <CodeField
              childrenClassName="ml24"
              className="block"
              value={json}
              height={200}
              onChange={(value) => {
                setJson(value)
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
                {
                  name: '保存',
                  action: () => {
                    try {
                      const hjson = hJSON.parse(json)
                      onChange({
                        private: hJSON.stringify(hjson, {space: 2, quotes: 'strings', separator: true}),
                      })
                    } catch (error) {
                      tip.error({content: '保存失败,请检查JSON是否合法'})
                    }
                  },
                  position: 'right',
                },
              ]}
            />
          </Section>
        </>
      )}
      {value.type === 'source' && (
        <>
          <Section name="数据源" dashed childrenClassName="ml24">
            {value.source ? (
              <div
                className="hand fbh fbac fbjsb mb8"
                onClick={() => {
                  setIsVisible(true)
                }}
              >
                <div className={c('fb1 lh24', s.name)}>{value.sourceName_}</div>
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
                className={c('hand fbh fbac fbjsb mb8 lh24 mr8 ctw20', s.name)}
                onClick={() => {
                  setIsVisible(true)
                }}
              >
                请选择数据源
              </div>
            )}
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
                      className={c('fbh fbac lh24 pr8 pl8 ctw60 hand mb2', s.row)}
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
                {spaceData.map((data) => {
                  return (
                    <div
                      key={data.dataId}
                      className={c('fbh fbac lh24 pr8 pl8 ctw60 hand mb2', s.row)}
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
                      <Icon name={data.icon_} fill="#ffffff" />
                      {data.dataName}
                    </div>
                  )
                })}
              </Tab.Item> */}
            </Tab>
          </Modal>
        </>
      )}
      <Section name="字段预览" type={type} childrenClassName="pt8 pb8 fbh fbw ml24">
        {value.sourceColumn_.length > 0 ? (
          value.sourceColumn_.map((v) => (
            <div className={c('mr4 mb4', s.fieldPreview)} key={v}>
              {v}
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
