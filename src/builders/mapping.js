const text = {
  name: "text",
  fields: [
    {
      name: "textSize",
      defaultValue: 12
    },
    {
      name: "color",
      defaultValue: "#fff"
    },
    {
      name: "angle",
      defaultValue: 30,
      isAdvance: true
    }
  ]
}

const label = {
  name: "label",
  sections: [text]
}

const rectCoordinate = {
  name: "rectCoordinate",
  isAdvance: true,
  fields: [
    {
      name: "lang",
      defaultValue: 12
    },
    {
      name: "lat",
      defaultValue: 10
    }
  ]
}

const pointCoordinate = {
  name: "pointCoordinate",

  fields: [
    {
      name: "lang",
      defaultValue: 12
    },
    {
      name: "lat",
      defaultValue: 10
    }
  ]
}

const coordinate = {
  name: "coordinate",
  sections: [pointCoordinate, rectCoordinate]
}

export const allSections = {
  label,
  text,
  coordinate,
  rectCoordinate,
  pointCoordinate
}
