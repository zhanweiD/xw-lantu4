export const layerOptionMap = new Map([
  [
    'layer',
    ({mapOption}) => {
      const mapping = [
        ['base.adapterContainer', 'adapterContainer'],
        ['base.rowNumber', 'rowNumber'],
        ['base.lineSpacing', 'lineSpacing'],
        ['base.columnSpacing', 'columnSpacing'],
        ['title.titleVisible', 'titleVisible'],
        ['title.titleSize', 'titleSize'],
        ['title.titleColor', 'titleColor'],
        ['title.titleBackground', 'titleBackground'],
        ['title.titleText', 'titleText'],
        ['title.titlePosition', 'titlePosition'],
        ['title.titleLowerSpacing', 'titleLowerSpacing'],
        ['tableHead.headVisible', 'headVisible'],
        ['tableHead.headFontSize', 'headFontSize'],
        ['tableHead.headFontColor', 'headFontColor'],
        ['tableHead.headBackground', 'headBackground'],
        ['tableHead.headPosition', 'headPosition'],
        ['tableCell.isAutoWidth', 'isAutoWidth'],
        ['tableCell.cellWidth', 'cellWidth'],
        ['tableCell.cellHeight', 'cellHeight'],
        ['tableCell.cellFontSize', 'cellFontSize'],
        ['tableCell.cellFontColor', 'cellFontColor'],
        ['tableCell.cellBackground', 'cellBackground'],
        ['tableCell.valueBarBackground', 'valueBarBackground'],
        ['tableCell.cellPosition', 'cellPosition'],
        ['animation.enableLoopAnimation', 'enableLoopAnimation'],
        ['animation.loopAnimationDuration', 'loopAnimationDuration'],
        ['animation.loopAnimationDelay', 'loopAnimationDelay'],
      ]
      const storage = mapOption(mapping)
      return storage.get()
    },
  ],
])
