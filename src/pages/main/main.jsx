import React from "react"

const Icon = ({name, size = 16, fill = "#ffffff", className, opacity = 1}) => (
  <svg
    width={size}
    style={{opacity}}
    height={size}
    fill={fill}
    className={className}
  >
    <use xlinkHref={`#${name}`} />
  </svg>
)

const Main = () => {
  return <Icon name="add" fill="#000000" />
}

export default Main
