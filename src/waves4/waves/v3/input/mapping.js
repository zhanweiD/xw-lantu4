export const layerOptionMap = new Map([
  [
    'layer',
    ({mapOption}) => {
      const mapping = [
        ['base.textSize', 'fontSize'],
        ['base.placeholder', 'placeholder'],
        ['base.content', 'content'],
        ['base.singleColor', 'fontColor'],
        ['base.backgroundColor', 'backgroundColor'],
        ['base.radius', 'radius'],
        ['base.isDisplayTextNum', 'isDisplayTextNum'],
        ['base.isDisabled', 'isDisabled'],
        ['base.maxLength', 'maxLength'],
        ['border.borderWidth', 'borderWidth'],
        ['border.borderColor', 'borderColor'],
        ['border.focusColor', 'focusColor'],
        ['border.shadowColor', 'shadowColor'],
        ['border.shadowWidth', 'shadowWidth'],
        ['border.shadowFuzziness', 'shadowFuzziness'],
      ]
      const storage = mapOption(mapping)
      return storage.get()
    },
  ],
])
