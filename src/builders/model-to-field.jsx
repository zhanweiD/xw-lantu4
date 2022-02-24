import React from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'react-i18next'
import fields from './fields'
import {DataField} from './data-section'

const {
  TextField,
  NumberField,
  CheckField,
  SwitchField,
  TextareaField,
  ColorField,
  MultiNumberField,
  SelectField,
  CodeField,
  GradientField,
  ColumnSelectField,
  OffsetField,
  EchartsOptionField,
} = fields
const ModelToField = ({model}) => {
  console.log(model)
  const {t} = useTranslation()
  let F
  switch (model.type) {
    case 'check':
      F = (
        <CheckField
          className="ml24"
          label={t(model.label)}
          visible={model.visible_}
          options={model.options.map((option) => {
            const origin = option.toJSON()
            return Object.assign({}, origin, {
              key: t(origin.key),
            })
          })}
          value={model.value}
          onChange={(v) => {
            model.setValue(v)
          }}
        />
      )
      break
    case 'code':
      F = (
        <CodeField
          className="ml24"
          label={t(model.label)}
          visible={model.visible_}
          value={model.value}
          height={model.height}
          mode={model.mode}
          buttons={model.buttons}
          onChange={(v) => {
            model.setValue(v)
          }}
        />
      )
      break
    case 'columnSelect':
      F = (
        <ColumnSelectField
          className="ml24"
          label={t(model.label)}
          visible={model.visible_}
          options={model.options.toJSON().map((option) => ({
            key: t(option.key),
            value: option.value,
          }))}
          value={model.value}
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
          visible={model.visible_}
          value={model.value}
          defaultValue={model.defaultValue}
          onChange={(v) => {
            model.setValue(v)
          }}
        />
      )
      break
    case 'data':
      F = (
        <DataField
          className="ml24 mt8"
          value={model.value}
          type={model.sectionStyleType}
          spaceData={model.spaceData_}
          projectData={model.projectData_}
          officialData={model.officialData_}
          onChange={(v) => {
            model.setSchema(v)
          }}
          toggleBak={() => {
            model.toggleBak()
          }}
          addSource={(v) => {
            model.addSource(v)
          }}
          removeSource={(v) => {
            model.removeSource(v)
          }}
          previewSource={() => {
            model.previewSource()
          }}
        />
      )
      break
    case 'echartsoption':
      F = (
        <EchartsOptionField
          className="ml24 mt8"
          value={model.value}
          onChange={(v) => {
            model.setSchema(v)
          }}
        />
      )
      break
    case 'gradient':
      F = (
        <GradientField
          className="ml24"
          label={t(model.label)}
          visible={model.visible_}
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
          visible={model.visible_}
          value={model.value.toJSON()}
          defaultValue={model.defaultValue.toJSON()}
          items={model.items}
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
          visible={model.visible_}
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
    case 'offset':
      F = (
        <OffsetField
          className="ml24"
          visible={model.visible_}
          value={model.value.toJSON()}
          step={model.step}
          onChange={(v) => {
            model.setValue(v)
          }}
        />
      )
      break
    case 'select':
      F = (
        <SelectField
          className="ml24"
          label={t(model.label)}
          visible={model.visible_}
          options={model.options.toJSON().map((option) => ({
            key: t(option.key),
            value: option.value,
          }))}
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
          visible={model.visible_}
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
          visible={model.visible_}
          value={model.value}
          placeholder={t(model.placeholder)}
          defaultValue={model.defaultValue}
          onChange={(v) => {
            model.setValue(v)
          }}
        />
      )
      break
    case 'text':
      F = (
        <TextField
          className="ml24"
          label={t(model.label)}
          visible={model.visible_}
          value={model.value}
          defaultValue={model.defaultValue}
          placeholder={t(model.placeholder)}
          onChange={(v) => {
            model.setValue(v)
          }}
        />
      )
      break
    case 'password':
      F = (
        <TextField
          type="password"
          className="ml24"
          label={t(model.label)}
          visible={model.visible_}
          value={model.value}
          defaultValue={model.defaultValue}
          placeholder={t(model.placeholder)}
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
