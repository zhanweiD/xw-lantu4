import React, {useEffect} from "react"
import {observer} from "mobx-react-lite"
import Upload from "@components/upload"

const UploadExcel = ({height, name, onOk, className = "p16"}) => {
  const [drag, setDrag] = React.useState(false)
  const dropRef = React.createRef()
  const handleDragIn = () => {
    setDrag(true)
  }
  const handleDragOut = () => {
    setDrag(false)
  }

  useEffect(() => {
    const {current} = dropRef
    current.addEventListener("dragenter", handleDragIn)
    current.addEventListener("dragleave", handleDragOut)
    return () => {
      current.removeEventListener("dragenter", handleDragIn)
      current.removeEventListener("dragleave", handleDragOut)
    }
  }, [])
  return (
    <Upload
      accept=".xlsx,.xls"
      onOk={(files) => {
        setDrag(false)
        onOk(files)
      }}
      multiple={false}
    >
      <div className={className}>
        <div
          ref={dropRef}
          style={{height: `${height}px`}}
          className={
            drag
              ? "fs12 fbac fbjc grayNote cfw8 wh100p fbh"
              : "fs12 fbac fbjc grayNote cfw4 wh100p fbh"
          }
        >
          <div className="noevent">{name}</div>
        </div>
      </div>
    </Upload>
  )
}

export default observer(UploadExcel)
