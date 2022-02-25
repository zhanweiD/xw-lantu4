export const layerOptionMap = new Map([
  [
    'layer',
    ({mapOption, getOption}) => {
      const mapping = [
        ['base.textarea', 'content'],
        ['base.keywordColor', 'keywordColor'],
        ['base.keywordFontWeight', 'keywordFontWeight'],
        ['base.hasKeywordFontSize', 'hasKeywordFontSize'],
        ['base.keywordFontSize', 'keywordFontSize'],
        ['base.textSize', 'fontSize'],
        ['base.textIndent', 'textIndent'],
        ['base.lineHeight', 'lineHeight'],
        ['base.singleColor', 'color'],
        ['base.textWeight', 'labelWeight'],
        ['base.textAlign', 'textAlign'],
        ['base.paragraphMargin', 'paragraphMargin']
      ]
      const storage = mapOption(mapping)
      return storage.get()
    } 
  ]
])
