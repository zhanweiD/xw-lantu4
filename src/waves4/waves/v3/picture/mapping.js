export const layerOptionMap = new Map([
  [
    'layer',
    ({mapOption}) => {
      const mapping = [
        ['base.borderRadius', 'borderRadius'],
        ['base.content', 'buttonName'],
        ['base.singleColor', 'fontColor'],
        ['base.backgroundColor', 'backgroundColor'],
        ['base.borderWidth', 'borderWidth'],
        ['base.borderColor', 'borderColor'],
        ['base.opacity', 'opacity'],
        ['base.padding', 'padding'],
      ]
      const storage = mapOption(mapping)
      return storage.get()
    },
  ],
])
