import basicColumn from "./waves/columns/basic-column"
import i18n from "@i18n"

const categories = [
  {
    // 柱状图
    name: "classifyColumn",
    icon: "exhibit-rect",
    exhibits: [
      basicColumn // 基础柱状图
    ]
  }
]

categories.forEach((category) => {
  category.exhibits.forEach((exhibit, i) => {
    if (exhibit.completed) {
      const k = i18n.sandbox(exhibit.i18n, exhibit.id || exhibit.icon)
      exhibit.config = exhibit.config(k)
      category.exhibits[i] = {
        ...exhibit,
        key: exhibit.config.key,
        name: exhibit.config.name
      }
    }
  })
})

export {categories}
