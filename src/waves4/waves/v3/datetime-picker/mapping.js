export const layerOptionMap = new Map([
  [
    'layer',
    ({mapOption}) => {
      const mapping = [
        ['base.pickerType', 'pickerType'],
        ['base.valueMethod', 'valueMethod'],
        ['base.connectLineType', 'connectLineType'],
        ['base.isDisabled', 'isDisabled'],
      ]
      const storage = mapOption(mapping)
      return storage.get()
    },
  ],
])
