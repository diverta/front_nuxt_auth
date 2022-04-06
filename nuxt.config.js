const environment = process.env.NODE_ENV;
const envSettings = require(`./env.${environment}.js`);

export default {
    env: envSettings,
    /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
    ssr: false,
    srcDir: 'src/',
    /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
    target: 'static',
    /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
    head: {
        htmlAttrs: {
            lang: 'ja'
        },
        titleTemplate: '%s - ',
        title: envSettings.META_TITLE,
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            {
                hid: 'description',
                name: 'description',
                content: process.env.npm_package_description || ''
            },
            {
                hid: 'og:title',
                'data-kuroco-replace': 'og_title',
                property: 'og:title',
                content: 'Kuroco sample'
            },
            {
                hid: 'og:description',
                'data-kuroco-replace': 'og_description',
                property: 'og:description',
                content: 'Kuroco sample page'
            },
            { hid: 'robots', name: 'robots', content: envSettings.ROBOTS }
        ],
        link: [
            { rel: 'icon', type: 'image/svg+xml', href: '/icon_kuroco.svg' },
            { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
            { rel: 'preconnect', href: 'https://cdn.jsdelivr.net' },
            { rel: 'preconnect', href: 'https://dev-nuxt-auth.a.kuroco.app' }
        ]
    },
    /*
   ** Global CSS
   */
    css: [
        '@/assets/style.scss'
    ],
    /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
    plugins: [
        '@/plugins/axios',
        '@/plugins/snackbar.client',
        '@/plugins/parseFormulateSchema.client',
        '@/plugins/formulateInputsRegister.client'
    ],
    /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
    components: true,
    /*
   ** Nuxt.js dev-modules
   */
    buildModules: [
        '@nuxtjs/vuetify',
        '@nuxtjs/date-fns',
        // Doc: https://github.com/nuxt-community/eslint-module
        ['@nuxtjs/eslint-module', { fix: true }],
        // Doc: https://github.com/nuxt-community/stylelint-module
        ['@nuxtjs/stylelint-module', { fix: true }],
        '@braid/vue-formulate/nuxt'
    ],
    /*
   ** Nuxt.js modules
   */
    modules: [
        '@nuxtjs/axios',
        '@nuxtjs/auth',
        ['@nuxtjs/pwa', { workbox: false, autoRegister: false, manifest: { publicPath: '/_nuxt/', crossorigin: 'use-credentials' } }],
        '@nuxtjs/i18n',
        // ['@nuxtjs/google-gtag', {
        //     id: 'G-XXXXXXXX',
        //     config: {
        //         anonymize_ip: true, // anonymize IP
        //         send_page_view: false // might be necessary to avoid duplicated page track on page reload
        //     },
        //     debug: false, // enable to track in dev mode
        //     disableAutoPageTrack: false, // disable if you don't want to track each page route with router.afterEach(...).
        //     additionalAccounts: [{
        //         id: 'UA-XXXXXXXXX-X' // required if you are adding additional accounts
        //     }]
        // }],
    ],
    /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
    vuetify: {
        customVariables: ['@/assets/variables.scss'],
        theme: {
            disable: true
        }
    },
    i18n: {
        locales: [
            { code: 'en', iso: 'en-US', file: 'en.json', name: 'English' },
            { code: 'ja', iso: 'ja-JP', file: 'ja.json', name: '日本語' }
        ],
        defaultLocale: 'en',
        strategy: 'prefix_except_default',
        vueI18n: {
            fallbackLocale: 'en',
        },
        vueI18nLoader: true,
        langDir: '@/locales/'
    },
    /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
    build: {
        hardSource: false,
        babel: {
            presets({ isServer }, [preset, options]) {
                options.loose = true;
            }
        }
    },
    router: {
        middleware: ['auth']
    },
    axios: {
        baseURL: envSettings.BASE_URL,
        credentials: true
    },
    auth: {
        localStorage: {
            prefix: 'rcms_api.'
        },
        redirect: {
            login: '/', // 未ログイン時に認証ルートへアクセスした際のリダイレクトURL
            logout: '/', // ログアウト時のリダイレクトURL(4.9.1ではそのままでは動かない)
            home: '/', // ログイン後のリダイレクトURL(4.9.1ではそのままでは動かない)
            callback: false
        },
        strategies: {
            local: {
                endpoints: {
                    login: {
                        url: '/rcms-api/1/login',
                        method: 'post'
                    },
                    user: {
                        url: '/rcms-api/1/profile',
                        method: 'get',
                        propertyName: false
                    },
                    logout: {
                        url: '/rcms-api/1/logout',
                        method: 'post'
                    }
                },
                tokenRequired: false,
                autoFetchUser: true
            }
        }
    },
    overrides: [
        {
            files: ['*.vue'],
            processor: 'vue/.vue'
        }
    ],
    formulate: {
        configPath: '@/../formulate.config.js'
    }
};
