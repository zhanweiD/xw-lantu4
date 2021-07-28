import icon from "./icon"
import heatmap from "./heatmap"
import odline from "./od-line"
import path from "./path"
import scatter from "./scatter"
import bim from "./bim"
import geojson from "./geojson"

const layers = {
  icon,
  heatmap,
  odline,
  path,
  scatter,
  bim,
  geojson
}

const Adapters = {}
Object.entries(layers).forEach(([k, v]) => {
  Adapters[k] = v.Adapter
})

export {Adapters}
