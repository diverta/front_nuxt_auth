<template>
  <v-app light>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      color="#333"
      dark
      fixed
      app
      right
    >
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
    <v-app-bar :clipped-left="clipped" dense dark fixed app>
      <v-toolbar-title>
        <a href="/">
          Sample
        </a>
      </v-toolbar-title>
      <v-spacer />
      <v-toolbar-title height="30" to="/" v-text="subtitle" />
      <v-btn v-if="!auth.loggedIn" icon to="/" nuxt>
        <v-icon>mdi-account</v-icon>
      </v-btn>

      <v-btn v-if="auth.loggedIn" icon @click="logout">
        <v-icon>mdi-exit-to-app</v-icon>
      </v-btn>
      <v-btn icon to="/faq" nuxt>
        <v-icon>mdi-help</v-icon>
      </v-btn>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>

    <v-footer padless app absolute inset>
      <v-row justify="center" no-gutters>
        <v-btn text rounded class="my-2" to="/inquiry">
          お問い合わせ
        </v-btn>
        <v-col class="#1414A0 text-center white--text" cols="12">
        </v-col>
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
          閉じる
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: "mdi-home",
          title: "HOME",
          title_loggedIn: "マイページ",
          to: "/",
        },
        {
          icon: "mdi-send",
          title: "お問い合わせ",
          to: "/inquiry",
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
    }
  },
  computed: {
    user() {
      return this.$auth.user
    },
    auth() {
      return this.$store.$auth
    },
    subtitle() {
      if (this.$store.$auth.loggedIn) {
        return this.$auth.user.name1 + "さん、こんにちは"
      } else {
        return ""
      }
    },
    // snackbarが自動でfalseに設定するためセッタを用意して、明示的にdispatchからOffするようにする
    snackbarVisible: {
      get() {
        return this.$store.state.snackbar.isEnable
      },
      set() {
        return this.$store.dispatch("snackbar/snackOff")
      },
    },
    snackbarColor() {
      return this.$store.state.snackbar.color
    },
  },
  methods: {
    async logout() {
      await this.$auth.logout().then((response) => {
        this.$store.dispatch("snackbar/setMessage", "ログアウトしました")
        this.$store.dispatch("snackbar/snackOn")
        this.$router.push("/")
      })
    },
  },
}
</script>
