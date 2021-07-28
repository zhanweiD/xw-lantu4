import React from "react"
import c from "classnames"
import {observer} from "mobx-react-lite"
import {DndProvider} from "react-dnd"
import {HTML5Backend} from "react-dnd-html5-backend"
import Head from "@views/head"
import Footer from "@views/footer"
import Sidebar from "@views/sidebar"
import Menu from "@components/menu"
import Confirm from "@components/confirm"
import Overlay from "@components/overlay"
import FieldModal from "@components/field-modal"
import DataProcessor from "@components/data-processor"
import ColorPicker from "@components/color-picker"
import OptionPanel from "@views/option-panel"
import Editor from "@views/editor"
import Loading from "@components/loading"
import w from "@models"
import s from "./main.module.styl"

const Main = () => {
  const {user} = w
  console.log(w.overlayManager.get("menu"))
  if (!user)
    return (
      <div className="w100p h100v fbv fbjc fbac">
        <Loading data="loading" />
      </div>
    )
  return (
    <div className={c("fbv", s.main)}>
      <Head />
      <DndProvider backend={HTML5Backend}>
        <div className="fb1 fbh oh pr">
          <Sidebar />
          <Editor />
          <OptionPanel />
        </div>
      </DndProvider>
      <Footer />
      <Menu model={w.overlayManager.get("menu")} />
      <Confirm model={w.overlayManager.get("confirm")} />
      <Overlay model={w.overlayManager.get("modal")} />
      <FieldModal model={w.overlayManager.get("fieldModal")} />
      <DataProcessor model={w.overlayManager.get("dataProcessor")} />
      <ColorPicker model={w.overlayManager.get("colorPicker")} />
    </div>
  )
}

export default observer(Main)
