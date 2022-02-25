export default ({content = ''}) => {
  return {
    name: '段落',
    type: 'textarea', // 必要
    sections: [
      {
        name: 'base',
        fields: [
          {
            name: 'textarea',
            defaultValue: content,
          },
          {
            name: 'keywordColor',
            defaultValue: 'rgba(0, 255, 255, 1)'
          },
          {
            name: 'keywordFontWeight',
            defaultValue: 400,
          },
          {
            name: 'hasKeywordFontSize',
            defaultValue: false,
          },
          {
            name: 'keywordFontSize',
            defaultValue: 14,
          },
          {
            name: 'textSize',
            defaultValue: 14,
          },
          {
            name: 'textIndent',
            defaultValue: 0,
          },
          {
            name: 'lineHeight',
            defaultValue: 0,
          },
          {
            name: 'singleColor',
            defaultValue: 'rgba(255, 255, 255, 0.65)'
          },
          {
            name: 'textWeight',
            defaultValue: 100,
          },
          {
            name: 'textAlign',
            defaultValue: 'left',
          },
          {
            name: 'paragraphMargin',
            defaultValue: 0,
          }
        ]
      }
    ]
  }
}