import React from 'react'
import {observer} from 'mobx-react-lite'
import Section from './section'
import isArray from 'lodash/isArray'
import ModelToField from './model-to-field'
import IconButton from '@components/icon-button'
import isDef from '@utils/is-def'

const recusiveNode = (nodes, level = 1) => {
  return nodes.map((node) => {
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
              onClick={() => {
                node.set({effective: !node.effective})
              }}
            />
          )
        }
      >
        {isDef(fields) && Object.values(fields).map((field) => <ModelToField model={field} key={field.option} />)}
        {isArray(subSections) && recusiveNode(subSections, level + 1)}
      </Section>
    )
  })
}

const Builder = ({layers, data, exhibit}) => {
  return layers.map((layer) => {
    return (
      <div key={layer.id}>
        {data && <ModelToField model={data} />}
        <Section
          sessionId={layer.name}
          type={0}
          name={layer.name}
          key={layer.name}
          extra={
            <div className="fbh">
              <IconButton icon="add" buttonSize={24} onClick={exhibit.addLayer} />
              <IconButton icon="more" buttonSize={24} onClick={exhibit.doSomething} />
            </div>
          }
        >
          {layer.data && <ModelToField model={layer.data} />}
          {recusiveNode(layer.options.sections)}
        </Section>
      </div>
    )
  })
}

export default observer(Builder)
