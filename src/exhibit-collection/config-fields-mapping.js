const textSize = {
  type: "text",
  label: "textSize",
  defaultValue: 10
}

const lang = {
  type: "text",
  label: "lang",
  defaultValue: 12
}
const lat = {
  type: "text",
  label: "lat",
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
  angle,
  lang,
  lat
}

export default mappingConfig
