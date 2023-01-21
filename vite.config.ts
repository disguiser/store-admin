import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'

import { createHtmlPlugin } from 'vite-plugin-html'

// https://vitejs.dev/config/
export default ({ mode }) => {
  return defineConfig({
    server: {
      port: 9529,
      proxy: {
        [`${loadEnv(mode, process.cwd()).VITE_APP_BASE_API}`]: {
          target: loadEnv(mode, process.cwd()).VITE_APP_BASE_URL,
          changeOrigin: true,
          ws: true
        }
      }
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    build: {
      sourcemap: true,
      minify: false
    },
    // esbuild: { loader: ['.js', '.jsx' ] },
    css: {
      preprocessorOptions: {
        scss: {
          charset: false
          /*
            引入var.scss全局预定义变量，
            如果引入多个文件，
            可以使用
            '@import "@/assets/scss/globalVariable1.scss";@import "@/assets/scss/globalVariable2.scss";'
            这种格式
				  */
				  // additionalData: '@import "@/styles/variables.module.scss";'
        }
      }
    },
    plugins: [
      vue({
        template: {
          compilerOptions: {
            isCustomElement: tag => tag.startsWith('ui5-')
          }
        }
      }),
      createHtmlPlugin({
        minify: true,
      }),
      vueSetupExtend(),
      createSvgIconsPlugin({
        // Specify the icon folder to be cached
        iconDirs: [resolve(process.cwd(), 'src/icons')],
        // Specify symbolId format
        symbolId: 'icon-[dir]-[name]'
      }),
      vueJsx({
        // options are passed on to @vue/babel-plugin-jsx
      })
    ]
  })
}
