import React from 'react'
import {observer} from 'mobx-react-lite'
import Section from './section'
import ModelToField from './model-to-field'
import IconButton from '@components/icon-button'
import isDef from '@utils/is-def'
import {useTranslation} from 'react-i18next'

export const recusiveNode = ({sections, fields, level = 1}) => {
  return (
    <>
      {fields && Object.entries(fields).map(([key, field]) => <ModelToField model={field} key={key} />)}
      {sections &&
        Object.values(sections).map((node) => {
          let fields = node.fields
          let subSections = node.sections
          return (
            <Section
              titleClassName="pr8"
              sessionId={node.name}
              type={level}
              name={node.name}
              key={node.name}
              headIcon={
                isDef(node.effective) && (
                  <IconButton
                    className="ml8"
                    icon={node.effective ? 'eye-open' : 'eye-close'}
                    buttonSize={18}
                    onClick={node.toggleEffective}
                  />
                )
              }
            >
              {isDef(fields) && Object.entries(fields).map(([key, field]) => <ModelToField model={field} key={key} />)}
              {isDef(subSections) && recusiveNode({sections: subSections, level: level + 1})}
            </Section>
          )
        })}
    </>
  )
}

const Builder = ({layers, data, dimension, exhibit}) => {
  const {t} = useTranslation()

  return (
    <>
      {data && <ModelToField model={data} />}
      {dimension && (
        <Section sessionId={`${exhibit.id}.dimension`} type={0} name={t('dimension')} key={t('dimension')}>
          {recusiveNode({fields: dimension.fields, sections: dimension.sections, level: 0})}
        </Section>
      )}
      {layers.map((layer) => {
        return (
          <div key={layer.id}>
            <Section
              sessionId={`${layer.id}.${layer.name}`}
              type={0}
              name={layer.name}
              key={layer.name}
              extra={
                <div className="fbh">
                  <IconButton
                    icon={layer.effective ? 'eye-open' : 'eye-close'}
                    buttonSize={24}
                    onClick={layer.toggleEffective}
                  />
                  <IconButton icon="more" buttonSize={24} onClick={exhibit.doSomething} />
                </div>
              }
            >
              {layer.data && <ModelToField model={layer.data} />}
              {recusiveNode({
                sections: layer.options.sections,
              })}
            </Section>
          </div>
        )
      })}
    </>
  )
}

export default observer(Builder)
