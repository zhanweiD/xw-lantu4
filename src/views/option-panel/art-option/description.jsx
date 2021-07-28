import React from "react"
import {useTranslation} from "react-i18next"
import {TextField} from "@components/field"
import {observer} from "mobx-react-lite"

const Description = ({options, disabled}) => {
  const {description} = options
  const {t} = useTranslation()
  return (
    <>
      <TextField
        readOnly={disabled}
        label={t("name")}
        value={description.name}
        onChange={(value) => {
          description.set({
            name: value
          })
          options.sendDescriptionEmitters()
        }}
      />
      <TextField
        readOnly={disabled}
        label={t("description.description")}
        value={description.description}
        onChange={(value) => {
          description.set({
            description: value
          })
          options.sendDescriptionEmitters()
        }}
      />
    </>
  )
}

export default observer(Description)
