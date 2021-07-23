import React from "react"
import c from "classnames"
import {DndProvider} from "react-dnd"
import {HTML5Backend} from "react-dnd-html5-backend"
import Header from "@views/header"
import Sidebar from "@views/sidebar"
import Editor from "@views/editor"
import OptionPanel from "@views/option-panel"
import Footer from "@views/footer"
import s from "./main.module.styl"

const Main = () => {
  return (
    <div className={c("fbv", s.main)}>
      <Header />
      <DndProvider backend={HTML5Backend}>
        <div className="fb1 fbh pr">
          <Sidebar />
          <Editor />
          <OptionPanel />
        </div>
      </DndProvider>
      <Footer />
    </div>
  )
}

export default Main
