import { resolve } from 'path'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

const pathResolve = (dir) => resolve(__dirname, '.', dir)

const alias = {
  '@': pathResolve('src'),
  '~': pathResolve('./'),
  '@public': pathResolve('public'),
}

// https://vitejs.dev/config/
export default defineConfig(({command, mode}) =>{
  const env = loadEnv(mode, process.cwd())
  const input = {main: resolve(__dirname, 'index.html')}
  return {
    resolve: {
      alias
    },
    server: {
      host:'0.0.0.0',
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/assets/styles/global.scss";`
        }
      }
    },
    plugins: [
      vue(),
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [resolve(process.cwd(), 'src/assets/svg')],
        // 指定symbolId格式
        symbolId: 'icon-[dir]-[name]'
      }),
      AutoImport({
        imports: ['vue', 'vue-router', 'vue-i18n'],
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      })
    ],
    build: {
      rollupOptions: {
        input
      }
    },
    define: {
      __VUE_I18N_FULL_INSTALL__: true,
      __VUE_I18N_LEGACY_API__: true,
      __INTLIFY_PROD_DEVTOOLS__: false,
    }
  }
})
