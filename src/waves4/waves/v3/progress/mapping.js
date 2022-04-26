export const layerOptionMap = new Map([
  [
    'layer',
    ({mapOption}) => {
      const mapping = [
        ['basic.padding', 'padding'],
        ['basic.height', 'rectHeight'],
        ['basic.color.effective', 'useColors'],
        ['basic.color.singleColor', 'customColors'],
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
        ['background.trackBagHeight', 'backgroudHeight'],
        ['background.arcBackgroundColor', 'backgroundColor'],
      ]
      const storage = mapOption(mapping)
      return storage.get()
    },
  ],
])
