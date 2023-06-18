import { PluginOption, defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import vueJsx from '@vitejs/plugin-vue-jsx'
import externalGlobals from "rollup-plugin-external-globals";
import { createHtmlPlugin } from 'vite-plugin-html'
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default ({ mode }) => {
  return defineConfig({
    server: {
      host: '0.0.0.0',
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
      sourcemap: loadEnv(mode, process.cwd()).VITE_ENV !== 'prod',
      rollupOptions: {
        external: [
          'vue',
          'element-plus',
          'vue-demi',
          'echarts'
        ],
        plugins: [
          externalGlobals({
	          vue: "Vue",
	          "element-plus": "ElementPlus",
            "vue-demi": "VueDemi",
            "echarts":  "echarts"
	        })
        ],
      },
    },
    // esbuild: { loader: ['.js', '.jsx' ] },
    css: {
      preprocessorOptions: {
        scss: {
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
      createSvgIconsPlugin({
        // Specify the icon folder to be cached
        iconDirs: [resolve(process.cwd(), 'src/icons')],
        // Specify symbolId format
        symbolId: 'icon-[dir]-[name]'
      }),
      vueJsx({
        // options are passed on to @vue/babel-plugin-jsx
      }),
      visualizer({
        open: false
      }) as PluginOption
    ]
  })
}
