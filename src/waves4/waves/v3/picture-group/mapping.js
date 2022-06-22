export const layerOptionMap = new Map([
  [
    'layer',
    ({mapOption}) => {
      const mapping = [
        ['base.leftLableFontSize', 'leftLableFontSize'],
        ['base.rightLableFontSize', 'fontSize'],
        ['base.columnNumber', 'columnNumber'],
        ['base.gap', 'gap'],
        ['base.leftLabelColor', 'leftLabelColor'],
        ['base.rightLabelColor', 'rightLabelColor'],
        ['base.backgroundColor', 'backgroundColor'],
        ['base.isMarkVisible', 'isMarkVisible'],
        ['base.animationDuration', 'animationDuration'],
      ]
      const storage = mapOption(mapping)
      return storage.get()
    },
  ],
])
