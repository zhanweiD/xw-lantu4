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
      ]
      const storage = mapOption(mapping)
      return storage.get()
    },
  ],
])