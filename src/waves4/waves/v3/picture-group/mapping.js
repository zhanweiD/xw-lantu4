export const layerOptionMap = new Map([
  [
    'layer',
    ({mapOption}) => {
      const mapping = [
        ['base.fontSize', 'fontSize'],
        ['base.columnNumber', 'columnNumber'],
        ['base.gap', 'gap'],
        ['base.leftLabelColor', 'leftLabelColor'],
        ['base.rightLabelColor', 'rightLabelColor'],
        ['base.backgroundColor', 'backgroundColor'],
      ]
      const storage = mapOption(mapping)
      return storage.get()
    },
  ],
])
