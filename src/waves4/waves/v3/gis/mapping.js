export const layerOptionMap = new Map([
  [
    'layer',
    ({mapOption}) => {
      const mapping = [
        // ['title.show', 'titleVisible'],
        // ['title.content', 'titleText'],
        // ['title.textSize', 'titleSize'],
        // ['title.singleColor', 'titleColor'],
      ]
      const storage = mapOption(mapping)
      return storage.get()
    },
  ],
])
