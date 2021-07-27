import React, {useState} from "react"
import {observer} from "mobx-react-lite"
import Overlay from "@components/overlay"
import SectionFields from "@components/section-fields"
// import s from './field-modal.module.styl'

const fieldModal = ({model}) => {
  const [modalSchema, setModalSchema] = useState({})

  return (
    <Overlay model={model} outputData={modalSchema}>
      {model.content && (
        <SectionFields
          model={model.content}
          onChange={(schema) => {
            setModalSchema(schema)
          }}
        />
      )}
    </Overlay>
  )
}

export default observer(fieldModal)
