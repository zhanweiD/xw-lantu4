export const layerOptionMap = new Map([
  [
    'layer',
    ({mapOption}) => {
      const mapping = [
        ['base.width', 'width'],
        ['base.height', 'height'],
        ['base.fontSize', 'fontSize'],
        ['base.scale', 'scale'],
        ['base.backgroundColor', 'backgroundColor'],
        ['base.pickerType', 'pickerType'],
        ['base.valueMethod', 'valueMethod'],
      ]
      const storage = mapOption(mapping)
      return storage.get()
    },
  ],
])
