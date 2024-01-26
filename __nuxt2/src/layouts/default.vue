<template>
    <v-app
        class="l-content_wrap"
        :class="[
            $auth.loggedIn ? 'p-dashboard' : 'p-login',
            $route.name === 'index' ? 'p-home' : undefined
        ]"
    >
        <v-navigation-drawer v-if="$auth.loggedIn"
                             id="c-navi_side"
                             v-model="drawer"
                             :mini-variant="miniVariant"
                             :clipped="clipped"
                             left
                             fixed
                             dark
                             temporary
                             :permanent="$vuetify.breakpoint.lgAndUp"
                             :hide-overlay="$vuetify.breakpoint.lgAndUp"
        >
            <div class="text-center py-4">
                <a href="/">
                    <img src="~/assets/images/logo.png?width=150" class="c-navi_side-logo">
                </a>
            </div>
            <v-list>
                <v-list-item
                    v-for="(item, i) in items"
                    :key="i"
                    :to="localePath(item.to)"
                    router
                    exact
                >
                    <v-list-item-action>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title
                            v-text="
                                $auth.loggedIn && item.titleLoggedIn
                                    ? item.titleLoggedIn
                                    : item.title
                            "
                        />
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-app-bar :clipped-left="clipped" color="#1414A0" dense dark app class="l-header_toolbar">
            <v-app-bar-nav-icon v-if="$auth.loggedIn" @click.stop="drawer = !drawer" />
            <v-spacer />

            <v-toolbar-title height="30" :to="localePath('/')" class="l-header_user" v-text="subtitle" />

            <div class="l-header_lang">
                <v-select
                    :value="$i18n.localeProperties.name"
                    :items="$i18n.locales.map((locale) => locale.name)"
                    @input="(n) => $i18n.setLocale($i18n.locales.find(({ name }) => name === n).code)"
                />
            </div>

            <template v-if="$auth.loggedIn">
                <v-btn icon class="l-header_logout" @click="logout">
                    <v-icon>mdi-exit-to-app</v-icon>
                </v-btn>
            </template>
            <template v-else>
                <div v-if="$route.name === 'signup'" class="white--text">
                    <span>Already have an account?</span>
                    <button
                        class="c-btn c-btn_sm c-btn_dark ml-2"
                        nuxt
                        @click="() => $router.push(localePath('/'))"
                    >
                        {{ $t('common.sign_in') }}
                    </button>
                </div>
                <div v-else class="white--text">
                    <span class="d-none d-sm-inline">New to Muzica?</span>
                    <button
                        class="c-btn c-btn_sm c-btn_dark ml-2"
                        nuxt
                        @click="() => $router.push(localePath('/signup/'))"
                    >
                        Sign Up
                    </button>
                </div>
            </template>
        </v-app-bar>
        <v-main>
            <v-container class="l-content_inner" fluid>
                <nuxt />
            </v-container>
        </v-main>

        <v-footer color="#1414A0" padless>
            <v-row justify="center" no-gutters class="pt-3">
                <a href="https://github.com/diverta/front_nuxt_auth"><small class="my-4 pt-3 l-footer_copyright">Github repository</small></a>
                <a href="https://kuroco.app/"><img src="~/assets/images/logo-kuroco.svg" width="120" class="pl-4 l-footer_logo"></a>
                <v-col class="#1414A0 text-center white--text" cols="12" />
            </v-row>
        </v-footer>

        <v-snackbar
            v-model="snackbarVisible"
            top
            :color="snackbarColor"
            timeout="2000"
        >
            {{ $store.getters["snackbar/message"] }}

            <template #action="{ attrs }">
                <v-btn text v-bind="attrs" @click="() => snackbarVisible = false">
                    {{ $t('common.close') }}
                </v-btn>
            </template>
        </v-snackbar>
    </v-app>
</template>

<script>
export default {
    data() {
        return {
            langDefault: 'English',
            clipped: false,
            drawer: false,
            fixed: false,
            items: [
                {
                    icon: 'mdi-home',
                    title: 'Home',
                    titleLoggedIn: 'Home',
                    to: '/'
                },
                {
                    icon: 'mdi-newspaper-variant',
                    title: 'Articles',
                    to: '/topics_list'
                },
                {
                    icon: 'mdi-star',
                    title: 'Starred',
                    to: '/favourite'
                },
                {
                    icon: 'mdi-account-tie',
                    title: 'Member',
                    to: '/member'
                },
                {
                    icon: 'mdi-account-box',
                    title: 'My Profile',
                    to: '/profile'
                },
                {
                    icon: 'mdi-send',
                    title: 'Feedback',
                    to: '/inquiry'
                }
            ],
            miniVariant: false,
            right: true,
            rightDrawer: false
        };
    },
    computed: {
        subtitle() {
            return this.$store.$auth.loggedIn
                ? `${this.$i18n.t('common.hi')}${this.$auth.user.name1}`
                : '';
        },
        // snackbarが自動でfalseに設定するためセッタを用意して、明示的にdispatchからOffするようにする
        snackbarVisible: {
            get() {
                return this.$store.state.snackbar.isEnable;
            },
            set() {
                return this.$store.dispatch('snackbar/snackOff');
            }
        },
        snackbarColor() {
            return this.$store.state.snackbar.color;
        }
    },
    methods: {
        async logout() {
            await this.$auth.logout();
            this.$snackbar.info(this.$i18n.t('slackbar.logged_out'));
            this.$router.push(this.localePath('/'));
        }
    }
};
</script>
