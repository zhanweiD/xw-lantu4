/*
 * @Author: zhanwei
 * @Date: 2022-06-21 15:51:01
 * @LastEditors: zhanwei
 * @LastEditTime: 2022-07-19 14:32:09
 * @Description:
 */
import React from 'react'
// 对象选择
import {ConditionTargetSelect} from './target-select'
// 跳转链接
import Href from './href'

const fields = {
  href: Href,
  hidden: ConditionTargetSelect,
  toggle_visible: ConditionTargetSelect,
  show: ConditionTargetSelect,
  default: ConditionTargetSelect,
  tabShow: ConditionTargetSelect,
  data_effect: ConditionTargetSelect,
  data_filter: ConditionTargetSelect,
}
// restProps

/**
 * 所有的组件都是非受控组件
 * 接受2个参数：defaultValue、onChange
 * value 类型自定义，如果业务负责可封装成一个对象，反正最终向上同步值时，只有一个value字段，内容自定（跟事件的解析有关）
 */
const InteractionField = ({type = 'default', ...restProps}) => {
  const FieldComponent = fields[type]
  if (!FieldComponent) {
    return <div className="fbh fbjc fbac">{`type: ${type} 该动作类型组件未找到!`}</div>
  }
  return <FieldComponent {...restProps} />
}

export default InteractionField
