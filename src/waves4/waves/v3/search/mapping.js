export const layerOptionMap = new Map([
  [
    'layer',
    ({mapOption}) => {
      const mapping = [
        ['base.textSize', 'fontSize'],
        ['base.placeholder', 'placeholder'],
        ['base.content', 'content'],
        ['base.singleColor', 'fontColor'],
        ['base.backgroundColor', 'backgroundColor'],
        ['base.searchIconColor', 'searchIconColor'],
        ['base.iconBackgroundColor', 'iconBackgroundColor'],
        ['base.radius', 'radius'],
      ]
      const storage = mapOption(mapping)
      return storage.get()
    },
  ],
])
