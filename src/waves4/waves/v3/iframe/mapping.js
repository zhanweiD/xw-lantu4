export const layerOptionMap = new Map([
  [
    'layer',
    ({mapOption}) => {
      const mapping = [
        ['base.isMarkVisible', 'isMarkVisible'],
        ['base.borderWidth', 'borderWidth'],
        ['base.borderColor', 'borderColor'],
        ['base.scrolling', 'scrolling'],
        ['base.isCustomSize', 'isCustomSize'],
        ['base.width', 'width'],
        ['base.height', 'height'],
      ]
      const storage = mapOption(mapping)
      return storage.get()
    },
  ],
])
