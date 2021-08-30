import React, {useEffect} from "react"
import {observer} from "mobx-react-lite"
import {isStateTreeNode} from "mobx-state-tree"
import {useTranslation} from "react-i18next"
import Section from "@components/section"
import {ModelToField} from "@components/field"
import c from "classnames"

// 将传入的model的field类型的属性渲染成组件
// ! 仅会渲染ield类型的属性，非field类型会过滤掉
const SectionFields = observer(
  ({
    sections = [],
    sessionId,
    model = {},
    className,
    onChange = () => {},
    onListenChangeOption = () => {},
    onAction = () => {}
  }) => {
    const {t} = useTranslation()

    const sectionNamesHasConfig = []
    const sectionNames = (isStateTreeNode(model.sections) ? model.sections.toJSON() : sections).map((section) => {
      if (typeof section === "string") {
        return section
      }
      sectionNamesHasConfig.push(section.section)
      return section.section
    })

    const fieldKeys = model.getFieldKeys()

    const fieldChangeOption = model.getChangeOption()

    const fields = Object.entries(model).filter(([key]) => fieldKeys.indexOf(key) > -1)

    useEffect(() => {
      if (fieldChangeOption) {
        onListenChangeOption(fieldChangeOption)
      }
    }, [fieldChangeOption])

    useEffect(() => {
      if (fieldChangeOption) {
        onChange(model.getSchema())
      }
    }, [fieldChangeOption])

    return sectionNames.map((sectionName) => {
      const sectionFields = fields.filter(([, fieldModel]) => {
        return fieldModel.section === sectionName && fieldModel.whenIsSatisfied === true
      })
      if (sectionFields.length) {
        return (
          <Section
            key={sectionName}
            childrenClassName={c("pt8 pb8", className)}
            sessionId={sessionId ? `${sessionId}.${sectionName}` : undefined}
            name={t(sectionName)}
            hideNameBar={sectionName === "__hide__"}
          >
            {sectionFields.map(
              ([key, fieldModel]) =>
                fieldModel.type !== "sectionConfig" && <ModelToField key={key} model={fieldModel} onAction={onAction} />
            )}
          </Section>
        )
      }
      return null
    })
  }
)

export default SectionFields
