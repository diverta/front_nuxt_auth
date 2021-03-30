<template>
  <div class="container">
    <client-only>
      <div v-if="!auth.loggedIn">
        <form class="login-page" @submit.prevent="login">
          <div class="login-screen lgn-left">
            <h2 align="center">Login</h2>
            <br />
            <div class="inner">
              <form @submit.prevent="login">
                <p>
                  <v-text-field
                    v-model="form.email"
                    label="Login ID or Email address"
                    type="email"
                    outlined
                  />
                </p>
                <p>
                  <v-text-field
                    v-model="form.password"
                    label="Password"
                    :type="show_pwd1 ? 'text' : 'password'"
                    :append-icon="show_pwd1 ? 'mdi-eye' : 'mdi-eye-off'"
                    outlined
                    @click:append="show_pwd1 = !show_pwd1"
                  />
                </p>
                <p>
                  If you can not remember your password click
                  <NuxtLink to="/reminder"> here </NuxtLink>
                </p>
                <v-btn
                  type="submit"
                  block
                  x-large
                  color="success"
                  dark
                  :loading="loading"
                >
                  Login
                </v-btn>
              </form>
            </div>
          </div>
        </form>
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

        <br />
        <h1 class="text-center">Topics</h1>
        <br />
        <v-topics :topics="topics"></v-topics>
        <br />
        <v-col class="text-right">
          <v-btn
            type="submit"
            block
            x-large
            color="success"
            class="white--text"
            @click="back()"
          >
            View more
          </v-btn>
        </v-col>
      </div>
    </client-only>
  </div>
</template>

<script>
import topicList from "../components/topics";
import Vue from "vue";

export default {
  components: {
    "v-topics": topicList,
  },
  middleware: "auth",
  auth: false,
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
    group_id: 13,
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
    if (this.$auth.loggedIn) {
      this.updateTopics();
    }
  },
  methods: {
    back() {
      this.$router.push("/topics_list");
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
    async login() {
      this.loading = true;
      await this.$auth
        .loginWith("local", { data: this.form })
        .then(() => {
          this.updateTopics();
          this.$router.push("/");
          this.$store.dispatch("snackbar/setMessage", "ログインしました");
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
