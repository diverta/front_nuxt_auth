<template>
    <v-app class="l-content_wrap">
        <v-navigation-drawer v-if="auth.loggedIn"
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
                    :to="item.to"
                    router
                    exact
                >
                    <v-list-item-action>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title
                            v-text="
                                auth.loggedIn && item.title_loggedIn
                                    ? item.title_loggedIn
                                    : item.title
                            "
                        />
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-app-bar :clipped-left="clipped" color="#1414A0" dense dark app :hide-on-scroll="!auth.loggedIn">
            <v-app-bar-nav-icon v-if="auth.loggedIn" @click.stop="drawer = !drawer" />
            <v-spacer />

            <v-toolbar-title height="30" to="/" class="l-header_user" v-text="subtitle" />

            <div class="l-header_lang">
                <v-select
                    v-model="langDefault"
                    :items="lang"
                />
            </div>

            <v-btn v-if="auth.loggedIn" icon class="l-header_logout" @click="logout">
                <v-icon>mdi-exit-to-app</v-icon>
            </v-btn>

            <!--
      <div v-if="!auth.loggedIn">
        <NuxtLink to="/signup"> Sign Up </NuxtLink>
      </div>
      -->
            <div v-if="!auth.loggedIn && !signUpPage">
                <span class="d-none d-sm-inline">New to Muzica?</span><button class="c-btn c-btn_sm c-btn_dark ml-2" nuxt @click="go_page('/signup/')">
                    Sign Up
                </button>
            </div>
            <div v-else-if="!auth.loggedIn">
                Already have an account? <button class="c-btn c-btn_sm c-btn_dark ml-2" nuxt @click="go_page('/')">
                    Sign In
                </button>
            </div>
        </v-app-bar>
        <v-main>
            <!--<br />
      <div align="center" v-if="!auth.loggedIn">
        <v-btn disable align> Logo Diverta Inc. </v-btn>
      </div>
      <br />-->
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
            {{ this.$store.getters["snackbar/message"] }}

            <template v-slot:action="{ attrs }">
                <v-btn text v-bind="attrs" @click="snackbarVisible = false">
                    Close
                </v-btn>
            </template>
        </v-snackbar>
    </v-app>
</template>

<script>
import '../sass/style.scss';
export default {
    created() {
        const myBody = document.getElementsByTagName('body')[0];
        if (this.$auth.loggedIn) {
            myBody.classList.add('p-dashboard');
            myBody.classList.remove('p-login');
        } else {
            myBody.classList.remove('p-dashboard');
            myBody.classList.add('p-login');
        }
    },
    data() {
        return {
            lang: ['English', 'Japanese', 'Mandarin'],
            langDefault: 'English',
            clipped: false,
            drawer: false,
            fixed: false,
            items: [
                {
                    icon: 'mdi-home',
                    title: 'Home',
                    title_loggedIn: 'Home',
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
        user() {
            return this.$auth.user;
        },
        auth() {
            return this.$store.$auth;
        },
        signUpPage() {
            return this.$route.name === 'signup';
        },
        subtitle() {
            if (this.$store.$auth.loggedIn) {
                return 'Hi, ' + this.$auth.user.name1;
            } else {
                return '';
            }
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
        go_page(path) {
            this.$router.push(path);
        },
        updateDesign() {
            console.log('You logout!');
            const myBody = document.getElementsByTagName('body')[0];
            myBody.classList.remove('p-dashboard');
            myBody.classList.add('p-login');
        },
        async logout() {
            await this.$auth.logout().then((response) => {
                this.updateDesign();
                this.$store.dispatch('snackbar/setMessage', 'Logged Out.');
                this.$store.dispatch('snackbar/snackOn');
                this.$router.push('/');
            });
        }
    }
};
</script>
