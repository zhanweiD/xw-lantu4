import React from "react"
import isDef from "@utils/is-def"
import s from "./warning.module.styl"
import errorImage from "./error.png"

function Warning({onClick, content, width, height, fontSize}) {
  const containerStyle = {
    width: width || "100%",
    height: height || "100%",
    paddingTop: (isDef(height) && height / 10) || "10%",
    paddingBottom: (isDef(height) && height / 10) || "10%"
  }
  const imageStyle = {
    width: (isDef(height) && height / 2) || "120px",
    height: (isDef(height) && height / 2.5) || "120px"
  }
  const contentStyle = {
    maxWidth: (isDef(width) && width) || "100%",
    fontSize: fontSize || "20px"
  }
  return (
    <div onClick={onClick} className={s.container} style={containerStyle}>
      <img style={imageStyle} src={errorImage} alt="warning" />
      <p className={s.content} style={contentStyle}>
        {isDef(content) && content}
      </p>
    </div>
  )
}

export default Warning
