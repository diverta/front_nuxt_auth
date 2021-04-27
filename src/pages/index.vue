<template>
    <client-only>
      <div v-if="!auth.loggedIn" class="p-login_content elevation-7">
        <v-row>
          <v-col class="pa-0 col-sm-6 col-12">
            <div class="p-login_intro">
              <img src="../assets/images/logo.png" class="p-login_logo">
              <div class="p-login_intro-text">
                <h1 class="heading">Welcome Back to<br> Muzica!</h1>
                <p>Sign in to continue your portal</p>
              </div>
            </div>
          </v-col>
          <v-col class="pa-0 col-sm-6 col-12">
            <v-card class="p-login_form" outlined>
            <form @submit.prevent="login">
              <div class="login-screen lgn-left">
                <v-card-title>
                  <h2 align="center" class="pb-4 c-text_blue">Sign In</h2>
                </v-card-title>
                <v-card-text class="inner">
                  <form @submit.prevent="login">
                    <v-text-field
                      v-model="form.email"
                      label="Login ID or Email address"
                      type="email"
                      outlined
                    />
                    <v-text-field
                      v-model="form.password"
                      label="Password"
                      :type="show_pwd1 ? 'text' : 'password'"
                      :append-icon="show_pwd1 ? 'mdi-eye' : 'mdi-eye-off'"
                      outlined
                      @click:append="show_pwd1 = !show_pwd1"
                    />
                    <p>
                      <NuxtLink to="/reminder">Forgot Password?</NuxtLink>
                    </p>
                    <div class="text-center">
                    <button
                      type="submit"
                      block
                      x-large
                      :loading="loading"
                      class="c-btn_dark c-btn submit-btn"
                    >
                      Sign In
                    </button>
                    </div>
                  </form>
                </v-card-text>
              </div>
            </form>
            </v-card>
          </v-col>
        </v-row>
      </div>

      <div v-else class="mypage">
        <v-carousel>
          <v-carousel-item
            v-for="(item, i) in items"
            :key="i"
            :src="item.src"
            reverse-transition="fade-transition"
            transition="fade-transition"
          ></v-carousel-item>
        </v-carousel>

        <h1 class="text-left mt-5 pt-4">Latest articles</h1>
        <v-topics :topics="topics"></v-topics>
        <div class="text-center py-5">
          <a
            type="submit"
            block
            x-large
            color="success"
            class="c-btn c-btn_main c-btn_md c-btn_icon"
            @click="back()"
          >
            More articles 
            <v-icon
              dark
              right
              class="icon"
            >
              mdi-arrow-right-drop-circle
            </v-icon>

          </a>
        </div>

        <h1 class="text-left mt-5 pt-4">Favourite list</h1>
        <v-favourite :topics="favourite"></v-favourite>
        <div class="text-center py-5">
          <a
            type="submit"
            block
            x-large
            color="success"
            class="c-btn c-btn_main c-btn_md c-btn_icon"
            @click="linkFav()"
          >
            More favourite 
            <v-icon
              dark
              right
              class="icon"
            >
              mdi-arrow-right-drop-circle
            </v-icon>

          </a>
        </div>

      </div>
    </client-only>
</template>

<script>
import topicList from "../components/topics";

export default {
  components: {
    "v-topics": topicList,
    "v-favourite": topicList,
  },
  middleware: "auth",
  auth: false,
  created() {
    let myBody = document.getElementsByTagName('body')[0];
    if (this.$auth.loggedIn) {
      myBody.classList.add('p-dashboard');
      myBody.classList.remove('p-login');
    } else {
      myBody.classList.remove('p-dashboard');
      myBody.classList.add('p-login');
    }
    if (this.$route.name === 'index') {
      myBody.classList.add('p-home');
    }
  },
  data: () => ({
    loading: false,
    show_pwd1: false,
    show_pwd2: false,
    form: {
      email: "",
      password: "",
    },
    items: [],
    topics: [],
    favourite: [],
    group_id: 13,
    maxFavPerPage: 10,
  }),
  computed: {
    user() {
      return this.$auth.user;
    },
    auth() {
      return this.$store.$auth;
    },
  },
  mounted() {
    this.topics = [];
    this.favourite = [];
    if (this.$auth.loggedIn) {
      this.updateTopics();
      this.updateFavourite();
    }
  },
  methods: {
    back() {
      this.$router.push("/topics_list");
    },
    linkFav() {
      this.$router.push("/favourite");
    },
    updateDesign() {
      //console.log("You login!");
      let myBody = document.getElementsByTagName('body')[0];
      myBody.classList.add('p-dashboard');
      myBody.classList.remove('p-login');
    },
    updateTopics() {
      var url =
        "/rcms-api/1/topics?topics_group_id=" + this.group_id + "&cnt=5";
      let self = this;
      this.$store.$auth.ctx.$axios
        .get(url)
        .then(function (response) {
          var topics = [];
          self.items = [];
          for (var key in response.data.list) {
            var item = response.data.list[key];
            var fileurl = "";
            var linkurl = "";
            if (
              item.hasOwnProperty("ext_col_02") &&
              item["ext_col_02"].hasOwnProperty("url")
            ) {
              fileurl = item["ext_col_02"]["url"];
            }
            if (
              item.hasOwnProperty("ext_col_03") &&
              item["ext_col_03"].hasOwnProperty("url")
            ) {
              linkurl = item["ext_col_03"]["url"];
            }
            if (
              item.hasOwnProperty("ext_col_08") &&
              item["ext_col_08"].hasOwnProperty("url")
            ) {
              self.items.push({ src: item["ext_col_08"]["url"] });
            }
            topics.push({
              date: item["inst_ymdhi"].substring(0, 10).replaceAll("-", "/"),
              label: item["contents_type_nm"],
              link: item["subject"],
              icon: "",
              id: item["topics_id"],
              icon: item["ext_col_01"]["key"],
              fileurl: fileurl,
              linkurl: linkurl,
              edit: false,
            });
          }
          self.topics = topics;
        })
        .catch(function (error) {
          self.$store.dispatch("snackbar/setError", error.response.data.errors?.[0].message);
          self.$store.dispatch("snackbar/snackOn");
        });
    },
    updateFavourite() {
      /*
      var url =
        "/rcms-api/1/topics?topics_group_id=" + this.group_id + "&cnt=5";
      let self = this;
      this.$store.$auth.ctx.$axios
        .get(url)
        .then(function (response) {
          var topics = [];
          self.items = [];
          for (var key in response.data.list) {
            var item = response.data.list[key];
            var fileurl = "";
            var linkurl = "";
            if (
              item.hasOwnProperty("ext_col_02") &&
              item["ext_col_02"].hasOwnProperty("url")
            ) {
              fileurl = item["ext_col_02"]["url"];
            }
            if (
              item.hasOwnProperty("ext_col_03") &&
              item["ext_col_03"].hasOwnProperty("url")
            ) {
              linkurl = item["ext_col_03"]["url"];
            }
            if (
              item.hasOwnProperty("ext_col_08") &&
              item["ext_col_08"].hasOwnProperty("url")
            ) {
              self.items.push({ src: item["ext_col_08"]["url"] });
            }
            topics.push({
              date: item["inst_ymdhi"].substring(0, 10).replaceAll("-", "/"),
              label: item["contents_type_nm"],
              link: item["subject"],
              icon: "",
              id: item["topics_id"],
              icon: item["ext_col_01"]["key"],
              fileurl: fileurl,
              linkurl: linkurl,
              edit: false,
            });
          }
          self.favourite = topics;
        })
        .catch(function (error) {
          self.$store.dispatch("snackbar/setError", error.response.data.errors?.[0].message);
          self.$store.dispatch("snackbar/snackOn");
        });
        */
        let self = this;
        var favoritesUrl =
          "/rcms-api/1/favorites?member_id=" +
          this.$auth.user.member_id +
          "&module_type=topics";
        this.$store.$auth.ctx.$axios
        .get(favoritesUrl)
        .then(function (response) {
          var topic_ids = [];
          for (var key in response.data.list) {
            var item = response.data.list[key];
            if (item.hasOwnProperty("module_id")) {
              topic_ids.push(item["module_id"]);
            }
          }
          var url =
            "/rcms-api/1/topics?topics_group_id=" +
            self.group_id +
            "&pageID=" +
            self.page +
            "&cnt=" +
            self.maxFavPerPage;

          if (topic_ids.length > 0) {
            for (var i = 0; i < topic_ids.length; ++i) {
              url += "&id[]=" + topic_ids[i];
            }

            self.$store.$auth.ctx.$axios
              .get(url)
              .then(function (response) {
                var topics = [];
                self.totalCnt = response.data.pageInfo.totalCnt;
                for (var key in response.data.list) {
                  var item = response.data.list[key];
                  topics.push({
                    date: item["inst_ymdhi"]
                      .substring(0, 10)
                      .replaceAll("-", "/"),
                    label: item["contents_type_nm"],
                    link: item["subject"],
                    icon: "",
                    id: item["topics_id"],
                    edit: false,
                  });
                }
                self.favourite = topics;
              })
              .catch(function (error) {
                self.$store.dispatch("snackbar/setError", error.response.data.errors?.[0].message);
                self.$store.dispatch("snackbar/snackOn");
              });
          }
        })
        .catch(function (error) {
          self.$store.dispatch("snackbar/setError", error.response.data.errors?.[0].message);
          self.$store.dispatch("snackbar/snackOn");
        });
    },
    async login() {
      this.loading = true;
      await this.$auth
        .loginWith("local", { data: this.form })
        .then(() => {
          this.updateTopics();
          this.updateDesign();
          this.$router.push("/");
          this.$store.dispatch("snackbar/setMessage", "Logged in");
          this.$store.dispatch("snackbar/snackOn");
          this.loading = false;
        })
        .catch(() => {
          this.$store.dispatch("snackbar/setError", "ログインに失敗しました");
          this.$store.dispatch("snackbar/snackOn");
          this.loading = false;
        });
    },
  },
};
</script>
