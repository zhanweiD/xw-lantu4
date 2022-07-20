/*
 * @Author: zhanwei
 * @Date: 2022-07-01 17:31:14
 * @LastEditors: zhanwei
 * @LastEditTime: 2022-07-19 14:30:50
 * @Description:
 */
import i18n from '@i18n'
import {isMatchCondition} from './utils'

// 事件触发动作，支持的响应动作， key是事件，值是对应的动作
export default {
  toggleSwitch: ['show', 'hidden'],
  click: ['show', 'hidden', 'toggle_visible', 'href', 'data_effect'],
  doubleClick: ['show', 'hidden', 'data_effect'],
  switchPanel: ['show', 'hidden', 'data_effect'],
  search: ['data_effect'],
  onChangeTime: ['data_filter', 'data_effect'],
}
/**
 * 动作，以及事件的统一国际化
 */
export const actionTranslation = i18n.sandbox(
  {
    toggleSwitch: ['切换', 'Toggle Switch'],
    click: ['单击', 'Click'],
    doubleClick: ['双击', 'Double click'],
    show: ['显示', 'Show'],
    hidden: ['隐藏', 'Hidden'],
    toggle_visible: ['显隐切换', 'Show and Hidden switching'],
    href: ['跳转链接', 'Jump link'],
    switchPanel: ['选项切换', 'Switch Tab'],
    data_effect: ['数据联动', 'Data Effect'],
    search: ['搜索', 'Search'],
    onChangeTime: ['切换时间', 'onChangeTime'],
    data_filter: ['数据筛选', 'DataFilter'],
  },
  'interactionLang'
)

//
function reset(boxModel) {
  boxModel['dipatchAction'] && boxModel['dipatchAction']('reset')
}
const NO_CONDITIONS = ['button', 'search', 'select', 'DatetimePicker']
// 针对box的 show，hidden，toggle_visible，actionValue是目标对象的列表
//  eventData 事件接受的数据，统一格式{data: {xxxx}}
function boxActionHandle({actionType, actionValue = {}}, eventData) {
  const {targets, conditions, triggerCondition} = actionValue
  if (!targets) return
  const {boxes = []} = this?.art_?.mainFrame_ || {} // 子画布也需要兼容
  if (!boxes || !boxes.length) return
  boxes.forEach((boxModel) => {
    if (targets.includes(boxModel.boxId)) {
      if (isMatchCondition(conditions, triggerCondition, eventData) || NO_CONDITIONS.includes(this.key)) {
        // 符合条件，触发动作
        setTimeout(() => boxModel['dipatchAction'] && boxModel['dipatchAction'](actionType, eventData), 0)
      } else {
        // 如果动作较多，会频繁触发reset，感觉去掉比较合适
        // 不符合条件，恢复到默认状态
        reset(boxModel)
      }
    }
  })
}

// 定义动作的执行方式
// 函数的this执行 exhibitModel， 其通过createExhibitModelClass生成
export const actionMap = {
  href: ({actionType, actionValue}) => {
    const {href} = actionValue
    window.open(href)
  },
  show: boxActionHandle,
  hidden: boxActionHandle,
  toggle_visible: boxActionHandle,
  data_effect: boxActionHandle,
  data_filter: boxActionHandle,
}
