export const layerOptionMap = new Map([
  [
    'layer',
    ({mapOption}) => {
      const mapping = [
        ['basic.padding', 'padding'],
        //标题
        ['title.show', 'titleVisible'],
        ['title.content', 'titleText'],
        ['title.textSize', 'titleSize'],
        ['title.singleColor', 'titleColor'],
        // 标签
        ['label.show', 'valueVisible'],
        ['label.labelSize', 'labelSize'],
        ['label.labelColor', 'labelColor'],
        ['label.decimalNumber', 'percentNum'],
        ['label.labelYOffset', 'valueOffsetY'],
        ['rect.height', 'rectHeight'],
        ['rect.trackBagHeight', 'backgroudHeight'],
        ['rect.arcBackgroundColor', 'backgroundColor'],
      ]
      const storage = mapOption(mapping)
      return storage.get()
    },
  ],
])
