const textSize = {
  type: "text",
  defaultValue: 12
}

const opacity = {
  type: "number",
  step: 0.01,
  max: 1,
  min: 0
}

const angle = {
  type: "number",
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
