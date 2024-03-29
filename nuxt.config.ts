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
    '@formkit/nuxt',
    'nuxt-snackbar',
    '@nuxtjs/i18n',
    //...
  ],
  i18n: {
    locales: [
        { code: 'en', iso: 'en-US', file: 'en.json', name: 'English' },
        { code: 'ja', iso: 'ja-JP', file: 'ja.json', name: '日本語' }
    ],
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    langDir: 'locales',
    compilation: {
      strictMessage: false, // To allow html tags in locales
    },
},
  formkit: {
    // Experimental support for auto loading (see note):
    autoImport: true
  },
  snackbar: {
    top: true,
    duration: 5000
  },
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
      // @ts-ignore-next-line
      server: {
        watch: {
          usePolling: true,
        },
      },
    },
  },
})
