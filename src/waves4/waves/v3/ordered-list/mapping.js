export const layerOptionMap = new Map([
  [
    'layer',
    ({mapOption}) => {
      const mapping = [
        //标题
        ['title.show', 'titleVisible'],
        ['title.content', 'titleText'],
        ['title.textSize', 'titleSize'],
        ['title.singleColor', 'titleColor'],
        // 标签
        ['label.labelVisible', 'labelVisible'],
        ['label.labelSize', 'labelSize'],
        ['label.labelColor', 'labelColor'],
        ['label.valueVisible', 'labelVisible'],
        //数值
        ['value.valueVisible', 'valueVisible'],
        ['value.valueSize', 'valueSize'],
        ['value.singleColor', 'valueColor'],
        // 其他选项
        ['options.gap', 'gap'],
        ['options.lineOffset', 'lineOffset'],
        ['options.lineHeight', 'lineHeight'],
        ['options.gradientDirection', 'gradientDirection'],
        ['options.bgLineColor', 'bgLineColor'],
        ['options.maxRow', 'maxRow'],

        ['options.tooltipVisible', 'tooltipVisible'],
        ['options.tooltipEventType', 'tooltipEventType'],
        ['options.enableLoopTooltip', 'enableLoopTooltip'],
      ]
      const storage = mapOption(mapping)
      return storage.get()
    },
  ],
])
