export const layerOptionMap = new Map([
  [
    'layer',
    ({mapOption}) => {
      const mapping = [
        // 标题
        ['title.show', 'titleVisible'],
        ['title.content', 'titleText'],
        ['title.textSize', 'titleSize'],
        ['title.singleColor', 'titleColor'],
        // 标签
        ['label.show', 'labelVisible'],
        ['label.labelSize', 'labelSize'],
        ['label.labelColor', 'labelColor'],
        ['label.labelPosition', 'labelPosition'],
        ['label.showLabelValue', 'showLabelValue'],
        ['label.labelValueColor', 'labelValueColor'],
        ['label.labelRightGap', 'labelRightGap'],
        ['label.labelYOffset', 'labelYOffset'],
        ['label.labelXOffset', 'labelXOffset'],
        //线
        ['line.lineOpacity', 'lineOpacity'],
        ['line.lineColor', 'lineColor'],
        //值
        ['value.valueVisible', 'valueVisible'],
        ['value.valueSize', 'valueSize'],
        ['value.width', 'valueWidth'],
        ['value.valueColor', 'valueColor'],
        ['value.valuePosition', 'valuePosition'],
        // 原角
        ['circle.circleOpacity', 'circleOpacity'],
        ['circle.circleMaxRadius', 'circleMaxRadius'],
        // 图例
        ['legend.show', 'legendVisible'],
        ['legend.textSize', 'legendSize'],
        ['legend.singleColor', 'legendColor'],
        // 选项
        ['options.trackShow', 'thresholdVisible'],
        ['options.trackBagColor', 'trackBagColor'],
        ['options.thresholdHeight', 'thresholdHeight'],
        ['options.thresholdWidth', 'thresholdWidth'],
        ['options.trackBagHeight', 'trackBagHeight'],
        ['options.trackHeight', 'trackHeight'],
      ]
      const storage = mapOption(mapping)
      return storage.get()
    },
  ],
])
