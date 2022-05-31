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
        ['base.borderColor', 'borderColor'],
        ['base.borderWidth', 'borderWidth'],
        ['base.isDisplayTextNum', 'isDisplayTextNum'],
        ['base.isDisabled', 'isDisabled'],
        ['base.maxLength', 'maxLength'],
      ]
      const storage = mapOption(mapping)
      return storage.get()
    },
  ],
])
