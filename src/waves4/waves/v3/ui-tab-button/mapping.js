export const layerOptionMap = new Map([
  [
    'layer',
    ({mapOption}) => {
      const mapping = [
        ['basic.width', 'width'],
        ['basic.height', 'height'],
        ['basic.textSize', 'fontSize'],
        ['basic.alignmentDirection', 'alignmentDirection'],
        ['basic.inactiveColor', 'inactiveColor'],
        ['basic.activeColor', 'activeColor'],
        ['basic.backgroundColor', 'backgroundColor'],
        ['basic.borderWidth', 'borderWidth'],
        ['basic.activeBorderWidth', 'activeBorderWidth'],
      ]
      const storage = mapOption(mapping)
      return storage.get()
    },
  ],
])
