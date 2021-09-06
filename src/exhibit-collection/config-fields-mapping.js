const textSize = {
  type: "text",
  label: "textSize",
  defaultValue: 12
}

const opacity = {
  type: "number",
  label: "opacity",
  step: 0.01,
  max: 1,
  min: 0
}

const angle = {
  type: "number",
  label: "angle",
  step: 1,
  min: -180,
  max: 180
}

const mappingConfig = {
  textSize,
  opacity,
  angle
}

export default mappingConfig
