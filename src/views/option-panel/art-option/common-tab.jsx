import React from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'react-i18next'
import Tab from '@components/tab'
import Scroll from '@components/scroll'
import Builder, {recusiveNode} from '@builders'
import fields from '@builders/fields'
import Section from '@builders/section'
import s from './common-tab.module.styl'

const {TextField, TextareaField, MultiNumberField} = fields
const CommonTab = ({box, frame}) => {
  const {t} = useTranslation()
  const {background, name, remark, layout, setLayout, setRemark, materials} = box || frame || {}
  let materialModels = []
  if (materials) {
    materialModels = materials.map((material) => box.frame_.art_.exhibitManager.get(material.id))
  }
  return (
    <>
      {(box || frame) && (
        <Tab sessionId="art-option-common" className={s.commonTab}>
          <Tab.Item name={t('layout')}>
            <Scroll className="h100p">
              <Section name={t('base')}>
                <MultiNumberField
                  items={[
                    {key: 'X', step: 1},
                    {key: 'Y', step: 1},
                  ]}
                  className="ml24"
                  label={t('xyPosition')}
                  value={[layout.x, layout.y]}
                  onChange={(value) => {
                    setLayout({
                      x: value[0],
                      y: value[1],
                    })
                  }}
                />
                <MultiNumberField
                  items={[
                    {key: 'width', step: 1},
                    {key: 'height', step: 1},
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
              </Section>
            </Scroll>
          </Tab.Item>
          {materials && (
            <Tab.Item name={t('materials')}>
              <Scroll className="h100p">
                {materialModels.map((model) => (
                  <Builder
                    key={model.id}
                    data={model.data}
                    dimension={model.dimension}
                    layers={model.layers}
                    exhibit={model}
                  />
                ))}
              </Scroll>
            </Tab.Item>
          )}
        </Tab>
      )}
    </>
  )
}
export default observer(CommonTab)
