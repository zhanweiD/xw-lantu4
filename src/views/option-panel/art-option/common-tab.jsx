import React from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'react-i18next'
import Tab from '@components/tab'
import Scroll from '@components/scroll'
import {recusiveNode} from '@builders'
import fields from '@builders/fields'
import Section from '@builders/section'

const {TextField, TextareaField, MultiNumberField} = fields
const CommonTab = ({box}) => {
  const {t} = useTranslation()
  const {background, name, remark, layout} = box || {}
  return (
    <>
      {box && (
        <Tab sessionId="art-option-common" className="fb1">
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
                    box.setLayout({
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
                    box.setLayout({
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
                  onChange={(value) => box.setRemark({name: value})}
                />
                <TextareaField
                  className="ml24"
                  label={t('remark')}
                  value={remark || ''}
                  onChange={(value) => box.setRemark({remark: value})}
                />
              </Section>
            </Scroll>
          </Tab.Item>
        </Tab>
      )}
    </>
  )
}
export default observer(CommonTab)
