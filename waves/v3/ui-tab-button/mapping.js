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
      ]
      const storage = mapOption(mapping)
      return storage.get()
    },
  ],
])
