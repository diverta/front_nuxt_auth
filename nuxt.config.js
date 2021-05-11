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
    css: [],
    /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
    plugins: ['@/plugins/parser'],
    /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
    components: true,
    /*
   ** Nuxt.js dev-modules
   */
    buildModules: ['@nuxtjs/vuetify'],
    /*
   ** Nuxt.js modules
   */
    modules: [
        '@nuxtjs/axios',
        '@nuxtjs/auth',
        ['@nuxtjs/pwa', { workbox: false, autoRegister: false, manifest: { publicPath: '/_nuxt/', crossorigin: 'use-credentials' } }],
        'nuxt-i18n'],
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
            { code: 'en', iso: 'en-US' },
            { code: 'ja', iso: 'ja-JP' }
        ],
        defaultLocale: 'en',
        strategy: 'prefix_except_default',
        vueI18n: {
            fallbackLocale: 'en',
            messages: {
                en: {
                    welcome: 'Welcome'
                },
                ja: {
                    welcome: 'ようこそ'
                }
            }
        },
        vueI18nLoader: true
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
    typescript: {
        typeCheck: true,
        ignoreNotFoundWarnings: true
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
    ]
};
