export const layerOptionMap = new Map([
  [
    'layer',
    ({mapOption}) => {
      const mapping = [
        ['base.radius', 'radius'],
        ['base.pointSizes', 'pointSize'],
        ['base.pointColor', 'pointColor'],
        ['base.activeColor', 'activeColor'],
        ['base.inactiveColor', 'inactiveColor'],
      ]
      const storage = mapOption(mapping)
      return storage.get()
    },
  ],
])
