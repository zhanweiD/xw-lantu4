/*
 * @Author: zhanwei
 * @Date: 2022-06-24 10:56:24
 * @LastEditors: zhanwei
 * @LastEditTime: 2022-06-29 18:03:53
 * @Description:
 */
export const layerOptionMap = new Map([
  [
    'layer',
    ({mapOption}) => {
      const mapping = [
        ['basic.alignmentDirection', 'alignmentDirection'],
        ['basic.fontSize', 'fontSize'],
        ['background.activeColor', 'activeColor'],
        ['basic.activeTextColor', 'activeTextColor'],
        ['basic.activeBorderWidth', 'activeBorderWidth'],
        ['basic.inactiveTextColor', 'inactiveTextColor'],
        ['background.inactiveColor', 'inactiveColor'],
        // ['basic.backgroundColor', 'backgroundColor'],
        // ['basic.borderWidth', 'borderWidth'],
      ]
      const storage = mapOption(mapping)
      return storage.get()
    },
  ],
])
