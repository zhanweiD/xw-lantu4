// TODO 有空整个文件夹都需要重写，太乱且太多冗余无用代码
import {Field} from "./base"
import {CheckField} from "./check"
import {TextField} from "./text"
import {TextareaField} from "./textarea"
import {NumberField} from "./number"
import {SelectField} from "./select"
import {SelectFilterField} from "./select-filter"
import {SelectGradientColorField} from "./select-gradient-color"
import {SelectWithThumbnailField} from "./select-with-thumbnail"
import {SelectThemeColorField} from "./select-theme-color"
import {SwitchField} from "./switch"
import {ColorField} from "./color"
import {CodeField} from "./code"
import {RangeColorField} from "./range-color"
import {GradientColorField} from "./gradient-color"
import {MultiNumberField} from "./multi-number"
import {ConstraintsField} from "./constraints"
import {AlignmentField} from "./alignment"
import {OffsetField} from "./offset"
import {ImageField} from "./image"
import {DataField} from "./data"
import createConfigModelClass from "./create-config-model-class"
import ModelToField from "./model-to-field"

const RangeNumberField = MultiNumberField

export {
  Field,
  CheckField,
  AlignmentField,
  TextField,
  TextareaField,
  NumberField,
  SelectField,
  SelectFilterField,
  SelectGradientColorField,
  SelectThemeColorField,
  SelectWithThumbnailField,
  SwitchField,
  ColorField,
  RangeColorField,
  GradientColorField,
  MultiNumberField,
  RangeNumberField,
  ConstraintsField,
  ImageField,
  OffsetField,
  createConfigModelClass,
  ModelToField,
  CodeField,
  DataField
}
