import React from "react"
import {observer} from "mobx-react-lite"
import Section from "./section"
import isArray from "lodash/isArray"
import {allSections} from "./mapping"
import isDef from "@utils/is-def"
import {TextField} from "./fields/text"

const recusiveNode = (nodes, level = 0) => {
  return nodes.map((node) => {
    let fields = node.fields
    let subSections = node.sections
    let section
    if (level !== 0) {
      section = allSections[node.name]
      if (!isDef(subSections)) {
        subSections = section.sections?.filter((v) => !v.isAdvance)
      } else {
        subSections = subSections.filter((sSection) => section.sections?.some((v) => v.name === sSection.name))
      }
      if (!isDef(fields)) {
        fields = section.fields?.filter((v) => !v.isAdvance)
      } else {
        fields = fields.filter((field) => section.fields?.some((v) => v.name === field.name))
      }
    }

    return (
      <Section titleClassName="pr8" sessionId={node.name} type={level} name={node.name} key={node.name}>
        {isArray(fields) &&
          fields.map((field) => <TextField className="ml24 mr16" key={field.name} label={field.name} />)}
        {isArray(subSections) && recusiveNode(subSections, level + 1)}
      </Section>
    )
  })
}

const Builder = ({sections}) => {
  return recusiveNode(sections)
}

export default observer(Builder)
