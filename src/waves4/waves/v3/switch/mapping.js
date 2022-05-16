export const layerOptionMap = new Map([
  [
    'laer',
    ({mapOption}) => {
      const mapping = [
        ['base.radius', 'radius'],
        ['base.pointSizeItem', 'pointSizeItem'],
        ['base.pointColor', 'pointColor'],
        ['base.activeBackgroundColor', 'activeBackgroundColor'],
        ['bases.inactiveBackgroundColor', 'inactiveBackgroundColor'],
      ]
      const storage = mapOption(mapping)
      return storage.get()
    },
  ],
])
