import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import styleImport from 'vite-plugin-style-import'
import { viteMockServe } from 'vite-plugin-mock'

export default defineConfig({
  base: '/hello-vue3/',
  plugins: [
    vue(),
    styleImport({
      libs: [{
        libraryName: 'element-plus',
        esModule: true,
        ensureStyleFile: true,
        resolveStyle: (name) => {
          name = name.slice(3)
          return `element-plus/packages/theme-chalk/src/${name}.scss`;
        },
        resolveComponent: (name) => {
          return `element-plus/lib/${name}`;
        },
      }]
    }),
    viteMockServe({
      mockPath: 'mock',
      localEnabled: true,
      prodEnabled: true,
      injectCode: `
        import { setupProdMockServer } from './mockProdServer'
        setupProdMockServer()
      `,
      logger: true
    })
  ]
})