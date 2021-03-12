<template>
  <div class="container">
    <client-only>
      <div v-if="!auth.loggedIn">
        <form class="login-page" @submit.prevent="login">
          <div class="login-screen lgn-left">
            <h3 class="subtitle mb-3">
              会員ログイン
            </h3>
            <div class="inner">
              <form @submit.prevent="login">
                <p class="pm">
                  <strong>メールアドレスとパスワードを<br
                    class="spbr"
                  />入力してください。</strong>
                </p>
                <p>
                  <v-text-field
                    v-model="form.email"
                    label="メールアドレス"
                    type="email"
                    outlined
                  />
                </p>
                <p>
                  <v-text-field
                    v-model="form.password"
                    label="パスワード"
                    :type="show_pwd1 ? 'text' : 'password'"
                    :append-icon="show_pwd1 ? 'mdi-eye' : 'mdi-eye-off'"
                    outlined
                    @click:append="show_pwd1 = !show_pwd1"
                  />
                </p>
                <v-btn
                  type="submit"
                  block
                  x-large
                  color="success"
                  dark
                  :loading="loading"
                >
                  ログインする
                </v-btn>
              </form>
              <p>
                <NuxtLink to="/reminder">
                  パスワードを忘れた方はこちらから
                </NuxtLink>
              </p>
            </div>
          </div>
          <div class="login-screen lgn-right">
            <h3 class="subtitle mb-3">
              新規入会はこちら
            </h3>
            <div class="inner">
              <p class="body-1 new-btn">
                <NuxtLink to="/form">
                  会員新規入会登録
                </NuxtLink>
              </p>
            </div>
          </div>
        </form>
      </div>

      <div v-else class="mypage">
        <v-row>
          <v-col cols="12" sm="3">
            <v-card class="mx-auto" outlined>
              <v-card-text>
                <div class="pro-inner">
                  <p>
                    <strong>名前</strong><span>{{ user.name1 }} {{ user.name2 }}</span>
                  </p>
                </div>
              </v-card-text>
              <v-card-actions>
                <v-btn text color="deep-purple accent-4" to="/profile_edit">
                  プロフィール変更はこちら
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6">
            <v-card class="mx-auto" outlined>
              <v-card-text>
                <h3>お知らせ</h3>

                <v-simple-table :fixed-header="false">
                  <template v-slot:default>
                    <tbody>
                      <router-link
                        v-for="item in topics_list1"
                        :key="item.topics_id"
                        :to="'/info/' + item.topics_id"
                        tag="tr"
                      >
                        <td class="date">
                          {{ item.ymd }}
                        </td>
                        <td>{{ item.subject }}</td>
                        <td class="arw">
                          <v-btn icon :to="'/info/' + item.topics_id" nuxt>
                            <v-icon>mdi-chevron-right</v-icon>
                          </v-btn>
                        </td>
                      </router-link>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="3" />
        </v-row>
      </div>
    </client-only>
  </div>
</template>

<script>
export default {
  middleware: "auth",
  auth: false,
  data: () => ({
    topics_list1: [],
    loading: false,
    show_pwd1: false,
    show_pwd2: false,
    form: {
      email: "",
      password: "",
    },
  }),
  computed: {
    user() {
      return this.$auth.user
    },
    auth() {
      return this.$store.$auth
    },
    can_upgrade() {
      if (this.$auth.loggedIn) {
        self.can_upgrade = true
        const group_ids = JSON.parse(JSON.stringify(this.$auth.user.group_ids))
        Object.keys(group_ids).forEach(function (key) {
          if (["100"].indexOf(key) !== -1) {
            self.can_upgrade = false
          }
        })
        return self.can_upgrade
      }
      return false
    },
  },
  mounted() {
    this.getInfo()
  },
  methods: {
    getInfo() {
      if (this.$auth.loggedIn) {
        let self = this

        this.$auth.ctx.$axios
          .get("/rcms-api/1/infos")
          .then(function (response) {
            self.topics_list1 = response.data.list
          })
      }
    },
    async login() {
      this.loading = true
      await this.$auth
        .loginWith("local", { data: this.form })
        .then(() => {
          const group_ids = JSON.parse(
            JSON.stringify(this.$auth.user.group_ids)
          )
          let upgraded_flg = false
          Object.keys(group_ids).forEach(function (key) {
            if (key == 110) {
              upgraded_flg = true
            }
          })
          if (!upgraded_flg) {
            this.$router.push("/upgrade")
          } else {
            this.getInfo()
            this.$router.push("/")
          }
          this.$store.dispatch("snackbar/setMessage", "ログインしました")
          this.$store.dispatch("snackbar/snackOn")
          this.loading = false
        })
        .catch(() => {
          this.$store.dispatch("snackbar/setError", "ログインに失敗しました")
          this.$store.dispatch("snackbar/snackOn")
          this.loading = false
        })
    },
  },
}
</script>
