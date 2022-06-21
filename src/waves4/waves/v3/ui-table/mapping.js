export const layerOptionMap = new Map([
  [
    'layer',
    ({mapOption}) => {
      const mapping = [
        ['base.rowNumber', 'rowNumber'],
        ['base.lineSpacing', 'lineSpacing'],
        ['base.columnSpacing', 'columnSpacing'],
        ['title.titleVisible', 'titleVisible'],
        ['title.titleFontSize', 'titleFontSize'],
        ['title.titleColor', 'titleColor'],
        ['title.titleBackground', 'titleBackground'],
        ['title.titleText', 'titleText'],
        ['title.titlePosition', 'titlePosition'],
        ['title.titleLowerSpacing', 'titleLowerSpacing'],
        ['tableHead.headVisible', 'headVisible'],
        ['tableHead.headFontSize', 'headFontSize'],
        ['tableHead.headFontWeight', 'headFontWeight'],
        ['tableHead.headFontColor', 'headFontColor'],
        ['tableHead.headBackground', 'headBackground'],
        ['tableHead.headPosition', 'headPosition'],
        ['tableCell.isAutoWidth', 'isAutoWidth'],
        ['unit.unitVisible', 'unitVisible'],
        ['unit.unitFontSize', 'unitFontSize'],
        ['unit.unitFontColor', 'unitFontColor'],
        ['unit.unitText', 'unitText'],
        ['unit.unitLowerSpacing', 'unitLowerSpacing'],
        ['sign.signVisible', 'signVisible'],
        ['sign.signFontColor', 'signFontColor'],
        ['sign.signWidth', 'signWidth'],
        ['rect.rectVisible', 'rectVisible'],
        ['rect.rectFontColor', 'rectFontColor'],
        ['rect.rectWidth', 'rectWidth'],
        ['rect.rectHeight', 'rectHeight'],
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
