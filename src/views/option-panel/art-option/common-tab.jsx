import React from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'react-i18next'
import Tab from '@components/tab'
import Scroll from '@components/scroll'
import Builder, {recusiveNode} from '@builders'
import fields from '@builders/fields'
import Section from '@builders/section'
import IconButton from '@components/icon-button'
import s from './common-tab.module.styl'

const {TextField, TextareaField, MultiNumberField, ConstraintField, SwitchField} = fields
const CommonTab = ({target}) => {
  const {t} = useTranslation()
  const {
    background,
    name,
    remark,
    constraints,
    layout,
    setLayout,
    setRemark,
    materials,
    padding,
    setConstraints,
    frame_,
    visible,
  } = target || {}
  let materialModels = []
  if (materials) {
    materialModels = materials.map((material) => target.art_.exhibitManager.get(material.id))
  }
  return (
    <>
      {target && (
        <Tab sessionId="art-option-common" className={s.commonTab}>
          <Tab.Item name={t('layout')}>
            <Scroll className="h100p">
              {!frame_ ? (
                <Section name={t('base')}>
                  <MultiNumberField
                    items={[
                      {key: 'W', step: 1},
                      {key: 'H', step: 1},
                    ]}
                    className="ml24"
                    label={t('areaSize')}
                    value={[layout.width, layout.height]}
                    onChange={(value) => {
                      setLayout({
                        width: value[0],
                        height: value[1],
                      })
                    }}
                  />
                </Section>
              ) : (
                <Section name={t('constraint')}>
                  <ConstraintField
                    className="ml24"
                    value={{
                      layout: layout,
                      constraints: constraints,
                    }}
                    container={frame_.viewLayout}
                    onClick={(value) => {
                      setConstraints(value)
                    }}
                    onChange={(value) => {
                      setLayout(value)
                    }}
                  />
                </Section>
              )}
              {padding && (
                <Section name={t('offset')}>
                  {recusiveNode({
                    ...padding.options,
                    level: 0,
                  })}
                </Section>
              )}
            </Scroll>
          </Tab.Item>
          <Tab.Item name={t(background.name)}>
            <Scroll className="h100p">
              {recusiveNode({
                ...background.options,
                level: 0,
              })}
            </Scroll>
          </Tab.Item>
          <Tab.Item name={t('remark')}>
            <Scroll className="h100p">
              <Section name={t('base')}>
                <TextField
                  className="ml24"
                  label={t('name')}
                  value={name}
                  onChange={(value) => setRemark({name: value})}
                />
                <TextareaField
                  className="ml24"
                  label={t('remark')}
                  value={remark || ''}
                  onChange={(value) => setRemark({remark: value})}
                />
                <SwitchField
                  className="ml24"
                  label="默认隐藏"
                  value={!visible}
                  onChange={(ck) => {
                    target.set('visible', !ck)
                  }}
                />
              </Section>
            </Scroll>
          </Tab.Item>
          <Tab.Item name={t('materials')}>
            <Scroll className="h100p">
              {materialModels.map((model) => (
                <Builder
                  key={model.id}
                  data={model.data}
                  dimension={model.dimension}
                  layers={model.layers}
                  exhibit={model}
                  extra={
                    <IconButton
                      icon="more"
                      iconSize={14}
                      buttonSize={24}
                      onClick={(e, button) => {
                        const menu = target.root_.overlayManager.get('menu')
                        menu.toggle({
                          attachTo: button,
                          list: [
                            {
                              name: '删除',
                              action: () => {
                                target.removeBackground(model.id)
                                menu.hide()
                              },
                            },
                            {
                              name: '上移一层',
                              action: () => {
                                target.sortBackground(model.id, 'up')
                                menu.hide()
                              },
                            },
                            {
                              name: '下移一层',
                              action: () => {
                                target.sortBackground(model.id, 'down')
                                menu.hide()
                              },
                            },
                          ],
                        })
                      }}
                    />
                  }
                />
              ))}
            </Scroll>
          </Tab.Item>
        </Tab>
      )}
    </>
  )
}
export default observer(CommonTab)
