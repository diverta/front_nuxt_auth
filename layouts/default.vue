<template>
    <ClientOnly>
        <v-app class="l-content_wrap" :class="{ 'p-dashboard': isLoggedIn, 'p-login': !isLoggedIn }">
            <v-navigation-drawer v-if="authUser.member_id" id="c-navi_side" v-model="drawer" left fixed dark temporary>
                <div class="text-center py-4">
                    <a href="/">
                        <img src="~/assets/images/logo.png?width=150" class="c-navi_side-logo" />
                    </a>
                </div>
                <v-list>
                    <v-list-item v-for="(item, i) in items" :key="i" :to="item.to" router exact class="l-mainmenu_item">
                        <v-list-item-action>
                            <v-icon>{{ item.icon }}</v-icon>
                        </v-list-item-action>

                        <v-list-item-title v-text="authUser.member_id && item.titleLoggedIn ? item.titleLoggedIn : item.title" />
                    </v-list-item>
                </v-list>
            </v-navigation-drawer>

            <v-app-bar :clipped-left="clipped" color="#1414A0" dense dark app class="l-header_toolbar">
                <v-app-bar-nav-icon v-if="authUser.member_id" @click.stop="drawer = !drawer" />
                <v-spacer />

                <v-toolbar-title height="30" class="l-header_user" v-text="subtitle" />

                <div class="l-header_lang">
                    <v-select v-model="$i18n.locale" :items="langOptions" item-title="text" item-value="value" />
                </div>

                <template v-if="authUser.member_id">
                    <v-btn
                        icon
                        class="l-header_logout"
                        @click="
                            () => {
                                logout();
                                useRouter().push('/');
                            }
                        "
                    >
                        <v-icon>mdi-exit-to-app</v-icon>
                    </v-btn>
                </template>
                <template v-else>
                    <!-- <div v-if="$route.name === 'signup'" class="white--text">
            <span>Already have an account?</span>
            <button
              class="c-btn c-btn_sm c-btn_dark ml-2"
              nuxt
              @click="() => $router.push(localePath('/'))"
            >
              {{ $t("common.sign_in") }}
            </button>
          </div> -->
                    <div class="white--text">
                        <span class="d-none d-sm-inline">New to Muzica?</span>
                        <button
                            class="c-btn c-btn_sm c-btn_dark ml-2"
                            nuxt
                            @click="
                                () => {
                                    useRouter().push('/signup/');
                                }
                            "
                        >
                            Sign Up
                        </button>
                    </div>
                </template>
            </v-app-bar>

            <v-main>
                <v-container class="l-content_inner" fluid>
                    <slot />
                </v-container>
            </v-main>

            <v-footer color="#1414A0" padless>
                <v-row justify="center" no-gutters class="pt-3">
                    <a href="https://github.com/diverta/front_nuxt_auth"><small class="my-4 pt-3 l-footer_copyright">Github repository</small></a>
                    <a href="https://kuroco.app/"><img src="~/assets/images/logo-kuroco.svg" width="120" class="pl-4 l-footer_logo" /></a>
                    <v-col class="#1414A0 text-center white--text" cols="12" />
                </v-row>
            </v-footer>
        </v-app>
    </ClientOnly>
</template>

<script setup>
const { authUser, isLoggedIn, logout } = useAuth();

const drawer = ref(false);
const clipped = ref(false);
const subtitle = computed(() => {
    if (authUser.value.member_id) {
        return 'Hi, ' + authUser.value.name1;
        // return i18n.t("common.hi") + ", " + authUser.value.name1;
    }
    return '';
});
const langOptions = [
    { text: 'English', value: 'en' },
    { text: '日本語', value: 'ja' }
];
const items = [
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
];
</script>
