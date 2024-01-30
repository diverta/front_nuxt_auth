import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
export default defineNuxtConfig({

  runtimeConfig: {
    public: {
      kurocoApiDomain: 'https://dev-nuxt-auth.a.kuroco.app',
    },
  },

  devtools: { enabled: true },
  css: ['@/assets/style.scss'],

  build: {
    transpile: ['vuetify'],
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    //...
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
})
