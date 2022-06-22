export const layerOptionMap = new Map([
  [
    'layer',
    ({mapOption}) => {
      const mapping = [
        ['base.radius', 'radius'],
        ['base.placeholder', 'placeholder'],
        ['base.singleColor', 'fontColor'],
        ['base.backgroundColor', 'backgroundColor'],
        ['base.optionFontColor', 'optionFontColor'],
        ['base.optionBackgroundColor', 'optionBackgroundColor'],
        ['base.optionHoverTextColor', 'optionHoverTextColor'],
        ['base.optionHoverBackgroundColor', 'optionHoverBackgroundColor'],
        ['base.supportSearch', 'supportSearch'],
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
