import React from "react"
import {observer} from "mobx-react-lite"
import {useTranslation} from "react-i18next"
import c from "classnames"
import {TextField} from "./text"
import {TextareaField} from "./textarea"
import {CheckField} from "./check"
import {NumberField} from "./number"
import {MultiNumberField} from "./multi-number"
import {SelectField} from "./select"
import {SelectFilterField} from "./select-filter"
import {SelectGradientColorField} from "./select-gradient-color"
import {SelectWithThumbnailField} from "./select-with-thumbnail"
import {SelectThemeColorField} from "./select-theme-color"
import {SwitchField} from "./switch"
import {ColorField} from "./color"
import {RangeColorField} from "./range-color"
import {CodeField} from "./code"
import {ConstraintsField} from "./constraints"
import {GradientColorField} from "./gradient-color"
import {ImageField} from "./image"
import {AlignmentField} from "./alignment"
import {OffsetField} from "./offset"
import {DataField} from "./data"
// import {ExhibitDataField} from "./exhibit-data"

const ModelToField = observer(({model, onAction}) => {
  const {t} = useTranslation()
  let F
  switch (model.type) {
    case "text":
      F = (
        <TextField
          className={c({hide: !model.whenIsSatisfied})}
          label={t(model.label)}
          tip={t(model.tip)}
          value={model.value}
          defaultValue={model.defaultValue}
          readOnly={model.readOnly}
          placeholder={t(model.placeholder)}
          valid={model.valid}
          onChange={(v) => {
            model.setValue(v)
          }}
        />
      )
      break
    case "password":
      F = (
        <TextField
          className={c({hide: !model.whenIsSatisfied})}
          label={t(model.label)}
          tip={t(model.tip)}
          type="password"
          value={model.value}
          defaultValue={model.defaultValue}
          readOnly={model.readOnly}
          placeholder={model.placeholder}
          valid={model.valid}
          onChange={(v) => {
            model.setValue(v)
          }}
        />
      )
      break
    case "textarea":
      F = (
        <TextareaField
          className={c({hide: !model.whenIsSatisfied})}
          label={t(model.label)}
          tip={t(model.tip)}
          value={model.value}
          placeholder={t(model.placeholder)}
          defaultValue={model.defaultValue}
          readOnly={model.readOnly}
          onChange={(v) => {
            model.setValue(v)
          }}
          onBlur={(v) => {
            model.setValue(v)
          }}
        />
      )
      break
    case "select":
      F = (
        <SelectField
          className={c({hide: !model.whenIsSatisfied})}
          label={t(model.label)}
          tip={t(model.tip)}
          type="basic-select"
          options={model.options.toJSON().map((option) => ({
            key: t(option.key),
            value: option.value,
            data: option.data,
            remark: option.remark
          }))}
          value={model.value}
          readOnly={model.readOnly}
          menuPlacement={model.menuPlacement}
          isMulti={model.isMulti}
          isFixed={model.isFixed}
          hasRemark={model.hasRemark}
          isCloseMenuOnScroll={model.isCloseMenuOnScroll}
          menuMaxBottomPadding={model.menuMaxBottomPadding}
          maxMenuHeight={model.maxMenuHeight}
          onChange={(v) => {
            model.setValue(v)
          }}
        />
      )
      break
    case "selectFilter":
      F = (
        <SelectFilterField
          className={c({hide: !model.whenIsSatisfied})}
          label={t(model.label)}
          tip={t(model.tip)}
          type="basic-select"
          options={model.options.toJSON().map((option) => ({
            key: t(option.key),
            value: option.value,
            data: option.data,
            remark: option.remark
          }))}
          value={model.value}
          readOnly={model.readOnly}
          menuPlacement={model.menuPlacement}
          isMulti
          isFixed={model.isFixed}
          hasRemark={model.hasRemark}
          isCloseMenuOnScroll={model.isCloseMenuOnScroll}
          menuMaxBottomPadding={model.menuMaxBottomPadding}
          maxMenuHeight={model.maxMenuHeight}
          onAction={onAction}
          onChange={(v) => {
            model.setValue(v)
          }}
        />
      )
      break
    case "selectWithThumbnail":
      F = (
        <SelectWithThumbnailField
          className={c({hide: !model.whenIsSatisfied})}
          label={t(model.label)}
          tip={t(model.tip)}
          type="select-thumbnail"
          options={model.options.toJSON().map((option) => ({
            key: t(option.key),
            value: option.value,
            data: option.data,
            thumbnail: option.thumbnail
          }))}
          value={model.value}
          readOnly={model.readOnly}
          menuPlacement={model.menuPlacement}
          isFixed={model.isFixed}
          hasRemark={model.hasRemark}
          isCloseMenuOnScroll={model.isCloseMenuOnScroll}
          menuMaxBottomPadding={model.menuMaxBottomPadding}
          maxMenuHeight={model.maxMenuHeight}
          onChange={(v) => {
            model.setValue(v)
          }}
        />
      )
      break
    case "selectGradientColor":
      F = (
        <SelectGradientColorField
          className={c({hide: !model.whenIsSatisfied})}
          label={t(model.label)}
          tip={t(model.tip)}
          type="select-gradient-color"
          options={model.options.toJSON().map((option) => ({
            key: t(option.key),
            value: option.value,
            data: option.data
          }))}
          value={model.value}
          readOnly={model.readOnly}
          menuPlacement={model.menuPlacement}
          isFixed={model.isFixed}
          hasRemark={model.hasRemark}
          isCloseMenuOnScroll={model.isCloseMenuOnScroll}
          menuMaxBottomPadding={model.menuMaxBottomPadding}
          maxMenuHeight={model.maxMenuHeight}
          onChange={(v) => {
            model.setValue(v)
          }}
        />
      )
      break
    case "selectThemeColor":
      F = (
        <SelectThemeColorField
          className={c({hide: !model.whenIsSatisfied})}
          label={t(model.label)}
          tip={t(model.tip)}
          type="select-theme-color"
          options={model.options.toJSON().map((option) => ({
            key: t(option.key),
            value: option.value,
            data: option.colors
          }))}
          value={model.value}
          readOnly={model.readOnly}
          menuPlacement={model.menuPlacement}
          isFixed={model.isFixed}
          hasRemark={model.hasRemark}
          isCloseMenuOnScroll={model.isCloseMenuOnScroll}
          menuMaxBottomPadding={model.menuMaxBottomPadding}
          maxMenuHeight={model.maxMenuHeight}
          onChange={(v) => {
            model.setValue(v)
          }}
        />
      )
      break
    case "check":
      F = (
        <CheckField
          className={c({hide: !model.whenIsSatisfied})}
          label={t(model.label)}
          tip={t(model.tip)}
          options={model.options.toJSON().map((option) => ({key: t(option.key), value: option.value}))}
          value={model.value}
          readOnly={model.readOnly}
          disabledKey={model.disabledKey.toJSON()}
          onChange={(v) => {
            model.setValue(v)
          }}
        />
      )
      break
    case "alignment":
      F = (
        <AlignmentField
          className={c({hide: !model.whenIsSatisfied})}
          label={t(model.label)}
          tip={t(model.tip)}
          value={model.value}
          readOnly={model.readOnly}
          onChange={(v) => {
            model.setValue(v)
          }}
        />
      )
      break
    case "number":
      F = (
        <NumberField
          className={c({hide: !model.whenIsSatisfied})}
          label={t(model.label)}
          tip={t(model.tip)}
          value={model.inputValue}
          defaultValue={model.defaultValue}
          min={model.min}
          max={model.max}
          step={model.step}
          readOnly={model.readOnly}
          isExternal={false}
          onChange={(v) => {
            model.setValue(v)
          }}
          hasSlider={model.hasSlider}
          supportProcessor={model.supportProcessor}
          useProcessor={model.useProcessor}
          updateProcessor={(target) => {
            model.updateProcessor(target)
          }}
          hasSaveCode={model.hasSaveCode}
        />
      )
      break
    case "multiNumber":
      F = (
        <MultiNumberField
          className={c({hide: !model.whenIsSatisfied})}
          label={t(model.label)}
          tip={t(model.tip)}
          value={model.inputValue.toJSON()}
          defaultValue={model.defaultValue.toJSON()}
          items={model.items}
          isExternal={false}
          readOnly={model.readOnly}
          onChange={(v) => {
            model.setValue(v)
          }}
        />
      )
      break

    case "switch":
      F = (
        <SwitchField
          className={c({hide: !model.whenIsSatisfied})}
          label={t(model.label)}
          tip={t(model.tip)}
          value={model.value}
          defaultValue={model.defaultValue}
          readOnly={model.readOnly}
          onChange={(v) => {
            model.setValue(v)
          }}
        />
      )
      break
    case "color":
      F = (
        <ColorField
          className={c({hide: !model.whenIsSatisfied})}
          label={t(model.label)}
          tip={t(model.tip)}
          value={model.value}
          defaultValue={model.defaultValue}
          readOnly={model.readOnly}
          isColorArrayForm={model.isColorArrayForm}
          opacityMax={model.opacityMax}
          isFixed={model.isFixed}
          supportProcessor={model.supportProcessor}
          useProcessor={model.useProcessor}
          updateProcessor={(target) => {
            model.updateProcessor(target)
          }}
          hasSaveCode={model.hasSaveCode}
          onChange={(v) => {
            model.setValue(v)
          }}
        />
      )
      break
    case "rangeColor":
      F = (
        <RangeColorField
          className={c({hide: !model.whenIsSatisfied})}
          label={t(model.label)}
          tip={t(model.tip)}
          value={model.value}
          defaultValue={model.defaultValue}
          items={model.items}
          readOnly={model.readOnly}
          themeColors={model.themeColor}
          onChange={(v) => {
            model.setValue(v)
          }}
        />
      )
      break
    case "code":
      F = (
        <CodeField
          className={c({hide: !model.whenIsSatisfied})}
          label={t(model.label)}
          tip={t(model.tip)}
          value={model.value}
          height={model.height}
          mode={model.mode}
          buttons={model.buttons}
          // defaultValue={model.defaultValue}
          readOnly={model.readOnly}
          readOnlyCode={model.readOnlyCode}
          parent={model.parent}
          onChange={(v) => {
            model.setValue(v)
          }}
        />
      )
      break
    case "image":
      F = (
        <ImageField
          className={c({hide: !model.whenIsSatisfied})}
          label={t(model.label)}
          tip={t(model.tip)}
          value={model.value}
          defaultValue={model.defaultValue}
          options={model.options.toJSON()}
          opacity={model.opacity}
          readOnly={model.readOnly}
          onChange={(v) => {
            model.setValue(v)
          }}
        />
      )
      break
    case "constraints":
      F = (
        <ConstraintsField
          className={c({hide: !model.whenIsSatisfied})}
          label={t(model.label)}
          tip={t(model.tip)}
          value={model.value.toJSON()}
          defaultValue={model.defaultValue.toJSON()}
          readOnly={model.readOnly}
          onChange={(v) => {
            model.setValue(v)
          }}
        />
      )
      break
    case "gradientColor":
      F = (
        <GradientColorField
          className={c({hide: !model.whenIsSatisfied})}
          label={t(model.label)}
          tip={t(model.tip)}
          value={model.colorObjectForm}
          defaultValue={model.defaultValue}
          isExternal={false}
          gradientColor={model.gradientColor}
          readOnly={model.readOnly}
          onChange={(v) => {
            model.setValue(v)
          }}
        />
      )
      break
    case "offset":
      F = (
        <OffsetField
          className={c({hide: !model.whenIsSatisfied})}
          label={t(model.label)}
          tip={t(model.tip)}
          value={model.value}
          defaultValue={model.defaultValue}
          readOnly={model.readOnly}
          onChange={(v) => model.setValue(v)}
        />
      )
      break
    case "data":
      F = (
        <DataField
          label={t(model.label)}
          value={model.value}
          globalData={model.globalData_}
          projectData={model.projectData_}
          officialData={model.officialData_}
          onChange={(v) => {
            model.setValue(v)
          }}
          addSource={(v) => {
            model.addSource(v)
          }}
          removeSource={(v) => {
            model.removeSource(v)
          }}
        />
      )
      break
    default:
      F = <div>缺失的Field: {model.type}</div>
      console.warn("Field is not existed. ", model)
      break
  }
  return F
})

export default ModelToField
