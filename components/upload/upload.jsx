/**
 * @author 南风
 * @description 文件上传组件
 */
import React from 'react'
import {observer} from 'mobx-react-lite'
import {useDropzone} from 'react-dropzone'

const Upload = ({accept, disabled, placeholder, children, multiple = true, onOk = () => {}}) => {
  const {getRootProps, getInputProps} = useDropzone({
    accept,
    disabled,
    multiple,
    onDrop: (acceptedFiles) => {
      onOk(acceptedFiles)
    },
  })
  return (
    <aside>
      {placeholder && <div className="lh32">{placeholder}</div>}
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <div {...getRootProps({className: 'dropzone'})}>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <input {...getInputProps()} />
        {children}
      </div>
    </aside>
  )
}

export default observer(Upload)
