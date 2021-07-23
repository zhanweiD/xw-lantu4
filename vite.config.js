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
      "@views": resolve("src/views"),
      "@Icons": resolve("src/icons"),
      "@i18n": resolve("src/i18n"),
      "@utils": resolve("src/utils")
    }
  },
  server: {
    host: "0.0.0.0",
    prot: 3000,
    open: true,
    proxy: {
      "/api/v4/waveview": {
        target: "http://192.168.90.160:9088/"
      }
    }
  }
})
