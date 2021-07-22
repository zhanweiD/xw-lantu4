import {defineConfig} from "vite"
import reactRefresh from "@vitejs/plugin-react-refresh"
import viteSvgIcons from "vite-plugin-svg-icons"
import path from "path"

/* 解析 */
const resolve = (dir) => {
  return path.join(__dirname, dir)
}

export default defineConfig({
  plugins: [
    reactRefresh(),
    viteSvgIcons({
      iconDirs: [path.resolve(process.cwd(), "src/icons")],
      symbolId: "[name]"
    })
  ],
  resolve: {
    alias: {
      "@pages": resolve("src/pages"),
      "@Icons": resolve("src/icons")
    }
  }
})
