export const layerOptionMap = new Map([
  [
    'layer',
    ({mapOption}) => {
      const mapping = [
        ['base.borderRadius', 'borderRadius'],
        ['base.singleColor', 'fontColor'],
        ['base.backgroundColor', 'backgroundColor'],
        ['base.borderWidth', 'borderWidth'],
        ['base.borderColor', 'borderColor'],
        ['base.opacity', 'opacity'],
        ['base.padding', 'padding'],
        ['base.dotColor', 'dotColor'],
        ['base.dotSize', 'dotSize'],
        ['animation.updateDuration', 'updateDuration'], // 轮播间隔
        ['animation.animationType', 'animationType'], // 轮播类型
      ]
      const storage = mapOption(mapping)
      return storage.get()
    },
  ],
])
