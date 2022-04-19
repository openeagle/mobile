import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import styleImport, { VantResolve } from 'vite-plugin-style-import'
import { viteMockServe } from 'vite-plugin-mock'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  return {
    base: '/',
    resolve: {
      alias: {
        '@openeagle/mobile': '/src',
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          modifyVars: {
            hack: 'true; @import "@openeagle/mobile/styles/variable.less"',
          },
        },
      },
    },
    plugins: [
      vue(),
      vueJsx(),
      styleImport({
        resolves: [VantResolve()],
      }),
      viteMockServe({
        mockPath: '/mock',
        localEnabled: command === 'serve',
      }),
    ],
  }
})
