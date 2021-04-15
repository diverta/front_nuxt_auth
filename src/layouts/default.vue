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
          <img src="../assets/images/logo.png" class="c-navi_side-logo">
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

    <v-app-bar :clipped-left="clipped" color="#1414A0" dense dark fixed app>
      <v-app-bar-nav-icon v-if="auth.loggedIn" @click.stop="drawer = !drawer" />
      <v-spacer />

      <v-toolbar-title height="30" to="/" v-text="subtitle" class="l-header_user"/>

      <v-btn v-if="auth.loggedIn" icon @click="logout" class="l-header_logout">
        <v-icon>mdi-exit-to-app</v-icon>
      </v-btn>

      <!--
      <div v-if="!auth.loggedIn">
        <NuxtLink to="/signup"> Sign Up </NuxtLink>
      </div>
      -->
      <div v-if="!auth.loggedIn">
          New to Muzica? <button class="c-btn c-btn_sm c-btn_dark ml-2" @click="go_page('/signup/')" nuxt>Sign Up</button>
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

    <v-footer color="#1414A0" padless app absolute inset>
      <v-row justify="center" no-gutters>
        <small class="my-4 l-footer_copyright"> Copyright © 2021 Kuroco All rights reserved. </small>
        <img src="../assets/images/logo-kuroco.svg" width="120" class="pl-4 ">
        <v-col class="#1414A0 text-center white--text" cols="12"> </v-col>
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
    let myBody = document.getElementsByTagName('body')[0];
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
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: "mdi-home",
          title: "Home",
          title_loggedIn: "Home",
          to: "/",
        },
        {
          icon: "mdi-newspaper-variant",
          title: "Articles",
          to: "/topics_list",
        },
        {
          icon: "mdi-account-tie",
          title: "Member",
          to: "/member",
        },
        {
          icon: "mdi-account-box",
          title: "My page",
          to: "/mypage",
        },
        {
          icon: "mdi-send",
          title: "Feedback",
          to: "/inquiry",
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
    };
  },
  computed: {
    user() {
      return this.$auth.user;
    },
    auth() {
      return this.$store.$auth;
    },
    subtitle() {
      if (this.$store.$auth.loggedIn) {
        return this.$auth.user.name1 + "さん、こんにちは";
      } else {
        return "";
      }
    },
    // snackbarが自動でfalseに設定するためセッタを用意して、明示的にdispatchからOffするようにする
    snackbarVisible: {
      get() {
        return this.$store.state.snackbar.isEnable;
      },
      set() {
        return this.$store.dispatch("snackbar/snackOff");
      },
    },
    snackbarColor() {
      return this.$store.state.snackbar.color;
    },
  },
  methods: {
    go_page(path) {
      this.$router.push(path);
    },
    updateDesign() {
      console.log("You logout!");
      let myBody = document.getElementsByTagName('body')[0];
      myBody.classList.remove('p-dashboard');
      myBody.classList.add('p-login');
    },
    async logout() {
      await this.$auth.logout().then((response) => {
        this.updateDesign();
        this.$store.dispatch("snackbar/setMessage", "Logged Out.");
        this.$store.dispatch("snackbar/snackOn");
        this.$router.push("/");
      });
    },
  },
};
</script>
