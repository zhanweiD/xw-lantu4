import React from 'react'
import {observer} from 'mobx-react-lite'
import Section from './section'
import isArray from 'lodash/isArray'
import ModelToField from './model-to-field'

const recusiveNode = (nodes, level = 1) => {
  return nodes.map((node) => {
    let fields = node.fields
    let subSections = node.sections
    return (
      <Section titleClassName="pr8" sessionId={node.name} type={level} name={node.name} key={node.name}>
        {isArray(fields) &&
          fields.map((field) => {
            return Object.entries(field).map(([key, value]) => {
              return <ModelToField model={value} key={key} />
            })
          })}
        {isArray(subSections) && recusiveNode(subSections, level + 1)}
      </Section>
    )
  })
}

const Builder = ({layers, data}) => {
  return layers.map((layer) => {
    return (
      <div key={layer.id}>
        {data && <ModelToField model={data} />}
        <Section titleClassName="pr8" sessionId={layer.name} type={0} name={layer.name} key={layer.name}>
          {layer.data && <ModelToField model={layer.data} />}
          {recusiveNode(layer.options.sections)}
        </Section>
      </div>
    )
  })
}

export default observer(Builder)
