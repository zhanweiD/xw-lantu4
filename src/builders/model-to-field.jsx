import React from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'react-i18next'
import fields from './fields'

const {TextField, NumberField, CheckField, SwitchField, TextareaField, ColorField, MultiNumberField} = fields
const ModelToField = ({model}) => {
  const {t} = useTranslation()
  let F
  switch (model.type) {
    case 'text':
      F = (
        <TextField
          className="ml24"
          label={t(model.label)}
          value={model.value}
          defaultValue={model.defaultValue}
          placeholder={t(model.placeholder)}
          onChange={(v) => {
            model.setValue(v)
          }}
        />
      )
      break
    case 'number':
      F = (
        <NumberField
          className="ml24"
          label={t(model.label)}
          value={model.inputValue}
          defaultValue={model.defaultValue}
          min={model.min}
          max={model.max}
          step={model.step}
          onChange={(v) => {
            model.setValue(v)
          }}
          hasSlider={model.hasSlider}
        />
      )
      break

    case 'check':
      F = (
        <CheckField
          className="ml24"
          label={t(model.label)}
          options={model.options.map((option) => option.toJSON())}
          value={model.value}
          onChange={(v) => {
            model.setValue(v)
          }}
        />
      )
      break
    case 'switch':
      F = (
        <SwitchField
          className="ml24"
          label={t(model.label)}
          value={model.value}
          onChange={(v) => {
            model.setValue(v)
          }}
        />
      )
      break
    case 'textarea':
      F = (
        <TextareaField
          className="ml24"
          label={t(model.label)}
          value={model.value}
          placeholder={t(model.placeholder)}
          defaultValue={model.defaultValue}
          onChange={(v) => {
            model.setValue(v)
          }}
        />
      )
      break
    case 'color':
      F = (
        <ColorField
          className="ml24"
          label={t(model.label)}
          value={model.value}
          defaultValue={model.defaultValue}
          onChange={(v) => {
            model.setValue(v)
          }}
        />
      )
      break
    case 'multiNumber':
      F = (
        <MultiNumberField
          className="ml24"
          label={t(model.label)}
          value={model.inputValue.toJSON()}
          defaultValue={model.defaultValue.toJSON()}
          items={model.items}
          onChange={(v) => {
            model.setValue(v)
          }}
        />
      )
      break
    default:
      F = <div>缺失的Field: {model.type}</div>
      console.warn('Field is not existed. ', model)
  }
  return F
}

export default observer(ModelToField)
