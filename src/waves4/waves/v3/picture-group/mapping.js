export const layerOptionMap = new Map([
  [
    'layer',
    ({mapOption}) => {
      const mapping = [
        ['base.fontSize', 'fontSize'],
        ['base.columnNumber', 'columnNumber'],
        ['base.gap', 'gap'],
        ['base.labelColor', 'fontColor'],
      ]
      const storage = mapOption(mapping)
      return storage.get()
    },
  ],
])
