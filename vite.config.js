/*
 * @Author: your name
 * @Date: 2021-07-27 16:49:52
 * @LastEditTime: 2021-08-10 11:01:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /waveview-front4/vite.config.js
 */
import {defineConfig} from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import viteSvgIcons from 'vite-plugin-svg-icons'
import path from 'path'

/* 解析 */
const resolve = (dir) => {
  return path.join(__dirname, dir)
}

export default defineConfig({
  plugins: [
    reactRefresh(),
    viteSvgIcons({
      iconDirs: [
        path.resolve(process.cwd(), 'src/icons'),
        path.resolve(process.cwd(), 'src/waves4/icons'),
        path.resolve(process.cwd(), 'src/materials/icons'),
      ],
      symbolId: '[name]',
    }),
  ],
  resolve: {
    alias: {
      '@pages': resolve('src/pages'),
      '@views': resolve('src/views'),
      '@components': resolve('src/components'),
      '@models': resolve('src/models'),
      '@Icons': resolve('src/icons'),
      '@i18n': resolve('src/i18n'),
      '@utils': resolve('src/utils'),
      '@waves4': resolve('src/waves4'),
      '@exhibit-collection': resolve('src/exhibit-collection'),
      '@builders': resolve('src/builders'),
      '@materials': resolve('src/materials'),
      '@wavesEcharts': resolve('src/wave-echarts'),
      '@common': resolve('src/common'),
    },
  },
  server: {
    host: '0.0.0.0',
    prot: 3000,
    open: true,
    proxy: {
      '/api/v4/waveview': {
        target: 'http://192.168.90.160:9088/',
        // target: 'http://192.168.1.43:9088/',
      },
    },
    hmr: false,
    reload: true,
  },
  build: {
    brotliSize: false,
  },
})
