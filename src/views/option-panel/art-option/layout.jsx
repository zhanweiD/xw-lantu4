import React from "react"
import {useTranslation} from "react-i18next"
import {MultiNumberField} from "@components/field"
import {observer} from "mobx-react-lite"
import Section from "@components/section"

const Layout = ({options, disabled}) => {
  const {layout} = options
  const {x, y, width, height} = layout
  const {t} = useTranslation()
  return (
    <>
      <Section sessionId="art-option-layout" name={t("layout.basic")}>
        <MultiNumberField
          label={t("layout.xy")}
          value={[x, y]}
          items={[
            {
              key: "X",
              step: 1
            },
            {
              key: "Y",
              step: 1
            }
          ]}
          readOnly={disabled}
          onChange={(value) => {
            layout.set({
              x: value[0],
              y: value[1]
            })
            options.sendLayoutEmitters()
          }}
        />
        <MultiNumberField
          label={t("layout.size")}
          value={[width, height]}
          items={[
            {
              key: "layout.width",
              step: 10
            },
            {
              key: "layout.height",
              step: 10
            }
          ]}
          min={1}
          readOnly={disabled}
          onChange={(value) => {
            layout.set({
              width: value[0],
              height: value[1]
            })
            options.sendLayoutEmitters()
          }}
        />
      </Section>
      {/* <Section sessionId="art-option-box" name={t('layout.box')}>
      <AlignmentField label={t('layout.constraints')} />
    </Section> */}
    </>
  )
}

export default observer(Layout)
