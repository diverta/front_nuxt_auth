const environment = process.env.NODE_ENV
const envSettings = require(`./env.${environment}.js`)

export default {
  env: envSettings,
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  mode: "spa",
  ssr: false,
  srcDir: "src/",
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: "static",
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    htmlAttrs: {
      lang: "ja",
    },
    titleTemplate: "%s - ",
    title: envSettings.META_TITLE,
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || "",
      },
      { hid: "robots", name: "robots", content: envSettings.ROBOTS },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },
  /*
   ** Global CSS
   */
  css: ["@/assets/main.css"],
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ["@nuxtjs/vuetify"],
  /*
   ** Nuxt.js modules
   */
  modules: ["@nuxtjs/axios", "@nuxtjs/auth", "@nuxtjs/pwa"],
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ["@/assets/variables.scss"],
    theme: {
      light: true,
    },
  },
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {
    hardSource: false,
  },
  typescript: {
    typeCheck: true,
    ignoreNotFoundWarnings: true,
  },
  router: {
    middleware: ["auth"],
  },
  axios: {
    baseURL: envSettings.BASE_URL,
    credentials: true,
  },
  auth: {
    localStorage: {
      prefix: "rcms_api.",
    },
    redirect: {
      login: "/", // ?????????????????????????????????????????????????????????????????????????????????URL
      logout: "/", // ???????????????????????????????????????URL(4.9.1????????????????????????????????????)
      callback: false,
      home: "/", // ????????????????????????????????????URL(4.9.1????????????????????????????????????)
    },
    strategies: {
      local: {
        endpoints: {
          login: {
            url: "/rcms-api/1/login",
            method: "post",
          },
          user: {
            url: "/rcms-api/1/profile",
            method: "get",
            propertyName: false,
          },
          logout: {
            url: "/rcms-api/1/logout",
            method: "post",
          },
        },
        tokenRequired: false,
        autoFetchUser: true,
      },
    },
    plugins: [ { src: '~/plugins/axios', mode: 'server' },]
  },
}
