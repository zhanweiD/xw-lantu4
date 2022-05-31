import React from 'react'
import {observer} from 'mobx-react-lite'
import Overlay from '@components/overlay'
import {MOverlay} from '@models/common/overlay'
import SectionFields from '@components/section-fields'

// Modal组件
const Modal = ({
  children,
  className,
  closable,
  title,
  isVisible,
  model,
  hasMask,
  height,
  width,
  hideWhenOutsideClick = false,
  onClose = () => {},
  buttons = [],
}) => {
  const overlay = MOverlay.create({
    title,
    id: 'modal',
    hasMask,
    height,
    width,
    isVisible,
    closable,
    hideWhenOutsideClick,
  })
  return (
    <>
      {isVisible && (
        <Overlay model={overlay} className={className} onClose={onClose} buttons={buttons}>
          {model ? <SectionFields model={model} /> : children}
        </Overlay>
      )}
    </>
  )
}

export default observer(Modal)
