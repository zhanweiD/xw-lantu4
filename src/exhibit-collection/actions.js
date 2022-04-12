// 事件触发动作，支持的响应动作
export default {
  click: ['show', 'hidden', 'toggle_visible', 'href'],
  doubleClick: ['show', 'hidden'],
}

// 针对box的 show，hidden，toggle_visible，actionValue是目标对象的列表
function boxActionHandle({actionType, actionValue = []}) {
  const {boxes = []} = this?.art_?.mainFrame_ || {}
  if (!boxes || !boxes.length) return
  boxes.forEach((boxModel) => {
    if (actionValue.includes(boxModel.boxId)) {
      boxModel['dipatchAction'] && boxModel['dipatchAction'](actionType)
    }
  })
}

// 定义动作的执行方式
// 函数的this执行 exhibitModel， 其通过createExhibitModelClass生成
export const actionMap = {
  href: ({actionType, actionValue}) => {
    window.open(actionValue)
  },
  show: boxActionHandle,
  hidden: boxActionHandle,
  toggle_visible: boxActionHandle,
}
