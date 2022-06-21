export const layerOptionMap = new Map([
  [
    'layer',
    ({mapOption}) => {
      const mapping = [
        ['base.textSize', 'fontSize'],
        ['base.borderRadius', 'borderRadius'],
        ['base.content', 'buttonName'],
        ['base.singleColor', 'fontColor'],
        ['base.backgroundColor', 'backgroundColor'],
        ['base.borderWidth', 'borderWidth'],
        ['base.borderColor', 'borderColor'],
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
