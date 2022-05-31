import React from 'react'
import {observer} from 'mobx-react-lite'

const Icon = ({name, size = 16, fill = '#ffffff', className, opacity = 1}) => (
  <svg width={size} style={{opacity}} height={size} fill={fill} className={className}>
    <use xlinkHref={`#${name}`} />
  </svg>
)

export default observer(Icon)
